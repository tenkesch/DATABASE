// import { determineErrorName } from './exports.error.js'

export class ConflictError extends Error {
	constructor(message) {
		super(message)
		this.name = 'Conflict Error'
		this.statusCode = 409
	}
}
