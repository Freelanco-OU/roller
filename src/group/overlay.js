// @flow

const {
  OVERLAY_Z_INDEX,
  OVERLAY_POSITION,
  OVERLAY_TRANSITION,
  OVERLAY_BACKGROUND_COLOR,
  OVERLAY_OPACITY,
  OVERLAY_VISIBLE_OPACITY,
  OVERLAY_BOTTOM,
  OVERLAY_LEFT,
  OVERLAY_RIGHT,
  OVERLAY_TOP
} = require('../constants.js')
const { stylify, animate } = require('../utils/helpers.js')

type OverlayOptions = {
  initialStyles: { [string]: string | number },
  opacity?: number,
  isolateClickEvents?: boolean
}

/** Represents overlay on the page. */
class Overlay {
  _opacity: string
  +node: HTMLDivElement

  /**
   * Construct overlay node.
   * `initialStyles` - Initial style for overlay object.
   * `opacity` - Desired opacity for overlay object. By default it equals to `0.75`.
   * `isolateClickEvents` - Isolates *click* events from bubbling out of the overlay.
   */
  constructor(options?: OverlayOptions = {}) {
    const overlay = document.createElement('div')
    overlay.classList.add('roller-overlay')

    overlay.setAttribute(
      'style',
      stylify({
        position: OVERLAY_POSITION,
        top: OVERLAY_TOP,
        bottom: OVERLAY_BOTTOM,
        left: OVERLAY_LEFT,
        right: OVERLAY_RIGHT,
        opacity: OVERLAY_OPACITY,
        'background-color': OVERLAY_BACKGROUND_COLOR,
        'z-index': OVERLAY_Z_INDEX,
        // $FlowFixMe
        ...options.initialStyles
      })
    )

    // Don't propagate event to outer elements, except of highlighted element.
    if (options.isolateClickEvents) {
      overlay.addEventListener('click', (event: MouseEvent) => {
        event.stopPropagation()
      })
    }

    if (typeof options.opacity === 'number') {
      this._opacity = `${options.opacity}`
    } else {
      this._opacity = `${OVERLAY_VISIBLE_OPACITY}`
    }

    this.node = overlay
  }

  /** Shows overlay on the page. */
  show() {
    // Sets and restore transition if user return to previous step.
    this.node.style.transition = `${OVERLAY_TRANSITION}` // TODO: fix transition from initialStyles

    if (document.body) {
      document.body.append(this.node)
    }

    requestAnimationFrame(() => {
      this.node.style.opacity = this._opacity
    })
  }

  /** Closes this overlay. */
  close() {
    const node = this.node

    const transitionDuration = parseFloat(node.style.transitionDuration)
    const opacity = parseFloat(node.style.opacity)

    // Disable transition for proper animation
    node.style.transition = 'unset'

    animate({
      duration: transitionDuration,
      timing(time) {
        const exp = time ** 2
        return opacity > exp
          ? opacity - exp
          : 0
      },
      draw(progress) {
        node.style.opacity = progress.toPrecision(3)
      },
      onEnd() {
        node.remove()
      }
    })
  }
}

module.exports = Overlay
