const DOM = {
    header: document.querySelector('header'),
    iStylized: document.querySelector('.i-stylized'),
    actionSentences: Array.from(document.querySelectorAll('.action-sentence')),
    explanationSentences: Array.from(document.querySelectorAll('.explanation-sentence')),
    currentSectionChar: document.querySelector('.current-section-char'),
    nav: document.querySelector('nav'),
    textContent: document.querySelector('.section-about-text-content'),
    textContentRows: Array.from(document.querySelectorAll(".section-about-text-content-row")),
    highlightedWords: Array.from(document.querySelectorAll('.section-about strong, .section-about em')),
    imgMyself: document.querySelector('.img-myself'),
    nameOverlays: Array.from(document.querySelectorAll('.big-name.overlay')),
    displacementMaps: Array.from(document.querySelectorAll('.displacement-map')),
    rowIllustrations: Array.from(document.querySelectorAll('.row-illustration img')),
    sectionAbout: document.querySelector('.section-about'),
    sectionAboutContent: document.querySelector('.section-about-content'),
    sectionAboutClip: document.querySelector('.section-about-clip'),
    textStrips: Array.from(document.querySelectorAll('.text-strip')),
    textStripsWrapper: document.querySelector('.section-about-text-strips'),
    backgroundCircle: document.querySelector('.section-about-background-circle')
 }

export default DOM;