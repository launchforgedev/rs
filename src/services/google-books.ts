
'use server';

export async function getBookCover(title: string, author: string): Promise<string> {
    const placeholder = `https://placehold.co/300x450.png`;
    try {
        const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const book = data.items[0];
            const imageLinks = book.volumeInfo.imageLinks;
            
            if (imageLinks) {
                // Prefer thumbnail, but fallback to smallThumbnail
                let imageUrl = imageLinks.thumbnail || imageLinks.smallThumbnail;
                // Google Books API returns HTTP URLs, so we convert them to HTTPS
                return imageUrl.replace(/^http:/, 'https:');
            }
        }
        
        return placeholder;

    } catch (error) {
        console.error("Could not fetch book cover from Google Books API:", error);
        return placeholder;
    }
}
