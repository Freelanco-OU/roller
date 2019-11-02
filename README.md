# Roller - a gorgeous intro package

The package exports six classes: `Roller`, `Guide`, `Overlay`, `Popover`, `Focus` and `Tip`.

## Focus

It is the main class that represent element that need to be highlighted. It takes selector of element or element itself and optional parameter *options*:

```javascript
const focus = new Focus('.some-class', {
  async beforeHighlight(node, wait) {
    // some code
    // node - DOM element that is highlighted.
    // `wait` asynchronous function is used if code must wait for some time
  },
  async afterHighlight(node, wait) {
    // some code
    // node - DOM element that is highlighted.
    // `wait` asynchronous function is used if code must wait for some time
  }
})
// or
const element = document.querySelector('.some-class')
const focus = new Focus(element)
```

## Overlay

This class represents overlay on the page. You can set your own initial styles for it, end *opacity* and optional parameter *isolateClickEvents*:

```javascript
const overlay = new Overlay({
  initialStyles: {
    'background-color': 'rgb(234, 54, 95)'
    // you must write valid CSS expressions in kebab-case
  },
  opacity: 0.75, // default
  isolateClickEvents: false // default. If `true` all events that is propagated inside of overlay will be isolated.
})
```

## Popover

This class (if it is presented) represents explanation for highlighted element.

```javascript
const popover = new Popover({
  position: 'auto', // default. Position of popover according to element.
  offset: '10px', // default. Distance of the popover from element.
  title: 'Some cool title', // Title of the explanation.
  description: 'Description' // Optional. Detailed description of the explanation.,
  styles: {
    // CSS valid styles in kebab-case.
  },
  isolateClickEvents: false // default. If `true` all events that is propagated inside of popover will be isolated.
})
```

Usually you will not using these classes directly. Together they represents a `group` that is accepted by `Roller` and `Guide`.

## Roller

If you want highlight single element on your page, use `Roller`:

```javascript
const roller = new Roller({
  onOverLayClick(group) {
    // some code that may change state of group element or
    // make another job. By default, it closes highlight group.
  }
})
roller.highlight({
  async beforeInsert(wait) {}, // executes before roller starts highlight element.
  new Overlay(/* options */),
  new Focus(/* options */),
  new Popover(/* options */),
  async afterRemove(wait) {}, // executes after roller ends highlight and removes above elements from DOM.
})
```

## Guide

For creating sequence of highlighting of elements you can use `Guide`.

```javascript
const guide = new Guide({
  groups: [/* ... */], // This is array of groups of Overlay(optional), Focus and Popover with hooks. Group is the same as accept Roller.,
  overlay: new Overlay(), // This is global overlay for guide object. It can be overridden by overlay in group
  onDone() {
    // Invokes after last group will be highlighted.
  },
  onSkip() {
    // Invokes when user skips guide.
  }
})
```

After you create `Guide`, you must call `configure()` method of it. It is needed for define styles and text for controls:

```javascript
guide.configure({
  skipButtonText: 'Skip', // default
  // ...
  skipButtonStyles: {
    // ...
  }
})
.start() // Starts guide.
```

## Tip

This class represents tip on the page. It isn't attached to element on the page, but is positioned according to window.

```javascript
const tip = new Tip({
  // Set position of the tip
  position: 'bottom-right' | 'top-left' | 'bottom-left' | 'center' | 'top-right'(default),
  tipStyles: { ... },
  descriptionStyles: { ... },
  closeButtonStyles: { ... },
  okButtonStyles: { ... },
  text: 'Some text here',
  okButtonText: 'OK', // default
  closeButtonText: 'Close', // default
  onClose(event) {
    // Invokes on closing tip
  },
  onOk(event) {
    // Invokes on clicking OK
  }
})
```

### Other

Package is created under MIT-style [LICENSE](LICENSE).

Please, push your issues [here](https://github.com/Freelanco-OU/roller/issues), if there will be ones.

With ♡ from **Freelanco**.
