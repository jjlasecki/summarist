"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { Book } from "@/types/book";
import BookCard from "@/components/BookCard";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (active) {
          setBooks([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const libraryRef = collection(db, "users", user.uid, "library");

        const snapshot = await getDocs(libraryRef);

        const savedBooks = await Promise.all(
          snapshot.docs.map(async (savedDoc) => {
            const bookId = savedDoc.data().bookId || savedDoc.id;

            const response = await fetch(
              `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(bookId)}`,
            );

            if (!response.ok) {
              throw new Error("Unable to load saved book");
            }

            return (await response.json()) as Book;
          }),
        );

        if (active) {
          setBooks(savedBooks);
        }
      } catch (error) {
        console.error("Unable to load library:", error);

        if (active) {
          setError("Unable to load your saved books.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 text-[#032b41]">
      <h1 className="text-2xl font-bold">Saved Books</h1>

      {loading ? (
        <p className="mt-4">Loading your library...</p>
      ) : error ? (
        <p className="mt-4">{error}</p>
      ) : (
        <>
          <p className="mt-3 text-sm text-gray-600">
            {books.length} {books.length === 1 ? "item" : "items"}
          </p>

          {books.length === 0 ? (
            <p className="mt-8 text-gray-600">
              You haven&apos;t saved any books yet.
            </p>
          ) : (
            <div className="mt-10 flex flex-wrap gap-8">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
