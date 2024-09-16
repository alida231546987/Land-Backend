import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        {/* left side */}
        <div className="flexColStart f-left">
          <img src="./applogo.png" alt="" width={120} />
          <span className="secondaryText">
            Our aim is to assist you in obtaining your 
            land titles and securing your land rights
          </span>
        </div>

        <div className="flexColStart f-right">
          <span className="primaryText">Information</span>
          <span className="secondaryText">Yaounde , Cameroon</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
