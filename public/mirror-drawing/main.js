const INIT = "INIT",
      LEFT_READY = "LEFT_READY",
      LEFT_DRAWING = "LEFT_DRAWING",
      RIGHT_READY = "RIGHT_READY",
      RIGHT_DRAWING = "RIGHT_DRAWING",
      DRAWED = "DRAWED",
      CHECKING = "CHECKING"

const state = {
  width: 0,
  height: 0,
  status: INIT,
  dragging: false,
  left: [],
  right: [],
  lastDrag: null
}

function resize() {
  state.width = app.offsetWidth
  state.height = app.offsetHeight - header.offsetHeight - footer.offsetHeight
  canvas.width = state.width
  canvas.height = state.height
}

function touchstart () {
  drawStart()
}

function mousedown () {
  drawStart()
}

function mousemove (event) {
  if (!state.dragging) return
  const { offsetX, offsetY } = event
  drag({ x: offsetX, y: offsetY })
}

function touchmove (event) {
  event.preventDefault()
  const { clientX, clientY, target } = event.changedTouches[0]
  drag({
    x: clientX - target.offsetLeft,
    y: clientY - target.offsetTop
  })
}

function drawStart () {
  state.dragging = true
  switch(state.status) {
    case LEFT_READY:
      state.status = LEFT_DRAWING
      break
    case RIGHT_READY:
      state.status = RIGHT_DRAWING
      break
    default:
  }
}

function drag ({ x, y }) {
  const { status, width, height, left, right } = state
  switch(status) {
    case LEFT_DRAWING:
      left.push([
        x - width / 4,
        y - height / 2
      ])
      break
    case RIGHT_DRAWING:
      right.push([
        x - width * 3 / 4,
        y - height / 2
      ])
      break
    default:
  }
}

function dragEnd () {
  state.dragging = false

  switch(state.status) {
    case LEFT_DRAWING:
      state.status = RIGHT_READY
      break
    case RIGHT_DRAWING:
      state.status = DRAWED
      break
    default:
  }
}

function mouseup() {
  dragEnd()
}

function touchend() {
  dragEnd()
}

function mouseout() {
  dragEnd()
}

function touchout () {
  dragEnd()
}

function init () {
  setMessage("εζεδΈ­")
  resize()

  canvas.addEventListener("touchstart", touchstart)
  canvas.addEventListener("mousedown", mousedown)
  canvas.addEventListener("mousemove", mousemove)
  canvas.addEventListener("touchmove", touchmove)
  canvas.addEventListener("mouseup", mouseup)
  canvas.addEventListener("touchend", touchend)
  canvas.addEventListener("mouseout", mouseout)
  canvas.addEventListener("touchout", touchout)

  window.addEventListener("resize", resize)

  reset.addEventListener("click", () => {
    state.status = LEFT_READY
    state.dragging = false
    state.left = []
    state.right = []
    state.lastDrag = null
  })
  showResult.addEventListener("click", () => state.status = CHECKING)
  hideResult.addEventListener("click", () => state.status = DRAWED)

  state.status = LEFT_READY
  requestAnimationFrame(loop)
}

function setMessage(message) {
  order.innerText = message
}

function loop() {
  updateOrder()
  updateButtons()

  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, state.width, state.height)
  drawRight(ctx, state)
  drawLeft(ctx, state)
  drawGuid(ctx, state)
  requestAnimationFrame(loop)
}

function drawLeft(ctx) {
  const { width, height } = state

  ctx.lineWidth = 4
  ctx.strokeStyle = "#000000"
  ctx.beginPath()

  state.left
    .forEach(([ x, y ], index) => {
      x = width / 4 + x
      y = height / 2 + y

      if(index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
  })

  ctx.stroke()
}

function drawRight(ctx) {
  const { width, height, status } = state

  ctx.lineWidth = 4
  ctx.strokeStyle = "#000000"
  ctx.beginPath()

  state.right
    .forEach(([ x, y ], index) => {
      x = width * 3 / 4 + x
      y = height / 2 + y

      if(index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
  })

  ctx.stroke()

  if (status !== CHECKING) return

  ctx.strokeStyle = "#FF0000"
  ctx.lineWidth = 4
  ctx.beginPath()
  state.left
    .forEach(([ x, y ], index) => {
      x = width * 3 / 4 - x
      y = height / 2 + y

      if(index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
  })
  ctx.stroke()
}

function drawGuid(ctx) {
  const {
    width, height, status
  } = state

  ctx.lineWidth = 2
  ctx.strokeStyle = "#000000"
  ctx.beginPath()
  ctx.moveTo(width / 2, 0)
  ctx.lineTo(width / 2, height)
  ctx.stroke()


  ctx.beginPath()
  ctx.fillStyle = "rgba(0,0,0,0.5)"
  switch(status) {
    case LEFT_READY:
    case LEFT_DRAWING:
      ctx.rect(width / 2, 0, width / 2, height)
      ctx.fill()
    break
    case RIGHT_READY:
    case RIGHT_DRAWING:
      ctx.rect(0, 0, width / 2, height)
      ctx.fill()
    break
    default:
  }

}

function updateOrder () {
  order.innerText = statusToOrder(state.status)
}

function show (element) {
  if(element.hasAttribute("hidden")) element.removeAttribute("hidden")
}

function hide (element) {
  if(!element.hasAttribute("hidden")) element.setAttribute("hidden", "")
}

function updateButtons () {
  const { status } = state
  switch (status) {
    case DRAWED:
      show(showResult)
      hide(hideResult)
      break
    case CHECKING:
      show(hideResult)
      hide(showResult)
      break
    default:
      hide(hideResult)
      hide(showResult)
  }
}

function statusToOrder (status) {
  switch(status) {
    case INIT:
      return "εζεδΈ­"
    case LEFT_READY:
      return "ε·¦ε΄γ«η·γεΌγγ¦γγ γγ"
    case LEFT_DRAWING:
      return "ε·¦ε΄γ«η·γεΌγγ¦γγΎγ"
    case RIGHT_READY:
      return "ε³ε΄γ«η·γεΌγγ¦γγ γγ"
    case RIGHT_DRAWING:
      return "ε³ε΄γ«η·γεΌγγ¦γγΎγ"
    case DRAWED:
      return "η΅ζγη’Ίθͺγγ¦γγ γγ"
    case CHECKING:
      return "η΅ζγθ‘¨η€Ίγγ¦γγΎγ"
    default:
      return "ει‘γηΊηγγΎγγγθͺ­γΏθΎΌγΏη΄γγ¦γγ γγγ"
  }
}

window.addEventListener("load", init)
