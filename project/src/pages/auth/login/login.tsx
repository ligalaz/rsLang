import React, { useState, FormEventHandler, FormEvent } from "react";
import { useSignInMutation } from "../../../services/auth-service";

import "../auth.scss";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signIn] = useSignInMutation();

  const login: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await signIn({ email, password });
  };

  return (
    <main id="top" className="main">
      <div className="container main__container">
        <div className="authorization-page">
          <div className="authorization-page__text">
            Start your study today!
          </div>
          <h2 className="title authorization-page__title">
            learning languages is easy!
          </h2>
          <section className="authorization">
            <button
              className="authorization__btn authorization__btn--active"
              type="button"
            >
              Sign in
            </button>
            <Link
              style={{ textDecoration: "none" }}
              to="/registration"
              className="authorization__btn authorization__btn"
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
              />
              <input
                className="form__input"
                type="password"
                placeholder="your password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
              <button className="round-btn form__round-btn" type="submit">
                OK
              </button>
              <>
                <ToastContainer />
              </>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
