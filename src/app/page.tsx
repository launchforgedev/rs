
"use client";

import { useState, useTransition, useEffect } from "react";
import type { Book } from "@/types";
import { generateBookRecommendations } from "@/ai/flows/generate-book-recommendations";
import { summarizeBook } from "@/ai/flows/summarize-book";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { BookCard } from "@/components/book-card";
import { LitLensIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { StarRating } from "@/components/star-rating";
import { useToast } from "@/hooks/use-toast";
import { Search, BookOpen, Users, Tag, Sparkles } from "lucide-react";
import { fetchBookCover } from "@/services/google-books";

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

export default function Home() {
    const [isPending, startTransition] = useTransition();
    const [titleQuery, setTitleQuery] = useState("");
    const [authorQuery, setAuthorQuery] = useState("");
    const [genreQuery, setGenreQuery] = useState("");
    const [results, setResults] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
    const [isSimilarLoading, setIsSimilarLoading] = useState(false);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [shortSummary, setShortSummary] = useState('');
    const { toast } = useToast();

    const fetchCoversForBooks = async (books: Omit<Book, 'coverImage' | 'rating'>[]): Promise<Book[]> => {
        return Promise.all(
            books.map(async (book) => {
                const coverImage = await fetchBookCover(book.title, book.author);
                return {
                    ...book,
                    coverImage: coverImage || `https://placehold.co/300x450.png`,
                    rating: Math.random() * 2 + 3, // random between 3 and 5
                    dataAiHint: `${book.genre.toLowerCase()}`
                };
            })
        );
    };

    const handleSearch = (searchType: 'title' | 'filters') => {
        startTransition(async () => {
            let searchParameters = "";
            if (searchType === 'title' && titleQuery) {
                searchParameters = `title: ${titleQuery}`;
            } else if (searchType === 'filters') {
                const parts = [];
                if (authorQuery) parts.push(`author: ${authorQuery}`);
                if (genreQuery) parts.push(`genre: ${genreQuery}`);
                searchParameters = parts.join(', ');
            }

            if (!searchParameters) {
                toast({ variant: 'destructive', title: "Search Error", description: "Please provide search terms." });
                return;
            }

            try {
                setResults([]);
                const { recommendations } = await generateBookRecommendations({ searchParameters, count: 4 });
                const booksWithCovers = await fetchCoversForBooks(recommendations);
                setResults(booksWithCovers);

            } catch (error) {
                console.error("AI search failed:", error);
                toast({ variant: 'destructive', title: "AI Error", description: "Could not fetch recommendations. Please try again." });
                setResults([]);
            }
        });
    };

    const handleSelectBook = async (book: Book) => {
        setSelectedBook(book);
        setShortSummary('');
        setSimilarBooks([]);
        setIsSimilarLoading(true);

        try {
            const { recommendations } = await generateBookRecommendations({ searchParameters: `a book similar to ${book.title} by ${book.author}`, count: 3 });
            const booksWithCovers = await fetchCoversForBooks(recommendations);
            setSimilarBooks(booksWithCovers);

        } catch (error) {
            console.error("AI similar books failed:", error);
            toast({ variant: 'destructive', title: "AI Error", description: "Could not fetch similar books." });
            setSimilarBooks([]);
        } finally {
            setIsSimilarLoading(false);
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
    
    return (
        <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 lg:p-8 bg-background">
            <header className="w-full max-w-5xl mb-8 text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                    <LitLensIcon className="w-12 h-12 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">LitLens</h1>
                </div>
                <p className="text-muted-foreground font-body">Your AI-powered guide to the world of books.</p>
            </header>

            <main className="w-full max-w-5xl">
                <Card className="mb-8 shadow-lg">
                    <CardContent className="p-6">
                        <Tabs defaultValue="title" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="title">Search by Title</TabsTrigger>
                                <TabsTrigger value="filters">Search by Filters</TabsTrigger>
                            </TabsList>
                            <TabsContent value="title">
                                <form onSubmit={(e) => { e.preventDefault(); handleSearch('title'); }} className="flex flex-col sm:flex-row gap-4 mt-4">
                                    <div className="relative flex-grow">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="e.g., The Great Gatsby"
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
                                <form onSubmit={(e) => { e.preventDefault(); handleSearch('filters'); }} className="space-y-4 mt-4">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <Skeleton className="h-[225px] w-[150px] mb-4" />
                                        <Skeleton className="h-6 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-1/2 mb-4" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {results.map((book) => (
                                <BookCard key={`${book.title}-${book.author}`} book={book} onSelect={() => handleSelectBook(book)} />
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
                                <div className="mt-4">
                                    <StarRating rating={selectedBook.rating} />
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
                                
                                <h3 className="font-bold text-lg mb-4 mt-6 font-headline">Similar Books</h3>
                                {isSimilarLoading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                      {[...Array(3)].map((_, i) => (
                                          <div key={i} className="text-center">
                                            <Skeleton className="h-36 w-24 mx-auto rounded-md" />
                                            <Skeleton className="h-4 w-20 mx-auto mt-2" />
                                            <Skeleton className="h-3 w-16 mx-auto mt-1" />
                                          </div>
                                      ))}
                                    </div>
                                ) : similarBooks.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {similarBooks.map(book => (
                                          <div key={`${book.title}-${book.author}`} className="text-center">
                                            <Image src={book.coverImage} alt={book.title} width={100} height={150} className="mx-auto rounded-md shadow-md bg-muted object-cover h-36 w-auto" data-ai-hint={book.dataAiHint}/>
                                            <h4 className="text-sm font-bold mt-2 truncate">{book.title}</h4>
                                            <p className="text-xs text-muted-foreground">{book.author}</p>
                                          </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No similar books found.</p>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

    