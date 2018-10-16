import EmObj from './Object'

export default class TextEmotions {
    constructor(data) {
        let content = new Array;
        data.content.forEach(element => {
            content.push(new EmObj(element, element, element));
        });
        this._content = content;
    }

    get content() {
        return this._content;
    }
}