import Component from '@ember/component';
import layout from '../templates/components/acmidm-login';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  session: service('session'),
  actions: {
    login() {
      this.set('errorMessage', '');
      this.session.authenticate('authenticator:torii', 'acmidm-oauth2').catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});
