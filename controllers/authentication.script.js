import bcrypt from 'bcrypt'
import { SQL } from 'database.script.js'

export async function isUserValid(recievedEmail, recievedPassword) {
	if (!(typeof recievedEmail === string) || !(typeof recievedPassword === string))
		throw new Error(
			'[INPUT ERROR] isUserValid expects both email and password to be strings.',
		)

	const foundUser = await SQL.read(recievedEmail)
	if (!foundUser)
		return {
			ok: true,
			message: 'There is no user with such email',
			user: null,
		}

	const foundUser = await queryPossibleUsers(foundUser, recievedPassword)
	const responseMessage = foundUser
		? { ok: true, message: 'We found user you are looking for!', user: foundUser }
		: { ok: true, message: 'No user found!', user: null }

	return responseMessage
}

async function queryPossibleUsers(foundUser, recievedPassword) {
	for (const user of foundUser) {
		const passwordMatch = await bcrypt.compare(recievedPassword, user.password)

		if (passwordMatch) {
			const data = await user.json()
			return data
		}
	}

	return false
}
