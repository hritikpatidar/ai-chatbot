import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Window scroll
    window.scrollTo(0, 0);

    // All scrollable containers
    document.querySelectorAll("*").forEach((element) => {
      if (element.scrollTop > 0) {
        element.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
      }
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
