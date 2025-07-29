'use server';

export async function fetchBookCover(title: string, author: string): Promise<string | null> {
  const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Google Books API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const book = data.items[0];
      const imageLinks = book.volumeInfo.imageLinks;
      if (imageLinks && imageLinks.thumbnail) {
        // Return HTTPS version of the thumbnail
        return imageLinks.thumbnail.replace(/^http:/, 'https:');
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch from Google Books API:", error);
    return null;
  }
}
