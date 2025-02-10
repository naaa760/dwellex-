import { useEffect } from "react";

const ScrollEffect = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrolled / maxScroll) * 100;

      // Adjust gradient colors based on scroll position
      document.documentElement.style.setProperty(
        "--gradient-mid",
        `hsl(${20 + scrollPercent * 0.5}, 70%, 30%)`
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
};

export default ScrollEffect;
