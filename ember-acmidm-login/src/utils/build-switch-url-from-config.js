import normalizeConfig from './normalize-config';

export default function buildSwitchUrl(providerConfig) {
  const config = normalizeConfig(providerConfig);

  let switchUrl = new URL(config.logoutUrl);
  let searchParams = switchUrl.searchParams;
  searchParams.append('switch', true);
  searchParams.append('client_id', config.clientId);
  searchParams.append('post_logout_redirect_uri', config.switchRedirectUrl);

  return switchUrl.href;
}
