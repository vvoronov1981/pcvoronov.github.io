unit OrderManager;

{$mode objfpc}{$H+}

interface

uses
  SysUtils, Classes, Types, AlpacaAPIClient, TradingStrategy, SyncObjs, fpjson;

type
  TOrderManager = class
  private
    FAPIClient: TAlpacaAPIClient;
    FStrategy: TTradingStrategy;
    FPositions: TThreadList;
    FLeverage: Double;
    
    function FindPosition(const ASymbol: string): TPosition;
    procedure AddPosition(const APosition: TPosition);
    procedure RemovePosition(const ASymbol: string);
    procedure UpdatePosition(const APosition: TPosition);
  public
    constructor Create(AAPIClient: TAlpacaAPIClient; AStrategy: TTradingStrategy; ALeverage: Double);
    destructor Destroy; override;
    
    function ExecuteBuy(const ASymbol: string; AAnalysis: TPriceAnalysis): Boolean;
    function ExecuteSell(const ASymbol: string; AAnalysis: TPriceAnalysis): Boolean;
    function HasPosition(const ASymbol: string): Boolean;
    function GetPosition(const ASymbol: string): TPosition;
    procedure SyncPositionsWithAPI;
    procedure MonitorPositions;
    function GetAllPositions: TList;
  end;

implementation

uses
  Logger;

{ TOrderManager }

constructor TOrderManager.Create(AAPIClient: TAlpacaAPIClient; AStrategy: TTradingStrategy; ALeverage: Double);
begin
  inherited Create;
  FAPIClient := AAPIClient;
  FStrategy := AStrategy;
  FLeverage := ALeverage;
  FPositions := TThreadList.Create;
end;

destructor TOrderManager.Destroy;
var
  List: TList;
  I: Integer;
  Position: ^TPosition;
begin
  List := FPositions.LockList;
  try
    for I := 0 to List.Count - 1 do
    begin
      Position := List[I];
      Dispose(Position);
    end;
    List.Clear;
  finally
    FPositions.UnlockList;
  end;
  
  FreeAndNil(FPositions);
  inherited;
end;

function TOrderManager.FindPosition(const ASymbol: string): TPosition;
var
  List: TList;
  I: Integer;
  Position: ^TPosition;
begin
  FillChar(Result, SizeOf(Result), 0);
  
  List := FPositions.LockList;
  try
    for I := 0 to List.Count - 1 do
    begin
      Position := List[I];
      if Position^.Symbol = ASymbol then
      begin
        Result := Position^;
        Exit;
      end;
    end;
  finally
    FPositions.UnlockList;
  end;
end;

procedure TOrderManager.AddPosition(const APosition: TPosition);
var
  List: TList;
  Position: ^TPosition;
begin
  List := FPositions.LockList;
  try
    New(Position);
    Position^ := APosition;
    List.Add(Position);
  finally
    FPositions.UnlockList;
  end;
end;

procedure TOrderManager.RemovePosition(const ASymbol: string);
var
  List: TList;
  I: Integer;
  Position: ^TPosition;
begin
  List := FPositions.LockList;
  try
    for I := List.Count - 1 downto 0 do
    begin
      Position := List[I];
      if Position^.Symbol = ASymbol then
      begin
        Dispose(Position);
        List.Delete(I);
        Break;
      end;
    end;
  finally
    FPositions.UnlockList;
  end;
end;

procedure TOrderManager.UpdatePosition(const APosition: TPosition);
var
  List: TList;
  I: Integer;
  Position: ^TPosition;
begin
  List := FPositions.LockList;
  try
    for I := 0 to List.Count - 1 do
    begin
      Position := List[I];
      if Position^.Symbol = APosition.Symbol then
      begin
        Position^ := APosition;
        Exit;
      end;
    end;
  finally
    FPositions.UnlockList;
  end;
end;

function TOrderManager.ExecuteBuy(const ASymbol: string; AAnalysis: TPriceAnalysis): Boolean;
var
  Balance: TAccountBalance;
  Quantity: Double;
  Order: TOrder;
  Position: TPosition;
begin
  Result := False;
  
  try
    // Получаем баланс счета
    Balance := FAPIClient.GetAccountBalance;
    
    if Balance.BuyingPower <= 0 then
    begin
      if Assigned(GlobalLogger) then
        GlobalLogger.Warning(Format('Insufficient buying power for %s', [ASymbol]));
      Exit;
    end;
    
    // Рассчитываем количество акций с учетом кредитного плеча
    Quantity := (Balance.BuyingPower * FLeverage) / AAnalysis.CurrentPrice;
    
    if Quantity < 1 then
    begin
      if Assigned(GlobalLogger) then
        GlobalLogger.Warning(Format('Calculated quantity too small for %s: %.4f', [ASymbol, Quantity]));
      Exit;
    end;
    
    // Округляем до целого числа акций
    Quantity := Trunc(Quantity);
    
    if Assigned(GlobalLogger) then
      GlobalLogger.Info(Format('Placing buy order: %s x %.0f @ %.2f (Leverage: %.1fx)', [
        ASymbol, Quantity, AAnalysis.CurrentPrice, FLeverage
      ]));
    
    // Размещаем ордер на покупку
    Order := FAPIClient.PlaceBuyOrder(ASymbol, Quantity, FLeverage);
    
    if Order.OrderID <> '' then
    begin
      // Создаем позицию
      FillChar(Position, SizeOf(Position), 0);
      Position.Symbol := ASymbol;
      Position.Quantity := Quantity;
      Position.EntryPrice := AAnalysis.CurrentPrice;
      Position.CurrentPrice := AAnalysis.CurrentPrice;
      Position.StopLossPrice := AAnalysis.StopLossPrice;
      Position.TakeProfitPrice := AAnalysis.TakeProfitPrice;
      Position.Leverage := FLeverage;
      Position.OpenTime := Now;
      
      AddPosition(Position);
      
      if Assigned(GlobalLogger) then
        GlobalLogger.Info(Format('Buy order executed: %s - Order ID: %s', [ASymbol, Order.OrderID]));
      
      Result := True;
    end
    else
    begin
      if Assigned(GlobalLogger) then
        GlobalLogger.Error(Format('Failed to place buy order for %s', [ASymbol]));
    end;
  except
    on E: Exception do
      if Assigned(GlobalLogger) then
        GlobalLogger.Error(Format('Error executing buy order for %s: %s', [ASymbol, E.Message]));
  end;
end;

function TOrderManager.ExecuteSell(const ASymbol: string; AAnalysis: TPriceAnalysis): Boolean;
var
  Position: TPosition;
  Order: TOrder;
  ProfitLoss: Double;
begin
  Result := False;
  
  try
    Position := FindPosition(ASymbol);
    
    if Position.Symbol = '' then
    begin
      if Assigned(GlobalLogger) then
        GlobalLogger.Warning(Format('No position found for %s', [ASymbol]));
      Exit;
    end;
    
    if Assigned(GlobalLogger) then
      GlobalLogger.Info(Format('Placing sell order: %s x %.0f @ %.2f', [
        ASymbol, Position.Quantity, AAnalysis.CurrentPrice
      ]));
    
    // Размещаем ордер на продажу
    Order := FAPIClient.PlaceSellOrder(ASymbol, Position.Quantity);
    
    if Order.OrderID <> '' then
    begin
      // Рассчитываем прибыль/убыток
      ProfitLoss := (AAnalysis.CurrentPrice - Position.EntryPrice) * Position.Quantity;
      
      if Assigned(GlobalLogger) then
        GlobalLogger.Info(Format('Sell order executed: %s - P/L: %.2f - Order ID: %s', [
          ASymbol, ProfitLoss, Order.OrderID
        ]));
      
      RemovePosition(ASymbol);
      Result := True;
    end
    else
    begin
      if Assigned(GlobalLogger) then
        GlobalLogger.Error(Format('Failed to place sell order for %s', [ASymbol]));
    end;
  except
    on E: Exception do
      if Assigned(GlobalLogger) then
        GlobalLogger.Error(Format('Error executing sell order for %s: %s', [ASymbol, E.Message]));
  end;
end;

function TOrderManager.HasPosition(const ASymbol: string): Boolean;
var
  Position: TPosition;
begin
  Position := FindPosition(ASymbol);
  Result := Position.Symbol <> '';
end;

function TOrderManager.GetPosition(const ASymbol: string): TPosition;
begin
  Result := FindPosition(ASymbol);
end;

procedure TOrderManager.SyncPositionsWithAPI;
var
  Positions: TJSONArray;
  I: Integer;
  PosObj: TJSONObject;
  Position: TPosition;
begin
  try
    Positions := FAPIClient.GetPositions;
    if not Assigned(Positions) then
      Exit;
      
    try
      for I := 0 to Positions.Count - 1 do
      begin
        PosObj := Positions.Objects[I];
        if Assigned(PosObj) then
        begin
          FillChar(Position, SizeOf(Position), 0);
          Position.Symbol := PosObj.Get('symbol', '');
          Position.Quantity := StrToFloatDef(PosObj.Get('qty', '0'), 0.0);
          Position.EntryPrice := StrToFloatDef(PosObj.Get('avg_entry_price', '0'), 0.0);
          Position.CurrentPrice := StrToFloatDef(PosObj.Get('current_price', '0'), 0.0);
          
          if not HasPosition(Position.Symbol) then
            AddPosition(Position)
          else
            UpdatePosition(Position);
        end;
      end;
    finally
      Positions.Free;
    end;
  except
    on E: Exception do
      if Assigned(GlobalLogger) then
        GlobalLogger.Error('Error syncing positions: ' + E.Message);
  end;
end;

procedure TOrderManager.MonitorPositions;
var
  List: TList;
  I: Integer;
  Position: ^TPosition;
  CurrentPrice: Double;
  Signal: TTradeSignal;
  Analysis: TPriceAnalysis;
begin
  List := FPositions.LockList;
  try
    for I := 0 to List.Count - 1 do
    begin
      Position := List[I];
      
      try
        // Получаем текущую цену
        CurrentPrice := FAPIClient.GetCurrentPrice(Position^.Symbol);
        Position^.CurrentPrice := CurrentPrice;
        
        // Создаем анализ для проверки условий продажи
        FillChar(Analysis, SizeOf(Analysis), 0);
        Analysis.Symbol := Position^.Symbol;
        Analysis.CurrentPrice := CurrentPrice;
        Analysis.StopLossPrice := Position^.StopLossPrice;
        Analysis.TakeProfitPrice := Position^.TakeProfitPrice;
        
        // Проверяем условия продажи
        Signal := FStrategy.GenerateSignal(Analysis, True);
        
        if Signal = tsSell then
        begin
          ExecuteSell(Position^.Symbol, Analysis);
        end;
      except
        on E: Exception do
          if Assigned(GlobalLogger) then
            GlobalLogger.Error(Format('Error monitoring position %s: %s', [Position^.Symbol, E.Message]));
      end;
    end;
  finally
    FPositions.UnlockList;
  end;
end;

function TOrderManager.GetAllPositions: TList;
begin
  Result := FPositions.LockList;
end;

end.
