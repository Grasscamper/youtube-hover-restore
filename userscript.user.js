// ==UserScript==
// @name         YouTube Hover Restore
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Restore hover "Watch Later" functionality on YouTube
// @author       Grasscamper
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Verwijder de oude stijl als die al bestaat
    const existingStyle = document.getElementById('youtube-hover-restore-style');
    if (existingStyle) {
        existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'youtube-hover-restore-style';
    style.textContent = `
        /* Maak de overlay zichtbaar maar niet klikbaar */
        .ytThumbnailHoverOverlayToggleActionsViewModelHost {
            top: 0 !important;
            pointer-events: none !important;
        }
        
        /* Zorg dat de thumbnail zelf klikbaar blijft */
        .yt-thumb {
            pointer-events: auto !important;
        }
        
        /* Zorg dat de knoppen binnen de overlay wel klikbaar zijn */
        .ytThumbnailHoverOverlayToggleActionsViewModelHost .yt-spec-button-shape-next {
            pointer-events: auto !important;
        }
        
        /* Zorg dat de link van de thumbnail werkt */
        .yt-thumb a {
            pointer-events: auto !important;
        }
        
        /* Zorg dat de thumbnail container klikbaar is */
        .ytd-thumbnail-renderer {
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);

    // Voeg extra controle toe
    function fixClickableThumbnails() {
        // Zorg dat de thumbnail link niet wordt geblokkeerd
        const thumbnails = document.querySelectorAll('a[href^="/watch"]');
        thumbnails.forEach(thumb => {
            // Verwijder eventuele pointer-events die de klik blokkeren
            thumb.style.pointerEvents = 'auto';
        });
    }

    // Voer uit wanneer de pagina klaar is
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixClickableThumbnails);
    } else {
        fixClickableThumbnails();
    }

    // Voer ook uit op DOM veranderingen (voor dynamische content)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                fixClickableThumbnails();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
