import {DialogController} from 'aurelia-dialog';

export class DeleteFileDialog {
  static inject = [DialogController];
  file = { name: '' };
  
  constructor(controller){
    this.controller = controller;
  }

  activate(file){
    this.file = file;
  }
}