import Image, { StaticImageData } from 'next/image';


// The list of your testimonials. It needs 3 items to fill the row.
const list: {
  name: string;
  text: string;
  img?: string | StaticImageData;
}[] = [
  {
    name: "Emily R.",
    text: "Pinpoint helped me get proactive about screenings I didn’t even realize I needed. It’s been a total game-changer.",
    img: "/images/em.jpg",
  },
  {
    name: "Michael G.",
    text: "I used to feel overwhelmed managing my health needs. Pinpoint gave me a personalized care roadmap. Super intuitive.",
    img: "/images/michael.jpg",
  },
];

// A single testimonial, to be rendered in  a list
const Testimonial = ({ i }: { i: number }) => {
  const testimonial = list[i];

  if (!testimonial) return null;

  return (
    <li key={i}>
      <figure className="relative max-w-lg h-full p-6 md:p-10 bg-base-200 rounded-2xl max-md:text-sm flex flex-col">
        <blockquote className="relative flex-1">
          <p className="text-base-content/80 leading-relaxed">
            {testimonial.text}
          </p>
        </blockquote>
        <figcaption className="relative flex items-right justify-end gap-4 pt-4 mt-4 md:gap-8 md:pt-8 md:mt-8 border-t border-base-content/5">
          <div className="w-full flex items-center justify-between gap-2">
            <div>
              <div className="font-medium text-base-content md:mb-0.5">
                {testimonial.name}
              </div>
    
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-base-300 flex items-center justify-end text-base-content font-semibold">
                  {testimonial.img ? (
    <Image
      src={testimonial.img}
      alt={`${testimonial.name}'s testimonial for Pinpoint Health Path`}
      width={48}
      height={48}
      className="object-cover w-full h-full rounded-full"
    />
  ) : (
    <span className="flex items-center justify-center w-12 h-12 rounded-full text-lg font-medium bg-base-300">
      {testimonial.name.charAt(0)}
    </span>
  )}
</div>

          </div>
        </figcaption>
      </figure>
    </li>
  );
};

const Testimonials3 = () => {
  return (
    <section id="testimonials">
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <div className="mb-8">
            <h2 className="sm:text-5xl text-4xl font-extrabold text-base-content">
            Real people. Real results.
            </h2>
          </div>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-base-content/80">
          Here’s how Pinpoint Health Path is helping people take control of their wellness with personalized care.
          </p>
        </div>

        <ul
          role="list"
          className="flex flex-col items-center lg:flex-row lg:items-stretch gap-6 lg:gap-8"
        >
          {[...Array(3)].map((e, i) => (
            <Testimonial key={i} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials3;
