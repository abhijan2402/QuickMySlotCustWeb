import { useState } from "react";
import { message } from "antd";

export function useBooking(shopData, serviceId) {
  // Filter services for this page
  const shopServices =
    shopData?.services?.filter(
      (s) => String(s.service_id) === String(serviceId)
    ) || [];

  const [cart, setCart] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({ time: "", fee: 0 });
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [note, setNote] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  console.log(cart)

  const total = cart.reduce((sum, s) => sum + Number(s.price), 0);

  // --- Cart ---
  const addToCart = (service) => {
    if (!cart.some((s) => s.id === service.id)) {
      setCart((prev) => [...prev, service]);
      message.success(`${service.name} added to cart!`);
    } else {
      message.info(`${service.name} is already in your cart.`);
    }
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Booking Confirmation ---
  const handleConfirm = () => {
    if (!selectedDate || !selectedTime || !selectedSlot.time) {
      message.error("Please select date, time, and slot");
      return;
    }
    if (!cart.length) {
      message.error("Please select at least one service");
      return;
    }

    const subtotal = cart.reduce((sum, s) => sum + Number(s.price), 0);
    const discount = appliedOffer ? Math.round(subtotal * 0.1) : 0;
    const platformFee = 50;
    const grandTotal = subtotal - discount + platformFee + selectedSlot.fee;

    const bookingData = {
      shop: shopData?.business_name,
      services: cart,
      date: selectedDate,
      time: selectedTime,
      slot: selectedSlot.time,
      appliedOffer: appliedOffer || "None",
      note,
      subtotal,
      discount,
      platformFee,
      total: grandTotal,
      appointmentId: Math.floor(Math.random() * 1000000),
    };

    setConfirmedBooking(bookingData);
    setModalOpen(false);
    setConfirmationOpen(true);
  };

  return {
    shopServices,
    cart,
    total,
    modalOpen,
    confirmationOpen,
    selectedDate,
    selectedTime,
    selectedSlot,
    appliedOffer,
    note,
    confirmedBooking,

    // actions
    setModalOpen,
    setConfirmationOpen,
    setSelectedDate,
    setSelectedTime,
    setSelectedSlot,
    setAppliedOffer,
    setNote,
    addToCart,
    removeFromCart,
    handleConfirm,
  };
}
