const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (

        <footer className="h-72 w-3/4 rounded-xl mx-auto flex flex-col justify-center p-12 bg-[#EADCDC]">
            <img className="w-60 mb-4 cursor-pointer" src="files/DP-logo.png" alt="" />
            <p className="border-t border-gray-400 py-4">
                Copyright © {currentYear} DIESELPOWER s.r.o. | All Rights Reserved | Powered by Vite.js
            </p>
        </footer>
    );
};

export default Footer;