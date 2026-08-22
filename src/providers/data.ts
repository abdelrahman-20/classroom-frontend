// import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
// import { API_URL } from "./constants";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });

// const API_URL = "https://api.fake-rest.refine.dev";

// import { Mock_SUBJECTS } from "@/pages/subjects/mock-data";
// import type {
//   BaseRecord,
//   DataProvider,
//   GetListParams,
//   GetListResponse,
// } from "@refinedev/core";

// const notImplemented = (action: string) => () => {
//   throw new Error(`${action} is not implemented for subjects.`);
// };

// export const dataProvider: DataProvider = {
//   getOne: notImplemented("getOne"),
//   update: notImplemented("update"),
//   getList: async <
//     TData extends BaseRecord = BaseRecord,
//   >({}: GetListParams): Promise<GetListResponse<TData>> => {
//     return {
//       data: Mock_SUBJECTS as unknown as TData[],
//       total: Mock_SUBJECTS.length,
//     };
//   },
//   create: notImplemented("create"),
//   deleteOne: notImplemented("deleteOne"),
//   getApiUrl: () => "",
//   // Optional methods:
//   // getMany: () => { /* ... */ },
//   // createMany: () => { /* ... */ },
//   // deleteMany: () => { /* ... */ },
//   // updateMany: () => { /* ... */ },
//   // custom: () => { /* ... */ },
// };

import { BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    mapResponse: async (response) => {
      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },

    buildQueryParams: async ({ pagination, filters }) => {
      const page = pagination?.currentPage ?? 1;
      const limit = pagination?.pageSize ?? 10;

      // The Query Consumed in Backend
      const query: Record<string, string | number> = {
        page,
        limit,
      };

      // console.log(filters);
      for (const filter of filters ?? []) {
        const field = "field" in filter ? filter.field : "";
        if (field === "department") {
          query.department = filter.value;
        }
        if (filter.operator === "contains") {
          query.search = filter.value;
        }
      }

      return query;
    },

    getTotalCount: async (response) => {
      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
};

const { dataProvider } = createDataProvider(BASE_URL, options);

export default dataProvider;
