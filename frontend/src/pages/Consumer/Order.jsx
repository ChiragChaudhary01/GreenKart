import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ConsumerHeader from '../../UI/ConsumerHeader';
import { viewAddress, viewCart } from '../../api/consumerApi';
import Button from '../../UI/Button';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';

const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};


const Order = () => {
    const { id } = useParams();
    const [cartItem, setCartItem] = useState(null);
    const [addresses, setAddresses] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const fetchCartItem = async () => {
        const response = await viewCart();
        const tempCartItem = response.filter((product) => product.cart_id == id);
        const tempAddresses = await viewAddress();
        setCartItem(tempCartItem[0]);
        setAddresses(tempAddresses);
    }
    console.log(cartItem);
    console.log(addresses);
    useEffect(() => {
        fetchCartItem();
    }, []);

    const handleUseThisAddress = (index) => {
        setSelectedAddress(addresses[index]);
    };

    const handleChangeAddress = () => {
        setSelectedAddress(null);
    }

    // Build object Schema
    const orderSchema = Yup.object().shape({
        address_line: Yup.string().required("required"),
        city: Yup.string().max(100, "Must be no more than 100 characters").required("required"),
        state: Yup.string().max(100, "Must be no more than 100 characters").required("required"),
        pincode: Yup.string().min(6, "Must be 6 characters").required("required"),
    });

    const handlePayment = async (address) => {
        console.log("Payment started with address:", address);

        const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            alert("Razorpay SDK failed to load. Check your internet connection.");
            return;
        }
        console.log("Razorpay SDK loaded ✅");

        const amount = cartItem.quantity * cartItem.price * 1.08 + 5;
        console.log("Amount to pay:", amount);

        try {
            const order = await axios.post("http://localhost:5000/api/payment/create-order", { amount });
            console.log("Order created:", order.data);

            const options = {
                key: order.data.key,
                amount: order.data.amount,
                currency: order.data.currency,
                name: "GreenKart",
                description: "Order Payment",
                order_id: order.data.id,
                handler: function (response) {
                    alert("Payment successful!");
                    console.log("Payment response:", response);
                },
                prefill: {
                    name: "Chirag Chaudhary",
                    email: "chirag@example.com",
                    contact: "9999999999",
                },
                theme: { color: "#3399cc" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            console.error("Payment error:", err);
            alert("Error while creating order. Check console for details.");
        }
    };



    return (
        <div>
            <ConsumerHeader />
            {cartItem ?
                <div className='px-[10vw] py-5 flex flex-col gap-4'>
                    <h2>Chekout {cartItem.name}</h2>
                    <Formik
                        initialValues={selectedAddress ? {
                            address_line: selectedAddress.address_line,
                            city: selectedAddress.city,
                            state: selectedAddress.state,
                            pincode: selectedAddress.pincode
                        } : {
                            address_line: '',
                            city: '',
                            state: '',
                            pincode: ''
                        }}
                        validationSchema={orderSchema}
                        onSubmit={async (values) => {
                            const addressToUse = selectedAddress || values;

                            // check if address is empty
                            if (!addressToUse.address_line || !addressToUse.city || !addressToUse.state || !addressToUse.pincode) {
                                alert("Please select or fill an address before proceeding to payment.");
                                return;
                            }

                            await handlePayment(addressToUse);
                        }}
                    >
                        <Form className='flex flex-col gap-5'>
                            <div className='flex flex-col'>
                                <h4>1. Address</h4>=[-ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp]
                                {selectedAddress ?
                                    (
                                        <div className='flex flex-col gap-3 ml-3 mt-3'>
                                            <div className='flex items-center gap-3 bg-gray-100 py-2 px-4 rounded-xl justify-between'>
                                                <p>{selectedAddress.address_line}, {selectedAddress.city}, {selectedAddress.pincode}, {selectedAddress.state}</p>
                                                <Button onClick={handleChangeAddress}>Change Address</Button>
                                            </div>
                                            <Button onClick={() => { setAddresses(null); setSelectedAddress(null); }} more='w-40'>Add new Address</Button>
                                        </div>
                                    )
                                    :
                                    (
                                        <div className='ml-3 mt-3'>
                                            {addresses && addresses.length > 0 ?
                                                <div className='flex flex-col gap-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        {
                                                            addresses.map((address, index) => (
                                                                <div className='flex items-center gap-3 bg-gray-100 py-2 px-4 rounded-xl justify-between' key={index}>
                                                                    <p>{address.address_line}, {address.city}, {address.pincode}, {address.state}</p>
                                                                    <Button variant='secondary' onClick={() => handleUseThisAddress(index)}>Use this Address</Button>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                    <Button onClick={() => setAddresses(null)} more='w-40'>Add new Address</Button>
                                                </div>
                                                :
                                                (
                                                    <div className='flex flex-col'>
                                                        <div className='flex gap-5'>
                                                            <div className="formItemDiv">
                                                                <label htmlFor="address_line">Address Line</label>
                                                                <Field type="text" name="address_line" placeholder="Ganpat University, Kerva" className="field" />
                                                                <ErrorMessage component="div" name='address_line' className="errorMessage" />
                                                            </div>
                                                            <div className="formItemDiv">
                                                                <label htmlFor="city">City</label>
                                                                <Field type="text" name="city" placeholder="Mehsana" className="field" />
                                                                <ErrorMessage component="div" name='city' className="errorMessage" />
                                                            </div>
                                                        </div>
                                                        <div className='flex gap-5'>
                                                            <div className="formItemDiv">
                                                                <label htmlFor="state">State</label>
                                                                <Field type="text" name="state" placeholder="Gujrat" className="field" />
                                                                <ErrorMessage component="div" name='state' className="errorMessage" />
                                                            </div>
                                                            <div className="formItemDiv">
                                                                <label htmlFor="pincode">Pincode</label>
                                                                <Field type="text" name="pincode" placeholder="384001" className="field" />
                                                                <ErrorMessage component="div" name='pincode' className="errorMessage" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                            </div>
                            <div className='flex flex-col gap-3'>
                                <h4>2. Order Summary</h4>
                                <div className='flex flex-col w-full gap-2'>
                                    <div className='flex w-full justify-between items-center bg-gray-100 p-3 rounded-xl'>
                                        <div>
                                            <h5>Subtotal</h5>
                                            <p className='text-green-700'>{cartItem.quantity} items</p>
                                        </div>
                                        <p>₹{(cartItem.quantity * cartItem.price).toFixed(2)}</p>
                                    </div>
                                    <div className='flex w-full justify-between items-center bg-gray-100 p-3 rounded-xl'>
                                        <div>
                                            <h5>Shipping</h5>
                                            <p className='text-green-700'>standard</p>
                                        </div>
                                        <p>₹5</p>
                                    </div>
                                    <div className='flex w-full justify-between items-center bg-gray-100 p-3 rounded-xl'>
                                        <div>
                                            <h5>Tax</h5>
                                            <p className='text-green-700'>Estimated Tax</p>
                                        </div>
                                        <p>₹{(cartItem.quantity * cartItem.price * 0.08).toFixed(2)}</p>
                                    </div>
                                    <div className='flex w-full justify-between items-center bg-gray-100 p-3 rounded-xl'>
                                        <div>
                                            <h5>Total</h5>
                                            <p className='text-green-700'>Total amount</p>
                                        </div>
                                        <p>₹{(cartItem.quantity * cartItem.price * 1.08 + 5).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            <Button more='mt-5' type='submit'>Pay Now</Button>
                        </Form>
                    </Formik>
                </div > :
                <h4 className='px-[10vw] py-5'>Product not found.</h4>
            }
        </div >
    )
}

export default Order
