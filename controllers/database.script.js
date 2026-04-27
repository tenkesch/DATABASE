import mysql from 'mysql2'
import bcrypt from 'bcrypt'

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
		if (parseInt(searchParam)) {
			searchParam = parseInt(searchParam)

			if (!isValidParam(searchParam))
				throw new Error(`[ VALIDATION ERROR ] : Invalid Parameter : [${searchParam}]`)
		}

		const isByID = typeof searchParam === 'number'
		const isByEmail = isValidEmail(searchParam)

		if (!isByID && !(typeof searchParam === 'string')) {
			const paramType = typeof searchParam
			throw new Error(`[ VALIDATION ERROR ] : Invalid Parameter type [${paramType}]`)
		}

		const query = isByID
			? searchParam === 0
				? 'SELECT * FROM users'
				: 'SELECT * FROM users WHERE id=?'
			: isByEmail
				? 'SELECT * FROM users WHERE email=?'
				: 'SELECT * FROM users WHERE name=?'
		const queryValues = searchParam === 0 ? [] : [searchParam]

		try {
			const [rows] = await pool.query(query, queryValues)

			if (rows.length === 0)
				return {
					ok: false,
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
			invalidParams.forEach((param) => {
				console.log(`[ VALIDATION ERROR] : Invalid ${param} format`)
			})

			return { ok: false, message: 'Bad user parameters', error: invalidParams }
		}

		try {
			const passwordHashed = await bcrypt.hash(password, 10)

			const [result] = await pool.query(
				'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
				[name, email, passwordHashed],
			)
			return {
				ok: true,
				message: `User [${name}] successfully inserted into Database with ID: [${result.insertId}]`,
				error: undefined,
			}
		} catch (err) {
			throw err
		}
	},

	delete: async (deleteParamater) => {
		console.log(typeof deleteParamater)

		if (!isValidParam(deleteParamater))
			throw new Error(`[ VALIDATION ERROR ] : Invalid Parameter : [${deleteParamater}]`)

		const query =
			typeof deleteParamater === 'string'
				? isValidEmail(deleteParamater)
					? 'DELETE FROM users WHERE email=?'
					: 'DELETE FROM users WHERE name=?'
				: 'DELETE FROM users WHERE id=?'

		try {
			await pool.query(query, deleteParamater)
			return {
				ok: true,
				message: `User with query ${deleteParamater} has been deleted successfully`,
			}
		} catch (error) {
			throw new Error(`Failed to delete user with parameter [${deleteParamater}]`)
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
	//accepted: lower/upper case letters, number sand symbols, lenght 4-20
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
