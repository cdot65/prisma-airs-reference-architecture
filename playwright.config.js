const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'./tests',
  timeout:90000,
  workers:2,
  use:{baseURL:'http://127.0.0.1:4173/prisma-airs-reference-architecture/',browserName:'chromium',
    launchOptions:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {}},
  webServer:{command:'npm run serve',url:'http://127.0.0.1:4173/prisma-airs-reference-architecture/',reuseExistingServer:!process.env.CI,timeout:60000},
});
