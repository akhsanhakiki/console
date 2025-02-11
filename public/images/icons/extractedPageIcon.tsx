import React from "react";

const extractedPageIcon = ({ className }: { className: string }) => {
  return (
    <div>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <mask
          id="mask0_5146_17902"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="30"
          height="30"
        >
          <rect
            x="0.333496"
            y="0.333374"
            width="29.3333"
            height="29.3333"
            fill="currentColor"
          />
        </mask>
        <g mask="url(#mask0_5146_17902)">
          <path
            d="M8.83979 25.0128C8.30649 25.0128 7.83298 24.8381 7.41926 24.4888C7.00554 24.1396 6.75274 23.6985 6.66087 23.1654L4.94242 12.867C4.8862 12.5294 4.96453 12.2286 5.1774 11.9644C5.39006 11.7004 5.67219 11.5684 6.02379 11.5684H23.9764C24.328 11.5684 24.6101 11.7004 24.8228 11.9644C25.0357 12.2286 25.114 12.5294 25.0578 12.867L23.3393 23.1654C23.2474 23.6985 22.9946 24.1396 22.5809 24.4888C22.1672 24.8381 21.6937 25.0128 21.1604 25.0128H8.83979ZM6.93342 13.4017L8.4447 22.8623C8.46039 22.9562 8.50154 23.0326 8.56815 23.0915C8.63476 23.1501 8.71512 23.1795 8.80923 23.1795H21.191C21.2851 23.1795 21.3654 23.1501 21.432 23.0915C21.4986 23.0326 21.5398 22.9562 21.5555 22.8623L23.0668 13.4017H6.93342ZM12.5556 17.985H17.4445C17.7043 17.985 17.9219 17.8971 18.0975 17.7213C18.2733 17.5455 18.3612 17.3278 18.3612 17.0681C18.3612 16.8081 18.2733 16.5905 18.0975 16.4151C17.9219 16.2395 17.7043 16.1517 17.4445 16.1517H12.5556C12.2959 16.1517 12.0783 16.2396 11.9027 16.4154C11.7269 16.5912 11.639 16.8089 11.639 17.0687C11.639 17.3286 11.7269 17.5464 11.9027 17.7219C12.0783 17.8973 12.2959 17.985 12.5556 17.985ZM7.66676 10.1112C7.40704 10.1112 7.18938 10.0233 7.01379 9.84747C6.83799 9.67168 6.75009 9.45392 6.75009 9.19419C6.75009 8.93427 6.83799 8.71661 7.01379 8.54122C7.18938 8.36563 7.40704 8.27783 7.66676 8.27783H22.3334C22.5931 8.27783 22.8108 8.36573 22.9864 8.54153C23.1622 8.71732 23.2501 8.93508 23.2501 9.19481C23.2501 9.45473 23.1622 9.67239 22.9864 9.84778C22.8108 10.0234 22.5931 10.1112 22.3334 10.1112H7.66676ZM10.1112 6.82064C9.85148 6.82064 9.63382 6.73274 9.45823 6.55694C9.28243 6.38115 9.19454 6.16339 9.19454 5.90367C9.19454 5.64374 9.28243 5.42608 9.45823 5.25069C9.63382 5.0751 9.85148 4.9873 10.1112 4.9873H19.889C20.1487 4.9873 20.3664 5.0752 20.542 5.251C20.7177 5.4268 20.8056 5.64456 20.8056 5.90428C20.8056 6.1642 20.7177 6.38186 20.542 6.55725C20.3664 6.73284 20.1487 6.82064 19.889 6.82064H10.1112Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
};

export default extractedPageIcon;
