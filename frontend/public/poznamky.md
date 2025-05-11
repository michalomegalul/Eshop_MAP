<div className='w-full h-full flex justify-center items-center tablet:justify-start gap-10'>











import { useState, useEffect } from 'react';
import Nav from './nav-items';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1400);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1400);
        if (window.innerWidth >= 1400) {
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

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', closeMenuOnScroll);
        };
    }, []);

    return (
        <header className='flex h-20 items-center justify-between tabletmax:px-6 px-20 relative tabletmax:justify-end' >
            <img
                src={isMobile ? "files/dp-logo-small.png" : "files/DP-logo.png"}
                alt="Logo"
                className="h-[42%] tabletmax:left-1/2 tabletmax:absolute cursor-pointer"
            />
            
            {/* Hamburger Button */}
            <div
                onClick={toggleMenu}
                className={`space-y-[5px] cursor-pointer ${isMobile ? 'block' : 'hidden'} z-50`}
            >
                <span
                    className={`block w-8 h-[3px] bg-bgdark transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
                ></span>
                <span
                    className={`block w-8 h-[3px] bg-bgdark transition-all ${isOpen ? 'opacity-0' : ''}`}
                ></span>
                <span
                    className={`block w-8 h-[3px] bg-bgdark transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
                ></span>
            </div>


            {/* Mobile & Desktop Navbar */}
            <nav className={`fixed top-20 left-0 text-white transition-all duration-300 transform z-50 tabletmax:w-full tabletmax:h-full ${isOpen ? 'translate-x-0' : 'translate-x-full'
                } ${isMobile ? 'flex flex-col items-center bg-bglight' : 'tablet:flex tablet:justify-center tablet:static tablet:translate-x-0 tablet:bg-transparent'}`}
            >
                <ul className="flex flex-col gap-8 tablet:flex-row tablet:gap-14">
                    <Nav link="#" item="iFlash" onClick={() => setIsOpen(false)} />
                    <Nav link="#" item="Chiptuning" onClick={() => setIsOpen(false)} />
                    <Nav link="#" item="Recenze" onClick={() => setIsOpen(false)} />
                    <Nav link="#" item="Ceník" onClick={() => setIsOpen(false)} />
                    <Nav link="#" item="Produkty" onClick={() => setIsOpen(false)} />
                    <Nav link="#" item="Fórum" onClick={() => setIsOpen(false)} />
                    <Nav link="#" item="Kontakt" onClick={() => setIsOpen(false)} />
                </ul>
                <a href='https://shop.dieselpower.cz/' target="_blank" rel="noopener noreferrer" className='tablet:hidden flex items-center bg-red-600 text-white px-6 py-3 gap-4 font-semibold rounded-[3px] mt-4 md:mt-0'>
                    <img className='h-5' src="/files/icon-shop.png" alt="" />
                    <p>
                        E-Shop
                    </p>
                </a>
            </nav>

            <a href='https://shop.dieselpower.cz/' target="_blank" rel="noopener noreferrer" className={`flex items-center bg-red-600 text-white px-6 py-3 gap-4 font-semibold rounded-[3px] mt-4 md:mt-0 ${isMobile ? 'hidden' : 'block'}`}>
                <img className='h-5' src="/files/icon-shop.png" alt="" />
                <p>
                    E-Shop
                </p>
            </a>
        </header>
    );
};

export default Header;
