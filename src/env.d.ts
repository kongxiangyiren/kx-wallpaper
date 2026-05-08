interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly TSDOWN_PROTOCOL: string;
  readonly TSDOWN_APP_NAME: string;
}
