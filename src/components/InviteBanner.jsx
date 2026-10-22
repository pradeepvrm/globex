import { useState } from "react";
import { Link } from "react-router-dom";
import closeIcon from "../assets/home/invite-close.svg";

export default function InviteBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside className="relative flex min-h-12.75 items-center justify-center gap-3 bg-[#f9faff] px-12 py-3 text-center text-xs text-[#272727] sm:text-sm lg:text-base">
      <span>Invite Friends and get 50% off on your next purchase</span>
      <Link to="/products" className="shrink-0 text-[#00398f] hover:underline">
        Invite Now
      </Link>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 sm:right-6"
      >
        <img src={closeIcon} alt="" />
      </button>
    </aside>
  );
}
