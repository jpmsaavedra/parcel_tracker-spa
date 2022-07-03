
/* parcels.js */

import { db } from 'db'
import { nanoid } from 'nanoid'

export async function send(parcel) {
	const { sendPost, recPost, weight, recipient, address, sender } = parcel
	
	const timestamp = Date.now()
	const status = 'not-dispatched'
	const trackingNumber = nanoid()

	console.log(trackingNumber)

	const sql = `INSERT INTO parcels(track_number, sender_name, sender_post, recipient_name, recipient_post, address, weight, time, status) VALUES("${trackingNumber}", "${sender}", "${sendPost}", "${recipient}", "${recPost}", "${address}", "${weight}", "${timestamp}", "${status}")`
	console.log(sql)
	await db.query(sql)
	console.log('PARCEL SENT')
	return true
}