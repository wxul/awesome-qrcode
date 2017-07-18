console.log('page loaded');

;
(function () {
    const QR = new createQRImage('canvas');
    window.qrcode = QR;
    QR.changeText('https://github.com/wxul/awesome-qrcode');

    const d = function (selector) {
        return document.querySelector(selector);
    }

    var nav = document.querySelector('#nav'),
        nav_btns = nav.querySelectorAll('.a');
    var content = document.querySelector('#body .main-content');

    var active = {
        _type: '',
        get type() {
            return this._type;
        },
        set type(v) {
            this._type = v;
            U.removeListClass(nav_btns, 'active');
            U.removeListClass(content.querySelectorAll('.section'), 'active');
            U.addClass(nav.querySelector('#' + v), 'active');
            U.addClass(content.querySelector(`[data-tag=${v}]`), 'active');
        }
    }

    var formatter = function (frm) {
        var name = frm.name;
        var tmp = '';
        [].forEach.call(frm.elements, e => {
            if (e.type == 'checkbox' && e.checked) {
                tmp += `${e.name}:${e.checked};`;
            } else if (!e.disabled) {
                var val = U.trim(e.value);
                if (val) {
                    tmp += `${e.name}:${val};`;
                }
            }
        });
        return `${name}:${tmp};`;
    }

    var generator = {
        txt() {
            var txt = d('#txt_area');
            QR.changeText(U.trim(txt.value));
        },
        tel() {
            var txt = d('#txt_tel');
            QR.changeText(`tel:${U.trim(txt.value)}`);
        },
        email() {
            var txt = d('#txt_email');
            QR.changeText(`mailto:${U.trim(txt.value)}`);
        },
        card() {
            var frm = d('#frm_card');
            QR.changeText(formatter(frm));
        },
        wifi() {
            var frm = d('#frm_wifi');
            QR.changeText(formatter(frm));
        },
        sms() {
            var frm = d('#frm_sms');
            var tel = U.trim(frm['Tel'].value),
                note = U.trim(frm['NOTE'].value);
            // QR.changeText(formatter(frm));
            QR.changeText(`smsto:${tel}:${note}`);
        },
        effect() {
            console.log('nothing happen');
        },
    }



    // menu click
    U.on(nav, 'click', e => {
        var t = e.target;
        if (U.hasClass(t, 'a') && t !== nav.querySelector('.active')) {
            var id = t.id;
            active.type = id;
        }
    })
    // generator click
    U.on(document.querySelector('#generator'), 'click', e => {
        generator[active.type]();
    })
    // select
    U.on(d('#sel'), 'change', e => {
        var p = d('#frm_wifi')['P'];
        p[e.target.value == 'nopass' ? 'setAttribute' : 'removeAttribute']('disabled', 'disabled');
    })

    var colorchange = e => {
        console.log(e.target.value);
    }
    U.on(d('#sel'), 'change', colorchange)

    nav_btns[0].click();
})()