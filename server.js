import 'dotenv/config'
import path from 'path'
import express from 'express'
import asyncHandler from 'express-async-handler'
import { SQL } from './controllers/database.script.js'
import { logger } from './middlewares/logger.js'
import { errorHandler } from './middlewares/errorhandler.js'
import { authenticateUser } from './controllers/authentication.script.js'
import { BadRequestError } from './errors/exports.error.js'

const Status = {
	OK: 200,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
}

const app = express()
const PORT = process.env.PORT || 3000
if (PORT === 3000)
	console.warn('[WARNING] : PORT not found in .env file, using default value instead')

//middlewares
app.use(express.static(path.join(import.meta.dirname, 'src')))
app.use(express.json())
app.use(logger)

//Inser New User
app.post(
	'/user',
	asyncHandler(async (req, res, next) => {
		const { name, email, password } = req.body
		const { ok, message, error } = await SQL.insert(name, email, password)

		res.json({ ok, message })
	}),
)

//Search for existing User
app.get(
	'/user',
	asyncHandler(async (req, res, next) => {
		const requestedID = req.query.id

		//0 is considered as 'get all users'
		if ((!requestedID && requestedID !== 0) || requestedID < 0)
			throw new BadRequestError('Invalid request ID')

		const { ok, data, message } = await SQL.read(requestedID)

		//Wont run if SQL.read() fails to connect to database:
		ok
			? res.status(Status.OK).json({ ok, data, message })
			: res.status(Status.NOT_FOUND).json({ ok, data, message })
	}),
)

//Delete Existing User
app.delete(
	'/user',
	asyncHandler(async (req, res) => {
		const { idToDelete } = req.body

		if (!idToDelete || idToDelete < 0) throw new BadRequestError('Invalid request ID')

		const { ok, message, deletedUsers } = await SQL.delete(idToDelete)

		//wont run if SQL.delete() fails:
		ok
			? res.status(Status.OK).json({ ok, message, deletedUsers })
			: res.status(Status.BAD_REQUEST).json({ ok, message, deletedUsers })
	}),
)

//Login User
app.post(
	'/login',
	asyncHandler(async (req, res) => {
		const { username, password } = req.body
		const { ok, message, user } = await authenticateUser(username, password)

		//won't run in controller runs into error:
		ok
			? res.status(Status.OK).json({ ok, message, user })
			: res.status(Status.NOT_FOUND).json({ ok, messagem, user })
	}),
)

//send Required Files:
app.get('/', (_req, res) => {
	res.sendFile(path.join(import.meta.dirname, 'index.html'))
})
app.get('/login', (_req, res) => {
	res.sendFile(path.join(import.meta.dirname, 'src/login.html'))
})
app.get('/style.css', (_req, res) => {
	res.sendFile(path.join(import.meta.dirname, 'style.css'))
})

app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`)
})
