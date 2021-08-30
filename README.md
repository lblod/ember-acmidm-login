ember-acmidm-login
==============================================================================

Ember addon providing an Ember Simple Auth authenticator for ACM/IDM and a simple login and switch component.


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

Configure authentication with [ember-simple-auth](https://github.com/simplabs/ember-simple-auth) and put the `<Acmidm::Login>` component on the appropriate pages. This will handle authentication with ACM/IDM automatically. 

> The `<Acmidm::Login>` component does not output any HTML so your project will need to provide this. A usage example can be found [in the dummy app](https://github.com/lblod/ember-acmidm-login/blob/91bcd31655b27b51dce47ed25b67a64d7a15049b/tests/dummy/app/templates/application.hbs#L14-L31).

Finally, extend Ember Simple Auth's `SessionService` and override the `handleInvalidation` method:

```javascript
import { inject as service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';
import ENV from 'app-name/config/environment';

export default class SessionService extends BaseSessionService {
  @service currentSession;

  handleInvalidation() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    super.handleInvalidation(logoutUrl);
  }
}
```

### User account switching

To support switching accounts without doing a full logout, set the appropriate `switchUrl` in the torii configuration and set up a switch route. This route should trigger a login, for example:

```javascript
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SwitchRoute extends Route {
  @service session;

  async model() {
    try {
      await this.session.authenticate('authenticator:torii', 'acmidm-oauth2');
    }
    catch(e) {
      return 'Fout bij het aanmelden. Gelieve opnieuwe te proberen.';
    }
  }
}
```

Note that this url should be registered with ACM/IDM

After the switch route is created you can add the `<Acmidm::Switch>` component were needed.

> The `<Acmidm::Switch>` component does not output any HTML so your project will need to provide this. A usage example can be found [in the dummy app](https://github.com/lblod/ember-acmidm-login/blob/e6fec45958e626db04269cd233d5549fa5e88e23/tests/dummy/app/templates/application.hbs#L7-L11).

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
