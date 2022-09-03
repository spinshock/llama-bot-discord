import { config } from "dotenv";

export interface ILlamaConfig {
  DATABASE_URL: string;
  NODE_ENV: string;
  DISCORD_TOKEN: string;
  TTV_CLIENT_ID: string;
  TTV_CLIENT_SECRET: string;
}

export class LlamaConfig {
  constructor(
    private _nodeEnv: string = "",
    private _databaseUrl: string = "",
    private _discordToken: string = "",
    private _ttvClientId: string = "",
    private _ttvClientSecret: string = ""
  ) {}

  get databaseUrl(): string {
    return this._databaseUrl;
  }

  get isProd(): boolean {
    return this._nodeEnv === "production";
  }

  get discordToken(): string {
    return this._discordToken;
  }

  get ttvClientId(): string {
    return this._ttvClientId;
  }

  get ttvClientSecret(): string {
    return this._ttvClientSecret;
  }
}

const AppConfig = new LlamaConfig();

((): void => {
  const dotEnvConfigOutput = config();
  let parsedConfig: ILlamaConfig = {} as ILlamaConfig;

  if (process.env.NODE_ENV === "production") {
    parsedConfig.DATABASE_URL = process.env.DATABASE_URL || "";
    parsedConfig.DISCORD_TOKEN = process.env.DISCORD_TOKEN || "";
    parsedConfig.TTV_CLIENT_ID = process.env.TTV_CLIENT_ID || "";
    parsedConfig.TTV_CLIENT_SECRET = process.env.TTV_CLIENT_SECRET || "";
  } else {
    const error = dotEnvConfigOutput.error;
    if (error) {
      throw Error(
        "Unexpected error while reading .env\nPlease provide .env config"
      );
    }
    parsedConfig = (dotEnvConfigOutput as any)
      .parsed as unknown as ILlamaConfig;
    const missingConfigs = Object.values(parsedConfig).filter((val) => !val);
    if (missingConfigs.length) {
      throw new Error(
        "Provide config for keys:\n" +
          Object.keys(parsedConfig).reduce((keys, key) => keys + key + ",", "")
      );
    }
  }
  (AppConfig as any)._databaseUrl = parsedConfig.DATABASE_URL;
  (AppConfig as any)._nodeEnv = parsedConfig.NODE_ENV;
  (AppConfig as any)._discordToken = parsedConfig.DISCORD_TOKEN;
  (AppConfig as any)._ttvClientId = parsedConfig.TTV_CLIENT_ID;
  (AppConfig as any)._ttvClientSecret = parsedConfig.TTV_CLIENT_SECRET;
})();

export default AppConfig;
