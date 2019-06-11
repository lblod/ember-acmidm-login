import Component from '@ember/component';
import layout from '../templates/components/acmidm-switch';
import { configurable } from 'torii/configuration';
import { inject } from '@ember/service';

export default Component.extend({
  layout,
  ajax: inject(),
  name: Object.freeze('acmidm-oauth2'), // used by configurable
  logoutUrl: configurable('logoutUrl'),
  clientId: configurable('apiKey'),
  returnUrl: configurable('switchUrl'),
  attributeBindings: ['disabled'],
  init() {
    this._super(...arguments);
    this.set('disabled', false);
  },
  async click() {
      this.set('disabled', true);
      await this.ajax.del('/sessions/current');
      window.location.replace(`${this.logoutUrl}?switch=true&client_id=${this.clientId}&post_logout_redirect_uri=${encodeURIComponent(this.returnUrl)}`);
  }
});
