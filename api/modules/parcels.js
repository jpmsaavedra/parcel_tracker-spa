
/* parcels.js */

import { db } from 'db'
// import { getTrackNum } from 'util'
import { cryptoRandomString } from 'cryptoRandomString'

export async function send(parcel) {
	const { senderpostcode, receiverpostcode, weight, recipient, address, sender } = parcel
	
	const timestamp = Date.now()
	const status = 'not-dispatched'
	const trackingNumber = await cryptoRandomString({length: 10, type: 'distinguishable'})

	console.log(trackingNumber)

	const sql = `INSERT INTO parcels(track_number, sender_name, sender_post, recipient_name, recipient_post, address, weight, time, status) VALUES("${trackingNumber}", "${sender}", "${senderpostcode}", "${recipient}", "${receiverpostcode}", "${address}", "${weight}", "${timestamp}", "${status}");`
	console.log(sql)
	await db.query(sql)
	console.log('PARCEL SENT')
	return true
}

export async function getSenderParcels(user) {
	let sql = `SELECT * FROM parcels WHERE sender_name="${user}";`
	try {
		const data = await db.query(sql)
		return data
	} catch(err) {
		console.log('connection login error thrown', err)
		err.data = {
			code: 500,
			title: '500 Internal server error',
			detail: 'the API database is currently down'
		}
		throw err
	}
}

export async function getCourierParcels(user) {
	let sql = `SELECT * FROM parcels WHERE assigned_to="${user}";`
	try {
		const data = await db.query(sql)
		return data
	} catch(err) {
		console.log('connection login error thrown', err)
		err.data = {
			code: 500,
			title: '500 Internal server error',
			detail: 'the API database is currently down'
		}
		throw err
	}
}

export async function assignCourier(trackNumber, username) {
	let sql = `SELECT * FROM parcels WHERE track_number="${trackNumber}" AND status="not-dispatched";`
	let records
	try {
		records = await db.query(sql)
		console.log(records)
		
	} catch(err) {
		console.log('connection login error thrown', err)
		err.data = {
			code: 500,
			title: '500 Internal server error',
			detail: 'the API database is currently down'
		}
		throw err
	}
	if(records.length === 0) {
		const err = new Error()
		// err.data = {
		// 	code: 401,
		// 	title: 'Change to not found',
		// 	detail: 'Change to number not found'
		// }
		err.code = 404
		err.title = '404 Not found'
		err.message = 'No matching parcels found'
		throw err
	}
	sql = `UPDATE parcels SET assigned_to="${username}", status="in-transit" WHERE track_number="${trackNumber}";`
	records = await db.query(sql)
}

export async function isDeliverable(trackNumber, username) {
	let sql = `SELECT * FROM parcels WHERE track_number="${trackNumber}" AND assigned_to="${username}"`
	let records
	try {
		records = await db.query(sql)
		console.log(records)
		
	} catch(err) {
		console.log('connection login error thrown', err)
		err.data = {
			code: 500,
			title: '500 Internal server error',
			detail: 'the API database is currently down'
		}
		throw err
	}
	if(records.length === 0) {
		return false
	}
	// sql = `UPDATE parcels SET assigned_to="${username}", status="in-transit" WHERE track_number="${trackNumber}";`
	// records = await db.query(sql)
	return true
}

export async function deliverParcel(parcel) {
	// const { senderpostcode, receiverpostcode, weight, recipient, address, sender } = parcel
	
	const timestamp = Date.now()

	const sql = `UPDATE parcels SET signature="${parcel.file}", delivered_time="${timestamp}", delivered_location="${parcel.location}", delivered_to="${parcel.name}", status="delivered" WHERE track_number="${parcel.trackingNumber}";`
	console.log(sql)
	await db.query(sql)
	console.log('PARCEL DELIVERED')
	return true
}