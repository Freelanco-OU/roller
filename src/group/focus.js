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
  node: ?HTMLElement
  _options: FocusOptions
  _initialStyles: ?CSSStyleDeclaration

  /**
   * Construct `Focus` instance.
   */
  constructor(element: HTMLElement | string, options?: FocusOptions) {
    if (typeof element === 'string') {
      /** @type {HTMLElement} */
      this.node = document.querySelector(element)
    } else {
      this.node = element
    }

    this._options = options || {}
  }

  /** Highlight single `element` on the page. */
  async highlight(): Promise<?HTMLElement> {
    if (this.node) {
      const node = this.node

      if (this._options.beforeHighlight) {
        await this._options.beforeHighlight(node, wait)
      }

      // Remember initial styles of element. Will be needed in canceling focus.
      this._initialStyles = (getComputedStyle(node): CSSStyleDeclaration) // TODO: checks for accepting pull request

      let parent = node
      let backgroundColor = this._initialStyles.backgroundColor
      while (backgroundColor === 'rgba(0, 0, 0, 0)') {
        if (parent.parentElement) {
          parent = parent.parentElement
        }

        if (parent) {
          backgroundColor = (getComputedStyle(parent): CSSStyleDeclaration)
            .backgroundColor
        } else {
          backgroundColor = ELEMENT_BACKGROUND_COLOR
        }
      }

      // Styles need to be set inline, because program may add additional styles.
      node.style.transition = ELEMENT_TRANSITION
      node.style.zIndex = `${ELEMENT_Z_INDEX}`
      node.style.backgroundColor = backgroundColor
      if (
        this._initialStyles.position === 'initial' ||
        this._initialStyles.position === 'static'
      ) {
        node.style.position = ELEMENT_POSITION
      }

      node.classList.add('roller-highlighted-element')

      if (this._options.afterHighlight) {
        await this._options.afterHighlight(node, wait)
      }
    } else {
      console.error('No element to highlight!')
    }

    return this.node
  }

  /** Cancel highlight. */
  cancel() {
    if (this.node) {
      const node = this.node

      node.removeAttribute('style')
      node.classList.remove('roller-highlighted-element')
    }
  }
}

module.exports = Focus
