import test from 'ava'
import puppeteerHelper from '@ianwalter/puppeteer-helper'

const withPage = puppeteerHelper()

async function createIframe (page, name = 'test') {
  await page.evaluate(
    name => {
      const iframe = document.createElement('iframe')
      iframe.setAttribute('name', name)
      document.body.appendChild(iframe)
    },
    name
  )
  return page.frames().find(frame => frame.name() === name)
}

test('main frame topic subscriber gets called', withPage, async (t, page) => {
  // Create an iframe within the page.
  const iframe = await createIframe(page)

  // Add the topic subscriber to the main frame.
  await t.evaluate('./test/helpers/mainTopicSubscriber.js')

  // Send a test message to the main frame from the iframe.
  await t.evaluate('./test/helpers/childSendMessage.js', iframe)

  // Assert that the test message was received.
  t.deepEqual(
    await page.evaluate(() => window.received),
    { topic: 'dogs', loyal: true }
  )
})

test(`main frame message doesn't match source`, withPage, async (t, page) => {
  // Create an iframe within the page.
  await createIframe(page)

  // Add the topic subscriber to the main frame.
  await t.evaluate('./test/helpers/mainTopicSubscriber.js')

  // Post a test message from a source other than the iframe (the main frame
  // itself).
  await t.evaluate('./test/helpers/messageMismatch.js')

  // Assert that the test message was not recieved.
  t.is(await page.evaluate(() => window.received), undefined)
})

test('child frame topic subscriber gets called', withPage, async (t, page) => {
  // Create an iframe within the page.
  const iframe = await createIframe(page)

  // Add the topic subscriber to the iframe.
  await t.evaluate('./test/helpers/childTopicSubscriber.js', iframe)

  // Send a test message to the iframe from the main frame.
  await t.evaluate('./test/helpers/mainSendMessage.js')

  // Assert that the messsage was received.
  t.deepEqual(
    await iframe.evaluate(() => window.received),
    { topic: 'dogs', loyal: true }
  )
})

test(`child frame message doesn't match source`, withPage, async (t, page) => {
  // Create an iframe within the page.
  const iframe = await createIframe(page)

  // Add the topic subscriber to the iframe.
  await t.evaluate('./test/helpers/childTopicSubscriber.js', iframe)

  // Post a test message from a source other than the main frame (the iframe
  // itself).
  await t.evaluate('./test/helpers/messageMismatch.js', iframe)

  // Assert that the test message was not recieved.
  t.is(await iframe.evaluate(() => window.received), undefined)
})

test('hasParent detects when in the child frame', withPage, async (t, page) => {
  const iframe = await createIframe(page)
  t.true(await t.evaluate('./test/helpers/hasParent.js', iframe))
})
