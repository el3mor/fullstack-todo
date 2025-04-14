import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axios.config";
import { AxiosRequestConfig } from "axios";

interface IAuthenticatedQuery {
  queryKey: string[];
  URL: string;
  config?:AxiosRequestConfig
}

const useAuthenticatedQuery = ({URL, queryKey, config}:IAuthenticatedQuery) => {
  return useQuery({
      queryKey,
      queryFn: async () => {
        const { data } = await axiosInstance.get(URL, config);
        return data;
      },
    });
}

export default useAuthenticatedQuery;
