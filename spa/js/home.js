
/* home.js */

import { customiseNavbar, loadPage } from '../util.js'

export async function setup(node) {
	console.log('HOME: setup')
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Home'
		customiseNavbar(['home', 'foo', 'send', 'logout']) // navbar if logged in
		const token = localStorage.getItem('authorization')
		console.log(token)
		if(token === null) {
			customiseNavbar(['home', 'register', 'login']) //navbar if logged out
			await addContent(node)
		} else {
			await showContent(node)
		}
		// add content to the page
		//await addContent(node)
	} catch(err) {
		console.error(err)
	}
}

async function addContent(node) {
	// show "LOADING" message
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')
	const template = document.querySelector('template#loggedoff')
	const fragment = template.content.cloneNode(true)
	fragment.querySelector('h2').innerText = "Logged off page"
	fragment.querySelector('p').innerText = "Loren ipsum"
	node.appendChild(fragment)

	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
}

async function showContent(node) {
	// show "LOADING" message
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')
	const template = document.querySelector('template#loggedin')
	const fragment = template.content.cloneNode(true)

	fragment.querySelector('h2').innerText = "Logged in page"
	fragment.querySelector('p').innerText = "Loren ipsum"

	// fragment.getElementById('button').addEventListener('click', await redirect)

	node.appendChild(fragment)

	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
}
