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
