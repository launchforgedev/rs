
'use server';

/**
 * @fileOverview A book cover generation AI agent.
 *
 * - generateBookCover - A function that generates a book cover image.
 * - GenerateBookCoverInput - The input type for the generateBookCover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookCoverInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  summary: z.string().describe('A short summary of the book.'),
});

export type GenerateBookCoverInput = z.infer<typeof GenerateBookCoverInputSchema>;


export async function generateBookCover(input: GenerateBookCoverInput): Promise<string> {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A stunning, high-resolution, professional book cover for a book titled "${input.title}" by ${input.author}. The cover should visually represent the following summary: ${input.summary}. The design should be modern, eye-catching, and suitable for a bestseller. Avoid text on the cover itself.`,
        config: {
            responseModalities: ['IMAGE', 'TEXT'],
        },
    });

    return media.url;
}
