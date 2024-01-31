import { useAuth } from "../../../../../app/context/AuthContext";
import Avatar from "../../../Avatar/Avatar";
import { AvatarProps, DataFetch } from "../../../types/Avatar.type";
import Achievements from "./Achievements/Achievements";
import achievementsData from "./Achievements/AchievementsData";
import fakeData from "./Scores/RecordsData";
import Scores from "./Scores/Scores";

type profileCardProps = {
  data: DataFetch;
};

function PlayersInfos() {
  const {
    state: {
      user: { avatar, username },
    },
  } = useAuth();

  const avatarObj: AvatarProps = {
    src: avatar,
    width: 100,
    height: 100,
    userName: username,
    imageStyle: "w-[13rem] h-[13rem] rounded-full object-cover",
    fontSize: "text-2xl font-bold",
    positiosn: true,
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-[1rem]">
      <div className="w-full flex justify-center items-center">
        <Avatar {...avatarObj} />
      </div>
      <Scores myScoresArray={fakeData} />
      <Achievements achievementsArray={achievementsData} />
    </div>
  );
}

export default PlayersInfos;
