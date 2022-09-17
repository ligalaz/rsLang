import React, { useState, FormEventHandler, FormEvent } from "react";
import { useSignInMutation } from "../../../services/auth-service";
import { Link, NavLink } from "react-router-dom";
import Icon from "../../../components/icon/icon";
import "../auth.scss";
import classNames from "classnames";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signIn, { isLoading }] = useSignInMutation();

  const login: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await signIn({ email, password });
  };

  return (
    <main className="auth">
      <div className="auth__logo">
        <NavLink to="/main">
          <Icon type="logo" />
        </NavLink>
      </div>
      <div className="auth__container">
        <div className="authorization-page">
          <div className="authorization-page__text">
            Start your study today!
          </div>
          <h2 className="authorization-page__title">
            learning languages is easy!
          </h2>
          <section className="authorization">
            <button
              className="authorization__btn authorization__btn--active"
              type="button"
              disabled={!email && !password}
            >
              Sign in
            </button>
            <Link
              style={{ textDecoration: "none" }}
              to="/registration"
              className={classNames(
                "authorization__btn authorization__btn no__link",
                {
                  authorization__btn_disabled: isLoading,
                }
              )}
              type="button"
            >
              Sign up
            </Link>
            <form onSubmit={login} className="form">
              <input
                className="form__input"
                type="email"
                placeholder="your e-mail"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                disabled={isLoading}
              />
              <input
                className="form__input"
                type="password"
                placeholder="your password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                disabled={isLoading}
              />
              <button
                className="round-btn form__round-btn"
                type="submit"
                disabled={isLoading || (!email && !password)}
              >
                {isLoading ? <Icon type="button-loading"></Icon> : "OK"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
