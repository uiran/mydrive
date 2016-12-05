import {DialogController} from 'aurelia-dialog';

export class FileInfoDialog {
  static inject = [DialogController];
  data = { folder: '', file: ''};
  
  constructor(controller){
    this.controller = controller;
  }

  activate(data){
    this.folder = data.folder;    
    this.file = data.file;
  }
}