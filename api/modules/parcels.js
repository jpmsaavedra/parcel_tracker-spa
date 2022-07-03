
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