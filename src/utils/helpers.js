/**
 * Convert object of styles or string in inline CSS. It must be a valid CSS expressions (not camelCase).
 * @param {{ [key: String]: String | Number | Boolean } | String} styles
 */
function stylify(styles) {
  const stringStyles = typeof styles !== 'string'
    ? JSON.stringify(styles) : styles
  return stringStyles.replace(/,(?![\s\d])/g, ';').replace(/[{}"']/g, '')
}

/**
 * Waits for a some time.
 * @param {Number | String} seconds Time to wait.
 */
async function wait(seconds) {
  const milliseconds = typeof seconds === 'number'
    ? seconds * 1000 : parseFloat(seconds) * 1000
  await new Promise(resolve => setTimeout(resolve, milliseconds))
}

/**
 * Animate elements.
 * @param {Object} options
 * @param {Number} options.duration Duration of animation in seconds.
 * @param {(timeFraction: Number) => Number} options.timing Function that describe how time of execution will be calculated. `timeFraction` is in range from **0** to **1**.
 * @param {(progress: Number) => void} options.draw Render changes. `progress` is in range from **0** to **1**.
 * @param {() => void} [options.onEnd] Executes when animation is completed.
 */
function animate({ timing, draw, duration, onEnd }) {
  const start = performance.now()

  requestAnimationFrame(function animateLocal(time) {
    // timeFraction changes from 0 to 1
    let timeFraction = (time - start) / (duration * 1000)
    if (timeFraction > 1) {
      timeFraction = 1
    }

    // calculates current animation state
    const progress = timing(timeFraction)

    draw(progress) // renders it

    if (timeFraction < 1) {
      requestAnimationFrame(animateLocal)
    }

    if (timeFraction === 1 && onEnd) {
      onEnd()
    }
  })
}

/**
 * Wait for `work` to be completed.
 * @param {() => Object} work Synchronous function that may or may not return result.
 */
async function waitFor(work) {
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
 * @param {String} str
 */
function capitalize(str) {
  return `${str.charAt(0).toLocaleUpperCase()}${str.slice(1)}`
}

/**
 * Transform string to `camelCase` from `kebab-case`.
 * @param {String} str
 */
function toCamelCase(str) {
  const parts = str.split('-')
  return parts.length === 1
    ? parts[0]
    : `${parts[0]}${parts.slice(1).map((part) => capitalize(part))}`
}

module.exports = {
  stylify,
  wait,
  waitFor,
  animate,
  toCamelCase,
  capitalize
}
