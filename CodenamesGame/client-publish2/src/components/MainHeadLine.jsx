import React from 'react';
import titleImage from '../assets/logo-codenames.png'; // התמונה החדשה שאתה רוצה להוסיף ככותרת

const Header = () => {
  return (
    <div className="w-full flex flex-col items-center text-center mb-4">
      <img
        src={titleImage}
        alt="Codenames Title"
        className="max-w-[300px] sm:max-w-[400px] md:max-w-[500px] h-auto object-contain"
      />
      <p className="text-lg sm:text-xl font-light italic text-white drop-shadow-md mt-2">
        משחק קבוצתי חכם וממכר, אתגרו את המחשבה שלכם עם רמזים חכמים
      </p>
    </div>
  );
};

export default Header;
