import {DialogController} from 'aurelia-dialog';

export class EditFolder {
  static inject = [DialogController];
  folder = { label: '' };
  
  constructor(controller){
    this.controller = controller;
  }

  activate(folder){
    this.folder = folder;
  }
}