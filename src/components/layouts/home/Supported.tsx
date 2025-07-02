import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";

const reviews = [
  {
    img: "/images/Metamask-logo.png",
  },
  {
    img: "/images/Circle_Logo.jpg",
  },
  {
    img: "/images/li.fi.png",
  },
];

const firstRow = reviews.slice(0, reviews.length);
// const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img }: { img: string }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 overflow-hidden rounded-md flex items-center justify-center"
        // // light styles
        // "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // // dark styles
        // "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <Image
        src={img}
        width={140}
        height={140}
        alt="Supported On-Chain Freex "
        className="object-contain max-w-36 max-h-36"
        priority={true}
      />
    </figure>
  );
};

export function Supported() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <p className="font-medium">On-Chain Ecosytem Supported</p>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.img} {...review} />
        ))}
      </Marquee>
      {/* <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.img} {...review} />
        ))}
      </Marquee> */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
