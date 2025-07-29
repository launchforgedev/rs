"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, History as HistoryIcon } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        const storedHistory = localStorage.getItem("litsense_history");
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);

    const clearHistory = () => {
        localStorage.removeItem("litsense_history");
        setHistory([]);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-headline">Search History</h1>
                {history.length > 0 && (
                    <Button variant="destructive" size="sm" onClick={clearHistory}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear History
                    </Button>
                )}
            </div>
            {history.length > 0 ? (
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <ul className="space-y-3">
                            {history.map((item, index) => (
                                <li key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <HistoryIcon className="w-5 h-5 text-primary" />
                                        <span className="font-body text-lg">{item}</span>
                                    </div>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={`/?q=${encodeURIComponent(item)}`}>
                                            Search again
                                        </Link>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-20">
                    <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No history yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Your past searches will appear here.
                    </p>
                </div>
            )}
        </div>
    );
}
