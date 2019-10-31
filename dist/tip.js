//      

const {
  TIP_PADDING,
  TIP_POSITION,
  TIP_BORDER_RADIUS,
  TIP_BACKGROUND_COLOR,
  TIP_TRANSITION,
  TIP_OPACITY,
  TIP_MAX_WIDTH,
  TIP_Z_INDEX,
  TIP_DESCRIPTION_LINE_HEIGHT,
  TIP_DESCRIPTION_FONT_SIZE,
  TIP_DESCRIPTION_MARGIN,
  TIP_DESCRIPTION_TEXT_ALIGN,
  TIP_OK_BUTTON_BACKGROUND_COLOR,
  TIP_BUTTON_MARGIN,
  TIP_OK_BUTTON_PADDING,
  TIP_BUTTON_OUTLINE,
  TIP_OK_BUTTON_BORDER,
  TIP_OK_BUTTON_BORDER_RADIUS,
  TIP_BUTTON_FONT_SIZE,
  TIP_CLOSE_BUTTON_BORDER,
  TIP_CLOSE_BUTTON_BORDER_RADIUS,
  TIP_CLOSE_BUTTON_BACKGROUND_COLOR,
  TIP_CLOSE_BUTTON_PADDING,
  TIP_CLOSE_BUTTON_COLOR,
  TIP_CLOSE_BUTTON_MARGIN
} = require('./constants.js')
const { stylify } = require('./utils/helpers.js')

                   
                                                                                  
                                            
                                                    
                                                    
                                                 
                          
                        
                           
                                        
                                    
 

/** Describes tip on the page. */
class Tip {
                   

  constructor(options            ) {
    const defaultButtonEventHandler = (event            ) => { this.close() }

    const tipStyles = options.tipStyles || {}
    const descriptionStyles = options.descriptionStyles || {}
    const closeButtonStyles = options.closeButtonStyles || {}
    const okButtonStyles = options.okButtonStyles || {}
    const closeButtonText = options.closeButtonText || 'Close'
    const okButtonText = options.okButtonText || 'OK'
    const onClose = options.onClose || defaultButtonEventHandler
    const onOk = options.onOk || defaultButtonEventHandler

    const tip = document.createElement('aside')
    tip.classList.add('roller-tip')
    tip.setAttribute('style', stylify({
      padding: TIP_PADDING,
      position: TIP_POSITION,
      'border-radius': TIP_BORDER_RADIUS,
      'background-color': TIP_BACKGROUND_COLOR,
      transition: TIP_TRANSITION,
      opacity: TIP_OPACITY,
      'max-width': TIP_MAX_WIDTH,
      'z-index': TIP_Z_INDEX,
      ...tipStyles
    }))

    const description = document.createElement('p')
    description.classList.add('roller-tip-description')
    description.setAttribute('style', stylify({
      margin: TIP_DESCRIPTION_MARGIN,
      'font-size': TIP_DESCRIPTION_FONT_SIZE,
      'line-height': TIP_DESCRIPTION_LINE_HEIGHT,
      'text-align': TIP_DESCRIPTION_TEXT_ALIGN,
      ...descriptionStyles
    }))
    description.append(options.descriptionText)
    tip.append(description)

    // Start block of buttons
    const buttonsBlock = document.createElement('div')
    buttonsBlock.setAttribute('style', stylify({
      display: 'flex',
      'justify-content': 'flex-end'
    }))

    const closeButton = document.createElement('button')
    closeButton.classList.add('roller-tip-close-button')
    closeButton.setAttribute('style', stylify({
      margin: TIP_CLOSE_BUTTON_MARGIN,
      padding: TIP_CLOSE_BUTTON_PADDING,
      outline: TIP_BUTTON_OUTLINE,
      'background-color': TIP_CLOSE_BUTTON_BACKGROUND_COLOR,
      border: TIP_CLOSE_BUTTON_BORDER,
      'border-radius': TIP_CLOSE_BUTTON_BORDER_RADIUS,
      'font-size': TIP_BUTTON_FONT_SIZE,
      color: TIP_CLOSE_BUTTON_COLOR,
      ...closeButtonStyles
    }))
    closeButton.append(closeButtonText)
    closeButton.addEventListener('click', onClose)

    const okButton = document.createElement('button')
    okButton.classList.add('roller-tip-ok-button')
    okButton.setAttribute('style', stylify({
      margin: TIP_BUTTON_MARGIN,
      padding: TIP_OK_BUTTON_PADDING,
      outline: TIP_BUTTON_OUTLINE,
      'background-color': TIP_OK_BUTTON_BACKGROUND_COLOR,
      border: TIP_OK_BUTTON_BORDER,
      'border-radius': TIP_OK_BUTTON_BORDER_RADIUS,
      'font-size': TIP_BUTTON_FONT_SIZE,
      ...okButtonStyles
    }))
    okButton.append(okButtonText)
    okButton.addEventListener('click', onOk)

    buttonsBlock.append(closeButton)
    buttonsBlock.append(okButton)

    // End block of buttons
    tip.append(buttonsBlock)

    this.node = tip
  }

  /** Shows tip. */
  show()       {
    if (document.body) {
      document.body.append(this.node)
    }
  }

  /** Closes tip. */
  close()       {
    this.node.remove()
  }
}

module.exports = Tip
