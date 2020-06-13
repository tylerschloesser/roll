
const canvas = document.querySelector<HTMLCanvasElement>('canvas')
const context = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const cx = canvas.width / 2
const cy = canvas.height / 2
const cr = 50

interface State {
  touch: boolean
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
  state = {
    ...state,
    touch: true,
  }
})

document.addEventListener('touchend', (e) => {
  state = {
    ...state,
    touch: false,
  }
})
