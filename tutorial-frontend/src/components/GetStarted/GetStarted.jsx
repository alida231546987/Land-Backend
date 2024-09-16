import React from "react";
import "./GetStarted.css";
const GetStarted = () => {
  return (
    <div id="get-started" className="g-wrapper">
      <div className="paddings innerWidth g-container">
        <div className="flexColCenter inner-container">
          <span className="primaryText">For more inquiries on the Fragmentation procedure</span>
          <span className="secondaryText">
            If you have difficulties understanding the informations provided on this platform
            <br />
            You can contact us for more inquiries
          </span>
          <button className="button">
            <a href="mailto:nkwetchoulamagorachellealida@gmail.com">Send Email</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
