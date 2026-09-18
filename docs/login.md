---
id: login
title: "Login from browser to authorized tools"
sidebar_label: "Login from browser to authorized tools"
---

## SSO to ServiceNow: a complete first session

The outcome is concrete: you sign into the harness as yourself, connect the ServiceNow MCP integration in the same environment, and ask the agent to read an incident. Your company SSO identity is used throughout the human login steps. Inference and MCP still receive separate credentials, and the ServiceNow backend uses a server-side integration account.

**Command availability:** this walkthrough targets **airs-harness 0.1.0-alpha.22.onboarding.1**, invoked as `airs`, with **Prisma AIRS CLI 7.0.0** bundled as `airs cli`. The npm package keeps the name `airs-harness`. Existing environments, credentials and histories do not need to be recreated. Top-level `setup` and `status` are removed; use `env create` and `env status`.

**Published onboarding release:** version **0.1.0-alpha.22.onboarding.1** includes the branded welcome and is available from the organization's npm registry. Exact installed packages passed local HTTPS SSO, native credential storage, terminal, bundled CLI and upgrade checks on Linux x64, native Linux ARM64 and Apple Silicon. Fresh anonymous registry installs also passed on all three platforms. These fixture checks do not establish a production SSO login or ServiceNow call. Existing signed-in environments open directly without a mandatory welcome animation.

Use Node.js 22.14+ in the 22.x line, or Node.js 24+ with npm. The product CLI, skills and package dependencies are included; no Python installer or separate `airs-cli` installation is required.

```sh
npm install -g airs-harness@0.1.0-alpha.22.onboarding.1 --registry=https://npm.example.com
airs --version
airs cli --version
airs env create --help
```

The `latest`, `alpha` and `onboarding` tags select this release. Ordinary installs include the matching native package; `--include=optional` is unnecessary unless your npm configuration explicitly omits optional dependencies. Existing environments, credentials and histories are preserved.

If you previously selected the isolated review archive using `PATH` and `AIRS_HARNESS_HOME`, use a fresh terminal for the npm installation. Otherwise those exports continue selecting the separate review installation and its environments.

If an old standalone CLI owns `airs`, upgrade it to `@cdot65/prisma-airs-cli@7.0.1` before a normal global harness installation. That CLI uses `airs-cli`. Do not force npm to overwrite another package's command.

Run `type -a airs airs-cli airs-harness` if an executable or alias shadows the intended command. Refresh your shell's command cache after changing PATH. `airs --migration-check` reports executable ownership without modifying it.

Standalone CLI 7.0.1 is the stable default release; this harness release retains the tested CLI 7.0.0 bundle from alpha.22. The patch changes release metadata, not command behavior or tenant configuration. Their version outputs therefore differ by one patch.

The compatibility alias `airs-harness` remains for alpha.22 and this onboarding release and is scheduled for removal in alpha.23. Update scripts now: harness commands start with `airs`; product commands start with `airs cli` or standalone `airs-cli`. For example, old `airs runtime ...` becomes `airs cli runtime ...`.

### 1. Get the connection details and access

Ask your administrator for these public connection settings. The values below are examples, not a live tenant configuration.

| Setting | Example | Used for |
| --- | --- | --- |
| Inference API URL | `https://gateway.example.com/v1` | Model requests through AI Gateway |
| Company OIDC issuer | `https://sso.example.com/realms/company` | Your inference browser sign-in |
| Public native client ID | `harness-native` | The installed harness; no client secret |
| Inference audience | `airs-inference` | The resource expected in the inference token |
| ServiceNow gateway MCP URL | `https://gateway-mcp.example.com/mcp-service-now-dev/mcp` | Your gateway-mediated ServiceNow connection |

Your account needs inference access, membership in the gateway workspace that exposes ServiceNow, and a ServiceNow MCP subject binding with the appropriate incident permissions. Being able to sign into SSO does not grant those permissions automatically. The administrator provisions the gateway integration and its upstream OAuth client before you add it locally. The example integration targets a ServiceNow development instance.

Use a desktop browser and an available OS credential store. On macOS, sign in from the desktop session and allow Keychain access. On Linux, make sure the Secret Service/keyring session is available and unlocked. Passwords belong in the company browser page, never in a command or configuration file.

### 2. Start AIRS and create your environment

```sh
airs
```

On a fresh installation, the animated AIRS mark appears above **Connect an environment**. The actions are available immediately. Press **Enter**, keep `work` as the environment name, enter `https://gateway.example.com/v1`, then choose **Create environment and sign in**. AIRS validates the public fields before saving the environment. Cancelling before that confirmation creates nothing.

If `work` already exists, use `airs env use work`, then run `airs`. A signed-out environment shows its name and gateway above the sign-in choices. When several environments exist, **Choose another environment** changes the destination for this session; it does not change the saved default. Use `airs env use NAME` when you want a persistent switch. Credentials and conversation history remain with their environment.

You can still create an environment directly from a shell:

```sh
airs env create work --gateway-url https://gateway.example.com/v1
airs env use work
airs login
```

Supplying the gateway URL creates and selects the environment without opening sign-in. `airs login` opens the sign-in choices. If creation already succeeded, resume login in that environment; do not recreate it to repair a cancelled sign-in.

### 3. Sign into inference with company SSO

Choose **Sign in with company SSO**. Enter the company issuer, public client ID and gateway audience from the table. These are public connection settings, not a client secret. Later attempts offer **Continue with saved settings**.

Choose **Open browser on this machine** on your desktop. Over SSH, choose **Use device authorization** and follow the displayed verification link and code on a device with a browser. **Show the full browser URL** retains the manual browser flow; its callback must reach the machine running AIRS, so device authorization is usually easier over SSH.

Sign in as the intended company user in the browser, then return to AIRS. The screen shows progress through authorization, native credential storage and a minimal inference access check. The browser success page alone does not prove credential persistence. **You're ready to use AIRS** means the credential was saved and that inference check passed. Press **Enter** to enter the agent, then **Ctrl+D** to return to your shell before adding ServiceNow below.

The access check sends one small inference request and can consume gateway quota; it sends no local files or tools. A denied or unavailable gateway produces **Signed in · gateway access needs attention**, with separate options to retry the check, continue or exit. Fix access before proceeding with this walkthrough. Storage failures remain sign-in failures and offer recovery guidance; there is no plaintext fallback. Escape cancels an unfinished sign-in and preserves the environment.

To supply public settings explicitly, use the existing command form:

```sh
airs --environment work login \
  --issuer-url https://sso.example.com/realms/company \
  --oidc-client-id harness-native \
  --audience airs-inference
```

If login was cancelled, run `airs --environment work login` and choose company SSO again. To inspect the saved environment or retry an access check without another browser login:

```sh
airs env status work
airs --environment work doctor --verify-access
```

`env status` inspects local configuration; it does not prove fresh authentication or remote access. `doctor --verify-access` sends another inference probe. Neither result tests ServiceNow tools. Adding MCP will not repair an incorrect inference URL or missing inference entitlement.

### Terminal controls and quiet operation

Use arrow keys or Tab to move, Enter to select, or the displayed number shortcuts. Escape cancels. Public fields accept pasted text without submitting it automatically; workspace API keys use a separate hidden prompt. Long authorization links and recovery messages scroll with arrow keys or Page Up/Page Down.

Set `animations = false` under `[tui]` in the environment configuration, or launch with `airs -c tui.animations=false`, for a static mark. `NO_COLOR=1` removes the accent colors. Small terminals use a compact layout. Plain terminals retain text prompts, and explicit scripted commands retain their existing output and exit behavior.

### 4. Add ServiceNow to that same environment

Run `airs env show work` and locate its `state_directory`. In that directory's `config.toml`, set the following **top-level** key before any `[table]` headers, updating an existing value rather than adding a duplicate:

```toml
mcp_oauth_credentials_store = "keyring"
```

This requires native storage for MCP credentials as well. Then register the gateway connection:

```sh
airs --environment work mcp add service-now \
  --url https://gateway-mcp.example.com/mcp-service-now-dev/mcp \
  --scopes mcp:servers:read,mcp:tools:list,mcp:tools:call
```

`service-now` is the local connection name. The URL must be the gateway's ServiceNow connection URL, including the final `/mcp`. It is not the ServiceNow instance URL or the upstream MCP server URL. Adding a server in `work` does not add it to your other environments.

### 5. Complete MCP login with the same company identity

`mcp add` detects OAuth and normally opens the browser immediately. Follow the gateway's CAS/company sign-in flow and select the **same company account** used for inference. An existing SSO browser session may avoid another password prompt; consent or account selection can still appear. If the gateway requests upstream ServiceNow MCP consent, complete that gateway-managed flow with the same company identity too.

Wait for the CLI to report **Successfully logged in.** If adding the connection saved it but login was cancelled, failed or expired, resume without adding it again:

```sh
airs --environment work mcp login service-now
```

Do not run this again just because `mcp add` already completed login successfully. Do not paste the inference token into the MCP configuration, register the upstream confidential client on your workstation, or enter a ServiceNow integration password into the harness. The user authenticates to the gateway; the gateway handles upstream OAuth; the MCP service handles the ServiceNow backend credential. An existing browser session can simplify sign-in, but the two native logins must still use the intended account.

### 6. Verify a real, read-only ServiceNow call

```sh
airs --environment work mcp list
airs --environment work
```

Inside the harness, run `/mcp`. Confirm that `service-now` is connected with OAuth and inspect the tools available to your identity. A read-only grant exposes `list_incidents` and `get_incident`; an authorized incident-management grant also exposes `create_incident` and `update_incident`. A successful login does not imply all four permissions.

Start with a read-only request:

> Use the service-now MCP connection to list up to five active incidents. Show their numbers, short descriptions and priorities. Do not create or update any records.

Confirm that the transcript actually called `list_incidents` on `service-now` and returned a tool result. An empty authorized list is a valid result. A connection label, a tool inventory, or a model answer without a tool call is not end-to-end evidence. Writes are separate actions that change real ServiceNow records; this onboarding check does not require them.

### 7. Use the bundled Prisma AIRS product CLI and skills

The ServiceNow session above needs no product management credential. If you also manage Prisma AIRS products, configure a separate CLI tenant using credentials supplied for that tenant:

```sh
airs cli tenant create development
airs cli tenant switch development
airs cli --tenant development doctor
airs cli runtime --help
```

`tenant create` prompts for the tenant service group ID, OAuth client ID and a hidden client secret, and saves a private JSON configuration. It does not select the tenant until `tenant switch`. To register an existing JSON file without copying or changing it, use `airs cli tenant create development --config /secure/development.json` instead. Doctor reports which capabilities the configuration supports; it can perform remote probes and is not a guarantee that every product is licensed or authorized.

Harness environments and CLI tenants are independent. `airs env use work` selects the conversation, inference login and MCP connections. `airs cli tenant switch development` selects product credentials. Prefer `airs cli --tenant development ...` in scripts. Put `cli` immediately after `airs`; `airs --environment work cli ...` does not select a product tenant. Company SSO does not supply Prisma AIRS management API credentials, and the CLI does not read old dotenv credentials as a fallback.

In the harness, ask:

> Use the bundled prisma-airs-cli skill to inspect the development tenant's configuration and identify available read-only Prisma AIRS commands. Do not create, change or delete resources.

The skills invoke the private bundled executable, so a global CLI version cannot silently replace it. They cover runtime scanning, AI Gateway, red teaming, model security and related workflows. Check the proposed tenant and operation before authorizing writes. Standalone `airs-cli` and `airs cli` use the same tenant store, so switching the saved CLI tenant affects both entry points.

### Return, switch and recover

List environments with `airs env list`; switch the saved default with `airs env use work`. A bare `airs` then opens that environment. `--environment NAME` selects an environment for one command without changing the saved default. Each environment has its own history, inference identity binding and MCP configuration.

| Symptom | Next step |
| --- | --- |
| Inference login was cancelled | `airs --environment work login`; reuse the environment |
| Gateway MCP login needs renewal | `airs --environment work mcp login service-now`; then start a fresh conversation |
| Inference succeeds but ServiceNow is absent | Check `mcp list` in `work`, then the gateway URL and workspace integration grant |
| Browser callback says success but the terminal fails | Check native credential-store persistence; keep the terminal open through completion |
| Gateway returns 404 | Check the exact ServiceNow gateway URL and its final `/mcp` |
| Tools return an authorization error | Have an administrator check the gateway workspace grant and upstream incident roles/scopes/subject binding |

To retire the environment, sign out the credentials you intend to remove while it is still selected, then unregister it:

```sh
airs --environment work mcp logout service-now
airs --environment work logout
airs env remove work
```

`env remove` preserves local files and history and does not itself revoke credentials. If it was the default, select another environment before starting a new session. Recreating the same name creates a fresh namespace, not a reconnection to the preserved history.

The steps above define what to verify. They do not claim that this documentation edit performed a fresh human SSO login or a live ServiceNow tool call. See [Implementation status and public sources](./evidence.md) for the recorded deployment and release limits.

## Authenticate for the gateway destination

From Alex's chair, signing in looks like one event: a browser opens, Keycloak asks for a password once, and afterwards both the model and mcp server 1 respond. Underneath, there are separate grants, and this lesson is about seeing them separately, because when one of them expires or is denied, the other keeps working and the symptom only makes sense if you know which grant failed.

Both inference and MCP must target Prisma AIRS AI Gateway. The sequences below separate the native gateway login, which the harness performs, from the gateway-owned upstream login, which the gateway performs on Alex's behalf. An existing Keycloak browser session can make both feel like one sign-in. It does not make them one grant.

The inference leg is the simpler one, and it is already in place in the case study. A user signs in to Keycloak using the configured native-client flow and presents a gateway-authorized JWT. A workspace API key is a separate supported authentication mode for inference; it does not require converting the key into a Keycloak token. Nothing in the MCP work below changes the inference leg, so a working inference environment stays as it is while MCP is brought onto the gateway path.

## Native MCP login through the gateway

The native MCP login is the longer sequence because three parties take part in authenticating Alex: the gateway that will issue the credential, CAS that runs the organizational sign-in, and Keycloak that actually verifies the person. Read it top to bottom and notice that the client only ever talks to the gateway and the browser.

```mermaid
sequenceDiagram
    accTitle: Required gateway-facing native MCP login
    accDescr: The built-in client discovers OAuth at AI Gateway. Browser authentication goes through CAS and Keycloak. The gateway resolves CIE workspace membership, obtains consent and issues gateway-facing credentials for MCP requests.
    actor user as Alex
    participant client as Built-in harness MCP client
    participant gateway as AI Gateway MCP listener
    participant browser as System browser
    participant cas as CAS
    participant idp as Keycloak
    participant directory as CIE-backed workspace membership
    participant store as Native credential store
    user->>client: Connect the gateway MCP URL
    client->>gateway: Initialize without a gateway MCP credential
    gateway-->>client: OAuth challenge and protected-resource metadata
    client->>gateway: Discover authorization and token endpoints
    client->>browser: Open gateway authorization with state and PKCE
    browser->>gateway: Begin authorization
    gateway-->>browser: Continue through CAS
    browser->>cas: Start configured SSO flow
    cas-->>browser: Federate to organizational IdP
    browser->>idp: Authenticate as intended human
    idp-->>browser: Federation response
    browser->>cas: Complete identity-provider callback
    cas-->>browser: Continue gateway login
    browser->>gateway: Resume authenticated authorization
    gateway->>directory: Resolve user and workspace access
    directory-->>gateway: Provisioned identity and membership
    gateway-->>browser: Request consent for MCP access
    user->>browser: Approve requested access
    browser->>gateway: Submit consent
    gateway-->>browser: Authorization redirect
    browser->>client: Loopback callback with code and state
    client->>gateway: Exchange code using PKCE verifier
    gateway-->>client: Gateway-facing access and refresh credentials
    client->>store: Persist credentials bound to gateway endpoint
    client->>gateway: Initialize and list tools with gateway credential
```

The sequence starts with a failure on purpose. The client initializes without a credential, the gateway answers with an OAuth challenge and protected-resource metadata, and that metadata is how the client learns where to authorize and where to exchange the code. The browser then carries Alex through CAS to Keycloak and back. After the gateway has a verified identity, it resolves workspace membership from the CIE-backed directory, asks for consent, and only then redirects to the loopback callback with a code. The PKCE exchange turns that code into gateway-facing credentials, which the client stores bound to the gateway endpoint before using them to list tools.

CAS is the gateway-facing user-authentication method in SCM deployments. The diagram shows the shape of the flow; the actual callback, client registration, token issuer, audience and scopes must be verified from the gateway's discovery and deployed configuration rather than assumed from the picture. One inference to resist: Keycloak appeared during federation, but that does not establish that the resulting MCP token is the same JWT used for inference. It was issued by the gateway for the gateway. [OAuth in SCM](https://portkey.ai/docs/product/mcp-gateway/authentication/cas).

If an operator selects the gateway's External OAuth mode instead, the browser hop changes: the harness presents a Keycloak-issued token using the configured gateway authentication contract. The destination does not change. It still targets the gateway, and switching to a direct upstream URL is never the fallback for a failed gateway login, because the upstream would not accept the client's credential anyway.

## Upstream OAuth remains with the gateway

The first sequence got Alex to the gateway. It did not get anything to mcp server 1, which has its own authorization server and its own idea of who Alex is. That second leg belongs to the gateway.

```mermaid
sequenceDiagram
    accTitle: Separate gateway-managed upstream MCP authorization
    accDescr: The gateway discovers upstream OAuth and coordinates the user's consent. The upstream authorization server issues tokens to the gateway, which stores them and uses them for proxied MCP requests. The harness retains only its gateway-facing credentials.
    participant client as Harness
    participant gateway as AI Gateway
    participant browser as User browser
    participant upstream as mcp server 1
    participant auth as Upstream authorization server
    client->>gateway: Request access to provisioned MCP tools
    gateway->>upstream: Discover upstream authentication requirements
    upstream-->>gateway: Protected resource and authorization metadata
    gateway-->>browser: Upstream consent flow when required
    browser->>auth: Authenticate and approve upstream access
    auth-->>browser: Redirect with authorization code
    browser->>gateway: Gateway upstream OAuth callback
    gateway->>auth: Exchange code with configured client authentication
    auth-->>gateway: Upstream access and refresh tokens
    gateway->>gateway: Store tokens for this upstream and user
    gateway->>upstream: Proxied MCP request with upstream credential
    upstream-->>gateway: Authorized MCP response
    gateway-->>client: MCP response
```

Compare the two callbacks. In the first sequence the code came back to the harness on loopback. Here it comes back to the gateway, the gateway exchanges it using its own configured client authentication, and the resulting upstream access and refresh tokens are stored at the gateway for this upstream and this user. The harness never holds them; it holds only its gateway-facing credentials.

The exact consent trigger and order depend on the registered upstream integration, so expect variation between integrations. Gateway OAuth Auto and machine client credentials are distinct modes. A failure in the machine mode does not demonstrate that OAuth Auto is unavailable. The gateway manages upstream OAuth, and the harness must not acquire upstream tokens to bypass that step, since doing so would move a credential the architecture keeps server-side onto the workstation. [MCP authentication layers](https://portkey.ai/docs/product/mcp-gateway/authentication).

The earlier diagrams use mcp server 1, the utility example in this course. The ServiceNow walkthrough above uses the same gateway login boundaries with a different upstream service and a separate backend credential.

Continue with [End-to-end question walkthrough](./walkthrough.md) and [Implementation status and public sources](./evidence.md).
