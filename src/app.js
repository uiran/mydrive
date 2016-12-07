export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'mydrive'], name: 'mydrive', moduleId: './mydrive/mydrive', nav: true, title: 'My Drive' },
      { route: 'users', name: 'users', moduleId: './users', nav: true, title: 'Github Users' }
    ]);

    this.router = router;
  }
}
