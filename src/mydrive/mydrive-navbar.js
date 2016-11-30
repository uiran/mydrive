import {inject, bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {NavbarAction} from './mydrive-navbar-messages';

@inject(EventAggregator)
export class MydriveNavbarCustomElement {
  @bindable folder;
  @bindable file;

  constructor(ea) {
    this.ea = ea;
  }

  navBarAction(action, event) {
    this.action = action;
    this.ea.publish(new NavbarAction(this.action, event));
  }
}