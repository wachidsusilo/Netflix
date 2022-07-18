import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
    AuthError,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User
} from '@firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'next/router'
import getAuthErrorMessage from '../constants/auth'
import { onCurrentUserSubscriptionUpdate, Subscription } from '@stripe/firestore-stripe-payments'
import payments from '../lib/stripe'

interface IAuth {
    user: User | null
    subscription: Subscription | null,
    signUp: (email: string, password: string) => void
    signIn: (email: string, password: string) => void
    logout: () => void
    error: string | null
    loading: boolean
}

const AuthContext = createContext<IAuth>({
    user: null,
    subscription: null,
    signUp: () => {},
    signIn: () => {},
    logout: () => {},
    error: null,
    loading: false
})

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const router = useRouter()

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                onCurrentUserSubscriptionUpdate(payments, (snapshot) => {
                    setSubscription(snapshot.subscriptions.filter((subscription) => subscription.status == "active")[0] ?? null)
                })
                setUser(user)
                setLoading(false)
            } else {
                setUser(null)
                setLoading(false)
            }
            setInitialLoading(false)
        })

    }, [auth])

    const signUp = (email: string, password: string) => {
        setLoading(true)
        setError(null)
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user)
                router.push("/").then()
            })
            .catch((error: AuthError) => {
                setError(getAuthErrorMessage(error.code))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const signIn = (email: string, password: string) => {
        setLoading(true)
        setError(null)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user)
                router.push("/").then()
            })
            .catch((error: AuthError) => {
                setError(getAuthErrorMessage(error.code))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const logout = () => {
        setLoading(true)
        setError(null)
        signOut(auth)
            .then(() => {
                setUser(null)
                router.push("/login").then()
            })
            .catch((error) => {
                setError(getAuthErrorMessage(error.code))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const memoizedValue = useMemo(() => ({
        user,
        subscription,
        signUp,
        signIn,
        logout,
        error,
        loading
    }), [user, subscription, loading, error])

    return (
        <AuthContext.Provider value={memoizedValue}>
            {!initialLoading && children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext)
}