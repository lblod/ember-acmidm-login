import Oauth2 from 'torii/providers/oauth2-code';
import { getOwner } from '@ember/application';

/**
 * This class implements authentication against ACM/IDM
 * using the OAuth2 authorization flow in a popup window.
 */
export default class AcmidmOAuth2 extends Oauth2 {
  name = 'acmidm-oauth2';
  requiredUrlParams = ['response_type', 'client_id', 'redirect_uri', 'state'];
  optionalUrlParams = 'scope';
  responseParams = 'code';

  constructor() {
    super(...arguments);
    const config =
      getOwner(this).resolveRegistration('config:environment')?.torii;
    const providerConfig = config?.providers
      ? config.providers[this.name]
      : null;
    if (!providerConfig) {
      throw `Could not find ${this.name} configuration, make sure it is set in your application environment`;
    }

    this.baseUrl = providerConfig.baseUrl;
    this.scope = providerConfig.scope || 'openid';
    this.redirectUri = providerConfig.redirectUri;
  }

  open(options) {
    const opts = Object.assign({}, options, {
      resizable: true,
      scrollbars: true,
    });
    return super.open(opts);
  }
}
