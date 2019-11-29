// @flow

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
  TIP_CLOSE_BUTTON_MARGIN,
  TIP_BOX_SHADOW
} = require('./constants.js')
const { inlineCssFrom, animate } = require('./utils/helpers.js')

type TipPosition = | 'top-right'
    | 'bottom-right'
    | 'top-left'
    | 'bottom-left'
    | 'center'

type TipOptions = {
  position?: TipPosition,
  tipStyles?: { [string]: string | number },
  descriptionStyles?: { [string]: string | number },
  closeButtonStyles?: { [string]: string | number },
  okButtonStyles?: { [string]: string | number },
  text: string,
  okButtonText?: string,
  closeButtonText?: string,
  onClose?: (event: MouseEvent) => void,
  onOk?: (event: MouseEvent) => void
}

/** Describes tip on the page. */
class Tip {
  +node: HTMLElement
  position: TipPosition

  constructor(options: TipOptions) {
    const tipStyles = options.tipStyles || {}
    const descriptionStyles = options.descriptionStyles || {}
    const closeButtonStyles = options.closeButtonStyles || {}
    const okButtonStyles = options.okButtonStyles || {}
    const closeButtonText = options.closeButtonText || 'Close'
    const okButtonText = options.okButtonText || 'OK'
    const onClose = (event: MouseEvent) => {
      if (options.onClose) {
        options.onClose(event)
      }
      this.close()
    }
    const onOk = (event: MouseEvent) => {
      if (options.onOk) {
        options.onOk(event)
      }
      this.close()
    }

    const tip = document.createElement('aside')
    tip.classList.add('roller-tip')
    tip.setAttribute(
      'style',
      inlineCssFrom({
        padding: TIP_PADDING,
        position: TIP_POSITION,
        'border-radius': TIP_BORDER_RADIUS,
        'background-color': TIP_BACKGROUND_COLOR,
        opacity: 0,
        'max-width': TIP_MAX_WIDTH,
        'z-index': TIP_Z_INDEX,
        'box-shadow': TIP_BOX_SHADOW,
        // $FlowFixMe
        ...tipStyles
      })
    )

    const description = document.createElement('p')
    description.classList.add('roller-tip-description')
    description.setAttribute(
      'style',
      inlineCssFrom({
        margin: TIP_DESCRIPTION_MARGIN,
        'font-size': TIP_DESCRIPTION_FONT_SIZE,
        'line-height': TIP_DESCRIPTION_LINE_HEIGHT,
        'text-align': TIP_DESCRIPTION_TEXT_ALIGN,
        // $FlowFixMe
        ...descriptionStyles
      })
    )
    description.append(options.text)
    tip.append(description)

    // Start block of buttons
    const buttonsBlock = document.createElement('div')
    buttonsBlock.setAttribute(
      'style',
      inlineCssFrom({
        display: 'flex',
        'justify-content': 'space-between'
      })
    )

    const closeButton = document.createElement('button')
    closeButton.classList.add('roller-tip-close-button')
    closeButton.setAttribute(
      'style',
      inlineCssFrom({
        margin: TIP_CLOSE_BUTTON_MARGIN,
        padding: TIP_CLOSE_BUTTON_PADDING,
        outline: TIP_BUTTON_OUTLINE,
        'background-color': TIP_CLOSE_BUTTON_BACKGROUND_COLOR,
        border: TIP_CLOSE_BUTTON_BORDER,
        'border-radius': TIP_CLOSE_BUTTON_BORDER_RADIUS,
        'font-size': TIP_BUTTON_FONT_SIZE,
        color: TIP_CLOSE_BUTTON_COLOR,
        // $FlowFixMe
        ...closeButtonStyles
      })
    )
    closeButton.append(closeButtonText)
    closeButton.addEventListener('click', onClose)

    const okButton = document.createElement('button')
    okButton.classList.add('roller-tip-ok-button')
    okButton.setAttribute(
      'style',
      inlineCssFrom({
        margin: TIP_BUTTON_MARGIN,
        padding: TIP_OK_BUTTON_PADDING,
        outline: TIP_BUTTON_OUTLINE,
        'background-color': TIP_OK_BUTTON_BACKGROUND_COLOR,
        border: TIP_OK_BUTTON_BORDER,
        'border-radius': TIP_OK_BUTTON_BORDER_RADIUS,
        'font-size': TIP_BUTTON_FONT_SIZE,
        // $FlowFixMe
        ...okButtonStyles
      })
    )
    okButton.append(okButtonText)
    okButton.addEventListener('click', onOk)

    buttonsBlock.append(closeButton)
    buttonsBlock.append(okButton)

    // End block of buttons
    tip.append(buttonsBlock)

    this.position = options.position || 'top-right'
    setTipPosition(tip, this.position)
    this.node = tip
  }

  /** Shows tip. */
  show(): void {
    if (document.body) {
      // Sets and restore transition if user return to previous step.
      this.node.style.transition = `${TIP_TRANSITION}`

      document.body.append(this.node)

      requestAnimationFrame(() => {
        this.node.style.opacity = `${TIP_OPACITY}`
        setTipPosition(this.node, this.position, false)
      })
    }
  }

  /** Closes tip. */
  close(): void {
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
        // Resets opacity if tip will be reshowed.
        node.style.opacity = '0'
      }
    })
  }
}

function setTipPosition(
  tip: HTMLElement,
  position: TipPosition,
  initial? = true
) {
  switch (position) {
    case 'top-left':
      tip.style.top = '1em'
      tip.style.left = initial ? '0' : '1em'
      break
    case 'bottom-right':
      tip.style.bottom = '1em'
      tip.style.right = initial ? '0' : '1em'
      break
    case 'bottom-left':
      tip.style.bottom = '1em'
      tip.style.left = initial ? '0' : '1em'
      break
    case 'center':
      tip.style.top = '50%'
      tip.style.left = '50%'
      tip.style.transform = initial
        ? 'translate(-50%, 0)'
        : 'translate(-50%, -50%)'
      break
    default:
      tip.style.top = '1em'
      tip.style.right = initial ? '0' : '1em'
  }
}

module.exports = Tip
