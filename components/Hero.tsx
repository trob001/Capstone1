import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
    <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
      <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight text-blue-800">
        Personalized Healthcare Plans. Smarter. Faster.
      </h1>
      <p className="text-lg opacity-80 leading-relaxed max-w-2xl">
          Pinpoint Health Plan helps individuals access the care they need with smart screening tools, 
          personalized risk analysis, and a curated network of clinics. Built for convenience and powered 
          by modern AI — your health journey starts here.
        </p>
        <a
          href="https://PinpointHealthPlan.com"
          className="btn btn-primary btn-wide"
        >
          Get Started
        </a>

        <TestimonialsAvatars priority={true} />
      </div>
      <div className="lg:w-full">
      
      <Image
        src="/images/doctor.jpg"
         alt="Doctor consultation"
        className="w-full rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
        priority
        width={500}
        height={500}
/>
      </div>
    </section>
  );
};

export default Hero;
