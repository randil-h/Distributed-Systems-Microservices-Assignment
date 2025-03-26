import NavBar from "../components/utility_components/Navbar";
import OrderBanner from "../components/homepage_components/OrderBanner";
import PopularNow from "../components/homepage_components/PopularNow";
import Footer from "../components/utility_components/Footer";
import HomepageMap from "../components/homepage_components/HomepageMap";

const Homepage = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <div>
        <NavBar />
      </div>
      <div className="flex-grow w-screen overflow-y-auto overflow-x-hidden h-screen no-scrollbar">
        <OrderBanner/>
        <PopularNow/>
        <HomepageMap/>
        <Footer/>
      </div>
    </div>
  );
}

export default Homepage;
