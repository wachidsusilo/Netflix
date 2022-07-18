import { useState } from 'react'
import useAuth from '../hooks/UseAuth'
import { goToBillingPortal } from '../lib/stripe'
import { useRouter } from 'next/router'

const Membership = () => {
    const {user, subscription} = useAuth()
    const [isBillingLoading, setBillingLoading] = useState(false)
    const router = useRouter()

    const manageSubscription = () => {
        if (subscription) {
            setBillingLoading(true)
            goToBillingPortal()
        }
    }

    if (!subscription) {
        router.push("/plans").then()
        return null
    }

    return (

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
            <div className="space-y-2 py-4">
                <h4 className="text-lg text-[gray]">Membership & Billing</h4>
                <button
                    disabled={isBillingLoading || !subscription}
                    className="h-10 w-3/5 whitespace-nowrap bg-gray-300 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-200 md:w-4/5
                    flex items-center justify-center"
                    onClick={manageSubscription}>
                    {isBillingLoading ? (
                        <svg className="w-7 h-7 animate-spin" viewBox="0 0 24 24">
                            <circle cx={12} cy={12} r={9} strokeWidth={3} stroke="#cacaca80" fill="transparent"/>
                            <circle cx={12}
                                    cy={12}
                                    r={9}
                                    strokeWidth={3}
                                    stroke="#e50914"
                                    fill="transparent"
                                    strokeDasharray={20}
                                    strokeDashoffset={22}/>
                        </svg>
                    ) : (
                        'Cancel Membership'
                    )}
                </button>
            </div>

            <div className="col-span-3">
                <div className="flex flex-col justify-between border-b border-white/10 py-4 md:flex-row">
                    <div>
                        <p className="font-medium">{user?.email}</p>
                        <p className="text-[gray]">Password: ********</p>
                    </div>
                    <div className="md:text-right">
                        <p className="membershipLink">Change email</p>
                        <p className="membershipLink">Change password</p>
                    </div>
                </div>

                <div className="flex flex-col justify-between pt-4 pb-4 md:flex-row md:pb-0">
                    <div>
                        <p>
                            {subscription?.cancel_at_period_end
                                ? 'Your membership will end on '
                                : 'Your next billing date is '}
                            {subscription?.current_period_end}
                        </p>
                    </div>
                    <div className="md:text-right">
                        <p className="membershipLink">Manage payment info</p>
                        <p className="membershipLink">Add backup payment method</p>
                        <p className="membershipLink">Billing Details</p>
                        <p className="membershipLink">Change billing day</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Membership