import Component from '@glimmer/component';
import { deprecate } from '@ember/debug';

export default class AcmidmSwitchComponent extends Component {
  constructor() {
    super(...arguments);

    deprecate(
      'The <AcmidmSwitch> component is deprecated. Please use the <Acmidm::Switch> provider component instead.',
      false,
      {
        id: '@lblod/ember-acmidm-login.acmidm-switch.component',
        for: '@lblod/ember-acmidm-login',
        since: {
          enabled: '1.3.0',
        },
        until: '2.0.0',
      }
    );
  }
}
