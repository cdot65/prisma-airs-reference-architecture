import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import AuthorizationLab from '../components/AuthorizationLab';

const components = [
  ['01', 'Harness', 'Runs the conversation and the built-in Codex MCP client in one executable, with separate inference and MCP credentials in the native store.', 'harness'],
  ['02', 'Keycloak', 'Authenticates the person, then issues the inference token and, separately, the gateway’s upstream MCP token.', 'keycloak'],
  ['03', 'AI Gateway', 'Receives both inference and MCP traffic, applies policy, and manages the upstream connection and its OAuth.', 'gateway'],
  ['04', 'Cloud Identity Engine', 'Connects directory provisioning and federated authentication to consuming services.', 'cie'],
  ['05', 'mcp server 1', 'Authorizes eight utility tools and executes them locally on the server, without downstream API calls.', 'mcp'],
];

export default function Home() {
  return <Layout title="Follow one question through the system" description="A diagram-led course on Prisma AIRS Harness, Keycloak, AI Gateway, Cloud Identity Engine, and OAuth-protected MCP.">
    <main>
      <section className="labHero">
        <div className="container heroGrid">
          <div>
            <p className="eyebrow">A reference architecture you can explain</p>
            <h1>One question.<br/>Five components.<br/><span>Ask what crosses each boundary.</span></h1>
            <p className="heroLead">Follow an AI assistant from browser login to an authorized tool call, and see which service makes each decision along the way.</p>
            <div className="heroActions">
              <Link className="button button--primary button--lg" to="/learn/start-here">Start learning →</Link>
              <Link className="button button--outline button--lg heroSecondary" to="/learn/architecture">Explore the architecture</Link>
            </div>
            <p className="heroMeta">15 lessons · 18 Mermaid diagrams · 6 tabletop labs</p>
          </div>
          <aside className="questionCard" aria-label="The running example">
            <span className="cardLabel">The question we will trace</span>
            <blockquote>“Use mcp server 1 to multiply 12 by 7, then give me the server’s current UTC time.”</blockquote>
            <ol className="traceList">
              <li><span>Identify</span>Authenticate the person at Keycloak.</li>
              <li><span>Route</span>Send inference through the approved gateway.</li>
              <li><span>Authorize</span>Check the user’s utility scope, roles and subject binding.</li>
              <li><span>Explain</span>Ground the answer in the returned evidence.</li>
            </ol>
          </aside>
        </div>
      </section>
      <section className="container sectionSpace" aria-labelledby="components-title">
        <div className="sectionIntro"><p className="eyebrow">Required architecture</p><h2 id="components-title">Inference and MCP both go through AI Gateway.</h2><p>The harness sends inference to the gateway’s model listener and MCP to its proxy listener, with a separate credential for each. The gateway proxies the upstream server and holds that server’s OAuth tokens, so the harness never handles them. CAS and the organizational identity provider handle the gateway-facing user login. mcp server 1 computes each utility result on its own host without calling a management API. Package and token-lifecycle evidence is tracked separately in the evidence lesson.</p></div>
        <div className="componentGrid">{components.map(([number,title,body,slug]) =>
          <Link className="componentCard" to={`/learn/${slug}`} key={slug}><span className="componentNumber">{number}</span><h3>{title}</h3><p>{body}</p><span className="cardArrow" aria-hidden="true">↗</span></Link>
        )}</div>
      </section>
      <section className="practiceSection" aria-labelledby="practice-title"><div className="container practiceGrid">
        <div><p className="eyebrow">Try the permission model</p><h2 id="practice-title">A valid login is not the whole grant.</h2><p>Uncheck one condition and watch the decision change. mcp server 1 requires every one of these to agree before it validates arguments and computes. This local simulation uses fictional values and makes no request.</p><Link to="/learn/mcp">Read the full authorization contract →</Link></div>
        <AuthorizationLab/>
      </div></section>
      <section className="container sectionSpace readingGrid">
        <div><p className="eyebrow">Choose a route</p><h2>Follow the arrows.<br/>Then test your explanation.</h2></div>
        <div className="routeLinks">
          <Link to="/learn/login"><strong>Trace the complete login</strong><span>Discovery, PKCE, callback, and two token bundles →</span></Link>
          <Link to="/learn/walkthrough"><strong>Follow one question end to end</strong><span>Model selection, local utility results, and a grounded answer →</span></Link>
          <Link to="/learn/labs"><strong>Practice with answer keys</strong><span>Audience errors, identity joins, refresh races, and revocation →</span></Link>
        </div>
      </section>
      <section className="container evidenceStrip"><strong>Know what the evidence supports.</strong><p>The course distinguishes source implementation, observed deployment, and acceptance of the exact installed release.</p><Link to="/learn/evidence">Read the status and sources →</Link></section>
    </main>
  </Layout>;
}
