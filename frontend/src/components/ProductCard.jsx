import { Link } from "react-router-dom"

const ProductCard = ({ product }) => {
    return (
        <div className='flex flex-col gap-3'>
            <Link to={`/products/${product.product_id}`}>
                <img src={product.img_url} alt="" className='h-70 object-cover rounded-xl hover:scale-102 duration-300' />
            </Link>
            <p className='text-[#1b501b] text-base font-medium leading-normal' >{product.name}</p>
        </div>
    )
}

export default ProductCard
