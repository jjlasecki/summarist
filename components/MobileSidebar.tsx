"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {isOpen && (
        <>
          <div
            className="mobile-sidebar-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="mobile-sidebar-panel">
            <Sidebar />
          </div>
        </>
      )}
    </>
  );
}
