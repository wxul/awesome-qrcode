chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('window.html', {
        id: 'winmain',
        innerBounds: {
            width: 800,
            height: 600,
            left: 100,
            top: 100,
            minWidth: 740,
            minHeight: 400,
            maxWidth: 940,
            maxHeight: 560
        }
    });
});

var dom = document.querySelector('#body');