import { useState, useEffect } from 'react';
import Nav from './nav-items';
import { Link } from "react-router-dom";
import Dropdown from './Dropdown';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1500);
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1500);
        if (window.innerWidth >= 1500) {
            setIsOpen(false);
        }
    };

    const closeMenuOnScroll = () => {
        if (window.scrollY > 20) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', closeMenuOnScroll);

        const handleThemeChange = () => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        };
        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.documentElement, { attributes: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', closeMenuOnScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <header className='flex h-[70px] relative items-center justify-between tabletmax:px-6 px-20 tabletmax:justify-between bg-bglight dark:bg-bgdark text-textlight dark:text-textdark' >
            <div className='flex items-center justify-start h-full gap-20'>
                <a href="" className='h-full flex items-center tabletmax:left-1/2 tabletmax:absolute cursor-pointer hover:scale-[1.015] transition-transform duration-300'>
                    <img
                        src={isMobile ? "files/dp-logo-small.png" : isDarkMode ? "files/DP-logo-white.png" : "files/DP-logo.png"}
                        alt="Logo"
                        className='h-[42%]'
                    />
                </a>

                {/* Hamburger Button */}
                <div
                    onClick={toggleMenu}
                    className={`space-y-[5px] cursor-pointer ${isMobile ? 'block' : 'hidden'} z-50`}
                >
                    <span
                        className={`block w-8 h-[3px] bg-textlight dark:bg-textdark transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
                    ></span>
                    <span
                        className={`block w-8 h-[3px] bg-textlight dark:bg-textdark transition-all ${isOpen ? 'opacity-0' : ''}`}
                    ></span>
                    <span
                        className={`block w-8 h-[3px] bg-textlight dark:bg-textdark transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
                    ></span>
                </div>

                {/* Mobile & Desktop Navbar */}
                <nav className={`fixed top-[70px] left-0 text-textlight dark:text-textdark transition-all duration-300 transform z-50 tabletmax:w-full tabletmax:h-full ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } ${isMobile ? 'flex flex-col items-center bg-bglight dark:bg-bgdark' : 'tablet:flex tablet:justify-center tablet:static tablet:translate-x-0 tablet:bg-transparent'}`}
                >
                    <ul className="flex flex-col gap-0 w-full tablet:flex-row tablet:gap-14">
                        <Link to="/iflash">
                            <Nav link="/iflash" item="iFlash" onClick={() => setIsOpen(false)} />
                        </Link>
                        <Link to="/#">
                            <Nav link="/#" item="Chiptuning" onClick={() => setIsOpen(false)} />
                        </Link>
                        <Link to="/#">
                            <Nav link="/#" item="Recenze" onClick={() => setIsOpen(false)} />
                        </Link>
                        <Link to="/#">
                            <Nav link="/#" item="Ceník" onClick={() => setIsOpen(false)} />
                        </Link>
                        <Link to="/#">
                            <Nav link="/#" item="Produkty" onClick={() => setIsOpen(false)} />
                        </Link>

                        <Nav link="https://dieselpower.cz/forum/" item="Fórum" onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer" />

                        <Nav link="/#/team" item="Kontakt" onClick={() => setIsOpen(false)} />
                    </ul>
                    <a href='/#/eshop' target="_blank" rel="noopener noreferrer" className='tablet:hidden flex items-center bg-primary text-textdark px-6 py-3 gap-4 font-semibold rounded-[3px] mt-4 hover:bg-red-800 transition-all duration-300'>
                        <img className='h-5' src="/files/icon-shop.png" alt="" />
                        <p>
                            E-Shop
                        </p>
                    </a>
                </nav>
            </div>

            <div className='flex flex-row items-center gap-8'>
                <a href='/#/eshop' target="_blank" rel="noopener noreferrer" className='hidden tablet:flex flex-row items-center bg-primary text-textdark px-6 py-3 gap-4 font-semibold rounded-[3px] hover:bg-red-800 transition-all duration-300'>
                    <img className='h-5' src="/files/icon-shop.png" alt="" />
                    <p>
                        E-Shop
                    </p>
                </a>

                <Dropdown />
            </div>
        </header>
    );
};

export default Header;
