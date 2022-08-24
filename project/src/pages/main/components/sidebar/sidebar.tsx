import "./sidebar.scss";
import React from "react";
import Icon from "../../../../components/icon/icon";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__flex">
        <div className="sidebar__upper">
          <div className="sidebar__logo">
            <Icon type="logo" />
          </div>
        </div>
        <div className="sidebar__links">
          <NavLink
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link_active" : "sidebar__link"
            }
            end
            to="/main"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link_active" : "sidebar__link"
            }
            to="/main/promo"
          >
            Promo
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link_active" : "sidebar__link"
            }
            to="/main/about-us"
          >
            About us
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link_active" : "sidebar__link"
            }
            to="/main/textbook"
          >
            Textbook
          </NavLink>
          {/* TODO: uncomment for statistics */}
          {/* <NavLink
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link_active" : "sidebar__link"
            }
            to="/statistics"
          >
            Statistics
          </NavLink> */}
        </div>

        <div className="sidebar__footer">
          <NavLink
            className="sidebar__link sidebar__footer-flex"
            to="/statistics"
          >
            <Icon type="settings" />
            <span className="sidebar__link-text">Settings</span>
          </NavLink>
          <NavLink
            className="sidebar__link sidebar__footer-flex"
            to="/statistics"
          >
            <Icon type="log-out" />
            <span className="sidebar__link-text">Log Out</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
