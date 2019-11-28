import Component from '@ember/component';
import layout from '../templates/components/acmidm-logout';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  tagName: 'button',
  session: service('session'),
  click() {
    this.session.invalidate();
  }
});
