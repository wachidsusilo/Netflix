import { Product } from '@stripe/firestore-stripe-payments'
import { CheckIcon } from '@heroicons/react/outline'

interface Props {
    products: Array<Product>,
    selectedPlan: Product | null
}

const Table = ({products, selectedPlan}: Props) => {
    return (
        <table>
            <tbody className="divide-y">
            <tr className="tableRow">
                <td className="tableDataTitle">Monthly price</td>
                {
                    products.map((product) => (
                        <td
                            key={product.id}
                            className={`tableDataFeature ${selectedPlan?.id === product.id ? "text-[#e50914]" : "text-[gray]"}`}>
                            USD{(product.prices[0]?.unit_amount ?? 0) / 100}
                        </td>
                    ))
                }
            </tr>
            <tr className="tableRow">
                <td className="tableDataTitle">Video Quality</td>
                {
                    products.map((product) => (
                        <td
                            key={product.id}
                            className={`tableDataFeature ${selectedPlan?.id === product.id ? "text-[#e50914]" : "text-[gray]"}`}>
                            {product.metadata.videoQuality}
                        </td>
                    ))
                }
            </tr>
            <tr className="tableRow">
                <td className="tableDataTitle">Watch on your TV, computer, mobile phone and tablet</td>
                {
                    products.map((product) => (
                        <td
                            key={product.id}
                            className={`tableDataFeature ${selectedPlan?.id === product.id ? "text-[#e50914]" : "text-[gray]"}`}>
                            {
                                product.metadata.portability === 'true' && (<CheckIcon className="inline-block h-8 w-8" />)
                            }
                        </td>
                    ))
                }
            </tr>
            </tbody>
        </table>
    )
}

export default Table