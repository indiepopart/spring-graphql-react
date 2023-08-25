import { AxiosError } from "axios";
import { backendAPI } from "./base";

export type CompaniesQuery = {
  page: number;
};

export type PersonDTO = {
  name: string;
}

export type CompanyDTO = {
  name: string;
  SIC: string;
  id: string;
  companyNumber: string;
  category: string;
  status: string;
  countryOfOrigin: string;
  controlledBy: PersonDTO[];

};

export const CompanyApi = {

  getCompanyCount: async () => {
    try {
      const response = await backendAPI.post("/graphql", {
        query: `{
        companyCount
      }`,
      });
      return response.data.data.companyCount as number;
    } catch (error) {
      console.log("handle get company count error", error);
      if (error instanceof AxiosError) {
        let axiosError = error as AxiosError;
        if (axiosError.response?.data) {
          throw new Error(axiosError.response?.data as string);
        }
      }
      throw new Error("Unknown error, please contact the administrator");
    }
  },


  getCompanyList: async (params?: CompaniesQuery) => {

    try {
      const response = await backendAPI.post("/graphql", {
        query: `{
        companyList(page: ${params?.page || 0}) {
          name,
          SIC,
          id,
          companyNumber,
          category,
          status,
          controlledBy {
            name
          }
        }}`,
      });
      return response.data.data.companyList as CompanyDTO[];
    } catch (error) {
      console.log("handle get companies error", error);
      if (error instanceof AxiosError) {
        let axiosError = error as AxiosError;
        if (axiosError.response?.data) {
          throw new Error(axiosError.response?.data as string);
        }
      }
      throw new Error("Unknown error, please contact the administrator");
    }
  },

};