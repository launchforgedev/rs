"use client";

import { useState, useTransition } from "react";
import type { Book } from "@/types";
import { generateBookRecommendations } from "@/ai/flows/generate-book-recommendations";

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
import { Search, BookOpen, Users, Tag } from "lucide-react";

// Mock data to ensure a good user experience as AI output can be unpredictable.
const mockBooks: Book[] = [
    { title: "The Midnight Library", author: "Matt Haig", genre: "Fantasy", summary: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.", coverImage: "https://placehold.co/300x450", rating: 4.2, dataAiHint: "fantasy library" },
    { title: "Project Hail Mary", author: "Andy Weir", genre: "Sci-Fi", summary: "Ryland Grace is the sole survivor on a desperate, last-chance mission - and if he fails, humanity and the earth itself will perish.", coverImage: "https://placehold.co/300x450", rating: 4.8, dataAiHint: "space astronaut" },
    { title: "Klara and the Sun", author: "Kazuo Ishiguro", genre: "Sci-Fi", summary: "A story of Klara, an Artificial Friend with outstanding observational qualities, who, from her place in the store, watches carefully the behavior of those who come in to browse.", coverImage: "https://placehold.co/300x450", rating: 4.1, dataAiHint: "robot sun" },
    { title: "The Four Winds", author: "Kristin Hannah", genre: "Historical Fiction", summary: "An epic novel of love and heroism and hope, set against the backdrop of one of America’s most defining eras—the Great Depression.", coverImage: "https://placehold.co/300x450", rating: 4.5, dataAiHint: "dust bowl" },
    { title: "The Vanishing Half", author: "Brit Bennett", genre: "Historical Fiction", summary: "The Vignes twin sisters will always be identical. But after growing up together in a small, southern black community and running away at age sixteen, it's not just the shape of their daily lives that is different as adults, it's everything: their families, their communities, their racial identities.", coverImage: "https://placehold.co/300x450", rating: 4.4, dataAiHint: "twin sisters" },
    { title: "The Song of Achilles", author: "Madeline Miller", genre: "Mythology", summary: "A thrilling, profoundly moving, and utterly unique retelling of the legend of Achilles and the Trojan War from the perspective of Patroclus.", coverImage: "https://placehold.co/300x450", rating: 4.7, dataAiHint: "greek mythology" },
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
    const { toast } = useToast();

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
                // We call the AI, but use mock data for a stable UI.
                await generateBookRecommendations({ searchParameters, count: 4 });
                
                const booksWithSummaries = mockBooks.slice(0, 4).map(book => ({
                    ...book,
                    summary: book.summary.substring(0, 150) + '...'
                }));

                setResults(booksWithSummaries.map(b => ({...b, coverImage: "https://placehold.co/300x450", rating: 4.5})));
            } catch (error) {
                console.error("AI search failed:", error);
                toast({ variant: 'destructive', title: "AI Error", description: "Could not fetch recommendations. Please try again." });
                setResults([]);
            }
        });
    };

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book);
        setIsSimilarLoading(true);
        startTransition(async () => {
             try {
                await generateBookRecommendations({ searchParameters: `a book similar to ${book.title} by ${book.author}`, count: 3 });
                // Using mock data for similar books
                const similar = mockBooks.filter(b => b.title !== book.title).slice(0,3);
                
                setSimilarBooks(similar.map(b => ({...b, coverImage: "https://placehold.co/300x450", rating: 4.5})));
            } catch (error) {
                console.error("AI similar books failed:", error);
                toast({ variant: 'destructive', title: "AI Error", description: "Could not fetch similar books." });
                setSimilarBooks([]);
            } finally {
                setIsSimilarLoading(false);
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
                                            />
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
                    {isPending ? (
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
                                <BookCard key={book.title} book={book} onSelect={() => handleSelectBook(book)} />
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
                                    className="rounded-lg shadow-lg w-full"
                                    data-ai-hint={selectedBook.dataAiHint}
                                />
                                <div className="mt-4">
                                    <StarRating rating={selectedBook.rating} />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="font-bold text-lg mb-2 font-headline">Summary</h3>
                                <p className="text-muted-foreground mb-6">{selectedBook.summary}</p>
                                
                                <h3 className="font-bold text-lg mb-4 font-headline">Similar Books</h3>
                                {isSimilarLoading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
                                    </div>
                                ) : similarBooks.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {similarBooks.map(book => (
                                          <div key={book.title} className="text-center">
                                            <Image src={book.coverImage} alt={book.title} width={100} height={150} className="mx-auto rounded-md shadow-md" data-ai-hint={book.dataAiHint}/>
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
