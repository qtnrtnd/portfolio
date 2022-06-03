const DOM = {
    header: document.querySelector('header'),
    iStylized: document.querySelector('.i-stylized'),
    forcedSpeedElements: document.querySelectorAll('[data-forced-speed]'),
    actionSentences: document.querySelectorAll('.action-sentence'),
    explanationSentences: document.querySelectorAll('.explanation-sentence'),
    currentSectionChar: document.querySelector('.current-section-char'),
    nav: document.querySelector('nav'),
    textContentRows: document.querySelectorAll(".section-about-text-content-row"),
    highlightedWords: document.querySelectorAll('.section-about strong, .section-about em'),
    imgMyself: document.querySelector('.img-myself'),
    nameOverlays: document.querySelectorAll('.big-name.overlay')
}

export default DOM;