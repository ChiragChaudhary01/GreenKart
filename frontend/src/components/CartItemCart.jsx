import { useEffect, useState } from 'react'
import Button from '../UI/Button';
import { useNavigate } from 'react-router-dom';

const CartItemCart = ({ product, onQuantityChange, onDelete }) => {
    const [quantity, setQty] = useState(product.quantity);
    const navigate = useNavigate();

    const handleDecrease = async () => {
        if (quantity > 1) {
            const newQty = quantity - 1;
            setQty(newQty); // update local state
            await onQuantityChange(product.cart_id, newQty);
        }
    }

    const handleIncrease = async () => {
        const newQty = quantity + 1;
        setQty(newQty);
        await onQuantityChange(product.cart_id, newQty);
    }

    const handleDelete = async () => {
        await onDelete(product.cart_id);
    }
    console.log(product);

    return (
        <div className='flex justify-between items-center shadow rounded-2xl p-0.5'>
            <div className='flex gap-8 items-center'>
                <img src={product.img_url} alt="" className='object-cover h-25 w-30 rounded-2xl' />
                <div className='flex flex-col gap-3 text-left'>
                    <h4>{product.name}</h4>
                    <div className='flex gap-2 text-green-600'>
                        <p>Price: {product.price}₹,</p>
                        <p>{product.quantity}</p>
                    </div>
                </div>
            </div>
            <div className='flex gap-5'>
                <div className='flex items-center'>
                    <button
                        className='bg-gray-400 px-3 rounded-[5px] hover:bg-gray-500 hover:cursor-pointer duration-300 text-white text-xl'
                        onClick={handleDecrease}
                    >
                        -
                    </button>

                    <p className='px-2'>{quantity}</p>

                    <button
                        className='bg-gray-400 px-3 rounded-[5px] hover:bg-gray-500 hover:cursor-pointer duration-300 text-white text-xl'
                        onClick={handleIncrease}
                    >
                        +
                    </button>
                </div>
                <Button variant='primary' onClick={() => navigate(`/checkout/${product.cart_id}`)}>Place Order</Button>
                <Button variant='danger' onClick={() => handleDelete()}>Delete</Button>
            </div>
        </div>
    )
}

export default CartItemCart
