
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
			await addContent(node)
		} else {
			await showContent(node)
			node.getElementById('button').addEventListener('click', await redirect)
		}
		// add content to the page
		//await addContent(node)
	} catch(err) {
		console.error(err)
	}
}

async function redirect() {
	loadPage('send')
}

async function addContent(node) {
	// show "LOADING" message
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')
	const template = document.querySelector('template#loggedoff')
	const fragment = template.content.cloneNode(true)
	fragment.querySelector('h2').innerText = "Welcome to the best parcel delivery app!"
	fragment.querySelector('p').innerText = "Login or Sign Up to start using it."
	node.appendChild(fragment)

	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
}

async function showContent(node) {
	// show "LOADING" message
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')
	
	const template = document.querySelector('template#button')
	const fragment = template.content.cloneNode(true)
	fragment.querySelector('button').innerText = "Send Parcel"
	node.appendChild(fragment)

	const template2 = document.querySelector('template#loggedin')
	const fragment2 = template2.content.cloneNode(true)
	fragment2.querySelector('h2').innerText = "Logged in page"
	fragment2.querySelector('p').innerText = "Loren ipsum"
	node.appendChild(fragment2)

	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
}
