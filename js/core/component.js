/**
 * Component — base class for every self-contained section.
 *
 * Guarantees clear boundaries:
 *  - A component only queries/attaches listeners INSIDE its own root
 *    element (`this.root`). It can never reach into another section's DOM.
 *  - Cross-section communication happens exclusively via the event bus.
 *  - All listeners/subscriptions are tracked so `destroy()` can fully
 *    clean the component up (useful for testing or future hot-swapping).
 *
 * Lifecycle: `mount()` is called once by the bootstrapper; override it
 * in subclasses to wire behaviour.
 */
export class Component {
  /**
   * @param {HTMLElement} root      This section's own root element
   * @param {object} context        Shared, well-defined interfaces only:
   *   @param {EventBus} context.bus       event channel
   *   @param {object}   context.services  injected service interfaces
   */
  constructor(root, context) {
    if (!root) {
      throw new Error(`${this.constructor.name}: root element not found`);
    }
    this.root = root;
    this.bus = context.bus;
    this.services = context.services;
    /** @type {Function[]} teardown callbacks */
    this._cleanups = [];
  }

  /** Element query scoped strictly to this component's root. */
  query(selector) {
    return this.root.querySelector(selector);
  }

  /** @returns {HTMLElement[]} scoped query, always a real array */
  queryAll(selector) {
    return [...this.root.querySelectorAll(selector)];
  }

  /**
   * Attach a DOM listener and register it for automatic cleanup.
   * Use this instead of raw addEventListener inside components.
   */
  listen(element, type, handler, options) {
    element.addEventListener(type, handler, options);
    this._cleanups.push(() =>
      element.removeEventListener(type, handler, options)
    );
  }

  /**
   * Subscribe to an event-bus channel and register it for cleanup.
   * Use this instead of raw bus.on inside components.
   */
  subscribe(event, handler) {
    this.bus.on(event, handler);
    this._cleanups.push(() => this.bus.off(event, handler));
  }

  /** Emit an event for other parts of the app. */
  emit(event, payload) {
    this.bus.emit(event, payload);
  }

  /** Override in subclasses. Called once after the DOM is ready. */
  mount() {}

  /** Removes every listener and subscription this component created. */
  destroy() {
    this._cleanups.forEach((teardown) => teardown());
    this._cleanups = [];
  }
}
