
/* deliver.js */

console.log('DELIVER')

import { customiseNavbar, loadPage, showMessage, router, file2DataURI } from '../util.js'

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
		const cords = await getCords()
		node.querySelector('form').addEventListener('submit', eventWrapper.bind(null, cords))
	} catch(err) {
		console.error(err)
	}
}

function eventWrapper(cords) {
	event.preventDefault()
	const trackingNumber = getTrackNumber()
	deliverParcel(trackingNumber, cords)
}

function getTrackNumber () {
	let urlParams = (new URL(document.location)).searchParams
	let number = urlParams.get("number")
	console.log(number)
	return number
}

async function getCords() {
	const position = await getCurrentPosition()
	console.log(position)
	const lat = position.coords.latitude
	const lon = position.coords.longitude
	const locationCords = `${lat},${lon}`
	return locationCords
}

function getCurrentPosition() {
    return new Promise( (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error)
        )
    })
}

async function deliverParcel(trackNum, location) {
	event.preventDefault()
	const formData = new FormData(event.target)
	const data = Object.fromEntries(formData.entries())
	const file = document.querySelector('input[name="file"]').files[0]
	data.trackingNumber = trackNum
	file.base64 = await file2DataURI(file)
	console.log(file)
	data.file = file.base64
	data.location = location
	console.log(data)
	const url = '/api/v1/parcels/deliver'
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
		loadPage('home')
		showMessage('Parcel sent!')
	} else {
		showMessage('Error')
	}
}

