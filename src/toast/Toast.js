import { Dom } from '../dom/Dom'

// 常量
var TOAST_PARENT_ID = 'Toast-Parent';
var TOAST_SHOW_ID = 'Toast-Show';
var TOAST_DEFAULT_STYLE = 'toast';
var TOAST_POP_LEVEL = 10000;

var Toast = function (text, time, style) {
    return new Toast.create(text, time, style);
}

// Toast队列
Toast.Queue = new Array();
// 构造函数
Toast.create = function (message, time, style) {
    Toast.Parent = document.getElementById(TOAST_PARENT_ID);

    if (!Toast.Parent) {
        Toast.Parent = document.createElement('div');
        Toast.Parent.id = TOAST_PARENT_ID;
        document.body.appendChild(Toast.Parent);
    }
    Toast.Queue.push({
        message: message,
        timeout: time,
        style: style ? TOAST_DEFAULT_STYLE + '-' + style : TOAST_DEFAULT_STYLE,
    });
    Toast.show();
};


Toast.show = function () {
    // 一个时刻只能显示一个Toast
    if (document.getElementById(TOAST_SHOW_ID)) return;
    var show = Toast.Queue.shift();
    var toastdiv = Dom.element('div', {
        id: TOAST_SHOW_ID,
        class: show.style
    });
    toastdiv.innerHTML = show.message;
    Toast.Parent.appendChild(toastdiv);

    var margin = window.innerWidth / 2 - toastdiv.scrollWidth / 2;
    var bottom = window.innerHeight - toastdiv.scrollHeight * 2;
    toastdiv.style.marginLeft = margin + 'px';
    toastdiv.style.top = bottom + 'px';
    var timeout = show.timeout || 2000;

    var close = function () {
        Dom(toastdiv).css({
            'transition': 'opacity 0.3s ease-out',
            opacity: 0
        });

        setTimeout(function () {
            Toast.Parent.removeChild(toastdiv);
            if (Toast.Queue.length) {
                Toast.show();
            }
        }, 300);
    };

    Dom(toastdiv).css({
        position: 'fixed',
        opacity: 1,
        'z-index': TOAST_POP_LEVEL,
        transition: 'opacity 0.1s ease-in'
    });
    setTimeout(close, timeout);
}

module.exports = { Toast }