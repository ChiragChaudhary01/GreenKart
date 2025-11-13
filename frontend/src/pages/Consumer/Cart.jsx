import React, { useEffect, useState } from 'react'
import ConsumerHeader from '../../UI/ConsumerHeader'
import { deleteFromCart, setQuantity, viewCart } from '../../api/consumerApi';
import CartItemCart from '../../components/CartItemCart';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);

    const fetchCartItems = async () => {
        const response = await viewCart();
        console.log(response);
        setCartItems(response);
        const Total = response.reduce((a, b) => a + Number(b.price * b.quantity), 0);
        setSubTotal(Total);
        console.log(subTotal);
        console.log(cartItems);
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleQuantityChange = async (cartId, newQuantity) => {
        await setQuantity(cartId, newQuantity);
        fetchCartItems();
    }

    const handleDelete = async (cartId) => {
        await deleteFromCart(cartId);
        fetchCartItems();
    }

    return (
        <div>
            <ConsumerHeader></ConsumerHeader>
            <div className='px-[10vw] py-7'>
                <h2>Shopping Cart</h2>
                <div className='flex py-2 w-full'>
                    {cartItems && cartItems.length > 0 ?
                        <div className="flex flex-col py-3 gap-5 w-full">
                            {cartItems.map((product, index) => (
                                <CartItemCart product={product} onQuantityChange={handleQuantityChange} onDelete={handleDelete} key={index} />
                            ))}
                        </div>
                        :
                        <p className="pt-10">No Products found.</p>
                    }
                </div>
                <div>
                    <h4>SubTotal</h4>
                    <p className=' text-green-600'>₹ {subTotal}</p>
                </div>
            </div>
        </div>
    )
}

export default Cart
