import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { salondata } from "../utils/slaondata";
import { useGetvendorQuery } from "../services/vendorApi";
import { useGetcategoryQuery } from "../services/categoryApi";
import CardCarouselLoader from "../components/CardCarouselLoader";
import NoDataAvailable from "./NoDataAvailable";
import { useVendors } from "../hooks/useVendor";
import Pagination from "../components/Pagination";
import { useLocationContext } from "../context/LocationProvider";

export default function ServicesPage() {
  const { id } = useParams();
  const [lat, setLat] = useState("");
  const [long, setLng] = useState("");
  const [page, setPage] = useState(null);
  const { newLoc, setNewLoc } = useLocationContext();
  useEffect(() => {
    if (newLoc) {
      setLng(newLoc.longitude);
      setLat(newLoc.latitude);
    }
  }, [newLoc]);
  const { data, isLoading } = useGetvendorQuery({ id, lat, long, page });
  const { data: category } = useGetcategoryQuery();
  const categoryData = category?.data?.find((cat) => cat.id === Number(id));

  console.log(data);

  // Extract unique locations
  const locations = [...new Set(salondata.map((s) => s.location))];

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const navigate = useNavigate();

  // Filtered Shops
  const filteredShops = salondata.filter((s) => {
    const matchesLocation =
      selectedLocation === "All" || s.location === selectedLocation;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesSearch;
  });
  // React-Slick settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = data?.data?.total ?? 0;
  const perPage = data?.data?.per_page ?? 20;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  useEffect(() => {
    if (data?.data?.current_page) {
      setCurrentPage(data?.data?.current_page);
    }
  }, [data]);

  return (
    <>
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <Breadcrumb propertyTitle={"Services"} />
        {/* Heading & Subheading */}
        <div className="flex flex-col items-center mb-10 px-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center w-full gap-4">
            <div className="flex-grow border-t-2 w-10 border-[#EE4E34]"></div>
            <div className="text-center px-6">
              <h2 className="text-4xl font-extrabold text-[#EE4E34]">
                {categoryData ? categoryData?.name : ""}
              </h2>
              <p className="mt-2 text-gray-700 text-sm sm:text-base max-w-md mx-auto">
                Browse through the various professional services we provide
                across different locations.
              </p>
            </div>
            <div className="flex-grow border-t-2 w-10 border-[#EE4E34]"></div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Title */}
          <h4 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            Explore & Book {categoryData ? categoryData?.name : ""} Around You
          </h4>

          {/* Search + Dropdown Container */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 border rounded-lg px-4 py-2 shadow-sm text-gray-800 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full sm:w-56 border rounded-lg px-4 py-2 shadow-sm bg-white text-gray-800 font-medium 
    focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 cursor-pointer transition"
            >
              <option value="default">Sort by Price</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Shops Grid */}
        {isLoading ? (
          <CardCarouselLoader count={6} />
        ) : data?.data?.data?.length === 0 ? (
          <NoDataAvailable />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.data?.data?.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() =>
                    navigate(
                      `/services/${categoryData?.name || "all"}/${shop.id}`
                    )
                  }
                  className="border rounded-lg shadow-lg overflow-hidden bg-white cursor-pointer hover:shadow-xl transition"
                >
                  {/* Image Carousel with Promo Overlay */}
                  <div className="relative">
                    {shop?.portfolio_images?.length > 0 ? (
                      shop.portfolio_images.length > 1 ? (
                        // ✅ Slider only if more than 1 image
                        <Slider {...sliderSettings}>
                          {shop.portfolio_images.map((img, i) => (
                            <img
                              key={i}
                              src={img?.image_url}
                              alt={shop?.name || "Portfolio image"}
                              className="w-full h-56 object-cover"
                            />
                          ))}
                        </Slider>
                      ) : (
                        // ✅ Single image — show directly
                        <img
                          src={shop.portfolio_images[0]?.image_url}
                          alt={shop?.name || "Portfolio image"}
                          className="w-full h-56 object-cover"
                        />
                      )
                    ) : (
                      // ✅ No image fallback
                      <div className="w-full h-56 flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                        Image not available
                      </div>
                    )}

                    {/* ✅ Promo Section (Overlayed at Bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-[#EE4E34] bg-opacity-90 flex items-center justify-center">
                      <p className="text-white font-medium text-center text-sm py-1">
                        Get 35% OFF Via LUZO
                      </p>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#EE4E34]">
                      {shop.business_name || "NA"}
                    </h3>
                    {/* <p className="text-gray-600 text-sm">{shop.address}</p> */}

                    <p className="text-gray-500 text-sm mt-1">
                      Experience: {shop.years_of_experience}yrs
                    </p>
                    <p className="text-gray-500 text-sm">
                      Available: {shop.daily_end_time} - {shop.daily_start_time}{" "}
                      | {shop.working_days[0]} -{" "}
                      {shop.working_days[shop.working_days.length - 1]}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Address: {shop.location_area_served},{" "}
                      {shop.exact_location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row mt-4 justify-between items-center gap-4">
              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <label htmlFor="per-page" className="text-orange-600 text-sm">
                  Items per page: {data?.data?.per_page}
                </label>
              </div>

              {/* Pagination Buttons */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setPage(page)}
              />
            </div>
          </>
        )}
      </section>
    </>
  );
}
