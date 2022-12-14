
/* home.js */

console.log('HOME')

import { customiseNavbar, loadPage, showMessage } from '../util.js'

export async function setup(node) {
	console.log('HOME: setup')
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Home'
		customiseNavbar(['home', 'logout']) // navbar if logged in
		const token = localStorage.getItem('authorization')
		console.log(token)
		if(token === null) {
			customiseNavbar(['home', 'register', 'login']) //navbar if logged out
			await noLogin(node)
		} else {
			await loggedIn(node)
		}
	} catch(err) {
		console.error(err)
	}
}

async function redirectSend() {
	loadPage('send')
}

async function assignParcel() {
	event.preventDefault()
	const formData = new FormData(event.target)
	const data = Object.fromEntries(formData.entries())
	console.log(data)
	const url = 'api/v1/parcels/update'
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
	const json = await response.json()
	console.log(json)

	if(response.status === 200) {
		if(json.data.todeliver === 'true') {
			loadPage('deliver')
			history.pushState(null, null, `?number=${data.textbox}`)	
		} else {
			loadPage('home')
			showMessage(`parcel assigned to courier`)
		}
	} else {
		showMessage(json.errors[0].detail)
	}

}

async function noLogin(node) {
	// show "LOADING" message
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')
	const template = document.querySelector('template#loggedoff')
	const fragment = template.content.cloneNode(true)
	fragment.querySelector('h2').innerText = "Welcome to the best parcel delivery app out there!"
	fragment.querySelector('p').innerText = "Login or Sign Up to start using it."
	node.appendChild(fragment)

	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
}

async function loggedIn(node) {
	// show "LOADING" message
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')

	const url = 'api/v1/parcels'
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Accept': 'application/vnd.api+json',
			'Authorization': localStorage.getItem('authorization')
		}
	}
	const response = await fetch(url, options)
	console.log(response)
	const json = await response.json()
	console.log(json)
	const role = json.data.role

	if(role === 1){
		const template = document.querySelector('template#button')
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('button').innerText = "Send Parcel"
		fragment.querySelector('button').addEventListener('click', await redirectSend)
		node.appendChild(fragment)
	} else if (role === 2){
		const template = document.querySelector('template#textbox')
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('button').innerText = "Submit"
		fragment.querySelector('form').addEventListener('submit', await assignParcel)
		node.appendChild(fragment)
	}

	const parcelsList = json.data.parcels
	console.log(parcelsList)
	parcelsList.forEach((parcel) => {
		const template2 = document.querySelector('template#loggedin')
		const fragment2 = template2.content.cloneNode(true)
		const unixTime = parcel.time
		const dateTime = new Date(+unixTime)
		const elapsedHours = Math.floor((Date.now() - unixTime)/1000/60/60)		
		if(role === 1){
			fragment2.querySelector('p:nth-of-type(1)').innerText = `Recipient name: ${parcel.recipient_name}`
			fragment2.querySelector('p:nth-of-type(2)').innerText = `Recipient postcode: ${parcel.recipient_post}`
			fragment2.querySelector('p:nth-of-type(3)').innerText = `Date: ${dateTime.getDate()+"/"+dateTime.getMonth()+"/"+dateTime.getFullYear()+" "+dateTime.getHours()+":"+dateTime.getMinutes()}`
			fragment2.querySelector('p:nth-of-type(4)').innerText = `Status: ${parcel.status}`
		} else if(role === 2){
			fragment2.querySelector('p:nth-of-type(1)').innerText = `Recipient name: ${parcel.recipient_name}`
			fragment2.querySelector('p:nth-of-type(2)').innerText = `Recipient postcode: ${parcel.recipient_post}`
			fragment2.querySelector('p:nth-of-type(3)').innerText = `Weight: ${parcel.weight}Kg`
			fragment2.querySelector('p:nth-of-type(4)').innerText = `Time elapsed: ${elapsedHours} Hours`
		}
		node.appendChild(fragment2)
	})

	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
}
