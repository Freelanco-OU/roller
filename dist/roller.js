//      

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
   */
  constructor(options                 = {}) {
    this._options = {
      onOverlayClick:
        options.onOverlayClick ||
        (async (group                , event            ) => {
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
  async highlight(group                )                {
    const { beforeInsert, overlay, popover, element } = group

    if (beforeInsert) {
      await beforeInsert(wait)
    }

    if (overlay) {
      overlay.show()
      overlay.node.addEventListener('click', (event            ) => {
        this._options.onOverlayClick(group, event)
      })
    }
    const htmlElement = await element.highlight()
    if (popover && htmlElement) {
      popover.show(htmlElement)
    }
  }

  /**
   * Manually remove highlight from element.
   */
  async unHighlight(group                )                {
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
