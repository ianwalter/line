import Line from '../..'

window.run(resolve => {
  const line = new Line()
  line.msg('dogs', { loyal: true })
  line.end()
  resolve()
})
