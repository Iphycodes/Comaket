import { useEffect } from 'react';
import {
  useCreateReviewMutation,
  useSellerReplyMutation,
  useLazyGetReviewsQuery,
  CreateReviewPayload,
  SellerReplyPayload,
  QueryReviewsParams,
} from '@grc/services/reviews';

interface UseReviewsProps {
  fetchReviews?: boolean;
  reviewsParams?: QueryReviewsParams;
}

export const useReviews = ({ fetchReviews = false, reviewsParams = {} }: UseReviewsProps = {}) => {
  // API hooks
  const [createReview, createReviewResponse] = useCreateReviewMutation();
  const [sellerReply, sellerReplyResponse] = useSellerReplyMutation();
  const [triggerGetReviews, getReviewsResponse] = useLazyGetReviewsQuery();

  // Fetch on mount if requested
  useEffect(() => {
    if (fetchReviews) {
      triggerGetReviews(reviewsParams);
    }
  }, [fetchReviews]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleCreateReview = async (data: CreateReviewPayload) => {
    try {
      const result = await createReview({
        payload: data,
        options: { successMessage: 'Review submitted successfully' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleSellerReply = async (reviewId: string, data: SellerReplyPayload) => {
    try {
      const result = await sellerReply({
        id: reviewId,
        payload: data,
        options: { successMessage: 'Reply posted' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetReviews = async (params: QueryReviewsParams = {}) => {
    try {
      const result = await triggerGetReviews(params).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    createReview: handleCreateReview,
    sellerReply: handleSellerReply,
    getReviews: handleGetReviews,

    // Data
    reviews: getReviewsResponse?.data?.data || [],
    reviewsTotal: getReviewsResponse?.data?.meta?.pagination?.total || 0,
    reviewsTotalPages: getReviewsResponse?.data?.meta?.pagination?.totalPages || 0,

    // Loading states
    isCreatingReview: createReviewResponse.isLoading,
    isReplyingToReview: sellerReplyResponse.isLoading,
    isLoadingReviews: getReviewsResponse.isLoading,
    isFetchingReviews: getReviewsResponse.isFetching,

    // Success states
    isCreateReviewSuccess: createReviewResponse.isSuccess,
    isSellerReplySuccess: sellerReplyResponse.isSuccess,

    // Error states
    createReviewError: createReviewResponse.error,
    sellerReplyError: sellerReplyResponse.error,
    reviewsError: getReviewsResponse.error,

    // Response states
    createReviewResponse,
    sellerReplyResponse,
    getReviewsResponse,

    // Actions
    refetchReviews: (params?: QueryReviewsParams) => triggerGetReviews(params || reviewsParams),
  };
};
