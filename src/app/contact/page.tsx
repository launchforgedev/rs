import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Globe } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold font-headline mb-6">Contact Us</h1>
            <Card className="max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle>Our Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-lg">
                    <div className="flex items-center gap-4">
                        <Building className="w-6 h-6 text-primary" />
                        <p>
                            <span className="font-semibold">Owner:</span> Prateek
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Globe className="w-6 h-6 text-primary" />
                        <a 
                            href="http://launchforgedev.online" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-primary hover:underline"
                        >
                            launchforgedev.online
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
