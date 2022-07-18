import { createCheckoutSession, getStripePayments } from '@stripe/firestore-stripe-payments'
import app from '../firebase'
import { getFunctions, httpsCallable, HttpsCallableResult } from '@firebase/functions'

const payments = getStripePayments(app, {
    productsCollection: 'products',
    customersCollection: 'customers'
})

export const loadCheckout = async (priceId: string) => {
    await createCheckoutSession(payments, {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin
    }).then((snapshot) => window.location.assign(snapshot.url))
        .catch(e => console.log(e.message))
}

export const goToBillingPortal = () => {
    const instance = getFunctions(app, 'asia-southeast2')
    const functionRef = httpsCallable<{ returnUrl: string }, { url: string }>(
        instance,
        'ext-firestore-stripe-payments-createPortalLink'
    )

    functionRef({
        returnUrl: `${window.location.origin}/account`,
    })
        .then(({data}) => window.location.assign(data.url))
        .catch((error) => console.log(error.message))
}

export default payments