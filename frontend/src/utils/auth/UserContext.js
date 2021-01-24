import React, { useReducer } from "react";
import useLocalStorage from './useLocalStorage.hook';

let reducer = (info, newInfo) => {
    return { ...info, ...newInfo };
}

const UserContext = React.createContext();

const UserProvider = (props) => {
    const [local, setLocal] = useLocalStorage("user", {
        firstName: null,
        lastName: null,
        uniqueId: { hash: null}
    });
    
    return (
        <UserContext.Provider value={useReducer(reducer, local)}>
            {props.children}
        </UserContext.Provider>
    )
};

export { UserContext, UserProvider };