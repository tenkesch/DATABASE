const tryCatch = async (controller) => {
	try {
		controller(req, res)
	} catch (err) {
		next(err)
	}
}
