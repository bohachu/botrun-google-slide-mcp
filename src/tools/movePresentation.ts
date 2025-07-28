import { slides_v1 } from 'googleapis';
import { z } from 'zod';
import { movePresentationSchema } from '../schemas.js';
import { google } from 'googleapis';

export class MovePresentationTool {
  constructor(
    _slidesClient: slides_v1.Slides,
    private auth: any
  ) {
    // slidesClient parameter is prefixed with _ to indicate it's intentionally unused
  }

  async execute(args: z.infer<typeof movePresentationSchema>): Promise<{ success: boolean; message: string; presentationUrl?: string }> {
    try {
      const { presentationId, folderId, copyInstead } = args;

      // Initialize Drive API client with the same auth
      const drive = google.drive({
        version: 'v3',
        auth: this.auth,
      });

      if (copyInstead) {
        // Option 1: Create a copy in the target folder
        try {
          const copy = await drive.files.copy({
            fileId: presentationId,
            requestBody: {
              parents: [folderId],
              name: args.newName || undefined,
            },
          });

          return {
            success: true,
            message: `Successfully created a copy in the target folder`,
            presentationUrl: `https://docs.google.com/presentation/d/${copy.data.id}/edit`,
          };
        } catch (copyError: any) {
          throw new Error(`Failed to copy presentation: ${copyError.message}`);
        }
      } else {
        // Option 2: Try to move the original file
        try {
          // First, get the current parents
          const file = await drive.files.get({
            fileId: presentationId,
            fields: 'parents',
          });

          // Remove from current parents and add to new folder
          const previousParents = file.data.parents ? file.data.parents.join(',') : undefined;
          
          await drive.files.update({
            fileId: presentationId,
            addParents: folderId,
            removeParents: previousParents,
            fields: 'id, parents',
          });

          return {
            success: true,
            message: `Successfully moved presentation to the target folder`,
            presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
          };
        } catch (moveError: any) {
          // If move fails, try to at least add to the folder without removing from original location
          try {
            await drive.files.update({
              fileId: presentationId,
              addParents: folderId,
              fields: 'id, parents',
            });

            return {
              success: true,
              message: `Successfully added presentation to the target folder (original location preserved)`,
              presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
            };
          } catch (addError: any) {
            // If adding also fails, try sharing as last resort
            try {
              // Get folder owner information
              const folder = await drive.files.get({
                fileId: folderId,
                fields: 'owners',
              });

              if (folder.data.owners && folder.data.owners.length > 0) {
                const ownerEmail = folder.data.owners[0].emailAddress;

                // Share the presentation with folder owner
                await drive.permissions.create({
                  fileId: presentationId,
                  requestBody: {
                    type: 'user',
                    role: 'writer',
                    emailAddress: ownerEmail,
                  },
                });

                return {
                  success: true,
                  message: `Cannot move directly due to permissions. Shared presentation with folder owner (${ownerEmail}) who can move it manually.`,
                  presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
                };
              }
            } catch (shareError: any) {
              // All attempts failed
              throw new Error(
                `Cannot move presentation. Possible solutions:\n` +
                `1. Share the target folder with the service account email\n` +
                `2. Use copyInstead: true to create a copy\n` +
                `3. Manually move the presentation from the UI\n` +
                `Original error: ${moveError.message}`
              );
            }
          }
        }
      }
      
      // This should never be reached, but TypeScript needs it
      throw new Error('Unexpected error in move operation');
    } catch (error: any) {
      throw new Error(`Failed to move presentation: ${error.message}`);
    }
  }
}