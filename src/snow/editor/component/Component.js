
class Component {

    constructor(editor) {
        this.editor = editor;
        
    }

    init(node) {

    }

    onClick(event) {
    }

    onStatusChange() {
    }

    get name() {
        return 'Component';
    }

    get view() {
        return '<div title="Component">Component</div>';
    }

    set node(ele) {
        this.$element = ele;
    }

    get node() {
        return this.$element;
    }
}

export default Component