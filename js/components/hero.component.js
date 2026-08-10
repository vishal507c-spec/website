import { Component } from '../core/component.js';
import { ScrollEvents } from '../services/scroll.service.js';

/**
 * HeroComponent — responsible ONLY for the hero block:
 *  - CTA buttons request navigation via the ScrollService
 *  - opts its own elements into the reveal animation
 *
 * The hero knows nothing about the navbar, the spy, or any other
 * section; it only publishes intent on the event bus.
 */

/** Hero elements that animate in on load, in order. */
const REVEAL_SEQUENCE = [
  '.hero-title',
  '.hero-role',
  '.hero-project',
  '.hero-desc',
  '.hero-btns',
];

export class HeroComponent extends Component {
  mount() {
    this._bindCtaButtons();
    this._optIntoReveal();
  }

  /* Internal anchor CTAs publish a navigation request. External
     links (resume.html, WhatsApp) keep their default behaviour. */
  _bindCtaButtons() {
    this.queryAll('a[href^="#"]').forEach((link) => {
      this.listen(link, 'click', (event) => {
        event.preventDefault();
        this.emit(ScrollEvents.NAV_REQUEST, {
          targetId: link.getAttribute('href'),
        });
      });
    });
  }

  /* Mark OUR OWN elements for entrance animation, then hand them
     to the RevealService. Only this component may add .reveal here. */
  _optIntoReveal() {
    REVEAL_SEQUENCE.forEach((selector, index) => {
      const el = this.query(selector);
      if (el && !el.classList.contains('reveal')) {
        el.classList.add('reveal');
        if (index > 0) el.classList.add(`delay-${index}`);
      }
    });

    this.services.reveal.watch();
  }
}
