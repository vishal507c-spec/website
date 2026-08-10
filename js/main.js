/**
 * Application bootstrapper.
 *
 * This is the ONLY file that knows about every part of the app.
 * It creates the event bus, mounts the shared services, then mounts
 * each component against its own root element. Components and services
 * only talk through the bus — the bootstrapper just wires them up.
 *
 * To add a new section:
 *   1. Add the markup with `data-component="my-section"` in index.html
 *   2. Write a Component subclass
 *   3. Register it in the COMPONENTS map below
 * Nothing existing needs to change.
 */
import { EventBus } from './core/event-bus.js';

import { ScrollService } from './services/scroll.service.js';
import { ScrollSpyService } from './services/scroll-spy.service.js';
import { RevealService } from './services/reveal.service.js';

import { NavbarComponent } from './components/navbar.component.js';
import { HeroComponent } from './components/hero.component.js';
import { SectionViewComponent } from './components/section-view.component.js';
import { ContactSectionComponent } from './components/contact-section.component.js';
import { FooterComponent } from './components/footer.component.js';

/* Which component class mounts on which data-component root. */
const COMPONENTS = {
  navbar: NavbarComponent,
  hero: HeroComponent,
  'about-section': SectionViewComponent,
  'skills-section': SectionViewComponent,
  'project-section': SectionViewComponent,
  'evidence-section': SectionViewComponent,
  'experience-section': SectionViewComponent,
  'approach-section': SectionViewComponent,
  'contact-section': ContactSectionComponent,
  footer: FooterComponent,
};

function bootstrap() {
  const bus = new EventBus();

  /* --- shared services (shared functionality via interfaces) --- */
  const services = {
    scroll: new ScrollService(bus),
    spy: new ScrollSpyService(bus),
    reveal: new RevealService(),
  };
  Object.values(services).forEach((service) => service.mount());

  /* --- mount each section component on its own root --- */
  const context = { bus, services };
  const mounted = [];

  document.querySelectorAll('[data-component]').forEach((root) => {
    const ComponentClass = COMPONENTS[root.dataset.component];
    if (!ComponentClass) {
      console.warn(`No component registered for "${root.dataset.component}"`);
      return;
    }
    const instance = new ComponentClass(root, context);
    instance.mount();
    mounted.push(instance);
  });

  // Exposed for debugging / future hot-swap support.
  window.__app = { bus, services, mounted };
}

document.addEventListener('DOMContentLoaded', bootstrap);
