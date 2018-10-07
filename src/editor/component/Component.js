
class Component {

    constructor(editor) {
        this.editor = editor;
    }

    onClick(event) {
        console.log('onActiveEvent:', event);
    }

    onStatusChange() {
        console.log('onStatusChange:'+this.name);
    }

    get name() {
        return 'Component';
    }

    get view() {
        return '<div title="Component">Component</div>';
    }
    set node(ele) {
        this.element = ele;
    }
}

export default Component