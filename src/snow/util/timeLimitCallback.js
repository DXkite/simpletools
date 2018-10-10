/**
 * 基于时间的节流
 * @param {callback} callback 回调函数
 * @param {Object} target 回调对象
 * @param {Integer} time 节流时间
 */
export default function timeLimitCallback(callback, target, time) {
    var time = time | 10;
    var lastTime = new Date().getTime();
    return {
        run: (...args) => {
            var curTime = new Date().getTime();
            if (curTime - lastTime >= time) {
                callback.apply(target || callback, args);
                lastTime = curTime;
            }
        }
    }
}