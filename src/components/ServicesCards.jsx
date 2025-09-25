import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetcategoryQuery } from "../services/categoryApi";
import noimg from "../assets/noimg.jpg";

export default function ServicesCards() {
  const { data, isLoading } = useGetcategoryQuery();
  const navigate = useNavigate();

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-10 px-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center w-full gap-4">
            <div className="flex-grow border-t-2 w-10 border-[#EE4E34]"></div>
            <div className="text-center px-6">
              <h2 className="text-4xl font-extrabold text-[#EE4E34]">
                Our Services
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto">
                Explore our diverse range of professional services tailored to
                your needs.
              </p>
            </div>
            <div className="flex-grow border-t-2 w-10 border-[#EE4E34]"></div>
          </div>
        </div>

        {/* Loader (Skeleton Cards) */}
        {isLoading ? (
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {data?.data?.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 70,
                }}
                whileHover={{
                  scale: 1.05,
                }}
                className="bg-white text-black rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer transition-shadow duration-300 border border-[#ee4d3431]"
                onClick={() => navigate(`/services/${item?.id}`)}
              >
                {/* Image */}
                <motion.div className="h-full w-full">
                  <img
                    src={item?.image || noimg}
                    alt={item?.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <motion.h3
                    className="text-xl font-bold"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {item?.name}
                  </motion.h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
