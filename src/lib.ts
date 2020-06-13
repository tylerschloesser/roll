import { Vec2 } from './core'

export function distance(a: Vec2, b: Vec2): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

export function multiply(vec2: Vec2, m: number) {
  return {
    x: vec2.x * m,
    y: vec2.y * m,
  }
}

export function normalize(vec2: Vec2): Vec2 {
  const dist = distance({ x: 0, y: 0 }, vec2)
  return multiply(vec2, 1 / dist)
}

export function scale(vec2: Vec2, m: number): Vec2 {
  return multiply(normalize(vec2), m)
}

export function subtract(a: Vec2, b: Vec2) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}
