import { z } from 'zod';

export const CreatePresentationArgsSchema = z.object({
  title: z.string().min(1, { message: '"title" (string) is required.' }),
});
export type CreatePresentationArgs = z.infer<typeof CreatePresentationArgsSchema>;

export const GetPresentationArgsSchema = z.object({
  presentationId: z.string().min(1, { message: '"presentationId" (string) is required.' }),
  fields: z.string().optional(),
});
export type GetPresentationArgs = z.infer<typeof GetPresentationArgsSchema>;

// Using z.any() for complex Google Slides API structures for simplicity in this context.
// For stricter typing, these could be defined more precisely based on the Google Slides API.
const GoogleSlidesRequestSchema = z.any();
const GoogleSlidesWriteControlSchema = z.any();

export const BatchUpdatePresentationArgsSchema = z.object({
  presentationId: z.string().min(1, { message: '"presentationId" (string) is required.' }),
  requests: z.array(GoogleSlidesRequestSchema).min(1, { message: '"requests" (array) is required.' }),
  writeControl: GoogleSlidesWriteControlSchema.optional(),
});
export type BatchUpdatePresentationArgs = z.infer<typeof BatchUpdatePresentationArgsSchema>;

export const GetPageArgsSchema = z.object({
  presentationId: z.string().min(1, { message: '"presentationId" (string) is required.' }),
  pageObjectId: z.string().min(1, { message: '"pageObjectId" (string) is required.' }),
});
export type GetPageArgs = z.infer<typeof GetPageArgsSchema>;

export const SummarizePresentationArgsSchema = z.object({
  presentationId: z.string().min(1, { message: '"presentationId" (string) is required.' }),
  include_notes: z.boolean().optional(),
});
export type SummarizePresentationArgs = z.infer<typeof SummarizePresentationArgsSchema>;

export const movePresentationSchema = z.object({
  presentationId: z.string().min(1, { message: '"presentationId" (string) is required.' }),
  folderId: z.string().min(1, { message: '"folderId" (string) is required.' }),
  copyInstead: z.boolean().optional().describe('If true, creates a copy in the target folder instead of moving'),
  newName: z.string().optional().describe('New name for the presentation (only used when copyInstead is true)'),
});
export type MovePresentationArgs = z.infer<typeof movePresentationSchema>;
