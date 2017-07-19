console.log('page loaded');
/* sometimes I dont want to write annotations */
;
(function () {
    window.init = function () {
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
                QR.changeText(`smsto:${tel}:${note}`);
            },
            effect() {
                console.log('clear effect!');
                d('#frm_effect').reset();
                QR.resetAll();
                entry.file = null;
            },
        }

        // menu click
        U.on(nav, 'click', e => {
            var t = e.target;
            if ((U.hasClass(t, 'a') || U.hasClass(t.parentNode, 'a')) && t !== nav.querySelector('.active')) {
                var id = t.id || t.parentNode.id;
                active.type = id;
                d('#generator').innerText = id == 'effect' ? chrome.i18n.getMessage('btn_clear') : chrome.i18n.getMessage('btn_generator');
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
            if (e.target.name == '') {
                QR.changeGcColor(d('#gc_type').value, e.target.value);
            } else {
                QR['change' + e.target.name](e.target.value);
            }
        }
        U.on(d('#fg_color'), 'change', colorchange);
        U.on(d('#bg_color'), 'change', colorchange);
        U.on(d('#pt_color'), 'change', colorchange);
        U.on(d('#inpt_color'), 'change', colorchange);
        U.on(d('#gc_color'), 'change', colorchange);
        U.on(d('#gc_type'), 'change', e => {
            QR.changeGcColor(e.target.value, d('#gc_color').value);
        })
        U.on(d('#point_range'), 'change', e => {
            var v = e.target.value;
            QR.changeRound(v < 0, Math.abs(v) / 100);
        })
        U.on(d('#s_width'), 'change', colorchange);
        U.on(d('#s_margin'), 'change', colorchange);
        U.on(d('#level_type'), 'change', colorchange);
        U.on(d('#rotate_type'), 'change', colorchange);

        U.on(d('#icon_type'), 'change', colorchange);
        // U.on(d('#icon'), 'change', e => {
        //     QR.changeLogoimg(e.target.files[0] || '', d('#icon_type').value);
        // });
        var entry = {
            _f: null,
            get file() {
                return this._f;
            },
            set file(f) {
                this._f = f;
                if (f) {
                    d('#level_type').value = "H";
                }
                d('#level_type')[f ? 'setAttribute' : 'removeAttribute']('disabled', 'disabled');
            }
        };
        U.on(d('#choose'), 'click', e => {
            chrome.fileSystem.chooseEntry({
                accepts: [{
                    description: 'image',
                    mimeTypes: ['image/*']
                }]
            }, readOnlyEntry => {
                if (chrome.runtime.lastError) {
                    // Something went wrong
                    console.warn("Whoops.. " + chrome.runtime.lastError.message);
                    // Maybe explain that to the user too?
                } else {
                    readOnlyEntry.file(function (file) {
                        entry.file = file;
                        QR.changeLogoimg(file || '', d('#icon_type').value);
                    });
                }
            })
        })
        U.on(d('#save'), 'click', e => {
            // var a = d('#btna');
            // a.setAttribute('href', d('#canvas').toDataURL('image/png'));
            // a.click();
            var errorHandler = function (err) {
                alert(err);
            }
            chrome.fileSystem.chooseEntry({
                type: 'saveFile',
                suggestedName: chrome.i18n.getMessage('filename'),
                accepts: [{
                    description: 'image',
                    mimeTypes: ['image/*']
                }]
            }, writableFileEntry => {
                if (chrome.runtime.lastError) {
                    // Something went wrong
                    console.warn("Whoops.. " + chrome.runtime.lastError.message);
                    // Maybe explain that to the user too?
                } else {
                    writableFileEntry.createWriter(function (writer) {
                        d('#canvas').toBlob(function (blob) {
                            writer.onerror = errorHandler;
                            writer.onwriteend = function (e) {
                                console.log('write complete');
                            };
                            writer.write(blob);
                        });
                    }, errorHandler);
                }
            })
        });

        nav_btns[0].click();
    }
})()