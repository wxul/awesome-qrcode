chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('window.html', {
        id: 'winmain',
        innerBounds: {
            width: 800,
            height: 600,
            left: 100,
            top: 100,
            minWidth: 500,
            minHeight: 300,
            maxWidth: 740,
        }
    });
});

var dom = document.querySelector('#body');