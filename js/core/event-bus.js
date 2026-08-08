/**
 * EventBus — the ONLY communication channel between components.
 *
 * Components never call each other directly. They emit events and
 * subscribe to events through this bus. This keeps every section
 * decoupled: add, remove or replace a component without touching others.
 *
 * Handler errors are isolated: a failing component can never break
 * the rest of the application.
 */
export class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this._handlers = new Map();
  }

  /**
   * Subscribe to an event.
   * @param {string} event   Event name, e.g. 'nav:request'
   * @param {Function} handler  Callback receiving the payload
   */
  on(event, handler) {
    if (!this._handlers.has(event)) this._handlers.set(event, new Set());
    this._handlers.get(event).add(handler);
  }

  /**
   * Unsubscribe from an event.
   * @param {string} event
   * @param {Function} handler
   */
  off(event, handler) {
    this._handlers.get(event)?.delete(handler);
  }

  /**
   * Publish an event to all subscribers.
   * @param {string} event
   * @param {object} [payload]
   */
  emit(event, payload) {
    const handlers = this._handlers.get(event);
    if (!handlers) return;
    handlers.forEach((handler) => {
      try {
        handler(payload);
      } catch (err) {
        // One broken subscriber must never take others down.
        console.error(`[EventBus] handler for "${event}" failed:`, err);
      }
    });
  }
}
