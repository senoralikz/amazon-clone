const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
    const { items, email } = req.body

    const transformedItems = items.map(item => ({
        quantity: 1,
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.title,
                images: [item.image],
                description: item.description,
            },
            unit_amount: item.price * 100,
        }
    }))

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // shipping_options: [{ shipping_rate: 'shr_1LTvzKD1wH5lpR6vAv0pfvLT' }],
        shipping_address_collection: {
            allowed_countries: ['GB', 'US', 'CA']
        },
        line_items: transformedItems,
        mode: 'payment',
        success_url: `${process.env.HOST}/success`,
        cancel_url: `${process.env.HOST}/checkout`,
        metadata: {
            email,
            images: JSON.stringify(items.map(item => item.image))
        }
    })

    res.status(200).json({ id: session.id })
}