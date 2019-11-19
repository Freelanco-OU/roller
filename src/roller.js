// @flow

// eslint-disable-next-line no-unused-vars
const Overlay = require('./group/overlay.js')
// eslint-disable-next-line no-unused-vars
const Focus = require('./group/focus.js')
// eslint-disable-next-line no-unused-vars
const Popover = require('./group/popover.js')
const { wait } = require('./utils/helpers.js')
const { autoScrollTo } = require('./utils/scrolling.js')

export type HighlightGroup = {
  beforeInsert?: (wait: typeof wait) => Promise<void>,
  overlay?: Overlay,
  element: Focus,
  popover?: Popover,
  afterRemove?: (wait: typeof wait) => Promise<void>
}

type RollerOptions = {
  onOverlayClick(group: HighlightGroup, event: MouseEvent): void
}

/**
 * Main class that can highlight one element.
 */
class Roller {
  _options: RollerOptions

  /**
   * Construct Roller instance.
   * By default `onOverlayClick` method removes (unhighlights) current group of elements from DOM.
   */
  constructor(options?: RollerOptions = {}) {
    this._options = {
      onOverlayClick:
        options.onOverlayClick ||
        (async (group: HighlightGroup, event: MouseEvent) => {
          const target = event.target

          if (target instanceof HTMLElement) {
            if (
              group.overlay &&
              target.className === group.overlay.node.className
            ) {
              group.overlay.close()
              group.element.cancel()
              if (group.popover) {
                group.popover.close()
              }

              if (group.afterRemove) {
                await group.afterRemove(wait)
              }
            }
          }
        })
    }
  }

  /**
   * Highlights element on the page.
   */
  async highlight(group: HighlightGroup): Promise<void> {
    const { beforeInsert, overlay, popover, element } = group

    if (beforeInsert) {
      await beforeInsert(wait)
    }

    if (overlay) {
      overlay.show()
      overlay.node.addEventListener('click', (event: MouseEvent) => {
        this._options.onOverlayClick(group, event)
      })
    }
    const htmlElement = await element.highlight()

    autoScrollTo(
      htmlElement.getBoundingClientRect(),
      popover ? popover.node.getBoundingClientRect() : undefined
    )

    if (popover) {
      popover.show(htmlElement)
    }
  }

  /**
   * Manually remove highlight from element.
   */
  async unHighlight(group: HighlightGroup): Promise<void> {
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
