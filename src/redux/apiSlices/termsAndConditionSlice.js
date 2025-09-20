import { api } from "../api/baseApi";

const termsAndConditionSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createTermsAndConditions: builder.mutation({
      query: (data) => {
        return {
          url: `/rule/create`,
          method: "POST",
          body: data,
        };
      },
    }),
    getTermsAndConditions: builder.query({
      query: () => {
        return {
          url: `/rule/terms`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateTermsAndConditionsMutation,
  useGetTermsAndConditionsQuery,
} = termsAndConditionSlice;
