import gsap from "./library/gsap-latest-beta.min";
import ScrollTrigger from "./library/ScrollTrigger.min";
import ScrollSmoother from "./library/ScrollSmoother.min";

import g from "./modules/global";
import DOM from "./modules/dom_var";
import loadContent from "./modules/load_content";
import setLettersLag from "./modules/letters_lag_effect";
import nav from "./modules/nav";

export default async function start() {

  const images = await loadContent();

  setLettersLag();

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  const smoother = ScrollSmoother.create({
    smooth: 1.3,
    effects: true,
    smoothTouch: 0.1,
    onUpdate: self => {

      if (self.scrollTrigger) {

        DOM.forcedSpeedElements.forEach(elt => {

          if (ScrollTrigger.isInViewport(elt)) {

            if (!elt.style.willChange) elt.style.willChange = "transform";

            const speed = elt.dataset.forcedSpeed - 1;
            const maxTranslate = self.scrollTrigger.end * speed * -1;
  
            elt.style.transform = `translate(0, ${(self.scrollTop() / self.scrollTrigger.end) * maxTranslate}px)`;

          }
        })
      } 
    }
  });

  const setNameOverlayClipPath = function () {

    const imgRect = DOM.imgMyself.getBoundingClientRect();
    const left = imgRect.left;
    const right = document.body.offsetWidth - (left + imgRect.width);

    DOM.nameOverlays.forEach(overlay => {
      overlay.style.clipPath = `inset(0 ${right}px 0 ${left}px)`;
    })

  }
  setNameOverlayClipPath();

  window.addEventListener('resize', function () {
    setNameOverlayClipPath();
  })

  document.querySelectorAll("a[href*='#']").forEach(a => {
    a.addEventListener('click', function (e) {

      e.preventDefault();

      const id = this.getAttribute('href').replace('#', '');

      nav.update(id);
      nav.scrollToAnchor(id, smoother);
      
    });
  });

  document.addEventListener('wheel', () => { if(g.isAutoScrolling) g.isAutoScrolling = false });

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

  // "I" visible
  ScrollTrigger.create({
    trigger: ".section-about",
    start: "top 75%",
    onEnter: () => {
      DOM.iStylized.classList.add('visible');
    }
  });

  // "I" pinned + first paragraph appear
  ScrollTrigger.create({
    trigger: ".section-about",
    start: "top",
    end: "bottom",
    pin: ".i-stylized-container",
    onEnter: () => {
      DOM.explanationSentences[0].classList.add('visible');
    }
  });

  // second paragraph appear
  ScrollTrigger.create({
    trigger: ".section-about",
    start: "top 35%",
    onEnter: () => {
      DOM.actionSentences[0].classList.add('visible');
    }
  });

  const setTriggerState = (currentRow, enable) => {
    smoother.effects().forEach(effect => {
      if (effect.trigger.tagName.toLowerCase() === "i" && effect.trigger.closest(".section-about-text-content-row") === currentRow) {
        enable ? effect.enable() : effect.disable(true, true);
      }
    })
  }

  DOM.textContentRows.forEach(row => {

    const actionSentence = row.querySelector('.action-sentence');

    const pinnedPosition = () => `top ${Math.max(g.MIN_HEIGHT, window.innerHeight) / 2 - actionSentence.offsetHeight / 2}px`;

    // text fade from viewport bottom
    ScrollTrigger.create({
      //markers: true,
      trigger: row,
      start: "top 97%",
      end: "top 60%",
      scrub: true,
      ease: "none",
      animation: gsap.fromTo(row, {
        opacity: 0.1
      }, {
        opacity: 1
      })
    });

    // text fade to viewport top
    ScrollTrigger.create({
      //markers: true,
      trigger: row,
      start: "bottom 23%",
      end: "bottom",
      scrub: true,
      ease: "none",
      animation: gsap.fromTo(row, {
        opacity: 1
      }, {
        opacity: 0.1
      })
    });

    const id = row.getAttribute('id');

    // action sentence pin + temp letters lag diable
    ScrollTrigger.create({
      fastScrollEnd: true,
      id: id,
      trigger: row,
      start: pinnedPosition,
      end: () => `+=${row.offsetHeight - actionSentence.offsetHeight}px`,
      pin: actionSentence,
      onEnter: () => {
        if(!g.isAutoScrolling) nav.update(id);
        setTriggerState(row, false);
      },
      onEnterBack: () => {
        if(!g.isAutoScrolling) nav.update(id);
        setTriggerState(row, false);
      },
      onLeave: () => {
        setTriggerState(row, true);
      },
      onLeaveBack: () => {
        setTriggerState(row, true);
      }
    });
  });

  const getConicGradientMask = function (angle) {
    return `conic-gradient(transparent, transparent ${angle}deg, white ${angle ? Math.min(angle + 6, 360) : 0}deg, white)`
  }

  const circleDrawingEase = gsap.parseEase("power2.inOut");

  DOM.highlightedWords.forEach(word => {

    const params = {
      trigger: word,
      start: "top 55%"
    };

    const className = Array.from(word.classList).find(className => {
      return className.includes('circle');
    })

    if (className) {

      let rotate = 0,
        translateX = 0,
        translateY = 0,
        scaleY = 1;

      if (word.dataset.transform) {
        const arr = word.dataset.transform.split(' ');
        translateX = Math.round(arr[0] / g.REM_SIZE * 100) / 100;
        translateY = Math.round(arr[1] / g.REM_SIZE * 100) / 100;
        rotate = arr[2];
        scaleY = arr[3];
        word.removeAttribute('data-transform');
      }

      const textContent = word.innerHTML;
      word.innerHTML = '';

      const textStretchWrapper = document.createElement('span');
      textStretchWrapper.classList.add('text-stretch-wrapper');
      textStretchWrapper.innerHTML = textContent;

      const gradientMask = document.createElement('span');
      gradientMask.classList.add('gradient-mask');
      gradientMask.style.backgroundImage = getConicGradientMask(0);

      const relativeWrapper = document.createElement('span');
      relativeWrapper.classList.add('relative-wrapper');

      const imgStretchWrapper = document.createElement('span');
      imgStretchWrapper.classList.add('img-stretch-wrapper');

      const imgWrapper = document.createElement('span');
      imgWrapper.classList.add('img-wrapper');

      const img = images[className].cloneNode();

      imgStretchWrapper.append(img);
      imgWrapper.append(imgStretchWrapper);

      relativeWrapper.append(imgWrapper);
      relativeWrapper.append(gradientMask);

      const unstretchWrapper = document.createElement('span');
      unstretchWrapper.classList.add('unstretch-wrapper');

      relativeWrapper.append(textStretchWrapper);
      unstretchWrapper.append(relativeWrapper);
      word.append(unstretchWrapper);

      const textStretch = Math.round(textStretchWrapper.offsetWidth / textStretchWrapper.offsetHeight * 100) / 100;

      imgWrapper.style.height = Math.max(Math.min(((1 / Math.pow(textStretch * 2, 0.6)) * 500), 170), 150) + "%";
      //imgWrapper.style.height = `calc(100% + ${Math.min(((1 / Math.pow(textStretch * 2, 0.6)) * 1.9), 180)}em)`;
      imgWrapper.style.width = `calc(100% + ${Math.min((Math.pow(textStretch * 0.7, 1.5) * 0.25), 1.5)}em)`;

      imgStretchWrapper.style.transform = `scaleY(${textStretch})`;

      textStretchWrapper.style.transform = `scaleY(${textStretch * (1 / scaleY)})${translateX ? ` translateX(${translateX * -1}rem)` : ''}${translateY ? `translateY(${translateY * -1}rem)` : ''}${rotate ? ` rotate(${rotate * -1}deg)` : ''}`;
      
      const imgRect = imgStretchWrapper.getBoundingClientRect();
      
      gradientMask.style.width = Math.round((imgRect.width * 2) / g.REM_SIZE * 100) / 100 + "rem";
      gradientMask.style.height = Math.round((imgRect.height * 2) / g.REM_SIZE * 100) / 100 + "rem";
      
      unstretchWrapper.style.transform = `scaleY(${Math.round((1 / textStretch) * scaleY * 100) / 100})`;

      word.style.transform = `${translateX ? `translateX(${translateX}rem)` : ''}${translateY ? `translateY(${translateY}rem)` : ''}${rotate ? ` rotate(${rotate}deg)` : ''}`;

      params.animation = gsap.to({ p: 0 }, {
        p: 1,
        duration: 1,
        paused: true,
        onUpdate: function () {
          const angle = circleDrawingEase(this.progress()) * 360;
          gradientMask.style.backgroundImage = getConicGradientMask(angle);
        }
      });

    } else {

      params.onEnter = () => {
        word.classList.add('highlighted');
      }

    }

    ScrollTrigger.create(params);
  });

  ScrollTrigger.refresh();
  
}