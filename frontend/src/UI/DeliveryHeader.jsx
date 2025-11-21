import { NavLink } from "react-router-dom";

const DeliveryHeader = () => {
    const activeClass = "text-green-600 font-semibold";
    const inactiveClass = "text-gray-600 hover:text-green-600";

    return (
        <header className='header flex justify-between items-center px-[10vw] border-b border-solid border-b-[#e7f3e7]'>
            <div className="flex justify-between items-center gap-2">
                <img src="/GreenKart logo.jpeg" alt="" className="h-9 rounded-full" />
                <NavLink to="/" className={({ isActive }) => isActive ? activeClass : inactiveClass}>GreenKart</NavLink>
            </div>
            <div className="flex justify-between items-center gap-5 text-xl">
            </div>
        </header>
    )
}

export default DeliveryHeader
