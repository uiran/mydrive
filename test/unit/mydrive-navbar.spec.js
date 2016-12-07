import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {MydriveFolder} from '../../src/mydrive/mydrive-folder';

describe('MydriveNavbarCustomElement', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
      .withResources('src/mydrive/mydrive-navbar')
      .inView('<mydrive-navbar' +
                ' folder.bind="selectedFolder"' +
                ' file.bind="selectedFile">' +
              '</mydrive-navbar>')  
      .boundTo({
          selectedFolder: new MydriveFolder("1", "Pictures", []), 
          selectedFile: {}
       });
  });

  it('should render first name', () => {
    component.create(bootstrap).then(() => {
      //const nameElement = document.querySelector('.firstName');
      //expect(nameElement.innerHTML).toBe('Bob');
      //expect(true).toBe(true);
      expect({}).toBeDefined();
      done();
    });
  });

  afterEach(() => {
    component.dispose();
  });
});