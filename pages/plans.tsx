import Head from 'next/head'
import Link from 'next/link'
import useAuth from '../hooks/UseAuth'
import { CheckIcon } from '@heroicons/react/outline'
import { getProducts, Product } from '@stripe/firestore-stripe-payments'
import payments, { loadCheckout } from '../lib/stripe'
import Table from '../components/Table'
import { useState } from 'react'
import { useRouter } from 'next/router'

interface Props {
    products: Array<Product>
}

const Plans = ({products}: Props) => {
    const {logout, loading, user, subscription} = useAuth()
    const [isBillingLoading, setIsBillingLoading] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<Product | null>(products.find(p => p.name == 'Premium') ?? null)
    const router = useRouter()

    const subscribeToPlan = () => {
        if (!user) return
        const price = selectedPlan?.prices[0]
        if (price) {
            loadCheckout(price.id)
                .then(() => {

                })
                .catch((error) => {
                    console.log(error.message)
                })
                .finally(() => {
                    setIsBillingLoading(false)
                })
            setIsBillingLoading(true)
        }
    }

    if (user && subscription) {
        router.push("/").then(()=>{
            // TODO
        })
        return null
    }

    return (
        <div>
            <Head>
                <title>Netflix</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <header className="border-b border-white/10 bg-[#141414]">
                <Link href="/">
                    <img
                        src="https://rb.gy/ulxxee"
                        alt=""
                        className="cursor-pointer w-auto h-7 md:h-10 object-contain active:scale-95 transition"
                    />
                </Link>
                <button
                    className="text-md md:text-lg font-medium hover:underline"
                    onClick={() => {
                        if (!loading) {
                            logout()
                        }
                    }}>
                    {
                        loading ?
                            <svg className="w-7 h-7 animate-spin" viewBox="0 0 24 24">
                                <circle cx={12} cy={12} r={9} strokeWidth={3} stroke="#cacaca80" fill="transparent"/>
                                <circle cx={12}
                                        cy={12}
                                        r={9}
                                        strokeWidth={3}
                                        stroke="white"
                                        fill="transparent"
                                        strokeDasharray={20}
                                        strokeDashoffset={22}/>
                            </svg>
                            :
                            'Sign Out'
                    }
                </button>
            </header>
            <main className="pt-24 md:pt-28 mx-auto max-w-5xl px-5 pb-12 transition-all md:px-10">
                <h1 className="mb-3 text-2xl md:text-3xl font-medium">Choose the plans that's right for you</h1>
                <ul>
                    <li className="flex items-center gap-x-2 text-lg">
                        <CheckIcon className="h-7 w-7 text-[#E50914]"/> Watch all you want.
                        Ad-free.
                    </li>
                    <li className="flex items-center gap-x-2 text-lg">
                        <CheckIcon className="h-7 w-7 text-[#E50914]"/> Recommendations
                        just for you.
                    </li>
                    <li className="flex items-center gap-x-2 text-lg">
                        <CheckIcon className="h-7 w-7 text-[#E50914]"/> Change or cancel
                        your plan anytime.
                    </li>
                </ul>
                <div className="mt-8 flex flex-col space-y-4">
                    <div className="flex w-full items-center justify-end self-end md:w-3/5">
                        {
                            products.map((product) => (
                                <div
                                    key={product.id}
                                    className={`planBox cursor-pointer ${selectedPlan?.id === product.id ? 'opacity-100' : 'opacity-60'}`}
                                    onClick={() => {
                                        setSelectedPlan(product)
                                    }}>
                                    {product.name}
                                </div>
                            ))
                        }
                    </div>
                    <Table products={products} selectedPlan={selectedPlan}/>

                    <button
                        disabled={!selectedPlan || isBillingLoading || loading}
                        className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] 
                        flex items-center justify-center ${
                            isBillingLoading && 'opacity-60'
                        }`}
                        onClick={() => {
                            if (!loading && !isBillingLoading) {
                                subscribeToPlan()
                            }
                        }}>
                        {isBillingLoading ? (
                            <svg className="w-7 h-7 animate-spin" viewBox="0 0 24 24">
                                <circle cx={12} cy={12} r={9} strokeWidth={3} stroke="#cacaca80" fill="transparent" />
                                <circle cx={12}
                                        cy={12}
                                        r={9}
                                        strokeWidth={3}
                                        stroke="white"
                                        fill="transparent"
                                        strokeDasharray={20}
                                        strokeDashoffset={22}/>
                            </svg>
                        ) : (
                            'Subscribe'
                        )}
                    </button>
                </div>
            </main>
        </div>
    )
}

export const getServerSideProps = async () => {
    const products = await getProducts(payments, {
        includePrices: true,
        activeOnly: true
    })
        .then((response) => response)
        .catch((error) => {
            console.log(error.message)
            return []
        })

    return {
        props: {
            products: products.sort((a, b) => {
                if ((a.prices[0] ?? 0) > (b.prices[0] ?? 0)) {
                    return 1
                } else if ((a.prices[0] ?? 0) < (b.prices[0] ?? 0)) {
                    return -1
                } else {
                    return 0
                }
            })
        }
    }
}

export default Plans