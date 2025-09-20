import { api } from "../api/baseApi";

const privacyPolicySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createPrivacyPolicy: builder.mutation({
      query: (data) => {
        return {
          url: `/rule/create`,
          method: "POST",
          body: data,
        };
      },
    }),
    getPrivacyPolicy: builder.query({
      query: () => {
        return {
          url: `/rule/privacy`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useCreatePrivacyPolicyMutation, useGetPrivacyPolicyQuery } =
  privacyPolicySlice;
