unit TickerManager;

{$mode objfpc}{$H+}

interface

uses
  SysUtils, Classes;

type
  { TTickerManager - Manages automatic ticker addition/removal }
  TTickerManager = class
  private
    FAvailableTickers: TStringList;
    FActiveTickers: TStringList;
    FMaxActiveTickers: Integer;
    FMinActiveTickers: Integer;
    
    procedure InitializeAvailableTickers;
  public
    constructor Create(AActiveTickers: TStringList; AMaxActive: Integer = 10; AMinActive: Integer = 3);
    destructor Destroy; override;
    
    { Randomly add a ticker from available pool }
    function AddRandomTicker: string;
    
    { Randomly remove a ticker from active list }
    function RemoveRandomTicker: string;
    
    { Perform random operation: add or remove ticker }
    procedure PerformRandomOperation;
    
    { Get count of available tickers }
    function GetAvailableCount: Integer;
    
    { Get count of active tickers }
    function GetActiveCount: Integer;
    
    property AvailableTickers: TStringList read FAvailableTickers;
    property ActiveTickers: TStringList read FActiveTickers;
  end;

implementation

uses
  Logger;

{ TTickerManager }

constructor TTickerManager.Create(AActiveTickers: TStringList; AMaxActive: Integer; AMinActive: Integer);
begin
  inherited Create;
  
  FActiveTickers := AActiveTickers;
  FMaxActiveTickers := AMaxActive;
  FMinActiveTickers := AMinActive;
  
  FAvailableTickers := TStringList.Create;
  FAvailableTickers.Duplicates := dupIgnore;
  FAvailableTickers.Sorted := True;
  
  InitializeAvailableTickers;
  
  // Seed random number generator
  Randomize;
end;

destructor TTickerManager.Destroy;
begin
  FreeAndNil(FAvailableTickers);
  inherited;
end;

procedure TTickerManager.InitializeAvailableTickers;
const
  // Full list of available tickers as specified in requirements
  ALL_TICKERS: array[0..46] of string = (
    'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'GOOG', 'AMZN', 'META', 'AVGO', 'ORCL',
    'ADBE', 'CRM', 'CSCO', 'INTC', 'AMD', 'TXN', 'QCOM', 'PLTR', 'ASML', 'INTU',
    'MU', 'PANW', 'SNOW', 'KLAC', 'ADI', 'CDNS', 'CRWD', 'LRCX', 'ABNB', 'WDAY',
    'AMAT', 'MCHP', 'FTNT', 'SNPS', 'ON', 'DELL', 'ANET', 'TEAM', 'MNST', 'TTWO',
    'ANSS', 'ZS', 'DDOG', 'PSTG', 'NXPI', 'GFS', 'ENPH'
  );
var
  I: Integer;
begin
  FAvailableTickers.Clear;
  
  // Add all tickers to available pool
  for I := Low(ALL_TICKERS) to High(ALL_TICKERS) do
    FAvailableTickers.Add(ALL_TICKERS[I]);
    
  if Assigned(GlobalLogger) then
    GlobalLogger.Info(Format('TickerManager initialized with %d available tickers', [FAvailableTickers.Count]));
end;

function TTickerManager.AddRandomTicker: string;
var
  AvailableForAdd: TStringList;
  I: Integer;
  RandomIndex: Integer;
begin
  Result := '';
  
  // Check if we've reached max active tickers
  if FActiveTickers.Count >= FMaxActiveTickers then
  begin
    if Assigned(GlobalLogger) then
      GlobalLogger.Debug('Cannot add ticker: maximum active tickers reached');
    Exit;
  end;
  
  // Build list of tickers not currently active
  AvailableForAdd := TStringList.Create;
  try
    for I := 0 to FAvailableTickers.Count - 1 do
    begin
      if FActiveTickers.IndexOf(FAvailableTickers[I]) < 0 then
        AvailableForAdd.Add(FAvailableTickers[I]);
    end;
    
    // If no tickers available to add, exit
    if AvailableForAdd.Count = 0 then
    begin
      if Assigned(GlobalLogger) then
        GlobalLogger.Debug('No tickers available to add');
      Exit;
    end;
    
    // Select random ticker
    RandomIndex := Random(AvailableForAdd.Count);
    Result := AvailableForAdd[RandomIndex];
    
    // Add to active list
    FActiveTickers.Add(Result);
    
    if Assigned(GlobalLogger) then
      GlobalLogger.Info(Format('Random ticker added: %s (Active: %d/%d)', 
        [Result, FActiveTickers.Count, FMaxActiveTickers]));
  finally
    AvailableForAdd.Free;
  end;
end;

function TTickerManager.RemoveRandomTicker: string;
var
  RandomIndex: Integer;
begin
  Result := '';
  
  // Check if we've reached min active tickers
  if FActiveTickers.Count <= FMinActiveTickers then
  begin
    if Assigned(GlobalLogger) then
      GlobalLogger.Debug('Cannot remove ticker: minimum active tickers reached');
    Exit;
  end;
  
  // If no active tickers, exit
  if FActiveTickers.Count = 0 then
  begin
    if Assigned(GlobalLogger) then
      GlobalLogger.Debug('No active tickers to remove');
    Exit;
  end;
  
  // Select random ticker from active list
  RandomIndex := Random(FActiveTickers.Count);
  Result := FActiveTickers[RandomIndex];
  
  // Remove from active list
  FActiveTickers.Delete(RandomIndex);
  
  if Assigned(GlobalLogger) then
    GlobalLogger.Info(Format('Random ticker removed: %s (Active: %d/%d)', 
      [Result, FActiveTickers.Count, FMaxActiveTickers]));
end;

procedure TTickerManager.PerformRandomOperation;
var
  Operation: Integer;
  Ticker: string;
begin
  // Randomly decide whether to add or remove
  // 0 = add, 1 = remove
  Operation := Random(2);
  
  case Operation of
    0: // Add ticker
    begin
      Ticker := AddRandomTicker;
      if Ticker <> '' then
      begin
        if Assigned(GlobalLogger) then
          GlobalLogger.Info('Performed random operation: Added ' + Ticker);
      end;
    end;
    1: // Remove ticker
    begin
      Ticker := RemoveRandomTicker;
      if Ticker <> '' then
      begin
        if Assigned(GlobalLogger) then
          GlobalLogger.Info('Performed random operation: Removed ' + Ticker);
      end;
    end;
  end;
end;

function TTickerManager.GetAvailableCount: Integer;
begin
  Result := FAvailableTickers.Count;
end;

function TTickerManager.GetActiveCount: Integer;
begin
  Result := FActiveTickers.Count;
end;

end.
