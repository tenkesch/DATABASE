export function logger(req, res, next) {
	const timestamp = new Date().toISOString()
	const { method, url } = req

	res.on('finish', () => {
		const status = res.statusCode
		const statusLabel = status >= 400 ? 'ERROR' : 'INFO'
		console.log(`[${timestamp}] [${statusLabel}] ${method} ${url} → ${status}`)
	})

	next()
}
