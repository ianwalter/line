import Line from '../..'

window.run(resolve => {
  const line = new Line()
  line.sub('dogs', data => {
    window.received = data
  })
  resolve()
})
