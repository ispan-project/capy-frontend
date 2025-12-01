import { createRouter, createWebHistory } from "vue-router";
import teacherRouter from "./teacherRouter";
import adminRouter from "./adminRouter";
import studentRouter from "./studentRouter";
const routes = [...teacherRouter, ...adminRouter,...studentRouter];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
