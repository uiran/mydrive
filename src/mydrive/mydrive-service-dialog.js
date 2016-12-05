import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EditFolderDialog} from './dialogs/edit-folder';
import {DeleteFolderDialog} from './dialogs/delete-folder';
import {DeleteFileDialog} from './dialogs/delete-file';
import {FileInfoDialog} from './dialogs/file-info';

@inject(DialogService)
export class MydriveServiceDialog {
  
  constructor(dialogService) {
    this.dialogService = dialogService;
  }

  showAddFolder() {
    return this.showDialog(EditFolderDialog, {label:""}).then(response => {
        if (!response.wasCancelled) {
            return response.output.label;
        }
    });
  }

  showEditFolder(folder) {
    let id = folder.id;
    let label = folder.label;
    return this.showDialog(EditFolderDialog, {label:label, id:id}).then(response => {
        if (!response.wasCancelled) {
            return response.output.label;
        }
    });     
  }

  showDeleteFolder(folder) {
    let id = folder.id;
    let label = folder.label;
    return this.showDialog(DeleteFolderDialog, {label:label}).then(response => {
        if (!response.wasCancelled) {
            return true;
        }
    });
  }

  showFileInfo(folder, file) {
    this.showDialog(FileInfoDialog, {folder:folder, file: file});
  }

  showDeleteFile(folder, file) {
    let folderId = folder.id;    
    let fileId = file.id;
    let name = file.name;
    return this.showDialog(DeleteFileDialog, {name:name}).then(response => {
        if (!response.wasCancelled) {
            return true;
        }
    });
  }

  showDialog(viewModel, model) {
    return this.dialogService.open({ viewModel: viewModel, model: model });
  }

}