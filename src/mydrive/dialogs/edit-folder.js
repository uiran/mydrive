import {DialogController} from 'aurelia-dialog';

export class EditFolderDialog {
  static inject = [DialogController];
  folder = { 
    id: 0,
    label: ""
  };
  
  constructor(controller){
    this.controller = controller;
  }

  activate(folder){
    this.folder = folder;
  }

  get title() {
    return this.folder.id ? "Edit folder" : "New folder";
  }
}