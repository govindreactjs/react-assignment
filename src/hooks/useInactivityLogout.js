import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

const TIMEOUT = 5 * 60 * 1000;

export const useInactivityLogout = (enabled) => {
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const resetTimer = () => {
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        dispatch(logout());
      }, TIMEOUT);
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      window.clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [dispatch, enabled]);
};
