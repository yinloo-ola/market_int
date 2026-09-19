(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const gs=!1,ps=(t,e)=>t===e,Rn=Symbol("solid-proxy"),ms=typeof Proxy=="function",_s=Symbol("solid-track"),qt={equals:ps};let Xr=ti;const xe=1,Kt=2,Qr={owned:null,cleanups:null,context:null,owner:null},gn={};var J=null;let pn=null,bs=null,q=null,ne=null,Te=null,on=0;function Ft(t,e){const n=q,r=J,i=t.length===0,s=e===void 0?r:e,a=i?Qr:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>pe(()=>kt(a)));J=a,q=null;try{return He(o,!0)}finally{q=n,J=r}}function O(t,e){e=e?Object.assign({},qt,e):qt;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),ei(n,i));return[Zr.bind(n),r]}function ys(t,e,n){const r=ln(t,e,!0,xe);ft(r)}function w(t,e,n){const r=ln(t,e,!1,xe);ft(r)}function Je(t,e,n){Xr=Is;const r=ln(t,e,!1,xe);r.user=!0,Te?Te.push(r):ft(r)}function te(t,e,n){n=n?Object.assign({},qt,n):qt;const r=ln(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,ft(r),Zr.bind(r)}function vs(t){return t&&typeof t=="object"&&"then"in t}function ws(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=gn,l=!1,c="initialValue"in s,d=typeof r=="function"&&te(r);const h=new Set,[p,m]=(s.storage||O)(s.initialValue),[y,C]=O(void 0),[b,v]=O(void 0,{equals:!1}),[$,T]=O(c?"ready":"unresolved");J&&Ae(()=>{for(const M of h.keys())M.decrement();h.clear(),a=null});function A(M,I,F,H){return a===M&&(a=null,H!==void 0&&(c=!0),(M===o||I===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(H,{value:I})),o=gn,P(I,F)),I}function P(M,I){He(()=>{I===void 0&&m(()=>M),T(I!==void 0?"errored":c?"ready":"unresolved"),C(I);for(const F of h.keys())F.decrement();h.clear()},!1)}function E(){const M=$s,I=p(),F=y();if(F!==void 0&&!a)throw F;return q&&q.user,I}function U(M=!0){if(M!==!1&&l)return;l=!1;const I=d?d():r;if(I==null||I===!1){A(a,pe(p));return}let F;const H=o!==gn?o:pe(()=>{try{return i(I,{value:p(),refetching:M})}catch(ee){F=ee}});if(F!==void 0){A(a,void 0,Bt(F),I);return}else if(!vs(H))return A(a,H,void 0,I),H;return a=H,"v"in H?(H.s===1?A(a,H.v,void 0,I):A(a,void 0,Bt(H.v),I),H):(l=!0,queueMicrotask(()=>l=!1),He(()=>{T(c?"refreshing":"pending"),v()},!1),H.then(ee=>A(H,ee,void 0,I),ee=>A(H,void 0,Bt(ee),I)))}Object.defineProperties(E,{state:{get:()=>$()},error:{get:()=>y()},loading:{get(){const M=$();return M==="pending"||M==="refreshing"}},latest:{get(){if(!c)return E();const M=y();if(M&&!a)throw M;return p()}}});let N=J;return d?ys(()=>(N=J,U(!1))):U(!1),[E,{refetch:M=>Ss(N,()=>U(M)),mutate:m}]}function pe(t){if(q===null)return t();const e=q;q=null;try{return t()}finally{q=e}}function wt(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=pe(()=>e(a,i,s));return i=a,o}}function lt(t){Je(()=>pe(t))}function Ae(t){return J===null||(J.cleanups===null?J.cleanups=[t]:J.cleanups.push(t)),t}function Ss(t,e){const n=J,r=q;J=t,q=null;try{return He(e,!0)}catch(i){Vn(i)}finally{J=n,q=r}}const[lf,cf]=O(!1);let $s;function Zr(){if(this.sources&&this.state)if(this.state===xe)ft(this);else{const t=ne;ne=null,He(()=>Yt(this),!1),ne=t}if(q){const t=this.observers;if(!t||t[t.length-1]!==q){const e=t?t.length:0;q.sources?(q.sources.push(this),q.sourceSlots.push(e)):(q.sources=[this],q.sourceSlots=[e]),t?(t.push(q),this.observerSlots.push(q.sources.length-1)):(this.observers=[q],this.observerSlots=[q.sources.length-1])}}return this.value}function ei(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&He(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=pn&&pn.running;a&&pn.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?ne.push(s):Te.push(s),s.observers&&ni(s)),a||(s.state=xe)}if(ne.length>1e6)throw ne=[],new Error},!1)),e}function ft(t){if(!t.fn)return;kt(t);const e=on;ks(t,t.value,e)}function ks(t,e,n){let r;const i=J,s=q;q=J=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=xe,t.owned&&t.owned.forEach(kt),t.owned=null),t.updatedAt=n+1,Vn(a)}finally{q=s,J=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?ei(t,r):t.value=r,t.updatedAt=n)}function ln(t,e,n,r=xe,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:J,context:J?J.context:null,pure:n};return J===null||J!==Qr&&(J.owned?J.owned.push(s):J.owned=[s]),s}function Jt(t){if(t.state===0)return;if(t.state===Kt)return Yt(t);if(t.suspense&&pe(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<on);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===xe)ft(t);else if(t.state===Kt){const r=ne;ne=null,He(()=>Yt(t,e[0]),!1),ne=r}}function He(t,e){if(ne)return t();let n=!1;e||(ne=[]),Te?n=!0:Te=[],on++;try{const r=t();return Es(n),r}catch(r){n||(Te=null),ne=null,Vn(r)}}function Es(t){if(ne&&(ti(ne),ne=null),t)return;const e=Te;Te=null,e.length&&He(()=>Xr(e),!1)}function ti(t){for(let e=0;e<t.length;e++)Jt(t[e])}function Is(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:Jt(r)}for(e=0;e<n;e++)Jt(t[e])}function Yt(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===xe?r!==e&&(!r.updatedAt||r.updatedAt<on)&&Jt(r):i===Kt&&Yt(r,e)}}}function ni(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=Kt,n.pure?ne.push(n):Te.push(n),n.observers&&ni(n))}}function kt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)kt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)kt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function Bt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function Vn(t,e=J){throw Bt(t)}const Cs=Symbol("fallback");function rr(t){for(let e=0;e<t.length;e++)t[e]()}function Ts(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Ae(()=>rr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[_s],pe(()=>{let m,y,C,b,v,$,T,A,P;if(c===0)a!==0&&(rr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Cs],i[0]=Ft(E=>(s[0]=E,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=Ft(p);a=c}else{for(C=new Array(c),b=new Array(c),o&&(v=new Array(c)),$=0,T=Math.min(a,c);$<T&&r[$]===l[$];$++);for(T=a-1,A=c-1;T>=$&&A>=$&&r[T]===l[A];T--,A--)C[A]=i[T],b[A]=s[T],o&&(v[A]=o[T]);for(m=new Map,y=new Array(A+1),h=A;h>=$;h--)P=l[h],d=m.get(P),y[h]=d===void 0?-1:d,m.set(P,h);for(d=$;d<=T;d++)P=r[d],h=m.get(P),h!==void 0&&h!==-1?(C[h]=i[d],b[h]=s[d],o&&(v[h]=o[d]),h=y[h],m.set(P,h)):s[d]();for(h=$;h<c;h++)h in C?(i[h]=C[h],s[h]=b[h],o&&(o[h]=v[h],o[h](h))):i[h]=Ft(p);i=i.slice(0,a=c),r=l.slice(0)}return i});function p(m){if(s[h]=m,o){const[y,C]=O(h);return o[h]=C,e(l[h],y)}return e(l[h])}}}function f(t,e){return pe(()=>t(e||{}))}function Lt(){return!0}const As={get(t,e,n){return e===Rn?n:t.get(e)},has(t,e){return e===Rn?!0:t.has(e)},set:Lt,deleteProperty:Lt,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:Lt,deleteProperty:Lt}},ownKeys(t){return t.keys()}};function mn(t){return(t=typeof t=="function"?t():t)?t:{}}function Ps(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function Rs(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Rn in o,t[a]=typeof o=="function"?(e=!0,te(o)):o}if(ms&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=mn(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in mn(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys(mn(t[o])));return[...new Set(a)]}},As);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let c=l.length-1;c>=0;c--){const d=l[c];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:Ps.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const p=n[d];p&&(h.get?p.push(h.get.bind(o)):h.value!==void 0&&p.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const xs=t=>`Stale read from <${t}>.`;function se(t){const e="fallback"in t&&{fallback:()=>t.fallback};return te(Ts(()=>t.each,t.children,e||void 0))}function k(t){const e=t.keyed,n=te(()=>t.when,void 0,void 0),r=e?n:te(n,void 0,{equals:(i,s)=>!i==!s});return te(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?pe(()=>s(e?i:()=>{if(!pe(r))throw xs("Show");return n()})):s}return t.fallback},void 0,void 0)}const Y=t=>te(()=>t());function Os(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,p=1,m;for(;++h<i&&h<s&&!((m=c.get(e[h]))==null||m!==d+p);)p++;if(p>d-o){const y=e[a];for(;o<d;)t.insertBefore(n[o++],y)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const ir="_$DX_DELEGATE";function Ns(t,e,n,r={}){let i;return Ft(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function g(t,e,n,r){let i;const s=()=>{const o=document.createElement("template");return o.innerHTML=t,o.content.firstChild},a=()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function me(t,e=window.document){const n=e[ir]||(e[ir]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,Ls))}}function re(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function ae(t,e){e==null?t.removeAttribute("class"):t.className=e}function G(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function Ye(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function Ds(t,e,n){return pe(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return Xt(t,e,r,n);w(i=>Xt(t,e(),i,n),r)}function Ls(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function Xt(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=et(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=et(t,n,r);else{if(s==="function")return w(()=>{let o=e();for(;typeof o=="function";)o=o();n=Xt(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(xn(o,e,n,i))return w(()=>n=Xt(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=et(t,n,r),a)return n}else l?n.length===0?sr(t,o,r):Os(t,n,o):(n&&et(t),sr(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=et(t,n,r,e);et(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function xn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=xn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=xn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function sr(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function et(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let Vt=null;function Ms(t){Vt=t}async function ce(t,e={}){if(!Vt)return fetch(t,e);const n=new Headers(e.headers??{}),r=await Vt(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await Vt(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function ri(){const t=await ce("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function Us(){return ce("/api/me")}async function Fs(){const t=await ce("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function Bs(t){const e=await ce("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function Vs(t){const e=await ce("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function Hs(){return await ce("/api/run",{method:"POST"})}async function Ws(){return ce("/api/progress")}async function js(){const t=await ce("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function ar(t){const e=await ce("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function or(t){const e=await ce(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function zs(){const t=await ce("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function Gs(t){const e=await ce("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({cash:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function qs(t){const e=await ce("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const Ks=()=>{};var lr={};/**
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
 */const ii=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Js=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},si={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let p=(o&15)<<2|c>>6,m=c&63;l||(m=64,a||(p=64)),r.push(n[d],n[h],n[p],n[m])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(ii(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Js(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||c==null||h==null)throw new Ys;const p=s<<2|o>>4;if(r.push(p),c!==64){const m=o<<4&240|c>>2;if(r.push(m),h!==64){const y=c<<6&192|h;r.push(y)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Ys extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Xs=function(t){const e=ii(t);return si.encodeByteArray(e,!0)},ai=function(t){return Xs(t).replace(/\./g,"")},oi=function(t){try{return si.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Qs(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Zs=()=>Qs().__FIREBASE_DEFAULTS__,ea=()=>{if(typeof process>"u"||typeof lr>"u")return;const t=lr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},ta=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&oi(t[1]);return e&&JSON.parse(e)},Hn=()=>{try{return Ks()||Zs()||ea()||ta()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},na=t=>{var e,n;return(n=(e=Hn())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},li=()=>{var t;return(t=Hn())==null?void 0:t.config},ci=t=>{var e;return(e=Hn())==null?void 0:e[`_${t}`]};/**
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
 */class ui{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function ie(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ra(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ie())}function ia(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function sa(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function aa(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function oa(){const t=ie();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function la(){try{return typeof indexedDB=="object"}catch{return!1}}function ca(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const ua="FirebaseError";class We extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=ua,Object.setPrototypeOf(this,We.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,At.prototype.create)}}class At{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?da(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new We(i,o,r)}}function da(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function ha(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function ct(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(cr(s)&&cr(a)){if(!ct(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function cr(t){return t!==null&&typeof t=="object"}/**
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
 */function Pt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function _t(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function bt(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function fa(t,e){const n=new ga(t,e);return n.subscribe.bind(n)}class ga{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");pa(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=_n),i.error===void 0&&(i.error=_n),i.complete===void 0&&(i.complete=_n);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function pa(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function _n(){}/**
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
 */function Oe(t){return t&&t._delegate?t._delegate:t}/**
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
 */function Wn(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ma(t){return(await fetch(t,{credentials:"include"})).ok}class ut{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const qe="[DEFAULT]";/**
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
 */class _a{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new ui;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ya(e))try{this.getOrInitializeService({instanceIdentifier:qe})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=qe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=qe){return this.instances.has(e)}getOptions(e=qe){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:ba(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=qe){return this.component?this.component.multipleInstances?e:qe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function ba(t){return t===qe?void 0:t}function ya(t){return t.instantiationMode==="EAGER"}/**
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
 */class va{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new _a(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var z;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(z||(z={}));const wa={debug:z.DEBUG,verbose:z.VERBOSE,info:z.INFO,warn:z.WARN,error:z.ERROR,silent:z.SILENT},Sa=z.INFO,$a={[z.DEBUG]:"log",[z.VERBOSE]:"log",[z.INFO]:"info",[z.WARN]:"warn",[z.ERROR]:"error"},ka=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=$a[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class di{constructor(e){this.name=e,this._logLevel=Sa,this._logHandler=ka,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in z))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?wa[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,z.DEBUG,...e),this._logHandler(this,z.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,z.VERBOSE,...e),this._logHandler(this,z.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,z.INFO,...e),this._logHandler(this,z.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,z.WARN,...e),this._logHandler(this,z.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,z.ERROR,...e),this._logHandler(this,z.ERROR,...e)}}const Ea=(t,e)=>e.some(n=>t instanceof n);let ur,dr;function Ia(){return ur||(ur=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ca(){return dr||(dr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const hi=new WeakMap,On=new WeakMap,fi=new WeakMap,bn=new WeakMap,jn=new WeakMap;function Ta(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Be(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&hi.set(n,t)}).catch(()=>{}),jn.set(e,t),e}function Aa(t){if(On.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});On.set(t,e)}let Nn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return On.get(t);if(e==="objectStoreNames")return t.objectStoreNames||fi.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Be(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Pa(t){Nn=t(Nn)}function Ra(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(yn(this),e,...n);return fi.set(r,e.sort?e.sort():[e]),Be(r)}:Ca().includes(t)?function(...e){return t.apply(yn(this),e),Be(hi.get(this))}:function(...e){return Be(t.apply(yn(this),e))}}function xa(t){return typeof t=="function"?Ra(t):(t instanceof IDBTransaction&&Aa(t),Ea(t,Ia())?new Proxy(t,Nn):t)}function Be(t){if(t instanceof IDBRequest)return Ta(t);if(bn.has(t))return bn.get(t);const e=xa(t);return e!==t&&(bn.set(t,e),jn.set(e,t)),e}const yn=t=>jn.get(t);function Oa(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Be(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Be(a.result),l.oldVersion,l.newVersion,Be(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const Na=["get","getKey","getAll","getAllKeys","count"],Da=["put","add","delete","clear"],vn=new Map;function hr(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(vn.get(e))return vn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Da.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Na.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(o.shift())),(await Promise.all([c[n](...o),i&&l.done]))[0]};return vn.set(e,s),s}Pa(t=>({...t,get:(e,n,r)=>hr(e,n)||t.get(e,n,r),has:(e,n)=>!!hr(e,n)||t.has(e,n)}));/**
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
 */class La{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Ma(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Ma(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Dn="@firebase/app",fr="0.16.1";/**
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
 */const Pe=new di("@firebase/app"),Ua="@firebase/app-compat",Fa="@firebase/analytics-compat",Ba="@firebase/analytics",Va="@firebase/app-check-compat",Ha="@firebase/app-check",Wa="@firebase/auth",ja="@firebase/auth-compat",za="@firebase/database",Ga="@firebase/data-connect",qa="@firebase/database-compat",Ka="@firebase/functions",Ja="@firebase/functions-compat",Ya="@firebase/installations",Xa="@firebase/installations-compat",Qa="@firebase/messaging",Za="@firebase/messaging-compat",eo="@firebase/performance",to="@firebase/performance-compat",no="@firebase/remote-config",ro="@firebase/remote-config-compat",io="@firebase/storage",so="@firebase/storage-compat",ao="@firebase/firestore",oo="@firebase/ai",lo="@firebase/firestore-compat",co="firebase",uo="12.18.0";/**
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
 */const Ln="[DEFAULT]",ho={[Dn]:"fire-core",[Ua]:"fire-core-compat",[Ba]:"fire-analytics",[Fa]:"fire-analytics-compat",[Ha]:"fire-app-check",[Va]:"fire-app-check-compat",[Wa]:"fire-auth",[ja]:"fire-auth-compat",[za]:"fire-rtdb",[Ga]:"fire-data-connect",[qa]:"fire-rtdb-compat",[Ka]:"fire-fn",[Ja]:"fire-fn-compat",[Ya]:"fire-iid",[Xa]:"fire-iid-compat",[Qa]:"fire-fcm",[Za]:"fire-fcm-compat",[eo]:"fire-perf",[to]:"fire-perf-compat",[no]:"fire-rc",[ro]:"fire-rc-compat",[io]:"fire-gcs",[so]:"fire-gcs-compat",[ao]:"fire-fst",[lo]:"fire-fst-compat",[oo]:"fire-vertex","fire-js":"fire-js",[co]:"fire-js-all"};/**
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
 */const Qt=new Map,fo=new Map,Mn=new Map;function gr(t,e){try{t.container.addComponent(e)}catch(n){Pe.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Et(t){const e=t.name;if(Mn.has(e))return Pe.debug(`There were multiple attempts to register component ${e}.`),!1;Mn.set(e,t);for(const n of Qt.values())gr(n,t);for(const n of fo.values())gr(n,t);return!0}function gi(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function le(t){return t==null?!1:t.settings!==void 0}/**
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
 */const go={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ke=new At("app","Firebase",go);/**
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
 */class po{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new ut("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ke.create("app-deleted",{appName:this._name})}}/**
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
 */const Rt=uo;function pi(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Ln,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw ke.create("bad-app-name",{appName:String(i)});if(n||(n=li()),!n)throw ke.create("no-options");const s=Qt.get(i);if(s)if(ct(n,s.options)){if(ct(r,s.config))return s;throw ke.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw ke.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new va(i);for(const l of Mn.values())a.addComponent(l);const o=new po(n,r,a);return Qt.set(i,o),o}function mo(t=Ln){const e=Qt.get(t);if(!e&&t===Ln&&li())return pi();if(!e)throw ke.create("no-app",{appName:t});return e}function rt(t,e,n){let r=ho[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Pe.warn(a.join(" "));return}Et(new ut(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const _o="firebase-heartbeat-database",bo=1,It="firebase-heartbeat-store";let wn=null;function mi(){return wn||(wn=Oa(_o,bo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(It)}catch(n){console.warn(n)}}}}).catch(t=>{throw ke.create("idb-open",{originalErrorMessage:t.message})})),wn}async function yo(t){try{const n=(await mi()).transaction(It),r=await n.objectStore(It).get(_i(t));return await n.done,r}catch(e){if(e instanceof We)Pe.warn(e.message);else{const n=ke.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Pe.warn(n.message)}}}async function pr(t,e){try{const r=(await mi()).transaction(It,"readwrite");await r.objectStore(It).put(e,_i(t)),await r.done}catch(n){if(n instanceof We)Pe.warn(n.message);else{const r=ke.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Pe.warn(r.message)}}}function _i(t){return`${t.name}!${t.options.appId}`}/**
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
 */const vo=1024,wo=30;class So{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new ko(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=mr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>wo){const a=Eo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Pe.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=mr(),{heartbeatsToSend:r,unsentEntries:i}=$o(this._heartbeatsCache.heartbeats),s=ai(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Pe.warn(n),""}}}function mr(){return new Date().toISOString().substring(0,10)}function $o(t,e=vo){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),_r(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),_r(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class ko{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return la()?ca().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await yo(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return pr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return pr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function _r(t){return ai(JSON.stringify({version:2,heartbeats:t})).length}function Eo(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function Io(t){Et(new ut("platform-logger",e=>new La(e),"PRIVATE")),Et(new ut("heartbeat",e=>new So(e),"PRIVATE")),rt(Dn,fr,t),rt(Dn,fr,"esm2020"),rt("fire-js","")}/**
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
 */Io("");var Co="firebase",To="12.18.0";/**
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
 */rt(Co,To,"app");function bi(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Ao=bi,yi=new At("auth","Firebase",bi());/**
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
 */const Zt=new di("@firebase/auth");function vi(t,...e){Zt.logLevel<=z.WARN&&Zt.warn(`Auth (${Rt}): ${t}`,...e)}function Ht(t,...e){Zt.logLevel<=z.ERROR&&Zt.error(`Auth (${Rt}): ${t}`,...e)}/**
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
 */function de(t,...e){throw Gn(t,...e)}function ge(t,...e){return Gn(t,...e)}function zn(t,e,n){const r={...Ao(),[e]:n};return new At("auth","Firebase",r).create(e,{appName:t.name})}function be(t){return zn(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function wi(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&de(t,"argument-error"),zn(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Gn(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return yi.create(t,...e)}function L(t,e,...n){if(!t)throw Gn(e,...n)}function Ee(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Ht(e),new Error(e)}function Re(t,e){t||Ee(e)}/**
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
 */function Un(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function Po(){return br()==="http:"||br()==="https:"}function br(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
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
 */function Ro(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Po()||sa()||"connection"in navigator)?navigator.onLine:!0}function xo(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
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
 */class xt{constructor(e,n){this.shortDelay=e,this.longDelay=n,Re(n>e,"Short delay should be less than long delay!"),this.isMobile=ra()||aa()}get(){return Ro()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function qn(t,e){Re(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
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
 */class Si{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ee("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ee("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ee("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const Oo={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const No=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Do=new xt(3e4,6e4);function je(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function ze(t,e,n,r,i={}){return $i(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Pt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:l,...s};return ia()||(c.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&Wn(t.emulatorConfig.host)&&(c.credentials="include"),Si.fetch()(await ki(t,t.config.apiHost,n,o),c)})}async function $i(t,e,n){t._canInitEmulator=!1;const r={...Oo,...e};try{const i=new Mo(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Mt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,c]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Mt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Mt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Mt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw zn(t,d,c);de(t,d)}}catch(i){if(i instanceof We)throw i;de(t,"network-request-failed",{message:String(i)})}}async function Ot(t,e,n,r,i={}){const s=await ze(t,e,n,r,i);return"mfaPendingCredential"in s&&de(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function ki(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?qn(t.config,i):`${t.config.apiScheme}://${i}`;return No.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function Lo(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Mo{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(ge(this.auth,"network-request-failed")),Do.get())})}}function Mt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=ge(t,e,r);return i.customData._tokenResponse=n,i}function yr(t){return t!==void 0&&t.enterprise!==void 0}class Uo{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Lo(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Fo(t,e){return ze(t,"GET","/v2/recaptchaConfig",je(t,e))}/**
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
 */async function Bo(t,e){return ze(t,"POST","/v1/accounts:delete",e)}async function en(t,e){return ze(t,"POST","/v1/accounts:lookup",e)}/**
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
 */function St(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Vo(t,e=!1){const n=Oe(t),r=await n.getIdToken(e),i=Kn(r);L(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:St(Sn(i.auth_time)),issuedAtTime:St(Sn(i.iat)),expirationTime:St(Sn(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Sn(t){return Number(t)*1e3}function Kn(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Ht("JWT malformed, contained fewer than 3 sections"),null;try{const i=oi(n);return i?JSON.parse(i):(Ht("Failed to decode base64 JWT payload"),null)}catch(i){return Ht("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function vr(t){const e=Kn(t);return L(e,"internal-error"),L(typeof e.exp<"u","internal-error"),L(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Ct(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof We&&Ho(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Ho({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
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
 */class Wo{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Fn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=St(this.lastLoginAt),this.creationTime=St(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function tn(t){var h;const e=t.auth,n=await t.getIdToken(),r=await Ct(t,en(e,{idToken:n}));L(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?Ei(i.providerUserInfo):[],a=zo(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),c=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Fn(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function jo(t){const e=Oe(t);await tn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function zo(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Ei(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
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
 */async function Go(t,e){const n=await $i(t,{},async()=>{const r=Pt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await ki(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&Wn(t.emulatorConfig.host)&&(l.credentials="include"),Si.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function qo(t,e){return ze(t,"POST","/v2/accounts:revokeToken",je(t,e))}/**
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
 */class it{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){L(e.idToken,"internal-error"),L(typeof e.idToken<"u","internal-error"),L(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):vr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){L(e.length!==0,"internal-error");const n=vr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(L(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await Go(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new it;return r&&(L(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(L(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(L(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new it,this.toJSON())}_performRefresh(){return Ee("not implemented")}}/**
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
 */function De(t,e){L(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class fe{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Wo(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Fn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Ct(this,this.stsTokenManager.getToken(this.auth,e));return L(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Vo(this,e)}reload(){return jo(this)}_assign(e){this!==e&&(L(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new fe({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){L(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await tn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(le(this.auth.app))return Promise.reject(be(this.auth));const e=await this.getIdToken();return await Ct(this,Bo(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,c=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:p,isAnonymous:m,providerData:y,stsTokenManager:C}=n;L(h&&C,e,"internal-error");const b=it.fromJSON(this.name,C);L(typeof h=="string",e,"internal-error"),De(r,e.name),De(i,e.name),L(typeof p=="boolean",e,"internal-error"),L(typeof m=="boolean",e,"internal-error"),De(s,e.name),De(a,e.name),De(o,e.name),De(l,e.name),De(c,e.name),De(d,e.name);const v=new fe({uid:h,auth:e,email:i,emailVerified:p,displayName:r,isAnonymous:m,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:b,createdAt:c,lastLoginAt:d});return y&&Array.isArray(y)&&(v.providerData=y.map($=>({...$}))),l&&(v._redirectEventId=l),v}static async _fromIdTokenResponse(e,n,r=!1){const i=new it;i.updateFromServerResponse(n);const s=new fe({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await tn(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];L(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Ei(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new it;o.updateFromIdToken(r);const l=new fe({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Fn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
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
 */const wr=new Map;function Ie(t){Re(t instanceof Function,"Expected a class definition");let e=wr.get(t);return e?(Re(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,wr.set(t,e),e)}/**
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
 */class Ii{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Ii.type="NONE";const Sr=Ii;/**
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
 */function Wt(t,e,n){return`firebase:${t}:${e}:${n}`}class st{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Wt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Wt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await en(this.auth,{idToken:e}).catch(()=>{});return n?fe._fromGetAccountInfoResponse(this.auth,n,e):null}return fe._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new st(Ie(Sr),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||Ie(Sr);const a=Wt(r,e.config.apiKey,e.name);let o=null;for(const c of n)try{const d=await c._get(a);if(d){let h;if(typeof d=="string"){const p=await en(e,{idToken:d}).catch(()=>{});if(!p)break;h=await fe._fromGetAccountInfoResponse(e,p,d)}else h=fe._fromJSON(e,d);c!==s&&(o=h),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new st(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(a)}catch{}})),new st(s,e,r))}}/**
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
 */function $r(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Pi(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ci(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(xi(e))return"Blackberry";if(Oi(e))return"Webos";if(Ti(e))return"Safari";if((e.includes("chrome/")||Ai(e))&&!e.includes("edge/"))return"Chrome";if(Ri(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Ci(t=ie()){return/firefox\//i.test(t)}function Ti(t=ie()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ai(t=ie()){return/crios\//i.test(t)}function Pi(t=ie()){return/iemobile/i.test(t)}function Ri(t=ie()){return/android/i.test(t)}function xi(t=ie()){return/blackberry/i.test(t)}function Oi(t=ie()){return/webos/i.test(t)}function Jn(t=ie()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Ko(t=ie()){var e;return Jn(t)&&!!((e=window.navigator)!=null&&e.standalone)}function Jo(){return oa()&&document.documentMode===10}function Ni(t=ie()){return Jn(t)||Ri(t)||Oi(t)||xi(t)||/windows phone/i.test(t)||Pi(t)}/**
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
 */function Di(t,e=[]){let n;switch(t){case"Browser":n=$r(ie());break;case"Worker":n=`${$r(ie())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Rt}/${r}`}/**
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
 */class Yo{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function Xo(t,e={}){return ze(t,"GET","/v2/passwordPolicy",je(t,e))}/**
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
 */const Qo=6;class Zo{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??Qo,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
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
 */class el{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new kr(this),this.idTokenSubscription=new kr(this),this.beforeStateQueue=new Yo(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=yi,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Ie(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await st.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await en(this,{idToken:e}),r=await fe._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(le(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return L(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await tn(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=xo()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(le(this.app))return Promise.reject(be(this));const n=e?Oe(e):null;return n&&L(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&L(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return le(this.app)?Promise.reject(be(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return le(this.app)?Promise.reject(be(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ie(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Xo(this),n=new Zo(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new At("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await qo(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Ie(e)||this._popupRedirectResolver;L(n,this,"argument-error"),this.redirectPersistenceManager=await st.create(this,[Ie(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(L(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return L(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Di(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(le(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&vi(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Ne(t){return Oe(t)}class kr{constructor(e){this.auth=e,this.observer=null,this.addObserver=fa(n=>this.observer=n)}get next(){return L(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let cn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function tl(t){cn=t}function Li(t){return cn.loadJS(t)}function nl(){return cn.recaptchaEnterpriseScript}function rl(){return cn.gapiScript}function il(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class sl{constructor(){this.enterprise=new al}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class al{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
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
 */const ol="recaptcha-enterprise",Mi="NO_RECAPTCHA",Er="onFirebaseAuthREInstanceReady";class Le{constructor(e){this.type=ol,this.auth=Ne(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{Fo(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const c=new Uo(l);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,a(c.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;yr(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(c=>{a(c)}).catch(()=>{a(Mi)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new sl().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&yr(window.grecaptcha)&&Le.scriptInjectionDeferred)await Le.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=nl();l.length!==0&&(l+=o+`&onload=${Er}`),Le.scriptInjectionDeferred=new ui,window[Er]=()=>{var c;(c=Le.scriptInjectionDeferred)==null||c.resolve()},Li(l).then(()=>{var c;return(c=Le.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{i(o,s,a)}).catch(c=>{a(c)})}}).catch(o=>{a(o)})})}}Le.scriptInjectionDeferred=null;async function Ir(t,e,n,r=!1,i=!1){const s=new Le(t);let a;if(i)a=Mi;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,c=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Bn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Ir(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Ir(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
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
 */function ll(t,e){const n=gi(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(ct(s,e??{}))return i;de(i,"already-initialized")}return n.initialize({options:e})}function cl(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Ie);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function ul(t,e,n){const r=Ne(t);L(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Ui(e),{host:a,port:o}=dl(e),l=o===null?"":`:${o}`,c={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){L(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),L(ct(c,r.config.emulator)&&ct(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,Wn(a)?ma(`${s}//${a}${l}`):hl()}function Ui(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function dl(t){const e=Ui(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Cr(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Cr(a)}}}function Cr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function hl(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
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
 */class Yn{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Ee("not implemented")}_getIdTokenResponse(e){return Ee("not implemented")}_linkToIdToken(e,n){return Ee("not implemented")}_getReauthenticationResolver(e){return Ee("not implemented")}}async function fl(t,e){return ze(t,"POST","/v1/accounts:signUp",e)}/**
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
 */async function gl(t,e){return Ot(t,"POST","/v1/accounts:signInWithPassword",je(t,e))}/**
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
 */async function pl(t,e){return Ot(t,"POST","/v1/accounts:signInWithEmailLink",je(t,e))}async function ml(t,e){return Ot(t,"POST","/v1/accounts:signInWithEmailLink",je(t,e))}/**
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
 */class Tt extends Yn{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new Tt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new Tt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Bn(e,n,"signInWithPassword",gl);case"emailLink":return pl(e,{email:this._email,oobCode:this._password});default:de(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Bn(e,r,"signUpPassword",fl);case"emailLink":return ml(e,{idToken:n,email:this._email,oobCode:this._password});default:de(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function at(t,e){return Ot(t,"POST","/v1/accounts:signInWithIdp",je(t,e))}/**
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
 */const _l="http://localhost";class Qe extends Yn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Qe(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):de("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new Qe(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return at(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,at(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,at(e,n)}buildRequest(){const e={requestUri:_l,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Pt(n)}return e}}/**
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
 */function bl(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function yl(t){const e=_t(bt(t)).link,n=e?_t(bt(e)).deep_link_id:null,r=_t(bt(t)).deep_link_id;return(r?_t(bt(r)).link:null)||r||n||e||t}class Xn{constructor(e){const n=_t(bt(e)),r=n.apiKey??null,i=n.oobCode??null,s=bl(n.mode??null);L(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=yl(e);try{return new Xn(n)}catch{return null}}}/**
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
 */class gt{constructor(){this.providerId=gt.PROVIDER_ID}static credential(e,n){return Tt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=Xn.parseLink(n);return L(r,"argument-error"),Tt._fromEmailAndCode(e,r.code,r.tenantId)}}gt.PROVIDER_ID="password";gt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";gt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class un{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Nt extends un{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Me extends Nt{constructor(){super("facebook.com")}static credential(e){return Qe._fromParams({providerId:Me.PROVIDER_ID,signInMethod:Me.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Me.credentialFromTaggedObject(e)}static credentialFromError(e){return Me.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Me.credential(e.oauthAccessToken)}catch{return null}}}Me.FACEBOOK_SIGN_IN_METHOD="facebook.com";Me.PROVIDER_ID="facebook.com";/**
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
 */class $e extends Nt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Qe._fromParams({providerId:$e.PROVIDER_ID,signInMethod:$e.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return $e.credentialFromTaggedObject(e)}static credentialFromError(e){return $e.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return $e.credential(n,r)}catch{return null}}}$e.GOOGLE_SIGN_IN_METHOD="google.com";$e.PROVIDER_ID="google.com";/**
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
 */class Ue extends Nt{constructor(){super("github.com")}static credential(e){return Qe._fromParams({providerId:Ue.PROVIDER_ID,signInMethod:Ue.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ue.credentialFromTaggedObject(e)}static credentialFromError(e){return Ue.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ue.credential(e.oauthAccessToken)}catch{return null}}}Ue.GITHUB_SIGN_IN_METHOD="github.com";Ue.PROVIDER_ID="github.com";/**
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
 */class Fe extends Nt{constructor(){super("twitter.com")}static credential(e,n){return Qe._fromParams({providerId:Fe.PROVIDER_ID,signInMethod:Fe.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Fe.credentialFromTaggedObject(e)}static credentialFromError(e){return Fe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Fe.credential(n,r)}catch{return null}}}Fe.TWITTER_SIGN_IN_METHOD="twitter.com";Fe.PROVIDER_ID="twitter.com";/**
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
 */async function vl(t,e){return Ot(t,"POST","/v1/accounts:signUp",je(t,e))}/**
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
 */class Ze{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await fe._fromIdTokenResponse(e,r,i),a=Tr(r);return new Ze({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Tr(r);return new Ze({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Tr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
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
 */class nn extends We{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,nn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new nn(e,n,r,i)}}function Fi(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?nn._fromErrorAndOperation(t,s,e,r):s})}async function wl(t,e,n=!1){const r=await Ct(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Ze._forOperation(t,"link",r)}/**
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
 */async function Sl(t,e,n=!1){const{auth:r}=t;if(le(r.app))return Promise.reject(be(r));const i="reauthenticate";try{const s=await Ct(t,Fi(r,i,e,t),n);L(s.idToken,r,"internal-error");const a=Kn(s.idToken);L(a,r,"internal-error");const{sub:o}=a;return L(t.uid===o,r,"user-mismatch"),Ze._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&de(r,"user-mismatch"),s}}/**
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
 */async function Bi(t,e,n=!1){if(le(t.app))return Promise.reject(be(t));const r="signIn",i=await Fi(t,r,e),s=await Ze._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function $l(t,e){return Bi(Ne(t),e)}/**
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
 */async function Vi(t){const e=Ne(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function kl(t,e,n){if(le(t.app))return Promise.reject(be(t));const r=Ne(t),a=await Bn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",vl).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Vi(t),l}),o=await Ze._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function El(t,e,n){return le(t.app)?Promise.reject(be(t)):$l(Oe(t),gt.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Vi(t),r})}function Il(t,e,n,r){return Oe(t).onIdTokenChanged(e,n,r)}function Cl(t,e,n){return Oe(t).beforeAuthStateChanged(e,n)}function Tl(t,e,n,r){return Oe(t).onAuthStateChanged(e,n,r)}function Al(t){return Oe(t).signOut()}const rn="__sak";/**
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
 */class Hi{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(rn,"1"),this.storage.removeItem(rn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const Pl=1e3,Rl=10;class Wi extends Hi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ni(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);Jo()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Rl):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Pl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Wi.type="LOCAL";const xl=Wi;/**
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
 */class ji extends Hi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}ji.type="SESSION";const zi=ji;/**
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
 */function Ol(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class dn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new dn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async c=>c(n.origin,s)),l=await Ol(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}dn.receivers=[];/**
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
 */function Qn(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class Nl{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const c=Qn("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const p=h;if(p.data.eventId===c)switch(p.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(p.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function ye(){return window}function Dl(t){ye().location.href=t}/**
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
 */function Gi(){return typeof ye().WorkerGlobalScope<"u"&&typeof ye().importScripts=="function"}async function Ll(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Ml(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function Ul(){return Gi()?self:null}/**
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
 */const qi="firebaseLocalStorageDb",Fl=1,sn="firebaseLocalStorage",Ki="fbase_key";class Dt{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function hn(t,e){return t.transaction([sn],e?"readwrite":"readonly").objectStore(sn)}function Bl(){const t=indexedDB.deleteDatabase(qi);return new Dt(t).toPromise()}function Ji(){const t=indexedDB.open(qi,Fl);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(sn,{keyPath:Ki})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(sn)?e(r):(r.close(),await Bl(),e(await Ji()))})})}async function Ar(t,e,n){const r=hn(t,!0).put({[Ki]:e,value:n});return new Dt(r).toPromise()}async function Vl(t,e){const n=hn(t,!1).get(e),r=await new Dt(n).toPromise();return r===void 0?null:r.value}function Pr(t,e){const n=hn(t,!0).delete(e);return new Dt(n).toPromise()}const Hl=800,Wl=3;class Yi{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=Ji(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>Wl)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Gi()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=dn._getInstance(Ul()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await Ll(),!this.activeServiceWorker)return;this.sender=new Nl(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Ml()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Ar(e,rn,"1"),await Pr(e,rn)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Ar(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>Vl(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Pr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=hn(i,!1).getAll();return new Dt(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||vi(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Hl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}Yi.type="LOCAL";const jl=Yi;new xt(3e4,6e4);/**
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
 */function Zn(t,e){return e?Ie(e):(L(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class er extends Yn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return at(e,this._buildIdpRequest())}_linkToIdToken(e,n){return at(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return at(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function zl(t){return Bi(t.auth,new er(t),t.bypassAuthState)}function Gl(t){const{auth:e,user:n}=t;return L(n,e,"internal-error"),Sl(n,new er(t),t.bypassAuthState)}async function ql(t){const{auth:e,user:n}=t;return L(n,e,"internal-error"),wl(n,new er(t),t.bypassAuthState)}/**
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
 */class Xi{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return zl;case"linkViaPopup":case"linkViaRedirect":return ql;case"reauthViaPopup":case"reauthViaRedirect":return Gl;default:de(this.auth,"internal-error")}}resolve(e){Re(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Re(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Kl=new xt(2e3,1e4);async function Jl(t,e,n){if(le(t.app))return Promise.reject(ge(t,"operation-not-supported-in-this-environment"));const r=Ne(t);wi(t,e,un);const i=Zn(r,n);return new Ke(r,"signInViaPopup",e,i).executeNotNull()}class Ke extends Xi{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Ke.currentPopupAction&&Ke.currentPopupAction.cancel(),Ke.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return L(e,this.auth,"internal-error"),e}async onExecution(){Re(this.filter.length===1,"Popup operations only handle one event");const e=Qn();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(ge(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(ge(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ke.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ge(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Kl.get())};e()}}Ke.currentPopupAction=null;/**
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
 */const Yl="pendingRedirect",jt=new Map;class Xl extends Xi{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=jt.get(this.auth._key());if(!e){try{const r=await Ql(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}jt.set(this.auth._key(),e)}return this.bypassAuthState||jt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Ql(t,e){const n=Zi(e),r=Qi(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function Zl(t,e){return Qi(t)._set(Zi(e),"true")}function ec(t,e){jt.set(t._key(),e)}function Qi(t){return Ie(t._redirectPersistence)}function Zi(t){return Wt(Yl,t.config.apiKey,t.name)}/**
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
 */function tc(t,e,n){return nc(t,e,n)}async function nc(t,e,n){if(le(t.app))return Promise.reject(be(t));const r=Ne(t);wi(t,e,un),await r._initializationPromise;const i=Zn(r,n);return await Zl(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function rc(t,e,n=!1){if(le(t.app))return Promise.reject(be(t));const r=Ne(t),i=Zn(r,e),a=await new Xl(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
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
 */const ic=600*1e3;class sc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!ac(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!es(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(ge(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=ic&&this.cachedEventUids.clear(),this.cachedEventUids.has(Rr(e))}saveEventToCache(e){this.cachedEventUids.add(Rr(e)),this.lastProcessedEventTime=Date.now()}}function Rr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function es({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function ac(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return es(t);default:return!1}}/**
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
 */async function oc(t,e={}){return ze(t,"GET","/v1/projects",e)}/**
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
 */const lc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,cc=/^https?/;async function uc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await oc(t);for(const n of e)try{if(dc(n))return}catch{}de(t,"unauthorized-domain")}function dc(t){const e=Un(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!cc.test(n))return!1;if(lc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const hc=new xt(3e4,6e4);function xr(){const t=ye().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function fc(t){return new Promise((e,n)=>{var i,s,a;function r(){xr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{xr(),n(ge(t,"network-request-failed"))},timeout:hc.get()})}if((s=(i=ye().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=ye().gapi)!=null&&a.load)r();else{const o=il("iframefcb");return ye()[o]=()=>{gapi.load?r():n(ge(t,"network-request-failed"))},Li(`${rl()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw zt=null,e})}let zt=null;function gc(t){return zt=zt||fc(t),zt}/**
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
 */const pc=new xt(5e3,15e3),mc="__/auth/iframe",_c="emulator/auth/iframe",bc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},yc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function vc(t){const e=t.config;L(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?qn(e,_c):`https://${t.config.authDomain}/${mc}`,r={apiKey:e.apiKey,appName:t.name,v:Rt},i=yc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Pt(r).slice(1)}`}async function wc(t){const e=await gc(t),n=ye().gapi;return L(n,t,"internal-error"),e.open({where:document.body,url:vc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:bc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=ge(t,"network-request-failed"),o=ye().setTimeout(()=>{s(a)},pc.get());function l(){ye().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
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
 */const Sc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},$c=500,kc=600,Ec="_blank",Ic="http://localhost";class Or{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Cc(t,e,n,r=$c,i=kc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...Sc,width:r.toString(),height:i.toString(),top:s,left:a},c=ie().toLowerCase();n&&(o=Ai(c)?Ec:n),Ci(c)&&(e=e||Ic,l.scrollbars="yes");const d=Object.entries(l).reduce((p,[m,y])=>`${p}${m}=${y},`,"");if(Ko(c)&&o!=="_self")return Tc(e||"",o),new Or(null);const h=window.open(e||"",o,d);L(h,t,"popup-blocked");try{h.focus()}catch{}return new Or(h)}function Tc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const Ac="__/auth/handler",Pc="emulator/auth/handler",Rc=encodeURIComponent("fac");async function Nr(t,e,n,r,i,s){L(t.config.authDomain,t,"auth-domain-config-required"),L(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Rt,eventId:i};if(e instanceof un){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",ha(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Nt){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),c=l?`#${Rc}=${encodeURIComponent(l)}`:"";return`${xc(t)}?${Pt(o).slice(1)}${c}`}function xc({config:t}){return t.emulator?qn(t,Pc):`https://${t.authDomain}/${Ac}`}/**
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
 */const $n="webStorageSupport";class Oc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=zi,this._completeRedirectFn=rc,this._overrideRedirectResult=ec}async _openPopup(e,n,r,i){var a;Re((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Nr(e,n,r,Un(),i);return Cc(e,s,Qn())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Nr(e,n,r,Un(),i);return Dl(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Re(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await wc(e),r=new sc(e);return n.register("authEvent",i=>(L(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send($n,{type:$n},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[$n];s!==void 0&&n(!!s),de(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=uc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Ni()||Ti()||Jn()}}const Nc=Oc;var Dr="@firebase/auth",Lr="1.13.5";/**
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
 */class Dc{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){L(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function Lc(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Mc(t){Et(new ut("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;L(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Di(t)},c=new el(r,i,s,l);return cl(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Et(new ut("auth-internal",e=>{const n=Ne(e.getProvider("auth").getImmediate());return(r=>new Dc(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),rt(Dr,Lr,Lc(t)),rt(Dr,Lr,"esm2020")}/**
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
 */const Uc=300,Fc=ci("authIdTokenMaxAge")||Uc;let Mr=null;const Bc=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Fc)return;const i=n==null?void 0:n.token;Mr!==i&&(Mr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Vc(t=mo()){const e=gi(t,"auth");if(e.isInitialized())return e.getImmediate();const n=ll(t,{popupRedirectResolver:Nc,persistence:[jl,xl,zi]}),r=ci("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=Bc(s.toString());Cl(n,a,()=>a(n.currentUser)),Il(n,o=>a(o))}}const i=na("auth");return i&&ul(n,`http://${i}`),n}function Hc(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}tl({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=ge("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",Hc().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Mc("Browser");const Wc={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},Se=Wc,dt=!!Se.VITE_FIREBASE_APP_ID;let kn=null;function tt(){if(!dt)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!kn){const t=pi({apiKey:Se.VITE_FIREBASE_API_KEY,authDomain:Se.VITE_FIREBASE_AUTH_DOMAIN,projectId:Se.VITE_FIREBASE_PROJECT_ID,appId:Se.VITE_FIREBASE_APP_ID,...Se.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:Se.VITE_FIREBASE_STORAGE_BUCKET},...Se.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:Se.VITE_FIREBASE_MESSAGING_SENDER_ID}});kn=Vc(t)}return kn}function Ur(){return new $e}async function Fr(){if(!dt)return;const t=tt();t.currentUser&&await Al(t)}var jc=g(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),zc=g('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),Gc=g("<button type=button class=gate-toggle>"),qc=g("<div class=gate-or>── or ──"),Kc=g("<button type=button class=btn>Continue with Google"),Jc=g("<div class=gate-error role=alert>"),Yc=g("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),Xc=g("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),Qc=g("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const Zc={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Br(t){const e=(t==null?void 0:t.code)??"";return Zc[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function eu(t){return(()=>{var e=jc(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),G(l,"click",t.onSignOut),e})()}function tu(){const[t,e]=O("signin"),[n,r]=O(""),[i,s]=O(""),[a,o]=O(!1),[l,c]=O("");Ms(async p=>{if(!dt)return null;const m=tt().currentUser;return m?await m.getIdToken(p):null});async function d(p){if(p.preventDefault(),!a()){o(!0),c("");try{const m=tt();t()==="create"?await kl(m,n(),i()):await El(m,n(),i())}catch(m){c(Br(m))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await Jl(tt(),Ur())}catch(p){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(p==null?void 0:p.code)){await tc(tt(),Ur());return}c(Br(p))}finally{o(!1)}}}return(()=>{var p=Yc(),m=p.firstChild;return m.firstChild,u(m,f(k,{when:dt,get fallback(){return[Xc(),Qc()]},get children(){return[(()=>{var y=zc(),C=y.firstChild,b=C.firstChild,v=b.nextSibling,$=C.nextSibling,T=$.firstChild,A=T.nextSibling,P=$.nextSibling;return y.addEventListener("submit",d),v.$$input=E=>r(E.currentTarget.value),A.$$input=E=>s(E.currentTarget.value),u(P,(()=>{var E=Y(()=>!!a());return()=>E()?"Working…":t()==="create"?"Create account":"Sign in"})()),w(E=>{var U=t()==="create"?"new-password":"current-password",N=a();return U!==E.e&&re(A,"autocomplete",E.e=U),N!==E.t&&(P.disabled=E.t=N),E},{e:void 0,t:void 0}),w(()=>v.value=n()),w(()=>A.value=i()),y})(),(()=>{var y=Gc();return y.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(y,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),w(()=>y.disabled=a()),y})(),qc(),(()=>{var y=Kc();return y.$$click=h,w(()=>y.disabled=a()),y})(),f(k,{get when(){return l()},get children(){var y=Jc();return u(y,l),y}})]}}),null),p})()}me(["click","input"]);var nu=g("<div class=gate-error role=alert>"),ru=g("<p class=gate-note>No grant-file entries yet."),iu=g("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),su=g('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),au=g("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function ou(t){const[e,n]=O([]),[r,i]=O([]),[s,a]=O(""),[o,l]=O(!1),[c,d]=O(""),h=b=>{n((b==null?void 0:b.file_grants)??[]),i((b==null?void 0:b.static_emails)??[])};lt(async()=>{try{h(await Fs())}catch{d("Could not load the grant list.")}});const m=b=>{b.key==="Escape"&&t.onClose()};lt(()=>{window.addEventListener("keydown",m),Ae(()=>window.removeEventListener("keydown",m));const b=document.querySelector(".access-add input");b==null||b.focus()});const y=async b=>{if(b.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await Bs(s())),a("")}catch(v){d(v.message)}l(!1)}},C=async b=>{if(!o()){l(!0),d("");try{h(await Vs(b))}catch(v){d(v.message)}l(!1)}};return(()=>{var b=su(),v=b.firstChild,$=v.firstChild,T=$.nextSibling,A=T.nextSibling,P=A.firstChild,E=P.nextSibling,U=A.nextSibling;return G(b,"click",t.onClose),v.$$click=N=>N.stopPropagation(),u(v,f(k,{get when(){return c()},get children(){var N=nu();return u(N,c),N}}),A),u(v,f(se,{get each(){return e()},children:N=>(()=>{var M=au(),I=M.firstChild,F=I.nextSibling;return u(I,N),F.$$click=()=>C(N),re(F,"title",`Remove ${N}`),re(F,"aria-label",`Remove ${N}`),w(()=>F.disabled=o()),M})()}),A),u(v,f(k,{get when(){return e().length===0},get children(){return ru()}}),A),A.addEventListener("submit",y),P.$$input=N=>a(N.currentTarget.value),u(E,()=>o()?"…":"Add"),u(v,f(k,{get when(){return r().length>0},get children(){var N=iu();return N.firstChild,u(N,()=>r().join(", "),null),N}}),U),G(U,"click",t.onClose),w(()=>E.disabled=o()),w(()=>P.value=s()),b})()}me(["click","input"]);const Ce=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),$t=(t,e,n)=>Math.min(n,Math.max(e,t));function lu(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:$t((n-t)/r,0,1)}function cu(t,e,n,r,i=Ce){if(n<i.minRateOfReturn||t<=0)return null;const s=$t(t/2,0,1),a=$t(e,0,1),o=Math.min(n/i.idealReturn,1),l=$t((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function uu(t,e=Ce){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?$t(1+t.delta,0,1):lu(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),cu(r,a,n,i,e)}function du(t,e=Ce.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function hu(t){return t.weightSharpe===Ce.weightSharpe&&t.weightSafety===Ce.weightSafety&&t.weightReturn===Ce.weightReturn&&t.minRateOfReturn===Ce.minRateOfReturn}var fu=g("<span class=hint>production defaults · drag to re-rank live"),gu=g("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),pu=g('<span class="hint hint-custom">custom weights'),mu=g("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function _u(){const[t,e]=O({...Ce});return{params:t,isCustom:()=>!hu(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Ce})}}const bu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function yu(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=gu(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(k,{get when(){return!e()},get fallback(){return pu()},get children(){return fu()}}),null),u(s,f(se,{each:bu,children:o=>(()=>{var l=mu(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,p=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(k,{get when(){return o.weight},get children(){return[" ","· ",Y(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),p.$$input=m=>t.scoring.setParam(o.key,Number(m.currentTarget.value)),w(m=>{var y=o.max,C=o.step;return y!==m.e&&re(p,"max",m.e=y),C!==m.t&&re(p,"step",m.t=C),m},{e:void 0,t:void 0}),w(()=>p.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),w(()=>r.open=e()),r})()}me(["click","input"]);const fn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],yt=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],ts="webapp.columns.v1";function vu(){try{const t=localStorage.getItem(ts);if(!t)return yt;const e=JSON.parse(t);if(!Array.isArray(e))return yt;const n=new Set(fn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:yt}catch{return yt}}function wu(t){try{localStorage.setItem(ts,JSON.stringify(t))}catch{}}var Su=g("<div class=pop-backdrop>"),$u=g('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),ku=g("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Eu=g("<label class=pick-item><input type=checkbox>");function Iu(t){const[e,n]=O(!1);return(()=>{var r=ku(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(k,{get when(){return e()},get children(){return[(()=>{var s=Su();return s.$$click=()=>n(!1),s})(),(()=>{var s=$u(),a=s.firstChild,o=a.nextSibling;return u(a,f(se,{each:fn,children:l=>(()=>{var c=Eu(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),w(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),w(()=>re(i,"aria-expanded",e())),r})()}me(["click"]);var Cu=g('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),Tu=g("<span class=pggap>…"),Au=g("<button type=button class=pgbtn>");function Pu(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function Ru(t){const e=te(()=>Pu(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Cu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,f(se,{get each(){return e()},children:d=>d==="…"?Tu():(()=>{var h=Au();return h.$$click=()=>t.onGo(d),u(h,d),w(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,w(d=>{var h=t.page()<=1,p=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),p!==d.t&&(c.disabled=d.t=p),d},{e:void 0,t:void 0}),i})()}me(["click"]);var xu=g("<span class=tip>");function pt(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=xu();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?Ds(i,r):e=r,u(r,()=>t.children),w(()=>re(r,"data-tip",t.text??"")),r})()}me(["focusin"]);const Xe="∅";function Q(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function vt(t){return Number(t??0).toLocaleString("en-US")}function an(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function ns(t){return rs(t,{hour:"2-digit",minute:"2-digit"})}function Ou(t){return rs(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function rs(t,e){const n=an(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const is={text:Xe,isNull:!0},En=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Vr(t,e){return!e||Q(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function Nu(t,e){return!e||Q(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function Du(t){if(!t||typeof t!="object"||Q(t.report_date))return is;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function ue(t,e){if(Q(e))return is;switch(t){case"fixed2":return En(e,2);case"fixed3":return En(e,3);case"ivrv":return En(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return Du(e);default:return{text:String(e),isNull:!1}}}const Hr=t=>Number(t*100).toFixed(0);function Lu(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Hr(e.momentum_high),s=Hr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function mt(t,e){return Lu(e)[t]??t}var ss=g("<span class=tip-target>"),Mu=g("<div class=kv><span class=kv-label></span><span class=kv-value>"),Uu=g("<span class=tip-target>Strike position in band"),Fu=g('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),Bu=g("<div class=exp-block><h4>"),Vu=g("<div class=kv-value>Band unavailable (∅)"),Hu=g("<div><span class=marker-tick></span><span class=marker-cap><br>"),Wu=g("<div class=exp-block><h4>Premium economics"),ju=g("<b>"),zu=g('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),Gu=g("<div class=muted-note>earnings-discounted safety applied"),qu=g("<div class=exp-block><h4>Score breakdown"),Ku=g("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),Ju=g('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),Yu=g("<span class=muted-note>all columns visible"),Xu=g('<div class="exp-block exp-chips"><h4>Hidden columns'),Qu=g("<span class=tip-target>: "),Zu=g("<span>"),ed=g("<span class=tip-target>band safety is already discounted by the earnings rule."),td=g("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),nd=g("<div class=expansion><div class=exp-grid>");const In={sharpe:.2,safety:.4,return_part:.4};function Cn(t,e=2){return Q(t)?Xe:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function _e(t,e,n){return(()=>{var r=Mu(),i=r.firstChild,s=i.nextSibling;return u(i,f(pt,{get text(){return mt(t,e)},get children(){var a=ss();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function rd(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=Q(e.mid)?null:e.strike-e.mid,s=i!=null&&!Q(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!Q(a)&&l>a&&!Q(e.strike),d=p=>{if(Q(p))return null;const m=(p-a)/(l-a)*100;return Math.min(100,Math.max(0,m))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(p=>d(p.v)!=null):[];return(()=>{var p=Bu(),m=p.firstChild;return u(m,f(pt,{get text(){return mt("band_range",t.thresholds)},get children(){return Uu()}})),u(p,f(k,{when:c,get fallback(){return Vu()},get children(){var y=Fu(),C=y.firstChild;return u(y,f(se,{each:h,children:b=>(()=>{var v=Hu(),$=v.firstChild,T=$.nextSibling,A=T.firstChild;return u(T,()=>b.label,A),u(T,()=>ue("fixed2",b.v).text,null),w(P=>{var E=`marker ${b.cls}`,U=`${d(b.v)}%`;return E!==P.e&&ae(v,P.e=E),U!==P.t&&Ye(v,"left",P.t=U),P},{e:void 0,t:void 0}),v})()}),null),w(b=>{var v=`${d(e.strike_from)}%`,$=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return v!==b.e&&Ye(C,"left",b.e=v),$!==b.t&&Ye(C,"width",b.t=$),b},{e:void 0,t:void 0}),y}}),null),u(p,()=>_e("band_range",t.thresholds,`${ue("fixed2",e.strike_from).text} → ${ue("fixed2",e.strike_to).text}`),null),u(p,()=>_e("band_depth",t.thresholds,r==null?Xe:`${(r*100).toFixed(1)}%`),null),u(p,()=>_e("cushion_be",t.thresholds,s==null?Xe:`${s.toFixed(1)}%`),null),p})()}function id(t){const e=t.row,n=Q(e.strike)?null:e.strike*100,r=Q(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=ue("pct1",e.rate_of_return);return(()=>{var a=Wu();return a.firstChild,u(a,()=>_e("capital",t.thresholds,n==null?Xe:Cn(n,0)),null),u(a,()=>_e("premium",t.thresholds,r==null?Xe:Cn(r)),null),u(a,()=>_e("breakeven",t.thresholds,i==null?Xe:Cn(i)),null),u(a,()=>_e("ann_ror",t.thresholds,(()=>{var o=ju();return u(o,()=>s.text),o})()),null),u(a,()=>_e("bid",t.thresholds,ue("fixed2",e.bid).text),null),u(a,()=>_e("ask",t.thresholds,ue("fixed2",e.ask).text),null),u(a,()=>_e("expiration",t.thresholds,e.expiration),null),a})()}function sd(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:In.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:In.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:In.return_part,v:n==null?void 0:n.return}];return(()=>{var i=qu();return i.firstChild,u(i,f(k,{when:n,get fallback(){return(()=>{var s=Ku(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ue("fixed3",e.score).text),s})()},get children(){return[f(se,{each:r,children:s=>{const a=Q(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=Ju(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,p=h.nextSibling;p.nextSibling;var m=l.nextSibling,y=m.firstChild,C=m.nextSibling;return u(l,f(pt,{get text(){return mt(s.key,t.thresholds)},get children(){var b=ss();return u(b,()=>s.label),b}}),c),u(d,()=>s.weight*100,p),u(C,()=>ue("fixed3",s.v).text),w(b=>Ye(y,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=zu(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ue("fixed3",e.score).text),s})(),f(k,{get when(){return e.earnings_before_expiry},get children(){return Gu()}})]}}),null),i})()}function ad(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:ue(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=Xu();return n.firstChild,u(n,f(se,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=Zu();return u(s,f(pt,{get text(){return mt(r.id,t.thresholds)},get children(){var a=Qu(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),w(()=>ae(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(k,{get when(){return t.hiddenDefs.length===0},get children(){return Yu()}}),null),n})()}function od(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=nd(),i=r.firstChild;return u(r,f(k,{when:n,get children(){var s=td(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(k,{get when(){return n.report_time},children:p=>p().replaceAll("_"," ")}),c),u(s,f(k,{get when(){return!Q(n.expected_eps)},get children(){return[" ","· expected EPS ",Y(()=>ue("fixed2",n.expected_eps).text)]}}),h),u(s,f(pt,{get text(){return mt("earnings_before_expiry",t.thresholds)},get children(){return ed()}}),null),s}}),i),u(i,f(rd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(id,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(sd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(ad,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var ld=g("<span class=null-mark>"),cd=g("<span class=star>★"),ud=g("<td><b>"),Tn=g("<span>"),Wr=g("<td class=num>"),dd=g("<span class=score-frozen>prod "),hd=g('<td class="num score-cell">'),fd=g('<span class="score-frozen readmit">re-admitted'),gd=g("<td>"),pd=g("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),md=g("<span class=sort-arrow>"),_d=g("<span class=tip-target>"),bd=g("<th role=button tabindex=0>"),yd=g("<tr class=expandable><td class=exp-col>"),vd=g("<tr class=exp-row><td>");const wd=t=>`${t.underlying}|${t.strike}`;function Sd(t){return(()=>{var e=ld();return u(e,()=>t.text),e})()}function Ut(t){const e=ue(t.kind,t.value);return f(k,{get when(){return!e.isNull},get fallback(){return f(Sd,{get text(){return e.text}})},get children(){return e.text}})}function $d(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=ud(),i=r.firstChild;return u(r,f(k,{get when(){return t.pickRank!=null},get children(){var s=cd();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(k,{get when(){return Vr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=Tn();return w(()=>ae(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Wr();return u(r,f(k,{get when(){return Vr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=Tn();return w(()=>ae(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(Ut,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=hd();return u(r,f(Ut,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(k,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(k,{get when(){return!Q(n.frozen_score)},get fallback(){return f(k,{get when(){return!Q(n.score)},get children(){return fd()}})},get children(){var i=dd();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=Wr();return u(r,f(Ut,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(k,{get when(){return Nu(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=Tn();return u(s,i),w(()=>ae(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=gd();return u(r,f(Ut,{get kind(){return e.kind},get value(){return n[e.id]}})),w(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function kd(t){const e=te(()=>fn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=pd(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(se,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=bd();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,f(pt,{get text(){return mt(a.id,t.thresholds)},get children(){var c=_d();return u(c,()=>a.label,null),u(c,f(k,{get when(){return o()},get children(){return[" ",(()=>{var d=md();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),w(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&re(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,f(se,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>wd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=yd(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,f(se,{get each(){return e()},children:p=>f($d,{col:p,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),w(p=>{var m=o()!=null,y=!!Q(a.score),C=!!c();return m!==p.e&&d.classList.toggle("pick",p.e=m),y!==p.t&&d.classList.toggle("prow",p.t=y),C!==p.a&&d.classList.toggle("open",p.a=C),p},{e:void 0,t:void 0,a:void 0}),d})(),f(k,{get when(){return c()},get children(){var d=vd(),h=d.firstChild;return u(h,f(od,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),w(()=>re(h,"colspan",e().length+1)),d}})]}})),n})()}me(["click","keydown"]);function Ed(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const nt=t=>Q(t);function Id(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=nt(a),c=nt(o);return l||c?l&&c?0:l?1:-1:r*Ed(a,o)})}function Cd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=nt(r),a=nt(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=nt(l),h=nt(c);return d||h?d&&h?0:d?1:-1:c-l})}var Td=g("<div class=stage-badges>"),Ad=g("<pre class=errbox>"),Pd=g("<details><summary> "),Rd=g("<div class=scroll-region>"),xd=g('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),Od=g("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),Nd=g("<div class=empty-panel>No rows match the current filter."),Dd=g('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const An=100,Ld=150,jr={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function Md(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=Td();return u(i,f(se,{get each(){return t.stages??[]},children:s=>(()=>{var a=Pd(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,f(k,{get when(){return s.error},get children(){var c=Ad();return u(c,()=>s.error),c}}),null),w(()=>ae(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function zr(t){const[e,n]=O(""),[r,i]=O(""),[s,a]=O(!0),[o,l]=O(null),[c,d]=O("asc"),[h,p]=O(1);let m;Ae(()=>clearTimeout(m));const y=()=>{var S;return((S=t.tf)==null?void 0:S.rows)??[]},C=te(()=>{const S=t.scoring.params(),B=t.scoring.isCustom();return y().map(x=>{const j=uu(x,S);return{...x,frozen_score:x.score,live_parts:j,score:B?j==null?null:j.total:x.score}})}),b=te(()=>C().filter(S=>!Q(S.score)&&Q(S.frozen_score)).length),v=S=>{const B=S.currentTarget.value;n(B),clearTimeout(m),m=setTimeout(()=>{i(B.trim().toLowerCase()),p(1)},Ld)},$=S=>{a(S),p(1)},T=S=>{o()!==S?(l(S),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),p(1)},[A,P]=O(null),E=S=>{const B=`${S.underlying}|${S.strike}`;P(x=>x===B?null:B)};Je(wt([o,c,h,r,s],()=>P(null))),Je(wt(t.active,()=>P(null))),Je(wt(t.columns.visible,()=>p(1)));const U=()=>fn.filter(S=>!t.columns.visible().includes(S.id)),N=()=>(t.stages??[]).find(S=>S.name===jr[t.id].id),M=te(()=>{const S=r();return S?C().filter(B=>{const x=B.underlying,j=B.sector;return x!=null&&String(x).toLowerCase().includes(S)||j!=null&&String(j).toLowerCase().includes(S)}):C()}),I=te(()=>{const S=M();return s()?S.filter(B=>!Q(B.score)):S}),F=te(()=>o()?Id(I(),o(),c()):Cd(I())),H=te(()=>Math.max(1,Math.ceil(F().length/An))),ee=()=>Math.min(h(),H()),he=()=>{const S=ee();return F().slice((S-1)*An,S*An)},ve=te(()=>{var B;const S=new Map;if(t.scoring.isCustom()){const x=du(C().map(j=>({row:j,score:j.score})));for(const j of x)S.set(`${j.row.underlying}|${j.row.strike}`,S.size+1)}else for(const x of((B=t.tf)==null?void 0:B.top_picks)??[])S.set(`${x.underlying}|${x.strike}`,x.rank??"?");return S}),D=S=>ve().get(`${S.underlying}|${S.strike}`);return(()=>{var S=xd(),B=S.firstChild,x=B.firstChild,j=x.nextSibling,oe=j.firstChild,_=j.nextSibling,R=_.firstChild,V=R.nextSibling;return V.nextSibling,u(S,f(Md,{get stages(){return t.stages}}),B),x.$$input=v,oe.addEventListener("change",W=>$(W.currentTarget.checked)),u(B,f(Iu,{get store(){return t.columns}}),_),u(_,()=>vt(F().length),R),u(_,()=>vt(y().length),V),u(_,f(k,{get when(){return Y(()=>!!t.scoring.isCustom())()&&b()>0},get children(){return[" ","· ",Y(()=>vt(b()))," re-admitted by lower floor"]}}),null),u(S,f(k,{get when(){return he().length>0},get children(){var W=Rd();return u(W,f(kd,{get visibleCols(){return t.columns.visible},rows:he,sortKey:o,sortDir:c,onSort:T,get thresholds(){return t.thresholds},pickRankOf:D,openKey:A,onToggleRow:E,hiddenDefs:U,get customScores(){return t.scoring.isCustom}})),W}}),null),u(S,f(k,{get when(){return he().length===0},get children(){return f(k,{get when(){var W,K;return((W=N())==null?void 0:W.status)==="failed"||((K=N())==null?void 0:K.status)==="partial"},get fallback(){return f(k,{get when(){return Y(()=>!!s())()&&M().length>0},get fallback(){return Nd()},get children(){var W=Od(),K=W.firstChild,Z=K.nextSibling,X=Z.nextSibling,we=X.nextSibling,Ge=we.nextSibling;return Ge.nextSibling,u(W,()=>vt(M().length),Ge),W}})},children:W=>(()=>{var K=Dd(),Z=K.firstChild,X=Z.firstChild,we=X.nextSibling;we.nextSibling;var Ge=Z.nextSibling;return u(Z,()=>W().status==="partial"?"△":"✗",X),u(Z,()=>jr[t.id].label,we),u(Ge,()=>W().error??"stage produced no data"),K})()})}}),null),u(S,f(k,{get when(){return F().length>0},get children(){return f(Ru,{page:ee,pageCount:H,onGo:p})}}),null),w(()=>S.hidden=!t.active()),w(()=>x.value=e()),w(()=>oe.checked=s()),S})()}me(["input"]);var Ud=g("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),Fd=g('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save'),Bd=g('<button type=button class="btn-ghost hp-cash-edit">'),Vd=g("<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved"),Hd=g('<button type=button class="btn-ghost holdings-close-btn">sell call…'),Wd=g("<div class=hp-slot><div class=hp-lot-row><div class=hp-lot-row-top><span> sh </span><b></b></div><div class=hp-lot-row-sub><span>bought <!> · </span><b></b></div><div class=hp-lot-row-meta><i>last </i><i>covered <!>/"),jd=g('<span class="chip high">buy back?'),zd=g('<span class="chip high">ITM — called away?'),tr=g("<b>"),Gd=g("<i>"),qd=g('<div class=hp-slot><div class=hp-list-row><span class=hp-list-pos><span class=hp-kind></span><b> <!> ×</b><i>exp <!> · <!>/<!> wd</i></span><span></span><span class=hp-list-pace><i>target </i></span><span class=hp-list-status></span><button type=button class="btn-ghost holdings-close-btn">close…</button><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),Kd=g('<span class="chip normal">holding'),Jd=g("<b>—"),Yd=g("<div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares"),Xd=g('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal></label><label>premium<input inputmode=decimal></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary"></button><button type=button class=btn>Cancel'),Qd=g('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),Zd=g('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class=btn>Cancel'),as=g("<label class=holdings-outcome-price><input inputmode=decimal>"),eh=g("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),th=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),nh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),rh=g("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),ih=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),sh=g("<div class=hp-list>"),Gr=g("<div class=empty-panel>"),ah=g('<div class=hp-list><div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),oh=g("<span class=hp-pane-hint> sh held"),lh=g("<div class=hp-toolbar-row><button type=button class=btn>"),ch=g('<button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),uh=g("<div class=holdings-notice>"),dh=g('<div class="holdings-panel hp-tabs-shell"><div class=hp-tabs-grid><aside class=hp-tabs-rail><div class=hp-tabs-brand>Wheel ledger</div></aside><main class=hp-tabs-main><div class=hp-pane-head><span class=hp-pane-title>'),hh=g("<button type=button class=hp-tab-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>");const ot=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),ht=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),Gt=(t,e=0)=>`${(t*100).toFixed(e)}%`,Ve=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),os=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(Date.UTC(n,r-1,i+e,12)).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function ls(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function fh(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=Ud(),r=n.firstChild,i=r.nextSibling;return w(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&Ye(r,"width",s.e=a),o!==s.t&&Ye(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function gh(t){const[e,n]=O(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=Fd(),s=i.firstChild,a=s.nextSibling;return s.$$input=o=>n(o.target.value),a.$$click=()=>t.onSave(Number(e())),w(()=>{var o;return a.disabled=!r()||((o=t.busy)==null?void 0:o.call(t))}),w(()=>s.value=e()),i})()}function ph(t){const[e,n]=O(!1),r=()=>t.cash==null;return(()=>{var i=Vd(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling,l=o.firstChild,c=l.nextSibling;return c.nextSibling,u(a,(()=>{var d=Y(()=>t.free==null);return()=>d()?"—":ot(t.free)})()),u(o,(()=>{var d=Y(()=>t.cash==null);return()=>d()?"—":ot(t.cash)})(),l),u(o,()=>ot(t.reserved),c),u(i,f(k,{get when(){return!e()},get fallback(){return f(gh,{get cash(){return t.cash},get busy(){return t.busy},onSave:async d=>{await t.onSaveCash(d)&&n(!1)}})},get children(){var d=Bd();return d.$$click=()=>n(!0),u(d,()=>r()?"set cash":"edit cash"),d}}),null),i})()}function mh(t){const e=t.lot,n=()=>e.view;return(()=>{var r=Wd(),i=r.firstChild,s=i.firstChild,a=s.firstChild,o=a.firstChild,l=a.nextSibling,c=s.nextSibling,d=c.firstChild,h=d.firstChild,p=h.nextSibling;p.nextSibling;var m=d.nextSibling,y=c.nextSibling,C=y.firstChild;C.firstChild;var b=C.nextSibling,v=b.firstChild,$=v.nextSibling;return $.nextSibling,u(a,()=>e.shares,o),u(a,()=>e.symbol,null),u(l,(()=>{var T=Y(()=>n().spot==null);return()=>T()?"—":ht(n().spot)})()),u(d,()=>ht(e.basis_per_share),p),u(d,()=>e.acquired,null),u(m,f(k,{get when(){return n().pl_dollars!=null},fallback:"—",get children(){return`${ot(n().pl_dollars)} (${(n().pl_pct??0)>=0?"+":""}${Gt(n().pl_pct,1)})`}})),u(C,()=>{var T;return ls((T=e.mark)==null?void 0:T.as_of)||"—"},null),u(b,()=>n().covered,$),u(b,()=>n().capacity,null),u(r,f(k,{get when(){return n().capacity>0},get children(){var T=Hd();return T.$$click=()=>t.onSellDialog(e),T}}),null),u(r,f(k,{get when(){return t.dialogFor("sellCall",e.id)},keyed:!0,children:T=>f(vh,{get lot(){return T.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}),null),w(()=>ae(m,(n().pl_dollars??0)>=0?"holdings-pos":"holdings-neg")),r})()}function _h(t){const e=t.x,n=()=>e.v.spot_pct_vs_strike!=null&&e.v.spot_pct_vs_strike>0,r=()=>e.p.kind==="call"?e.v.spot_pct_vs_strike>0:e.v.spot_pct_vs_strike<0;return(()=>{var i=qd(),s=i.firstChild,a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,p=h.firstChild,m=p.nextSibling,y=m.nextSibling,C=y.nextSibling,b=C.nextSibling,v=b.nextSibling;v.nextSibling;var $=a.nextSibling,T=$.nextSibling,A=T.firstChild;A.firstChild;var P=T.nextSibling,E=P.nextSibling,U=E.nextSibling,N=U.firstChild,M=N.firstChild,I=M.nextSibling,F=N.nextSibling,H=F.firstChild,ee=H.nextSibling,he=ee.nextSibling,ve=F.nextSibling;ve.firstChild;var D=ve.nextSibling,S=D.firstChild,B=S.nextSibling;return u(o,()=>e.p.kind.toUpperCase()),u(l,()=>e.p.symbol,c),u(l,()=>e.p.strike,d),u(l,()=>e.p.kind==="put"?"P":"C",d),u(l,()=>e.p.contracts,null),u(h,()=>e.p.expiry,m),u(h,()=>e.v.days_elapsed,C),u(h,()=>e.v.days_total,v),u($,(()=>{var x=Y(()=>e.v.pl_pct==null);return()=>x()?"—":`${e.v.pl_pct>=0?"+":""}${Gt(e.v.pl_pct,1)}`})()),u(T,f(fh,{get v(){return e.v}}),A),u(A,()=>Gt(e.v.target_pct),null),u(P,f(k,{get when(){return e.v.pace_met},get fallback(){return Kd()},get children(){return jd()}}),null),u(P,f(k,{get when(){return Y(()=>e.p.kind==="call")()&&n()},get children(){return zd()}}),null),E.$$click=()=>t.onClose(e),u(I,()=>ht(e.p.premium)),u(ee,(()=>{var x=Y(()=>e.p.mark==null);return()=>x()?"—":e.p.mark.mid.toFixed(2)})()),u(he,(()=>{var x=Y(()=>e.p.mark==null);return()=>x()?"unpriced":ls(e.p.mark.as_of)})()),u(ve,f(k,{get when(){var x;return((x=e.p.mark)==null?void 0:x.underlying_price)!=null},get fallback(){return Jd()},get children(){return[(()=>{var x=tr();return u(x,()=>e.p.mark.underlying_price.toFixed(2)),x})(),(()=>{var x=Gd();return u(x,(()=>{var j=Y(()=>e.v.spot_pct_vs_strike==null);return()=>j()?"":`${e.v.spot_pct_vs_strike>=0?"+":""}${Gt(e.v.spot_pct_vs_strike,1)} vs strike`})()),w(()=>ae(x,r()&&e.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),x})()]}}),null),u(B,(()=>{var x=Y(()=>e.v.pl_dollars==null);return()=>x()?"—":ht(e.v.pl_dollars)})()),u(i,f(k,{get when(){return t.dialogFor(e.p.kind,e.p.id)},keyed:!0,children:x=>f(kh,Rs({d:x},()=>t.dialogActions))}),null),w(x=>{var j=!!e.v.pace_met,oe=e.p.kind,_=e.v.pl_pct>=0?"holdings-pos":"holdings-neg",R=(e.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return j!==x.e&&s.classList.toggle("hp-row-met",x.e=j),oe!==x.t&&re(o,"data-kind",x.t=oe),_!==x.a&&ae($,x.a=_),R!==x.o&&ae(B,x.o=R),x},{e:void 0,t:void 0,a:void 0,o:void 0}),i})()}function bh(t){const e=t.kind,[n,r]=O({symbol:"",strike:"",premium:"",contracts:"1",sold:Ve(),expiry:os(Ve(),7)}),i=a=>o=>r({...n(),[a]:o.target.value}),s=()=>n().symbol.trim()&&[n().strike,n().premium,n().contracts].every(a=>Number(a)>0)&&n().expiry>n().sold&&n().sold<=Ve();return(()=>{var a=Xd(),o=a.firstChild,l=o.firstChild,c=l.nextSibling,d=o.nextSibling,h=d.firstChild,p=h.nextSibling,m=d.nextSibling,y=m.firstChild,C=y.nextSibling,b=m.nextSibling,v=b.firstChild,$=v.nextSibling,T=b.nextSibling,A=T.firstChild,P=A.nextSibling,E=T.nextSibling,U=E.firstChild,N=U.nextSibling,M=E.nextSibling,I=M.nextSibling;return a.addEventListener("submit",F=>{var H;F.preventDefault(),!(!s()||(H=t.busy)!=null&&H.call(t))&&t.onAdd({...e==="call"?{kind:"call"}:{},symbol:n().symbol.trim().toUpperCase(),strike:Number(n().strike),premium:Number(n().premium),contracts:Math.trunc(Number(n().contracts)),sold:n().sold,expiry:n().expiry})}),G(c,"input",i("symbol")),G(p,"input",i("strike")),re(p,"placeholder",e==="call"?"e.g. 355.00":"e.g. 350.00"),G(C,"input",i("premium")),re(C,"placeholder",e==="call"?"e.g. 1.80":"e.g. 1.00"),G($,"input",i("contracts")),G(P,"input",i("sold")),G(N,"input",i("expiry")),u(M,e==="call"?"Sell call":"Sell put"),G(I,"click",t.onDone),u(a,f(k,{when:e==="call",get children(){return Yd()}}),null),w(()=>{var F;return M.disabled=!s()||((F=t.busy)==null?void 0:F.call(t))}),w(()=>c.value=n().symbol),w(()=>p.value=n().strike),w(()=>C.value=n().premium),w(()=>$.value=n().contracts),w(()=>P.value=n().sold),w(()=>N.value=n().expiry),a})()}function yh(t){const[e,n]=O({symbol:"",shares:"",basis_per_share:"",acquired:Ve()}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=Qd(),a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=a.nextSibling,d=c.firstChild,h=d.nextSibling,p=c.nextSibling,m=p.firstChild,y=m.nextSibling,C=p.nextSibling,b=C.firstChild,v=b.nextSibling,$=C.nextSibling,T=$.nextSibling;return s.addEventListener("submit",A=>{var P;A.preventDefault(),!(!i()||(P=t.busy)!=null&&P.call(t))&&t.onAdd({kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired})}),G(l,"input",r("symbol")),G(h,"input",r("shares")),G(y,"input",r("basis_per_share")),G(v,"input",r("acquired")),G(T,"click",t.onDone),w(()=>{var A;return $.disabled=!i()||((A=t.busy)==null?void 0:A.call(t))}),w(()=>l.value=e().symbol),w(()=>h.value=e().shares),w(()=>y.value=e().basis_per_share),w(()=>v.value=e().acquired),s})()}function vh(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=O({strike:"",premium:"",contracts:String(n()),expiry:os(Ve(),7)}),s=o=>l=>i({...r(),[o]:l.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>Ve();return(()=>{var o=Zd(),l=o.firstChild,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,p=h.firstChild,m=p.firstChild,y=m.nextSibling,C=p.nextSibling,b=C.firstChild,v=b.nextSibling,$=C.nextSibling,T=$.firstChild,A=T.nextSibling,P=$.nextSibling,E=P.firstChild,U=E.nextSibling,N=P.nextSibling,M=N.nextSibling;return u(l,()=>e.shares,d),u(l,()=>e.symbol,null),h.addEventListener("submit",I=>{var F;I.preventDefault(),!(!a()||(F=t.busy)!=null&&F.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:Ve(),expiry:r().expiry})}),G(y,"input",s("strike")),G(v,"input",s("premium")),G(A,"input",s("contracts")),G(U,"input",s("expiry")),G(M,"click",t.onDone),w(()=>{var I;return N.disabled=!a()||((I=t.busy)==null?void 0:I.call(t))}),w(()=>y.value=r().strike),w(()=>v.value=r().premium),w(()=>A.value=r().contracts),w(()=>U.value=r().expiry),o})()}function wh(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="assigned"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=th(),d=c.firstChild,h=d.firstChild,p=h.nextSibling,m=p.nextSibling,y=m.nextSibling;y.nextSibling;var C=d.nextSibling,b=C.firstChild,v=b.firstChild,$=b.nextSibling,T=$.firstChild,A=$.nextSibling,P=A.firstChild,E=C.nextSibling;E.firstChild;var U=E.nextSibling,N=U.firstChild,M=N.nextSibling;return u(d,()=>e.symbol,p),u(d,()=>e.strike,y),u(d,()=>e.contracts,null),v.addEventListener("change",()=>r("bought-back")),T.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("assigned")),u(c,f(k,{get when(){return n()!=="expired"},get children(){var I=as(),F=I.firstChild;return u(I,()=>n()==="assigned"?"share price at assignment":"close price/share",F),F.$$input=H=>s(H.target.value),w(()=>F.value=i()),I}}),E),u(E,f(k,{get when(){return a()!==null},fallback:"—",get children(){var I=tr();return u(I,()=>ht(a())),w(()=>ae(I,a()>=0?"holdings-pos":"holdings-neg")),I}}),null),G(N,"click",t.onDone),M.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),u(c,f(k,{get when(){return n()==="assigned"},get children(){return eh()}}),null),w(()=>{var I;return M.disabled=((I=t.busy)==null?void 0:I.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),w(()=>v.checked=n()==="bought-back"),w(()=>T.checked=n()==="expired"),w(()=>P.checked=n()==="assigned"),c})()}function Sh(t){const[e,n]=O({...t.d.prefill}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=nh(),a=s.firstChild,o=a.nextSibling,l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=l.nextSibling,p=h.firstChild,m=p.nextSibling,y=h.nextSibling,C=y.firstChild,b=C.nextSibling,v=y.nextSibling,$=v.firstChild,T=$.nextSibling,A=v.nextSibling,P=A.nextSibling;return o.addEventListener("submit",E=>{var U;E.preventDefault(),!(!i()||(U=t.busy)!=null&&U.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired,assigned_from:t.d.pos.id})}),G(d,"input",r("symbol")),G(m,"input",r("shares")),G(b,"input",r("basis_per_share")),G(T,"input",r("acquired")),G(P,"click",t.onDone),w(()=>{var E;return A.disabled=!i()||((E=t.busy)==null?void 0:E.call(t))}),w(()=>d.value=e().symbol),w(()=>m.value=e().shares),w(()=>b.value=e().basis_per_share),w(()=>T.value=e().acquired),s})()}function $h(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="called-away"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=ih(),d=c.firstChild,h=d.firstChild,p=h.nextSibling,m=p.nextSibling,y=m.nextSibling;y.nextSibling;var C=d.nextSibling,b=C.firstChild,v=b.firstChild,$=b.nextSibling,T=$.firstChild,A=$.nextSibling,P=A.firstChild,E=C.nextSibling;E.firstChild;var U=E.nextSibling,N=U.firstChild,M=N.nextSibling;return u(d,()=>e.symbol,p),u(d,()=>e.strike,y),u(d,()=>e.contracts,null),v.addEventListener("change",()=>r("bought-back")),T.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("called-away")),u(c,f(k,{get when(){return n()!=="expired"},get children(){var I=as(),F=I.firstChild;return u(I,()=>n()==="called-away"?"share price at call":"close price/share",F),F.$$input=H=>s(H.target.value),w(()=>F.value=i()),I}}),E),u(E,f(k,{get when(){return a()!==null},fallback:"—",get children(){var I=tr();return u(I,()=>ht(a())),w(()=>ae(I,a()>=0?"holdings-pos":"holdings-neg")),I}}),null),G(N,"click",t.onDone),M.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),u(c,f(k,{get when(){return n()==="called-away"},get children(){var I=rh(),F=I.firstChild,H=F.nextSibling,ee=H.nextSibling,he=ee.nextSibling;return he.nextSibling,u(I,()=>e.symbol,H),u(I,()=>e.contracts*100,he),I}}),null),w(()=>{var I;return M.disabled=((I=t.busy)==null?void 0:I.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),w(()=>v.checked=n()==="bought-back"),w(()=>T.checked=n()==="expired"),w(()=>P.checked=n()==="called-away"),c})()}function kh(t){return t.d.type==="put"?t.d.stage==="lot"?f(Sh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(wh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f($h,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function Eh(){const[t,e]=O(null),[n,r]=O("");let i;const s=_=>{r(_),clearTimeout(i),i=setTimeout(()=>r(""),4e3)};Ae(()=>clearTimeout(i));const[a,o]=O(null),[l,c]=O(!1),d=async()=>{try{e(await js())}catch(_){s(`Holdings API error: ${_.message}`)}};lt(d);const h=()=>{var _;return((_=t())==null?void 0:_.positions)??[]},p=()=>{var _;return((_=t())==null?void 0:_.calls)??[]},m=()=>{var _;return((_=t())==null?void 0:_.lots)??[]},y=()=>h().map(_=>({p:{..._,kind:"put"},v:_.view})),C=()=>p().map(_=>({p:{..._,kind:"call"},v:_.view})),b=_=>_.v.pl_pct==null?-1/0:_.v.pl_pct-_.v.target_pct,v=(_,R)=>{var K,Z;const V=a();return!V||V.type!==_?null:(((K=V.pos)==null?void 0:K.id)??((Z=V.lot)==null?void 0:Z.id))===R?V:null},$=async _=>{if(l())return null;c(!0);try{return await _()}catch(R){return s(R.message),null}finally{c(!1)}},T=async()=>{var V;const _=await $(()=>zs());if(!_)return;const R=((V=_.refresh)==null?void 0:V.stale)??[];s(R.length?`Marks refreshed — ${R.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await d()},A=async(_,R)=>{await $(()=>ar(_))&&(s(R),o(null),await d())},P=async(_,R)=>{await $(()=>ar(R))&&(s(`Assigned — recorded ${R.shares} sh ${R.symbol} at $${R.basis_per_share.toFixed(2)} basis.`),o(null),await d())},E=async(_,R,V)=>{if(R==="assigned"){o({type:"put",pos:_,stage:"lot",prefill:{symbol:_.symbol,shares:_.contracts*100,basis_per_share:+(_.strike-_.premium).toFixed(2),acquired:Ve()}});return}await $(()=>or(_.id))&&(s(R==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},U=async(_,R,V)=>{if(R==="called-away"){const K=await $(()=>qs(_.id));if(!K)return;s(K.reduced?`Called away — ${_.symbol} lot reduced by ${_.contracts*100} sh.`:`Called away — call removed. ${K.reason??""}`),o(null),await d();return}await $(()=>or(_.id))&&(s(R==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},N=async _=>{const R=await $(()=>Gs(_));return R?(e(V=>({...V??{},cash:R.cash,cash_reserved:R.cash_reserved,cash_free:R.cash_free})),s(`Cash set to ${ot(R.cash)} — ${ot(R.cash_free)} free.`),!0):!1},M={busy:l,onDone:()=>o(null),onConfirmPut:E,onConfirmCall:U,onAssign:P},[I,F]=O("lots"),H=()=>[{id:"lots",label:"Lots",count:m().length,sub:`${m().reduce((_,R)=>_+R.shares,0)} sh held`},{id:"puts",label:"Puts",count:h().length,sub:`${h().filter(_=>_.view.pace_met).length} pace-met`},{id:"calls",label:"Calls",count:p().length,sub:`${p().filter(_=>_.view.spot_pct_vs_strike>0).length} ITM`}],ee=()=>[...y()].sort((_,R)=>b(R)-b(_)),he=()=>[...C()].sort((_,R)=>b(R)-b(_)),ve={lots:{label:"+ New lot",type:"addLot"},puts:{label:"+ Sell put",type:"addPut"},calls:{label:"+ Sell call",type:"addCall"}},D={lots:"No recorded lots — assignments land here.",puts:"No open puts — press “+ Sell put” to record one.",calls:"No open calls — press “+ Sell call” to record one."},S=_=>{if(_==="lots")return f(k,{get when(){return m().length>0},get fallback(){return(()=>{var V=Gr();return u(V,()=>D.lots),V})()},get children(){var V=sh();return u(V,f(se,{get each(){return m()},children:W=>f(mh,{lot:W,dialogFor:v,busy:l,onSellDialog:K=>o({type:"sellCall",lot:K}),onDialogDone:()=>o(null),onSellCall:(K,Z)=>A(Z,`Sold ${Z.symbol} ${Z.strike}C ×${Z.contracts} — Refresh marks to price.`)})})),V}});const R=_==="puts"?ee():he();return f(k,{get when(){return R.length>0},get fallback(){return(()=>{var V=Gr();return u(V,()=>D[_]),V})()},get children(){var V=ah();return V.firstChild,u(V,f(se,{each:R,children:W=>f(_h,{x:W,dialogFor:v,dialogActions:M,onClose:K=>o({type:K.p.kind,pos:K.p})})}),null),V}})},B=_=>f(k,{get when(){var R,V,W;return _==="lots"&&((R=a())==null?void 0:R.type)==="addLot"||_==="puts"&&((V=a())==null?void 0:V.type)==="addPut"||_==="calls"&&((W=a())==null?void 0:W.type)==="addCall"},keyed:!0,get children(){return _==="lots"?f(yh,{busy:l,onDone:()=>o(null),onAdd:R=>A(R,`Recorded ${R.shares} sh ${R.symbol}.`)}):f(bh,{kind:_==="puts"?"put":"call",busy:l,onDone:()=>o(null),onAdd:R=>A(R,`Sold ${R.symbol} ${R.strike}${_==="puts"?"P":"C"} ×${R.contracts} — Refresh marks to price.`)})}}),x=_=>(()=>{var R=lh(),V=R.firstChild;return V.$$click=()=>o({type:ve[_].type}),u(V,()=>ve[_].label),u(R,f(k,{when:_==="lots",get children(){var W=oh(),K=W.firstChild;return u(W,()=>m().reduce((Z,X)=>Z+X.shares,0),K),W}}),null),R})(),j=()=>(()=>{var _=ch();return _.$$click=T,w(()=>_.disabled=l()),_})(),oe=()=>f(k,{get when(){return n()},get children(){var _=uh();return u(_,n),_}});return(()=>{var _=dh(),R=_.firstChild,V=R.firstChild;V.firstChild;var W=V.nextSibling,K=W.firstChild,Z=K.firstChild;return u(V,f(ph,{get cash(){var X;return((X=t())==null?void 0:X.cash)??null},get reserved(){var X;return((X=t())==null?void 0:X.cash_reserved)??0},get free(){var X;return((X=t())==null?void 0:X.cash_free)??null},busy:l,onSaveCash:N}),null),u(V,f(se,{get each(){return H()},children:X=>(()=>{var we=hh(),Ge=we.firstChild,nr=Ge.nextSibling,fs=nr.nextSibling;return we.$$click=()=>F(X.id),u(Ge,()=>X.label.toUpperCase()),u(nr,()=>X.count),u(fs,()=>X.sub),w(()=>we.classList.toggle("active",I()===X.id)),we})()}),null),u(Z,()=>H().find(X=>X.id===I()).label),u(K,j,null),u(W,oe,null),u(W,()=>x(I()),null),u(W,()=>B(I()),null),u(W,()=>S(I()),null),_})()}me(["input","click"]);async function Ih(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var Ch=g("<button type=button class=run-btn>"),Th=g("<span class=run-count>/"),Ah=g("<span class=run-bar><span class=fill>"),Ph=g("<li><span class=mark></span><span class=label>"),Rh=g("<div class=toast-cached>Served from cache — last run <!> min old"),xh=g('<div class="toast-cached warn">'),Oh=g("<div class=run-headline>"),Nh=g("<ul class=run-stages>"),Dh=g("<details class=run-errors><summary>details</summary><ul>"),Lh=g("<div class=run-warn>Closing this tab stops the run."),Mh=g("<div class=run-warn>Re-checking every 15 s…"),Uh=g("<div class=run-strip>"),Fh=g("<li> ");const cs=["quotes","metrics","chains_short","chains_medium"],us={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},Bh=15e3,ds=t=>t!==null&&Date.now()>=t;function qr(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function Vh(t){const[e,n]=O("idle"),[r,i]=O(A()),[s,a]=O(null),[o,l]=O(0),[c,d]=O(null),[h,p]=O(null),[m,y]=O("");let C=null,b=null;const[v,$]=O(0);let T=null;Je(()=>{const D=t();if(T&&(clearTimeout(T),T=null),(D==null?void 0:D.run_allowed)===!1){const S=an(D.next_open_utc);S!==null&&(T=setTimeout(()=>$(B=>B+1),Math.max(0,S-Date.now())))}});function A(){return Object.fromEntries(cs.map(D=>[D,{status:"pending",error:null}]))}function P(){C&&clearInterval(C),C=null,b&&clearInterval(b),b=null}function E(){l(0),C=setInterval(()=>l(D=>D+1),1e3)}function U(D){switch(D.type){case"stage_started":i(S=>({...S,[D.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:D.stage,done:D.done,total:D.total});break;case"stage_finished":i(S=>({...S,[D.stage]:{status:D.ok?"ok":"failed",error:D.error??null}}));break;case"run_finished":d(D);break}}function N(){P();const D=c(),S=((D==null?void 0:D.stages)??[]).some(B=>B.name.startsWith("chains")&&["ok","partial"].includes(B.status));n(D&&(S||D.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function M(D){let S=!1;return await Ih(D,B=>{U(B),B.type==="run_finished"&&(S=!0)}),S?(N(),!0):!1}async function I(D){n("detached"),b=setInterval(async()=>{var S,B,x;try{const j=await ri(),oe=((B=(S=j==null?void 0:j.result)==null?void 0:S.run)==null?void 0:B.finished_at_utc)??null;if(oe&&oe!==D){i(F(j.result)),P(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((x=j==null?void 0:j.run_state)==null?void 0:x.status)!=="running"&&(P(),n("idle"),y("Stream lost and the run was canceled — press Run to retry."))}catch{}},Bh)}function F(D){const S=A();for(const B of(D==null?void 0:D.stages)??[])S[B.name]&&(S[B.name]={status:B.status,error:B.error});return S}async function H(){var x,j,oe;if(["starting","running","detached"].includes(e()))return;y(""),d(null),a(null),i(A()),p(null);const D=((oe=(j=(x=t())==null?void 0:x.result)==null?void 0:j.run)==null?void 0:oe.finished_at_utc)??null;n("running"),E();let S;try{S=await Hs()}catch{P(),n("idle"),y("Run failed to start — network or server unreachable.");return}const B=S.headers.get("content-type")??"";if(S.ok&&B.includes("application/json")){const _=await S.json().catch(()=>null);if(P(),n("idle"),(_==null?void 0:_.status)==="cached"){p(_.age_secs),setTimeout(()=>p(null),6e3);return}}if(S.status===403&&B.includes("application/json")){const _=await S.json().catch(()=>null);P(),n("idle"),y(_!=null&&_.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(_.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(S.status===202){const _=await Ws();if(_.ok&&(_.headers.get("content-type")??"").includes("text/event-stream")){await M(_)||await I(D);return}await I(D);return}if(B.includes("text/event-stream")){await M(S)||await I(D);return}P(),n("idle"),y(`Unexpected /api/run response (${S.status}, ${B||"no type"}).`)}return Ae(()=>{P(),T&&clearTimeout(T)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:m,triggerRun:H,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{v();const D=t();return(D==null?void 0:D.run_allowed)!==!1?!0:ds(an(D==null?void 0:D.next_open_utc))},nextOpenUtc:()=>{var D;return((D=t())==null?void 0:D.next_open_utc)??null}}}function Hh(t){const e=()=>!t.run.runAllowed(),n=()=>ns(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=Ch();return i.$$click=()=>t.run.triggerRun(),u(i,r),w(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&re(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function Wh(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=Ph(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>us[t.name]),u(i,f(k,{get when(){return r()!==null},get children(){return[(()=>{var o=Th(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=Ah(),l=o.firstChild;return w(c=>Ye(l,"width",`${r()}%`)),o})()]}}),null),w(()=>ae(i,`run-stage ${e()}`)),i})()}function jh(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",Y(()=>qr(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",Y(()=>qr(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(k,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=Uh();return u(i,f(k,{get when(){return e.cachedToast()},get children(){var s=Rh(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(k,{get when(){return e.notice()},get children(){var s=xh();return u(s,()=>e.notice()),s}}),null),u(i,f(k,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=Oh();return u(s,r),s})(),(()=>{var s=Nh();return u(s,()=>cs.map(a=>f(Wh,{name:a,run:e}))),s})(),f(k,{get when(){return Y(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=Dh(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=Fh(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>us[l.name]??l.name,null),u(c,(()=>{var h=Y(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,f(k,{get when(){return Y(()=>e.phase()==="running")()&&!n()},get children(){return Lh()}}),null),u(i,f(k,{get when(){return e.phase()==="detached"},get children(){return Mh()}}),null),i}})}me(["click"]);var hs=g("<b>"),zh=g("<span>Market closed · last run <b></b> ago"),Gh=g("<div class=cache-line><span></span><span class=pill>run: "),qh=g("<span>Cached · <b></b> left"),Kh=g("<span>Stale · last run <b></b> ago"),Jh=g("<nav class=tabs role=tablist aria-label=timeframes>"),Yh=g("<button type=button role=tab class=tab>"),Xh=g('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),Qh=g("<div class=pop-backdrop>"),Zh=g("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),ef=g("<div class=error-banner>API error: "),tf=g("<div class=shell><header><div class=user-box></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),nf=g("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function rf(){const[t,e]=O(vu()),n=r=>{e(r),wu(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(yt)}}function Kr(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function sf(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function Jr(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function Pn(t){return f(k,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=hs();return u(e,()=>t.at()),e})()]}})}function af(t){const[e,n]=O(0);lt(()=>{const m=setInterval(()=>n(y=>y+1),3e4);Ae(()=>clearInterval(m))});let r=Date.now(),i=0;Je(wt(()=>t.envelope,m=>{r=Date.now(),i=(m==null?void 0:m.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const m=Math.max(0,(t.envelope.cache_secs??0)-s());return m>=60?`${Math.floor(m/60)}m`:`${m}s`},c=()=>{var m,y;return Ou((y=(m=t.envelope.result)==null?void 0:m.run)==null?void 0:y.finished_at_utc)},d=()=>{e();const m=t.envelope.next_open_utc,y=an(m);if(!(y===null||ds(y)))return ns(m)},h=()=>o()&&a()==="stale"?"closed":a(),p=()=>a()==="fresh"||a()==="stale";return(()=>{var m=Gh(),y=m.firstChild,C=y.nextSibling;return C.firstChild,u(m,f(k,{get when(){return Y(()=>!!o())()&&p()},get fallback(){return f(k,{get when(){return a()==="fresh"},get fallback(){return f(k,{get when(){return a()==="stale"},get children(){var b=Kh(),v=b.firstChild,$=v.nextSibling;return $.nextSibling,u($,()=>Jr(s())),u(b,f(Pn,{at:c}),null),b}})},get children(){var b=qh(),v=b.firstChild,$=v.nextSibling;return $.nextSibling,u($,l),u(b,f(Pn,{at:c}),null),b}})},get children(){var b=zh(),v=b.firstChild,$=v.nextSibling;return $.nextSibling,u($,()=>Jr(s())),u(b,f(Pn,{at:c}),null),u(b,f(k,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var T=hs();return u(T,d),T})()]}}),null),b}}),y),u(y,(()=>{var b=Y(()=>h()==="closed");return()=>b()?"market closed":a()})()),u(C,()=>{var b;return((b=t.envelope.run_state)==null?void 0:b.status)??"idle"},null),w(()=>ae(y,"pill "+h())),m})()}function Yr(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=Jh();return u(n,()=>e.map(r=>(()=>{var i=Yh();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=Y(()=>!r.holdings);return()=>s()&&` (${vt(sf(t.result,r.id))})`})(),null),w(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&re(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function of(){const[t,e]=O(void 0),[n,{refetch:r}]=ws(t,v=>v?ri():void 0);lt(()=>{if(!dt){e(null);return}const v=Tl(tt(),e);Ae(v)});const[i,s]=O(!1);Je(wt(t,v=>{s(!1),!(!v||!dt)&&Us().then($=>s($.status===403)).catch(()=>{})})),lt(()=>{const v=()=>r();window.addEventListener("webapp:refresh-latest",v),Ae(()=>window.removeEventListener("webapp:refresh-latest",v))});const a=()=>{var v,$;return((v=t())==null?void 0:v.email)||(($=t())==null?void 0:$.uid)||""},[o,l]=O(!1),[c,d]=O(!1),h=rf(),[p,m]=O("short"),y=()=>p()==="holdings",C=_u(),b=Vh(()=>n());return f(k,{get when(){return t()},get fallback(){return f(tu,{})},get children(){return[f(k,{get when(){return!i()},get fallback(){return f(eu,{get email(){return a()},onSignOut:()=>Fr()})},get children(){var v=tf(),$=v.firstChild,T=$.firstChild,A=T.nextSibling,P=A.nextSibling;return u(T,f(k,{get when(){return t()},get children(){return[(()=>{var E=Xh(),U=E.firstChild,N=U.nextSibling;return E.$$click=()=>l(!o()),u(N,a),w(()=>re(E,"aria-expanded",o())),E})(),f(k,{get when(){return o()},get children(){return[(()=>{var E=Qh();return E.$$click=()=>l(!1),E})(),(()=>{var E=Zh(),U=E.firstChild,N=U.nextSibling,M=N.nextSibling,I=M.nextSibling;return u(N,a),M.$$click=()=>{l(!1),d(!0)},I.$$click=()=>{l(!1),Fr()},E})()]}})]}})),u($,f(k,{get when(){return Y(()=>!n.loading)()&&!n.error},get children(){return f(af,{get envelope(){return n()}})}}),P),u(P,f(Hh,{run:b})),u(v,f(k,{get when(){return n.error},get children(){var E=ef();return E.firstChild,u(E,()=>n.error.message,null),E}}),null),u(v,f(jh,{run:b}),null),u(v,f(k,{get when(){return y()},get children(){return[f(Yr,{result:()=>{var E;return(E=n())==null?void 0:E.result},tab:p,onTab:m}),f(Eh,{})]}}),null),u(v,f(k,{get when(){return!y()},get children(){return f(k,{get when(){var E;return Y(()=>!n.loading)()&&((E=n())==null?void 0:E.result)},get fallback(){return f(k,{get when(){return!n.loading},get children(){return nf()}})},children:E=>{const U=()=>E();return[f(yu,{scoring:C}),f(Yr,{result:U,tab:p,onTab:m}),f(zr,{id:"short",active:()=>p()==="short",get tf(){var N;return(N=U().timeframes)==null?void 0:N.short},get stageError(){return Kr(U(),"chains_short")},get stages(){return U().stages},get thresholds(){return U().thresholds},columns:h,scoring:C}),f(zr,{id:"medium",active:()=>p()==="medium",get tf(){var N;return(N=U().timeframes)==null?void 0:N.medium},get stageError(){return Kr(U(),"chains_medium")},get stages(){return U().stages},get thresholds(){return U().thresholds},columns:h,scoring:C})]}})}}),null),v}}),f(k,{get when(){return c()},get children(){return f(ou,{onClose:()=>d(!1)})}})]}})}me(["click"]);Ns(()=>f(of,{}),document.getElementById("root"));
