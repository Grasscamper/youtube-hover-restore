// ==UserScript==
// @name         YouTube Hover Restore (Updated)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Restore hover "Watch Later" and general thumbnail clickability on YouTube
// @author       Grasscamper (Updated)
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Injecteert de CSS om pointer-event blokkades te omzeilen.
     * Dit is cruciaal om te zorgen dat de click-events door de overlay heen gaan.
     */
    function injectStyles() {
        const existingStyle = document.getElementById('youtube-hover-restore-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'youtube-hover-restore-style';
        style.textContent = `
            /* Globale fix: Zorgt ervoor dat de hele container klikbaar blijft */
            ytd-video-renderer, ytd-thumbnail-renderer {
                pointer-events: auto !important;
            }

            /* Richt zich op de overlay/acties (bijv. de '...' knop) */
            /* Zorgt ervoor dat de overlay zelf geen pointer blockeert */
            .yt-spec-button-shape-next, button, [aria-haspopup]:hover {
                pointer-events: auto !important;
            }
            
            /* Belangrijk: De elementen die de acties tonen, moeten clickbaar zijn */
            .yt-formatted-string {
                pointer-events: auto !important;
            }
            
            /* Zorg dat de thumbnail link zelf de ober-overlay kan activeren */
            .yt-thumb a, ytd-video-renderer a {
                pointer-events: auto !important;
                display: block !important; /* Zorgt voor een solide blok */
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Controleert en repareert alle clickbare thumbnails in de DOM.
     * Dit is de functionele fix.
     */
    function fixClickableThumbnails() {
        // Selecteer alle elementen die een video-renderer of thumbnail bevatten
        const potentialContainers = document.querySelectorAll('ytd-video-renderer, ytd-thumbnail-renderer');

        potentialContainers.forEach(container => {
            // Repareer de link (de <a> tag) in de container
            const link = container.querySelector('a[href^="/watch"]');
            if (link) {
                link.style.pointerEvents = 'auto';
                link.setAttribute('role', 'link'); // Optimalisatie voor toegankelijkheid
            }

            // Repareer individuele knoppen binnen de container (bijv. Watch Later/Like)
            const buttons = container.querySelectorAll('button, yt-spec-button-shape-next');
            buttons.forEach(button => {
                button.style.pointerEvents = 'auto';
            });
        });
    }

    // --- INITIALISATIE ---

    // 1. Voer de CSS-fix uit
    injectStyles();

    // 2. Voer de JS-fix uit voor de reeds geladen content
    fixClickableThumbnails();

    // 3. Voeg de MutationObserver toe om dynamisch geladen content (zoals bij scrollen) te repareren
    const observer = new MutationObserver(function(mutations) {
        // Wacht even, want YouTube injecteert content soms in batches
        setTimeout(() => {
            fixClickableThumbnails();
        }, 50); // Een kleine vertraging helpt bij race conditions
    });

    // Observeert het body element op veranderingen in de kinderlijst en de hele subboom
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
