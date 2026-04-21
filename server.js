import 'dotenv/config'
import path from 'path'
import express from 'express'
import asyncHandler from 'express-async-handler'
import { SQL } from './controllers/database.script.js'
import { logger } from './middlewares/logger.js'
import { errorHandler } from './middlewares/errorhandler.js'

const Status = {
	OK: 200,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
	BAD_REQUEST: 400,
}

const app = express()
const PORT = process.env.PORT || 3000
if (PORT === 3000)
	console.log('[WARNING] : PORT not found in .env file, using default value instead')

//middlewares
app.use(express.static(path.join(import.meta.dirname, 'src')))
app.use(express.json())
app.use(logger)

app.post(
	'/user',
	asyncHandler(async (req, res, next) => {
		const { name, email, password } = req.body
		const { ok, message, error } = await SQL.insert(name, email, password)

		res.json({ ok, message })
	}),
)

app.get(
	'/user',
	asyncHandler(async (req, res, next) => {
		const requestedID = parseInt(req.query.id)

		//0 is considered as 'get all users'
		if ((!requestedID && requestedID != 0) || requestedID < 0)
			return res.status(Status.BAD_REQUEST).json({
				ok: false,
				message: 'Invalid request ID',
			})

		const { ok, data, message } = await SQL.read(requestedID)

		//Wont run if SQL.read() gives invalid response:
		res.status(Status.OK).json({ ok, data, message })
	}),
)

app.delete(
	'/user',
	asyncHandler(async (req, res) => {
		const parameter = req.query.param

		const response = await SQL.delete(parameter)

		//wont run if SQL.delete() fails:
		res.status(Status.OK).json({ message: 'Resource deleted successfully' })
	}),
)

app.get('/', (_req, res) => {
	res.sendFile(path.join(import.meta.dirname, 'index.html'))
})

app.get('/style.css', (_req, res) => {
	res.sendFile(path.join(import.meta.dirname, 'style.css'))
})

app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`)
})
