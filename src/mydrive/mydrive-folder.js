export class MydriveFolder {
    constructor(id, label, files) {
        this.id = id;
        this.label = label;
        this.files = files || [];
    }
}