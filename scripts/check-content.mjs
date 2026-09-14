import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const manifest=JSON.parse(await readFile('content-manifest.json','utf8'));
const provenance=JSON.parse(await readFile('content-provenance.json','utf8'));
const seen=new Set(); let diagrams=0;
const privatePatterns=[
  /\[\[/,
  /\/home\/cdot|\/Users\/cdot|\.cdot\.io|calvin@cdot\.io/,
  /\.svc\.cluster\.local|192\.168\.\d+\.\d+/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:ghp_|github_pat_)[A-Za-z0-9_]{12,}/,
  /\beyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/,
];
for(const note of manifest){
  if(seen.has(note.slug)) throw new Error(`Duplicate slug: ${note.slug}`);
  seen.add(note.slug);
  const text=await readFile(`docs/${note.slug}.md`,'utf8');
  if(privatePatterns.some(pattern=>pattern.test(text))) throw new Error(`Publication boundary failed: ${note.slug}`);
  if(/!\[[^\]]*\]\(|<img\b|<Image\b/.test(text)) throw new Error(`Unreviewed image input in lesson: ${note.slug}`);
  const evidence=provenance.find(item=>item.slug===note.slug&&item.noteId===note.id);
  if(evidence?.publishedSha256!==createHash('sha256').update(text).digest('hex')) throw new Error(`Snapshot changed; re-export the reviewed vault lesson: ${note.slug}`);
  const blocks=[...text.matchAll(/^```mermaid\n([\s\S]*?)^```/gm)]; diagrams+=blocks.length;
  if(blocks.some(([,body])=>!body.trim())) throw new Error(`Empty diagram: ${note.slug}`);
  if((text.match(/^```/gm)||[]).length%2) throw new Error(`Unbalanced code fences: ${note.slug}`);
}
const files=(await readdir('docs')).filter(name=>name.endsWith('.md'));
if(files.length!==manifest.length) throw new Error('Unexpected or missing published lesson');
console.log(`Checked ${manifest.length} lessons, ${diagrams} Mermaid blocks, provenance, and publication boundaries.`);
