import { Vec2 } from './core'

export function distance(a: Vec2, b: Vec2): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

export function scale(vec2: Vec2, m: number): Vec2 {
  return {
    x: m,
    y: m,
  }
}

export function subtract(a: Vec2, b: Vec2) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}
