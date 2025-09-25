import { useParams, useNavigate } from "react-router-dom";
import { salondata } from "../../utils/slaondata";
import { useState } from "react";
import {
  Button,
  Modal,
  message,
  DatePicker,
  Select,
  List,
  Empty,
  Input,
} from "antd";
import { BsTrash2 } from "react-icons/bs";
import { useGetcategoryQuery } from "../../services/categoryApi";
import { useGetvendorQuery } from "../../services/vendorApi";

const { Option } = Select;
const { TextArea } = Input;

const slotOptions = {
  fast: [
    { time: "02:00 - 02:15 pm", fillingSoon: true },
    { time: "02:30 - 02:45 pm", fillingSoon: true },
  ],
  scheduled: [
    { time: "04:30 - 04:45 pm" },
    { time: "05:00 - 05:15 pm" },
    { time: "05:30 - 05:45 pm" },
    { time: "06:00 - 06:15 pm", fee: 50 },
    { time: "06:30 - 06:45 pm", fee: 50 },
    { time: "07:00 - 07:15 pm", fee: 100 },
    { time: "07:30 - 07:45 pm", fee: 100 },
    { time: "08:00 - 08:15 pm", fee: 100 },
  ],
};

export default function BookServicePage() {
  const { shopId, type, serviceId } = useParams();
  const navigate = useNavigate();

  const { data: category } = useGetcategoryQuery();
  const categoryData = category?.data?.find((cat) => cat.name === type);
  const { data } = useGetvendorQuery(categoryData?.id);
  const shopData = data?.data?.find((cat) => cat.id === Number(shopId));

  const shopServices = shopData?.services?.filter(
    (s) => s.service_id === serviceId
  );

  console.log(shopServices);

  const [cart, setCart] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [note, setNote] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({ time: "", fee: 0 });

  if (!shopServices) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Shop Not Found</h2>
        <Button type="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

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
    if (!selectedDate || !selectedSlot) {
      message.error("Please select date and slot");
      return;
    }
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
    const total = subtotal - discount + platformFee + selectedSlot.fee;

    const bookingData = {
      shop: shop.name,
      services: cart,
      date: selectedDate,
      time: selectedTime,
      slot: selectedSlot.time,
      appliedOffer: appliedOffer || "None",
      note,
      subtotal,
      discount,
      platformFee,
      total,
      appointmentId: Math.floor(Math.random() * 1000000),
    };

    setConfirmedBooking(bookingData);
    setModalOpen(false);
    setConfirmationOpen(true);
  };

  const removeItem = (indexToRemove) => {
    setCart((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="mb-4 text-[#EE4E34]">
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold mb-5 text-black">
          Select Your Services
        </h1>
        <div className="flex flex-col md:flex-row gap-4 max-w-7xl mx-auto p-6">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1 bg-white rounded-2xl p-4"
            style={{ maxHeight: "600px", overflowY: "auto" }}
          >
            {shopServices?.map((service, i) => (
              <div
                key={service.id}
                style={{ maxHeight: "400px", overflowY: "auto" }}
                className="border p-4 rounded-md flex flex-col "
              >
                <h2 className="font-bold text-sm text-[#EE4E34] mb-2">
                  {service.name}
                </h2>
                {service?.image ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-36 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-36 flex items-center justify-center bg-gray-100 rounded mb-2 text-gray-500 text-xs font-semibold">
                    No Image Available
                  </div>
                )}

                <p className="text-gray-700 mb-2 text-xs md:text-sm ">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-2 text-xs md:text-sm text-gray-600">
                  <span>Gender: {service.gender || "Any"}</span>
                  <span>Duration: {service.duration} mins</span>
                  <span>Price: ₹{service.price}</span>
                </div>

                <Button
                  type="primary"
                  block
                  onClick={() => {
                    if (!cart.some((s) => s.id === service.id)) {
                      setCart([...cart, service]);
                      message.success(`${service.name} added to cart!`);
                    } else {
                      message.info(`${service.name} is already in your cart.`);
                    }
                  }}
                  className="bg-[#EE4E34] border-[#EE4E34]"
                >
                  Add to Cart
                </Button>
              </div>
            ))}

            {shopServices?.length === 0 && (
              <Empty description="No services available" />
            )}
          </div>

          <div className="bg-white rounded-2xl shadow p-6 sticky top-6 min-h-[500px] min-w-[320px] flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-[#EE4E34]">
              Selected Services
            </h2>
            <div className="flex-1 h-[350px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="h-full flex justify-center items-center">
                  <Empty description="No services selected" />
                </div>
              ) : (
                <ul className="space-y-3 scrollbar-none">
                  {cart.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span className="text-gray-700">{item.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-[#EE4E34] font-semibold">
                          ₹{item.price}
                        </span>
                        <Button
                          type="text"
                          icon={<BsTrash2 size={18} />}
                          onClick={() => removeItem(i)}
                          className="text-red-600 hover:text-red-800"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-sm mb-3">
                <span className="text-purple-600">Total</span>
                <span className="text-[#EE4E34]">₹{total}</span>
              </div>
              <Button
                type="primary"
                block
                size="large"
                disabled={!cart.length}
                className="bg-[#EE4E34] border-[#EE4E34] font-semibold"
                onClick={() => setModalOpen(true)}
              >
                Book Now
              </Button>
            </div>
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
              <span className="text-[#EE4E34] font-medium">₹{item.price}</span>
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

        {/* Date & Slot Selection */}
        <h3 className="font-semibold mb-2">Choose Date & Slot</h3>
        <DatePicker
          onChange={(_, dateString) => setSelectedDate(dateString)}
          placeholder="Select Date"
          style={{ width: "170px" }}
        />
        <div className="flex mt-4 flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 min-w-[170px]">
            {/* Fast Booking */}
            <div>
              <div className="flex items-center gap-2 font-semibold mb-1">
                <span>⚡ Fast Booking</span>
                <span className="text-orange-500 text-xs font-semibold">
                  🔥 filling soon
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {slotOptions.fast.map((slot, idx) => (
                  <button
                    key={slot.time}
                    className={`rounded flex items-center px-3 py-2 border text-xs
              ${
                selectedSlot === slot.time
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-300 bg-white"
              }
            `}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <span>{slot.time}</span>
                    {slot.fillingSoon && (
                      <span className="ml-2 text-orange-500 font-semibold">
                        🔥
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduled Slots */}
            <div>
              <div className="flex items-center gap-2 font-semibold mt-4 mb-1">
                <span>⏰ Scheduled Slots</span>
                <span className="text-orange-500 text-xs font-semibold">
                  🔥 filling soon
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {slotOptions.scheduled.map((slot, idx) => (
                  <button
                    key={slot.time}
                    className={`rounded flex items-center px-3 py-2 border text-xs
              ${
                selectedSlot.time === slot.time
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-300 bg-white"
              }
            `}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <span>{slot.time}</span>
                    {slot.fee && (
                      <span className="ml-2 text-orange-600 font-semibold">
                        + ₹{slot.fee}
                      </span>
                    )}
                    {slot.fillingSoon && (
                      <span className="ml-2 text-orange-500 font-semibold">
                        🔥
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Offers */}
        <h3 className="font-semibold mb-2">Available Offers</h3>
        {/* <Select
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
        </Select> */}

        {/* Note */}
        <h3 className="font-semibold mb-2">Request/Note</h3>
        <div className="mb-2">
          <TextArea
            rows={4}
            placeholder="Enter your request or note here..."
            allowClear
            autoSize={{ minRows: 2, maxRows: 6 }}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Bill Summary */}
        <h3 className="font-semibold mb-2">Bill Summary</h3>
        {(() => {
          const subtotal = cart.reduce((sum, s) => sum + Number(s.price), 0);
          const discount = appliedOffer ? Math.round(subtotal * 0.1) : 0; // Example 10% discount
          const platformFee = 50; // Fixed platform fee
          const slot = 0 || selectedSlot.fee;
          const grandTotal = subtotal - discount + platformFee + slot;

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
                <span className="text-[#EE4E34]">₹{grandTotal}</span>
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
            style={{ backgroundColor: "#EE4E34", borderColor: "#EE4E34" }}
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
            {shopData.business_name}, {shopData.address}
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
    </>
  );
}
