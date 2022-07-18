import { useEffect, useState } from 'react'
import { Movie } from '../typings'
import { collection, deleteDoc, doc, DocumentData, onSnapshot, setDoc } from '@firebase/firestore'
import { db } from '../firebase'
import useAuth from './UseAuth'

const useMovieList = () => {
    const [myList, setMyList] = useState<Array<Movie | DocumentData>>([])
    const [isLoadingList, setIsLoadingList] = useState(false)
    const {user} = useAuth()

    const addMovie = async (movie: Movie | DocumentData | null) => {
        if (!user || !movie) {
            throw new Error(!user ?
                'You must be signed in to add movie into My List'
                :
                'There is an error occurred while adding movie into My List'
            )
        }
        setIsLoadingList(true)
        await setDoc(
            doc(db, 'customers', user.uid, 'myList', movie.id.toString()),
            {...movie}
        ).finally(() => setIsLoadingList(false))
    }

    const deleteMovie = async (movie: Movie | DocumentData | null) => {
        if (!user || !movie) {
            throw new Error(!user ?
                'You must be signed in to remove movie from My List'
                : 'There is an error occurred while removing movie from My List'
            )
        }
        setIsLoadingList(true)
        deleteDoc(doc(db, 'customers', user.uid, 'myList', movie.id.toString()))
            .finally(() => setIsLoadingList(false))
    }

    const isMovieExist = (movie: Movie | DocumentData | null) => {
        if (!movie) return false
        return myList.findIndex((m) => m.id == movie.id) !== -1
    }

    useEffect(() => {
        if (!user) return
        return onSnapshot(
            collection(db, 'customers', user.uid, 'myList'),
            (snapshot) => {
                setMyList(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                })))
            }
        )
    }, [db, user])

    return {myList, isLoadingList, addMovie, deleteMovie, isMovieExist}
}

export default useMovieList