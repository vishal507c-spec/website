import { Component } from '../core/component.js';
import { MailEvents } from '../services/mail.service.js';

/**
 * ContactSectionComponent — responsible ONLY for the contact section:
 *  - validating its own form fields
 *  - showing success / error feedback inside its own form
 *  - emitting 'contact:submit' with the collected data
 *
 * It does NOT open the mail client — the MailService owns delivery.
 * Feedback for a successfully opened mail client arrives back through
 * the 'contact:mail-opened' event, keeping the flow fully decoupled.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ContactSectionComponent extends Component {
  mount() {
    this._form = this.query('#contactForm');
    this._note = this.query('#formNote');

    // Opt our own elements into the entrance animation first.
    this._reveal(this.query('.section-head'));
    this._reveal(this.query('.contact-info'));
    this._reveal(this._form, 'delay-1');
    this.services.reveal.watch();

    this.listen(this._form, 'submit', (event) => this._onSubmit(event));

    // MailService tells us the mail client was opened.
    this.subscribe(MailEvents.MAIL_OPENED, () => {
      this._showNote(
        'Opening your email client… Thank you for reaching out!',
        false
      );
      this._form.reset();
    });
  }

  _onSubmit(event) {
    event.preventDefault();

    const data = {
      name: this._form.name.value.trim(),
      email: this._form.email.value.trim(),
      subject: this._form.subject.value.trim(),
      message: this._form.message.value.trim(),
    };

    const error = this._validate(data);
    if (error) {
      this._showNote(error, true);
      return;
    }

    this._showNote('', false);
    this.emit(MailEvents.SUBMIT, data); // delivery is the service's job
  }

  _validate({ name, email, subject, message }) {
    if (!name || !email || !subject || !message) {
      return 'Please fill in all fields.';
    }
    if (!EMAIL_PATTERN.test(email)) {
      return 'Please enter a valid email address.';
    }
    return null;
  }

  /** Mark this section's own elements for the RevealService. */
  _reveal(el, delay) {
    if (!el || el.classList.contains('reveal')) return;
    el.classList.add('reveal');
    if (delay) el.classList.add(delay);
  }

  /** Feedback strictly inside this component's own form note. */
  _showNote(text, isError) {
    this._note.textContent = text;
    this._note.classList.toggle('error', Boolean(isError));
  }
}
