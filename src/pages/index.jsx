import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import AuthorizationLab from '../components/AuthorizationLab';

const components = [
  ['01', 'Harness', 'Runs the conversation and built-in Codex MCP client in one executable. Keeps separate credentials in the native store.', 'harness'],
  ['02', 'Keycloak', 'Authenticates the person. Issues separate tokens for inference and MCP.', 'keycloak'],
  ['03', 'AI Gateway', 'Receives both inference and MCP. Applies policy and manages upstream connections and OAuth.', 'gateway'],
  ['04', 'Cloud Identity Engine', 'Connects directory provisioning and federated authentication to consuming services.', 'cie'],
  ['05', 'Prisma AIRS MCP', 'Checks each read against the person’s scopes, roles, and resource bindings.', 'mcp'],
];

export default function Home() {
  return <Layout title="Follow one question through the system" description="A diagram-led course on Prisma AIRS Harness, Keycloak, AI Gateway, Cloud Identity Engine, and OAuth-protected MCP.">
    <main>
      <section className="labHero">
        <div className="container heroGrid">
          <div>
            <p className="eyebrow">A reference architecture you can explain</p>
            <h1>One question.<br/>Five components.<br/><span>Every boundary matters.</span></h1>
            <p className="heroLead">Follow an AI assistant from browser login to an authorized tool call. Learn where identity, inference policy, and resource permissions meet.</p>
            <div className="heroActions">
              <Link className="button button--primary button--lg" to="/learn/start-here">Start learning →</Link>
              <Link className="button button--outline button--lg heroSecondary" to="/learn/architecture">Explore the architecture</Link>
            </div>
            <p className="heroMeta">15 lessons · 18 Mermaid diagrams · 6 tabletop labs</p>
          </div>
          <aside className="questionCard" aria-label="The running example">
            <span className="cardLabel">The question we will trace</span>
            <blockquote>“Which gateway configuration can I use, and what security protections are attached to it?”</blockquote>
            <ol className="traceList">
              <li><span>Identify</span>Authenticate the person at Keycloak.</li>
              <li><span>Route</span>Send inference through the approved gateway.</li>
              <li><span>Authorize</span>Read only the resources bound to that person.</li>
              <li><span>Explain</span>Ground the answer in the returned evidence.</li>
            </ol>
          </aside>
        </div>
      </section>
      <section className="container sectionSpace" aria-labelledby="components-title">
        <div className="sectionIntro"><p className="eyebrow">Required architecture</p><h2 id="components-title">Inference and MCP both go through AI Gateway.</h2><p>The built-in Codex MCP client connects to the gateway MCP listener. The gateway proxies upstream servers and manages their OAuth. CAS and the organizational IdP support gateway-facing user login. Alpha.13 direct-MCP receipts are historical. The required gateway correction targets alpha.14.</p></div>
        <div className="componentGrid">{components.map(([number,title,body,slug]) =>
          <Link className="componentCard" to={`/learn/${slug}`} key={slug}><span className="componentNumber">{number}</span><h3>{title}</h3><p>{body}</p><span className="cardArrow" aria-hidden="true">↗</span></Link>
        )}</div>
      </section>
      <section className="practiceSection" aria-labelledby="practice-title"><div className="container practiceGrid">
        <div><p className="eyebrow">Try the permission model</p><h2 id="practice-title">A valid login is only the beginning.</h2><p>Change one condition and watch the decision. This local simulation illustrates the MCP server’s authorization intersection using fictional values.</p><Link to="/learn/mcp">Read the full authorization contract →</Link></div>
        <AuthorizationLab/>
      </div></section>
      <section className="container sectionSpace readingGrid">
        <div><p className="eyebrow">Choose a route</p><h2>Follow the arrows.<br/>Then test your explanation.</h2></div>
        <div className="routeLinks">
          <Link to="/learn/login"><strong>Trace the complete login</strong><span>Discovery, PKCE, callback, and two token bundles →</span></Link>
          <Link to="/learn/walkthrough"><strong>Follow one question end to end</strong><span>Model selection, authorized reads, and a grounded answer →</span></Link>
          <Link to="/learn/labs"><strong>Practice with answer keys</strong><span>Audience errors, identity joins, refresh races, and revocation →</span></Link>
        </div>
      </section>
      <section className="container evidenceStrip"><strong>Know what the evidence supports.</strong><p>The course distinguishes implemented behavior, dated acceptance, related deployments, and required alpha.14 work awaiting validation.</p><Link to="/learn/evidence">Read the status and sources →</Link></section>
    </main>
  </Layout>;
}
