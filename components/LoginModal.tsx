import "./LoginModal.css";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";

type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

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

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorMessage(
              "This email is already registered. Please log in instead.",
            );
            break;

          case "auth/weak-password":
            setErrorMessage(
              "Your password is too weak. Please choose a stronger password.",
            );
            break;

          case "auth/invalid-email":
            setErrorMessage("Please enter a valid email address.");
            break;

          case "auth/invalid-credential":
          case "auth/wrong-password":
          case "auth/user-not-found":
            setErrorMessage("Invalid email or password. Please try again.");
            break;

          default:
            setErrorMessage("Something went wrong. Please try again.");
        }
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      onClose();
    } catch (error) {
      console.error("Google sign-in failed:", error);
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
        {errorMessage && (
          <p className="auth__error" role="alert">
            {errorMessage}
          </p>
        )}
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
        <button
          type="button"
          className="auth__google"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>
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
