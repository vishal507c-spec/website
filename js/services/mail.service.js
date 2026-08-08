/**
 * MailService — owns everything related to sending mail.
 *
 * The contact component only validates input and emits 'contact:submit';
 * this service decides HOW the message is delivered. On GitHub Pages
 * there is no backend, so delivery happens via a pre-filled mailto:.
 * Swap this one file for an API/FormSpree implementation later without
 * touching the contact component at all.
 */
export const MailEvents = {
  SUBMIT: 'contact:submit',       // payload: { name, email, subject, message }
  MAIL_OPENED: 'contact:mail-opened', // emitted after the mail client opens
};

const TO_EMAIL = 'rahulsharma.mech@gmail.com';

export class MailService {
  /**
   * @param {EventBus} bus
   */
  constructor(bus) {
    this._bus = bus;
  }

  mount() {
    this._handler = (payload) => {
      this.send(payload);
      this._bus.emit(MailEvents.MAIL_OPENED);
    };
    this._bus.on(MailEvents.SUBMIT, this._handler);
  }

  /** Open the visitor's mail client with a pre-filled message. */
  send({ name, email, subject, message }) {
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    const url = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;
    window.location.href = url;
  }

  destroy() {
    this._bus.off(MailEvents.SUBMIT, this._handler);
  }
}
