import test from 'ava'
import puppeteerHelper from '@ianwalter/puppeteer-helper'

const withPage = puppeteerHelper(['./dist/line.iife.js'], { dumpio: true })

async function createIframe (page) {
  return page.evaluateHandle(() => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    return iframe
  })
}

test('posting a message to a given window', withPage, async (t, page) => {
  const result = await page.evaluate(() => {
    const { Line } = window

    // Mock the window.
    const contentWindow = {
      postMessage (message, to) {
        this.result = { to, message }
      }
    }

    // Send the test message.
    const line = new Line(contentWindow)
    line.msg('dogs', { breed: 'Lhasa Apso' })
    line.end()

    // Return what was sent.
    return contentWindow.result
  })

  t.is(result.message.topic, 'dogs')
  t.is(result.message.breed, 'Lhasa Apso')
  t.is(result.to, '*')
})

test('subscribers of a message topic get called', withPage, async (t, page) => {
  // Create an iframe within the page.
  const iframe = await createIframe(page)

  const result = await page.evaluate(iframe => {
    const { Line } = window

    return new Promise(resolve => {
      //
      const line = new Line(iframe.contentWindow)
      line.sub('dogs', resolve)

      //
      iframe.contentWindow.eval(`
        window.parent.postMessage({ topic: 'dogs', loyal: true }, '*')
      `)
    })
  }, iframe)

  //
  t.deepEqual(result, { topic: 'dogs', loyal: true })
})

test(
  `subscribers don't get called if the message origin is different`,
  withPage,
  async (t, page) => {
    // Create an iframe within the page.
    const iframe = await createIframe(page)

    //
    await page.evaluate(iframe => {
      const { Line } = window

      return new Promise((resolve, reject) => {
        //
        const line = new Line(iframe.contentWindow)

        //
        line.sub('dogs', reject)

        //
        window.postMessage({ topic: 'dogs', loyal: true }, '*')
        setTimeout(resolve, 500)
      })
    }, iframe)

    //
    t.pass()
  }
)

test('posting a message to the parent window', withPage, async (t, page) => {
  // Create an iframe within the page.
  const iframe = await createIframe(page)

  await page.evaluate(iframe => {
    // const { Line } = window

    console.info('WEINDOWZ')
  }, iframe)

  t.pass()
})

// describe('Line', () => {


//   describe('in the iframe', () => {
//     it('should post a message to its parent', done => {
//       window.parent.addEventListener('message', evt => {
//         expect(evt.data).toEqual({ ...data, topic })
//         done()
//       })
//       const line = new Line()
//       line.msg(topic, data)
//       line.end()
//     })

//     describe('when receiving messages', () => {
//       it('should call subscribers of a message topic', done => {
//         const line = new Line()
//         line.sub(topic, d => {
//           expect(d).toEqual({ topic, loyal: true })
//           line.end()
//           done()
//         })
//         window.parent.eval(`
//           window.frames[0].postMessage({ topic: 'dogs', loyal: true }, '*')
//         `)
//       })

//       it('should not call subscribers if the source isnt the parent', done => {
//         const line = new Line()
//         line.sub(topic, () => done.fail('Subscriber was called'))
//         window.postMessage({ topic })
//         setTimeout(() => {
//           line.end()
//           done()
//         }, 500)
//       })
//     })
//   })

//   describe('.hasParent()', () => {
//     it('should return true when called in the iframe', () => {
//       expect(Line.hasParent()).toBe(true)
//     })
//   })
// })
