import util from '../util/index'

var Dom = function (selecter, context) {
    return new Dom.constructor(selecter, context);
}

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
    element: function (tag, attr, css, childs) {
        var element = document.createElement(tag);
        Dom(element).attr(attr).css(css);
        if (util.is_array(childs)) {
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

Dom.method = Dom.constructor.prototype;
Dom.method.extend = Dom.extend;
// 属性方法
Dom.method.extend({
    attr: function (attrs) {
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
    css: function (cssObj) {
        this.each(function () {
            if (cssObj) {
                for (var name in cssObj) {
                    this.style[util.cssfix(name)] = cssObj[name];
                }
            }
        });
        return this;
    },
    addClass: function (add) {
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
    removeClass: function (remove) {
        this.each(function () {
            var reg = new RegExp('/\\s+?' + remove + '/');
            var get = this.getAttribute('class');
            this.setAttribute('class', get.replace(reg, ''));
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
        this.each(function () {
            eventOn(this, type, listener, useCaptrue);
        });
        return this;
    },
    off: function (type, listener, useCaptrue) {
        this.each(function () {
            eventOff(this, type, listener, useCaptrue);
        });
        return this;
    }
});

export default Dom