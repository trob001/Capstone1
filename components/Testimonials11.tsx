"use client";

import Image from "next/image";
import { StaticImageData } from "next/image";

// Optional reference types for icons (you can remove if not needed)
const refTypes = {
  other: { id: "other" },
};

// Testimonials list
const list: {
  name: string;
  text: string;
  img?: string | StaticImageData;
  type?: (typeof refTypes)[keyof typeof refTypes];
}[] = [
  {
    name: "Emily R.",
    text:
      "Pinpoint Health Path transformed how I manage my health — everything's personalized and easy to follow.",
    img: "/images/em.jpg",
    type: refTypes.other,
  },
  {
    name: "Michael T.",
    text:
      "The AI recommendations are spot on. I finally feel in control of my care.",
    img: "/images/michael.jpg",
    type: refTypes.other,
  },
];

// Single Testimonial Card
const Testimonial = ({ i }: { i: number }) => {
  const testimonial = list[i];

  return (
    <div className="rounded-2xl bg-white shadow-md p-6 hover:shadow-xl transition duration-300 ease-in-out border border-blue-100 flex flex-col gap-4">
      {testimonial.img && (
        <div className="flex items-center gap-4">
          <Image
            src={testimonial.img}
            alt={testimonial.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="text-lg font-semibold text-blue-900">{testimonial.name}</div>
        </div>
      )}
      <p className="text-gray-700 leading-relaxed text-base">{testimonial.text}</p>
    </div>
  );
};

// Testimonials Section
export default function Testimonials() {
  return (
    <section className="py-12 bg-gray-50 px-4 md:px-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-blue-800">What Our Users Say</h2>
        <p className="text-gray-600 mt-2">Real experiences from people using Pinpoint Health Path.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((_, index) => (
          <Testimonial key={index} i={index} />
        ))}
      </div>
    </section>
  );
}
