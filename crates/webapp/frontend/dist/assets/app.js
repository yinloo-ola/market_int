(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const vs=!1,Ss=(t,e)=>t===e,Dn=Symbol("solid-proxy"),Es=typeof Proxy=="function",Is=Symbol("solid-track"),Yt={equals:Ss};let oi=di;const Pe=1,Xt=2,li={owned:null,cleanups:null,context:null,owner:null},_n={};var K=null;let bn=null,ks=null,G=null,Z=null,$e=null,cn=0;function Wt(t,e){const n=G,r=K,i=t.length===0,s=e===void 0?r:e,a=i?li:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>ie(()=>Ct(a)));K=a,G=null;try{return Ve(o,!0)}finally{G=n,K=r}}function N(t,e){e=e?Object.assign({},Yt,e):Yt;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),ui(n,i));return[ci.bind(n),r]}function $s(t,e,n){const r=un(t,e,!0,Pe);gt(r)}function A(t,e,n){const r=un(t,e,!1,Pe);gt(r)}function Je(t,e,n){oi=Os;const r=un(t,e,!1,Pe);r.user=!0,$e?$e.push(r):gt(r)}function Q(t,e,n){n=n?Object.assign({},Yt,n):Yt;const r=un(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,gt(r),ci.bind(r)}function Cs(t){return t&&typeof t=="object"&&"then"in t}function Ts(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=_n,l=!1,c="initialValue"in s,d=typeof r=="function"&&Q(r);const h=new Set,[f,p]=(s.storage||N)(s.initialValue),[_,C]=N(void 0),[b,y]=N(void 0,{equals:!1}),[S,T]=N(c?"ready":"unresolved");K&&Ce(()=>{for(const M of h.keys())M.decrement();h.clear(),a=null});function k(M,I,x,U){return a===M&&(a=null,U!==void 0&&(c=!0),(M===o||I===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(U,{value:I})),o=_n,P(I,x)),I}function P(M,I){Ve(()=>{I===void 0&&p(()=>M),T(I!==void 0?"errored":c?"ready":"unresolved"),C(I);for(const x of h.keys())x.decrement();h.clear()},!1)}function E(){const M=Ps,I=f(),x=_();if(x!==void 0&&!a)throw x;return G&&G.user,I}function O(M=!0){if(M!==!1&&l)return;l=!1;const I=d?d():r;if(I==null||I===!1){k(a,ie(f));return}let x;const U=o!==_n?o:ie(()=>{try{return i(I,{value:f(),refetching:M})}catch(V){x=V}});if(x!==void 0){k(a,void 0,jt(x),I);return}else if(!Cs(U))return k(a,U,void 0,I),U;return a=U,"v"in U?(U.s===1?k(a,U.v,void 0,I):k(a,void 0,jt(U.v),I),U):(l=!0,queueMicrotask(()=>l=!1),Ve(()=>{T(c?"refreshing":"pending"),y()},!1),U.then(V=>k(U,V,void 0,I),V=>k(U,void 0,jt(V),I)))}Object.defineProperties(E,{state:{get:()=>S()},error:{get:()=>_()},loading:{get(){const M=S();return M==="pending"||M==="refreshing"}},latest:{get(){if(!c)return E();const M=_();if(M&&!a)throw M;return f()}}});let R=K;return d?$s(()=>(R=K,O(!1))):O(!1),[E,{refetch:M=>As(R,()=>O(M)),mutate:p}]}function ie(t){if(G===null)return t();const e=G;G=null;try{return t()}finally{G=e}}function Et(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=ie(()=>e(a,i,s));return i=a,o}}function $t(t){Je(()=>ie(t))}function Ce(t){return K===null||(K.cleanups===null?K.cleanups=[t]:K.cleanups.push(t)),t}function As(t,e){const n=K,r=G;K=t,G=null;try{return Ve(e,!0)}catch(i){jn(i)}finally{K=n,G=r}}const[wf,vf]=N(!1);let Ps;function ci(){if(this.sources&&this.state)if(this.state===Pe)gt(this);else{const t=Z;Z=null,Ve(()=>Zt(this),!1),Z=t}if(G){const t=this.observers;if(!t||t[t.length-1]!==G){const e=t?t.length:0;G.sources?(G.sources.push(this),G.sourceSlots.push(e)):(G.sources=[this],G.sourceSlots=[e]),t?(t.push(G),this.observerSlots.push(G.sources.length-1)):(this.observers=[G],this.observerSlots=[G.sources.length-1])}}return this.value}function ui(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Ve(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=bn&&bn.running;a&&bn.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?Z.push(s):$e.push(s),s.observers&&hi(s)),a||(s.state=Pe)}if(Z.length>1e6)throw Z=[],new Error},!1)),e}function gt(t){if(!t.fn)return;Ct(t);const e=cn;Rs(t,t.value,e)}function Rs(t,e,n){let r;const i=K,s=G;G=K=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Pe,t.owned&&t.owned.forEach(Ct),t.owned=null),t.updatedAt=n+1,jn(a)}finally{G=s,K=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?ui(t,r):t.value=r,t.updatedAt=n)}function un(t,e,n,r=Pe,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:K,context:K?K.context:null,pure:n};return K===null||K!==li&&(K.owned?K.owned.push(s):K.owned=[s]),s}function Qt(t){if(t.state===0)return;if(t.state===Xt)return Zt(t);if(t.suspense&&ie(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<cn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Pe)gt(t);else if(t.state===Xt){const r=Z;Z=null,Ve(()=>Zt(t,e[0]),!1),Z=r}}function Ve(t,e){if(Z)return t();let n=!1;e||(Z=[]),$e?n=!0:$e=[],cn++;try{const r=t();return xs(n),r}catch(r){n||($e=null),Z=null,jn(r)}}function xs(t){if(Z&&(di(Z),Z=null),t)return;const e=$e;$e=null,e.length&&Ve(()=>oi(e),!1)}function di(t){for(let e=0;e<t.length;e++)Qt(t[e])}function Os(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:Qt(r)}for(e=0;e<n;e++)Qt(t[e])}function Zt(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Pe?r!==e&&(!r.updatedAt||r.updatedAt<cn)&&Qt(r):i===Xt&&Zt(r,e)}}}function hi(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=Xt,n.pure?Z.push(n):$e.push(n),n.observers&&hi(n))}}function Ct(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)Ct(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)Ct(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function jt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function jn(t,e=K){throw jt(t)}const Ds=Symbol("fallback");function fr(t){for(let e=0;e<t.length;e++)t[e]()}function Ns(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Ce(()=>fr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[Is],ie(()=>{let p,_,C,b,y,S,T,k,P;if(c===0)a!==0&&(fr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Ds],i[0]=Wt(E=>(s[0]=E,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=Wt(f);a=c}else{for(C=new Array(c),b=new Array(c),o&&(y=new Array(c)),S=0,T=Math.min(a,c);S<T&&r[S]===l[S];S++);for(T=a-1,k=c-1;T>=S&&k>=S&&r[T]===l[k];T--,k--)C[k]=i[T],b[k]=s[T],o&&(y[k]=o[T]);for(p=new Map,_=new Array(k+1),h=k;h>=S;h--)P=l[h],d=p.get(P),_[h]=d===void 0?-1:d,p.set(P,h);for(d=S;d<=T;d++)P=r[d],h=p.get(P),h!==void 0&&h!==-1?(C[h]=i[d],b[h]=s[d],o&&(y[h]=o[d]),h=_[h],p.set(P,h)):s[d]();for(h=S;h<c;h++)h in C?(i[h]=C[h],s[h]=b[h],o&&(o[h]=y[h],o[h](h))):i[h]=Wt(f);i=i.slice(0,a=c),r=l.slice(0)}return i});function f(p){if(s[h]=p,o){const[_,C]=N(h);return o[h]=C,e(l[h],_)}return e(l[h])}}}function g(t,e){return ie(()=>t(e||{}))}function Bt(){return!0}const gr={get(t,e,n){return e===Dn?n:t.get(e)},has(t,e){return e===Dn?!0:t.has(e)},set:Bt,deleteProperty:Bt,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:Bt,deleteProperty:Bt}},ownKeys(t){return t.keys()}};function Ls(t,...e){const n=e.length;if(Es&&Dn in t){const i=n>1?e.flat():e[0],s=new Set,a=e.map(o=>{const l=o.filter(c=>!s.has(c)&&(s.add(c),!0));return new Proxy({get(c){return l.includes(c)?t[c]:void 0},has(c){return l.includes(c)&&c in t},keys(){return l.filter(c=>c in t)}},gr)});return a.push(new Proxy({get(o){return i.includes(o)?void 0:t[o]},has(o){return i.includes(o)?!1:o in t},keys(){return Object.keys(t).filter(o=>!i.includes(o))}},gr)),a}const r=[];for(let i=0;i<=n;i++)r[i]={};for(const i of Object.getOwnPropertyNames(t)){let s=n;for(let l=0;l<e.length;l++)if(e[l].includes(i)){s=l;break}const a=Object.getOwnPropertyDescriptor(t,i);!a.get&&!a.set&&a.enumerable&&a.writable&&a.configurable?r[s][i]=a.value:Object.defineProperty(r[s],i,a)}return r}const Ms=t=>`Stale read from <${t}>.`;function re(t){const e="fallback"in t&&{fallback:()=>t.fallback};return Q(Ns(()=>t.each,t.children,e||void 0))}function $(t){const e=t.keyed,n=Q(()=>t.when,void 0,void 0),r=e?n:Q(n,void 0,{equals:(i,s)=>!i==!s});return Q(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?ie(()=>s(e?i:()=>{if(!ie(r))throw Ms("Show");return n()})):s}return t.fallback},void 0,void 0)}const Us=["allowfullscreen","async","alpha","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","hidden","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","adauctionheaders","browsingtopics","credentialless","defaultchecked","defaultmuted","defaultselected","defer","disablepictureinpicture","disableremoteplayback","preservespitch","shadowrootclonable","shadowrootcustomelementregistry","shadowrootdelegatesfocus","shadowrootserializable","sharedstoragewritable"],Fs=new Set(["className","value","readOnly","noValidate","formNoValidate","isMap","noModule","playsInline","adAuctionHeaders","allowFullscreen","browsingTopics","defaultChecked","defaultMuted","defaultSelected","disablePictureInPicture","disableRemotePlayback","preservesPitch","shadowRootClonable","shadowRootCustomElementRegistry","shadowRootDelegatesFocus","shadowRootSerializable","sharedStorageWritable",...Us]),Bs=new Set(["innerHTML","textContent","innerText","children"]),Vs=Object.assign(Object.create(null),{className:"class",htmlFor:"for"}),Hs=Object.assign(Object.create(null),{class:"className",novalidate:{$:"noValidate",FORM:1},formnovalidate:{$:"formNoValidate",BUTTON:1,INPUT:1},ismap:{$:"isMap",IMG:1},nomodule:{$:"noModule",SCRIPT:1},playsinline:{$:"playsInline",VIDEO:1},readonly:{$:"readOnly",INPUT:1,TEXTAREA:1},adauctionheaders:{$:"adAuctionHeaders",IFRAME:1},allowfullscreen:{$:"allowFullscreen",IFRAME:1},browsingtopics:{$:"browsingTopics",IMG:1},defaultchecked:{$:"defaultChecked",INPUT:1},defaultmuted:{$:"defaultMuted",AUDIO:1,VIDEO:1},defaultselected:{$:"defaultSelected",OPTION:1},disablepictureinpicture:{$:"disablePictureInPicture",VIDEO:1},disableremoteplayback:{$:"disableRemotePlayback",AUDIO:1,VIDEO:1},preservespitch:{$:"preservesPitch",AUDIO:1,VIDEO:1},shadowrootclonable:{$:"shadowRootClonable",TEMPLATE:1},shadowrootdelegatesfocus:{$:"shadowRootDelegatesFocus",TEMPLATE:1},shadowrootserializable:{$:"shadowRootSerializable",TEMPLATE:1},sharedstoragewritable:{$:"sharedStorageWritable",IFRAME:1,IMG:1}});function Ws(t,e){const n=Hs[t];return typeof n=="object"?n[e]?n.$:void 0:n}const js=new Set(["beforeinput","click","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"]),zs=new Set(["altGlyph","altGlyphDef","altGlyphItem","animate","animateColor","animateMotion","animateTransform","circle","clipPath","color-profile","cursor","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","font","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignObject","g","glyph","glyphRef","hkern","image","line","linearGradient","marker","mask","metadata","missing-glyph","mpath","path","pattern","polygon","polyline","radialGradient","rect","set","stop","svg","switch","symbol","text","textPath","tref","tspan","use","view","vkern"]),Gs={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace"},H=t=>Q(()=>t());function Ks(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,f=1,p;for(;++h<i&&h<s&&!((p=c.get(e[h]))==null||p!==d+f);)f++;if(f>d-o){const _=e[a];for(;o<d;)t.insertBefore(n[o++],_)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const pr="_$DX_DELEGATE";function qs(t,e,n,r={}){let i;return Wt(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function m(t,e,n,r){let i;const s=()=>{const o=r?document.createElementNS("http://www.w3.org/1998/Math/MathML","template"):document.createElement("template");return o.innerHTML=t,n?o.content.firstChild.firstChild:r?o.firstChild:o.content.firstChild},a=e?()=>ie(()=>document.importNode(i||(i=s()),!0)):()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function de(t,e=window.document){const n=e[pr]||(e[pr]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,na))}}function W(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function Js(t,e,n,r){r==null?t.removeAttributeNS(e,n):t.setAttributeNS(e,n,r)}function Ys(t,e,n){n?t.setAttribute(e,""):t.removeAttribute(e)}function ee(t,e){e==null?t.removeAttribute("class"):t.className=e}function ne(t,e,n,r){if(r)Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n;else if(Array.isArray(n)){const i=n[0];t.addEventListener(e,n[0]=s=>i.call(t,n[1],s))}else t.addEventListener(e,n,typeof n!="function"&&n)}function Xs(t,e,n={}){const r=Object.keys(e||{}),i=Object.keys(n);let s,a;for(s=0,a=i.length;s<a;s++){const o=i[s];!o||o==="undefined"||e[o]||(mr(t,o,!1),delete n[o])}for(s=0,a=r.length;s<a;s++){const o=r[s],l=!!e[o];!o||o==="undefined"||n[o]===l||!l||(mr(t,o,!0),n[o]=l)}return n}function Qs(t,e,n){if(!e)return n?W(t,"style"):e;const r=t.style;if(typeof e=="string")return r.cssText=e;typeof n=="string"&&(r.cssText=n=void 0),n||(n={}),e||(e={});let i,s;for(s in n)e[s]==null&&r.removeProperty(s),delete n[s];for(s in e)i=e[s],i!==n[s]&&(r.setProperty(s,i),n[s]=i);return n}function Ye(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function Zs(t,e={},n,r){const i={};return A(()=>i.children=Tt(t,e.children,i.children)),A(()=>typeof e.ref=="function"&&fi(e.ref,t)),A(()=>ea(t,e,n,!0,i,!0)),i}function fi(t,e,n){return ie(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return Tt(t,e,r,n);A(i=>Tt(t,e(),i,n),r)}function ea(t,e,n,r,i={},s=!1){e||(e={});for(const a in i)if(!(a in e)){if(a==="children")continue;i[a]=_r(t,a,null,i[a],n,s,e)}for(const a in e){if(a==="children")continue;const o=e[a];i[a]=_r(t,a,o,i[a],n,s,e)}}function ta(t){return t.toLowerCase().replace(/-([a-z])/g,(e,n)=>n.toUpperCase())}function mr(t,e,n){const r=e.trim().split(/\s+/);for(let i=0,s=r.length;i<s;i++)t.classList.toggle(r[i],n)}function _r(t,e,n,r,i,s,a){let o,l,c,d,h;if(e==="style")return Qs(t,n,r);if(e==="classList")return Xs(t,n,r);if(n===r)return r;if(e==="ref")s||n(t);else if(e.slice(0,3)==="on:"){const f=e.slice(3);r&&t.removeEventListener(f,r,typeof r!="function"&&r),n&&t.addEventListener(f,n,typeof n!="function"&&n)}else if(e.slice(0,10)==="oncapture:"){const f=e.slice(10);r&&t.removeEventListener(f,r,!0),n&&t.addEventListener(f,n,!0)}else if(e.slice(0,2)==="on"){const f=e.slice(2).toLowerCase(),p=js.has(f);if(!p&&r){const _=Array.isArray(r)?r[0]:r;t.removeEventListener(f,_)}(p||n)&&(ne(t,f,n,p),p&&de([f]))}else if(e.slice(0,5)==="attr:")W(t,e.slice(5),n);else if(e.slice(0,5)==="bool:")Ys(t,e.slice(5),n);else if((h=e.slice(0,5)==="prop:")||(c=Bs.has(e))||!i&&((d=Ws(e,t.tagName))||(l=Fs.has(e)))||(o=t.nodeName.includes("-")||"is"in a))h&&(e=e.slice(5),l=!0),e==="class"||e==="className"?ee(t,n):o&&!l&&!c?t[ta(e)]=n:(e==="value"||e==="defaultValue")&&(t.nodeName==="INPUT"||t.nodeName==="TEXTAREA")?t[d||e]=n??"":t[d||e]=n;else{const f=i&&e.indexOf(":")>-1&&Gs[e.split(":")[0]];f?Js(t,f,e,n):W(t,Vs[e]||e,n)}return n}function na(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function Tt(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=rt(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=rt(t,n,r);else{if(s==="function")return A(()=>{let o=e();for(;typeof o=="function";)o=o();n=Tt(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Nn(o,e,n,i))return A(()=>n=Tt(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=rt(t,n,r),a)return n}else l?n.length===0?br(t,o,r):Ks(t,n,o):(n&&rt(t),br(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=rt(t,n,r,e);rt(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Nn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Nn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=Nn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function br(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function rt(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}const ra="http://www.w3.org/2000/svg";function ia(t,e=!1,n=void 0){return e?document.createElementNS(ra,t):document.createElement(t,{is:n})}function sa(t,e){const n=Q(t);return Q(()=>{const r=n();switch(typeof r){case"function":return ie(()=>r(e));case"string":const i=zs.has(r),s=ia(r,i,ie(()=>e.is));return Zs(s,e,i),s}})}function aa(t){const[,e]=Ls(t,["component"]);return sa(()=>t.component,e)}let zt=null;function oa(t){zt=t}async function tt(t,e={}){if(!zt)return fetch(t,e);const n=new Headers(e.headers??{}),r=await zt(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await zt(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function gi(){const t=await tt("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function la(){return tt("/api/me")}async function ca(){const t=await tt("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function ua(t){const e=await tt("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function da(t){const e=await tt("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function ha(){return await tt("/api/run",{method:"POST"})}async function fa(){return tt("/api/progress")}const ga=()=>{};var yr={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pi=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},pa=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},mi={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let f=(o&15)<<2|c>>6,p=c&63;l||(p=64,a||(f=64)),r.push(n[d],n[h],n[f],n[p])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(pi(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):pa(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||c==null||h==null)throw new ma;const f=s<<2|o>>4;if(r.push(f),c!==64){const p=o<<4&240|c>>2;if(r.push(p),h!==64){const _=c<<6&192|h;r.push(_)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class ma extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const _a=function(t){const e=pi(t);return mi.encodeByteArray(e,!0)},_i=function(t){return _a(t).replace(/\./g,"")},bi=function(t){try{return mi.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ba(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ya=()=>ba().__FIREBASE_DEFAULTS__,wa=()=>{if(typeof process>"u"||typeof yr>"u")return;const t=yr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},va=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&bi(t[1]);return e&&JSON.parse(e)},zn=()=>{try{return ga()||ya()||wa()||va()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Sa=t=>{var e,n;return(n=(e=zn())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},yi=()=>{var t;return(t=zn())==null?void 0:t.config},wi=t=>{var e;return(e=zn())==null?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vi{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function te(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ea(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(te())}function Ia(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ka(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function $a(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ca(){const t=te();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Ta(){try{return typeof indexedDB=="object"}catch{return!1}}function Aa(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pa="FirebaseError";class He extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Pa,Object.setPrototypeOf(this,He.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ot.prototype.create)}}class Ot{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Ra(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new He(i,o,r)}}function Ra(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function xa(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function ut(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(wr(s)&&wr(a)){if(!ut(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function wr(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function yt(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function wt(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Oa(t,e){const n=new Da(t,e);return n.subscribe.bind(n)}class Da{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Na(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=yn),i.error===void 0&&(i.error=yn),i.complete===void 0&&(i.complete=yn);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Na(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function yn(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Re(t){return t&&t._delegate?t._delegate:t}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gn(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function La(t){return(await fetch(t,{credentials:"include"})).ok}class dt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ke="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ma{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new vi;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Fa(e))try{this.getOrInitializeService({instanceIdentifier:Ke})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Ke){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ke){return this.instances.has(e)}getOptions(e=Ke){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Ua(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Ke){return this.component?this.component.multipleInstances?e:Ke:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ua(t){return t===Ke?void 0:t}function Fa(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ba{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Ma(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var j;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(j||(j={}));const Va={debug:j.DEBUG,verbose:j.VERBOSE,info:j.INFO,warn:j.WARN,error:j.ERROR,silent:j.SILENT},Ha=j.INFO,Wa={[j.DEBUG]:"log",[j.VERBOSE]:"log",[j.INFO]:"info",[j.WARN]:"warn",[j.ERROR]:"error"},ja=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Wa[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Si{constructor(e){this.name=e,this._logLevel=Ha,this._logHandler=ja,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in j))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Va[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,j.DEBUG,...e),this._logHandler(this,j.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,j.VERBOSE,...e),this._logHandler(this,j.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,j.INFO,...e),this._logHandler(this,j.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,j.WARN,...e),this._logHandler(this,j.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,j.ERROR,...e),this._logHandler(this,j.ERROR,...e)}}const za=(t,e)=>e.some(n=>t instanceof n);let vr,Sr;function Ga(){return vr||(vr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ka(){return Sr||(Sr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ei=new WeakMap,Ln=new WeakMap,Ii=new WeakMap,wn=new WeakMap,Kn=new WeakMap;function qa(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Be(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&Ei.set(n,t)}).catch(()=>{}),Kn.set(e,t),e}function Ja(t){if(Ln.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Ln.set(t,e)}let Mn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Ln.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Ii.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Be(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Ya(t){Mn=t(Mn)}function Xa(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(vn(this),e,...n);return Ii.set(r,e.sort?e.sort():[e]),Be(r)}:Ka().includes(t)?function(...e){return t.apply(vn(this),e),Be(Ei.get(this))}:function(...e){return Be(t.apply(vn(this),e))}}function Qa(t){return typeof t=="function"?Xa(t):(t instanceof IDBTransaction&&Ja(t),za(t,Ga())?new Proxy(t,Mn):t)}function Be(t){if(t instanceof IDBRequest)return qa(t);if(wn.has(t))return wn.get(t);const e=Qa(t);return e!==t&&(wn.set(t,e),Kn.set(e,t)),e}const vn=t=>Kn.get(t);function Za(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Be(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Be(a.result),l.oldVersion,l.newVersion,Be(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const eo=["get","getKey","getAll","getAllKeys","count"],to=["put","add","delete","clear"],Sn=new Map;function Er(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Sn.get(e))return Sn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=to.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||eo.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(o.shift())),(await Promise.all([c[n](...o),i&&l.done]))[0]};return Sn.set(e,s),s}Ya(t=>({...t,get:(e,n,r)=>Er(e,n)||t.get(e,n,r),has:(e,n)=>!!Er(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class no{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(ro(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function ro(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Un="@firebase/app",Ir="0.16.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Te=new Si("@firebase/app"),io="@firebase/app-compat",so="@firebase/analytics-compat",ao="@firebase/analytics",oo="@firebase/app-check-compat",lo="@firebase/app-check",co="@firebase/auth",uo="@firebase/auth-compat",ho="@firebase/database",fo="@firebase/data-connect",go="@firebase/database-compat",po="@firebase/functions",mo="@firebase/functions-compat",_o="@firebase/installations",bo="@firebase/installations-compat",yo="@firebase/messaging",wo="@firebase/messaging-compat",vo="@firebase/performance",So="@firebase/performance-compat",Eo="@firebase/remote-config",Io="@firebase/remote-config-compat",ko="@firebase/storage",$o="@firebase/storage-compat",Co="@firebase/firestore",To="@firebase/ai",Ao="@firebase/firestore-compat",Po="firebase",Ro="12.18.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fn="[DEFAULT]",xo={[Un]:"fire-core",[io]:"fire-core-compat",[ao]:"fire-analytics",[so]:"fire-analytics-compat",[lo]:"fire-app-check",[oo]:"fire-app-check-compat",[co]:"fire-auth",[uo]:"fire-auth-compat",[ho]:"fire-rtdb",[fo]:"fire-data-connect",[go]:"fire-rtdb-compat",[po]:"fire-fn",[mo]:"fire-fn-compat",[_o]:"fire-iid",[bo]:"fire-iid-compat",[yo]:"fire-fcm",[wo]:"fire-fcm-compat",[vo]:"fire-perf",[So]:"fire-perf-compat",[Eo]:"fire-rc",[Io]:"fire-rc-compat",[ko]:"fire-gcs",[$o]:"fire-gcs-compat",[Co]:"fire-fst",[Ao]:"fire-fst-compat",[To]:"fire-vertex","fire-js":"fire-js",[Po]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const en=new Map,Oo=new Map,Bn=new Map;function kr(t,e){try{t.container.addComponent(e)}catch(n){Te.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function At(t){const e=t.name;if(Bn.has(e))return Te.debug(`There were multiple attempts to register component ${e}.`),!1;Bn.set(e,t);for(const n of en.values())kr(n,t);for(const n of Oo.values())kr(n,t);return!0}function ki(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function ae(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Do={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Se=new Ot("app","Firebase",Do);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class No{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new dt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Se.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nt=Ro;function $i(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Fn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw Se.create("bad-app-name",{appName:String(i)});if(n||(n=yi()),!n)throw Se.create("no-options");const s=en.get(i);if(s)if(ut(n,s.options)){if(ut(r,s.config))return s;throw Se.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw Se.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new Ba(i);for(const l of Bn.values())a.addComponent(l);const o=new No(n,r,a);return en.set(i,o),o}function Lo(t=Fn){const e=en.get(t);if(!e&&t===Fn&&yi())return $i();if(!e)throw Se.create("no-app",{appName:t});return e}function at(t,e,n){let r=xo[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Te.warn(a.join(" "));return}At(new dt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mo="firebase-heartbeat-database",Uo=1,Pt="firebase-heartbeat-store";let En=null;function Ci(){return En||(En=Za(Mo,Uo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Pt)}catch(n){console.warn(n)}}}}).catch(t=>{throw Se.create("idb-open",{originalErrorMessage:t.message})})),En}async function Fo(t){try{const n=(await Ci()).transaction(Pt),r=await n.objectStore(Pt).get(Ti(t));return await n.done,r}catch(e){if(e instanceof He)Te.warn(e.message);else{const n=Se.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Te.warn(n.message)}}}async function $r(t,e){try{const r=(await Ci()).transaction(Pt,"readwrite");await r.objectStore(Pt).put(e,Ti(t)),await r.done}catch(n){if(n instanceof He)Te.warn(n.message);else{const r=Se.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Te.warn(r.message)}}}function Ti(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bo=1024,Vo=30;class Ho{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new jo(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Cr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Vo){const a=zo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Te.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Cr(),{heartbeatsToSend:r,unsentEntries:i}=Wo(this._heartbeatsCache.heartbeats),s=_i(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Te.warn(n),""}}}function Cr(){return new Date().toISOString().substring(0,10)}function Wo(t,e=Bo){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Tr(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Tr(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class jo{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ta()?Aa().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Fo(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return $r(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return $r(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Tr(t){return _i(JSON.stringify({version:2,heartbeats:t})).length}function zo(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Go(t){At(new dt("platform-logger",e=>new no(e),"PRIVATE")),At(new dt("heartbeat",e=>new Ho(e),"PRIVATE")),at(Un,Ir,t),at(Un,Ir,"esm2020"),at("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Go("");var Ko="firebase",qo="12.18.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */at(Ko,qo,"app");function Ai(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Jo=Ai,Pi=new Ot("auth","Firebase",Ai());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tn=new Si("@firebase/auth");function Ri(t,...e){tn.logLevel<=j.WARN&&tn.warn(`Auth (${Nt}): ${t}`,...e)}function Gt(t,...e){tn.logLevel<=j.ERROR&&tn.error(`Auth (${Nt}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ue(t,...e){throw Jn(t,...e)}function pe(t,...e){return Jn(t,...e)}function qn(t,e,n){const r={...Jo(),[e]:n};return new Ot("auth","Firebase",r).create(e,{appName:t.name})}function be(t){return qn(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function xi(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&ue(t,"argument-error"),qn(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Jn(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return Pi.create(t,...e)}function L(t,e,...n){if(!t)throw Jn(e,...n)}function Ee(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Gt(e),new Error(e)}function Ae(t,e){t||Ee(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vn(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function Yo(){return Ar()==="http:"||Ar()==="https:"}function Ar(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xo(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Yo()||ka()||"connection"in navigator)?navigator.onLine:!0}function Qo(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(e,n){this.shortDelay=e,this.longDelay=n,Ae(n>e,"Short delay should be less than long delay!"),this.isMobile=Ea()||$a()}get(){return Xo()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yn(t,e){Ae(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ee("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ee("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ee("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zo={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const el=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],tl=new Lt(3e4,6e4);function We(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function je(t,e,n,r,i={}){return Di(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Dt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:l,...s};return Ia()||(c.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&Gn(t.emulatorConfig.host)&&(c.credentials="include"),Oi.fetch()(await Ni(t,t.config.apiHost,n,o),c)})}async function Di(t,e,n){t._canInitEmulator=!1;const r={...Zo,...e};try{const i=new rl(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Vt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,c]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Vt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Vt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Vt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw qn(t,d,c);ue(t,d)}}catch(i){if(i instanceof He)throw i;ue(t,"network-request-failed",{message:String(i)})}}async function Mt(t,e,n,r,i={}){const s=await je(t,e,n,r,i);return"mfaPendingCredential"in s&&ue(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function Ni(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?Yn(t.config,i):`${t.config.apiScheme}://${i}`;return el.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function nl(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class rl{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(pe(this.auth,"network-request-failed")),tl.get())})}}function Vt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=pe(t,e,r);return i.customData._tokenResponse=n,i}function Pr(t){return t!==void 0&&t.enterprise!==void 0}class il{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return nl(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function sl(t,e){return je(t,"GET","/v2/recaptchaConfig",We(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function al(t,e){return je(t,"POST","/v1/accounts:delete",e)}async function nn(t,e){return je(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function It(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function ol(t,e=!1){const n=Re(t),r=await n.getIdToken(e),i=Xn(r);L(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:It(In(i.auth_time)),issuedAtTime:It(In(i.iat)),expirationTime:It(In(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function In(t){return Number(t)*1e3}function Xn(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Gt("JWT malformed, contained fewer than 3 sections"),null;try{const i=bi(n);return i?JSON.parse(i):(Gt("Failed to decode base64 JWT payload"),null)}catch(i){return Gt("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Rr(t){const e=Xn(t);return L(e,"internal-error"),L(typeof e.exp<"u","internal-error"),L(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rt(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof He&&ll(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function ll({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cl{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=It(this.lastLoginAt),this.creationTime=It(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rn(t){var h;const e=t.auth,n=await t.getIdToken(),r=await Rt(t,nn(e,{idToken:n}));L(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?Li(i.providerUserInfo):[],a=dl(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),c=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Hn(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function ul(t){const e=Re(t);await rn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function dl(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Li(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hl(t,e){const n=await Di(t,{},async()=>{const r=Dt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await Ni(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&Gn(t.emulatorConfig.host)&&(l.credentials="include"),Oi.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function fl(t,e){return je(t,"POST","/v2/accounts:revokeToken",We(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){L(e.idToken,"internal-error"),L(typeof e.idToken<"u","internal-error"),L(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Rr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){L(e.length!==0,"internal-error");const n=Rr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(L(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await hl(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new ot;return r&&(L(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(L(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(L(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ot,this.toJSON())}_performRefresh(){return Ee("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oe(t,e){L(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class ge{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new cl(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Hn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Rt(this,this.stsTokenManager.getToken(this.auth,e));return L(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return ol(this,e)}reload(){return ul(this)}_assign(e){this!==e&&(L(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new ge({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){L(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await rn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ae(this.auth.app))return Promise.reject(be(this.auth));const e=await this.getIdToken();return await Rt(this,al(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,c=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:f,isAnonymous:p,providerData:_,stsTokenManager:C}=n;L(h&&C,e,"internal-error");const b=ot.fromJSON(this.name,C);L(typeof h=="string",e,"internal-error"),Oe(r,e.name),Oe(i,e.name),L(typeof f=="boolean",e,"internal-error"),L(typeof p=="boolean",e,"internal-error"),Oe(s,e.name),Oe(a,e.name),Oe(o,e.name),Oe(l,e.name),Oe(c,e.name),Oe(d,e.name);const y=new ge({uid:h,auth:e,email:i,emailVerified:f,displayName:r,isAnonymous:p,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:b,createdAt:c,lastLoginAt:d});return _&&Array.isArray(_)&&(y.providerData=_.map(S=>({...S}))),l&&(y._redirectEventId=l),y}static async _fromIdTokenResponse(e,n,r=!1){const i=new ot;i.updateFromServerResponse(n);const s=new ge({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await rn(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];L(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Li(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new ot;o.updateFromIdToken(r);const l=new ge({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Hn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xr=new Map;function Ie(t){Ae(t instanceof Function,"Expected a class definition");let e=xr.get(t);return e?(Ae(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,xr.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mi{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Mi.type="NONE";const Or=Mi;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kt(t,e,n){return`firebase:${t}:${e}:${n}`}class lt{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Kt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Kt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await nn(this.auth,{idToken:e}).catch(()=>{});return n?ge._fromGetAccountInfoResponse(this.auth,n,e):null}return ge._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new lt(Ie(Or),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||Ie(Or);const a=Kt(r,e.config.apiKey,e.name);let o=null;for(const c of n)try{const d=await c._get(a);if(d){let h;if(typeof d=="string"){const f=await nn(e,{idToken:d}).catch(()=>{});if(!f)break;h=await ge._fromGetAccountInfoResponse(e,f,d)}else h=ge._fromJSON(e,d);c!==s&&(o=h),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new lt(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(a)}catch{}})),new lt(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dr(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Vi(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ui(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Wi(e))return"Blackberry";if(ji(e))return"Webos";if(Fi(e))return"Safari";if((e.includes("chrome/")||Bi(e))&&!e.includes("edge/"))return"Chrome";if(Hi(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Ui(t=te()){return/firefox\//i.test(t)}function Fi(t=te()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Bi(t=te()){return/crios\//i.test(t)}function Vi(t=te()){return/iemobile/i.test(t)}function Hi(t=te()){return/android/i.test(t)}function Wi(t=te()){return/blackberry/i.test(t)}function ji(t=te()){return/webos/i.test(t)}function Qn(t=te()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function gl(t=te()){var e;return Qn(t)&&!!((e=window.navigator)!=null&&e.standalone)}function pl(){return Ca()&&document.documentMode===10}function zi(t=te()){return Qn(t)||Hi(t)||ji(t)||Wi(t)||/windows phone/i.test(t)||Vi(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gi(t,e=[]){let n;switch(t){case"Browser":n=Dr(te());break;case"Worker":n=`${Dr(te())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Nt}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ml{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _l(t,e={}){return je(t,"GET","/v2/passwordPolicy",We(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bl=6;class yl{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??bl,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wl{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Nr(this),this.idTokenSubscription=new Nr(this),this.beforeStateQueue=new ml(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Pi,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Ie(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await lt.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await nn(this,{idToken:e}),r=await ge._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(ae(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return L(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await rn(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Qo()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ae(this.app))return Promise.reject(be(this));const n=e?Re(e):null;return n&&L(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&L(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ae(this.app)?Promise.reject(be(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ae(this.app)?Promise.reject(be(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ie(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await _l(this),n=new yl(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Ot("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await fl(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Ie(e)||this._popupRedirectResolver;L(n,this,"argument-error"),this.redirectPersistenceManager=await lt.create(this,[Ie(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(L(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return L(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Gi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(ae(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&Ri(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function xe(t){return Re(t)}class Nr{constructor(e){this.auth=e,this.observer=null,this.addObserver=Oa(n=>this.observer=n)}get next(){return L(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let dn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function vl(t){dn=t}function Ki(t){return dn.loadJS(t)}function Sl(){return dn.recaptchaEnterpriseScript}function El(){return dn.gapiScript}function Il(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class kl{constructor(){this.enterprise=new $l}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class $l{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cl="recaptcha-enterprise",qi="NO_RECAPTCHA",Lr="onFirebaseAuthREInstanceReady";class Ne{constructor(e){this.type=Cl,this.auth=xe(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{sl(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const c=new il(l);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,a(c.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;Pr(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(c=>{a(c)}).catch(()=>{a(qi)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new kl().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&Pr(window.grecaptcha)&&Ne.scriptInjectionDeferred)await Ne.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=Sl();l.length!==0&&(l+=o+`&onload=${Lr}`),Ne.scriptInjectionDeferred=new vi,window[Lr]=()=>{var c;(c=Ne.scriptInjectionDeferred)==null||c.resolve()},Ki(l).then(()=>{var c;return(c=Ne.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{i(o,s,a)}).catch(c=>{a(c)})}}).catch(o=>{a(o)})})}}Ne.scriptInjectionDeferred=null;async function Mr(t,e,n,r=!1,i=!1){const s=new Ne(t);let a;if(i)a=qi;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,c=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Wn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Mr(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Mr(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tl(t,e){const n=ki(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(ut(s,e??{}))return i;ue(i,"already-initialized")}return n.initialize({options:e})}function Al(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Ie);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Pl(t,e,n){const r=xe(t);L(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Ji(e),{host:a,port:o}=Rl(e),l=o===null?"":`:${o}`,c={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){L(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),L(ut(c,r.config.emulator)&&ut(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,Gn(a)?La(`${s}//${a}${l}`):xl()}function Ji(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Rl(t){const e=Ji(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Ur(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Ur(a)}}}function Ur(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function xl(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Ee("not implemented")}_getIdTokenResponse(e){return Ee("not implemented")}_linkToIdToken(e,n){return Ee("not implemented")}_getReauthenticationResolver(e){return Ee("not implemented")}}async function Ol(t,e){return je(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dl(t,e){return Mt(t,"POST","/v1/accounts:signInWithPassword",We(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nl(t,e){return Mt(t,"POST","/v1/accounts:signInWithEmailLink",We(t,e))}async function Ll(t,e){return Mt(t,"POST","/v1/accounts:signInWithEmailLink",We(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt extends Zn{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new xt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new xt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Wn(e,n,"signInWithPassword",Dl);case"emailLink":return Nl(e,{email:this._email,oobCode:this._password});default:ue(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Wn(e,r,"signUpPassword",Ol);case"emailLink":return Ll(e,{idToken:n,email:this._email,oobCode:this._password});default:ue(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ct(t,e){return Mt(t,"POST","/v1/accounts:signInWithIdp",We(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ml="http://localhost";class Qe extends Zn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Qe(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):ue("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new Qe(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return ct(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,ct(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,ct(e,n)}buildRequest(){const e={requestUri:Ml,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Dt(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ul(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Fl(t){const e=yt(wt(t)).link,n=e?yt(wt(e)).deep_link_id:null,r=yt(wt(t)).deep_link_id;return(r?yt(wt(r)).link:null)||r||n||e||t}class er{constructor(e){const n=yt(wt(e)),r=n.apiKey??null,i=n.oobCode??null,s=Ul(n.mode??null);L(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=Fl(e);try{return new er(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(){this.providerId=pt.PROVIDER_ID}static credential(e,n){return xt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=er.parseLink(n);return L(r,"argument-error"),xt._fromEmailAndCode(e,r.code,r.tenantId)}}pt.PROVIDER_ID="password";pt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";pt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ut extends hn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le extends Ut{constructor(){super("facebook.com")}static credential(e){return Qe._fromParams({providerId:Le.PROVIDER_ID,signInMethod:Le.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Le.credentialFromTaggedObject(e)}static credentialFromError(e){return Le.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Le.credential(e.oauthAccessToken)}catch{return null}}}Le.FACEBOOK_SIGN_IN_METHOD="facebook.com";Le.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve extends Ut{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Qe._fromParams({providerId:ve.PROVIDER_ID,signInMethod:ve.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return ve.credentialFromTaggedObject(e)}static credentialFromError(e){return ve.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return ve.credential(n,r)}catch{return null}}}ve.GOOGLE_SIGN_IN_METHOD="google.com";ve.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me extends Ut{constructor(){super("github.com")}static credential(e){return Qe._fromParams({providerId:Me.PROVIDER_ID,signInMethod:Me.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Me.credentialFromTaggedObject(e)}static credentialFromError(e){return Me.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Me.credential(e.oauthAccessToken)}catch{return null}}}Me.GITHUB_SIGN_IN_METHOD="github.com";Me.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue extends Ut{constructor(){super("twitter.com")}static credential(e,n){return Qe._fromParams({providerId:Ue.PROVIDER_ID,signInMethod:Ue.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Ue.credentialFromTaggedObject(e)}static credentialFromError(e){return Ue.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Ue.credential(n,r)}catch{return null}}}Ue.TWITTER_SIGN_IN_METHOD="twitter.com";Ue.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bl(t,e){return Mt(t,"POST","/v1/accounts:signUp",We(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await ge._fromIdTokenResponse(e,r,i),a=Fr(r);return new Ze({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Fr(r);return new Ze({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Fr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn extends He{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,sn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new sn(e,n,r,i)}}function Yi(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?sn._fromErrorAndOperation(t,s,e,r):s})}async function Vl(t,e,n=!1){const r=await Rt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Ze._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hl(t,e,n=!1){const{auth:r}=t;if(ae(r.app))return Promise.reject(be(r));const i="reauthenticate";try{const s=await Rt(t,Yi(r,i,e,t),n);L(s.idToken,r,"internal-error");const a=Xn(s.idToken);L(a,r,"internal-error");const{sub:o}=a;return L(t.uid===o,r,"user-mismatch"),Ze._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&ue(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xi(t,e,n=!1){if(ae(t.app))return Promise.reject(be(t));const r="signIn",i=await Yi(t,r,e),s=await Ze._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Wl(t,e){return Xi(xe(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qi(t){const e=xe(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function jl(t,e,n){if(ae(t.app))return Promise.reject(be(t));const r=xe(t),a=await Wn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Bl).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Qi(t),l}),o=await Ze._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function zl(t,e,n){return ae(t.app)?Promise.reject(be(t)):Wl(Re(t),pt.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Qi(t),r})}function Gl(t,e,n,r){return Re(t).onIdTokenChanged(e,n,r)}function Kl(t,e,n){return Re(t).beforeAuthStateChanged(e,n)}function ql(t,e,n,r){return Re(t).onAuthStateChanged(e,n,r)}function Jl(t){return Re(t).signOut()}const an="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(an,"1"),this.storage.removeItem(an),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yl=1e3,Xl=10;class es extends Zi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=zi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);pl()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Xl):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Yl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}es.type="LOCAL";const Ql=es;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ts extends Zi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}ts.type="SESSION";const ns=ts;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zl(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new fn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async c=>c(n.origin,s)),l=await Zl(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}fn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tr(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ec{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const c=tr("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const f=h;if(f.data.eventId===c)switch(f.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(f.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ye(){return window}function tc(t){ye().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rs(){return typeof ye().WorkerGlobalScope<"u"&&typeof ye().importScripts=="function"}async function nc(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function rc(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function ic(){return rs()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const is="firebaseLocalStorageDb",sc=1,on="firebaseLocalStorage",ss="fbase_key";class Ft{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function gn(t,e){return t.transaction([on],e?"readwrite":"readonly").objectStore(on)}function ac(){const t=indexedDB.deleteDatabase(is);return new Ft(t).toPromise()}function as(){const t=indexedDB.open(is,sc);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(on,{keyPath:ss})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(on)?e(r):(r.close(),await ac(),e(await as()))})})}async function Br(t,e,n){const r=gn(t,!0).put({[ss]:e,value:n});return new Ft(r).toPromise()}async function oc(t,e){const n=gn(t,!1).get(e),r=await new Ft(n).toPromise();return r===void 0?null:r.value}function Vr(t,e){const n=gn(t,!0).delete(e);return new Ft(n).toPromise()}const lc=800,cc=3;class os{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=as(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>cc)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return rs()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=fn._getInstance(ic()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await nc(),!this.activeServiceWorker)return;this.sender=new ec(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||rc()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Br(e,an,"1"),await Vr(e,an)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Br(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>oc(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Vr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=gn(i,!1).getAll();return new Ft(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||Ri(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),lc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}os.type="LOCAL";const uc=os;new Lt(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nr(t,e){return e?Ie(e):(L(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr extends Zn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ct(e,this._buildIdpRequest())}_linkToIdToken(e,n){return ct(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return ct(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function dc(t){return Xi(t.auth,new rr(t),t.bypassAuthState)}function hc(t){const{auth:e,user:n}=t;return L(n,e,"internal-error"),Hl(n,new rr(t),t.bypassAuthState)}async function fc(t){const{auth:e,user:n}=t;return L(n,e,"internal-error"),Vl(n,new rr(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ls{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return dc;case"linkViaPopup":case"linkViaRedirect":return fc;case"reauthViaPopup":case"reauthViaRedirect":return hc;default:ue(this.auth,"internal-error")}}resolve(e){Ae(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ae(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gc=new Lt(2e3,1e4);async function pc(t,e,n){if(ae(t.app))return Promise.reject(pe(t,"operation-not-supported-in-this-environment"));const r=xe(t);xi(t,e,hn);const i=nr(r,n);return new qe(r,"signInViaPopup",e,i).executeNotNull()}class qe extends ls{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,qe.currentPopupAction&&qe.currentPopupAction.cancel(),qe.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return L(e,this.auth,"internal-error"),e}async onExecution(){Ae(this.filter.length===1,"Popup operations only handle one event");const e=tr();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(pe(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(pe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,qe.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(pe(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,gc.get())};e()}}qe.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mc="pendingRedirect",qt=new Map;class _c extends ls{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=qt.get(this.auth._key());if(!e){try{const r=await bc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}qt.set(this.auth._key(),e)}return this.bypassAuthState||qt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function bc(t,e){const n=us(e),r=cs(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function yc(t,e){return cs(t)._set(us(e),"true")}function wc(t,e){qt.set(t._key(),e)}function cs(t){return Ie(t._redirectPersistence)}function us(t){return Kt(mc,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vc(t,e,n){return Sc(t,e,n)}async function Sc(t,e,n){if(ae(t.app))return Promise.reject(be(t));const r=xe(t);xi(t,e,hn),await r._initializationPromise;const i=nr(r,n);return await yc(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function Ec(t,e,n=!1){if(ae(t.app))return Promise.reject(be(t));const r=xe(t),i=nr(r,e),a=await new _c(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ic=600*1e3;class kc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!$c(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!ds(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(pe(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Ic&&this.cachedEventUids.clear(),this.cachedEventUids.has(Hr(e))}saveEventToCache(e){this.cachedEventUids.add(Hr(e)),this.lastProcessedEventTime=Date.now()}}function Hr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function ds({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function $c(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ds(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cc(t,e={}){return je(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Ac=/^https?/;async function Pc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Cc(t);for(const n of e)try{if(Rc(n))return}catch{}ue(t,"unauthorized-domain")}function Rc(t){const e=Vn(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!Ac.test(n))return!1;if(Tc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xc=new Lt(3e4,6e4);function Wr(){const t=ye().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Oc(t){return new Promise((e,n)=>{var i,s,a;function r(){Wr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Wr(),n(pe(t,"network-request-failed"))},timeout:xc.get()})}if((s=(i=ye().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=ye().gapi)!=null&&a.load)r();else{const o=Il("iframefcb");return ye()[o]=()=>{gapi.load?r():n(pe(t,"network-request-failed"))},Ki(`${El()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw Jt=null,e})}let Jt=null;function Dc(t){return Jt=Jt||Oc(t),Jt}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nc=new Lt(5e3,15e3),Lc="__/auth/iframe",Mc="emulator/auth/iframe",Uc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Fc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Bc(t){const e=t.config;L(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Yn(e,Mc):`https://${t.config.authDomain}/${Lc}`,r={apiKey:e.apiKey,appName:t.name,v:Nt},i=Fc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Dt(r).slice(1)}`}async function Vc(t){const e=await Dc(t),n=ye().gapi;return L(n,t,"internal-error"),e.open({where:document.body,url:Bc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Uc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=pe(t,"network-request-failed"),o=ye().setTimeout(()=>{s(a)},Nc.get());function l(){ye().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Wc=500,jc=600,zc="_blank",Gc="http://localhost";class jr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Kc(t,e,n,r=Wc,i=jc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...Hc,width:r.toString(),height:i.toString(),top:s,left:a},c=te().toLowerCase();n&&(o=Bi(c)?zc:n),Ui(c)&&(e=e||Gc,l.scrollbars="yes");const d=Object.entries(l).reduce((f,[p,_])=>`${f}${p}=${_},`,"");if(gl(c)&&o!=="_self")return qc(e||"",o),new jr(null);const h=window.open(e||"",o,d);L(h,t,"popup-blocked");try{h.focus()}catch{}return new jr(h)}function qc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jc="__/auth/handler",Yc="emulator/auth/handler",Xc=encodeURIComponent("fac");async function zr(t,e,n,r,i,s){L(t.config.authDomain,t,"auth-domain-config-required"),L(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Nt,eventId:i};if(e instanceof hn){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",xa(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Ut){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),c=l?`#${Xc}=${encodeURIComponent(l)}`:"";return`${Qc(t)}?${Dt(o).slice(1)}${c}`}function Qc({config:t}){return t.emulator?Yn(t,Yc):`https://${t.authDomain}/${Jc}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kn="webStorageSupport";class Zc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=ns,this._completeRedirectFn=Ec,this._overrideRedirectResult=wc}async _openPopup(e,n,r,i){var a;Ae((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await zr(e,n,r,Vn(),i);return Kc(e,s,tr())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await zr(e,n,r,Vn(),i);return tc(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Ae(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Vc(e),r=new kc(e);return n.register("authEvent",i=>(L(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(kn,{type:kn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[kn];s!==void 0&&n(!!s),ue(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Pc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return zi()||Fi()||Qn()}}const eu=Zc;var Gr="@firebase/auth",Kr="1.13.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tu{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){L(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nu(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function ru(t){At(new dt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;L(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Gi(t)},c=new wl(r,i,s,l);return Al(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),At(new dt("auth-internal",e=>{const n=xe(e.getProvider("auth").getImmediate());return(r=>new tu(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),at(Gr,Kr,nu(t)),at(Gr,Kr,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iu=300,su=wi("authIdTokenMaxAge")||iu;let qr=null;const au=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>su)return;const i=n==null?void 0:n.token;qr!==i&&(qr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function ou(t=Lo()){const e=ki(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Tl(t,{popupRedirectResolver:eu,persistence:[uc,Ql,ns]}),r=wi("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=au(s.toString());Kl(n,a,()=>a(n.currentUser)),Gl(n,o=>a(o))}}const i=Sa("auth");return i&&Pl(n,`http://${i}`),n}function lu(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}vl({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=pe("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",lu().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});ru("Browser");const cu={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},we=cu,ht=!!we.VITE_FIREBASE_APP_ID;let $n=null;function it(){if(!ht)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!$n){const t=$i({apiKey:we.VITE_FIREBASE_API_KEY,authDomain:we.VITE_FIREBASE_AUTH_DOMAIN,projectId:we.VITE_FIREBASE_PROJECT_ID,appId:we.VITE_FIREBASE_APP_ID,...we.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:we.VITE_FIREBASE_STORAGE_BUCKET},...we.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:we.VITE_FIREBASE_MESSAGING_SENDER_ID}});$n=ou(t)}return $n}function Jr(){return new ve}async function Yr(){if(!ht)return;const t=it();t.currentUser&&await Jl(t)}var uu=m(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),du=m('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),hu=m("<button type=button class=gate-toggle>"),fu=m("<div class=gate-or>── or ──"),gu=m("<button type=button class=btn>Continue with Google"),pu=m("<div class=gate-error role=alert>"),mu=m("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),_u=m("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),bu=m("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const yu={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Xr(t){const e=(t==null?void 0:t.code)??"";return yu[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function wu(t){return(()=>{var e=uu(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),ne(l,"click",t.onSignOut,!0),e})()}function vu(){const[t,e]=N("signin"),[n,r]=N(""),[i,s]=N(""),[a,o]=N(!1),[l,c]=N("");oa(async f=>{if(!ht)return null;const p=it().currentUser;return p?await p.getIdToken(f):null});async function d(f){if(f.preventDefault(),!a()){o(!0),c("");try{const p=it();t()==="create"?await jl(p,n(),i()):await zl(p,n(),i())}catch(p){c(Xr(p))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await pc(it(),Jr())}catch(f){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(f==null?void 0:f.code)){await vc(it(),Jr());return}c(Xr(f))}finally{o(!1)}}}return(()=>{var f=mu(),p=f.firstChild;return p.firstChild,u(p,g($,{when:ht,get fallback(){return[_u(),bu()]},get children(){return[(()=>{var _=du(),C=_.firstChild,b=C.firstChild,y=b.nextSibling,S=C.nextSibling,T=S.firstChild,k=T.nextSibling,P=S.nextSibling;return _.addEventListener("submit",d),y.$$input=E=>r(E.currentTarget.value),k.$$input=E=>s(E.currentTarget.value),u(P,(()=>{var E=H(()=>!!a());return()=>E()?"Working…":t()==="create"?"Create account":"Sign in"})()),A(E=>{var O=t()==="create"?"new-password":"current-password",R=a();return O!==E.e&&W(k,"autocomplete",E.e=O),R!==E.t&&(P.disabled=E.t=R),E},{e:void 0,t:void 0}),A(()=>y.value=n()),A(()=>k.value=i()),_})(),(()=>{var _=hu();return _.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(_,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),A(()=>_.disabled=a()),_})(),fu(),(()=>{var _=gu();return _.$$click=h,A(()=>_.disabled=a()),_})(),g($,{get when(){return l()},get children(){var _=pu();return u(_,l),_}})]}}),null),f})()}de(["click","input"]);var Su=m("<div class=gate-error role=alert>"),Eu=m("<p class=gate-note>No grant-file entries yet."),Iu=m("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),ku=m('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),$u=m("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function Cu(t){const[e,n]=N([]),[r,i]=N([]),[s,a]=N(""),[o,l]=N(!1),[c,d]=N(""),h=b=>{n((b==null?void 0:b.file_grants)??[]),i((b==null?void 0:b.static_emails)??[])};$t(async()=>{try{h(await ca())}catch{d("Could not load the grant list.")}});const p=b=>{b.key==="Escape"&&t.onClose()};$t(()=>{window.addEventListener("keydown",p),Ce(()=>window.removeEventListener("keydown",p));const b=document.querySelector(".access-add input");b==null||b.focus()});const _=async b=>{if(b.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await ua(s())),a("")}catch(y){d(y.message)}l(!1)}},C=async b=>{if(!o()){l(!0),d("");try{h(await da(b))}catch(y){d(y.message)}l(!1)}};return(()=>{var b=ku(),y=b.firstChild,S=y.firstChild,T=S.nextSibling,k=T.nextSibling,P=k.firstChild,E=P.nextSibling,O=k.nextSibling;return ne(b,"click",t.onClose,!0),y.$$click=R=>R.stopPropagation(),u(y,g($,{get when(){return c()},get children(){var R=Su();return u(R,c),R}}),k),u(y,g(re,{get each(){return e()},children:R=>(()=>{var M=$u(),I=M.firstChild,x=I.nextSibling;return u(I,R),x.$$click=()=>C(R),W(x,"title",`Remove ${R}`),W(x,"aria-label",`Remove ${R}`),A(()=>x.disabled=o()),M})()}),k),u(y,g($,{get when(){return e().length===0},get children(){return Eu()}}),k),k.addEventListener("submit",_),P.$$input=R=>a(R.currentTarget.value),u(E,()=>o()?"…":"Add"),u(y,g($,{get when(){return r().length>0},get children(){var R=Iu();return R.firstChild,u(R,()=>r().join(", "),null),R}}),O),ne(O,"click",t.onClose,!0),A(()=>E.disabled=o()),A(()=>P.value=s()),b})()}de(["click","input"]);const ke=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),kt=(t,e,n)=>Math.min(n,Math.max(e,t));function Tu(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:kt((n-t)/r,0,1)}function Au(t,e,n,r,i=ke){if(n<i.minRateOfReturn||t<=0)return null;const s=kt(t/2,0,1),a=kt(e,0,1),o=Math.min(n/i.idealReturn,1),l=kt((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function Pu(t,e=ke){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?kt(1+t.delta,0,1):Tu(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),Au(r,a,n,i,e)}function Ru(t,e=ke.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function xu(t){return t.weightSharpe===ke.weightSharpe&&t.weightSafety===ke.weightSafety&&t.weightReturn===ke.weightReturn&&t.minRateOfReturn===ke.minRateOfReturn}var Ou=m("<span class=hint>production defaults · drag to re-rank live"),Du=m("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),Nu=m('<span class="hint hint-custom">custom weights'),Lu=m("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function Mu(){const[t,e]=N({...ke});return{params:t,isCustom:()=>!xu(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...ke})}}const Uu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function Fu(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=Du(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,g($,{get when(){return!e()},get fallback(){return Nu()},get children(){return Ou()}}),null),u(s,g(re,{each:Uu,children:o=>(()=>{var l=Lu(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,f=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,g($,{get when(){return o.weight},get children(){return[" ","· ",H(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),f.$$input=p=>t.scoring.setParam(o.key,Number(p.currentTarget.value)),A(p=>{var _=o.max,C=o.step;return _!==p.e&&W(f,"max",p.e=_),C!==p.t&&W(f,"step",p.t=C),p},{e:void 0,t:void 0}),A(()=>f.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),A(()=>r.open=e()),r})()}de(["click","input"]);const pn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],vt=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],hs="webapp.columns.v1";function Bu(){try{const t=localStorage.getItem(hs);if(!t)return vt;const e=JSON.parse(t);if(!Array.isArray(e))return vt;const n=new Set(pn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:vt}catch{return vt}}function Vu(t){try{localStorage.setItem(hs,JSON.stringify(t))}catch{}}var Hu=m("<div class=pop-backdrop>"),Wu=m('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),ju=m("<span class=colpicker><button type=button class=tool-btn>columns ▾"),zu=m("<label class=pick-item><input type=checkbox>");function Gu(t){const[e,n]=N(!1);return(()=>{var r=ju(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,g($,{get when(){return e()},get children(){return[(()=>{var s=Hu();return s.$$click=()=>n(!1),s})(),(()=>{var s=Wu(),a=s.firstChild,o=a.nextSibling;return u(a,g(re,{each:pn,children:l=>(()=>{var c=zu(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),A(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),A(()=>W(i,"aria-expanded",e())),r})()}de(["click"]);var Ku=m('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),qu=m("<span class=pggap>…"),Ju=m("<button type=button class=pgbtn>");function Yu(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function Xu(t){const e=Q(()=>Yu(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Ku(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,g(re,{get each(){return e()},children:d=>d==="…"?qu():(()=>{var h=Ju();return h.$$click=()=>t.onGo(d),u(h,d),A(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,A(d=>{var h=t.page()<=1,f=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),f!==d.t&&(c.disabled=d.t=f),d},{e:void 0,t:void 0}),i})()}de(["click"]);var Qu=m("<span class=tip>");function mt(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=Qu();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?fi(i,r):e=r,u(r,()=>t.children),A(()=>W(r,"data-tip",t.text??"")),r})()}de(["focusin"]);const Xe="∅";function J(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function St(t){return Number(t??0).toLocaleString("en-US")}function ln(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function fs(t){return gs(t,{hour:"2-digit",minute:"2-digit"})}function Zu(t){return gs(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function gs(t,e){const n=ln(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const ps={text:Xe,isNull:!0},Cn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Qr(t,e){return!e||J(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function ed(t,e){return!e||J(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function td(t){if(!t||typeof t!="object"||J(t.report_date))return ps;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function ce(t,e){if(J(e))return ps;switch(t){case"fixed2":return Cn(e,2);case"fixed3":return Cn(e,3);case"ivrv":return Cn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return td(e);default:return{text:String(e),isNull:!1}}}const Zr=t=>Number(t*100).toFixed(0);function nd(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Zr(e.momentum_high),s=Zr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function _t(t,e){return nd(e)[t]??t}var ms=m("<span class=tip-target>"),rd=m("<div class=kv><span class=kv-label></span><span class=kv-value>"),id=m("<span class=tip-target>Strike position in band"),sd=m('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),ad=m("<div class=exp-block><h4>"),od=m("<div class=kv-value>Band unavailable (∅)"),ld=m("<div><span class=marker-tick></span><span class=marker-cap><br>"),cd=m("<div class=exp-block><h4>Premium economics"),ud=m("<b>"),dd=m('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),hd=m("<div class=muted-note>earnings-discounted safety applied"),fd=m("<div class=exp-block><h4>Score breakdown"),gd=m("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),pd=m('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),md=m("<span class=muted-note>all columns visible"),_d=m('<div class="exp-block exp-chips"><h4>Hidden columns'),bd=m("<span class=tip-target>: "),yd=m("<span>"),wd=m("<span class=tip-target>band safety is already discounted by the earnings rule."),vd=m("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),Sd=m("<div class=expansion><div class=exp-grid>");const Tn={sharpe:.2,safety:.4,return_part:.4};function An(t,e=2){return J(t)?Xe:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function _e(t,e,n){return(()=>{var r=rd(),i=r.firstChild,s=i.nextSibling;return u(i,g(mt,{get text(){return _t(t,e)},get children(){var a=ms();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function Ed(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=J(e.mid)?null:e.strike-e.mid,s=i!=null&&!J(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!J(a)&&l>a&&!J(e.strike),d=f=>{if(J(f))return null;const p=(f-a)/(l-a)*100;return Math.min(100,Math.max(0,p))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(f=>d(f.v)!=null):[];return(()=>{var f=ad(),p=f.firstChild;return u(p,g(mt,{get text(){return _t("band_range",t.thresholds)},get children(){return id()}})),u(f,g($,{when:c,get fallback(){return od()},get children(){var _=sd(),C=_.firstChild;return u(_,g(re,{each:h,children:b=>(()=>{var y=ld(),S=y.firstChild,T=S.nextSibling,k=T.firstChild;return u(T,()=>b.label,k),u(T,()=>ce("fixed2",b.v).text,null),A(P=>{var E=`marker ${b.cls}`,O=`${d(b.v)}%`;return E!==P.e&&ee(y,P.e=E),O!==P.t&&Ye(y,"left",P.t=O),P},{e:void 0,t:void 0}),y})()}),null),A(b=>{var y=`${d(e.strike_from)}%`,S=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return y!==b.e&&Ye(C,"left",b.e=y),S!==b.t&&Ye(C,"width",b.t=S),b},{e:void 0,t:void 0}),_}}),null),u(f,()=>_e("band_range",t.thresholds,`${ce("fixed2",e.strike_from).text} → ${ce("fixed2",e.strike_to).text}`),null),u(f,()=>_e("band_depth",t.thresholds,r==null?Xe:`${(r*100).toFixed(1)}%`),null),u(f,()=>_e("cushion_be",t.thresholds,s==null?Xe:`${s.toFixed(1)}%`),null),f})()}function Id(t){const e=t.row,n=J(e.strike)?null:e.strike*100,r=J(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=ce("pct1",e.rate_of_return);return(()=>{var a=cd();return a.firstChild,u(a,()=>_e("capital",t.thresholds,n==null?Xe:An(n,0)),null),u(a,()=>_e("premium",t.thresholds,r==null?Xe:An(r)),null),u(a,()=>_e("breakeven",t.thresholds,i==null?Xe:An(i)),null),u(a,()=>_e("ann_ror",t.thresholds,(()=>{var o=ud();return u(o,()=>s.text),o})()),null),u(a,()=>_e("bid",t.thresholds,ce("fixed2",e.bid).text),null),u(a,()=>_e("ask",t.thresholds,ce("fixed2",e.ask).text),null),u(a,()=>_e("expiration",t.thresholds,e.expiration),null),a})()}function kd(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:Tn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:Tn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:Tn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=fd();return i.firstChild,u(i,g($,{when:n,get fallback(){return(()=>{var s=gd(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ce("fixed3",e.score).text),s})()},get children(){return[g(re,{each:r,children:s=>{const a=J(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=pd(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,f=h.nextSibling;f.nextSibling;var p=l.nextSibling,_=p.firstChild,C=p.nextSibling;return u(l,g(mt,{get text(){return _t(s.key,t.thresholds)},get children(){var b=ms();return u(b,()=>s.label),b}}),c),u(d,()=>s.weight*100,f),u(C,()=>ce("fixed3",s.v).text),A(b=>Ye(_,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=dd(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ce("fixed3",e.score).text),s})(),g($,{get when(){return e.earnings_before_expiry},get children(){return hd()}})]}}),null),i})()}function $d(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:ce(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=_d();return n.firstChild,u(n,g(re,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=yd();return u(s,g(mt,{get text(){return _t(r.id,t.thresholds)},get children(){var a=bd(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),A(()=>ee(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,g($,{get when(){return t.hiddenDefs.length===0},get children(){return md()}}),null),n})()}function Cd(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=Sd(),i=r.firstChild;return u(r,g($,{when:n,get children(){var s=vd(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,g($,{get when(){return n.report_time},children:f=>f().replaceAll("_"," ")}),c),u(s,g($,{get when(){return!J(n.expected_eps)},get children(){return[" ","· expected EPS ",H(()=>ce("fixed2",n.expected_eps).text)]}}),h),u(s,g(mt,{get text(){return _t("earnings_before_expiry",t.thresholds)},get children(){return wd()}}),null),s}}),i),u(i,g(Ed,{row:e,get thresholds(){return t.thresholds}}),null),u(i,g(Id,{row:e,get thresholds(){return t.thresholds}}),null),u(i,g(kd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,g($d,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var Td=m("<span class=null-mark>"),Ad=m("<span class=star>★"),Pd=m("<td><b>"),Pn=m("<span>"),ei=m("<td class=num>"),Rd=m("<span class=score-frozen>prod "),xd=m('<td class="num score-cell">'),Od=m('<span class="score-frozen readmit">re-admitted'),Dd=m("<td>"),Nd=m("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),Ld=m("<span class=sort-arrow>"),Md=m("<span class=tip-target>"),Ud=m("<th role=button tabindex=0>"),Fd=m("<tr class=expandable><td class=exp-col>"),Bd=m("<tr class=exp-row><td>");const Vd=t=>`${t.underlying}|${t.strike}`;function Hd(t){return(()=>{var e=Td();return u(e,()=>t.text),e})()}function Ht(t){const e=ce(t.kind,t.value);return g($,{get when(){return!e.isNull},get fallback(){return g(Hd,{get text(){return e.text}})},get children(){return e.text}})}function Wd(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=Pd(),i=r.firstChild;return u(r,g($,{get when(){return t.pickRank!=null},get children(){var s=Ad();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,g($,{get when(){return Qr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=Pn();return A(()=>ee(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=ei();return u(r,g($,{get when(){return Qr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=Pn();return A(()=>ee(s,`dot ${i()}`)),s})()," "]}),null),u(r,g(Ht,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=xd();return u(r,g(Ht,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,g($,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return g($,{get when(){return!J(n.frozen_score)},get fallback(){return g($,{get when(){return!J(n.score)},get children(){return Od()}})},get children(){var i=Rd();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=ei();return u(r,g(Ht,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,g($,{get when(){return ed(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=Pn();return u(s,i),A(()=>ee(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=Dd();return u(r,g(Ht,{get kind(){return e.kind},get value(){return n[e.id]}})),A(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function jd(t){const e=Q(()=>pn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=Nd(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,g(re,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=Ud();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,g(mt,{get text(){return _t(a.id,t.thresholds)},get children(){var c=Md();return u(c,()=>a.label,null),u(c,g($,{get when(){return o()},get children(){return[" ",(()=>{var d=Ld();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),A(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&W(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,g(re,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>Vd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=Fd(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,g(re,{get each(){return e()},children:f=>g(Wd,{col:f,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),A(f=>{var p=o()!=null,_=!!J(a.score),C=!!c();return p!==f.e&&d.classList.toggle("pick",f.e=p),_!==f.t&&d.classList.toggle("prow",f.t=_),C!==f.a&&d.classList.toggle("open",f.a=C),f},{e:void 0,t:void 0,a:void 0}),d})(),g($,{get when(){return c()},get children(){var d=Bd(),h=d.firstChild;return u(h,g(Cd,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),A(()=>W(h,"colspan",e().length+1)),d}})]}})),n})()}de(["click","keydown"]);function zd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const st=t=>J(t);function Gd(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=st(a),c=st(o);return l||c?l&&c?0:l?1:-1:r*zd(a,o)})}function Kd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=st(r),a=st(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=st(l),h=st(c);return d||h?d&&h?0:d?1:-1:c-l})}var qd=m("<div class=stage-badges>"),Jd=m("<pre class=errbox>"),Yd=m("<details><summary> "),Xd=m("<div class=scroll-region>"),Qd=m('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),Zd=m("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),eh=m("<div class=empty-panel>No rows match the current filter."),th=m('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Rn=100,nh=150,ti={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function rh(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=qd();return u(i,g(re,{get each(){return t.stages??[]},children:s=>(()=>{var a=Yd(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,g($,{get when(){return s.error},get children(){var c=Jd();return u(c,()=>s.error),c}}),null),A(()=>ee(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function ni(t){const[e,n]=N(""),[r,i]=N(""),[s,a]=N(!0),[o,l]=N(null),[c,d]=N("asc"),[h,f]=N(1);let p;Ce(()=>clearTimeout(p));const _=()=>{var w;return((w=t.tf)==null?void 0:w.rows)??[]},C=Q(()=>{const w=t.scoring.params(),D=t.scoring.isCustom();return _().map(B=>{const F=Pu(B,w);return{...B,frozen_score:B.score,live_parts:F,score:D?F==null?null:F.total:B.score}})}),b=Q(()=>C().filter(w=>!J(w.score)&&J(w.frozen_score)).length),y=w=>{const D=w.currentTarget.value;n(D),clearTimeout(p),p=setTimeout(()=>{i(D.trim().toLowerCase()),f(1)},nh)},S=w=>{a(w),f(1)},T=w=>{o()!==w?(l(w),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),f(1)},[k,P]=N(null),E=w=>{const D=`${w.underlying}|${w.strike}`;P(B=>B===D?null:D)};Je(Et([o,c,h,r,s],()=>P(null))),Je(Et(t.active,()=>P(null))),Je(Et(t.columns.visible,()=>f(1)));const O=()=>pn.filter(w=>!t.columns.visible().includes(w.id)),R=()=>(t.stages??[]).find(w=>w.name===ti[t.id].id),M=Q(()=>{const w=r();return w?C().filter(D=>{const B=D.underlying,F=D.sector;return B!=null&&String(B).toLowerCase().includes(w)||F!=null&&String(F).toLowerCase().includes(w)}):C()}),I=Q(()=>{const w=M();return s()?w.filter(D=>!J(D.score)):w}),x=Q(()=>o()?Gd(I(),o(),c()):Kd(I())),U=Q(()=>Math.max(1,Math.ceil(x().length/Rn))),V=()=>Math.min(h(),U()),X=()=>{const w=V();return x().slice((w-1)*Rn,w*Rn)},he=Q(()=>{var D;const w=new Map;if(t.scoring.isCustom()){const B=Ru(C().map(F=>({row:F,score:F.score})));for(const F of B)w.set(`${F.row.underlying}|${F.row.strike}`,w.size+1)}else for(const B of((D=t.tf)==null?void 0:D.top_picks)??[])w.set(`${B.underlying}|${B.strike}`,B.rank??"?");return w}),v=w=>he().get(`${w.underlying}|${w.strike}`);return(()=>{var w=Qd(),D=w.firstChild,B=D.firstChild,F=B.nextSibling,oe=F.firstChild,z=F.nextSibling,ze=z.firstChild,nt=ze.nextSibling;return nt.nextSibling,u(w,g(rh,{get stages(){return t.stages}}),D),B.$$input=y,oe.addEventListener("change",Y=>S(Y.currentTarget.checked)),u(D,g(Gu,{get store(){return t.columns}}),z),u(z,()=>St(x().length),ze),u(z,()=>St(_().length),nt),u(z,g($,{get when(){return H(()=>!!t.scoring.isCustom())()&&b()>0},get children(){return[" ","· ",H(()=>St(b()))," re-admitted by lower floor"]}}),null),u(w,g($,{get when(){return X().length>0},get children(){var Y=Xd();return u(Y,g(jd,{get visibleCols(){return t.columns.visible},rows:X,sortKey:o,sortDir:c,onSort:T,get thresholds(){return t.thresholds},pickRankOf:v,openKey:k,onToggleRow:E,hiddenDefs:O,get customScores(){return t.scoring.isCustom}})),Y}}),null),u(w,g($,{get when(){return X().length===0},get children(){return g($,{get when(){var Y,le;return((Y=R())==null?void 0:Y.status)==="failed"||((le=R())==null?void 0:le.status)==="partial"},get fallback(){return g($,{get when(){return H(()=>!!s())()&&M().length>0},get fallback(){return eh()},get children(){var Y=Zd(),le=Y.firstChild,fe=le.nextSibling,se=fe.nextSibling,q=se.nextSibling,Ge=q.nextSibling;return Ge.nextSibling,u(Y,()=>St(M().length),Ge),Y}})},children:Y=>(()=>{var le=th(),fe=le.firstChild,se=fe.firstChild,q=se.nextSibling;q.nextSibling;var Ge=fe.nextSibling;return u(fe,()=>Y().status==="partial"?"△":"✗",se),u(fe,()=>ti[t.id].label,q),u(Ge,()=>Y().error??"stage produced no data"),le})()})}}),null),u(w,g($,{get when(){return x().length>0},get children(){return g(Xu,{page:V,pageCount:U,onGo:f})}}),null),A(()=>w.hidden=!t.active()),A(()=>B.value=e()),A(()=>oe.checked=s()),w})()}de(["input"]);var ih=m("<button type=button class=btn>Cancel"),sh=m('<form><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal placeholder="e.g. 350.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.00"></label><label>contracts <input type=number min=1></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Add'),ah=m("<button type=button class=btn>+ New position"),oh=m("<label class=proto-outcome-price>close price/share<input inputmode=decimal>"),lh=m('<div class=proto-outcome><div class=proto-outcome-head>Close <!> </div><div class=proto-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=proto-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),ch=m("<div class=proto-notice>"),uh=m("<div class=proto-pane><div class=proto-toolbar><button type=button class=btn>⟳ Refresh marks</button></div><div class=proto-scroll><table class=proto-ledger><thead><tr><th>Underlying</th><th>Strike</th><th>Expiry</th><th>Sold</th><th>Premium</th><th>Mid (age)</th><th>P&amp;L $</th><th>P&amp;L %</th><th>Days</th><th>Pace $/day</th><th>Target</th><th></th></tr></thead><tbody></tbody></table></div><p class=proto-note>Variant A — one dense row per position, same visual language as the analyst table. The pace rule reads left-to-right: P&amp;L % vs Target."),dh=m("<span class=proto-age>"),hh=m('<tr><td class=proto-strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>/</td><td></td><td></td><td><span class=chip></span> <button type=button class="btn-ghost proto-close-btn">close…'),fh=m("<span class=proto-stale>unpriced"),gh=m('<div class=proto-pane><div class="proto-toolbar proto-toolbar-actions"><button type=button class="btn proto-refresh"aria-label="Refresh marks">⟳<span class=proto-refresh-label> Refresh marks</span></button></div><div class=proto-cards></div><p class=proto-note>Variant B — one card per position, sorted most ahead-of-pace first. The bar is the decision: fill vs the tick mark.'),ph=m('<span class="chip high">buy back?'),mh=m('<div class=proto-card><div class=proto-card-head><b> <!>P ×</b><span class=proto-age>exp <!> · <!>/<!> wd</span></div><div class=proto-card-big><span></span><span class=proto-card-target>target </span></div><div class=proto-bar><div class=proto-bar-fill></div><div class=proto-bar-mark></div></div><div class=proto-card-stats><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>close captures</span><b></b></div></div><div class=proto-card-actions><button type=button class="btn-ghost proto-close-btn">close…'),_h=m('<span class="chip normal">holding'),bh=m("<svg><line x1=28 x2=532 class=proto-line-target></svg>",!1,!0,!1),yh=m("<svg><circle r=4 class=proto-dot-now></svg>",!1,!0,!1),wh=m('<svg class=proto-chart viewBox="0 0 560 180"role=img aria-label="premium decay"><line class=proto-line-ideal></line><polyline class=proto-line-obs></polyline><text y=172 class=proto-axis>sold</text><text y=172 class=proto-axis text-anchor=end>expiry</text><text y=18 class=proto-axis text-anchor=middle>today'),vh=m(`<div class="proto-pane proto-focus"><div class=proto-toolbar><button type=button class=btn>⟳ Refresh marks</button></div><div class=proto-focus-body><nav class=proto-rail></nav><div class=proto-detail></div></div><p class=proto-note>Variant C — pick a position on the rail, read its decay: observed premium path vs the straight-line ideal and today's pace-target line.`),Sh=m('<span class="chip high">met'),Eh=m("<button type=button class=proto-rail-item><b> <!>P</b><span> · <!>/<!> wd"),Ih=m("<div class=empty-panel>No positions — add one."),kh=m("<div class=proto-detail-head><h3> <!>P · sold <!>, exp </h3><div class=proto-detail-stats><div><span>premium</span><b></b></div><div><span>mid</span><b></b></div><div><span>P&amp;L</span><b></b></div><div><span>pace</span><b></b></div><div><span>target</span><b></b></div><div><span>mark</span><b>"),$h=m('<span class="chip high">pace met — buy back?'),Ch=m("<div class=proto-detail-actions><button type=button class=btn>close…"),Th=m('<span class="chip normal">behind / on pace'),Ah=m('<div class=proto-root><div class=proto-switcher role=toolbar aria-label="prototype variants"><button type=button class=proto-sw-btn aria-label="previous variant">←</button><span class=proto-sw-label>PROTOTYPE · <!> (<!>)</span><button type=button class=proto-sw-btn aria-label="next variant">→');function ir(t){const e=t.getDay();return e===0||e===6}function xn(t,e){let n=0;const r=new Date(t);r.setHours(0,0,0,0);const i=new Date(e);for(i.setHours(23,59,59,999);r.setDate(r.getDate()+1),!(r>i);)ir(r)||(n+=1);return n}const et=t=>`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;function mn(t){const e=new Date,n=e>t.expiry?t.expiry:e,r=Math.min(xn(t.sold,n),xn(t.sold,t.expiry)),i=xn(t.sold,t.expiry),s=t.premium-t.mid,a=s*100*t.contracts,o=t.premium>0?s/t.premium:0,l=i>0?Math.max(r,1)/i:0,c=r>0?o/r:0,d=r>0?a/r:0,h=t.mid!==null&&o>=l,f=t.midAt?Math.max(0,(Date.now()-t.midAt)/1e3):null;return{daysElapsed:r,daysTotal:i,plDollars:a,plPct:o,targetPct:l,pacePerDayPct:c,pacePerDayDollar:d,paceMet:h,ageSecs:f}}function sr(t){if(t===null)return"no mark";const e=Math.floor(t/60);return e<1?"just now":e<60?`${e} min ago`:`about ${Math.floor(e/60)} h ago`}const ft=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),Fe=(t,e=0)=>`${(t*100).toFixed(e)}%`;function me(t){const e=new Date;for(e.setHours(0,0,0,0);t>0;)e.setDate(e.getDate()-1),ir(e)||(t-=1);return e}function bt(t,e){const n=new Date(t);for(;e>0;)n.setDate(n.getDate()+1),ir(n)||(e-=1);return n}function Ph(t,e){const n=new Date(t);return n.setDate(n.getDate()+e),n}const Rh=()=>[{id:"p1",symbol:"GOOG",strike:350,expiry:bt(me(3),5),sold:me(3),premium:1,contracts:1,mid:.5,midAt:Date.now()-11*6e4},{id:"p2",symbol:"AAPL",strike:230,expiry:bt(me(6),10),sold:me(6),premium:3.2,contracts:2,mid:2.9,midAt:Date.now()-40*6e4},{id:"p3",symbol:"TSLA",strike:420,expiry:bt(me(1),4),sold:me(1),premium:4.5,contracts:1,mid:2.2,midAt:Date.now()-3*6e4},{id:"p4",symbol:"NVDA",strike:180,expiry:bt(me(4),5),sold:me(4),premium:2,contracts:3,mid:.3,midAt:Date.now()-90*6e4},{id:"p5",symbol:"MSFT",strike:500,expiry:bt(me(3),20),sold:me(3),premium:6.5,contracts:1,mid:6.1,midAt:Date.now()-25*6e4}];function xh(){const[t,e]=N(Rh()),[n,r]=N("");let i=100;const s=c=>{r(c),setTimeout(()=>r(""),4e3)};return{positions:t,addPosition:c=>{const d={id:`p${i++}`,symbol:c.symbol.toUpperCase(),strike:Number(c.strike),expiry:new Date(c.expiry+"T00:00:00"),sold:new Date(c.sold+"T00:00:00"),premium:Number(c.premium),contracts:Number(c.contracts),mid:null,midAt:null};e(h=>[...h,d]),s(`Added ${d.symbol} ${d.strike} — press Refresh marks to price it.`)},closePosition:(c,d,h)=>{const f=t().find(_=>_.id===c);if(!f)return;mn(f);const p=d==="expired"?f.premium*100*f.contracts:d==="assigned"?(f.strike-(h??f.strike)+f.premium)*100*f.contracts:(f.premium-(h??f.mid??0))*100*f.contracts;e(_=>_.filter(C=>C.id!==c)),s(`Closed ${f.symbol} ${f.strike} (${d}) — realized ${ft(p)}.`)},refreshMarks:()=>{e(c=>c.map(d=>{if(d.mid===null)return{...d,mid:d.premium*(.6+Math.random()*.3),midAt:Date.now()};const h=Math.min(Math.max(.05,d.mid*(1+(Math.random()-.5)*.24)),d.premium+.5);return{...d,mid:h,midAt:Date.now()}})),s("Marks refreshed (simulated Tiger mid).")},notice:n}}function ar(t){const[e,n]=N(t.layout==="row"),[r,i]=N({symbol:"",strike:"",premium:"",contracts:"1",sold:et(new Date),expiry:et(Ph(new Date,7))}),s=o=>l=>i({...r(),[o]:l.target.value}),a=o=>{o.preventDefault(),r().symbol&&[r().strike,r().premium,r().contracts].every(l=>Number(l)>0)&&(t.onAdd(r()),i({...r(),symbol:"",strike:"",premium:""}),t.layout!=="row"&&n(!1))};return g($,{get when(){return e()},get fallback(){return(()=>{var o=ah();return o.$$click=()=>n(!0),o})()},get children(){var o=sh(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=l.nextSibling,f=h.firstChild,p=f.nextSibling,_=h.nextSibling,C=_.firstChild,b=C.nextSibling,y=_.nextSibling,S=y.firstChild,T=S.nextSibling,k=y.nextSibling,P=k.firstChild,E=P.nextSibling,O=k.nextSibling,R=O.firstChild,M=R.nextSibling;return O.nextSibling,o.addEventListener("submit",a),ne(d,"input",s("symbol"),!0),ne(p,"input",s("strike"),!0),ne(b,"input",s("premium"),!0),ne(T,"input",s("contracts"),!0),ne(E,"input",s("sold"),!0),ne(M,"input",s("expiry"),!0),u(o,g($,{get when(){return t.layout!=="row"},get children(){var I=ih();return I.$$click=()=>n(!1),I}}),null),A(()=>ee(o,`proto-add proto-add-${t.layout}`)),A(()=>d.value=r().symbol),A(()=>p.value=r().strike),A(()=>b.value=r().premium),A(()=>T.value=r().contracts),A(()=>E.value=r().sold),A(()=>M.value=r().expiry),o}})}function or(t){var s;const[e,n]=N("bought-back"),[r,i]=N(((s=t.position.mid)==null?void 0:s.toFixed(2))??"");return(()=>{var a=lh(),o=a.firstChild,l=o.firstChild,c=l.nextSibling;c.nextSibling;var d=o.nextSibling,h=d.firstChild,f=h.firstChild,p=h.nextSibling,_=p.firstChild,C=p.nextSibling,b=C.firstChild,y=d.nextSibling,S=y.firstChild,T=S.nextSibling;return u(o,()=>t.position.symbol,c),u(o,()=>t.position.strike,null),f.addEventListener("change",()=>n("bought-back")),_.addEventListener("change",()=>n("expired")),b.addEventListener("change",()=>n("assigned")),u(a,g($,{get when(){return e()!=="expired"},get children(){var k=oh(),P=k.firstChild,E=P.nextSibling;return E.$$input=O=>i(O.target.value),A(()=>E.value=r()),k}}),y),ne(S,"click",t.onClose,!0),T.$$click=()=>t.onConfirm(e(),e()==="expired"?null:Number(r())),A(()=>f.checked=e()==="bought-back"),A(()=>_.checked=e()==="expired"),A(()=>b.checked=e()==="assigned"),a})()}function lr(t){return g($,{get when(){return t.text()},get children(){var e=ch();return u(e,()=>t.text()),e}})}function Oh(t){const{ledger:e}=t,[n,r]=N(null),i=()=>e.positions().map(s=>({p:s,v:mn(s)}));return(()=>{var s=uh(),a=s.firstChild,o=a.firstChild,l=a.nextSibling,c=l.firstChild,d=c.firstChild,h=d.nextSibling,f=l.nextSibling;return u(a,g(ar,{layout:"row",get onAdd(){return e.addPosition}}),o),ne(o,"click",e.refreshMarks,!0),u(s,g(lr,{get text(){return e.notice}}),l),u(h,g(re,{get each(){return i()},children:({p,v:_})=>(()=>{var C=hh(),b=C.firstChild,y=b.nextSibling,S=y.nextSibling,T=S.nextSibling,k=T.nextSibling,P=k.nextSibling,E=P.nextSibling,O=E.nextSibling,R=O.nextSibling,M=R.firstChild,I=R.nextSibling,x=I.nextSibling,U=x.nextSibling,V=U.firstChild,X=V.nextSibling,he=X.nextSibling;return u(b,()=>p.symbol),u(y,()=>p.strike.toFixed(0)),u(S,()=>et(p.expiry)),u(T,()=>et(p.sold)),u(k,()=>p.premium.toFixed(2)),u(P,g($,{get when(){return p.mid!==null},get fallback(){return fh()},get children(){return[H(()=>p.mid.toFixed(2))," ",(()=>{var v=dh();return u(v,()=>sr(_.ageSecs)),v})()]}})),u(E,(()=>{var v=H(()=>p.mid===null);return()=>v()?"—":ft(_.plDollars)})()),u(O,(()=>{var v=H(()=>p.mid===null);return()=>v()?"—":Fe(_.plPct,1)})()),u(R,()=>_.daysElapsed,M),u(R,()=>_.daysTotal,null),u(I,(()=>{var v=H(()=>p.mid===null);return()=>v()?"—":ft(_.pacePerDayDollar)})()),u(x,()=>Fe(_.targetPct)),u(V,()=>_.paceMet?"PACE MET":"holding"),he.$$click=()=>r(p),A(v=>{var w=!!_.paceMet,D=_.plDollars>=0?"proto-pos":"proto-neg",B=_.plPct>=0?"proto-pos":"proto-neg",F=!!_.paceMet;return w!==v.e&&C.classList.toggle("proto-row-met",v.e=w),D!==v.t&&ee(E,v.t=D),B!==v.a&&ee(O,v.a=B),F!==v.o&&V.classList.toggle("high",v.o=F),v},{e:void 0,t:void 0,a:void 0,o:void 0}),C})()})),u(s,g($,{get when(){return n()},get children(){return g(or,{get position(){return n()},onClose:()=>r(null),onConfirm:(p,_)=>{e.closePosition(n().id,p,_),r(null)}})}}),f),s})()}function Dh(t){const{ledger:e}=t,[n,r]=N(null),i=()=>[...e.positions()].map(s=>({p:s,v:mn(s)})).sort((s,a)=>a.v.plPct-a.v.targetPct-(s.v.plPct-s.v.targetPct));return(()=>{var s=gh(),a=s.firstChild,o=a.firstChild,l=a.nextSibling,c=l.nextSibling;return u(a,g(ar,{layout:"tile",get onAdd(){return e.addPosition}}),o),ne(o,"click",e.refreshMarks,!0),u(s,g(lr,{get text(){return e.notice}}),l),u(l,g(re,{get each(){return i()},children:({p:d,v:h})=>{const f=()=>Math.max(0,Math.min(100,h.plPct*100)),p=()=>Math.min(100,h.targetPct*100);return(()=>{var _=mh(),C=_.firstChild,b=C.firstChild,y=b.firstChild,S=y.nextSibling;S.nextSibling;var T=b.nextSibling,k=T.firstChild,P=k.nextSibling,E=P.nextSibling,O=E.nextSibling,R=O.nextSibling,M=R.nextSibling;M.nextSibling;var I=C.nextSibling,x=I.firstChild,U=x.nextSibling;U.firstChild;var V=I.nextSibling,X=V.firstChild,he=X.nextSibling,v=V.nextSibling,w=v.firstChild,D=w.firstChild,B=D.nextSibling,F=w.nextSibling,oe=F.firstChild,z=oe.nextSibling,ze=z.nextSibling,nt=F.nextSibling,Y=nt.firstChild,le=Y.nextSibling,fe=v.nextSibling,se=fe.firstChild;return u(b,()=>d.symbol,y),u(b,()=>d.strike,S),u(b,()=>d.contracts,null),u(T,()=>et(d.expiry),P),u(T,()=>h.daysElapsed,O),u(T,()=>h.daysTotal,M),u(x,(()=>{var q=H(()=>d.mid===null);return()=>q()?"—":Fe(h.plPct,1)})()),u(U,()=>Fe(h.targetPct),null),u(B,()=>ft(d.premium)),u(z,(()=>{var q=H(()=>d.mid===null);return()=>q()?"—":d.mid.toFixed(2)})()),u(ze,(()=>{var q=H(()=>h.ageSecs===null);return()=>q()?"":sr(h.ageSecs)})()),u(le,(()=>{var q=H(()=>d.mid===null);return()=>q()?"—":ft(h.plDollars)})()),u(fe,g($,{get when(){return h.paceMet},get fallback(){return _h()},get children(){return ph()}}),se),se.$$click=()=>r(d),A(q=>{var Ge=!!h.paceMet,cr=h.plPct>=0?"proto-pos":"proto-neg",ur=`${d.mid===null?0:f()}%`,dr=`${p()}%`,hr=h.plDollars>=0?"proto-pos":"proto-neg";return Ge!==q.e&&_.classList.toggle("proto-card-met",q.e=Ge),cr!==q.t&&ee(x,q.t=cr),ur!==q.a&&Ye(X,"width",q.a=ur),dr!==q.o&&Ye(he,"left",q.o=dr),hr!==q.i&&ee(le,q.i=hr),q},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),_})()}})),u(s,g($,{get when(){return n()},get children(){return g(or,{get position(){return n()},onClose:()=>r(null),onConfirm:(d,h)=>{e.closePosition(n().id,d,h),r(null)}})}}),c),s})()}function Nh(t){const{ledger:e}=t,[n,r]=N(null),i=()=>e.positions().map(c=>({p:c,v:mn(c)})),[s,a]=N("p1"),o=()=>i().find(c=>c.p.id===s())??i()[0],l=()=>{const c=o();if(!c)return null;const{p:d,v:h}=c,f=560,p=180,_=28,C=h.daysTotal,b=k=>_+k/Math.max(1,C)*(f-2*_),y=k=>p-_-k/(d.premium*1.15)*(p-2*_),S=[`${b(0)},${y(d.premium)}`,`${b(h.daysElapsed)},${y(d.mid??d.premium)}`];`${b(0)}${y(d.premium)}`,`${b(C)}${y(0)}`;const T=d.premium*(1-h.targetPct);return(()=>{var k=wh(),P=k.firstChild,E=P.nextSibling,O=E.nextSibling,R=O.nextSibling,M=R.nextSibling;return u(k,g($,{get when(){return d.mid!==null},get children(){return[(()=>{var I=bh();return A(x=>{var U=y(T),V=y(T);return U!==x.e&&W(I,"y1",x.e=U),V!==x.t&&W(I,"y2",x.t=V),x},{e:void 0,t:void 0}),I})(),(()=>{var I=yh();return A(x=>{var U=b(h.daysElapsed),V=y(d.mid);return U!==x.e&&W(I,"cx",x.e=U),V!==x.t&&W(I,"cy",x.t=V),x},{e:void 0,t:void 0}),I})()]}}),O),A(I=>{var x=b(0),U=y(d.premium),V=b(C),X=y(0),he=S.join(" "),v=b(0),w=b(C),D=b(h.daysElapsed);return x!==I.e&&W(P,"x1",I.e=x),U!==I.t&&W(P,"y1",I.t=U),V!==I.a&&W(P,"x2",I.a=V),X!==I.o&&W(P,"y2",I.o=X),he!==I.i&&W(E,"points",I.i=he),v!==I.n&&W(O,"x",I.n=v),w!==I.s&&W(R,"x",I.s=w),D!==I.h&&W(M,"x",I.h=D),I},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0}),k})()};return(()=>{var c=vh(),d=c.firstChild,h=d.firstChild,f=d.nextSibling,p=f.firstChild,_=p.nextSibling,C=f.nextSibling;return u(d,g(ar,{layout:"tile",get onAdd(){return e.addPosition}}),h),ne(h,"click",e.refreshMarks,!0),u(c,g(lr,{get text(){return e.notice}}),f),u(p,g(re,{get each(){return i()},children:({p:b,v:y})=>(()=>{var S=Eh(),T=S.firstChild,k=T.firstChild,P=k.nextSibling;P.nextSibling;var E=T.nextSibling,O=E.firstChild,R=O.nextSibling,M=R.nextSibling,I=M.nextSibling;return I.nextSibling,S.$$click=()=>a(b.id),u(T,()=>b.symbol,k),u(T,()=>b.strike,P),u(E,(()=>{var x=H(()=>b.mid===null);return()=>x()?"unpriced":Fe(y.plPct,1)})(),O),u(E,()=>y.daysElapsed,R),u(E,()=>y.daysTotal,I),u(S,g($,{get when(){return y.paceMet},get children(){return Sh()}}),null),A(x=>{var X;var U=((X=o())==null?void 0:X.p.id)===b.id,V=!!y.paceMet;return U!==x.e&&S.classList.toggle("active",x.e=U),V!==x.t&&S.classList.toggle("proto-row-met",x.t=V),x},{e:void 0,t:void 0}),S})()})),u(_,g($,{get when(){return o()},get fallback(){return Ih()},children:b=>{const{p:y,v:S}=b();return[(()=>{var T=kh(),k=T.firstChild,P=k.firstChild,E=P.nextSibling,O=E.nextSibling,R=O.nextSibling;R.nextSibling;var M=k.nextSibling,I=M.firstChild,x=I.firstChild,U=x.nextSibling,V=I.nextSibling,X=V.firstChild,he=X.nextSibling,v=V.nextSibling,w=v.firstChild,D=w.nextSibling,B=v.nextSibling,F=B.firstChild,oe=F.nextSibling,z=B.nextSibling,ze=z.firstChild,nt=ze.nextSibling,Y=z.nextSibling,le=Y.firstChild,fe=le.nextSibling;return u(k,()=>y.symbol,P),u(k,()=>y.strike,E),u(k,()=>et(y.sold),R),u(k,()=>et(y.expiry),null),u(U,()=>y.premium.toFixed(2)),u(he,(()=>{var se=H(()=>y.mid===null);return()=>se()?"—":y.mid.toFixed(2)})()),u(D,(()=>{var se=H(()=>y.mid===null);return()=>se()?"—":`${ft(S.plDollars)} (${Fe(S.plPct,1)})`})()),u(oe,(()=>{var se=H(()=>y.mid===null);return()=>se()?"—":`${Fe(S.pacePerDayPct,1)}/wd`})()),u(nt,()=>Fe(S.targetPct)),u(fe,()=>sr(S.ageSecs)),A(()=>ee(D,S.plDollars>=0?"proto-pos":"proto-neg")),T})(),H(l),(()=>{var T=Ch(),k=T.firstChild;return u(T,g($,{get when(){return S.paceMet},get fallback(){return Th()},get children(){return $h()}}),k),k.$$click=()=>r(y),T})()]}})),u(c,g($,{get when(){return n()},get children(){return g(or,{get position(){return n()},onClose:()=>r(null),onConfirm:(b,y)=>{e.closePosition(n().id,b,y),r(null)}})}}),C),c})()}const De=[{key:"A",name:"Ledger table",Component:Oh},{key:"B",name:"Urgency cards",Component:Dh},{key:"C",name:"Focus timeline",Component:Nh}];function Lh(){const t=new URLSearchParams(window.location.search).get("variant");return De.some(e=>e.key===t)?t:"A"}function Mh(){const t=xh(),[e,n]=N(Lh()),r=a=>{const o=De.findIndex(d=>d.key===e()),l=De[(o+a+De.length)%De.length];n(l.key);const c=new URL(window.location);c.searchParams.set("variant",l.key),history.replaceState(null,"",c)},i=a=>{const o=a.target;o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement||o!=null&&o.isContentEditable||(a.key==="ArrowLeft"&&r(-1),a.key==="ArrowRight"&&r(1))};window.addEventListener("keydown",i),Ce(()=>window.removeEventListener("keydown",i));const s=()=>(De.find(a=>a.key===e())??De[0]).Component;return(()=>{var a=Ah(),o=a.firstChild,l=o.firstChild,c=l.nextSibling,d=c.firstChild,h=d.nextSibling,f=h.nextSibling,p=f.nextSibling;p.nextSibling;var _=c.nextSibling;return u(a,g(aa,{get component(){return s()},ledger:t}),o),l.$$click=()=>r(-1),u(c,e,h),u(c,()=>{var C;return(C=De.find(b=>b.key===e()))==null?void 0:C.name},p),_.$$click=()=>r(1),a})()}de(["input","click"]);async function Uh(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var Fh=m("<button type=button class=run-btn>"),Bh=m("<span class=run-count>/"),Vh=m("<span class=run-bar><span class=fill>"),Hh=m("<li><span class=mark></span><span class=label>"),Wh=m("<div class=toast-cached>Served from cache — last run <!> min old"),jh=m('<div class="toast-cached warn">'),zh=m("<div class=run-headline>"),Gh=m("<ul class=run-stages>"),Kh=m("<details class=run-errors><summary>details</summary><ul>"),qh=m("<div class=run-warn>Closing this tab stops the run."),Jh=m("<div class=run-warn>Re-checking every 15 s…"),Yh=m("<div class=run-strip>"),Xh=m("<li> ");const _s=["quotes","metrics","chains_short","chains_medium"],bs={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},Qh=15e3,ys=t=>t!==null&&Date.now()>=t;function ri(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function Zh(t){const[e,n]=N("idle"),[r,i]=N(k()),[s,a]=N(null),[o,l]=N(0),[c,d]=N(null),[h,f]=N(null),[p,_]=N("");let C=null,b=null;const[y,S]=N(0);let T=null;Je(()=>{const v=t();if(T&&(clearTimeout(T),T=null),(v==null?void 0:v.run_allowed)===!1){const w=ln(v.next_open_utc);w!==null&&(T=setTimeout(()=>S(D=>D+1),Math.max(0,w-Date.now())))}});function k(){return Object.fromEntries(_s.map(v=>[v,{status:"pending",error:null}]))}function P(){C&&clearInterval(C),C=null,b&&clearInterval(b),b=null}function E(){l(0),C=setInterval(()=>l(v=>v+1),1e3)}function O(v){switch(v.type){case"stage_started":i(w=>({...w,[v.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:v.stage,done:v.done,total:v.total});break;case"stage_finished":i(w=>({...w,[v.stage]:{status:v.ok?"ok":"failed",error:v.error??null}}));break;case"run_finished":d(v);break}}function R(){P();const v=c(),w=((v==null?void 0:v.stages)??[]).some(D=>D.name.startsWith("chains")&&["ok","partial"].includes(D.status));n(v&&(w||v.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function M(v){let w=!1;return await Uh(v,D=>{O(D),D.type==="run_finished"&&(w=!0)}),w?(R(),!0):!1}async function I(v){n("detached"),b=setInterval(async()=>{var w,D,B;try{const F=await gi(),oe=((D=(w=F==null?void 0:F.result)==null?void 0:w.run)==null?void 0:D.finished_at_utc)??null;if(oe&&oe!==v){i(x(F.result)),P(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((B=F==null?void 0:F.run_state)==null?void 0:B.status)!=="running"&&(P(),n("idle"),_("Stream lost and the run was canceled — press Run to retry."))}catch{}},Qh)}function x(v){const w=k();for(const D of(v==null?void 0:v.stages)??[])w[D.name]&&(w[D.name]={status:D.status,error:D.error});return w}async function U(){var B,F,oe;if(["starting","running","detached"].includes(e()))return;_(""),d(null),a(null),i(k()),f(null);const v=((oe=(F=(B=t())==null?void 0:B.result)==null?void 0:F.run)==null?void 0:oe.finished_at_utc)??null;n("running"),E();let w;try{w=await ha()}catch{P(),n("idle"),_("Run failed to start — network or server unreachable.");return}const D=w.headers.get("content-type")??"";if(w.ok&&D.includes("application/json")){const z=await w.json().catch(()=>null);if(P(),n("idle"),(z==null?void 0:z.status)==="cached"){f(z.age_secs),setTimeout(()=>f(null),6e3);return}}if(w.status===403&&D.includes("application/json")){const z=await w.json().catch(()=>null);P(),n("idle"),_(z!=null&&z.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(z.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(w.status===202){const z=await fa();if(z.ok&&(z.headers.get("content-type")??"").includes("text/event-stream")){await M(z)||await I(v);return}await I(v);return}if(D.includes("text/event-stream")){await M(w)||await I(v);return}P(),n("idle"),_(`Unexpected /api/run response (${w.status}, ${D||"no type"}).`)}return Ce(()=>{P(),T&&clearTimeout(T)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:p,triggerRun:U,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{y();const v=t();return(v==null?void 0:v.run_allowed)!==!1?!0:ys(ln(v==null?void 0:v.next_open_utc))},nextOpenUtc:()=>{var v;return((v=t())==null?void 0:v.next_open_utc)??null}}}function ef(t){const e=()=>!t.run.runAllowed(),n=()=>fs(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=Fh();return i.$$click=()=>t.run.triggerRun(),u(i,r),A(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&W(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function tf(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=Hh(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>bs[t.name]),u(i,g($,{get when(){return r()!==null},get children(){return[(()=>{var o=Bh(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=Vh(),l=o.firstChild;return A(c=>Ye(l,"width",`${r()}%`)),o})()]}}),null),A(()=>ee(i,`run-stage ${e()}`)),i})()}function nf(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",H(()=>ri(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",H(()=>ri(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return g($,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=Yh();return u(i,g($,{get when(){return e.cachedToast()},get children(){var s=Wh(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,g($,{get when(){return e.notice()},get children(){var s=jh();return u(s,()=>e.notice()),s}}),null),u(i,g($,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=zh();return u(s,r),s})(),(()=>{var s=Gh();return u(s,()=>_s.map(a=>g(tf,{name:a,run:e}))),s})(),g($,{get when(){return H(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=Kh(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=Xh(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>bs[l.name]??l.name,null),u(c,(()=>{var h=H(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,g($,{get when(){return H(()=>e.phase()==="running")()&&!n()},get children(){return qh()}}),null),u(i,g($,{get when(){return e.phase()==="detached"},get children(){return Jh()}}),null),i}})}de(["click"]);var ws=m("<b>"),rf=m("<span>Market closed · last run <b></b> ago"),sf=m("<div class=cache-line><span></span><span class=pill>run: "),af=m("<span>Cached · <b></b> left"),of=m("<span>Stale · last run <b></b> ago"),lf=m("<nav class=tabs role=tablist aria-label=timeframes>"),cf=m("<button type=button role=tab class=tab>"),uf=m('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),df=m("<div class=pop-backdrop>"),hf=m("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),ff=m("<div class=error-banner>API error: "),gf=m("<div class=shell><header><div class=user-box></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),pf=m("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function mf(){const[t,e]=N(Bu()),n=r=>{e(r),Vu(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(vt)}}function ii(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function _f(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function si(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function On(t){return g($,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=ws();return u(e,()=>t.at()),e})()]}})}function bf(t){const[e,n]=N(0);$t(()=>{const p=setInterval(()=>n(_=>_+1),3e4);Ce(()=>clearInterval(p))});let r=Date.now(),i=0;Je(Et(()=>t.envelope,p=>{r=Date.now(),i=(p==null?void 0:p.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const p=Math.max(0,(t.envelope.cache_secs??0)-s());return p>=60?`${Math.floor(p/60)}m`:`${p}s`},c=()=>{var p,_;return Zu((_=(p=t.envelope.result)==null?void 0:p.run)==null?void 0:_.finished_at_utc)},d=()=>{e();const p=t.envelope.next_open_utc,_=ln(p);if(!(_===null||ys(_)))return fs(p)},h=()=>o()&&a()==="stale"?"closed":a(),f=()=>a()==="fresh"||a()==="stale";return(()=>{var p=sf(),_=p.firstChild,C=_.nextSibling;return C.firstChild,u(p,g($,{get when(){return H(()=>!!o())()&&f()},get fallback(){return g($,{get when(){return a()==="fresh"},get fallback(){return g($,{get when(){return a()==="stale"},get children(){var b=of(),y=b.firstChild,S=y.nextSibling;return S.nextSibling,u(S,()=>si(s())),u(b,g(On,{at:c}),null),b}})},get children(){var b=af(),y=b.firstChild,S=y.nextSibling;return S.nextSibling,u(S,l),u(b,g(On,{at:c}),null),b}})},get children(){var b=rf(),y=b.firstChild,S=y.nextSibling;return S.nextSibling,u(S,()=>si(s())),u(b,g(On,{at:c}),null),u(b,g($,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var T=ws();return u(T,d),T})()]}}),null),b}}),_),u(_,(()=>{var b=H(()=>h()==="closed");return()=>b()?"market closed":a()})()),u(C,()=>{var b;return((b=t.envelope.run_state)==null?void 0:b.status)??"idle"},null),A(()=>ee(_,"pill "+h())),p})()}function ai(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"}];return(()=>{var n=lf();return u(n,()=>e.map(r=>(()=>{var i=cf();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=H(()=>!r.proto);return()=>s()&&` (${St(_f(t.result,r.id))})`})(),null),A(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&W(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function yf(){const[t,e]=N(void 0),[n,{refetch:r}]=Ts(t,y=>y?gi():void 0);$t(()=>{if(!ht){e(null);return}const y=ql(it(),e);Ce(y)});const[i,s]=N(!1);Je(Et(t,y=>{s(!1),!(!y||!ht)&&la().then(S=>s(S.status===403)).catch(()=>{})})),$t(()=>{const y=()=>r();window.addEventListener("webapp:refresh-latest",y),Ce(()=>window.removeEventListener("webapp:refresh-latest",y))});const a=()=>{var y,S;return((y=t())==null?void 0:y.email)||((S=t())==null?void 0:S.uid)||""},[o,l]=N(!1),[c,d]=N(!1),h=mf(),[f,p]=N("short"),_=()=>!1,C=Mu(),b=Zh(()=>n());return g($,{get when(){return t()},get fallback(){return g(vu,{})},get children(){return[g($,{get when(){return!i()},get fallback(){return g(wu,{get email(){return a()},onSignOut:()=>Yr()})},get children(){var y=gf(),S=y.firstChild,T=S.firstChild,k=T.nextSibling,P=k.nextSibling;return u(T,g($,{get when(){return t()},get children(){return[(()=>{var E=uf(),O=E.firstChild,R=O.nextSibling;return E.$$click=()=>l(!o()),u(R,a),A(()=>W(E,"aria-expanded",o())),E})(),g($,{get when(){return o()},get children(){return[(()=>{var E=df();return E.$$click=()=>l(!1),E})(),(()=>{var E=hf(),O=E.firstChild,R=O.nextSibling,M=R.nextSibling,I=M.nextSibling;return u(R,a),M.$$click=()=>{l(!1),d(!0)},I.$$click=()=>{l(!1),Yr()},E})()]}})]}})),u(S,g($,{get when(){return H(()=>!n.loading)()&&!n.error},get children(){return g(bf,{get envelope(){return n()}})}}),P),u(P,g(ef,{run:b})),u(y,g($,{get when(){return n.error},get children(){var E=ff();return E.firstChild,u(E,()=>n.error.message,null),E}}),null),u(y,g(nf,{run:b}),null),u(y,g($,{get when(){return _()},get children(){return[g(ai,{result:()=>{var E;return(E=n())==null?void 0:E.result},tab:f,onTab:p}),g(Mh,{})]}}),null),u(y,g($,{get when(){return!0},get children(){return g($,{get when(){var E;return H(()=>!n.loading)()&&((E=n())==null?void 0:E.result)},get fallback(){return g($,{get when(){return!n.loading},get children(){return pf()}})},children:E=>{const O=()=>E();return[g(Fu,{scoring:C}),g(ai,{result:O,tab:f,onTab:p}),g(ni,{id:"short",active:()=>f()==="short",get tf(){var R;return(R=O().timeframes)==null?void 0:R.short},get stageError(){return ii(O(),"chains_short")},get stages(){return O().stages},get thresholds(){return O().thresholds},columns:h,scoring:C}),g(ni,{id:"medium",active:()=>f()==="medium",get tf(){var R;return(R=O().timeframes)==null?void 0:R.medium},get stageError(){return ii(O(),"chains_medium")},get stages(){return O().stages},get thresholds(){return O().thresholds},columns:h,scoring:C})]}})}}),null),y}}),g($,{get when(){return c()},get children(){return g(Cu,{onClose:()=>d(!1)})}})]}})}de(["click"]);qs(()=>g(yf,{}),document.getElementById("root"));
