
/* routes.js */

import { Router } from 'oak'

import { extractCredentials, dataURLtoFile, checkRole } from 'util'
import { login, register } from 'accounts'
import { send, getSenderParcels, getCourierParcels, assignCourier, isDeliverable, deliverParcel } from 'parcels'

const router = new Router()

// the routes defined here
router.get('/', async context => {
	console.log('GET /')
	context.response.headers.set('Content-Type', 'text/html')
	const data = await Deno.readTextFile('spa/index.html')
	context.response.body = data
})

router.get('/api/accounts', async context => {
	console.log('GET /api/accounts')
	const token = context.request.headers.get('Authorization')
	console.log(`auth: ${token}`)
	context.response.headers.set('Content-Type', 'application/json')
	try {
		const credentials = extractCredentials(token)
		console.log(credentials)
		const username = await login(credentials)
		console.log(`username: ${username}`)
		context.response.body = JSON.stringify(
			{
				data: { username }
			}, null, 2)
	} catch(err) {
		err.data = {
			code: 401,
			title: '401 Unauthorized',
			detail: err.message
		}
		throw err
	}
})

router.post('/api/accounts', async context => {
	console.log('POST /api/accounts')
	const body  = await context.request.body()
	const data = await body.value
	console.log(data)
	await register(data)
	context.response.status = 201
	context.response.body = JSON.stringify({ status: 'success', msg: 'account created' })
})

router.post('/api/files', async context => {
	console.log('POST /api/files')
	try {
		const token = context.request.headers.get('Authorization')
		console.log(`auth: ${token}`)
		const body = await context.request.body()
		const data = await body.value
		console.log(data)
		dataURLtoFile(data.base64, data.user)
		context.response.status = 201
		context.response.body = JSON.stringify(
			{
				data: {
					message: 'file uploaded'
				}
			}
		)
	} catch(err) {
		err.data = {
			code: 500,
			title: '500 Internal Server Error',
			detail: err.message
		}
		throw err
	}
})

router.post('/api/user/send', async context => {
	console.log('POST /api/user/send')
	try {
		const token = context.request.headers.get('Authorization')
		console.log(`auth: ${token}`)
		const body = await context.request.body()
		const data = await body.value
		console.log(data)
		await send(data)
		context.response.status = 201
		context.response.body = JSON.stringify(
			{
				data: {
					message: 'file uploaded'
				}
			}
		)
	} catch(err) {
		err.data = {
			code: 500,
			title: '500 Internal Server Error',
			detail: err.message
		}
		throw err
	}
})

router.get('/api/user/parcels', async context => {
	console.log('GET /api/user/parcels')
	const token = context.request.headers.get('Authorization')
	console.log(`auth: ${token}`)
	context.response.headers.set('Content-Type', 'application/json')
	try {
		const credentials = extractCredentials(token)
		console.log(credentials)
		const username = await login(credentials)
		console.log(`username: ${username}`)
		const { role } = await checkRole(username)

		if(role === 1){
			const parcels = await getSenderParcels(username)

			context.response.body = JSON.stringify(
				{
					data: { parcels, role }
				}, null, 2)
		} else if(role === 2){
			const parcels = await getCourierParcels(username)

			context.response.body = JSON.stringify(
				{
					data: { parcels, role }
				}, null, 2)
		}
	} catch(err) {
		err.data = {
			code: 401,
			title: '401 Unauthorized',
			detail: err.message
		}
		throw err
	}
})

router.post('/api/courier/assign', async context => {
	console.log('POST /api/courier/assign')
	const token = context.request.headers.get('Authorization')
	console.log(`auth: ${token}`)
	try {
		const credentials = extractCredentials(token)
		const username = await login(credentials)
		console.log(`username: ${username}`)
		const body = await context.request.body()
		const data = await body.value
		const trackNumber = data.textbox
		const isToDeliver = await isDeliverable(trackNumber, username)
		if(isToDeliver === true) {
			context.response.status = 200
			context.response.body = JSON.stringify(
				{
					data: {
						message: 'parcel ready to be delivered',
						todeliver: 'true'
					}
				}
		)
		} else {
			await assignCourier(trackNumber, username)
			// await assignCourier(trackNumber, username)
			context.response.status = 200
			context.response.body = JSON.stringify(
				{
					data: {
						message: 'parcel assigned to courier',
						todeliver: 'false'
					}
				}
			)
		}
	} catch(err) {
		err.data = {
			// code: 500,
			// title: '500 Internal Server Error',
			code: err.code,
			title: err.title,
			detail: err.message
			// detail: 'debugging'
		}
		throw err
	}
})

router.post('/api/parcels/deliver', async context => {
	console.log('POST /api/parcels/deliver')
	try {
		const token = context.request.headers.get('Authorization')
		console.log(`auth: ${token}`)
		const username = await login(credentials)
		console.log(`username: ${username}`)
		const body = await context.request.body()
		const data = await body.value
		console.log(data)				
		await deliverParcel(data)
		context.response.status = 200
		context.response.body = JSON.stringify(
			{
				data: {
					message: 'parcel delivered'
				}
			}
		)
	} catch(err) {
		err.data = {
			code: 500,
			title: '500 Internal Server Error',
			detail: err.message
		}
		throw err
	}
})

export default router

