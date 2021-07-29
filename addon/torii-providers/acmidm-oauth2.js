import Oauth2 from 'torii/providers/oauth2-code';
import { configurable } from 'torii/configuration';
import { merge } from '@ember/polyfills';

/**
 * This class implements authentication against ACM/IDM
 * using the OAuth2 authorization flow in a popup window.
 */
export default Oauth2.extend({
  name: 'acmidm-oauth2',

  baseUrl: configurable('baseUrl'),

  requiredUrlParams: Object.freeze([
    'response_type',
    'client_id',
    'redirect_uri',
    'state',
  ]),
  optionalUrlParams: Object.freeze(['scope']),
  responseParams: Object.freeze(['code']),

  scope: configurable('scope', 'openid'),

  redirectUri: configurable('redirectUri', function () {
    return this._super();
  }),

  open(options) {
    merge(options, { resizable: true, scrollbars: true });
    return this._super(options);
  },
});
