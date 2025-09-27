import React from "react";
import { motion } from "framer-motion";
import { CheckCircleOutlined, BellOutlined } from "@ant-design/icons";
import Breadcrumb from "../components/Breadcrumb";
import { useGetHiglightedOfferQuery } from "../services/offersApi";

const OffersList = () => {
  const { data, isLoading, isError } = useGetHiglightedOfferQuery();

  const offers = data?.data || [];

  return (
    <>
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-12">
        <Breadcrumb propertyTitle={"Offers"} />
        <h1 className="text-3xl md:text-4xl mb-5 mt-6 font-extrabold text-gray-900 leading-tight px-2 sm:px-0">
          Offers <span className="text-[#EE4E34]">Available</span>
        </h1>

        {isLoading ? (
          <div className="h-[300px] flex flex-col justify-center items-center text-gray-400 gap-3">
            <BellOutlined className="text-7xl animate-pulse" />
            <p className="text-xl">Loading offers...</p>
          </div>
        ) : isError ? (
          <div className="h-[300px] flex flex-col justify-center items-center text-red-500 gap-3">
            <p className="text-xl font-semibold">Failed to load offers.</p>
            <p>Please try again later.</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="h-[300px] flex flex-col justify-center items-center text-gray-500 gap-3">
            <BellOutlined className="text-7xl" />
            <p className="text-xl font-semibold">No offers available.</p>
            <p>Please check back later for updates.</p>
          </div>
        ) : (
          <motion.div
            className="space-y-4 px-0 sm:px-5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            <div className="max-w-6xl mx-auto mt-5 mb-6">
              <div className="bg-gradient-to-r from-[#e1ecfe] to-[#c5fcfa] rounded-xl shadow flex flex-col md:flex-row md:justify-around py-6 px-4 md:px-8">
                {["STEP 1", "STEP 2", "STEP 3"].map((step, i) => (
                  <div
                    key={step}
                    className="flex-1 flex flex-col items-center mb-6 md:mb-0"
                  >
                    <span className="text-white bg-[#EE4E34CC] px-3 py-1 rounded-md font-semibold text-sm mb-2">
                      {step}
                    </span>
                    <span className="text-gray-800 font-semibold text-center max-w-xs">
                      {i === 0 && "Book your appointment via the QuickmySlot"}
                      {i === 1 && "Go and avail the services"}
                      {i === 2 &&
                        "Pay bill with QuickmySlot to avail the offer"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {offers.map((offer) => (
              <motion.div
                key={offer.promo_code}
                className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row justify-between p-6 md:p-8"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 2px 13px rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex-1">
                  <span
                    className={`inline-block font-semibold px-4 py-2 rounded ${
                      offer.is_highlighted
                        ? "bg-[#EE4E34] text-white"
                        : "bg-blue-100 text-blue-800"
                    } text-sm mb-2`}
                  >
                    {offer.promo_code}
                  </span>
                  <h3 className="font-bold text-xl md:text-2xl mt-1">
                    {offer.type === "flat"
                      ? `Flat ₹${offer.amount} OFF`
                      : `${offer.amount}% OFF`}
                  </h3>
                  <p className="mt-2 text-sm text-gray-700 max-w-lg leading-relaxed">
                    {offer.description || "No description available."}
                  </p>
                  <p className="text-xs mt-2 text-gray-500">
                    Valid from{" "}
                    <time>{new Date(offer.start_on).toLocaleDateString()}</time>{" "}
                    to{" "}
                    <time>
                      {new Date(offer.expired_on).toLocaleDateString()}
                    </time>
                  </p>
                </div>
                <motion.button
                  className="self-center md:self-start mt-6 md:mt-0 btn btn-outline-blue border-2 border-[#EE4E34] text-[#EE4E34] rounded-lg px-6 py-3 text-sm flex items-center gap-2 hover:bg-[#EE4E34] hover:text-white transition justify-center font-semibold"
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Apply</span>
                  <CheckCircleOutlined />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default OffersList;
