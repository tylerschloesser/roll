
const canvas = document.querySelector<HTMLCanvasElement>('canvas')
const context = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

interface Circle {
  p: Vec2 // position
  r: number // radius
  v: Vec2 // velocity
  a: Vec2 // acceleration
  f: number // friction
}

interface Vec2 {
  x: number
  y: number
}

function scale(vec2: Vec2, m: number): Vec2 {
  return {
    x: m,
    y: m,
  }
}

function subtract(a: Vec2, b: Vec2) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
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
    a: { x: 0, y: 0 },
    f: 10,
  }
}

function physics(dt: number): void {

  const { c } = state
  const v1 = c.v
  const p1 = c.p
  const p2 = {
    x: p1.x + (v1.x * dt),
    y: p1.y + (v1.y * dt),
  }

  const v2 = {
    x: (v1.x - v1.x * c.f * dt) + (c.a.x * dt),
    y: (v1.y - v1.y * c.f * dt) + (c.a.y * dt),
  }

  state = {
    ...state,
    c: {
      ...state.c,
      p: p2,
      v: v2,
    }
  }

}

let t1 = 0
function draw(t2: number): void {

  let dt = (t2 - t1) / 1000
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

function distance(a: Vec2, b: Vec2): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

document.addEventListener('touchstart', (e) => {

  if (state.timeout) {
    window.clearTimeout(state.timeout)
    return
  }

  const { clientX, clientY } = e.targetTouches.item(0)
  const { c } = state

  const touch: Vec2 = {
    x: clientX,
    y: clientY,
  }

  const dist = distance(touch, c.p)

  if (dist < c.r * 1.5) {

    const gesture: Gesture = {
      a: touch,
      b: touch,
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
          v: scale(subtract(state.gesture.a, state.gesture.b), 1000),
        }
      }
    }, 500)
    state = {
      ...state,
      timeout,
    }
  }
})
