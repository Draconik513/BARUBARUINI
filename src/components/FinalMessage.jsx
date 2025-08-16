import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const FinalMessage = () => {
  const textRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, scale: 0.5 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1.5, 
        ease: "elastic.out(1, 0.5)",
        delay: 0.5 // Tambahkan delay agar muncul setelah video
      }
    );
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <h1
        ref={textRef}
        className="text-pink-500 font-extrabold text-4xl md:text-6xl lg:text-8xl text-center drop-shadow-lg px-4"
      >
      </h1>
    </div>
  );
};

export default FinalMessage;