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

/**
 * Construct popover for element that is highlighted.
 */
class Popover {
  /**
   * Build popover.
   * @param {Object} options
   * @param {'top' | 'bottom' | 'left' | 'right' | 'auto'} [options.position='auto'] Position of the popover according to highlighted element.
   * @param {Number} [options.offset=10] Offset of the popover from element.
   * @param {String} options.title
   * @param {String} [options.description]
   * @param {{ popover?: { [key: String]: String | Number | Boolean }, title?: { [key: String]: String | Number | Boolean }, description?: { [key: String]: String | Number | Boolean } }} [options.styles] Custom styles for popover.
   * @param {Boolean} [options.isolateClickEvents] Isolates *click* events from bubbling out of the popover.
   */
  constructor(options) {
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
      const description = document.createElement('p')
      description.setAttribute('style', stylify({
        margin: POPOVER_DESCRIPTION_MARGIN,
        'font-size': POPOVER_DESCRIPTION_FONT_SIZE,
        'line-height': POPOVER_DESCRIPTION_LINE_HEIGHT,
        ...descriptionStyles
      }))
      description.append(options.description)
      popover.append(description)
    }

    this._options = {
      position: options.position || 'auto',
      offset: options.offset || POPOVER_OFFSET
    }

    // Don't propagate event to outer elements, except of highlighted element.
    if (options.isolateClickEvents) {
      popover.addEventListener('click', (event) => { event.stopPropagation() })
    }

    /** @type {HTMLElement} */
    this.node = popover
  }

  /**
   * Construct and show popover near highlighted element.
   * @param {HTMLElement} element
   */
  show(element) {
    document.body.append(this.node)

    requestAnimationFrame(() => {
      this.node.style.opacity = '1'
    })

    this._onResize = (event) => {
      const elementSize = element.getBoundingClientRect()
      calcPopoverPosition(elementSize, this.node, {
        position: this._options.position,
        offset: this._options.offset
      })
    }
    window.addEventListener('resize', this._onResize)
    this._onResize()
  }

  /** Closes this popover. */
  close() {
    this.node.remove()
    window.removeEventListener('resize', this._onResize)
  }

  /**
   * Add controller to popover.
   * @param {Controller} controller
   */
  _addController(controller) {
    this.node.append(controller.node)
  }
}

/**
 * Calculate position of popover.
 * @param {ClientRect | DOMRect} elementSize Element concerning which popover need to be positioned.
 * @param {HTMLElement} popover
 * @param {Object} options
 * @param {PopoverPosition} options.position String that signal what position of popover is preferred. Default `auto`.
 * @param {Number} options.offset
 */
function calcPopoverPosition(elementSize, popover, options) {
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
 * @param {ClientRect | DOMRect} elementSize Element concerning which popover need to be positioned.
 * @param {HTMLElement} popover
 * @param {Object} options
 * @param {Number} options.offset
 */
function autoPositionPopover(elementSize, popover, { offset }) {
  const documentSize = document.body.getBoundingClientRect()
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
