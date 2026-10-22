"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import type { Book } from "@/types/book";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setBooks([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(search.trim())}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data: Book[] = await response.json();
        setBooks(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Search error:", error);
          setBooks([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search]);

  return (
    <div className="relative w-full">
      <div className="flex overflow-hidden rounded-md border border-[#d6dfe2] bg-[#f1f5f5]">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search for books"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
        />

        <div className="flex w-11 items-center justify-center border-l border-[#d6dfe2]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#032b41"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      {search.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded border border-gray-200 bg-white p-4 shadow-lg">
          {loading ? (
            <p>Searching...</p>
          ) : books.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <p>No books found.</p>
          )}
        </div>
      )}
    </div>
  );
}
