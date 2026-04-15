import mysql from 'mysql2'
import bcrypt from 'bcrypt'

const HASH_SALTROUNDS = process.env.BCRYPT_SALTROUNDS

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
		if (!isValidParam(searchParam) && !(searchParam === 0))
			throw new Error(`[ DATABASE ERROR ] : Invalid Parameter : [${searchParam}]`)

		const isByID = typeof searchParam === 'number'

		if (!isByID && typeof searchParam != 'string') {
			const paramType = typeof searchParam
			throw new Error(`[ DATABASE ERROR] : Invalid Parameter type [${paramType}]`)
		}

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
			throw new Error(`No user found with such query : [${searchParam}]`)

		return rows
	},

	insert: async (name, email, password) => {
		;(() => {
			let invalidParams = []
			if (!isValidPassword(password)) invalidParams.push('password')
			if (!isValidEmail(email)) invalidParams.push('email')
			if (!isValidName(name)) invalidParams.push('name')

			invalidParams.forEach((param) => {
				console.log(`[DATABASE ERROR] : Invalid ${param} format`)
			})

			if (invalidParams.length)
				return JSON.stringify({ success: false, error: invalidParams })
		})()

		const passwordHashed = await bcrypt.hash(password, 10)

		try {
			const [result] = await pool.query(
				'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
				[name, email, passwordHashed],
			)
			return JSON.stringify({
				success: true,
				message: `User [${name}] successfully inserted into Database with ID: [${result.insertId}]`,
			})
		} catch (error) {
			console.log('[DATABASE ERROR]: Failed to insert user in database : ', error.message)
			return JSON.stringify({ success: false })
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
			return JSON.stringify({
				success: true,
				message: `User with query ${deleteParamater} has been deleted successfully`,
			})
		} catch (error) {
			return JSON.stringify({
				success: false,
				message: `Failed to delete user with parameter [${deleteParamater}]`,
			})
			// throw new Error(`Failed to delete user with parameter [${deleteParamater}]`)
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
