export class BadRequestError extends Error {
	constructor(message, invalidParams) {
		;(super(message),
			(this.name = 'BadRequest'),
			(this.invalidParams = invalidParams),
			(this.statusCode = 400))
	}
}

class HttpError {
	constructor(statusCode) {
		this.code = statusCode

		switch (statusCode) {
			case 404:
				this.name = 'Not Found'
				// ...
				break
			case 500:
				this.name = 'Internaal Server Error'
				// ...
				break

			default:
				this.name = 'Something went wrong'
		}
	}
}
