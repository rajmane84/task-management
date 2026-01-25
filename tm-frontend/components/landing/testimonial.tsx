import React from "react";
import { Star } from "lucide-react";

export type TestimonialProps = {
  name: string;
  quote: string;
  role: string;
  rating?: number;
};

const Testimonial: React.FC<TestimonialProps> = ({
  name,
  quote,
  role,
  rating = 5,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>

      <p className="mb-4 italic">“{quote}”</p>

      <div className="text-sm font-semibold">{name}</div>
      <div className="text-xs text-gray-500">{role}</div>
    </div>
  );
};

export default Testimonial;
