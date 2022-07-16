import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useAuth from '../hooks/UseAuth'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Inputs {
    email: string
    password: string
}

const Login = () => {
    const [login, setLogin] = useState<boolean>(false)
    const {user, signIn, signUp, error: authError, loading} = useAuth()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async ({email, password}) => {
        if (login) {
            if (!loading) {
                await signIn(email, password)
            }
        } else {
            if (!loading) {
                await signUp(email, password)
            }
        }
    }

    if (user) {
        router.push("/").then(()=>{
            // TODO
        })
        return null
    }

    return (
        <div className="relative flex h-screen w-screen flex-col bg-black
        md:items-center md:justify-center md:bg-transparent">
            <Head>
                <title>Netflix</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Image
                src="https://rb.gy/p2hphi"
                layout="fill"
                className="-z-10 !hidden opacity-60 sm:!inline"
                objectFit="cover"
            />
            {

            }
            <Link href="/">
                <img
                    src="https://rb.gy/ulxxee"
                    alt=""
                    className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6 active:scale-95 transition"
                    width={150}
                    height={150}
                />
            </Link>
            <form
                className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
                onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-4xl font-semibold">Sign In</h1>
                <div className="space-y-4">
                    <label className="inline-block w-full">
                        <input
                            type="email"
                            placeholder="Email"
                            className="input"
                            {...register('email', {required: true})}
                        />
                        {errors.email && (
                            <p className="p-1 text-[13px] font-light text-orange-500">
                                Please enter a valid email.
                            </p>
                        )}
                    </label>
                    <label className="inline-block w-full">
                        <input
                            type="password"
                            placeholder="Password"
                            className="input"
                            {...register('password', {required: true, minLength: 8, maxLength: 60})}
                        />
                        {errors.password && (
                            <p className="p-1 text-[13px] font-light text-orange-500">
                                Your password must contain between 8 and 60 characters.
                            </p>
                        )}
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full rounded bg-[#e50914] py-3 font-semibold active:scale-95 transition flex items-center justify-center"
                    onClick={() => setLogin(true)}>
                    {
                        login && loading ?
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
                            :
                            "Sign In"
                    }
                </button>
                {authError && (
                    <p className="p-1 text-[13px] font-light text-orange-500">
                        {authError}
                    </p>
                )}
                <div className="text-[gray] flex gap-2">
                    New to Netflix?{' '}
                    <button
                        type="submit"
                        className="text-white hover:underline flex items-center justify-center"
                        onClick={() => setLogin(false)}>
                        {
                            !login && loading ?
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
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
                                :
                                "Sign up now"
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login