import mysql from 'mysql2'

const MIN_EMAIL_LENGHT = 11
const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 12
const MIN_PASSWORD_LENGHT = 4
const MAX_PASSWORD_LENGHT = 20

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
		if (!isValidParam(searchParam) && searchParam != 0)
			throw new Error(`[ DATABASE ERROR ] : Invalid Parameter : [${searchParam}]`)

		const isByID = typeof searchParam === 'number'
		const isByEmail = isValidEmail()

		const query = isByID
			? searchParam === 0
				? 'SELECT * FROM users'
				: 'SELECT * FROM users WHERE id=?'
			: isByEmail
				? 'SELECT * FROM users WHERE email=?'
				: 'SELECT * FROM users WHERE name=?'

		const [rows] = await pool.query(query, searchParam)
		if (rows.length === 0)
			throw new Error(`There is no user with such ID [${searchParam}]`)

		return rows
	},

	insert: async (name, email, password) => {
		let invalidParams = []
		if (!isValidPassword(password)) invalidParams.push('password')
		if (!isValidEmail(email)) invalidParams.push('email')
		if (!isValidName(name)) invalidParams.push('name')

		invalidParams.forEach((param) => {
			console.warn(`[DATABASE ERROR] : Invalid ${param} format`)
		})
		if (invalidParams) return 'error'

		try {
			const [result] = await pool.query(
				'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
				[name, email, password],
			)
			console.log(
				`User [${name}] successfully inserted into Database with ID: [${result.insertId}]`,
			)
			return 1
		} catch (error) {
			console.error(
				'[DATABASE ERROR]: Failed to insert user in database : ',
				error.message,
			)
			return 0
		}
	},

	delete: async (deleteParamater) => {
		if (!isValidParam(deleteParamater))
			throw new Error(`[ DATABASE ERROR ] : Invalid Parameter : [${deleteParamater}]`)

		const query =
			typeof deleteParamater === 'string'
				? isValidEmail(deleteParamater)
					? 'DELETE FROM users WHERE email=?'
					: 'DELETE FROM users WHERE name=?'
				: 'DELETE FROM users WHERE id=?'

		try {
			await pool.query(query, deleteParamater)
		} catch (error) {
			throw new Error(`Failed to delete user with parameter [${deleteParamater}]`)
		}
	},
}

function isValidEmail(email) {
	const response =
		typeof email === 'string' &&
		email.includes('@gmail.com') &&
		email.length > MIN_EMAIL_LENGHT
	return response
}

function isValidName(name) {
	const response =
		typeof name === 'string' &&
		name.length >= MIN_USERNAME_LENGTH &&
		name.length <= MAX_USERNAME_LENGTH

	return response
}

function isValidPassword(password) {
	response =
		typeof password === 'string' &&
		password.length >= MIN_PASSWORD_LENGHT &&
		password.length <= MAX_PASSWORD_LENGHT
	return response
}

function isValidParam(param) {
	if (
		(typeof param === 'number' && param > 0) ||
		(typeof param === 'string' && param.length >= MIN_USERNAME_LENGTH)
	)
		return true

	return false
}
