"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Book } from "@/types/book";
import LoginModal from "@/components/LoginModal";
import { auth, db } from "@/lib/firebase";
import Image from "next/image";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import BookDetailsSkeleton from "@/components/BookDetailsSkeleton";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isSavingLibrary, setIsSavingLibrary] = useState(false);

  useEffect(() => {
    if (!book) return;

    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (active) setIsInLibrary(false);
        return;
      }

      try {
        const bookRef = doc(db, "users", user.uid, "library", book.id);
        const bookSnapshot = await getDoc(bookRef);

        if (active) {
          setIsInLibrary(bookSnapshot.exists());
        }
      } catch (error) {
        console.error("Unable to check library:", error);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [book]);

  useEffect(() => {
    if (typeof id !== "string") return;

    async function fetchBook() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(id as string)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }

        const data: Book = await response.json();
        setBook(data);

        console.log("Book details:", data);
      } catch (error) {
        console.error("Error fetching book:", error);
        setError("Unable to load book details.");
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  const handleReadOrListen = () => {
    if (!auth.currentUser) {
      setShowLoginModal(true);
      return;
    }

    if (!book) return;

    if (book.subscriptionRequired) {
      // TODO: Check active subscription when Stripe is implemented.
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${book.id}`);
  };

  if (loading) {
    return <BookDetailsSkeleton />;
  }

  if (error) {
    return <p className="p-8">{error}</p>;
  }

  if (!book) {
    return <p className="p-8">Book not found.</p>;
  }

  const handleLibraryToggle = async () => {
    const user = auth.currentUser;

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!book || isSavingLibrary) return;

    setIsSavingLibrary(true);

    try {
      const bookRef = doc(db, "users", user.uid, "library", book.id);

      if (isInLibrary) {
        await deleteDoc(bookRef);
        setIsInLibrary(false);
      } else {
        await setDoc(bookRef, {
          bookId: book.id,
          title: book.title,
          author: book.author,
          imageLink: book.imageLink,
        });

        setIsInLibrary(true);
      }
    } catch (error) {
      console.error("Unable to update library:", error);
    } finally {
      setIsSavingLibrary(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-8 py-10 text-[#032b41]">
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Left: Book information */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{book.title}</h1>

          <p className="mt-2 font-semibold">{book.author}</p>

          <p className="mt-3 text-gray-600">{book.subTitle}</p>

          {/* Book statistics */}
          <div className="my-6 grid grid-cols-2 gap-3 border-y py-4 text-sm">
            <p>
              ☆ {book.averageRating} ({book.totalRating} ratings)
            </p>
            <p>Duration coming later</p>
            <p>{book.type}</p>
            <p>{book.keyIdeas} Key Ideas</p>
          </div>

          {/* Read and Listen */}
          <div className="flex gap-3">
            <button
              onClick={handleReadOrListen}
              className="rounded bg-[#032b41] px-8 py-3 font-semibold text-white"
            >
              Read
            </button>

            <button
              onClick={handleReadOrListen}
              className="rounded bg-[#032b41] px-8 py-3 font-semibold text-white"
            >
              Listen
            </button>
          </div>

          {/* My Library */}
          <button
            type="button"
            onClick={handleLibraryToggle}
            disabled={isSavingLibrary}
            className="mt-5 text-sm font-semibold text-blue-600 disabled:opacity-50"
          >
            {isSavingLibrary
              ? "Updating Library..."
              : isInLibrary
                ? "✓ Remove from My Library"
                : "+ Add title to My Library"}
          </button>

          {/* Book description */}
          <section className="mt-8">
            <h2 className="mb-3 font-bold">What&apos;s it about?</h2>

            <div className="mb-4 flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-gray-100 px-3 py-2 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="whitespace-pre-line leading-7">
              {book.bookDescription}
            </p>
          </section>

          {/* Author description */}
          <section className="mt-8">
            <h2 className="mb-3 font-bold">About the author</h2>

            <p className="whitespace-pre-line leading-7">
              {book.authorDescription}
            </p>
          </section>
        </div>

        {/* Right: Book cover */}

        <div className="flex w-full justify-center md:w-72">
          <Image
            src={book.imageLink}
            alt={book.title}
            width={224}
            height={320}
            unoptimized
            className="h-fit w-56 object-contain"
          />
        </div>
      </div>
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </main>
  );
}
