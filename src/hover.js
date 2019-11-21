// @flow

import type { Position } from './utils/positioning.js'

const {
  HOVER_POSITION,
  HOVER_PADDING,
  HOVER_OFFSET,
  HOVER_Z_INDEX,
  HOVER_BORDER_RADIUS,
  HOVER_BACKGROUND_COLOR,
  HOVER_TRANSITION,
  HOVER_OPACITY,
  HOVER_MAX_WIDTH,
  HOVER_TEXT_ALIGN,
  HOVER_LINE_HEIGHT,
  HOVER_BOX_SHADOW
} = require('./constants.js')
const { stylify, animate } = require('./utils/helpers.js')
const { calcPosition } = require('./utils/positioning.js')

type HoverOptions = {
  position?: Position,
  offset?: number,
  hoverStyles?: { [string]: string | number },
  onHover?: (event: MouseEvent) => Promise<void>,
  content: string
}

class Hover {
  /** Node to which Hover will be attached */
  to: HTMLElement
  /** Hover element */
  node: HTMLElement
  _options: HoverOptions

  _onMouseEnter: (event: MouseEvent) => void
  _onMouseLeave: (event: MouseEvent) => void

  constructor(options: HoverOptions) {
    const hoverStyles = options.hoverStyles || {}

    const hoverContainer = document.createElement('aside')
    hoverContainer.classList.add('roller-hover')
    hoverContainer.setAttribute('style', stylify({
      position: HOVER_POSITION,
      padding: HOVER_PADDING,
      'z-index': HOVER_Z_INDEX,
      'border-radius': HOVER_BORDER_RADIUS,
      opacity: HOVER_OPACITY,
      'max-width': HOVER_MAX_WIDTH,
      'background-color': HOVER_BACKGROUND_COLOR,
      'text-align': HOVER_TEXT_ALIGN,
      'line-height': HOVER_LINE_HEIGHT,
      'box-shadow': HOVER_BOX_SHADOW,
      // $FlowFixMe
      ...hoverStyles
    }))
    hoverContainer.append(options.content)

    this._options = options
    this.node = hoverContainer
  }

  attachTo(element: HTMLElement | string): void {
    if (typeof element === 'string') {
      const el = document.querySelector(element)

      if (el) {
        this.to = el
      } else {
        throw new Error('No element to be attached to!')
      }
    } else {
      this.to = element
    }

    this._onMouseEnter = (event: MouseEvent) => {
      if (document.body) {
        document.body.append(this.node)
      }

      const elementSize = this.to.getBoundingClientRect()
      calcPosition(elementSize, this.node, {
        offset: this._options.offset || HOVER_OFFSET,
        position: this._options.position || 'auto'
      })

      requestAnimationFrame(() => {
        this.node.style.transition = HOVER_TRANSITION
        this.node.style.opacity = '1'
      })

      if (this._options.onHover) {
        this._options.onHover(event)
      }
    }
    this._onMouseLeave = (event: MouseEvent) => {
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
        }
      })
    }

    this.to.addEventListener('mouseenter', this._onMouseEnter)
    this.to.addEventListener('mouseleave', this._onMouseLeave)
  }

  detach(): void {
    if (this.to) {
      this.to.removeEventListener('mouseenter', this._onMouseEnter)
      this.to.removeEventListener('mouseleave', this._onMouseLeave)
    }
    this.node.remove()
  }
}

module.exports = Hover
