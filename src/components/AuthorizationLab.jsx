import React, {useState} from 'react';

const conditions = [
  ['token', 'Valid token for this resource', 'The signature, issuer, audience, client, and time checks must all pass.'],
  ['invoke', 'Resource invoke role', 'The person needs permission to invoke this MCP resource.'],
  ['scope', 'Issued utilities.use scope', 'The access token must include the utilities.use permission.'],
  ['role', 'Matching utilities.use resource role', 'A requested scope alone does not grant access.'],
  ['binding', 'Subject policy permits utilities.use', 'The server must explicitly bind this person to the utility grant.'],
];

export default function AuthorizationLab() {
  const [state,setState] = useState(Object.fromEntries(conditions.map(([key])=>[key,true])));
  const failure = conditions.find(([key])=>!state[key]);
  return <div className="authorizationLab">
    <fieldset><legend>Can Alex call calculate on mcp server 1?</legend>
      {conditions.map(([key,label])=><label className="condition" key={key}><input type="checkbox" checked={state[key]} onChange={event=>setState({...state,[key]:event.target.checked})}/><span>{label}</span></label>)}
    </fieldset>
    <div className={`decision ${failure ? 'decisionDeny' : 'decisionAllow'}`} role="status" aria-live="polite">
      <strong>{failure ? 'Denied' : 'Allowed'}</strong>
      <p>{failure ? failure[2] : 'All conditions agree. mcp server 1 may validate the arguments and calculate locally.'}</p>
    </div>
    <p className="simulationNote">Illustrative decision only. No login, token, or API request is made.</p>
  </div>;
}
