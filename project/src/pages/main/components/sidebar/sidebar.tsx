import React, { useState } from "react";
import Icon from "../../../../components/icon/icon";
import { NavLink } from "react-router-dom";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import "./sidebar.scss";
import { logout } from "../../../../store/auth-slice";
import classNames from "classnames";

function Sidebar() {
  const [statisticsFlag, setStatisticsFlag] = useState(false);
  const isAuth: boolean = useAppSelector(
    (state: RootState) => !!state.authState.auth
  );
  const dispatch = useAppDispatch();
  return (
    <>
      <NavLink className="logo-link" to="/main">
        <Icon type="logo" />
      </NavLink>{" "}
      <div
        onClick={() => setStatisticsFlag((prev) => !prev)}
        className={classNames("hat__burger", {
          "hat__burger-rotate": statisticsFlag,
        })}
      >
        <Icon
          type={`${
            statisticsFlag ? "burger-sidebar-opened" : "burger-sidebar"
          }`}
        />
      </div>
      <div className="hat"></div>
      <aside
        className={classNames("sidebar", {
          sidebar__appear: statisticsFlag,
        })}
      >
        <div className="sidebar__flex">
          <div className="sidebar__upper">
            <div className="sidebar__logo">
              <NavLink to="/main">
                <Icon type="logo" />
              </NavLink>
            </div>
          </div>
          <div className="sidebar__links">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "sidebar__link sidebar__link_active"
                  : "sidebar__link"
              }
              end
              to="/main"
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "sidebar__link sidebar__link_active"
                  : "sidebar__link"
              }
              to="/main/promo"
            >
              Promo
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "sidebar__link sidebar__link_active"
                  : "sidebar__link"
              }
              to="/main/about-us"
            >
              About us
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "sidebar__link sidebar__link_active"
                  : "sidebar__link"
              }
              to="/main/textbook/0/0"
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
            {isAuth ? (
              <div
                onClick={() => dispatch(logout())}
                className="sidebar__link sidebar__footer-flex "
              >
                <Icon
                  type={`${statisticsFlag ? "log-out-burger" : "log-out"}`}
                />
                <span className="sidebar__link-text">Log Out</span>
              </div>
            ) : (
              <NavLink
                className="sidebar__link sidebar__footer-flex"
                to="/login"
              >
                <Icon
                  type={`${statisticsFlag ? "log-out-burger" : "log-out"}`}
                />
                <span className="sidebar__link-text">Log In</span>
              </NavLink>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
