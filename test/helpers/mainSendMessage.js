import Line from '../..'

window.run(resolve => {
  const line = new Line(window.frames[0])
  line.msg('dogs', { loyal: true })
  line.end()
  resolve()
})
