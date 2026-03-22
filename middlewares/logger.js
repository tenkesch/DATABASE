const logger = () => {
	requestedID > 0
		? console.log(`Client requested user with id: [${requestedID}]`)
		: console.log('Client requested all users from DB')
	return
}
