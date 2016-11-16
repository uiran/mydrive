let latency = 20;
let id = 0;

function getId(){
  return ++id;
}

let folders = [
  {
    id:getId(),
    label:'Folder 1',
    files:[
      {name:"file 1.1", lastModified: "Nov 15, 2016", size: "2 MB"},
      {name:"file 1.2", lastModified: "Nov 15, 2016", size: "2 MB"},
      {name:"file 1.3", lastModified: "Nov 15, 2016", size: "2 MB"}
    ]
  },
  {
    id:getId(),
    label:'Folder 2',
    files:[
      {name:"file 2.1", lastModified: "Nov 15, 2016", size: "3 MB"},
      {name:"file 2.2", lastModified: "Nov 15, 2016", size: "3 MB"},
      {name:"file 2.3", lastModified: "Nov 15, 2016", size: "3 MB"}
    ]
  },
  {
    id:getId(),
    label:'Folder 3',
    files:[
      {name:"file 3.1", lastModified: "Nov 15, 2016", size: "5 MB"},
      {name:"file 3.2", lastModified: "Nov 15, 2016", size: "5 MB"},
      {name:"file 3.3", lastModified: "Nov 15, 2016", size: "5 MB"}
    ]
  },
  {
    id:getId(),
    label:'Folder 4',
    files:[
      {name:"file 4.1", lastModified: "Nov 15, 2016", size: "7 MB"},
      {name:"file 4.2", lastModified: "Nov 15, 2016", size: "7 MB"},
      {name:"file 4.3", lastModified: "Nov 15, 2016", size: "7 MB"}
    ]
  },
  {
    id:getId(),
    label:'Folder 5',
    files:[
      {name:"file 5.1", lastModified: "Nov 15, 2016", size: "9 MB"},
      {name:"file 5.2", lastModified: "Nov 15, 2016", size: "9 MB"},
      {name:"file 5.3", lastModified: "Nov 15, 2016", size: "9 MB"}
    ]
  }
];

export class WebAPI {
  isRequesting = false;
  
  getFolderList(){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let results = folders.map(x =>  { return {
          id:x.id,
          label:x.label
        }});
        resolve(results);
        this.isRequesting = false;
      }, latency);
    });
  }

  getFolderDetails(id){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let found = folders.filter(x => x.id == id)[0];
        resolve(JSON.parse(JSON.stringify(found)));
        this.isRequesting = false;
      }, latency);
    });
  }
  
  saveFolder(folder){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(folder));
        let found = folders.filter(x => x.id == folder.id)[0];

        if(found){
          let index = folders.indexOf(found);
          folders[index] = instance;
        }else{
          instance.id = getId();
          folders.push(instance);
        }

        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
  
}
