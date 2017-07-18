;
(function () {
    const on = (function () {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    })();
    const off = (function () {
        return function (element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false);
            }
        };
    })();
    const once = function (el, event, fn) {
        var listener = function () {
            if (fn) {
                fn.apply(this, arguments);
            }
            off(el, event, listener);
        };
        on(el, event, listener);
    };

    // window.$ = document.querySelectorAll;
    // window.$$ = document.querySelector;

    window.U = {
        on,
        off,
        once,
        hasClass(el, cls) {
            if (!el || !cls) return false;
            cls = this.trim(cls);
            return el.classList.contains(cls);
        },
        addClass(el, cls) {
            if (!el) return;
            var curClass = el.className;
            var classes = (cls || '').split(' ');

            for (var i = 0, j = classes.length; i < j; i++) {
                var clsName = classes[i];
                if (!clsName) continue;

                el.classList.add(clsName);
            }
        },
        removeClass(el, cls) {
            if (!el || !cls) return;
            var classes = cls.split(' ');
            var curClass = ' ' + el.className + ' ';

            for (var i = 0, j = classes.length; i < j; i++) {
                var clsName = classes[i];
                if (!clsName) continue;

                el.classList.remove(clsName);
            }
        },
        trim(str) {
            if (typeof str !== 'string') return null;
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        removeListClass(el, cls) {
            if (!el || !cls) return;
            [].forEach.call(el, e => {
                this.removeClass(e, cls);
            })
        }
    };
})();