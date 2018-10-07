/*! snow-editor by dxkite 2018-10-07 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    } else {
        this.elements = [selecter];
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
                    if (/^on/.test(name)) {
                        var type = name.replace(/^on(.+)$/, '$1');
                        if (/[A-Z]/.test(type[0])) {
                            type = type[0].toLowerCase() + type.substr(1);
                        }
                        eventOn(this, type, attrs[name]);
                    } else {
                        this.setAttribute(name, attrs[name]);
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
            var get = this.getAttribute('class');
            if (get) {
                this.setAttribute('class', get + ' ' + add);
            } else {
                this.setAttribute('class', add);
            }
        });
        return this;
    },
    removeClass: function removeClass(remove) {
        this.each(function () {
            var get = this.getAttribute('class');
            var oldClass = get.split(/\s+/);
            var newClass = oldClass.filter(function (element) {
                return element !== remove;
            });
            this.setAttribute('class', newClass.join(' '));
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
        this.each(function () {
            eventOn(this, type, listener, useCaptrue);
        });
        return this;
    },
    off: function off(type, listener, useCaptrue) {
        this.each(function () {
            eventOff(this, type, listener, useCaptrue);
        });
        return this;
    }
});

exports.default = DomElement;

},{"../util/fixCssPrefix":2,"../util/isArray":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    height: '10rem',
    editable: true,
    toolbar: [
    // 基本控制
    'bold', 'italic', 'underline',
    // 布局控制
    'align-left', 'align-center', 'align-right',
    // 表情
    'emotion',
    // 撤销与重做
    'undo', 'redo'],
    emotions: [{
        name: '默认',
        type: 'text',
        content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐'.split(/\s/)
    }, {
        name: '颜文字',
        type: 'text',
        content: []
    }]
};

exports.default = config;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DomElement = require('../component/dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = null;
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
    var element = editor.element;
    editor.$toolbar = n('div', {
        class: 'snow-toolbar'
    });
    editor.$content = n('div', {
        class: 'snow-content',
        contenteditable: editor.config.editable || true,
        onfocus: function onfocus() {
            editor._foucs = true;
            onStateChange.call(editor);
            editor.fire('focus');
        },
        onclick: function onclick() {
            editor._foucs = true;
            onStateChange.call(editor);
            editor.fire('click');
        },
        onkeyup: function onkeyup() {
            editor.fire('contentChange', editor.content, editor.range);
        },
        onblur: function onblur() {
            editor._foucs = false;
            onStateChange.call(editor);
            editor.fire('blur');
        }
    }, {
        'min-height': editor.config['height']
    }, element.innerHTML);
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
    // for browser
};

function _exec(name, value) {
    console.log('_exec', name);

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
        this.element = document.querySelector(config.target);
        this.listener = {};
        this._foucs = false;
        this.id = editorCounter++;
        this.$ = _DomElement2.default;
        createEditorView(this);
        createToolBar(this);
    }

    _createClass(SnowEditor, [{
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
            var selection = window.getSelection();
            if (selection.rangeCount > 0) {
                return selection.getRangeAt(0);
            }
        },
        set: function set(range) {
            if (range) {
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
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
    }]);

    return SnowEditor;
}();

exports.default = SnowEditor;

},{"../component/dom/DomElement":1}],6:[function(require,module,exports){
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
                var range = this.onRangeAction(this.editor.range, event) || this.editor.range;
                this.editor.range = range;
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

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EmotionComponent = function (_RangeComponent) {
    _inherits(EmotionComponent, _RangeComponent);

    function EmotionComponent(editor) {
        _classCallCheck(this, EmotionComponent);

        return _possibleConstructorReturn(this, (EmotionComponent.__proto__ || Object.getPrototypeOf(EmotionComponent)).call(this, editor));
    }

    _createClass(EmotionComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('insertHTML', '<span>😀</span>');
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
}(_Range2.default);

exports.default = EmotionComponent;

},{"../Range":7}],17:[function(require,module,exports){
'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _SnowEditor = require('./editor/SnowEditor');

var _SnowEditor2 = _interopRequireDefault(_SnowEditor);

var _Bold = require('./editor/component/style/Bold');

var _Bold2 = _interopRequireDefault(_Bold);

var _Italic = require('./editor/component/style/Italic');

var _Italic2 = _interopRequireDefault(_Italic);

var _Underline = require('./editor/component/style/Underline');

var _Underline2 = _interopRequireDefault(_Underline);

var _Redo = require('./editor/component/command/Redo');

var _Redo2 = _interopRequireDefault(_Redo);

var _Undo = require('./editor/component/command/Undo');

var _Undo2 = _interopRequireDefault(_Undo);

var _Right = require('./editor/component/layout/Right');

var _Right2 = _interopRequireDefault(_Right);

var _Left = require('./editor/component/layout/Left');

var _Left2 = _interopRequireDefault(_Left);

var _Center = require('./editor/component/layout/Center');

var _Center2 = _interopRequireDefault(_Center);

var _Emotion = require('./editor/component/tool/Emotion');

var _Emotion2 = _interopRequireDefault(_Emotion);

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

},{"./config":4,"./editor/SnowEditor":5,"./editor/component/command/Redo":8,"./editor/component/command/Undo":9,"./editor/component/layout/Center":10,"./editor/component/layout/Left":11,"./editor/component/layout/Right":12,"./editor/component/style/Bold":13,"./editor/component/style/Italic":14,"./editor/component/style/Underline":15,"./editor/component/tool/Emotion":16}]},{},[17]);