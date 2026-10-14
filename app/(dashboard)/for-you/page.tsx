"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import type { Book } from "@/types/book";
import BookCard from "@/components/BookCard";

export default function ForYouPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);

  useEffect(() => {
    async function fetchSelectedBook() {
      try {
        const response = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch selected book");
        }

        const data: Book[] = await response.json();
        setSelectedBook(data[0]);
        console.log("Selected book:", data);
      } catch (error) {
        console.error("Error fetching selected book:", error);
      }
    }

    if (user) {
      fetchSelectedBook();
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (!currentUser) {
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    async function fetchRecommendedBooks() {
      try {
        const response = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recommended books");
        }

        const data: Book[] = await response.json();
        setRecommendedBooks(data);

        console.log("Recommended books:", data);
      } catch (error) {
        console.error("Error fetching recommended books:", error);
      }
    }

    if (user) {
      fetchRecommendedBooks();
    }
  }, [user]);

  useEffect(() => {
    async function fetchSuggestedBooks() {
      try {
        const response = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch suggested books");
        }

        const data: Book[] = await response.json();
        setSuggestedBooks(data);

        console.log("Suggested books:", data);
      } catch (error) {
        console.error("Error fetching suggested books:", error);
      }
    }

    if (user) {
      fetchSuggestedBooks();
    }
  }, [user]);

  if (authLoading || !user) {
    return <p>Loading...</p>;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold text-[#032b41]">
        Selected just for you
      </h1>

      {selectedBook ? (
        <div className="flex max-w-[680px] items-center rounded bg-[#fdf1d7] p-6">
          {/* Subtitle */}
          <div className="w-2/5 self-stretch border-r border-gray-300 pr-6">
            <p className="text-base leading-5 text-[#032b41]">
              {selectedBook.subTitle}
            </p>
          </div>

          {/* Book cover */}
          <div className="flex w-1/4 justify-center px-5">
            <img
              src={selectedBook.imageLink}
              alt={selectedBook.title}
              className="w-28 object-contain"
            />
          </div>

          {/* Book details */}
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="font-bold text-[#032b41]">{selectedBook.title}</h2>

            <p className="text-sm text-gray-600">{selectedBook.author}</p>

            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                ▶
              </span>

              <span className="text-sm font-semibold text-[#032b41]">
                Audio duration coming soon
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading selected book...</p>
      )}
      {/* Recommended Books */}
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-bold text-[#032b41]">
          Recommended For You
        </h2>

        <p className="mb-8 text-gray-600">We think you'll like these</p>

        <div className="flex gap-6 overflow-x-auto pt-6 pb-4">
          {recommendedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Suggested Books */}
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-bold text-[#032b41]">
          Suggested Books
        </h2>

        <p className="mb-8 text-gray-600">Browse more books you might enjoy</p>

        <div className="flex gap-6 overflow-x-auto pt-6 pb-4">
          {suggestedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </main>
  );
}
