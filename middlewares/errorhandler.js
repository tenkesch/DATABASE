export function errHandler(err, req, res, next) {
	if (res.headersSent) return next(err)

	const statusCode = err?.statusCode || err?.status || 500
	return res.status(statusCode).json({
		ok: false,
		message: err?.message || 'Internal server error',
	})
}

export const commonErrors = {
	// class resourceNotFound = {}
}
