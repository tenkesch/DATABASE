// import { determineErrorName } from './exports.error.js'

export class NotFoundError extends Error {
	constructor(message) {
		super(message)
		this.name = 'Not Found'
		this.statusCode = 404
	}
}
