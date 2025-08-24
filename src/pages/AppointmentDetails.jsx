import { Button, Modal } from "antd";
import { useState } from "react";

export default function AppointmentDetails() {
  const appointmentsData = [
    {
      id: 101,
      title: "Facial - 3PM",
      provider: "Glow Beauty Salon",
      services: "Facial, Skin care treatment",
      price: 75,
      address: "123 Beauty St, New York, NY",
      mobile: "+1 234 567 890",
      datetime: "2025-08-30T15:00:00",
      status: "awaiting",
    },
    {
      id: 102,
      title: "Haircut - 5PM",
      provider: "John's Salon",
      services: "Men's haircut",
      price: 40,
      address: "456 Barber Ave, New York, NY",
      mobile: "+1 555 123 4567",
      datetime: "2025-08-24T17:00:00",
      status: "today",
    },
    {
      id: 103,
      title: "Spa - Morning",
      provider: "Relax Hub",
      services: "Full body massage",
      price: 120,
      address: "789 Relax Rd, New York, NY",
      mobile: "+1 444 555 6666",
      datetime: "2025-08-25T10:00:00",
      status: "upcoming",
    },
    {
      id: 104,
      title: "Manicure - Last Week",
      provider: "Elegant Nails",
      services: "Manicure, Nail Art",
      price: 50,
      address: "321 Style St, New York, NY",
      mobile: "+1 666 777 8888",
      datetime: "2025-08-15T14:00:00",
      status: "served",
    },
    {
      id: 105,
      title: "Hair Coloring - Canceled",
      provider: "Color Studio",
      services: "Hair Coloring",
      price: 90,
      address: "654 Color Ave, New York, NY",
      mobile: "+1 999 000 1111",
      datetime: "2025-08-20T11:00:00",
      status: "canceled",
    },
  ];

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleCancelAppointment = () => {
    setCancelModalVisible(false);
    alert("Appointment cancelled");
    setSelectedId(null);
  };

  const handleReschedule = () => {
    alert("Reschedule functionality coming soon");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#6961AB]">
        All Appointments Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {appointmentsData.map((appointment) => (
          <div
            key={appointment.id}
            className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col transition transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="p-6 flex-1 flex flex-col">
              <h4 className="text-xl font-semibold text-[#6961AB] mb-2">
                {appointment.title}
              </h4>
              <p className="mb-1 text-gray-700">
                <span className="font-medium">Provider:</span>{" "}
                {appointment.provider}
              </p>
              <p className="mb-1 text-gray-700">
                <span className="font-medium">Services:</span>{" "}
                {appointment.services}
              </p>
              <p className="mb-1 text-green-700 font-bold">
                <span className="font-medium">Price:</span> ${appointment.price}
              </p>
              <p className="mb-1 text-gray-500">
                <span className="font-medium">Address:</span>{" "}
                {appointment.address}
              </p>
              <p className="mb-1 text-gray-500">
                <span className="font-medium">Mobile:</span>{" "}
                {appointment.mobile}
              </p>
              <p className="mb-1 text-gray-900">
                <span className="font-medium">Date &amp; Time:</span>{" "}
                {new Date(appointment.datetime).toLocaleString()}
              </p>
            </div>
            <div className="p-6 pt-2 border-t flex gap-3">
              <Button
                style={{
                  backgroundColor: "#d32f2f",
                  color: "white",
                  border: "none",
                  display:"flex",
                  justifyContent:"center",
                  alignItems:"center"
                }}
                size="middle"
                onClick={() => {
                  setCancelModalVisible(true);
                  setSelectedId(appointment.id);
                }}
              >
                Cancel
              </Button>
              <Button
                style={{
                  backgroundColor: "#6961AB",
                  color: "white",
                  border: "none",
                }}
                size="middle"
                onClick={handleReschedule}
              >
                Reschedule
              </Button>
              <span
                className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                  appointment.status === "served"
                    ? "bg-green-100 text-green-700"
                    : appointment.status === "canceled"
                    ? "bg-red-100 text-red-700"
                    : appointment.status === "today"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                } flex justify-center items-center`}
                title={appointment.status}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Modal
        title="Confirm Cancellation"
        open={cancelModalVisible}
        onOk={handleCancelAppointment}
        onCancel={() => {
          setCancelModalVisible(false);
          setSelectedId(null);
        }}
        okText="Yes, Cancel"
        cancelText="No"
        centered
      >
        <p>Are you sure you want to cancel this appointment?</p>
      </Modal>
    </div>
  );
}
