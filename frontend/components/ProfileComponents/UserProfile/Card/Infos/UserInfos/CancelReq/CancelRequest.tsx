import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "../../../../../../../app/context/AuthContext";

type props = {
  card: boolean;
};

function CancelRequest({ card }: props) {
  const param = useParams();
  const {
    fetchFriendsReqData,
    fetchData,
    state: { friendRequests },
  } = useAuth();

  function getId() {
    return friendRequests?.sentRequests.find(
      (elem) => elem.receiverId === param.id && elem.status === "PENDING"
    ).id;
  }

  async function postData() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/user/cancelRequest",
          { friendRequestId: getId() },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        ).then(() => {fetchFriendsReqData()})
      } else throw new Error("bad req");
    } catch (error) {
      // console.log("an error occured");
    }
  }

  const className1: string =
    "w-full h-[2.5rem] p-[1rem] flex items-center gap-3 text-white border border-gray-500 rounded-[8px]";
  const className2: string =
    "w-full h-[3rem] bg-background flex justify-center items-center border border-gray-500 border-solid rounded-[25px] text-sm hover:bg-primary/5";

  return (
    <button className={card ? className1 : className2} onClick={postData}>
      Cancel Request
    </button>
  );
}

export default CancelRequest;
