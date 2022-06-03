const g = {
    MIN_HEIGHT: (function () {

        const innerHeight = Math.max(window.screen.availHeight - (window.outerHeight - window.innerHeight), window.innerHeight);
        document.documentElement.style.setProperty('--inner-height', `max(${innerHeight}px, 100vh)`);

        return innerHeight;
        
    })(),
    REM_SIZE: (function () {

        const fontSize = window.getComputedStyle(document.documentElement).fontSize.replace('px', '');

        return fontSize;
        
    })(),
    isAutoScrolling: false
};

export default g;