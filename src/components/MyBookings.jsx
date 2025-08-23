import React from "react";
import { BiArrowFromRight } from "react-icons/bi";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { HiArrowNarrowLeft } from "react-icons/hi";
import Slider from "react-slick";


const bookings = [
  {
    shopName: "Elite Salon",
    services: [
      { name: "Haircut", subServices: ["Beard Trim", "Shampoo"] },
      { name: "Facial", subServices: ["Gold Facial"] },
    ],
    price: 1200,
    date: "2025-08-25",
    address: "123 Main Street, New Delhi",
    phone: "9876543210",
  },
  {
    shopName: "Urban Spa",
    services: [{ name: "Full Body Massage", subServices: ["Aroma Therapy"] }],
    price: 2500,
    date: "2025-09-01",
    address: "456 Park Avenue, Mumbai",
    phone: "9123456780",
  },
];

const MyBookings = () => {
    function NextArrow(props) {
      const { onClick } = props;
      return (
        <div
          className="slick-arrow slick-next"
          style={{
            display: "block",
            right: "-35px",
            fontSize: "30px",
            color: "#722ed1",
            cursor: "pointer",
          }}
          onClick={onClick}
        >
          <FaArrowAltCircleRight />
        </div>
      );
    }

    function PrevArrow(props) {
      const { onClick } = props;
      return (
        <div
          className="slick-arrow slick-prev"
          style={{
            display: "block",
            left: "-35px",
            fontSize: "30px",
            color: "#722ed1",
            cursor: "pointer",
          }}
          onClick={onClick}
        >
          <FaArrowAltCircleLeft />
        </div>
      );
    }
const settings = {
  dots: false,
  infinite: bookings.length > 1,
  speed: 500,
  slidesToShow: 2, // Default on desktop
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024, // Tablet and below
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false, // Optional: hide arrows on smaller screens for better UX
        dots: true, // Show dots instead for easier navigation
      },
    },
    {
      breakpoint: 640, // Mobile phones
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
      },
    },
  ],
};

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      <div className="flex flex-col items-center mb-10 px-4 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center w-full gap-4">
          <div className="flex-grow border-t-2 w-10 border-purple-700"></div>
          <div className="text-center px-6">
            <h2 className="text-4xl font-extrabold text-purple-700">
              My Appointmnets
            </h2>
           
          </div>
          <div className="flex-grow border-t-2 w-10 border-purple-700"></div>
        </div>
      </div>
      {bookings.length > 0 ? (
        <Slider {...settings}>
          {bookings.map((booking, index) => (
            <div key={index} className="px-3 ">
              <div className="bg-white rounded-2xl h-[300px] shadow-lg p-6 border border-gray-200 flex flex-col justify-between overflow-y-auto">
                {/* Shop Name */}
                <h3 className="text-xl font-semibold text-purple-700 mb-2">
                  {booking.shopName}
                </h3>

                {/* Services */}
                <div className="mb-4">
                  <p className="text-gray-800 font-medium">Services:</p>
                  <ul className="list-disc list-inside text-gray-600 ml-2">
                    {booking.services.map((service, i) => (
                      <li key={i}>
                        {service.name}{" "}
                        {service.subServices?.length > 0 && (
                          <span className="text-sm text-gray-500">
                            ({service.subServices.join(", ")})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Date */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-green-600">
                    ₹{booking.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Address */}
                <p className="text-gray-700 mb-1">
                  📍 <span className="font-medium">{booking.address}</span>
                </p>

                {/* Phone */}
                <p className="text-gray-700">
                  📞{" "}
                  <a href={`tel:${booking.phone}`} className="text-blue-600">
                    {booking.phone}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-gray-600">You have no bookings yet.</p>
      )}
    </div>
  );
};

export default MyBookings;
