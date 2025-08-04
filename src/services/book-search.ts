import { bookDatabase } from '@/data/books';
import type { Book } from '@/types';

export function searchBooks(query: string, limit = 8): Book[] {
  if (!query) return [];
  
  const lowerCaseQuery = query.toLowerCase();
  
  const results = bookDatabase.filter(book => {
    return (
      book.title.toLowerCase().includes(lowerCaseQuery) ||
      book.author.toLowerCase().includes(lowerCaseQuery) ||
      book.genre.toLowerCase().includes(lowerCaseQuery)
    );
  });
  
  // Sort results by relevance (simple version: title match is most important)
  results.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(lowerCaseQuery);
    const bTitleMatch = b.title.toLowerCase().includes(lowerCaseQuery);
    if (aTitleMatch && !bTitleMatch) return -1;
    if (!aTitleMatch && bTitleMatch) return 1;
    return 0;
  });
  
  return results.slice(0, limit);
}
