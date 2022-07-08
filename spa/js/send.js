
/* send.js */

console.log('SEND')

import { customiseNavbar, loadPage, showMessage, router } from '../util.js'

export async function setup(node) {
	try {
		console.log('SENDPARCEL: setup')
		console.log(node)
		document.querySelector('header p').innerText = 'Send a Parcel'
		customiseNavbar(['home', 'logout'])
		if(localStorage.getItem('authorization') === null) {
			history.pushState(null, null, '/login')
			await router()
		}
		// there is a token in localstorage
		node.querySelector('form').addEventListener('submit', await sendParcel)
	} catch(err) {
		console.error(err)
	}
}

async function sendParcel() {
	event.preventDefault()
	const formData = new FormData(event.target)
	const data = Object.fromEntries(formData.entries())
	data.sender = localStorage.getItem('username')
	console.log(JSON.stringify(data))
	const url = '/api/parcels/deliver'
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Accept': 'application/vnd.api+json',
			'Authorization': localStorage.getItem('authorization')
		},
		body: JSON.stringify(data)
	}
	const response = await fetch(url, options)
	console.log(response)
	const json = await response.json()
	console.log(json)

	if (response.status === 200) {
		showMessage('Parcel sent!')
		loadPage('home')
	} else {
		loadPage('send')
	}
}