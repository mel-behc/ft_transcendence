import React from "react";
import { useState, useEffect, useReducer } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { SearchDataFetch } from "../../types/Avatar.type";
import { ProfileData } from "../../types/Avatar.type";
import AllField from "./AllField/AllField";
import UsersField from "./UsersField/UsersField";
import ChannelsField from "./ChannlesField/ChannelsField";
import SearchIcon from "../SearchIcon";

type searchMenuProps = {
  modal?: boolean;
  closeModal?: () => void;
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "accessAll":
      return {
        ...state,
        all: (state.all = true),
        users: (state.users = false),
        channels: (state.channels = false),
      };
    case "accessUsers":
      return {
        ...state,
        all: (state.all = false),
        users: (state.users = true),
        channels: (state.channels = false),
      };
    case "accessChannels":
      return {
        ...state,
        all: (state.all = false),
        users: (state.users = false),
        channels: (state.channels = true),
      };
    case "updateRequestType":
      return { ...state, requestType: (state.requestType = action.payload) };
    default:
      throw new Error();
  }
}

function SearchMenu({ modal, closeModal }: searchMenuProps) {
  const [state, dispatch] = useReducer(reducer, {
    all: true,
    users: false,
    channels: false,
    requestType: "ALL",
  });
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchUsersData, setSearchUsersData] = useState<ProfileData[]>([]);
  const [searchChannelsData, setSearchChannelsData] = useState<any>([]);
  const [searchALLData, setSearchALLData] = useState<SearchDataFetch>({
    users: [],
    channels: [],
  });
  const jwt_token = Cookies.get("JWT_TOKEN");

  async function fetchData() {
    try {
      if (jwt_token && searchValue) {
        const response = await axios.get(
          `http://localhost:3000/user/search?type=${state.requestType}&query=${searchValue}`,
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status <= 299) {
          if (state.requestType === "ALL") {
            setSearchALLData(response.data);
          } else if (state.requestType === "USERS") {
            setSearchUsersData(response.data);
          }
          else if (state.requestType === "CHANNELS") {
            setSearchChannelsData(response.data);
          }
        }
      } else throw new Error("bad req");
    } catch (error) {
    }
  }

  useEffect(() => {
    fetchData();
    if (searchValue.length === 0) {
      if (state.requestType === "ALL") {
        setSearchALLData({
          users: [],
          channels: [],
        });
      } else if (state.requestType === "USERS") {
        setSearchUsersData([]);
      }
      else if (state.requestType === "CHANNELS") {
        setSearchChannelsData([]);
      }
    }
  }, [searchValue]);

  function allClick() {
    dispatch({ type: "accessAll" });
    dispatch({ type: "updateRequestType", payload: "ALL" });
  }

  function usersClick() {
    dispatch({ type: "accessUsers" });
    dispatch({ type: "updateRequestType", payload: "USERS" });
  }

  function channelsClick() {
    dispatch({ type: "accessChannels" });
    dispatch({ type: "updateRequestType", payload: "CHANNELS" });
  }

  function usesrData(): any {
    let usersArray: any;
    if (state.requestType === "ALL") {
      usersArray = searchALLData;
    } else if (state.requestType === "USERS") {
      usersArray = searchUsersData;
    }
    else if (state.requestType === "CHANNELS") {
      usersArray = searchChannelsData;
    }
    return usersArray;
  }

  function handleModalClose(e: any) {
    if (e.target.id === "modalClose") {
      closeModal();
    }
  }

  if (!modal) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100"
      id="modalClose"
      onClick={handleModalClose}
    >
      <div className="w-[55rem] h-[50rem] rounded-[10px] flex flex-col bg-background p-[1rem] ">
        <div className="w-full h-[5rem] flex items-center gap-[1rem]">
          <SearchIcon />
          <form className="w-full h-[1rem]">
            <input
              className="w-11/12 bg-background focus:outline-none text-white text-basic font-bold "
              placeholder="Users or Channels"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
        </div>
        <div className="w-full h-[3rem] flex items-center text-white text-basic gap-[1rem] border-b border-black">
          <button
            onClick={allClick}
            className={state.all ? "h-full border-gray-500 border-b-2" : ""}
          >
            All
          </button>
          <button
            onClick={usersClick}
            className={state.users ? "h-full border-gray-500 border-b-2" : ""}
          >
            Users
          </button>
          <button
            onClick={channelsClick}
            className={
              state.channels ? "h-full border-gray-500 border-b-2" : ""
            }
          >
            Channels
          </button>
        </div>
        <div className="w-full h-full p-[1rem] pl-0">
          {state.all && <AllField usersData={usesrData} />}
          {state.users && <UsersField usersData={usesrData} />}
          {state.channels && <ChannelsField usersData={usesrData} />}
        </div>
      </div>
    </div>
  );
}

export default SearchMenu;
