// @flow

import type { Position } from '../utils/positioning.js'

const {
  POPOVER_Z_INDEX,
  POPOVER_OFFSET,
  POPOVER_PADDING,
  POPOVER_BORDER_RADIUS,
  POPOVER_POSITION,
  POPOVER_BACKGROUND_COLOR,
  POPOVER_MAX_WIDTH,
  POPOVER_OPACITY,
  POPOVER_TRANSITION,
  POPOVER_TITLE_FONT_SIZE,
  POPOVER_TITLE_LINE_HEIGHT,
  POPOVER_TITLE_MARGIN,
  POPOVER_TITLE_TEXT_ALIGN,
  POPOVER_DESCRIPTION_FONT_SIZE,
  POPOVER_DESCRIPTION_LINE_HEIGHT,
  POPOVER_DESCRIPTION_MARGIN
} = require('../constants.js')
// eslint-disable-next-line no-unused-vars
const Controller = require('../controller.js')
const { inlineCssFrom, animate } = require('../utils/helpers.js')
const { calcPosition } = require('../utils/positioning.js')

type PopoverOptions = {
  position?: Position,
  offset?: number,
  title: string,
  description?: string,
  styles?: {
    popover?: { [string]: string | number },
    title?: { [string]: string | number },
    description?: { [string]: string | number }
  },
  isolateClickEvents?: boolean
}

/**
 * Construct popover for element that is highlighted.
 */
class Popover {
  _options: {
    position: Position,
    offset: number
  }

  _onResize: EventHandler
  +node: HTMLElement

  /**
   * Build popover.
   * `position` - Position of the popover according to highlighted element. Default is `auto`.
   * `offset` - Offset of the popover from element. Default is `10`.
   * `styles` - Custom styles for popover.
   * `isolateClickEvents` - Isolates *click* events from bubbling out of the popover.
   */
  constructor(options: PopoverOptions) {
    const styles = options.styles || {}
    const popoverStyles = styles.popover || {}
    const titleStyles = styles.title || {}
    const descriptionStyles = styles.description || {}

    const popover = document.createElement('aside')
    popover.setAttribute(
      'style',
      inlineCssFrom({
        position: POPOVER_POSITION,
        padding: POPOVER_PADDING,
        'border-radius': POPOVER_BORDER_RADIUS,
        'background-color': POPOVER_BACKGROUND_COLOR,
        opacity: POPOVER_OPACITY,
        'max-width': POPOVER_MAX_WIDTH,
        'z-index': POPOVER_Z_INDEX,
        // $FlowFixMe
        ...popoverStyles
      })
    )
    popover.classList.add('roller-popover')

    const title = document.createElement('h4')
    title.setAttribute(
      'style',
      inlineCssFrom({
        margin: POPOVER_TITLE_MARGIN,
        'font-size': POPOVER_TITLE_FONT_SIZE,
        'line-height': POPOVER_TITLE_LINE_HEIGHT,
        'text-align': POPOVER_TITLE_TEXT_ALIGN,
        // $FlowFixMe
        ...titleStyles
      })
    )
    title.append(options.title)
    popover.append(title)

    if (options.description) {
      const descriptionText = options.description

      const description = document.createElement('p')
      description.setAttribute(
        'style',
        inlineCssFrom({
          margin: POPOVER_DESCRIPTION_MARGIN,
          'font-size': POPOVER_DESCRIPTION_FONT_SIZE,
          'line-height': POPOVER_DESCRIPTION_LINE_HEIGHT,
          // $FlowFixMe
          ...descriptionStyles
        })
      )
      description.append(descriptionText)
      popover.append(description)
    }

    this._options = {
      position: options.position || 'auto',
      offset: options.offset || POPOVER_OFFSET
    }

    // Don't propagate event to outer elements, except of highlighted element.
    if (options.isolateClickEvents) {
      popover.addEventListener('click', (event: Event) => {
        event.stopPropagation()
      })
    }

    this.node = popover
  }

  /**
   * Construct and show popover near highlighted element.
   */
  show(element: HTMLElement) {
    const elementStyles = getComputedStyle(element)
    if (!!elementStyles.position && elementStyles.position === 'fixed') {
      this.node.style.position = 'fixed'
    }

    const repaintFunction = () => {
      const elementSize = element.getBoundingClientRect()
      calcPosition({
        elementSize,
        isElementFixed:
          !!elementStyles.position && elementStyles.position === 'fixed',
        helper: this.node,
        options: this._options
      })
    }

    // Sets and restore transition if user return to previous step.
    this.node.style.transition = `${POPOVER_TRANSITION}`

    if (document.body) {
      document.body.append(this.node)

      requestAnimationFrame(() => {
        repaintFunction()
        this.node.style.opacity = '1'
      })

      this._onResize = (event: Event) => {
        repaintFunction()
      }
      window.addEventListener('resize', this._onResize)
    }
  }

  /** Closes this popover. */
  close() {
    const node = this.node

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
        node.remove()
        window.removeEventListener('resize', this._onResize)
      }
    })
  }

  /**
   * Add controller to popover.
   */
  _addController(controller: Controller) {
    this.node.append(controller.node)
  }
}

module.exports = Popover
