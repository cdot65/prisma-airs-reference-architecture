import React,{useEffect,useRef,useState} from 'react';
import OriginalMermaid from '@theme-original/Mermaid';

export default function Mermaid(props){
  const figure=useRef(null);const dialog=useRef(null);
  const [ready,setReady]=useState(false);const [diagram,setDiagram]=useState(null);const [zoom,setZoom]=useState(1);
  useEffect(()=>{
    const element=figure.current;
    const update=()=>setReady(Boolean(element?.querySelector('.docusaurus-mermaid-container svg')));
    const observer=new MutationObserver(update);observer.observe(element,{childList:true,subtree:true});update();
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>()=>{if(diagram)URL.revokeObjectURL(diagram.url);},[diagram]);
  function expand(){
    const svg=figure.current.querySelector('.docusaurus-mermaid-container svg');if(!svg)return;
    const clone=svg.cloneNode(true);clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
    const width=Math.max(svg.viewBox.baseVal.width||1000,800);
    clone.style.maxWidth='none';clone.setAttribute('width',String(width));clone.setAttribute('height',String(svg.viewBox.baseVal.height||800));
    const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml'}));
    const title=svg.querySelector('title')?.textContent||'Architecture diagram';
    setDiagram({url,width,title});setZoom(1);dialog.current.showModal();
  }
  return <figure className="diagramFigure" ref={figure}>
    <OriginalMermaid {...props}/>
    <figcaption><button type="button" className="button button--secondary button--sm" onClick={expand} disabled={!ready}>Expand diagram</button><span>Zoom or save the SVG for closer reading.</span></figcaption>
    <dialog ref={dialog} className="diagramDialog" aria-label="Expanded diagram">
      <div className="diagramToolbar"><strong>{diagram?.title}</strong><div>
        <button type="button" onClick={()=>setZoom(value=>Math.max(.25,value-.25))} aria-label="Zoom out">−</button>
        <span aria-live="polite">{Math.round(zoom*100)}%</span>
        <button type="button" onClick={()=>setZoom(value=>Math.min(3,value+.25))} aria-label="Zoom in">+</button>
        {diagram&&<a href={diagram.url} download="airs-architecture-diagram.svg">Save SVG</a>}
        <button type="button" onClick={()=>dialog.current.close()}>Close</button>
      </div></div>
      <div className="diagramViewport">{diagram&&<img src={diagram.url} alt={diagram.title} style={{width:diagram.width*zoom,maxWidth:'none',height:'auto'}}/>}</div>
    </dialog>
  </figure>;
}
