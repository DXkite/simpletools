/**
 * 判断点在矩形内
 * @param {Object} point 点，包含 x,y
 * @param {Rect} box 矩形，top,left,width,height
 */
export default function pointInBox(point, box) {
    const bottom = box.top + box.height;
    const right = box.left + box.width;
    if (point.y >= box.top &&
        point.y <= bottom &&
        point.x >= box.left &&
        point.x <= right) {
        return true;
    }
    return false;
}