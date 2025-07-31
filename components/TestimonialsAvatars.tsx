import Image from "next/image";

const avatars: {
  alt: string;
  src: string;
}[] = [
  {
    alt: "Happy patient",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=3276&q=80",
  },
  {
    alt: "Satisfied user",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "Healthcare advocate",
    src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "AI-powered wellness fan",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "Engaged community member",
    src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&auto=format&fit=crop&w=3376&q=80",
  },
];

const TestimonialsAvatars = ({ priority }: { priority?: boolean }) => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-4">
      {/* Avatar Group */}
      <div className="-space-x-4 flex">
        {avatars.map((image, i) => (
          <div
            className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm"
            key={i}
          >
            <Image
              src={image.src}
              alt={image.alt}
              priority={priority}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Rating and User Count */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <div className="flex gap-0.5 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          <span className="font-semibold text-gray-800">99 users</span> rate Pinpoint Health Path 5 stars
        </div>
      </div>
    </div>
  );
};

export default TestimonialsAvatars;
