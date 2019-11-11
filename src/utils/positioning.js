// @flow

export type Position = 'top' | 'bottom' | 'left' | 'right' | 'auto'

/**
 * Calculate position of helper element.
 * `elementSize` - Element concerning which helper element need to be positioned.
 * `position` - String that signal what position of helper element is preferred. Default `auto`.
 */
function calcPosition(
  elementSize: ClientRect | DOMRect,
  helper: HTMLElement,
  options: {
    position: Position,
    offset: number
  }
) {
  const helperSize = (getComputedStyle(helper): CSSStyleDeclaration)

  switch (options.position) {
    case 'top':
      helper.style.top = `${elementSize.top -
        options.offset -
        parseFloat(helperSize.height)}px`
      helper.style.left = `${elementSize.left}px`
      break
    case 'right':
      helper.style.top = `${elementSize.top}px`
      helper.style.left = `${elementSize.right + options.offset}px`
      break
    case 'left':
      helper.style.top = `${elementSize.top}px`
      helper.style.left = `${elementSize.left -
        options.offset -
        parseFloat(helperSize.width)}px`
      break
    case 'bottom':
      helper.style.top = `${elementSize.bottom + options.offset}px`
      helper.style.left = `${elementSize.left}px`
      break
    default:
      autoPosition(elementSize, helper, options)
  }
}

/**
 * Calculate position of helper.
 * `elementSize` - Element concerning which helper need to be positioned.
 */
function autoPosition(
  elementSize: ClientRect | DOMRect,
  helper: HTMLElement,
  options: { offset: number }
) {
  const { offset } = options

  const documentSize = document.body
    ? document.body.getBoundingClientRect()
    : { width: 0, height: 0 }
  const helperSize = (getComputedStyle(helper): CSSStyleDeclaration)

  if (elementSize.top - offset - parseFloat(helperSize.height) > 0) {
    calcPosition(elementSize, helper, {
      position: 'top',
      offset
    })
  } else if (
    documentSize.width -
      elementSize.right -
      offset -
      parseFloat(helperSize.width) >
    0
  ) {
    calcPosition(elementSize, helper, {
      position: 'right',
      offset
    })
  } else if (
    documentSize.height -
      elementSize.bottom -
      offset -
      parseFloat(helperSize.height) >
    0
  ) {
    calcPosition(elementSize, helper, {
      position: 'bottom',
      offset
    })
  } else {
    calcPosition(elementSize, helper, {
      position: 'left',
      offset
    })
  }
}

module.exports = {
  calcPosition
}
