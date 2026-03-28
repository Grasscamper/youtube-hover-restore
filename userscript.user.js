// ==UserScript==
// @name         YouTube Hover Restore
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Restore hover "Watch Later" functionality on YouTube
// @author       Grasscamper
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    
    const style = document.createElement('style');
    style.textContent = '.ytThumbnailHoverOverlayToggleActionsViewModelHost { top: 0; }';
    document.head.appendChild(style);
})();
