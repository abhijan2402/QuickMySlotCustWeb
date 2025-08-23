import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { salondata } from "../../utils/slaondata";
import { MdMap } from "react-icons/md";
import { BsPhoneFill } from "react-icons/bs";

export default function ServiceDetailPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const shop = salondata.find((s) => s.id === Number(shopId));

  if (!shop) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Shop Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const offers = Array.isArray(shop.offer)
    ? shop.offer
    : shop.offer
    ? [shop.offer]
    : [];

  return (
    <section className="max-w-7xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-purple-700 underline mb-6"
      >
        &larr; Back to Services
      </button>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-purple-700 mb-2">
              {shop.name}
            </h1>
            <p className="text-gray-600">{shop.address}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-gray-700">
              <span>
                <b>Available:</b> {shop.time}
              </span>
              <span>
                <b>Experience:</b> {shop.experience}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <button className="flex items-center gap-2 bg-transparent text-black border border-purple-700 px-4 py-2 rounded hover:bg-purple-200 transition">
                <BsPhoneFill /> Contact
              </button>
              <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                <MdMap /> Get Directions
              </button>
            </div>
          </div>

          {/* Salon Images */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Slider {...sliderSettings}>
              {shop.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${shop.name} ${i + 1}`}
                  className="w-full h-[400px] object-cover"
                />
              ))}
            </Slider>
          </div>

          {/* Services Offered */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-black">
              Services Offered
            </h2>
            <div className="flex flex-wrap gap-4">
              {shop.services.map((service, i) => (
                <div
                  key={i}
                  className="cursor-pointer bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transition w-40 text-center"
                >
                  <p className="font-semibold text-purple-700">
                    {service.service_name}
                  </p>
                  {/* <p className="text-sm text-gray-600 mt-1">
                    Click to learn more
                  </p> */}
                </div>
              ))}
            </div>
          </div>

          {/* About Shop */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-black">
              About This Shop
            </h2>
            <p className="text-gray-700">{shop.about}</p>
          </div>

          {/* Gallery */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-black">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {shop.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${shop.name} gallery ${i + 1}`}
                  className="rounded shadow-md object-cover w-full h-40"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-6 h-max">
          {/* Book Button */}
          <button
            className="w-full bg-purple-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-purple-700 transition"
            onClick={() => navigate(`/book-service/${shop.id}`)}
          >
            Book Services
          </button>

          {/* Offers */}
          {offers.length > 0 && (
            <div className="border p-2 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-2 text-white font-bold flex items-center justify-between">
                <span className="flex text-black text-sm font-semibold items-center gap-2">
                  🎁 Offers Available
                </span>
                <span className="bg-purple-700 text-white px-4 py-1 text-sm font-semibold rounded-full">
                  {offers.length}
                </span>
              </div>
              <Slider
                dots={true}
                infinite={offers.length > 1}
                autoplay={offers.length > 1}
                autoplaySpeed={3000}
                arrows={false}
                slidesToShow={1}
                slidesToScroll={1}
              >
                {offers.map((offer, i) => (
                  <div
                    key={i}
                    className="py-2 px-6 text-center text-green-600 text-lg font-medium transition transform hover:scale-105"
                  >
                    {offer}
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
              {shop.reviews.map((review, i) => (
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
                  <p className="text-gray-600 italic text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
