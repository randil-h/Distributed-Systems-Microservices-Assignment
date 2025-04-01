import {UserCircleIcon} from '@heroicons/react/24/solid';
import {Link} from "react-router-dom";
import React, {useState} from "react";
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/solid';
import {GiCookie} from "react-icons/gi";
import Icon from '../../media/icons/cookie.png';

export default function StaffManagement() {
  const [showPopover, setShowPopover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="text-black  top-28   flex flex-col content-center justify-center align-middle pt-48 pb-24 w-full  items-center">

      <div className=" text-7xl">
        Staff Management
      </div>

    </div>
  );
}
