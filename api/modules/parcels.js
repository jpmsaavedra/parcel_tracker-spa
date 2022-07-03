
/* parcels.js */

import { db } from 'db'
import { nanoid } from 'nanoid'

export async function send(parcel) {
	const { sendPost, recPost, weight, recipient, address, sender } = parcel
	
	const timestamp = Date.now()
	const status = 'not-dispatched'
	const trackingNumber = nanoid()

	console.log(trackingNumber)

	const sql = `INSERT INTO parcels(sender_post, recipient_post, weight, recipient_name, address, sender_name, timestamp, status, track_number) VALUES("${sendPost}", "${recPost}"`

	console.log('PARCEL SENT')
	return true
}