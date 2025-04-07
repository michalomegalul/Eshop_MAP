import Header from '../components/header';
import Footer from '../components/footer';
import PricingTable from '../components/PricingTable';

const Cenik = () => {
    return (
        <div className="bg-bglight dark:bg-bgdark text-textlight dark:text-textdark min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <section className="py-12">
                    <div className="container mx-auto">
                        <h1 className="text-4xl font-bold text-center mb-8">Ceník vybraných služeb</h1>
                        <PricingTable />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Cenik;
