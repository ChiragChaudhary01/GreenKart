import { useEffect, useState } from 'react'
import AdminHeader from '../../UI/AdminHeader'
import { getAllOrders, getAllUsers, assignOrder } from '../../api/adminApi';

const Assign = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [clicked, setClicked] = useState();


    useEffect(() => {
        getOrders();
        getUsers();
    }, []);

    const getOrders = async () => {
        try {
            let orders = await getAllOrders();
            orders = orders.filter((order) => order.delivery_status == null);
            setOrders(orders);
        } catch (error) {
            toast.error(error);
        }
    }

    const getUsers = async () => {
        try {
            let users = await getAllUsers();
            users = users.filter((user) => user.role === "delivery");
            setUsers(users);
        } catch (error) {
            toast.error(error);
        }
    }

    const handleOrderAssignPopUp = async (id) => {
        setClicked(id);
    }

    const handleOrderAssign = async (id) => {
        try {
            await assignOrder(clicked, id);
            getOrders();
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <div>
            <AdminHeader />
            <div className='px-[10vw] pt-7 flex flex-col gap-6'>
                <h2>Assign Delivery Person</h2>
                <div className='flex flex-col'>
                    <h5 className='mb-5'>Orders Awaiting Delivery</h5>
                    <div className='grid grid-cols-6 border border-b-2 border-gray-200 py-2.5 pl-4 rounded-t-xl'>
                        <p>Order ID</p>
                        <p>Customer</p>
                        <p>Order Date</p>
                        <p>Total</p>
                        <p>Status</p>
                        <p>Action</p>
                    </div>
                    {orders.length > 0 ? orders.map((order, index) => (
                        <div key={index} >
                            <div className={`grid grid-cols-6 items-center border border-t-0 border-gray-200 py-5 pl-5 ${(index === orders.length - 1 && order.order_id != clicked) ? "rounded-b-xl" : ""}`} >
                                <p>{order.order_id}</p>
                                <p>{order.consumer_name}</p>
                                <p>{new Date(order.created_at).toISOString().split("T")[0]}</p>
                                <p>{order.total_amount}</p>
                                <div>
                                    <div className={`text-blue-600 flex rounded-[8px] font-bold`}>
                                        {"pending"}
                                    </div>
                                </div>
                                <button className='w-fit px-3 py-1 rounded-[5px] text-gray-800 font-medium bg-green-300 hover:cursor-pointer hover:scale-105' onClick={() => handleOrderAssignPopUp(order.order_id)}>Assign</button>
                            </div>
                            {order.order_id === clicked ?
                                <div className='bg-green-100'>
                                    <div className='grid grid-cols-3 border border-t-0 border-b-green-200 border-gray-200 py-2.5 pl-[8vw]'>
                                        <p>Delivery Person</p>
                                        <p>Mobile Number</p>
                                        <p>Action</p>
                                    </div>
                                    <div className={`riditems-center border border-t-0 border-gray-200 pl-[8vw] ${(index === orders.length - 1) ? "rounded-b-xl" : ""}`}>
                                        {users.map((delivery, index) => (
                                            <div key={index} className='grid grid-cols-3 p-2'>
                                                <div>{delivery.user_name}</div>
                                                <div>{delivery.phone}</div>
                                                <button className='flex text-green-700 hover:cursor-pointer hover:font-medium' onClick={() => handleOrderAssign(delivery.user_id)}>Assign</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                : ""
                            }
                        </div>
                    )) :
                        <p className='p-5'>
                            Pending Orders not found.
                        </p>
                    }
                </div>
            </div>
        </div>
    )
}

export default Assign