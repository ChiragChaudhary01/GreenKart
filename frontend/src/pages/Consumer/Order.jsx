import React, { useEffect, useState } from 'react';
import ConsumerHeader from '../../UI/ConsumerHeader';
import { getOrderHistory } from '../../api/consumerApi';

const Order = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const res = await getOrderHistory();
                console.log(res);
                setOrders(res);
            } catch (error) {
                console.error(error);
            }
        };
        getOrders();
    }, []);

    return (
        <div>
            <ConsumerHeader />

            <div className='px-[10vw] py-5'>
                <h2 className='text-xl font-semibold'>Order History</h2>

                <div className='mt-4 space-y-4'>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <div
                                key={index}
                                className='p-4 shadow-sm rounded-2xl bg-white flex justify-between'
                            >
                                <div className='flex flex-col gap-1'>
                                    <h3 className='font-medium text-lg'>
                                        {order.product_name}, Order #{order.order_id}
                                    </h3>
                                    <p className='text-green-600 text-sm'>
                                        Ordered on: <span className='text-green-500'>{new Date(order.created_at).toLocaleString()} </span><span className='text-black'>| </span>
                                        Delivery Status: <span className='text-green-500'>{order.delivery_status ? order.delivery_status : "not assigned"}</span>
                                    </p>
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <p className='text-gray-700'>
                                        Quantity: {order.quantity}
                                    </p>

                                    <p className='text-gray-700'>
                                        Total Amount: ₹{order.total_amount}
                                    </p>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className='text-gray-500'>No orders found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Order;
