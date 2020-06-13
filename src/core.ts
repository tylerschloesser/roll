
export interface Vec2 {
  x: number
  y: number
}

export interface Circle {
  p: Vec2 // position
  r: number // radius
  v: Vec2 // velocity
  a: Vec2 // acceleration
  f: number // friction
}


export interface Gesture {
  a: Vec2
  b: Vec2
}

export interface State {
  c: Circle
  timeout?: number
  gesture?: Gesture
}
