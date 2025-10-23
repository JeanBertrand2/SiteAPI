import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <div>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
