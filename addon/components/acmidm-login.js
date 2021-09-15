import Component from '@glimmer/component';
import { deprecate } from '@ember/debug';

export default class AcmidmLoginComponent extends Component {
  constructor() {
    super(...arguments);

    deprecate(
      'The <AcmidmLogin> component is deprecated. Please use the <Acmidm::Login> provider component instead.',
      false,
      {
        id: '@lblod/ember-acmidm-login.acmidm-login.component',
        for: '@lblod/ember-acmidm-login',
        since: {
          enabled: '1.3.0',
        },
        until: '2.0.0',
      }
    );
  }
}
