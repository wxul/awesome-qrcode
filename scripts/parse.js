;
(function () {
    var body = document.querySelector('body');
    var html = body.innerHTML;
    var tmp = html.replace(/__MSG_([a-zA-Z_]+)__/g, function (match, v1) {
        return v1 ? chrome.i18n.getMessage(v1) : "";
    });
    if (tmp !== html) {
        body.innerHTML = tmp;
    }
})()