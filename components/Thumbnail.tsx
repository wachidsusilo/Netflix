import { Movie } from '../typings'
import Image from 'next/image'
import { useSetRecoilState } from 'recoil'
import { modalState, movieState } from '../atoms/modelAtom'
import { DocumentData } from '@firebase/firestore'

interface Props {
    movie: Movie | DocumentData
}

const Thumbnail = ({movie}: Props) => {
    const setShowModal = useSetRecoilState(modalState)
    const setCurrentMovie = useSetRecoilState(movieState)

    return (
        <div className="relative h-28 min-w-[180px] cursor-pointer
        transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105"
             onClick={() => {
                 setCurrentMovie(movie)
                 setShowModal(true)
             }}>
            <Image
                src={`https://image.tmdb.org/t/p/w500${
                    movie.backdrop_path || movie.poster_path
                }`}
                className="rounded-sm object-cover md:rounded"
                layout="fill"
            />
            <div className="absolute w-full h-full bg-gradient-to-t from-[#181818] via-transparent top-0 left-0 opacity-0 hover:opacity-100 transition
            flex items-end p-2 text-sm text-shadow-md">
                {movie?.title}
            </div>
        </div>
    )
}

export default Thumbnail