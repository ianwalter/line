# @ianwalter/line
> Simple, safe parent-child communication with iframes using postMessage

## Installation

```console
npm install @ianwalter/line --save
```

## Usage

Parent:

```js
import Line from '@ianwalter/line'

// Create a line instance which establishes a communication line between the
// current window and an iframe within the current window, someIframe.
const line = new Line(someIframe)

// Subscribe to the alert topic and handle incoming messages with handleAlert.
line.sub('alert', handleAlert)

// Send a message to the action topic with some data.
line.msg('action', { date: new Date() })
```

Child:

```js
import Line from '@ianwalter/line'

if (Line.hasParent()) {
  // Create a line instance which establishes a communication line between the
  // current window and, by default, window.parent.
  const line = new Line()

  // Subscribe to the action topic and handle income messages with
  // executeAction.
  line.sub('action', executeAction)

  // Send a message to the alert topic with some data.
  line.msg('alert', { date: new Date() })
}
```

## License

Apache 2.0 with Commons Clause - See [LICENSE](https://github.com/ianwalter/line/blob/master/LICENSE)

&nbsp;

Created by [Ian Walter](https://iankwalter.com)
