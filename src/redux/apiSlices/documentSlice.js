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
  }),
});

export const { useCreateDocumentMutation } = documentSlice;
