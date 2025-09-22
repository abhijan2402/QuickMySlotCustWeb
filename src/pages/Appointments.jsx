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
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";
// ₹
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();
  const openDetailsPage = (appt) => {
    navigate(`/appointments/${activeTab}/${appt.id}`);
  };

  // Example appointment data with extended details
  const appointments = {
    awaiting: [
      {
        id: 5,
        title: "Facial - 3PM",
        provider: "Glow Beauty Salon",
        services: "Facial, Skin care treatment",
        price: 75,
        address: "123 Beauty St, New York, NY",
        mobile: "+1 234 567 890",
        datetime: "2025-08-30 15:00",
      },
    ],
    today: [
      {
        id: 1,
        title: "Haircut - 5PM",
        provider: "John's Salon",
        services: "Men's haircut",
        price: 40,
        address: "456 Barber Ave, New York, NY",
        mobile: "+1 555 123 4567",
        datetime: "2025-08-24 17:00",
      },
    ],
    upcoming: [
      {
        id: 2,
        title: "Spa - Tomorrow",
        provider: "Relax Hub",
        services: "Full body massage",
        price: 120,
        address: "789 Relax Rd, New York, NY",
        mobile: "+1 444 555 6666",
        datetime: "2025-08-25 10:00",
      },
    ],
    served: [],
    canceled: [],
  };

  const openDetailsModal = (appt) => {
    setSelectedAppointment(appt);
    setModalVisible(true);
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
              <p className="text-sm text-gray-700">Salon: {appt.provider}</p>
              <p className="text-sm text-gray-700">Services: {appt.services}</p>
              <p className="text-sm text-green-700">Price: ${appt.price}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                style={{ backgroundColor: "#EE4E34", color: "white" }}
                onClick={() => openDetailsPage(appt)}
              >
                View Details
              </Button>
            </div>
          </li>
        ))}
      </motion.ul>
    );
  };

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
            {[
              { id: "awaiting", label: "Awaiting", icon: <FaClock /> },
              { id: "today", label: "Today", icon: <FaCalendarAlt /> },
              { id: "upcoming", label: "Upcoming", icon: <FaChartPie /> },
              { id: "served", label: "Served", icon: <FaCheckCircle /> },
              { id: "canceled", label: "Canceled", icon: <FaTimesCircle /> },
            ].map(({ id, label, icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-sm font-semibold select-none transition ${
                  activeTab === id
                    ? "bg-[#EE4E34] text-white shadow-lg"
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

      {/* Details Modal */}
      <Modal
        title={selectedAppointment?.title || "Appointment Details"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setModalVisible(false)}
            type="primary"
          >
            Close
          </Button>,
        ]}
        bodyStyle={{ padding: "24px 32px" }}
        centered
        width={500}
      >
        {selectedAppointment && (
          <div className="space-y-6 text-gray-800">
            <p>
              <span className="font-semibold text-gray-900">Provider:</span>{" "}
              <span className="text-gray-700">
                {selectedAppointment.provider}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">Services:</span>{" "}
              <span className="text-gray-700">
                {selectedAppointment.services}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">Price:</span>{" "}
              <span className="text-green-600 font-medium">
                ${selectedAppointment.price}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">Address:</span>{" "}
              <span className="text-gray-700">
                {selectedAppointment.address}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">Mobile:</span>{" "}
              <span className="text-gray-700">
                {selectedAppointment.mobile}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">Date & Time:</span>{" "}
              <span className="text-gray-700">
                {selectedAppointment.datetime}
              </span>
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
