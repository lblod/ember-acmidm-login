ember-acmidm-login
==============================================================================
Ember addon providing an Ember Simple Auth authenticator for ACM/IDM in a semantic.works stack.

## Tutorials
### Install the addon in your application
To add the ember-acmidm-login addon to your application, execute the following install commands:

```bash
ember install @lblod/ember-acmidm-login
npm install ember-simple-auth@6
```

Make sure you've configured the [acmidm-login-service](https://github.com/lblod/acmidm-login-service) (or any fork) correctly in your project. The addon currently requires the service endpoints to be available under `/sessions`.

Configure the following variables via `ENV.acmidm` in `config/environment.js`. The values must match the config provided to the backend login service.

```js
// config/environment.js

module.exports = function (environment) {
  const ENV = {
    ...,
    acmidm: {
      apiKey: 'your-client-id',
      baseUrl: 'https://authenticatie.vlaanderen.be/op/v1/auth',
      redirectUri: 'https://myapp.vlaanderen.be/authorization/callback',
      logoutUrl: 'https://authenticatie.vlaanderen.be/op/v1/logout',
      scope: 'openid vo profile'
    }
  };
}
```

In your application route initialize the Ember Simple Auth session service:

```js
// app/routes/application.js

import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service session;

  beforeModel() {
    return this.session.setup();
  }
}
```

## How-to guides
### Add login to your app
First step is to create a login link/button which redirects to ACM/IDM. The login URL can be constructed as follows in the controller/component where you want to show a login button:

```js
import Controller from '@ember/controller';
import ENV from 'your-app/config/environment';
import buildUrlFromConfig from '@lblod/ember-acmidm-login/utils/build-url-from-config';

export default class LoginController extends Controller {
  loginUrl = buildUrlFromConfig(ENV.acmidm);
}
```

In the template simply add the following:
```hbs
<a href={{this.loginUrl}}>Login</a>
```

Next, set up a route and controller to handle the callback from ACM/IDM after authentication. The route must match the path of the redirect URL and will receive an authorization code as query param:
```js
// app/routes/authentication/callback.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticationCallbackRoute extends Route {
  @service session;

  beforeModel() {
    // redirect to index if already authenticated
    this.session.prohibitAuthentication('index');
  }

  model(params) {
    this.session.authenticate('authenticator:acm-idm', params.code);
  }
}
```

```js
// app/controllers/authentication/callback.js
import Controller from '@ember/controller';

export default class AuthenticationCallbackController extends Controller {
  queryParams = ['code'];
}
```

The model hook will pass the authorization code to the ACM/IDM authenticator which will on its turn communicate with the backend to log in the user.

Have a look at the Ember Simple Auth documentation to learn how to protect your routes from unauthenticated access.

### Add a logout button to your app
Create a controller (or component) that injects the `session` service and handles a session invalidation action as follows:

```js
// app/controllers/application.js
import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @service session;

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

Next, show a logout button on your page if the user is logged in
```hbs
{{!-- app/templates/application.hbs --}}
{{#if this.session.isAuthenticated}}
  <a {{on "click" this.invalidateSession}}>Logout</a>
{{/if}}
```

Finally, we need to make sure to terminate the session on the ACM/IDM side as well by redirecting the user to a logout URL when the session gets invalidated. To do so, extend Ember Simple Auth's session service to hook into the `handleInvalidation` event:

```js
// app/services/session.js
import BaseSessionService from 'ember-simple-auth/services/session';
import ENV from 'your-app/config/environment';

export default class SessionService extends BaseSessionService {
  handleInvalidation() {
    const logoutUrl = ENV.acmidm.logoutUrl;
    super.handleInvalidation(logoutUrl);
  }
}

```

### Load user information on authentication
Extend Ember Simple Auth's session service to hook into the `handleAuthentication` event and request some user info from the backend. For example:

```js
// app/services/session.js
import { service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';

export default class SessionService extends BaseSessionService {
  @service userInfo;

  handleAuthentication(routeAfterAuthentication) {
    super.handleAuthentication(routeAfterAuthentication);
    // do anything you want to load user info from the backend
    this.userInfo.load();
  }
}

```

### Switch sessions via ACM/IDM
Sometimes an app needs to allow users to switch their session (e.g. to another administrative unit they belong to). In this scenario, the session in our application will be ended and the user is redirected to an URL on ACM/IDM where he can execute the switch. ACM/IDM will then call the callback URL and the user gets logged in with his new identity as in the regular login flow.

First, add a `switchUrl` to the `acmidm` config in `config/environment.js`:
```js
// config/environment.js 

  ENV.acmidm = {
    ... // other config
    switchRedirectUrl: 'url-to-your-callback-route'
  };
```

Next, set up a route `authentication.switch` which will redirect the user to the switch URL of ACM/IDM.

```js
// app/routes/authentication/switch.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ENV from 'your-app/config/environment';

export default class AuthenticationSwitchRoute extends Route {
  @service router;
  @service session;

  async beforeModel(transition) {
    // ensure the user is logged in
    this.session.requireAuthentication(transition, 'login');

    try {
      await this.session.invalidate();
      const switchURL = buildSwitchUrl(ENV.acmidm);
      window.location.replace(switchURL);
    } catch (error) {
      // Handle error
    }
  }
}

function buildSwitchUrl({ logoutUrl, apiKey, switchRedirectUrl }) {
  let switchUrl = new URL(logoutUrl);
  let searchParams = switchUrl.searchParams;

  searchParams.append('switch', true);
  searchParams.append('client_id', apiKey);
  searchParams.append('post_logout_redirect_uri', switchRedirectUrl);

  return switchUrl.href;
}
```

Finally, add a link to the switch-route in your template
```hbs
<LinkTo route="authentication.switch">Switch session</LinkTo>
```

## Reference
### Configuration
The following options can be configured via the `ENV.acmidm` object in `config/environment.js`. It's important that the values match the configuration of the backend login service.

The following options are required: 
- `baseUrl`: ACM/IDM auth endpoint, typically https://authenticatie.vlaanderen.be/op/v1/auth
- `apiKey`: the client ID of this application (naming of the attribute is historic)
- `redirectUri`: URL of the page ACM/IDM needs to redirect to after authentication. You'll need to set up a route to capture this. E.g. https://myapp.vlaanderen.be/authorization/callback
- `scope`: Space-separated string of scopes ACM/IDM must grant access for. E.g. `'openid vo profile'`

The following options can be optionally provided:
- `logoutUrl`: ACM/IDM logout endpoint, typically https://authenticatie.vlaanderen.be/op/v1/logout
- `switchRedirectUrl`: URL of the page ACM/IDM needs to redirect to after switching. You'll need to set up a route to capture this. Typically the same value as for `redirectUri` can be used.

