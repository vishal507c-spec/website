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
  '.hero-eyebrow',
  '.hero-title',
  '.hero-role',
  '.hero-role-sub',
  '.hero-subtitle',
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

    const quiet = this.query('.hero-quiet-link');
    if (quiet && !quiet.classList.contains('reveal')) {
      quiet.classList.add('reveal', 'delay-5');
    }
    const visual = this.query('.hero-visual');
    if (visual && !visual.classList.contains('reveal')) {
      visual.classList.add('reveal', 'delay-4');
    }
    const proof = this.query('.hero-proof');
    if (proof && !proof.classList.contains('reveal')) {
      proof.classList.add('reveal', 'delay-5');
    }

    this.services.reveal.watch();
  }
}
