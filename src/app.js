export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      //{ route: ['', 'welcome'], name: 'welcome',      moduleId: './welcome',      nav: true, title: 'Welcome' },
      //{ route: 'users',         name: 'users',        moduleId: './users',        nav: true, title: 'Github Users' },
      //{ route: 'child-router',  name: 'child-router', moduleId: './child-router', nav: true, title: 'Child Router' }

      { route: ['', 'mydrive'], name: 'mydrive',      moduleId: './mydrive/mydrive', nav: true, title: 'My Drive' },
      { route: 'help', name: 'help', moduleId: './mydrive/mydrive-help', title: 'My Drive Help' }

    ]);

    this.router = router;
  }
}
