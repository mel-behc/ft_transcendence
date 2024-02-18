"use client";
import axios from "axios";
import Cookies from "js-cookie";
import React, { createContext, useContext, useReducer } from "react";

type LoadingStatus = "idle" | "loading" | "success" | "error";

type AuthContext = {
  isAuthenticated: boolean;
  status: LoadingStatus;
  user: any;
  profile: any;
  friendRequests: any;
  friends: any;
  tfa: "idle" | true | false;
};

const initialeState: AuthContext = {
  isAuthenticated: false,
  status: "idle",
  user: null,
  profile: null,
  friendRequests: null,
  friends: null,
  tfa: "idle",
};

const actionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  UPDATE_USER: "UPDATE_USER",
  TFA: "TFA",
  LOAD_USER_DATA: "LOAD_USER_DATA",
  LOAD_PROFILE_DATA: "LOAD_PROFILE_DATA",
  LOAD_FRIEND_REQUESTS: "LOAD_FRIEND_REQUESTS",
  LOAD_FRIENDS: "LOAD_FRIENDS",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        tfa: false,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case actionTypes.TFA: {
      return { ...state, tfa: action.payload.tfa };
    }
    case actionTypes.UPDATE_USER: {
      return { ...state, user: action.payload.user, isAuthenticated: true };
    }
    case actionTypes.LOAD_PROFILE_DATA: {
      return { ...state, profile: action.payload.profile };
    }
    case actionTypes.LOAD_FRIEND_REQUESTS: {
      return { ...state, friendRequests: action.payload.friendRequests };
    }
    case actionTypes.LOAD_FRIENDS: {
      return { ...state, friends: action.payload.friends };
    }
    default:
      return state;
  }
};

const Auth = createContext<any>(null);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialeState);

  const jwt_token = Cookies.get("JWT_TOKEN");

  async function fetchData(id: string, isFriendReq?: boolean) {
    try {
      if (jwt_token) {
        let url: string = !id
          ? "http://localhost:3000/user"
          : "http://localhost:3000/user/" + id;
        const response = await axios.get(url + "/profile", {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        if (isFriendReq) {
          return response.data;
        }
        if (!id) {
          dispatch({
            type: actionTypes.UPDATE_USER,
            payload: { user: response.data },
          });
        }
        dispatch({
          type: actionTypes.LOAD_PROFILE_DATA,
          payload: { profile: { ...response.data, id } },
        });
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  async function fetchFriendsReqData() {
    try {
      if (jwt_token) {
        let url: string = "http://localhost:3000/user/friendRequests";
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        dispatch({
          type: actionTypes.LOAD_FRIEND_REQUESTS,
          payload: { friendRequests: response.data },
        });
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  async function fetchFriendsData() {
    try {
      if (jwt_token) {
        let url: string = "http://localhost:3000/user/friends";
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        dispatch({
          type: actionTypes.LOAD_FRIENDS,
          payload: { friends: response.data },
        });
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  async function manageFreindReq(id: string, type: string) {
    let reqPath: string;
    if (type === "cancel") {
      reqPath = "cancelRequest";
    } else if (type === "decline") {
      reqPath = "declineRequest";
    } else if (type === "accept") {
      reqPath = "acceptRequest";
    }
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/user/" + reqPath,
          {
            friendRequestId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        fetchFriendsReqData();
        fetchFriendsData();
      }
    } catch (error) {
      console.log("an error occured");
    }
  }

  async function login(username: string, password: string) {
    const response = await fetch("http://localhost:3000/auth/signin", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    if (response.ok) {
      const res = await response.json();
      if (res.TFA) {
        dispatch({ type: actionTypes.TFA, payload: { tfa: res.TFA } });
      } else {
        dispatch({ type: actionTypes.LOGIN, payload: { user: null } });
      }
    } else {
      alert("Failed To Signin");
    }
  }
  const getUserInfo = (id) => {
    if (id === state.user.id) return state.user;
    else {
      return state.friends?.friends.find((friend) => friend.id === id);
    }
  };

  const logout = () => {
    dispatch({ type: actionTypes.LOGOUT });
  };

  return (
    <Auth.Provider
      value={{
        state,
        login,
        logout,
        fetchData,
        manageFreindReq,
        fetchFriendsReqData,
        fetchFriendsData,
        getUserInfo,
      }}
    >
      {children}
    </Auth.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(Auth);
  if (!context) {
    throw new Error("");
  }
  return context;
};

export default AuthContextProvider;