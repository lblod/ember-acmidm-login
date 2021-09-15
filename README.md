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
      apiKey: 'your-key', // also called clientId
      baseUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/auth',
      scope: 'openid rrn vo profile',
      redirectUri: 'https://loket.lblod.info/authorization/callback',
      logoutUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/logout',
      returnUrl: 'https://loket.lblod.info/switch-login' //optional
    }
  }
}
```

Add the [acmidm-login-service](http://github.com/lblod/acmidm-login-service) in the backend to provide the necessary API endpoints.

Configure authentication with [ember-simple-auth](https://github.com/simplabs/ember-simple-auth) and put the `Acmidm::Login` and `Acmidm::Switch` components on the appropriate pages. They will handle authentication with ACM/IDM automatically.

### Acmidm::Login
```handlebars
<Acmidm::Login as |acmidm|>
  <button type="button" {{on "click" acmd.login}}>login</button>
  {{#if acmidm.errorMessage}}
    <div class="error">{{acmdidm.errorMessage</div>
  {{/if}}
</Acmidm::Login>
```

### Acmidm::Switch
To support switching without doing a full logout, set the appriopriate returnUrl in the torii configuration. add a `Acmidm::Switch` component and set up a switch route. Note that the returnUrl should be registered with acm/idm.


an example:
```handlebars
{{!-- app/components/switch.hbs }}
<Acmidm::Switch as |acmidm|>
  <button ...attributes disabled={{acmidm.isSwitching}} type="button" {{on "click" acmidm.switch}}>
    {{#if (has-block)}}
      {{yield}}
    {{else}}
      Wissel van bestuurseenheid
    {{/if}}
  </button>
</Acmidm::Switch>
```


```javascript
// app/routes/switch-login.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SwitchLoginRoute extends Route {
  @service() session;

  beforeModel(){
    this.session.prohibitAuthentication('index');
  }

  async model() {
    try {
      return await this.session.authenticate('authenticator:torii', 'acmidm-oauth2');
    }
    catch(e) {
      return 'Fout bij het aanmelden. Gelieve opnieuw te proberen.';
    }
  }
}
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.

NOTE: There's currently an issue when using this addon with npm link when using in a host app with ember-source < 3.27, see [this comment](https://github.com/lblod/ember-acmidm-login/pull/4#issuecomment-907618192) for more information.

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
