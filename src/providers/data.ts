import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    mapResponse: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };

/*
// import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
// import { API_URL } from "./constants";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });

// * ----------------------------------------------------------------

// import { MOCK_SUBJECTS } from "@/constants/mock-data";
// import {
//   BaseRecord,
//   DataProvider,
//   GetListParams,
//   GetListResponse,
// } from "@refinedev/core";

// export const dataProvider: DataProvider = {
//   getList: async <TData extends BaseRecord = BaseRecord>({
//     resource,
//   }: GetListParams): Promise<GetListResponse<TData>> => {
//     if (resource !== "subjects") {
//       return { data: [] as TData[], total: 0 };
//     }

//     return {
//       data: MOCK_SUBJECTS as unknown as TData[],
//       total: MOCK_SUBJECTS.length,
//     };
//   },

//   getOne: async () => {
//     throw new Error("This Function is Not Present Yet !!");
//   },

//   create: async () => {
//     throw new Error("This Function is Not Present Yet !!");
//   },

//   update: async () => {
//     throw new Error("This Function is Not Present Yet !!");
//   },

//   deleteOne: async () => {
//     throw new Error("This Function is Not Present Yet !!");
//   },

//   getApiUrl: () => {
//     return "";
//   },
// };
*/
