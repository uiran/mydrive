import {inject, bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {NavbarAction} from './mydrive-navbar-messages';

@inject(EventAggregator)
export class MydriveNavbarCustomElement {
  @bindable file;

  constructor(ea) {
    this.ea = ea;
  }

  navBarAction(action) {
    this.action = action;
    this.ea.publish(new NavbarAction(this.action));
  }
}