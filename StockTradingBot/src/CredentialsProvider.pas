unit CredentialsProvider;

{$mode objfpc}{$H+}

interface

uses
  SysUtils, Classes;

type
  { TCredentialsProvider - Secure credential provider from environment variables }
  TCredentialsProvider = class
  private
    class function GetEnvVarOrDefault(const VarName, DefaultValue: string): string;
  public
    { Get API Base URL from environment or config }
    class function GetAPIBaseURL(const ConfigValue: string): string;
    
    { Get JWT Token from environment or config }
    class function GetJWTToken(const ConfigValue: string): string;
    
    { Get API Key from environment or config }
    class function GetAPIKey(const ConfigValue: string): string;
    
    { Get API Secret from environment or config }
    class function GetAPISecret(const ConfigValue: string): string;
    
    { Get Account ID from environment or config }
    class function GetAccountID(const ConfigValue: string): string;
    
    { Check if a value is a placeholder }
    class function IsPlaceholder(const Value: string): Boolean;
    
    { Replace placeholder with environment variable or return original }
    class function ResolveValue(const Value: string): string;
  end;

implementation

{ TCredentialsProvider }

class function TCredentialsProvider.GetEnvVarOrDefault(const VarName, DefaultValue: string): string;
begin
  Result := GetEnvironmentVariable(VarName);
  if Result = '' then
    Result := DefaultValue;
end;

class function TCredentialsProvider.GetAPIBaseURL(const ConfigValue: string): string;
begin
  Result := ResolveValue(ConfigValue);
  
  // If still a placeholder or empty, try environment variables
  if IsPlaceholder(Result) or (Result = '') then
    Result := GetEnvVarOrDefault('ALPACA_API_URL', Result);
end;

class function TCredentialsProvider.GetJWTToken(const ConfigValue: string): string;
begin
  Result := ResolveValue(ConfigValue);
  
  // If still a placeholder or empty, try environment variables
  if IsPlaceholder(Result) or (Result = '') then
    Result := GetEnvVarOrDefault('JWT_TOKEN', Result);
    
  // Also check ALPACA_JWT_TOKEN
  if IsPlaceholder(Result) or (Result = '') then
    Result := GetEnvVarOrDefault('ALPACA_JWT_TOKEN', Result);
end;

class function TCredentialsProvider.GetAPIKey(const ConfigValue: string): string;
begin
  Result := ResolveValue(ConfigValue);
  
  // If still a placeholder or empty, try environment variables
  if IsPlaceholder(Result) or (Result = '') then
    Result := GetEnvVarOrDefault('ALPACA_API_KEY', Result);
end;

class function TCredentialsProvider.GetAPISecret(const ConfigValue: string): string;
begin
  Result := ResolveValue(ConfigValue);
  
  // If still a placeholder or empty, try environment variables
  if IsPlaceholder(Result) or (Result = '') then
    Result := GetEnvVarOrDefault('ALPACA_API_SECRET', Result);
end;

class function TCredentialsProvider.GetAccountID(const ConfigValue: string): string;
begin
  Result := ResolveValue(ConfigValue);
  
  // If still a placeholder or empty, try environment variables
  if IsPlaceholder(Result) or (Result = '') then
    Result := GetEnvVarOrDefault('ALPACA_ACCOUNT', Result);
end;

class function TCredentialsProvider.IsPlaceholder(const Value: string): Boolean;
begin
  // Check if value looks like a placeholder: ${VAR_NAME} or contains placeholder text
  Result := (Pos('${', Value) > 0) or 
            (Pos('your_', LowerCase(Value)) > 0) or
            (Pos('placeholder', LowerCase(Value)) > 0) or
            (Value = 'your-api-server.com') or
            (Pos('_here', LowerCase(Value)) > 0);
end;

class function TCredentialsProvider.ResolveValue(const Value: string): string;
var
  StartPos, EndPos: Integer;
  VarName: string;
  EnvValue: string;
begin
  Result := Value;
  
  // Check if value contains ${VAR_NAME} pattern
  StartPos := Pos('${', Result);
  if StartPos > 0 then
  begin
    EndPos := Pos('}', Result);
    if EndPos > StartPos then
    begin
      // Extract variable name
      VarName := Copy(Result, StartPos + 2, EndPos - StartPos - 2);
      
      // Get environment variable
      EnvValue := GetEnvironmentVariable(VarName);
      
      // Replace placeholder with environment value
      if EnvValue <> '' then
        Result := EnvValue
      else
        Result := ''; // Return empty if env var not found
    end;
  end;
end;

end.
