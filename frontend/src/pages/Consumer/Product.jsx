import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductDetails } from '../../api/consumerApi';
import ConsumerHeader from '../../UI/ConsumerHeader';
import Button from "../../UI/Button";
import { addToCart } from '../../api/consumerApi';

const Product = () => {
    let { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            const product = await getProductDetails(id);
            setProduct(product[0]);
            console.log(product);
        }

        fetchProduct();
    }, []);

    const handleAddToCart = () => {
        addToCart(product.product_id, quantity);
    };

    return (
        product ?
            <div>
                <ConsumerHeader />
                <div className='flex flex-col px-[10vw] py-10 gap-7'>
                    <div className='flex gap-5'>
                        <div className="w-full sm:w-[300px] md:w-[400px] h-[250px] sm:h-[300px] overflow-hidden flex-shrink-0">
                            <img src={product.img_url} alt="Product" className="w-full h-full object-cover rounded-xl" />
                        </div>

                        <div className='flex flex-col gap-4'>
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5'>
                        <div className='flex items-center'>
                            <p className='pr-1'>Quantity:</p>
                            <button className='bg-gray-400 px-3 rounded-[5px] hover:bg-gray-500 hover:cursor-pointer duration-300 text-white text-xl' onClick={() => { if (quantity > 1) setQuantity(quantity - 1) }}>-</button>
                            <p className='px-2'>{quantity}</p>
                            <button className='bg-gray-400 px-3 rounded-[5px] hover:bg-gray-500 hover:cursor-pointer duration-300 text-white text-xl' onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <Button onClick={handleAddToCart}>Add to Cart</Button>
                    </div>
                </div>
            </div > :
            <p>Product not found.</p>
    )
}

export default Product
