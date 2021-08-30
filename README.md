ember-acmidm-login
==============================================================================

Ember addon providing an Ember Simple Auth authenticator for ACM/IDM and a simple login and logout component.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install @lblod/ember-acmidm-login
```


Usage
------------------------------------------------------------------------------
Add the following configuration of the ACM/IDM OpenId provider to `config/environment.js`:

```javascript
torii: {
  disableRedirectInitializer: true,
  providers: {
    'acmidm-oauth2': {
      apiKey: 'your-key',
      baseUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/auth',
      scope: 'openid rrn vo profile',
      redirectUri: 'https://loket.lblod.info/authorization/callback',
      logoutUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/logout',
      switchUrl: 'https://loket.lblod.info/switch-login' //optional
    }
  }
}
```

Add the [acmidm-login-service](http://github.com/lblod/acmidm-login-service) in the backend to provide the necessary API endpoints.

Configure authentication with [ember-simple-auth](https://github.com/simplabs/ember-simple-auth) and put the `{{acmidm-login}}` and `{{acmidm-logout}}` components on the appropriate pages. They will handle authentication with ACM/IDM automatically.

Finally, overwrite the `sessionInvalidated` event handler of Ember Simple Auth's `application-route-mixin`:

```javascript
import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import ENV from 'frontend-loket/config/environment';

export default Route.extend(ApplicationRouteMixin, {
  sessionInvalidated() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    window.location.replace(logoutUrl);
  }
}
```

To support switching without doing a full logout, set the appriopriate switchUrl in the torii configuration, add a `{{acmidm-switch}}` component and set up a switch route. This route should trigger a login, for example:

```javascript
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default Route.extend(UnauthenticatedRouteMixin, {
  session: service(),
  async model() {
    try {
      await this.session.authenticate('authenticator:torii', 'acmidm-oauth2');
    }
    catch(e) {
      return 'Fout bij het aanmelden. Gelieve opnieuwe te proberen.';
    }
  }
});
```

Note that this url should be registered with acm/idm

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.

NOTE: There's currently an issue when using this addon with npm link when using in a host app with ember-source < 3.27, see [this comment](https://github.com/lblod/ember-acmidm-login/pull/4#issuecomment-907618192) for more information.

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
