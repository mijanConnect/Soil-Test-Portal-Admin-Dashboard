import { api } from "../api/baseApi";
const dashboardSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        method: "GET",
        url: "/dashboard/users",
        params: {
          page,
          limit,
          searchTerm: search,
        },
      }),
    }),

    createUserAsAdmin: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/dashboard/user-create",
          body: data,
        };
      },
    }),

    // update user
    updateUser: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: `/dashboard/users/update/${data.id}`,
          body: data,
        };
      },
    }),
    deleteUser: builder.mutation({
      query: (data) => {
        return {
          method: "DELETE",
          url: `/dashboard/users/${data.id}`,
          body: data,
        };
      },
    }),
  }),
});

export const { useGetAllUserQuery, useCreateUserAsAdminMutation, useUpdateUserMutation, useDeleteUserMutation } =
  dashboardSlice;
