import { buffer } from "micro"

// secure a connection to firebase form the backend
const admin = require("firebase-admin");

const serviceAccount = require('../../../permissions.json')

const app = !admin.apps.length ? admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
}) : admin.app()

// establish a connection to stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const endpointSecret = process.env.STRIPE_SIGNING_SECRET

const fulfillOrder = async (session) => {
    // console.log('fulfilling order:', session)

    return app
    .firestore()
    .collection('users')
    .doc(session.metadata.email)
    .collection('orders')
    .doc(session.id)
    .set({
        amount: session.amount_total / 100,
        amount_shipping: session.total_details.amount_shipping / 100,
        images: JSON.parse(session.metadata.images),
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log(`SUCCESS: Order ${session.id} has been added to the database`)
    })
}

export default async (req, res) => {
    if (req.method === 'POST') {
        const requestBuffer = await buffer(req)
        const payload = requestBuffer.toString()
        const sig = req.headers['stripe-signature']

        let event;

        // verify that event posted came from stripe
        try {
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
        } catch (error) {
            console.error('ERROR', err.message)
            return res.status(400).send(`Webhook error: ${error.message}`)
        }

        // handle the checkout.session.completed event
        if (event.type ==='checkout.session.completed') {
            const session = event.data.object

            // fulfill the order
            return fulfillOrder(session)
            .then(() => res.status(200))
            .catch(error => res.status(400).send(`Webhook Error: ${error.message}`))
        }
    }
}

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true
    }
}