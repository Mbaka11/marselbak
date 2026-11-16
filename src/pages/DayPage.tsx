import { useState } from "react";
import DeskPage from "./DeskPage";
import ProPage from "./ProPage";

// Day mode: the desk scene by default, with a plain scrolling page as fallback.
export default function DayPage() {
  const [simple, setSimple] = useState(() => {
    try {
      return localStorage.getItem("dayView") === "simple";
    } catch {
      return false;
    }
  });

  const choose = (v: boolean) => {
    setSimple(v);
    try {
      localStorage.setItem("dayView", v ? "simple" : "desk");
    } catch {
      /* ignore */
    }
    window.scrollTo(0, 0);
  };

  if (simple)
    return (
      <>
        <ProPage />
        <div className="back-desk">
          <button className="pill" onClick={() => choose(false)}>
            ← Desk
          </button>
        </div>
      </>
    );
  return <DeskPage onSimple={() => choose(true)} />;
}
