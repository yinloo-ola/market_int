(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const _s=!1,bs=(t,e)=>t===e,Nn=Symbol("solid-proxy"),ys=typeof Proxy=="function",vs=Symbol("solid-track"),Yt={equals:bs};let ni=ai;const Ae=1,Xt=2,ri={owned:null,cleanups:null,context:null,owner:null},_n={};var G=null;let bn=null,ws=null,j=null,Z=null,Ie=null,un=0;function Ht(t,e){const n=j,r=G,i=t.length===0,s=e===void 0?r:e,a=i?ri:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>ge(()=>Et(a)));G=a,j=null;try{return Ve(o,!0)}finally{j=n,G=r}}function O(t,e){e=e?Object.assign({},Yt,e):Yt;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),si(n,i));return[ii.bind(n),r]}function Ss(t,e,n){const r=dn(t,e,!0,Ae);ft(r)}function w(t,e,n){const r=dn(t,e,!1,Ae);ft(r)}function Ke(t,e,n){ni=As;const r=dn(t,e,!1,Ae);r.user=!0,Ie?Ie.push(r):ft(r)}function Q(t,e,n){n=n?Object.assign({},Yt,n):Yt;const r=dn(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,ft(r),ii.bind(r)}function $s(t){return t&&typeof t=="object"&&"then"in t}function ks(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=_n,l=!1,c="initialValue"in s,d=typeof r=="function"&&Q(r);const h=new Set,[g,_]=(s.storage||O)(s.initialValue),[b,I]=O(void 0),[y,v]=O(void 0,{equals:!1}),[S,A]=O(c?"ready":"unresolved");G&&Be(()=>{for(const M of h.keys())M.decrement();h.clear(),a=null});function T(M,p,k,U){return a===M&&(a=null,U!==void 0&&(c=!0),(M===o||p===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(U,{value:p})),o=_n,P(p,k)),p}function P(M,p){Ve(()=>{p===void 0&&_(()=>M),A(p!==void 0?"errored":c?"ready":"unresolved"),I(p);for(const k of h.keys())k.decrement();h.clear()},!1)}function E(){const M=Is,p=g(),k=b();if(k!==void 0&&!a)throw k;return j&&j.user,p}function D(M=!0){if(M!==!1&&l)return;l=!1;const p=d?d():r;if(p==null||p===!1){T(a,ge(g));return}let k;const U=o!==_n?o:ge(()=>{try{return i(p,{value:g(),refetching:M})}catch(J){k=J}});if(k!==void 0){T(a,void 0,Wt(k),p);return}else if(!$s(U))return T(a,U,void 0,p),U;return a=U,"v"in U?(U.s===1?T(a,U.v,void 0,p):T(a,void 0,Wt(U.v),p),U):(l=!0,queueMicrotask(()=>l=!1),Ve(()=>{A(c?"refreshing":"pending"),v()},!1),U.then(J=>T(U,J,void 0,p),J=>T(U,void 0,Wt(J),p)))}Object.defineProperties(E,{state:{get:()=>S()},error:{get:()=>b()},loading:{get(){const M=S();return M==="pending"||M==="refreshing"}},latest:{get(){if(!c)return E();const M=b();if(M&&!a)throw M;return g()}}});let x=G;return d?Ss(()=>(x=G,D(!1))):D(!1),[E,{refetch:M=>Es(x,()=>D(M)),mutate:_}]}function ge(t){if(j===null)return t();const e=j;j=null;try{return t()}finally{j=e}}function St(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=ge(()=>e(a,i,s));return i=a,o}}function lt(t){Ke(()=>ge(t))}function Be(t){return G===null||(G.cleanups===null?G.cleanups=[t]:G.cleanups.push(t)),t}function Es(t,e){const n=G,r=j;G=t,j=null;try{return Ve(e,!0)}catch(i){jn(i)}finally{G=n,j=r}}const[lf,cf]=O(!1);let Is;function ii(){if(this.sources&&this.state)if(this.state===Ae)ft(this);else{const t=Z;Z=null,Ve(()=>Zt(this),!1),Z=t}if(j){const t=this.observers;if(!t||t[t.length-1]!==j){const e=t?t.length:0;j.sources?(j.sources.push(this),j.sourceSlots.push(e)):(j.sources=[this],j.sourceSlots=[e]),t?(t.push(j),this.observerSlots.push(j.sources.length-1)):(this.observers=[j],this.observerSlots=[j.sources.length-1])}}return this.value}function si(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Ve(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=bn&&bn.running;a&&bn.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?Z.push(s):Ie.push(s),s.observers&&oi(s)),a||(s.state=Ae)}if(Z.length>1e6)throw Z=[],new Error},!1)),e}function ft(t){if(!t.fn)return;Et(t);const e=un;Cs(t,t.value,e)}function Cs(t,e,n){let r;const i=G,s=j;j=G=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Ae,t.owned&&t.owned.forEach(Et),t.owned=null),t.updatedAt=n+1,jn(a)}finally{j=s,G=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?si(t,r):t.value=r,t.updatedAt=n)}function dn(t,e,n,r=Ae,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:G,context:G?G.context:null,pure:n};return G===null||G!==ri&&(G.owned?G.owned.push(s):G.owned=[s]),s}function Qt(t){if(t.state===0)return;if(t.state===Xt)return Zt(t);if(t.suspense&&ge(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<un);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Ae)ft(t);else if(t.state===Xt){const r=Z;Z=null,Ve(()=>Zt(t,e[0]),!1),Z=r}}function Ve(t,e){if(Z)return t();let n=!1;e||(Z=[]),Ie?n=!0:Ie=[],un++;try{const r=t();return Ts(n),r}catch(r){n||(Ie=null),Z=null,jn(r)}}function Ts(t){if(Z&&(ai(Z),Z=null),t)return;const e=Ie;Ie=null,e.length&&Ve(()=>ni(e),!1)}function ai(t){for(let e=0;e<t.length;e++)Qt(t[e])}function As(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:Qt(r)}for(e=0;e<n;e++)Qt(t[e])}function Zt(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Ae?r!==e&&(!r.updatedAt||r.updatedAt<un)&&Qt(r):i===Xt&&Zt(r,e)}}}function oi(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=Xt,n.pure?Z.push(n):Ie.push(n),n.observers&&oi(n))}}function Et(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)Et(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)Et(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function Wt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function jn(t,e=G){throw Wt(t)}const Ps=Symbol("fallback");function cr(t){for(let e=0;e<t.length;e++)t[e]()}function xs(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Be(()=>cr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[vs],ge(()=>{let _,b,I,y,v,S,A,T,P;if(c===0)a!==0&&(cr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Ps],i[0]=Ht(E=>(s[0]=E,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=Ht(g);a=c}else{for(I=new Array(c),y=new Array(c),o&&(v=new Array(c)),S=0,A=Math.min(a,c);S<A&&r[S]===l[S];S++);for(A=a-1,T=c-1;A>=S&&T>=S&&r[A]===l[T];A--,T--)I[T]=i[A],y[T]=s[A],o&&(v[T]=o[A]);for(_=new Map,b=new Array(T+1),h=T;h>=S;h--)P=l[h],d=_.get(P),b[h]=d===void 0?-1:d,_.set(P,h);for(d=S;d<=A;d++)P=r[d],h=_.get(P),h!==void 0&&h!==-1?(I[h]=i[d],y[h]=s[d],o&&(v[h]=o[d]),h=b[h],_.set(P,h)):s[d]();for(h=S;h<c;h++)h in I?(i[h]=I[h],s[h]=y[h],o&&(o[h]=v[h],o[h](h))):i[h]=Ht(g);i=i.slice(0,a=c),r=l.slice(0)}return i});function g(_){if(s[h]=_,o){const[b,I]=O(h);return o[h]=I,e(l[h],b)}return e(l[h])}}}function f(t,e){return ge(()=>t(e||{}))}function Ft(){return!0}const Rs={get(t,e,n){return e===Nn?n:t.get(e)},has(t,e){return e===Nn?!0:t.has(e)},set:Ft,deleteProperty:Ft,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:Ft,deleteProperty:Ft}},ownKeys(t){return t.keys()}};function yn(t){return(t=typeof t=="function"?t():t)?t:{}}function Os(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function Ns(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Nn in o,t[a]=typeof o=="function"?(e=!0,Q(o)):o}if(ys&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=yn(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in yn(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys(yn(t[o])));return[...new Set(a)]}},Rs);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let c=l.length-1;c>=0;c--){const d=l[c];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:Os.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const g=n[d];g&&(h.get?g.push(h.get.bind(o)):h.value!==void 0&&g.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const Ds=t=>`Stale read from <${t}>.`;function ie(t){const e="fallback"in t&&{fallback:()=>t.fallback};return Q(xs(()=>t.each,t.children,e||void 0))}function C(t){const e=t.keyed,n=Q(()=>t.when,void 0,void 0),r=e?n:Q(n,void 0,{equals:(i,s)=>!i==!s});return Q(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?ge(()=>s(e?i:()=>{if(!ge(r))throw Ds("Show");return n()})):s}return t.fallback},void 0,void 0)}const q=t=>Q(()=>t());function Ls(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,g=1,_;for(;++h<i&&h<s&&!((_=c.get(e[h]))==null||_!==d+g);)g++;if(g>d-o){const b=e[a];for(;o<d;)t.insertBefore(n[o++],b)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const ur="_$DX_DELEGATE";function Ms(t,e,n,r={}){let i;return Ht(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function m(t,e,n,r){let i;const s=()=>{const o=document.createElement("template");return o.innerHTML=t,o.content.firstChild},a=()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function pe(t,e=window.document){const n=e[ur]||(e[ur]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,Fs))}}function se(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function te(t,e){e==null?t.removeAttribute("class"):t.className=e}function H(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function Je(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function Us(t,e,n){return ge(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return en(t,e,r,n);w(i=>en(t,e(),i,n),r)}function Fs(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function en(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=et(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=et(t,n,r);else{if(s==="function")return w(()=>{let o=e();for(;typeof o=="function";)o=o();n=en(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Dn(o,e,n,i))return w(()=>n=en(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=et(t,n,r),a)return n}else l?n.length===0?dr(t,o,r):Ls(t,n,o):(n&&et(t),dr(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=et(t,n,r,e);et(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Dn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Dn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=Dn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function dr(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function et(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let jt=null;function Bs(t){jt=t}async function ae(t,e={}){if(!jt)return fetch(t,e);const n=new Headers(e.headers??{}),r=await jt(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await jt(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function li(){const t=await ae("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function Vs(){return ae("/api/me")}async function Hs(){const t=await ae("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function Ws(t){const e=await ae("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function js(t){const e=await ae("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function zs(){return await ae("/api/run",{method:"POST"})}async function Gs(){return ae("/api/progress")}async function qs(){const t=await ae("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function hr(t){const e=await ae("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function fr(t){const e=await ae(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function Ks(){const t=await ae("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function Js(t){const e=await ae("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({cash:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function Ys(t){const e=await ae("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const Xs=()=>{};var gr={};/**
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
 */const ci=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Qs=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},ui={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let g=(o&15)<<2|c>>6,_=c&63;l||(_=64,a||(g=64)),r.push(n[d],n[h],n[g],n[_])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(ci(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Qs(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||c==null||h==null)throw new Zs;const g=s<<2|o>>4;if(r.push(g),c!==64){const _=o<<4&240|c>>2;if(r.push(_),h!==64){const b=c<<6&192|h;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Zs extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const ea=function(t){const e=ci(t);return ui.encodeByteArray(e,!0)},di=function(t){return ea(t).replace(/\./g,"")},hi=function(t){try{return ui.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function ta(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const na=()=>ta().__FIREBASE_DEFAULTS__,ra=()=>{if(typeof process>"u"||typeof gr>"u")return;const t=gr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},ia=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&hi(t[1]);return e&&JSON.parse(e)},zn=()=>{try{return Xs()||na()||ra()||ia()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},sa=t=>{var e,n;return(n=(e=zn())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},fi=()=>{var t;return(t=zn())==null?void 0:t.config},gi=t=>{var e;return(e=zn())==null?void 0:e[`_${t}`]};/**
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
 */class pi{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function ee(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function aa(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ee())}function oa(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function la(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function ca(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ua(){const t=ee();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function da(){try{return typeof indexedDB=="object"}catch{return!1}}function ha(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const fa="FirebaseError";class He extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=fa,Object.setPrototypeOf(this,He.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Pt.prototype.create)}}class Pt{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?ga(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new He(i,o,r)}}function ga(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function pa(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function ct(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(pr(s)&&pr(a)){if(!ct(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function pr(t){return t!==null&&typeof t=="object"}/**
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
 */function xt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function bt(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function yt(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function ma(t,e){const n=new _a(t,e);return n.subscribe.bind(n)}class _a{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");ba(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=vn),i.error===void 0&&(i.error=vn),i.complete===void 0&&(i.complete=vn);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function ba(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function vn(){}/**
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
 */function Pe(t){return t&&t._delegate?t._delegate:t}/**
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
 */function Gn(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ya(t){return(await fetch(t,{credentials:"include"})).ok}class ut{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Ge="[DEFAULT]";/**
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
 */class va{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new pi;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Sa(e))try{this.getOrInitializeService({instanceIdentifier:Ge})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Ge){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ge){return this.instances.has(e)}getOptions(e=Ge){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:wa(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Ge){return this.component?this.component.multipleInstances?e:Ge:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function wa(t){return t===Ge?void 0:t}function Sa(t){return t.instantiationMode==="EAGER"}/**
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
 */class $a{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new va(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var W;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(W||(W={}));const ka={debug:W.DEBUG,verbose:W.VERBOSE,info:W.INFO,warn:W.WARN,error:W.ERROR,silent:W.SILENT},Ea=W.INFO,Ia={[W.DEBUG]:"log",[W.VERBOSE]:"log",[W.INFO]:"info",[W.WARN]:"warn",[W.ERROR]:"error"},Ca=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Ia[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class mi{constructor(e){this.name=e,this._logLevel=Ea,this._logHandler=Ca,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in W))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?ka[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,W.DEBUG,...e),this._logHandler(this,W.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,W.VERBOSE,...e),this._logHandler(this,W.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,W.INFO,...e),this._logHandler(this,W.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,W.WARN,...e),this._logHandler(this,W.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,W.ERROR,...e),this._logHandler(this,W.ERROR,...e)}}const Ta=(t,e)=>e.some(n=>t instanceof n);let mr,_r;function Aa(){return mr||(mr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Pa(){return _r||(_r=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const _i=new WeakMap,Ln=new WeakMap,bi=new WeakMap,wn=new WeakMap,qn=new WeakMap;function xa(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Fe(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&_i.set(n,t)}).catch(()=>{}),qn.set(e,t),e}function Ra(t){if(Ln.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Ln.set(t,e)}let Mn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Ln.get(t);if(e==="objectStoreNames")return t.objectStoreNames||bi.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Fe(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Oa(t){Mn=t(Mn)}function Na(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Sn(this),e,...n);return bi.set(r,e.sort?e.sort():[e]),Fe(r)}:Pa().includes(t)?function(...e){return t.apply(Sn(this),e),Fe(_i.get(this))}:function(...e){return Fe(t.apply(Sn(this),e))}}function Da(t){return typeof t=="function"?Na(t):(t instanceof IDBTransaction&&Ra(t),Ta(t,Aa())?new Proxy(t,Mn):t)}function Fe(t){if(t instanceof IDBRequest)return xa(t);if(wn.has(t))return wn.get(t);const e=Da(t);return e!==t&&(wn.set(t,e),qn.set(e,t)),e}const Sn=t=>qn.get(t);function La(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Fe(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Fe(a.result),l.oldVersion,l.newVersion,Fe(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const Ma=["get","getKey","getAll","getAllKeys","count"],Ua=["put","add","delete","clear"],$n=new Map;function br(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if($n.get(e))return $n.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Ua.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Ma.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(o.shift())),(await Promise.all([c[n](...o),i&&l.done]))[0]};return $n.set(e,s),s}Oa(t=>({...t,get:(e,n,r)=>br(e,n)||t.get(e,n,r),has:(e,n)=>!!br(e,n)||t.has(e,n)}));/**
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
 */class Fa{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Ba(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Ba(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Un="@firebase/app",yr="0.16.1";/**
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
 */const Ce=new mi("@firebase/app"),Va="@firebase/app-compat",Ha="@firebase/analytics-compat",Wa="@firebase/analytics",ja="@firebase/app-check-compat",za="@firebase/app-check",Ga="@firebase/auth",qa="@firebase/auth-compat",Ka="@firebase/database",Ja="@firebase/data-connect",Ya="@firebase/database-compat",Xa="@firebase/functions",Qa="@firebase/functions-compat",Za="@firebase/installations",eo="@firebase/installations-compat",to="@firebase/messaging",no="@firebase/messaging-compat",ro="@firebase/performance",io="@firebase/performance-compat",so="@firebase/remote-config",ao="@firebase/remote-config-compat",oo="@firebase/storage",lo="@firebase/storage-compat",co="@firebase/firestore",uo="@firebase/ai",ho="@firebase/firestore-compat",fo="firebase",go="12.18.0";/**
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
 */const Fn="[DEFAULT]",po={[Un]:"fire-core",[Va]:"fire-core-compat",[Wa]:"fire-analytics",[Ha]:"fire-analytics-compat",[za]:"fire-app-check",[ja]:"fire-app-check-compat",[Ga]:"fire-auth",[qa]:"fire-auth-compat",[Ka]:"fire-rtdb",[Ja]:"fire-data-connect",[Ya]:"fire-rtdb-compat",[Xa]:"fire-fn",[Qa]:"fire-fn-compat",[Za]:"fire-iid",[eo]:"fire-iid-compat",[to]:"fire-fcm",[no]:"fire-fcm-compat",[ro]:"fire-perf",[io]:"fire-perf-compat",[so]:"fire-rc",[ao]:"fire-rc-compat",[oo]:"fire-gcs",[lo]:"fire-gcs-compat",[co]:"fire-fst",[ho]:"fire-fst-compat",[uo]:"fire-vertex","fire-js":"fire-js",[fo]:"fire-js-all"};/**
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
 */const tn=new Map,mo=new Map,Bn=new Map;function vr(t,e){try{t.container.addComponent(e)}catch(n){Ce.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function It(t){const e=t.name;if(Bn.has(e))return Ce.debug(`There were multiple attempts to register component ${e}.`),!1;Bn.set(e,t);for(const n of tn.values())vr(n,t);for(const n of mo.values())vr(n,t);return!0}function yi(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function re(t){return t==null?!1:t.settings!==void 0}/**
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
 */const _o={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Se=new Pt("app","Firebase",_o);/**
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
 */class bo{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new ut("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Se.create("app-deleted",{appName:this._name})}}/**
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
 */const Rt=go;function vi(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Fn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw Se.create("bad-app-name",{appName:String(i)});if(n||(n=fi()),!n)throw Se.create("no-options");const s=tn.get(i);if(s)if(ct(n,s.options)){if(ct(r,s.config))return s;throw Se.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw Se.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new $a(i);for(const l of Bn.values())a.addComponent(l);const o=new bo(n,r,a);return tn.set(i,o),o}function yo(t=Fn){const e=tn.get(t);if(!e&&t===Fn&&fi())return vi();if(!e)throw Se.create("no-app",{appName:t});return e}function rt(t,e,n){let r=po[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ce.warn(a.join(" "));return}It(new ut(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const vo="firebase-heartbeat-database",wo=1,Ct="firebase-heartbeat-store";let kn=null;function wi(){return kn||(kn=La(vo,wo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Ct)}catch(n){console.warn(n)}}}}).catch(t=>{throw Se.create("idb-open",{originalErrorMessage:t.message})})),kn}async function So(t){try{const n=(await wi()).transaction(Ct),r=await n.objectStore(Ct).get(Si(t));return await n.done,r}catch(e){if(e instanceof He)Ce.warn(e.message);else{const n=Se.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ce.warn(n.message)}}}async function wr(t,e){try{const r=(await wi()).transaction(Ct,"readwrite");await r.objectStore(Ct).put(e,Si(t)),await r.done}catch(n){if(n instanceof He)Ce.warn(n.message);else{const r=Se.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Ce.warn(r.message)}}}function Si(t){return`${t.name}!${t.options.appId}`}/**
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
 */const $o=1024,ko=30;class Eo{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Co(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Sr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>ko){const a=To(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Ce.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Sr(),{heartbeatsToSend:r,unsentEntries:i}=Io(this._heartbeatsCache.heartbeats),s=di(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Ce.warn(n),""}}}function Sr(){return new Date().toISOString().substring(0,10)}function Io(t,e=$o){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),$r(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),$r(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Co{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return da()?ha().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await So(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return wr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return wr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function $r(t){return di(JSON.stringify({version:2,heartbeats:t})).length}function To(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function Ao(t){It(new ut("platform-logger",e=>new Fa(e),"PRIVATE")),It(new ut("heartbeat",e=>new Eo(e),"PRIVATE")),rt(Un,yr,t),rt(Un,yr,"esm2020"),rt("fire-js","")}/**
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
 */Ao("");var Po="firebase",xo="12.18.0";/**
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
 */rt(Po,xo,"app");function $i(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Ro=$i,ki=new Pt("auth","Firebase",$i());/**
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
 */const nn=new mi("@firebase/auth");function Ei(t,...e){nn.logLevel<=W.WARN&&nn.warn(`Auth (${Rt}): ${t}`,...e)}function zt(t,...e){nn.logLevel<=W.ERROR&&nn.error(`Auth (${Rt}): ${t}`,...e)}/**
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
 */function le(t,...e){throw Jn(t,...e)}function he(t,...e){return Jn(t,...e)}function Kn(t,e,n){const r={...Ro(),[e]:n};return new Pt("auth","Firebase",r).create(e,{appName:t.name})}function be(t){return Kn(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ii(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&le(t,"argument-error"),Kn(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Jn(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return ki.create(t,...e)}function L(t,e,...n){if(!t)throw Jn(e,...n)}function $e(t){const e="INTERNAL ASSERTION FAILED: "+t;throw zt(e),new Error(e)}function Te(t,e){t||$e(e)}/**
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
 */function Vn(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function Oo(){return kr()==="http:"||kr()==="https:"}function kr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
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
 */function No(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Oo()||la()||"connection"in navigator)?navigator.onLine:!0}function Do(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
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
 */class Ot{constructor(e,n){this.shortDelay=e,this.longDelay=n,Te(n>e,"Short delay should be less than long delay!"),this.isMobile=aa()||ca()}get(){return No()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Yn(t,e){Te(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
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
 */class Ci{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;$e("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;$e("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;$e("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const Lo={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const Mo=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Uo=new Ot(3e4,6e4);function We(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function je(t,e,n,r,i={}){return Ti(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=xt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:l,...s};return oa()||(c.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&Gn(t.emulatorConfig.host)&&(c.credentials="include"),Ci.fetch()(await Ai(t,t.config.apiHost,n,o),c)})}async function Ti(t,e,n){t._canInitEmulator=!1;const r={...Lo,...e};try{const i=new Bo(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Bt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,c]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Bt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Bt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Bt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw Kn(t,d,c);le(t,d)}}catch(i){if(i instanceof He)throw i;le(t,"network-request-failed",{message:String(i)})}}async function Nt(t,e,n,r,i={}){const s=await je(t,e,n,r,i);return"mfaPendingCredential"in s&&le(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function Ai(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?Yn(t.config,i):`${t.config.apiScheme}://${i}`;return Mo.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function Fo(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Bo{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(he(this.auth,"network-request-failed")),Uo.get())})}}function Bt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=he(t,e,r);return i.customData._tokenResponse=n,i}function Er(t){return t!==void 0&&t.enterprise!==void 0}class Vo{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Fo(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Ho(t,e){return je(t,"GET","/v2/recaptchaConfig",We(t,e))}/**
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
 */async function Wo(t,e){return je(t,"POST","/v1/accounts:delete",e)}async function rn(t,e){return je(t,"POST","/v1/accounts:lookup",e)}/**
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
 */function $t(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function jo(t,e=!1){const n=Pe(t),r=await n.getIdToken(e),i=Xn(r);L(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:$t(En(i.auth_time)),issuedAtTime:$t(En(i.iat)),expirationTime:$t(En(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function En(t){return Number(t)*1e3}function Xn(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return zt("JWT malformed, contained fewer than 3 sections"),null;try{const i=hi(n);return i?JSON.parse(i):(zt("Failed to decode base64 JWT payload"),null)}catch(i){return zt("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Ir(t){const e=Xn(t);return L(e,"internal-error"),L(typeof e.exp<"u","internal-error"),L(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Tt(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof He&&zo(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function zo({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
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
 */class Go{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Hn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=$t(this.lastLoginAt),this.creationTime=$t(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function sn(t){var h;const e=t.auth,n=await t.getIdToken(),r=await Tt(t,rn(e,{idToken:n}));L(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?Pi(i.providerUserInfo):[],a=Ko(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),c=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Hn(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function qo(t){const e=Pe(t);await sn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Ko(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Pi(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
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
 */async function Jo(t,e){const n=await Ti(t,{},async()=>{const r=xt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await Ai(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&Gn(t.emulatorConfig.host)&&(l.credentials="include"),Ci.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Yo(t,e){return je(t,"POST","/v2/accounts:revokeToken",We(t,e))}/**
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
 */class it{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){L(e.idToken,"internal-error"),L(typeof e.idToken<"u","internal-error"),L(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ir(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){L(e.length!==0,"internal-error");const n=Ir(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(L(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await Jo(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new it;return r&&(L(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(L(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(L(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new it,this.toJSON())}_performRefresh(){return $e("not implemented")}}/**
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
 */function Ne(t,e){L(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class de{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Go(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Hn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Tt(this,this.stsTokenManager.getToken(this.auth,e));return L(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return jo(this,e)}reload(){return qo(this)}_assign(e){this!==e&&(L(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new de({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){L(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await sn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(re(this.auth.app))return Promise.reject(be(this.auth));const e=await this.getIdToken();return await Tt(this,Wo(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,c=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:g,isAnonymous:_,providerData:b,stsTokenManager:I}=n;L(h&&I,e,"internal-error");const y=it.fromJSON(this.name,I);L(typeof h=="string",e,"internal-error"),Ne(r,e.name),Ne(i,e.name),L(typeof g=="boolean",e,"internal-error"),L(typeof _=="boolean",e,"internal-error"),Ne(s,e.name),Ne(a,e.name),Ne(o,e.name),Ne(l,e.name),Ne(c,e.name),Ne(d,e.name);const v=new de({uid:h,auth:e,email:i,emailVerified:g,displayName:r,isAnonymous:_,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:y,createdAt:c,lastLoginAt:d});return b&&Array.isArray(b)&&(v.providerData=b.map(S=>({...S}))),l&&(v._redirectEventId=l),v}static async _fromIdTokenResponse(e,n,r=!1){const i=new it;i.updateFromServerResponse(n);const s=new de({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await sn(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];L(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Pi(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new it;o.updateFromIdToken(r);const l=new de({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Hn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
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
 */const Cr=new Map;function ke(t){Te(t instanceof Function,"Expected a class definition");let e=Cr.get(t);return e?(Te(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Cr.set(t,e),e)}/**
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
 */class xi{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}xi.type="NONE";const Tr=xi;/**
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
 */function Gt(t,e,n){return`firebase:${t}:${e}:${n}`}class st{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Gt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Gt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await rn(this.auth,{idToken:e}).catch(()=>{});return n?de._fromGetAccountInfoResponse(this.auth,n,e):null}return de._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new st(ke(Tr),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||ke(Tr);const a=Gt(r,e.config.apiKey,e.name);let o=null;for(const c of n)try{const d=await c._get(a);if(d){let h;if(typeof d=="string"){const g=await rn(e,{idToken:d}).catch(()=>{});if(!g)break;h=await de._fromGetAccountInfoResponse(e,g,d)}else h=de._fromJSON(e,d);c!==s&&(o=h),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new st(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(a)}catch{}})),new st(s,e,r))}}/**
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
 */function Ar(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Di(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ri(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Mi(e))return"Blackberry";if(Ui(e))return"Webos";if(Oi(e))return"Safari";if((e.includes("chrome/")||Ni(e))&&!e.includes("edge/"))return"Chrome";if(Li(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Ri(t=ee()){return/firefox\//i.test(t)}function Oi(t=ee()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ni(t=ee()){return/crios\//i.test(t)}function Di(t=ee()){return/iemobile/i.test(t)}function Li(t=ee()){return/android/i.test(t)}function Mi(t=ee()){return/blackberry/i.test(t)}function Ui(t=ee()){return/webos/i.test(t)}function Qn(t=ee()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Xo(t=ee()){var e;return Qn(t)&&!!((e=window.navigator)!=null&&e.standalone)}function Qo(){return ua()&&document.documentMode===10}function Fi(t=ee()){return Qn(t)||Li(t)||Ui(t)||Mi(t)||/windows phone/i.test(t)||Di(t)}/**
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
 */function Bi(t,e=[]){let n;switch(t){case"Browser":n=Ar(ee());break;case"Worker":n=`${Ar(ee())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Rt}/${r}`}/**
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
 */class Zo{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function el(t,e={}){return je(t,"GET","/v2/passwordPolicy",We(t,e))}/**
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
 */const tl=6;class nl{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??tl,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
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
 */class rl{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Pr(this),this.idTokenSubscription=new Pr(this),this.beforeStateQueue=new Zo(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ki,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=ke(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await st.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await rn(this,{idToken:e}),r=await de._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(re(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return L(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await sn(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Do()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(re(this.app))return Promise.reject(be(this));const n=e?Pe(e):null;return n&&L(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&L(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return re(this.app)?Promise.reject(be(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return re(this.app)?Promise.reject(be(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ke(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await el(this),n=new nl(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Pt("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Yo(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&ke(e)||this._popupRedirectResolver;L(n,this,"argument-error"),this.redirectPersistenceManager=await st.create(this,[ke(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(L(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return L(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Bi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(re(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&Ei(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function xe(t){return Pe(t)}class Pr{constructor(e){this.auth=e,this.observer=null,this.addObserver=ma(n=>this.observer=n)}get next(){return L(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let hn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function il(t){hn=t}function Vi(t){return hn.loadJS(t)}function sl(){return hn.recaptchaEnterpriseScript}function al(){return hn.gapiScript}function ol(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class ll{constructor(){this.enterprise=new cl}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class cl{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
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
 */const ul="recaptcha-enterprise",Hi="NO_RECAPTCHA",xr="onFirebaseAuthREInstanceReady";class De{constructor(e){this.type=ul,this.auth=xe(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{Ho(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const c=new Vo(l);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,a(c.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;Er(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(c=>{a(c)}).catch(()=>{a(Hi)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new ll().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&Er(window.grecaptcha)&&De.scriptInjectionDeferred)await De.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=sl();l.length!==0&&(l+=o+`&onload=${xr}`),De.scriptInjectionDeferred=new pi,window[xr]=()=>{var c;(c=De.scriptInjectionDeferred)==null||c.resolve()},Vi(l).then(()=>{var c;return(c=De.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{i(o,s,a)}).catch(c=>{a(c)})}}).catch(o=>{a(o)})})}}De.scriptInjectionDeferred=null;async function Rr(t,e,n,r=!1,i=!1){const s=new De(t);let a;if(i)a=Hi;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,c=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Wn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Rr(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Rr(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
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
 */function dl(t,e){const n=yi(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(ct(s,e??{}))return i;le(i,"already-initialized")}return n.initialize({options:e})}function hl(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(ke);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function fl(t,e,n){const r=xe(t);L(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Wi(e),{host:a,port:o}=gl(e),l=o===null?"":`:${o}`,c={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){L(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),L(ct(c,r.config.emulator)&&ct(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,Gn(a)?ya(`${s}//${a}${l}`):pl()}function Wi(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function gl(t){const e=Wi(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Or(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Or(a)}}}function Or(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function pl(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
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
 */class Zn{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return $e("not implemented")}_getIdTokenResponse(e){return $e("not implemented")}_linkToIdToken(e,n){return $e("not implemented")}_getReauthenticationResolver(e){return $e("not implemented")}}async function ml(t,e){return je(t,"POST","/v1/accounts:signUp",e)}/**
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
 */async function _l(t,e){return Nt(t,"POST","/v1/accounts:signInWithPassword",We(t,e))}/**
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
 */async function bl(t,e){return Nt(t,"POST","/v1/accounts:signInWithEmailLink",We(t,e))}async function yl(t,e){return Nt(t,"POST","/v1/accounts:signInWithEmailLink",We(t,e))}/**
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
 */class At extends Zn{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new At(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new At(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Wn(e,n,"signInWithPassword",_l);case"emailLink":return bl(e,{email:this._email,oobCode:this._password});default:le(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Wn(e,r,"signUpPassword",ml);case"emailLink":return yl(e,{idToken:n,email:this._email,oobCode:this._password});default:le(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function at(t,e){return Nt(t,"POST","/v1/accounts:signInWithIdp",We(t,e))}/**
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
 */const vl="http://localhost";class Xe extends Zn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Xe(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):le("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new Xe(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return at(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,at(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,at(e,n)}buildRequest(){const e={requestUri:vl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=xt(n)}return e}}/**
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
 */function wl(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Sl(t){const e=bt(yt(t)).link,n=e?bt(yt(e)).deep_link_id:null,r=bt(yt(t)).deep_link_id;return(r?bt(yt(r)).link:null)||r||n||e||t}class er{constructor(e){const n=bt(yt(e)),r=n.apiKey??null,i=n.oobCode??null,s=wl(n.mode??null);L(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=Sl(e);try{return new er(n)}catch{return null}}}/**
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
 */class gt{constructor(){this.providerId=gt.PROVIDER_ID}static credential(e,n){return At._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=er.parseLink(n);return L(r,"argument-error"),At._fromEmailAndCode(e,r.code,r.tenantId)}}gt.PROVIDER_ID="password";gt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";gt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class fn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Dt extends fn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Le extends Dt{constructor(){super("facebook.com")}static credential(e){return Xe._fromParams({providerId:Le.PROVIDER_ID,signInMethod:Le.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Le.credentialFromTaggedObject(e)}static credentialFromError(e){return Le.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Le.credential(e.oauthAccessToken)}catch{return null}}}Le.FACEBOOK_SIGN_IN_METHOD="facebook.com";Le.PROVIDER_ID="facebook.com";/**
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
 */class we extends Dt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Xe._fromParams({providerId:we.PROVIDER_ID,signInMethod:we.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return we.credentialFromTaggedObject(e)}static credentialFromError(e){return we.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return we.credential(n,r)}catch{return null}}}we.GOOGLE_SIGN_IN_METHOD="google.com";we.PROVIDER_ID="google.com";/**
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
 */class Me extends Dt{constructor(){super("github.com")}static credential(e){return Xe._fromParams({providerId:Me.PROVIDER_ID,signInMethod:Me.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Me.credentialFromTaggedObject(e)}static credentialFromError(e){return Me.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Me.credential(e.oauthAccessToken)}catch{return null}}}Me.GITHUB_SIGN_IN_METHOD="github.com";Me.PROVIDER_ID="github.com";/**
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
 */class Ue extends Dt{constructor(){super("twitter.com")}static credential(e,n){return Xe._fromParams({providerId:Ue.PROVIDER_ID,signInMethod:Ue.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Ue.credentialFromTaggedObject(e)}static credentialFromError(e){return Ue.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Ue.credential(n,r)}catch{return null}}}Ue.TWITTER_SIGN_IN_METHOD="twitter.com";Ue.PROVIDER_ID="twitter.com";/**
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
 */async function $l(t,e){return Nt(t,"POST","/v1/accounts:signUp",We(t,e))}/**
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
 */class Qe{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await de._fromIdTokenResponse(e,r,i),a=Nr(r);return new Qe({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Nr(r);return new Qe({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Nr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
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
 */class an extends He{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,an.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new an(e,n,r,i)}}function ji(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?an._fromErrorAndOperation(t,s,e,r):s})}async function kl(t,e,n=!1){const r=await Tt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Qe._forOperation(t,"link",r)}/**
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
 */async function El(t,e,n=!1){const{auth:r}=t;if(re(r.app))return Promise.reject(be(r));const i="reauthenticate";try{const s=await Tt(t,ji(r,i,e,t),n);L(s.idToken,r,"internal-error");const a=Xn(s.idToken);L(a,r,"internal-error");const{sub:o}=a;return L(t.uid===o,r,"user-mismatch"),Qe._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&le(r,"user-mismatch"),s}}/**
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
 */async function zi(t,e,n=!1){if(re(t.app))return Promise.reject(be(t));const r="signIn",i=await ji(t,r,e),s=await Qe._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Il(t,e){return zi(xe(t),e)}/**
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
 */async function Gi(t){const e=xe(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Cl(t,e,n){if(re(t.app))return Promise.reject(be(t));const r=xe(t),a=await Wn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",$l).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Gi(t),l}),o=await Qe._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function Tl(t,e,n){return re(t.app)?Promise.reject(be(t)):Il(Pe(t),gt.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Gi(t),r})}function Al(t,e,n,r){return Pe(t).onIdTokenChanged(e,n,r)}function Pl(t,e,n){return Pe(t).beforeAuthStateChanged(e,n)}function xl(t,e,n,r){return Pe(t).onAuthStateChanged(e,n,r)}function Rl(t){return Pe(t).signOut()}const on="__sak";/**
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
 */class qi{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(on,"1"),this.storage.removeItem(on),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const Ol=1e3,Nl=10;class Ki extends qi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Fi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);Qo()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Nl):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Ol)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ki.type="LOCAL";const Dl=Ki;/**
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
 */class Ji extends qi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Ji.type="SESSION";const Yi=Ji;/**
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
 */function Ll(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class gn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new gn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async c=>c(n.origin,s)),l=await Ll(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}gn.receivers=[];/**
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
 */class Ml{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const c=tr("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const g=h;if(g.data.eventId===c)switch(g.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(g.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function ye(){return window}function Ul(t){ye().location.href=t}/**
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
 */function Xi(){return typeof ye().WorkerGlobalScope<"u"&&typeof ye().importScripts=="function"}async function Fl(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Bl(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function Vl(){return Xi()?self:null}/**
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
 */const Qi="firebaseLocalStorageDb",Hl=1,ln="firebaseLocalStorage",Zi="fbase_key";class Lt{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function pn(t,e){return t.transaction([ln],e?"readwrite":"readonly").objectStore(ln)}function Wl(){const t=indexedDB.deleteDatabase(Qi);return new Lt(t).toPromise()}function es(){const t=indexedDB.open(Qi,Hl);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(ln,{keyPath:Zi})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(ln)?e(r):(r.close(),await Wl(),e(await es()))})})}async function Dr(t,e,n){const r=pn(t,!0).put({[Zi]:e,value:n});return new Lt(r).toPromise()}async function jl(t,e){const n=pn(t,!1).get(e),r=await new Lt(n).toPromise();return r===void 0?null:r.value}function Lr(t,e){const n=pn(t,!0).delete(e);return new Lt(n).toPromise()}const zl=800,Gl=3;class ts{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=es(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>Gl)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Xi()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=gn._getInstance(Vl()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await Fl(),!this.activeServiceWorker)return;this.sender=new Ml(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Bl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Dr(e,on,"1"),await Lr(e,on)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Dr(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>jl(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Lr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=pn(i,!1).getAll();return new Lt(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||Ei(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),zl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}ts.type="LOCAL";const ql=ts;new Ot(3e4,6e4);/**
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
 */function nr(t,e){return e?ke(e):(L(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class rr extends Zn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return at(e,this._buildIdpRequest())}_linkToIdToken(e,n){return at(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return at(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Kl(t){return zi(t.auth,new rr(t),t.bypassAuthState)}function Jl(t){const{auth:e,user:n}=t;return L(n,e,"internal-error"),El(n,new rr(t),t.bypassAuthState)}async function Yl(t){const{auth:e,user:n}=t;return L(n,e,"internal-error"),kl(n,new rr(t),t.bypassAuthState)}/**
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
 */class ns{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Kl;case"linkViaPopup":case"linkViaRedirect":return Yl;case"reauthViaPopup":case"reauthViaRedirect":return Jl;default:le(this.auth,"internal-error")}}resolve(e){Te(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Te(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Xl=new Ot(2e3,1e4);async function Ql(t,e,n){if(re(t.app))return Promise.reject(he(t,"operation-not-supported-in-this-environment"));const r=xe(t);Ii(t,e,fn);const i=nr(r,n);return new qe(r,"signInViaPopup",e,i).executeNotNull()}class qe extends ns{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,qe.currentPopupAction&&qe.currentPopupAction.cancel(),qe.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return L(e,this.auth,"internal-error"),e}async onExecution(){Te(this.filter.length===1,"Popup operations only handle one event");const e=tr();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(he(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(he(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,qe.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(he(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Xl.get())};e()}}qe.currentPopupAction=null;/**
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
 */const Zl="pendingRedirect",qt=new Map;class ec extends ns{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=qt.get(this.auth._key());if(!e){try{const r=await tc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}qt.set(this.auth._key(),e)}return this.bypassAuthState||qt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function tc(t,e){const n=is(e),r=rs(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function nc(t,e){return rs(t)._set(is(e),"true")}function rc(t,e){qt.set(t._key(),e)}function rs(t){return ke(t._redirectPersistence)}function is(t){return Gt(Zl,t.config.apiKey,t.name)}/**
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
 */function ic(t,e,n){return sc(t,e,n)}async function sc(t,e,n){if(re(t.app))return Promise.reject(be(t));const r=xe(t);Ii(t,e,fn),await r._initializationPromise;const i=nr(r,n);return await nc(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function ac(t,e,n=!1){if(re(t.app))return Promise.reject(be(t));const r=xe(t),i=nr(r,e),a=await new ec(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
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
 */const oc=600*1e3;class lc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!cc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!ss(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(he(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=oc&&this.cachedEventUids.clear(),this.cachedEventUids.has(Mr(e))}saveEventToCache(e){this.cachedEventUids.add(Mr(e)),this.lastProcessedEventTime=Date.now()}}function Mr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function ss({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function cc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ss(t);default:return!1}}/**
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
 */async function uc(t,e={}){return je(t,"GET","/v1/projects",e)}/**
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
 */const dc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,hc=/^https?/;async function fc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await uc(t);for(const n of e)try{if(gc(n))return}catch{}le(t,"unauthorized-domain")}function gc(t){const e=Vn(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!hc.test(n))return!1;if(dc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const pc=new Ot(3e4,6e4);function Ur(){const t=ye().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function mc(t){return new Promise((e,n)=>{var i,s,a;function r(){Ur(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ur(),n(he(t,"network-request-failed"))},timeout:pc.get()})}if((s=(i=ye().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=ye().gapi)!=null&&a.load)r();else{const o=ol("iframefcb");return ye()[o]=()=>{gapi.load?r():n(he(t,"network-request-failed"))},Vi(`${al()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw Kt=null,e})}let Kt=null;function _c(t){return Kt=Kt||mc(t),Kt}/**
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
 */const bc=new Ot(5e3,15e3),yc="__/auth/iframe",vc="emulator/auth/iframe",wc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Sc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function $c(t){const e=t.config;L(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Yn(e,vc):`https://${t.config.authDomain}/${yc}`,r={apiKey:e.apiKey,appName:t.name,v:Rt},i=Sc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${xt(r).slice(1)}`}async function kc(t){const e=await _c(t),n=ye().gapi;return L(n,t,"internal-error"),e.open({where:document.body,url:$c(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:wc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=he(t,"network-request-failed"),o=ye().setTimeout(()=>{s(a)},bc.get());function l(){ye().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
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
 */const Ec={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Ic=500,Cc=600,Tc="_blank",Ac="http://localhost";class Fr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Pc(t,e,n,r=Ic,i=Cc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...Ec,width:r.toString(),height:i.toString(),top:s,left:a},c=ee().toLowerCase();n&&(o=Ni(c)?Tc:n),Ri(c)&&(e=e||Ac,l.scrollbars="yes");const d=Object.entries(l).reduce((g,[_,b])=>`${g}${_}=${b},`,"");if(Xo(c)&&o!=="_self")return xc(e||"",o),new Fr(null);const h=window.open(e||"",o,d);L(h,t,"popup-blocked");try{h.focus()}catch{}return new Fr(h)}function xc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const Rc="__/auth/handler",Oc="emulator/auth/handler",Nc=encodeURIComponent("fac");async function Br(t,e,n,r,i,s){L(t.config.authDomain,t,"auth-domain-config-required"),L(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Rt,eventId:i};if(e instanceof fn){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",pa(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Dt){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),c=l?`#${Nc}=${encodeURIComponent(l)}`:"";return`${Dc(t)}?${xt(o).slice(1)}${c}`}function Dc({config:t}){return t.emulator?Yn(t,Oc):`https://${t.authDomain}/${Rc}`}/**
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
 */const In="webStorageSupport";class Lc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Yi,this._completeRedirectFn=ac,this._overrideRedirectResult=rc}async _openPopup(e,n,r,i){var a;Te((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Br(e,n,r,Vn(),i);return Pc(e,s,tr())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Br(e,n,r,Vn(),i);return Ul(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Te(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await kc(e),r=new lc(e);return n.register("authEvent",i=>(L(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(In,{type:In},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[In];s!==void 0&&n(!!s),le(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=fc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Fi()||Oi()||Qn()}}const Mc=Lc;var Vr="@firebase/auth",Hr="1.13.5";/**
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
 */class Uc{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){L(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function Fc(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Bc(t){It(new ut("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;L(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Bi(t)},c=new rl(r,i,s,l);return hl(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),It(new ut("auth-internal",e=>{const n=xe(e.getProvider("auth").getImmediate());return(r=>new Uc(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),rt(Vr,Hr,Fc(t)),rt(Vr,Hr,"esm2020")}/**
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
 */const Vc=300,Hc=gi("authIdTokenMaxAge")||Vc;let Wr=null;const Wc=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Hc)return;const i=n==null?void 0:n.token;Wr!==i&&(Wr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function jc(t=yo()){const e=yi(t,"auth");if(e.isInitialized())return e.getImmediate();const n=dl(t,{popupRedirectResolver:Mc,persistence:[ql,Dl,Yi]}),r=gi("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=Wc(s.toString());Pl(n,a,()=>a(n.currentUser)),Al(n,o=>a(o))}}const i=sa("auth");return i&&fl(n,`http://${i}`),n}function zc(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}il({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=he("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",zc().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Bc("Browser");const Gc={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},ve=Gc,dt=!!ve.VITE_FIREBASE_APP_ID;let Cn=null;function tt(){if(!dt)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!Cn){const t=vi({apiKey:ve.VITE_FIREBASE_API_KEY,authDomain:ve.VITE_FIREBASE_AUTH_DOMAIN,projectId:ve.VITE_FIREBASE_PROJECT_ID,appId:ve.VITE_FIREBASE_APP_ID,...ve.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:ve.VITE_FIREBASE_STORAGE_BUCKET},...ve.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:ve.VITE_FIREBASE_MESSAGING_SENDER_ID}});Cn=jc(t)}return Cn}function jr(){return new we}async function zr(){if(!dt)return;const t=tt();t.currentUser&&await Rl(t)}var qc=m(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),Kc=m('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),Jc=m("<button type=button class=gate-toggle>"),Yc=m("<div class=gate-or>── or ──"),Xc=m("<button type=button class=btn>Continue with Google"),Qc=m("<div class=gate-error role=alert>"),Zc=m("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),eu=m("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),tu=m("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const nu={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Gr(t){const e=(t==null?void 0:t.code)??"";return nu[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function ru(t){return(()=>{var e=qc(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),H(l,"click",t.onSignOut),e})()}function iu(){const[t,e]=O("signin"),[n,r]=O(""),[i,s]=O(""),[a,o]=O(!1),[l,c]=O("");Bs(async g=>{if(!dt)return null;const _=tt().currentUser;return _?await _.getIdToken(g):null});async function d(g){if(g.preventDefault(),!a()){o(!0),c("");try{const _=tt();t()==="create"?await Cl(_,n(),i()):await Tl(_,n(),i())}catch(_){c(Gr(_))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await Ql(tt(),jr())}catch(g){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(g==null?void 0:g.code)){await ic(tt(),jr());return}c(Gr(g))}finally{o(!1)}}}return(()=>{var g=Zc(),_=g.firstChild;return _.firstChild,u(_,f(C,{when:dt,get fallback(){return[eu(),tu()]},get children(){return[(()=>{var b=Kc(),I=b.firstChild,y=I.firstChild,v=y.nextSibling,S=I.nextSibling,A=S.firstChild,T=A.nextSibling,P=S.nextSibling;return b.addEventListener("submit",d),v.$$input=E=>r(E.currentTarget.value),T.$$input=E=>s(E.currentTarget.value),u(P,(()=>{var E=q(()=>!!a());return()=>E()?"Working…":t()==="create"?"Create account":"Sign in"})()),w(E=>{var D=t()==="create"?"new-password":"current-password",x=a();return D!==E.e&&se(T,"autocomplete",E.e=D),x!==E.t&&(P.disabled=E.t=x),E},{e:void 0,t:void 0}),w(()=>v.value=n()),w(()=>T.value=i()),b})(),(()=>{var b=Jc();return b.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(b,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),w(()=>b.disabled=a()),b})(),Yc(),(()=>{var b=Xc();return b.$$click=h,w(()=>b.disabled=a()),b})(),f(C,{get when(){return l()},get children(){var b=Qc();return u(b,l),b}})]}}),null),g})()}pe(["click","input"]);var su=m("<div class=gate-error role=alert>"),au=m("<p class=gate-note>No grant-file entries yet."),ou=m("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),lu=m('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),cu=m("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function uu(t){const[e,n]=O([]),[r,i]=O([]),[s,a]=O(""),[o,l]=O(!1),[c,d]=O(""),h=y=>{n((y==null?void 0:y.file_grants)??[]),i((y==null?void 0:y.static_emails)??[])};lt(async()=>{try{h(await Hs())}catch{d("Could not load the grant list.")}});const _=y=>{y.key==="Escape"&&t.onClose()};lt(()=>{window.addEventListener("keydown",_),Be(()=>window.removeEventListener("keydown",_));const y=document.querySelector(".access-add input");y==null||y.focus()});const b=async y=>{if(y.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await Ws(s())),a("")}catch(v){d(v.message)}l(!1)}},I=async y=>{if(!o()){l(!0),d("");try{h(await js(y))}catch(v){d(v.message)}l(!1)}};return(()=>{var y=lu(),v=y.firstChild,S=v.firstChild,A=S.nextSibling,T=A.nextSibling,P=T.firstChild,E=P.nextSibling,D=T.nextSibling;return H(y,"click",t.onClose),v.$$click=x=>x.stopPropagation(),u(v,f(C,{get when(){return c()},get children(){var x=su();return u(x,c),x}}),T),u(v,f(ie,{get each(){return e()},children:x=>(()=>{var M=cu(),p=M.firstChild,k=p.nextSibling;return u(p,x),k.$$click=()=>I(x),se(k,"title",`Remove ${x}`),se(k,"aria-label",`Remove ${x}`),w(()=>k.disabled=o()),M})()}),T),u(v,f(C,{get when(){return e().length===0},get children(){return au()}}),T),T.addEventListener("submit",b),P.$$input=x=>a(x.currentTarget.value),u(E,()=>o()?"…":"Add"),u(v,f(C,{get when(){return r().length>0},get children(){var x=ou();return x.firstChild,u(x,()=>r().join(", "),null),x}}),D),H(D,"click",t.onClose),w(()=>E.disabled=o()),w(()=>P.value=s()),y})()}pe(["click","input"]);const Ee=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),kt=(t,e,n)=>Math.min(n,Math.max(e,t));function du(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:kt((n-t)/r,0,1)}function hu(t,e,n,r,i=Ee){if(n<i.minRateOfReturn||t<=0)return null;const s=kt(t/2,0,1),a=kt(e,0,1),o=Math.min(n/i.idealReturn,1),l=kt((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function fu(t,e=Ee){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?kt(1+t.delta,0,1):du(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),hu(r,a,n,i,e)}function gu(t,e=Ee.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function pu(t){return t.weightSharpe===Ee.weightSharpe&&t.weightSafety===Ee.weightSafety&&t.weightReturn===Ee.weightReturn&&t.minRateOfReturn===Ee.minRateOfReturn}var mu=m("<span class=hint>production defaults · drag to re-rank live"),_u=m("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),bu=m('<span class="hint hint-custom">custom weights'),yu=m("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function vu(){const[t,e]=O({...Ee});return{params:t,isCustom:()=>!pu(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Ee})}}const wu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function Su(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=_u(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(C,{get when(){return!e()},get fallback(){return bu()},get children(){return mu()}}),null),u(s,f(ie,{each:wu,children:o=>(()=>{var l=yu(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,g=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(C,{get when(){return o.weight},get children(){return[" ","· ",q(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),g.$$input=_=>t.scoring.setParam(o.key,Number(_.currentTarget.value)),w(_=>{var b=o.max,I=o.step;return b!==_.e&&se(g,"max",_.e=b),I!==_.t&&se(g,"step",_.t=I),_},{e:void 0,t:void 0}),w(()=>g.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),w(()=>r.open=e()),r})()}pe(["click","input"]);const mn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],vt=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],as="webapp.columns.v1";function $u(){try{const t=localStorage.getItem(as);if(!t)return vt;const e=JSON.parse(t);if(!Array.isArray(e))return vt;const n=new Set(mn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:vt}catch{return vt}}function ku(t){try{localStorage.setItem(as,JSON.stringify(t))}catch{}}var Eu=m("<div class=pop-backdrop>"),Iu=m('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Cu=m("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Tu=m("<label class=pick-item><input type=checkbox>");function Au(t){const[e,n]=O(!1);return(()=>{var r=Cu(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(C,{get when(){return e()},get children(){return[(()=>{var s=Eu();return s.$$click=()=>n(!1),s})(),(()=>{var s=Iu(),a=s.firstChild,o=a.nextSibling;return u(a,f(ie,{each:mn,children:l=>(()=>{var c=Tu(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),w(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),w(()=>se(i,"aria-expanded",e())),r})()}pe(["click"]);var Pu=m('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),xu=m("<span class=pggap>…"),Ru=m("<button type=button class=pgbtn>");function Ou(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function Nu(t){const e=Q(()=>Ou(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Pu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,f(ie,{get each(){return e()},children:d=>d==="…"?xu():(()=>{var h=Ru();return h.$$click=()=>t.onGo(d),u(h,d),w(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,w(d=>{var h=t.page()<=1,g=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),g!==d.t&&(c.disabled=d.t=g),d},{e:void 0,t:void 0}),i})()}pe(["click"]);var Du=m("<span class=tip>");function pt(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=Du();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?Us(i,r):e=r,u(r,()=>t.children),w(()=>se(r,"data-tip",t.text??"")),r})()}pe(["focusin"]);const Ye="∅";function K(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function wt(t){return Number(t??0).toLocaleString("en-US")}function cn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function os(t){return ls(t,{hour:"2-digit",minute:"2-digit"})}function Lu(t){return ls(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function ls(t,e){const n=cn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const cs={text:Ye,isNull:!0},Tn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function qr(t,e){return!e||K(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function Mu(t,e){return!e||K(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function Uu(t){if(!t||typeof t!="object"||K(t.report_date))return cs;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function oe(t,e){if(K(e))return cs;switch(t){case"fixed2":return Tn(e,2);case"fixed3":return Tn(e,3);case"ivrv":return Tn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return Uu(e);default:return{text:String(e),isNull:!1}}}const Kr=t=>Number(t*100).toFixed(0);function Fu(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Kr(e.momentum_high),s=Kr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function mt(t,e){return Fu(e)[t]??t}var us=m("<span class=tip-target>"),Bu=m("<div class=kv><span class=kv-label></span><span class=kv-value>"),Vu=m("<span class=tip-target>Strike position in band"),Hu=m('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),Wu=m("<div class=exp-block><h4>"),ju=m("<div class=kv-value>Band unavailable (∅)"),zu=m("<div><span class=marker-tick></span><span class=marker-cap><br>"),Gu=m("<div class=exp-block><h4>Premium economics"),qu=m("<b>"),Ku=m('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),Ju=m("<div class=muted-note>earnings-discounted safety applied"),Yu=m("<div class=exp-block><h4>Score breakdown"),Xu=m("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),Qu=m('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),Zu=m("<span class=muted-note>all columns visible"),ed=m('<div class="exp-block exp-chips"><h4>Hidden columns'),td=m("<span class=tip-target>: "),nd=m("<span>"),rd=m("<span class=tip-target>band safety is already discounted by the earnings rule."),id=m("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),sd=m("<div class=expansion><div class=exp-grid>");const An={sharpe:.2,safety:.4,return_part:.4};function Pn(t,e=2){return K(t)?Ye:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function _e(t,e,n){return(()=>{var r=Bu(),i=r.firstChild,s=i.nextSibling;return u(i,f(pt,{get text(){return mt(t,e)},get children(){var a=us();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function ad(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=K(e.mid)?null:e.strike-e.mid,s=i!=null&&!K(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!K(a)&&l>a&&!K(e.strike),d=g=>{if(K(g))return null;const _=(g-a)/(l-a)*100;return Math.min(100,Math.max(0,_))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(g=>d(g.v)!=null):[];return(()=>{var g=Wu(),_=g.firstChild;return u(_,f(pt,{get text(){return mt("band_range",t.thresholds)},get children(){return Vu()}})),u(g,f(C,{when:c,get fallback(){return ju()},get children(){var b=Hu(),I=b.firstChild;return u(b,f(ie,{each:h,children:y=>(()=>{var v=zu(),S=v.firstChild,A=S.nextSibling,T=A.firstChild;return u(A,()=>y.label,T),u(A,()=>oe("fixed2",y.v).text,null),w(P=>{var E=`marker ${y.cls}`,D=`${d(y.v)}%`;return E!==P.e&&te(v,P.e=E),D!==P.t&&Je(v,"left",P.t=D),P},{e:void 0,t:void 0}),v})()}),null),w(y=>{var v=`${d(e.strike_from)}%`,S=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return v!==y.e&&Je(I,"left",y.e=v),S!==y.t&&Je(I,"width",y.t=S),y},{e:void 0,t:void 0}),b}}),null),u(g,()=>_e("band_range",t.thresholds,`${oe("fixed2",e.strike_from).text} → ${oe("fixed2",e.strike_to).text}`),null),u(g,()=>_e("band_depth",t.thresholds,r==null?Ye:`${(r*100).toFixed(1)}%`),null),u(g,()=>_e("cushion_be",t.thresholds,s==null?Ye:`${s.toFixed(1)}%`),null),g})()}function od(t){const e=t.row,n=K(e.strike)?null:e.strike*100,r=K(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=oe("pct1",e.rate_of_return);return(()=>{var a=Gu();return a.firstChild,u(a,()=>_e("capital",t.thresholds,n==null?Ye:Pn(n,0)),null),u(a,()=>_e("premium",t.thresholds,r==null?Ye:Pn(r)),null),u(a,()=>_e("breakeven",t.thresholds,i==null?Ye:Pn(i)),null),u(a,()=>_e("ann_ror",t.thresholds,(()=>{var o=qu();return u(o,()=>s.text),o})()),null),u(a,()=>_e("bid",t.thresholds,oe("fixed2",e.bid).text),null),u(a,()=>_e("ask",t.thresholds,oe("fixed2",e.ask).text),null),u(a,()=>_e("expiration",t.thresholds,e.expiration),null),a})()}function ld(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:An.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:An.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:An.return_part,v:n==null?void 0:n.return}];return(()=>{var i=Yu();return i.firstChild,u(i,f(C,{when:n,get fallback(){return(()=>{var s=Xu(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>oe("fixed3",e.score).text),s})()},get children(){return[f(ie,{each:r,children:s=>{const a=K(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=Qu(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,g=h.nextSibling;g.nextSibling;var _=l.nextSibling,b=_.firstChild,I=_.nextSibling;return u(l,f(pt,{get text(){return mt(s.key,t.thresholds)},get children(){var y=us();return u(y,()=>s.label),y}}),c),u(d,()=>s.weight*100,g),u(I,()=>oe("fixed3",s.v).text),w(y=>Je(b,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=Ku(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>oe("fixed3",e.score).text),s})(),f(C,{get when(){return e.earnings_before_expiry},get children(){return Ju()}})]}}),null),i})()}function cd(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:oe(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=ed();return n.firstChild,u(n,f(ie,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=nd();return u(s,f(pt,{get text(){return mt(r.id,t.thresholds)},get children(){var a=td(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),w(()=>te(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(C,{get when(){return t.hiddenDefs.length===0},get children(){return Zu()}}),null),n})()}function ud(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=sd(),i=r.firstChild;return u(r,f(C,{when:n,get children(){var s=id(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(C,{get when(){return n.report_time},children:g=>g().replaceAll("_"," ")}),c),u(s,f(C,{get when(){return!K(n.expected_eps)},get children(){return[" ","· expected EPS ",q(()=>oe("fixed2",n.expected_eps).text)]}}),h),u(s,f(pt,{get text(){return mt("earnings_before_expiry",t.thresholds)},get children(){return rd()}}),null),s}}),i),u(i,f(ad,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(od,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(ld,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(cd,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var dd=m("<span class=null-mark>"),hd=m("<span class=star>★"),fd=m("<td><b>"),xn=m("<span>"),Jr=m("<td class=num>"),gd=m("<span class=score-frozen>prod "),pd=m('<td class="num score-cell">'),md=m('<span class="score-frozen readmit">re-admitted'),_d=m("<td>"),bd=m("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),yd=m("<span class=sort-arrow>"),vd=m("<span class=tip-target>"),wd=m("<th role=button tabindex=0>"),Sd=m("<tr class=expandable><td class=exp-col>"),$d=m("<tr class=exp-row><td>");const kd=t=>`${t.underlying}|${t.strike}`;function Ed(t){return(()=>{var e=dd();return u(e,()=>t.text),e})()}function Vt(t){const e=oe(t.kind,t.value);return f(C,{get when(){return!e.isNull},get fallback(){return f(Ed,{get text(){return e.text}})},get children(){return e.text}})}function Id(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=fd(),i=r.firstChild;return u(r,f(C,{get when(){return t.pickRank!=null},get children(){var s=hd();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(C,{get when(){return qr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=xn();return w(()=>te(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Jr();return u(r,f(C,{get when(){return qr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=xn();return w(()=>te(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(Vt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=pd();return u(r,f(Vt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(C,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(C,{get when(){return!K(n.frozen_score)},get fallback(){return f(C,{get when(){return!K(n.score)},get children(){return md()}})},get children(){var i=gd();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=Jr();return u(r,f(Vt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(C,{get when(){return Mu(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=xn();return u(s,i),w(()=>te(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=_d();return u(r,f(Vt,{get kind(){return e.kind},get value(){return n[e.id]}})),w(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Cd(t){const e=Q(()=>mn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=bd(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(ie,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=wd();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,f(pt,{get text(){return mt(a.id,t.thresholds)},get children(){var c=vd();return u(c,()=>a.label,null),u(c,f(C,{get when(){return o()},get children(){return[" ",(()=>{var d=yd();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),w(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&se(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,f(ie,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>kd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=Sd(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,f(ie,{get each(){return e()},children:g=>f(Id,{col:g,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),w(g=>{var _=o()!=null,b=!!K(a.score),I=!!c();return _!==g.e&&d.classList.toggle("pick",g.e=_),b!==g.t&&d.classList.toggle("prow",g.t=b),I!==g.a&&d.classList.toggle("open",g.a=I),g},{e:void 0,t:void 0,a:void 0}),d})(),f(C,{get when(){return c()},get children(){var d=$d(),h=d.firstChild;return u(h,f(ud,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),w(()=>se(h,"colspan",e().length+1)),d}})]}})),n})()}pe(["click","keydown"]);function Td(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const nt=t=>K(t);function Ad(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=nt(a),c=nt(o);return l||c?l&&c?0:l?1:-1:r*Td(a,o)})}function Pd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=nt(r),a=nt(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=nt(l),h=nt(c);return d||h?d&&h?0:d?1:-1:c-l})}var xd=m("<div class=stage-badges>"),Rd=m("<pre class=errbox>"),Od=m("<details><summary> "),Nd=m("<div class=scroll-region>"),Dd=m('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),Ld=m("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),Md=m("<div class=empty-panel>No rows match the current filter."),Ud=m('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Rn=100,Fd=150,Yr={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function Bd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=xd();return u(i,f(ie,{get each(){return t.stages??[]},children:s=>(()=>{var a=Od(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,f(C,{get when(){return s.error},get children(){var c=Rd();return u(c,()=>s.error),c}}),null),w(()=>te(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function Xr(t){const[e,n]=O(""),[r,i]=O(""),[s,a]=O(!0),[o,l]=O(null),[c,d]=O("asc"),[h,g]=O(1);let _;Be(()=>clearTimeout(_));const b=()=>{var $;return(($=t.tf)==null?void 0:$.rows)??[]},I=Q(()=>{const $=t.scoring.params(),F=t.scoring.isCustom();return b().map(R=>{const V=fu(R,$);return{...R,frozen_score:R.score,live_parts:V,score:F?V==null?null:V.total:R.score}})}),y=Q(()=>I().filter($=>!K($.score)&&K($.frozen_score)).length),v=$=>{const F=$.currentTarget.value;n(F),clearTimeout(_),_=setTimeout(()=>{i(F.trim().toLowerCase()),g(1)},Fd)},S=$=>{a($),g(1)},A=$=>{o()!==$?(l($),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),g(1)},[T,P]=O(null),E=$=>{const F=`${$.underlying}|${$.strike}`;P(R=>R===F?null:F)};Ke(St([o,c,h,r,s],()=>P(null))),Ke(St(t.active,()=>P(null))),Ke(St(t.columns.visible,()=>g(1)));const D=()=>mn.filter($=>!t.columns.visible().includes($.id)),x=()=>(t.stages??[]).find($=>$.name===Yr[t.id].id),M=Q(()=>{const $=r();return $?I().filter(F=>{const R=F.underlying,V=F.sector;return R!=null&&String(R).toLowerCase().includes($)||V!=null&&String(V).toLowerCase().includes($)}):I()}),p=Q(()=>{const $=M();return s()?$.filter(F=>!K(F.score)):$}),k=Q(()=>o()?Ad(p(),o(),c()):Pd(p())),U=Q(()=>Math.max(1,Math.ceil(k().length/Rn))),J=()=>Math.min(h(),U()),Y=()=>{const $=J();return k().slice(($-1)*Rn,$*Rn)},ce=Q(()=>{var F;const $=new Map;if(t.scoring.isCustom()){const R=gu(I().map(V=>({row:V,score:V.score})));for(const V of R)$.set(`${V.row.underlying}|${V.row.strike}`,$.size+1)}else for(const R of((F=t.tf)==null?void 0:F.top_picks)??[])$.set(`${R.underlying}|${R.strike}`,R.rank??"?");return $}),N=$=>ce().get(`${$.underlying}|${$.strike}`);return(()=>{var $=Dd(),F=$.firstChild,R=F.firstChild,V=R.nextSibling,ne=V.firstChild,z=V.nextSibling,Re=z.firstChild,Mt=Re.nextSibling;return Mt.nextSibling,u($,f(Bd,{get stages(){return t.stages}}),F),R.$$input=v,ne.addEventListener("change",X=>S(X.currentTarget.checked)),u(F,f(Au,{get store(){return t.columns}}),z),u(z,()=>wt(k().length),Re),u(z,()=>wt(b().length),Mt),u(z,f(C,{get when(){return q(()=>!!t.scoring.isCustom())()&&y()>0},get children(){return[" ","· ",q(()=>wt(y()))," re-admitted by lower floor"]}}),null),u($,f(C,{get when(){return Y().length>0},get children(){var X=Nd();return u(X,f(Cd,{get visibleCols(){return t.columns.visible},rows:Y,sortKey:o,sortDir:c,onSort:A,get thresholds(){return t.thresholds},pickRankOf:N,openKey:T,onToggleRow:E,hiddenDefs:D,get customScores(){return t.scoring.isCustom}})),X}}),null),u($,f(C,{get when(){return Y().length===0},get children(){return f(C,{get when(){var X,ue;return((X=x())==null?void 0:X.status)==="failed"||((ue=x())==null?void 0:ue.status)==="partial"},get fallback(){return f(C,{get when(){return q(()=>!!s())()&&M().length>0},get fallback(){return Md()},get children(){var X=Ld(),ue=X.firstChild,Oe=ue.nextSibling,ze=Oe.nextSibling,me=ze.nextSibling,Ze=me.nextSibling;return Ze.nextSibling,u(X,()=>wt(M().length),Ze),X}})},children:X=>(()=>{var ue=Ud(),Oe=ue.firstChild,ze=Oe.firstChild,me=ze.nextSibling;me.nextSibling;var Ze=Oe.nextSibling;return u(Oe,()=>X().status==="partial"?"△":"✗",ze),u(Oe,()=>Yr[t.id].label,me),u(Ze,()=>X().error??"stage produced no data"),ue})()})}}),null),u($,f(C,{get when(){return k().length>0},get children(){return f(Nu,{page:J,pageCount:U,onGo:g})}}),null),w(()=>$.hidden=!t.active()),w(()=>R.value=e()),w(()=>ne.checked=s()),$})()}pe(["input"]);var Vd=m("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),Hd=m('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save'),Wd=m('<button type=button class="btn-ghost hp-cash-edit">'),jd=m("<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved"),zd=m("<div class=hp-slot><div class=hp-lot-row><div class=hp-lot-row-top><span> sh </span><b></b></div><div class=hp-lot-row-sub><span>bought <!> · </span><b></b></div><div class=hp-lot-row-meta><i>last </i><i>covered <!>/"),Gd=m('<span class="chip high">buy back?'),qd=m('<span class="chip high">ITM — called away?'),ir=m("<b>"),Kd=m("<i>"),Jd=m('<div class=hp-slot><div class=hp-list-row><span class=hp-list-pos><span class=hp-kind></span><b> <!> ×</b><i>exp <!> · <!>/<!> wd</i></span><span></span><span class=hp-list-pace><i>target </i></span><span class=hp-list-status></span><button type=button class="btn-ghost holdings-close-btn">close…</button><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),Yd=m('<span class="chip normal">holding'),Xd=m("<b>—"),Qd=m('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal placeholder="e.g. 350.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.00"></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell put</button><button type=button class=btn>Cancel'),Zd=m('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal placeholder="e.g. 355.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.80"></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class=btn>Cancel</button><div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares'),eh=m('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),th=m('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class=btn>Cancel'),ds=m("<label class=holdings-outcome-price><input inputmode=decimal>"),nh=m("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),rh=m('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),ih=m('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),sh=m("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),ah=m('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),oh=m("<div class=holdings-notice>"),lh=m('<div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),ch=m('<div class="holdings-panel hp-wheel"><aside class=hp-rail><div class=hp-rail-block><div class=hp-rail-label>the wheel</div><div class=hp-rail-row><span>open puts</span><b></b></div><div class=hp-rail-row><span>open covered calls</span><b></b></div><div class=hp-rail-row><span>share lots</span><b></b></div><div class=hp-rail-row><span>shares held</span><b></b></div></div><div class=hp-rail-block><div class=hp-rail-label>lots</div><button type=button class="btn-ghost hp-cash-edit">+ New lot</button></div></aside><div class=hp-list><div class=hp-toolbar-row><button type=button class=btn>+ Sell put</button><button type=button class=btn>+ Sell call</button><button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),uh=m("<div class=hp-hint>No recorded lots — assignments land here."),dh=m("<div class=empty-panel>No open positions — press “+ Sell put” to record one.");const ot=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),ht=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),Jt=(t,e=0)=>`${(t*100).toFixed(e)}%`,fe=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),sr=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(n,r-1,i+e).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function hs(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function hh(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=Vd(),r=n.firstChild,i=r.nextSibling;return w(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&Je(r,"width",s.e=a),o!==s.t&&Je(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function fh(t){const[e,n]=O(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=Hd(),s=i.firstChild,a=s.nextSibling;return s.$$input=o=>n(o.target.value),a.$$click=()=>t.onSave(Number(e())),w(()=>{var o;return a.disabled=!r()||((o=t.busy)==null?void 0:o.call(t))}),w(()=>s.value=e()),i})()}function gh(t){const[e,n]=O(!1),r=()=>t.cash==null;return(()=>{var i=jd(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling,l=o.firstChild,c=l.nextSibling;return c.nextSibling,u(a,(()=>{var d=q(()=>t.free==null);return()=>d()?"—":ot(t.free)})()),u(o,(()=>{var d=q(()=>t.cash==null);return()=>d()?"—":ot(t.cash)})(),l),u(o,()=>ot(t.reserved),c),u(i,f(C,{get when(){return!e()},get fallback(){return f(fh,{get cash(){return t.cash},get busy(){return t.busy},onDone:()=>n(!1),onSave:async d=>{await t.onSaveCash(d)&&n(!1)}})},get children(){var d=Wd();return d.$$click=()=>n(!0),u(d,()=>r()?"set cash":"edit cash"),d}}),null),i})()}function ph(t){const e=t.lot,n=()=>e.view;return(()=>{var r=zd(),i=r.firstChild,s=i.firstChild,a=s.firstChild,o=a.firstChild,l=a.nextSibling,c=s.nextSibling,d=c.firstChild,h=d.firstChild,g=h.nextSibling;g.nextSibling;var _=d.nextSibling,b=c.nextSibling,I=b.firstChild;I.firstChild;var y=I.nextSibling,v=y.firstChild,S=v.nextSibling;return S.nextSibling,u(a,()=>e.shares,o),u(a,()=>e.symbol,null),u(l,(()=>{var A=q(()=>n().spot==null);return()=>A()?"—":ht(n().spot)})()),u(d,()=>ht(e.basis_per_share),g),u(d,()=>e.acquired,null),u(_,f(C,{get when(){return n().pl_dollars!=null},fallback:"—",get children(){return`${ot(n().pl_dollars)} (${(n().pl_pct??0)>=0?"+":""}${Jt(n().pl_pct,1)})`}})),u(I,()=>{var A;return hs((A=e.mark)==null?void 0:A.as_of)||"—"},null),u(y,()=>n().covered,S),u(y,()=>n().capacity,null),u(r,f(C,{get when(){return t.dialogFor("sellCall",e.id)},keyed:!0,children:A=>f(vh,{get lot(){return A.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}),null),w(()=>te(_,(n().pl_dollars??0)>=0?"holdings-pos":"holdings-neg")),r})()}function mh(t){const e=t.x,n=()=>e.v.spot_pct_vs_strike!=null&&e.v.spot_pct_vs_strike>0,r=()=>e.p.kind==="call"?e.v.spot_pct_vs_strike>0:e.v.spot_pct_vs_strike<0;return(()=>{var i=Jd(),s=i.firstChild,a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,_=g.nextSibling,b=_.nextSibling,I=b.nextSibling,y=I.nextSibling,v=y.nextSibling;v.nextSibling;var S=a.nextSibling,A=S.nextSibling,T=A.firstChild;T.firstChild;var P=A.nextSibling,E=P.nextSibling,D=E.nextSibling,x=D.firstChild,M=x.firstChild,p=M.nextSibling,k=x.nextSibling,U=k.firstChild,J=U.nextSibling,Y=J.nextSibling,ce=k.nextSibling;ce.firstChild;var N=ce.nextSibling,$=N.firstChild,F=$.nextSibling;return u(o,()=>e.p.kind.toUpperCase()),u(l,()=>e.p.symbol,c),u(l,()=>e.p.strike,d),u(l,()=>e.p.kind==="put"?"P":"C",d),u(l,()=>e.p.contracts,null),u(h,()=>e.p.expiry,_),u(h,()=>e.v.days_elapsed,I),u(h,()=>e.v.days_total,v),u(S,(()=>{var R=q(()=>e.v.pl_pct==null);return()=>R()?"—":`${e.v.pl_pct>=0?"+":""}${Jt(e.v.pl_pct,1)}`})()),u(A,f(hh,{get v(){return e.v}}),T),u(T,()=>Jt(e.v.target_pct),null),u(P,f(C,{get when(){return e.v.pace_met},get fallback(){return Yd()},get children(){return Gd()}}),null),u(P,f(C,{get when(){return q(()=>e.p.kind==="call")()&&n()},get children(){return qd()}}),null),E.$$click=()=>t.onClose(e),u(p,()=>ht(e.p.premium)),u(J,(()=>{var R=q(()=>e.p.mark==null);return()=>R()?"—":e.p.mark.mid.toFixed(2)})()),u(Y,(()=>{var R=q(()=>e.p.mark==null);return()=>R()?"unpriced":hs(e.p.mark.as_of)})()),u(ce,f(C,{get when(){var R;return((R=e.p.mark)==null?void 0:R.underlying_price)!=null},get fallback(){return Xd()},get children(){return[(()=>{var R=ir();return u(R,()=>e.p.mark.underlying_price.toFixed(2)),R})(),(()=>{var R=Kd();return u(R,(()=>{var V=q(()=>e.v.spot_pct_vs_strike==null);return()=>V()?"":`${e.v.spot_pct_vs_strike>=0?"+":""}${Jt(e.v.spot_pct_vs_strike,1)} vs strike`})()),w(()=>te(R,r()&&e.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),R})()]}}),null),u(F,(()=>{var R=q(()=>e.v.pl_dollars==null);return()=>R()?"—":ht(e.v.pl_dollars)})()),u(i,f(C,{get when(){return t.dialogFor(e.p.kind,e.p.id)},keyed:!0,children:R=>f(kh,Ns({d:R},()=>t.dialogActions))}),null),w(R=>{var V=!!e.v.pace_met,ne=e.p.kind,z=e.v.pl_pct>=0?"holdings-pos":"holdings-neg",Re=(e.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return V!==R.e&&s.classList.toggle("hp-row-met",R.e=V),ne!==R.t&&se(o,"data-kind",R.t=ne),z!==R.a&&te(S,R.a=z),Re!==R.o&&te(F,R.o=Re),R},{e:void 0,t:void 0,a:void 0,o:void 0}),i})()}function _h(t){const[e,n]=O({symbol:"",strike:"",premium:"",contracts:"1",sold:fe(),expiry:sr(fe(),7)}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&[e().strike,e().premium,e().contracts].every(s=>Number(s)>0)&&e().expiry>e().sold&&e().sold<=fe();return(()=>{var s=Qd(),a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=a.nextSibling,d=c.firstChild,h=d.nextSibling,g=c.nextSibling,_=g.firstChild,b=_.nextSibling,I=g.nextSibling,y=I.firstChild,v=y.nextSibling,S=I.nextSibling,A=S.firstChild,T=A.nextSibling,P=S.nextSibling,E=P.firstChild,D=E.nextSibling,x=P.nextSibling,M=x.nextSibling;return s.addEventListener("submit",p=>{var k;p.preventDefault(),!(!i()||(k=t.busy)!=null&&k.call(t))&&t.onAdd({symbol:e().symbol.trim().toUpperCase(),strike:Number(e().strike),premium:Number(e().premium),contracts:Math.trunc(Number(e().contracts)),sold:e().sold,expiry:e().expiry})}),H(l,"input",r("symbol")),H(h,"input",r("strike")),H(b,"input",r("premium")),H(v,"input",r("contracts")),H(T,"input",r("sold")),H(D,"input",r("expiry")),H(M,"click",t.onDone),w(()=>{var p;return x.disabled=!i()||((p=t.busy)==null?void 0:p.call(t))}),w(()=>l.value=e().symbol),w(()=>h.value=e().strike),w(()=>b.value=e().premium),w(()=>v.value=e().contracts),w(()=>T.value=e().sold),w(()=>D.value=e().expiry),s})()}function bh(t){const[e,n]=O({symbol:"",strike:"",premium:"",contracts:"1",sold:fe(),expiry:sr(fe(),7)}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&[e().strike,e().premium,e().contracts].every(s=>Number(s)>0)&&e().expiry>e().sold&&e().sold<=fe();return(()=>{var s=Zd(),a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=a.nextSibling,d=c.firstChild,h=d.nextSibling,g=c.nextSibling,_=g.firstChild,b=_.nextSibling,I=g.nextSibling,y=I.firstChild,v=y.nextSibling,S=I.nextSibling,A=S.firstChild,T=A.nextSibling,P=S.nextSibling,E=P.firstChild,D=E.nextSibling,x=P.nextSibling,M=x.nextSibling;return s.addEventListener("submit",p=>{var k;p.preventDefault(),!(!i()||(k=t.busy)!=null&&k.call(t))&&t.onAdd({kind:"call",symbol:e().symbol.trim().toUpperCase(),strike:Number(e().strike),premium:Number(e().premium),contracts:Math.trunc(Number(e().contracts)),sold:e().sold,expiry:e().expiry})}),H(l,"input",r("symbol")),H(h,"input",r("strike")),H(b,"input",r("premium")),H(v,"input",r("contracts")),H(T,"input",r("sold")),H(D,"input",r("expiry")),H(M,"click",t.onDone),w(()=>{var p;return x.disabled=!i()||((p=t.busy)==null?void 0:p.call(t))}),w(()=>l.value=e().symbol),w(()=>h.value=e().strike),w(()=>b.value=e().premium),w(()=>v.value=e().contracts),w(()=>T.value=e().sold),w(()=>D.value=e().expiry),s})()}function yh(t){const[e,n]=O({symbol:"",shares:"",basis_per_share:"",acquired:fe()}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=eh(),a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=a.nextSibling,d=c.firstChild,h=d.nextSibling,g=c.nextSibling,_=g.firstChild,b=_.nextSibling,I=g.nextSibling,y=I.firstChild,v=y.nextSibling,S=I.nextSibling,A=S.nextSibling;return s.addEventListener("submit",T=>{var P;T.preventDefault(),!(!i()||(P=t.busy)!=null&&P.call(t))&&t.onAdd({kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired})}),H(l,"input",r("symbol")),H(h,"input",r("shares")),H(b,"input",r("basis_per_share")),H(v,"input",r("acquired")),H(A,"click",t.onDone),w(()=>{var T;return S.disabled=!i()||((T=t.busy)==null?void 0:T.call(t))}),w(()=>l.value=e().symbol),w(()=>h.value=e().shares),w(()=>b.value=e().basis_per_share),w(()=>v.value=e().acquired),s})()}function vh(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=O({strike:"",premium:"",contracts:String(n()),expiry:sr(fe(),7)}),s=o=>l=>i({...r(),[o]:l.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>fe();return(()=>{var o=th(),l=o.firstChild,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,_=g.firstChild,b=_.nextSibling,I=g.nextSibling,y=I.firstChild,v=y.nextSibling,S=I.nextSibling,A=S.firstChild,T=A.nextSibling,P=S.nextSibling,E=P.firstChild,D=E.nextSibling,x=P.nextSibling,M=x.nextSibling;return u(l,()=>e.shares,d),u(l,()=>e.symbol,null),h.addEventListener("submit",p=>{var k;p.preventDefault(),!(!a()||(k=t.busy)!=null&&k.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:fe(),expiry:r().expiry})}),H(b,"input",s("strike")),H(v,"input",s("premium")),H(T,"input",s("contracts")),H(D,"input",s("expiry")),H(M,"click",t.onDone),w(()=>{var p;return x.disabled=!a()||((p=t.busy)==null?void 0:p.call(t))}),w(()=>b.value=r().strike),w(()=>v.value=r().premium),w(()=>T.value=r().contracts),w(()=>D.value=r().expiry),o})()}function wh(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="assigned"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=rh(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,_=g.nextSibling,b=_.nextSibling;b.nextSibling;var I=d.nextSibling,y=I.firstChild,v=y.firstChild,S=y.nextSibling,A=S.firstChild,T=S.nextSibling,P=T.firstChild,E=I.nextSibling;E.firstChild;var D=E.nextSibling,x=D.firstChild,M=x.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),v.addEventListener("change",()=>r("bought-back")),A.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("assigned")),u(c,f(C,{get when(){return n()!=="expired"},get children(){var p=ds(),k=p.firstChild;return u(p,()=>n()==="assigned"?"share price at assignment":"close price/share",k),k.$$input=U=>s(U.target.value),w(()=>k.value=i()),p}}),E),u(E,f(C,{get when(){return a()!==null},fallback:"—",get children(){var p=ir();return u(p,()=>ht(a())),w(()=>te(p,a()>=0?"holdings-pos":"holdings-neg")),p}}),null),H(x,"click",t.onDone),M.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),u(c,f(C,{get when(){return n()==="assigned"},get children(){return nh()}}),null),w(()=>{var p;return M.disabled=((p=t.busy)==null?void 0:p.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),w(()=>v.checked=n()==="bought-back"),w(()=>A.checked=n()==="expired"),w(()=>P.checked=n()==="assigned"),c})()}function Sh(t){const[e,n]=O({...t.d.prefill}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=ih(),a=s.firstChild,o=a.nextSibling,l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=l.nextSibling,g=h.firstChild,_=g.nextSibling,b=h.nextSibling,I=b.firstChild,y=I.nextSibling,v=b.nextSibling,S=v.firstChild,A=S.nextSibling,T=v.nextSibling,P=T.nextSibling;return o.addEventListener("submit",E=>{var D;E.preventDefault(),!(!i()||(D=t.busy)!=null&&D.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired,assigned_from:t.d.pos.id})}),H(d,"input",r("symbol")),H(_,"input",r("shares")),H(y,"input",r("basis_per_share")),H(A,"input",r("acquired")),H(P,"click",t.onDone),w(()=>{var E;return T.disabled=!i()||((E=t.busy)==null?void 0:E.call(t))}),w(()=>d.value=e().symbol),w(()=>_.value=e().shares),w(()=>y.value=e().basis_per_share),w(()=>A.value=e().acquired),s})()}function $h(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="called-away"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=ah(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,_=g.nextSibling,b=_.nextSibling;b.nextSibling;var I=d.nextSibling,y=I.firstChild,v=y.firstChild,S=y.nextSibling,A=S.firstChild,T=S.nextSibling,P=T.firstChild,E=I.nextSibling;E.firstChild;var D=E.nextSibling,x=D.firstChild,M=x.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),v.addEventListener("change",()=>r("bought-back")),A.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("called-away")),u(c,f(C,{get when(){return n()!=="expired"},get children(){var p=ds(),k=p.firstChild;return u(p,()=>n()==="called-away"?"share price at call":"close price/share",k),k.$$input=U=>s(U.target.value),w(()=>k.value=i()),p}}),E),u(E,f(C,{get when(){return a()!==null},fallback:"—",get children(){var p=ir();return u(p,()=>ht(a())),w(()=>te(p,a()>=0?"holdings-pos":"holdings-neg")),p}}),null),H(x,"click",t.onDone),M.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),u(c,f(C,{get when(){return n()==="called-away"},get children(){var p=sh(),k=p.firstChild,U=k.nextSibling,J=U.nextSibling,Y=J.nextSibling;return Y.nextSibling,u(p,()=>e.symbol,U),u(p,()=>e.contracts*100,Y),p}}),null),w(()=>{var p;return M.disabled=((p=t.busy)==null?void 0:p.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),w(()=>v.checked=n()==="bought-back"),w(()=>A.checked=n()==="expired"),w(()=>P.checked=n()==="called-away"),c})()}function kh(t){return t.d.type==="put"?t.d.stage==="lot"?f(Sh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(wh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f($h,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function Eh(){const[t,e]=O(null),[n,r]=O(""),[i,s]=O(null),[a,o]=O(!1),l=p=>{r(p),setTimeout(()=>r(""),4e3)},c=async()=>{try{e(await qs())}catch(p){l(`Holdings API error: ${p.message}`)}};lt(c);const d=()=>{var p;return((p=t())==null?void 0:p.positions)??[]},h=()=>{var p;return((p=t())==null?void 0:p.calls)??[]},g=()=>{var p;return((p=t())==null?void 0:p.lots)??[]},_=()=>d().map(p=>({p:{...p,kind:"put"},v:p.view})),b=()=>h().map(p=>({p:{...p,kind:"call"},v:p.view})),I=p=>p.v.pl_pct==null?-1/0:p.v.pl_pct-p.v.target_pct,y=()=>[..._(),...b()].sort((p,k)=>I(k)-I(p)),v=(p,k)=>{var Y,ce;const U=i();return!U||U.type!==p?null:(((Y=U.pos)==null?void 0:Y.id)??((ce=U.lot)==null?void 0:ce.id))===k?U:null},S=async p=>{if(a())return null;o(!0);try{return await p()}catch(k){return l(k.message),null}finally{o(!1)}},A=async()=>{var U;const p=await S(()=>Ks());if(!p)return;const k=((U=p.refresh)==null?void 0:U.stale)??[];l(k.length?`Marks refreshed — ${k.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await c()},T=async(p,k)=>{await S(()=>hr(p))&&(l(k),s(null),await c())},P=async(p,k)=>{await S(()=>hr(k))&&(l(`Assigned — recorded ${k.shares} sh ${k.symbol} at $${k.basis_per_share.toFixed(2)} basis.`),s(null),await c())},E=async(p,k,U)=>{if(k==="assigned"){s({type:"put",pos:p,stage:"lot",prefill:{symbol:p.symbol,shares:p.contracts*100,basis_per_share:+(p.strike-p.premium).toFixed(2),acquired:fe()}});return}await S(()=>fr(p.id))&&(l(k==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),s(null),await c())},D=async(p,k,U)=>{if(k==="called-away"){const Y=await S(()=>Ys(p.id));if(!Y)return;l(Y.reduced?`Called away — ${p.symbol} lot reduced by ${p.contracts*100} sh.`:`Called away — call removed. ${Y.reason??""}`),s(null),await c();return}await S(()=>fr(p.id))&&(l(k==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),s(null),await c())},x=async p=>{const k=await S(()=>Js(p));return k?(e(U=>({...U??{},cash:k.cash,cash_reserved:k.cash_reserved,cash_free:k.cash_free})),l(`Cash set to ${ot(k.cash)} — ${ot(k.cash_free)} free.`),!0):!1},M={busy:a,onDone:()=>s(null),onConfirmPut:E,onConfirmCall:D,onAssign:P};return(()=>{var p=ch(),k=p.firstChild,U=k.firstChild,J=U.firstChild,Y=J.nextSibling,ce=Y.firstChild,N=ce.nextSibling,$=Y.nextSibling,F=$.firstChild,R=F.nextSibling,V=$.nextSibling,ne=V.firstChild,z=ne.nextSibling,Re=V.nextSibling,Mt=Re.firstChild,X=Mt.nextSibling,ue=U.nextSibling,Oe=ue.firstChild,ze=Oe.nextSibling,me=k.nextSibling,Ze=me.firstChild,ar=Ze.firstChild,or=ar.nextSibling,lr=or.nextSibling;return u(k,f(gh,{get cash(){var B;return((B=t())==null?void 0:B.cash)??null},get reserved(){var B;return((B=t())==null?void 0:B.cash_reserved)??0},get free(){var B;return((B=t())==null?void 0:B.cash_free)??null},busy:a,onSaveCash:x}),U),u(N,()=>d().length),u(R,()=>h().length),u(z,()=>g().length),u(X,()=>g().reduce((B,_t)=>B+_t.shares,0)),u(ue,f(C,{get when(){return g().length>0},get fallback(){return uh()},get children(){return f(ie,{get each(){return g()},children:B=>f(ph,{lot:B,dialogFor:v,busy:a,onDialogDone:()=>s(null),onSellCall:(_t,Ut)=>T(Ut,`Sold ${Ut.symbol} ${Ut.strike}C ×${Ut.contracts} — Refresh marks to price.`)})})}}),ze),ze.$$click=()=>s({type:"addLot"}),u(ue,f(C,{get when(){var B;return((B=i())==null?void 0:B.type)==="addLot"},keyed:!0,get children(){return f(yh,{busy:a,onDone:()=>s(null),onAdd:B=>T(B,`Recorded ${B.shares} sh ${B.symbol}.`)})}}),null),ar.$$click=()=>s({type:"addPut"}),or.$$click=()=>s({type:"addCall"}),lr.$$click=A,u(me,f(C,{get when(){return n()},get children(){var B=oh();return u(B,n),B}}),null),u(me,f(C,{get when(){var B;return((B=i())==null?void 0:B.type)==="addPut"},keyed:!0,get children(){return f(_h,{busy:a,onDone:()=>s(null),onAdd:B=>T(B,`Sold ${B.symbol} ${B.strike}P ×${B.contracts} — press Refresh marks to price it.`)})}}),null),u(me,f(C,{get when(){var B;return((B=i())==null?void 0:B.type)==="addCall"},keyed:!0,get children(){return f(bh,{busy:a,onDone:()=>s(null),onAdd:B=>T(B,`Sold ${B.symbol} ${B.strike}C ×${B.contracts} — Refresh marks to price.`)})}}),null),u(me,f(C,{get when(){return d().length+h().length>0},get fallback(){return dh()},get children(){return[lh(),f(ie,{get each(){return y()},children:B=>f(mh,{x:B,dialogFor:v,dialogActions:M,onClose:_t=>s({type:_t.p.kind,pos:_t.p})})})]}}),null),w(()=>lr.disabled=a()),p})()}pe(["input","click"]);async function Ih(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var Ch=m("<button type=button class=run-btn>"),Th=m("<span class=run-count>/"),Ah=m("<span class=run-bar><span class=fill>"),Ph=m("<li><span class=mark></span><span class=label>"),xh=m("<div class=toast-cached>Served from cache — last run <!> min old"),Rh=m('<div class="toast-cached warn">'),Oh=m("<div class=run-headline>"),Nh=m("<ul class=run-stages>"),Dh=m("<details class=run-errors><summary>details</summary><ul>"),Lh=m("<div class=run-warn>Closing this tab stops the run."),Mh=m("<div class=run-warn>Re-checking every 15 s…"),Uh=m("<div class=run-strip>"),Fh=m("<li> ");const fs=["quotes","metrics","chains_short","chains_medium"],gs={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},Bh=15e3,ps=t=>t!==null&&Date.now()>=t;function Qr(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function Vh(t){const[e,n]=O("idle"),[r,i]=O(T()),[s,a]=O(null),[o,l]=O(0),[c,d]=O(null),[h,g]=O(null),[_,b]=O("");let I=null,y=null;const[v,S]=O(0);let A=null;Ke(()=>{const N=t();if(A&&(clearTimeout(A),A=null),(N==null?void 0:N.run_allowed)===!1){const $=cn(N.next_open_utc);$!==null&&(A=setTimeout(()=>S(F=>F+1),Math.max(0,$-Date.now())))}});function T(){return Object.fromEntries(fs.map(N=>[N,{status:"pending",error:null}]))}function P(){I&&clearInterval(I),I=null,y&&clearInterval(y),y=null}function E(){l(0),I=setInterval(()=>l(N=>N+1),1e3)}function D(N){switch(N.type){case"stage_started":i($=>({...$,[N.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:N.stage,done:N.done,total:N.total});break;case"stage_finished":i($=>({...$,[N.stage]:{status:N.ok?"ok":"failed",error:N.error??null}}));break;case"run_finished":d(N);break}}function x(){P();const N=c(),$=((N==null?void 0:N.stages)??[]).some(F=>F.name.startsWith("chains")&&["ok","partial"].includes(F.status));n(N&&($||N.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function M(N){let $=!1;return await Ih(N,F=>{D(F),F.type==="run_finished"&&($=!0)}),$?(x(),!0):!1}async function p(N){n("detached"),y=setInterval(async()=>{var $,F,R;try{const V=await li(),ne=((F=($=V==null?void 0:V.result)==null?void 0:$.run)==null?void 0:F.finished_at_utc)??null;if(ne&&ne!==N){i(k(V.result)),P(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((R=V==null?void 0:V.run_state)==null?void 0:R.status)!=="running"&&(P(),n("idle"),b("Stream lost and the run was canceled — press Run to retry."))}catch{}},Bh)}function k(N){const $=T();for(const F of(N==null?void 0:N.stages)??[])$[F.name]&&($[F.name]={status:F.status,error:F.error});return $}async function U(){var R,V,ne;if(["starting","running","detached"].includes(e()))return;b(""),d(null),a(null),i(T()),g(null);const N=((ne=(V=(R=t())==null?void 0:R.result)==null?void 0:V.run)==null?void 0:ne.finished_at_utc)??null;n("running"),E();let $;try{$=await zs()}catch{P(),n("idle"),b("Run failed to start — network or server unreachable.");return}const F=$.headers.get("content-type")??"";if($.ok&&F.includes("application/json")){const z=await $.json().catch(()=>null);if(P(),n("idle"),(z==null?void 0:z.status)==="cached"){g(z.age_secs),setTimeout(()=>g(null),6e3);return}}if($.status===403&&F.includes("application/json")){const z=await $.json().catch(()=>null);P(),n("idle"),b(z!=null&&z.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(z.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if($.status===202){const z=await Gs();if(z.ok&&(z.headers.get("content-type")??"").includes("text/event-stream")){await M(z)||await p(N);return}await p(N);return}if(F.includes("text/event-stream")){await M($)||await p(N);return}P(),n("idle"),b(`Unexpected /api/run response (${$.status}, ${F||"no type"}).`)}return Be(()=>{P(),A&&clearTimeout(A)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:_,triggerRun:U,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{v();const N=t();return(N==null?void 0:N.run_allowed)!==!1?!0:ps(cn(N==null?void 0:N.next_open_utc))},nextOpenUtc:()=>{var N;return((N=t())==null?void 0:N.next_open_utc)??null}}}function Hh(t){const e=()=>!t.run.runAllowed(),n=()=>os(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=Ch();return i.$$click=()=>t.run.triggerRun(),u(i,r),w(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&se(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function Wh(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=Ph(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>gs[t.name]),u(i,f(C,{get when(){return r()!==null},get children(){return[(()=>{var o=Th(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=Ah(),l=o.firstChild;return w(c=>Je(l,"width",`${r()}%`)),o})()]}}),null),w(()=>te(i,`run-stage ${e()}`)),i})()}function jh(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",q(()=>Qr(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",q(()=>Qr(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(C,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=Uh();return u(i,f(C,{get when(){return e.cachedToast()},get children(){var s=xh(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(C,{get when(){return e.notice()},get children(){var s=Rh();return u(s,()=>e.notice()),s}}),null),u(i,f(C,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=Oh();return u(s,r),s})(),(()=>{var s=Nh();return u(s,()=>fs.map(a=>f(Wh,{name:a,run:e}))),s})(),f(C,{get when(){return q(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=Dh(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=Fh(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>gs[l.name]??l.name,null),u(c,(()=>{var h=q(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,f(C,{get when(){return q(()=>e.phase()==="running")()&&!n()},get children(){return Lh()}}),null),u(i,f(C,{get when(){return e.phase()==="detached"},get children(){return Mh()}}),null),i}})}pe(["click"]);var ms=m("<b>"),zh=m("<span>Market closed · last run <b></b> ago"),Gh=m("<div class=cache-line><span></span><span class=pill>run: "),qh=m("<span>Cached · <b></b> left"),Kh=m("<span>Stale · last run <b></b> ago"),Jh=m("<nav class=tabs role=tablist aria-label=timeframes>"),Yh=m("<button type=button role=tab class=tab>"),Xh=m('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),Qh=m("<div class=pop-backdrop>"),Zh=m("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),ef=m("<div class=error-banner>API error: "),tf=m("<div class=shell><header><div class=user-box></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),nf=m("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function rf(){const[t,e]=O($u()),n=r=>{e(r),ku(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(vt)}}function Zr(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function sf(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function ei(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function On(t){return f(C,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=ms();return u(e,()=>t.at()),e})()]}})}function af(t){const[e,n]=O(0);lt(()=>{const _=setInterval(()=>n(b=>b+1),3e4);Be(()=>clearInterval(_))});let r=Date.now(),i=0;Ke(St(()=>t.envelope,_=>{r=Date.now(),i=(_==null?void 0:_.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const _=Math.max(0,(t.envelope.cache_secs??0)-s());return _>=60?`${Math.floor(_/60)}m`:`${_}s`},c=()=>{var _,b;return Lu((b=(_=t.envelope.result)==null?void 0:_.run)==null?void 0:b.finished_at_utc)},d=()=>{e();const _=t.envelope.next_open_utc,b=cn(_);if(!(b===null||ps(b)))return os(_)},h=()=>o()&&a()==="stale"?"closed":a(),g=()=>a()==="fresh"||a()==="stale";return(()=>{var _=Gh(),b=_.firstChild,I=b.nextSibling;return I.firstChild,u(_,f(C,{get when(){return q(()=>!!o())()&&g()},get fallback(){return f(C,{get when(){return a()==="fresh"},get fallback(){return f(C,{get when(){return a()==="stale"},get children(){var y=Kh(),v=y.firstChild,S=v.nextSibling;return S.nextSibling,u(S,()=>ei(s())),u(y,f(On,{at:c}),null),y}})},get children(){var y=qh(),v=y.firstChild,S=v.nextSibling;return S.nextSibling,u(S,l),u(y,f(On,{at:c}),null),y}})},get children(){var y=zh(),v=y.firstChild,S=v.nextSibling;return S.nextSibling,u(S,()=>ei(s())),u(y,f(On,{at:c}),null),u(y,f(C,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var A=ms();return u(A,d),A})()]}}),null),y}}),b),u(b,(()=>{var y=q(()=>h()==="closed");return()=>y()?"market closed":a()})()),u(I,()=>{var y;return((y=t.envelope.run_state)==null?void 0:y.status)??"idle"},null),w(()=>te(b,"pill "+h())),_})()}function ti(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=Jh();return u(n,()=>e.map(r=>(()=>{var i=Yh();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=q(()=>!r.holdings);return()=>s()&&` (${wt(sf(t.result,r.id))})`})(),null),w(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&se(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function of(){const[t,e]=O(void 0),[n,{refetch:r}]=ks(t,v=>v?li():void 0);lt(()=>{if(!dt){e(null);return}const v=xl(tt(),e);Be(v)});const[i,s]=O(!1);Ke(St(t,v=>{s(!1),!(!v||!dt)&&Vs().then(S=>s(S.status===403)).catch(()=>{})})),lt(()=>{const v=()=>r();window.addEventListener("webapp:refresh-latest",v),Be(()=>window.removeEventListener("webapp:refresh-latest",v))});const a=()=>{var v,S;return((v=t())==null?void 0:v.email)||((S=t())==null?void 0:S.uid)||""},[o,l]=O(!1),[c,d]=O(!1),h=rf(),[g,_]=O("short"),b=()=>g()==="holdings",I=vu(),y=Vh(()=>n());return f(C,{get when(){return t()},get fallback(){return f(iu,{})},get children(){return[f(C,{get when(){return!i()},get fallback(){return f(ru,{get email(){return a()},onSignOut:()=>zr()})},get children(){var v=tf(),S=v.firstChild,A=S.firstChild,T=A.nextSibling,P=T.nextSibling;return u(A,f(C,{get when(){return t()},get children(){return[(()=>{var E=Xh(),D=E.firstChild,x=D.nextSibling;return E.$$click=()=>l(!o()),u(x,a),w(()=>se(E,"aria-expanded",o())),E})(),f(C,{get when(){return o()},get children(){return[(()=>{var E=Qh();return E.$$click=()=>l(!1),E})(),(()=>{var E=Zh(),D=E.firstChild,x=D.nextSibling,M=x.nextSibling,p=M.nextSibling;return u(x,a),M.$$click=()=>{l(!1),d(!0)},p.$$click=()=>{l(!1),zr()},E})()]}})]}})),u(S,f(C,{get when(){return q(()=>!n.loading)()&&!n.error},get children(){return f(af,{get envelope(){return n()}})}}),P),u(P,f(Hh,{run:y})),u(v,f(C,{get when(){return n.error},get children(){var E=ef();return E.firstChild,u(E,()=>n.error.message,null),E}}),null),u(v,f(jh,{run:y}),null),u(v,f(C,{get when(){return b()},get children(){return[f(ti,{result:()=>{var E;return(E=n())==null?void 0:E.result},tab:g,onTab:_}),f(Eh,{})]}}),null),u(v,f(C,{get when(){return!b()},get children(){return f(C,{get when(){var E;return q(()=>!n.loading)()&&((E=n())==null?void 0:E.result)},get fallback(){return f(C,{get when(){return!n.loading},get children(){return nf()}})},children:E=>{const D=()=>E();return[f(Su,{scoring:I}),f(ti,{result:D,tab:g,onTab:_}),f(Xr,{id:"short",active:()=>g()==="short",get tf(){var x;return(x=D().timeframes)==null?void 0:x.short},get stageError(){return Zr(D(),"chains_short")},get stages(){return D().stages},get thresholds(){return D().thresholds},columns:h,scoring:I}),f(Xr,{id:"medium",active:()=>g()==="medium",get tf(){var x;return(x=D().timeframes)==null?void 0:x.medium},get stageError(){return Zr(D(),"chains_medium")},get stages(){return D().stages},get thresholds(){return D().thresholds},columns:h,scoring:I})]}})}}),null),v}}),f(C,{get when(){return c()},get children(){return f(uu,{onClose:()=>d(!1)})}})]}})}pe(["click"]);Ms(()=>f(of,{}),document.getElementById("root"));
