import { inject as service } from '@ember/service';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';

/**
 * ACM/IDM OAuth2 authenticator
*/
export default ToriiAuthenticator.extend({
  torii: service(),
  ajax: service(),

  basePath: 'sessions',
  toriiProvider: 'acmidm-oauth2',

  authenticate() {
    return this._super(...arguments).then((data) => { // get authorization code through Torii
      return this.ajax.request(this.basePath, {
        type: 'POST',
        dataType: 'json',
        contentType: 'application/vnd.api+json',
        data: JSON.stringify({
          authorizationCode: data.authorizationCode
        })
      }).then((response) => {
        response.provider = this.get('toriiProvider'); // required to make session restore work
        return response;
      });
    });
  },

  invalidate() {
    return this._super(...arguments).then( () => {
      const path = `${this.basePath}/current`;
      return this.ajax.del(path);
    });
  },

  restore() {
    return this._super(...arguments).then( () => {
      const path = `${this.basePath}/current`;
      return this.ajax.request(path);
    });
  }
});
