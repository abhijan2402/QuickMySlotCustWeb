import { Button, Modal } from "antd";
import { useState } from "react";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AppointmentDetails() {
  const navigate = useNavigate();
  const appointment = {
    id: 101,
    shopName: "Glamour Touch Salon",
    shopAddress: "123 Main Street, New Delhi",
    shopMobile: "+91 9876543210",
    shopImage:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600", // demo img
    customerName: "Abhishek Sharma",
    customerMobile: "+91 9123456780",
    customerAddress: "B-42, Patel Nagar, New Delhi",
    scheduleDate: "2025-06-20T14:00:00",
    services: [
      { name: "Haircut", price: 400 },
      { name: "Hair Wash", price: 200 },
    ],
    taxes: 60,
    discount: 50,
    paymentMethod: "UPI (Google Pay)",
  };

  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const subtotal = appointment.services.reduce((acc, s) => acc + s.price, 0);
  const grandTotal = subtotal + appointment.taxes - appointment.discount;

  const handleCancelAppointment = () => {
    setCancelModalVisible(false);
    alert("Appointment cancelled");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <p
        className="text-[#6961AB] flex items-center cursor-pointer font-medium  mb-4"
        onClick={() => navigate(-1)}
      >
        <FaChevronLeft className="mx-2 text-[#6961AB] shrink-0" />
        Back
      </p>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#6961AB]">
        Appointment Detail
      </h2>
      {/* Shop Details */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <img
          src={appointment.shopImage}
          alt="shop"
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
        <h3 className="text-lg font-semibold text-black">
          {appointment.shopName}
        </h3>
        <p className="text-gray-600 flex items-center gap-2">
          <EnvironmentOutlined /> {appointment.shopAddress}
        </p>
        <p className="text-gray-600 flex items-center gap-2">
          <PhoneOutlined /> {appointment.shopMobile}
        </p>
        <div className="flex justify-end">
          <Button type="primary" className="mt-2 bg-[#6961AB]">
            Chat
          </Button>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h4 className="font-semibold mb-2 text-black">Customer Details</h4>
        <p className="text-gray-700 flex items-center gap-2">
          <UserOutlined /> {appointment.customerName}
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <PhoneOutlined /> {appointment.customerMobile}
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <EnvironmentOutlined /> {appointment.customerAddress}
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <CalendarOutlined />{" "}
          {new Date(appointment.scheduleDate).toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Services */}
        <div className="bg-white w-full rounded-xl shadow p-4 mb-4 md:mb-0">
          <h4 className="font-semibold mb-2 text-black">Services</h4>
          {appointment.services.map((service, idx) => (
            <div key={idx} className="flex justify-between text-gray-700 mb-1">
              <span>{service.name}</span>
              <span>₹{service.price}</span>
            </div>
          ))}
        </div>

        {/* Price Details */}
        <div className="bg-white w-full rounded-xl shadow p-4 mb-4 md:mb-0">
          <h4 className="font-semibold text-black mb-2">Price Details</h4>
          <div className="flex justify-between text-gray-700">
            <span>Sub Total</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Taxes (GST)</span>
            <span>₹{appointment.taxes}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Discount</span>
            <span>-₹{appointment.discount}</span>
          </div>
          <div className="flex justify-between font-bold text-[#6961AB] mt-2 border-t pt-2">
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl text-black shadow p-4 mb-4">
        <h4 className="font-semibold mb-2">Payment Method</h4>
        <p className="text-gray-700 flex items-center gap-2">
          <DollarOutlined /> {appointment.paymentMethod}
        </p>
      </div>

      {/* Cancel Button */}
      <Button
        block
        size="large"
        className="bg-red-500 text-white"
        onClick={() => setCancelModalVisible(true)}
      >
        Cancel Appointment
      </Button>

      {/* Modal */}
      <Modal
        title="Confirm Cancellation"
        open={cancelModalVisible}
        onOk={handleCancelAppointment}
        onCancel={() => setCancelModalVisible(false)}
        okText="Yes, Cancel"
        cancelText="No"
        centered
      >
        <p>Are you sure you want to cancel this appointment?</p>
      </Modal>
    </div>
  );
}
