'use server';

/**
 * @fileoverview This is the main entry point for all Genkit flows in production.
 * It ensures that all flow modules are imported and registered when the server
 * starts. This file is referenced in the `build` script in `package.json`.
 */

import './flows/generate-book-cover';
import './flows/generate-book-of-the-day';
import './flows/get-author-bibliography';
import './flows/summarize-book';
