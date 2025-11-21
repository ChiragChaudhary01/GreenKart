import React, { useEffect, useState } from 'react'
import AdminHeader from '../../UI/AdminHeader'
import { getAllOrders, getAllProducts, getAllUsers } from '../../api/adminApi'

const Overview = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const getProducts = async () => {
        try {
            const products = await getAllProducts();
            setProducts(products);
        } catch (error) {
            toast.error(error);
        }
    }

    const getOrders = async () => {
        try {
            const orders = await getAllOrders();
            setOrders(orders);
        } catch (error) {
            toast.error(error);
        }
    }

    const getUsers = async () => {
        try {
            const users = await getAllUsers();
            setUsers(users);
        } catch (error) {
            toast.error(error);
        }
    }

    useEffect(() => {
        getUsers();
        getProducts();
        getOrders();
    }, []);

    return (
        <div>
            <AdminHeader />
            <div className='px-[10vw] pt-7 flex flex-col gap-7'>
                <h2>Overview</h2>
                <div className='flex justify-between gap-4'>
                    <div className='bg-green-100 p-5 w-full flex flex-col rounded-xl text-xl gap-1'>
                        Total Users
                        <span className='text-3xl'>{users.length}</span>
                    </div>
                    <div className='bg-green-100 p-5 w-full flex flex-col rounded-xl text-xl gap-1'>
                        Total Orders
                        <span className='text-3xl'>{orders.length}</span>
                    </div>
                    <div className='bg-green-100 p-5 w-full flex flex-col rounded-xl text-xl'>
                        Total Products
                        <span className='text-3xl'>{products.length}</span>
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <h4>Recent Orders</h4>
                    <div className='flex flex-col pb-10'>
                        <div className='grid grid-cols-5 border border-b-2 border-gray-200 py-2.5 px-4 rounded-t-xl'>
                            <p>Order ID</p>
                            <p>User</p>
                            <p>Date</p>
                            <p>Status</p>
                            <p>Total</p>
                        </div>
                        {orders.map((order, index) => (
                            <div key={index} className={`grid grid-cols-5 border border-t-0 border-gray-200 py-5 px-5 ${(index === orders.length - 1) ? "rounded-b-xl" : ""}`} >
                                <p>#{order.order_id}</p>
                                <p>{order.consumer_name}</p>
                                <p>{new Date(order.created_at).toISOString().split("T")[0]}</p>
                                <div>
                                    <div className='bg-green-200 w-fit mr-10 p-5 py-1 flex justify-center rounded-[8px] font-bold text-gray-800'>
                                        {order.delivery_status ? order.delivery_status : "Not Assigned"}
                                    </div>
                                </div>
                                <p>{order.total_amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Overview