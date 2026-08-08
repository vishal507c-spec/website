/**
 * ScrollSpyService — observes all top-level page sections and announces
 * which one is currently in view by emitting 'spy:section'.
 *
 * Any component (e.g. the navbar) can subscribe to highlight the
 * matching link — without the service knowing who listens.
 */
export const SpyEvents = {
  SECTION: 'spy:section', // payload: { id }
};

export class ScrollSpyService {
  /**
   * @param {EventBus} bus
   */
  constructor(bus) {
    this._bus = bus;
    this._observer = null;
  }

  mount() {
    const sections = document.querySelectorAll('section[id], header[id]');
    if (!('IntersectionObserver' in window) || sections.length === 0) return;

    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this._bus.emit(SpyEvents.SECTION, { id: entry.target.id });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((section) => this._observer.observe(section));
  }

  destroy() {
    this._observer?.disconnect();
  }
}
