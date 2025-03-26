export default function Footer(){
  return (
    <footer className="bg-accent2">
      <div className="mx-auto max-w-screen-xl py-16">
        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="mt-8 grid grid-cols-3 gap-32 lg:mt-0 lg:grid-cols-5 lg:gap-y- text-start">

            <div className="col-span-2 sm:col-span-1">
              <p className="font-semibold uppercase text-3xl  text-gray-900">Services</p>

              <ul className="mt-6 space-y-4 text-sm ">
                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> 1on1 Coaching </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Company Review </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Accounts Review </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> HR Consulting </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> SEO Optimisation </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-semibold uppercase text-3xl text-gray-900">Company</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> About </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Meet the Team </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Accounts Review </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-semibold uppercase text-3xl text-gray-900">Links</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Contact </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> FAQs </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Live Chat </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-semibold uppercase text-3xl text-gray-900">Legal</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Accessibility </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Returns Policy </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Refund Policy </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Hiring Statistics </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className=" uppercase text-3xl font-semibold text-gray-900">Downloads</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Marketing Calendar </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> SEO Infographics </a>
                </li>
              </ul>
            </div>


          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="sm:flex sm:justify-between">
            <p className="text-xs text-gray-500">&copy; 2025. NomNOM. All rights reserved.</p>

            <ul className="mt-8 flex flex-wrap justify-start gap-4 text-xs sm:mt-0 lg:justify-end">
              <li>
                <a href="#" className="text-gray-500 transition hover:opacity-75"> Terms & Conditions </a>
              </li>

              <li>
                <a href="#" className="text-gray-500 transition hover:opacity-75"> Privacy Policy </a>
              </li>

              <li>
                <a href="#" className="text-gray-500 transition hover:opacity-75"> Cookies </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
