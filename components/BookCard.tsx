import BookPill from "@/components/BookPill";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="w-44 flex-shrink-0 cursor-pointer">
      <div className="relative mb-3">
        <BookPill subscriptionRequired={book.subscriptionRequired} />
        <img
          src={book.imageLink}
          alt={book.title}
          className="h-44 w-full object-contain"
        />
      </div>

      <h3 className="line-clamp-2 font-bold text-[#032b41]">{book.title}</h3>

      <p className="mt-1 text-sm text-gray-600">{book.author}</p>

      <p className="mt-2 line-clamp-2 text-sm text-gray-500">{book.subTitle}</p>
    </div>
  );
}
