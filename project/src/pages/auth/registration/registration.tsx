import React, { useState, FormEventHandler, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../../services/auth-service";

const RegistrationPage = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [createUser] = useCreateUserMutation();

  const navigate = useNavigate();

  const register: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await createUser({ name, email, password });
    navigate("/login");
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
            <Link
              style={{ textDecoration: "none" }}
              to="/login"
              className="authorization__btn authorization__btn no__link"
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
              />
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
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default RegistrationPage;
