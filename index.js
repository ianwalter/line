import Subpub from '@ianwalter/subpub'

export class Line extends Subpub {
  constructor (iframe, url) {
    super()
    this.iframe = iframe
    this.url = url

    this.listener = evt => {
      if (evt.origin === this.url) {
        this.pub(evt.data.key, evt.data)
      } else {
        console.error(`Message from ${evt.origin} doesn't match ${this.url}`)
      }
    }

    window.addEventListener('message', this.listener)
  }

  msg (key, data) {
    this.iframe.contentWindow.postMessage({ key, data }, this.url)
  }

  end () {
    window.removeEventListener('message', this.listener)
  }
}

export class Parent extends Subpub {
  constructor (url = '*') {
    super()
    this.url = url
    this.listener = evt => this.pub(evt.data.key, evt.data)
    window.addEventListener('message', this.listener)
  }

  static exists () {
    return typeof window.parent !== 'undefined' && window.parent !== window
  }

  msg (key, data) {
    window.parent.postMessage({ key, data }, this.url)
  }

  end () {
    window.removeEventListener('message', this.listener)
  }
}
