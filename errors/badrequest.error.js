// import { determineErrorName } from './exports.error.js'

export class BadRequestError extends Error {
	constructor(message, invalidParams) {
		super(message)
		this.name = 'Bad Request'
		this.statusCode = 400
		this.invalidParams = invalidParams
	}
}
