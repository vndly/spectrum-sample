import { z } from 'zod'
import { SortFieldSchema, SortOrderSchema } from './filter.schema'
import { LibraryEntrySchema } from './library.schema'

/**
 * Schema for user settings.
 */
export const SettingsSchema = z.object({
  theme: z.enum(['dark', 'light']),
  language: z.string(),
  preferredRegion: z.string(),
  layoutMode: z.enum(['grid', 'list']),
  defaultHomeSection: z.enum(['trending', 'popular', 'search']),
  librarySortField: SortFieldSchema.optional(),
  librarySortOrder: SortOrderSchema.optional(),
})

/** Inferred type for settings. */
export type Settings = z.infer<typeof SettingsSchema>

/** Inferred type for layout mode. */
export type LayoutMode = 'grid' | 'list'

/**
 * Default settings.
 */
export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  language: 'en',
  preferredRegion: 'US',
  layoutMode: 'grid',
  defaultHomeSection: 'trending',
  librarySortField: 'dateAdded',
  librarySortOrder: 'desc',
}

/**
 * Schema for the exported data file.
 */
export const ExportDataSchema = z.object({
  exportVersion: z.literal(1),
  exportedAt: z.string().datetime(),
  schemaVersion: z.literal(1),
  library: z.record(z.string(), LibraryEntrySchema),
  tags: z.array(z.string()),
  settings: SettingsSchema,
})

/** Inferred type for exported data. */
export type ExportData = z.infer<typeof ExportDataSchema>

/**
 * Schema for importing data, supporting potential future migrations.
 */
export const ImportDataSchema = z.discriminatedUnion('exportVersion', [
  ExportDataSchema,
  // Add future versions here with transforms
])
