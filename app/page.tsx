import Image from "next/image";
import { Appbar } from "./components/Appbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/How-it-works";
import Features from "./components/Features";
import CTA from "./components/Cta";
import Footer from "./components/Footer";
import { Redirect } from "./components/Redirect";

export default function Home() {
  return (
    <div>
      <Appbar />
      <Redirect />
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
