import { useState } from "react";
import { Modal, Button } from "antd";
import { FaTimesCircle } from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb";
import { motion } from "framer-motion";
import { useGetAppointmentsQuery } from "../services/vendorApi";

const noDataVariants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
  exit: { opacity: 0, y: -10 },
};

const tabVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const ITEMS_PER_PAGE = 10;

export default function Appointments() {
  const { data } = useGetAppointmentsQuery();
  const appointmentsData = data?.data || [];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = Math.ceil(appointmentsData.length / ITEMS_PER_PAGE);
  const paginatedAppointments = appointmentsData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openDetailsModal = (appt) => {
    setSelectedAppointment(appt);
    setModalVisible(true);
  };

  const renderAppointments = () => {
    if (!paginatedAppointments.length) {
      return (
        <motion.div
          className="h-[40vh] flex flex-col items-center justify-center text-gray-500 select-none"
          variants={noDataVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <FaTimesCircle className="text-6xl mb-4 animate-bounce text-gray-400" />
          <p className="text-lg">No appointments found.</p>
        </motion.div>
      );
    }

    return (
      <motion.ul
        className="space-y-3"
        variants={tabVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {paginatedAppointments.map((appt) => (
          <li
            key={appt.id}
            className="p-4 bg-white rounded-xl shadow-md border flex justify-between items-center hover:shadow-lg transition cursor-pointer"
          >
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-800">
                {appt.service?.name}
              </h4>
              <p className="text-sm text-gray-700">
                Provider: {appt.vendor?.name}
              </p>
              <p className="text-sm text-gray-700">
                Date: {Object.values(appt.schedule_time)?.[0]} | Time:{" "}
                {Object.keys(appt.schedule_time)?.[0]}
              </p>
              <p className="text-sm text-green-700">Price: ₹{appt.amount}</p>
              <p className="text-sm text-gray-700">Status: {appt.status}</p>
            </div>
            <Button
              style={{ backgroundColor: "#EE4E34", color: "white" }}
              onClick={() => openDetailsModal(appt)}
            >
              Details
            </Button>
          </li>
        ))}
      </motion.ul>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <Breadcrumb propertyTitle={"My Appointments"} />

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          My Appointments
        </h3>

        {/* Appointments List */}
        {renderAppointments()}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              className={`px-3 py-1 rounded bg-gray-200 text-gray-700 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span className="px-3 py-1">
              {currentPage} / {pageCount}
            </span>
            <button
              className={`px-3 py-1 rounded bg-gray-200 text-gray-700 ${
                currentPage === pageCount ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === pageCount}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              }
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        title={selectedAppointment?.service?.name || "Appointment Details"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setModalVisible(false)}
          >
            Close
          </Button>,
        ]}
        bodyStyle={{ padding: "24px 32px" }}
        centered
        width={500}
      >
        {selectedAppointment && (
          <div className="space-y-4 text-gray-800">
            <p>
              <span className="font-semibold">Provider:</span>{" "}
              {selectedAppointment.vendor?.name}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {selectedAppointment.vendor?.address ||
                selectedAppointment.vendor?.city}
            </p>
            <p>
              <span className="font-semibold">Date & Time:</span>{" "}
              {Object.values(selectedAppointment.schedule_time)?.[0]} |{" "}
              {Object.keys(selectedAppointment.schedule_time)?.[0]}
            </p>
            <p>
              <span className="font-semibold">Price:</span> ₹
              {selectedAppointment.amount}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
