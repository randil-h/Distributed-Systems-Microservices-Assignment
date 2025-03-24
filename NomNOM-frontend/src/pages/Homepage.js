import NavBar from "../components/Navbar";
import OrderBanner from "../components/OrderBanner";
import PopularNow from "../components/PopularNow";
import Footer from "../components/Footer";

const Homepage = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <div>
        <NavBar />
      </div>
      <div className="flex-grow w-screen overflow-y-auto overflow-x-hidden h-screen no-scrollbar">
        <OrderBanner/>
        <PopularNow/>
        <Footer/>
      </div>
    </div>
  );
}

export default Homepage;
