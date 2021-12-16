import Base from 'ember-simple-auth/authenticators/base';
const basePath = '/sessions';

export default class AcmidmAuthenticator extends Base {
  async restore() {
    const result = await fetch(`${basePath}/current`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/vnd.api+json',
      }),
    });

    if (result.ok) {
      const response = await result.json();
      return response;
    } else {
      throw result;
    }
  }

  async authenticate(authorizationCode) {
    const result = await fetch(basePath, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/vnd.api+json',
      }),
      body: JSON.stringify({
        authorizationCode: authorizationCode,
      }),
    });

    if (result.ok) {
      const response = await result.json();
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
}
