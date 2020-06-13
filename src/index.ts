
const canvas = document.querySelector<HTMLCanvasElement>('canvas')
const context = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const cx = canvas.width / 2
const cy = canvas.height / 2
const cr = 50

interface State {
  touch: boolean
  timeout?: number
}

let state: State = {
  touch: false
}

function draw(): void {
  context.fillStyle = "grey";
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.beginPath()
  context.fillStyle = state.touch ? 'red' : 'blue'
  context.arc(cx, cy, cr, 0, 2 * Math.PI)
  context.fill()
  context.stroke()

  requestAnimationFrame(draw)
}

draw()

document.addEventListener('touchstart', (e) => {
  const touch = e.targetTouches.item(0)

  const { clientX, clientY } = touch
  const dist = Math.sqrt(Math.pow(clientX - cx, 2) + Math.pow(clientY - cy, 2))

  if (dist < cr * 1.5) {
    state = {
      ...state,
      touch: true,
    }
  }
})

document.addEventListener('touchend', (e) => {
  if (state.touch) {
    const timeout = window.setTimeout(() => {
      state = {
        ...state,
        touch: false,
      }
    }, 500)
    state = {
      ...state,
      timeout,
    }
  }
})
