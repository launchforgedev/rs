import { Suspense } from 'react';
import HomePage from './home-page';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomePage />
    </Suspense>
  );
}

function PageSkeleton() {
    return (
        <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <main className="w-full max-w-6xl">
                 <section className="text-center my-16">
                    <Skeleton className="h-20 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                     <div className="relative max-w-2xl mx-auto mt-8">
                        <Skeleton className="w-full h-14 rounded-full" />
                    </div>
                </section>
                
                <section className="my-20">
                     <div className="text-center mb-12">
                        <Skeleton className="h-8 w-48 mx-auto" />
                        <Skeleton className="h-4 w-64 mx-auto mt-2" />
                     </div>
                     <div className="grid md:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                             <div key={i} className="text-center p-6 border border-dashed rounded-lg">
                                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                                <Skeleton className="h-6 w-32 mx-auto" />
                                <Skeleton className="h-12 w-48 mx-auto mt-2" />
                            </div>
                        ))}
                     </div>
                </section>
            </main>
        </div>
    )
}
