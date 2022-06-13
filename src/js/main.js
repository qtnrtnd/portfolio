import gsap from "./library/gsap.min.js";
import ScrollTrigger from "./library/ScrollTrigger.min";
import ScrollSmoother from "./library/ScrollSmoother.min";

import g from "./modules/global";
import DOM from "./modules/dom_var";
import loadContent from "./modules/load_content";
import nav from "./modules/nav";
import { getFullScreenCircleRadius, getOffset, innerHeight } from "./modules/utils.js";

export default async function start() {

  window.history.scrollRestoration = "manual";

  await loadContent();

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  const smoother = ScrollSmoother.create({
    smooth: 1.5,
    effects: true,
    smoothTouch: 0.1,
    onUpdate: self => {

      if (self.scrollTrigger) {

        const scrollVelocity = self.getVelocity();
        const scrollTop = self.scrollTop();

        DOM.rowIllustrations.forEach(elt => {
          if (ScrollTrigger.isInViewport(elt)) elt.style.transform = `scaleX(${1 - Math.abs(scrollVelocity / 20_000)}) skewX(${scrollVelocity / 325}deg)`;
        });

        DOM.actionSentences.forEach((elt, id)=> {

          if (ScrollTrigger.isInViewport(elt)) {

            elt.style.removeProperty('visibility');

            const trigger = g.actionSentenceTriggers[id];
            let displacementIntensity;
            const offset = 200;

            if (id === 0 && scrollTop < trigger.start || scrollTop >= trigger.start && scrollTop <= trigger.end) {

              displacementIntensity = 0;
              
            }else if (scrollTop < trigger.start) {

              displacementIntensity =  Math.min(1 - (scrollTop - (trigger.start - offset)) / offset, 1);

            } else {

              displacementIntensity = Math.min((scrollTop - trigger.end) / offset, 1);
            }
          
            DOM.displacementMaps[id].scale.baseVal = Math.round((scrollVelocity / 25) * displacementIntensity * 10) / 10;

          } else {
            elt.style.visibility = "hidden";
          }        
        });
      }
    }
  });

  document.querySelectorAll("a[href*='#']").forEach(a => {
    a.addEventListener('click', function (e) {

      e.preventDefault();

      const id = this.getAttribute('href').replace('#', '');

      nav.update(id);
      nav.scrollToAnchor(id, smoother);
      
    });
  });

  document.addEventListener('wheel', () => { if (g.isAutoScrolling) g.isAutoScrolling = false });
  
  // nav "home" update
  ScrollTrigger.create({
    trigger: ".section-about",
    start: "top 60%",
    end: "+=0",
    onEnter: () => {
        if(!g.isAutoScrolling) nav.update("home")
    },
    onEnterBack: () => {
        if(!g.isAutoScrolling) nav.update("home")
    }
  });

  // ".section-about" pinned
  const sectionAboutPinTrigger = ScrollTrigger.create({
    trigger: ".section-about",
    start: "top",
    end: `+=${g.SECTION_ABOUT_PIN_HEIGHT}px`,
    pin: ".section-about"
  });

  const TEXT_STRIP_END_TRESHOLD = 1.2;
  const CLIP_PATH_REVEAL_OVERLAP_TRESHOLD = 0.75;
  const textStripsTimeline = gsap.timeline({paused: true});

  DOM.textStrips.forEach(textStrip => {

    const delay = textStrip.dataset.delay ? textStrip.dataset.delay : 0;

    textStripsTimeline.to(textStrip, {
      x: (Array.from(textStrip.parentElement.classList).some(v => ["right", "bottom"].includes(v)) ? -1 : 1) * (textStrip.offsetWidth + Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(innerHeight(), 2))),
      duration: 100
    }, delay);

  })

  // ".text-strips" animation
  const textStripsAnimationTrigger = ScrollTrigger.create({
    trigger: ".section-about",
    start: "top top+=75%",
    end: () => sectionAboutPinTrigger.start + g.SECTION_ABOUT_PIN_HEIGHT * TEXT_STRIP_END_TRESHOLD,
    scrub: true,
    animation: textStripsTimeline,
    toggleClass: { targets: DOM.textStripsWrapper, className: 'visible' }
  })

  // ".section-about-clip-path" reveal
  const clipPathRevealTrigger = ScrollTrigger.create({
    trigger: ".section-about",
    start: () => sectionAboutPinTrigger.start + g.SECTION_ABOUT_PIN_HEIGHT * (TEXT_STRIP_END_TRESHOLD - CLIP_PATH_REVEAL_OVERLAP_TRESHOLD),
    end: () => sectionAboutPinTrigger.end,
    onUpdate: self => {
      const r = getFullScreenCircleRadius() * self.progress;
      DOM.sectionAboutClip.style.clipPath = `circle(${r}px at 50% calc(var(--inner-height) / 2))`;
      DOM.sectionAboutContent.style.transform = `scale(${0.8 + self.progress * 0.2})`;
    },
    onEnter: function () {
      DOM.sectionAboutClip.style.removeProperty('visibility');
    },
    onLeave: function () {
      DOM.sectionAboutClip.style.removeProperty('clip-path');
      smoother.content().style.removeProperty('background-color');
    }
  });

  // background color transition
  ScrollTrigger.create({
    trigger: ".section-about",
    start: () => textStripsAnimationTrigger.start,
    end: () => clipPathRevealTrigger.start,
    onUpdate: self => {
      const r = getFullScreenCircleRadius() * self.progress;
      DOM.backgroundCircle.style.backgroundImage = `radial-gradient(circle at center, ${g.COLOR_SWITCH_LANDING} ${self.progress * 100 - 0.1}%, transparent ${self.progress * 100}%)`;
    }
  })

  // "I" pinned + first paragraph appear
  ScrollTrigger.create({
    trigger: ".section-about",
    start: () => sectionAboutPinTrigger.end,
    end: () => getOffset(DOM.explanationSentences.at(-1)).top + DOM.explanationSentences.at(-1).offsetHeight - innerHeight() / 2 - DOM.actionSentences.at(-1).offsetHeight / 2 + g.SECTION_ABOUT_PIN_HEIGHT,
    pin: ".i-stylized-wrapper",
    pinnedContainer: ".section-about"
  });

  DOM.textContentRows.forEach((row, i) => {

    const actionSentence = DOM.actionSentences[i];

    // text fade from viewport bottom
    ScrollTrigger.create({
      trigger: row,
      start: "top 97%",
      end: "top 60%",
      scrub: true,
      ease: "none",
      pinnedContainer: ".section-about",
      animation: gsap.fromTo(row, {
        opacity: 0.1
      }, {
        opacity: 1
      })
    });

    // text fade to viewport top
    ScrollTrigger.create({
      trigger: row,
      start: "bottom 23%",
      end: "bottom",
      scrub: true,
      ease: "none",
      pinnedContainer: ".section-about",
      animation: gsap.fromTo(row, {
        opacity: 1
      }, {
        opacity: 0.1
      })
    });

    ScrollTrigger.create({
      trigger: row,
      start: "top bottom",
      pinnedContainer: ".section-about",
      onLeaveBack: () => {
        row.querySelectorAll('.highlighted').forEach(word => {
          word.style.transition = "none";
          word.classList.remove('highlighted');
          word.offsetHeight;
          word.style.removeProperty('transition');
        })
      }
    });


    const rowId = row.getAttribute('id');

    // action sentence pin + temp letters lag diable
    const trigger = ScrollTrigger.create({
      id: rowId,
      trigger: row,
      start: () => i === 0 ? sectionAboutPinTrigger.end : `top ${ innerHeight() / 2 - actionSentence.offsetHeight / 2 }px`,
      end: () => `+=${ row.offsetHeight - actionSentence.offsetHeight }px`,
      pin: actionSentence,
      pinnedContainer: ".section-about",
      onEnter: () => {
        if (!g.isAutoScrolling) nav.update(rowId);
      },
      onEnterBack: () => {
        if (!g.isAutoScrolling) nav.update(rowId);
      }
    });
    g.actionSentenceTriggers.push(trigger);
  });

  DOM.highlightedWords.forEach(word => {
    ScrollTrigger.create({
      trigger: word,
      start: "top 55%",
      pinnedContainer: ".section-about",
      onEnter: () => {
        word.classList.add('highlighted');
      }
    });
  });

  ScrollTrigger.addEventListener("refresh", () => {

    const imgRect = DOM.imgMyself.getBoundingClientRect();
    const left = imgRect.left;
    const right = document.body.offsetWidth - (left + imgRect.width);

    DOM.nameOverlays.forEach(overlay => {
      overlay.style.clipPath = `inset(0 ${right}px 0 ${left}px)`;
    })

    DOM.textContentRows[0].style.marginTop = "-" + DOM.actionSentences[0].offsetHeight / 2 + "px";

    DOM.backgroundCircle.style.width = DOM.backgroundCircle.style.height = getFullScreenCircleRadius() * 2 + "px";

    smoother.effects().forEach(effect => {

      if (effect.trigger.classList.contains('permanent-effect')) {
        effect.setPositions(0, ScrollTrigger.maxScroll(window));
      } else if (effect.trigger.classList.contains('row-illustration')) {
        effect.setPositions(effect.start + g.SECTION_ABOUT_PIN_HEIGHT, effect.end + g.SECTION_ABOUT_PIN_HEIGHT);
      }

    })
  });
  
}