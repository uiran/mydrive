
import {inject, Lazy} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {WebAPI} from './web-api';
import {MydriveFolder} from './mydrive-folder';

// polyfill fetch client conditionally
const fetch = !self.fetch ? System.import('isomorphic-fetch') : Promise.resolve(self.fetch);

@inject(Lazy.of(HttpClient), WebAPI)
export class MydriveService {
  
  constructor(getHttpClient, api){
    this.api = api;
    const http = this.http = getHttpClient();
    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('http://localhost:8984/mydrive/');
    });
  }

  async folders() {
    return this.parseFolders(await this.http.fetch('folders'));
  }

  async folder(folderId) {
    return this.parseFolder(await this.http.fetch(`folder/${folderId}`));
  }

  async addFolder(label) {
    return await this.http.fetch('folder', {
        method: 'post',
        body: json({"name": label})
    })
  }

  async deleteFolder(folderId) {
    return await this.http.fetch(`folders/${folderId}`,{
        method: 'delete'
    });
  }

  async editFolder(folderId, label) {
    return await this.http.fetch(`folder/${folderId}`,{
        method: 'put',
        body: json({"name": label})
    });
  }

  async upload(folderId, files) {
    var form = new FormData();
    form.append('files', files)
    return await this.http.fetch(`folder/${folderId}/upload`, {
        method: 'post',
        body: form
    });
  }

  parseFolders(response) {
    return response.json().then(folders => {
        let folderlist = [];
        if (Array.isArray(folders)) {
            Array.from(folders).forEach(function (folder) {
                if (typeof folder === "object") {
                    let data = folder[1];
                    folderlist.push(new MydriveFolder(data.id, data.name, []));
                }
            });
        }
        return folderlist;
    });
  }
  
  parseFolder(response) {
    return response.json().then(folder => {
        if (Array.isArray(folder)) {
            let data = folder[1];
            let files = [];
            folder.filter(x => x[0] === "file").forEach(function (file) {
                files.push(file[1]);
            });
            return new MydriveFolder(data.id, data.name, files);
        }
    });
  }

}