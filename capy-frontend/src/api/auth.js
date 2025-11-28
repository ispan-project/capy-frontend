import instance from "@/utils/http";
export const axiostest = () => {
  return instance.get("/student/test1");
};
