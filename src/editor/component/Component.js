
class Component {

    constructor(editor) {
        this.editor = editor;
        console.log('component init');
    }

    onClick(event) {
        console.log('onActiveEvent:', event);
    }

    onStatusChange() {
        console.log('onStatusChange');
    }

    get name() {
        return 'Component';
    }

    get view() {
        return '<div title="Component">Component</div>';
    }
}

export default Component