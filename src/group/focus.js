const {
  ELEMENT_Z_INDEX,
  ELEMENT_TRANSITION,
  ELEMENT_POSITION,
  ELEMENT_BACKGROUND_COLOR
} = require('../constants.js')
const { wait } = require('../utils/helpers.js')

/**
 * Main class that represent highlighter.
 * Also can start guide in the page.
 */
class Focus {
  /**
   * Construct `Focus` instance.
   * @param {HTMLElement | String} element
   * @param {{
   *  beforeHighlight?: (node: HTMLElement, wait: (seconds: Number | String) => Promise<void>) => Promise<void>,
   *  afterHighlight?: (node: HTMLElement, wait: (seconds: Number | String) => Promise<void>) => Promise<void>
   * }} [options]
   */
  constructor(element, options) {
    if (typeof element === 'string') {
      /** @type {HTMLElement} */
      this.node = document.querySelector(element)
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

    if (this.node) {
      // Remember initial styles of element. Will be needed in canceling focus.
      this._initialStyles = getComputedStyle(this.node)

      let parent = this.node
      let backgroundColor = this._initialStyles.backgroundColor
      while (!backgroundColor || backgroundColor === 'rgba(0, 0, 0, 0)') {
        parent = parent.parentElement
        if (parent) {
          backgroundColor = getComputedStyle(parent).backgroundColor
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
    } else {
      console.error('No element to highlight!')
    }

    if (this._options.afterHighlight) {
      await this._options.afterHighlight(this.node, wait)
    }

    return this.node
  }

  /** Cancel highlight. */
  cancel() {
    this.node.removeAttribute('style')
    this.node.classList.remove('roller-highlighted-element')
  }
}

module.exports = Focus
