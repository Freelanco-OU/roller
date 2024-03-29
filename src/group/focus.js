// @flow

const {
  ELEMENT_Z_INDEX,
  ELEMENT_TRANSITION,
  ELEMENT_POSITION,
  ELEMENT_BACKGROUND_COLOR
} = require('../constants.js')
const { wait, animate } = require('../utils/helpers.js')
const { autoScrollTo } = require('../utils/scrolling.js')

type FocusOptions = {
  beforeHighlight?: (node: HTMLElement, wait: typeof wait) => Promise<void>,
  element: HTMLElement | string,
  afterHighlight?: (node: HTMLElement, wait: typeof wait) => Promise<void>
}

/**
 * Main class that represent highlighter.
 */
class Focus {
  node: HTMLElement
  _options: FocusOptions
  _initialStyles: CSSStyleDeclaration
  _nodeStyleAttribute: ?string

  /**
   * Construct `Focus` instance.
   */
  constructor(options: FocusOptions) {
    this._options = options
  }

  /** Highlight single `element` on the page. */
  async highlight() {
    // Receives element from the page.
    if (typeof this._options.element === 'string') {
      const el = document.querySelector(this._options.element)

      if (el) {
        this.node = el
      } else {
        throw new Error(
          'Element that need to be highlighted is not defined on the page!'
        )
      }
    } else {
      this.node = this._options.element
    }
    // End receiving element from the page.

    autoScrollTo(this.node.getBoundingClientRect())

    if (this._options.beforeHighlight) {
      await this._options.beforeHighlight(this.node, wait)
    }

    // Remember initial styles of element. Will be needed in canceling focus.
    this._initialStyles = (getComputedStyle(this.node): CSSStyleDeclaration)
    this._nodeStyleAttribute = this.node.getAttribute('style')

    let parent = this.node
    let backgroundColor = this._initialStyles.backgroundColor
    while (!backgroundColor || backgroundColor === 'rgba(0, 0, 0, 0)') {
      parent = parent && parent.parentElement
      if (parent) {
        backgroundColor = (getComputedStyle(parent): CSSStyleDeclaration)
          .backgroundColor
      } else {
        backgroundColor = ELEMENT_BACKGROUND_COLOR
      }
    }

    // Styles need to be set inline, because program may add additional styles.
    this.node.style.transition = ELEMENT_TRANSITION
    this.node.style.zIndex = `${ELEMENT_Z_INDEX}`
    this.node.style.backgroundColor = backgroundColor
    if (
      this._initialStyles.position === 'initial' ||
      this._initialStyles.position === 'static'
    ) {
      this.node.style.position = ELEMENT_POSITION
    }

    this.node.classList.add('roller-highlighted-element')

    if (this._options.afterHighlight) {
      await this._options.afterHighlight(this.node, wait)
    }

    return this.node
  }

  /** Cancel highlight. */
  cancel() {
    const node = this.node

    if (node) {
      const styleAttributeValue = this._nodeStyleAttribute

      const transitionDuration = parseFloat(node.style.transitionDuration)

      // Disable transition for proper animation
      node.style.transition = 'unset'

      animate({
        duration: transitionDuration,
        timing(time) {
          return 1 - time ** 2
        },
        draw(progress) {
          node.style.opacity = progress.toPrecision(3)
        },
        onEnd() {
          styleAttributeValue
            ? node.setAttribute('style', styleAttributeValue)
            : node.removeAttribute('style')
          node.classList.remove('roller-highlighted-element')
        }
      })
    }
  }
}

module.exports = Focus
