import 'dotenv/config'
import path from 'path'
import express from 'express'
import { SQL } from './controllers/database.script.js'
import { logger } from './middlewares/logger.js'
import { errHandler } from './middlewares/errorhandler.js'

const app = express()
const PORT = process.env.PORT || 3000
if (PORT === 3000)
	console.log('[WARNING] : PORT not found in .env file, using default value instead')

//middlewares
app.use(express.static(path.join(import.meta.dirname, 'src')))
app.use(express.json())
app.use(logger)

app.post('/user', async (req, res, next) => {
	try {
		const { name, email, password } = req.body
		const DatabaseResponse = await SQL.insert(name, email, password)

		res.json({ ok: true, message: DatabaseResponse })
	} catch (err) {
		next(err)
	}
})

app.get('/user', async (req, res, next) => {
	const requestedID = parseInt(req.query.id)

	//0 is considered as 'get all users'
	if ((!requestedID && requestedID != 0) || requestedID < 0)
		return res.status(400).json({
			ok: false,
			message: 'Invalid request ID',
		})

	try {
		const userData = await SQL.read(requestedID)

		//Wont run if SQL.read() gives invalid response:
		res.json({
			ok: true,
			data: userData,
		})
	} catch (err) {
		next(err)
	}
})

app.delete('/user', async (req, res) => {
	const parameter = req.query.param
	try {
		await SQL.delete(parameter)
		res.status(200).json({ message: 'Resource deleted successfully' })
	} catch (err) {
		res.status(409).json({ message: err.message, error: true })
	}
})

app.get('/', (_req, res) => {
	res.sendFile(path.join(import.meta.dirname, 'index.html'))
})

app.get('/style.css', (_req, res) => {
	res.sendFile(path.join(import.meta.dirname, 'style.css'))
})

app.use(errHandler)

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`)
})
