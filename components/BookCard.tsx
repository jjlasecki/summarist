"use client";

import BookPill from "@/components/BookPill";
import type { Book } from "@/types/book";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    if (!book.audioLink) return;

    const audio = new Audio();
    audio.preload = "metadata";

    const handleMetadata = () => {
      if (!Number.isFinite(audio.duration)) return;

      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);

      setDuration(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      );
    };

    audio.addEventListener("loadedmetadata", handleMetadata);
    audio.src = book.audioLink;

    return () => {
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.removeAttribute("src");
      audio.load();
    };
  }, [book.audioLink]);
  return (
    <Link
      href={`/book/${book.id}`}
      className="block w-44 flex-shrink-0 cursor-pointer"
    >
      <div className="relative mb-3">
        <BookPill subscriptionRequired={book.subscriptionRequired} />
        <Image
          src={book.imageLink}
          alt={book.title}
          width={176}
          height={176}
          unoptimized
          className="h-44 w-full object-contain"
        />
      </div>

      <h3 className="line-clamp-2 font-bold text-[#032b41]">{book.title}</h3>

      <p className="mt-1 text-sm text-gray-600">{book.author}</p>

      <p className="mt-2 line-clamp-2 text-sm text-gray-500">{book.subTitle}</p>
      <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
        {duration && <span>◷ {duration}</span>}
        <span>☆ {book.averageRating}</span>
      </div>
    </Link>
  );
}
