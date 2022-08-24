import React, { useState, FormEventHandler, FormEvent } from "react";
import { useSignInMutation } from "../../../services/auth-service";
import { useGetUserWordsMutation } from "../../../services/user-words-service";
import { useAppSelector, RootState } from "../../../store/store";
import { IAuth } from "../../../interfaces/auth";
//import { wordsService } from "../../../services/words-service";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [
    signIn,
    { data, error, isUninitialized, isLoading, isSuccess, isError, reset },
  ] = useSignInMutation();

  const [getUserWords, { data: userWords }] = useGetUserWordsMutation();
  const userId: string = useAppSelector(
    (state: RootState) => state.authState.auth?.userId
  );
  console.log(getUserWords("1"));

  const login: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    signIn({ email, password });
  };

  return (
    <div>
      <form onSubmit={login}>
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
        <button>Войти</button>
        {userId && (
          <button onClick={() => getUserWords(userId)}>Получить слова</button>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
