import { useEffect, useState } from "react"
import FarmerHeader from "../../UI/FarmerHeader"
import { getOrders } from "../../api/farmerApi"
import { toast } from "react-toastify"

const FarmerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [avgOrderValue, setAvgOrderValue] = useState(0);

    useEffect(() => {
        getAllOrders();
    }, []);

    const getAllOrders = async () => {
        try {
            const orders = await getOrders();
            const totalSales = orders.reduce((a, b) => a + Number(b.total_amount), 0);
            console.log(totalSales);
            setOrders(orders);
            setTotalSales(totalSales);
            setAvgOrderValue(totalSales / orders.length);
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div>
            <FarmerHeader />
            <div className='px-[10vw] pt-7 flex flex-col gap-7'>
                <h2>Overview</h2>
                <div className='flex justify-between gap-4'>
                    <div className='bg-green-100 p-5 w-full flex flex-col rounded-xl text-xl gap-1'>
                        Total Sales
                        <span className='text-3xl'>₹{totalSales}</span>
                    </div>
                    <div className='bg-green-100 p-5 w-full flex flex-col rounded-xl text-xl gap-1'>
                        Orders
                        <span className='text-3xl'>{orders.length}</span>
                    </div>
                    <div className='bg-green-100 p-5 w-full flex flex-col rounded-xl text-xl'>
                        Average Order Value
                        <span className='text-3xl'>₹{avgOrderValue}</span>
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <h4>Recent Orders</h4>
                    <div className='flex flex-col pb-10'>
                        <div className='grid grid-cols-5 border border-b-2 border-gray-200 py-2.5 px-4 rounded-t-xl'>
                            <p>Order ID</p>
                            <p>Consumer</p>
                            <p>Date</p>
                            <p>Status</p>
                            <p>Total</p>
                        </div>
                        {orders.map((order, index) => (
                            <div key={index} className={`grid grid-cols-5 border border-t-0 border-gray-200 py-5 px-5 ${(index === orders.length - 1) ? "rounded-b-xl" : ""}`} >
                                <p>#{order.order_id}</p>
                                <p>{order.user_name}</p>
                                <p>{new Date(order.created_at).toLocaleDateString("en-IN")}</p>
                                <div>
                                    <div className={`${order.order_status === "pending" ? "text-blue-700" : order.order_status === "confirmed" ? "text-yellow-600" : order.order_status === "shipped" ? "text-purple-600" : order.order_status === "delivered" ? "text-green-600" : "text-red-700"} rounded-[8px] font-bold`}>
                                        {order.order_status}
                                    </div>
                                </div>
                                <p>₹{order.total_amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default FarmerDashboard
