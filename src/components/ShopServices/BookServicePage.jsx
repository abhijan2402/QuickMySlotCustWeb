import { useParams, useNavigate } from "react-router-dom";
import { salondata } from "../../utils/slaondata";
import { useState } from "react";
import {
  Collapse,
  Button,
  Modal,
  message,
  DatePicker,
  Select,
  List,
  Badge,
  Empty,
} from "antd";
import { div } from "framer-motion/client";
import { BsTrash2 } from "react-icons/bs";

const { Panel } = Collapse;
const { Option } = Select;

export default function BookServicePage() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const shop = salondata.find((s) => s.id === Number(shopId));
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!shop) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Shop Not Found</h2>
        <Button type="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const leftTabs = shop.services.filter((_, i) => i !== selectedServiceIndex);
  const selectedTab = shop.services[selectedServiceIndex];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  const total = cart.reduce((sum, s) => sum + Number(s.price), 0);

  const handleConfirm = () => {
    if (!cart.length) {
      message.error("Please select at least one service");
      return;
    }
    if (!selectedDate || !selectedTime) {
      message.error("Please select date and time");
      return;
    }

    const subtotal = cart.reduce((sum, s) => sum + Number(s.price), 0);
    const discount = appliedOffer ? Math.round(subtotal * 0.1) : 0;
    const platformFee = 50;
    const total = subtotal - discount + platformFee;

    const bookingData = {
      shop: shop.name,
      services: cart,
      date: selectedDate,
      time: selectedTime,
      appliedOffer: appliedOffer || "None",
      subtotal,
      discount,
      platformFee,
      total,
      appointmentId: Math.floor(Math.random() * 1000000), // sample id
    };

    setConfirmedBooking(bookingData);
    setModalOpen(false);
    setConfirmationOpen(true);
  };

  const removeItem = (indexToRemove) => {
    setCart((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };
  return (
    <div className="max-w-7xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-purple-700">
        &larr; Back
      </button>

      <h1 className="text-2xl font-bold mb-5 text-black">
        Select Your Services
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT CONTENT */}
        <div className="col-span-2 bg-white rounded-2xl shadow p-6 min-h-[500px] flex flex-col">
          <h1 className="text-xl font-bold mb-5 text-purple-700">
            {shop.name}
          </h1>

          {/* Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-3 mb-6 gap-3">
            {/* Selected Tab */}
            <div className="px-5 py-2 text-sm rounded-md text-white bg-purple-700 font-semibold shadow-md">
              {selectedTab.service_name}
            </div>

            {/* Other Tabs */}
            <div className="flex gap-3 flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible whitespace-nowrap w-full md:w-auto">
              {leftTabs.map((srv) => {
                const originalIndex = shop.services.indexOf(srv);
                return (
                  <div
                    key={srv.service_name}
                    onClick={() => setSelectedServiceIndex(originalIndex)}
                    className="cursor-pointer py-1 px-4 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:text-purple-700 hover:border-purple-400 transition shrink-0"
                  >
                    {srv.service_name}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <Collapse accordion>
            {selectedTab.sub_services.map((sub, i) => (
              <Panel
                header={
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium">{sub.desc}</span>
                    {/* <Badge
                      count={`₹${sub.price}`}
                      style={{ backgroundColor: "#722ed1", border:"none" }}
                    /> */}
                  </div>
                }
                key={i}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-2">{sub.desc}</p>
                    <p className="text-gray-600">
                      Price: <b>₹{sub.price}</b>
                    </p>
                  </div>
                  <Button
                    type="primary"
                    onClick={() => {
                      setCart((c) => [...c, sub]);
                      message.success("Service added to cart!");
                    }}
                    className="bg-purple-700"
                  >
                    Add
                  </Button>
                </div>
              </Panel>
            ))}
          </Collapse>
        </div>

        {/* RIGHT CART (Sticky Sidebar) */}
        <div className="bg-white rounded-2xl shadow p-6 sticky top-6 min-h-[500px] flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-purple-700">
            Selected Services
          </h2>
          <div className="flex-1 h-[250px]">
            {cart.length === 0 ? (
              <div className="h-full flex justify-center items-center">
                <Empty description="No services selected" />
              </div>
            ) : (
              <ul className="space-y-3 overflow-y-auto scrollbar-none h-[350px]">
                {cart.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span className="text-gray-700">{item.desc}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-purple-700 font-semibold">
                        ₹{item.price}
                      </span>
                      <Button
                        type="text"
                        icon={<BsTrash2 size={18} />}
                        onClick={() => removeItem(i)}
                        aria-label={`Remove ${item.desc}`}
                        className="text-red-600 hover:text-red-800"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Total */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold text-sm mb-3">
              <span className="text-purple-600">Total</span>
              <span className="text-purple-700">₹{total}</span>
            </div>
            <Button
              type="primary"
              block
              size="large"
              disabled={!cart.length}
              className="bg-purple-700 border-purple-700 font-semibold"
              onClick={() => setModalOpen(true)}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        open={modalOpen}
        footer={[
          <Button key="back" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            style={{ backgroundColor: "#722ed1", borderColor: "#722ed1" }}
            onClick={handleConfirm}
          >
            Proceed to Booking
          </Button>,
        ]}
        title="Book Your Services"
        onCancel={() => setModalOpen(false)}
        width={600}
      >
        {/* Services List */}
        <h3 className="font-semibold mb-2">Selected Services</h3>
        <List
          bordered
          dataSource={cart}
          renderItem={(item) => (
            <List.Item className="flex justify-between">
              <span>{item.desc}</span>
              <span className="text-purple-700 font-medium">₹{item.price}</span>
            </List.Item>
          )}
          className="mb-4"
        />

        {/* Date & Time */}
        <h3 className="font-semibold mb-2">Choose Date & Time</h3>
        <div className="flex gap-4 mb-4 flex-col sm:flex-row">
          <DatePicker
            onChange={(_, dateString) => setSelectedDate(dateString)}
            placeholder="Select Date"
            style={{ width: "170px" }}
          />
          <Select
            placeholder="Select Time"
            style={{ width: "170px" }}
            onChange={setSelectedTime}
          >
            {timeSlots.map((time) => (
              <Option key={time} value={time}>
                {time}
              </Option>
            ))}
          </Select>
        </div>

        {/* Offers */}
        <h3 className="font-semibold mb-2">Available Offers</h3>
        <Select
          placeholder="Apply Offer"
          className="mb-4 w-full"
          onChange={(val) => setAppliedOffer(val)}
          value={appliedOffer}
          allowClear
        >
          {Array.isArray(shop.offer) ? (
            shop.offer.map((offer, idx) => (
              <Option key={idx} value={offer}>
                {offer}
              </Option>
            ))
          ) : (
            <Option value={shop.offer}>{shop.offer}</Option>
          )}
        </Select>

        {/* Bill Summary */}
        <h3 className="font-semibold mb-2">Bill Summary</h3>
        {(() => {
          const subtotal = cart.reduce((sum, s) => sum + Number(s.price), 0);
          const discount = appliedOffer ? Math.round(subtotal * 0.1) : 0; // Example 10% discount
          const platformFee = 50; // Fixed platform fee
          const grandTotal = subtotal - discount + platformFee;

          return (
            <div className="space-y-2 text-base">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span className="text-sm">
                  Discount {appliedOffer ? `(${appliedOffer})` : ""}
                </span>
                <span className="text-sm">- ₹{discount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="text-sm">Platform Fee</span>
                <span className="text-sm">₹{platformFee}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-purple-700">₹{grandTotal}</span>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={confirmationOpen}
        onCancel={() => setConfirmationOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setConfirmationOpen(false)}>
            Cancel Booking
          </Button>,
          <Button
            key="confirm"
            type="primary"
            style={{ backgroundColor: "#6961AB", borderColor: "#6961AB" }}
            onClick={() => {
              setConfirmationOpen(false);
              // redirect to payment gateway page (replace '/payment-gateway' with your route)
              navigate("/payment-gateway", { state: confirmedBooking });
            }}
          >
            Confirm & Pay
          </Button>,
        ]}
        title="Booking Confirmation"
        centered
        width={500}
      >
        {/* Salon Closed Banner */}
        <div className="mb-4">
          <div className="flex items-center gap-2 p-2 rounded bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <span>🕒</span>
            <span>
              The salon is currently closed. They will confirm your appointment
              as soon as they open.
            </span>
          </div>
        </div>

        {/* What To Do Next */}
        <div className="mb-4">
          <h3 className="font-bold mb-1">What To Do Next</h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Visit the location after receiving a confirmation</li>
            <li>
              Pay your bill on QuickSlot with any online payment to avail the
              offer
            </li>
          </ul>
        </div>

        {/* Things To Remember */}
        <div className="mb-4">
          <h3 className="font-bold mb-1">Things To Remember</h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li>You can change or add new services at the location</li>
            <li>Cash payments are not accepted</li>
          </ul>
        </div>

        {/* Salon Details */}
        <div className="mb-4">
          <h3 className="font-bold mb-1">Salon Details</h3>
          <p className="font-semibold">
            {shop.name}, {shop.address}
          </p>
          {/* Add support info, timings, directions, buttons as needed */}
        </div>

        {/* Appointment Details */}
        <div className="mb-4">
          <h3 className="font-bold mb-1">Appointment Details</h3>
          <p>
            <b>Appointment Id:</b> {confirmedBooking?.appointmentId}
            <br />
            <b>Date:</b> {confirmedBooking?.date}
            <br />
            <b>Time:</b> {confirmedBooking?.time}
          </p>
        </div>
      </Modal>
    </div>
  );
}
