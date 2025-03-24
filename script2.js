// ==UserScript==
// @name         YouTube Default View
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Switch YouTube back to default view
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    let lastUrl = window.location.href;

    // Function to switch to default view if theater mode is active
    function switchToDefaultView() {
        const button = document.querySelector('button#original-size.ytp-size-button');
        if (button && button.getAttribute('data-title-no-tooltip') === 'Default view') {
            // Click the button to exit theater mode
            console.log('Switching to default view');
            button.click();
        }
    }

    // Function to run the delayed switch
    function delayedSwitch(time) {
        setTimeout(switchToDefaultView, time); // 500 milliseconds = 0.5 seconds
    }

    // Function to check for URL changes
    function checkUrlChange() {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            delayedSwitch(500);
        }
    }

    // Initial check on page load
    window.addEventListener('load', () => {
        lastUrl = window.location.href; // Ensure lastUrl is set correctly
        console.log('refresh');
        delayedSwitch(2000);
    });

    // Periodically check for URL changes every 1 second
    setInterval(checkUrlChange, 1000);
})();


