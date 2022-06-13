import g from "./global";

const getOffset = function (el) {
    let _x = 0;
    let _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

const innerHeight = function(){
    return Math.max(g.MIN_HEIGHT, window.innerHeight)
}

const getFullScreenCircleRadius = function () {
    return Math.sqrt(Math.pow(window.innerWidth / 2, 2) + Math.pow(innerHeight() / 2, 2))
}

export { getOffset, innerHeight, getFullScreenCircleRadius };