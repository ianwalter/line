window.run(resolve => {
  window.postMessage({ topic: 'dogs', loyal: true }, '*')
  resolve()
})
