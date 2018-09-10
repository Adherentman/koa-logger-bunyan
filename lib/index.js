import bunyan from 'bunyan';
import uuid from 'uuid';

module.exports = function() {
	const defaultLevel = 'info';
	let start = new Date().getTime();
	const outLogger = bunyan.createLogger({
		name: 'koaApp',

		serializers: {
			req: bunyan.stdSerializers.req,
			res: bunyan.stdSerializers.res,
		},
	});

	const errorLogger = bunyan.createLogger({
		name: 'koaApp',
		serializers: {
			err: bunyan.stdSerializers.err,
		},
	});

	return async function logger(ctx, next) {
		ctx.outLogger = outLogger.child({ reqId: uuid.v4() });

		outLogger[defaultLevel]('[REQ] <-- %s %s', ctx.method, ctx.originalUrl);
		const done = () => {
			const requestTime = new Date().getTime() - start;
			outLogger[defaultLevel](
				'[RES] --> %s %s %s %s ms',
				ctx.method,
				ctx.originalUrl,
				ctx.status,
				requestTime,
			);
		};

		ctx.res.once('finish', done);
		ctx.res.once('close', done);

		try {
			await next();
		} catch (err) {
			errorLogger.error(err);
		}
	};
}
