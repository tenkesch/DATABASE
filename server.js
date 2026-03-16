import 'dotenv/config'
import path from 'path'
import express from 'express'
import { SQL } from './controllers/database.script.js'
const app = express()
const PORT = process.env.PORT || 3000
if (PORT === 3000)
	console.warn('[WARNING] : PORT not found in .env file, using default value instead')

app.use(express.static(path.join(import.meta.dirname, 'src')))

app.get('/createUser', async (req, res) => {
	const user = {
		name: req.query.name,
		email: req.query.email,
		password: req.query.password,
	}

	res.send(user)
})

app.get('/user', async (req, res) => {
	try {
		const id = parseInt(req.query.id)

		id
			? console.log(`Client requested user with id: [${id}]`)
			: console.log('Client requested all users from DB')

		const userData = id ? await SQL.read(id) : await SQL.read()
		res.json({ success: true, data: userData })
	} catch (err) {
		res.status(404).json({
			success: false,
			message: err.message,
		})
	}
})

app.get('/', (_req, res) => {
	res.sendFile(path.join(import.meta.dirname, 'index.html'))
})

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`)
})
