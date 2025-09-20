import { api } from "../api/baseApi";

const categorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: ({ page, limit, search }) => {
        return {
          url: "/category",
          method: "GET",
          params: {
            page, // Page number
            limit, // Number of items per page
            searchTerm: search, // Search term (if any)
          },
        };
      },
    }),
    createCategory: builder.mutation({
      query: (categoryData) => {
        return {
          url: "/category",
          method: "POST",
          body: categoryData,
        };
      },
    }),
    updateCategory: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/category/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
    }),
    deleteCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/category/${id}`,
          method: "DELETE",
        };
      },
    }),
    // get all category for super admin
    getAllCategoryForSuperAdmin: builder.query({
      query: () => {
        return {
          url: "/category/all",
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoryForSuperAdminQuery,
} = categorySlice;
