export { ConnectionError } from './connection.error.js'
export { ValidationError } from './validation.error.js'
export { BadRequestError } from './badrequest.error.js'
export { ConflictError } from './conflict.error.js'
export { NotFoundError } from './notfound.error.js'

export function determineErrorName(statusCode) {
	switch (statusCode) {
		case 400:
			return 'Bad Request'
		case 404:
			return 'Not Found'
		case 409:
			return 'Conflict Error'
		case 422:
			return 'Validation Error'
		case 500:
			return 'Internal Server Error'
		default:
			return 'Unexpected Server Error'
	}
}
