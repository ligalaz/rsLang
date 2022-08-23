import "./sidebar.scss";
import React from "react";
import getIcon from "../../../../components/icon/icon";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__flex">
        <div className="sidebar__upper">
          <div className="sidebar__logo">{getIcon("logo")}</div>
        </div>
        <div className="sidebar__links">
          <Link className="sidebar__link" to="/">
            Home
          </Link>
          <Link className="sidebar__link" to="/promo">
            Promo
          </Link>
          <Link className="sidebar__link" to="/aboutus">
            About us
          </Link>
          <Link className="sidebar__link" to="/dictionary">
            Dictonary
          </Link>
          <Link className="sidebar__link" to="/statistics">
            Statistics
          </Link>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__footer-flex">
            {getIcon("settings")}
            <Link className="sidebar__link" to="/statistics">
              Settings
            </Link>
          </div>
          <div className="sidebar__footer-flex">
            {getIcon("log-out")}
            <Link className="sidebar__link" to="/statistics">
              Log Out
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
