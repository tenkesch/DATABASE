import 'dotenv/config'
import path from 'path'
import express from 'express'
import { readFromDatabase, importUser, deleteUser } from './database.js'
const app = express()

const PORT = process.env.PORT || getDefaultPORT()

function getDefaultPORT() {
	console.warn('[ERROR] : PORT not found in .env file, using default value instead')
	return 3000
}

app.get('/user', async (req, res) => {
	const id = req.query.id
	const userData = await readFromDatabase(id)

	console.log(userData)
	res.send(userData)
})

app.get('/', (_req, res) => {
	res.sendFile(path.join(import.meta.dirname, 'index.html'))
})

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`)
})
