import React from "react";
import Joystick from "./Joystick";

type props = {
  isFriendCard: boolean;
};

function ChallengeFriend({ isFriendCard }: props) {
  const className1: string =
    "w-full h-[2.5rem] p-[1rem] flex items-center gap-3 text-white border border-gray-500 rounded-[8px]";
  const className2: string =
    "w-[10rem] h-[3rem] gap-3 bg-[#D9923B] flex justify-center items-center rounded-[25px] text-sm ";

  return (
    <button className={isFriendCard ? className1 : className2}>
      <Joystick className="w-5 h-5" />
      Challenge
    </button>
  );
}

export default ChallengeFriend;