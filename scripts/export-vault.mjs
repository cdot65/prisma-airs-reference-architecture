import {readFile,writeFile,mkdir,realpath} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const argument=process.argv[2];
if(!argument) throw new Error('Usage: npm run export:vault -- /absolute/path/to/vault');
const vault=await realpath(argument);
const manifest=JSON.parse(await readFile(path.join(root,'content-manifest.json'),'utf8'));
const links=new Map(manifest.map(n=>[path.basename(n.source,'.md'),`./${n.slug}.md`]));
const sha=text=>createHash('sha256').update(text).digest('hex');
const prepared=[];
for(const note of manifest){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(note.slug)) throw new Error('Invalid public slug');
  const filename=await realpath(path.resolve(vault,note.source));
  const relative=path.relative(vault,filename);
  if(relative.startsWith('..')||path.isAbsolute(relative)) throw new Error('Source escapes vault');
  const source=await readFile(filename,'utf8');
  const match=source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if(!match||!match[1].split(/\r?\n/).includes(`id: ${note.id}`)) throw new Error(`Source identity mismatch: ${note.slug}`);
  let body=match[2].replace(/^\s*# [^\n]+\n/,'').trim();
  body=body.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,(_,target,label)=>{
    const [name,anchor]=target.split('#');
    const href=links.get(path.basename(name));
    if(!href||anchor) throw new Error(`Unmapped or anchored vault link: ${target}`);
    return `[${label||name.replace(/^AIRS learning - /,'')}](${href})`;
  });
  if(/\[\[|<!--\s*vault:|\/home\/|\/Users\/|\.cdot\.io|\.svc\.cluster\.local/.test(body)) throw new Error(`Private or unconverted content: ${note.slug}`);
  const output=`---\nid: ${note.slug}\ntitle: ${JSON.stringify(note.title)}\nsidebar_label: ${JSON.stringify(note.title)}\n---\n\n${body}\n`;
  prepared.push({note,source,output});
}
// Validate every source before changing any publication file.
await mkdir(path.join(root,'docs'),{recursive:true});
const provenance=[];
for(const {note,source,output} of prepared){
  await writeFile(path.join(root,'docs',`${note.slug}.md`),output);
  provenance.push({slug:note.slug,noteId:note.id,sourceSha256:sha(source),publishedSha256:sha(output)});
}
await writeFile(path.join(root,'content-provenance.json'),JSON.stringify(provenance,null,2)+'\n');
console.log(`Exported ${prepared.length} explicitly selected lessons. No vault credentials or indexes are included.`);
