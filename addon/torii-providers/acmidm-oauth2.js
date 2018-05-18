import Oauth2 from 'torii/providers/oauth2-code';
import { configurable } from 'torii/configuration';
import { computed } from '@ember/object';

/**
 * This class implements authentication against ACM/IDM
 * using the OAuth2 authorization flow in a popup window.
 */
export default Oauth2.extend({
  name: 'acmidm-oauth2',

  baseUrl: computed('environment', function() {
    if (this.environment == 'production')
      return 'https://authenticatie.vlaanderen.be/op/v1/auth';
    else
      return 'https://authenticatie-ti.vlaanderen.be/op/v1/auth';
  }),

  requiredUrlParams: Object.freeze(['response_type', 'client_id', 'redirect_uri', 'scope']),
  optionalUrlParams: Object.freeze([]),
  responseParams: Object.freeze(['code']),

  environment: configurable('environment', 'production'),
  scope: configurable('scope', 'openid'),

  redirectUri: configurable('redirectUri', function() {
    return this._super();
  })
});
