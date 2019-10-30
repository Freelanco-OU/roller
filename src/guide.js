// @flow

import type { HighlightGroup } from './roller.js'

const Controller = require('./controller.js')
// eslint-disable-next-line no-unused-vars
const Overlay = require('./group/overlay.js')
// eslint-disable-next-line no-unused-vars
const Focus = require('./group/focus.js')
// eslint-disable-next-line no-unused-vars
const Popover = require('./group/popover.js')
const Roller = require('./roller.js')
const Tip = require('./tip.js')

type GuideControllerOptions = {
  skipButtonText?: string,
  prevButtonText?: string,
  nextButtonText?: string,
  doneButtonText?: string,
  footerStyle?: { [string]: string | number },
  skipButtonStyle?: { [string]: string | number },
  prevButtonStyle?: { [string]: string | number },
  nextButtonStyle?: { [string]: string | number },
  doneButtonStyle?: { [string]: string | number }
}

type GuideOptions = {
  groups: HighlightGroup[],
  overlay?: Overlay,
  buildTip?: (start: () => void, close: () => void) => Tip,
  onDone?: () => void,
  onSkip?: () => void
}

/** Class that creates controls elements in popover, when guide is started. */
class Guide {
  _steps: number
  _currentStep: number
  _groups: HighlightGroup[]
  _overlay: Overlay
  _onDone: ?(() => void)
  _onSkip: ?(() => void)
  _controller: Controller
  _roller: Roller
  _tip: ?Tip

  /**
   * Defines `options` for *Guide* object.
   * `overlay` - Common overlay for guide object.
   * `onDone` - Executes when user has finished guide.
   * `onSkip` - Executes when user has finished guide.
   */
  constructor(options: GuideOptions) {
    this._steps = options.groups.length
    this._currentStep = 0
    this._groups = options.groups
    this._overlay = options.overlay || new Overlay()
    this._onDone = options.onDone
    this._onSkip = options.onSkip
    if (options.buildTip) {
      this._tip = options.buildTip(() => this.move(0), () => this.cancel())
    }
  }

  /**
   * Creates and configures common controller.
   */
  configure(options?: GuideControllerOptions = {}) {
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

        if (this._currentStep === this._groups.length - 1 && this._onDone) {
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
   * `step` - Number of step. Must be in range from 0 to length of `groups - 1`.
   */
  move(step: number) {
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
      if (group.popover) {
        group.popover._addController(this._controller)
      }

      this._roller.highlight(group)
    }
  }

  /** Starts guide. */
  start() {
    if (this._tip) {
      this._tip.show()
    } else {
      this.move(0)
    }
  }

  /** Cancel guide. */
  cancel() {
    const group = this._groups[this._currentStep]
    this._roller.unHighlight(group)
  }
}

module.exports = Guide
