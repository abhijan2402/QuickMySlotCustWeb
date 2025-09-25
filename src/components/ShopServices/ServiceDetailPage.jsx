import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { salondata } from "../../utils/slaondata";
import { MdMap } from "react-icons/md";
import { BsFillHeartFill, BsPhoneFill } from "react-icons/bs";
import { BiHeart } from "react-icons/bi";
import { Tooltip } from "antd";
import { useState } from "react";
import RateReviewModal from "../Modals/RateReviewModal";
import {
  useGetvendorPromoCodeQuery,
  useGetvendorQuery,
  useAddToWishMutation,
  useRemoveWishListMutation,
} from "../../services/vendorApi";
import { useGetcategoryQuery } from "../../services/categoryApi";
import NoDataAvailable from "../../pages/NoDataAvailable";
import CardCarouselLoader from "../CardCarouselLoader";
import SpinnerLodar from "../SpinnerLodar";
import { div } from "framer-motion/m";
import { toast } from "react-toastify";

export default function ServiceDetailPage() {
  const { shopId, type } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [addToWish] = useAddToWishMutation();
  const [removeWishList] = useRemoveWishListMutation();

  const { data: category, isLoading: catLoading } = useGetcategoryQuery();
  const categoryData = category?.data?.find((cat) => cat.name === type);

  const { data, isLoading: shopLoading } = useGetvendorQuery(categoryData?.id);
  const shopData = data?.data?.find((cat) => cat.id === Number(shopId));

  const { data: offersData } = useGetvendorPromoCodeQuery(shopData?.id);

  console.log(shopData);

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const offers = Array.isArray(offersData?.data)
    ? offersData?.data
    : offersData?.data
    ? [offersData?.data]
    : [];

  // console.log(offers);

  // If loading category or shop data, show loader
  if (catLoading || shopLoading) {
    return <SpinnerLodar />;
  }

  // If shopData is not found after loading
  if (!shopData) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <NoDataAvailable message="Shop data not found" btn={true} />
      </div>
    );
  }

  const handleWishList = async (id) => {
    const fd = new FormData();
    fd.append("vendorId", id);
    await addToWish(fd)
      .unwrap()
      .then(() => {
        toast.success("Shop Added to Favourite");
      })
      .catch(() => {
        toast.error("Failed to Add as Favourite.");
      });
  };

  const handleRemoveWishList = async (id) => {
    const fd = new FormData();
    fd.append("service_id", id);
    await removeWishList(id)
      .unwrap()
      .then(() => {
        toast.success("Removed from Favourite");
      })
      .catch(() => {
        toast.error("Failed to Remove Favourite.");
      });
  };

  return (
    <>
      <section className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-[#EE4E34] underline mb-6"
        >
          &larr; Back to Services
        </button>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-[#EE4E34] mb-2">
                  {shopData?.business_name || "NA"}
                </h1>
                <Tooltip title="Add to Favourite">
                  <button
                    className={`flex items-center rounded-full p-2 text-xl
      ${
        shopData?.wishlist_status === 1
          ? "text-red-500 border border-orange-700"
          : "text-orange-700 border border-orange-700"
      }`}
                    onClick={() =>
                      shopData?.wishlist_status === 1
                        ? handleRemoveWishList(shopData?.id)
                        : handleWishList(shopData?.id)
                    }
                  >
                    {shopData?.wishlist_status === 1 ? (
                      <BsFillHeartFill className="text-red-500" />
                    ) : (
                      <BiHeart className="text-orange-700" />
                    )}
                  </button>
                </Tooltip>
              </div>
              <p className="text-gray-600">
                {shopData?.location_area_served}, {shopData?.exact_location}
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-gray-700">
                <span>
                  <b>Available:</b>
                  {"  "}
                  {shopData?.working_days[0]} -{" "}
                  {shopData?.working_days[shopData.working_days.length - 1]}{" "}
                  {"|"} {shopData?.daily_end_time} -{" "}
                  {shopData?.daily_start_time}
                </span>
                <span>
                  <b>Experience:</b> {shopData?.years_of_experience}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <button className="flex items-center gap-2 bg-transparent text-black border border-[#EE4E34] px-4 py-2 rounded hover:bg-orange-100 transition">
                  <BsPhoneFill /> Contact
                </button>
                <button className="flex items-center gap-2 bg-[#EE4E34] text-white px-4 py-2 rounded hover:bg-[#EE4E34] transition">
                  <MdMap /> Get Directions
                </button>
              </div>
            </div>

            {/* Salon Images */}
            <div className="rounded-lg border overflow-hidden shadow-sm">
              {shopData?.portfolio_images?.length > 0 ? (
                <Slider {...sliderSettings}>
                  {shopData.portfolio_images.map((img, i) => (
                    <img
                      key={i}
                      src={img?.image_url}
                      alt={shopData?.business_name || "NA"}
                      className="border h-[350px] object-cover"
                    />
                  ))}
                </Slider>
              ) : (
                <div className="w-full h-[350px] flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                  Image not available
                </div>
              )}
            </div>

            {/* Services Offered */}
            {shopData?.sub_services?.length > 0 && (
              <>
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    Services Offered
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {shopData?.sub_services?.map((service, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          navigate(
                            `/book-servicelist/${categoryData?.name}/${shopData?.id}/${service.id}`
                          )
                        }
                        className="cursor-pointer bg-white border rounded-xl p-4 shadow-sm 
                   hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
                      >
                        {/* Show image only if available */}
                        {service?.image_url ? (
                          <img
                            src={service.image_url}
                            alt={service?.name}
                            className="w-20 h-20 rounded-md object-contain mb-3"
                          />
                        ) : (
                          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md mb-3 text-gray-400 text-sm">
                            No Image
                          </div>
                        )}

                        <p className="font-medium text-gray-800 text-sm sm:text-base">
                          {service?.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* About shopData */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-black">
                About This shopData
              </h2>
              <p className="text-gray-700">{shopData?.business_description}</p>
            </div>

            {/* Amenities */}
            {/* <div>
              <h2 className="text-2xl font-semibold mb-4 text-black">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-4">
                {shopData.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-xl px-8 py-2 shadow text-center"
                  >
                    <p className="font-semibold text-gray-700 text-sm">
                      {amenity}
                    </p>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Gallery */}

            {shopData?.portfolio_images?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-black">
                  Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {shopData?.portfolio_images?.map((img, i) => (
                    <img
                      key={i}
                      src={img?.image_url}
                      alt={`${shopData.name} gallery ${i + 1}`}
                      className="rounded shadow-md object-cover w-full h-40"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6 h-max">
            {/* Book Button */}
            <button
              className="w-full bg-[#EE4E34] text-white text-lg font-semibold py-3 rounded-lg hover:bg-[#EE4E34] transition"
              onClick={() => navigate(`/book-service/${shopData.id}`)}
            >
              Book Services
            </button>

            {/* Offers */}
            {offers?.length > 0 && (
              <div className="border p-4 rounded-2xl shadow-sm bg-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    🎁 Offers Available
                  </span>
                  <span className="bg-[#EE4E34] text-white px-2 py-1 text-[8px] font-semibold rounded-full">
                    {offers?.length}
                  </span>
                </div>

                {/* Slider */}
                <Slider
                  dots={true}
                  infinite={offers?.length > 1}
                  autoplay={offers?.length > 1}
                  autoplaySpeed={4000}
                  arrows={false}
                  slidesToShow={1}
                  slidesToScroll={1}
                >
                  {offers?.map((offer, i) => (
                    <div
                      key={i}
                      className="p-4 border rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 text-center shadow hover:shadow-md transition-all duration-300"
                    >
                      {/* Promo Code */}
                      <div className="relative flex items-center mb-1">
                        {/* Promo Code */}
                        <p className="text-medium font-bold text-[#EE4E34] tracking-widest">
                          {offer?.promo_code}
                        </p>

                        {/* Type & Amount Badge */}
                        <span className="absolute -top-2 -right-3 bg-[#EE4E34] text-white text-[10px] font-semibold px-3 py-1 rounded-full shadow">
                          {offer?.type === "flat"
                            ? `Flat ₹${offer?.amount} OFF`
                            : `${offer?.amount}% OFF`}
                        </span>
                      </div>

                      {/* Expiry Date */}
                      {/* <p className="text-sm text-gray-500">
                        Valid until{" "}
                        {new Date(offer?.expired_on).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p> */}

                      {/* Optional Description */}
                      {offer?.description && (
                        <p className="text-xs text-gray-600 mt-0 line-clamp-2">
                          {offer?.description}
                        </p>
                      )}
                    </div>
                  ))}
                </Slider>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="text-sm font-semibold mb-3 text-gray-800 flex items-center gap-2">
                ⭐ Customer Reviews
              </h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
                {/* {shopData.reviews.map((review, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold">
                          {review.name[0]}
                        </div>
                        <p className="font-semibold text-sm text-gray-800">
                          {review.name}
                        </p>
                      </div>
                      <div className="text-yellow-400 text-sm">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600 italic text-sm">
                      {review.comment}
                    </p>
                  </div>
                ))} */}
              </div>
            </div>

            <button
              className="w-full bg-purple-200 text-[#EE4E34] text-md font-semibold py-2 rounded-lg hover:bg-[#EE4E34] transition hover:text-white"
              onClick={() => setModalOpen(true)}
            >
              Rate & Review
            </button>
          </aside>
        </div>
      </section>
      <RateReviewModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
