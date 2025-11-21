import { useEffect, useState } from 'react';
import AdminHeader from '../../UI/AdminHeader'
import { getAllProducts, approveProduct, rejecteProduct } from '../../api/adminApi';
import { toast } from 'react-toastify';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const products = await getAllProducts();
            setProducts(products);
        } catch (error) {
            toast.error(error);
        }
    }

    const handleApprove = async (id) => {
        try {
            await approveProduct(id);
            getProducts();
        } catch (error) {
            toast.error(error);
        }
    }

    const handleReject = async (id) => {
        try {
            await rejecteProduct(id);
            getProducts();
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <div>
            <AdminHeader />
            <div className='px-[10vw] pt-7 flex flex-col gap-7'>
                <h2>Overview</h2>
                <div className='flex flex-col'>
                    <div className='grid grid-cols-6 border border-b-2 border-gray-200 py-2.5 pl-4 rounded-t-xl'>
                        <p>Product Name</p>
                        <p>Farmer Name</p>
                        <p>Price</p>
                        <p>stock</p>
                        <p>Status</p>
                        <p>Action</p>
                    </div>
                    {products.map((product, index) => (
                        <div key={index} className={`grid grid-cols-6 items-center border border-t-0 border-gray-200 py-5 pl-5 ${(index === products.length - 1) ? "rounded-b-xl" : ""}`} >
                            <p>{product.name}</p>
                            <p>{product.farmer_name}</p>
                            <p>{product.price}</p>
                            <p>{product.stock} kg</p>
                            <div>
                                <div className={`${product.status === "pending" ? "text-blue-700" : product.status === "approved" ? "text-green-700" : "text-red-700"} rounded-[8px] font-bold`}>
                                    {product.status}
                                </div>
                            </div>
                            <div className='flex flex-col justify-center'>
                                {product.status === "approved" ?
                                    <div>
                                        <button className='bg-red-300 hover:cursor-pointer hover:scale-105 px-2 py-1 rounded-[7px]' onClick={() => handleReject(product.product_id)}>Reject</button>
                                    </div>
                                    :
                                    product.status === "rejected" ?
                                        <div>
                                            <button className='bg-green-300 hover:cursor-pointer hover:scale-105 px-2 py-1 rounded-[7px]' onClick={() => handleApprove(product.product_id)}>Approve</button >
                                        </div>
                                        :
                                        <div>
                                            <button className='bg-green-300 hover:cursor-pointer hover:scale-105 px-2 py-1 rounded-l-[7px]' onClick={() => handleApprove(product.product_id)}>Approve</button ><button className='bg-red-300 hover:cursor-pointer hover:scale-105 px-2 py-1 rounded-r-[7px]' onClick={() => handleReject(product.product_id)}>Reject</button>
                                        </div>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Products
