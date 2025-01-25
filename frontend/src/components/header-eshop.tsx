import { Link } from "react-router-dom";

function headereshop() {
    return (
        <>
            <header className="bg-bglight">
                <div className="flex flex-row justify-between items-center py-3 mx-6 border-b">
                    {/* pozor na static width, díky tomu funguje sice middle div, ale může se rozbít */}
                    <div className="flex flex-row gap-2 w-[165px]">
                        <a href="">
                            <img src="files/instagram.png" className="h-4" alt="Instagram" />
                        </a>
                        <a href="">
                            <img src="files/facebook.png" className="h-4" alt="Facebook" />
                        </a>
                    </div>
                    <div className="flex flex-row gap-4 items-center font-semibold">
                        <a className="hover:underline transition-all" href="tel:+420-724-379-112">+420 724 379 112</a>
                        <a href="mailto:form@dieselpower.cz" className="hover:underline transition-all">form@dieselpower.cz</a>
                    </div>
                    <div className="flex flex-row w-[165px] justify-end">
                        <a className="text-red-600 hover:underline border-r border-red-600 pr-2">
                            <Link to="/login">
                                Přihlášení
                            </Link>
                        </a>
                        <a className="text-red-600 hover:underline pl-2">
                            <Link to="/register">
                                Registrace
                            </Link>
                        </a>
                    </div>
                </div>

                <div className="flex justify-between items-center py-6 px-6">
                    <div className="flex items-center space-x-4 gap-8">
                        <a href="" className='h-full flex items-center cursor-pointer hover:scale-[1.015] transition-transform duration-300'>
                            <img
                                src="files/DP-logo.png"
                                alt="Logo"
                                className='h-8'
                            />
                        </a>
                        <input
                            type="text"
                            placeholder="Zadejte hledaný výraz..."
                            className=" border-gray-100 rounded-lg px-4 py-2 w-96 bg-white shadow-md hover:bg-slate-50 transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-8 text-sm">
                        <div className="relative">
                            <button className="flex items-center space-x-2">
                                <img className="h-6" src="files/shopping-cart.png"></img>
                                <span>0 Kč</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default headereshop