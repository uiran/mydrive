import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EventAggregator} from 'aurelia-event-aggregator';
import {NavbarAction} from './mydrive-navbar-messages';
import {MydriveFolder} from './mydrive-folder';
import {MydriveService} from './mydrive-service';
import {EditFolderDialog} from './dialogs/edit-folder';
import {DeleteFolderDialog} from './dialogs/delete-folder';

@inject(DialogService, MydriveService, EventAggregator)
export class MyDrive {

  constructor(dialogService, driveService, ea) {
    
    this.dialogService = dialogService;
    this.driveService = driveService;

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
        console.log('Error......!');
    });  
  }

  addFolder() {
    this.showDialog(EditFolderDialog, {label:""}).then(response => {
        if (!response.wasCancelled) {
            let label = response.output.label;
            if (label) {
                this.driveService.addFolder(label).then(() =>{
                    this.showFolder();
                });
            }        
        }
    });
  }
  
  editFolder() {
    let id = this.selectedFolder.id;
    let label = this.selectedFolder.label;
    this.showDialog(EditFolderDialog, {label:label, id:id}).then(response => {
        if (!response.wasCancelled) {
            let label = response.output.label;
            if (label) {
                this.driveService.editFolder(id, label).then(() =>{
                    this.selectedFolder = "";
                    this.showFolder();
                });
            }        
        }
    });     
  }

  deleteFolder() {
    let id = this.selectedFolder.id;
    let label = this.selectedFolder.label;
    this.showDialog(DeleteFolderDialog, {label:label}).then(response => {
        if (!response.wasCancelled) {
            this.driveService.deleteFolder(id).then(() =>{
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

  preview() {
    alert(`Preview file: ${this.selectedFile.name}`);
  }

  editFile() {
    alert(`Edit file: ${this.selectedFile.name}`);
  }

  downloadFile() {
    alert(`Download file: ${this.selectedFile.name}`);    
  }
  
  showInfo() {
    alert(`File info: ${this.selectedFile.name}`);    
  }

  deleteFile() {
    alert(`Delete file: ${this.selectedFile.name}`);
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

  showDialog(viewModel, model) {
    return this.dialogService.open({ viewModel: viewModel, model: model });
  }

}