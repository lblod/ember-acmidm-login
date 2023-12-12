export default function buildUrlFromConfig(providerConfig) {
  return (
    `${providerConfig.baseUrl}?response_type=code&` +
    `client_id=${providerConfig.apiKey}&` +
    `redirect_uri=${encodeURIComponent(providerConfig.redirectUri)}&` +
    `scope=${providerConfig.scope}`
  );
}
