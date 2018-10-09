
export default class Attachment {
    constructor(file, name) {
        this.name = name;
        this.file = file;
    }

    isImage() {
        return /^image\//.test(this.file.type);
    }

    get insertHtml() {

    }

    get uploadFile() {

    }
}