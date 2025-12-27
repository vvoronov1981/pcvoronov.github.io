unit Types;

{$mode objfpc}{$H+}
{$modeswitch advancedrecords}

interface

uses
  SysUtils, Classes;

type
  // Уровни логирования
  TLogLevel = (llDebug, llInfo, llWarning, llError);

  // Конфигурация API
  TAPIConfig = record
    BaseURL: string;
    JWTToken: string;
  end;

  // Конфигурация торговли
  TTradingConfig = record
    Symbols: TStringList;
    AnalysisPeriodHours: Integer;
    Leverage: Double;
    StopLossPercent: Double;
    UpdateIntervalSeconds: Integer;
    procedure Init;
    procedure Free;
  end;

  // Конфигурация логирования
  TLoggingConfig = record
    LogFile: string;
    LogLevel: TLogLevel;
  end;

  // Общая конфигурация приложения
  TAppConfig = record
    API: TAPIConfig;
    Trading: TTradingConfig;
    Logging: TLoggingConfig;
  end;

  // Исторические данные по цене
  TPriceData = record
    Timestamp: TDateTime;
    Open: Double;
    High: Double;
    Low: Double;
    Close: Double;
    Volume: Int64;
  end;

  // Анализ цен за период
  TPriceAnalysis = record
    Symbol: string;
    MinPrice: Double;
    MaxPrice: Double;
    AvgPrice: Double;
    CurrentPrice: Double;
    StopLossPrice: Double;
    TakeProfitPrice: Double;
  end;

  // Торговая позиция
  TPosition = record
    Symbol: string;
    Quantity: Double;
    EntryPrice: Double;
    CurrentPrice: Double;
    StopLossPrice: Double;
    TakeProfitPrice: Double;
    Leverage: Double;
    OpenTime: TDateTime;
  end;

  // Торговый сигнал
  TTradeSignal = (tsNone, tsBuy, tsSell);

  // Статус ордера
  TOrderStatus = (osNew, osFilled, osPartiallyFilled, osCanceled, osRejected);

  // Тип ордера
  TOrderType = (otMarket, otLimit, otStopLoss, otTakeProfit);

  // Информация об ордере
  TOrder = record
    OrderID: string;
    Symbol: string;
    OrderType: TOrderType;
    Quantity: Double;
    Price: Double;
    Status: TOrderStatus;
    CreatedAt: TDateTime;
  end;

  // Информация о балансе счета
  TAccountBalance = record
    Cash: Double;
    PortfolioValue: Double;
    BuyingPower: Double;
    Equity: Double;
  end;

implementation

{ TTradingConfig }

procedure TTradingConfig.Init;
begin
  Symbols := TStringList.Create;
  AnalysisPeriodHours := 30;
  Leverage := 2.0;
  StopLossPercent := 70.0;
  UpdateIntervalSeconds := 60;
end;

procedure TTradingConfig.Free;
begin
  if Assigned(Symbols) then
    FreeAndNil(Symbols);
end;

end.
