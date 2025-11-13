import { getAllByPincode, getAllFilteredProducts, getAllProducts } from "../../api/consumerApi";
import ProductCard from "../../components/ProductCard";
import ConsumerHeader from "../../UI/ConsumerHeader";
import { useDispatch } from "react-redux";

import React, { useEffect, useState, useRef } from 'react'
import Button from "../../UI/Button";

const BrowseProducts = () => {
    const [products, setProducts] = useState([]);
    const [pincode, setPincode] = useState(null);
    const [tempPincode, setTempPincode] = useState(null);
    const titleSearchTimeout = useRef(null);

    useEffect(() => {
        const savedPincode = localStorage.getItem("userPincode");
        if (savedPincode) {
            setPincode(savedPincode);
        }
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!pincode) return;
            const response = await getAllByPincode(pincode);
            console.log("getAllByPincode called", response);
            console.log(response);
            setProducts(response);
        };
        fetchProducts();
    }, [pincode]);

    const handleTitleChange = async (e) => {
        const name = e.target.value;
        // clear the previous timer so we don't trigger multiple requests
        clearTimeout(titleSearchTimeout.current);

        // set a new Timeout for one second
        titleSearchTimeout.current = setTimeout(async () => {
            const response = await getAllFilteredProducts(pincode, name);
            setProducts(response);
            console.log(e.target.value);
        }, 500);
    };

    const handlePincode = (e) => {
        setTempPincode(e.target.value);
    }

    const handlePincodeSubmit = () => {
        const trimmed = tempPincode.trim();

        // validate the pincode 
        const isValid = /^\d{6}/.test(trimmed);

        if (!isValid) {
            alert("Please enter a valid 6-digit pincode");
            return
        }

        // save pincode to localStorage
        localStorage.setItem("userPincode", trimmed);
        setPincode(trimmed);
    }
    return (
        <div>
            <ConsumerHeader />
            <div className="px-[10vw] pt-8 w-full">
                <div onChange={handleTitleChange} className="relative flex items-center gap-7 w-[100%]">
                    <img src="Search.png" alt="Search" className="opacity-30 h-4 absolute px-4" />
                    <input type="text" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1b0e] focus:outline-0 focus:ring-0 border-none bg-[#e7f3e7] focus:border-none h-full placeholder:text-[#4e974e] py-5 border-l-0 text-base font-normal leading-normal text-[13px] placeholder-shown:text-neutral-900 pl-10 sm:h-8 " placeholder="Search by title..." />
                </div>
                {products && products.length > 0 ?
                    <div className="grid grid-cols-5 gap-7 pt-7">
                        {products.map((product, index) => (
                            <ProductCard product={product} key={index} />
                        ))}
                    </div>
                    :
                    <p className="pt-10">No Products found.</p>
                }
            </div>
            {pincode ? <></> :
                <div className="fixed top-0 bg-[#00000086] h-full w-full flex justify-center items-center flex-col gap-5">
                    <div className="w-70 bg-white p-10 py-12 flex flex-col gap-4 rounded-2xl">
                        <input type="text" placeholder="Enter pincode" className="form-input resize-none overflow-hidden rounded-lg text-[#0e1b0e] bg-[#e7f3e7] placeholder:text-[#4e974e] py-3 px-2 border-l-0 text-base font-normal leading-normal text-[13px] placeholder-shown:text-neutral-900" value={pincode} onChange={handlePincode} />
                        <Button more="w-full" onClick={handlePincodeSubmit}>Submit</Button>
                    </div>
                </div>}
        </div >
    )
}

export default BrowseProducts
