(function (dxui) {
    "use strict";
    /**
     * 创建可移动层
     * 
     * @param {Element} layer 移动层
     * @param {Element} controller 控制移动的层
     * @returns
     */
    dxui.moveable=function moveable(layer, controller) {
        var _controller = controller || layer;
        var _self = layer;
        // 调整层可以移动
        _self.style.position = 'fixed';
        var _move_layer = function (event) {
                // 阻止拖动页面（手机端）
                event.preventDefault();
                var eventMove = 'mousemove',
                    eventEnd = 'mouseup';
                // 手机触屏事件会成多点触控
                if (event.touches) {
                    event = event.touches[0];
                    eventMove = 'touchmove';
                    eventEnd = 'touchend';
                }
                var rect = _controller.getBoundingClientRect();
                var x = event.clientX - rect.left;
                var y = event.clientY - rect.top;
                // 拖拽
                var doc = document;
                if (_self.setCapture) {
                    _self.setCapture();
                } else if (window.captureEvents) {
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }

                // 移动
                var winmove = function (e) {
                    if (e.touches) {
                        e = e.touches[0];
                    }
                    var px = e.pageX || (e.clientX + document.body.scrollLeft - document.body.clientLeft);
                    var py = e.pageY || (e.clientY + document.body.scrollTop - document.body.clientTop);

                    var dx = px - x;
                    var dy = py - y;
                    _self.style.left = dx + 'px';
                    _self.style.top = dy + 'px';
                };
                // 停止
                var winend = function (e) {
                    if (_self.releaseCapture) {
                        _self.releaseCapture();
                    } else if (window.releaseEvents) {
                        window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                    }
                    doc.removeEventListener(eventMove, winmove);
                    doc.removeEventListener(eventEnd, winend);
                };
                doc.addEventListener(eventMove, winmove);
                doc.addEventListener(eventEnd, winend);
            }
            // 监听起始事件
        _controller.addEventListener('mousedown', _move_layer);
        _controller.addEventListener('touchstart', _move_layer);
        return _self;
    }
})(dxui);