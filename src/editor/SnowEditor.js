import Dom from '../component/dom/Dom'

let defaultConfig = null;
let components = new Array;
const n = Dom.element;


function onStatuChange() {
    console.log('onStatuChange');
}

function onContentChange(content) {
    console.log('onContentChange:' + content);
}

function createEditorView(editor) {
    let element = editor.element;
    editor.toolbar = n('div', {
        class: 'se-toolbar'
    });
    editor.content = n('div', {
        class: 'se-content',
        contenteditable: 'true',
        onfocus: function () {
            onStatuChange.call(editor);
        },
        onclick: function () {
            onStatuChange.call(editor);
            onContentChange.call(editor, editor.content.innerHTML);
        },
        onkeyup: function () {
            onContentChange.call(editor, editor.content.innerHTML);
        },
        onblur: function () {
            onStatuChange.call(editor);
        },
    }, {
            'min-height': editor.config['height']
        }, element.innerHTML);
    element.innerText = '';
    element.appendChild(editor.toolbar);
    element.appendChild(editor.content);
}

function createToolBar(editor) {
    components.forEach(function (Comp) {
        let comp = new Comp(editor);
        editor.toolbar.appendChild(n('div', {
            class: 'snow-tool-item',
            name: comp.name,
            onclick: function (e) {
                comp.onClick.call(comp, e, this);
            }
        }, {}, comp.view));
    });
}



class SnowEditor {

    constructor(config) {
        this.config = Object.assign(config, defaultConfig);
        this.element = document.querySelector(config.target);
        createEditorView(this);
        createToolBar(this);
    }

    static applyDefaultConfig(config) {
        defaultConfig = config;
    }

    static registerComponent(component) {
        components.push(component);
    }

    getContent() {
        return this.content.innerHTML;
    }

    getSelectionText() {
        let val = this.getRange();
        return val ? val.toString() : null;
    }

    getSelectionElement() {
        let val = this.getRange();
        return val ? val.commonAncestorContainer : null;
    }

    getRange() {
        let selection = window.getSelection();
        if (selection.rangeCount > 0) {
            return selection.getRangeAt(0);
        }
        return null;
    }

    exec(name, value) {
        document.execCommand(name, false, value);
    }
}

export default SnowEditor