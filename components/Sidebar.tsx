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
} from "react-icons/ai";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { AiOutlineLogin } from "react-icons/ai";
import LoginModal from "@/components/LoginModal";

export default function Sidebar() {
  const pathname = usePathname();
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
          <h2>Summarist</h2>
        </div>

        <nav className="sidebar__nav">
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
        </nav>
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
      </aside>
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
