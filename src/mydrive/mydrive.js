import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {NavbarAction} from './mydrive-navbar-messages';
import {MydriveFolder} from './mydrive-folder';
import {MydriveService} from './mydrive-service';
import {MydriveServiceDialog} from './mydrive-service-dialog';

@inject(MydriveService, MydriveServiceDialog, EventAggregator)
export class MyDrive {

  constructor(driveService, driveServiceDialog, ea) {
    
    this.driveService = driveService;
    this.driveServiceDialog = driveServiceDialog;

    this.folders = [];
    this.selectedFolder;
    this.selectedFile;
    
    ea.subscribe(NavbarAction, navbar => {
        this.executeAction(navbar.action, navbar.event);
    });

  }

  activate() {
    return this.showFolder();
  }

  executeAction(action, event) {
    const actions = new Map([
      ['preview',    () =>  this.preview()],
      ['add-folder', () =>  this.addFolder()],
      ['del-folder', () =>  this.deleteFolder()],
      ['edi-folder', () =>  this.editFolder()],
      ['edit',       () =>  this.editFile()],      
      ['download',   () =>  this.downloadFile()],
      ['info',       () =>  this.showInfo()],
      ['delete',     () =>  this.deleteFile()],
      ['viewmode',   () =>  this.changeViewMode()],
      ['upload',     () =>  this.uploadFile(event)],      
      ['default',    () =>  {
        console.log("Invalid action:", action)
      }]
    ]);

    const result = actions.has(action) ?
        actions.get(action)() : actions.get('default')();

    return result;
  }

  showFolder() {
    return this.driveService.folders().then(folders =>{
        this.folders = folders;
    }).catch(error => {
    });
  }

  addFolder() {
    this.driveServiceDialog.showAddFolder().then(label => {
        if (label) {
            this.driveService.addFolder(label).then(() =>{
                this.showFolder();
            });
        }        
    });
  }
  
  editFolder() {
    let folder = this.selectedFolder;
    this.driveServiceDialog.showEditFolder(folder).then(label => {
        if (label) {
            this.driveService.editFolder(folder.id, label).then(() =>{
                this.selectedFolder = "";
                this.showFolder();
            });
        }
    });
  }

  deleteFolder() {
    let folder = this.selectedFolder;
    this.driveServiceDialog.showDeleteFolder(folder).then(confirm => {
        if (confirm) {
            this.driveService.deleteFolder(folder.id).then(() =>{
                this.selectedFolder = "";
                this.selectedFile = "";
                this.showFolder(); 
            });
        }
    });
  }

  uploadFile(event) {
    let file = event.target.files[0];
    let id = this.selectedFolder.id;
    this.driveService.upload(id, file).then(() =>{
        this.selectFolder(id);
    });
  }

  showInfo() {
    this.driveServiceDialog.showFileInfo(
        this.selectedFolder, this.selectedFile);
  }

  deleteFile() {
    let folder = this.selectedFolder;    
    let file = this.selectedFile;
    this.driveServiceDialog.showDeleteFile(folder, file).then(confirm => {
        if (confirm) {
            this.driveService.deleteFile(folder.id, file.id).then(() =>{
                this.selectFolder(folder.id);
            });
        }
    });
  }

  downloadFile() {
    this.driveService.download(
        this.selectedFolder, this.selectedFile);    
  }

  preview() {
    alert(`Preview file: ${this.selectedFile.name}`);
  }

  editFile() {
    alert(`Edit file: ${this.selectedFile.name}`);
  }

  changeViewMode() {
    alert(`Change view mode...${this.selectedFile.name}`);
  }

  selectFolder(folderId) {
    this.driveService.folder(folderId).then(folder =>{
        this.selectedFolder = folder;
        this.selectedFile = "";
    });
  }
}