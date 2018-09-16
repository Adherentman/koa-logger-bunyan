# Koa middleware for logging using bunya

##  Refer to

- [bunyan-logger](https://github.com/koajs/bunyan-logger)
- [koa-json-logger](https://github.com/rudijs/koa-json-logger)

## Ues

```javascript
var koaLogger = require('koa-logger-bunyan');

app.use(koaLogger())
```

Else You want customize

```javascript
var koaLogger = require('koa-logger-bunyan');

app.use(koaLogger({
  name: <string>,                     // Required
  level: <level name or number>,      // Optional, see "Levels" section
  stream: <node.js stream>,           // Optional, see "Streams" section
  streams: [<bunyan streams>, ...],   // Optional, see "Streams" section
  serializers: <serializers mapping>, // Optional, see "Serializers" section
  src: <boolean>,                     // Optional, see "src" section

  // Any other fields are added to all log records as is.
  foo: 'bar',
  ...
}))
```

For specific use, please refer to https://github.com/trentm/node-bunyan.

## Result
![](https://blogaaaaxzh.oss-cn-hangzhou.aliyuncs.com/logger-bunyan.png)

## Todo
- [x] customize
- [ ] test