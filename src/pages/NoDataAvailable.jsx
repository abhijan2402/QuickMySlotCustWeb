import React from "react";
import { MdOutlineInfo } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NoDataAvailable({
  message = "No data available",
  btn = false,
}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center h-[80vh] border border-dotted  border-gray-300 rounded-md justify-center py-12 text-gray-500">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.9, 1.1, 1], opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 shadow-inner"
      >
        <MdOutlineInfo className="text-5xl text-[#EE4E34]" />
      </motion.div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-4 text-base font-semibold text-gray-600 text-center"
      >
        {message}
      </motion.p>

      {/* Subtext */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-xs text-gray-400 mt-1"
      >
        Try adjusting filters or search again
      </motion.span>

      {btn && (
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-[#EE4E34] text-white py-2 px-4 text-sm rounded hover:bg-[#EE4E34] transition"
        >
          Go Back
        </button>
      )}
    </div>
  );
}
