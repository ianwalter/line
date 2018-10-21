import Line from '../'

describe('Line', () => {
  const topic = 'dogs'
  const data = { born: new Date() }

  describe('in the parent window', () => {
    const createIframe = () => {
      const iframe = document.createElement('iframe')
      document.body.appendChild(iframe)
      return iframe
    }

    it('should post a message to the given window', () => {
      const msg = { ...data, topic }
      const contentWindow = { postMessage: () => {} }
      spyOn(contentWindow, 'postMessage')
      const line = new Line(contentWindow)
      line.msg(topic, data)
      expect(contentWindow.postMessage).toHaveBeenCalledWith(msg, '*')
      line.end()
    })

    describe('when receiving messages', () => {
      it('should call subscribers of a message topic', done => {
        const iframe = createIframe()
        const line = new Line(iframe.contentWindow)
        line.sub(topic, d => {
          expect(d).toEqual({ topic, loyal: true })
          document.body.removeChild(iframe)
          line.end()
          done()
        })
        iframe.contentWindow.eval(`
          window.parent.postMessage({ topic: 'dogs', loyal: true }, '*')
        `)
      })

      it('should not call subscribers if the origin is different', done => {
        const iframe = createIframe()
        const line = new Line(iframe)
        line.sub(topic, () => done.fail('Subscriber was called'))
        window.postMessage({ topic, loyal: true }, '*')
        setTimeout(() => {
          document.body.removeChild(iframe)
          line.end()
          done()
        }, 500)
      })
    })
  })

  describe('in the iframe', () => {
    it('should post a message to its parent', done => {
      window.parent.addEventListener('message', evt => {
        expect(evt.data).toEqual({ ...data, topic })
        done()
      })
      const line = new Line()
      line.msg(topic, data)
      line.end()
    })

    describe('when receiving messages', () => {
      it('should call subscribers of a message topic', done => {
        const line = new Line()
        line.sub(topic, d => {
          expect(d).toEqual({ topic, loyal: true })
          line.end()
          done()
        })
        window.parent.eval(`
          window.frames[0].postMessage({ topic: 'dogs', loyal: true }, '*')
        `)
      })

      it('should not call subscribers if the source isnt the parent', done => {
        const line = new Line()
        line.sub(topic, () => done.fail('Subscriber was called'))
        window.postMessage({ topic })
        setTimeout(() => {
          line.end()
          done()
        }, 500)
      })
    })
  })

  describe('.hasParent()', () => {
    it('should return true when called in the iframe', () => {
      expect(Line.hasParent()).toBe(true)
    })
  })
})
