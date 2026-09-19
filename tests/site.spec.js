const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const manifest=require('../content-manifest.json');

for(const note of manifest){
  test(`lesson ${note.slug} renders its diagrams without browser errors`,async({page})=>{
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    const response=await page.goto(`learn/${note.slug}/`);
    expect(response.status()).toBe(200);
    await expect(page.getByRole('heading',{level:1,name:note.title,exact:true})).toBeVisible();
    const diagrams=(fs.readFileSync(`docs/${note.slug}.md`,'utf8').match(/^```mermaid/gm)||[]).length;
    await expect(page.locator('main .docusaurus-mermaid-container svg')).toHaveCount(diagrams,{timeout:45000});
    for(const svg of await page.locator('main .docusaurus-mermaid-container svg').all()){
      await expect(svg).toHaveAttribute('aria-labelledby',/.+/);
      await expect(svg).toHaveAttribute('aria-describedby',/.+/);
    }
    await expect(page.locator('main')).not.toContainText('Syntax error in text');
    expect(errors).toEqual([]);
  });
}

test('authorization exercise denies each missing condition',async({page})=>{
  await page.goto('./');
  const status=page.getByRole('status');
  await expect(status).toContainText('Allowed');
  for(const checkbox of await page.getByRole('checkbox').all()){
    await checkbox.uncheck();await expect(status).toContainText('Denied');
    await checkbox.check();await expect(status).toContainText('Allowed');
  }
});

test('home works on a small screen and links use the project base path',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('./');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.getByRole('link',{name:'Start learning →'}).click();
  await expect(page).toHaveURL(/\/prisma-airs-reference-architecture\/learn\/start-here\/?$/);
});

test('diagrams also render in dark mode',async({page})=>{
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto('learn/architecture/');
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.locator('main .docusaurus-mermaid-container svg')).toHaveCount(2,{timeout:45000});
});

test('diagram expansion supports zoom, SVG download and Escape',async({page})=>{
  await page.goto('learn/login/');
  const expand=page.getByRole('button',{name:'Expand diagram'}).first();
  await expect(expand).toBeEnabled({timeout:45000});await expand.click();
  const dialog=page.getByRole('dialog',{name:'Expanded diagram'});
  await expect(dialog).toBeVisible();await expect(dialog.getByRole('img')).toBeVisible();
  await dialog.getByRole('button',{name:'Zoom in',exact:true}).click();
  await expect(dialog).toContainText('125%');
  await expect(dialog.getByRole('link',{name:'Save SVG'})).toHaveAttribute('href',/^blob:/);
  await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
});


test('ServiceNow onboarding is discoverable and explains in-session MCP authorization',async({page})=>{
  await page.goto('./');
  await page.getByRole('link',{name:'Sign in and connect ServiceNow'}).click();
  await expect(page).toHaveURL(/learn\/login\/#sso-to-servicenow-a-complete-first-session$/);
  const main=page.locator('main');
  await expect(main).toContainText('airs-harness 0.1.0-alpha.22');
  await expect(main).toContainText('Prisma AIRS CLI 7.0.0');
  await expect(main).toContainText('airs cli tenant switch development');
  await expect(main).toContainText('Harness environments and CLI tenants are independent');
  await expect(main).toContainText('env create work --gateway-url');
  await expect(main).toContainText('--oidc-client-id harness-native');
  await expect(main).toContainText('Add gateway MCP server');
  await expect(main).toContainText('mcp_oauth_credentials_store = "keyring"');
  await expect(main).toContainText('does not enforce this setting automatically');
  await expect(main).toContainText('Start new conversation');
  await expect(main).toContainText('Nothing is submitted or replayed automatically');
  await expect(main).toContainText('https://gateway-mcp.example.com/mcp-service-now-dev/mcp');
  await expect(main).toContainText('Reconnect and verify');
  await expect(main).toContainText('hidden callback input');
  await expect(main).not.toContainText('Ctrl+D');
  await expect(main).toContainText('same company account');
  await expect(main).toContainText('list_incidents');
  await expect(main).toContainText('Do not create or update any records.');
});


test('first-session guide separates workspace keys, local names and explicit verification',async({page})=>{
  await page.goto('learn/login/');
  const main=page.locator('main');
  await expect(main).toContainText('^22.13.0 || >=23.5.0');
  await expect(main).toContainText('Installing npm on Ubuntu does not upgrade');
  await expect(main).toContainText('airs-harness@mcp');
  await expect(main).toContainText('npm install -g airs-harness@0.1.0-alpha.22.mcp.3 --registry=https://npm.example.com');
  await expect(main).toContainText('is published and ready for local testing');
  await expect(main).toContainText('remain separate attended checks');
  await expect(main).not.toContainText('publication and native acceptance of that exact version are pending');
  await expect(main).toContainText('0.1.0-alpha.22.onboarding.4');
  await expect(main).toContainText('does not include these dashboards');
  await expect(main).toContainText('does not create a gateway workspace or require matching names');
  await expect(main).toContainText('a different environment name alone does not isolate that record');
  await expect(main).toContainText('default saved config');
  await expect(main).toContainText('completions.write');
  await expect(main).toContainText('login --with-api-key');
  await expect(main).toContainText('does not grant ServiceNow tool access');
  await expect(main).toContainText('Refresh diagnostics');
  await expect(main).toContainText('does not send an inference request');
  await expect(main).toContainText('Send connectivity check');
  await expect(main).toContainText('can consume quota');
  await expect(main).toContainText('Workspace-key replacement remains a shell operation');
  await expect(main).toContainText('does not delete a gateway workspace or revoke a key');
  await expect(main).toContainText('was not performed by the documentation update');
});


test('release evidence separates published fixture acceptance from deferred live checks',async({page})=>{
  await page.goto('learn/evidence/');
  const main=page.locator('main');
  await expect(main).toContainText('0.1.0-alpha.22.mcp.3 is published');
  await expect(main).toContainText('Fresh anonymous registry installations passed isolated acceptance on Linux x64, Linux ARM64 and Apple Silicon');
  await expect(main).toContainText('they do not establish live-account acceptance');
  await expect(main).toContainText('are deferred to attended testing');
  await expect(main).toContainText('no full workspace pass is claimed');
  await expect(main).not.toContainText('publication and three-platform installed acceptance remain pending');
});
