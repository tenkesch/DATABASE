import 'dotenv/config'
import path from 'path'
import express from 'express'
import { SQL } from './controllers/database.script.js'
import { logger } from './middlewares/logger.js'

const app = express()
const PORT = process.env.PORT || 3000
if (PORT === 3000)
	console.log('[WARNING] : PORT not found in .env file, using default value instead')

//middlewares
app.use(express.static(path.join(import.meta.dirname, 'src')))
app.use(express.json())
app.use(logger)

app.post('/user', async (req, res) => {
	console.log(req.body)

	const { name, email, password } = req.body
	const DatabaseResponse = await SQL.insert(name, email, password)
	res.send(DatabaseResponse)
})

app.get('/user', async (req, res) => {
	const requestedID = parseInt(req.query.id)

	//0 is considered as 'get all users'
	if ((!requestedID && requestedID != 0) || requestedID < 0)
		res.json({
			ok: false,
			message: 'Invalid request ID',
		})

	try {
		const userData = await SQL.read(requestedID)

		//Wont run if SQL.read() gives invalid response:
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
