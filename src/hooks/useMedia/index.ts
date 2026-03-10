import {
  useUploadMediaMutation,
  useUploadMultipleMediaMutation,
  useUploadGeneralMutation,
  useUploadGeneralMultipleMutation,
  useDeleteMediaMutation,
  UploadMediaPayload,
  UploadMultipleMediaPayload,
  DeleteMediaPayload,
} from '@grc/services/media';

export const useMedia = () => {
  // API hooks
  const [uploadMedia, uploadMediaResponse] = useUploadMediaMutation();
  const [uploadMultipleMedia, uploadMultipleMediaResponse] = useUploadMultipleMediaMutation();
  const [uploadGeneral, uploadGeneralResponse] = useUploadGeneralMutation();
  const [uploadGeneralMultiple, uploadGeneralMultipleResponse] = useUploadGeneralMultipleMutation();
  const [deleteMedia, deleteMediaResponse] = useDeleteMediaMutation();

  // ── Handler functions ───────────────────────────────────────────────

  const handleUploadMedia = async (data: UploadMediaPayload, hideSuccess?: boolean) => {
    try {
      const result = await uploadMedia({
        payload: data,
        options: {
          ...(hideSuccess
            ? { noSuccessMessage: true }
            : { successMessage: 'Image uploaded successfully' }),
        },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUploadMultipleMedia = async (
    data: UploadMultipleMediaPayload,
    hideSuccess?: boolean
  ) => {
    try {
      const result = await uploadMultipleMedia({
        payload: data,
        options: {
          ...(hideSuccess
            ? { noSuccessMessage: true }
            : { successMessage: `${data.files.length} images uploaded` }),
        },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteMedia = async (data: DeleteMediaPayload) => {
    try {
      const result = await deleteMedia({
        payload: data,
        options: { successMessage: 'Image removed' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // ── Convenience helpers ─────────────────────────────────────────────

  /**
   * Upload a single file without linking to any entity.
   * Returns the Cloudinary URL. Use this when you need URLs
   * before creating the entity (e.g., listing images).
   * Usage: const url = await uploadImage(file)
   */
  const uploadImage = async (file: File, hideSuccess?: boolean): Promise<string> => {
    try {
      const result = await uploadGeneral({
        payload: { file },
        options: {
          ...(hideSuccess ? { noSuccessMessage: true } : { successMessage: 'Image uploaded' }),
        },
      }).unwrap();
      return result?.data?.url;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Upload multiple files without linking to any entity.
   * Returns an array of Cloudinary URLs.
   * Usage: const urls = await uploadImages(files)
   */
  const uploadImages = async (files: File[], hideSuccess?: boolean): Promise<string[]> => {
    try {
      const result = await uploadGeneralMultiple({
        payload: { files },
        options: {
          ...(hideSuccess
            ? { noSuccessMessage: true }
            : { successMessage: `${files.length} images uploaded` }),
        },
      }).unwrap();
      return result?.data?.urls || [];
    } catch (error) {
      throw error;
    }
  };

  /**
   * Upload a user avatar.
   * Usage: uploadAvatar(userId, file)
   */
  const uploadAvatar = (userId: string, file: File) =>
    handleUploadMedia({ file, entityType: 'user', entityId: userId, field: 'avatar' });

  /**
   * Upload a creator logo.
   * Usage: uploadCreatorLogo(creatorId, file)
   */
  const uploadCreatorLogo = (creatorId: string, file: File) =>
    handleUploadMedia({ file, entityType: 'creator', entityId: creatorId, field: 'logo' });

  /**
   * Upload a creator cover image.
   * Usage: uploadCreatorCover(creatorId, file)
   */
  const uploadCreatorCover = (creatorId: string, file: File) =>
    handleUploadMedia({ file, entityType: 'creator', entityId: creatorId, field: 'coverImage' });

  /**
   * Upload a store logo.
   * Usage: uploadStoreLogo(storeId, file)
   */
  const uploadStoreLogo = (storeId: string, file: File) =>
    handleUploadMedia({ file, entityType: 'store', entityId: storeId, field: 'logo' });

  /**
   * Upload a store cover image.
   * Usage: uploadStoreCover(storeId, file)
   */
  const uploadStoreCover = (storeId: string, file: File) =>
    handleUploadMedia({ file, entityType: 'store', entityId: storeId, field: 'coverImage' });

  /**
   * Upload a listing image (appends to media array).
   * Usage: uploadListingImage(listingId, file)
   */
  const uploadListingImage = (listingId: string, file: File) =>
    handleUploadMedia({ file, entityType: 'listing', entityId: listingId, field: 'media' });

  /**
   * Upload multiple listing images at once.
   * Usage: uploadListingImages(listingId, files)
   */
  const uploadListingImages = (listingId: string, files: File[]) =>
    handleUploadMultipleMedia({
      files,
      entityType: 'listing',
      entityId: listingId,
      field: 'media',
    });

  /**
   * Remove a specific image from a listing.
   * Usage: removeListingImage(listingId, imageUrl)
   */
  const removeListingImage = (listingId: string, imageUrl: string) =>
    handleDeleteMedia({
      entityType: 'listing',
      entityId: listingId,
      field: 'media',
      imageUrl,
    });

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Generic handlers
    uploadMedia: handleUploadMedia,
    uploadMultipleMedia: handleUploadMultipleMedia,
    deleteMedia: handleDeleteMedia,

    // Convenience helpers
    uploadImage, // Single file → URL (no entity)
    uploadImages, // Multiple files → URLs (no entity)
    uploadAvatar,
    uploadCreatorLogo,
    uploadCreatorCover,
    uploadStoreLogo,
    uploadStoreCover,
    uploadListingImage,
    uploadListingImages,
    removeListingImage,

    // Loading states
    isUploading: uploadMediaResponse.isLoading,
    isUploadingMultiple: uploadMultipleMediaResponse.isLoading,
    isUploadingGeneral: uploadGeneralResponse.isLoading,
    isUploadingGeneralMultiple: uploadGeneralMultipleResponse.isLoading,
    isDeleting: deleteMediaResponse.isLoading,

    // Success states
    isUploadSuccess: uploadMediaResponse.isSuccess,
    isUploadMultipleSuccess: uploadMultipleMediaResponse.isSuccess,
    isUploadGeneralSuccess: uploadGeneralResponse.isSuccess,
    isDeleteSuccess: deleteMediaResponse.isSuccess,

    // Error states
    uploadError: uploadMediaResponse.error,
    uploadMultipleError: uploadMultipleMediaResponse.error,
    uploadGeneralError: uploadGeneralResponse.error,
    deleteError: deleteMediaResponse.error,

    // Data (last upload result)
    uploadedUrl: uploadMediaResponse?.data?.data?.url,
    uploadedFiles: uploadMultipleMediaResponse?.data?.data?.files || [],

    // Response states
    uploadMediaResponse,
    uploadMultipleMediaResponse,
    uploadGeneralResponse,
    uploadGeneralMultipleResponse,
    deleteMediaResponse,
  };
};
