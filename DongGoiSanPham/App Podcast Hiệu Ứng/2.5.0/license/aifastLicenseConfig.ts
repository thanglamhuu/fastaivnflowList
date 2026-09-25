export const LICENSE_CONFIG = {
  APP_NAME: "Podcast Hiệu Ứng Hiện Đại",
  PROJECT_ID: "3aya",
  ISSUER: "aifast-license-admin",
  AUDIENCE: "aifast-flow-offline"
} as const;
export const LICENSE_PUBLIC_JWK: JsonWebKey = {
  kty: "EC",
  crv: "P-256",
  x: "7TdV2OHoKXNzV-LruK2SkMcAa6fMOpg5D54GCfzaMo4",
  y: "yx77NMsDwomn4DB7P31v9495_s28-XzRomrxyNM3V8U",
  key_ops: ["verify"],
  ext: true
};