import "./App.css";
//import Companies from "./components/Landing/Companies/Companies";
//import Contact from "./components/Landing/Contact/Contact";
//import Footer from "./components/Landing/Footer/Footer";
//import GetStarted from "./components/Landing/GetStarted/GetStarted";
//import Header from "./components/Landing/Header/Header";
//import Hero from "./components/Landing/Hero/Hero";
//import Residencies from "./components/Landing/Residencies/Residencies";
//import Value from "./components/Value/Value";
import {Route ,BrowserRouter as Router,Routes} from "react-router-dom" ;
import Login from "./components/Authentications/Login/Login";
import Signup from "./components/Authentications/Signup/Signup";
import Landregistrer from "./components/Dashboards/Landregistrer/Landregistrer";
import Notary from "./components/Dashboards/Notary/Notary";
import Landsurveyor from "./components/Dashboards/LandSurveyor/Landsurveyor";
import Landowner from "./components/Dashboards/LandOwner/Landowner";
import Landbuyer from "./components/Dashboards/Land Buyer/landbuyer";
import Geoapi from "./components/Geolocalisation/geoapi";
import Certificate from "./components/PDFs/Certificate of ownership/Certificate"
import Landing from "./components/Landing";
import Map from "./components/Map Api/map";

//import {Companies,Contact,Footer,GetStarted,Header,Hero,Residencies,Value as Landing} from "./components/Landing";


function App() {
  return (
    //<div className="App">
      //<div>
        //<div className="white-gradient" />
        //<Header />
       //<Hero />
      //</div>
      //<Companies />
      //<Residencies/>
      //<Value/>
      //<Contact/>
      //<GetStarted/>
      //<Footer/> 
     <Router>
            <Routes>
                
                <Route path ="/login" element={<Login />}/>
                <Route path ="/signup" element={<Signup />}/>
                <Route path ="/landregistrer" element={<Landregistrer />}/>
                <Route path ="/notary" element={<Notary />}/>
                <Route path ="/landsurveyor" element={<Landsurveyor />}/>
                <Route path ="/landowner" element={<Landowner />}/>
                <Route path ="/landbuyer" element={<Landbuyer />}/>
                <Route path ="/" element={<Landing />}/>
                <Route path ="/map" element={<Map />}/>

                <Route path ="/geoapi" element={<Geoapi />}/>
                

                <Route path ="/certificateofownership" element={<Certificate />}/>

                

            </Routes>
        </Router>
    //</div>
  );
}

export default App;
