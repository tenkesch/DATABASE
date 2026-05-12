const userLogin = document.getElementById('userLogin')

userLogin.addEventListener('submit', async (e) => {
	e.preventDefault()

	const formData = new FormData(e.target)
	const dataToSend = {
		username: formData.get('userName'),
		password: formData.get('userPassword'),
	}

	try {
		const response = await fetch('/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dataToSend),
		})

		const data = await response.json()

		if (!response.ok) {
			showResult(addResultArea, `⚠ ${data.message || 'Error logging in user'}`, true)
			return
		}

		showResult(addResultArea, '✓ User logged in!\n' + JSON.stringify(data, null, 2))
		e.target.reset()
	} catch (err) {
		showResult(addResultArea, '⚠ Failed to reach server', true)
	}
})
