export class ConnectionError extends Error {
	constructor(message) {
		;(super(message), (this.name = 'ConnectionError'), (this.statusCode = 500))
	}
}
