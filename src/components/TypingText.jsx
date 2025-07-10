import React, { useEffect, useState } from "react";
import { Text } from "react-native";

const TypingText = ({ text, className }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 40); // Typing speed
    return () => clearInterval(interval);
  }, [text]);

  return <Text className={className}>{displayedText}</Text>;
};

export default TypingText;
