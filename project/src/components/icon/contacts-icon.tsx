import React from "react";

interface contactsIconProps {
  id: string;
  className?: string;
}

export const ContactsIcon = ({ id, className }: contactsIconProps) => {
  switch (id) {
    case "telegram":
      return (
        <svg
          version="1.1"
          className={`contact-icon ${className}`}
          width="22"
          height="22"
          id="telegram"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 455 455"
          fill="none"
        >
          <g>
            <path
              d="M0,0v455h455V0H0z M384.814,100.68l-53.458,257.136
              c-1.259,6.071-8.378,8.822-13.401,5.172l-72.975-52.981c-4.43-3.217-10.471-3.046-14.712,0.412l-40.46,32.981
              c-4.695,3.84-11.771,1.7-13.569-4.083l-28.094-90.351l-72.583-27.089c-7.373-2.762-7.436-13.171-0.084-16.003L373.36,90.959
              C379.675,88.517,386.19,94.049,384.814,100.68z"
            />
            <path
              d="M313.567,147.179l-141.854,87.367c-5.437,3.355-7.996,9.921-6.242,16.068
              l15.337,53.891c1.091,3.818,6.631,3.428,7.162-0.517l3.986-29.553c0.753-5.564,3.406-10.693,7.522-14.522l117.069-108.822
              C318.739,149.061,316.115,145.614,313.567,147.179z"
            />
          </g>
        </svg>
      );

    case "linkedin":
      return (
        <svg
          version="1.1"
          className={`contact-icon ${className}`}
          width="22"
          height="22"
          id="linkedin"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 455 455"
          fill="none"
        >
          <g>
            <path d="M246.4,204.35v-0.665c-0.136,0.223-0.324,0.446-0.442,0.665H246.4z" />
            <path
              d="M0,0v455h455V0H0z M141.522,378.002H74.016V174.906h67.506V378.002z
              M107.769,147.186h-0.446C84.678,147.186,70,131.585,70,112.085c0-19.928,15.107-35.087,38.211-35.087
              c23.109,0,37.31,15.159,37.752,35.087C145.963,131.585,131.32,147.186,107.769,147.186z M385,378.002h-67.524V269.345
              c0-27.291-9.756-45.92-34.195-45.92c-18.664,0-29.755,12.543-34.641,24.693c-1.776,4.34-2.24,10.373-2.24,16.459v113.426h-67.537
              c0,0,0.905-184.043,0-203.096H246.4v28.779c8.973-13.807,24.986-33.547,60.856-33.547c44.437,0,77.744,29.02,77.744,91.398V378.002
              z"
            />
          </g>
        </svg>
      );

    case "github":
      return (
        <svg
          fill="none"
          className={`contact-icon ${className}`}
          width="22"
          height="22"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 0H27C28.65 0 30 1.35 30 3V27C30 28.65 28.65 30 27 30H19.1325C19.1329 29.9292 19.1332 29.8553 19.1336 29.7787C19.1392 28.6893 19.1477 27.0448 19.1477 25.6702C19.1477 24.2351 18.6557 23.2966 18.1044 22.8217C21.5298 22.4412 25.1261 21.1411 25.1261 15.2327C25.1261 13.554 24.5313 12.1803 23.5456 11.1058C23.7032 10.7168 24.231 9.15241 23.3917 7.03564C23.3917 7.03564 22.1029 6.6221 19.1665 8.61236C17.9382 8.27058 16.623 8.10063 15.3162 8.09402C14.0086 8.10063 12.6924 8.27058 11.466 8.61236C8.52772 6.6221 7.23708 7.03564 7.23708 7.03564C6.3996 9.15241 6.92739 10.7168 7.08601 11.1058C6.10219 12.1803 5.50264 13.554 5.50264 15.2327C5.50264 21.126 9.09327 22.4459 12.5083 22.834C12.0693 23.2182 11.6718 23.8961 11.5321 24.8894C10.6559 25.2831 8.42763 25.9619 7.05577 23.6119C7.05577 23.6119 6.2438 22.1353 4.7001 22.0267C4.7001 22.0267 3.19794 22.0079 4.59435 22.9614C4.59435 22.9614 5.60271 23.4344 6.30234 25.2113C6.30234 25.2113 7.20496 28.2024 11.483 27.2733C11.4852 27.6601 11.488 28.1091 11.4908 28.5576C11.494 29.0702 11.4972 29.5821 11.4996 30H3C1.35 30 0 28.65 0 27V3C0 1.35 1.35 0 3 0Z" />
        </svg>
      );

    default:
      return null;
  }
};
