import React from "react";

const ChevronUp = ({ className }: { className?: string }) => {
  return (
    <div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_4466_5652"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="currentColor" />
        </mask>
        <g mask="url(#mask0_4466_5652)">
          <path
            d="M11.9995 10.4538L7.92652 14.527C7.78802 14.6653 7.61394 14.7362 7.40427 14.7395C7.19477 14.7427 7.01752 14.6718 6.87252 14.527C6.72769 14.382 6.65527 14.2063 6.65527 14C6.65527 13.7937 6.72769 13.618 6.87252 13.473L11.3668 8.97876C11.5476 8.7981 11.7585 8.70776 11.9995 8.70776C12.2405 8.70776 12.4514 8.7981 12.6323 8.97876L17.1265 13.473C17.2649 13.6115 17.3357 13.7856 17.339 13.9953C17.3422 14.2048 17.2714 14.382 17.1265 14.527C16.9815 14.6718 16.8059 14.7443 16.5995 14.7443C16.3932 14.7443 16.2175 14.6718 16.0725 14.527L11.9995 10.4538Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
};

export default ChevronUp;
