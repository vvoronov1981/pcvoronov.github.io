unit AlpacaAPIClient;

{$mode objfpc}{$H+}

interface

uses
  SysUtils, Classes, Types, fphttpclient, opensslsockets, fpjson, jsonparser;

type
  TAlpacaAPIClient = class
  private
    FBaseURL: string;
    FJWTToken: string;
    FHTTPClient: TFPHTTPClient;
    
    function GetAuthHeaders: TStringList;
    function MakeRequest(const AMethod, AEndpoint: string; AData: TJSONObject = nil): TJSONObject;
  public
    constructor Create(const ABaseURL, AJWTToken: string);
    destructor Destroy; override;
    
    // API методы
    function GetHistoricalData(const ASymbol: string; const AStartTime, AEndTime: TDateTime): TJSONArray;
    function GetCurrentPrice(const ASymbol: string): Double;
    function PlaceBuyOrder(const ASymbol: string; AQuantity: Double; ALeverage: Double): TOrder;
    function PlaceSellOrder(const ASymbol: string; AQuantity: Double): TOrder;
    function GetPositions: TJSONArray;
    function GetPosition(const ASymbol: string): TJSONObject;
    function GetAccountBalance: TAccountBalance;
    function CancelOrder(const AOrderID: string): Boolean;
  end;

implementation

uses
  Logger, DateUtils;

{ TAlpacaAPIClient }

constructor TAlpacaAPIClient.Create(const ABaseURL, AJWTToken: string);
begin
  inherited Create;
  FBaseURL := ABaseURL;
  FJWTToken := AJWTToken;
  FHTTPClient := TFPHTTPClient.Create(nil);
  FHTTPClient.AllowRedirect := True;
end;

destructor TAlpacaAPIClient.Destroy;
begin
  FreeAndNil(FHTTPClient);
  inherited;
end;

function TAlpacaAPIClient.GetAuthHeaders: TStringList;
begin
  Result := TStringList.Create;
  Result.Add('Authorization: Bearer ' + FJWTToken);
  Result.Add('Content-Type: application/json');
end;

function TAlpacaAPIClient.MakeRequest(const AMethod, AEndpoint: string; AData: TJSONObject): TJSONObject;
var
  URL: string;
  Response: string;
  Headers: TStringList;
  RequestData: string;
  JSONData: TJSONData;
  Stream: TStringStream;
begin
  Result := nil;
  URL := FBaseURL + AEndpoint;
  Headers := GetAuthHeaders;
  
  try
    FHTTPClient.RequestHeaders.Clear;
    FHTTPClient.RequestHeaders.AddStrings(Headers);
    
    try
      if AMethod = 'GET' then
      begin
        Response := FHTTPClient.Get(URL);
      end
      else if AMethod = 'POST' then
      begin
        if Assigned(AData) then
          RequestData := AData.AsJSON
        else
          RequestData := '{}';
        Stream := TStringStream.Create(RequestData);
        try
          Response := FHTTPClient.Post(URL, Stream);
        finally
          Stream.Free;
        end;
      end
      else if AMethod = 'DELETE' then
      begin
        Response := FHTTPClient.Delete(URL);
      end;
      
      if Response <> '' then
      begin
        JSONData := GetJSON(Response);
        if Assigned(JSONData) and (JSONData is TJSONObject) then
          Result := TJSONObject(JSONData)
        else if Assigned(JSONData) then
          JSONData.Free;
      end;
      
      if Assigned(GlobalLogger) then
        GlobalLogger.Debug(Format('API Request: %s %s - Status: %d', [AMethod, URL, FHTTPClient.ResponseStatusCode]));
    except
      on E: Exception do
      begin
        if Assigned(GlobalLogger) then
          GlobalLogger.Error(Format('API Request failed: %s %s - Error: %s', [AMethod, URL, E.Message]));
      end;
    end;
  finally
    Headers.Free;
  end;
end;

function TAlpacaAPIClient.GetHistoricalData(const ASymbol: string; const AStartTime, AEndTime: TDateTime): TJSONArray;
var
  Endpoint: string;
  StartStr, EndStr: string;
  Response: TJSONObject;
begin
  Result := nil;
  
  // Форматируем даты в ISO 8601
  StartStr := FormatDateTime('yyyy-mm-dd"T"hh:nn:ss"Z"', AStartTime);
  EndStr := FormatDateTime('yyyy-mm-dd"T"hh:nn:ss"Z"', AEndTime);
  
  Endpoint := Format('/v2/stocks/%s/bars?timeframe=1Hour&start=%s&end=%s', [ASymbol, StartStr, EndStr]);
  
  Response := MakeRequest('GET', Endpoint);
  if Assigned(Response) then
  begin
    try
      if Response.IndexOfName('bars') >= 0 then
        Result := TJSONArray(Response.Extract('bars'));
    finally
      Response.Free;
    end;
  end;
end;

function TAlpacaAPIClient.GetCurrentPrice(const ASymbol: string): Double;
var
  Endpoint: string;
  Response: TJSONObject;
  TradeObj: TJSONObject;
begin
  Result := 0.0;
  Endpoint := Format('/v2/stocks/%s/trades/latest', [ASymbol]);
  
  Response := MakeRequest('GET', Endpoint);
  if Assigned(Response) then
  begin
    try
      TradeObj := Response.Objects['trade'];
      if Assigned(TradeObj) then
        Result := TradeObj.Get('p', 0.0);
    finally
      Response.Free;
    end;
  end;
end;

function TAlpacaAPIClient.PlaceBuyOrder(const ASymbol: string; AQuantity: Double; ALeverage: Double): TOrder;
var
  Endpoint: string;
  RequestData: TJSONObject;
  Response: TJSONObject;
begin
  FillChar(Result, SizeOf(Result), 0);
  Endpoint := '/v2/orders';
  
  RequestData := TJSONObject.Create;
  try
    RequestData.Add('symbol', ASymbol);
    RequestData.Add('qty', AQuantity);
    RequestData.Add('side', 'buy');
    RequestData.Add('type', 'market');
    RequestData.Add('time_in_force', 'day');
    
    Response := MakeRequest('POST', Endpoint, RequestData);
    if Assigned(Response) then
    begin
      try
        Result.OrderID := Response.Get('id', '');
        Result.Symbol := Response.Get('symbol', '');
        Result.Quantity := Response.Get('qty', 0.0);
        Result.Price := Response.Get('filled_avg_price', 0.0);
        Result.CreatedAt := Now;
        Result.OrderType := otMarket;
        Result.Status := osNew;
      finally
        Response.Free;
      end;
    end;
  finally
    RequestData.Free;
  end;
end;

function TAlpacaAPIClient.PlaceSellOrder(const ASymbol: string; AQuantity: Double): TOrder;
var
  Endpoint: string;
  RequestData: TJSONObject;
  Response: TJSONObject;
begin
  FillChar(Result, SizeOf(Result), 0);
  Endpoint := '/v2/orders';
  
  RequestData := TJSONObject.Create;
  try
    RequestData.Add('symbol', ASymbol);
    RequestData.Add('qty', AQuantity);
    RequestData.Add('side', 'sell');
    RequestData.Add('type', 'market');
    RequestData.Add('time_in_force', 'day');
    
    Response := MakeRequest('POST', Endpoint, RequestData);
    if Assigned(Response) then
    begin
      try
        Result.OrderID := Response.Get('id', '');
        Result.Symbol := Response.Get('symbol', '');
        Result.Quantity := Response.Get('qty', 0.0);
        Result.Price := Response.Get('filled_avg_price', 0.0);
        Result.CreatedAt := Now;
        Result.OrderType := otMarket;
        Result.Status := osNew;
      finally
        Response.Free;
      end;
    end;
  finally
    RequestData.Free;
  end;
end;

function TAlpacaAPIClient.GetPositions: TJSONArray;
var
  Endpoint: string;
  Response: TJSONObject;
  JSONData: TJSONData;
begin
  Result := nil;
  Endpoint := '/v2/positions';
  
  // Для списка позиций API возвращает массив напрямую
  try
    FHTTPClient.RequestHeaders.Clear;
    FHTTPClient.RequestHeaders.Add('Authorization: Bearer ' + FJWTToken);
    FHTTPClient.RequestHeaders.Add('Content-Type: application/json');
    
    JSONData := GetJSON(FHTTPClient.Get(FBaseURL + Endpoint));
    if Assigned(JSONData) and (JSONData is TJSONArray) then
      Result := TJSONArray(JSONData);
  except
    on E: Exception do
      if Assigned(GlobalLogger) then
        GlobalLogger.Error('Error getting positions: ' + E.Message);
  end;
end;

function TAlpacaAPIClient.GetPosition(const ASymbol: string): TJSONObject;
var
  Endpoint: string;
begin
  Endpoint := Format('/v2/positions/%s', [ASymbol]);
  Result := MakeRequest('GET', Endpoint);
end;

function TAlpacaAPIClient.GetAccountBalance: TAccountBalance;
var
  Endpoint: string;
  Response: TJSONObject;
begin
  FillChar(Result, SizeOf(Result), 0);
  Endpoint := '/v2/account';
  
  Response := MakeRequest('GET', Endpoint);
  if Assigned(Response) then
  begin
    try
      Result.Cash := StrToFloatDef(Response.Get('cash', '0'), 0.0);
      Result.PortfolioValue := StrToFloatDef(Response.Get('portfolio_value', '0'), 0.0);
      Result.BuyingPower := StrToFloatDef(Response.Get('buying_power', '0'), 0.0);
      Result.Equity := StrToFloatDef(Response.Get('equity', '0'), 0.0);
    finally
      Response.Free;
    end;
  end;
end;

function TAlpacaAPIClient.CancelOrder(const AOrderID: string): Boolean;
var
  Endpoint: string;
  Response: TJSONObject;
begin
  Result := False;
  Endpoint := Format('/v2/orders/%s', [AOrderID]);
  
  Response := MakeRequest('DELETE', Endpoint);
  Result := Assigned(Response);
  if Assigned(Response) then
    Response.Free;
end;

end.
