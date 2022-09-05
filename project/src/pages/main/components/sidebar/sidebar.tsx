import React, { useEffect, useState } from "react";
import Icon from "../../../../components/icon/icon";
import { NavLink } from "react-router-dom";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/store";
import "./sidebar.scss";
import { logout } from "../../../../store/auth-slice";
import { useMediaQuery } from "usehooks-ts";
import classNames from "classnames";
import { ITextbookRouteParams } from "../personal/personal";

function Sidebar() {
  const [mobileMenuFlag, setMobileMenuFlag] = useState(false);
  const screen = useMediaQuery("(max-width: 500px)");
  const isDailyStatistics = useMediaQuery("(max-width: 767px)");
  const isAuth: boolean = useAppSelector(
    (state: RootState) => !!state.authState.auth
  );
  const dispatch = useAppDispatch();

  const [routeParams, setRouteParams] = useState<ITextbookRouteParams>(null);

  useEffect(() => {
    if (location.pathname.includes("textbook")) {
      const pathes: string[] = location.pathname.split("/");
      const params: ITextbookRouteParams = {
        group: pathes[3],
      };
      if (pathes.length === 5) {
        params.page = pathes[4];
      }
      setRouteParams(params);
    } else {
      setRouteParams(null);
    }
  }, [location.pathname]);

  return (
    <>
      <NavLink
        style={{ opacity: `${!(mobileMenuFlag && screen) ? "1" : "0"}` }}
        onClick={() => setMobileMenuFlag(false)}
        className="logo-link"
        to="/main"
      >
        <Icon type="logo" />
      </NavLink>

      {mobileMenuFlag && <div className="burger-overlay"></div>}

      <div
        onClick={() => setMobileMenuFlag((prev) => !prev)}
        className={classNames("hat__burger", {
          "hat__burger-rotate": mobileMenuFlag,
        })}
      >
        <Icon
          type={`${
            mobileMenuFlag ? "burger-sidebar-opened" : "burger-sidebar"
          }`}
        />
      </div>
      <div className="hat"></div>
      <aside
        className={classNames("sidebar", {
          sidebar__appear: mobileMenuFlag,
        })}
      >
        <div className="sidebar__flex">
          <div className="sidebar__upper">
            <div className="sidebar__logo">
              <NavLink to="/main" onClick={() => setMobileMenuFlag(false)}>
                <Icon type={`${screen ? "logo-white" : "logo"}`} />
              </NavLink>
            </div>
          </div>
          <div className="sidebar__links">
            <NavLink
              onClick={() => setMobileMenuFlag(false)}
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
              onClick={() => setMobileMenuFlag(false)}
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
              onClick={() => setMobileMenuFlag(false)}
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
              onClick={() => setMobileMenuFlag(false)}
              className={({ isActive }) =>
                location.pathname.includes("textbook")
                  ? "sidebar__link sidebar__link_active"
                  : "sidebar__link"
              }
              to="/main/textbook/0/0"
            >
              Textbook
            </NavLink>
            {isDailyStatistics && isAuth && (
              <NavLink
                onClick={() => setMobileMenuFlag(false)}
                className={({ isActive }) =>
                  isActive
                    ? "sidebar__link sidebar__link_active"
                    : "sidebar__link"
                }
                to="/main/personal"
              >
                Personal
              </NavLink>
            )}
            {isDailyStatistics && routeParams && (
              <>
                <NavLink
                  to={
                    routeParams.page
                      ? `/sprint?group=${routeParams.group}&page=${routeParams.page}`
                      : `/sprint?group=${routeParams.group}`
                  }
                  className="sidebar__link"
                >
                  Sprint
                </NavLink>

                <NavLink
                  to={
                    routeParams.page
                      ? `/audiocall?group=${routeParams.group}&page=${routeParams.page}`
                      : `/audiocall?group=${routeParams.group}`
                  }
                  className="sidebar__link"
                >
                  Audio call
                </NavLink>
                <NavLink
                  to={
                    routeParams.page
                      ? `/savanna?group=${routeParams.group}&page=${routeParams.page}`
                      : `/savanna?group=${routeParams.group}`
                  }
                  className="sidebar__link"
                >
                  Savanna
                </NavLink>
              </>
            )}

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
              <NavLink
                onClick={() => {
                  dispatch(logout());
                  setMobileMenuFlag(false);
                }}
                className="sidebar__link sidebar__footer-flex"
                to="/main"
              >
                <Icon type={"log-out"} />
                <span className="sidebar__link-text">Log Out</span>
              </NavLink>
            ) : (
              <NavLink
                className="sidebar__link sidebar__footer-flex"
                to="/login"
              >
                <Icon type={"log-out"} />
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
