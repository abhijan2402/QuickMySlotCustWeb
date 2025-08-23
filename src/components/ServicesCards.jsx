import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const serviceData = [
  {
    name: "Salon",
    description:
      "Unleash your beauty with expert haircuts and styling tailored to you.",
    bgImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGF3MiZ7vAAl58bi9m6YHS4FYTevIZzpxX3A&s",
  },
  {
    name: "Healthcare",
    description:
      "Compassionate care with cutting-edge medical expertise just for you.",
    bgImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNM-EBaeIFmRXeyCa_td5D083wA3nE3gYsxg&s",
  },
  {
    name: "Spa",
    description:
      "Indulge in serene spa treatments to refresh your body and soul.",
    bgImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5lK5IT4Y_9T1hepyuIPLIFcrE0rCMUzN3qw&s",
  },
  {
    name: "Pet Clinic",
    description:
      "Trusted care for your pets from experienced veterinary professionals.",
    bgImage:
      "https://thumbs.dreamstime.com/b/vet-dog-cat-puppy-kitten-doctor-examining-veterinarian-animal-clinic-pet-check-up-vaccination-health-care-dogs-156067334.jpg",
  },
  {
    name: "Automotive Car",
    description:
      "Reliable auto maintenance and repair services to get you back on road.",
    bgImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCkf9X5s3Gc72e0MTa5_JlOkGZSBKYiuroEA&s",
  },
  {
    name: "Retail/Designer",
    description:
      "Discover exclusive collections that define modern style and sophistication.",
    bgImage:
      "https://as1.ftcdn.net/v2/jpg/00/68/49/25/1000_F_68492536_PRRs0z4TJjvJzKZOrg9DjEGMKUEbUN1O.jpg",
  },
  {
    name: "Tattoo & Piercing",
    description:
      "Express yourself with unique tattoo and piercing artistry by experts.",
    bgImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSURLS3bcDig9kqDPf52Uh19lllysTC-10Sug&s",
  },
];

export default function ServicesCards() {
  const navigate = useNavigate();
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-10 px-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center w-full gap-4">
            <div className="flex-grow border-t-2 w-10 border-purple-700"></div>
            <div className="text-center px-6">
              <h2 className="text-4xl font-extrabold text-purple-700">
                Our Services
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto">
                Explore our diverse range of professional services tailored to
                your needs.
              </p>
            </div>
            <div className="flex-grow border-t-2 w-10 border-purple-700"></div>
          </div>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {serviceData.map(({ name, description, bgImage }, index) => (
            <motion.div
              key={name}
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
                boxShadow: "0 12px 20px rgba(109, 40, 217, 0.3)",
              }}
              className="bg-white text-black rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer transition-shadow duration-300"
              onClick={() => navigate(`/services/${name.toLowerCase()}`)}
            >
              {/* Image */}
              <motion.div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
                aria-label={name}
                role="img"
              />

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <motion.h3
                  className="text-xl font-bold"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {name}
                </motion.h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
