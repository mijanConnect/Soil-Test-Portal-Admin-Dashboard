import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        // baseUrl: "http://10.10.7.46:5001/api/v1",
        baseUrl: "http://193.46.198.251:5001/api/v1",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }), 
    tagTypes: ["Auth"],
    endpoints: () => ({})
});

export const imageUrl = "http://193.46.198.251:5001/";
// export const imageUrl = "http://10.10.7.46:5001";