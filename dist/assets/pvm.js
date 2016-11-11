"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('pvm/app', ['exports', 'ember', 'pvm/resolver', 'ember-load-initializers', 'pvm/config/environment'], function (exports, _ember, _pvmResolver, _emberLoadInitializers, _pvmConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _pvmConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _pvmConfigEnvironment['default'].podModulePrefix,
    Resolver: _pvmResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _pvmConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('pvm/blueprints/ember-material-lite', ['exports', 'ember-material-lite/blueprints/ember-material-lite'], function (exports, _emberMaterialLiteBlueprintsEmberMaterialLite) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteBlueprintsEmberMaterialLite['default'];
    }
  });
});
define('pvm/components/mdl-button', ['exports', 'ember-material-lite/components/mdl-button'], function (exports, _emberMaterialLiteComponentsMdlButton) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlButton['default'];
    }
  });
});
define('pvm/components/mdl-card-actions', ['exports', 'ember-material-lite/components/mdl-card-actions'], function (exports, _emberMaterialLiteComponentsMdlCardActions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlCardActions['default'];
    }
  });
});
define('pvm/components/mdl-card-buttons', ['exports', 'ember-material-lite/components/mdl-card-buttons'], function (exports, _emberMaterialLiteComponentsMdlCardButtons) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlCardButtons['default'];
    }
  });
});
define('pvm/components/mdl-card', ['exports', 'ember-material-lite/components/mdl-card'], function (exports, _emberMaterialLiteComponentsMdlCard) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlCard['default'];
    }
  });
});
define('pvm/components/mdl-checkbox', ['exports', 'ember-material-lite/components/mdl-checkbox'], function (exports, _emberMaterialLiteComponentsMdlCheckbox) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlCheckbox['default'];
    }
  });
});
define('pvm/components/mdl-footer-dropdown-section', ['exports', 'ember-material-lite/components/mdl-footer-dropdown-section'], function (exports, _emberMaterialLiteComponentsMdlFooterDropdownSection) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlFooterDropdownSection['default'];
    }
  });
});
define('pvm/components/mdl-footer-linklist', ['exports', 'ember-material-lite/components/mdl-footer-linklist'], function (exports, _emberMaterialLiteComponentsMdlFooterLinklist) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlFooterLinklist['default'];
    }
  });
});
define('pvm/components/mdl-footer-section', ['exports', 'ember-material-lite/components/mdl-footer-section'], function (exports, _emberMaterialLiteComponentsMdlFooterSection) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlFooterSection['default'];
    }
  });
});
define('pvm/components/mdl-icon-toggle', ['exports', 'ember-material-lite/components/mdl-icon-toggle'], function (exports, _emberMaterialLiteComponentsMdlIconToggle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlIconToggle['default'];
    }
  });
});
define('pvm/components/mdl-icon', ['exports', 'ember-material-lite/components/mdl-icon'], function (exports, _emberMaterialLiteComponentsMdlIcon) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlIcon['default'];
    }
  });
});
define('pvm/components/mdl-mega-footer', ['exports', 'ember-material-lite/components/mdl-mega-footer'], function (exports, _emberMaterialLiteComponentsMdlMegaFooter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlMegaFooter['default'];
    }
  });
});
define('pvm/components/mdl-menu-item', ['exports', 'ember-material-lite/components/mdl-menu-item'], function (exports, _emberMaterialLiteComponentsMdlMenuItem) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlMenuItem['default'];
    }
  });
});
define('pvm/components/mdl-menu', ['exports', 'ember-material-lite/components/mdl-menu'], function (exports, _emberMaterialLiteComponentsMdlMenu) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlMenu['default'];
    }
  });
});
define('pvm/components/mdl-mini-footer', ['exports', 'ember-material-lite/components/mdl-mini-footer'], function (exports, _emberMaterialLiteComponentsMdlMiniFooter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlMiniFooter['default'];
    }
  });
});
define('pvm/components/mdl-nav-item', ['exports', 'ember-material-lite/components/mdl-nav-item'], function (exports, _emberMaterialLiteComponentsMdlNavItem) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlNavItem['default'];
    }
  });
});
define('pvm/components/mdl-nav', ['exports', 'ember-material-lite/components/mdl-nav'], function (exports, _emberMaterialLiteComponentsMdlNav) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlNav['default'];
    }
  });
});
define('pvm/components/mdl-progress', ['exports', 'ember-material-lite/components/mdl-progress'], function (exports, _emberMaterialLiteComponentsMdlProgress) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlProgress['default'];
    }
  });
});
define('pvm/components/mdl-radio', ['exports', 'ember-material-lite/components/mdl-radio'], function (exports, _emberMaterialLiteComponentsMdlRadio) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlRadio['default'];
    }
  });
});
define('pvm/components/mdl-slider', ['exports', 'ember-material-lite/components/mdl-slider'], function (exports, _emberMaterialLiteComponentsMdlSlider) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlSlider['default'];
    }
  });
});
define('pvm/components/mdl-spinner', ['exports', 'ember-material-lite/components/mdl-spinner'], function (exports, _emberMaterialLiteComponentsMdlSpinner) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlSpinner['default'];
    }
  });
});
define('pvm/components/mdl-switch', ['exports', 'ember-material-lite/components/mdl-switch'], function (exports, _emberMaterialLiteComponentsMdlSwitch) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlSwitch['default'];
    }
  });
});
define('pvm/components/mdl-tab', ['exports', 'ember-material-lite/components/mdl-tab'], function (exports, _emberMaterialLiteComponentsMdlTab) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlTab['default'];
    }
  });
});
define('pvm/components/mdl-table-col', ['exports', 'ember-material-lite/components/mdl-table-col'], function (exports, _emberMaterialLiteComponentsMdlTableCol) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlTableCol['default'];
    }
  });
});
define('pvm/components/mdl-table', ['exports', 'ember-material-lite/components/mdl-table'], function (exports, _emberMaterialLiteComponentsMdlTable) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlTable['default'];
    }
  });
});
define('pvm/components/mdl-tabs', ['exports', 'ember-material-lite/components/mdl-tabs'], function (exports, _emberMaterialLiteComponentsMdlTabs) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlTabs['default'];
    }
  });
});
define('pvm/components/mdl-textarea', ['exports', 'ember-material-lite/components/mdl-textarea'], function (exports, _emberMaterialLiteComponentsMdlTextarea) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlTextarea['default'];
    }
  });
});
define('pvm/components/mdl-textfield', ['exports', 'ember-material-lite/components/mdl-textfield'], function (exports, _emberMaterialLiteComponentsMdlTextfield) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlTextfield['default'];
    }
  });
});
define('pvm/components/mdl-tooltip', ['exports', 'ember-material-lite/components/mdl-tooltip'], function (exports, _emberMaterialLiteComponentsMdlTooltip) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteComponentsMdlTooltip['default'];
    }
  });
});
define('pvm/components/video-data', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    // getVideo() {
    //   $.getJSON('/video', {id: video.id}).then(data => {
    //     this.set('video', data);
    //   });
    // }
  });
});
define('pvm/helpers/app-version', ['exports', 'ember', 'pvm/config/environment'], function (exports, _ember, _pvmConfigEnvironment) {
  exports.appVersion = appVersion;
  var version = _pvmConfigEnvironment['default'].APP.version;

  function appVersion() {
    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('pvm/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('pvm/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('pvm/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'pvm/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _pvmConfigEnvironment) {
  var _config$APP = _pvmConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('pvm/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('pvm/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('pvm/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('pvm/initializers/export-application-global', ['exports', 'ember', 'pvm/config/environment'], function (exports, _ember, _pvmConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_pvmConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _pvmConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_pvmConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('pvm/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('pvm/initializers/material-lite-extensions', ['exports', 'ember-material-lite/initializers/material-lite-extensions'], function (exports, _emberMaterialLiteInitializersMaterialLiteExtensions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteInitializersMaterialLiteExtensions['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberMaterialLiteInitializersMaterialLiteExtensions.initialize;
    }
  });
});
define('pvm/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('pvm/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("pvm/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('pvm/models/watch', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    // id: DS.attr(),
    // name: DS.attr(),
    // link: DS.attr()
  });
});
define('pvm/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('pvm/router', ['exports', 'ember', 'pvm/config/environment'], function (exports, _ember, _pvmConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _pvmConfigEnvironment['default'].locationType,
    rootURL: _pvmConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('watch');
  });

  exports['default'] = Router;
});
define('pvm/routes/watch', ['exports', 'ember'], function (exports, _ember) {

  var videos = [{
    id: '12312312312323',
    name: 'Say hello to #GoogleAllo',
    link: 'https://www.youtube.com/watch?v=VXEkoXgb4bI'
  }];

  exports['default'] = _ember['default'].Route.extend({
    model: function model(id) {
      // return this.this.store.findRecord('video', id);
      return videos;
    }
  });
});
define('pvm/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define("pvm/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 10
          }
        },
        "moduleName": "pvm/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [1, 0], [1, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("pvm/templates/components/video-data", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "pvm/templates/components/video-data.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("pvm/templates/watch", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 29,
            "column": 6
          }
        },
        "moduleName": "pvm/templates/watch.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "watchVideoContainer");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "logo");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4, "src", "/assets/logo.png");
        dom.setAttribute(el4, "alt", "");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4, "class", "logoText");
        var el5 = dom.createTextNode("BIZKONECT");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "social");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "href", "");
        dom.setAttribute(el4, "class", "linkedin");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "href", "");
        dom.setAttribute(el4, "class", "twitter");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "href", "");
        dom.setAttribute(el4, "class", "facebook");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "video");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "videoHeader");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "photo");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "text");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        dom.setAttribute(el5, "class", "userName");
        var el6 = dom.createTextNode("Roberto Goni");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        dom.setAttribute(el5, "class", "userMessage");
        var el6 = dom.createTextNode("Hello, my name is.....");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("iframe");
        dom.setAttribute(el3, "width", "640");
        dom.setAttribute(el3, "height", "400");
        dom.setAttribute(el3, "src", "https://www.youtube.com/embed/VXEkoXgb4bI");
        dom.setAttribute(el3, "frameborder", "0");
        dom.setAttribute(el3, "allowfullscreen", "");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "videoFooter");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "class", "reply mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.setAttribute(el5, "src", "/assets/replyButton.png");
        dom.setAttribute(el5, "alt", "");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "line");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('pvm/config/environment', ['ember'], function(Ember) {
  var prefix = 'pvm';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("pvm/app")["default"].create({"name":"pvm","version":"0.0.1+a8953f7e"});
}

/* jshint ignore:end */
//# sourceMappingURL=pvm.map
