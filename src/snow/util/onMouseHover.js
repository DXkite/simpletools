import getBox from './getSize'
import pointInBox from './pointInBox'

/**
检测鼠标是否覆盖某对象（含子元素）
 * @param {Element} target 目标
 * @param {Function} hover 覆盖回调
 * @param {Function} outer 未覆盖回调
 * @param {Integer} time 节流时间
 */
export default function onMouseHover(target, hover, outer, time) {
    var time = time | 10;
    var lastTime = new Date().getTime();
    window.addEventListener('mousemove', function (event) {
        event.hoverTarget = target;
        var curTime = new Date().getTime();
        if (curTime - lastTime >= time) {
            var box = getBox(target);
            const x = event.pageX || event.clientX || event.x;
            const y = event.pageY || event.clientY || event.y;
            if (pointInBox(
                { x: x, y: y },
                box
            )) {
                event.hoverAction = 'hover';
                hover && hover(event);
            } else {
                event.hoverAction = 'outer';
                outer && outer(event)
            }
            lastTime = curTime;
        }
    });
}