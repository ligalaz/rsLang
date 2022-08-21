import React, { useState, FormEventHandler, FormEvent } from "react";
import { useCreateUserMutation } from "../../../services/auth-service";
//import { wordsService } from "../../../services/words-service";

const RegistrationPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [
    createUser,
    { data, error, isUninitialized, isLoading, isSuccess, isError, reset },
  ] = useCreateUserMutation();

  const register: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    createUser({ name, email, password });
  };

  return (
    <div>
      <form onSubmit={register}>
        <input
          onChange={(event) => setName(event.target.value)}
          value={name}
          type="name"
        />
        <input
          onChange={(event) => setEmail(event.target.value)}
          value={email}
          type="email"
        />
        <input
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          type="password"
        />
        <button>Зарегестрироваться</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
