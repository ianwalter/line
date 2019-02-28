import Line from '../..'

window.run(resolve => {
  const line = new Line(window.frames[0])
  line.sub('dogs', data => {
    window.received = data
  })
  resolve()
})
