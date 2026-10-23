"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import type { Book } from "@/types/book";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdReplay10, MdForward10 } from "react-icons/md";
import Image from "next/image";
import PlayerSkeleton from "@/components/PlayerSkeleton";
import { useFontSize } from "@/components/FontSizeContext";

export default function PlayerPage() {
  const params = useParams();
  const { fontSize } = useFontSize();
  const id = params.id;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
      } catch (error) {
        console.error("Error fetching book:", error);
        setError("Unable to load book.");
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Unable to play audio:", error);
      }
    } else {
      audioRef.current.pause();
    }
  };

  const skipAudio = (seconds: number) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    audio.currentTime = Math.max(
      0,
      Math.min(audio.currentTime + seconds, audio.duration || 0),
    );
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <PlayerSkeleton />;
  }

  if (error) {
    return <p className="p-8">{error}</p>;
  }

  if (!book) {
    return <p className="p-8">Book not found.</p>;
  }

  return (
    <main className="mx-auto max-w-4xl px-8 pb-28 pt-8 text-[#032b41]">
      <h1 className="border-b pb-4 text-xl font-bold">{book.title}</h1>
      <div
        className="mt-6 whitespace-pre-line leading-7"
        style={{ fontSize: `${fontSize}px` }}
      >
        {book.summary}
      </div>
      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-center gap-4 bg-[#032b41] p-4 text-white">
        <div className="flex items-center gap-3 md:absolute md:left-8">
          <Image
            src={book.imageLink}
            alt={book.title}
            width={48}
            height={64}
            unoptimized
            className="h-12 w-9 object-contain"
          />

          <div className="max-w-36">
            <p className="truncate text-sm font-semibold">{book.title}</p>
            <p className="truncate text-xs text-gray-300">{book.author}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => skipAudio(-10)}
          aria-label="Rewind 10 seconds"
          className="text-2xl text-white hover:opacity-80"
        >
          <MdReplay10 />
        </button>

        <button
          type="button"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#032b41]"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <button
          type="button"
          onClick={() => skipAudio(10)}
          aria-label="Forward 10 seconds"
          className="text-2xl text-white hover:opacity-80"
        >
          <MdForward10 />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs">{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(event) => {
              const newTime = Number(event.target.value);

              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
              }
            }}
            className="w-40 cursor-pointer accent-white"
            aria-label="Audio progress"
          />

          <span className="text-xs">{formatTime(duration)}</span>
        </div>

        <audio
          ref={audioRef}
          src={book.audioLink}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => {
            setDuration(audioRef.current?.duration || 0);
          }}
          onTimeUpdate={() => {
            setCurrentTime(audioRef.current?.currentTime || 0);
          }}
        />
      </div>
    </main>
  );
}
