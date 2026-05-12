import bcrypt from 'bcrypt'
import { SQL } from './database.script.js'
import { BadRequestError } from '../errors/exports.error.js'

export async function authenticateUser(usernameRecieved, passwordRecieved) {
	if (!(typeof usernameRecieved === string) || !(typeof passwordRecieved === string))
		throw new BadRequestError(
			'isUserValid function expects both email and password to be strings.',
		)

	const foundUsers = await SQL.read(usernameRecieved)
	if (!foundUsers)
		return {
			ok: true,
			message: 'There is no user with such name/email',
			user: null,
		}

	const foundUsersType = typeof foundUsers
	console.log(`Type of Found users is: [${foundUsersType}]`)

	const matchingUser = await queryPossibleUsers(foundUsers, passwordRecieved)
	return matchingUser
		? { ok: true, message: 'We found user you are looking for!', user: matchingUser }
		: { ok: true, message: 'No user found!', user: null }
}

async function queryPossibleUsers(foundUsers, passwordRecieved) {
	for (const user of foundUsers) {
		const passwordMatch = await bcrypt.compare(passwordRecieved, user.password)

		if (passwordMatch) return user
	}

	return false
}
