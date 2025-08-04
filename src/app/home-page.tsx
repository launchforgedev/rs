
"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import type { Book } from "@/types";
import { searchBooks } from "@/services/book-search";
import { useSearchParams } from 'next/navigation'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookListItem } from "@/components/book-list-item";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { StarRating } from "@/components/star-rating";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, BarChart, Users2, Wand2, Compass, Sparkles, Library, BookHeart } from "lucide-react";
import { bookDatabase } from "@/data/books";

const GENRE_SUGGESTIONS = [
    "Fiction", "Mystery", "Thriller", "Science Fiction", 
    "Fantasy", "Romance", "History", "Biography", 
    "Horror", "Self-Help", "Comedy", "Adventure"
];

type BookOfTheDay = Book;

export default function HomePage() {
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [bookOfTheDay, setBookOfTheDay] = useState<BookOfTheDay | null>(null);
    const [isBookOfTheDayLoading, setIsBookOfTheDayLoading] = useState(true);

    const { toast } = useToast();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsBookOfTheDayLoading(true);
        // Select a random book from the local database
        const randomBook = bookDatabase[Math.floor(Math.random() * bookDatabase.length)];
        const bookWithCover: BookOfTheDay = {
            ...randomBook,
            coverImage: `https://placehold.co/300x450.png`,
            dataAiHint: `${randomBook.genre.toLowerCase()}`
        };
        setBookOfTheDay(bookWithCover);
        setIsBookOfTheDayLoading(false);
    }, []);


    const saveToSearchHistory = (query: string) => {
        if (!query) return;
        try {
            const storedHistory = localStorage.getItem("litsense_search_history");
            let history = storedHistory ? JSON.parse(storedHistory) : [];
            history = [query, ...history.filter((item: string) => item.toLowerCase() !== query.toLowerCase())];
            history = history.slice(0, 20);
            localStorage.setItem("litsense_search_history", JSON.stringify(history));
        } catch (error) {
            console.error("Could not save to search history:", error);
        }
    };
    
    const saveToViewedBooks = (book: Book) => {
        if (!book) return;
        try {
            const storedHistory = localStorage.getItem("litsense_viewed_books");
            let history = storedHistory ? JSON.parse(storedHistory) : [];
            // Avoid duplicates and ensure cover image is consistent
            const bookToStore = { ...book, coverImage: `https://placehold.co/40x60.png` };
            history = [bookToStore, ...history.filter((item: Book) => item.title.toLowerCase() !== book.title.toLowerCase())];
            history = history.slice(0, 50); // Save up to 50 books
            localStorage.setItem("litsense_viewed_books", JSON.stringify(history));
        } catch (error) {
            console.error("Could not save to viewed books history:", error);
        }
    }

    const handleSearch = useCallback((searchParameters: string) => {
        if (!searchParameters) {
            toast({ variant: 'destructive', title: "Search Error", description: "Please provide search terms." });
            return;
        }

        setResults([]);
        startTransition(() => {
            saveToSearchHistory(searchParameters);
            try {
                const recommendations = searchBooks(searchParameters);
                setResults(recommendations.map(r => ({
                    ...r, 
                    coverImage: `https://placehold.co/300x450.png`,
                    dataAiHint: r.genre?.toLowerCase()
                })));

            } catch (error) {
                console.error("Search failed:", error);
                toast({ variant: 'destructive', title: "Search Error", description: "Could not fetch recommendations. Please try again." });
                setResults([]);
            }
        });
    }, [toast]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchQuery);
    };
    
    const handleGenreClick = (genre: string) => {
        setSearchQuery(genre);
        handleSearch(genre);
    }
    
    useEffect(() => {
        const queryFromUrl = searchParams.get('q');
        if (queryFromUrl) {
            setSearchQuery(queryFromUrl);
            handleSearch(queryFromUrl);
        }
    }, [searchParams, handleSearch]);


    const handleSelectBook = (book: Book) => {
        const bookWithDetails = {
            ...book,
            coverImage: `https://placehold.co/300x450.png`,
            dataAiHint: book.genre?.toLowerCase(),
        };
        setSelectedBook(bookWithDetails);
        saveToViewedBooks(bookWithDetails);
    };
    
    return (
        <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <main className="w-full max-w-6xl">

                 <section className="text-center my-16 animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-bold font-headline text-primary">
                        Find Your Next Story
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
                        Instantly search our curated library of classic and popular books. Just tell us what you're in the mood for.
                    </p>
                     <form 
                        onSubmit={handleFormSubmit}
                        className="relative max-w-2xl mx-auto mt-8"
                    >
                        <Wand2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by title, author, or genre..."
                            className="w-full pl-12 pr-28 h-14 text-lg rounded-full shadow-lg focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 transition-shadow duration-300 focus:shadow-primary/30"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button 
                            type="submit" 
                            disabled={isPending} 
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-11 rounded-full px-6 text-base"
                        >
                            {isPending ? 'Searching...' : 'Search'}
                        </Button>
                    </form>
                </section>
                
                <section className="my-20">
                     <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-headline">How It Works</h2>
                        <p className="text-muted-foreground mt-2">Discover your next read in three simple steps.</p>
                     </div>
                     <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 border border-dashed rounded-lg animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                                <Compass className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold font-headline">1. Search Anything</h3>
                            <p className="text-muted-foreground mt-2">Use simple keywords, a book title, or an author to start your journey.</p>
                        </div>
                         <div className="text-center p-6 border border-dashed rounded-lg animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold font-headline">2. Instant Discovery</h3>
                            <p className="text-muted-foreground mt-2">Our fast search finds perfect matches from our curated world of books.</p>
                        </div>
                         <div className="text-center p-6 border border-dashed rounded-lg animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                                <Library className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold font-headline">3. Explore & Enjoy</h3>
                            <p className="text-muted-foreground mt-2">Dive into summaries and find your next favorite book to read.</p>
                        </div>
                     </div>
                </section>

                {results.length === 0 && !isPending && (
                <section className="my-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-headline">...Or Explore by Genre</h2>
                        <p className="text-muted-foreground mt-2">Click a genre to get instant recommendations.</p>
                     </div>
                     <div className="flex flex-wrap justify-center gap-4">
                        {GENRE_SUGGESTIONS.map((genre, index) => (
                             <Button 
                                key={genre} 
                                variant="outline"
                                className="rounded-full px-6 py-3 text-base transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:-translate-y-1 animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={() => handleGenreClick(genre)}
                            >
                                {genre}
                            </Button>
                        ))}
                     </div>
                </section>
                )}


                {results.length > 0 && (
                <section className="my-20">
                    <h2 className="text-3xl font-headline font-bold mb-6 text-center">Your Recommendations</h2>
                    <div className="space-y-4">
                         {results.map((book, index) => (
                            <div
                                key={`${book.title}-${book.author}`}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <BookListItem book={book} onSelect={() => handleSelectBook(book)} />
                            </div>
                         ))}
                     </div>
                </section>
                )}

                 {isPending && results.length === 0 && (
                         <div className="space-y-4 my-20">
                            <h2 className="text-3xl font-headline font-bold mb-6 text-center">Searching...</h2>
                            {[...Array(8)].map((_, i) => (
                                <Card key={i} className="p-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1 space-y-3">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}


                 <section className="my-20">
                     <Card className="bg-primary/10 border-primary/20 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/40">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline text-2xl sm:text-3xl text-primary">
                                <BookHeart className="w-8 h-8"/>
                                Book of the Day
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isBookOfTheDayLoading || !bookOfTheDay ? (
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <Skeleton className="w-full md:w-[200px] h-[300px] rounded-lg"/>
                                    <div className="flex-1 space-y-4">
                                        <Skeleton className="h-8 w-3/4" />
                                        <Skeleton className="h-6 w-1/2" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <div className="pt-4">
                                          <Skeleton className="h-10 w-40" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <Image 
                                        src={bookOfTheDay.coverImage!} 
                                        alt={`Cover of ${bookOfTheDay.title}`}
                                        width={200}
                                        height={300}
                                        className="rounded-lg shadow-2xl object-cover w-full max-w-[200px] md:w-auto bg-muted transition-transform duration-500 hover:scale-105"
                                        data-ai-hint={bookOfTheDay.dataAiHint}
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-headline text-2xl sm:text-3xl font-bold">{bookOfTheDay.title}</h3>
                                        <p className="text-lg text-muted-foreground mb-2">{bookOfTheDay.author}</p>
                                        <p className="mb-4">{bookOfTheDay.summary}</p>
                                        <Button onClick={() => handleSelectBook(bookOfTheDay)}>
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Learn More
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                     </Card>
                </section>
            </main>

            {selectedBook && (
                <Dialog open={!!selectedBook} onOpenChange={(isOpen) => !isOpen && setSelectedBook(null)}>
                    <DialogContent className="sm:max-w-xl font-body">
                        <DialogHeader>
                            <DialogTitle className="font-headline text-3xl text-primary">{selectedBook.title}</DialogTitle>
                            <DialogDescription>{selectedBook.author} • {selectedBook.genre}</DialogDescription>
                        </DialogHeader>
                        <div className="grid md:grid-cols-3 gap-6 mt-4">
                            <div className="md:col-span-1">
                                <Image
                                    src={selectedBook.coverImage!}
                                    alt={`Cover of ${selectedBook.title}`}
                                    width={300}
                                    height={450}
                                    className="rounded-lg shadow-lg w-full bg-muted object-cover"
                                    data-ai-hint={selectedBook.dataAiHint}
                                />
                                <div className="mt-4 flex flex-col gap-3">
                                    {selectedBook.rating ? <StarRating rating={selectedBook.rating} /> : null}
                                    {selectedBook.reviews && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <BarChart className="w-5 h-5 text-primary" />
                                        <span>{selectedBook.reviews.toLocaleString()} Reviews</span>
                                    </div>

                                    )}
                                    {selectedBook.ageGroup && (
                                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users2 className="w-5 h-5 text-primary" />
                                        <span>Age Group: {selectedBook.ageGroup}</span>
                                    </div>
                                    )}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="font-bold text-lg mb-2 font-headline">Summary</h3>
                                <p className="text-muted-foreground mb-4">{selectedBook.summary}</p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
