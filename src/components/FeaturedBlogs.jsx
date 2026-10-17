import { Link } from "react-router";
import firstBlogImage from "../assets/home/blog-01.png";
import secondBlogImage from "../assets/home/blog-02.png";

const blogs = [
  { image: firstBlogImage, alt: "A curated clothing rack" },
  { image: secondBlogImage, alt: "Close-up of textured clothing" },
  { image: firstBlogImage, alt: "A curated clothing rack" },
];

function BlogCard({ blog }) {
  return (
    <article className="flex h-[clamp(250px,18.8vw,361px)] w-[clamp(320px,39.27vw,754px)] shrink-0 overflow-hidden rounded-[5px] bg-white shadow-[0_0_30px_rgba(150,150,150,0.07)]">
      <img src={blog.image} alt={blog.alt} className="h-full w-[38.86%] object-cover" loading="lazy" />
      <div className="flex min-w-0 flex-1 flex-col px-[clamp(14px,2.1vw,40px)] py-[clamp(14px,1.4vw,27px)] text-[#27363b]">
        <span className="text-xs text-[#848484] sm:text-sm">Blog</span>
        <h3 className="mt-3 text-[clamp(15px,1.04vw,20px)] font-bold leading-tight">
          Discover new way to decorate your home.
        </h3>
        <p className="mt-4 text-[clamp(12px,0.94vw,18px)] leading-snug text-[#848484]">
          Lorem ipsum dolor sit amet, aliqua consectetur adipiscing elit ut ...
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-[#a7a7a7] pt-2 text-xs sm:text-sm">
          <span>By Souha . H</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedBlogs() {
  return (
    <section className="w-full overflow-hidden bg-white py-10 sm:py-12">
      <h2 className="mb-6 px-[clamp(20px,2.6vw,50px)] text-[clamp(22px,1.875vw,36px)] font-bold leading-normal text-[#272727]">
        Featured Blogs
      </h2>
      <div className="flex gap-[clamp(24px,3.23vw,62px)] overflow-x-auto px-[clamp(20px,2.6vw,50px)] pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {blogs.map((blog, index) => <BlogCard key={`${blog.alt}-${index}`} blog={blog} />)}
      </div>
      <div className="mt-6 flex justify-center">
        <Link
          to="/products"
          className="rounded-lg border border-[#222] px-7 py-1.5 text-sm text-[#272727] transition-colors hover:bg-[#222] hover:text-white sm:text-base"
        >
          View all
        </Link>
      </div>
    </section>
  );
}
