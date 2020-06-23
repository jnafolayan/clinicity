import React, { createContext, useReducer } from "react";

type InitialStateType = {
  user: any;
};

const initialState = { user: null };
export const UserContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: any, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case "auth":
      return { ...state, user: payload };
    default:
      return { ...state };
  }
};

const UserProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
