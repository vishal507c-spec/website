import { Component } from '../core/component.js';

/**
 * SectionViewComponent — generic controller for pure-content sections
 * (About, Skills, Featured Project, Project Evidence, Experience,
 * How I Approach Site Work).
 *
 * These sections have no interactive state of their own. The component
 * exists to give each section an explicit boundary and a single
 * responsibility: opting its own elements into reveal animations.
 *
 * One instance is mounted per section root.
 */

/**
 * Which of THIS section's elements animate, and which get the grid
 * stagger. Keys map to the data-component names used in index.html.
 */
const REVEAL_MAP = {
  'about-section': {
    targets: ['.section-head', '.about-intro', '.about-facts'],
    stagger: [],
  },
  'skills-section': {
    targets: ['.section-head', '.digital-tools'],
    stagger: ['.capability-group'],
  },
  'project-section': {
    targets: ['.section-head', '.project-intro', '.created-row'],
    stagger: ['.scope-list', '.workflow-step'],
  },
  'evidence-section': {
    targets: ['.section-head'],
    stagger: ['.doc-card'],
  },
  'experience-section': {
    targets: ['.section-head'],
    stagger: ['.exp-block', '.edu-block'],
  },
  'approach-section': {
    targets: ['.section-head'],
    stagger: ['.approach-point'],
  },
};

export class SectionViewComponent extends Component {
  mount() {
    const config = REVEAL_MAP[this.root.dataset.component];
    if (!config) return;

    config.targets.forEach((selector) => {
      this.queryAll(selector).forEach((el) => this._reveal(el));
    });

    // Cards/columns in a grid reveal one-by-one with a soft stagger.
    config.stagger.forEach((selector) => {
      this.queryAll(selector).forEach((el, index) => {
        this._reveal(el);
        const order = index % 3; // max 3 columns in the layout
        if (order > 0) el.classList.add(`delay-${order}`);
      });
    });

    this.services.reveal.watch();
  }

  _reveal(el) {
    if (el && !el.classList.contains('reveal')) el.classList.add('reveal');
  }
}
