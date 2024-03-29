import { useEffect, useState } from "react";
import { useAuth } from "../../../../app/context/AuthContext";
import { AvatarProps } from "../../types/Avatar.type";
import Avatar from "../../Avatar/Avatar";
import Scores from "./Infos/Scores/Scores";
import Achievements from "./Infos/Achievements/UserAchievements";
import ProfileSettings from "./ProfileSettings/ProfileSettings";
import SettingIcon from "./ProfileSettings/SettingIcon";

type props = {
  setting: boolean;
  setSetting: any;
};

function ProfileCard({ setting, setSetting }: props) {
  const {
    state: { user },
  } = useAuth();

  const avatarObj: AvatarProps = {
    src: user.avatar,
    width: 100,
    height: 100,
    userName: user.username,
    imageStyle: "w-[13rem] h-[13rem] rounded-full object-cover",
    fontSize: "text-2xl font-bold",
    positiosn: true,
    existStatos: false,
  };

  function closeSettings() {
    setSetting(false);
  }

  return (
    <div className="w-[25rem] h-full p-[0.5rem] text-white flex flex-col gap-[0.5rem] border border-black border-solid rounded-[15px] ">
      <button
        className={!setting ? "place-self-end" : "hidden"}
        onClick={() => setSetting(true)}
      >
        <SettingIcon />
      </button>
      {!setting ? (
        <div className="flex h-full flex-col gap-[1rem] ">
          <div className="w-full flex justify-center items-center">
            <Avatar avatarObj={avatarObj} />
          </div>
          <Scores />
          <Achievements />
        </div>
      ) : (
        <ProfileSettings openSettings={closeSettings} />
      )}
    </div>
  );
}

export default ProfileCard;
