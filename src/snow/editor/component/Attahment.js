
export default class Attachment {
    constructor(file, name) {
        this.name = name;
        this.file = file;
        this.data = null;
    }

    isImage() {
        return /^image\//.test(this.file.type);
    }

    get lcoal() {
        return this.data.lcoal || true;
    }

    get html() {
        const data = this.data;
        if (this.isImage) {
            return `<img title="${data.name}" alt="${data.name}" src="${data.link}">`;
        }
        else {
            return `<a title="${data.name}" herf="${data.link}">${data.name}</a>`;
        }
    }

    upload() {

    }
}