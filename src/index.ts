
const canvas = document.querySelector<HTMLCanvasElement>('canvas')
const context = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

context.fillStyle = "grey";
context.fillRect(0, 0, canvas.width, canvas.height)

console.log(context)
