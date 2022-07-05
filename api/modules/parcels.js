
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

	const sql = `INSERT INTO parcels(track_number, sender_name, sender_post, recipient_name, recipient_post, address, weight, time, status) VALUES("${trackingNumber}", "${sender}", "${senderpostcode}", "${recipient}", "${receiverpostcode}", "${address}", "${weight}", "${timestamp}", "${status}")`
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