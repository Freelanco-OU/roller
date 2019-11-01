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
  _isGlobalOverlayShowed: boolean

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
    this._isGlobalOverlayShowed = false
  }

  /**
   * Creates and configures common controller.
   */
  configure(options?: GuideControllerOptions = {}) {
    this._controller = new Controller({
      onSkip: (event) => {
        this.cancel()

        if (this._isGlobalOverlayShowed) {
          this._overlay.close()
          this._isGlobalOverlayShowed = false
        }

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

        if (this._currentStep === this._steps - 1 && this._onDone) {
          this._onDone()
          this._overlay.close()
          this._isGlobalOverlayShowed = false
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

      const group = this._groups[this._currentStep]
      if (!group.overlay && !this._isGlobalOverlayShowed) {
        // Show global overlay if there isn't local one.
        this._overlay.show()
        this._isGlobalOverlayShowed = true
      } else if (group.overlay && this._isGlobalOverlayShowed) {
        this._overlay.close()
        this._isGlobalOverlayShowed = false
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
    this.move(0)
  }

  /** Cancel guide. */
  cancel() {
    const group = this._groups[this._currentStep]
    this._roller.unHighlight(group)
  }
}

module.exports = Guide
