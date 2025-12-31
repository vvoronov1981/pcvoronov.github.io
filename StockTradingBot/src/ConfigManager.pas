unit ConfigManager;

{$mode objfpc}{$H+}

interface

uses
  SysUtils, Classes, Types, fpjson, jsonparser;

type
  TConfigManager = class
  private
    FConfigFile: string;
    FConfig: TAppConfig;
    function LoadJSON(const AFileName: string): TJSONObject;
    procedure ParseAPIConfig(AJSON: TJSONObject);
    procedure ParseTradingConfig(AJSON: TJSONObject);
    procedure ParseLoggingConfig(AJSON: TJSONObject);
  public
    constructor Create(const AConfigFile: string);
    destructor Destroy; override;
    
    procedure Load;
    procedure Save;
    function Validate: Boolean;
    
    property Config: TAppConfig read FConfig;
  end;

implementation

uses
  Logger, CredentialsProvider;

{ TConfigManager }

constructor TConfigManager.Create(const AConfigFile: string);
begin
  inherited Create;
  FConfigFile := AConfigFile;
  FConfig.Trading.Init;
end;

destructor TConfigManager.Destroy;
begin
  FConfig.Trading.Free;
  inherited;
end;

function TConfigManager.LoadJSON(const AFileName: string): TJSONObject;
var
  JSONStr: string;
  FileStream: TFileStream;
  JSONData: TJSONData;
begin
  Result := nil;
  if not FileExists(AFileName) then
  begin
    WriteLn('Config file not found: ', AFileName);
    Exit;
  end;

  try
    FileStream := TFileStream.Create(AFileName, fmOpenRead or fmShareDenyWrite);
    try
      SetLength(JSONStr, FileStream.Size);
      FileStream.Read(JSONStr[1], FileStream.Size);
    finally
      FileStream.Free;
    end;

    JSONData := GetJSON(JSONStr);
    if Assigned(JSONData) and (JSONData is TJSONObject) then
      Result := TJSONObject(JSONData)
    else
    begin
      WriteLn('Invalid JSON format in config file');
      if Assigned(JSONData) then
        JSONData.Free;
    end;
  except
    on E: Exception do
      WriteLn('Error loading config file: ', E.Message);
  end;
end;

procedure TConfigManager.ParseAPIConfig(AJSON: TJSONObject);
var
  APIObj: TJSONObject;
  BaseURL, JWTToken: string;
begin
  APIObj := AJSON.Objects['api'];
  if Assigned(APIObj) then
  begin
    BaseURL := APIObj.Get('base_url', '');
    JWTToken := APIObj.Get('jwt_token', '');
    
    // Use CredentialsProvider to resolve values from environment variables
    FConfig.API.BaseURL := TCredentialsProvider.GetAPIBaseURL(BaseURL);
    FConfig.API.JWTToken := TCredentialsProvider.GetJWTToken(JWTToken);
  end;
end;

procedure TConfigManager.ParseTradingConfig(AJSON: TJSONObject);
var
  TradingObj: TJSONObject;
  SymbolsArray: TJSONArray;
  I: Integer;
begin
  TradingObj := AJSON.Objects['trading'];
  if Assigned(TradingObj) then
  begin
    FConfig.Trading.AnalysisPeriodHours := TradingObj.Get('analysis_period_hours', 30);
    FConfig.Trading.Leverage := TradingObj.Get('leverage', 2.0);
    FConfig.Trading.StopLossPercent := TradingObj.Get('stop_loss_percent', 70.0);
    FConfig.Trading.UpdateIntervalSeconds := TradingObj.Get('update_interval_seconds', 60);
    FConfig.Trading.EnableRandomTickerManagement := TradingObj.Get('enable_random_ticker_management', True);
    FConfig.Trading.TickerOperationIntervalMinutes := TradingObj.Get('ticker_operation_interval_minutes', 30);
    FConfig.Trading.MaxActiveTickers := TradingObj.Get('max_active_tickers', 10);
    FConfig.Trading.MinActiveTickers := TradingObj.Get('min_active_tickers', 3);
    
    SymbolsArray := TradingObj.Arrays['symbols'];
    if Assigned(SymbolsArray) then
    begin
      FConfig.Trading.Symbols.Clear;
      for I := 0 to SymbolsArray.Count - 1 do
        FConfig.Trading.Symbols.Add(SymbolsArray.Strings[I]);
    end;
  end;
end;

procedure TConfigManager.ParseLoggingConfig(AJSON: TJSONObject);
var
  LoggingObj: TJSONObject;
  LogLevelStr: string;
begin
  LoggingObj := AJSON.Objects['logging'];
  if Assigned(LoggingObj) then
  begin
    FConfig.Logging.LogFile := LoggingObj.Get('log_file', 'trading_bot.log');
    LogLevelStr := LoggingObj.Get('log_level', 'INFO');
    
    if LogLevelStr = 'DEBUG' then
      FConfig.Logging.LogLevel := llDebug
    else if LogLevelStr = 'INFO' then
      FConfig.Logging.LogLevel := llInfo
    else if LogLevelStr = 'WARNING' then
      FConfig.Logging.LogLevel := llWarning
    else if LogLevelStr = 'ERROR' then
      FConfig.Logging.LogLevel := llError
    else
      FConfig.Logging.LogLevel := llInfo;
  end;
end;

procedure TConfigManager.Load;
var
  JSON: TJSONObject;
begin
  JSON := LoadJSON(FConfigFile);
  if not Assigned(JSON) then
    Exit;

  try
    ParseAPIConfig(JSON);
    ParseTradingConfig(JSON);
    ParseLoggingConfig(JSON);
  finally
    JSON.Free;
  end;
end;

procedure TConfigManager.Save;
var
  JSON: TJSONObject;
  APIObj, TradingObj, LoggingObj: TJSONObject;
  SymbolsArray: TJSONArray;
  I: Integer;
  JSONStr: string;
  FileStream: TFileStream;
begin
  JSON := TJSONObject.Create;
  try
    // API Configuration
    APIObj := TJSONObject.Create;
    APIObj.Add('base_url', FConfig.API.BaseURL);
    APIObj.Add('jwt_token', FConfig.API.JWTToken);
    JSON.Add('api', APIObj);

    // Trading Configuration
    TradingObj := TJSONObject.Create;
    SymbolsArray := TJSONArray.Create;
    for I := 0 to FConfig.Trading.Symbols.Count - 1 do
      SymbolsArray.Add(FConfig.Trading.Symbols[I]);
    TradingObj.Add('symbols', SymbolsArray);
    TradingObj.Add('analysis_period_hours', FConfig.Trading.AnalysisPeriodHours);
    TradingObj.Add('leverage', FConfig.Trading.Leverage);
    TradingObj.Add('stop_loss_percent', FConfig.Trading.StopLossPercent);
    TradingObj.Add('update_interval_seconds', FConfig.Trading.UpdateIntervalSeconds);
    TradingObj.Add('enable_random_ticker_management', FConfig.Trading.EnableRandomTickerManagement);
    TradingObj.Add('ticker_operation_interval_minutes', FConfig.Trading.TickerOperationIntervalMinutes);
    TradingObj.Add('max_active_tickers', FConfig.Trading.MaxActiveTickers);
    TradingObj.Add('min_active_tickers', FConfig.Trading.MinActiveTickers);
    JSON.Add('trading', TradingObj);

    // Logging Configuration
    LoggingObj := TJSONObject.Create;
    LoggingObj.Add('log_file', FConfig.Logging.LogFile);
    case FConfig.Logging.LogLevel of
      llDebug: LoggingObj.Add('log_level', 'DEBUG');
      llInfo: LoggingObj.Add('log_level', 'INFO');
      llWarning: LoggingObj.Add('log_level', 'WARNING');
      llError: LoggingObj.Add('log_level', 'ERROR');
    end;
    JSON.Add('logging', LoggingObj);

    // Write to file
    JSONStr := JSON.FormatJSON([], 2);
    FileStream := TFileStream.Create(FConfigFile, fmCreate);
    try
      FileStream.Write(JSONStr[1], Length(JSONStr));
    finally
      FileStream.Free;
    end;
  finally
    JSON.Free;
  end;
end;

function TConfigManager.Validate: Boolean;
begin
  Result := True;
  
  if FConfig.API.BaseURL = '' then
  begin
    WriteLn('Error: API Base URL is not set');
    Result := False;
  end;
  
  if FConfig.API.JWTToken = '' then
  begin
    WriteLn('Warning: JWT Token is not set');
  end;
  
  if FConfig.Trading.Symbols.Count = 0 then
  begin
    WriteLn('Warning: No trading symbols configured');
  end;
  
  if FConfig.Trading.AnalysisPeriodHours <= 0 then
  begin
    WriteLn('Error: Invalid analysis period');
    Result := False;
  end;
  
  if FConfig.Trading.UpdateIntervalSeconds <= 0 then
  begin
    WriteLn('Error: Invalid update interval');
    Result := False;
  end;
end;

end.
