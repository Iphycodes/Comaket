import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { userTag, creatorTag, storeTag, listingTag, categoryTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type EntityType = 'user' | 'creator' | 'store' | 'listing' | 'category';

export type EntityField =
  | 'avatar'
  | 'logo'
  | 'coverImage'
  | 'featuredWorks'
  | 'media'
  | 'icon'
  | 'image';

export interface UploadMediaPayload {
  file: File;
  entityType: EntityType;
  entityId: string;
  field: EntityField;
  mediaType?: 'image' | 'video';
}

export interface UploadMultipleMediaPayload {
  files: File[];
  entityType: EntityType;
  entityId: string;
  field: EntityField;
  mediaType?: 'image' | 'video';
}

export interface DeleteMediaPayload {
  entityType: EntityType;
  entityId: string;
  field: EntityField;
  imageUrl?: string;
}

export interface MediaUploadResponse {
  url: string;
  entityType: EntityType;
  entityId: string;
  field: string;
  message: string;
}

export interface GeneralUploadPayload {
  file: File;
}

export interface GeneralUploadMultiplePayload {
  files: File[];
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Build FormData from payload
// ═══════════════════════════════════════════════════════════════════════════

function buildFormData(payload: UploadMediaPayload): FormData {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('entityType', payload.entityType);
  formData.append('entityId', payload.entityId);
  formData.append('field', payload.field);
  if (payload.mediaType) {
    formData.append('mediaType', payload.mediaType);
  }
  return formData;
}

function buildMultipleFormData(payload: UploadMultipleMediaPayload): FormData {
  const formData = new FormData();
  payload.files.forEach((file) => formData.append('files', file));
  formData.append('entityType', payload.entityType);
  formData.append('entityId', payload.entityId);
  formData.append('field', payload.field);
  if (payload.mediaType) {
    formData.append('mediaType', payload.mediaType);
  }
  return formData;
}

// Tag invalidation map — uploading to a listing invalidates listing cache, etc.
const ENTITY_TAG_MAP: Record<EntityType, string> = {
  user: userTag,
  creator: creatorTag,
  store: storeTag,
  listing: listingTag,
  category: categoryTag,
};

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const mediaApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Upload single file
    uploadMedia: builder.mutation<
      Record<string, any>,
      { payload: UploadMediaPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/media/upload`,
        method: 'POST',
        body: buildFormData(payload),
        // Don't set Content-Type — browser sets it with multipart boundary
      }),
      invalidatesTags: (_result, _error, { payload }) => [
        ENTITY_TAG_MAP[payload.entityType] as any,
      ],
    }),

    // Upload multiple files
    uploadMultipleMedia: builder.mutation<
      Record<string, any>,
      { payload: UploadMultipleMediaPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/media/upload-multiple`,
        method: 'POST',
        body: buildMultipleFormData(payload),
      }),
      invalidatesTags: (_result, _error, { payload }) => [
        ENTITY_TAG_MAP[payload.entityType] as any,
      ],
    }),

    // Upload single file (general, no entity linking)
    uploadGeneral: builder.mutation<
      Record<string, any>,
      { payload: GeneralUploadPayload; options?: OptionType }
    >({
      query: ({ payload }) => {
        const formData = new FormData();
        formData.append('file', payload.file);
        return {
          url: `/media/upload-general`,
          method: 'POST',
          body: formData,
        };
      },
    }),

    // Upload multiple files (general, no entity linking)
    uploadGeneralMultiple: builder.mutation<
      Record<string, any>,
      { payload: GeneralUploadMultiplePayload; options?: OptionType }
    >({
      query: ({ payload }) => {
        const formData = new FormData();
        payload.files.forEach((file) => formData.append('files', file));
        return {
          url: `/media/upload-general-multiple`,
          method: 'POST',
          body: formData,
        };
      },
    }),

    // Delete media
    deleteMedia: builder.mutation<
      Record<string, any>,
      { payload: DeleteMediaPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/media`,
        method: 'DELETE',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { payload }) => [
        ENTITY_TAG_MAP[payload.entityType] as any,
      ],
    }),
  }),
});

export const {
  useUploadMediaMutation,
  useUploadMultipleMediaMutation,
  useUploadGeneralMutation,
  useUploadGeneralMultipleMutation,
  useDeleteMediaMutation,
} = mediaApi;
