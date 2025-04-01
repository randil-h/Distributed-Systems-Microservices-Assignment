import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { GiCookie } from "react-icons/gi";
import { StarIcon, ClockIcon, TruckIcon } from '@heroicons/react/24/solid';

// Import images
import img1 from '../../media/food/pexels-bemistermister-3434523.jpg';
import img2 from '../../media/food/pexels-chrslnz-588776.jpg';
import img3 from '../../media/food/pexels-dapur-melodi-192125-1109197.jpg';
import img4 from '../../media/food/pexels-jonathanborba-2983099.jpg';
import img5 from '../../media/food/pexels-karthik-reddy-130698-397913.jpg';
import img6 from '../../media/food/pexels-lisa-dol-307937-916925.jpg';
import img7 from '../../media/food/pexels-lum3n-44775-1410235.jpg';
import img8 from '../../media/food/pexels-sebastian-coman-photography-1598188-3659862.jpg';


export default function PopularNow() {
  const [showPopover, setShowPopover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Sample restaurant data with images from the food folder
  const restaurants = [
    {
      id: 1,
      name: "Burger Palace",
      image: img1,
      deliveryFee: "$2.99",
      rating: 4.8,
      deliveryTime: "15-25 min"
    },
    {
      id: 2,
      name: "Pizza Heaven",
      image: img2,
      deliveryFee: "$1.99",
      rating: 4.6,
      deliveryTime: "20-30 min"
    },
    {
      id: 3,
      name: "Sushi Express",
      image: img3,
      deliveryFee: "$3.49",
      rating: 4.9,
      deliveryTime: "25-35 min"
    },
    {
      id: 4,
      name: "Taco Fiesta",
      image: img4,
      deliveryFee: "$2.49",
      rating: 4.7,
      deliveryTime: "15-25 min"
    },
    {
      id: 5,
      name: "Noodle House",
      image: img5,
      deliveryFee: "$3.99",
      rating: 4.5,
      deliveryTime: "30-40 min"
    },
    {
      id: 6,
      name: "Pink Salt",
      image: img6,
      deliveryFee: "$2.99",
      rating: 4.4,
      deliveryTime: "20-30 min"
    },
    {
      id: 7,
      name: "Anohana",
      image: img7,
      deliveryFee: "$2.99",
      rating: 4.4,
      deliveryTime: "20-30 min"
    },
    {
      id: 8,
      name: "Aunty's Kade",
      image: img8,
      deliveryFee: "$2.99",
      rating: 4.4,
      deliveryTime: "20-30 min"
    }
  ];

  return (
    <div
      className="text-black bg-nomnom rounded-t-3xl top-28 w-screen flex flex-col content-center justify-center align-middle py-16 items-center">
      <div className=" text-xl text-start text-light_hover/50 px-12 w-full mb-2">
        Explore the quickest delivery options
      </div>
      <div className=" text-6xl text-start text-light_hover px-12 w-full mb-12">
        Fastest Near You
      </div>

      {/* Scrollable cards container */}
      <div className="w-full px-12 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex space-x-4 min-w-max">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="relative bg-white rounded-3xl overflow-hidden w-72 h-96 flex-shrink-0 "
            >
              {/* Image background covering entire card */}
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{backgroundImage: `url(${restaurant.image})`}}
              />

              {/* Dark overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

              {/* Content positioned at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-light_hover ">
                <h3 className=" text-start text-4xl mb-2">{restaurant.name}</h3>

                <div className="flex items-center mb-2">
                  <StarIcon className="h-5 w-5 text-yellow-500 mr-1"/>
                  <span className="font-medium">{restaurant.rating}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TruckIcon className="h-4 w-4 mr-1"/>
                    <span>{restaurant.deliveryFee}</span>
                  </div>

                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1"/>
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
