import { Component } from '../core/component.js';
import { ScrollEvents } from '../services/scroll.service.js';
import { SpyEvents } from '../services/scroll-spy.service.js';

/**
 * NavbarComponent — responsible ONLY for the top navigation bar:
 *  - hamburger toggle and closing the mobile menu
 *  - "scrolled" shadow state on its own root
 *  - highlighting the active link (reacting to 'spy:section')
 *
 * It NEVER scrolls the page itself — it emits 'nav:request' and lets
 * the ScrollService handle scrolling. It never touches other sections.
 */
export const NavbarEvents = {
  MENU_OPENED: 'menu:opened',
  MENU_CLOSED: 'menu:closed',
};

export class NavbarComponent extends Component {
  mount() {
    this._menu = this.query('#navMenu');
    this._hamburger = this.query('#hamburger');
    this._links = this.queryAll('.nav-link');

    this._bindLinkClicks();
    this._bindToggle();
    this._bindOutsideClose();
    this._bindEscapeClose();
    this._syncShadowOnScroll();
    this._followScrollSpy();
  }

  /* --- link clicks → request a scroll, then close the menu --- */
  _bindLinkClicks() {
    this._links.forEach((link) => {
      this.listen(link, 'click', (event) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        event.preventDefault();
        this._setMenu(false);
        this.emit(ScrollEvents.NAV_REQUEST, { targetId: href });
      });
    });
  }

  /* --- hamburger --- */
  _bindToggle() {
    this.listen(this._hamburger, 'click', () => {
      this._setMenu(!this._menu.classList.contains('open'));
    });
  }

  /* --- close when clicking anywhere outside this navbar --- */
  _bindOutsideClose() {
    this.listen(document, 'click', (event) => {
      if (!this.root.contains(event.target)) this._setMenu(false);
    });
  }

  /* --- close on Escape --- */
  _bindEscapeClose() {
    this.listen(document, 'keydown', (event) => {
      if (event.key === 'Escape') this._setMenu(false);
    });
  }

  /**
   * Single method that owns ALL menu state changes: classes, aria,
   * and announcing the state on the bus so others can react freely.
   */
  _setMenu(open) {
    const wasOpen = this._menu.classList.contains('open');
    if (open === wasOpen) return;

    this._menu.classList.toggle('open', open);
    this._hamburger.classList.toggle('active', open);
    this._hamburger.setAttribute('aria-expanded', String(open));

    this.emit(
      open ? NavbarEvents.MENU_OPENED : NavbarEvents.MENU_CLOSED
    );
  }

  /* --- react to page scroll without knowing about other sections --- */
  _syncShadowOnScroll() {
    const sync = () => {
      this.root.classList.toggle('scrolled', window.scrollY > 10);
    };
    this.listen(window, 'scroll', sync, { passive: true });
    sync();
  }

  /* --- active link follows the scroll-spy events --- */
  _followScrollSpy() {
    this.subscribe(SpyEvents.SECTION, ({ id }) => {
      this._links.forEach((link) => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${id}`
        );
      });
    });
  }
}
