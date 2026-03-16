const SubmitForm = document.getElementById('FORM_Search')
const inputBar = document.getElementById('INPUT_search')

const INPUT_insertUser_Name = document.getElementById('INPUT_insertUser_Name')
const INPUT_insertUser_Email = document.getElementById('INPUT_insertUser_Email')
const INPUT_insertUser_Password = document.getElementById('INPUT_insertUser_Password')

const FORM_insertUser = document.getElementById('FORM_insertUser')
FORM_insertUser.addEventListener('submit', async (e) => {
	e.preventDefault()

	//pull {name email password} variables that client submitted
	const name = INPUT_insertUser_Name.value
	const email = INPUT_insertUser_Email.value
	const password = INPUT_insertUser_Password.value

	if (!(name && email && password)) {
		console.warn('Invalid parameters')
		return
	}

	const url = `/createUser?name=${name}&email=${email}&password=${password}`
	// if(url > MAX_URL_LENGHT) throw new Error('Url lenght is way too big')

	const response = await fetch(url)
	const data = await response.json()
	console.log(data)
	console.log('WORKSS')
})

SubmitForm.addEventListener('submit', async (e) => {
	e.preventDefault()

	const requestedID = inputBar.value
	const response = await getData(requestedID)

	if (!response) return

	const userData = JSON.stringify(response.data, null, 2)
	console.log(userData)
})

async function getData(idNumber = 0) {
	if (isNaN(idNumber)) {
		console.error('Only numbers are accepted!')
		return
	}

	const url = idNumber ? `/user?id=${idNumber}` : '/user'
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
