import { api } from "../api/baseApi";
const documentSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // create document
    createDocument: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/document/upload",
          body: data,
        };
      },
    }),
  }),
});

export const { useCreateDocumentMutation } = documentSlice;
