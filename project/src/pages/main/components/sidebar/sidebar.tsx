import React from "react";
import Icon from "../../../../components/icon/icon";
import { NavLink } from "react-router-dom";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import "./sidebar.scss";
import { logout } from "../../../../store/auth-slice";

function Sidebar() {
  const isAuth: boolean = useAppSelector(
    (state: RootState) => !!state.authState.auth
  );
  const dispatch = useAppDispatch();
  return (
    <aside className="sidebar">
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
              <Icon type="log-out" />
              <span className="sidebar__link-text">Log Out</span>
            </div>
          ) : (
            <NavLink className="sidebar__link sidebar__footer-flex" to="/login">
              <Icon type="log-out" />
              <span className="sidebar__link-text">Log In</span>
            </NavLink>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
