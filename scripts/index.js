console.log('page loaded');

;
(function () {
    const QR = new createQRImage('canvas');
    window.qrcode = QR;
    QR.changeText('https://github.com/wxul/awesome-qrcode');

    var nav = document.querySelector('#nav'),
        nav_btns = nav.querySelectorAll('.a');
    var content = document.querySelector('#body .main-content');

    var active = {
        _type: '',
        get type() {
            return this._type;
        },
        set type(v) {
            _type = v;
            U.removeListClass(nav_btns, 'active');
            U.removeListClass(content.querySelectorAll('.section'), 'active');
            U.addClass(nav.querySelector('#' + v), 'active');
            U.addClass(content.querySelector(`[data-tag=${v}]`), 'active');
        }
    }
    U.on(nav, 'click', e => {
        var t = e.target;
        if (U.hasClass(t, 'a') && t !== nav.querySelector('.active')) {
            var id = t.id;
            active.type = id;
        }
    })

    nav_btns[0].click();
})()