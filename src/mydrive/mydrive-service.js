import {inject} from 'aurelia-framework';
import {WebAPI} from './web-api';
import {MydriveFolder} from './mydrive-folder';

@inject(WebAPI)
export class MydriveService {
  
  constructor(api){
    this.api = api;
  }

  getFolders() {
    return this.parse(this.api.getFolderList());
  }

  getFolder(folderId) {
    return this.parse(this.api.getFolderDetails(folderId));
  }

  addFolder(label) {
    return this.parse(this.api.saveFolder(
        new MydriveFolder(-1, label)));
  }

  parse(response) {
    return response.then(folders => {
        if (Array.isArray(folders)) {
          let folderlist = [];              
          Array.from(folders).forEach(function (folder) {
            if (typeof folder === "object") {
              folderlist.push(new MydriveFolder(folder.id, folder.label));
            }
          });
          return folderlist;
        } else {
          return new MydriveFolder(folders.id, folders.label, folders.files);
        }
    });
  }
}