import normalizeConfig from './normalize-config';

export default function buildUrlFromConfig(providerConfig) {
  const config = normalizeConfig(providerConfig);
  return (
    `${config.baseUrl}?response_type=code&` +
    `client_id=${config.clientId}&` +
    `redirect_uri=${encodeURIComponent(config.redirectUrl)}&` +
    `scope=${config.scope}`
  );
}
