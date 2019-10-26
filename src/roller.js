// eslint-disable-next-line no-unused-vars
const Overlay = require('./group/overlay.js')
// eslint-disable-next-line no-unused-vars
const Focus = require('./group/focus.js')
// eslint-disable-next-line no-unused-vars
const Popover = require('./group/popover.js')
const { wait } = require('./utils/helpers.js')

/**
 * Main class that can highlight one element.
 */
class Roller {
  /**
   * Construct Roller instance.
   * By default `onOverlayClick` method removes (unhighlights) current group of elements from DOM.
   * @param {{
   *  onOverlayClick?: (group: {
   *    beforeInsert?: () => void,
   *    overlay?: Overlay,
   *    element: Focus,
   *    popover?: Popover,
   *    afterRemove?: () => void
   *  }, event: MouseEvent) => void
   * }} [options]
   */
  constructor(options = {}) {
    this._options = {
      onOverlayClick: options.onOverlayClick || ((group, event) => {
        /** @type {HTMLElement} */
        const target = event.target

        if (target.className === group.overlay.className) {
          if (group.overlay) {
            group.overlay.close()
          }
          group.element.cancel()
          if (group.popover) {
            group.popover.close()
          }

          if (group.afterRemove) {
            group.afterRemove(wait)
          }
        }
      })
    }
  }

  /**
   * Highlights element on the page.
   * @param {{
   *  beforeInsert?: (wait: (seconds: Number | String) => Promise<void>) => Promise<void>,
   *  overlay?: Overlay,
   *  element: Focus,
   *  popover?: Popover,
   *  (wait: (seconds: Number | String) => Promise<void>) => Promise<void>
   * }} group
   */
  async highlight(group) {
    const { beforeInsert, overlay, popover, element } = group

    if (beforeInsert) {
      await beforeInsert(wait)
    }

    if (overlay) {
      overlay.show()
    }
    const htmlElement = await element.highlight()
    if (popover) {
      popover.show(htmlElement)
    }

    if (overlay) {
      overlay.node.addEventListener('click', (event) => {
        this._options.onOverlayClick(group, event)
      })
    }
  }

  /**
   * Manually remove highlight from element.
   * @param {{
    *  beforeInsert?: (wait: (seconds: Number | String) => Promise<void>) => Promise<void>,
    *  overlay?: Overlay,
    *  element: Focus,
    *  popover?: Popover,
    *  afterRemove?: (wait: (seconds: Number | String) => Promise<void>) => Promise<void>
    * }} group
    */
  async unHighlight(group) {
    if (group.overlay) {
      group.overlay.close()
    }
    group.element.cancel()
    if (group.popover) {
      group.popover.close()
    }

    if (group.afterRemove) {
      await group.afterRemove(wait)
    }
  }
}

module.exports = Roller
