
const canvas = document.querySelector<HTMLCanvasElement>('canvas')
const context = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

interface Circle {
  p: Vec2
  r: number
  v: Vec2
}

interface Vec2 {
  x: number
  y: number
}

interface Gesture {
  a: Vec2
  b: Vec2
}

interface State {
  c: Circle
  timeout?: number
  gesture?: Gesture
}

let state: State = {
  c: {
    p: {
      x: canvas.width / 2,
      y: canvas.height / 2,
    },
    r: 50,
    v: { x: 0, y: 0 },
  }
}

function physics(dt: number): void {

  const { c } = state
  const p1 = c.p
  const p2 = {
    x: p1.x + c.v.x,
    y: p1.y + c.v.y,
  }

  state = {
    ...state,
    c: {
      ...state.c,
      p: p2,
    }
  }

}

let t1 = 0
function draw(t2: number): void {

  let dt = t2 - t1
  t1 = t2
  physics(dt)

  context.fillStyle = "grey";
  context.fillRect(0, 0, canvas.width, canvas.height)

  const { c } = state

  context.beginPath()
  context.fillStyle = state.gesture ? 'red' : 'blue'
  context.arc(c.p.x, c.p.y, c.r, 0, 2 * Math.PI)
  context.fill()
  context.stroke()

  if (state.gesture) {
    const { a, b } = state.gesture

    context.beginPath()
    context.moveTo(a.x, a.y)
    context.lineTo(b.x, b.y)
    context.stroke()
  }

  requestAnimationFrame(draw)
}

draw(0)

document.addEventListener('touchstart', (e) => {

  if (state.timeout) {
    window.clearTimeout(state.timeout)
    return
  }

  const touch = e.targetTouches.item(0)

  const { c } = state
  const { clientX, clientY } = touch
  const dist = Math.sqrt(Math.pow(clientX - c.p.x, 2) + Math.pow(clientY - c.p.y, 2))

  if (dist < c.r * 1.5) {

    const vec2: Vec2 = {
      x: clientX,
      y: clientY,
    }
    const gesture: Gesture = {
      a: vec2,
      b: vec2,
    }

    state = {
      ...state,
      gesture,
    }
  }
})

document.addEventListener('touchmove', (e) => {
  if (state.gesture) {
    const touch = e.targetTouches.item(0)
    const { clientX, clientY } = touch
    const vec2: Vec2 = { x: clientX, y: clientY }
    state = {
      ...state,
      gesture: {
        ...state.gesture,
        b: vec2,
      }
    }
  }
})

document.addEventListener('touchend', (e) => {
  if (state.gesture) {
    const timeout = window.setTimeout(() => {
      console.log(state.gesture)
      state = {
        ...state,
        gesture: null,
        timeout: null,
        c: {
          ...state.c,
          v: { x: 1, y: 1 },
        }
      }
    }, 500)
    state = {
      ...state,
      timeout,
    }
  }
})
