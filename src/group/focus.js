// @flow

const {
  ELEMENT_Z_INDEX,
  ELEMENT_TRANSITION,
  ELEMENT_POSITION,
  ELEMENT_BACKGROUND_COLOR
} = require('../constants.js')
const { wait } = require('../utils/helpers.js')

type FocusOptions = {
  beforeHighlight?: (node: HTMLElement, wait: typeof wait) => Promise<void>,
  afterHighlight?: (node: HTMLElement, wait: typeof wait) => Promise<void>
}

/**
 * Main class that represent highlighter.
 */
class Focus {
  node: HTMLElement
  _options: FocusOptions
  _initialStyles: CSSStyleDeclaration

  /**
   * Construct `Focus` instance.
   */
  constructor(element: HTMLElement | string, options?: FocusOptions) {
    if (typeof element === 'string') {
      const el = document.querySelector(element)

      if (el) {
        this.node = el
      } else {
        throw new Error(
          'Element that need to be highlighted is not defined on the page!'
        )
      }
    } else {
      this.node = element
    }

    this._options = options || {}
  }

  /** Highlight single `element` on the page. */
  async highlight() {
    if (this._options.beforeHighlight) {
      await this._options.beforeHighlight(this.node, wait)
    }

    // Remember initial styles of element. Will be needed in canceling focus.
    this._initialStyles = (getComputedStyle(this.node): CSSStyleDeclaration)

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

    node.removeAttribute('style')
    node.classList.remove('roller-highlighted-element')
  }
}

module.exports = Focus
