import axios from "axios";
// 建立實體時指派預設配置
const instance = axios.create({
  baseURL: "http://10.0.103.99:8080/api",
  timeout: 6000,
});
// 新增一個請求攔截器
instance.interceptors.request.use(
  (config) => {
    // 在請求實際發出前，做些什麼
    //TODO:添加token header
    return config;
  },
  (error) => {
    // 發生請求錯誤時，做些什麼
    return Promise.reject(error);
  }
);

// 新增一個回應攔截器
instance.interceptors.response.use(
  (response) => {
    // 任何 2xx 的 HTTP 狀態碼，將會觸發此函數
    // 針對回應資料，做些什麼
    return response.data;
  },
  (error) => {
    // 任何 2xx 之外的 HTTP 狀態碼，都會觸發此函數
    // 針對回應錯誤，做些什麼
    return Promise.reject(error);
  }
);
export default instance;
