// @flow

const { offset } = require('./scrolling.js')

export type Position = 'top' | 'bottom' | 'left' | 'right' | 'auto'

type CalcPositionOptions = {
  elementSize: ClientRect | DOMRect,
  isElementFixed?: boolean,
  helper: HTMLElement,
  options: {
    position: Position,
    offset: number
  }
}

/**
 * Calculate position of helper element.
 * `elementSize` - Element concerning which helper element need to be positioned.
 * `position` - String that signal what position of helper element is preferred. Default `auto`.
 */
function calcPosition(calcOptions: CalcPositionOptions) {
  const { elementSize, isElementFixed, helper, options } = calcOptions

  const helperSize = (getComputedStyle(helper): CSSStyleDeclaration)

  switch (options.position) {
    case 'top':
      helper.style.top = `${offset(elementSize, isElementFixed).top -
        options.offset -
        parseFloat(helperSize.height)}px`
      helper.style.left = `${offset(elementSize, isElementFixed).left}px`
      break
    case 'right':
      helper.style.top = `${offset(elementSize, isElementFixed).top}px`
      helper.style.left = `${offset(elementSize, isElementFixed).right +
        options.offset}px`
      break
    case 'left':
      helper.style.top = `${offset(elementSize, isElementFixed).top}px`
      helper.style.left = `${offset(elementSize, isElementFixed).left -
        options.offset -
        parseFloat(helperSize.width)}px`
      break
    case 'bottom':
      helper.style.top = `${offset(elementSize, isElementFixed).bottom +
        options.offset}px`
      helper.style.left = `${offset(elementSize, isElementFixed).left}px`
      break
    default:
      autoPosition(elementSize, isElementFixed, helper, options)
  }
}

/**
 * Calculate position of helper.
 * `elementSize` - Element concerning which helper need to be positioned.
 */
function autoPosition(
  elementSize: ClientRect | DOMRect,
  isElementFixed?: boolean,
  helper: HTMLElement,
  options: { offset: number }
) {
  const { offset } = options

  const documentSize = document.body
    ? document.body.getBoundingClientRect()
    : { width: 0, height: 0 }
  const helperSize = (getComputedStyle(helper): CSSStyleDeclaration)

  if (elementSize.top - offset - parseFloat(helperSize.height) > 0) {
    calcPosition({
      elementSize,
      isElementFixed,
      helper,
      options: {
        position: 'top',
        offset
      }
    })
  } else if (
    documentSize.width -
      elementSize.right -
      offset -
      parseFloat(helperSize.width) >
    0
  ) {
    calcPosition({
      elementSize,
      isElementFixed,
      helper,
      options: {
        position: 'right',
        offset
      }
    })
  } else if (
    documentSize.height -
      elementSize.bottom -
      offset -
      parseFloat(helperSize.height) >
    0
  ) {
    calcPosition({
      elementSize,
      isElementFixed,
      helper,
      options: {
        position: 'bottom',
        offset
      }
    })
  } else {
    calcPosition({
      elementSize,
      isElementFixed,
      helper,
      options: {
        position: 'left',
        offset
      }
    })
  }
}

module.exports = {
  calcPosition
}
