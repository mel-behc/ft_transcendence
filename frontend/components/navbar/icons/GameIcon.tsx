export default function GameIcon({ clicked }: any) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="18"
        viewBox="0 0 24 18"
        fill="none"
      >
        <path
          d="M17.6162 0C18.8586 0 19.8122 0.948375 20.5188 1.96875L20.758 2.32987L20.9771 2.68987C21.0467 2.80687 21.113 2.92387 21.177 3.03637C22.0611 4.61925 22.8305 6.68588 23.3394 8.72775C23.8448 10.7539 24.1245 12.87 23.9459 14.5339C23.7662 16.2045 22.9069 18 20.9861 18C19.263 18 17.9049 17.0775 16.8018 16.1764L15.555 15.129C14.5182 14.2785 13.3837 13.5 11.9998 13.5C10.6159 13.5 9.48025 14.2785 8.4457 15.129L7.19885 16.1753C6.09354 17.0775 4.73549 18 3.01349 18C1.09154 18 0.232229 16.2045 0.0536269 14.5339C-0.123852 12.8689 0.154723 10.7539 0.660202 8.72663C1.16905 6.68587 1.9385 4.62037 2.82253 3.03637L3.02247 2.68875L3.24151 2.32987L3.48077 1.96875C4.18732 0.948375 5.14099 0 6.38335 0C6.95622 0 7.52573 0.1395 8.08513 0.30375L8.75124 0.5085C8.86132 0.54225 8.97028 0.574875 9.07924 0.60525C10.0509 0.88425 11.045 1.125 11.9998 1.125C12.9546 1.125 13.9487 0.88425 14.9203 0.60525L15.9144 0.304875C16.4738 0.1395 17.0433 0 17.6162 0ZM8.06828 4.5C7.32349 4.5 6.60921 4.79632 6.08257 5.32376C5.55593 5.85121 5.26006 6.56658 5.26006 7.3125C5.26006 8.05842 5.55593 8.77379 6.08257 9.30124C6.60921 9.82868 7.32349 10.125 8.06828 10.125C8.81306 10.125 9.52734 9.82868 10.054 9.30124C10.5806 8.77379 10.8765 8.05842 10.8765 7.3125C10.8765 6.56658 10.5806 5.85121 10.054 5.32376C9.52734 4.79632 8.81306 4.5 8.06828 4.5ZM15.9313 4.5C15.6334 4.5 15.3477 4.61853 15.137 4.8295C14.9263 5.04048 14.808 5.32663 14.808 5.625V6.1875H14.2464C13.9484 6.1875 13.6627 6.30603 13.4521 6.517C13.2414 6.72798 13.1231 7.01413 13.1231 7.3125C13.1231 7.61087 13.2414 7.89702 13.4521 8.108C13.6627 8.31897 13.9484 8.4375 14.2464 8.4375H14.808V9C14.808 9.29837 14.9263 9.58452 15.137 9.7955C15.3477 10.0065 15.6334 10.125 15.9313 10.125C16.2292 10.125 16.5149 10.0065 16.7256 9.7955C16.9362 9.58452 17.0546 9.29837 17.0546 9V8.4375H17.6162C17.9141 8.4375 18.1998 8.31897 18.4105 8.108C18.6212 7.89702 18.7395 7.61087 18.7395 7.3125C18.7395 7.01413 18.6212 6.72798 18.4105 6.517C18.1998 6.30603 17.9141 6.1875 17.6162 6.1875H17.0546V5.625C17.0546 5.32663 16.9362 5.04048 16.7256 4.8295C16.5149 4.61853 16.2292 4.5 15.9313 4.5ZM8.06828 6.75C8.21723 6.75 8.36009 6.80926 8.46542 6.91475C8.57075 7.02024 8.62992 7.16332 8.62992 7.3125C8.62992 7.46168 8.57075 7.60476 8.46542 7.71025C8.36009 7.81574 8.21723 7.875 8.06828 7.875C7.91932 7.875 7.77646 7.81574 7.67114 7.71025C7.56581 7.60476 7.50663 7.46168 7.50663 7.3125C7.50663 7.16332 7.56581 7.02024 7.67114 6.91475C7.77646 6.80926 7.91932 6.75 8.06828 6.75Z"
          fill={clicked ? "#D9923B" : "white"}
        />
      </svg>
    </>
  );
}
