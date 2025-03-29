import React from "react";
import { Link } from "react-router-dom";

//import components
import SidebarContent from "./SidebarContent";

//import images
import logo from "../../assets/images/logo.svg";
import logoLightSvg from "../../assets/images/logo-light.svg";

const Sidebar = (props: any) => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logo} alt="EA" height="32" />
            </span>
            <span className="logo-lg">
              <img src={logo} alt="EA" height="32" />
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoLightSvg} alt="EA" height="32" />
            </span>
            <span className="logo-lg">
              <img src={logoLightSvg} alt="EA" height="32" />
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;