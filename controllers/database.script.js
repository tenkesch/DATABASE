import mysql from 'mysql2'
import bcrypt from 'bcrypt'
import {
	ConflictError,
	BadRequestError,
	ConnectionError,
	NotFoundError,
	ValidationError,
} from '../errors/exports.error.js'

const pool = mysql
	.createPool({
		host: process.env.SQL_HOST,
		user: process.env.SQL_USER,
		password: process.env.SQL_PASSWORD,
		database: process.env.SQL_DATABASE,
	})
	.promise()

export const SQL = {
	read: async (searchParam = 0) => {
		const paramType = isValidSearchParam(searchParam)
		if (!paramType)
			throw new ValidationError(
				'recieved param does not belong neither to name, email or id',
			)

		const query = `SELECT * FROM users WHERE ${paramType}=?`

		try {
			const [rows] = await pool.query(query, [searchParam])

			if (rows.length === 0)
				return {
					ok: true,
					data: [],
					message: `No user found with such query : [${searchParam}]`,
				}

			return { ok: true, data: rows, message: 'Found user!' }
		} catch (err) {
			throw err
		}
	},

	insert: async (name, email, password) => {
		let invalidParams = []
		if (!isValidPassword(password)) invalidParams.push('password')
		if (!isValidEmail(email)) invalidParams.push('email')
		if (!isValidName(name)) invalidParams.push('name')

		if (invalidParams.length) {
			let errMessage = `Invalid user parameters for `

			invalidParams.forEach((param) => {
				console.log(`[BAD REQUEST] : Invalid ${param} format`)
				errMessage += `[${param}] `
			})

			throw new BadRequestError(errMessage, invalidParams)
		}

		try {
			const passwordHashed = await bcrypt.hash(password, 10)

			const [result] = await pool.query(
				'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
				[name, email, passwordHashed],
			)

			//wont run if pool.query() or bcrypt.hash() fail
			return {
				ok: true,
				message: `User [${name}] successfully inserted into Database with ID: [${result.insertId}]`,
				error: null,
			}
		} catch (err) {
			throw err
		}
	},

	delete: async (deleteParameter) => {
		const paramType = isValidSearchParam(deleteParameter)
		if (!paramType)
			throw new Error({
				ok: false,
				message: 'recieved param does not belong neither to name, email or id',
			})

		const query = `SELECT * FROM users WHERE ${paramType}=?`

		try {
			const [rows] = await pool.query(query, [deleteParameter])

			return {
				ok: true,
				message: `Successfully deleted [${rows.length}] rows with [${deleteParameter}] param as [${paramType}].`,
				deletedUsers: rows,
			}
		} catch (error) {
			throw new Error(`Failed to delete user with parameter [${deleteParameter}]`)
		}
	},
}

function isValidEmail(email) {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	const response = typeof email === 'string' && regex.test(email)
	return response
}

function isValidName(name) {
	// accepted: lower/upper case letters a-z, lenght 2-50
	const regex = /^[a-zA-Z\s]{2,50}$/
	const response = typeof name === 'string' && regex.test(name)
	return response
}

function isValidPassword(password) {
	// accepted: lower/upper case letters, number sand symbols, lenght 4-20
	const regex = /^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]{4,20}$/
	const response = typeof password === 'string' && regex.test(password)
	return response
}

function isValidParam(param) {
	const response =
		(typeof param === 'number' && param > 0) ||
		(typeof param === 'string' && param.length > 2)

	return response
}
function isValidSearchParam(searchParam) {
	if (typeof searchParam === 'number' && isValidParam(searchParam)) return 'id'
	if (typeof searchParam === 'string') {
		if (isValidEmail(searchParam)) return 'email'
		if (isValidName(searchParam)) return 'name'
	}

	return false
}
