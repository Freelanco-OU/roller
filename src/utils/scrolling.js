// @flow

/** Gets distance of element from top-left corner of document. */
function offset(
  element: ClientRect | DOMRect
): { top: number, left: number, right: number, bottom: number } {
  return {
    top: element.top + window.scrollY,
    bottom: element.bottom + window.scrollY,
    left: element.left + window.scrollX,
    right: element.right + window.scrollX
  }
}

function autoScrollTo(
  element: ClientRect | DOMRect,
  helper?: ClientRect | DOMRect
) {
  const top =
    offset(element).top -
    (helper ? helper.top : 0) -
    (window.innerHeight: number) / 2.8
  const left =
    offset(element).left -
    (helper ? helper.left : 0) -
    (window.innerWidth: number) / 2.8
  scrollTo({
    top,
    left,
    behavior: 'smooth'
  })
}

module.exports = {
  autoScrollTo,
  offset
}
