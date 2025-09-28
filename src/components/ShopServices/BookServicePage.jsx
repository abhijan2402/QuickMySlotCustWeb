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
import {
  useGetCartListQuery,
  useGetvendorPromoCodeQuery,
  useGetvendorQuery,
  useRemoveCartListMutation,
} from "../../services/vendorApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../../services/paymentApi";
import { useGetSlotsQuery } from "../../services/vendorTransactionListApi";

const { Option } = Select;
const { TextArea } = Input;

const slotOptions = {
  fast: [
    { time: "02:00 - 02:15 pm", fillingSoon: true },
    { time: "02:30 - 02:45 pm", fillingSoon: true },
  ],
  scheduled: [
    { time: "04:30 pm" },
    { time: "05:00 pm" },
    { time: "05:30 pm" },
    { time: "06:00 pm", fee: 50 },
    { time: "06:30 pm", fee: 50 },
    { time: "07:00 pm", fee: 100 },
    { time: "07:30 pm", fee: 100 },
    { time: "08:00 pm", fee: 100 },
  ],
};

export default function BookServicePage() {
  const { shopId, type, serviceId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [removeCartList] = useRemoveCartListMutation();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const { data: cartList, refetch, isError } = useGetCartListQuery();
  console.log(isError);
  const { data: category } = useGetcategoryQuery();
  const categoryData = category?.data?.data?.find((cat) => cat.name === type);
  const { data } = useGetvendorQuery(categoryData?.id);

  const [cart, setCart] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [note, setNote] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const [cartItem, setCartItem] = useState(null);
  const [slotId, setSlotId] = useState(null);
  const [vendorId, setVendorId] = useState(null);

  const handleSlotClick = (slot) => {
    const isSelected = selectedSlots.find((s) => s.time === slot.time);

    if (isSelected) {
      // Deselect the slot
      setSelectedSlots(selectedSlots.filter((s) => s.time !== slot.time));
    } else {
      // Select slot only if less than 3 are selected
      if (selectedSlots.length < 3) {
        setSelectedSlots([...selectedSlots, slot]);
      } else {
        alert("You can select up to 3 slots only.");
      }
    }
  };

  const bookService = (item) => {
    setCartItem(item);
    setSlotId(item?.service?.id);
    setVendorId(item?.service?.vendor?.id);
    setModalOpen(true);
  };

  const { data: slots } = useGetSlotsQuery(slotId);
  const { data: availableOffers } = useGetvendorPromoCodeQuery(vendorId);
  console.log("slots", slots);
  console.log("appliedoffer", appliedOffer);
  // console.log("offers", availableOffers?.data);

  console.log(cartItem);

  const handleConfirm = () => {
    const slotFees = selectedSlots?.reduce(
      (sum, slot) => sum + (slot.fee || 0),
      0
    );
    const subtotal = Number(cartItem?.item_price) + slotFees || 0;

    // Find the selected offer object
    const selectedOffer = availableOffers?.data?.find(
      (offer) => offer.promo_code === appliedOffer
    );

    // Calculate discount amount
    let discount = 0;
    if (selectedOffer) {
      if (selectedOffer.type === "flat") {
        discount = Number(selectedOffer.amount);
      } else if (selectedOffer.type === "percentage") {
        discount = Math.round((Number(selectedOffer.amount) / 100) * subtotal);
      }
    }

    const platformFee = 50;
    const grandTotal = subtotal - discount + platformFee;

    console.log(user);
    const bookingData = {
      customer_id: user?.id,
      vendor_id: cartItem?.service?.vendor?.id,
      services: cartItem?.service?.id,
      amount: grandTotal,
      platformFee,
      status: "pending",
      tax: "5",
      date: selectedDate,
      slots: selectedSlots.map((slot) => slot.time), // include selected slot times
      note,
    };

    setConfirmedBooking(bookingData);
    setModalOpen(false);
    setConfirmationOpen(true);
  };

  function cleanTime12Hr(time) {
    return time.replace(/\s?(am|pm)/i, "").trim();
  }
  // convert yyyy-mm-dd -> dd-mm-yy
  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year.slice(2)}`;
  }

  console.log(confirmedBooking);

  const handleConfirmBooking = async (type) => {
    console.log(type);
    const formData = new FormData();

    formData.append("customer_id", confirmedBooking.customer_id);
    formData.append("amount", confirmedBooking.amount);
    formData.append("note", confirmedBooking.note);
    formData.append("vendor_id", confirmedBooking.vendor_id);
    formData.append("service_id", confirmedBooking.services);
    formData.append("platform_fee", confirmedBooking.platformFee);
    formData.append("status", "pending");
    formData.append("is_paid_key", type === "pay_now" ? "1" : "0"); // ✅ dynamic
    formData.append("tax", "5");

    const formattedDate = formatDate(confirmedBooking.date);
    confirmedBooking.slots.forEach((slot) => {
      const cleanSlot = cleanTime12Hr(slot);
      formData.append(`schedule_time[${cleanSlot}]`, formattedDate);
    });

    try {
      // ✅ Create booking/order
      const order = await createOrder(formData).unwrap();

      if (!order?.data?.id) {
        toast.error("Failed to create booking");
        return;
      }

      if (type === "pay_now") {
        // 🔹 Razorpay payment flow
        if (!order?.data?.order_id) {
          toast.error("Failed to create Razorpay order");
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order?.data?.amount,
          currency: "INR",
          name: "Quickmyslot",
          description: "Book your Services",
          order_id: order?.data?.order_id,
          handler: async function (response) {
            const verifyData = new FormData();
            verifyData.append("booking_id", order?.data?.id);
            verifyData.append(
              "razorpay_payment_id",
              response.razorpay_payment_id
            );
            verifyData.append("razorpay_order_id", response.razorpay_order_id);
            verifyData.append(
              "razorpay_signature",
              response.razorpay_signature
            );

            try {
              const verifyRes = await verifyPayment(verifyData).unwrap();
              if (verifyRes.status) {
                toast.success("Payment verified & booking confirmed!");
                refetch();
              } else {
                toast.error("Payment verification failed");
              }
            } catch (err) {
              toast.error("Error verifying payment");
              console.error(err);
            }
          },
          prefill: {
            name: user?.name,
            contact: user?.phone_number,
            email: user?.email,
          },
          theme: { color: "#EE4E34" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // 🔹 No payment
        refetch();
        toast.success("Booking created successfully (without payment)!");
      }
    } catch (err) {
      toast.error("Error creating booking");
      console.error(err);
    }

    // ✅ Reset states
    setConfirmationOpen(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setAppliedOffer(null);
    setNote("");
    setSelectedSlots([]);
    setCartItem(null);
    setSlotId(null);
    setVendorId(null);
    refetch();
  };

  const removeItem = async (id) => {
    console.log(id);
    await removeCartList(id)
      .unwrap()
      .then(() => {
        toast.success("Item removed succesfully!");
      })
      .catch(() => {
        toast.error("Failed to remove items!");
      });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="mb-4 text-[#EE4E34]">
          &larr; Back
        </button>

        <div className="flex flex-col md:flex-row gap-4 max-w-7xl mx-auto p-6">
          <div className="bg-white w-full rounded-2xl shadow p-6 sticky top-6 min-h-[500px] flex flex-col">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 text-[#EE4E34] tracking-tight">
              Your Booking Cart
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md">
              Review your selected services below before proceeding to book.
            </p>

            <div className="flex-1 h-[350px] overflow-y-auto">
              {cartList?.data?.items?.length === 0 ? (
                <div className="h-[450px] flex flex-col justify-center items-center text-center px-6">
                  <Empty
                    description={
                      <span className="text-gray-500 text-lg max-w-xs">
                        Your cart is currently empty. Start adding services to
                        see them here!
                      </span>
                    }
                  />
                  <button
                    onClick={() => navigate(-1)}
                    className="mt-6 px-4 py-2 bg-[#EE4E34] text-white text-[14px] rounded-md font-semibold hover:bg-[#d9432a] transition"
                  >
                    Browse Services
                  </button>
                </div>
              ) : (
                <ul className="space-y-4 scrollbar-none">
                  {cartList?.data?.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex flex-col md:flex-row gap-4 border rounded-xl p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                    >
                      {/* Service Image */}
                      <img
                        src={item?.service?.image}
                        alt={item?.service?.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />

                      {/* Service Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-[#EE4E34]">
                            {item?.service?.name}
                          </h3>
                          <div className="flex gap-2">
                            <Button
                              type="text"
                              icon={<BsTrash2 size={18} />}
                              onClick={() => removeItem(item.cart_id)}
                              className="text-red-600 hover:text-red-800"
                            />
                            <button
                              size="small"
                              className="bg-[#EE4E34] hover:bg-[#EE4E34] text-sm rounded-md px-4 border-[#EE4E34] font-semibold"
                              onClick={() => bookService(item)}
                            >
                              Book Now
                            </button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item?.service?.description}
                        </p>

                        {/* Vendor Info */}
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">Vendor:</span>{" "}
                          {item?.service?.vendor?.business_name}
                          <span className="ml-2">
                            ({item?.service?.vendor?.years_of_experience} yrs
                            exp.)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex justify-between items-center mt-4">
                          {item?.service?.discount_price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 line-through">
                                ₹{item?.service?.price}
                              </span>
                              <span className="text-[#EE4E34] font-semibold">
                                ₹{item?.service?.discount_price}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#EE4E34] font-semibold">
                              ₹{item?.service?.price}
                            </span>
                          )}

                          <span className="text-xs text-gray-400">
                            Added on{" "}
                            {new Date(item.added_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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
            style={{ backgroundColor: "#EE4E34", borderColor: "#EE4E34" }}
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
        <h3 className="font-semibold mb-0">Selected Services</h3>
        <div className="p-2 bg-orange-50 rounded-sm mb-6">
          <p className="flex justify-between">
            <span className="text-orange-600 font-medium">
              {cartItem?.service?.name}
            </span>
            <span className="text-orange-600 font-medium">
              {cartItem?.item_price}
            </span>
          </p>
        </div>

        {/* Date & Time */}
        {/* <h3 className="font-semibold mb-2">Choose Date & Time</h3>
        <div className="flex gap-4 mb-4 flex-row sm:flex-row">
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
        </div> */}

        {/* Date & Slot Selection */}
        <h3 className="font-semibold mb-2">Choose Date & Slot</h3>
        <DatePicker
          onChange={(_, dateString) => setSelectedDate(dateString)}
          placeholder="Select Date"
          style={{ width: "170px" }}
        />
        <div className="flex mt-4 flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 min-w-[170px]">
            <div>
              <div className="flex items-center gap-2 font-semibold mt-4 mb-1">
                <span>⏰ Scheduled Slots</span>
                <span className="text-orange-500 text-xs font-semibold">
                  🔥 filling soon
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {slotOptions.scheduled.map((slot) => {
                  const isSelected = selectedSlots.find(
                    (s) => s.time === slot.time
                  );
                  return (
                    <button
                      key={slot.time}
                      className={`rounded flex items-center px-3 py-2 border text-xs
                    ${
                      isSelected
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-300 bg-white"
                    }
                  `}
                      onClick={() => handleSlotClick(slot)}
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
                  );
                })}
              </div>

              {selectedSlots.length < 1 && (
                <p className="text-red-500 text-xs">
                  Please select at least 1 slot.
                </p>
              )}
            </div>
          </div>

          {/* Optional: Show selected slots */}
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-gray-700">Selected Slots:</h4>
            {selectedSlots.map((s) => (
              <span key={s.time} className="text-sm text-gray-600">
                {s.time} {s.fee ? `(+₹${s.fee})` : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Offers */}
        <h3 className="font-semibold mb-2">Available Offers</h3>
        <Select
          placeholder="Apply Offer"
          className="mb-4 w-full"
          onChange={(val) => setAppliedOffer(val)}
          value={appliedOffer}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {Array.isArray(availableOffers?.data) &&
          availableOffers.data.length > 0 ? (
            availableOffers.data.map((offer) => (
              <Option key={offer.id} value={offer.promo_code}>
                {offer.promo_code} -{" "}
                {offer.type === "flat"
                  ? `₹${offer.amount}`
                  : `${offer.amount}%`}{" "}
                {offer.isActive ? "(Active)" : "(Inactive)"}
              </Option>
            ))
          ) : (
            <Option disabled>No offers available</Option>
          )}
        </Select>

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
          const slotFees = selectedSlots?.reduce(
            (sum, slot) => sum + (slot.fee || 0),
            0
          );
          const subtotal = Number(cartItem?.item_price) + slotFees || 0;

          // Find the selected offer object
          const selectedOffer = availableOffers?.data?.find(
            (offer) => offer.promo_code === appliedOffer
          );

          // Calculate discount amount
          let discount = 0;
          if (selectedOffer) {
            if (selectedOffer.type === "flat") {
              discount = Number(selectedOffer.amount);
            } else if (selectedOffer.type === "percentage") {
              discount = Math.round(
                (Number(selectedOffer.amount) / 100) * subtotal
              );
            }
          }

          const platformFee = 50;
          const grandTotal = subtotal - discount + platformFee;

          return (
            <div className="space-y-2 text-base">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span className="text-sm">
                  Discount{" "}
                  {selectedOffer ? `(${selectedOffer.promo_code})` : ""}
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
          <Button
            key="pay_later"
            onClick={() => handleConfirmBooking("pay_later")}
          >
            Confirm & Pay Later
          </Button>,
          <Button
            key="confirm"
            type="primary"
            style={{ backgroundColor: "#EE4E34", borderColor: "#EE4E34" }}
            onClick={() => handleConfirmBooking("pay_now")}
          >
            Confirm & Pay Now
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
        {/* <div className="mb-4">
          <h3 className="font-bold mb-1">Salon Details</h3>
          <p className="font-semibold">
            {shopData.business_name}, {shopData.address}
          </p>
        </div> */}

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
