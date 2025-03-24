import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import {GiCookie} from "react-icons/gi";

export default function OrderBanner() {
  const [showPopover, setShowPopover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="text-black  top-28   flex flex-col content-center justify-center align-middle py-48 w-full  items-center">
      <GiCookie className="size-20 mb-8"/>
      <div className="font-semibold text-7xl">
        What are you looking for ?
      </div>
      <div className=" text-2xl text-neutral-400 pt-6">
        Search for your favourite restaurants, dishes and even groceries. Get exclusive discounts for selected restaurants.
      </div>
      <div className="relative w-2/5 mt-16 ">
        <input
          type="text"
          placeholder="Search for items to order..."
          className="w-full p-2 pl-4 pr-12 text-2xl bg-white border-b-2 border-light_hover focus:outline-none placeholder:text-xl placeholder:text-neutral-600"
        />
      </div>
    </div>
  );
}
