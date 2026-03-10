import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { categoryTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  sortOrder?: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  listingCount: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const categoriesApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories (flat list)
    getCategories: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/categories`,
        method: 'GET',
      }),
      providesTags: [categoryTag],
    }),

    // Get category tree (nested with children)
    getCategoryTree: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/categories/tree`,
        method: 'GET',
      }),
      providesTags: [categoryTag],
    }),

    // Get category by slug
    getCategoryBySlug: builder.query<Record<string, any>, string>({
      query: (slug) => ({
        url: `/categories/${slug}`,
        method: 'GET',
      }),
      providesTags: [categoryTag],
    }),

    // Get children of a category
    getCategoryChildren: builder.query<Record<string, any>, string>({
      query: (id) => ({
        url: `/categories/${id}/children`,
        method: 'GET',
      }),
      providesTags: [categoryTag],
    }),

    // [Admin] Create category
    createCategory: builder.mutation<
      Record<string, any>,
      { payload: CreateCategoryPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/categories`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [categoryTag],
    }),

    // [Admin] Update category
    updateCategory: builder.mutation<
      Record<string, any>,
      { id: string; payload: UpdateCategoryPayload; options: OptionType }
    >({
      query: ({ id, payload }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [categoryTag],
    }),

    // [Admin] Delete category
    deleteCategory: builder.mutation<Record<string, any>, { id: string; options: OptionType }>({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [categoryTag],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetCategoryTreeQuery,
  useLazyGetCategoryTreeQuery,
  useGetCategoryBySlugQuery,
  useLazyGetCategoryBySlugQuery,
  useLazyGetCategoryChildrenQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
