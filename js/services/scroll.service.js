/**
 * ScrollService — the single owner of programmatic page scrolling.
 *
 * Components NEVER scroll the page themselves. They emit 'nav:request'
 * and this service performs the smooth scroll (with navbar offset).
 * This keeps scroll behaviour consistent everywhere it is triggered.
 */
export const ScrollEvents = {
  NAV_REQUEST: 'nav:request', // payload: { targetId: '#projects' }
};

const NAV_OFFSET = 72; // matches --nav-h in style.css

export class ScrollService {
  /**
   * @param {EventBus} bus
   */
  constructor(bus) {
    this._bus = bus;
  }

  mount() {
    this._handler = ({ targetId } = {}) => {
      if (!targetId) return;
      this.scrollTo(targetId);
    };
    this._bus.on(ScrollEvents.NAV_REQUEST, this._handler);
  }

  /** Smooth-scroll to a CSS selector, honouring the fixed navbar. */
  scrollTo(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    const top =
      selector === '#home'
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  destroy() {
    this._bus.off(ScrollEvents.NAV_REQUEST, this._handler);
  }
}
