import { util } from '../util'

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
    element: function (tag, attr, css) {
        var element = document.createElement(tag);
        Dom(element).attr(attr).css(css);
        return element;
    }
});


Dom.method = Dom.constructor.prototype;
Dom.method.extend = Dom.extend;
// 属性方法
Dom.method.extend({
    attr: function (attrs) {
        this.each(function () {
            if (attrs) {
                for (var name in attrs) {
                    this.setAttribute(name, attrs[name]);
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
            this.class += ' ' + add;
        });
        return this;
    },
    removeClass: function (remove) {
        this.each(function () {
            var reg = new RegExp('/\\s+?' + remove + '/');
            this.class.replace(reg, '');
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
        var captrue = typeof useCaptrue === undefined ? true : useCaptrue;
        this.each(function () {
            this.addEventListener(type, listener, captrue);
        });
        return this;
    }
});

module.exports = Dom;