//      

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
const { stylify } = require('../utils/helpers.js')

                       
                                                    
                   
                              
 

/** Represents overlay on the page. */
class Overlay {
                  
                       

  /**
   * Construct overlay node.
   * `initialStyles` - Initial style for overlay object.
   * `opacity` - Desired opacity for overlay object. By default it equals to `0.75`.
   * `isolateClickEvents` - Isolates *click* events from bubbling out of the overlay.
   */
  constructor(options                  = {}) {
    const overlay = document.createElement('div')
    overlay.classList.add('roller-overlay')

    overlay.setAttribute('style', stylify({
      position: OVERLAY_POSITION,
      transition: OVERLAY_TRANSITION,
      top: OVERLAY_TOP,
      bottom: OVERLAY_BOTTOM,
      left: OVERLAY_LEFT,
      right: OVERLAY_RIGHT,
      opacity: OVERLAY_OPACITY,
      'background-color': OVERLAY_BACKGROUND_COLOR,
      'z-index': OVERLAY_Z_INDEX,
      ...options.initialStyles
    }))

    // Don't propagate event to outer elements, except of highlighted element.
    if (options.isolateClickEvents) {
      overlay.addEventListener('click', (event            ) => { event.stopPropagation() })
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
    if (document.body) {
      document.body.append(this.node)
    }

    requestAnimationFrame(() => {
      this.node.style.opacity = this._opacity
    })
  }

  /** Closes this overlay. */
  close() {
    requestAnimationFrame(() => {
      this.node.style.opacity = '0'
    })
    this.node.remove()
  }
}

module.exports = Overlay
