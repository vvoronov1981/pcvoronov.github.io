unit TradingStrategy;

{$mode objfpc}{$H+}

interface

uses
  SysUtils, Classes, Types, fpjson, DateUtils;

type
  TTradingStrategy = class
  private
    FAnalysisPeriodHours: Integer;
    FStopLossPercent: Double;
    
    function CalculateMinPrice(ABars: TJSONArray): Double;
    function CalculateMaxPrice(ABars: TJSONArray): Double;
    function CalculateAvgPrice(ABars: TJSONArray): Double;
  public
    constructor Create(AAnalysisPeriodHours: Integer; AStopLossPercent: Double);
    
    function AnalyzePrices(const ASymbol: string; ABars: TJSONArray; ACurrentPrice: Double): TPriceAnalysis;
    function GenerateSignal(const AAnalysis: TPriceAnalysis; AHasPosition: Boolean): TTradeSignal;
    function CalculateStopLoss(AMinPrice, AMaxPrice: Double): Double;
    function ShouldTakeProfit(ACurrentPrice, ATakeProfitPrice: Double): Boolean;
    function ShouldStopLoss(ACurrentPrice, AStopLossPrice: Double): Boolean;
  end;

implementation

uses
  Logger;

{ TTradingStrategy }

constructor TTradingStrategy.Create(AAnalysisPeriodHours: Integer; AStopLossPercent: Double);
begin
  inherited Create;
  FAnalysisPeriodHours := AAnalysisPeriodHours;
  FStopLossPercent := AStopLossPercent;
end;

function TTradingStrategy.CalculateMinPrice(ABars: TJSONArray): Double;
var
  I: Integer;
  Bar: TJSONObject;
  Low: Double;
begin
  Result := MaxDouble;
  
  if not Assigned(ABars) or (ABars.Count = 0) then
    Exit;
    
  for I := 0 to ABars.Count - 1 do
  begin
    Bar := ABars.Objects[I];
    if Assigned(Bar) then
    begin
      Low := Bar.Get('l', MaxDouble);
      if Low < Result then
        Result := Low;
    end;
  end;
end;

function TTradingStrategy.CalculateMaxPrice(ABars: TJSONArray): Double;
var
  I: Integer;
  Bar: TJSONObject;
  High: Double;
begin
  Result := 0.0;
  
  if not Assigned(ABars) or (ABars.Count = 0) then
    Exit;
    
  for I := 0 to ABars.Count - 1 do
  begin
    Bar := ABars.Objects[I];
    if Assigned(Bar) then
    begin
      High := Bar.Get('h', 0.0);
      if High > Result then
        Result := High;
    end;
  end;
end;

function TTradingStrategy.CalculateAvgPrice(ABars: TJSONArray): Double;
var
  I: Integer;
  Bar: TJSONObject;
  Sum: Double;
  Count: Integer;
begin
  Result := 0.0;
  Sum := 0.0;
  Count := 0;
  
  if not Assigned(ABars) or (ABars.Count = 0) then
    Exit;
    
  for I := 0 to ABars.Count - 1 do
  begin
    Bar := ABars.Objects[I];
    if Assigned(Bar) then
    begin
      Sum := Sum + Bar.Get('c', 0.0);
      Inc(Count);
    end;
  end;
  
  if Count > 0 then
    Result := Sum / Count;
end;

function TTradingStrategy.AnalyzePrices(const ASymbol: string; ABars: TJSONArray; ACurrentPrice: Double): TPriceAnalysis;
begin
  FillChar(Result, SizeOf(Result), 0);
  Result.Symbol := ASymbol;
  Result.CurrentPrice := ACurrentPrice;
  
  if not Assigned(ABars) or (ABars.Count = 0) then
  begin
    if Assigned(GlobalLogger) then
      GlobalLogger.Warning(Format('No historical data for %s', [ASymbol]));
    Exit;
  end;
  
  Result.MinPrice := CalculateMinPrice(ABars);
  Result.MaxPrice := CalculateMaxPrice(ABars);
  Result.AvgPrice := CalculateAvgPrice(ABars);
  Result.StopLossPrice := CalculateStopLoss(Result.MinPrice, Result.MaxPrice);
  Result.TakeProfitPrice := Result.AvgPrice;
  
  if Assigned(GlobalLogger) then
    GlobalLogger.Debug(Format('%s Analysis - Min: %.2f, Max: %.2f, Avg: %.2f, Current: %.2f, SL: %.2f', [
      ASymbol, Result.MinPrice, Result.MaxPrice, Result.AvgPrice, ACurrentPrice, Result.StopLossPrice
    ]));
end;

function TTradingStrategy.GenerateSignal(const AAnalysis: TPriceAnalysis; AHasPosition: Boolean): TTradeSignal;
begin
  Result := tsNone;
  
  // Если уже есть открытая позиция, проверяем условия продажи
  if AHasPosition then
  begin
    // Take Profit: продаем когда цена >= средней
    if ShouldTakeProfit(AAnalysis.CurrentPrice, AAnalysis.TakeProfitPrice) then
    begin
      Result := tsSell;
      if Assigned(GlobalLogger) then
        GlobalLogger.Info(Format('Take Profit signal for %s at %.2f (target: %.2f)', [
          AAnalysis.Symbol, AAnalysis.CurrentPrice, AAnalysis.TakeProfitPrice
        ]));
    end
    // Stop Loss: продаем если цена упала ниже stop loss
    else if ShouldStopLoss(AAnalysis.CurrentPrice, AAnalysis.StopLossPrice) then
    begin
      Result := tsSell;
      if Assigned(GlobalLogger) then
        GlobalLogger.Warning(Format('Stop Loss triggered for %s at %.2f (limit: %.2f)', [
          AAnalysis.Symbol, AAnalysis.CurrentPrice, AAnalysis.StopLossPrice
        ]));
    end;
  end
  else
  begin
    // Покупаем когда текущая цена < минимума за 30 часов
    if AAnalysis.CurrentPrice < AAnalysis.MinPrice then
    begin
      Result := tsBuy;
      if Assigned(GlobalLogger) then
        GlobalLogger.Info(Format('Buy signal for %s at %.2f (min was: %.2f)', [
          AAnalysis.Symbol, AAnalysis.CurrentPrice, AAnalysis.MinPrice
        ]));
    end;
  end;
end;

function TTradingStrategy.CalculateStopLoss(AMinPrice, AMaxPrice: Double): Double;
var
  Range: Double;
begin
  Range := AMaxPrice - AMinPrice;
  Result := AMinPrice - (FStopLossPercent / 100.0) * Range;
  
  // Защита от отрицательных значений
  if Result < 0 then
    Result := AMinPrice * 0.3; // 30% от минимума как абсолютный минимум
end;

function TTradingStrategy.ShouldTakeProfit(ACurrentPrice, ATakeProfitPrice: Double): Boolean;
begin
  Result := ACurrentPrice >= ATakeProfitPrice;
end;

function TTradingStrategy.ShouldStopLoss(ACurrentPrice, AStopLossPrice: Double): Boolean;
begin
  Result := ACurrentPrice <= AStopLossPrice;
end;

end.
