import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "./constants";
import {
  BaseRecord,
  DataProvider,
  GetListResponse,
  GetListParams,
} from "@refinedev/core";
import MOCK_SUBJECTS from "./mockSubjects";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") {
      return { data: [], total: 0 };
    }

    // const response = await fetch(`${API_URL}/${resource}`);
    // const data = await response.json();
    return {
      data: MOCK_SUBJECTS as unknown as TData[],
      total: MOCK_SUBJECTS.length,
    };
  },

  getOne: async () => {
    throw new Error(`This function is Not Present`);
  },

  create: async () => {
    throw new Error(`This function is Not Present`);
  },

  update: async () => {
    throw new Error(`This function is Not Present`);
  },

  deleteOne: async () => {
    throw new Error(`This function is Not Present`);
  },

  getApiUrl: () => ``,
};
