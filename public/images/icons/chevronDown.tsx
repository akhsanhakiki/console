import React from "react";

const ChevronDown = ({ className }: { className?: string }) => {
  return (
    <div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <mask
          id="mask0_4466_5371"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="currentColor" />
        </mask>
        <g mask="url(#mask0_4466_5371)">
          <path
            d="M12 14.6616C11.8795 14.6616 11.7673 14.6423 11.6635 14.6038C11.5596 14.5655 11.4609 14.4995 11.3672 14.4059L6.87298 9.9116C6.73465 9.7731 6.66131 9.6016 6.65298 9.3971C6.64465 9.19277 6.71798 9.01302 6.87298 8.85785C7.01798 8.71302 7.19365 8.6406 7.39998 8.6406C7.60632 8.6406 7.78198 8.71302 7.92698 8.85785L12 12.9156L16.073 8.85785C16.2115 8.71935 16.383 8.64593 16.5875 8.6376C16.792 8.62927 16.9718 8.70268 17.127 8.85785C17.2718 9.00268 17.3442 9.17827 17.3442 9.3846C17.3442 9.5911 17.2718 9.76677 17.127 9.9116L12.6327 14.4059C12.5391 14.4995 12.4403 14.5655 12.3365 14.6038C12.2326 14.6423 12.1205 14.6616 12 14.6616Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
};

export default ChevronDown;
