
/* deliver.js */

console.log('DELIVER')

import { customiseNavbar, loadPage, showMessage, router } from '../util.js'

export async function setup(node) {
	try {
		console.log('DELIVER: setup')
		console.log(node)
		document.querySelector('header p').innerText = 'Parcel delivery'
		customiseNavbar(['home', 'logout'])
		if(localStorage.getItem('authorization') === null) {
			history.pushState(null, null, '/login')
			await router()
		}
		node.querySelector('form').addEventListener('submit', await deliverParcel)
	} catch(err) {
		console.error(err)
	}
}

async function deliverParcel() {
	event.preventDefault()
	const formData = new FormData(event.target)
	const data = Object.fromEntries(formData.entries())
	data.sender = localStorage.getItem('username')
	console.log(JSON.stringify(data))
	// const url = '/api/user/send'
	// const options = {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/vnd.api+json',
	// 		'Accept': 'application/vnd.api+json',
	// 		'Authorization': localStorage.getItem('authorization')
	// 	},
	// 	body: JSON.stringify(data)
	// }
	// const response = await fetch(url, options)
	// console.log(response)
	// const json = await response.json()
	// console.log(json)

	// if (response.status === 200) {
	// 	loadPage('home')
	// 	showMessage('Parcel sent!')
	// } else {
	// 	showMessage('Error')
	// }
}

