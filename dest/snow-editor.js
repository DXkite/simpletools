/*! snow-editor by dxkite 2018-10-06 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../util/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dom = function Dom(selecter, context) {
    return new Dom.constructor(selecter, context);
};

Dom.constructor = function (selecter, context) {
    if (typeof selecter === 'string') {
        this.elements = (context || document).querySelectorAll(selecter);
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

Dom.extend = function (methods) {
    for (var name in methods) {
        this[name] = methods[name];
    }
};

Dom.extend({
    element: function element(tag, attr, css, childs) {
        var element = document.createElement(tag);
        Dom(element).attr(attr).css(css);
        if (_index2.default.is_array(childs)) {
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

Dom.method = Dom.constructor.prototype;
Dom.method.extend = Dom.extend;
// 属性方法
Dom.method.extend({
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
                    this.style[_index2.default.cssfix(name)] = cssObj[name];
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
            var reg = new RegExp('/\\s+?' + remove + '/');
            var get = this.getAttribute('class');
            this.setAttribute('class', get.replace(reg, ''));
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

exports.default = Dom;

},{"../util/index":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* --------------- 全局函数 ------------------ */
var util = {};

util.is_function = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
};
util.is_array = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
util.is_object = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};
util.is_string = function (obj) {
    return typeof obj === 'string';
};
util.get_root_path = function () {
    var scripts = document.getElementsByTagName("script");
    var _self_path = scripts[scripts.length - 1].getAttribute("src");
    return _self_path.substring(0, _self_path.lastIndexOf("/"));
};
// 分发事件
util.dipatch_event = function (obj, name, value, canBubbleArg, cancelAbleArg) {
    var event = document.createEvent(str_cache[0]);
    var canBubble = (typeof canBubbleArg === 'undefined' ? 'undefined' : _typeof(canBubbleArg)) === undefined ? true : canBubbleArg;
    var cancelAbl = (typeof cancelAbleArg === 'undefined' ? 'undefined' : _typeof(cancelAbleArg)) === undefined ? true : cancelAbleArg;
    event.initCustomEvent(name, canBubble, cancelAbl, value);
    obj.dispatchEvent(event);
    if (obj['on' + name] && is_function(obj['on' + name])) {
        obj['on' + name].call(obj, event);
    }
    return event;
};

/**
 * 复制合并对象
 * 
 * @param {Object|string} arrays
 * @returns
 */
util.object_copy = function (arrays) {
    var object = {};
    for (var i = 0; i < arguments.length; i++) {
        for (var index in arguments[i]) {
            object[index] = arguments[i][index];
        }
    }
    return object;
};

// 前缀支持
util.get_css_perfix = function () {
    var styles = window.getComputedStyle(document.documentElement, '');
    var core = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms|)-/) || styles.OLink === '' && ['', 'o'])[1];
    return '-' + core + '-';
};

util.css_perfix = util.get_css_perfix();

/**
 * 添加CSS前缀（如果存在前缀）
 * 
 * @param {string} name
 * @returns 
 */
function add_css_prefix(name) {
    name = name.trim();
    name = typeof document.documentElement.style[name] === 'undefined' ? util.css_perfix + name : name;
    return name;
}

/**
 * 将驼峰式CSS转化成CSS文件用的CSS命名
 * 
 * @param {string} name
 * @returns
 */
util.cssname = function (name) {
    name = add_css_prefix(name);
    name = name.replace(/[A-Z]/, function (name) {
        return '-' + name.toLowerCase();
    });
    return name;
};

util.cssfix = add_css_prefix;

exports.default = util;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    height: '10rem'
};

exports.default = config;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Dom = require('../component/dom/Dom');

var _Dom2 = _interopRequireDefault(_Dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = null;
var components = new Array();
var n = _Dom2.default.element;

function onStatuChange() {
    console.log('onStatuChange');
}

function onContentChange(content) {
    console.log('onContentChange:' + content);
}

function createEditorView(editor) {
    var element = editor.element;
    editor.toolbar = n('div', {
        class: 'snow-toolbar'
    });
    editor.content = n('div', {
        class: 'snow-content',
        contenteditable: 'true',
        onfocus: function onfocus() {
            onStatuChange.call(editor);
        },
        onclick: function onclick() {
            onStatuChange.call(editor);
            onContentChange.call(editor, editor.content.innerHTML);
        },
        onkeyup: function onkeyup() {
            onContentChange.call(editor, editor.content.innerHTML);
        },
        onblur: function onblur() {
            onStatuChange.call(editor);
        }
    }, {
        'min-height': editor.config['height']
    }, element.innerHTML);
    element.innerText = '';
    element.appendChild(editor.toolbar);
    element.appendChild(editor.content);
}

function createToolBar(editor) {
    components.forEach(function (Comp) {
        var comp = new Comp(editor);
        editor.toolbar.appendChild(n('div', {
            class: 'snow-tool-item',
            name: comp.name,
            onclick: function onclick(e) {
                comp.onClick.call(comp, e, this);
            }
        }, {}, comp.view));
    });
}

var SnowEditor = function () {
    function SnowEditor(config) {
        _classCallCheck(this, SnowEditor);

        this.config = Object.assign(config, defaultConfig);
        this.element = document.querySelector(config.target);
        createEditorView(this);
        createToolBar(this);
    }

    _createClass(SnowEditor, [{
        key: 'getContent',
        value: function getContent() {
            return this.content.innerHTML;
        }
    }, {
        key: 'getSelectionText',
        value: function getSelectionText() {
            var val = this.getRange();
            return val ? val.toString() : null;
        }
    }, {
        key: 'getSelectionElement',
        value: function getSelectionElement() {
            var val = this.getRange();
            return val ? val.commonAncestorContainer : null;
        }
    }, {
        key: 'getRange',
        value: function getRange() {
            var selection = window.getSelection();
            if (selection.rangeCount > 0) {
                return selection.getRangeAt(0);
            }
            return null;
        }
    }, {
        key: 'exec',
        value: function exec(name, value) {
            document.execCommand(name, false, value);
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

},{"../component/dom/Dom":1}],5:[function(require,module,exports){
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
        console.log('component init');
    }

    _createClass(Component, [{
        key: 'onClick',
        value: function onClick(event) {
            console.log('onActiveEvent:', event);
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            console.log('onStatusChange');
        }
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
    }]);

    return Component;
}();

exports.default = Component;

},{}],6:[function(require,module,exports){
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
            this.onRangeAction(event, this.editor.getRange());
        }
    }]);

    return RangeComponent;
}(_Component3.default);

exports.default = RangeComponent;

},{"./Component":5}],7:[function(require,module,exports){
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

},{"../Component":5}],8:[function(require,module,exports){
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

},{"../Component":5}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RangeComponent2 = require('../RangeComponent');

var _RangeComponent3 = _interopRequireDefault(_RangeComponent2);

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
        value: function onRangeAction(event, range) {
            this.editor.exec('justifycenter');
        }
    }, {
        key: 'name',
        get: function get() {
            return 'center';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-align-' + this.name + '"></i>';
        }
    }]);

    return CenterLayoutComponent;
}(_RangeComponent3.default);

exports.default = CenterLayoutComponent;

},{"../RangeComponent":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RangeComponent2 = require('../RangeComponent');

var _RangeComponent3 = _interopRequireDefault(_RangeComponent2);

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
        value: function onRangeAction(event, range) {
            this.editor.exec('justifyleft');
        }
    }, {
        key: 'name',
        get: function get() {
            return 'left';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-align-' + this.name + '"></i>';
        }
    }]);

    return LeftLayoutComponent;
}(_RangeComponent3.default);

exports.default = LeftLayoutComponent;

},{"../RangeComponent":6}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RangeComponent2 = require('../RangeComponent');

var _RangeComponent3 = _interopRequireDefault(_RangeComponent2);

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
        value: function onRangeAction(event, range) {
            this.editor.exec('justifyright');
        }
    }, {
        key: 'name',
        get: function get() {
            return 'right';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-align-' + this.name + '"></i>';
        }
    }]);

    return RightLayoutComponent;
}(_RangeComponent3.default);

exports.default = RightLayoutComponent;

},{"../RangeComponent":6}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RangeComponent2 = require('../RangeComponent');

var _RangeComponent3 = _interopRequireDefault(_RangeComponent2);

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
        value: function onRangeAction(event, range) {
            this.editor.exec('bold');
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
}(_RangeComponent3.default);

exports.default = BoldStyleComponent;

},{"../RangeComponent":6}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RangeComponent2 = require('../RangeComponent');

var _RangeComponent3 = _interopRequireDefault(_RangeComponent2);

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
        value: function onRangeAction(event, range) {
            this.editor.exec('italic');
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
}(_RangeComponent3.default);

exports.default = ItalicStyleComponent;

},{"../RangeComponent":6}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RangeComponent2 = require('../RangeComponent');

var _RangeComponent3 = _interopRequireDefault(_RangeComponent2);

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
        value: function onRangeAction(event, range) {
            this.editor.exec('underline');
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
}(_RangeComponent3.default);

exports.default = UnderlineStyleComponent;

},{"../RangeComponent":6}],15:[function(require,module,exports){
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

},{"./config":3,"./editor/SnowEditor":4,"./editor/component/command/Redo":7,"./editor/component/command/Undo":8,"./editor/component/layout/Center":9,"./editor/component/layout/Left":10,"./editor/component/layout/Right":11,"./editor/component/style/Bold":12,"./editor/component/style/Italic":13,"./editor/component/style/Underline":14}]},{},[15]);
