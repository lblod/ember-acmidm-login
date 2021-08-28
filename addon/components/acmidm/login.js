import { warn } from '@ember/debug';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class AcmIdmLoginComponent extends Component {
  @service session;

  @tracked errorMessage = '';
  @tracked isAuthenticating = false;

  @action
  async login() {
    this.errorMessage = '';
    this.isAuthenticating = true;

    try {
      await this.session.authenticate('authenticator:torii', 'acmidm-oauth2');
    } catch (reason) {
      warn(reason.error || reason, { id: 'authentication.failure' });

      if (reason.status == 403) {
        this.errorMessage = 'U heeft geen toegang tot deze applicatie.';
      } else {
        this.errorMessage =
          'Fout bij het aanmelden. Gelieve opnieuw te proberen.';
      }
    } finally {
      this.isAuthenticating = false;
    }
  }
}
