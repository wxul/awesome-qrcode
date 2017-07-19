console.log('page loaded');

;
(function () {
    try {
        window.init();
    } catch (e) {
        console.log(e);
    }
})()