import "./LoginModal.css";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  sendPasswordResetEmail,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";

type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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
  const handleGuestLogin = async () => {
    setErrorMessage("");

    try {
      await signInAnonymously(auth);
      onClose();
    } catch (error) {
      console.error("Guest login failed:", error);
      setErrorMessage("Unable to continue as a guest. Please try again.");
    }
  };
  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      await sendPasswordResetEmail(auth, email);

      setSuccessMessage(
        "If an account exists with this email, you'll receive a password reset link shortly.",
      );
    } catch (error) {
      console.error("Password reset failed:", error);

      setErrorMessage(
        "Unable to send the password reset email. Please try again.",
      );
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

        <h2>
          {isResettingPassword
            ? "Reset your password"
            : isSignUp
              ? "Sign up for Summarist"
              : "Log in to Summarist"}
        </h2>

        <p>
          {isResettingPassword
            ? "Enter your email address and we'll send you a password reset link."
            : "Welcome back! Sign in to continue reading."}
        </p>
        {errorMessage && (
          <p className="auth__error" role="alert">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="auth__success" role="status">
            {successMessage}
          </p>
        )}
        {isResettingPassword && (
          <form onSubmit={handlePasswordReset} className="auth__form">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
            />

            <button type="submit" className="auth__submit">
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => {
                setIsResettingPassword(false);
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              Back to Login
            </button>
          </form>
        )}

        {!isResettingPassword && (
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
        )}
        {!isSignUp && !isResettingPassword && (
          <button
            type="button"
            className="auth__forgot"
            onClick={() => {
              setIsResettingPassword(true);
              setErrorMessage("");
              setSuccessMessage("");
            }}
          >
            Forgot password?
          </button>
        )}
        {!isResettingPassword && (
          <>
            <button
              type="button"
              className="auth__google"
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </button>
            <button
              type="button"
              className="auth__google"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </button>
            <p className="auth__toggle">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Log in" : "Sign up"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
