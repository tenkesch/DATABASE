export function tryCatch(controller) {
	return async (req, res, next) => {
		try {
			controller(req, res)
		} catch (err) {
			next(err)
		}
	}
}
