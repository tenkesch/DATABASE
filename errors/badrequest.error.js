// import { determineErrorName } from './exports.error.js'

export class BadRequestError extends Error {
	constructor(message) {
		super(message)
		this.name = 'Bad Request'
		this.statusCode = 400
	}
}
