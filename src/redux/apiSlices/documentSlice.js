import { api } from "../api/baseApi";
const documentSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // create document
    createDocument: builder.mutation({
      query: (formData) => {
        return {
          method: "POST",
          url: "/document/upload",
          body: formData,
        };
      },
    }),
    // get all documents
    getAllDocuments: builder.query({
      query: () => ({
        method: "GET",
        url: "/document/upload",
      }),
    }),

    // get document for super admin and admin
    getDocumentForAdmin: builder.query({
      query: () => ({
        method: "GET",
        url: "/document/all",
      }),
    }),

    // update document status
    updateDocumentStatus: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: `/document/upload/${data.id}`,
          body: data,
        };
      },
    }),

    // delete documetn
    deleteDocument: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/document/upload/${id}`,
        };
      },
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useGetAllDocumentsQuery,
  useGetDocumentForAdminQuery,
  useUpdateDocumentStatusMutation,
  useDeleteDocumentMutation,
} = documentSlice;
