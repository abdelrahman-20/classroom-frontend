// import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
// import { API_URL } from "./constants";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });

// const API_URL = "https://api.fake-rest.refine.dev";
import { Mock_SUBJECTS } from "@/pages/subjects/mock-data";
import type {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";

const notImplemented = (action: string) => () => {
  throw new Error(`${action} is not implemented for subjects.`);
};

export const dataProvider: DataProvider = {
  getOne: notImplemented("getOne"),
  update: notImplemented("update"),
  getList: async <
    TData extends BaseRecord = BaseRecord,
  >({}: GetListParams): Promise<GetListResponse<TData>> => {
    return {
      data: Mock_SUBJECTS as unknown as TData[],
      total: Mock_SUBJECTS.length,
    };
  },
  create: notImplemented("create"),
  deleteOne: notImplemented("deleteOne"),
  getApiUrl: () => "",
  // Optional methods:
  // getMany: () => { /* ... */ },
  // createMany: () => { /* ... */ },
  // deleteMany: () => { /* ... */ },
  // updateMany: () => { /* ... */ },
  // custom: () => { /* ... */ },
};
