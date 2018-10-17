# @ianwalter/line
> Simple, safe parent-child communication between iframes using postMessage

Parent:

```js
import { Line } from '@ianwalter/line'

const line = new Line(window.someIframe, childUrl)

line.on('alert', alertMessage)

line.send('set', 'Yo!')
```

Child:

```js
import { Parent } from '@ianwalter/line'

if (Parent.exists()) {
  const parent = new Parent()

  parent.on('set', setMessage)

  parent.send('alert', message)
}
```
