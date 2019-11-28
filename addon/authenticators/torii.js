import { inject as service } from '@ember/service';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import fetch, { Headers } from 'fetch';

/**
 * ACM/IDM OAuth2 authenticator
*/
export default ToriiAuthenticator.extend({
  torii: service(),

  basePath: 'sessions',
  toriiProvider: 'acmidm-oauth2',

  async authenticate() {
    const data = await this._super(...arguments); // get authorization code through Torii
    const result = await fetch(this.basePath, {
      type: 'POST',
      headers: new Headers({
        'Content-Type': 'application/vnd.api+json'
      }),
      body: JSON.stringify({
        authorizationCode: data.authorizationCode
      })
    });

    if (result.ok) {
      const response = result.json();
      response.provider = this.get('toriiProvider'); // required to make session restore work
      return response;
    } else {
      throw result;
    }
  },

  async invalidate() {
    const result = await fetch(`${this.basePath}/current`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/vnd.api+json'
      })
    });

    if (result.ok)
      return result;
    else
      throw result;
  },

  async restore() {
    await this._super(...arguments);
    const result = await fetch(`${this.basePath}/current`, {
      type: 'GET',
      headers: new Headers({
        'Content-Type': 'application/vnd.api+json'
      })
    });

    if (result.ok)
      return result.json();
    else
      throw result;
  }
});
