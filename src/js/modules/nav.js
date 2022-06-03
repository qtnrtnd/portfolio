import ScrollTrigger from "../library/ScrollTrigger.min";

import DOM from "./dom_var";
import g from "./global";

const nav = {

    scrollToAnchor : function (id, smoother) {

        const trigger = ScrollTrigger.getById(id);
        const section = document.getElementById(id);

        if (section || trigger) {

            g.isAutoScrolling = true;
            smoother.scrollTo(trigger ? trigger.start : section, true);

        }

    },

    update : function (id) {

        const anchor = DOM.nav.querySelector("a[href='#" + id + "']");

        if (anchor) {

            const currentSelected = document.querySelector('a.selected');

            if (currentSelected !== anchor) {

            currentSelected.classList.remove('selected');
            anchor.classList.add('selected');

            const aIndex = anchor.dataset.index;
            DOM.currentSectionChar.querySelector('p').innerHTML = anchor.querySelector('.preview-section-char p').innerHTML;

            DOM.currentSectionChar.style.transform = `translate3d(0, ${aIndex * DOM.currentSectionChar.offsetHeight}px, 0)`;
            }
            
        }
    }
}

export default nav;