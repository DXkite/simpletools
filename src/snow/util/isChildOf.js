/**
 * 判断elem节点是否是parent的子节点
 * @param {Element} elem 子节点
 * @param {Element} parent 父节点
 */
export default function isChildOf(elem, parent) {
    while (elem && elem != parent) {
        elem = elem.parentNode;
    }
    return elem === parent;
}