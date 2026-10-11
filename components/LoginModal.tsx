import "./LoginModal.css";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      onClose();
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div className="auth__overlay">
      <div className="auth__modal">
        <button
          type="button"
          className="auth__close"
          onClick={onClose}
          aria-label="Close login modal"
        >
          &times;
        </button>

        <h2>{isSignUp ? "Sign up for Summarist" : "Log in to Summarist"}</h2>
        <p>Welcome back! Sign in to continue reading.</p>
        <form className="auth__form" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            aria-label="Email address"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            aria-label="Password"
            required
          />

          <button type="submit" className="auth__submit">
            {isSignUp ? "Sign up" : "Log in"}
          </button>
        </form>
        <p className="auth__toggle">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
