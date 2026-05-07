// import { determineErrorName } from './exports.error.js'

export class ConnectionError extends Error {
	constructor(message) {
		super(message)
		this.name = 'Connection Error'
		this.statusCode = 500
	}
}
