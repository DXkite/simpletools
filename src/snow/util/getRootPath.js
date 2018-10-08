export default function getRootPath() {
    var scripts = document.getElementsByTagName("script");
    var _self_path = scripts[scripts.length - 1].getAttribute("src");
    return _self_path.substring(0, _self_path.lastIndexOf("/"));
}