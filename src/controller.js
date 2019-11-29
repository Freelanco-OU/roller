// @flow

const {
  CONTROLLER_BORDER_TOP,
  CONTROLLER_PADDING_TOP,
  CONTROLLER_DISPLAY,
  CONTROLLER_JUSTIFY_CONTENT,
  CONTROLLER_BUTTON_BACKGROUND_COLOR,
  CONTROLLER_BUTTON_BORDER,
  CONTROLLER_BUTTON_BORDER_RADIUS,
  CONTROLLER_BUTTON_FONT_SIZE,
  CONTROLLER_BUTTON_MARGIN,
  CONTROLLER_BUTTON_OUTLINE,
  CONTROLLER_BUTTON_PADDING,
  CONTROLLER_BUTTON_PREV_MARGIN_RIGHT,
  CONTROLLER_BUTTON_SKIP_MARGIN_RIGHT
} = require('./constants.js')
const { inlineCssFrom, toCamelCase } = require('./utils/helpers.js')

type ControllerOptions = {
  onSkip(event: Event): void,
  onPrev(event: Event): void,
  onNext(event: Event): void,
  footerStyle?: { [key: string]: string | number },
  skipButtonStyle?: { [key: string]: string | number },
  prevButtonStyle?: { [key: string]: string | number },
  nextButtonStyle?: { [key: string]: string | number },
  doneButtonStyle?: { [key: string]: string | number },
  skipButtonText: string,
  prevButtonText: string,
  nextButtonText: string,
  doneButtonText: string,
  steps: number,
  currentStep: number
}

/** Class that add controls button to popover. Used in guides. */
class Controller {
  node: HTMLElement
  _buttonStyle: { [string]: string | number }
  _skipButton: HTMLButtonElement
  _prevButton: HTMLButtonElement
  _nextButton: HTMLButtonElement
  _currentStep: number
  _options: ControllerOptions

  /**
   * Creates instance of `Controller`. Parameter `options` defines listeners to all controls, styles to its controls and text for them.
   * Styles must be type of Strings and have valid CSS values.
   */
  constructor(options: ControllerOptions = {}) {
    const footer = document.createElement('footer')
    const skipButton = document.createElement('button')
    const controlsDiv = document.createElement('div')
    const prevButton = document.createElement('button')
    const nextButton = document.createElement('button')

    footer.setAttribute(
      'style',
      inlineCssFrom({
        display: CONTROLLER_DISPLAY,
        'justify-content': CONTROLLER_JUSTIFY_CONTENT,
        'padding-top': CONTROLLER_PADDING_TOP,
        'border-top': CONTROLLER_BORDER_TOP,
        // $FlowFixMe
        ...options.footerStyle
      })
    )

    controlsDiv.setAttribute('style', 'display: flex')

    this._buttonStyle = {
      margin: CONTROLLER_BUTTON_MARGIN,
      padding: CONTROLLER_BUTTON_PADDING,
      outline: CONTROLLER_BUTTON_OUTLINE,
      'background-color': CONTROLLER_BUTTON_BACKGROUND_COLOR,
      border: CONTROLLER_BUTTON_BORDER,
      'border-radius': CONTROLLER_BUTTON_BORDER_RADIUS,
      'font-size': CONTROLLER_BUTTON_FONT_SIZE
    }

    skipButton.setAttribute(
      'style',
      inlineCssFrom({
        ...this._buttonStyle,
        'margin-right': CONTROLLER_BUTTON_SKIP_MARGIN_RIGHT,
        // $FlowFixMe
        ...options.skipButtonStyle
      })
    )

    prevButton.setAttribute(
      'style',
      inlineCssFrom({
        ...this._buttonStyle,
        'margin-right': CONTROLLER_BUTTON_PREV_MARGIN_RIGHT,
        // $FlowFixMe
        ...options.prevButtonStyle
      })
    )
    disableButton(prevButton)

    nextButton.setAttribute(
      'style',
      inlineCssFrom({
        ...this._buttonStyle,
        // $FlowFixMe
        ...options.nextButtonStyle
      })
    )

    skipButton.addEventListener('click', options.onSkip)
    skipButton.append(options.skipButtonText)

    prevButton.addEventListener('click', options.onPrev)
    prevButton.append(options.prevButtonText)

    nextButton.addEventListener('click', options.onNext)
    nextButton.append(options.nextButtonText)

    controlsDiv.append(prevButton, nextButton)
    footer.append(skipButton, controlsDiv)

    this.node = footer
    this._skipButton = skipButton
    this._prevButton = prevButton
    this._nextButton = nextButton

    this._options = options
    this._currentStep = options.currentStep
  }

  /**
   * Update current step and repaint buttons.
   */
  updatePosition(step: number): void {
    this._currentStep = step

    step === 0
      ? disableButton(this._prevButton)
      : enableButton(this._prevButton)

    if (this._currentStep === this._options.steps - 1) {
      this._nextButton.innerText = this._options.doneButtonText
      if (this._options.doneButtonStyle) {
        changeStylesOf(this._nextButton, this._options.doneButtonStyle)
      }
    } else {
      this._nextButton.innerText = this._options.nextButtonText
      const commonButtonStyles = this._buttonStyle
      const nextButtonStyles = this._options.nextButtonStyle
      changeStylesOf(this._nextButton, {
        ...commonButtonStyles,
        // $FlowFixMe
        ...nextButtonStyles
      })
    }
  }
}

/**
 * Disable button by CSS.
 */
function disableButton(element: HTMLButtonElement) {
  element.setAttribute('disabled', 'true')
  element.style.cursor = 'not-allowed'
}

/**
 * Disable button by CSS.
 */
function enableButton(element: HTMLButtonElement) {
  if (element.hasAttribute('disabled')) {
    element.removeAttribute('disabled')
    element.style.cursor = 'pointer'
  }
}

/**
 * Change style of element.
 */
function changeStylesOf(
  element: HTMLButtonElement,
  styles: { [string]: string | number }
) {
  const entry = Object.entries(styles)
  entry.forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      element.style.setProperty(toCamelCase(key), `${value}`)
    }
  })
}

module.exports = Controller
