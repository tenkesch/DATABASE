class UnexpectedError extends Error {
	constructor(message) {
		super(message)
		this.name = 'Unexpected Error'
		this.statusCode = 500
	}
}
