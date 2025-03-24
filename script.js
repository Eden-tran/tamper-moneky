// ==UserScript==
// @name         eJoy Shadow DOM Left Adjuster
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adjusts the 'left' position of div.container in eJoy extension's Shadow DOM on highlight.
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Wait for the full page to load
    window.addEventListener('load', () => {
        let previousLeft = null; // To store the previous left value

        // Function to observe changes in the container's style attribute
        function observeContainer(container) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (
                        mutation.type === 'attributes' &&
                        mutation.attributeName === 'style' &&
                        container.style.display === 'flex' // Check if the container is visible
                    ) {
                        if (container.style.left) {
                            adjustLeftPosition(container, observer); // Adjust position
                        }
                    }
                });
            });

            // Start observing the container for style attribute changes
            observer.observe(container, {
                attributes: true, // Observe changes to attributes
                attributeFilter: ['style'], // Only observe the 'style' attribute
            });
        }

        // Function to adjust the 'left' attribute by +50px if the condition is met
        function adjustLeftPosition(container, observer) {
            const currentLeft = parseInt(container.style.left, 10) || 0; // Parse current left value
            console.log(currentLeft !== previousLeft);

            // Check if the currentLeft is not equal to previousLeft + 50
            if (previousLeft === null || currentLeft !== previousLeft) {
                // Temporarily disconnect the observer to prevent infinite loops
                observer.disconnect();

                // Increment the 'left' value by 50px
                container.style.left = `${currentLeft + 50}px`;

                // Update the previous left value
                previousLeft = currentLeft + 50;

                console.log(`Left adjusted to: ${container.style.left}`);

                // Reconnect the observer
                observer.observe(container, {
                    attributes: true,
                    attributeFilter: ['style'], // Only observe the 'style' attribute
                });
            }
        }

        // Main function to find the shadow DOM and container
        function monitorEJoyExtension() {
            const rootElement = document.querySelector('#eJOY__extension_root');
            if (!rootElement || !rootElement.shadowRoot) {
                console.error('eJOY__extension_root or shadowRoot not found.');
                return;
            }

            const shadowRoot = rootElement.shadowRoot; // Access the shadow root
            const eJoyShadow = shadowRoot.querySelector('#eJOY__extension_shadow');
            if (!eJoyShadow) {
                console.error('eJoy_extension_shadow not found.');
                return;
            }

            const wrapperEjoy = eJoyShadow.querySelector('div.wrapperEjoy');
            if (!wrapperEjoy) {
                console.error('wrapperEjoy not found.');
                return;
            }

            const container = wrapperEjoy.querySelector('div.container');
            if (container) {
                observeContainer(container); // Start observing the container
            } else {
                console.error('Container not found.');
            }
        }

        // Observe the main document for the root element
        const mainObserver = new MutationObserver(() => {
            monitorEJoyExtension(); // Call the function when eJOY__extension_root element appears
        });

        // Start observing the document body
        mainObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
})();
