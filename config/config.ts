import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Config Center',
  },
  plugins: ['@umijs/max-plugin-openapi'],
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
  ],
  proxy: {
    '/api': {
      target: 'http://localhost:3456',
      changeOrigin: true,
    },
  },
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: 'http://localhost:3456/docs-json',
      mock: false,
      projectName: 'CONFIGURE',
      apiPrefix: 'CONFIGURE_API_PREFIX',
    },
  ],
  npmClient: 'pnpm',
});
