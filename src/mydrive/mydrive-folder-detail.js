import {bindable, bindingMode} from 'aurelia-framework';

export class MydriveFolderDetailCustomElement {
  @bindable folder;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) file;
  
  selectFile(file) {
      this.file = file;
  }

}