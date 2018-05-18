import { debug, warn } from '@ember/debug';
import { inject as service } from '@ember/service';
import config from '../config/environment';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';

/**
 * ACM/IDM OAuth2 authenticator
*/
export default ToriiAuthenticator.extend({
  torii: service(),
  ajax: service(),

  basePath: 'sessions',
  toriiProvider: 'acmidm-oauth2',

  async authenticate() {
    const data = await this._super(...arguments); // get authorization code through Torii
    const session = await this.ajax.request(this.basePath, {
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        authorizationCode: data.authorizationCode
      })
    });
    return session;
  },

  async invalidate() {
    const path = `${this.basePath}/current`;
    const session = await this.ajax.del(path);
    return session;
  },

  async restore() {
    const path = `${this.basePath}/current`;
    const session = await this.ajax.request(path);
    return session;
  }
});
