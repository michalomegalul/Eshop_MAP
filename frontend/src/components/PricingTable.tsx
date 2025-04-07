const PricingTable = () => {
    const services = [
        { category: 'Diagnostika', items: [
            { name: 'Základní diagnostika motoru', description: 'Načtení chybových kódů', priceWithVAT: '605 Kč', priceWithoutVAT: '500 Kč' },
            { name: 'Pokročilá diagnostika/logování/jízdní zkouška', description: 'Sazba je účtována za každých započatých 15 min.', priceWithVAT: '605 Kč', priceWithoutVAT: '500 Kč' },
            { name: 'Kontrola emisí', description: 'Měření emisí a kontrola', priceWithVAT: '726 Kč', priceWithoutVAT: '600 Kč' },
            { name: 'Výměna oleje', description: 'Výměna motorového oleje a filtru', priceWithVAT: '847 Kč', priceWithoutVAT: '700 Kč' },
            { name: 'Seřízení geometrie', description: 'Kontrola a seřízení geometrie kol', priceWithVAT: '968 Kč', priceWithoutVAT: '800 Kč' },
            { name: 'Výměna brzdových destiček', description: 'Výměna předních nebo zadních brzdových destiček', priceWithVAT: '1210 Kč', priceWithoutVAT: '1000 Kč' },
            { name: 'Kontrola klimatizace', description: 'Kontrola a doplnění chladiva', priceWithVAT: '847 Kč', priceWithoutVAT: '700 Kč' },
            { name: 'Výměna rozvodového řemene', description: 'Výměna rozvodového řemene a napínací kladky', priceWithVAT: '3025 Kč', priceWithoutVAT: '2500 Kč' },
            { name: 'Seřízení světel', description: 'Kontrola a seřízení světel', priceWithVAT: '484 Kč', priceWithoutVAT: '400 Kč' },
            { name: 'Výměna baterie', description: 'Výměna autobaterie', priceWithVAT: '968 Kč', priceWithoutVAT: '800 Kč' }
        ]},
    ];

    return (
        <div className="px-8 md:px-16 lg:px-32 py-8">
            {services.map((category, index) => (
                <div key={index} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800">
                            <thead>
                                <tr>
                                    <th className="py-2 px-8 border-b text-start">Název služby</th>
                                    <th className="py-2 px-8 border-b text-start">Popis</th>
                                    <th className="py-2 px-4 border-b">Cena s DPH</th>
                                    <th className="py-2 px-4 border-b">Cena bez DPH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.items.map((item, idx) => (
                                    <tr key={idx} className="text-center">
                                        <td className="py-2 px-8 border-b text-start">{item.name}</td>
                                        <td className="py-2 px-8 border-b text-start">{item.description}</td>
                                        <td className="py-2 px-4 border-b">{item.priceWithVAT}</td>
                                        <td className="py-2 px-4 border-b">{item.priceWithoutVAT}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PricingTable;