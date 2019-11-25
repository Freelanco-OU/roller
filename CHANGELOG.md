# 0.5.3

- `Focus`'s method `cancel` doesn't throw an error now if *element* didn't found on the page.

## 0.5.2

- Fix removing `style` attribute in highlighted element if it contained one already.

## 0.5.1

- Add `roller-hover` class to `Hover` element.
- Small fix in README.

## 0.5.0

- Add autoscrolling to `Focus` and `Roller` if *element* that need to be highlighted is out of the viewport.
- Small visual changes in README.

## 0.4.2

- Fix positioning of `Hover` and `Popover`. Add *line-height* and *box-shadow* to `Hover`.
- Change version of the package. Make `Hover` to be inserted in DOM and removed on hover.

## 0.4.1

- Fix typos in README.

## 0.4.0

- Add `Hover` class.
- Fix positioning of `Hover` and `Popover` instances.
- Start rewriting README.

## 0.3.0

- Change constructor signature of `Focus` class. It receives only *options* object now.
*element* parameter is moved to *options*.
- Remove setting inline `transition` for `Focus` element.

## 0.2.4

- Change position of popover to `absolute` if page have scroll.
- Edit README.

## 0.2.3

- Fix global overlay to be closed on skipping guide.

## 0.2.2

- Fix opacity of tip if it will be reshowed.

## 0.2.1

- Fix bug with tip's `box-shadow` bug.

## 0.2.0

- Transfer codebase to Flow.
- Fix `margin-bottom` of description in *popover*.
- Add `Tip` class to the package.
- Add closing animation to `Tip`, `Focus`, `Overlay` and `Popover`.
- Add some config files.
- Edit README.

## 0.1.0

- Creating `Roller` class for highlighting single element on the page.
- Creating `Guide` class for creating intro.
- Creating additional classes, README, add LICENSE.
