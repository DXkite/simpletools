export default function isChildOf(elem, parent) {
    while (elem != parent) {
        elem = elem.parentNode;
    }
    return elem === parent;
}