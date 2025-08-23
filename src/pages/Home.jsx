// src/pages/Home.jsx
import Hero from "../components/Hero";
import HeroIntro from "../components/HeroIntro";
import MyBookings from "../components/MyBookings";
import ServicesCards from "../components/ServicesCards";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesCards/>
      <MyBookings/>
      <HeroIntro/>
    </>
  );
}
