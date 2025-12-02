import Link from 'next/link';
import Image from 'next/image';

interface Book {
  id: number;
  title: string;
  author: string;
  coverImageUrl: string;
}

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const { id, title, author, coverImageUrl } = book;

  return (
    <Link href={`/books/${id}`} passHref>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer h-full">
        <div className="relative w-full h-48">
          {/* Using Next/Image for optimization. Placeholder URL for demo. */}
          <Image
            src={coverImageUrl || 'http://via.placeholder.com/240x300'}
            alt={`Cover image for ${title}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-[1.02]"
            priority
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate mb-1" title={title}>
            {title}
          </h3>
          <p className="text-sm text-gray-500">{author}</p>
          <button className="mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-800">
            View Details →
          </button>
        </div>
      </div>
    </Link>
  );
};