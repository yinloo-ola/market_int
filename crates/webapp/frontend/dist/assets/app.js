(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const hs=!1,fs=(t,e)=>t===e,ps=Symbol("solid-track"),Wt={equals:fs};let Xr=ni;const $e=1,jt=2,Qr={owned:null,cleanups:null,context:null,owner:null},un={};var j=null;let dn=null,gs=null,W=null,J=null,Ie=null,nn=0;function Lt(t,e){const n=W,r=j,i=t.length===0,s=e===void 0?r:e,a=i?Qr:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>le(()=>vt(a)));j=a,W=null;try{return Fe(o,!0)}finally{W=n,j=r}}function O(t,e){e=e?Object.assign({},Wt,e):Wt;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),ti(n,i));return[ei.bind(n),r]}function ms(t,e,n){const r=rn(t,e,!0,$e);lt(r)}function k(t,e,n){const r=rn(t,e,!1,$e);lt(r)}function ze(t,e,n){Xr=Es;const r=rn(t,e,!1,$e);r.user=!0,Ie?Ie.push(r):lt(r)}function Y(t,e,n){n=n?Object.assign({},Wt,n):Wt;const r=rn(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,lt(r),ei.bind(r)}function _s(t){return t&&typeof t=="object"&&"then"in t}function Zr(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=un,l=!1,c="initialValue"in s,d=typeof r=="function"&&Y(r);const h=new Set,[m,g]=(s.storage||O)(s.initialValue),[_,I]=O(void 0),[b,y]=O(void 0,{equals:!1}),[v,x]=O(c?"ready":"unresolved");j&&Ue(()=>{for(const P of h.keys())P.decrement();h.clear(),a=null});function A(P,D,U,F){return a===P&&(a=null,F!==void 0&&(c=!0),(P===o||D===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(F,{value:D})),o=un,T(D,U)),D}function T(P,D){Fe(()=>{D===void 0&&g(()=>P),x(D!==void 0?"errored":c?"ready":"unresolved"),I(D);for(const U of h.keys())U.decrement();h.clear()},!1)}function S(){const P=ys,D=m(),U=_();if(U!==void 0&&!a)throw U;return W&&W.user,D}function L(P=!0){if(P!==!1&&l)return;l=!1;const D=d?d():r;if(D==null||D===!1){A(a,le(m));return}let U;const F=o!==un?o:le(()=>{try{return i(D,{value:m(),refetching:P})}catch(Q){U=Q}});if(U!==void 0){A(a,void 0,Mt(U),D);return}else if(!_s(F))return A(a,F,void 0,D),F;return a=F,"v"in F?(F.s===1?A(a,F.v,void 0,D):A(a,void 0,Mt(F.v),D),F):(l=!0,queueMicrotask(()=>l=!1),Fe(()=>{x(c?"refreshing":"pending"),y()},!1),F.then(Q=>A(F,Q,void 0,D),Q=>A(F,void 0,Mt(Q),D)))}Object.defineProperties(S,{state:{get:()=>v()},error:{get:()=>_()},loading:{get(){const P=v();return P==="pending"||P==="refreshing"}},latest:{get(){if(!c)return S();const P=_();if(P&&!a)throw P;return m()}}});let R=j;return d?ms(()=>(R=j,L(!1))):L(!1),[S,{refetch:P=>bs(R,()=>L(P)),mutate:g}]}function le(t){if(W===null)return t();const e=W;W=null;try{return t()}finally{W=e}}function _t(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=le(()=>e(a,i,s));return i=a,o}}function wt(t){ze(()=>le(t))}function Ue(t){return j===null||(j.cleanups===null?j.cleanups=[t]:j.cleanups.push(t)),t}function bs(t,e){const n=j,r=W;j=t,W=null;try{return Fe(e,!0)}catch(i){Mn(i)}finally{j=n,W=r}}const[Rh,Ph]=O(!1);let ys;function ei(){if(this.sources&&this.state)if(this.state===$e)lt(this);else{const t=J;J=null,Fe(()=>Gt(this),!1),J=t}if(W){const t=this.observers;if(!t||t[t.length-1]!==W){const e=t?t.length:0;W.sources?(W.sources.push(this),W.sourceSlots.push(e)):(W.sources=[this],W.sourceSlots=[e]),t?(t.push(W),this.observerSlots.push(W.sources.length-1)):(this.observers=[W],this.observerSlots=[W.sources.length-1])}}return this.value}function ti(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Fe(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=dn&&dn.running;a&&dn.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?J.push(s):Ie.push(s),s.observers&&ri(s)),a||(s.state=$e)}if(J.length>1e6)throw J=[],new Error},!1)),e}function lt(t){if(!t.fn)return;vt(t);const e=nn;ws(t,t.value,e)}function ws(t,e,n){let r;const i=j,s=W;W=j=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=$e,t.owned&&t.owned.forEach(vt),t.owned=null),t.updatedAt=n+1,Mn(a)}finally{W=s,j=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?ti(t,r):t.value=r,t.updatedAt=n)}function rn(t,e,n,r=$e,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:j,context:j?j.context:null,pure:n};return j===null||j!==Qr&&(j.owned?j.owned.push(s):j.owned=[s]),s}function zt(t){if(t.state===0)return;if(t.state===jt)return Gt(t);if(t.suspense&&le(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<nn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===$e)lt(t);else if(t.state===jt){const r=J;J=null,Fe(()=>Gt(t,e[0]),!1),J=r}}function Fe(t,e){if(J)return t();let n=!1;e||(J=[]),Ie?n=!0:Ie=[],nn++;try{const r=t();return vs(n),r}catch(r){n||(Ie=null),J=null,Mn(r)}}function vs(t){if(J&&(ni(J),J=null),t)return;const e=Ie;Ie=null,e.length&&Fe(()=>Xr(e),!1)}function ni(t){for(let e=0;e<t.length;e++)zt(t[e])}function Es(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:zt(r)}for(e=0;e<n;e++)zt(t[e])}function Gt(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===$e?r!==e&&(!r.updatedAt||r.updatedAt<nn)&&zt(r):i===jt&&Gt(r,e)}}}function ri(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=jt,n.pure?J.push(n):Ie.push(n),n.observers&&ri(n))}}function vt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)vt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)vt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function Mt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function Mn(t,e=j){throw Mt(t)}const Is=Symbol("fallback");function sr(t){for(let e=0;e<t.length;e++)t[e]()}function Ss(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Ue(()=>sr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[ps],le(()=>{let g,_,I,b,y,v,x,A,T;if(c===0)a!==0&&(sr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Is],i[0]=Lt(S=>(s[0]=S,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=Lt(m);a=c}else{for(I=new Array(c),b=new Array(c),o&&(y=new Array(c)),v=0,x=Math.min(a,c);v<x&&r[v]===l[v];v++);for(x=a-1,A=c-1;x>=v&&A>=v&&r[x]===l[A];x--,A--)I[A]=i[x],b[A]=s[x],o&&(y[A]=o[x]);for(g=new Map,_=new Array(A+1),h=A;h>=v;h--)T=l[h],d=g.get(T),_[h]=d===void 0?-1:d,g.set(T,h);for(d=v;d<=x;d++)T=r[d],h=g.get(T),h!==void 0&&h!==-1?(I[h]=i[d],b[h]=s[d],o&&(y[h]=o[d]),h=_[h],g.set(T,h)):s[d]();for(h=v;h<c;h++)h in I?(i[h]=I[h],s[h]=b[h],o&&(o[h]=y[h],o[h](h))):i[h]=Lt(m);i=i.slice(0,a=c),r=l.slice(0)}return i});function m(g){if(s[h]=g,o){const[_,I]=O(h);return o[h]=I,e(l[h],_)}return e(l[h])}}}function f(t,e){return le(()=>t(e||{}))}const ks=t=>`Stale read from <${t}>.`;function ee(t){const e="fallback"in t&&{fallback:()=>t.fallback};return Y(Ss(()=>t.each,t.children,e||void 0))}function E(t){const e=t.keyed,n=Y(()=>t.when,void 0,void 0),r=e?n:Y(n,void 0,{equals:(i,s)=>!i==!s});return Y(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?le(()=>s(e?i:()=>{if(!le(r))throw ks("Show");return n()})):s}return t.fallback},void 0,void 0)}const q=t=>Y(()=>t());function $s(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,m=1,g;for(;++h<i&&h<s&&!((g=c.get(e[h]))==null||g!==d+m);)m++;if(m>d-o){const _=e[a];for(;o<d;)t.insertBefore(n[o++],_)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const ar="_$DX_DELEGATE";function Ts(t,e,n,r={}){let i;return Lt(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function p(t,e,n,r){let i;const s=()=>{const o=document.createElement("template");return o.innerHTML=t,o.content.firstChild},a=()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function ce(t,e=window.document){const n=e[ar]||(e[ar]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,As))}}function re(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function te(t,e){e==null?t.removeAttribute("class"):t.className=e}function he(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function Ge(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function Cs(t,e,n){return le(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return Kt(t,e,r,n);k(i=>Kt(t,e(),i,n),r)}function As(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function Kt(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=Qe(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=Qe(t,n,r);else{if(s==="function")return k(()=>{let o=e();for(;typeof o=="function";)o=o();n=Kt(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Tn(o,e,n,i))return k(()=>n=Kt(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=Qe(t,n,r),a)return n}else l?n.length===0?or(t,o,r):$s(t,n,o):(n&&Qe(t),or(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=Qe(t,n,r,e);Qe(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Tn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Tn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=Tn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function or(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function Qe(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let Ut=null;function Rs(t){Ut=t}async function ue(t,e={}){if(!Ut)return fetch(t,e);const n=new Headers(e.headers??{}),r=await Ut(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await Ut(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function ii(){const t=await ue("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function Ps(){return ue("/api/me")}async function Os(){const t=await ue("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function xs(t){const e=await ue("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function Ns(t){const e=await ue("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function Ds(){return await ue("/api/run",{method:"POST"})}async function Ls(){return ue("/api/progress")}async function Ms(){const t=await ue("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function Us(t){const e=await ue("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function Fs(t){const e=await ue(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function Bs(){const t=await ue("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}const Vs=()=>{};var lr={};/**
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
 */const si=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Hs=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},ai={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let m=(o&15)<<2|c>>6,g=c&63;l||(g=64,a||(m=64)),r.push(n[d],n[h],n[m],n[g])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(si(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Hs(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||c==null||h==null)throw new Ws;const m=s<<2|o>>4;if(r.push(m),c!==64){const g=o<<4&240|c>>2;if(r.push(g),h!==64){const _=c<<6&192|h;r.push(_)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Ws extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const js=function(t){const e=si(t);return ai.encodeByteArray(e,!0)},oi=function(t){return js(t).replace(/\./g,"")},li=function(t){try{return ai.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function zs(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Gs=()=>zs().__FIREBASE_DEFAULTS__,Ks=()=>{if(typeof process>"u"||typeof lr>"u")return;const t=lr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},qs=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&li(t[1]);return e&&JSON.parse(e)},Un=()=>{try{return Vs()||Gs()||Ks()||qs()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Js=t=>{var e,n;return(n=(e=Un())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},ci=()=>{var t;return(t=Un())==null?void 0:t.config},ui=t=>{var e;return(e=Un())==null?void 0:e[`_${t}`]};/**
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
 */class di{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function X(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ys(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(X())}function Xs(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Qs(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Zs(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ea(){const t=X();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function ta(){try{return typeof indexedDB=="object"}catch{return!1}}function na(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const ra="FirebaseError";class Be extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=ra,Object.setPrototypeOf(this,Be.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,$t.prototype.create)}}class $t{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?ia(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new Be(i,o,r)}}function ia(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function sa(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function st(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(cr(s)&&cr(a)){if(!st(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function cr(t){return t!==null&&typeof t=="object"}/**
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
 */function Tt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function ft(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function pt(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function aa(t,e){const n=new oa(t,e);return n.subscribe.bind(n)}class oa{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");la(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=hn),i.error===void 0&&(i.error=hn),i.complete===void 0&&(i.complete=hn);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function la(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function hn(){}/**
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
 */function Te(t){return t&&t._delegate?t._delegate:t}/**
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
 */function Fn(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ca(t){return(await fetch(t,{credentials:"include"})).ok}class at{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const We="[DEFAULT]";/**
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
 */class ua{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new di;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ha(e))try{this.getOrInitializeService({instanceIdentifier:We})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=We){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=We){return this.instances.has(e)}getOptions(e=We){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:da(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=We){return this.component?this.component.multipleInstances?e:We:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function da(t){return t===We?void 0:t}function ha(t){return t.instantiationMode==="EAGER"}/**
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
 */class fa{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new ua(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var H;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(H||(H={}));const pa={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},ga=H.INFO,ma={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},_a=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=ma[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class hi{constructor(e){this.name=e,this._logLevel=ga,this._logHandler=_a,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in H))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?pa[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...e),this._logHandler(this,H.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...e),this._logHandler(this,H.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,H.INFO,...e),this._logHandler(this,H.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,H.WARN,...e),this._logHandler(this,H.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...e),this._logHandler(this,H.ERROR,...e)}}const ba=(t,e)=>e.some(n=>t instanceof n);let ur,dr;function ya(){return ur||(ur=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function wa(){return dr||(dr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const fi=new WeakMap,Cn=new WeakMap,pi=new WeakMap,fn=new WeakMap,Bn=new WeakMap;function va(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Me(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&fi.set(n,t)}).catch(()=>{}),Bn.set(e,t),e}function Ea(t){if(Cn.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Cn.set(t,e)}let An={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Cn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||pi.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Me(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Ia(t){An=t(An)}function Sa(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(pn(this),e,...n);return pi.set(r,e.sort?e.sort():[e]),Me(r)}:wa().includes(t)?function(...e){return t.apply(pn(this),e),Me(fi.get(this))}:function(...e){return Me(t.apply(pn(this),e))}}function ka(t){return typeof t=="function"?Sa(t):(t instanceof IDBTransaction&&Ea(t),ba(t,ya())?new Proxy(t,An):t)}function Me(t){if(t instanceof IDBRequest)return va(t);if(fn.has(t))return fn.get(t);const e=ka(t);return e!==t&&(fn.set(t,e),Bn.set(e,t)),e}const pn=t=>Bn.get(t);function $a(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Me(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Me(a.result),l.oldVersion,l.newVersion,Me(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const Ta=["get","getKey","getAll","getAllKeys","count"],Ca=["put","add","delete","clear"],gn=new Map;function hr(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(gn.get(e))return gn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Ca.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Ta.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(o.shift())),(await Promise.all([c[n](...o),i&&l.done]))[0]};return gn.set(e,s),s}Ia(t=>({...t,get:(e,n,r)=>hr(e,n)||t.get(e,n,r),has:(e,n)=>!!hr(e,n)||t.has(e,n)}));/**
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
 */class Aa{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Ra(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Ra(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Rn="@firebase/app",fr="0.16.1";/**
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
 */const Se=new hi("@firebase/app"),Pa="@firebase/app-compat",Oa="@firebase/analytics-compat",xa="@firebase/analytics",Na="@firebase/app-check-compat",Da="@firebase/app-check",La="@firebase/auth",Ma="@firebase/auth-compat",Ua="@firebase/database",Fa="@firebase/data-connect",Ba="@firebase/database-compat",Va="@firebase/functions",Ha="@firebase/functions-compat",Wa="@firebase/installations",ja="@firebase/installations-compat",za="@firebase/messaging",Ga="@firebase/messaging-compat",Ka="@firebase/performance",qa="@firebase/performance-compat",Ja="@firebase/remote-config",Ya="@firebase/remote-config-compat",Xa="@firebase/storage",Qa="@firebase/storage-compat",Za="@firebase/firestore",eo="@firebase/ai",to="@firebase/firestore-compat",no="firebase",ro="12.18.0";/**
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
 */const Pn="[DEFAULT]",io={[Rn]:"fire-core",[Pa]:"fire-core-compat",[xa]:"fire-analytics",[Oa]:"fire-analytics-compat",[Da]:"fire-app-check",[Na]:"fire-app-check-compat",[La]:"fire-auth",[Ma]:"fire-auth-compat",[Ua]:"fire-rtdb",[Fa]:"fire-data-connect",[Ba]:"fire-rtdb-compat",[Va]:"fire-fn",[Ha]:"fire-fn-compat",[Wa]:"fire-iid",[ja]:"fire-iid-compat",[za]:"fire-fcm",[Ga]:"fire-fcm-compat",[Ka]:"fire-perf",[qa]:"fire-perf-compat",[Ja]:"fire-rc",[Ya]:"fire-rc-compat",[Xa]:"fire-gcs",[Qa]:"fire-gcs-compat",[Za]:"fire-fst",[to]:"fire-fst-compat",[eo]:"fire-vertex","fire-js":"fire-js",[no]:"fire-js-all"};/**
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
 */const qt=new Map,so=new Map,On=new Map;function pr(t,e){try{t.container.addComponent(e)}catch(n){Se.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Et(t){const e=t.name;if(On.has(e))return Se.debug(`There were multiple attempts to register component ${e}.`),!1;On.set(e,t);for(const n of qt.values())pr(n,t);for(const n of so.values())pr(n,t);return!0}function gi(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Z(t){return t==null?!1:t.settings!==void 0}/**
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
 */const ao={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ye=new $t("app","Firebase",ao);/**
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
 */class oo{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new at("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ye.create("app-deleted",{appName:this._name})}}/**
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
 */const Ct=ro;function mi(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Pn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw ye.create("bad-app-name",{appName:String(i)});if(n||(n=ci()),!n)throw ye.create("no-options");const s=qt.get(i);if(s)if(st(n,s.options)){if(st(r,s.config))return s;throw ye.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw ye.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new fa(i);for(const l of On.values())a.addComponent(l);const o=new oo(n,r,a);return qt.set(i,o),o}function lo(t=Pn){const e=qt.get(t);if(!e&&t===Pn&&ci())return mi();if(!e)throw ye.create("no-app",{appName:t});return e}function tt(t,e,n){let r=io[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Se.warn(a.join(" "));return}Et(new at(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const co="firebase-heartbeat-database",uo=1,It="firebase-heartbeat-store";let mn=null;function _i(){return mn||(mn=$a(co,uo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(It)}catch(n){console.warn(n)}}}}).catch(t=>{throw ye.create("idb-open",{originalErrorMessage:t.message})})),mn}async function ho(t){try{const n=(await _i()).transaction(It),r=await n.objectStore(It).get(bi(t));return await n.done,r}catch(e){if(e instanceof Be)Se.warn(e.message);else{const n=ye.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Se.warn(n.message)}}}async function gr(t,e){try{const r=(await _i()).transaction(It,"readwrite");await r.objectStore(It).put(e,bi(t)),await r.done}catch(n){if(n instanceof Be)Se.warn(n.message);else{const r=ye.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Se.warn(r.message)}}}function bi(t){return`${t.name}!${t.options.appId}`}/**
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
 */const fo=1024,po=30;class go{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new _o(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=mr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>po){const a=bo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Se.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=mr(),{heartbeatsToSend:r,unsentEntries:i}=mo(this._heartbeatsCache.heartbeats),s=oi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Se.warn(n),""}}}function mr(){return new Date().toISOString().substring(0,10)}function mo(t,e=fo){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),_r(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),_r(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class _o{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ta()?na().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await ho(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return gr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return gr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function _r(t){return oi(JSON.stringify({version:2,heartbeats:t})).length}function bo(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function yo(t){Et(new at("platform-logger",e=>new Aa(e),"PRIVATE")),Et(new at("heartbeat",e=>new go(e),"PRIVATE")),tt(Rn,fr,t),tt(Rn,fr,"esm2020"),tt("fire-js","")}/**
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
 */yo("");var wo="firebase",vo="12.18.0";/**
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
 */tt(wo,vo,"app");function yi(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Eo=yi,wi=new $t("auth","Firebase",yi());/**
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
 */const Jt=new hi("@firebase/auth");function vi(t,...e){Jt.logLevel<=H.WARN&&Jt.warn(`Auth (${Ct}): ${t}`,...e)}function Ft(t,...e){Jt.logLevel<=H.ERROR&&Jt.error(`Auth (${Ct}): ${t}`,...e)}/**
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
 */function ie(t,...e){throw Hn(t,...e)}function oe(t,...e){return Hn(t,...e)}function Vn(t,e,n){const r={...Eo(),[e]:n};return new $t("auth","Firebase",r).create(e,{appName:t.name})}function fe(t){return Vn(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ei(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&ie(t,"argument-error"),Vn(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Hn(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return wi.create(t,...e)}function C(t,e,...n){if(!t)throw Hn(e,...n)}function we(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Ft(e),new Error(e)}function ke(t,e){t||we(e)}/**
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
 */function xn(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function Io(){return br()==="http:"||br()==="https:"}function br(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
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
 */function So(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Io()||Qs()||"connection"in navigator)?navigator.onLine:!0}function ko(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
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
 */class At{constructor(e,n){this.shortDelay=e,this.longDelay=n,ke(n>e,"Short delay should be less than long delay!"),this.isMobile=Ys()||Zs()}get(){return So()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Wn(t,e){ke(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
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
 */class Ii{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;we("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;we("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;we("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const $o={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const To=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Co=new At(3e4,6e4);function Ve(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function He(t,e,n,r,i={}){return Si(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Tt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:l,...s};return Xs()||(c.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&Fn(t.emulatorConfig.host)&&(c.credentials="include"),Ii.fetch()(await ki(t,t.config.apiHost,n,o),c)})}async function Si(t,e,n){t._canInitEmulator=!1;const r={...$o,...e};try{const i=new Ro(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Nt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,c]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Nt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Nt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Nt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw Vn(t,d,c);ie(t,d)}}catch(i){if(i instanceof Be)throw i;ie(t,"network-request-failed",{message:String(i)})}}async function Rt(t,e,n,r,i={}){const s=await He(t,e,n,r,i);return"mfaPendingCredential"in s&&ie(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function ki(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?Wn(t.config,i):`${t.config.apiScheme}://${i}`;return To.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function Ao(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Ro{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(oe(this.auth,"network-request-failed")),Co.get())})}}function Nt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=oe(t,e,r);return i.customData._tokenResponse=n,i}function yr(t){return t!==void 0&&t.enterprise!==void 0}class Po{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Ao(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Oo(t,e){return He(t,"GET","/v2/recaptchaConfig",Ve(t,e))}/**
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
 */async function xo(t,e){return He(t,"POST","/v1/accounts:delete",e)}async function Yt(t,e){return He(t,"POST","/v1/accounts:lookup",e)}/**
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
 */function bt(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function No(t,e=!1){const n=Te(t),r=await n.getIdToken(e),i=jn(r);C(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:bt(_n(i.auth_time)),issuedAtTime:bt(_n(i.iat)),expirationTime:bt(_n(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function _n(t){return Number(t)*1e3}function jn(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Ft("JWT malformed, contained fewer than 3 sections"),null;try{const i=li(n);return i?JSON.parse(i):(Ft("Failed to decode base64 JWT payload"),null)}catch(i){return Ft("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function wr(t){const e=jn(t);return C(e,"internal-error"),C(typeof e.exp<"u","internal-error"),C(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function St(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Be&&Do(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Do({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
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
 */class Lo{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Nn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=bt(this.lastLoginAt),this.creationTime=bt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Xt(t){var h;const e=t.auth,n=await t.getIdToken(),r=await St(t,Yt(e,{idToken:n}));C(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?$i(i.providerUserInfo):[],a=Uo(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),c=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Nn(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function Mo(t){const e=Te(t);await Xt(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Uo(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function $i(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
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
 */async function Fo(t,e){const n=await Si(t,{},async()=>{const r=Tt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await ki(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&Fn(t.emulatorConfig.host)&&(l.credentials="include"),Ii.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Bo(t,e){return He(t,"POST","/v2/accounts:revokeToken",Ve(t,e))}/**
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
 */class nt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){C(e.idToken,"internal-error"),C(typeof e.idToken<"u","internal-error"),C(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):wr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){C(e.length!==0,"internal-error");const n=wr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(C(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await Fo(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new nt;return r&&(C(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(C(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(C(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new nt,this.toJSON())}_performRefresh(){return we("not implemented")}}/**
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
 */function Oe(t,e){C(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class ae{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Lo(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Nn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await St(this,this.stsTokenManager.getToken(this.auth,e));return C(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return No(this,e)}reload(){return Mo(this)}_assign(e){this!==e&&(C(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new ae({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){C(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Xt(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Z(this.auth.app))return Promise.reject(fe(this.auth));const e=await this.getIdToken();return await St(this,xo(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,c=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:m,isAnonymous:g,providerData:_,stsTokenManager:I}=n;C(h&&I,e,"internal-error");const b=nt.fromJSON(this.name,I);C(typeof h=="string",e,"internal-error"),Oe(r,e.name),Oe(i,e.name),C(typeof m=="boolean",e,"internal-error"),C(typeof g=="boolean",e,"internal-error"),Oe(s,e.name),Oe(a,e.name),Oe(o,e.name),Oe(l,e.name),Oe(c,e.name),Oe(d,e.name);const y=new ae({uid:h,auth:e,email:i,emailVerified:m,displayName:r,isAnonymous:g,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:b,createdAt:c,lastLoginAt:d});return _&&Array.isArray(_)&&(y.providerData=_.map(v=>({...v}))),l&&(y._redirectEventId=l),y}static async _fromIdTokenResponse(e,n,r=!1){const i=new nt;i.updateFromServerResponse(n);const s=new ae({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Xt(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];C(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?$i(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new nt;o.updateFromIdToken(r);const l=new ae({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Nn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
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
 */const vr=new Map;function ve(t){ke(t instanceof Function,"Expected a class definition");let e=vr.get(t);return e?(ke(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,vr.set(t,e),e)}/**
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
 */class Ti{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Ti.type="NONE";const Er=Ti;/**
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
 */function Bt(t,e,n){return`firebase:${t}:${e}:${n}`}class rt{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Bt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Bt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await Yt(this.auth,{idToken:e}).catch(()=>{});return n?ae._fromGetAccountInfoResponse(this.auth,n,e):null}return ae._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new rt(ve(Er),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||ve(Er);const a=Bt(r,e.config.apiKey,e.name);let o=null;for(const c of n)try{const d=await c._get(a);if(d){let h;if(typeof d=="string"){const m=await Yt(e,{idToken:d}).catch(()=>{});if(!m)break;h=await ae._fromGetAccountInfoResponse(e,m,d)}else h=ae._fromJSON(e,d);c!==s&&(o=h),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new rt(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(a)}catch{}})),new rt(s,e,r))}}/**
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
 */function Ir(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Pi(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ci(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(xi(e))return"Blackberry";if(Ni(e))return"Webos";if(Ai(e))return"Safari";if((e.includes("chrome/")||Ri(e))&&!e.includes("edge/"))return"Chrome";if(Oi(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Ci(t=X()){return/firefox\//i.test(t)}function Ai(t=X()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ri(t=X()){return/crios\//i.test(t)}function Pi(t=X()){return/iemobile/i.test(t)}function Oi(t=X()){return/android/i.test(t)}function xi(t=X()){return/blackberry/i.test(t)}function Ni(t=X()){return/webos/i.test(t)}function zn(t=X()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Vo(t=X()){var e;return zn(t)&&!!((e=window.navigator)!=null&&e.standalone)}function Ho(){return ea()&&document.documentMode===10}function Di(t=X()){return zn(t)||Oi(t)||Ni(t)||xi(t)||/windows phone/i.test(t)||Pi(t)}/**
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
 */function Li(t,e=[]){let n;switch(t){case"Browser":n=Ir(X());break;case"Worker":n=`${Ir(X())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ct}/${r}`}/**
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
 */class Wo{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function jo(t,e={}){return He(t,"GET","/v2/passwordPolicy",Ve(t,e))}/**
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
 */const zo=6;class Go{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??zo,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
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
 */class Ko{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Sr(this),this.idTokenSubscription=new Sr(this),this.beforeStateQueue=new Wo(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=wi,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=ve(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await rt.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Yt(this,{idToken:e}),r=await ae._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(Z(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return C(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Xt(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ko()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Z(this.app))return Promise.reject(fe(this));const n=e?Te(e):null;return n&&C(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&C(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Z(this.app)?Promise.reject(fe(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Z(this.app)?Promise.reject(fe(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ve(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await jo(this),n=new Go(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new $t("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Bo(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&ve(e)||this._popupRedirectResolver;C(n,this,"argument-error"),this.redirectPersistenceManager=await rt.create(this,[ve(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(C(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return C(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Li(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(Z(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&vi(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Ce(t){return Te(t)}class Sr{constructor(e){this.auth=e,this.observer=null,this.addObserver=aa(n=>this.observer=n)}get next(){return C(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let sn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function qo(t){sn=t}function Mi(t){return sn.loadJS(t)}function Jo(){return sn.recaptchaEnterpriseScript}function Yo(){return sn.gapiScript}function Xo(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class Qo{constructor(){this.enterprise=new Zo}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class Zo{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
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
 */const el="recaptcha-enterprise",Ui="NO_RECAPTCHA",kr="onFirebaseAuthREInstanceReady";class xe{constructor(e){this.type=el,this.auth=Ce(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{Oo(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const c=new Po(l);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,a(c.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;yr(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(c=>{a(c)}).catch(()=>{a(Ui)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Qo().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&yr(window.grecaptcha)&&xe.scriptInjectionDeferred)await xe.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=Jo();l.length!==0&&(l+=o+`&onload=${kr}`),xe.scriptInjectionDeferred=new di,window[kr]=()=>{var c;(c=xe.scriptInjectionDeferred)==null||c.resolve()},Mi(l).then(()=>{var c;return(c=xe.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{i(o,s,a)}).catch(c=>{a(c)})}}).catch(o=>{a(o)})})}}xe.scriptInjectionDeferred=null;async function $r(t,e,n,r=!1,i=!1){const s=new xe(t);let a;if(i)a=Ui;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,c=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Dn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await $r(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await $r(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
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
 */function tl(t,e){const n=gi(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(st(s,e??{}))return i;ie(i,"already-initialized")}return n.initialize({options:e})}function nl(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(ve);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function rl(t,e,n){const r=Ce(t);C(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Fi(e),{host:a,port:o}=il(e),l=o===null?"":`:${o}`,c={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){C(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),C(st(c,r.config.emulator)&&st(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,Fn(a)?ca(`${s}//${a}${l}`):sl()}function Fi(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function il(t){const e=Fi(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Tr(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Tr(a)}}}function Tr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function sl(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
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
 */class Gn{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return we("not implemented")}_getIdTokenResponse(e){return we("not implemented")}_linkToIdToken(e,n){return we("not implemented")}_getReauthenticationResolver(e){return we("not implemented")}}async function al(t,e){return He(t,"POST","/v1/accounts:signUp",e)}/**
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
 */async function ol(t,e){return Rt(t,"POST","/v1/accounts:signInWithPassword",Ve(t,e))}/**
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
 */async function ll(t,e){return Rt(t,"POST","/v1/accounts:signInWithEmailLink",Ve(t,e))}async function cl(t,e){return Rt(t,"POST","/v1/accounts:signInWithEmailLink",Ve(t,e))}/**
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
 */class kt extends Gn{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new kt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new kt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Dn(e,n,"signInWithPassword",ol);case"emailLink":return ll(e,{email:this._email,oobCode:this._password});default:ie(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Dn(e,r,"signUpPassword",al);case"emailLink":return cl(e,{idToken:n,email:this._email,oobCode:this._password});default:ie(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function it(t,e){return Rt(t,"POST","/v1/accounts:signInWithIdp",Ve(t,e))}/**
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
 */const ul="http://localhost";class qe extends Gn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new qe(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):ie("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new qe(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return it(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,it(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,it(e,n)}buildRequest(){const e={requestUri:ul,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Tt(n)}return e}}/**
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
 */function dl(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function hl(t){const e=ft(pt(t)).link,n=e?ft(pt(e)).deep_link_id:null,r=ft(pt(t)).deep_link_id;return(r?ft(pt(r)).link:null)||r||n||e||t}class Kn{constructor(e){const n=ft(pt(e)),r=n.apiKey??null,i=n.oobCode??null,s=dl(n.mode??null);C(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=hl(e);try{return new Kn(n)}catch{return null}}}/**
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
 */class ct{constructor(){this.providerId=ct.PROVIDER_ID}static credential(e,n){return kt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=Kn.parseLink(n);return C(r,"argument-error"),kt._fromEmailAndCode(e,r.code,r.tenantId)}}ct.PROVIDER_ID="password";ct.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ct.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class an{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Pt extends an{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Ne extends Pt{constructor(){super("facebook.com")}static credential(e){return qe._fromParams({providerId:Ne.PROVIDER_ID,signInMethod:Ne.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ne.credentialFromTaggedObject(e)}static credentialFromError(e){return Ne.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ne.credential(e.oauthAccessToken)}catch{return null}}}Ne.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ne.PROVIDER_ID="facebook.com";/**
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
 */class be extends Pt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return qe._fromParams({providerId:be.PROVIDER_ID,signInMethod:be.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return be.credentialFromTaggedObject(e)}static credentialFromError(e){return be.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return be.credential(n,r)}catch{return null}}}be.GOOGLE_SIGN_IN_METHOD="google.com";be.PROVIDER_ID="google.com";/**
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
 */class De extends Pt{constructor(){super("github.com")}static credential(e){return qe._fromParams({providerId:De.PROVIDER_ID,signInMethod:De.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return De.credentialFromTaggedObject(e)}static credentialFromError(e){return De.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return De.credential(e.oauthAccessToken)}catch{return null}}}De.GITHUB_SIGN_IN_METHOD="github.com";De.PROVIDER_ID="github.com";/**
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
 */class Le extends Pt{constructor(){super("twitter.com")}static credential(e,n){return qe._fromParams({providerId:Le.PROVIDER_ID,signInMethod:Le.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Le.credentialFromTaggedObject(e)}static credentialFromError(e){return Le.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Le.credential(n,r)}catch{return null}}}Le.TWITTER_SIGN_IN_METHOD="twitter.com";Le.PROVIDER_ID="twitter.com";/**
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
 */async function fl(t,e){return Rt(t,"POST","/v1/accounts:signUp",Ve(t,e))}/**
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
 */class Je{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await ae._fromIdTokenResponse(e,r,i),a=Cr(r);return new Je({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Cr(r);return new Je({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Cr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
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
 */class Qt extends Be{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Qt.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new Qt(e,n,r,i)}}function Bi(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Qt._fromErrorAndOperation(t,s,e,r):s})}async function pl(t,e,n=!1){const r=await St(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Je._forOperation(t,"link",r)}/**
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
 */async function gl(t,e,n=!1){const{auth:r}=t;if(Z(r.app))return Promise.reject(fe(r));const i="reauthenticate";try{const s=await St(t,Bi(r,i,e,t),n);C(s.idToken,r,"internal-error");const a=jn(s.idToken);C(a,r,"internal-error");const{sub:o}=a;return C(t.uid===o,r,"user-mismatch"),Je._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&ie(r,"user-mismatch"),s}}/**
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
 */async function Vi(t,e,n=!1){if(Z(t.app))return Promise.reject(fe(t));const r="signIn",i=await Bi(t,r,e),s=await Je._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function ml(t,e){return Vi(Ce(t),e)}/**
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
 */async function Hi(t){const e=Ce(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function _l(t,e,n){if(Z(t.app))return Promise.reject(fe(t));const r=Ce(t),a=await Dn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",fl).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Hi(t),l}),o=await Je._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function bl(t,e,n){return Z(t.app)?Promise.reject(fe(t)):ml(Te(t),ct.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Hi(t),r})}function yl(t,e,n,r){return Te(t).onIdTokenChanged(e,n,r)}function wl(t,e,n){return Te(t).beforeAuthStateChanged(e,n)}function vl(t,e,n,r){return Te(t).onAuthStateChanged(e,n,r)}function El(t){return Te(t).signOut()}const Zt="__sak";/**
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
 */class Wi{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Zt,"1"),this.storage.removeItem(Zt),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const Il=1e3,Sl=10;class ji extends Wi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Di(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);Ho()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Sl):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Il)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}ji.type="LOCAL";const kl=ji;/**
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
 */class zi extends Wi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}zi.type="SESSION";const Gi=zi;/**
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
 */function $l(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class on{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new on(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async c=>c(n.origin,s)),l=await $l(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}on.receivers=[];/**
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
 */function qn(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class Tl{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const c=qn("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const m=h;if(m.data.eventId===c)switch(m.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(m.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function pe(){return window}function Cl(t){pe().location.href=t}/**
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
 */function Ki(){return typeof pe().WorkerGlobalScope<"u"&&typeof pe().importScripts=="function"}async function Al(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Rl(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function Pl(){return Ki()?self:null}/**
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
 */const qi="firebaseLocalStorageDb",Ol=1,en="firebaseLocalStorage",Ji="fbase_key";class Ot{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function ln(t,e){return t.transaction([en],e?"readwrite":"readonly").objectStore(en)}function xl(){const t=indexedDB.deleteDatabase(qi);return new Ot(t).toPromise()}function Yi(){const t=indexedDB.open(qi,Ol);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(en,{keyPath:Ji})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(en)?e(r):(r.close(),await xl(),e(await Yi()))})})}async function Ar(t,e,n){const r=ln(t,!0).put({[Ji]:e,value:n});return new Ot(r).toPromise()}async function Nl(t,e){const n=ln(t,!1).get(e),r=await new Ot(n).toPromise();return r===void 0?null:r.value}function Rr(t,e){const n=ln(t,!0).delete(e);return new Ot(n).toPromise()}const Dl=800,Ll=3;class Xi{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=Yi(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>Ll)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Ki()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=on._getInstance(Pl()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await Al(),!this.activeServiceWorker)return;this.sender=new Tl(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Rl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Ar(e,Zt,"1"),await Rr(e,Zt)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Ar(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>Nl(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Rr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=ln(i,!1).getAll();return new Ot(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||vi(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Dl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}Xi.type="LOCAL";const Ml=Xi;new At(3e4,6e4);/**
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
 */function Jn(t,e){return e?ve(e):(C(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class Yn extends Gn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return it(e,this._buildIdpRequest())}_linkToIdToken(e,n){return it(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return it(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Ul(t){return Vi(t.auth,new Yn(t),t.bypassAuthState)}function Fl(t){const{auth:e,user:n}=t;return C(n,e,"internal-error"),gl(n,new Yn(t),t.bypassAuthState)}async function Bl(t){const{auth:e,user:n}=t;return C(n,e,"internal-error"),pl(n,new Yn(t),t.bypassAuthState)}/**
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
 */class Qi{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Ul;case"linkViaPopup":case"linkViaRedirect":return Bl;case"reauthViaPopup":case"reauthViaRedirect":return Fl;default:ie(this.auth,"internal-error")}}resolve(e){ke(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ke(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Vl=new At(2e3,1e4);async function Hl(t,e,n){if(Z(t.app))return Promise.reject(oe(t,"operation-not-supported-in-this-environment"));const r=Ce(t);Ei(t,e,an);const i=Jn(r,n);return new je(r,"signInViaPopup",e,i).executeNotNull()}class je extends Qi{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,je.currentPopupAction&&je.currentPopupAction.cancel(),je.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return C(e,this.auth,"internal-error"),e}async onExecution(){ke(this.filter.length===1,"Popup operations only handle one event");const e=qn();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(oe(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(oe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,je.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(oe(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Vl.get())};e()}}je.currentPopupAction=null;/**
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
 */const Wl="pendingRedirect",Vt=new Map;class jl extends Qi{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Vt.get(this.auth._key());if(!e){try{const r=await zl(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Vt.set(this.auth._key(),e)}return this.bypassAuthState||Vt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function zl(t,e){const n=es(e),r=Zi(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function Gl(t,e){return Zi(t)._set(es(e),"true")}function Kl(t,e){Vt.set(t._key(),e)}function Zi(t){return ve(t._redirectPersistence)}function es(t){return Bt(Wl,t.config.apiKey,t.name)}/**
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
 */function ql(t,e,n){return Jl(t,e,n)}async function Jl(t,e,n){if(Z(t.app))return Promise.reject(fe(t));const r=Ce(t);Ei(t,e,an),await r._initializationPromise;const i=Jn(r,n);return await Gl(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function Yl(t,e,n=!1){if(Z(t.app))return Promise.reject(fe(t));const r=Ce(t),i=Jn(r,e),a=await new jl(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
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
 */const Xl=600*1e3;class Ql{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Zl(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!ts(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(oe(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Xl&&this.cachedEventUids.clear(),this.cachedEventUids.has(Pr(e))}saveEventToCache(e){this.cachedEventUids.add(Pr(e)),this.lastProcessedEventTime=Date.now()}}function Pr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function ts({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Zl(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ts(t);default:return!1}}/**
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
 */async function ec(t,e={}){return He(t,"GET","/v1/projects",e)}/**
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
 */const tc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,nc=/^https?/;async function rc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await ec(t);for(const n of e)try{if(ic(n))return}catch{}ie(t,"unauthorized-domain")}function ic(t){const e=xn(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!nc.test(n))return!1;if(tc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const sc=new At(3e4,6e4);function Or(){const t=pe().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function ac(t){return new Promise((e,n)=>{var i,s,a;function r(){Or(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Or(),n(oe(t,"network-request-failed"))},timeout:sc.get()})}if((s=(i=pe().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=pe().gapi)!=null&&a.load)r();else{const o=Xo("iframefcb");return pe()[o]=()=>{gapi.load?r():n(oe(t,"network-request-failed"))},Mi(`${Yo()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw Ht=null,e})}let Ht=null;function oc(t){return Ht=Ht||ac(t),Ht}/**
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
 */const lc=new At(5e3,15e3),cc="__/auth/iframe",uc="emulator/auth/iframe",dc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},hc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function fc(t){const e=t.config;C(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Wn(e,uc):`https://${t.config.authDomain}/${cc}`,r={apiKey:e.apiKey,appName:t.name,v:Ct},i=hc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Tt(r).slice(1)}`}async function pc(t){const e=await oc(t),n=pe().gapi;return C(n,t,"internal-error"),e.open({where:document.body,url:fc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:dc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=oe(t,"network-request-failed"),o=pe().setTimeout(()=>{s(a)},lc.get());function l(){pe().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
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
 */const gc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},mc=500,_c=600,bc="_blank",yc="http://localhost";class xr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function wc(t,e,n,r=mc,i=_c){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...gc,width:r.toString(),height:i.toString(),top:s,left:a},c=X().toLowerCase();n&&(o=Ri(c)?bc:n),Ci(c)&&(e=e||yc,l.scrollbars="yes");const d=Object.entries(l).reduce((m,[g,_])=>`${m}${g}=${_},`,"");if(Vo(c)&&o!=="_self")return vc(e||"",o),new xr(null);const h=window.open(e||"",o,d);C(h,t,"popup-blocked");try{h.focus()}catch{}return new xr(h)}function vc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const Ec="__/auth/handler",Ic="emulator/auth/handler",Sc=encodeURIComponent("fac");async function Nr(t,e,n,r,i,s){C(t.config.authDomain,t,"auth-domain-config-required"),C(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Ct,eventId:i};if(e instanceof an){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",sa(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Pt){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),c=l?`#${Sc}=${encodeURIComponent(l)}`:"";return`${kc(t)}?${Tt(o).slice(1)}${c}`}function kc({config:t}){return t.emulator?Wn(t,Ic):`https://${t.authDomain}/${Ec}`}/**
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
 */const bn="webStorageSupport";class $c{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Gi,this._completeRedirectFn=Yl,this._overrideRedirectResult=Kl}async _openPopup(e,n,r,i){var a;ke((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Nr(e,n,r,xn(),i);return wc(e,s,qn())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Nr(e,n,r,xn(),i);return Cl(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(ke(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await pc(e),r=new Ql(e);return n.register("authEvent",i=>(C(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(bn,{type:bn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[bn];s!==void 0&&n(!!s),ie(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=rc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Di()||Ai()||zn()}}const Tc=$c;var Dr="@firebase/auth",Lr="1.13.5";/**
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
 */class Cc{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){C(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function Ac(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Rc(t){Et(new at("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;C(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Li(t)},c=new Ko(r,i,s,l);return nl(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Et(new at("auth-internal",e=>{const n=Ce(e.getProvider("auth").getImmediate());return(r=>new Cc(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),tt(Dr,Lr,Ac(t)),tt(Dr,Lr,"esm2020")}/**
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
 */const Pc=300,Oc=ui("authIdTokenMaxAge")||Pc;let Mr=null;const xc=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Oc)return;const i=n==null?void 0:n.token;Mr!==i&&(Mr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Nc(t=lo()){const e=gi(t,"auth");if(e.isInitialized())return e.getImmediate();const n=tl(t,{popupRedirectResolver:Tc,persistence:[Ml,kl,Gi]}),r=ui("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=xc(s.toString());wl(n,a,()=>a(n.currentUser)),yl(n,o=>a(o))}}const i=Js("auth");return i&&rl(n,`http://${i}`),n}function Dc(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}qo({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=oe("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",Dc().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Rc("Browser");const Lc={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},_e=Lc,ot=!!_e.VITE_FIREBASE_APP_ID;let yn=null;function Ze(){if(!ot)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!yn){const t=mi({apiKey:_e.VITE_FIREBASE_API_KEY,authDomain:_e.VITE_FIREBASE_AUTH_DOMAIN,projectId:_e.VITE_FIREBASE_PROJECT_ID,appId:_e.VITE_FIREBASE_APP_ID,..._e.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:_e.VITE_FIREBASE_STORAGE_BUCKET},..._e.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:_e.VITE_FIREBASE_MESSAGING_SENDER_ID}});yn=Nc(t)}return yn}function Ur(){return new be}async function Fr(){if(!ot)return;const t=Ze();t.currentUser&&await El(t)}var Mc=p(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),Uc=p('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),Fc=p("<button type=button class=gate-toggle>"),Bc=p("<div class=gate-or>── or ──"),Vc=p("<button type=button class=btn>Continue with Google"),Hc=p("<div class=gate-error role=alert>"),Wc=p("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),jc=p("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),zc=p("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const Gc={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Br(t){const e=(t==null?void 0:t.code)??"";return Gc[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function Kc(t){return(()=>{var e=Mc(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),he(l,"click",t.onSignOut),e})()}function qc(){const[t,e]=O("signin"),[n,r]=O(""),[i,s]=O(""),[a,o]=O(!1),[l,c]=O("");Rs(async m=>{if(!ot)return null;const g=Ze().currentUser;return g?await g.getIdToken(m):null});async function d(m){if(m.preventDefault(),!a()){o(!0),c("");try{const g=Ze();t()==="create"?await _l(g,n(),i()):await bl(g,n(),i())}catch(g){c(Br(g))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await Hl(Ze(),Ur())}catch(m){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(m==null?void 0:m.code)){await ql(Ze(),Ur());return}c(Br(m))}finally{o(!1)}}}return(()=>{var m=Wc(),g=m.firstChild;return g.firstChild,u(g,f(E,{when:ot,get fallback(){return[jc(),zc()]},get children(){return[(()=>{var _=Uc(),I=_.firstChild,b=I.firstChild,y=b.nextSibling,v=I.nextSibling,x=v.firstChild,A=x.nextSibling,T=v.nextSibling;return _.addEventListener("submit",d),y.$$input=S=>r(S.currentTarget.value),A.$$input=S=>s(S.currentTarget.value),u(T,(()=>{var S=q(()=>!!a());return()=>S()?"Working…":t()==="create"?"Create account":"Sign in"})()),k(S=>{var L=t()==="create"?"new-password":"current-password",R=a();return L!==S.e&&re(A,"autocomplete",S.e=L),R!==S.t&&(T.disabled=S.t=R),S},{e:void 0,t:void 0}),k(()=>y.value=n()),k(()=>A.value=i()),_})(),(()=>{var _=Fc();return _.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(_,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),k(()=>_.disabled=a()),_})(),Bc(),(()=>{var _=Vc();return _.$$click=h,k(()=>_.disabled=a()),_})(),f(E,{get when(){return l()},get children(){var _=Hc();return u(_,l),_}})]}}),null),m})()}ce(["click","input"]);var Jc=p("<div class=gate-error role=alert>"),Yc=p("<p class=gate-note>No grant-file entries yet."),Xc=p("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),Qc=p('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),Zc=p("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function eu(t){const[e,n]=O([]),[r,i]=O([]),[s,a]=O(""),[o,l]=O(!1),[c,d]=O(""),h=b=>{n((b==null?void 0:b.file_grants)??[]),i((b==null?void 0:b.static_emails)??[])};wt(async()=>{try{h(await Os())}catch{d("Could not load the grant list.")}});const g=b=>{b.key==="Escape"&&t.onClose()};wt(()=>{window.addEventListener("keydown",g),Ue(()=>window.removeEventListener("keydown",g));const b=document.querySelector(".access-add input");b==null||b.focus()});const _=async b=>{if(b.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await xs(s())),a("")}catch(y){d(y.message)}l(!1)}},I=async b=>{if(!o()){l(!0),d("");try{h(await Ns(b))}catch(y){d(y.message)}l(!1)}};return(()=>{var b=Qc(),y=b.firstChild,v=y.firstChild,x=v.nextSibling,A=x.nextSibling,T=A.firstChild,S=T.nextSibling,L=A.nextSibling;return he(b,"click",t.onClose),y.$$click=R=>R.stopPropagation(),u(y,f(E,{get when(){return c()},get children(){var R=Jc();return u(R,c),R}}),A),u(y,f(ee,{get each(){return e()},children:R=>(()=>{var P=Zc(),D=P.firstChild,U=D.nextSibling;return u(D,R),U.$$click=()=>I(R),re(U,"title",`Remove ${R}`),re(U,"aria-label",`Remove ${R}`),k(()=>U.disabled=o()),P})()}),A),u(y,f(E,{get when(){return e().length===0},get children(){return Yc()}}),A),A.addEventListener("submit",_),T.$$input=R=>a(R.currentTarget.value),u(S,()=>o()?"…":"Add"),u(y,f(E,{get when(){return r().length>0},get children(){var R=Xc();return R.firstChild,u(R,()=>r().join(", "),null),R}}),L),he(L,"click",t.onClose),k(()=>S.disabled=o()),k(()=>T.value=s()),b})()}ce(["click","input"]);const Ee=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),yt=(t,e,n)=>Math.min(n,Math.max(e,t));function tu(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:yt((n-t)/r,0,1)}function nu(t,e,n,r,i=Ee){if(n<i.minRateOfReturn||t<=0)return null;const s=yt(t/2,0,1),a=yt(e,0,1),o=Math.min(n/i.idealReturn,1),l=yt((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function ru(t,e=Ee){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?yt(1+t.delta,0,1):tu(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),nu(r,a,n,i,e)}function iu(t,e=Ee.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function su(t){return t.weightSharpe===Ee.weightSharpe&&t.weightSafety===Ee.weightSafety&&t.weightReturn===Ee.weightReturn&&t.minRateOfReturn===Ee.minRateOfReturn}var au=p("<span class=hint>production defaults · drag to re-rank live"),ou=p("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),lu=p('<span class="hint hint-custom">custom weights'),cu=p("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function uu(){const[t,e]=O({...Ee});return{params:t,isCustom:()=>!su(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Ee})}}const du=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function hu(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=ou(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(E,{get when(){return!e()},get fallback(){return lu()},get children(){return au()}}),null),u(s,f(ee,{each:du,children:o=>(()=>{var l=cu(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,m=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(E,{get when(){return o.weight},get children(){return[" ","· ",q(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),m.$$input=g=>t.scoring.setParam(o.key,Number(g.currentTarget.value)),k(g=>{var _=o.max,I=o.step;return _!==g.e&&re(m,"max",g.e=_),I!==g.t&&re(m,"step",g.t=I),g},{e:void 0,t:void 0}),k(()=>m.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),k(()=>r.open=e()),r})()}ce(["click","input"]);const cn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],gt=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],ns="webapp.columns.v1";function fu(){try{const t=localStorage.getItem(ns);if(!t)return gt;const e=JSON.parse(t);if(!Array.isArray(e))return gt;const n=new Set(cn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:gt}catch{return gt}}function pu(t){try{localStorage.setItem(ns,JSON.stringify(t))}catch{}}var gu=p("<div class=pop-backdrop>"),mu=p('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),_u=p("<span class=colpicker><button type=button class=tool-btn>columns ▾"),bu=p("<label class=pick-item><input type=checkbox>");function yu(t){const[e,n]=O(!1);return(()=>{var r=_u(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(E,{get when(){return e()},get children(){return[(()=>{var s=gu();return s.$$click=()=>n(!1),s})(),(()=>{var s=mu(),a=s.firstChild,o=a.nextSibling;return u(a,f(ee,{each:cn,children:l=>(()=>{var c=bu(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),k(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),k(()=>re(i,"aria-expanded",e())),r})()}ce(["click"]);var wu=p('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),vu=p("<span class=pggap>…"),Eu=p("<button type=button class=pgbtn>");function Iu(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function Su(t){const e=Y(()=>Iu(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=wu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,f(ee,{get each(){return e()},children:d=>d==="…"?vu():(()=>{var h=Eu();return h.$$click=()=>t.onGo(d),u(h,d),k(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,k(d=>{var h=t.page()<=1,m=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),m!==d.t&&(c.disabled=d.t=m),d},{e:void 0,t:void 0}),i})()}ce(["click"]);var ku=p("<span class=tip>");function ut(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=ku();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?Cs(i,r):e=r,u(r,()=>t.children),k(()=>re(r,"data-tip",t.text??"")),r})()}ce(["focusin"]);const Ke="∅";function G(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function mt(t){return Number(t??0).toLocaleString("en-US")}function tn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function rs(t){return is(t,{hour:"2-digit",minute:"2-digit"})}function $u(t){return is(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function is(t,e){const n=tn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const ss={text:Ke,isNull:!0},wn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Vr(t,e){return!e||G(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function Tu(t,e){return!e||G(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function Cu(t){if(!t||typeof t!="object"||G(t.report_date))return ss;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function ne(t,e){if(G(e))return ss;switch(t){case"fixed2":return wn(e,2);case"fixed3":return wn(e,3);case"ivrv":return wn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return Cu(e);default:return{text:String(e),isNull:!1}}}const Hr=t=>Number(t*100).toFixed(0);function Au(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Hr(e.momentum_high),s=Hr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function dt(t,e){return Au(e)[t]??t}var as=p("<span class=tip-target>"),Ru=p("<div class=kv><span class=kv-label></span><span class=kv-value>"),Pu=p("<span class=tip-target>Strike position in band"),Ou=p('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),xu=p("<div class=exp-block><h4>"),Nu=p("<div class=kv-value>Band unavailable (∅)"),Du=p("<div><span class=marker-tick></span><span class=marker-cap><br>"),Lu=p("<div class=exp-block><h4>Premium economics"),Mu=p("<b>"),Uu=p('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),Fu=p("<div class=muted-note>earnings-discounted safety applied"),Bu=p("<div class=exp-block><h4>Score breakdown"),Vu=p("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),Hu=p('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),Wu=p("<span class=muted-note>all columns visible"),ju=p('<div class="exp-block exp-chips"><h4>Hidden columns'),zu=p("<span class=tip-target>: "),Gu=p("<span>"),Ku=p("<span class=tip-target>band safety is already discounted by the earnings rule."),qu=p("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),Ju=p("<div class=expansion><div class=exp-grid>");const vn={sharpe:.2,safety:.4,return_part:.4};function En(t,e=2){return G(t)?Ke:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function de(t,e,n){return(()=>{var r=Ru(),i=r.firstChild,s=i.nextSibling;return u(i,f(ut,{get text(){return dt(t,e)},get children(){var a=as();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function Yu(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=G(e.mid)?null:e.strike-e.mid,s=i!=null&&!G(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!G(a)&&l>a&&!G(e.strike),d=m=>{if(G(m))return null;const g=(m-a)/(l-a)*100;return Math.min(100,Math.max(0,g))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(m=>d(m.v)!=null):[];return(()=>{var m=xu(),g=m.firstChild;return u(g,f(ut,{get text(){return dt("band_range",t.thresholds)},get children(){return Pu()}})),u(m,f(E,{when:c,get fallback(){return Nu()},get children(){var _=Ou(),I=_.firstChild;return u(_,f(ee,{each:h,children:b=>(()=>{var y=Du(),v=y.firstChild,x=v.nextSibling,A=x.firstChild;return u(x,()=>b.label,A),u(x,()=>ne("fixed2",b.v).text,null),k(T=>{var S=`marker ${b.cls}`,L=`${d(b.v)}%`;return S!==T.e&&te(y,T.e=S),L!==T.t&&Ge(y,"left",T.t=L),T},{e:void 0,t:void 0}),y})()}),null),k(b=>{var y=`${d(e.strike_from)}%`,v=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return y!==b.e&&Ge(I,"left",b.e=y),v!==b.t&&Ge(I,"width",b.t=v),b},{e:void 0,t:void 0}),_}}),null),u(m,()=>de("band_range",t.thresholds,`${ne("fixed2",e.strike_from).text} → ${ne("fixed2",e.strike_to).text}`),null),u(m,()=>de("band_depth",t.thresholds,r==null?Ke:`${(r*100).toFixed(1)}%`),null),u(m,()=>de("cushion_be",t.thresholds,s==null?Ke:`${s.toFixed(1)}%`),null),m})()}function Xu(t){const e=t.row,n=G(e.strike)?null:e.strike*100,r=G(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=ne("pct1",e.rate_of_return);return(()=>{var a=Lu();return a.firstChild,u(a,()=>de("capital",t.thresholds,n==null?Ke:En(n,0)),null),u(a,()=>de("premium",t.thresholds,r==null?Ke:En(r)),null),u(a,()=>de("breakeven",t.thresholds,i==null?Ke:En(i)),null),u(a,()=>de("ann_ror",t.thresholds,(()=>{var o=Mu();return u(o,()=>s.text),o})()),null),u(a,()=>de("bid",t.thresholds,ne("fixed2",e.bid).text),null),u(a,()=>de("ask",t.thresholds,ne("fixed2",e.ask).text),null),u(a,()=>de("expiration",t.thresholds,e.expiration),null),a})()}function Qu(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:vn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:vn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:vn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=Bu();return i.firstChild,u(i,f(E,{when:n,get fallback(){return(()=>{var s=Vu(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ne("fixed3",e.score).text),s})()},get children(){return[f(ee,{each:r,children:s=>{const a=G(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=Hu(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,m=h.nextSibling;m.nextSibling;var g=l.nextSibling,_=g.firstChild,I=g.nextSibling;return u(l,f(ut,{get text(){return dt(s.key,t.thresholds)},get children(){var b=as();return u(b,()=>s.label),b}}),c),u(d,()=>s.weight*100,m),u(I,()=>ne("fixed3",s.v).text),k(b=>Ge(_,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=Uu(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ne("fixed3",e.score).text),s})(),f(E,{get when(){return e.earnings_before_expiry},get children(){return Fu()}})]}}),null),i})()}function Zu(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:ne(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=ju();return n.firstChild,u(n,f(ee,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=Gu();return u(s,f(ut,{get text(){return dt(r.id,t.thresholds)},get children(){var a=zu(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),k(()=>te(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(E,{get when(){return t.hiddenDefs.length===0},get children(){return Wu()}}),null),n})()}function ed(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=Ju(),i=r.firstChild;return u(r,f(E,{when:n,get children(){var s=qu(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(E,{get when(){return n.report_time},children:m=>m().replaceAll("_"," ")}),c),u(s,f(E,{get when(){return!G(n.expected_eps)},get children(){return[" ","· expected EPS ",q(()=>ne("fixed2",n.expected_eps).text)]}}),h),u(s,f(ut,{get text(){return dt("earnings_before_expiry",t.thresholds)},get children(){return Ku()}}),null),s}}),i),u(i,f(Yu,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(Xu,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(Qu,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(Zu,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var td=p("<span class=null-mark>"),nd=p("<span class=star>★"),rd=p("<td><b>"),In=p("<span>"),Wr=p("<td class=num>"),id=p("<span class=score-frozen>prod "),sd=p('<td class="num score-cell">'),ad=p('<span class="score-frozen readmit">re-admitted'),od=p("<td>"),ld=p("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),cd=p("<span class=sort-arrow>"),ud=p("<span class=tip-target>"),dd=p("<th role=button tabindex=0>"),hd=p("<tr class=expandable><td class=exp-col>"),fd=p("<tr class=exp-row><td>");const pd=t=>`${t.underlying}|${t.strike}`;function gd(t){return(()=>{var e=td();return u(e,()=>t.text),e})()}function Dt(t){const e=ne(t.kind,t.value);return f(E,{get when(){return!e.isNull},get fallback(){return f(gd,{get text(){return e.text}})},get children(){return e.text}})}function md(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=rd(),i=r.firstChild;return u(r,f(E,{get when(){return t.pickRank!=null},get children(){var s=nd();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(E,{get when(){return Vr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=In();return k(()=>te(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Wr();return u(r,f(E,{get when(){return Vr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=In();return k(()=>te(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(Dt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=sd();return u(r,f(Dt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(E,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(E,{get when(){return!G(n.frozen_score)},get fallback(){return f(E,{get when(){return!G(n.score)},get children(){return ad()}})},get children(){var i=id();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=Wr();return u(r,f(Dt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(E,{get when(){return Tu(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=In();return u(s,i),k(()=>te(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=od();return u(r,f(Dt,{get kind(){return e.kind},get value(){return n[e.id]}})),k(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function _d(t){const e=Y(()=>cn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=ld(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(ee,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=dd();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,f(ut,{get text(){return dt(a.id,t.thresholds)},get children(){var c=ud();return u(c,()=>a.label,null),u(c,f(E,{get when(){return o()},get children(){return[" ",(()=>{var d=cd();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),k(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&re(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,f(ee,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>pd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=hd(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,f(ee,{get each(){return e()},children:m=>f(md,{col:m,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),k(m=>{var g=o()!=null,_=!!G(a.score),I=!!c();return g!==m.e&&d.classList.toggle("pick",m.e=g),_!==m.t&&d.classList.toggle("prow",m.t=_),I!==m.a&&d.classList.toggle("open",m.a=I),m},{e:void 0,t:void 0,a:void 0}),d})(),f(E,{get when(){return c()},get children(){var d=fd(),h=d.firstChild;return u(h,f(ed,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),k(()=>re(h,"colspan",e().length+1)),d}})]}})),n})()}ce(["click","keydown"]);function bd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const et=t=>G(t);function yd(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=et(a),c=et(o);return l||c?l&&c?0:l?1:-1:r*bd(a,o)})}function wd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=et(r),a=et(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=et(l),h=et(c);return d||h?d&&h?0:d?1:-1:c-l})}var vd=p("<div class=stage-badges>"),Ed=p("<pre class=errbox>"),Id=p("<details><summary> "),Sd=p("<div class=scroll-region>"),kd=p('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),$d=p("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),Td=p("<div class=empty-panel>No rows match the current filter."),Cd=p('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Sn=100,Ad=150,jr={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function Rd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=vd();return u(i,f(ee,{get each(){return t.stages??[]},children:s=>(()=>{var a=Id(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,f(E,{get when(){return s.error},get children(){var c=Ed();return u(c,()=>s.error),c}}),null),k(()=>te(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function zr(t){const[e,n]=O(""),[r,i]=O(""),[s,a]=O(!0),[o,l]=O(null),[c,d]=O("asc"),[h,m]=O(1);let g;Ue(()=>clearTimeout(g));const _=()=>{var w;return((w=t.tf)==null?void 0:w.rows)??[]},I=Y(()=>{const w=t.scoring.params(),N=t.scoring.isCustom();return _().map(B=>{const V=ru(B,w);return{...B,frozen_score:B.score,live_parts:V,score:N?V==null?null:V.total:B.score}})}),b=Y(()=>I().filter(w=>!G(w.score)&&G(w.frozen_score)).length),y=w=>{const N=w.currentTarget.value;n(N),clearTimeout(g),g=setTimeout(()=>{i(N.trim().toLowerCase()),m(1)},Ad)},v=w=>{a(w),m(1)},x=w=>{o()!==w?(l(w),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),m(1)},[A,T]=O(null),S=w=>{const N=`${w.underlying}|${w.strike}`;T(B=>B===N?null:N)};ze(_t([o,c,h,r,s],()=>T(null))),ze(_t(t.active,()=>T(null))),ze(_t(t.columns.visible,()=>m(1)));const L=()=>cn.filter(w=>!t.columns.visible().includes(w.id)),R=()=>(t.stages??[]).find(w=>w.name===jr[t.id].id),P=Y(()=>{const w=r();return w?I().filter(N=>{const B=N.underlying,V=N.sector;return B!=null&&String(B).toLowerCase().includes(w)||V!=null&&String(V).toLowerCase().includes(w)}):I()}),D=Y(()=>{const w=P();return s()?w.filter(N=>!G(N.score)):w}),U=Y(()=>o()?yd(D(),o(),c()):wd(D())),F=Y(()=>Math.max(1,Math.ceil(U().length/Sn))),Q=()=>Math.min(h(),F()),ge=()=>{const w=Q();return U().slice((w-1)*Sn,w*Sn)},Ae=Y(()=>{var N;const w=new Map;if(t.scoring.isCustom()){const B=iu(I().map(V=>({row:V,score:V.score})));for(const V of B)w.set(`${V.row.underlying}|${V.row.strike}`,w.size+1)}else for(const B of((N=t.tf)==null?void 0:N.top_picks)??[])w.set(`${B.underlying}|${B.strike}`,B.rank??"?");return w}),$=w=>Ae().get(`${w.underlying}|${w.strike}`);return(()=>{var w=kd(),N=w.firstChild,B=N.firstChild,V=B.nextSibling,se=V.firstChild,z=V.nextSibling,ht=z.firstChild,xt=ht.nextSibling;return xt.nextSibling,u(w,f(Rd,{get stages(){return t.stages}}),N),B.$$input=y,se.addEventListener("change",K=>v(K.currentTarget.checked)),u(N,f(yu,{get store(){return t.columns}}),z),u(z,()=>mt(U().length),ht),u(z,()=>mt(_().length),xt),u(z,f(E,{get when(){return q(()=>!!t.scoring.isCustom())()&&b()>0},get children(){return[" ","· ",q(()=>mt(b()))," re-admitted by lower floor"]}}),null),u(w,f(E,{get when(){return ge().length>0},get children(){var K=Sd();return u(K,f(_d,{get visibleCols(){return t.columns.visible},rows:ge,sortKey:o,sortDir:c,onSort:x,get thresholds(){return t.thresholds},pickRankOf:$,openKey:A,onToggleRow:S,hiddenDefs:L,get customScores(){return t.scoring.isCustom}})),K}}),null),u(w,f(E,{get when(){return ge().length===0},get children(){return f(E,{get when(){var K,me;return((K=R())==null?void 0:K.status)==="failed"||((me=R())==null?void 0:me.status)==="partial"},get fallback(){return f(E,{get when(){return q(()=>!!s())()&&P().length>0},get fallback(){return Td()},get children(){var K=$d(),me=K.firstChild,Re=me.nextSibling,Pe=Re.nextSibling,Ye=Pe.nextSibling,Xe=Ye.nextSibling;return Xe.nextSibling,u(K,()=>mt(P().length),Xe),K}})},children:K=>(()=>{var me=Cd(),Re=me.firstChild,Pe=Re.firstChild,Ye=Pe.nextSibling;Ye.nextSibling;var Xe=Re.nextSibling;return u(Re,()=>K().status==="partial"?"△":"✗",Pe),u(Re,()=>jr[t.id].label,Ye),u(Xe,()=>K().error??"stage produced no data"),me})()})}}),null),u(w,f(E,{get when(){return U().length>0},get children(){return f(Su,{page:Q,pageCount:F,onGo:m})}}),null),k(()=>w.hidden=!t.active()),k(()=>B.value=e()),k(()=>se.checked=s()),w})()}ce(["input"]);var Pd=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal placeholder="e.g. 350.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.00"></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Add</button><button type=button class=btn>Cancel'),Od=p("<button type=button class=btn>+ New position"),xd=p("<label class=holdings-outcome-price>close price/share<input inputmode=decimal>"),os=p("<b>"),Nd=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!> ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),Dd=p("<div class=holdings-notice>"),Ld=p("<div class=error-banner>Holdings API error: "),Md=p("<div class=holdings-cards>"),Ud=p('<div class=holdings-panel><div class=holdings-toolbar><button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),Fd=p("<div class=empty-panel>No open positions — press “+ New position” to record one."),Gr=p("<i>"),Bd=p("<i>unpriced"),Vd=p('<span class="chip high">buy back?'),Hd=p('<div class=holdings-card><div class=holdings-card-head><b> <!>P ×</b><span class=holdings-age>exp <!> · <!>/<!> wd</span></div><div class=holdings-card-big><span></span><span class=holdings-card-target>target </span></div><div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark></div></div><div class=holdings-card-stats><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b></div><div><span>spot</span></div><div><span>close captures</span><b></b></div></div><div class=holdings-card-actions><button type=button class="btn-ghost holdings-close-btn">close…'),Wd=p("<b>—"),jd=p('<span class="chip normal">holding');const Ln=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),kn=(t,e=0)=>`${(t*100).toFixed(e)}%`;function zd(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function Gd(t){const e=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`,n=()=>e(new Date),r=()=>e(new Date(Date.now()+6048e5)),[i,s]=O(!1),[a,o]=O({symbol:"",strike:"",premium:"",contracts:"1",sold:n(),expiry:r()}),l=d=>h=>o({...a(),[d]:h.target.value}),c=async d=>{var h;d.preventDefault(),!((h=t.busy)!=null&&h.call(t))&&a().symbol&&[a().strike,a().premium,a().contracts].every(m=>Number(m)>0)&&(await t.onAdd({symbol:a().symbol,strike:Number(a().strike),premium:Number(a().premium),contracts:Number(a().contracts),sold:a().sold,expiry:a().expiry}),o({...a(),symbol:"",strike:"",premium:""}),s(!1))};return f(E,{get when(){return i()},get fallback(){return(()=>{var d=Od();return d.$$click=()=>s(!0),k(()=>{var h;return d.disabled=(h=t.busy)==null?void 0:h.call(t)}),d})()},get children(){var d=Pd(),h=d.firstChild,m=h.firstChild,g=m.nextSibling,_=h.nextSibling,I=_.firstChild,b=I.nextSibling,y=_.nextSibling,v=y.firstChild,x=v.nextSibling,A=y.nextSibling,T=A.firstChild,S=T.nextSibling,L=A.nextSibling,R=L.firstChild,P=R.nextSibling,D=L.nextSibling,U=D.firstChild,F=U.nextSibling,Q=D.nextSibling,ge=Q.nextSibling;return d.addEventListener("submit",c),he(g,"input",l("symbol")),he(b,"input",l("strike")),he(x,"input",l("premium")),he(S,"input",l("contracts")),he(P,"input",l("sold")),he(F,"input",l("expiry")),ge.$$click=()=>s(!1),k(()=>{var Ae;return Q.disabled=(Ae=t.busy)==null?void 0:Ae.call(t)}),k(()=>g.value=a().symbol),k(()=>b.value=a().strike),k(()=>x.value=a().premium),k(()=>S.value=a().contracts),k(()=>P.value=a().sold),k(()=>F.value=a().expiry),d}})}function Kd(t){var a,o;const[e,n]=O("bought-back"),[r,i]=O(((o=(a=t.position.mark)==null?void 0:a.mid)==null?void 0:o.toFixed(2))??""),s=()=>{const l=t.position,c=Number(r());return e()==="expired"?l.premium*100*l.contracts:Number.isFinite(c)?e()==="assigned"?(l.strike-c+l.premium)*100*l.contracts:(l.premium-c)*100*l.contracts:null};return(()=>{var l=Nd(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,m=h.nextSibling,g=m.nextSibling;g.nextSibling;var _=c.nextSibling,I=_.firstChild,b=I.firstChild,y=I.nextSibling,v=y.firstChild,x=y.nextSibling,A=x.firstChild,T=_.nextSibling;T.firstChild;var S=T.nextSibling,L=S.firstChild,R=L.nextSibling;return u(c,()=>t.position.symbol,h),u(c,()=>t.position.strike,g),u(c,()=>t.position.contracts,null),b.addEventListener("change",()=>n("bought-back")),v.addEventListener("change",()=>n("expired")),A.addEventListener("change",()=>n("assigned")),u(l,f(E,{get when(){return e()!=="expired"},get children(){var P=xd(),D=P.firstChild,U=D.nextSibling;return U.$$input=F=>i(F.target.value),k(()=>U.value=r()),P}}),T),u(T,f(E,{get when(){return s()!==null},fallback:"—",get children(){var P=os();return u(P,()=>Ln(s())),k(()=>te(P,s()>=0?"holdings-pos":"holdings-neg")),P}}),null),he(L,"click",t.onClose),R.$$click=()=>t.onConfirm(e(),e()==="expired"?null:Number(r())),k(()=>{var P;return R.disabled=(P=t.busy)==null?void 0:P.call(t)}),k(()=>b.checked=e()==="bought-back"),k(()=>v.checked=e()==="expired"),k(()=>A.checked=e()==="assigned"),l})()}function qd(){const[t,{refetch:e}]=Zr(Ms),[n,r]=O(""),[i,s]=O(null),[a,o]=O(!1),l=g=>{r(g),setTimeout(()=>r(""),4e3)},c=()=>{var g;return[...((g=t())==null?void 0:g.positions)??[]].map(_=>({p:_,v:_.view})).sort((_,I)=>{const b=y=>y.v.pl_pct==null?-1/0:y.v.pl_pct-y.v.target_pct;return b(I)-b(_)})},d=async()=>{var g;if(!a()){o(!0);try{const I=((g=(await Bs()).refresh)==null?void 0:g.stale)??[];l(I.length?`Marks refreshed — ${I.length} position(s) unpriced (kept last mark).`:"Marks refreshed.")}catch(_){l(`Refresh failed: ${_.message}`)}finally{o(!1)}await e()}},h=async g=>{if(!a()){o(!0);try{const _=await Us(g);l(`Added ${_.position.symbol} ${_.position.strike} — press Refresh marks to price it.`)}catch(_){l(`Add failed: ${_.message}`)}finally{o(!1)}await e()}},m=async(g,_,I)=>{if(!a()){o(!0);try{await Fs(g),l(_==="expired"?"Position removed (expired worthless — premium kept).":"Position removed.")}catch(b){l(`Close failed: ${b.message}`)}finally{o(!1)}s(null),await e()}};return(()=>{var g=Ud(),_=g.firstChild,I=_.firstChild;return u(_,f(Gd,{onAdd:h,busy:a}),I),I.$$click=d,u(g,f(E,{get when(){return n()},get children(){var b=Dd();return u(b,n),b}}),null),u(g,f(E,{get when(){return t.error},fallback:null,get children(){var b=Ld();return b.firstChild,u(b,()=>t.error.message,null),b}}),null),u(g,f(E,{get when(){return c().length>0},get fallback(){return Fd()},get children(){var b=Md();return u(b,f(ee,{get each(){return c()},children:({p:y,v})=>(()=>{var x=Hd(),A=x.firstChild,T=A.firstChild,S=T.firstChild,L=S.nextSibling;L.nextSibling;var R=T.nextSibling,P=R.firstChild,D=P.nextSibling,U=D.nextSibling,F=U.nextSibling,Q=F.nextSibling,ge=Q.nextSibling;ge.nextSibling;var Ae=A.nextSibling,$=Ae.firstChild,w=$.nextSibling;w.firstChild;var N=Ae.nextSibling,B=N.firstChild,V=B.nextSibling,se=N.nextSibling,z=se.firstChild,ht=z.firstChild,xt=ht.nextSibling,K=z.nextSibling,me=K.firstChild,Re=me.nextSibling,Pe=K.nextSibling;Pe.firstChild;var Ye=Pe.nextSibling,Xe=Ye.firstChild,Xn=Xe.nextSibling,Qn=se.nextSibling,Zn=Qn.firstChild;return u(T,()=>y.symbol,S),u(T,()=>y.strike,L),u(T,()=>y.contracts,null),u(R,()=>y.expiry,D),u(R,()=>v.days_elapsed,F),u(R,()=>v.days_total,ge),u($,(()=>{var M=q(()=>v.pl_pct==null);return()=>M()?"—":`${v.pl_pct>=0?"+":""}${kn(v.pl_pct,1)}`})()),u(w,()=>kn(v.target_pct),null),u(xt,()=>Ln(y.premium)),u(Re,(()=>{var M=q(()=>y.mark==null);return()=>M()?"—":y.mark.mid.toFixed(2)})()),u(K,f(E,{get when(){return y.mark!=null},get children(){var M=Gr();return u(M,()=>zd(y.mark.as_of)),M}}),null),u(K,f(E,{get when(){return y.mark==null},get children(){return Bd()}}),null),u(Pe,f(E,{get when(){var M;return((M=y.mark)==null?void 0:M.underlying_price)!=null},get fallback(){return Wd()},get children(){return[(()=>{var M=os();return u(M,()=>y.mark.underlying_price.toFixed(2)),M})(),(()=>{var M=Gr();return u(M,()=>`${v.spot_pct_vs_strike>=0?"+":""}${kn(v.spot_pct_vs_strike,1)} vs strike`),k(()=>te(M,v.spot_pct_vs_strike<0?"holdings-neg":"holdings-pos")),M})()]}}),null),u(Xn,(()=>{var M=q(()=>v.pl_dollars==null);return()=>M()?"—":Ln(v.pl_dollars)})()),u(Qn,f(E,{get when(){return v.pace_met},get fallback(){return jd()},get children(){return Vd()}}),Zn),Zn.$$click=()=>s(y),k(M=>{var er=!!v.pace_met,tr=v.pl_pct>=0?"holdings-pos":"holdings-neg",nr=`${v.pl_pct==null?0:Math.max(0,Math.min(100,v.pl_pct*100))}%`,rr=`${Math.min(100,v.target_pct*100)}%`,ir=v.pl_dollars>=0?"holdings-pos":"holdings-neg";return er!==M.e&&x.classList.toggle("holdings-card-met",M.e=er),tr!==M.t&&te($,M.t=tr),nr!==M.a&&Ge(B,"width",M.a=nr),rr!==M.o&&Ge(V,"left",M.o=rr),ir!==M.i&&te(Xn,M.i=ir),M},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),x})()})),b}}),null),u(g,f(E,{get when(){return i()},get children(){return f(Kd,{get position(){return i()},busy:a,onClose:()=>s(null),onConfirm:(b,y)=>m(i().id,b)})}}),null),k(()=>I.disabled=a()),g})()}ce(["input","click"]);async function Jd(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var Yd=p("<button type=button class=run-btn>"),Xd=p("<span class=run-count>/"),Qd=p("<span class=run-bar><span class=fill>"),Zd=p("<li><span class=mark></span><span class=label>"),eh=p("<div class=toast-cached>Served from cache — last run <!> min old"),th=p('<div class="toast-cached warn">'),nh=p("<div class=run-headline>"),rh=p("<ul class=run-stages>"),ih=p("<details class=run-errors><summary>details</summary><ul>"),sh=p("<div class=run-warn>Closing this tab stops the run."),ah=p("<div class=run-warn>Re-checking every 15 s…"),oh=p("<div class=run-strip>"),lh=p("<li> ");const ls=["quotes","metrics","chains_short","chains_medium"],cs={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},ch=15e3,us=t=>t!==null&&Date.now()>=t;function Kr(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function uh(t){const[e,n]=O("idle"),[r,i]=O(A()),[s,a]=O(null),[o,l]=O(0),[c,d]=O(null),[h,m]=O(null),[g,_]=O("");let I=null,b=null;const[y,v]=O(0);let x=null;ze(()=>{const $=t();if(x&&(clearTimeout(x),x=null),($==null?void 0:$.run_allowed)===!1){const w=tn($.next_open_utc);w!==null&&(x=setTimeout(()=>v(N=>N+1),Math.max(0,w-Date.now())))}});function A(){return Object.fromEntries(ls.map($=>[$,{status:"pending",error:null}]))}function T(){I&&clearInterval(I),I=null,b&&clearInterval(b),b=null}function S(){l(0),I=setInterval(()=>l($=>$+1),1e3)}function L($){switch($.type){case"stage_started":i(w=>({...w,[$.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:$.stage,done:$.done,total:$.total});break;case"stage_finished":i(w=>({...w,[$.stage]:{status:$.ok?"ok":"failed",error:$.error??null}}));break;case"run_finished":d($);break}}function R(){T();const $=c(),w=(($==null?void 0:$.stages)??[]).some(N=>N.name.startsWith("chains")&&["ok","partial"].includes(N.status));n($&&(w||$.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function P($){let w=!1;return await Jd($,N=>{L(N),N.type==="run_finished"&&(w=!0)}),w?(R(),!0):!1}async function D($){n("detached"),b=setInterval(async()=>{var w,N,B;try{const V=await ii(),se=((N=(w=V==null?void 0:V.result)==null?void 0:w.run)==null?void 0:N.finished_at_utc)??null;if(se&&se!==$){i(U(V.result)),T(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((B=V==null?void 0:V.run_state)==null?void 0:B.status)!=="running"&&(T(),n("idle"),_("Stream lost and the run was canceled — press Run to retry."))}catch{}},ch)}function U($){const w=A();for(const N of($==null?void 0:$.stages)??[])w[N.name]&&(w[N.name]={status:N.status,error:N.error});return w}async function F(){var B,V,se;if(["starting","running","detached"].includes(e()))return;_(""),d(null),a(null),i(A()),m(null);const $=((se=(V=(B=t())==null?void 0:B.result)==null?void 0:V.run)==null?void 0:se.finished_at_utc)??null;n("running"),S();let w;try{w=await Ds()}catch{T(),n("idle"),_("Run failed to start — network or server unreachable.");return}const N=w.headers.get("content-type")??"";if(w.ok&&N.includes("application/json")){const z=await w.json().catch(()=>null);if(T(),n("idle"),(z==null?void 0:z.status)==="cached"){m(z.age_secs),setTimeout(()=>m(null),6e3);return}}if(w.status===403&&N.includes("application/json")){const z=await w.json().catch(()=>null);T(),n("idle"),_(z!=null&&z.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(z.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(w.status===202){const z=await Ls();if(z.ok&&(z.headers.get("content-type")??"").includes("text/event-stream")){await P(z)||await D($);return}await D($);return}if(N.includes("text/event-stream")){await P(w)||await D($);return}T(),n("idle"),_(`Unexpected /api/run response (${w.status}, ${N||"no type"}).`)}return Ue(()=>{T(),x&&clearTimeout(x)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:g,triggerRun:F,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{y();const $=t();return($==null?void 0:$.run_allowed)!==!1?!0:us(tn($==null?void 0:$.next_open_utc))},nextOpenUtc:()=>{var $;return(($=t())==null?void 0:$.next_open_utc)??null}}}function dh(t){const e=()=>!t.run.runAllowed(),n=()=>rs(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=Yd();return i.$$click=()=>t.run.triggerRun(),u(i,r),k(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&re(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function hh(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=Zd(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>cs[t.name]),u(i,f(E,{get when(){return r()!==null},get children(){return[(()=>{var o=Xd(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=Qd(),l=o.firstChild;return k(c=>Ge(l,"width",`${r()}%`)),o})()]}}),null),k(()=>te(i,`run-stage ${e()}`)),i})()}function fh(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",q(()=>Kr(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",q(()=>Kr(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(E,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=oh();return u(i,f(E,{get when(){return e.cachedToast()},get children(){var s=eh(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(E,{get when(){return e.notice()},get children(){var s=th();return u(s,()=>e.notice()),s}}),null),u(i,f(E,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=nh();return u(s,r),s})(),(()=>{var s=rh();return u(s,()=>ls.map(a=>f(hh,{name:a,run:e}))),s})(),f(E,{get when(){return q(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=ih(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=lh(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>cs[l.name]??l.name,null),u(c,(()=>{var h=q(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,f(E,{get when(){return q(()=>e.phase()==="running")()&&!n()},get children(){return sh()}}),null),u(i,f(E,{get when(){return e.phase()==="detached"},get children(){return ah()}}),null),i}})}ce(["click"]);var ds=p("<b>"),ph=p("<span>Market closed · last run <b></b> ago"),gh=p("<div class=cache-line><span></span><span class=pill>run: "),mh=p("<span>Cached · <b></b> left"),_h=p("<span>Stale · last run <b></b> ago"),bh=p("<nav class=tabs role=tablist aria-label=timeframes>"),yh=p("<button type=button role=tab class=tab>"),wh=p('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),vh=p("<div class=pop-backdrop>"),Eh=p("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),Ih=p("<div class=error-banner>API error: "),Sh=p("<div class=shell><header><div class=user-box></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),kh=p("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function $h(){const[t,e]=O(fu()),n=r=>{e(r),pu(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(gt)}}function qr(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function Th(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function Jr(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function $n(t){return f(E,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=ds();return u(e,()=>t.at()),e})()]}})}function Ch(t){const[e,n]=O(0);wt(()=>{const g=setInterval(()=>n(_=>_+1),3e4);Ue(()=>clearInterval(g))});let r=Date.now(),i=0;ze(_t(()=>t.envelope,g=>{r=Date.now(),i=(g==null?void 0:g.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const g=Math.max(0,(t.envelope.cache_secs??0)-s());return g>=60?`${Math.floor(g/60)}m`:`${g}s`},c=()=>{var g,_;return $u((_=(g=t.envelope.result)==null?void 0:g.run)==null?void 0:_.finished_at_utc)},d=()=>{e();const g=t.envelope.next_open_utc,_=tn(g);if(!(_===null||us(_)))return rs(g)},h=()=>o()&&a()==="stale"?"closed":a(),m=()=>a()==="fresh"||a()==="stale";return(()=>{var g=gh(),_=g.firstChild,I=_.nextSibling;return I.firstChild,u(g,f(E,{get when(){return q(()=>!!o())()&&m()},get fallback(){return f(E,{get when(){return a()==="fresh"},get fallback(){return f(E,{get when(){return a()==="stale"},get children(){var b=_h(),y=b.firstChild,v=y.nextSibling;return v.nextSibling,u(v,()=>Jr(s())),u(b,f($n,{at:c}),null),b}})},get children(){var b=mh(),y=b.firstChild,v=y.nextSibling;return v.nextSibling,u(v,l),u(b,f($n,{at:c}),null),b}})},get children(){var b=ph(),y=b.firstChild,v=y.nextSibling;return v.nextSibling,u(v,()=>Jr(s())),u(b,f($n,{at:c}),null),u(b,f(E,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var x=ds();return u(x,d),x})()]}}),null),b}}),_),u(_,(()=>{var b=q(()=>h()==="closed");return()=>b()?"market closed":a()})()),u(I,()=>{var b;return((b=t.envelope.run_state)==null?void 0:b.status)??"idle"},null),k(()=>te(_,"pill "+h())),g})()}function Yr(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=bh();return u(n,()=>e.map(r=>(()=>{var i=yh();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=q(()=>!r.holdings);return()=>s()&&` (${mt(Th(t.result,r.id))})`})(),null),k(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&re(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function Ah(){const[t,e]=O(void 0),[n,{refetch:r}]=Zr(t,y=>y?ii():void 0);wt(()=>{if(!ot){e(null);return}const y=vl(Ze(),e);Ue(y)});const[i,s]=O(!1);ze(_t(t,y=>{s(!1),!(!y||!ot)&&Ps().then(v=>s(v.status===403)).catch(()=>{})})),wt(()=>{const y=()=>r();window.addEventListener("webapp:refresh-latest",y),Ue(()=>window.removeEventListener("webapp:refresh-latest",y))});const a=()=>{var y,v;return((y=t())==null?void 0:y.email)||((v=t())==null?void 0:v.uid)||""},[o,l]=O(!1),[c,d]=O(!1),h=$h(),[m,g]=O("short"),_=()=>m()==="holdings",I=uu(),b=uh(()=>n());return f(E,{get when(){return t()},get fallback(){return f(qc,{})},get children(){return[f(E,{get when(){return!i()},get fallback(){return f(Kc,{get email(){return a()},onSignOut:()=>Fr()})},get children(){var y=Sh(),v=y.firstChild,x=v.firstChild,A=x.nextSibling,T=A.nextSibling;return u(x,f(E,{get when(){return t()},get children(){return[(()=>{var S=wh(),L=S.firstChild,R=L.nextSibling;return S.$$click=()=>l(!o()),u(R,a),k(()=>re(S,"aria-expanded",o())),S})(),f(E,{get when(){return o()},get children(){return[(()=>{var S=vh();return S.$$click=()=>l(!1),S})(),(()=>{var S=Eh(),L=S.firstChild,R=L.nextSibling,P=R.nextSibling,D=P.nextSibling;return u(R,a),P.$$click=()=>{l(!1),d(!0)},D.$$click=()=>{l(!1),Fr()},S})()]}})]}})),u(v,f(E,{get when(){return q(()=>!n.loading)()&&!n.error},get children(){return f(Ch,{get envelope(){return n()}})}}),T),u(T,f(dh,{run:b})),u(y,f(E,{get when(){return n.error},get children(){var S=Ih();return S.firstChild,u(S,()=>n.error.message,null),S}}),null),u(y,f(fh,{run:b}),null),u(y,f(E,{get when(){return _()},get children(){return[f(Yr,{result:()=>{var S;return(S=n())==null?void 0:S.result},tab:m,onTab:g}),f(qd,{})]}}),null),u(y,f(E,{get when(){return!_()},get children(){return f(E,{get when(){var S;return q(()=>!n.loading)()&&((S=n())==null?void 0:S.result)},get fallback(){return f(E,{get when(){return!n.loading},get children(){return kh()}})},children:S=>{const L=()=>S();return[f(hu,{scoring:I}),f(Yr,{result:L,tab:m,onTab:g}),f(zr,{id:"short",active:()=>m()==="short",get tf(){var R;return(R=L().timeframes)==null?void 0:R.short},get stageError(){return qr(L(),"chains_short")},get stages(){return L().stages},get thresholds(){return L().thresholds},columns:h,scoring:I}),f(zr,{id:"medium",active:()=>m()==="medium",get tf(){var R;return(R=L().timeframes)==null?void 0:R.medium},get stageError(){return qr(L(),"chains_medium")},get stages(){return L().stages},get thresholds(){return L().thresholds},columns:h,scoring:I})]}})}}),null),y}}),f(E,{get when(){return c()},get children(){return f(eu,{onClose:()=>d(!1)})}})]}})}ce(["click"]);Ts(()=>f(Ah,{}),document.getElementById("root"));
