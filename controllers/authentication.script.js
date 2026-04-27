import bcrypt from 'bcrypt'
import { SQL } from './database.script.js'

export async function authenticateUser(usernameRecieved, passwordRecieved) {
	if (!(typeof usernameRecieved === string) || !(typeof passwordRecieved === string))
		throw new Error(
			'[INPUT ERROR] isUserValid expects both email and password to be strings.',
		)

	const foundUsers = await SQL.read(usernameRecieved)
	if (!foundUsers)
		return {
			ok: true,
			message: 'There is no user with such name/email',
			user: null,
		}

	const matchingUser = await queryPossibleUsers(foundUsers, passwordRecieved)
	const responseMessage = matchingUser
		? { ok: true, message: 'We found user you are looking for!', user: matchingUser }
		: { ok: true, message: 'No user found!', user: null }

	return responseMessage
}

async function queryPossibleUsers(foundUsers, passwordRecieved) {
	for (const user of foundUsers) {
		const passwordMatch = await bcrypt.compare(passwordRecieved, user.password)

		if (passwordMatch) {
			const data = await user.json()
			return data
		}
	}

	return false
}
