import React, { useEffect, useState } from "react";
import FarmerHeader from "../../UI/FarmerHeader";
import Button from "../../UI/Button";
import { getProducts, updateProducts, addProduct } from "../../api/farmerApi"; // <- make sure addProduct exists
import * as Yup from "yup";
import { toast } from "react-toastify";

export const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [updateProduct, setUpdateProduct] = useState(null); // selected product for edit
    const [previewImage, setPreviewImage] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const [formValues, setFormValues] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        product_img: null, // file
    });

    // 🧾 Yup schema
    const ProductSchema = Yup.object().shape({
        name: Yup.string().required("Product name is required"),
        description: Yup.string().required("Description is required"),
        price: Yup.number()
            .typeError("Price must be a number")
            .required("Price is required"),
        stock: Yup.number()
            .typeError("Stock must be a number")
            .required("Stock is required"),
    });

    useEffect(() => {
        getAllProducts();
    }, []);

    const getAllProducts = async () => {
        try {
            const products = await getProducts();
            setProducts([...products].reverse());
            console.log("Products:", products);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch products");
        }
    };

    // 🔹 Open modal in ADD mode
    const handleAddClick = () => {
        setIsEditMode(false);
        setUpdateProduct(null);
        setFormValues({
            name: "",
            description: "",
            price: "",
            stock: "",
            product_img: null,
        });
        setPreviewImage(null);
        setFormErrors({});
        setIsModalOpen(true);
    };

    // 🔹 Open modal in EDIT mode
    const handleEdit = (id) => {
        const product = products.find((p) => p.product_id === id);
        if (!product) return;

        setIsEditMode(true);
        setUpdateProduct(product);

        setFormValues({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            stock: product.stock || "",
            product_img: null, // user can choose new one
        });

        setPreviewImage(product.img_url || null);
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUpdateProduct(null);
        setPreviewImage(null);
        setFormErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormValues((prev) => ({
            ...prev,
            product_img: file || null,
        }));
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        try {
            // ✅ Validate form
            await ProductSchema.validate(formValues, { abortEarly: false });

            const formData = new FormData();
            formData.append("name", formValues.name);
            formData.append("description", formValues.description);
            formData.append("price", formValues.price);
            formData.append("stock", formValues.stock);

            // only append file if selected
            if (formValues.product_img) {
                formData.append("product_img", formValues.product_img);
            }

            if (isEditMode && updateProduct) {
                // 🔹 UPDATE
                await updateProducts(updateProduct.product_id, formData);
                toast.success("Product updated successfully");
            } else {
                // 🔹 ADD (make sure addProduct API exists)
                await addProduct(formData);
                toast.success("Product added successfully");
            }

            handleCloseModal();
            await getAllProducts();
        } catch (err) {
            // Yup validation error
            if (err.name === "ValidationError") {
                const errors = {};
                err.inner.forEach((e) => {
                    if (!errors[e.path]) {
                        errors[e.path] = e.message;
                    }
                });
                setFormErrors(errors);
            } else {
                console.error(err);
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <div>
            <FarmerHeader />
            <div className="px-[10vw] pt-7 flex flex-col gap-7 mb-10">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Manage Products</h2>
                    <Button onClick={handleAddClick}>Add Product</Button>
                </div>

                <div className="flex flex-col">
                    <div className="grid grid-cols-5 border border-b-2 border-gray-200 py-2.5 pl-4 rounded-t-xl font-semibold">
                        <p>Product</p>
                        <p>Name</p>
                        <p>Price</p>
                        <p>Stock</p>
                        <p>Action</p>
                    </div>

                    {products.length === 0 && (
                        <div className="border border-t-0 border-gray-200 py-5 pl-5 rounded-b-xl">
                            <p className="text-gray-500">No products found.</p>
                        </div>
                    )}

                    {products.map((product, index) => (
                        <div
                            key={product.product_id || index}
                            className={`grid grid-cols-5 items-center border border-t-0 border-gray-200 py-5 pl-5 ${index === products.length - 1 ? "rounded-b-xl" : ""
                                }`}
                        >
                            <div className="h-16 w-16 overflow-hidden flex-shrink-0 rounded-2xl">
                                <img
                                    src={product.img_url}
                                    alt="Product"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p>{product.name}</p>
                            <p>₹{product.price}</p>
                            <p>{product.stock} kg</p>
                            <button
                                className="w-fit text-green-700 hover:cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => handleEdit(product.product_id)}
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔹 MODAL POPUP */}
            {isModalOpen && (
                <div
                    className="fixed top-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-500/50"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white relative p-6 rounded-2xl shadow-xl w-[90vw] max-w-[480px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <svg
                            className="w-7 h-7 hover:scale-105 hover:cursor-pointer absolute right-4 top-4"
                            onClick={handleCloseModal}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M6 6L18 18M6 18L18 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>

                        <h2 className="text-xl font-semibold mb-4">
                            {isEditMode ? "Edit Product" : "Add Product"}
                        </h2>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            {/* Name */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                />
                                {formErrors.name && (
                                    <span className="text-xs text-red-500">
                                        {formErrors.name}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    value={formValues.description}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                />
                                {formErrors.description && (
                                    <span className="text-xs text-red-500">
                                        {formErrors.description}
                                    </span>
                                )}
                            </div>

                            {/* Price + Stock */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formValues.price}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    {formErrors.price && (
                                        <span className="text-xs text-red-500">
                                            {formErrors.price}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">Stock (kg)</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formValues.stock}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    {formErrors.stock && (
                                        <span className="text-xs text-red-500">
                                            {formErrors.stock}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Image Upload + Preview */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Product Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="text-sm bg-gray-200 p-2 w-fit rounded-[6px] hover:cursor-pointer"
                                />
                                {previewImage && (
                                    <div className="mt-2 h-24 w-24 rounded-xl overflow-hidden border border-gray-200">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                >
                                    {isEditMode ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
