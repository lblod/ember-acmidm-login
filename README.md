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
ember install @lblod/ember-acmidm-login
```


Usage
------------------------------------------------------------------------------
Make sure you've configured the [acmidm-login-service](https://github.com/lblod/acmidm-login-service) correctly in your project. The config should match the config provided to this addon.
The addon currently requires the service to be available under `/sessions`.

### install ember-simple-auth
```sh
npm install ember-simple-auth@4
```

in your application route setup the service
```js
// app/routes/application.js

import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),

  beforeModel() {
    return this.session.setup();
  },
});
```

### logging in
Step 1 is redirecting to ACM/IDM by providing the correct OAUth2 values. If you're upgrading from version 1 you can use the following code to build the URL:
```js
import Component from '@glimmer/component';
import config from 'your-app/config/environment';
import buildUrlFromConfig from '@lblod/ember-acmidm-login/utils/build-url-from-config';
const providerConfig = config.torii.providers['acmidm-oauth2'];

export default class VoPageComponent extends Component {
  loginUrl = buildUrlFromConfig(providerConfig);
}
```

```hbs
<a href={{this.loginUrl}}>Login</a>
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

export default class CallbackRoute extends Route {
  @service session;

  queryParams = ['code'];
  beforeModel() {
    // redirect to index if already authenticated
    this.session.prohibitAuthentication('index');
  }
  
  async model(params) {
    this.session.authenticate('authenticator:acm-idm', params.code);
  }
}
```

### logging out

```hbs
{{!-- app/templates/application.hbs --}}
<div class="menu">
  …
  {{#if this.session.isAuthenticated}}
    <a {{on "click" this.invalidateSession}}>Logout</a>
  {{else}}
    {{#link-to 'login'}}Login{{/link-to}}
  {{/if}}
 <a {{on "click" this.invalidateSession}}>Logout</a>
 </div>
 <div class="main">
  {{outlet}}
</div>
```

```js
// app/controllers/application.js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
export default class ApplicationController extends Controller {
  @service session;

  …
  
  @action
  async invalidateSession() {
    try {
      await this.session.invalidate();
    }
    catch(e) {
      // error handling
    }
  }
}
```

### loading current user on validation and redirecting to acmidm logout url on succesfull invalidation
It's often useful to extend the base session service to hook into the `handleAuthentication` and `handleInvalidation` events of ember-simple-auth. An example is given below 

```js
// app/services/session.js
import { inject as service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';
import config from 'your-app/config/environment';

const providerConfig = config.torii.providers['acmidm-oauth2'];
export default class SessionService extends BaseSessionService {
  @service currentSession;

  handleAuthentication(routeAfterAuthentication) {
    super.handleAuthentication(routeAfterAuthentication);
    this.currentSession.load();
  }

  handleInvalidation() {

    const logoutUrl = providerConfig.logoutUrl;
    super.handleInvalidation(logoutUrl);
  }
}

```
Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
