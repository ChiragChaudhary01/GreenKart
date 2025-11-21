import React, { useEffect, useState } from 'react'
import DeliveryHeader from '../../UI/DeliveryHeader'
import { getOrders, updateStatus } from '../../api/delivery';

const DeliveryDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [updateOrder, setUpdateOrder] = useState([]);

    useEffect(() => {
        setUpdateOrder(null);
    }, []);

    useEffect(() => {
        getDeliveryOrders();
    }, []);

    const getDeliveryOrders = async () => {
        try {
            const orders = await getOrders();
            setOrders([...orders].reverse());
        } catch (error) {
            toast.error(error);
        }
    };

    const handleUpdate = async (id) => {
        const updateOrder = orders.filter((order) => order.delivery_id === id);
        console.log(updateOrder[0]);
        setUpdateOrder(updateOrder[0]);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateStatus(id, status);
            setUpdateOrder(null);
            getDeliveryOrders();
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div>
            <DeliveryHeader />
            <div className='px-[10vw] pt-7 flex flex-col gap-7'>
                <h2>Delivery Dashboard</h2>
                <div className='flex flex-col'>
                    <div className='grid grid-cols-7 border border-b-2 gap-3 border-gray-200 py-2.5 pl-4 rounded-t-xl'>
                        <p>Order ID</p>
                        <p>Consumer</p>
                        <p className=' col-span-2'>Address</p>
                        <p>Item</p>
                        <p>Status</p>
                        <p>Action</p>
                    </div>
                    {orders.length == 0 ?
                        <div className='p-5'>
                            Order not Found
                        </div> :
                        orders.map((order, index) => (
                            <div key={index} className={`grid grid-cols-7 gap-3 items-center border border-t-0 border-gray-200 py-5 pl-5 ${(index === orders.length - 1) ? "rounded-b-xl" : ""}`} >
                                <p>{order.delivery_id}</p>
                                <p>{order.consumer_name}</p>
                                <p className=' col-span-2'>{order.consumer_address}</p>
                                <p>{order.name}</p>
                                <div>
                                    <div className={`${order.delivery_status === "assigned" ? "text-blue-700" : order.delivery_status === "in_progress" ? "text-yellow-700" : "text-green-700"} rounded-[8px] font-bold`}>
                                        {order.delivery_status}
                                    </div>
                                </div>
                                <div className='flex flex-col justify-center'>
                                    {order.delivery_status === "delivered" ?
                                        <div>
                                            <button className='bg-green-700 hover:cursor-pointer hover:scale-105 px-3 py-1 rounded-[7px] text-white' onClick={() => handleUpdate(order.delivery_id)}>View</button>
                                        </div>
                                        :
                                        <div>
                                            <button className='bg-blue-700 hover:cursor-pointer hover:scale-105 px-3 py-1 rounded-[7px] text-white' onClick={() => handleUpdate(order.delivery_id)}>Update</button >
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {updateOrder ?
                <div className='fixed top-0 flex justify-center items-center w-full h-full bg-gray-500/50' onClick={() => setUpdateOrder(null)}>
                    <div className='bg-white relative p-10 rounded-xl' onClick={(e) => e.stopPropagation()}>
                        <div className='flex gap-8'>
                            <div className="w-[300px] sm:w-[300px] md:w-[300px] h-[300px] sm:h-[350px] overflow-hidden flex-shrink-0">
                                <img src={updateOrder.img_url} alt="Product" className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <div className='flex flex-col gap-3'>
                                <div>
                                    <h2>{updateOrder.name}</h2>
                                </div>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='flex flex-col text-gray-600 font-semibold'>Quantity <span className='text-black text-[18px]'>{updateOrder.quantity}</span></div>
                                    <div className='flex flex-col text-gray-600 font-semibold'>Price per kg <span className='text-black text-[18px]'>{updateOrder.price} ₹</span></div>
                                    <div className='flex flex-col text-gray-600 font-semibold'>Order Status
                                        <span className='text-black text-[18px]'>
                                            <div className={`${updateOrder.delivery_status === "assigned" ? "text-blue-700" : updateOrder.delivery_status === "in_progress" ? "text-yellow-700" : "text-green-700"} rounded-[8px] font-bold`}>
                                                {updateOrder.delivery_status}
                                            </div>
                                        </span>
                                    </div>
                                    <div className='flex flex-col text-gray-600 font-semibold'>Delivery ID <span className='text-black text-[18px]'>#{updateOrder.delivery_id}</span></div>
                                    <div className='flex flex-col text-gray-600 font-semibold'>Assigned At
                                        <span className="text-black text-[18px]">
                                            {updateOrder?.assigned_at
                                                ? new Date(updateOrder.assigned_at).toLocaleDateString("en-IN")
                                                : "Not assigned"}
                                        </span>
                                    </div>
                                </div>
                                <div className='bg-gray-200 h-0.5'></div>
                                <div className='grid grid-cols-2 gap-6'>
                                    <div className='flex flex-col gap-1'>
                                        <h5>Consumer Details</h5>
                                        <div className='w-[17vw]'>
                                            <div>Name: <span className='text-gray-600'>{updateOrder.consumer_name}</span></div>
                                            <div>Phone: <span className='text-gray-600'>{updateOrder.consumer_phone}</span></div>
                                            <div>Address: <span className='text-gray-600'>{updateOrder.consumer_address}</span></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h5>Farmer Details</h5>
                                        <div className='w-[17vw]'>
                                            <div>Name: <span className='text-gray-600'>{updateOrder.farmer_name}</span></div>
                                            <div>Phone: <span className='text-gray-600'>{updateOrder.farmer_phone}</span></div>
                                            <div>Address: <span className='text-gray-600'>{updateOrder.farmer_address}</span></div>
                                        </div>
                                    </div>
                                </div>
                                {updateOrder.delivery_status == "assigned" ?
                                    <button className='bg-blue-600 text-white p-2 rounded-xl mt-4 hover:scale-101 cursor-pointer' onClick={() => handleStatusUpdate(updateOrder.delivery_id, "in_progress")}>Accept</button> :
                                    updateOrder.delivery_status == "in_progress" ?
                                        <button className='bg-green-600 text-white p-2 rounded-xl mt-4 hover:scale-101 cursor-pointer' onClick={() => handleStatusUpdate(updateOrder.delivery_id, "delivered")}>Delivered</button> :
                                        ""
                                }
                            </div>
                        </div>
                        <svg className="w-7 h-7 m-1 opacity-55 hover:scale-105 hover:cursor-pointer hover:opacity-75 rounded-full p-1 absolute top-0 right-0" onClick={() => setUpdateOrder(null)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" /></svg>
                    </div >
                </div >
                : ""}
        </div >
    )
};

export default DeliveryDashboard;