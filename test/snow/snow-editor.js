/*! snow-editor by dxkite 2018-10-16 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

require('./snow/tab/index');

require('./snow/upload/index');

var _config = require('./snow/editor/config');

var _config2 = _interopRequireDefault(_config);

var _SnowEditor = require('./snow/editor/SnowEditor');

var _SnowEditor2 = _interopRequireDefault(_SnowEditor);

var _Bold = require('./snow/editor/component/style/Bold');

var _Bold2 = _interopRequireDefault(_Bold);

var _Italic = require('./snow/editor/component/style/Italic');

var _Italic2 = _interopRequireDefault(_Italic);

var _Underline = require('./snow/editor/component/style/Underline');

var _Underline2 = _interopRequireDefault(_Underline);

var _Redo = require('./snow/editor/component/command/Redo');

var _Redo2 = _interopRequireDefault(_Redo);

var _Undo = require('./snow/editor/component/command/Undo');

var _Undo2 = _interopRequireDefault(_Undo);

var _Right = require('./snow/editor/component/layout/Right');

var _Right2 = _interopRequireDefault(_Right);

var _Left = require('./snow/editor/component/layout/Left');

var _Left2 = _interopRequireDefault(_Left);

var _Center = require('./snow/editor/component/layout/Center');

var _Center2 = _interopRequireDefault(_Center);

var _Emotion = require('./snow/editor/component/tool/Emotion');

var _Emotion2 = _interopRequireDefault(_Emotion);

var _Image = require('./snow/editor/component/tool/Image');

var _Image2 = _interopRequireDefault(_Image);

var _Link = require('./snow/editor/component/tool/Link');

var _Link2 = _interopRequireDefault(_Link);

var _AttachmentManager = require('./snow/editor/component/tool/AttachmentManager');

var _AttachmentManager2 = _interopRequireDefault(_AttachmentManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.SnowEditor = _SnowEditor2.default;

_SnowEditor2.default.applyDefaultConfig(_config2.default);

_SnowEditor2.default.registerComponent(_Bold2.default);
_SnowEditor2.default.registerComponent(_Italic2.default);
_SnowEditor2.default.registerComponent(_Underline2.default);

_SnowEditor2.default.registerComponent(_Right2.default);
_SnowEditor2.default.registerComponent(_Center2.default);
_SnowEditor2.default.registerComponent(_Left2.default);

_SnowEditor2.default.registerComponent(_Undo2.default);
_SnowEditor2.default.registerComponent(_Redo2.default);

_SnowEditor2.default.registerComponent(_Emotion2.default);
_SnowEditor2.default.registerComponent(_Image2.default);
_SnowEditor2.default.registerComponent(_Link2.default);
_SnowEditor2.default.registerComponent(_AttachmentManager2.default);

},{"./snow/editor/SnowEditor":4,"./snow/editor/component/command/Redo":8,"./snow/editor/component/command/Undo":9,"./snow/editor/component/layout/Center":10,"./snow/editor/component/layout/Left":11,"./snow/editor/component/layout/Right":12,"./snow/editor/component/style/Bold":13,"./snow/editor/component/style/Italic":14,"./snow/editor/component/style/Underline":15,"./snow/editor/component/tool/AttachmentManager":16,"./snow/editor/component/tool/Emotion":17,"./snow/editor/component/tool/Image":18,"./snow/editor/component/tool/Link":19,"./snow/editor/config":25,"./snow/tab/index":28,"./snow/upload/index":31}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    popLayerLevel: 9000,
    toastLayerLevel: 10000
};

exports.default = config;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _isArray = require('../util/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _fixCssPrefix = require('../util/fixCssPrefix');

var _fixCssPrefix2 = _interopRequireDefault(_fixCssPrefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DomElement = function DomElement(selecter, context) {
    return new DomElement.constructor(selecter, context);
};

DomElement.constructor = function (selecter, context) {
    if (typeof selecter === 'string') {
        this.elements = (context || document).querySelectorAll(selecter);
    } else if (selecter instanceof DomElement) {
        return selecter;
    } else if (selecter instanceof Element) {
        this.elements = [selecter];
    } else if (selecter instanceof Array) {
        this.elements = selecter;
    } else if (selecter instanceof Object) {
        this.elements = [selecter];
    } else {
        console.error('DomElement:selector is invalid value:', selecter);
        return this;
    }
    this.context = context;
    this.length = this.elements.length;
    for (var i = 0; i < this.length; i++) {
        this[i] = this.elements[i];
    }
    return this;
};

DomElement.extend = function (methods) {
    for (var name in methods) {
        this[name] = methods[name];
    }
};

function createElementFromString(html) {
    var ele = document.createElement('div');
    ele.innerHTML = html;
    return ele.firstChild;
}

DomElement.extend({
    element: function element(tag, attr, css, childs) {
        var element = tag.indexOf('<') === -1 ? document.createElement(tag) : createElementFromString(tag);
        DomElement(element).attr(attr).css(css);
        if ((0, _isArray2.default)(childs)) {
            for (var name in childs) {
                element.appendChild(childs[name]);
            }
        } else if (childs instanceof Element) {
            element.appendChild(childs);
        } else if (childs !== undefined) {
            element.innerHTML = childs;
        }
        return element;
    }
});

function eventOn(element, type, callback, useCaptrue) {
    var captrue = useCaptrue === undefined ? false : useCaptrue;
    if ('addEventListener' in window) {
        element.addEventListener(type, callback, captrue);
    } else {
        element.attachEvent('on' + type, callback);
    }
}

function eventOff(element, type, callback, useCaptrue) {
    var captrue = useCaptrue === undefined ? false : useCaptrue;
    if ('removeEventListener' in window) {
        element.removeEventListener(type, callback, captrue);
    } else {
        element.detachEvent('on' + type, callback);
    }
}

DomElement.method = DomElement.constructor.prototype;
DomElement.method.extend = DomElement.extend;
// 属性方法
DomElement.method.extend({
    attr: function attr(attrs) {
        this.each(function () {
            if (attrs) {
                for (var name in attrs) {
                    if (attrs[name]) {
                        if (/^on/.test(name)) {
                            var type = name.replace(/^on(.+)$/, '$1');
                            if (/[A-Z]/.test(type[0])) {
                                type = type[0].toLowerCase() + type.substr(1);
                            }
                            eventOn(this, type, attrs[name]);
                        } else {
                            this.setAttribute(name, attrs[name]);
                        }
                    } else {
                        this.removeAttribute(name);
                    }
                }
            }
        });
        return this;
    },
    css: function css(cssObj) {
        this.each(function () {
            if (cssObj) {
                for (var name in cssObj) {
                    this.style[(0, _fixCssPrefix2.default)(name)] = cssObj[name];
                }
            }
        });
        return this;
    },
    addClass: function addClass(add) {
        this.each(function () {
            if (add) {
                var get = this.getAttribute('class');
                if (get) {
                    if (!get.match(new RegExp(add))) {
                        this.setAttribute('class', get + ' ' + add);
                    }
                } else {
                    this.setAttribute('class', add);
                }
            }
        });
        return this;
    },
    removeClass: function removeClass(remove) {
        this.each(function () {
            var get = this.getAttribute('class');
            if (get) {
                var oldClass = get.split(/\s+/);
                var newClass = oldClass.filter(function (element) {
                    return element !== remove;
                });
                if (newClass.length > 0) {
                    this.setAttribute('class', newClass.join(' '));
                } else {
                    this.removeAttribute('class');
                }
            }
        });
        return this;
    },
    each: function each(callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this[i], this[i], i);
        }
        return this;
    },
    on: function on(type, listener, useCaptrue) {
        var _this = this;

        type.split(/\s+/).forEach(function (subtype) {
            _this.each(function () {
                eventOn(this, subtype, listener, useCaptrue);
            });
        });
        return this;
    },
    off: function off(type, listener, useCaptrue) {
        var _this2 = this;

        type.split(/\s+/).forEach(function (subtype) {
            _this2.each(function () {
                eventOff(this, subtype, listener, useCaptrue);
            });
        });
        return this;
    },
    find: function find(selecter) {
        return DomElement(selecter, this[0]);
    },
    val: function val() {
        return this[0].value;
    }
});

exports.default = DomElement;

},{"../util/fixCssPrefix":32,"../util/isArray":38}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _printf = require('../util/printf');

var _printf2 = _interopRequireDefault(_printf);

var _Toast = require('../toast/Toast');

var _Toast2 = _interopRequireDefault(_Toast);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _isChildOf2 = require('../util/isChildOf');

var _isChildOf3 = _interopRequireDefault(_isChildOf2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = _config2.default;
var components = new Array();
var editorCounter = 0;

var n = _DomElement2.default.element;

function onStateChange() {
    this.fire('stateChange');
    if (this.components) {
        this.components.forEach(function (element) {
            element.onStatusChange.call(element);
        });
    }
}

function createEditorView(editor) {
    var element = editor.$element;
    editor.$toolbar = n('div', {
        class: 'snow-toolbar'
    });
    editor.$content = n('div', {
        class: 'snow-content',
        contenteditable: editor.config.editable || true,
        onfocus: function onfocus() {
            editor._foucs = true;
            // editor.range = editor.range;
            // console.log(editor._range);
            onStateChange.call(editor);
            editor.fire('focus');
        },
        onclick: function onclick() {
            editor._foucs = true;
            // editor.range = editor.range || editor._range;
            onStateChange.call(editor);
            editor.fire('click');
        },
        onkeyup: function onkeyup() {
            editor.fire('contentChange', editor.content, editor.range);
        },
        onblur: function onblur() {
            editor._foucs = false;
            editor.range = editor.getCurrentRange();
            // console.log(editor.range);
            onStateChange.call(editor);
            editor.fire('blur');
        }
    }, {
        'min-height': editor.config['height']
    }, element.innerHTML);
    (0, _DomElement2.default)(element).attr({ class: 'snow-editor-container' });
    element.innerText = '';
    element.appendChild(editor.$toolbar);
    element.appendChild(editor.$content);
}

function createToolBar(editor) {
    editor.components = new Map();

    var in_array = function in_array(obj, array) {
        for (var index in array) {
            if (array[index] == obj) {
                return true;
            }
        }
        return false;
    };

    if (editor.config.toolbar) {
        var toolbar = editor.config.toolbar;
        components.forEach(function (Comp) {
            var comp = new Comp(editor);
            if (in_array(comp.name, toolbar)) {
                var node = n('div', {
                    class: 'snow-tool-item',
                    name: comp.name,
                    onclick: function onclick(e) {
                        comp.onClick.call(comp, e, this);
                    }
                }, {}, comp.view);
                comp.node = node;
                comp.init.call(comp, node);
                editor.components.set(comp.name, comp);
            }
        });
        toolbar.forEach(function (name) {
            var comp = editor.components.get(name);
            editor.$toolbar.appendChild(comp.node);
        });
    }
}

var commands = {
    insertHTML: function insertHTML(value) {
        if (this.range) {
            this.setCurrentRange(this.range);
            document.execCommand('insertHTML', null, value);
        } else {
            this.setCurrentRange(this.createDefaultRange());
            document.execCommand('insertHTML', null, '<div>' + value + '</div>');
        }
    }
};

function _exec(name, value) {
    if (commands[name]) {
        commands[name].apply(this, value);
    } else {
        document.execCommand(name, null, value[0]);
    }
}

var SnowEditor = function () {
    function SnowEditor(config) {
        _classCallCheck(this, SnowEditor);

        this.config = Object.assign(config, defaultConfig);
        this.$element = document.querySelector(config.target);
        this.listener = {};
        this._foucs = false;
        this._range = false;
        this.id = editorCounter++;
        this.$ = _DomElement2.default;
        this.attachment = new Map();
        createEditorView(this);
        createToolBar(this);
    }

    _createClass(SnowEditor, [{
        key: 'createDefaultRange',
        value: function createDefaultRange() {
            var defaultRange = document.createRange();
            defaultRange.setStart(this.$content, this.$content.childNodes.length);
            return defaultRange;
        }
    }, {
        key: 'getCurrentRange',
        value: function getCurrentRange() {
            var selection = window.getSelection();
            if (selection.rangeCount > 0) {
                console.log(selection.rangeCount);
                var range = selection.getRangeAt(0);
                if ((0, _isChildOf3.default)(range.commonAncestorContainer, this.$element)) {
                    return range;
                }
            }
        }
    }, {
        key: 'setCurrentRange',
        value: function setCurrentRange(range) {
            if (range) {
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }, {
        key: 'addAttachment',
        value: function addAttachment(attachment) {
            this.attachment.set(attachment.name, attachment);
        }
    }, {
        key: 'on',
        value: function on(name, callback) {
            var listener = this.listener[name] || new Array();
            listener.push(callback);
            this.listener[name] = listener;
        }
    }, {
        key: 'off',
        value: function off(name, callback) {
            if (this.listener[name]) {
                for (var index in this.listener[name]) {
                    if (this.listener[name][index] === callback) {
                        this.listener[name].splice(index, 2, this.listener[name][index + 1]);
                    }
                }
            }
        }
    }, {
        key: 'fire',
        value: function fire(name) {
            var _this = this;

            for (var _len = arguments.length, arg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                arg[_key - 1] = arguments[_key];
            }

            if (this.listener[name]) {
                this.listener[name].forEach(function (element) {
                    element.apply(_this, arg);
                });
            }
        }
    }, {
        key: 'exec',
        value: function exec(name) {
            for (var _len2 = arguments.length, value = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                value[_key2 - 1] = arguments[_key2];
            }

            _exec.call(this, name, value);
        }
    }, {
        key: 'alert',
        value: function alert(message) {
            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            (0, _Toast2.default)(SnowEditor._.apply(SnowEditor, [message].concat(args)));
        }
    }, {
        key: 'name',
        get: function get() {
            return this.config.target;
        }
    }, {
        key: 'content',
        get: function get() {
            return this.$content.innerHTML;
        },
        set: function set(html) {
            this.$content.innerHTML = html;
        }
    }, {
        key: 'selectionText',
        get: function get() {
            var val = this.range;
            return val ? val.toString() : null;
        }
    }, {
        key: 'selectionElement',
        get: function get() {
            var val = this.range;
            return val ? val.commonAncestorContainer : null;
        }
    }, {
        key: 'selectionIsEmpty',
        get: function get() {
            var range = this.range;
            if (range && range.startContainer) {
                if (range.startContainer === range.endContainer) {
                    if (range.startOffset === range.endOffset) {
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: 'range',
        get: function get() {
            return this._range;
        },
        set: function set(range) {
            this._range = range;
        }
    }, {
        key: 'editable',
        set: function set(editable) {
            this.$content.setAttribute('contenteditable', editable);
        },
        get: function get() {
            return this.$content.getAttribute('contenteditable') == 'true';
        }
    }], [{
        key: 'applyDefaultConfig',
        value: function applyDefaultConfig(config) {
            defaultConfig = config;
        }
    }, {
        key: 'registerComponent',
        value: function registerComponent(component) {
            components.push(component);
        }
    }, {
        key: '_',
        value: function _(str) {
            var langs = defaultConfig.language && defaultConfig.language.str || [];
            var local = defaultConfig.language && defaultConfig.language.local || 'zh-CN';
            var output = langs[local] || str;

            for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                args[_key4 - 1] = arguments[_key4];
            }

            return _printf2.default.apply(undefined, [output].concat(args));
        }
    }]);

    return SnowEditor;
}();

exports.default = SnowEditor;

},{"../dom/DomElement":3,"../toast/Toast":29,"../util/isChildOf":39,"../util/printf":42,"./config":25}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Attachment = function () {
    function Attachment(file, name) {
        _classCallCheck(this, Attachment);

        this.name = name;
        this.file = file;
        this.data = null;
    }

    _createClass(Attachment, [{
        key: "upload",
        value: function upload() {}
    }, {
        key: "isImage",
        get: function get() {
            return (/^image\//.test(this.file.type)
            );
        }
    }, {
        key: "local",
        get: function get() {
            return this.data.local || true;
        }
    }, {
        key: "html",
        get: function get() {
            var data = this.data;
            if (this.isImage) {
                return "<img title=\"" + data.name + "\" attachment-id=\"" + data.name + "\" alt=\"" + data.name + "\" src=\"" + data.link + "\">";
            } else {
                return "<a title=\"" + data.name + "\" attachment-id=\"" + data.name + "\" href=\"" + data.link + "\">" + data.name + "</a>";
            }
        }
    }]);

    return Attachment;
}();

exports.default = Attachment;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
    function Component(editor) {
        _classCallCheck(this, Component);

        this.editor = editor;
    }

    _createClass(Component, [{
        key: 'init',
        value: function init(node) {}
    }, {
        key: 'onClick',
        value: function onClick(event) {}
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {}
    }, {
        key: 'name',
        get: function get() {
            return 'Component';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<div title="Component">Component</div>';
        }
    }, {
        key: 'node',
        set: function set(ele) {
            this.$element = ele;
        },
        get: function get() {
            return this.$element;
        }
    }]);

    return Component;
}();

exports.default = Component;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RangeComponent = function (_Component) {
    _inherits(RangeComponent, _Component);

    _createClass(RangeComponent, [{
        key: 'name',
        get: function get() {
            return 'RangeComponent';
        }
    }]);

    function RangeComponent(editor) {
        _classCallCheck(this, RangeComponent);

        return _possibleConstructorReturn(this, (RangeComponent.__proto__ || Object.getPrototypeOf(RangeComponent)).call(this, editor));
    }

    _createClass(RangeComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range) {
            console.log(range);
        }
    }, {
        key: 'onClick',
        value: function onClick(event) {
            if (this.editor.range) {
                this.onRangeAction(this.editor.range, event);
            }
        }
    }]);

    return RangeComponent;
}(_Component3.default);

exports.default = RangeComponent;

},{"./Component":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RedoCommandComponent = function (_Component) {
    _inherits(RedoCommandComponent, _Component);

    function RedoCommandComponent() {
        _classCallCheck(this, RedoCommandComponent);

        return _possibleConstructorReturn(this, (RedoCommandComponent.__proto__ || Object.getPrototypeOf(RedoCommandComponent)).apply(this, arguments));
    }

    _createClass(RedoCommandComponent, [{
        key: 'onClick',
        value: function onClick(event) {
            this.editor.exec('redo');
        }
    }, {
        key: 'name',
        get: function get() {
            return 'redo';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return RedoCommandComponent;
}(_Component3.default);

exports.default = RedoCommandComponent;

},{"../Component":6}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UndoCommandComponent = function (_Component) {
    _inherits(UndoCommandComponent, _Component);

    function UndoCommandComponent() {
        _classCallCheck(this, UndoCommandComponent);

        return _possibleConstructorReturn(this, (UndoCommandComponent.__proto__ || Object.getPrototypeOf(UndoCommandComponent)).apply(this, arguments));
    }

    _createClass(UndoCommandComponent, [{
        key: 'onClick',
        value: function onClick(event) {
            this.editor.exec('undo');
        }
    }, {
        key: 'name',
        get: function get() {
            return 'undo';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return UndoCommandComponent;
}(_Component3.default);

exports.default = UndoCommandComponent;

},{"../Component":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CenterLayoutComponent = function (_RangeComponent) {
    _inherits(CenterLayoutComponent, _RangeComponent);

    function CenterLayoutComponent() {
        _classCallCheck(this, CenterLayoutComponent);

        return _possibleConstructorReturn(this, (CenterLayoutComponent.__proto__ || Object.getPrototypeOf(CenterLayoutComponent)).apply(this, arguments));
    }

    _createClass(CenterLayoutComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('justifycenter');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('justifycenter')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'align-center';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return CenterLayoutComponent;
}(_Range2.default);

exports.default = CenterLayoutComponent;

},{"../Range":7}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LeftLayoutComponent = function (_RangeComponent) {
    _inherits(LeftLayoutComponent, _RangeComponent);

    function LeftLayoutComponent() {
        _classCallCheck(this, LeftLayoutComponent);

        return _possibleConstructorReturn(this, (LeftLayoutComponent.__proto__ || Object.getPrototypeOf(LeftLayoutComponent)).apply(this, arguments));
    }

    _createClass(LeftLayoutComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('justifyleft');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('justifyleft')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'align-left';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return LeftLayoutComponent;
}(_Range2.default);

exports.default = LeftLayoutComponent;

},{"../Range":7}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RightLayoutComponent = function (_RangeComponent) {
    _inherits(RightLayoutComponent, _RangeComponent);

    function RightLayoutComponent() {
        _classCallCheck(this, RightLayoutComponent);

        return _possibleConstructorReturn(this, (RightLayoutComponent.__proto__ || Object.getPrototypeOf(RightLayoutComponent)).apply(this, arguments));
    }

    _createClass(RightLayoutComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('justifyright');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('justifyright')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'align-right';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return RightLayoutComponent;
}(_Range2.default);

exports.default = RightLayoutComponent;

},{"../Range":7}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BoldStyleComponent = function (_RangeComponent) {
    _inherits(BoldStyleComponent, _RangeComponent);

    function BoldStyleComponent() {
        _classCallCheck(this, BoldStyleComponent);

        return _possibleConstructorReturn(this, (BoldStyleComponent.__proto__ || Object.getPrototypeOf(BoldStyleComponent)).apply(this, arguments));
    }

    _createClass(BoldStyleComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('bold');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('bold')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'bold';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return BoldStyleComponent;
}(_Range2.default);

exports.default = BoldStyleComponent;

},{"../Range":7}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItalicStyleComponent = function (_RangeComponent) {
    _inherits(ItalicStyleComponent, _RangeComponent);

    function ItalicStyleComponent() {
        _classCallCheck(this, ItalicStyleComponent);

        return _possibleConstructorReturn(this, (ItalicStyleComponent.__proto__ || Object.getPrototypeOf(ItalicStyleComponent)).apply(this, arguments));
    }

    _createClass(ItalicStyleComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('italic');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('italic')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'italic';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return ItalicStyleComponent;
}(_Range2.default);

exports.default = ItalicStyleComponent;

},{"../Range":7}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UnderlineStyleComponent = function (_RangeComponent) {
    _inherits(UnderlineStyleComponent, _RangeComponent);

    function UnderlineStyleComponent() {
        _classCallCheck(this, UnderlineStyleComponent);

        return _possibleConstructorReturn(this, (UnderlineStyleComponent.__proto__ || Object.getPrototypeOf(UnderlineStyleComponent)).apply(this, arguments));
    }

    _createClass(UnderlineStyleComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('underline');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('underline')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'underline';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return UnderlineStyleComponent;
}(_Range2.default);

exports.default = UnderlineStyleComponent;

},{"../Range":7}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

var _PopLayer = require('../../../poplayer/PopLayer');

var _PopLayer2 = _interopRequireDefault(_PopLayer);

var _DomElement = require('../../../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _getDropFiles2 = require('../../../util/getDropFiles');

var _getDropFiles3 = _interopRequireDefault(_getDropFiles2);

var _getPasteFiles2 = require('../../../util/getPasteFiles');

var _getPasteFiles3 = _interopRequireDefault(_getPasteFiles2);

var _Attahment = require('../Attahment');

var _Attahment2 = _interopRequireDefault(_Attahment);

var _uploader = require('./uploader');

var _uploader2 = _interopRequireDefault(_uploader);

var _getSize = require('../../../util/getSize');

var _getSize2 = _interopRequireDefault(_getSize);

var _SnowEditor = require('../../../editor/SnowEditor');

var _SnowEditor2 = _interopRequireDefault(_SnowEditor);

var _Tab = require('../../../tab/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

var _UploadButton = require('../../../upload/UploadButton');

var _UploadButton2 = _interopRequireDefault(_UploadButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var n = _DomElement2.default.element;
var _ = _SnowEditor2.default._;

function getPasteImage(event) {
    var files = (0, _getPasteFiles3.default)(event);
    var images = new Array();
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (/^image\//.test(file.type)) {
            var attachment = new _Attahment2.default(file, file.name);
            images.push(attachment);
        }
    }
    return images;
}

function getDropFiles(event) {
    var files = (0, _getDropFiles3.default)(event);
    var drop = new Array();
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var attachment = new _Attahment2.default(file, file.name);
        drop.push(attachment);
    }
    return drop;
}

function attachmentHandler(editor, attachment) {
    (0, _uploader2.default)(editor, attachment.file).then(function (data) {
        attachment.data = data;
        editor.exec('insertHTML', attachment.html);
        editor.addAttachment(attachment);
    });
}

function menuElement(editor, attachment) {
    var layer = this.layer;
    return n('div', {
        title: attachment.name,
        class: 'snow-attachment-item',
        onclick: function onclick() {
            editor.exec('insertHTML', attachment.html);
            layer.hide();
        }
    }, null, [n('i', {
        class: 'iconfont snow-icon-' + (attachment.isImage ? 'image' : 'attachment')
    }), n('span', null, null, attachment.name)]);
}

function getAttachmentList(editor) {
    var _this = this;

    var attahments = editor.attachment;
    var childs = new Array();
    if (attahments.size <= 0) {
        childs.push(n('div', { class: 'snow-attachment-item' }, null, '暂无文件'));
    } else {
        attahments.forEach(function (attach) {
            childs.push(menuElement.call(_this, editor, attach));
        });
    }
    return childs;
}

/**
 * 附件处理
 */

var AttachmentManager = function (_Component) {
    _inherits(AttachmentManager, _Component);

    function AttachmentManager(editor) {
        _classCallCheck(this, AttachmentManager);

        var _this2 = _possibleConstructorReturn(this, (AttachmentManager.__proto__ || Object.getPrototypeOf(AttachmentManager)).call(this, editor));

        editor.dropEnter = false;

        (0, _DomElement2.default)(editor.$content).on('paste', function (event) {
            editor.fire('paste', event);
            getPasteImage(event).forEach(function (attachment) {
                attachmentHandler(editor, attachment);
            });
        });

        (0, _DomElement2.default)(editor.$content).on('dragenter', function (event) {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            console.log(event.type);
            if (editor.dropEnter === false) {
                editor.dropEnter = true;
                editor.fire('dragenter', event);
            }
        });

        (0, _DomElement2.default)(editor.$content).on('drop', function (event) {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            console.log(event.type);
            editor.dropEnter = false;
            // editor.fire('drop',event);
            getDropFiles(event).forEach(function (attachment) {
                attachmentHandler(editor, attachment);
            });
        });

        (0, _DomElement2.default)(editor.$content).on('dragover', function (event) {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            // console.log(event.type);
            event.dataTransfer.dropEffect = 'copy';
            if (editor.dropEnter === false) {
                editor.dropEnter = true;
                editor.fire('dragenter', event);
            }
        });

        (0, _DomElement2.default)(editor.$content).on('dragleave', function (event) {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            // console.log(event.type);
            if (event.screenX === 0 && event.screenY === 0) {
                editor.dropEnter = false;
                editor.fire('dragleave', event);
            }
        });

        _this2.upload = new _UploadButton2.default({
            small: true,
            upload: function upload(files) {
                var _loop = function _loop() {
                    var file = files[i];
                    var attachment = new _Attahment2.default(file, file.name);
                    (0, _uploader2.default)(editor, attachment.file).then(function (data) {
                        attachment.data = data;
                        editor.addAttachment(attachment);
                    });
                    _this2.layer.hide();
                };

                for (var i = 0; i < files.length; i++) {
                    _loop();
                }
            }
        });
        return _this2;
    }

    _createClass(AttachmentManager, [{
        key: 'init',
        value: function init(node) {
            this.tab = new _Tab2.default({ target: { btns: ['文件列表', '上传文件'], views: [getAttachmentList.call(this, this.editor), this.upload.target] }, current: 0, small: true });
            var ele = _DomElement2.default.element('div', { class: 'snow-attachment-menu' }, null, this.tab.target);
            this.layer = new _PopLayer2.default(ele, node);
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {}
    }, {
        key: 'onClick',
        value: function onClick(event) {
            this.tab = new _Tab2.default({ target: { btns: ['文件列表', '上传文件'], views: [getAttachmentList.call(this, this.editor), this.upload.target] }, current: 0, small: true });
            this.layer.content = _DomElement2.default.element('div', { class: 'snow-attachment-menu' }, null, this.tab.target);
            this.layer.show();
        }
    }, {
        key: 'name',
        get: function get() {
            return 'attachment';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return AttachmentManager;
}(_Component3.default);

exports.default = AttachmentManager;

},{"../../../dom/DomElement":3,"../../../editor/SnowEditor":4,"../../../poplayer/PopLayer":26,"../../../tab/Tab":27,"../../../upload/UploadButton":30,"../../../util/getDropFiles":33,"../../../util/getPasteFiles":34,"../../../util/getSize":36,"../Attahment":5,"../Component":6,"./uploader":22}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

var _PopLayer = require('../../../poplayer/PopLayer');

var _PopLayer2 = _interopRequireDefault(_PopLayer);

var _DomElement = require('../../../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _Text = require('./emotion/Text');

var _Text2 = _interopRequireDefault(_Text);

var _Tab = require('../../../tab/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var n = _DomElement2.default.element;

/**
 * 表情处理
 */

var EmotionComponent = function (_Component) {
    _inherits(EmotionComponent, _Component);

    function EmotionComponent() {
        _classCallCheck(this, EmotionComponent);

        return _possibleConstructorReturn(this, (EmotionComponent.__proto__ || Object.getPrototypeOf(EmotionComponent)).apply(this, arguments));
    }

    _createClass(EmotionComponent, [{
        key: 'init',
        value: function init(node) {
            var buttons = new Array();
            var views = new Array();
            var that = this;
            this.editor.config.emotions.forEach(function (element) {
                var emotion = null;
                var childs = new Array();
                if (element.type === 'text') {
                    emotion = new _Text2.default(element);
                }
                if (emotion) {
                    emotion.content.forEach(function (emotionObj) {
                        var item = _DomElement2.default.element('span', {
                            class: 'snow-tool-emotions-item',
                            onclick: function onclick() {
                                editor.exec('insertHTML', emotionObj.html);
                                that.layer.hide();
                            }
                        }, {}, emotionObj.view);
                        childs.push(item);
                    });
                }
                var view = n('div', { class: 'snow-emotions-tab-view' }, {}, childs);
                buttons.push(element.name);
                views.push(view);
            });

            this.tab = new _Tab2.default({ target: { btns: buttons, views: views }, current: 0, small: true });
            this.content = n('div', { class: 'snow-emotions-menu' }, {}, this.tab.target);
            this.layer = new _PopLayer2.default(this.content, node);
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {}
    }, {
        key: 'onClick',
        value: function onClick(event) {
            this.layer.show();
        }
    }, {
        key: 'name',
        get: function get() {
            return 'emotion';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return EmotionComponent;
}(_Component3.default);

exports.default = EmotionComponent;

},{"../../../dom/DomElement":3,"../../../poplayer/PopLayer":26,"../../../tab/Tab":27,"../Component":6,"./emotion/Text":21}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

var _PopLayer = require('../../../poplayer/PopLayer');

var _PopLayer2 = _interopRequireDefault(_PopLayer);

var _DomElement = require('../../../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _Tab = require('../../../tab/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

var _UploadButton = require('../../../upload/UploadButton');

var _UploadButton2 = _interopRequireDefault(_UploadButton);

var _Attahment = require('../Attahment');

var _Attahment2 = _interopRequireDefault(_Attahment);

var _uploader = require('./uploader');

var _uploader2 = _interopRequireDefault(_uploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var n = _DomElement2.default.element;

/**
 * 图片处理
 */

var ImageComponent = function (_Component) {
    _inherits(ImageComponent, _Component);

    function ImageComponent(editor) {
        _classCallCheck(this, ImageComponent);

        var _this = _possibleConstructorReturn(this, (ImageComponent.__proto__ || Object.getPrototypeOf(ImageComponent)).call(this, editor));

        _this.upload = new _UploadButton2.default({
            small: true,
            accept: 'image/*',
            upload: function upload(files) {
                var _loop = function _loop() {
                    var file = files[i];
                    var attachment = new _Attahment2.default(file, file.name);
                    (0, _uploader2.default)(editor, attachment.file).then(function (data) {
                        attachment.data = data;
                        editor.addAttachment(attachment);
                        if (attachment.isImage) {
                            editor.exec('insertHTML', attachment.html);
                        }
                    });
                    _this.layer.hide();
                };

                for (var i = 0; i < files.length; i++) {
                    _loop();
                }
            }
        });
        var input = n('input', { class: 'snow-input-text snow-image-input', placeholder: '请输入图片地址', type: 'text' });
        var title = n('input', { class: 'snow-input-text snow-image-input', placeholder: '图片说明', type: 'text' });
        _this.input = n('div', { class: 'snow-image-inputs' }, {}, [title, input, n('div', { class: 'snow-image-button' }, null, n('div', {
            class: 'snow-btn snow-btn-sm', onclick: function onclick() {
                var src = (0, _DomElement2.default)(input).val();
                var alt = (0, _DomElement2.default)(title).val() || src;
                if (src) {
                    editor.exec('insertHTML', '<img title="' + alt + '"  alt="' + alt + '" src="' + src + '"/>');
                }
                _this.layer.hide();
            }
        }, null, '插入'))]);
        return _this;
    }

    _createClass(ImageComponent, [{
        key: 'init',
        value: function init(node) {
            this.tab = new _Tab2.default({ target: { btns: ['插入图片', '网络图片'], views: [this.upload.target, this.input] }, current: 0, small: true });
            this.content = n('div', { class: 'snow-image-menu' }, {}, this.tab.target);
            this.layer = new _PopLayer2.default(this.content, node);
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {}
    }, {
        key: 'onClick',
        value: function onClick(event) {
            this.layer.show();
        }
    }, {
        key: 'name',
        get: function get() {
            return 'image';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return ImageComponent;
}(_Component3.default);

exports.default = ImageComponent;

},{"../../../dom/DomElement":3,"../../../poplayer/PopLayer":26,"../../../tab/Tab":27,"../../../upload/UploadButton":30,"../Attahment":5,"../Component":6,"./uploader":22}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

var _PopLayer = require('../../../poplayer/PopLayer');

var _PopLayer2 = _interopRequireDefault(_PopLayer);

var _DomElement = require('../../../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var n = _DomElement2.default.element;

var LinkComponent = function (_Component) {
    _inherits(LinkComponent, _Component);

    function LinkComponent(editor) {
        _classCallCheck(this, LinkComponent);

        var _this = _possibleConstructorReturn(this, (LinkComponent.__proto__ || Object.getPrototypeOf(LinkComponent)).call(this, editor));

        var input = n('input', { class: 'snow-input-text snow-link-input', placeholder: '链接地址', type: 'text' });
        var title = n('input', { class: 'snow-input-text snow-link-input', placeholder: '连接说明', type: 'text' });
        _this.input = n('div', { class: 'snow-link-inputs' }, {}, [title, input, n('div', { class: 'snow-link-button' }, null, n('div', {
            class: 'snow-btn snow-btn-sm', onclick: function onclick() {
                var href = (0, _DomElement2.default)(input).val();
                var name = (0, _DomElement2.default)(title).val() || href;
                if (href) {
                    var html = '<a title="' + name + '" href="' + href + '">' + name + '</a>';
                    _this.editor.exec('insertHTML', html);
                }
                _this.layer.hide();
            }
        }, null, '插入'))]);
        return _this;
    }

    _createClass(LinkComponent, [{
        key: 'init',
        value: function init(node) {
            this.content = n('div', { class: 'snow-link-menu' }, {}, this.input);
            this.layer = new _PopLayer2.default(this.content, node);
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {}
    }, {
        key: 'onClick',
        value: function onClick(event) {
            this.layer.show();
        }
    }, {
        key: 'name',
        get: function get() {
            return 'link';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return LinkComponent;
}(_Component3.default);

exports.default = LinkComponent;

},{"../../../dom/DomElement":3,"../../../poplayer/PopLayer":26,"../Component":6}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EmotionObj = function EmotionObj(title, html, view) {
    _classCallCheck(this, EmotionObj);

    this.html = html;
    this.view = view;
    this.title = title;
};

exports.default = EmotionObj;

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Object = require('./Object');

var _Object2 = _interopRequireDefault(_Object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextEmotions = function () {
    function TextEmotions(data) {
        _classCallCheck(this, TextEmotions);

        var content = new Array();
        data.content.forEach(function (element) {
            content.push(new _Object2.default(element, element, element));
        });
        this._content = content;
    }

    _createClass(TextEmotions, [{
        key: 'content',
        get: function get() {
            return this._content;
        }
    }]);

    return TextEmotions;
}();

exports.default = TextEmotions;

},{"./Object":20}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uploader;

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

var _uploadToLocal = require('./uploadToLocal');

var _uploadToLocal2 = _interopRequireDefault(_uploadToLocal);

var _uploadToServer = require('./uploadToServer');

var _uploadToServer2 = _interopRequireDefault(_uploadToServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 文件上传接口
 * 
 * @param {SnowEditor} editor 编辑器
 * @param {File} file 上传的文件
 */
function uploader(editor, file) {
    var hasUploader = _config2.default.upload && _config2.default.upload.uploader;
    if (hasUploader) {
        return (0, _uploadToServer2.default)(editor, file);
    } else {
        return (0, _uploadToLocal2.default)(editor, file);
    }
}

},{"../../../config":25,"./uploadToLocal":23,"./uploadToServer":24}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uploadToLocal;

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 将文件在本地转换为 Base64
 * @param {SnowEditor} editor 编辑器
 * @param {File} file 上传的文件
 */
function uploadToLocal(editor, file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', function () {
            var result = { local: true, name: file.name, link: reader.result };
            var hasAdapter = _config2.default.upload && _config2.default.upload.adapter && _config2.default.upload.adapter.local && _config2.default.upload.adapter.local.resovle;
            if (hasAdapter) {
                resolve(_config2.default.upload.adapter.local.resovle(result));
            } else {
                resovle(result);
            }
        });
    });
}

},{"../../../config":25}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uploadToServer;

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 上传文件至服务器
 * @param {SnowEditor} editor 编辑器
 * @param {File} file 上传的文件
 */
function uploadToServer(editor, file) {
    return new Promise(function (resolve, reject) {
        var hasAdapter = _config2.default.upload && _config2.default.upload.adapter && _config2.default.upload.adapter.server;
        var hasUploader = _config2.default.upload && _config2.default.upload.uploader;
        if (hasUploader) {} else {
            editor.alert('未定义文件上传函数');
        }
    });
}

},{"../../../config":25}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * 基础默认配置
 */
var config = {
    height: '10rem',
    editable: true,
    toolbar: [
    // 基本控制
    'bold', 'italic', 'underline',
    // 布局控制
    'align-left', 'align-center', 'align-right',
    // 表情
    'emotion', 'image', 'link', 'attachment',
    // 撤销与重做
    'undo', 'redo'],
    emotions: [{
        name: 'Emoji',
        type: 'text',
        content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐 😭'.split(/\s/)
    }],

    upload: {
        // 适配器
        adapter: {
            // base64 适配器
            local: {
                resovle: function resovle(uploaded) {
                    return uploaded;
                },
                reject: function reject(error) {
                    return error;
                }
            },
            // ajax 适配器
            server: {
                resovle: function resovle(uploaded) {
                    return uploaded;
                },
                reject: function reject(error) {
                    return error;
                }
            }
        },
        // 使用默认 (base64)
        uploader: null,
        // 上传配置
        config: null
    }
};

exports.default = config;

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _getSize = require('../util/getSize');

var _getSize2 = _interopRequireDefault(_getSize);

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _getPlatform = require('../util/getPlatform');

var _getPlatform2 = _interopRequireDefault(_getPlatform);

var _pointInBox = require('../util/pointInBox');

var _pointInBox2 = _interopRequireDefault(_pointInBox);

var _onMouseHover = require('../util/onMouseHover');

var _onMouseHover2 = _interopRequireDefault(_onMouseHover);

var _timeLimitCallback = require('../util/timeLimitCallback');

var _timeLimitCallback2 = _interopRequireDefault(_timeLimitCallback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultZIndexLevel = _config2.default.popLayerLevel || 9000;
var n = _DomElement2.default.element;
var STR = {
    layerId: 'snow-layer-shade',
    parentSide: 'parentSide',
    windowPop: 'windowPop',
    windowSide: 'windowSide',
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut'
};

var layerCounter = 0;

function getBody() {
    return document.getElementsByTagName('body')[0];
}

function hideElement(defaultDirection) {
    var _this = this;

    var animationTime = this.animationTime;
    var timeout = animationTime * 1000;
    var showElement = this.showElement;
    if (showElement === null) {
        return;
    }
    if (this.showState === STR.windowSide) {
        (0, _DomElement2.default)(showElement).css({
            animation: getAnimtion(this.direction, defaultDirection, 'Out') + ' ease ' + animationTime + 's forwards'
        });
    } else if (this.showState === STR.parentSide) {
        (0, _DomElement2.default)(showElement).css({
            animation: getAnimtion(this.direction, defaultDirection, 'Out') + ' ease ' + animationTime + 's forwards'
        });
    } else if (this.showState === STR.windowPop) {
        (0, _DomElement2.default)(showElement).css({
            animation: getAnimtion(this.direction, defaultDirection, 'Out') + ' ease ' + animationTime + 's forwards'
        });
    }
    if (this.showShade) {
        (0, _DomElement2.default)(this.showShade).css({ animation: STR.fadeOut + ' ease ' + animationTime + 's forwards' });
    }
    setTimeout(function () {
        _this.clear();
    }, timeout);
}

function showElement(defaultDirection, posOfParent, posOfWindow, posOfPop, calcPosOfParent) {
    var showElem = this.showElement;
    var initDisplayInWindow = function initDisplayInWindow(showElem) {
        var shade = this.config.shade || true;
        var hideInShadeClick = this.config.shadeClickHide || true;
        var layerPop = this.config.pop || (0, _getPlatform2.default)() === 'pc';
        var layer = this;
        var animationTime = this.animationTime;
        if (shade) {

            var style = window.getComputedStyle(showElem);
            this.showShade = n('div', {
                id: STR.layerId,
                onclick: function onclick() {
                    if (hideInShadeClick) {
                        layer.hide();
                        (0, _DomElement2.default)(layer.showShade).css({ display: 'none' });
                    }
                }
            }, {
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: style.zIndex - 10,
                animation: STR.fadeIn + ' ease ' + animationTime + 's forwards',
                backgroundColor: 'rgba(0,0,0,0.4)'
            });
            getBody().appendChild(this.showShade);
        }

        if (layerPop) {
            (0, _DomElement2.default)(showElem).css(posOfPop).css({
                animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards'
            });
            this.showState = STR.windowPop;
        } else {
            (0, _DomElement2.default)(showElem).css(posOfWindow).css({
                animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards'
            });
            this.showState = STR.windowSide;
        }
    };

    var initDisplayAfterParent = function initDisplayAfterParent(showElem) {
        var animationTime = this.animationTime;
        this.showState = STR.parentSide;
        this.showShade = null;
        (0, _DomElement2.default)(showElem).css(posOfParent).css({
            animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards'
        });
        (0, _DomElement2.default)(window).on('resize scroll', (0, _timeLimitCallback2.default)(function (event) {
            var pos = calcPosOfParent();
            (0, _DomElement2.default)(showElem).css(pos);
        }).run);
    };

    var size = (0, _getSize2.default)(this.$parent);
    var elemSize = (0, _getSize2.default)(showElem);
    var windowSize = (0, _getSize2.default)(null);
    if (size.left + elemSize.width > windowSize.width) {
        initDisplayInWindow.call(this, showElem, windowSize, elemSize);
    } else {
        initDisplayAfterParent.call(this, showElem, size);
    }
}

var showController = {
    outerBottom: function outerBottom(elemSize, parentSize, windowSize) {
        var _this2 = this;

        var posOfParent = {
            left: parentSize.left + 'px',
            top: parentSize.top + parentSize.height + 'px'
        };
        var posOfWindow = {
            left: '0px',
            top: elemSize.height >= windowSize.height ? windowSize.height * 0.8 + 'px' : null,
            bottom: '0px',
            overflow: 'auto',
            maxHeight: '80%',
            maxWidth: '100%',
            width: '100%'
        };
        var posOfPop = {
            left: elemSize.width >= windowSize.width ? '0px' : windowSize.width / 2 - elemSize.width / 2 + 'px',
            top: elemSize.height >= windowSize.height ? windowSize.height + 'px' : windowSize.height / 2 - elemSize.height / 2 + 'px',
            overflow: 'auto',
            maxHeight: '100%',
            maxWidth: '100%'
        };
        var calcPosOfParent = function calcPosOfParent() {
            var ps = (0, _getSize2.default)(_this2.$parent);
            return {
                left: ps.left + 'px',
                top: ps.top + ps.height + 'px'
            };
        };
        showElement.call(this, 'Bottom', posOfParent, posOfWindow, posOfPop, calcPosOfParent);
    }
};

var hideController = {
    outerBottom: function outerBottom() {
        hideElement.call(this, 'Bottom');
    }
};

function getAnimtion(name, def, subfix) {
    return 'slide' + (name || def) + subfix;
}

/**
 * 自动弹出层
 * 检测内容的大小，选择下拉弹出或者浮动弹窗
 */

var PopLayer = function () {

    /**
     * 创建一个弹出层
     * 
     * @param {Element} element 显示的元素
     * @param {Element|Window} parent 显示的父元素 
     * @param {Array} config 配置
     */
    function PopLayer(element, parent, config) {
        _classCallCheck(this, PopLayer);

        this.$parent = parent || window;
        this.$element = element;
        this.config = config || { shade: true };
        this.id = layerCounter++;
        this.direction = this.config.direction;
        this.position = 'outerBottom';
        this.showElement = null;
        this.showShade = null;
        this.showed = false;
        this.clickOutListener = null;
    }

    _createClass(PopLayer, [{
        key: 'show',


        /**
         * 显示弹出层
         */
        value: function show() {
            var _this3 = this;

            this.clear();
            var showElement = n('div', { id: 'pop-layer-' + this.id }, { display: 'block', position: 'fixed', zIndex: defaultZIndexLevel }, this.$element);
            getBody().appendChild(showElement);
            this.showElement = showElement;
            var size = (0, _getSize2.default)(this.$parent);
            var elemSize = (0, _getSize2.default)(this.$element);
            var windowSize = (0, _getSize2.default)(null);

            showController[this.position].call(this, elemSize, size, windowSize);
            (0, _DomElement2.default)(this.showElement).css({ 'display': 'block' });
            this.showed = true;

            if (this.clickOutListener) {
                (0, _DomElement2.default)(window).off('click', this.clickOutListener);
                this.clickOutListener = null;
            }

            (0, _onMouseHover2.default)(this.showElement, null, function () {
                if (_this3.clickOutListener == null) {
                    _this3.clickOutListener = function (event) {
                        var x = event.pageX || event.clientX || event.x;
                        var y = event.pageY || event.clientY || event.y;
                        var box = (0, _getSize2.default)(_this3.showElement);
                        var point = { x: x, y: y };
                        // 获取正常的事件
                        if (event.isTrusted && !(0, _pointInBox2.default)(point, box) && _this3.showed) {
                            _this3.hide();
                        }
                    };
                    (0, _DomElement2.default)(window).on('click', _this3.clickOutListener);
                }
            });
            if (this.showShade) {
                (0, _DomElement2.default)(this.showShade).css({ 'display': 'block' });
            }
        }

        /**
         * 清理显示内容
         */

    }, {
        key: 'clear',
        value: function clear() {
            this.showed = false;
            var body = getBody();
            if (this.showElement) {
                body.removeChild(this.showElement);
                this.showElement = null;
            }
            if (this.showShade) {
                body.removeChild(this.showShade);
                this.showShade = null;
            }
        }
        /**
         * 获取动画时长
         */

    }, {
        key: 'hide',


        /**
         * 隐藏
         */
        value: function hide() {
            hideController[this.position].call(this);
            this.showed = false;
        }
    }, {
        key: 'content',
        set: function set(element) {
            this.$element = element;
        },
        get: function get() {
            return this.$element;
        }
    }, {
        key: 'animationTime',
        get: function get() {
            return this.config.animationTime || .3;
        }
    }]);

    return PopLayer;
}();

exports.default = PopLayer;

},{"../config":2,"../dom/DomElement":3,"../util/getPlatform":35,"../util/getSize":36,"../util/onMouseHover":40,"../util/pointInBox":41,"../util/timeLimitCallback":43}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var n = _DomElement2.default.element;

var defaultConfig = {
    target: '#snow-tab', // 对象选择器
    selector: {
        title: '.snow-tab-title',
        titleItem: '.snow-tab-title > li',
        content: '.snow-tab-content',
        contentItem: '.snow-tab-item'
    },
    class: {
        title: 'snow-tab-title',
        titleSmall: 'snow-tab-sm',
        titleItem: null,
        content: 'snow-tab-content',
        contentItem: 'snow-tab-item'
    },
    classOnShow: {
        title: 'snow-tab-current',
        content: 'snow-tab-show'
    }

    /**
     * target -> get dom -> bind event -> render -> show
     */

};function eventBinder() {
    var _this = this;

    var $btns = this.$btns.elements;
    var $views = this.$views.elements;
    var onshow = this.onshow;
    var onhidden = this.onhidden;
    var config = this.config;
    if (config.current >= 0) {
        this.current = config.current;
        (0, _DomElement2.default)($views[this.current]).addClass(config.classOnShow.content);
        (0, _DomElement2.default)($btns[this.current]).addClass(config.classOnShow.title);
    }
    $btns.forEach(function (btn, index) {
        (0, _DomElement2.default)(btn).on('click', function () {
            var current = _this.current || 0;
            (0, _DomElement2.default)($views[current]).removeClass(config.classOnShow.content);
            (0, _DomElement2.default)($views[index]).addClass(config.classOnShow.content);
            (0, _DomElement2.default)(btn).addClass(config.classOnShow.title);
            (0, _DomElement2.default)($btns[current]).removeClass(config.classOnShow.title);
            _this.current = index;
            if (onshow instanceof Function) {
                onshow.call(_this, index);
            }
            if (onhidden instanceof Function) {
                onhidden.call(_this, current);
            }
        });
    });
}

function getTargetChilds() {
    var target = this.config.target;
    this.target = (0, _DomElement2.default)(target)[0];
    this.$btns = (0, _DomElement2.default)(this.target).find(this.config.selector.titleItem);
    this.$views = (0, _DomElement2.default)(this.target).find(this.config.selector.contentItem);
}

function buildTabViews() {
    var config = this.config;
    var btns = config.target.btns;
    var views = config.target.views;
    var vBtns = new Array();
    var vViews = new Array();
    var sm = config.small || false;

    btns.forEach(function (ele) {
        if (ele instanceof String) {
            ele = document.createTextNode(ele);
        }
        var btn = n('li', { class: config.class.titleItem }, {}, ele);
        vBtns.push(btn);
    });

    views.forEach(function (ele) {
        if (ele instanceof String) {
            ele = document.createTextNode(ele);
        }
        var view = n('div', { class: config.class.contentItem }, {}, ele);
        vViews.push(view);
    });

    var btnsParent = n('ul', { class: sm ? config.class.title + ' ' + config.class.titleSmall : config.class.title }, {}, vBtns);
    var viewsParent = n('div', { class: config.class.content }, {}, vViews);

    this.target = n('div', {}, {}, [btnsParent, viewsParent]);
    this.$btns = (0, _DomElement2.default)(vBtns);
    this.$views = (0, _DomElement2.default)(vViews);
}

/**
 *  Tab 控制器
 *  button某个按钮选中，则contents的对应ID的display为block
 */

var Tab =

/**
 * 创建对象
 * @param {Object} config 
 */
function Tab(config) {
    _classCallCheck(this, Tab);

    this.config = Object.assign(defaultConfig, config);
    if (config.target instanceof Object) {
        buildTabViews.call(this);
    } else {
        getTargetChilds.call(this);
    }
    eventBinder.call(this);
};

exports.default = Tab;

},{"../dom/DomElement":3}],28:[function(require,module,exports){
'use strict';

var _Tab = require('./Tab');

var _Tab2 = _interopRequireDefault(_Tab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.snow = window.snow || {};
window.snow.Tab = _Tab2.default;

},{"./Tab":27}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 常量
var TOAST_PARENT_ID = 'Toast-Parent';
var TOAST_SHOW_ID = 'Toast-Show';
var TOAST_DEFAULT_STYLE = 'toast';
var TOAST_POP_LEVEL = _config2.default.toastLayerLevel || 10000;

var Toast = function Toast(text, time, style) {
    return new Toast.create(text, time, style);
};

// Toast队列
Toast.Queue = new Array();
// 构造函数
Toast.create = function (message, time, style) {
    Toast.Parent = document.getElementById(TOAST_PARENT_ID);

    if (!Toast.Parent) {
        Toast.Parent = _DomElement2.default.element('div', { id: TOAST_PARENT_ID }, { pointerEvents: 'none' });
        document.body.appendChild(Toast.Parent);
    }
    Toast.Queue.push({
        message: message,
        timeout: time,
        style: style ? TOAST_DEFAULT_STYLE + '-' + style : TOAST_DEFAULT_STYLE
    });
    Toast.show();
};

Toast.show = function () {
    // 一个时刻只能显示一个Toast
    if (document.getElementById(TOAST_SHOW_ID)) return;
    var show = Toast.Queue.shift();
    var toastdiv = _DomElement2.default.element('div', {
        id: TOAST_SHOW_ID,
        class: show.style
    });
    toastdiv.innerHTML = show.message;
    Toast.Parent.appendChild(toastdiv);
    var width = Toast.Parent.scrollWidth || window.innerWidth;
    var margin = width / 2 - toastdiv.scrollWidth / 2;
    var bottom = window.innerHeight - toastdiv.scrollHeight * 2;
    toastdiv.style.marginLeft = margin + 'px';
    toastdiv.style.top = bottom + 'px';
    var timeout = show.timeout || 2000;
    var close = function close() {
        (0, _DomElement2.default)(toastdiv).css({
            transition: 'opacity 0.3s ease-out',
            opacity: 0
        });

        setTimeout(function () {
            Toast.Parent.removeChild(toastdiv);
            if (Toast.Queue.length) {
                Toast.show();
            }
        }, 300);
    };

    (0, _DomElement2.default)(toastdiv).css({
        position: 'fixed',
        opacity: 1,
        zIndex: TOAST_POP_LEVEL,
        pointerEvents: 'none',
        transition: 'opacity 0.1s ease-in'
    });
    setTimeout(close, timeout);
};

exports.default = Toast;

},{"../config":2,"../dom/DomElement":3}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var n = _DomElement2.default.element;

var defaultConfig = {
    target: '#snow-upload', // 对象选择器
    accept: null,
    selector: {
        title: '.snow-upload-title',
        file: 'input[type=file]'
    },
    class: {
        title: 'snow-upload-title',
        titleSmall: 'snow-upload-sm',
        file: 'snow-upload-file'
    }
};

function getChilds() {
    var config = this.config;
    this.file = (0, _DomElement2.default)(config.selector.file, this.target)[0];
    this.title = (0, _DomElement2.default)(config.selector.title, this.target)[0];
}

function buildChilds() {
    var config = this.config;
    var sm = config.small || false;
    var accept = config.accept;
    this.title = n('div', { class: sm ? config.class.title + ' ' + config.class.titleSmall : config.class.title }, null, '上传文件');
    this.file = n('input', { class: config.class.file, hidden: true, type: 'file', accept: accept });
    this.target = n('div', null, null, [this.file, this.title]);
}

function binderEvent() {
    var _this = this;

    var title = this.title;
    var file = this.file;
    var upload = this.config.upload;

    (0, _DomElement2.default)(title).on('click', function (e) {
        file.click();
    });

    (0, _DomElement2.default)(file).on('change', function () {
        if (upload) {
            upload.call(_this, file.files);
        } else {
            console.error('uploader is invalid for config.upload');
        }
    });
}

/**
 * 创建文件上传按钮
 */

var UploadButton =

/**
 * 创建对象
 * @param {Object} config 
 */
function UploadButton(config) {
    _classCallCheck(this, UploadButton);

    this.config = {};
    this.config = Object.assign(this.config, defaultConfig, config);
    if (config.target) {
        this.target = (0, _DomElement2.default)(config.target)[0];
        getChilds.call(this);
    } else {
        buildChilds.call(this);
    }
    binderEvent.call(this);
};

exports.default = UploadButton;

},{"../dom/DomElement":3}],31:[function(require,module,exports){
'use strict';

var _UploadButton = require('./UploadButton');

var _UploadButton2 = _interopRequireDefault(_UploadButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.snow = window.snow || {};
window.snow.UploadButton = _UploadButton2.default;

},{"./UploadButton":30}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = fixCssPrefix;
var cssPrefix = function () {
    var styles = window.getComputedStyle(document.documentElement, '');
    var core = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms|)-/) || styles.OLink === '' && ['', 'o'])[1];
    return '-' + core + '-';
}();

/**
 * 转换CSS前缀
 * @param {String} name 
 */
function fixCssPrefix(name) {
    name = name.trim();
    name = typeof document.documentElement.style[name] === 'undefined' ? cssPrefix + name : name;
    return name;
}

},{}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDropFiles;
/**
 * 获取拖入的文件（图片或者附件）
 * @param {Event} event 拖拽事件
 */
function getDropFiles(event) {
  return event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files : null;
}

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPasteFiles;
/**
 * 获取粘贴的文件（图片或者附件）
 * @param {Event} event 拖拽事件
 */
function getPasteFiles(event) {
  return event.clipboardData && event.clipboardData.files ? event.clipboardData.files : null;
}

},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var agent = navigator.userAgent;
    if (agent.match(/(Mobile|Android|Linux|iPhone|iPad)/i)) {
        if (agent.match(/(Android|Linux)/i)) {
            return 'android';
        } else {
            return 'ios';
        }
    } else {
        return 'pc';
    }
};

},{}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getSize;

var _getWindowsSize2 = require('./getWindowsSize');

var _getWindowsSize3 = _interopRequireDefault(_getWindowsSize2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSize(elem) {
    if (elem instanceof Element) {
        return elem.getBoundingClientRect();
    } else /*if (elem instanceof Window)*/{
            var _getWindowsSize = (0, _getWindowsSize3.default)(),
                width = _getWindowsSize.width,
                height = _getWindowsSize.height;

            var elementRect = {
                width: width,
                height: height,
                left: 0,
                top: 0
            };
            return elementRect;
        }
}

},{"./getWindowsSize":37}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getWindowsSize;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getAxisSize(axis, body, html) {
    var max = screen[axis.toLowerCase()];
    var array = [body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis]].filter(function (item) {
        return item < max;
    });
    return Math.max.apply(Math, _toConsumableArray(array));
}

function getWindowsSize() {
    var body = window.document.body;
    var html = window.document.documentElement;
    return {
        height: getAxisSize('Height', body, html),
        width: getAxisSize('Width', body, html)
    };
}

},{}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isArray;
/**
 * 判断对象是否为数组
 * @param {Object} obj 
 */
function isArray(obj) {
  return obj instanceof Array;
}

},{}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isChildOf;
/**
 * 判断elem节点是否是parent的子节点
 * @param {Element} elem 子节点
 * @param {Element} parent 父节点
 */
function isChildOf(elem, parent) {
    while (elem && elem != parent) {
        elem = elem.parentNode;
    }
    return elem === parent;
}

},{}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = onMouseHover;

var _getSize = require('./getSize');

var _getSize2 = _interopRequireDefault(_getSize);

var _pointInBox = require('./pointInBox');

var _pointInBox2 = _interopRequireDefault(_pointInBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
检测鼠标是否覆盖某对象（含子元素）
 * @param {Element} target 目标
 * @param {Function} hover 覆盖回调
 * @param {Function} outer 未覆盖回调
 * @param {Integer} time 节流时间
 */
function onMouseHover(target, hover, outer, time) {
    var time = time | 10;
    var lastTime = new Date().getTime();
    window.addEventListener('mousemove', function (event) {
        event.hoverTarget = target;
        var curTime = new Date().getTime();
        if (curTime - lastTime >= time) {
            var box = (0, _getSize2.default)(target);
            var x = event.pageX || event.clientX || event.x;
            var y = event.pageY || event.clientY || event.y;
            if ((0, _pointInBox2.default)({ x: x, y: y }, box)) {
                event.hoverAction = 'hover';
                hover && hover(event);
            } else {
                event.hoverAction = 'outer';
                outer && outer(event);
            }
            lastTime = curTime;
        }
    });
}

},{"./getSize":36,"./pointInBox":41}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pointInBox;
/**
 * 判断点在矩形内
 * @param {Object} point 点，包含 x,y
 * @param {Rect} box 矩形，top,left,width,height
 */
function pointInBox(point, box) {
    var bottom = box.top + box.height;
    var right = box.left + box.width;
    if (point.y >= box.top && point.y <= bottom && point.x >= box.left && point.x <= right) {
        return true;
    }
    return false;
}

},{}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = printf;
var exp = null;
try {
    // firefox make this error
    exp = new RegExp('(?<!\\$)\\$(\\d+|\\w+?\\b)', 'g');
} catch (error) {
    exp = new RegExp('\\$(\\d+|\\w+?\\b)', 'g');
}

/**
 * 格式化输出字符
 * 
 * @param {String} format 格式化字符串
 * @param  {...any} args 
 */
function printf(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return format.replace(exp, function (target, name) {
        if (args.length === 1 && args[0] instanceof Object) {
            return args[0][name] || target;
        } else {
            return args[name] || target;
        }
    });
}

},{}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = timeLimitCallback;
/**
 * 基于时间的节流
 * @param {callback} callback 回调函数
 * @param {Object} target 回调对象
 * @param {Integer} time 节流时间
 */
function timeLimitCallback(callback, target, time) {
    var time = time | 10;
    var lastTime = new Date().getTime();
    return {
        run: function run() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var curTime = new Date().getTime();
            if (curTime - lastTime >= time) {
                callback.apply(target || callback, args);
                lastTime = curTime;
            }
        }
    };
}

},{}]},{},[1]);
