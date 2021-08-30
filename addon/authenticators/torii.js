import { inject as service } from '@ember/service';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import fetch, { Headers } from 'fetch';

const basePath = '/sessions';
const toriiProvider = 'acmidm-oauth2';

/**
 * ACM/IDM OAuth2 authenticator
 */
export default class AcmIdmOAuth2Authenticator extends ToriiAuthenticator {
  @service torii;

  async authenticate() {
    const data = await super.authenticate(...arguments); // get authorization code through Torii
    const result = await fetch(basePath, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/vnd.api+json',
      }),
      body: JSON.stringify({
        authorizationCode: data.authorizationCode,
      }),
    });

    if (result.ok) {
      const response = await result.json();
      response.provider = toriiProvider; // required to make session restore work
      return response;
    } else {
      throw result;
    }
  }

  async invalidate() {
    const result = await fetch(`${basePath}/current`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/vnd.api+json',
      }),
    });

    if (result.ok) return result;
    else throw result;
  }

  async restore() {
    await super.restore(...arguments);
    const result = await fetch(`${basePath}/current`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/vnd.api+json',
      }),
    });

    if (result.ok) {
      const response = await result.json();
      response.provider = toriiProvider; // required to make session restore work
      return response;
    } else {
      throw result;
    }
  }
}
