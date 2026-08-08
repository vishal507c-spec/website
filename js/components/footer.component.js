import { Component } from '../core/component.js';
import { ScrollEvents } from '../services/scroll.service.js';

/**
 * FooterComponent — responsible ONLY for the footer:
 *  - anchor links request navigation via the ScrollService
 *  - keeps its own copyright year current
 */
export class FooterComponent extends Component {
  mount() {
    this.queryAll('a[href^="#"]').forEach((link) => {
      this.listen(link, 'click', (event) => {
        event.preventDefault();
        this.emit(ScrollEvents.NAV_REQUEST, {
          targetId: link.getAttribute('href'),
        });
      });
    });

    const yearEl = this.query('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }
}
