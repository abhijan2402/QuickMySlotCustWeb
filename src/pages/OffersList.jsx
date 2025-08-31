import React from "react";
import { motion } from "framer-motion";
import { CheckCircleOutlined } from "@ant-design/icons";
import Breadcrumb from "../components/Breadcrumb";

const offers = [
  {
    code: "FIRST40",
    title: "Get 40% OFF",
    discount: "20% Discount",
    cashback: "20% Cashback",
    valid: "Valid on All Days",
    description:
      "After availing your services, pay at the salon using app via any mode of online payment and get 20% Discount & 20% Cashback as Cash on the net payable amount.",
    tnc: "T&C +",
    color: "bg-blue-100 text-blue-800",
  },
  {
    code: "WEEKEND10",
    title: "Get 10% OFF",
    discount: "5% Discount",
    cashback: "5% Cashback",
    valid: "Valid on Friday, Saturday, and Sunday",
    description:
      "After availing your services, pay at the salon using app via any mode of online payment and get 5% Discount & 5% Cashback as Cash on the net payable amount.",
    tnc: "T&C +",
    color: "bg-blue-100 text-blue-800",
  },
  {
    code: "GLAMUP40",
    title: "Get 40% OFF",
    discount: "25% Discount",
    cashback: "15% Cashback",
    valid: "Valid on Tuesday",
    description:
      "After availing your services, pay at the salon using app via any mode of online payment and get 25% Discount & 15% Cashback as Cash on the net payable amount.",
    tnc: "T&C +",
    color: "bg-blue-100 text-blue-800",
  },
];

const OffersList = () => {
  return (
    <>
      <div className="max-w-6xl mx-auto py-6 px-2">
        <Breadcrumb propertyTitle={"Offers"}/>
        <h1 className="text-3xl md:text-4xl mb-5 mt-6 px-5 font-extrabold text-gray-900 leading-tight">
          Offers <span className="text-[#6961AB]">Avaliable</span>
        </h1>
        <motion.div
          className="space-y-4 px-5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
          }}
          
        >
          {offers.map((offer) => (
            <motion.div
              key={offer.code}
              className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row justify-between p-4 md:p-6"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 2px 13px rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex-1">
                <span
                  className={`inline-block font-semibold px-3 py-1 rounded ${offer.color} text-xs mb-1`}
                >
                  {offer.code}
                </span>
                <h3 className="font-bold text-lg mt-1">{offer.title}</h3>
                <p className="mt-1">
                  <span className="text-green-600 font-semibold">
                    {offer.discount}
                  </span>
                  {" + "}
                  <span className="text-green-600 font-semibold">
                    {offer.cashback}
                  </span>
                </p>
                <p className="text-xs mt-2 text-gray-500">{offer.valid}</p>
                <p className="mt-2 text-sm text-gray-700">
                  {offer.description}
                </p>
                <button className="mt-2 text-blue-700 text-xs">
                  {offer.tnc}
                </button>
              </div>
              <motion.button
                className="self-center md:self-start mt-4 md:mt-0 btn btn-outline-blue border-2 border-blue-500 text-blue-500 rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-blue-50 transition justify-center "
                whileTap={{ scale: 0.95 }}
              >
                <span>Apply</span>
                <CheckCircleOutlined />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default OffersList;
