
/* home.js */

import { customiseNavbar, loadPage } from '../util.js'

export async function setup(node) {
	console.log('HOME: setup')
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Home'
		customiseNavbar(['home', 'foo', 'logout']) // navbar if logged in
		const token = localStorage.getItem('authorization')
		console.log(token)
		if(token === null) {
			customiseNavbar(['home', 'register', 'login']) //navbar if logged out
			await noLogin(node)
		} else {
			await loggedIn(node)
			// if(role === 1){
			// 	node.getElementById('button').addEventListener('click', await redirectSend)
			// } else if(role === 2){
			// 	node.querySelector('form').addEventListener('submit', await redirectSend)
			// }
		}
		// add content to the page
		//await addContent(node)
	} catch(err) {
		console.error(err)
	}
}

async function redirectSend() {
	loadPage('send')
}

async function assignParcel() {
	
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

	const url = 'api/user/parcels'
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
	// console.log(json.data.parcels)
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
		const template2 = document.querySelector('template#loggedinuser')
		const fragment2 = template2.content.cloneNode(true)
		const unixTime = parcel.time
		const dateTime = new Date(+unixTime)
		const elapsedHours = Math.floor((Date.now() - unixTime)/1000/60/60)		
		if(role === 1){
			fragment2.querySelector('#recname').innerText = `${parcel.recipient_name}`
			fragment2.querySelector('#destpostcode').innerText = `${parcel.recipient_post}`
			fragment2.querySelector('#timeadded').innerText = `${dateTime.getDate()+"/"+dateTime.getMonth()+"/"+dateTime.getFullYear()+" "+dateTime.getHours()+":"+dateTime.getMinutes()}`
			fragment2.querySelector('#parcelstatus').innerText = `${parcel.status}`
		} else if(role === 2){
			fragment2.querySelector('#recname').innerText = `${parcel.recipient_name}`
			fragment2.querySelector('#destpostcode').innerText = `${parcel.recipient_post}`
			fragment2.querySelector('#timeadded').innerText = `${parcel.weight}Kg`
			fragment2.querySelector('#parcelstatus').innerText = `${elapsedHours} Hours`
		}
		node.appendChild(fragment2)
	})

	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
}
