import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EventAggregator} from 'aurelia-event-aggregator';
import {NavbarAction} from './mydrive-navbar-messages';
import {MydriveFolder} from './mydrive-folder';
import {MydriveService} from './mydrive-service';
import {EditFolder} from './dialogs/edit-folder';

@inject(DialogService, MydriveService, EventAggregator)
export class MyDrive {
  folders = [];
  selectedFolder;
  selectedFile;

  constructor(dialogService, driveService, ea) {
    this.dialogService = dialogService;
    this.driveService = driveService;

    ea.subscribe(NavbarAction, navbar => {
      this.executeAction(navbar.action);
    });
  }

  created() {
    this.driveService.getFolders().then(folders =>{
      this.folders = folders;
    });    
  }

  executeAction(action) {
    const actions = new Map([
      ['preview', () => this.preview()],
      ['add-folder', () => this.addFolder()],
      ['edit', () => this.editFile()],      
      ['download', () => this.downloadFile()],
      ['info', () => this.showInfo()],
      ['delete', () => this.deleteFile()],
      ['viewmode', () => this.changeViewMode()],
      ['default', () => {
        console.log(action)
      }]
    ]);

    const result = actions.has(action) ?
        actions.get(action)() : actions.get('default')();

    return result;
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
    alert("Change view mode...");
  }

  selectFolder(folderId) {
    return this.driveService.getFolder(folderId).then(folder =>{
      this.selectedFolder = folder;
      this.selectedFile = "";
    });
  }

  addFolder() {
    this.dialogService.open({ viewModel: EditFolder, model: {label:""}}).then(response => {
      if (!response.wasCancelled) {
        this.driveService.addFolder(response.output.label).then(folder =>{
          this.folders.push(folder);
          this.selectedFolder = folder;
          this.selectedFile = "";
        });
      }
    });         
  }

}