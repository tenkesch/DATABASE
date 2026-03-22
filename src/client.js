const readUsersForm = document.getElementById('readUsersForm')
const newUserForm = document.getElementById('newUserForm')

newUserForm.addEventListener('submit', async (e) => {
	e.preventDefault()

	const formData = new FormData(e.target)

	const userName = formData.get('userName')
	const userEmail = formData.get('userEmail')
	const userPassword = formData.get('userPassword')

	const dataToSend = {
		name: userName,
		email: userEmail,
		password: userPassword,
	}

	const response = await fetch('/user', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(dataToSend),
	})

	if (!response.ok) {
		console.warn('There was an Error with importing user')
		return
	}
	const data = await response.json()
	console.log(data)
})

readUsersForm.addEventListener('submit', async (e) => {
	e.preventDefault()

	const formData = new FormData(e.target)
	const inputValue = parseInt(formData.get('inputBar'))

	if (!inputValue) {
		console.warn('User ID is required!')
		return
	}

	if (inputValue < 0) {
		console.warn('Only positive IDs are accepted nigga')
		return
	}

	const response = await getData(inputValue)
	if (!response) {
		response.message
			? console.warn(response.message)
			: console.warn('Server ran into unexpected Error')
	}

	//beautify json
	const userData = JSON.stringify(response.data, null, 2)
	console.log(userData)
})

async function getData(searchParam = 0) {
	const url = `/user?id=${searchParam}`
	try {
		const response = await fetch(url)
		const data = await response.json()

		if (!response.ok) {
			console.warn(data.message)
			return
		}
		return data
	} catch (err) {
		console.error('Failed to get data from Database ', err)
	}
}
