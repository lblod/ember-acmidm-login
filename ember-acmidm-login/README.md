ember-acmidm-login
==============================================================================
Ember addon providing an Ember Simple Auth authenticator for ACM/IDM in a semantic.works stack.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.28 or above
* Embroider or ember-auto-import v2
* ember-simple-auth >= 4.2


Installation
------------------------------------------------------------------------------

```
ember install ember-acmidm-login
```


Usage
------------------------------------------------------------------------------
Make sure you've configured the (acmidm-login-service)[https://github.com/lblod/acmidm-login-service] correctly in your project. The config should match the config provided to this addon.
The addon currently requires the service to be available under `/sessions`.

### logging in
Step 1 is redirecting to ACM/IDM by providing the correct OAUth2 values. If you're upgrading from version 1 you can use the following code to build the URL:
```js
import Component from '@glimmer/component';
import config from 'frontend-gelinkt-notuleren/config/environment';
import buildUrlFromConfig from '@lblod/ember-acmidm-login/utils/build-url-from-config';
const providerConfig = config.torii.providers['acmidm-oauth2'];

export default class VoPageComponent extends Component {
  loginUrl = buildUrlFromConfig(providerConfig);
}
```

In other cases either build the URL yourself or use the helper mentioned above.

providerConfig requires the following attributes:
- `baseUrl`: acm/idm endpoint, typically https://authenticatie.vlaanderen.be/op/v1/auth
- `apiKey`: the client_id of this client (naming of the attribute is historic)
- `redirectUri`: page ACM/IDM needs to redirect to, you'll need to set up a route for this
- `scope`: [optional] scope you're requesting

Next set up a route matching the redirectUrl to capture the returned token and authenticate with it:
```js
// /app/routes/callback.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service session;

  queryParams = ['code'];
  model(params) {
    this.session.authenticate('authenticator:acmidm', params.code);
  }
}
```

### logging out
```js
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
