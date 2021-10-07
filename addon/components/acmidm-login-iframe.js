import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AcmidmLoginIframeComponent extends Component {
  @service session;
  @tracked errorMessage = '';
  @tracked isAuthenticating = false;
  providerConfig;
  url;

  constructor() {
    super(...arguments);

    const config =
      getOwner(this).resolveRegistration('config:environment')?.torii;

    this.providerConfig = config?.providers
      ? config.providers['acmidm-oauth2']
      : null;

    if (!this.providerConfig) {
      throw 'could not find acmidm-oauth2 configuration, make sure it is set in your application environment';
    }
    this.url =
      `${this.providerConfig.baseUrl}?response_type=code&` +
      `client_id=${this.providerConfig.apiKey}&` +
      `redirect_uri=${encodeURIComponent(this.providerConfig.redirectUri)}&` +
      `scope=${this.providerConfig.scope}`;
  }

  @action
  async detectLogin(event) {
    const iframe = event.target;
    if (iframe) {
      try {
        // this will only succeed if we return to our own app;
        const location = iframe.contentWindow.location;
        const params = new URL(location).searchParams;
        const authorizationCode = params.get('code');
        if (!authorizationCode) {
          this.errorMessage = 'Did not receive auth code';
        }
        this.session.authenticate('authenticator:acmidm', authorizationCode);
      } catch (e) {
        // assume we loaded the remote href
        this.errorMessage = e;
        console.error(e);
      }
    }
  }
}
