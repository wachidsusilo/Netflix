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

interface IAuth {
    user: User | null
    signUp: (email: string, password: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    error: string | null
    loading: boolean
}

const AuthContext = createContext<IAuth>({
    user: null,
    signUp: async () => {
    },
    signIn: async () => {
    },
    logout: async () => {
    },
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
    const router = useRouter()

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
                setLoading(false)
            } else {
                setUser(null)
                setLoading(false)
            }
            setInitialLoading(false)
        })

    }, [auth])

    const signUp = async (email: string, password: string) => {
        setLoading(true)
        setError(null)
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user)
                router.push("/")
            })
            .catch((error: AuthError) => {
                setError(getAuthErrorMessage(error.code))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true)
        setError(null)
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user)
                router.push("/")
            })
            .catch((error: AuthError) => {
                setError(getAuthErrorMessage(error.code))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const logout = async () => {
        setLoading(true)
        setError(null)
        signOut(auth)
            .then(() => {
                setUser(null)
                router.push("/login")
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
        signUp,
        signIn,
        logout,
        error,
        loading
    }), [user, loading, error])

    return (
        <AuthContext.Provider value={memoizedValue}>
            {!initialLoading && children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext)
}