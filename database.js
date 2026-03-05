import mysql from 'mysql2'
// import 'dotenv/config'

const pool = mysql
	.createPool({
		host: process.env.SQL_HOST,
		user: process.env.SQL_USER,
		password: process.env.SQL_PASSWORD,
		database: process.env.SQL_DATABASE,
	})
	.promise()

export const readDatabase = async (id = 0) => {
	if (!id) {
		const [result] = await pool.query('SELECT * FROM users')
		return result
	}

	const [result] = await pool.query('SELECT * FROM users WHERE id=?', [id])
	return result
}

export const importUser = async (first_name, last_name, email = '/') => {
	try {
		const [result] = await pool.query(
			'INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)',
			[first_name.toString(), last_name.toString(), email.toString()],
		)
		console.log(`User successfully imported into Database with id: ${result.insertId}`)
		return result.insertId
	} catch (error) {
		console.error('Database error: ', error.message)
		return null
	}
}

export const deleteUser = async (deleteParamater = 0) => {
	if (!deleteParamater) throw new Error('There is no delete paramater or its Invalid!')

	if (deleteParamater.isNan()) {
		//if its not a number, it's name
		await pool.query('delete from users where first_name = ?', [deleteParamater])
		console.log(`Successfuly deleted user with first_name : ${deleteParamater}`)
	} else {
		//if its number, delete by ID
		await pool.query('delete from users where id = ?', [deleteParamater])
		console.log(`Successfuly deleted user with ID : ${deleteParamater}`)
	}
}
