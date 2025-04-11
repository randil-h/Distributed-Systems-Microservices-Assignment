import {UserCircleIcon} from '@heroicons/react/24/solid';
import {Link} from "react-router-dom";
import React, {useState} from "react";
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/solid';
import {GiCookie} from "react-icons/gi";
import Icon from '../../media/icons/cookie.png';

export default function Dashboard() {
  const [showPopover, setShowPopover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="text-black flex flex-col content-center justify-center align-middle w-full items-center">
      <div className="py-6 px-6 text-3xl border-b border-gray-400  w-full">
        Aunty ge kade
      </div>
      <div className="h-screen text-3xl border-b border-gray-400 w-full flex justify-between">
        <div className="w-1/3 text-center border-r border-gray-400 py-6">Pending Orders</div>
        <div className="w-1/3 text-center border-r border-gray-400 py-6">Blah1</div>
        <div className="w-1/3 text-center border-r border-gray-400 py-6">Blah2</div>
      </div>

    </div>
  );
}
