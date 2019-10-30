// @flow

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
const { stylify } = require('../utils/helpers.js')

type PopoverPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto'

type PopoverOptions = {
  position?: PopoverPosition,
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
    position: PopoverPosition,
    offset: number
  }

  _onResize: EventHandler
  node: HTMLElement

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
    popover.setAttribute('style', stylify({
      position: POPOVER_POSITION,
      padding: POPOVER_PADDING,
      'border-radius': POPOVER_BORDER_RADIUS,
      'background-color': POPOVER_BACKGROUND_COLOR,
      transition: POPOVER_TRANSITION,
      opacity: POPOVER_OPACITY,
      'max-width': POPOVER_MAX_WIDTH,
      'z-index': POPOVER_Z_INDEX,
      ...popoverStyles
    }))
    popover.classList.add('roller-popover')

    const title = document.createElement('h4')
    title.setAttribute('style', stylify({
      margin: POPOVER_TITLE_MARGIN,
      'font-size': POPOVER_TITLE_FONT_SIZE,
      'line-height': POPOVER_TITLE_LINE_HEIGHT,
      'text-align': POPOVER_TITLE_TEXT_ALIGN,
      ...titleStyles
    }))
    title.append(options.title)
    popover.append(title)

    if (options.description) {
      const descriptionText = options.description

      const description = document.createElement('p')
      description.setAttribute('style', stylify({
        margin: POPOVER_DESCRIPTION_MARGIN,
        'font-size': POPOVER_DESCRIPTION_FONT_SIZE,
        'line-height': POPOVER_DESCRIPTION_LINE_HEIGHT,
        ...descriptionStyles
      }))
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
    if (document.body) {
      document.body.append(this.node)
    }

    requestAnimationFrame(() => {
      this.node.style.opacity = '1'
    })

    const repaintFunction = () => {
      const elementSize = element.getBoundingClientRect()
      calcPopoverPosition(elementSize, this.node, this._options)
    }
    this._onResize = (event: Event) => {
      repaintFunction()
    }
    window.addEventListener('resize', this._onResize)

    repaintFunction()
  }

  /** Closes this popover. */
  close() {
    this.node.remove()
    window.removeEventListener('resize', this._onResize)
  }

  /**
   * Add controller to popover.
   */
  _addController(controller: Controller) {
    this.node.append(controller.node)
  }
}

/**
 * Calculate position of popover.
 * `elementSize` - Element concerning which popover need to be positioned.
 * `position` - String that signal what position of popover is preferred. Default `auto`.
 */
function calcPopoverPosition(
  elementSize: ClientRect | DOMRect,
  popover: HTMLElement,
  options: {
    position: PopoverPosition,
    offset: number
  }) {
  const popoverSize = popover.getBoundingClientRect()

  switch (options.position) {
    case 'top':
      popover.style.top = `${elementSize.top - options.offset - popoverSize.height}px`
      popover.style.left = `${elementSize.left}px`
      break
    case 'right':
      popover.style.top = `${elementSize.top}px`
      popover.style.left = `${elementSize.right + options.offset}px`
      break
    case 'left':
      popover.style.top = `${elementSize.top}px`
      popover.style.left = `${elementSize.left - options.offset - popoverSize.width}px`
      break
    case 'bottom':
      popover.style.bottom = `${elementSize.bottom + options.offset + popoverSize.height}px`
      popover.style.left = `${elementSize.left}px`
      break
    default:
      autoPositionPopover(elementSize, popover, options)
  }
}

/**
 * Calculate position of popover.
 * `elementSize` - Element concerning which popover need to be positioned.
 */
function autoPositionPopover(elementSize: ClientRect | DOMRect, popover: HTMLElement, options: { offset: number }) {
  const { offset } = options

  const documentSize = document.body
    ? document.body.getBoundingClientRect()
    : { width: 0, height: 0 }
  const popoverSize = popover.getBoundingClientRect()

  if ((elementSize.top - offset) - popoverSize.height > 0) {
    calcPopoverPosition(elementSize, popover, {
      position: 'top',
      offset
    })
  } else if ((documentSize.width - elementSize.right - offset) - popoverSize.width > 0) {
    calcPopoverPosition(elementSize, popover, {
      position: 'right',
      offset
    })
  } else if ((documentSize.height - elementSize.bottom - offset) - popoverSize.height > 0) {
    calcPopoverPosition(elementSize, popover, {
      position: 'bottom',
      offset
    })
  } else {
    calcPopoverPosition(elementSize, popover, {
      position: 'left',
      offset
    })
  }
}

module.exports = Popover
