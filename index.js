import Subpub from '@ianwalter/subpub'

export default class Line extends Subpub {
  constructor (win = window.parent) {
    super()

    this.msg = (topic, data) => {
      win.postMessage(Object.assign({}, data, { topic }), '*')
    }

    this.listener = evt => {
      if (evt.source === win) {
        this.pub(evt.data.topic, evt.data)
      } else {
        console.error(`Ignored message from external source ${evt.origin}`)
      }
    }

    window.addEventListener('message', this.listener)
  }

  static hasParent () {
    return typeof window !== 'undefined' && window.parent !== window
  }

  end () {
    window.removeEventListener('message', this.listener)
  }
}
