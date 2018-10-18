export class Line {
  constructor (iframe, url) {
    iframe.contentWindow.addEventListener('message', evt => {

    })
  }
}

export class Parent {
  constructor () {
    parent.addEventListener('message', evt => {

    })
  }

  static exists () {
    return typeof parent !== undefined && parent !== window
  }
}
