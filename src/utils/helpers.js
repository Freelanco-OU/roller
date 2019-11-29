// @flow

type AnimateOptions = {
  duration: number,
  timing(timeFraction: number): number,
  draw(progress: number): void,
  onEnd?: () => void
}

type Styles =
  | {
      [string]: string | number
    }
  | string

/**
 * Convert object of styles or string in inline CSS. It must be a valid CSS expressions (not camelCase).
 */
function inlineCssFrom(styles: Styles): string {
  const stringStyles =
    typeof styles !== 'string' ? JSON.stringify(styles) : styles
  return stringStyles.replace(/,(?![\s\d])/g, ';').replace(/[{}"']/g, '')
}

/** Waits for a some time. */
async function wait(seconds: number | string): Promise<void> {
  const milliseconds =
    typeof seconds === 'number' ? seconds * 1000 : parseFloat(seconds) * 1000
  await new Promise(resolve => setTimeout(resolve, milliseconds))
}

/**
 * Animate elements.
 *
 * `duration` - Duration of animation in seconds.
 *
 * `timing` - Function that describe how time of execution will be calculated. `timeFraction` argument is in range from **0** to **1**.
 *
 * `draw` - Render changes. `progress` is in range from **0** to **1**.
 *
 * `onEnd` - Executes when animation is completed.
 */
function animate(options: AnimateOptions): void {
  const start = performance.now()

  requestAnimationFrame(function animateLocal(time) {
    // timeFraction changes from 0 to 1
    let timeFraction = (time - start) / (options.duration * 1000)
    if (timeFraction > 1) {
      timeFraction = 1
    }

    // calculates current animation state
    const progress = options.timing(timeFraction)

    options.draw(progress) // renders it

    if (timeFraction < 1) {
      requestAnimationFrame(animateLocal)
    }

    if (timeFraction === 1 && options.onEnd) {
      options.onEnd()
    }
  })
}

/**
 * Wait for `work` to be completed.
 * `work` is synchronous function that may or may not return result.
 */
async function waitFor(work: () => mixed): Promise<void> {
  await new Promise((resolve, reject) => {
    try {
      const result = work()
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Capitalize `str` and returns it.
 */
function capitalize(str: string): string {
  return `${str.charAt(0).toLocaleUpperCase()}${str.slice(1)}`
}

/**
 * Transform string to `camelCase` from `kebab-case`.
 */
function toCamelCase(str: string): string {
  const parts = str.split('-')
  return parts.length === 1
    ? parts[0]
    : `${parts[0]}${parts
        .slice(1)
        .map(part => capitalize(part))
        .join('')}`
}

module.exports = {
  inlineCssFrom,
  wait,
  waitFor,
  animate,
  toCamelCase,
  capitalize
}
