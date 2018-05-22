ember-acmidm-login
==============================================================================

Ember addon providing an Ember Simple Auth authenticator for ACM/IDM and a simple login and logout component.

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
      apiKey: 'your-key'
      baseUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/auth',
      scope: 'openid rrn vo profile',
      redirectUri: 'https://loket.lblod.info/authorization/callback',
      logoutUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/logout'
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
Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-acmidm-login`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
