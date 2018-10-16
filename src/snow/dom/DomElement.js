import isArray from '../util/isArray'
import cssfix from '../util/fixCssPrefix'

var DomElement = function (selecter, context) {
    return new DomElement.constructor(selecter, context);
}

DomElement.constructor = function (selecter, context) {
    if (typeof selecter === 'string') {
        this.elements = (context || document).querySelectorAll(selecter);
    } else if (selecter instanceof DomElement) {
        return selecter;
    } else if (selecter instanceof Element) {
        this.elements = [selecter];
    } else if (selecter instanceof Array) {
        this.elements = selecter;
    } else {
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
    element: function (tag, attr, css, childs) {
        var element = tag.indexOf('<') === -1 ? document.createElement(tag) : createElementFromString(tag);
        DomElement(element).attr(attr).css(css);
        if (isArray(childs)) {
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
        element.attachEvent('on' + type, callback)
    }
}

function eventOff(element, type, callback, useCaptrue) {
    var captrue = useCaptrue === undefined ? false : useCaptrue;
    if ('removeEventListener' in window) {
        element.removeEventListener(type, callback, captrue);
    } else {
        element.detachEvent('on' + type, callback)
    }
}

DomElement.method = DomElement.constructor.prototype;
DomElement.method.extend = DomElement.extend;
// 属性方法
DomElement.method.extend({
    attr: function (attrs) {
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
    css: function (cssObj) {
        this.each(function () {
            if (cssObj) {
                for (var name in cssObj) {
                    this.style[cssfix(name)] = cssObj[name];
                }
            }
        });
        return this;
    },
    addClass: function (add) {
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
    removeClass: function (remove) {
        this.each(function () {
            var get = this.getAttribute('class');
            if (get) {
                var oldClass = get.split(/\s+/);
                var newClass = oldClass.filter(element => element !== remove);
                if (newClass.length > 0) {
                    this.setAttribute('class', newClass.join(' '));
                } else {
                    this.removeAttribute('class');
                }
            }
        });
        return this;
    },
    each: function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this[i], this[i], i);
        }
        return this;
    },
    on: function (type, listener, useCaptrue) {
        type.split(/\s+/).forEach(subtype => {
            this.each(function () {
                eventOn(this, subtype, listener, useCaptrue);
            });
        });
        return this;
    },
    off: function (type, listener, useCaptrue) {
        type.split(/\s+/).forEach(subtype => {
            this.each(function () {
                eventOff(this, subtype, listener, useCaptrue);
            });
        });
        return this;
    },
    find: function (selecter) {
        return DomElement(selecter, this[0]);
    }
});

export default DomElement