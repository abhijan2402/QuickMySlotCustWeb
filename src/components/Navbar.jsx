import { useState, useEffect } from "react";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaUserCircle,
} from "react-icons/fa"; // For wishlist and location icons
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "/logo.png";
import { FaLocationDot, FaLocationPin } from "react-icons/fa6";
import { BiHeart } from "react-icons/bi";
import { BsBellFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { MdOutlineMyLocation } from "react-icons/md";
import { useGetCartListQuery } from "../services/vendorApi";
import {
  getAddressFromLatLng,
  getCityAndAreaFromAddress,
  getLatLngFromAddress,
} from "../utils/utils";
import { IoIosArrowDown } from "react-icons/io";
import LocationModal from "./Modals/LocationModal";
import { useLocationContext } from "../context/LocationProvider";

export default function Navbar() {
  const { newLoc, setNewLoc } = useLocationContext();
  const user = useSelector((state) => state.auth.user);
  const { data: cartList } = useGetCartListQuery();
  const cartCount = cartList?.data?.total_items || 0;
  // console.log(user);
  const navigate = useNavigate();
  const location = useLocation();
  const [city, setCity] = useState(null);
  const [area, setArea] = useState(null);
  const [initialLocation, setInitialLocation] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    async function fetchCityAndArea() {
      // If lat/lng is present in newLoc, use reverse geocoding accordingly
      if (newLoc?.lat && newLoc?.lng) {
        // Assuming you have a function getAddressFromLatLng that returns { city, area }
        const result = await getAddressFromLatLng(newLoc.lat, newLoc.lng);
        if (result) {
          setCity(result.city);
          setArea(result.area);
          return;
        }
      }

      // Otherwise, fallback to geocode from user.address when available
      if (user?.address) {
        const result = await getCityAndAreaFromAddress(user?.address);
        if (result) {
          setCity(result.city);
          setArea(result.area);
          return;
        }
      }

      // Reset if neither are available or failed lookup
      setCity(null);
      setArea(null);
    }

    fetchCityAndArea();
  }, [user?.address, newLoc]);

  // Convert user's address to lat/lng on change
  const addressString = user?.address;
  useEffect(() => {
    async function fetchLatLng() {
      const coord = await getLatLngFromAddress(addressString);
      if (coord) {
        setInitialLocation(coord);
      } else {
        console.error("Could not geocode address");
      }
    }
    fetchLatLng();
  }, [addressString]);

  // console.log(initialLocation);

  const navItems = [
    "Home",
    "My Appointment",
    "Membership",
    "Offers",
    "Support",
  ];
  const routeToNavItem = {
    "/": "Home",
    "/appointments": "My Appointment",
    "/offers": "Offers",
    "/pricing": "Membership",
    "/support": "Support",
  };
  const [active, setActive] = useState(routeToNavItem[location.pathname] || "");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync active nav item with route changes
  useEffect(() => {
    setActive(routeToNavItem[location.pathname] || "");
  }, [location.pathname]);

  // Nav item click handler updated to navigate routes
  const handleClick = (item) => {
    setActive(item);
    setIsMobileMenuOpen(false);

    // Navigate to corresponding route for nav item
    const path =
      Object.keys(routeToNavItem).find((key) => routeToNavItem[key] === item) ||
      "/";
    navigate(path);
  };

  const isMinimalPage =
    location.pathname === "/privacy-policy" ||
    location.pathname === "/terms-and-conditions";

  // Example wishlist count
  const wishlistCount = 3;
  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[85px] z-50 bg-white bg-opacity-90 backdrop-blur-md shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Right Part: Logo */}

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="QuickmySlot Logo"
              className="h-16 w-32 rounded object-contain"
            />
          </div>

          {/* Center Part: Nav Items */}
          {!isMinimalPage && (
            <ul className="hidden md:flex gap-6 text-[#000] font-medium">
              {navItems.map((item) => (
                <li
                  key={item}
                  onClick={() => handleClick(item)}
                  className={`cursor-pointer px-3 py-1 text-sm rounded transition ${
                    active === item
                      ? "bg-[#EE4E34] text-white"
                      : "hover:bg-[#eee]"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Left Part: Wishlist, Location, User Profile */}
          {!isMinimalPage && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/notifications")}
                className="relative p-2 rounded-full border border-[#EE4E34] text-[#EE4E34] hover:bg-[#EE4E34] hover:text-white transition"
              >
                <div
                  className="w-6 h-6 rounded-full bg-[#EE4E34] text-white flex items-center justify-center font-semibold"
                  title={user?.name}
                >
                  <span className="relative p-1 rounded-full bg-[#EE4E34]">
                    <BsBellFill className="text-sm text-white" />
                  </span>
                </div>
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="relative p-2 rounded-full border border-[#EE4E34] text-[#EE4E34] hover:bg-[#EE4E34] hover:text-white transition"
              >
                {" "}
                <div
                  className="w-6 h-6 rounded-full bg-[#EE4E34] text-white flex items-center justify-center font-semibold"
                  title="Profile"
                >
                  {user.name?.charAt(0)?.toUpperCase() || "-"}{" "}
                </div>{" "}
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 rounded-full border border-[#EE4E34] text-[#EE4E34] hover:bg-[#EE4E34] hover:text-white transition"
              >
                {/* Cart Icon */}
                <FaShoppingCart className="w-6 h-6" />

                {/* Count Badge */}
                {cartList?.data?.total_items > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              <div
                role="button"
                className="flex items-center gap-1  rounded-l  cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C0902]"
                title="Click to select a different location"
                onClick={() => setModalOpen(true)}
              >
                <FaLocationDot
                  className="w-6 h-6 text-[#EE4E34]"
                  aria-hidden="true"
                />
                <div className="flex flex-col leading-none">
                  {/* <span className="font-bold text-[#EE4E34] text-[14px]">
                    {city || "NA"}
                  </span> */}
                  <p className="text-[12px] flex items-center gap-1 justify-center text-gray-800 font-medium">
                    {city || "NA"}, {area || "NA"}
                    <span>
                      <IoIosArrowDown className="w-4 h-4 text-[#EE4E34]" />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {!isMinimalPage && (
              <>
                <div
                  role="button"
                  className="flex items-center gap-1  rounded-l  cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C0902]"
                  title="Click to select a different location"
                  onClick={() => setModalOpen(true)}
                >
                  <FaLocationDot
                    className="w-6 h-6 text-[#EE4E34]"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col leading-none">
                    {/* <span className="font-bold text-[#EE4E34] text-[14px]">
                    {city || "NA"}
                  </span> */}
                    <p className="text-[12px] flex items-center gap-1 justify-center text-gray-800 font-medium">
                      {city || "NA"}, {area || "NA"}
                      <span>
                        <IoIosArrowDown className="w-4 h-4 text-[#EE4E34]" />
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  className="md:hidden text-[#000] text-3xl"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  ☰
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {!isMinimalPage && (
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 w-full h-full bg-white text-[#000] flex flex-col items-center justify-center z-50 md:hidden"
            >
              <button
                className="absolute top-6 right-6 text-3xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>

              <ul className="flex flex-col gap-6 text-xl">
                {navItems.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleClick(item)}
                    className={`cursor-pointer text-center transition px-3 py-1 rounded ${
                      active === item
                        ? "bg-[#EE4E34] text-white"
                        : "hover:bg-[#eee]"
                    }`}
                  >
                    {item}
                  </li>
                ))}
                <ul className="flex flex-col gap-4 justify-center items-center ">
                  <li>
                    <div
                      className="relative cursor-pointer text-xl text-black"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/notifications");
                      }}
                    >
                      <span className=" text-cente text-xl">Notification</span>
                      {/* {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {wishlistCount}
                        </span>
                      )} */}
                    </div>
                  </li>

                  <li>
                    <div
                      className="relative cursor-pointer text-xl text-black"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/cart");
                      }}
                    >
                      <span className=" text-cente text-xl">Cart</span>
                      {cartList?.data?.total_items > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </div>
                  </li>

                  <li>
                    <div
                      className="cursor-pointer text-black text-xl "
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/profile");
                      }}
                    >
                      Profile
                    </div>
                  </li>
                </ul>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <LocationModal
        open={modalOpen}
        initialLocation={initialLocation}
        onOk={(loc) => {
          setUserLocation({ lat: loc.lat, lng: loc.lng });
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}
