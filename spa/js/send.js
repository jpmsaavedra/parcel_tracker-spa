
/* send.js */

import { customiseNavbar , loadPage, showMessage } from '../util.js'

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
		console.log(window.location)
		node.querySelector('#href').innerText = window.location.href
		node.querySelector('#pathname').innerText = window.location.pathname
		node.querySelector('#search').innerText = window.location.search
		node.querySelector('#hash').innerText = window.location.hash
	} catch(err) {
		console.error(err)
	}
}