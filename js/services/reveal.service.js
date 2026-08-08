/**
 * RevealService — manages scroll-reveal animations.
 *
 * Behaviour is OPT-IN: nothing animates unless a component marks its own
 * elements with the `.reveal` class and calls `reveal.watch()`. The
 * service never scans or touches components' markup by itself — it only
 * toggles the `.visible` class on elements that opted in.
 */
export class RevealService {
  constructor() {
    this._observer = null;
  }

  mount() {
    if (!('IntersectionObserver' in window)) return;

    this._observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    this.watch();
  }

  /**
   * Start observing every element currently carrying `.reveal`.
   * Components call this after they have marked their own elements.
   */
  watch() {
    if (!this._observer) {
      // Fallback: no IntersectionObserver support — show everything.
      document
        .querySelectorAll('.reveal')
        .forEach((el) => el.classList.add('visible'));
      return;
    }
    document
      .querySelectorAll('.reveal:not(.visible)')
      .forEach((el) => this._observer.observe(el));
  }

  destroy() {
    this._observer?.disconnect();
  }
}
