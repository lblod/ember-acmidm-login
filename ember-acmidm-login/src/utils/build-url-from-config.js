import { warn } from '@ember/debug';

function normalizeConfig(config) {
  warn(
    `Use of config 'acmidm.apiKey' is deprecated. Use 'acmidm.clientId' instead.`,
    !config.apiKey,
    { id: 'ember-acmidm-login.config.apiKey' }
  );
  warn(
    `Use of config 'acmidm.redirectUri' is deprecated. Use 'acmidm.redirectUrl' instead.`,
    !config.redirectUri,
    { id: 'ember-acmidm-login.config.redirectUri' }
  );

  const normalizedConfig = Object.assign({}, config);
  if (normalizedConfig.apiKey && !normalizedConfig.clientId) {
    normalizedConfig.clientId = normalizedConfig.apiKey;
    delete normalizedConfig.apiKey;
  }

  if (normalizedConfig.redirectUri && !normalizedConfig.redirectUrl) {
    normalizedConfig.redirectUrl = normalizedConfig.redirectUri;
    delete normalizedConfig.redirectUri;
  }

  return normalizedConfig;
}

export default function buildUrlFromConfig(providerConfig) {
  const config = normalizeConfig(providerConfig);
  return (
    `${config.baseUrl}?response_type=code&` +
    `client_id=${config.clientId}&` +
    `redirect_uri=${encodeURIComponent(config.redirectUrl)}&` +
    `scope=${config.scope}`
  );
}
