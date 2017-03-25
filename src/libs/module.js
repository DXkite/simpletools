;
(function (dxui) {
    // 根目录
    var root_path = (function () {
        var scripts = document.getElementsByTagName("script");
        var _self_path = scripts[scripts.length - 1].getAttribute("src");
        return _self_path.substring(0, _self_path.lastIndexOf("/"));
    })();

    function load_module(name) {    
        var _body=document.getElementById("body");
        
    }
    // 使用模块
    function use(moduls, callback) {

    }
    // 定义模块
    function define(module, callback) {

    }
})(dxui);