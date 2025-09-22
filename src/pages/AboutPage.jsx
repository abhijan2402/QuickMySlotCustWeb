import React from "react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <main className="max-w-8xl mx-auto px-6 py-16 space-y-24">
      {/* Hero Section */}
      <section className="text-center max-w-6xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          About <span className="text-[#EE4E34]">Our Company</span>
        </h1>
        <p className="text-lg text-gray-600">
          We are committed to delivering exceptional services that empower your
          lifestyle, combining innovation, care, and quality.
        </p>
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
          alt="About us"
          className="mx-auto rounded-lg shadow-lg object-cover max-h-96 w-full"
        />
      </section>

      {/* Our Story */}
      <section className="md:flex md:items-center md:space-x-16 max-w-6xl mx-auto">
        <div className="md:flex-[2] space-y-6">
          <h2 className="text-4xl font-bold text-gray-900">Our Story</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Founded with passion and dedication, our journey began with a simple
            goal: to provide top-tier wellness and lifestyle services accessible
            to everyone. Over the years, we have grown into a diverse community
            of experts committed to quality and customer satisfaction.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            From salons and spas to healthcare and pet clinics, our range of
            services spans every aspect of your well-being and lifestyle needs.
          </p>
        </div>
        <div className="md:flex-[3] mt-10 md:mt-0">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSj6gdpc_QTfVceg7fqUQnqlm3CWSxDo35Zat_oaP4MeJ0is2IRHhQDN6ZfParNuARneA&usqp=CAU"
            alt="Our story"
            className="rounded-lg shadow-lg w-full object-cover object-center max-h-96"
          />
        </div>
      </section>

      {/* Our Values */}
      <section className="max-w-6xl mx-auto space-y-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-10 px-4">
          <div className="bg-indigo-50 p-8 rounded-lg shadow-md">
            <svg
              className="mx-auto mb-4 w-12 h-12 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Quality Commitment
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We prioritize excellence in every service we provide to ensure you
              receive optimal care and value.
            </p>
          </div>

          <div className="bg-indigo-50 p-8 rounded-lg shadow-md">
            <svg
              className="mx-auto mb-4 w-12 h-12 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Customer Focus
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Your satisfaction drives our mission; we listen carefully and
              tailor solutions to your needs.
            </p>
          </div>

          <div className="bg-indigo-50 p-8 rounded-lg shadow-md">
            <svg
              className="mx-auto mb-4 w-12 h-12 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Innovation
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We embrace forward-thinking technology and ideas to improve your
              experience continuously.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-purple-600 rounded-xl text-white max-w-6xl mx-auto px-8">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to Enhance Your Lifestyle?
        </h2>
        <p className="mb-8 max-w-xl mx-auto">
          Explore our diverse range of services and book with confidence. Join
          our community and start your journey today.
        </p>
        <button
          className="bg-white text-indigo-600 px-10 py-3 rounded-full font-semibold shadow hover:bg-gray-100 transition"
          onClick={() => navigate("/")}
        >
          Explore Services
        </button>
      </section>
    </main>
  );
};

export default AboutPage;
