'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Avatar from '../ProfileComponents/Avatar/Avatar';



export default function ScoreBoard({
  playerScore,
  opponentScore,
  playerAvatar,
  OpponentAvatar,
}: any) {
  const router = useRouter();

  console.log(opponentScore, playerScore);
  return (
    <>
      <div className="flex justify-between items-center p-5 ml-0 my-5  mr-40">
        <div className="flex items-center justify-center gap-1 ">
        <Avatar
                    avatarObj={{
                      src: playerAvatar,
                      width: 100,
                      height: 100,
                      userName: "",
                      imageStyle: "w-[4rem] h-[4rem] rounded-full object-cover",
                      fontSize: "text-base text-white",
                      positiosn: false,
                      existStatos: false,
                    }}
                  />


          <span className="mx-2 text-text text-center text-5xl font-bold">
            {playerScore}
          </span>
        </div>
        <button className="inline-flex items-center h-12 bg-primary rounded-3xl p-4 px-14 gap-3">
          <i>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0276 7.23209C15.2313 7.06242 15.494 6.9806 15.7581 7.0046C16.0221 7.0286 16.2658 7.15647 16.4356 7.36009L18.5186 9.86009C18.6808 10.0646 18.7567 10.3244 18.7299 10.5841C18.7032 10.8438 18.5759 11.0827 18.3754 11.2499C18.1748 11.417 17.9169 11.4991 17.6566 11.4786C17.3964 11.458 17.1545 11.3366 16.9826 11.1401L14.8996 8.64009C14.7299 8.43637 14.6481 8.17361 14.6721 7.90959C14.6961 7.64556 14.8239 7.40187 15.0276 7.23209Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0262 13.7679C14.8224 13.5982 14.6944 13.3546 14.6702 13.0906C14.646 12.8266 14.7277 12.5637 14.8972 12.3599L16.9812 9.85988C17.0641 9.75543 17.167 9.6686 17.2839 9.60452C17.4009 9.54043 17.5294 9.50038 17.6621 9.48671C17.7947 9.47305 17.9288 9.48604 18.0563 9.52495C18.1838 9.56385 18.3023 9.62786 18.4048 9.71322C18.5072 9.79859 18.5915 9.90358 18.6528 10.022C18.714 10.1404 18.751 10.2699 18.7615 10.4029C18.772 10.5358 18.7557 10.6695 18.7138 10.7961C18.6718 10.9226 18.605 11.0395 18.5172 11.1399L16.4342 13.6399C16.2644 13.8435 16.0207 13.9714 15.7567 13.9954C15.4927 14.0194 15.2299 13.9375 15.0262 13.7679Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.5 10.5C17.5 10.7652 17.3946 11.0196 17.2071 11.2071C17.0196 11.3946 16.7652 11.5 16.5 11.5H10C9.73478 11.5 9.48043 11.3946 9.29289 11.2071C9.10536 11.0196 9 10.7652 9 10.5C9 10.2348 9.10536 9.98043 9.29289 9.79289C9.48043 9.60536 9.73478 9.5 10 9.5H16.5C16.7652 9.5 17.0196 9.60536 17.2071 9.79289C17.3946 9.98043 17.5 10.2348 17.5 10.5ZM3 3.5C3 3.23478 3.10536 2.98043 3.29289 2.79289C3.48043 2.60536 3.73478 2.5 4 2.5H13C13.2652 2.5 13.5196 2.60536 13.7071 2.79289C13.8946 2.98043 14 3.23478 14 3.5C14 3.76522 13.8946 4.01957 13.7071 4.20711C13.5196 4.39464 13.2652 4.5 13 4.5H4C3.73478 4.5 3.48043 4.39464 3.29289 4.20711C3.10536 4.01957 3 3.76522 3 3.5ZM3 17.5C3 17.2348 3.10536 16.9804 3.29289 16.7929C3.48043 16.6054 3.73478 16.5 4 16.5H13C13.2652 16.5 13.5196 16.6054 13.7071 16.7929C13.8946 16.9804 14 17.2348 14 17.5C14 17.7652 13.8946 18.0196 13.7071 18.2071C13.5196 18.3946 13.2652 18.5 13 18.5H4C3.73478 18.5 3.48043 18.3946 3.29289 18.2071C3.10536 18.0196 3 17.7652 3 17.5Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 2.5C13.2652 2.5 13.5196 2.60536 13.7071 2.79289C13.8946 2.98043 14 3.23478 14 3.5V7.5C14 7.76522 13.8946 8.01957 13.7071 8.20711C13.5196 8.39464 13.2652 8.5 13 8.5C12.7348 8.5 12.4804 8.39464 12.2929 8.20711C12.1054 8.01957 12 7.76522 12 7.5V3.5C12 3.23478 12.1054 2.98043 12.2929 2.79289C12.4804 2.60536 12.7348 2.5 13 2.5ZM13 12.5C13.2652 12.5 13.5196 12.6054 13.7071 12.7929C13.8946 12.9804 14 13.2348 14 13.5V17.5C14 17.7652 13.8946 18.0196 13.7071 18.2071C13.5196 18.3946 13.2652 18.5 13 18.5C12.7348 18.5 12.4804 18.3946 12.2929 18.2071C12.1054 18.0196 12 17.7652 12 17.5V13.5C12 13.2348 12.1054 12.9804 12.2929 12.7929C12.4804 12.6054 12.7348 12.5 13 12.5ZM4 2.5C4.26522 2.5 4.51957 2.60536 4.70711 2.79289C4.89464 2.98043 5 3.23478 5 3.5V17.5C5 17.7652 4.89464 18.0196 4.70711 18.2071C4.51957 18.3946 4.26522 18.5 4 18.5C3.73478 18.5 3.48043 18.3946 3.29289 18.2071C3.10536 18.0196 3 17.7652 3 17.5V3.5C3 3.23478 3.10536 2.98043 3.29289 2.79289C3.48043 2.60536 3.73478 2.5 4 2.5Z"
                fill="white"
              />
            </svg>
          </i>
          <span onClick={() => router.push("/game")} className="text-text">
            Leave game
          </span>
        </button>
        <div className="flex items-center justify-center gap-1">
          <span className="mx-2 text-text text-center text-5xl font-bold">
            {opponentScore}
          </span>
          <Avatar
                    avatarObj={{
                      src: OpponentAvatar,
                      width: 100,
                      height: 100,
                      userName: "",
                      imageStyle: "w-[4rem] h-[4rem] rounded-full object-cover",
                      fontSize: "text-base text-white",
                      positiosn: false,
                      existStatos: false,
                    }}
                  />
          {/* <Image
            className="rounded-full"
            src={OpponentAvatar}
            width={55}
            height={55}
            alt="Friend's picture"
          /> */}
        </div>
      </div>
    </>
  );
}
