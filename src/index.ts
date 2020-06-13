import {
  Vec2,
  Circle,
  Gesture,
  State,
} from './core'

import {
  distance,
  scale,
  subtract,
  multiply,
  magnitude,
  normalize,
  zero,
} from './lib'

let debug = false

const canvas = document.querySelector<HTMLCanvasElement>('canvas')
const context = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

let state: State = {
  c: {
    p: {
      x: canvas.width / 2,
      y: canvas.height / 2,
    },
    r: 50,
    v: { x: 0, y: 0 },
    a: { x: 0, y: 0 },
    f: 5,
  }
}

function equal(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function updateState(update: Partial<State>): void {
  const nextState = {
    ...state,
    ...update,
  }
  if (debug && !equal(state, nextState)) {
    console.log(nextState)
  }
  state = nextState
}

function physics(dt: number): void {

  const { c } = state
  const v1 = c.v
  const p1 = c.p
  const p2 = {
    x: p1.x + (v1.x * dt),
    y: p1.y + (v1.y * dt),
  }

  const v2 = zero({
    x: (v1.x - v1.x * c.f * dt) + (c.a.x * dt),
    y: (v1.y - v1.y * c.f * dt) + (c.a.y * dt),
  })

  const a1 = c.a
  const a2 = zero({
    x: (a1.x - a1.x * c.f * dt),
    y: (a1.y - a1.y * c.f * dt),
  })

  updateState({
    c: {
      ...state.c,
      p: p2,
      v: v2,
      a: a2,
    }
  })

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
  context.fillStyle = state.gesture1 ? 'red' : 'blue'
  context.arc(c.p.x, c.p.y, c.r, 0, 2 * Math.PI)
  context.fill()
  context.stroke()

  if (state.gesture1) {
    const { a, b } = state.gesture1

    context.beginPath()
    context.moveTo(a.x, a.y)
    context.lineTo(b.x, b.y)
    context.stroke()
  }

  if (state.gesture2) {
    const { a, b } = state.gesture2

    context.beginPath()
    context.moveTo(a.x, a.y)
    context.lineTo(b.x, b.y)
    context.stroke()
  }

  requestAnimationFrame(draw)
}

draw(0)


document.addEventListener('touchstart', (e) => {


  const { clientX, clientY } = e.targetTouches.item(0)
  const { c } = state

  const touch: Vec2 = {
    x: clientX,
    y: clientY,
  }

  if (state.timeout) {
    window.clearTimeout(state.timeout)

    const gesture2: Gesture = {
      a: touch,
      b: touch,
    }

    updateState({ gesture2 })

    return
  }

  const dist = distance(touch, c.p)

  if (dist < c.r * 1.5) {

    const gesture1: Gesture = {
      a: touch,
      b: touch,
    }

    updateState({ gesture1 })
  }
})

document.addEventListener('touchmove', (e) => {
  if (state.gesture2) {
    const touch = e.targetTouches.item(0)
    const { clientX, clientY } = touch
    const vec2: Vec2 = { x: clientX, y: clientY }
    updateState({
      gesture2: {
        ...state.gesture2,
        b: vec2,
      }
    })
    return
  }

  if (state.gesture1) {
    const touch = e.targetTouches.item(0)
    const { clientX, clientY } = touch
    const vec2: Vec2 = { x: clientX, y: clientY }
    updateState({
      gesture1: {
        ...state.gesture1,
        b: vec2,
      }
    })
  }

})

document.addEventListener('touchend', (e) => {

  if (state.gesture1) {
    const timeout = window.setTimeout(() => {
      console.log(state.gesture1)

      let v = subtract(state.gesture1.a, state.gesture1.b)
      let mag = magnitude(v)
      v = normalize(v)
      v = multiply(v, Math.sqrt(mag * 20) * 20)

      let a = { x: 0, y: 0 }
      if (state.gesture2) {
        a = subtract(state.gesture2.a, state.gesture2.b)
        let mag = magnitude(a)
        a = normalize(a)
        a = multiply(a, Math.sqrt(mag * 20) * 20)
      }

      updateState({
        gesture1: null,
        gesture2: null,
        timeout: null,
        c: {
          ...state.c,
          v,
          a,
        }
      })
    }, state.gesture2 ? 0 : 1000)
    updateState({ timeout })
  }
})
