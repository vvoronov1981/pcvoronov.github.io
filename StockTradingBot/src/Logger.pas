unit Logger;

{$mode objfpc}{$H+}

interface

uses
  SysUtils, Classes, Types, SyncObjs;

type
  TLogger = class
  private
    FLogFile: string;
    FLogLevel: TLogLevel;
    FLock: TCriticalSection;
    FLogFileStream: TFileStream;
    procedure WriteToFile(const AMessage: string);
    procedure WriteToConsole(const AMessage: string);
    function LogLevelToString(ALevel: TLogLevel): string;
  public
    constructor Create(const ALogFile: string; ALogLevel: TLogLevel);
    destructor Destroy; override;
    
    procedure Log(ALevel: TLogLevel; const AMessage: string); overload;
    procedure Log(const AMessage: string); overload;
    procedure Debug(const AMessage: string);
    procedure Info(const AMessage: string);
    procedure Warning(const AMessage: string);
    procedure Error(const AMessage: string);
  end;

var
  GlobalLogger: TLogger;

implementation

{ TLogger }

constructor TLogger.Create(const ALogFile: string; ALogLevel: TLogLevel);
begin
  inherited Create;
  FLogFile := ALogFile;
  FLogLevel := ALogLevel;
  FLock := TCriticalSection.Create;
  
  // Создаем или открываем файл лога
  try
    if FileExists(FLogFile) then
      FLogFileStream := TFileStream.Create(FLogFile, fmOpenWrite or fmShareDenyWrite)
    else
      FLogFileStream := TFileStream.Create(FLogFile, fmCreate or fmShareDenyWrite);
    FLogFileStream.Seek(0, soEnd);
  except
    on E: Exception do
      WriteLn('Error creating log file: ', E.Message);
  end;
end;

destructor TLogger.Destroy;
begin
  if Assigned(FLogFileStream) then
    FreeAndNil(FLogFileStream);
  FreeAndNil(FLock);
  inherited;
end;

function TLogger.LogLevelToString(ALevel: TLogLevel): string;
begin
  case ALevel of
    llDebug:   Result := 'DEBUG';
    llInfo:    Result := 'INFO';
    llWarning: Result := 'WARNING';
    llError:   Result := 'ERROR';
  else
    Result := 'UNKNOWN';
  end;
end;

procedure TLogger.WriteToFile(const AMessage: string);
var
  Msg: AnsiString;
begin
  if Assigned(FLogFileStream) then
  begin
    try
      Msg := AMessage + LineEnding;
      FLogFileStream.Write(Msg[1], Length(Msg));
      FLogFileStream.Flush;
    except
      on E: Exception do
        WriteLn('Error writing to log file: ', E.Message);
    end;
  end;
end;

procedure TLogger.WriteToConsole(const AMessage: string);
begin
  WriteLn(AMessage);
end;

procedure TLogger.Log(ALevel: TLogLevel; const AMessage: string);
var
  LogMessage: string;
begin
  if ALevel < FLogLevel then
    Exit;
    
  FLock.Enter;
  try
    LogMessage := Format('[%s] [%s] %s', [
      FormatDateTime('yyyy-mm-dd hh:nn:ss', Now),
      LogLevelToString(ALevel),
      AMessage
    ]);
    
    WriteToConsole(LogMessage);
    WriteToFile(LogMessage);
  finally
    FLock.Leave;
  end;
end;

procedure TLogger.Log(const AMessage: string);
begin
  Log(llInfo, AMessage);
end;

procedure TLogger.Debug(const AMessage: string);
begin
  Log(llDebug, AMessage);
end;

procedure TLogger.Info(const AMessage: string);
begin
  Log(llInfo, AMessage);
end;

procedure TLogger.Warning(const AMessage: string);
begin
  Log(llWarning, AMessage);
end;

procedure TLogger.Error(const AMessage: string);
begin
  Log(llError, AMessage);
end;

initialization
  GlobalLogger := nil;

finalization
  if Assigned(GlobalLogger) then
    FreeAndNil(GlobalLogger);

end.
