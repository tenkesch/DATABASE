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
		if (!(typeof searchParam === 'number' || typeof searchParam === 'string'))
			throw new Error('[DATABASE ERROR] : Invalid type of search parameter')

		const isByID = typeof searchParam === 'number'

		const query = isByID
			? searchParam === 0
				? 'SELECT * FROM users'
				: 'SELECT * FROM users WHERE id=?'
			: 'SELECT * FROM users WHERE email=?'

		const [rows] = await pool.query(query, searchParam)
		if (rows.length === 0) throw new Error(`User with ID [${searchParam}] not found`)

		return rows[0]
	},

	insert: async (name, email, password) => {
		let invalid = []
		if (!isValidPassword(password)) invalid.push('password')
		if (!isValidName(name)) invalid.push('name')
		if (!isValidEmail(email)) invalid.push('email')

		invalid.forEach((error) => {
			throw new Error(`[DATABASE ERROR] : Invalid ${error} format`)
		})

		try {
			const [result] = await pool.query(
				'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
				[name, email, password],
			)
			console.log(
				`User [${name}] successfully inserted into Database with ID: [${result.insertId}]`,
			)
			return
		} catch (error) {
			console.error('[DATABASE ERROR]: Failed to insert user in database : ', error.message)
			return
		}
	},

	delete: async (deleteParamater) => {
		if (typeof deleteParamater === 'string') {
			await pool.query('DELETE FROM users WHERE name = ?', [deleteParamater])
			console.log(`Successfuly deleted user with name : ${deleteParamater}`)
		} else if (typeof deleteParamater === 'number') {
			if (deleteParamater <= 0) throw new Error(`Impossible user ID : [${deleteParamater}]`)

			await pool.query('DELETE FROM users WHERE id = ?', [deleteParamater])
			console.log(`Successfuly deleted user with ID : ${deleteParamater}`)
		} else throw new Error('[DATABASE ERROR]: Paramater must be either string or number!')
	},

	readByEmail: async (email) => {
		const [userData] = await pool.query('SELECT * FROM users WHERE email=?', email)
		if (userData.length === 0) return 0

		return userData
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
