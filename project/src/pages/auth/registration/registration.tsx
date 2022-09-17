import React, { useState, FormEventHandler, FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../../services/auth-service";
import { ToastContainer } from "react-toastify";
import Icon from "../../../components/icon/icon";
import "../auth.scss";
import classNames from "classnames";

const RegistrationPage = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [createUser, { isError, isLoading }] = useCreateUserMutation();

  const navigate = useNavigate();

  const register: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await createUser({ name, email, password });
    !isError ? navigate("/login") : null;
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
            <Link
              style={{ textDecoration: "none" }}
              to="/login"
              className={classNames(
                "authorization__btn authorization__btn no__link",
                {
                  authorization__btn_disabled: isLoading,
                }
              )}
              type="button"
            >
              Sign in
            </Link>
            <button
              className="authorization__btn authorization__btn--active"
              type="button"
            >
              Sign up
            </button>
            <form onSubmit={register} className="form">
              <input
                className="form__input"
                type="text"
                placeholder="your name"
                onChange={(event) => setName(event.target.value)}
                value={name}
                disabled={isLoading}
              />
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
                disabled={isLoading || (!name && !email && !password)}
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

export default RegistrationPage;
