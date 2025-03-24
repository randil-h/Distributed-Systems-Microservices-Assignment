import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import {GiCookie} from "react-icons/gi";

export default function PopularNow() {
  const [showPopover, setShowPopover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="text-black bg-light_hover rounded-t-3xl top-28 w-screen  flex flex-col content-center justify-center align-middle py-32 items-center">
      <div className="font-semibold text-5xl text-start px-24 w-full">
        Fastest Near You
      </div>

    </div>
  );
}
