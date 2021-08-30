import Component from '@glimmer/component';
import { deprecate } from '@ember/debug';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AcmidmLogoutComponent extends Component {
  @service session;

  constructor() {
    super(...arguments);

    deprecate(
      'The <AcmidmLogout> component is deprecated. Please use the `invalidate` method of the `session` service instead.',
      false,
      {
        id: '@lblod/ember-acmidm-login.acmidm-logout.component',
        for: '@lblod/ember-acmidm-login',
        since: {
          enabled: '1.3.0',
        },
        until: '2.0.0',
      }
    );
  }

  @action
  logout() {
    this.session.invalidate();
  }
}
