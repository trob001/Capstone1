"use client";

import { useRef, useState } from "react";
import type { JSX } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList arrayy below.

interface FAQItemProps {
  question: string;
  answer: JSX.Element;
}

const faqList: FAQItemProps[] = [
  {
    question: "What exactly does Pinpoint Health Path offer?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Pinpoint Health Path provides personalized healthcare recommendations, smart screening reminders, and easy access to local health services based on your unique health profile.
      </div>
    ),
  },
  {
    question: "How does Pinpoint Health Path personalize my health plan?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Using AI-driven risk prediction and your personal health data, Pinpoint Health Path creates tailored care plans with actionable recommendations that fit your needs.
      </div>
    ),
  },
  {
    question: "Can I share my health plan with my doctor or family?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Yes! You can easily share your personalized health plan with your healthcare provider or loved ones to keep everyone informed and involved.
      </div>
    ),
  },
  {
    question: "Is my health data secure?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Absolutely. We prioritize your privacy and use industry-standard encryption and security measures to protect your personal health information.
      </div>
    ),
  },
  {
    question: "What if I need help or have questions about my plan?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Our support team is always ready to assist you. You can contact us via email or through the app’s help section for any questions or guidance.
      </div>
    ),
  },
];

const FaqItem = ({ item }: { item: FAQItemProps }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="bg-base-200" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">FAQ</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
