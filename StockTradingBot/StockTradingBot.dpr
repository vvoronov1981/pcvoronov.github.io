program StockTradingBot;

{$mode objfpc}{$H+}

uses
  {$IFDEF UNIX}
  cthreads,
  {$ENDIF}
  SysUtils, Classes, Types, DateUtils,
  ConfigManager, Logger, AlpacaAPIClient, TradingStrategy, OrderManager;

type
  TTradingBot = class
  private
    FConfigManager: TConfigManager;
    FAPIClient: TAlpacaAPIClient;
    FStrategy: TTradingStrategy;
    FOrderManager: TOrderManager;
    FRunning: Boolean;
    
    procedure ProcessCommand(const ACommand: string);
    procedure ShowStatus;
    procedure ShowPositions;
    procedure ShowHelp;
    procedure AddSymbol(const ASymbol: string);
    procedure RemoveSymbol(const ASymbol: string);
    procedure StartTrading;
    procedure StopTrading;
    procedure TradingLoop;
    procedure ProcessSymbol(const ASymbol: string);
  public
    constructor Create(const AConfigFile: string);
    destructor Destroy; override;
    
    procedure Run;
  end;

{ TTradingBot }

constructor TTradingBot.Create(const AConfigFile: string);
begin
  inherited Create;
  FRunning := False;
  
  WriteLn('=== Stock Trading Bot ===');
  WriteLn('Initializing...');
  
  // Загружаем конфигурацию
  FConfigManager := TConfigManager.Create(AConfigFile);
  FConfigManager.Load;
  
  if not FConfigManager.Validate then
  begin
    WriteLn('Configuration validation failed!');
    Halt(1);
  end;
  
  // Инициализируем логгер
  GlobalLogger := TLogger.Create(
    FConfigManager.Config.Logging.LogFile,
    FConfigManager.Config.Logging.LogLevel
  );
  
  GlobalLogger.Info('=== Stock Trading Bot Started ===');
  GlobalLogger.Info('Configuration loaded from: ' + AConfigFile);
  
  // Инициализируем компоненты
  FAPIClient := TAlpacaAPIClient.Create(
    FConfigManager.Config.API.BaseURL,
    FConfigManager.Config.API.JWTToken
  );
  
  FStrategy := TTradingStrategy.Create(
    FConfigManager.Config.Trading.AnalysisPeriodHours,
    FConfigManager.Config.Trading.StopLossPercent
  );
  
  FOrderManager := TOrderManager.Create(
    FAPIClient,
    FStrategy,
    FConfigManager.Config.Trading.Leverage
  );
  
  WriteLn('Initialization complete!');
  WriteLn;
end;

destructor TTradingBot.Destroy;
begin
  GlobalLogger.Info('=== Stock Trading Bot Stopped ===');
  
  FreeAndNil(FOrderManager);
  FreeAndNil(FStrategy);
  FreeAndNil(FAPIClient);
  FreeAndNil(GlobalLogger);
  FreeAndNil(FConfigManager);
  
  inherited;
end;

procedure TTradingBot.ShowHelp;
begin
  WriteLn('Available commands:');
  WriteLn('  start              - Start trading');
  WriteLn('  stop               - Stop trading');
  WriteLn('  status             - Show current status');
  WriteLn('  positions          - Show open positions');
  WriteLn('  add <SYMBOL>       - Add symbol to trading list');
  WriteLn('  remove <SYMBOL>    - Remove symbol from trading list');
  WriteLn('  help               - Show this help');
  WriteLn('  exit               - Exit the program');
  WriteLn;
end;

procedure TTradingBot.ShowStatus;
var
  Balance: TAccountBalance;
  I: Integer;
begin
  WriteLn('=== Current Status ===');
  WriteLn('Trading: ', IfThen(FRunning, 'ACTIVE', 'STOPPED'));
  WriteLn;
  
  try
    Balance := FAPIClient.GetAccountBalance;
    WriteLn('Account Balance:');
    WriteLn('  Cash:           $', Format('%.2f', [Balance.Cash]));
    WriteLn('  Portfolio Value: $', Format('%.2f', [Balance.PortfolioValue]));
    WriteLn('  Buying Power:    $', Format('%.2f', [Balance.BuyingPower]));
    WriteLn('  Equity:          $', Format('%.2f', [Balance.Equity]));
    WriteLn;
  except
    on E: Exception do
      WriteLn('Error getting account balance: ', E.Message);
  end;
  
  WriteLn('Trading Symbols (', FConfigManager.Config.Trading.Symbols.Count, '):');
  for I := 0 to FConfigManager.Config.Trading.Symbols.Count - 1 do
    WriteLn('  - ', FConfigManager.Config.Trading.Symbols[I]);
  WriteLn;
end;

procedure TTradingBot.ShowPositions;
var
  List: TList;
  I: Integer;
  Position: ^TPosition;
  ProfitLoss: Double;
begin
  WriteLn('=== Open Positions ===');
  
  List := FOrderManager.GetAllPositions;
  try
    if List.Count = 0 then
    begin
      WriteLn('No open positions');
    end
    else
    begin
      for I := 0 to List.Count - 1 do
      begin
        Position := List[I];
        ProfitLoss := (Position^.CurrentPrice - Position^.EntryPrice) * Position^.Quantity;
        
        WriteLn(Format('%d. %s', [I + 1, Position^.Symbol]));
        WriteLn(Format('   Quantity:      %.0f', [Position^.Quantity]));
        WriteLn(Format('   Entry Price:   $%.2f', [Position^.EntryPrice]));
        WriteLn(Format('   Current Price: $%.2f', [Position^.CurrentPrice]));
        WriteLn(Format('   Take Profit:   $%.2f', [Position^.TakeProfitPrice]));
        WriteLn(Format('   Stop Loss:     $%.2f', [Position^.StopLossPrice]));
        WriteLn(Format('   P/L:           $%.2f', [ProfitLoss]));
        WriteLn(Format('   Leverage:      %.1fx', [Position^.Leverage]));
        WriteLn;
      end;
    end;
  finally
    FOrderManager.GetAllPositions.UnlockList;
  end;
  WriteLn;
end;

procedure TTradingBot.AddSymbol(const ASymbol: string);
begin
  if FConfigManager.Config.Trading.Symbols.IndexOf(ASymbol) >= 0 then
  begin
    WriteLn('Symbol ', ASymbol, ' is already in the list');
    Exit;
  end;
  
  FConfigManager.Config.Trading.Symbols.Add(ASymbol);
  FConfigManager.Save;
  
  GlobalLogger.Info('Added symbol: ' + ASymbol);
  WriteLn('Symbol ', ASymbol, ' added to trading list');
end;

procedure TTradingBot.RemoveSymbol(const ASymbol: string);
var
  Index: Integer;
begin
  Index := FConfigManager.Config.Trading.Symbols.IndexOf(ASymbol);
  if Index < 0 then
  begin
    WriteLn('Symbol ', ASymbol, ' not found in the list');
    Exit;
  end;
  
  FConfigManager.Config.Trading.Symbols.Delete(Index);
  FConfigManager.Save;
  
  GlobalLogger.Info('Removed symbol: ' + ASymbol);
  WriteLn('Symbol ', ASymbol, ' removed from trading list');
end;

procedure TTradingBot.ProcessSymbol(const ASymbol: string);
var
  StartTime, EndTime: TDateTime;
  Bars: TJSONArray;
  CurrentPrice: Double;
  Analysis: TPriceAnalysis;
  Signal: TTradeSignal;
  HasPosition: Boolean;
begin
  try
    GlobalLogger.Debug('Processing symbol: ' + ASymbol);
    
    // Получаем исторические данные
    EndTime := Now;
    StartTime := IncHour(EndTime, -FConfigManager.Config.Trading.AnalysisPeriodHours);
    
    Bars := FAPIClient.GetHistoricalData(ASymbol, StartTime, EndTime);
    if not Assigned(Bars) then
    begin
      GlobalLogger.Warning('No historical data for ' + ASymbol);
      Exit;
    end;
    
    try
      // Получаем текущую цену
      CurrentPrice := FAPIClient.GetCurrentPrice(ASymbol);
      if CurrentPrice <= 0 then
      begin
        GlobalLogger.Warning('Invalid current price for ' + ASymbol);
        Exit;
      end;
      
      // Анализируем цены
      Analysis := FStrategy.AnalyzePrices(ASymbol, Bars, CurrentPrice);
      
      // Проверяем наличие открытой позиции
      HasPosition := FOrderManager.HasPosition(ASymbol);
      
      // Генерируем торговый сигнал
      Signal := FStrategy.GenerateSignal(Analysis, HasPosition);
      
      // Выполняем действие по сигналу
      case Signal of
        tsBuy:
          FOrderManager.ExecuteBuy(ASymbol, Analysis);
        tsSell:
          FOrderManager.ExecuteSell(ASymbol, Analysis);
      end;
    finally
      Bars.Free;
    end;
  except
    on E: Exception do
      GlobalLogger.Error(Format('Error processing symbol %s: %s', [ASymbol, E.Message]));
  end;
end;

procedure TTradingBot.TradingLoop;
var
  I: Integer;
  NextUpdate: TDateTime;
begin
  GlobalLogger.Info('Trading started');
  WriteLn('Trading started. Press Ctrl+C or type "stop" to stop.');
  WriteLn;
  
  while FRunning do
  begin
    // Синхронизируем позиции с API
    FOrderManager.SyncPositionsWithAPI;
    
    // Мониторим открытые позиции
    FOrderManager.MonitorPositions;
    
    // Обрабатываем каждый символ
    for I := 0 to FConfigManager.Config.Trading.Symbols.Count - 1 do
    begin
      if not FRunning then
        Break;
        
      ProcessSymbol(FConfigManager.Config.Trading.Symbols[I]);
    end;
    
    // Ждем до следующего обновления
    if FRunning then
    begin
      NextUpdate := IncSecond(Now, FConfigManager.Config.Trading.UpdateIntervalSeconds);
      while (Now < NextUpdate) and FRunning do
        Sleep(1000);
    end;
  end;
  
  GlobalLogger.Info('Trading stopped');
  WriteLn('Trading stopped.');
  WriteLn;
end;

procedure TTradingBot.StartTrading;
begin
  if FRunning then
  begin
    WriteLn('Trading is already running');
    Exit;
  end;
  
  FRunning := True;
  TradingLoop;
end;

procedure TTradingBot.StopTrading;
begin
  if not FRunning then
  begin
    WriteLn('Trading is not running');
    Exit;
  end;
  
  FRunning := False;
end;

procedure TTradingBot.ProcessCommand(const ACommand: string);
var
  Parts: TStringList;
  Cmd, Param: string;
begin
  Parts := TStringList.Create;
  try
    Parts.Delimiter := ' ';
    Parts.StrictDelimiter := True;
    Parts.DelimitedText := Trim(ACommand);
    
    if Parts.Count = 0 then
      Exit;
      
    Cmd := LowerCase(Parts[0]);
    
    if Cmd = 'start' then
      StartTrading
    else if Cmd = 'stop' then
      StopTrading
    else if Cmd = 'status' then
      ShowStatus
    else if Cmd = 'positions' then
      ShowPositions
    else if Cmd = 'help' then
      ShowHelp
    else if Cmd = 'add' then
    begin
      if Parts.Count > 1 then
        AddSymbol(UpperCase(Parts[1]))
      else
        WriteLn('Usage: add <SYMBOL>');
    end
    else if Cmd = 'remove' then
    begin
      if Parts.Count > 1 then
        RemoveSymbol(UpperCase(Parts[1]))
      else
        WriteLn('Usage: remove <SYMBOL>');
    end
    else if Cmd = 'exit' then
    begin
      StopTrading;
      WriteLn('Exiting...');
      Halt(0);
    end
    else
      WriteLn('Unknown command: ', Cmd, '. Type "help" for available commands.');
  finally
    Parts.Free;
  end;
end;

procedure TTradingBot.Run;
var
  Command: string;
begin
  ShowHelp;
  ShowStatus;
  
  while True do
  begin
    Write('> ');
    ReadLn(Command);
    
    if Trim(Command) <> '' then
      ProcessCommand(Command);
  end;
end;

var
  Bot: TTradingBot;
  ConfigFile: string;

begin
  try
    // Получаем путь к конфигурационному файлу
    if ParamCount > 0 then
      ConfigFile := ParamStr(1)
    else
      ConfigFile := 'config.json';
    
    // Создаем и запускаем бота
    Bot := TTradingBot.Create(ConfigFile);
    try
      Bot.Run;
    finally
      Bot.Free;
    end;
  except
    on E: Exception do
    begin
      WriteLn('Fatal error: ', E.Message);
      Halt(1);
    end;
  end;
end.
