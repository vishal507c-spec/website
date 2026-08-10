import { Component } from '../core/component.js';

/**
 * ContactSectionComponent — owns the contact section.
 *
 * The contact section is fully static: email, phone, WhatsApp and
 * resume links live in the markup. This component only opts its own
 * elements into the reveal animation.
 */
export class ContactSectionComponent extends Component {
  mount() {
    this._reveal(this.query('.section-head'));
    this._reveal(this.query('.contact-list'), 'delay-1');
    this._reveal(this.query('.contact-actions'), 'delay-2');
    this.services.reveal.watch();
  }

  /** Mark this section's own elements for the RevealService. */
  _reveal(el, delay) {
    if (!el || el.classList.contains('reveal')) return;
    el.classList.add('reveal');
    if (delay) el.classList.add(delay);
  }
}
