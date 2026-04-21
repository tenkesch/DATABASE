const readUsersForm = document.getElementById('readUsersForm')
const newUserForm = document.getElementById('newUserForm')
const inputBar = document.getElementById('inputBar')
const deleteButton = document.getElementById('deleteButton')
const resultArea = document.getElementById('resultArea')
const addResultArea = document.getElementById('addResultArea')

// Helper to show results on screen
function showResult(element, text, isError = false) {
	element.textContent = text
	element.classList.remove('hidden', 'success', 'error')
	element.classList.add(isError ? 'error' : 'success')
}

deleteButton.addEventListener('click', async () => {
	const idToDelete = inputBar.value
	if (!idToDelete) {
		showResult(resultArea, '⚠ Enter an ID to delete.', true)
		return
	}
	console.log('Deleting user:', idToDelete)

	try {
		const response = await fetch('/user', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ idToDelete }),
		})
		const data = await response.json()

		const { message, error } = data
		showResult(resultArea, message || 'Delete request failed', !response.ok || !!error)
	} catch (err) {
		showResult(resultArea, '⚠ Failed to delete user', true)
	}
})

newUserForm.addEventListener('submit', async (e) => {
	e.preventDefault()

	const formData = new FormData(e.target)
	const dataToSend = {
		name: formData.get('userName'),
		email: formData.get('userEmail'),
		password: formData.get('userPassword'),
	}

	try {
		const response = await fetch('/user', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dataToSend),
		})

		const data = await response.json()

		if (!response.ok) {
			showResult(addResultArea, `⚠ ${data.message || 'Error adding user'}`, true)
			return
		}

		showResult(addResultArea, '✓ User added!\n' + JSON.stringify(data, null, 2))
		e.target.reset()
	} catch (err) {
		showResult(addResultArea, '⚠ Failed to reach server', true)
	}
})

readUsersForm.addEventListener('submit', async (e) => {
	e.preventDefault()

	const formData = new FormData(e.target)
	const inputValue = formData.get('inputBar').trim()

	if (!inputValue) {
		showResult(resultArea, '⚠ Enter a search query!', true)
		return
	}

	try {
		const response = await findUser(inputValue)
		if (!response) return

		if (!response.ok) {
			showResult(resultArea, `⚠ ${response.message || 'Not found'}`, true)
			return
		}

		if (!response.data || response.data.length === 0) {
			showResult(resultArea, `⚠ ${response.message || 'No user found'}`, true)
			return
		}

		showResult(resultArea, JSON.stringify(response.data, null, 2))
	} catch (err) {
		showResult(resultArea, '⚠ Failed to fetch data', true)
	}
})

async function findUser(searchParam) {
	const url = `/user?id=${searchParam}`
	try {
		const response = await fetch(url)
		const data = await response.json()
		return {
			ok: response.ok,
			data: data.data,
			message: data.message,
		}
	} catch (err) {
		console.error('Failed to get data from Database ', err)
		return {
			ok: false,
			data: [],
			message: 'Failed to get data from server',
		}
	}
}
