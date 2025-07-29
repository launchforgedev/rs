
"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import type { Book } from "@/types";
import { generateBookRecommendations } from "@/ai/flows/generate-book-recommendations";
import { summarizeBook } from "@/ai/flows/summarize-book";
import { generateBookCover } from "@/ai/flows/generate-book-cover";
import { generateBookOfTheDay, BookOfTheDay } from "@/ai/flows/generate-book-of-the-day";
import { getAuthorBibliography } from "@/ai/flows/get-author-bibliography";
import { useSearchParams } from 'next/navigation'


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCard } from "@/components/book-card";
import { AuthorTimeline } from "@/components/author-timeline";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { StarRating } from "@/components/star-rating";
import { useToast } from "@/hooks/use-toast";
import { Search, BookOpen, Users, Tag, Sparkles, BookHeart, BarChart, Users2 } from "lucide-react";

const GENRE_SUGGESTIONS = [
    "Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Thriller",
    "Romance",
    "Non-fiction",
    "Biography",
    "History",
    "Self-help",
];

type BookOfTheDayWithCover = BookOfTheDay & { coverImage: string, rating: number, dataAiHint?: string };
type BookWithYear = Book & { year: number };

export default function Home() {
    const [isPending, startTransition] = useTransition();
    const [titleQuery, setTitleQuery] = useState("");
    const [authorQuery, setAuthorQuery] = useState("");
    const [genreQuery, setGenreQuery] = useState("");
    const [results, setResults] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [authorBibliography, setAuthorBibliography] = useState<BookWithYear[]>([]);
    const [isAuthorBioLoading, setIsAuthorBioLoading] = useState(false);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [shortSummary, setShortSummary] = useState('');
    const [bookOfTheDay, setBookOfTheDay] = useState<BookOfTheDayWithCover | null>(null);
    const [isBookOfTheDayLoading, setIsBookOfTheDayLoading] = useState(true);

    const { toast } = useToast();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchBookOfTheDay = async () => {
            setIsBookOfTheDayLoading(true);
            try {
                const bookDetails = await generateBookOfTheDay();
                const coverImage = await generateBookCover({ title: bookDetails.title, author: bookDetails.author, summary: bookDetails.summary });
                setBookOfTheDay({ 
                    ...bookDetails, 
                    coverImage: coverImage || `https://placehold.co/300x450.png`,
                    rating: Math.random() * 2 + 3,
                    dataAiHint: `${bookDetails.genre.toLowerCase()}`
                });
            } catch (error) {
                 console.error("AI book of the day failed:", error);
                 toast({ variant: 'destructive', title: "AI Error", description: "Could not fetch the Book of the Day." });
            } finally {
                setIsBookOfTheDayLoading(false);
            }
        };
        fetchBookOfTheDay();
    }, [toast]);


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
            // Avoid duplicates
            history = [book, ...history.filter((item: Book) => item.title.toLowerCase() !== book.title.toLowerCase())];
            history = history.slice(0, 50); // Save up to 50 books
            localStorage.setItem("litsense_viewed_books", JSON.stringify(history));
        } catch (error) {
            console.error("Could not save to viewed books history:", error);
        }
    }


    const generateCoverForBook = async (book: Book, index: number) => {
        const coverImage = await generateBookCover({ title: book.title, author: book.author, summary: book.summary });
        if (coverImage) {
            setResults(prevResults => {
                const newResults = [...prevResults];
                if (newResults[index]) {
                    newResults[index] = { ...newResults[index], coverImage };
                }
                return newResults;
            });
        }
    };

    const handleSearch = useCallback((searchParameters: string) => {
        startTransition(async () => {
            if (!searchParameters) {
                toast({ variant: 'destructive', title: "Search Error", description: "Please provide search terms." });
                return;
            }

            saveToSearchHistory(searchParameters);

            try {
                setResults([]);
                const { recommendations } = await generateBookRecommendations({ searchParameters, count: 8 });
                
                const initialBooks = recommendations.map(book => ({
                    ...book,
                    coverImage: `https://placehold.co/300x450.png`,
                    dataAiHint: `${book.genre.toLowerCase()}`
                }));
                setResults(initialBooks);

                initialBooks.forEach((book, index) => {
                    generateCoverForBook(book, index);
                });


            } catch (error) {
                console.error("AI search failed:", error);
                toast({ variant: 'destructive', title: "AI Error", description: "Could not fetch recommendations. Please try again." });
                setResults([]);
            }
        });
    }, [toast]);

    const handleFormSubmit = (searchType: 'title' | 'filters') => {
        let searchParameters = "";
        if (searchType === 'title' && titleQuery) {
            searchParameters = titleQuery;
        } else if (searchType === 'filters') {
            const parts = [];
            if (authorQuery) parts.push(`author: ${authorQuery}`);
            if (genreQuery) parts.push(`genre: ${genreQuery}`);
            searchParameters = parts.join(', ');
        }
        handleSearch(searchParameters);
    };
    
    useEffect(() => {
        const queryFromUrl = searchParams.get('q');
        if (queryFromUrl) {
            setTitleQuery(queryFromUrl);
            handleSearch(queryFromUrl);
        }
    }, [searchParams, handleSearch]);


    const handleSelectBook = async (book: Book) => {
        setSelectedBook(book);
        saveToViewedBooks(book);
        setShortSummary('');
        setAuthorBibliography([]);
        setIsAuthorBioLoading(true);

        try {
            const { books } = await getAuthorBibliography({ author: book.author });
            const booksWithCoversPromises = books
                .filter(b => b.year)
                .map(async (b) => {
                    const coverImage = await generateBookCover({ title: b.title, author: b.author, summary: b.summary });
                    return {
                        ...b,
                        coverImage: coverImage || `https://placehold.co/300x450.png`,
                        rating: Math.random() * 2 + 3,
                        dataAiHint: `${b.genre.toLowerCase()}`,
                        year: b.year,
                    };
                });
            const booksWithCovers = await Promise.all(booksWithCoversPromises);
            setAuthorBibliography(booksWithCovers as BookWithYear[]);

        } catch (error) {
            console.error("AI author bibliography failed:", error);
            toast({ variant: 'destructive', title: "AI Error", description: "Could not fetch author's other books." });
            setAuthorBibliography([]);
        } finally {
            setIsAuthorBioLoading(false);
        }
    };

    const handleGenerateShortSummary = () => {
        if (!selectedBook) return;
        setIsSummaryLoading(true);
        startTransition(async () => {
            try {
                const { shortSummary } = await summarizeBook({
                    title: selectedBook.title,
                    author: selectedBook.author,
                    summary: selectedBook.summary,
                });
                setShortSummary(shortSummary);
            } catch (error) {
                console.error("AI summary failed:", error);
                toast({ variant: 'destructive', title: "AI Error", description: "Could not generate a short summary." });
            } finally {
                setIsSummaryLoading(false);
            }
        });
    };
    
    const bookOfTheDayAsBook = bookOfTheDay ? {
        title: bookOfTheDay.title,
        author: bookOfTheDay.author,
        genre: bookOfTheDay.genre,
        summary: bookOfTheDay.summary,
        coverImage: bookOfTheDay.coverImage,
        rating: bookOfTheDay.rating,
        dataAiHint: bookOfTheDay.dataAiHint,
    } : null;

    return (
        <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 lg:p-8">
            <main className="w-full max-w-6xl">

                <section className="mb-12">
                     <Card className="bg-primary/10 border-primary/20 shadow-lg overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline text-2xl sm:text-3xl text-primary">
                                <BookHeart className="w-8 h-8"/>
                                Book of the Day
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isBookOfTheDayLoading ? (
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
                            ) : bookOfTheDay && bookOfTheDayAsBook ? (
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <Image 
                                        src={bookOfTheDay.coverImage} 
                                        alt={`Cover of ${bookOfTheDay.title}`}
                                        width={200}
                                        height={300}
                                        className="rounded-lg shadow-2xl object-cover w-full max-w-[200px] md:w-auto bg-muted"
                                        data-ai-hint={bookOfTheDay.dataAiHint}
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-headline text-2xl sm:text-3xl font-bold">{bookOfTheDay.title}</h3>
                                        <p className="text-lg text-muted-foreground mb-2">{bookOfTheDay.author}</p>
                                        <p className="italic text-primary mb-4">&quot;{bookOfTheDay.reason}&quot;</p>
                                        <p className="mb-4">{bookOfTheDay.summary}</p>
                                        <Button onClick={() => handleSelectBook(bookOfTheDayAsBook)}>
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Learn More
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-10">Could not load the book of the day.</p>
                            )}
                        </CardContent>
                     </Card>
                </section>


                <Card className="mb-8 shadow-lg">
                    <CardContent className="p-6">
                        <Tabs defaultValue="title" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="title">Search by Title / Topic</TabsTrigger>
                                <TabsTrigger value="filters">Advanced Search</TabsTrigger>
                            </TabsList>
                            <TabsContent value="title">
                                <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit('title'); }} className="flex flex-col sm:flex-row gap-4 mt-4">
                                    <div className="relative flex-grow">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="e.g., The Great Gatsby, or books about space travel"
                                            className="pl-10"
                                            value={titleQuery}
                                            onChange={(e) => setTitleQuery(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" disabled={isPending} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                                        <Search className="mr-2 h-4 w-4" />
                                        {isPending ? 'Searching...' : 'Search'}
                                    </Button>
                                </form>
                            </TabsContent>
                            <TabsContent value="filters">
                                <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit('filters'); }} className="space-y-4 mt-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative flex-grow">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                placeholder="Author Name"
                                                className="pl-10"
                                                value={authorQuery}
                                                onChange={(e) => setAuthorQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative flex-grow">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                placeholder="Genre"
                                                className="pl-10"
                                                value={genreQuery}
                                                onChange={(e) => setGenreQuery(e.target.value)}
                                                list="genre-suggestions"
                                            />
                                            <datalist id="genre-suggestions">
                                                {GENRE_SUGGESTIONS.map(genre => <option key={genre} value={genre} />)}
                                            </datalist>
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
                                        <Search className="mr-2 h-4 w-4" />
                                        {isPending ? 'Searching...' : 'Search'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <section>
                    <h2 className="text-2xl font-headline font-bold mb-4">Results</h2>
                    {isPending && results.length === 0 ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-4 flex flex-col items-center text-center aspect-[2/3]">
                                        <Skeleton className="h-full w-full mb-4" />
                                        <Skeleton className="h-6 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : results.length > 0 ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                             {results.map((book, index) => (
                                <div
                                    key={`${book.title}-${book.author}`}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <BookCard book={book} onSelect={() => handleSelectBook(book)} />
                                </div>
                             ))}
                         </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-10">Find your next favorite book to get started.</p>
                    )}
                </section>
            </main>

            {selectedBook && (
                <Dialog open={!!selectedBook} onOpenChange={(isOpen) => !isOpen && setSelectedBook(null)}>
                    <DialogContent className="sm:max-w-3xl font-body">
                        <DialogHeader>
                            <DialogTitle className="font-headline text-3xl text-primary">{selectedBook.title}</DialogTitle>
                            <DialogDescription>{selectedBook.author} • {selectedBook.genre}</DialogDescription>
                        </DialogHeader>
                        <div className="grid md:grid-cols-3 gap-6 mt-4">
                            <div className="md:col-span-1">
                                <Image
                                    src={selectedBook.coverImage}
                                    alt={`Cover of ${selectedBook.title}`}
                                    width={300}
                                    height={450}
                                    className="rounded-lg shadow-lg w-full bg-muted object-cover"
                                    data-ai-hint={selectedBook.dataAiHint}
                                />
                                <div className="mt-4 flex flex-col gap-3">
                                    <StarRating rating={selectedBook.rating} />
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
                                
                                <Card className="bg-muted/50 p-4 rounded-lg">
                                  <div className="flex justify-between items-start">
                                      <div>
                                          <h4 className="font-bold font-headline text-primary">AI-Powered Short Summary</h4>
                                          <p className="text-sm text-muted-foreground">A concise summary generated by AI.</p>
                                      </div>
                                      <Button variant="ghost" size="sm" onClick={handleGenerateShortSummary} disabled={isSummaryLoading}>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        {isSummaryLoading ? "Generating..." : "Generate"}
                                      </Button>
                                  </div>
                                  {isSummaryLoading && <Skeleton className="h-12 w-full mt-2" />}
                                  {!isSummaryLoading && shortSummary && <p className="text-sm mt-2">{shortSummary}</p>}
                                </Card>
                                
                                <AuthorTimeline books={authorBibliography} isLoading={isAuthorBioLoading} />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

    
