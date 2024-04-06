import { warn } from '@ember/debug';

export default function normalizeConfig(config) {
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
