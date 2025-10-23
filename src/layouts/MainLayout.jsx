import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <div className="container-sm
                      container-md
                      container-lg
                      container-xl
                      container-xxl"  style={{margin:"90px auto", height:"100vh",width:"100vh"}}>
          
              <Outlet />
           
        </div>        
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
