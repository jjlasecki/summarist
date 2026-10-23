"use client";

import Link from "next/link";
import "./Sidebar.css";
import {
  AiOutlineHome,
  AiOutlineBook,
  AiOutlineSetting,
  AiOutlineHighlight,
  AiOutlineSearch,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
  AiOutlineLogin,
} from "react-icons/ai";
import { usePathname } from "next/navigation";
import { signOut, onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import LoginModal from "@/components/LoginModal";
import Image from "next/image";
import { useFontSize } from "@/components/FontSizeContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { fontSize, setFontSize } = useFontSize();
  const isPlayerPage = pathname.startsWith("/player/");
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar__logo">
          <Image
            src="/assets/logo.png"
            alt="Summarist"
            width={180}
            height={50}
            className="h-auto w-full"
            priority
          />
        </div>

        <nav className="sidebar__nav">
          {/* Top navigation group */}
          <div className="sidebar__top">
            <Link
              href="/for-you"
              className={pathname === "/for-you" ? "sidebar__active" : ""}
            >
              <AiOutlineHome />
              <span>For You</span>
            </Link>

            <Link
              href="/library"
              className={pathname === "/library" ? "sidebar__active" : ""}
            >
              <AiOutlineBook />
              <span>My Library</span>
            </Link>

            <div className="sidebar__disabled">
              <AiOutlineHighlight />
              <span>Highlights</span>
            </div>

            <div className="sidebar__disabled">
              <AiOutlineSearch />
              <span>Search</span>
            </div>
            {isPlayerPage && (
              <div
                className="sidebar__font-sizes"
                aria-label="Reading font size"
              >
                {[14, 16, 18, 20].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFontSize(size)}
                    className={fontSize === size ? "sidebar__font-active" : ""}
                    aria-label={`Set font size to ${size} pixels`}
                    aria-pressed={fontSize === size}
                    style={{ fontSize: `${size}px` }}
                  >
                    Aa
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bottom navigation group */}
          <div className="sidebar__bottom">
            <Link
              href="/settings"
              className={pathname === "/settings" ? "sidebar__active" : ""}
            >
              <AiOutlineSetting />
              <span>Settings</span>
            </Link>

            <div className="sidebar__disabled">
              <AiOutlineQuestionCircle />
              <span>Help & Support</span>
            </div>

            <button
              type="button"
              className="sidebar__logout"
              onClick={() => {
                if (user) {
                  handleLogout();
                } else {
                  setShowLoginModal(true);
                }
              }}
            >
              {user ? <AiOutlineLogout /> : <AiOutlineLogin />}
              <span>{user ? "Logout" : "Login"}</span>
            </button>
          </div>
        </nav>
      </aside>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
