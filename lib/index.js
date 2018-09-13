var bunyan = require('bunyan');
var uuid = require('uuid');
var _ = require('lodash');

function time(start) {
	const delta = Date.now() - start;
	let finallyTime =
		delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's';
	return finallyTime;
}

module.exports = function(opts) {opts = opts || {};
	const defaultConfig = {
		name: 'koa-app',
		serializers: {
			req: bunyan.stdSerializers.req,
			res: bunyan.stdSerializers.res,
		},
	};
	const defaultLevel = 'info';
	let start = Date.now();
	const loggerConfig = _.assignIn(defaultConfig, opts);

	let outLogger;
	if (opts) {
		outLogger = bunyan.createLogger(loggerConfig);
	}
	outLogger = bunyan.createLogger(defaultConfig);

	const errorLogger = bunyan.createLogger({
		name: defaultConfig.name,
		serializers: {
			err: bunyan.stdSerializers.err,
		},
	});

	return async function logger(ctx, next) {
		ctx.outLogger = outLogger.child({ reqId: uuid.v4() });

		outLogger[defaultLevel](
			'[REQ] 📡 ⬅️  %s %s host: %s',
			ctx.method,
			ctx.originalUrl,
			ctx.request.header.host,
		);
		const done = () => {
			outLogger[defaultLevel](
				'[RES] 🚀 ➡️  %s %s %s %s',
				ctx.method,
				ctx.originalUrl,
				ctx.status,
				time(start),
			);
		};

		try {
			ctx.res.once('finish', done);
			ctx.res.once('close', done);
			await next();
		} catch (err) {
      if (err.status && err.status >= 400 && err.status <500) {
				errorLogger.warn(err.message);
			} else {
				errorLogger.error({ err }, '[ERR] Boom! %s', err);
			}
			throw err;
		}
	};
}