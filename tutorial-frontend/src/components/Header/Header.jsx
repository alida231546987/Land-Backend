import React, { useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { Link } from "react-router-dom"; // Import Link from React Router

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();

  // Navigation items
  const navItems = [
    { title: "Documents", link: "#residencies" },
    { title: "Procedure", link: "#value" },
    { title: "Contact Us", link: "#contact-us" },
    { title: "Information", link: "#get-started" },
    { title: "Login", link: "/login" }, // Login link
  ];

  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* logo */}
        <img src="./applogo.png" alt="logo" width={100} />

        {/* menu */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
          }}
        >
          <div className="flexCenter h-menu" style={getMenuStyles(menuOpened)}>
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className={item.title === 'Login' ? "button" : ''}>
                  {item.title === "Login" ? (
                    <Link to={item.link}>{item.title}</Link> // Use Link for Login navigation
                  ) : (
                    <a href={item.link}>{item.title}</a> // Use anchor for other links
                  )}
                </li>
              ))}
            </ul>
          </div>
        </OutsideClickHandler>

        {/* for medium and small screens */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpened((prev) => !prev)}
        >
          <BiMenuAltRight size={30} />
        </div>
      </div>
    </section>
  );
};

export default Header;
