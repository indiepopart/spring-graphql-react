import backendAPI from "./base";

let requestInterceptor: number;
let responseInterceptor: number;

export const clearInterceptors = () => {
  backendAPI.interceptors.request.eject(requestInterceptor);
  backendAPI.interceptors.response.eject(responseInterceptor);
};

export const setInterceptors = (accessToken: String) => {

  clearInterceptors();

  requestInterceptor = backendAPI.interceptors.request.use(
    // @ts-expect-error
    function (config) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };
    },
    function (error) {
      console.log("request interceptor error", error);
      return Promise.reject(error);
    }
  );
};