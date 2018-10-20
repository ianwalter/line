const { Line } = require('../')

describe('Line', () => {
  const url = 'https://iankwalter.com'

  it('should post a message to the iframe', () => {
    const iframe = { contentWindow: { postMessage: () => {} } }
    spyOn(iframe.contentWindow, 'postMessage')
    const line = new Line(iframe, url)
    const msg = { key: 'save', data: { name: 'Kristen' } }
    line.msg(msg.key, msg.data)
    expect(iframe.contentWindow.postMessage).toHaveBeenCalledWith(msg, url)
    line.end()
  })

  describe('when receiving messages', () => {
    const key = 'notification'
    const data = { created: new Date() }

    it('should call subscribers of a message topic', done => {
      const line = new Line({}, window.location.origin)
      line.sub(key, d => {
        expect(d).toEqual({ key, data })
        line.end()
        done()
      })
      window.postMessage({ key, data }, window.location.origin)
    })

    it('should not call subscribers if the origin is different', done => {
      const line = new Line({}, url)
      line.sub(key, () => done.fail('Subscriber was called'))
      window.postMessage({ key, data }, window.location.origin)
      setTimeout(() => {
        line.end()
        done()
      }, 500)
    })
  })
})
