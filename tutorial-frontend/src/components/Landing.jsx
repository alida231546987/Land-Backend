import React from "react";
import Companies from "./Companies/Companies";
import Contact from "./Contact/Contact";
import Footer from "./Footer/Footer";
import GetStarted from "./GetStarted/GetStarted";
import Header from "./Header/Header";
import Hero from "./Hero/Hero";
import Residencies from "./Residencies/Residencies";
import Value from "./Value/Value";

const Landing = () => {
  return (
    <div className="App">
      <div>
        <div className="white-gradient" />
            <Header />
            <Hero />
      </div>
      <Companies />
      <Residencies/>
      <Value/>
      <Contact/>
      <GetStarted/>
      <Footer/>
    </div>
  );
};

export default Landing;
