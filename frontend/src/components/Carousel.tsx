import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const Carousel = () => {
  const images = [
    '/files/audi.jpg',
    '/files/audi.jpg',
    '/files/audi.jpg',
    '/files/audi.jpg',
    '/files/audi.jpg',
  ];

  const overlayTexts = [
    'Special Offer 1',
    'Limited Time Deal',
    'New Arrival',
    'Exclusive Discount',
    'Hot Sale',
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center w-full px-8 md:px-12 2xl:px-32 cursor-pointer">
        {/* Left Navigation */}
        <div className="swiper-button-prev text-black hover:text-gray-500 cursor-pointer text-3xl static pr-7 dark:text-textdark" />

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ clickable: true }}
          spaceBetween={20}
          loop
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 }, // Mobile (1 slide)
            768: { slidesPerView: 2, spaceBetween: 15 }, // Tablets (2 slides)
            1560: { slidesPerView: 3, spaceBetween: 20 }, // Desktops (3 slides)
          }}
          className="w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative group">
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover rounded-sm transition-all duration-300 group-hover:brightness-50"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xl font-bold">{overlayTexts[index]}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Right Navigation */}
        <div className="swiper-button-next text-black hover:text-gray-500 cursor-pointer text-3xl static pl-7 dark:text-textdark" />
      </div>
    </div>
  );
};

export default Carousel;
