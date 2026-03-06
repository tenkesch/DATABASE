import mysql from 'mysql2'

const pool = mysql
	.createPool({
		host: process.env.SQL_HOST,
		user: process.env.SQL_USER,
		password: process.env.SQL_PASSWORD,
		database: process.env.SQL_DATABASE,
	})
	.promise()

export const readFromDatabase = async (id = 0) => {
	try {
		if (!id) {
			const [result] = await pool.query('SELECT * FROM users')
			result = await JSON.stringify(result)
			return result
		}

		const [result] = await pool.query('SELECT * FROM users WHERE id=?', [id])
		return result
	} catch (err) {
		throw new Error('Failed to GET user with ID: ' + id, err)
	}
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
		await pool.query('DELETE FROM users WHERE first_name = ?', [deleteParamater])
		console.log(`Successfuly deleted user with first_name : ${deleteParamater}`)
	} else {
		//if its number, delete by ID
		await pool.query('DELETE FROM users WHERE id = ?', [deleteParamater])
		console.log(`Successfuly deleted user with ID : ${deleteParamater}`)
	}
}
