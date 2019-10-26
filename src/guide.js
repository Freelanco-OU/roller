const Controller = require('./controller.js')
// eslint-disable-next-line no-unused-vars
const Overlay = require('./group/overlay.js')
// eslint-disable-next-line no-unused-vars
const Focus = require('./group/focus.js')
// eslint-disable-next-line no-unused-vars
const Popover = require('./group/popover.js')
const Roller = require('./roller.js')

/** Class that creates controls elements in popover, when guide is started. */
class Guide {
  /**
   * Defines `options` for *Guide* object.
   * @param {Object} options
   * @param {{
   *  beforeInsert?: (wait: (seconds: Number | String) => Promise<void>) => Promise<void>,
   *  overlay?: Overlay,
   *  element: Focus,
   *  popover: Popover,
   *  afterRemove?: (wait: (seconds: Number | String) => Promise<void>) => Promise<void>
   * }[]} options.groups Steps of guide.
   * @param {Overlay} [options.overlay] Common overlay for guide object.
   * @param {() => void} [options.onDone] Executes when user has finished guide.
   * @param {() => void} [options.onSkip] Executes when user has finished guide.
   */
  constructor(options) {
    this._steps = options.groups.length
    this._currentStep = 0
    this._groups = options.groups
    this._overlay = options.overlay || new Overlay()
    this._onDone = options.onDone
    this._onSkip = options.onSkip
  }

  /**
   * Creates and configures common controller.
   * @param {Object} [options]
   * @param {String} [options.skipButtonText]
   * @param {String} [options.prevButtonText]
   * @param {String} [options.nextButtonText]
   * @param {String} [options.doneButtonText]
   * @param {{ [key: String]: String | Number | Boolean }} [options.footerStyle]
   * @param {{ [key: String]: String | Number | Boolean }} [options.skipButtonStyle]
   * @param {{ [key: String]: String | Number | Boolean }} [options.prevButtonStyle]
   * @param {{ [key: String]: String | Number | Boolean }} [options.nextButtonStyle]
   * @param {{ [key: String]: String | Number | Boolean }} [options.doneButtonStyle]
   */
  configure(options = {}) {
    this._controller = new Controller({
      onSkip: (event) => {
        this.cancel()

        if (this._onSkip) {
          this._onSkip()
        }
      },
      onPrev: (event) => {
        this.cancel()

        if (this._currentStep > 0) {
          this.move(--this._currentStep)
        }
      },
      onNext: (event) => {
        this.cancel()

        if (this._currentStep === this._groups.length - 1) {
          this._onDone()
        } else {
          this.move(++this._currentStep)
        }
      },
      skipButtonText: options.skipButtonText || 'Skip',
      prevButtonText: options.prevButtonText || 'Previous',
      nextButtonText: options.nextButtonText || 'Next',
      doneButtonText: options.doneButtonText || 'Done',
      footerStyle: options.footerStyle,
      skipButtonStyle: options.skipButtonStyle,
      prevButtonStyle: options.prevButtonStyle,
      nextButtonStyle: options.nextButtonStyle,
      doneButtonStyle: options.doneButtonStyle,
      steps: this._steps,
      currentStep: this._currentStep
    })

    this._roller = new Roller({
      onOverlayClick: () => {}
    })

    return this
  }

  /**
   * Move to next group.
   * @param {Number} step Number of step. Must be in range from 0 to length of `groups - 1`.
   */
  move(step) {
    if (step >= 0 && this._steps > step) {
      this._currentStep = step

      const group = this._groups[step]
      if (!group.overlay) {
        // Set global overlay on start. It is used for making hight contrast with highlighted element.
        if (this._currentStep === 0) {
          group.overlay = this._overlay
        }
        group.overlay = this._overlay
      }

      this._controller.updatePosition(step)
      group.popover._addController(this._controller)

      this._roller.highlight(group)
    }
  }

  /** Starts guide. */
  start() {
    this.move(0)
  }

  /** Cancel guide. */
  cancel() {
    const group = this._groups[this._currentStep]
    this._roller.unHighlight(group)
  }
}

module.exports = Guide
