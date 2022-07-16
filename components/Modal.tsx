import MuiModal from '@mui/material/Modal'
import { useRecoilState, useRecoilValue } from 'recoil'
import { modalState, movieState } from '../atoms/modelAtom'
import { PlusIcon, ThumbUpIcon, VolumeOffIcon, VolumeUpIcon, XIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { Genre, Movie, MovieType } from '../typings'
import { DocumentData } from '@firebase/firestore'
import ReactPlayer from 'react-player/lazy'
import { FaPlay } from 'react-icons/fa'

const getMovieUrl = (movie: Movie | DocumentData | null) => {
    return `https://api.themoviedb.org/3/${
        movie?.media_type === 'tv' ? 'tv' : 'movie'
    }/${movie?.id}?api_key=${
        process.env.NEXT_PUBLIC_API_KEY
    }&language=en-US&append_to_response=videos`
}

const Modal = () => {
    const [showModal, setShowModal] = useRecoilState(modalState)
    const movie = useRecoilValue(movieState)
    const [trailer, setTrailer] = useState('')
    const [genres, setGenres] = useState<Array<Genre>>([])
    const [muted, setMuted] = useState(true)

    useEffect(() => {
        if (!movie) return

        fetch(getMovieUrl(movie))
            .then((response) => {
                response.json().then((data) => {
                    if (data?.videos) {
                        const key = data.videos.results.find((e: MovieType) => e.type === 'Trailer')?.key
                        setTrailer(key ?? '')
                    }
                    if (data?.genres) {
                        setGenres(data.genres)
                    }
                })
            })
    }, [movie])

    const handleClose = () => {
        setShowModal(false)
    }

    return (
        <MuiModal
            className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
            open={showModal}
            onClose={handleClose}>
            <>
                <button
                    className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]"
                    onClick={handleClose}>
                    <XIcon className="h-6 w-6"/>
                </button>
                <div className="relative pt-[56.25%] bg-black">
                    <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${trailer}`}
                        width="100%"
                        height="100%"
                        style={{position: 'absolute', top: 0, left: 0}}
                        playing
                        muted={muted}
                    />
                    <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
                        <div className="flex space-x-2">
                            <button
                                className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6] active:scale-95">
                                <FaPlay className="h-7 w-7 text-black"/>
                                Play
                            </button>
                            <button className="modalButton active:scale-95">
                                <PlusIcon className="h-7 w-7"/>
                            </button>
                            <button className="modalButton active:scale-95">
                                <ThumbUpIcon className="h-7 w-7"/>
                            </button>
                        </div>
                        <button
                            className="modalButton active:scale-95"
                            onClick={() => setMuted(!muted)}>
                            {
                                muted ?
                                    <VolumeOffIcon className="h-6 w-6"/>
                                    :
                                    <VolumeUpIcon className="h-6 w-6"/>
                            }
                        </button>
                    </div>
                </div>
                <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
                    <div className="space-y-6 text-lg">
                        <div className="space-y-1.5">
                            <p className="text-2xl">{movie?.title}</p>
                            <div className="flex items-center space-x-2 text-sm">
                                <p className="font-semibold text-green-400">{(movie?.vote_average ?? 0) * 10}% Match</p>
                                <p className="font-light">{movie?.release_date || movie?.first_air_date}</p>
                                <div
                                    className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">HD
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
                            <p className="w-5/6">{movie?.overview}</p>
                            <div className="flex flex-col space-y-3 text-sm">
                                <div>
                                    <span className="text-[gray]">Genres: </span>
                                    {genres.map((genre) => genre.name).join(', ')}
                                </div>
                                <div>
                                    <span className="text-[gray]">Original language: </span>
                                    {movie?.original_language}
                                </div>
                                <div>
                                    <span className="text-[gray]">Total votes: </span>
                                    {movie?.vote_count}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </MuiModal>
    )
}

export default Modal