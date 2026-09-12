import { BASE_URL } from "@/constants";
import { CreateResponse, ListResponse } from "@/types";
import {
  CreateParams,
  CustomParams,
  DeleteOneParams,
  GetOneResponse,
  HttpError,
  UpdateParams,
} from "@refinedev/core";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

const fetchWithCredentials = (url: string, init?: RequestInit) =>
  fetch(url, { ...init, credentials: "include" });

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = "Request Failed";

  try {
    const payload = (await response.json()) as {
      error?: string;
      message?: string;
    };
    message = payload.error ?? payload.message ?? message;
  } catch {
    // ignore
  }

  return { message, statusCode: response.status };
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },

    buildQueryParams: async ({ pagination, filters, sorters }) => {
      const page = pagination?.currentPage ?? 1;
      const limit = pagination?.pageSize ?? 10;

      const query: Record<string, string | number> = { page, limit };

      for (const filter of filters ?? []) {
        const field = "field" in filter ? filter.field : "";
        if (field === "department") query.department = filter.value;
        if (field === "subject") query.subject = filter.value;
        if (field === "teacher") query.teacher = filter.value;
        if (field === "role") query.role = filter.value;
        if (field === "status") query.status = filter.value;
        if (filter.operator === "contains") query.search = filter.value;
      }

      if (sorters?.[0]) {
        query.sort = sorters[0].field;
        query.order = sorters[0].order;
      }

      return query;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,
    buildBodyParams: async ({ variables }) => variables,
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const data: CreateResponse = await response.json();
      return data.data ?? {};
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const data: GetOneResponse = await response.json();
      return data.data ?? {};
    },
  },

  update: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    buildBodyParams: async ({ variables }) => variables,
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const data = (await response.json()) as { data?: unknown };
      return data.data ?? {};
    },
  },

  deleteOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const data = (await response.json()) as { data?: unknown };
      return data.data ?? {};
    },
  },

  custom: {
    buildQueryParams: async ({ query }) => query ?? {},
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      return response.json();
    },
  },
};

const { dataProvider: baseProvider } = createDataProvider(BASE_URL, options);

const dataProvider = {
  ...baseProvider,
  getList: async (params: Parameters<typeof baseProvider.getList>[0]) => {
    const url = `${BASE_URL}/${params.resource}?${new URLSearchParams(
      Object.entries(
        (await options.getList!.buildQueryParams!(params)) as Record<
          string,
          string
        >,
      ),
    ).toString()}`;
    const response = await fetchWithCredentials(url);
    const data = await options.getList!.mapResponse!(response, params);
    const total = await options.getList!.getTotalCount!(response, params);
    return { data, total };
  },
  getOne: async (params: Parameters<typeof baseProvider.getOne>[0]) => {
    const response = await fetchWithCredentials(
      `${BASE_URL}/${params.resource}/${params.id}`,
    );
    const data = await options.getOne!.mapResponse!(response, params);
    return { data };
  },
  create: async (params: CreateParams) => {
    const response = await fetchWithCredentials(
      `${BASE_URL}/${params.resource}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.variables),
      },
    );
    const data = await options.create!.mapResponse!(response, params);
    return { data };
  },
  update: async (params: UpdateParams) => {
    const response = await fetchWithCredentials(
      `${BASE_URL}/${params.resource}/${params.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.variables),
      },
    );

    const data = await options.update!.mapResponse!(response, params);
    return { data };
  },
  deleteOne: async (params: DeleteOneParams) => {
    const response = await fetchWithCredentials(
      `${BASE_URL}/${params.resource}/${params.id}`,
      { method: "DELETE" },
    );

    const data = await options.deleteOne!.mapResponse!(response, params);
    return { data };
  },
  custom: async (params: CustomParams) => {
    const query = params.query
      ? `?${new URLSearchParams(
          params.query as Record<string, string>,
        ).toString()}`
      : "";
    const response = await fetchWithCredentials(
      `${BASE_URL}/${params.url}${query}`,
      {
        method: params.method ?? "GET",
        headers:
          params.method && params.method !== "get"
            ? { "Content-Type": "application/json" }
            : undefined,
        body:
          params.method && params.method !== "get"
            ? JSON.stringify(params.payload)
            : undefined,
      },
    );
    const data = await options.custom!.mapResponse!(response, params);
    return { data };
  },
  getApiUrl: () => BASE_URL,
};

export default dataProvider;
