import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HeaderEshop() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <>
            <header className="bg-bglight">
                <div className="flex flex-row justify-between items-center py-3 mx-6 border-b">
                    <div className="flex flex-row gap-2 w-[165px]">
                        <a href="">
                            <img src="files/instagram.png" className="h-4" alt="Instagram" />
                        </a>
                        <a href="">
                            <img src="files/facebook.png" className="h-4" alt="Facebook" />
                        </a>
                    </div>
                    <div className="flex flex-row gap-4 items-center font-semibold">
                        <a className="hover:underline transition-all" href="tel:+420-724-379-112">
                            +420 724 379 112
                        </a>
                        <a href="mailto:form@dieselpower.cz" className="hover:underline transition-all">
                            form@dieselpower.cz
                        </a>
                    </div>
                    <div className="flex flex-row w-[165px] justify-end">
                        {isAuthenticated ? (
                            <div className="flex flex-row items-center gap-2">
                                <span className="text-gray-700">{user?.name}</span>
                                <button onClick={logout} className="text-red-600 hover:underline">
                                    Odhlásit se
                                </button>
                                <Link to="/cart">
                                    <img src="files/shopping-cart.png" className="h-8" alt="E-Shop" />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-red-600 hover:underline border-r border-red-600 pr-2">
                                    Přihlášení
                                </Link>
                                <Link to="/register" className="text-red-600 hover:underline pl-2">
                                    Registrace
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}

export default HeaderEshop;
