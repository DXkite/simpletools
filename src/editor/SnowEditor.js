import Dom from '../component/dom/Dom'
import EditHistory from './component/History'

let defaultConfig = null;
let components = new Array;

const n = Dom.element;


function onStateChange() {
    this.fire('stateChange');
    if (this.components) {
        this.components.forEach(element => {
            element.onStatusChange.call(element);
        });
    }
}

function createEditorView(editor) {
    let element = editor.element;
    editor.toolbar = n('div', {
        class: 'snow-toolbar'
    });
    editor.content = n('div', {
        class: 'snow-content',
        contenteditable: 'true',
        onfocus: function () {
            onStateChange.call(editor);
            editor.fire('focus');
        },
        onclick: function () {
            onStateChange.call(editor);
            editor.fire('click');
        },
        onkeyup: function () {
            editor.fire('contentChange', editor.content.innerHTML);
        },
        onblur: function () {
            onStateChange.call(editor);
            editor.fire('blur');
        },
    }, {
            'min-height': editor.config['height']
        },
        element.innerHTML);
    element.innerText = '';
    element.appendChild(editor.toolbar);
    element.appendChild(editor.content);
}

function createToolBar(editor) {
    editor.components = new Map;

    var in_array = function (obj, array) {
        for (var index in array) {
            if (array[index] == obj) {
                return true;
            }
        }
        return false;
    }


    if (editor.config.toolbar) {
        const toolbar = editor.config.toolbar;
        components.forEach(function (Comp) {
            let comp = new Comp(editor);
            if (in_array(comp.name, toolbar)) {
                let node = n('div', {
                    class: 'snow-tool-item',
                    name: comp.name,
                    onclick: function (e) {
                        comp.onClick.call(comp, e, this);
                    }
                }, {}, comp.view);
                comp.node = node;
                editor.components.set(comp.name, comp);
                editor.toolbar.appendChild(node);
            }
        });
    }
}





class SnowEditor {

    constructor(config) {
        this.config = Object.assign(config, defaultConfig);
        this.element = document.querySelector(config.target);
        this.history = new EditHistory(this);
        this.listener = {};
        this.on('contentChange', this.history.onContentChange);
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

    get selectionText() {
        let val = this.getRange();
        return val ? val.toString() : null;
    }

    get selectionElement() {
        let val = this.getRange();
        return val ? val.commonAncestorContainer : null;
    }

    get range() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            return selection.getRangeAt(0);
        }
        return null;
    }

    set range(range) {
        if (range) {
            const selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
        }
    }

    on(name, callback) {
        let listener = this.listener[name] || new Array;
        listener.push(callback);
        this.listener[name] = listener;
    }

    off(name, callback) {
        if (this.listener[name]) {
            for (var index in this.listener[name]) {
                if (this.listener[name][index] === callback) {
                    this.listener[name].splice(index, 2, this.listener[name][index + 1]);
                }
            }
        }
    }

    fire(name, ...arg) {
        if (this.listener[name]) {
            this.listener[name].forEach(element => {
                element.apply(this, arg);
            });
        }
    }

    exec(name, value) {
        document.execCommand(name, false, value);
    }
}

export default SnowEditor