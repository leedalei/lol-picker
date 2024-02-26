import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/home", component: "@/pages/home" },
    { path: "/login", component: "@/pages/login"},
    { path: "/room/:id", component: "@/pages/room" },
  ],
  npmClient: 'pnpm',
  extraPostCSSPlugins: [require("tailwindcss"), require("autoprefixer")],
  proxy:{
    "/api" : {
      target: "http://127.0.0.1:3000",
    }
  }
});
