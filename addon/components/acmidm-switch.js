import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import fetch from 'fetch';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class AcmIdmSwitchComponent extends Component {
  @tracked disabled = false;
  constructor() {
    super(...arguments);
    const config =
      getOwner(this).resolveRegistration('config:environment')?.torii;
    const providerConfig = config?.providers
      ? config.providers['acmidm-oauth2']
      : null;
    if (!providerConfig) {
      throw 'could not find acmidm-oauth2 configuration, make sure it is set in your application environment';
    }
    this.logoutUrl = providerConfig.logoutUrl;
    this.clientId = providerConfig.clientId;
    this.returnUrl = providerConfig.returnUrl;
  }

  @action
  async switch() {
    this.disabled = true;
    try {
      await fetch('/sessions/current', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      window.location.replace(
        `${this.logoutUrl}?switch=true&client_id=${
          this.clientId
        }&post_logout_redirect_uri=${encodeURIComponent(this.returnUrl)}`
      );
    } catch (e) {
      this.disabled = false;
    }
  }
}
