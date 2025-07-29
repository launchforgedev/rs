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

export async function generateBookCover(input: GenerateBookCoverInput): Promise<string | null> {
    try {
        const {media} = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `Generate a visually appealing and marketable book cover for a book with the following details:
            Title: "${input.title}"
            Author: "${input.author}"
            Summary: "${input.summary}"
            
            The cover should be artistic and representative of the book's genre and themes. Avoid using any text on the image. Focus on creating a powerful and iconic visual.`,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        return media?.url ?? null;
    } catch (error) {
        console.error("AI image generation failed:", error);
        return null;
    }
}
