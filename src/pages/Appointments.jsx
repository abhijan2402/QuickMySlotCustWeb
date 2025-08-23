import {
  FaCalendarAlt,
  FaChartPie,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb";
import { useState } from "react";
import { motion } from "framer-motion";

const noDataVariants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
  exit: { opacity: 0, y: -10 },
};

const tabVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("awaiting");

  // Example appointment data
  const appointments = {
    awaiting: [],
    today: [{ id: 1, title: "Haircut - 5PM", provider: "John's Salon" }],
    upcoming: [{ id: 2, title: "Spa - Tomorrow", provider: "Relax Hub" }],
    served: [],
    canceled: [],
  };

  const renderAppointments = () => {
    const currentAppointments = appointments[activeTab];

    if (currentAppointments.length === 0) {
      return (
        <motion.div
          className="h-[50vh] flex flex-col items-center justify-center text-gray-500 select-none"
          variants={noDataVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          key="no-data"
        >
          <FaTimesCircle className="text-6xl mb-4 animate-bounce text-gray-400" />
          <p className="text-lg">No appointments found.</p>
        </motion.div>
      );
    }

    return (
      <motion.ul
        className="space-y-3 h-[50vh] overflow-y-auto pr-2"
        variants={tabVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        key="appointments-list"
      >
        {currentAppointments.map((appt) => (
          <li
            key={appt.id}
            className="p-4 bg-white rounded-xl shadow-md border flex justify-between items-center hover:shadow-lg transition cursor-pointer"
          >
            <div>
              <h4 className="font-semibold text-gray-800">{appt.title}</h4>
              <p className="text-sm text-gray-500">{appt.provider}</p>
            </div>
            <FaCalendarAlt className="text-blue-500 text-lg" />
          </li>
        ))}
      </motion.ul>
    );
  };

  const tabs = [
    { id: "awaiting", icon: <FaClock />, label: "Awaiting" },
    { id: "today", icon: <FaCalendarAlt />, label: "Today" },
    { id: "upcoming", icon: <FaChartPie />, label: "Upcoming" },
    { id: "served", icon: <FaCheckCircle />, label: "Served" },
    { id: "canceled", icon: <FaTimesCircle />, label: "Canceled" },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <Breadcrumb propertyTitle={"My Appointment"} />

        {/* My Appointments */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            My Appointments
          </h3>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar">
            {tabs.map(({ id, icon, label }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-sm font-semibold select-none transition ${
                  activeTab === id
                    ? "bg-[#6961AB] text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                }`}
                aria-current={activeTab === id ? "true" : undefined}
                aria-label={`Show ${label} appointments`}
              >
                {icon} {label}
              </motion.button>
            ))}
          </div>

          {/* Animated content */}
          {renderAppointments()}
        </div>
      </div>
    </>
  );
}
