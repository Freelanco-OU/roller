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
  HOVER_TEXT_ALIGN
} = require('./constants.js')
const { stylify } = require('./utils/helpers.js')
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

  _onMouseOver: (event: MouseEvent) => void
  _onMouseOut: (event: MouseEvent) => void

  constructor(options: HoverOptions) {
    const hoverStyles = options.hoverStyles || {}

    const hoverContainer = document.createElement('aside')
    hoverContainer.setAttribute('style', stylify({
      position: HOVER_POSITION,
      padding: HOVER_PADDING,
      'z-index': HOVER_Z_INDEX,
      'border-radius': HOVER_BORDER_RADIUS,
      transition: HOVER_TRANSITION,
      opacity: HOVER_OPACITY,
      'max-width': HOVER_MAX_WIDTH,
      'background-color': HOVER_BACKGROUND_COLOR,
      'text-align': HOVER_TEXT_ALIGN,
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

    this._onMouseOver = (event: MouseEvent) => {
      const elementSize = this.to.getBoundingClientRect()
      calcPosition(elementSize, this.node, {
        offset: this._options.offset || HOVER_OFFSET,
        position: this._options.position || 'auto'
      })
      requestAnimationFrame(() => {
        this.node.style.opacity = '1'
      })

      if (this._options.onHover) {
        this._options.onHover(event)
      }
    }
    this._onMouseOut = (event: MouseEvent) => {
      this.node.style.opacity = `${HOVER_OPACITY}`
    }

    this.to.addEventListener('mouseover', this._onMouseOver)
    this.to.addEventListener('mouseout', this._onMouseOut)

    if (document.body) {
      document.body.append(this.node)
    }
  }

  detach(): void {
    if (this.to) {
      this.to.removeEventListener('mouseover', this._onMouseOver)
      this.to.removeEventListener('mouseout', this._onMouseOut)
    }
    this.node.remove()
  }
}

module.exports = Hover