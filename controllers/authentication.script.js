import bcrypt from 'bcrypt'
import { SQL } from 'database.script.js'

export async function isUserValid(requestedEmail, requestedPassword) {
	if (!(typeof requestedEmail === string) || !(typeof requestedPassword === string))
		throw new Error(
			'[ AUTH ERROR ] : isUserValid() function accepts only STRING parameters',
		)

	const user = await SQL.readByEmail(requestedEmail)
	if (!user) throw new Error('There is no user with such email')

	const passwordMatch = await bcrypt.compare(requestedPassword, user.password)

	return passwordMatch
}
