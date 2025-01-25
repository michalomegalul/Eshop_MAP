// import { useState } from 'react';
// import Nav from './nav-items'; // Ensure the file exists at this path

// const Header = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     const toggleMenu = () => {
//         setIsOpen(!isOpen);
//     };

//     return (
//         <header className='flex h-20 items-center justify-between tablet:justify-center tablet:px-6 px-20 relative' >
//     <img className='block tablet:hidden h-[42%] cursor-pointer' src="files/DP-logo.png" alt="" />
//     <img className='hidden tablet:block h-[48%]' src="files/DP-logo-small.png" alt="" />

//     <button
    
//         onClick={toggleMenu}
//         className='hidden tablet:block absolute right-6 focus:outline-none'
//     >
//         <svg className='w-8 h-8' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <line x1="3" y1="12" x2="21" y2="12" />
//             <line x1="3" y1="6" x2="21" y2="6" />
//             <line x1="3" y1="18" x2="21" y2="18" />
//         </svg>
//     </button>

//     <div className={`tablet:absolute tablet:top-20 tablet:flex-none static flex w-full z-10 bg-bgligh items-center justify-between ${isOpen ? 'block' : 'hidden'}`}>
//         <nav className='flex tablet:flex-col flex-row text-lg items-center'>
//             <Nav link="#" item="iFlash" />
//             <Nav link="#" item="Chiptuning" />
//             <Nav link="#" item="Recenze" />
//             <Nav link="#" item="Ceník" />
//             <Nav link="#" item="Produkty" />
//             <Nav link="#" item="Fórum" />
//             <Nav link="#" item="Kontakt" />
//         </nav>
//         <a href='https://shop.dieselpower.cz/' target="_blank" rel="noopener noreferrer" className='flex items-center bg-red-600 text-white px-6 py-3 gap-4 font-semibold rounded-[3px] mt-4 md:mt-0'>
//             <img className='h-5' src="/files/icon-shop.png" alt="" />
//             <p>
//                 E-Shop
//             </p>
//         </a>
//     </div>
//     </header>
//     );
// };

// export default Header;