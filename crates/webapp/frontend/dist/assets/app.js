(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const Xi=!1,Qi=(t,e)=>t===e,Zi=Symbol("solid-track"),Ut={equals:Qi};let Ur=Hr;const we=1,Ft=2,Fr={owned:null,cleanups:null,context:null,owner:null},an={};var V=null;let on=null,es=null,F=null,G=null,me=null,Xt=0;function Pt(t,e){const n=F,r=V,i=t.length===0,s=e===void 0?r:e,a=i?Fr:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>ie(()=>ft(a)));V=a,F=null;try{return Pe(o,!0)}finally{F=n,V=r}}function $(t,e){e=e?Object.assign({},Ut,e):Ut;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),Vr(n,i));return[Br.bind(n),r]}function ts(t,e,n){const r=Qt(t,e,!0,we);et(r)}function R(t,e,n){const r=Qt(t,e,!1,we);et(r)}function Ue(t,e,n){Ur=cs;const r=Qt(t,e,!1,we);r.user=!0,me?me.push(r):et(r)}function K(t,e,n){n=n?Object.assign({},Ut,n):Ut;const r=Qt(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,et(r),Br.bind(r)}function ns(t){return t&&typeof t=="object"&&"then"in t}function rs(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=an,c=!1,l="initialValue"in s,d=typeof r=="function"&&K(r);const h=new Set,[g,_]=(s.storage||$)(s.initialValue),[w,k]=$(void 0),[m,I]=$(void 0,{equals:!1}),[T,O]=$(l?"ready":"unresolved");V&&Re(()=>{for(const N of h.keys())N.decrement();h.clear(),a=null});function P(N,D,H,j){return a===N&&(a=null,j!==void 0&&(l=!0),(N===o||D===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(j,{value:D})),o=an,y(D,H)),D}function y(N,D){Pe(()=>{D===void 0&&_(()=>N),O(D!==void 0?"errored":l?"ready":"unresolved"),k(D);for(const H of h.keys())H.decrement();h.clear()},!1)}function C(){const N=ss,D=g(),H=w();if(H!==void 0&&!a)throw H;return F&&F.user,D}function L(N=!0){if(N!==!1&&c)return;c=!1;const D=d?d():r;if(D==null||D===!1){P(a,ie(g));return}let H;const j=o!==an?o:ie(()=>{try{return i(D,{value:g(),refetching:N})}catch(le){H=le}});if(H!==void 0){P(a,void 0,Ot(H),D);return}else if(!ns(j))return P(a,j,void 0,D),j;return a=j,"v"in j?(j.s===1?P(a,j.v,void 0,D):P(a,void 0,Ot(j.v),D),j):(c=!0,queueMicrotask(()=>c=!1),Pe(()=>{O(l?"refreshing":"pending"),I()},!1),j.then(le=>P(j,le,void 0,D),le=>P(j,void 0,Ot(le),D)))}Object.defineProperties(C,{state:{get:()=>T()},error:{get:()=>w()},loading:{get(){const N=T();return N==="pending"||N==="refreshing"}},latest:{get(){if(!l)return C();const N=w();if(N&&!a)throw N;return g()}}});let x=V;return d?ts(()=>(x=V,L(!1))):L(!1),[C,{refetch:N=>is(x,()=>L(N)),mutate:_}]}function ie(t){if(F===null)return t();const e=F;F=null;try{return t()}finally{F=e}}function ct(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let c=0;c<t.length;c++)a[c]=t[c]()}else a=t();const o=ie(()=>e(a,i,s));return i=a,o}}function ht(t){Ue(()=>ie(t))}function Re(t){return V===null||(V.cleanups===null?V.cleanups=[t]:V.cleanups.push(t)),t}function is(t,e){const n=V,r=F;V=t,F=null;try{return Pe(e,!0)}catch(i){On(i)}finally{V=n,F=r}}const[Jd,Yd]=$(!1);let ss;function Br(){if(this.sources&&this.state)if(this.state===we)et(this);else{const t=G;G=null,Pe(()=>Vt(this),!1),G=t}if(F){const t=this.observers;if(!t||t[t.length-1]!==F){const e=t?t.length:0;F.sources?(F.sources.push(this),F.sourceSlots.push(e)):(F.sources=[this],F.sourceSlots=[e]),t?(t.push(F),this.observerSlots.push(F.sources.length-1)):(this.observers=[F],this.observerSlots=[F.sources.length-1])}}return this.value}function Vr(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Pe(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=on&&on.running;a&&on.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?G.push(s):me.push(s),s.observers&&Wr(s)),a||(s.state=we)}if(G.length>1e6)throw G=[],new Error},!1)),e}function et(t){if(!t.fn)return;ft(t);const e=Xt;as(t,t.value,e)}function as(t,e,n){let r;const i=V,s=F;F=V=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=we,t.owned&&t.owned.forEach(ft),t.owned=null),t.updatedAt=n+1,On(a)}finally{F=s,V=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?Vr(t,r):t.value=r,t.updatedAt=n)}function Qt(t,e,n,r=we,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:V,context:V?V.context:null,pure:n};return V===null||V!==Fr&&(V.owned?V.owned.push(s):V.owned=[s]),s}function Bt(t){if(t.state===0)return;if(t.state===Ft)return Vt(t);if(t.suspense&&ie(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<Xt);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===we)et(t);else if(t.state===Ft){const r=G;G=null,Pe(()=>Vt(t,e[0]),!1),G=r}}function Pe(t,e){if(G)return t();let n=!1;e||(G=[]),me?n=!0:me=[],Xt++;try{const r=t();return os(n),r}catch(r){n||(me=null),G=null,On(r)}}function os(t){if(G&&(Hr(G),G=null),t)return;const e=me;me=null,e.length&&Pe(()=>Ur(e),!1)}function Hr(t){for(let e=0;e<t.length;e++)Bt(t[e])}function cs(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:Bt(r)}for(e=0;e<n;e++)Bt(t[e])}function Vt(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===we?r!==e&&(!r.updatedAt||r.updatedAt<Xt)&&Bt(r):i===Ft&&Vt(r,e)}}}function Wr(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=Ft,n.pure?G.push(n):me.push(n),n.observers&&Wr(n))}}function ft(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)ft(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)ft(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function Ot(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function On(t,e=V){throw Ot(t)}const ls=Symbol("fallback");function qn(t){for(let e=0;e<t.length;e++)t[e]()}function us(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Re(()=>qn(s)),()=>{let c=t()||[],l=c.length,d,h;return c[Zi],ie(()=>{let _,w,k,m,I,T,O,P,y;if(l===0)a!==0&&(qn(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[ls],i[0]=Pt(C=>(s[0]=C,n.fallback())),a=1);else if(a===0){for(i=new Array(l),h=0;h<l;h++)r[h]=c[h],i[h]=Pt(g);a=l}else{for(k=new Array(l),m=new Array(l),o&&(I=new Array(l)),T=0,O=Math.min(a,l);T<O&&r[T]===c[T];T++);for(O=a-1,P=l-1;O>=T&&P>=T&&r[O]===c[P];O--,P--)k[P]=i[O],m[P]=s[O],o&&(I[P]=o[O]);for(_=new Map,w=new Array(P+1),h=P;h>=T;h--)y=c[h],d=_.get(y),w[h]=d===void 0?-1:d,_.set(y,h);for(d=T;d<=O;d++)y=r[d],h=_.get(y),h!==void 0&&h!==-1?(k[h]=i[d],m[h]=s[d],o&&(I[h]=o[d]),h=w[h],_.set(y,h)):s[d]();for(h=T;h<l;h++)h in k?(i[h]=k[h],s[h]=m[h],o&&(o[h]=I[h],o[h](h))):i[h]=Pt(g);i=i.slice(0,a=l),r=c.slice(0)}return i});function g(_){if(s[h]=_,o){const[w,k]=$(h);return o[h]=k,e(c[h],w)}return e(c[h])}}}function f(t,e){return ie(()=>t(e||{}))}const ds=t=>`Stale read from <${t}>.`;function ne(t){const e="fallback"in t&&{fallback:()=>t.fallback};return K(us(()=>t.each,t.children,e||void 0))}function v(t){const e=t.keyed,n=K(()=>t.when,void 0,void 0),r=e?n:K(n,void 0,{equals:(i,s)=>!i==!s});return K(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?ie(()=>s(e?i:()=>{if(!ie(r))throw ds("Show");return n()})):s}return t.fallback},void 0,void 0)}const q=t=>K(()=>t());function hs(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,c=e[i-1].nextSibling,l=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:c;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!l||!l.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!l){l=new Map;let h=o;for(;h<s;)l.set(n[h],h++)}const d=l.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,g=1,_;for(;++h<i&&h<s&&!((_=l.get(e[h]))==null||_!==d+g);)g++;if(g>d-o){const w=e[a];for(;o<d;)t.insertBefore(n[o++],w)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const Jn="_$DX_DELEGATE";function fs(t,e,n,r={}){let i;return Pt(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function p(t,e,n,r){let i;const s=()=>{const o=document.createElement("template");return o.innerHTML=t,o.content.firstChild},a=()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function ce(t,e=window.document){const n=e[Jn]||(e[Jn]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,gs))}}function Z(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function Ae(t,e){e==null?t.removeAttribute("class"):t.className=e}function In(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function lt(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function ps(t,e,n){return ie(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return Ht(t,e,r,n);R(i=>Ht(t,e(),i,n),r)}function gs(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=c=>Object.defineProperty(t,"target",{configurable:!0,value:c}),a=()=>{const c=e[n];if(c&&!e.disabled){const l=e[`${n}Data`];if(l!==void 0?c.call(e,l,t):c.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const c=t.composedPath();s(c[0]);for(let l=0;l<c.length-2&&(e=c[l],!!a());l++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function Ht(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=je(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=je(t,n,r);else{if(s==="function")return R(()=>{let o=e();for(;typeof o=="function";)o=o();n=Ht(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],c=n&&Array.isArray(n);if(En(o,e,n,i))return R(()=>n=Ht(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=je(t,n,r),a)return n}else c?n.length===0?Yn(t,o,r):hs(t,n,o):(n&&je(t),Yn(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=je(t,n,r,e);je(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function En(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],c=n&&n[t.length],l;if(!(o==null||o===!0||o===!1))if((l=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=En(t,o,c)||i;else if(l==="function")if(r){for(;typeof o=="function";)o=o();i=En(t,Array.isArray(o)?o:[o],Array.isArray(c)?c:[c])||i}else t.push(o),i=!0;else{const d=String(o);c&&c.nodeType===3&&c.data===d?t.push(c):t.push(document.createTextNode(d))}}return i}function Yn(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function je(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const c=o.parentNode===t;!s&&!a?c?t.replaceChild(i,o):t.insertBefore(i,n):c&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let Nt=null;function ms(t){Nt=t}async function He(t,e={}){if(!Nt)return fetch(t,e);const n=new Headers(e.headers??{}),r=await Nt(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await Nt(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function jr(){const t=await He("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function _s(){return He("/api/me")}async function bs(){const t=await He("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function ws(t){const e=await He("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function ys(t){const e=await He("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function vs(){return await He("/api/run",{method:"POST"})}async function Is(){return He("/api/progress")}const Es=()=>{};var Xn={};/**
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
 */const zr=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Ss=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],c=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Gr={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,c=i+2<t.length,l=c?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let g=(o&15)<<2|l>>6,_=l&63;c||(_=64,a||(g=64)),r.push(n[d],n[h],n[g],n[_])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(zr(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Ss(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const l=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||l==null||h==null)throw new ks;const g=s<<2|o>>4;if(r.push(g),l!==64){const _=o<<4&240|l>>2;if(r.push(_),h!==64){const w=l<<6&192|h;r.push(w)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class ks extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ts=function(t){const e=zr(t);return Gr.encodeByteArray(e,!0)},Kr=function(t){return Ts(t).replace(/\./g,"")},qr=function(t){try{return Gr.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Cs(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const As=()=>Cs().__FIREBASE_DEFAULTS__,$s=()=>{if(typeof process>"u"||typeof Xn>"u")return;const t=Xn.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Rs=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&qr(t[1]);return e&&JSON.parse(e)},Nn=()=>{try{return Es()||As()||$s()||Rs()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Ps=t=>{var e,n;return(n=(e=Nn())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},Jr=()=>{var t;return(t=Nn())==null?void 0:t.config},Yr=t=>{var e;return(e=Nn())==null?void 0:e[`_${t}`]};/**
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
 */class Xr{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function J(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Os(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(J())}function Ns(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Ds(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function xs(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ls(){const t=J();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Ms(){try{return typeof indexedDB=="object"}catch{return!1}}function Us(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const Fs="FirebaseError";class Oe extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Fs,Object.setPrototypeOf(this,Oe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,bt.prototype.create)}}class bt{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Bs(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new Oe(i,o,r)}}function Bs(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function Vs(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Xe(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(Qn(s)&&Qn(a)){if(!Xe(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function Qn(t){return t!==null&&typeof t=="object"}/**
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
 */function wt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function it(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function st(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Hs(t,e){const n=new Ws(t,e);return n.subscribe.bind(n)}class Ws{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");js(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=cn),i.error===void 0&&(i.error=cn),i.complete===void 0&&(i.complete=cn);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function js(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function cn(){}/**
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
 */function ye(t){return t&&t._delegate?t._delegate:t}/**
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
 */function Dn(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function zs(t){return(await fetch(t,{credentials:"include"})).ok}class Qe{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Le="[DEFAULT]";/**
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
 */class Gs{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new Xr;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(qs(e))try{this.getOrInitializeService({instanceIdentifier:Le})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Le){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Le){return this.instances.has(e)}getOptions(e=Le){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Ks(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Le){return this.component?this.component.multipleInstances?e:Le:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ks(t){return t===Le?void 0:t}function qs(t){return t.instantiationMode==="EAGER"}/**
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
 */class Js{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Gs(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var M;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(M||(M={}));const Ys={debug:M.DEBUG,verbose:M.VERBOSE,info:M.INFO,warn:M.WARN,error:M.ERROR,silent:M.SILENT},Xs=M.INFO,Qs={[M.DEBUG]:"log",[M.VERBOSE]:"log",[M.INFO]:"info",[M.WARN]:"warn",[M.ERROR]:"error"},Zs=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Qs[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Qr{constructor(e){this.name=e,this._logLevel=Xs,this._logHandler=Zs,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in M))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ys[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,M.DEBUG,...e),this._logHandler(this,M.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,M.VERBOSE,...e),this._logHandler(this,M.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,M.INFO,...e),this._logHandler(this,M.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,M.WARN,...e),this._logHandler(this,M.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,M.ERROR,...e),this._logHandler(this,M.ERROR,...e)}}const ea=(t,e)=>e.some(n=>t instanceof n);let Zn,er;function ta(){return Zn||(Zn=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function na(){return er||(er=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Zr=new WeakMap,Sn=new WeakMap,ei=new WeakMap,ln=new WeakMap,xn=new WeakMap;function ra(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n($e(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&Zr.set(n,t)}).catch(()=>{}),xn.set(e,t),e}function ia(t){if(Sn.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Sn.set(t,e)}let kn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Sn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||ei.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return $e(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function sa(t){kn=t(kn)}function aa(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(un(this),e,...n);return ei.set(r,e.sort?e.sort():[e]),$e(r)}:na().includes(t)?function(...e){return t.apply(un(this),e),$e(Zr.get(this))}:function(...e){return $e(t.apply(un(this),e))}}function oa(t){return typeof t=="function"?aa(t):(t instanceof IDBTransaction&&ia(t),ea(t,ta())?new Proxy(t,kn):t)}function $e(t){if(t instanceof IDBRequest)return ra(t);if(ln.has(t))return ln.get(t);const e=oa(t);return e!==t&&(ln.set(t,e),xn.set(e,t)),e}const un=t=>xn.get(t);function ca(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=$e(a);return r&&a.addEventListener("upgradeneeded",c=>{r($e(a.result),c.oldVersion,c.newVersion,$e(a.transaction),c)}),n&&a.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),o.then(c=>{s&&c.addEventListener("close",()=>s()),i&&c.addEventListener("versionchange",l=>i(l.oldVersion,l.newVersion,l))}).catch(()=>{}),o}const la=["get","getKey","getAll","getAllKeys","count"],ua=["put","add","delete","clear"],dn=new Map;function tr(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(dn.get(e))return dn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=ua.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||la.includes(n)))return;const s=async function(a,...o){const c=this.transaction(a,i?"readwrite":"readonly");let l=c.store;return r&&(l=l.index(o.shift())),(await Promise.all([l[n](...o),i&&c.done]))[0]};return dn.set(e,s),s}sa(t=>({...t,get:(e,n,r)=>tr(e,n)||t.get(e,n,r),has:(e,n)=>!!tr(e,n)||t.has(e,n)}));/**
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
 */class da{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(ha(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function ha(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Tn="@firebase/app",nr="0.16.1";/**
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
 */const _e=new Qr("@firebase/app"),fa="@firebase/app-compat",pa="@firebase/analytics-compat",ga="@firebase/analytics",ma="@firebase/app-check-compat",_a="@firebase/app-check",ba="@firebase/auth",wa="@firebase/auth-compat",ya="@firebase/database",va="@firebase/data-connect",Ia="@firebase/database-compat",Ea="@firebase/functions",Sa="@firebase/functions-compat",ka="@firebase/installations",Ta="@firebase/installations-compat",Ca="@firebase/messaging",Aa="@firebase/messaging-compat",$a="@firebase/performance",Ra="@firebase/performance-compat",Pa="@firebase/remote-config",Oa="@firebase/remote-config-compat",Na="@firebase/storage",Da="@firebase/storage-compat",xa="@firebase/firestore",La="@firebase/ai",Ma="@firebase/firestore-compat",Ua="firebase",Fa="12.18.0";/**
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
 */const Cn="[DEFAULT]",Ba={[Tn]:"fire-core",[fa]:"fire-core-compat",[ga]:"fire-analytics",[pa]:"fire-analytics-compat",[_a]:"fire-app-check",[ma]:"fire-app-check-compat",[ba]:"fire-auth",[wa]:"fire-auth-compat",[ya]:"fire-rtdb",[va]:"fire-data-connect",[Ia]:"fire-rtdb-compat",[Ea]:"fire-fn",[Sa]:"fire-fn-compat",[ka]:"fire-iid",[Ta]:"fire-iid-compat",[Ca]:"fire-fcm",[Aa]:"fire-fcm-compat",[$a]:"fire-perf",[Ra]:"fire-perf-compat",[Pa]:"fire-rc",[Oa]:"fire-rc-compat",[Na]:"fire-gcs",[Da]:"fire-gcs-compat",[xa]:"fire-fst",[Ma]:"fire-fst-compat",[La]:"fire-vertex","fire-js":"fire-js",[Ua]:"fire-js-all"};/**
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
 */const Wt=new Map,Va=new Map,An=new Map;function rr(t,e){try{t.container.addComponent(e)}catch(n){_e.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function pt(t){const e=t.name;if(An.has(e))return _e.debug(`There were multiple attempts to register component ${e}.`),!1;An.set(e,t);for(const n of Wt.values())rr(n,t);for(const n of Va.values())rr(n,t);return!0}function ti(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function X(t){return t==null?!1:t.settings!==void 0}/**
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
 */const Ha={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},he=new bt("app","Firebase",Ha);/**
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
 */class Wa{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Qe("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw he.create("app-deleted",{appName:this._name})}}/**
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
 */const yt=Fa;function ni(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Cn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw he.create("bad-app-name",{appName:String(i)});if(n||(n=Jr()),!n)throw he.create("no-options");const s=Wt.get(i);if(s)if(Xe(n,s.options)){if(Xe(r,s.config))return s;throw he.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw he.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new Js(i);for(const c of An.values())a.addComponent(c);const o=new Wa(n,r,a);return Wt.set(i,o),o}function ja(t=Cn){const e=Wt.get(t);if(!e&&t===Cn&&Jr())return ni();if(!e)throw he.create("no-app",{appName:t});return e}function Ke(t,e,n){let r=Ba[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),_e.warn(a.join(" "));return}pt(new Qe(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const za="firebase-heartbeat-database",Ga=1,gt="firebase-heartbeat-store";let hn=null;function ri(){return hn||(hn=ca(za,Ga,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(gt)}catch(n){console.warn(n)}}}}).catch(t=>{throw he.create("idb-open",{originalErrorMessage:t.message})})),hn}async function Ka(t){try{const n=(await ri()).transaction(gt),r=await n.objectStore(gt).get(ii(t));return await n.done,r}catch(e){if(e instanceof Oe)_e.warn(e.message);else{const n=he.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});_e.warn(n.message)}}}async function ir(t,e){try{const r=(await ri()).transaction(gt,"readwrite");await r.objectStore(gt).put(e,ii(t)),await r.done}catch(n){if(n instanceof Oe)_e.warn(n.message);else{const r=he.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});_e.warn(r.message)}}}function ii(t){return`${t.name}!${t.options.appId}`}/**
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
 */const qa=1024,Ja=30;class Ya{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Qa(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=sr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Ja){const a=Za(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){_e.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=sr(),{heartbeatsToSend:r,unsentEntries:i}=Xa(this._heartbeatsCache.heartbeats),s=Kr(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return _e.warn(n),""}}}function sr(){return new Date().toISOString().substring(0,10)}function Xa(t,e=qa){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),ar(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),ar(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Qa{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ms()?Us().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Ka(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return ir(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return ir(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function ar(t){return Kr(JSON.stringify({version:2,heartbeats:t})).length}function Za(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function eo(t){pt(new Qe("platform-logger",e=>new da(e),"PRIVATE")),pt(new Qe("heartbeat",e=>new Ya(e),"PRIVATE")),Ke(Tn,nr,t),Ke(Tn,nr,"esm2020"),Ke("fire-js","")}/**
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
 */eo("");var to="firebase",no="12.18.0";/**
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
 */Ke(to,no,"app");function si(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const ro=si,ai=new bt("auth","Firebase",si());/**
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
 */const jt=new Qr("@firebase/auth");function oi(t,...e){jt.logLevel<=M.WARN&&jt.warn(`Auth (${yt}): ${t}`,...e)}function Dt(t,...e){jt.logLevel<=M.ERROR&&jt.error(`Auth (${yt}): ${t}`,...e)}/**
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
 */function ee(t,...e){throw Mn(t,...e)}function re(t,...e){return Mn(t,...e)}function Ln(t,e,n){const r={...ro(),[e]:n};return new bt("auth","Firebase",r).create(e,{appName:t.name})}function ae(t){return Ln(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ci(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&ee(t,"argument-error"),Ln(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Mn(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return ai.create(t,...e)}function E(t,e,...n){if(!t)throw Mn(e,...n)}function fe(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Dt(e),new Error(e)}function be(t,e){t||fe(e)}/**
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
 */function $n(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function io(){return or()==="http:"||or()==="https:"}function or(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
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
 */function so(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(io()||Ds()||"connection"in navigator)?navigator.onLine:!0}function ao(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
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
 */class vt{constructor(e,n){this.shortDelay=e,this.longDelay=n,be(n>e,"Short delay should be less than long delay!"),this.isMobile=Os()||xs()}get(){return so()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Un(t,e){be(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
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
 */class li{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;fe("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;fe("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;fe("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const oo={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const co=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],lo=new vt(3e4,6e4);function Ne(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function De(t,e,n,r,i={}){return ui(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=wt({...a,key:t.config.apiKey}).slice(1),c=await t._getAdditionalHeaders();c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode);const l={method:e,headers:c,...s};return Ns()||(l.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&Dn(t.emulatorConfig.host)&&(l.credentials="include"),li.fetch()(await di(t,t.config.apiHost,n,o),l)})}async function ui(t,e,n){t._canInitEmulator=!1;const r={...oo,...e};try{const i=new ho(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw $t(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[c,l]=o.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw $t(t,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw $t(t,"email-already-in-use",a);if(c==="USER_DISABLED")throw $t(t,"user-disabled",a);const d=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw Ln(t,d,l);ee(t,d)}}catch(i){if(i instanceof Oe)throw i;ee(t,"network-request-failed",{message:String(i)})}}async function It(t,e,n,r,i={}){const s=await De(t,e,n,r,i);return"mfaPendingCredential"in s&&ee(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function di(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?Un(t.config,i):`${t.config.apiScheme}://${i}`;return co.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function uo(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class ho{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(re(this.auth,"network-request-failed")),lo.get())})}}function $t(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=re(t,e,r);return i.customData._tokenResponse=n,i}function cr(t){return t!==void 0&&t.enterprise!==void 0}class fo{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return uo(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function po(t,e){return De(t,"GET","/v2/recaptchaConfig",Ne(t,e))}/**
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
 */async function go(t,e){return De(t,"POST","/v1/accounts:delete",e)}async function zt(t,e){return De(t,"POST","/v1/accounts:lookup",e)}/**
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
 */function ut(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function mo(t,e=!1){const n=ye(t),r=await n.getIdToken(e),i=Fn(r);E(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:ut(fn(i.auth_time)),issuedAtTime:ut(fn(i.iat)),expirationTime:ut(fn(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function fn(t){return Number(t)*1e3}function Fn(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Dt("JWT malformed, contained fewer than 3 sections"),null;try{const i=qr(n);return i?JSON.parse(i):(Dt("Failed to decode base64 JWT payload"),null)}catch(i){return Dt("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function lr(t){const e=Fn(t);return E(e,"internal-error"),E(typeof e.exp<"u","internal-error"),E(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function mt(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Oe&&_o(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function _o({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
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
 */class bo{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Rn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=ut(this.lastLoginAt),this.creationTime=ut(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Gt(t){var h;const e=t.auth,n=await t.getIdToken(),r=await mt(t,zt(e,{idToken:n}));E(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?hi(i.providerUserInfo):[],a=yo(t.providerData,s),o=t.isAnonymous,c=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),l=o?c:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Rn(i.createdAt,i.lastLoginAt),isAnonymous:l};Object.assign(t,d)}async function wo(t){const e=ye(t);await Gt(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function yo(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function hi(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
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
 */async function vo(t,e){const n=await ui(t,{},async()=>{const r=wt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await di(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:o,body:r};return t.emulatorConfig&&Dn(t.emulatorConfig.host)&&(c.credentials="include"),li.fetch()(a,c)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Io(t,e){return De(t,"POST","/v2/accounts:revokeToken",Ne(t,e))}/**
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
 */class qe{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){E(e.idToken,"internal-error"),E(typeof e.idToken<"u","internal-error"),E(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):lr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){E(e.length!==0,"internal-error");const n=lr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(E(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await vo(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new qe;return r&&(E(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(E(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(E(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new qe,this.toJSON())}_performRefresh(){return fe("not implemented")}}/**
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
 */function Ee(t,e){E(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class te{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new bo(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Rn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await mt(this,this.stsTokenManager.getToken(this.auth,e));return E(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return mo(this,e)}reload(){return wo(this)}_assign(e){this!==e&&(E(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new te({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){E(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Gt(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(X(this.auth.app))return Promise.reject(ae(this.auth));const e=await this.getIdToken();return await mt(this,go(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,c=n._redirectEventId??void 0,l=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:g,isAnonymous:_,providerData:w,stsTokenManager:k}=n;E(h&&k,e,"internal-error");const m=qe.fromJSON(this.name,k);E(typeof h=="string",e,"internal-error"),Ee(r,e.name),Ee(i,e.name),E(typeof g=="boolean",e,"internal-error"),E(typeof _=="boolean",e,"internal-error"),Ee(s,e.name),Ee(a,e.name),Ee(o,e.name),Ee(c,e.name),Ee(l,e.name),Ee(d,e.name);const I=new te({uid:h,auth:e,email:i,emailVerified:g,displayName:r,isAnonymous:_,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:m,createdAt:l,lastLoginAt:d});return w&&Array.isArray(w)&&(I.providerData=w.map(T=>({...T}))),c&&(I._redirectEventId=c),I}static async _fromIdTokenResponse(e,n,r=!1){const i=new qe;i.updateFromServerResponse(n);const s=new te({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Gt(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];E(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?hi(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new qe;o.updateFromIdToken(r);const c=new te({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),l={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Rn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(c,l),c}}/**
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
 */const ur=new Map;function pe(t){be(t instanceof Function,"Expected a class definition");let e=ur.get(t);return e?(be(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,ur.set(t,e),e)}/**
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
 */class fi{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}fi.type="NONE";const dr=fi;/**
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
 */function xt(t,e,n){return`firebase:${t}:${e}:${n}`}class Je{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=xt(this.userKey,i.apiKey,s),this.fullPersistenceKey=xt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await zt(this.auth,{idToken:e}).catch(()=>{});return n?te._fromGetAccountInfoResponse(this.auth,n,e):null}return te._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new Je(pe(dr),e,r);const i=(await Promise.all(n.map(async l=>{if(await l._isAvailable())return l}))).filter(l=>l);let s=i[0]||pe(dr);const a=xt(r,e.config.apiKey,e.name);let o=null;for(const l of n)try{const d=await l._get(a);if(d){let h;if(typeof d=="string"){const g=await zt(e,{idToken:d}).catch(()=>{});if(!g)break;h=await te._fromGetAccountInfoResponse(e,g,d)}else h=te._fromJSON(e,d);l!==s&&(o=h),s=l;break}}catch{}const c=i.filter(l=>l._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new Je(s,e,r):(s=c[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async l=>{if(l!==s)try{await l._remove(a)}catch{}})),new Je(s,e,r))}}/**
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
 */function hr(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(_i(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(pi(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(wi(e))return"Blackberry";if(yi(e))return"Webos";if(gi(e))return"Safari";if((e.includes("chrome/")||mi(e))&&!e.includes("edge/"))return"Chrome";if(bi(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function pi(t=J()){return/firefox\//i.test(t)}function gi(t=J()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function mi(t=J()){return/crios\//i.test(t)}function _i(t=J()){return/iemobile/i.test(t)}function bi(t=J()){return/android/i.test(t)}function wi(t=J()){return/blackberry/i.test(t)}function yi(t=J()){return/webos/i.test(t)}function Bn(t=J()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Eo(t=J()){var e;return Bn(t)&&!!((e=window.navigator)!=null&&e.standalone)}function So(){return Ls()&&document.documentMode===10}function vi(t=J()){return Bn(t)||bi(t)||yi(t)||wi(t)||/windows phone/i.test(t)||_i(t)}/**
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
 */function Ii(t,e=[]){let n;switch(t){case"Browser":n=hr(J());break;case"Worker":n=`${hr(J())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${yt}/${r}`}/**
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
 */class ko{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const c=e(s);a(c)}catch(c){o(c)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function To(t,e={}){return De(t,"GET","/v2/passwordPolicy",Ne(t,e))}/**
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
 */const Co=6;class Ao{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??Co,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
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
 */class $o{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new fr(this),this.idTokenSubscription=new fr(this),this.beforeStateQueue=new ko(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ai,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=pe(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await Je.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await zt(this,{idToken:e}),r=await te._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(X(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,c=await this.tryRedirectSignIn(e);(!a||a===o)&&(c!=null&&c.user)&&(r=c.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return E(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Gt(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ao()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(X(this.app))return Promise.reject(ae(this));const n=e?ye(e):null;return n&&E(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&E(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return X(this.app)?Promise.reject(ae(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return X(this.app)?Promise.reject(ae(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(pe(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await To(this),n=new Ao(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new bt("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Io(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&pe(e)||this._popupRedirectResolver;E(n,this,"argument-error"),this.redirectPersistenceManager=await Je.create(this,[pe(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(E(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const c=e.addObserver(n,r,i);return()=>{a=!0,c()}}else{const c=e.addObserver(n);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return E(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ii(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(X(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&oi(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function ve(t){return ye(t)}class fr{constructor(e){this.auth=e,this.observer=null,this.addObserver=Hs(n=>this.observer=n)}get next(){return E(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Zt={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Ro(t){Zt=t}function Ei(t){return Zt.loadJS(t)}function Po(){return Zt.recaptchaEnterpriseScript}function Oo(){return Zt.gapiScript}function No(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class Do{constructor(){this.enterprise=new xo}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class xo{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
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
 */const Lo="recaptcha-enterprise",Si="NO_RECAPTCHA",pr="onFirebaseAuthREInstanceReady";class Se{constructor(e){this.type=Lo,this.auth=ve(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{po(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const l=new fo(c);return s.tenantId==null?s._agentRecaptchaConfig=l:s._tenantRecaptchaConfigs[s.tenantId]=l,a(l.siteKey)}}).catch(c=>{o(c)})})}function i(s,a,o){const c=window.grecaptcha;cr(c)?c.enterprise.ready(()=>{c.enterprise.execute(s,{action:e}).then(l=>{a(l)}).catch(()=>{a(Si)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Do().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&cr(window.grecaptcha)&&Se.scriptInjectionDeferred)await Se.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=Po();c.length!==0&&(c+=o+`&onload=${pr}`),Se.scriptInjectionDeferred=new Xr,window[pr]=()=>{var l;(l=Se.scriptInjectionDeferred)==null||l.resolve()},Ei(c).then(()=>{var l;return(l=Se.scriptInjectionDeferred)==null?void 0:l.promise}).then(()=>{i(o,s,a)}).catch(l=>{a(l)})}}).catch(o=>{a(o)})})}}Se.scriptInjectionDeferred=null;async function gr(t,e,n,r=!1,i=!1){const s=new Se(t);let a;if(i)a=Si;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const c=o.phoneEnrollmentInfo.phoneNumber,l=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:c,recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const c=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Pn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await gr(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await gr(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
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
 */function Mo(t,e){const n=ti(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(Xe(s,e??{}))return i;ee(i,"already-initialized")}return n.initialize({options:e})}function Uo(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(pe);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Fo(t,e,n){const r=ve(t);E(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=ki(e),{host:a,port:o}=Bo(e),c=o===null?"":`:${o}`,l={url:`${s}//${a}${c}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){E(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),E(Xe(l,r.config.emulator)&&Xe(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=l,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,Dn(a)?zs(`${s}//${a}${c}`):Vo()}function ki(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Bo(t){const e=ki(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:mr(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:mr(a)}}}function mr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Vo(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
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
 */class Vn{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return fe("not implemented")}_getIdTokenResponse(e){return fe("not implemented")}_linkToIdToken(e,n){return fe("not implemented")}_getReauthenticationResolver(e){return fe("not implemented")}}async function Ho(t,e){return De(t,"POST","/v1/accounts:signUp",e)}/**
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
 */async function Wo(t,e){return It(t,"POST","/v1/accounts:signInWithPassword",Ne(t,e))}/**
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
 */async function jo(t,e){return It(t,"POST","/v1/accounts:signInWithEmailLink",Ne(t,e))}async function zo(t,e){return It(t,"POST","/v1/accounts:signInWithEmailLink",Ne(t,e))}/**
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
 */class _t extends Vn{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new _t(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new _t(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Pn(e,n,"signInWithPassword",Wo);case"emailLink":return jo(e,{email:this._email,oobCode:this._password});default:ee(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Pn(e,r,"signUpPassword",Ho);case"emailLink":return zo(e,{idToken:n,email:this._email,oobCode:this._password});default:ee(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function Ye(t,e){return It(t,"POST","/v1/accounts:signInWithIdp",Ne(t,e))}/**
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
 */const Go="http://localhost";class Be extends Vn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Be(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):ee("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new Be(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return Ye(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Ye(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Ye(e,n)}buildRequest(){const e={requestUri:Go,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=wt(n)}return e}}/**
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
 */function Ko(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function qo(t){const e=it(st(t)).link,n=e?it(st(e)).deep_link_id:null,r=it(st(t)).deep_link_id;return(r?it(st(r)).link:null)||r||n||e||t}class Hn{constructor(e){const n=it(st(e)),r=n.apiKey??null,i=n.oobCode??null,s=Ko(n.mode??null);E(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=qo(e);try{return new Hn(n)}catch{return null}}}/**
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
 */class tt{constructor(){this.providerId=tt.PROVIDER_ID}static credential(e,n){return _t._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=Hn.parseLink(n);return E(r,"argument-error"),_t._fromEmailAndCode(e,r.code,r.tenantId)}}tt.PROVIDER_ID="password";tt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";tt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class en{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Et extends en{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class ke extends Et{constructor(){super("facebook.com")}static credential(e){return Be._fromParams({providerId:ke.PROVIDER_ID,signInMethod:ke.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ke.credentialFromTaggedObject(e)}static credentialFromError(e){return ke.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ke.credential(e.oauthAccessToken)}catch{return null}}}ke.FACEBOOK_SIGN_IN_METHOD="facebook.com";ke.PROVIDER_ID="facebook.com";/**
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
 */class de extends Et{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Be._fromParams({providerId:de.PROVIDER_ID,signInMethod:de.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return de.credentialFromTaggedObject(e)}static credentialFromError(e){return de.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return de.credential(n,r)}catch{return null}}}de.GOOGLE_SIGN_IN_METHOD="google.com";de.PROVIDER_ID="google.com";/**
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
 */class Te extends Et{constructor(){super("github.com")}static credential(e){return Be._fromParams({providerId:Te.PROVIDER_ID,signInMethod:Te.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Te.credentialFromTaggedObject(e)}static credentialFromError(e){return Te.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Te.credential(e.oauthAccessToken)}catch{return null}}}Te.GITHUB_SIGN_IN_METHOD="github.com";Te.PROVIDER_ID="github.com";/**
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
 */class Ce extends Et{constructor(){super("twitter.com")}static credential(e,n){return Be._fromParams({providerId:Ce.PROVIDER_ID,signInMethod:Ce.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Ce.credentialFromTaggedObject(e)}static credentialFromError(e){return Ce.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Ce.credential(n,r)}catch{return null}}}Ce.TWITTER_SIGN_IN_METHOD="twitter.com";Ce.PROVIDER_ID="twitter.com";/**
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
 */async function Jo(t,e){return It(t,"POST","/v1/accounts:signUp",Ne(t,e))}/**
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
 */class Ve{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await te._fromIdTokenResponse(e,r,i),a=_r(r);return new Ve({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=_r(r);return new Ve({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function _r(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
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
 */class Kt extends Oe{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Kt.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new Kt(e,n,r,i)}}function Ti(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Kt._fromErrorAndOperation(t,s,e,r):s})}async function Yo(t,e,n=!1){const r=await mt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Ve._forOperation(t,"link",r)}/**
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
 */async function Xo(t,e,n=!1){const{auth:r}=t;if(X(r.app))return Promise.reject(ae(r));const i="reauthenticate";try{const s=await mt(t,Ti(r,i,e,t),n);E(s.idToken,r,"internal-error");const a=Fn(s.idToken);E(a,r,"internal-error");const{sub:o}=a;return E(t.uid===o,r,"user-mismatch"),Ve._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&ee(r,"user-mismatch"),s}}/**
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
 */async function Ci(t,e,n=!1){if(X(t.app))return Promise.reject(ae(t));const r="signIn",i=await Ti(t,r,e),s=await Ve._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Qo(t,e){return Ci(ve(t),e)}/**
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
 */async function Ai(t){const e=ve(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Zo(t,e,n){if(X(t.app))return Promise.reject(ae(t));const r=ve(t),a=await Pn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Jo).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&Ai(t),c}),o=await Ve._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function ec(t,e,n){return X(t.app)?Promise.reject(ae(t)):Qo(ye(t),tt.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Ai(t),r})}function tc(t,e,n,r){return ye(t).onIdTokenChanged(e,n,r)}function nc(t,e,n){return ye(t).beforeAuthStateChanged(e,n)}function rc(t,e,n,r){return ye(t).onAuthStateChanged(e,n,r)}function ic(t){return ye(t).signOut()}const qt="__sak";/**
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
 */class $i{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(qt,"1"),this.storage.removeItem(qt),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const sc=1e3,ac=10;class Ri extends $i{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=vi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,c)=>{this.notifyListeners(a,c)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);So()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,ac):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},sc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ri.type="LOCAL";const oc=Ri;/**
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
 */class Pi extends $i{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Pi.type="SESSION";const Oi=Pi;/**
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
 */function cc(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class tn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new tn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async l=>l(n.origin,s)),c=await cc(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}tn.receivers=[];/**
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
 */function Wn(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class lc{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,c)=>{const l=Wn("",20);i.port1.start();const d=setTimeout(()=>{c(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const g=h;if(g.data.eventId===l)switch(g.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(g.data.response);break;default:clearTimeout(d),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:l,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function oe(){return window}function uc(t){oe().location.href=t}/**
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
 */function Ni(){return typeof oe().WorkerGlobalScope<"u"&&typeof oe().importScripts=="function"}async function dc(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function hc(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function fc(){return Ni()?self:null}/**
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
 */const Di="firebaseLocalStorageDb",pc=1,Jt="firebaseLocalStorage",xi="fbase_key";class St{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function nn(t,e){return t.transaction([Jt],e?"readwrite":"readonly").objectStore(Jt)}function gc(){const t=indexedDB.deleteDatabase(Di);return new St(t).toPromise()}function Li(){const t=indexedDB.open(Di,pc);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(Jt,{keyPath:xi})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(Jt)?e(r):(r.close(),await gc(),e(await Li()))})})}async function br(t,e,n){const r=nn(t,!0).put({[xi]:e,value:n});return new St(r).toPromise()}async function mc(t,e){const n=nn(t,!1).get(e),r=await new St(n).toPromise();return r===void 0?null:r.value}function wr(t,e){const n=nn(t,!0).delete(e);return new St(n).toPromise()}const _c=800,bc=3;class Mi{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=Li(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>bc)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Ni()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=tn._getInstance(fc()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await dc(),!this.activeServiceWorker)return;this.sender=new lc(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||hc()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await br(e,qt,"1"),await wr(e,qt)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>br(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>mc(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>wr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=nn(i,!1).getAll();return new St(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||oi(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),_c)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}Mi.type="LOCAL";const wc=Mi;new vt(3e4,6e4);/**
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
 */function jn(t,e){return e?pe(e):(E(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class zn extends Vn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ye(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Ye(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Ye(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function yc(t){return Ci(t.auth,new zn(t),t.bypassAuthState)}function vc(t){const{auth:e,user:n}=t;return E(n,e,"internal-error"),Xo(n,new zn(t),t.bypassAuthState)}async function Ic(t){const{auth:e,user:n}=t;return E(n,e,"internal-error"),Yo(n,new zn(t),t.bypassAuthState)}/**
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
 */class Ui{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(c))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return yc;case"linkViaPopup":case"linkViaRedirect":return Ic;case"reauthViaPopup":case"reauthViaRedirect":return vc;default:ee(this.auth,"internal-error")}}resolve(e){be(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){be(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Ec=new vt(2e3,1e4);async function Sc(t,e,n){if(X(t.app))return Promise.reject(re(t,"operation-not-supported-in-this-environment"));const r=ve(t);ci(t,e,en);const i=jn(r,n);return new Me(r,"signInViaPopup",e,i).executeNotNull()}class Me extends Ui{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Me.currentPopupAction&&Me.currentPopupAction.cancel(),Me.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return E(e,this.auth,"internal-error"),e}async onExecution(){be(this.filter.length===1,"Popup operations only handle one event");const e=Wn();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(re(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(re(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Me.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(re(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Ec.get())};e()}}Me.currentPopupAction=null;/**
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
 */const kc="pendingRedirect",Lt=new Map;class Tc extends Ui{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Lt.get(this.auth._key());if(!e){try{const r=await Cc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Lt.set(this.auth._key(),e)}return this.bypassAuthState||Lt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Cc(t,e){const n=Bi(e),r=Fi(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function Ac(t,e){return Fi(t)._set(Bi(e),"true")}function $c(t,e){Lt.set(t._key(),e)}function Fi(t){return pe(t._redirectPersistence)}function Bi(t){return xt(kc,t.config.apiKey,t.name)}/**
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
 */function Rc(t,e,n){return Pc(t,e,n)}async function Pc(t,e,n){if(X(t.app))return Promise.reject(ae(t));const r=ve(t);ci(t,e,en),await r._initializationPromise;const i=jn(r,n);return await Ac(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function Oc(t,e,n=!1){if(X(t.app))return Promise.reject(ae(t));const r=ve(t),i=jn(r,e),a=await new Tc(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
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
 */const Nc=600*1e3;class Dc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!xc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!Vi(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(re(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Nc&&this.cachedEventUids.clear(),this.cachedEventUids.has(yr(e))}saveEventToCache(e){this.cachedEventUids.add(yr(e)),this.lastProcessedEventTime=Date.now()}}function yr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Vi({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function xc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Vi(t);default:return!1}}/**
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
 */async function Lc(t,e={}){return De(t,"GET","/v1/projects",e)}/**
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
 */const Mc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Uc=/^https?/;async function Fc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Lc(t);for(const n of e)try{if(Bc(n))return}catch{}ee(t,"unauthorized-domain")}function Bc(t){const e=$n(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!Uc.test(n))return!1;if(Mc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const Vc=new vt(3e4,6e4);function vr(){const t=oe().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Hc(t){return new Promise((e,n)=>{var i,s,a;function r(){vr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{vr(),n(re(t,"network-request-failed"))},timeout:Vc.get()})}if((s=(i=oe().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=oe().gapi)!=null&&a.load)r();else{const o=No("iframefcb");return oe()[o]=()=>{gapi.load?r():n(re(t,"network-request-failed"))},Ei(`${Oo()}?onload=${o}`).catch(c=>n(c))}}).catch(e=>{throw Mt=null,e})}let Mt=null;function Wc(t){return Mt=Mt||Hc(t),Mt}/**
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
 */const jc=new vt(5e3,15e3),zc="__/auth/iframe",Gc="emulator/auth/iframe",Kc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},qc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Jc(t){const e=t.config;E(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Un(e,Gc):`https://${t.config.authDomain}/${zc}`,r={apiKey:e.apiKey,appName:t.name,v:yt},i=qc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${wt(r).slice(1)}`}async function Yc(t){const e=await Wc(t),n=oe().gapi;return E(n,t,"internal-error"),e.open({where:document.body,url:Jc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Kc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=re(t,"network-request-failed"),o=oe().setTimeout(()=>{s(a)},jc.get());function c(){oe().clearTimeout(o),i(r)}r.ping(c).then(c,()=>{s(a)})}))}/**
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
 */const Xc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Qc=500,Zc=600,el="_blank",tl="http://localhost";class Ir{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function nl(t,e,n,r=Qc,i=Zc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const c={...Xc,width:r.toString(),height:i.toString(),top:s,left:a},l=J().toLowerCase();n&&(o=mi(l)?el:n),pi(l)&&(e=e||tl,c.scrollbars="yes");const d=Object.entries(c).reduce((g,[_,w])=>`${g}${_}=${w},`,"");if(Eo(l)&&o!=="_self")return rl(e||"",o),new Ir(null);const h=window.open(e||"",o,d);E(h,t,"popup-blocked");try{h.focus()}catch{}return new Ir(h)}function rl(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const il="__/auth/handler",sl="emulator/auth/handler",al=encodeURIComponent("fac");async function Er(t,e,n,r,i,s){E(t.config.authDomain,t,"auth-domain-config-required"),E(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:yt,eventId:i};if(e instanceof en){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",Vs(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Et){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const c=await t._getAppCheckToken(),l=c?`#${al}=${encodeURIComponent(c)}`:"";return`${ol(t)}?${wt(o).slice(1)}${l}`}function ol({config:t}){return t.emulator?Un(t,sl):`https://${t.authDomain}/${il}`}/**
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
 */const pn="webStorageSupport";class cl{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Oi,this._completeRedirectFn=Oc,this._overrideRedirectResult=$c}async _openPopup(e,n,r,i){var a;be((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Er(e,n,r,$n(),i);return nl(e,s,Wn())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Er(e,n,r,$n(),i);return uc(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(be(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Yc(e),r=new Dc(e);return n.register("authEvent",i=>(E(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(pn,{type:pn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[pn];s!==void 0&&n(!!s),ee(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Fc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return vi()||gi()||Bn()}}const ll=cl;var Sr="@firebase/auth",kr="1.13.5";/**
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
 */class ul{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){E(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function dl(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function hl(t){pt(new Qe("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;E(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ii(t)},l=new $o(r,i,s,c);return Uo(l,n),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),pt(new Qe("auth-internal",e=>{const n=ve(e.getProvider("auth").getImmediate());return(r=>new ul(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ke(Sr,kr,dl(t)),Ke(Sr,kr,"esm2020")}/**
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
 */const fl=300,pl=Yr("authIdTokenMaxAge")||fl;let Tr=null;const gl=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>pl)return;const i=n==null?void 0:n.token;Tr!==i&&(Tr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function ml(t=ja()){const e=ti(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Mo(t,{popupRedirectResolver:ll,persistence:[wc,oc,Oi]}),r=Yr("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=gl(s.toString());nc(n,a,()=>a(n.currentUser)),tc(n,o=>a(o))}}const i=Ps("auth");return i&&Fo(n,`http://${i}`),n}function _l(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}Ro({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=re("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",_l().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});hl("Browser");const bl={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},ue=bl,Ze=!!ue.VITE_FIREBASE_APP_ID;let gn=null;function ze(){if(!Ze)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!gn){const t=ni({apiKey:ue.VITE_FIREBASE_API_KEY,authDomain:ue.VITE_FIREBASE_AUTH_DOMAIN,projectId:ue.VITE_FIREBASE_PROJECT_ID,appId:ue.VITE_FIREBASE_APP_ID,...ue.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:ue.VITE_FIREBASE_STORAGE_BUCKET},...ue.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:ue.VITE_FIREBASE_MESSAGING_SENDER_ID}});gn=ml(t)}return gn}function Cr(){return new de}async function Ar(){if(!Ze)return;const t=ze();t.currentUser&&await ic(t)}var wl=p(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),yl=p('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),vl=p("<button type=button class=gate-toggle>"),Il=p("<div class=gate-or>── or ──"),El=p("<button type=button class=btn>Continue with Google"),Sl=p("<div class=gate-error role=alert>"),kl=p("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),Tl=p("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),Cl=p("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const Al={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function $r(t){const e=(t==null?void 0:t.code)??"";return Al[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function $l(t){return(()=>{var e=wl(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,c=o.nextSibling;return u(a,()=>t.email),In(c,"click",t.onSignOut),e})()}function Rl(){const[t,e]=$("signin"),[n,r]=$(""),[i,s]=$(""),[a,o]=$(!1),[c,l]=$("");ms(async g=>{if(!Ze)return null;const _=ze().currentUser;return _?await _.getIdToken(g):null});async function d(g){if(g.preventDefault(),!a()){o(!0),l("");try{const _=ze();t()==="create"?await Zo(_,n(),i()):await ec(_,n(),i())}catch(_){l($r(_))}finally{o(!1)}}}async function h(){if(!a()){o(!0),l("");try{await Sc(ze(),Cr())}catch(g){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(g==null?void 0:g.code)){await Rc(ze(),Cr());return}l($r(g))}finally{o(!1)}}}return(()=>{var g=kl(),_=g.firstChild;return _.firstChild,u(_,f(v,{when:Ze,get fallback(){return[Tl(),Cl()]},get children(){return[(()=>{var w=yl(),k=w.firstChild,m=k.firstChild,I=m.nextSibling,T=k.nextSibling,O=T.firstChild,P=O.nextSibling,y=T.nextSibling;return w.addEventListener("submit",d),I.$$input=C=>r(C.currentTarget.value),P.$$input=C=>s(C.currentTarget.value),u(y,(()=>{var C=q(()=>!!a());return()=>C()?"Working…":t()==="create"?"Create account":"Sign in"})()),R(C=>{var L=t()==="create"?"new-password":"current-password",x=a();return L!==C.e&&Z(P,"autocomplete",C.e=L),x!==C.t&&(y.disabled=C.t=x),C},{e:void 0,t:void 0}),R(()=>I.value=n()),R(()=>P.value=i()),w})(),(()=>{var w=vl();return w.$$click=()=>{l(""),e(t()==="create"?"signin":"create")},u(w,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),R(()=>w.disabled=a()),w})(),Il(),(()=>{var w=El();return w.$$click=h,R(()=>w.disabled=a()),w})(),f(v,{get when(){return c()},get children(){var w=Sl();return u(w,c),w}})]}}),null),g})()}ce(["click","input"]);var Pl=p("<div class=gate-error role=alert>"),Ol=p("<p class=gate-note>No grant-file entries yet."),Nl=p("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),Dl=p('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),xl=p("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function Ll(t){const[e,n]=$([]),[r,i]=$([]),[s,a]=$(""),[o,c]=$(!1),[l,d]=$(""),h=m=>{n((m==null?void 0:m.file_grants)??[]),i((m==null?void 0:m.static_emails)??[])};ht(async()=>{try{h(await bs())}catch{d("Could not load the grant list.")}});const _=m=>{m.key==="Escape"&&t.onClose()};ht(()=>{window.addEventListener("keydown",_),Re(()=>window.removeEventListener("keydown",_));const m=document.querySelector(".access-add input");m==null||m.focus()});const w=async m=>{if(m.preventDefault(),!(o()||!s().trim())){c(!0),d("");try{h(await ws(s())),a("")}catch(I){d(I.message)}c(!1)}},k=async m=>{if(!o()){c(!0),d("");try{h(await ys(m))}catch(I){d(I.message)}c(!1)}};return(()=>{var m=Dl(),I=m.firstChild,T=I.firstChild,O=T.nextSibling,P=O.nextSibling,y=P.firstChild,C=y.nextSibling,L=P.nextSibling;return In(m,"click",t.onClose),I.$$click=x=>x.stopPropagation(),u(I,f(v,{get when(){return l()},get children(){var x=Pl();return u(x,l),x}}),P),u(I,f(ne,{get each(){return e()},children:x=>(()=>{var N=xl(),D=N.firstChild,H=D.nextSibling;return u(D,x),H.$$click=()=>k(x),Z(H,"title",`Remove ${x}`),Z(H,"aria-label",`Remove ${x}`),R(()=>H.disabled=o()),N})()}),P),u(I,f(v,{get when(){return e().length===0},get children(){return Ol()}}),P),P.addEventListener("submit",w),y.$$input=x=>a(x.currentTarget.value),u(C,()=>o()?"…":"Add"),u(I,f(v,{get when(){return r().length>0},get children(){var x=Nl();return x.firstChild,u(x,()=>r().join(", "),null),x}}),L),In(L,"click",t.onClose),R(()=>C.disabled=o()),R(()=>y.value=s()),m})()}ce(["click","input"]);const ge=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),dt=(t,e,n)=>Math.min(n,Math.max(e,t));function Ml(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:dt((n-t)/r,0,1)}function Ul(t,e,n,r,i=ge){if(n<i.minRateOfReturn||t<=0)return null;const s=dt(t/2,0,1),a=dt(e,0,1),o=Math.min(n/i.idealReturn,1),c=dt((r-i.trendScoreFloor)/i.trendScoreBand,0,1),l={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*c};return l.total=l.sharpe+l.safety+l.return+l.trend,l}function Fl(t,e=ge){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?dt(1+t.delta,0,1):Ml(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),Ul(r,a,n,i,e)}function Bl(t,e=ge.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function Vl(t){return t.weightSharpe===ge.weightSharpe&&t.weightSafety===ge.weightSafety&&t.weightReturn===ge.weightReturn&&t.minRateOfReturn===ge.minRateOfReturn}var Hl=p("<span class=hint>production defaults · drag to re-rank live"),Wl=p("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),jl=p('<span class="hint hint-custom">custom weights'),zl=p("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function Gl(){const[t,e]=$({...ge});return{params:t,isCustom:()=>!Vl(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...ge})}}const Kl=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function ql(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=Wl(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(v,{get when(){return!e()},get fallback(){return jl()},get children(){return Hl()}}),null),u(s,f(ne,{each:Kl,children:o=>(()=>{var c=zl(),l=c.firstChild,d=l.firstChild,h=d.nextSibling,g=l.nextSibling;return u(l,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(v,{get when(){return o.weight},get children(){return[" ","· ",q(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),g.$$input=_=>t.scoring.setParam(o.key,Number(_.currentTarget.value)),R(_=>{var w=o.max,k=o.step;return w!==_.e&&Z(g,"max",_.e=w),k!==_.t&&Z(g,"step",_.t=k),_},{e:void 0,t:void 0}),R(()=>g.value=t.scoring.params()[o.key]),c})()}),a),a.$$click=()=>t.scoring.reset(),R(()=>r.open=e()),r})()}ce(["click","input"]);const rn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],at=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],Hi="webapp.columns.v1";function Jl(){try{const t=localStorage.getItem(Hi);if(!t)return at;const e=JSON.parse(t);if(!Array.isArray(e))return at;const n=new Set(rn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:at}catch{return at}}function Yl(t){try{localStorage.setItem(Hi,JSON.stringify(t))}catch{}}var Xl=p("<div class=pop-backdrop>"),Ql=p('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Zl=p("<span class=colpicker><button type=button class=tool-btn>columns ▾"),eu=p("<label class=pick-item><input type=checkbox>");function tu(t){const[e,n]=$(!1);return(()=>{var r=Zl(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(v,{get when(){return e()},get children(){return[(()=>{var s=Xl();return s.$$click=()=>n(!1),s})(),(()=>{var s=Ql(),a=s.firstChild,o=a.nextSibling;return u(a,f(ne,{each:rn,children:c=>(()=>{var l=eu(),d=l.firstChild;return d.addEventListener("change",h=>t.store.toggle(c.id,h.currentTarget.checked)),u(l,()=>c.label,null),R(()=>d.checked=t.store.isOn(c.id)),l})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),R(()=>Z(i,"aria-expanded",e())),r})()}ce(["click"]);var nu=p('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),ru=p("<span class=pggap>…"),iu=p("<button type=button class=pgbtn>");function su(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(c,l)=>l+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(c=>c>=1&&c<=n).sort((c,l)=>c-l),a=[];let o=0;for(const c of s)c-o>1&&a.push("…"),a.push(c),o=c;return a}function au(t){const e=K(()=>su(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=nu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var c=s.nextSibling,l=c.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),c.$$click=n,u(i,f(ne,{get each(){return e()},children:d=>d==="…"?ru():(()=>{var h=iu();return h.$$click=()=>t.onGo(d),u(h,d),R(()=>h.classList.toggle("active",d===t.page())),h})()}),l),l.$$click=r,R(d=>{var h=t.page()<=1,g=t.page()>=t.pageCount();return h!==d.e&&(c.disabled=d.e=h),g!==d.t&&(l.disabled=d.t=g),d},{e:void 0,t:void 0}),i})()}ce(["click"]);var ou=p("<span class=tip>");function nt(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=ou();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?ps(i,r):e=r,u(r,()=>t.children),R(()=>Z(r,"data-tip",t.text??"")),r})()}ce(["focusin"]);const Fe="∅";function W(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function ot(t){return Number(t??0).toLocaleString("en-US")}function Yt(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function Wi(t){return ji(t,{hour:"2-digit",minute:"2-digit"})}function cu(t){return ji(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function ji(t,e){const n=Yt(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const zi={text:Fe,isNull:!0},mn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Rr(t,e){return!e||W(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function lu(t,e){return!e||W(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function uu(t){if(!t||typeof t!="object"||W(t.report_date))return zi;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function Q(t,e){if(W(e))return zi;switch(t){case"fixed2":return mn(e,2);case"fixed3":return mn(e,3);case"ivrv":return mn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return uu(e);default:return{text:String(e),isNull:!1}}}const Pr=t=>Number(t*100).toFixed(0);function du(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Pr(e.momentum_high),s=Pr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function rt(t,e){return du(e)[t]??t}var Gi=p("<span class=tip-target>"),hu=p("<div class=kv><span class=kv-label></span><span class=kv-value>"),fu=p("<span class=tip-target>Strike position in band"),pu=p('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),gu=p("<div class=exp-block><h4>"),mu=p("<div class=kv-value>Band unavailable (∅)"),_u=p("<div><span class=marker-tick></span><span class=marker-cap><br>"),bu=p("<div class=exp-block><h4>Premium economics"),wu=p("<b>"),yu=p('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),vu=p("<div class=muted-note>earnings-discounted safety applied"),Iu=p("<div class=exp-block><h4>Score breakdown"),Eu=p("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),Su=p('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),ku=p("<span class=muted-note>all columns visible"),Tu=p('<div class="exp-block exp-chips"><h4>Hidden columns'),Cu=p("<span class=tip-target>: "),Au=p("<span>"),$u=p("<span class=tip-target>band safety is already discounted by the earnings rule."),Ru=p("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),Pu=p("<div class=expansion><div class=exp-grid>");const _n={sharpe:.2,safety:.4,return_part:.4};function bn(t,e=2){return W(t)?Fe:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function se(t,e,n){return(()=>{var r=hu(),i=r.firstChild,s=i.nextSibling;return u(i,f(nt,{get text(){return rt(t,e)},get children(){var a=Gi();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function Ou(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=W(e.mid)?null:e.strike-e.mid,s=i!=null&&!W(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,c=Math.max(o,a),l=!W(a)&&c>a&&!W(e.strike),d=g=>{if(W(g))return null;const _=(g-a)/(c-a)*100;return Math.min(100,Math.max(0,_))},h=l?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(g=>d(g.v)!=null):[];return(()=>{var g=gu(),_=g.firstChild;return u(_,f(nt,{get text(){return rt("band_range",t.thresholds)},get children(){return fu()}})),u(g,f(v,{when:l,get fallback(){return mu()},get children(){var w=pu(),k=w.firstChild;return u(w,f(ne,{each:h,children:m=>(()=>{var I=_u(),T=I.firstChild,O=T.nextSibling,P=O.firstChild;return u(O,()=>m.label,P),u(O,()=>Q("fixed2",m.v).text,null),R(y=>{var C=`marker ${m.cls}`,L=`${d(m.v)}%`;return C!==y.e&&Ae(I,y.e=C),L!==y.t&&lt(I,"left",y.t=L),y},{e:void 0,t:void 0}),I})()}),null),R(m=>{var I=`${d(e.strike_from)}%`,T=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return I!==m.e&&lt(k,"left",m.e=I),T!==m.t&&lt(k,"width",m.t=T),m},{e:void 0,t:void 0}),w}}),null),u(g,()=>se("band_range",t.thresholds,`${Q("fixed2",e.strike_from).text} → ${Q("fixed2",e.strike_to).text}`),null),u(g,()=>se("band_depth",t.thresholds,r==null?Fe:`${(r*100).toFixed(1)}%`),null),u(g,()=>se("cushion_be",t.thresholds,s==null?Fe:`${s.toFixed(1)}%`),null),g})()}function Nu(t){const e=t.row,n=W(e.strike)?null:e.strike*100,r=W(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=Q("pct1",e.rate_of_return);return(()=>{var a=bu();return a.firstChild,u(a,()=>se("capital",t.thresholds,n==null?Fe:bn(n,0)),null),u(a,()=>se("premium",t.thresholds,r==null?Fe:bn(r)),null),u(a,()=>se("breakeven",t.thresholds,i==null?Fe:bn(i)),null),u(a,()=>se("ann_ror",t.thresholds,(()=>{var o=wu();return u(o,()=>s.text),o})()),null),u(a,()=>se("bid",t.thresholds,Q("fixed2",e.bid).text),null),u(a,()=>se("ask",t.thresholds,Q("fixed2",e.ask).text),null),u(a,()=>se("expiration",t.thresholds,e.expiration),null),a})()}function Du(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:_n.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:_n.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:_n.return_part,v:n==null?void 0:n.return}];return(()=>{var i=Iu();return i.firstChild,u(i,f(v,{when:n,get fallback(){return(()=>{var s=Eu(),a=s.firstChild,o=a.nextSibling,c=o.firstChild;return u(c,()=>Q("fixed3",e.score).text),s})()},get children(){return[f(ne,{each:r,children:s=>{const a=W(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=Su(),c=o.firstChild,l=c.firstChild,d=l.nextSibling,h=d.firstChild,g=h.nextSibling;g.nextSibling;var _=c.nextSibling,w=_.firstChild,k=_.nextSibling;return u(c,f(nt,{get text(){return rt(s.key,t.thresholds)},get children(){var m=Gi();return u(m,()=>s.label),m}}),l),u(d,()=>s.weight*100,g),u(k,()=>Q("fixed3",s.v).text),R(m=>lt(w,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=yu(),a=s.firstChild,o=a.nextSibling,c=o.firstChild;return u(c,()=>Q("fixed3",e.score).text),s})(),f(v,{get when(){return e.earnings_before_expiry},get children(){return vu()}})]}}),null),i})()}function xu(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:Q(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=Tu();return n.firstChild,u(n,f(ne,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=Au();return u(s,f(nt,{get text(){return rt(r.id,t.thresholds)},get children(){var a=Cu(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),R(()=>Ae(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(v,{get when(){return t.hiddenDefs.length===0},get children(){return ku()}}),null),n})()}function Lu(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=Pu(),i=r.firstChild;return u(r,f(v,{when:n,get children(){var s=Ru(),a=s.firstChild,o=a.nextSibling,c=o.nextSibling,l=c.nextSibling,d=l.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(v,{get when(){return n.report_time},children:g=>g().replaceAll("_"," ")}),l),u(s,f(v,{get when(){return!W(n.expected_eps)},get children(){return[" ","· expected EPS ",q(()=>Q("fixed2",n.expected_eps).text)]}}),h),u(s,f(nt,{get text(){return rt("earnings_before_expiry",t.thresholds)},get children(){return $u()}}),null),s}}),i),u(i,f(Ou,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(Nu,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(Du,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(xu,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var Mu=p("<span class=null-mark>"),Uu=p("<span class=star>★"),Fu=p("<td><b>"),wn=p("<span>"),Or=p("<td class=num>"),Bu=p("<span class=score-frozen>prod "),Vu=p('<td class="num score-cell">'),Hu=p('<span class="score-frozen readmit">re-admitted'),Wu=p("<td>"),ju=p("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),zu=p("<span class=sort-arrow>"),Gu=p("<span class=tip-target>"),Ku=p("<th role=button tabindex=0>"),qu=p("<tr class=expandable><td class=exp-col>"),Ju=p("<tr class=exp-row><td>");const Yu=t=>`${t.underlying}|${t.strike}`;function Xu(t){return(()=>{var e=Mu();return u(e,()=>t.text),e})()}function Rt(t){const e=Q(t.kind,t.value);return f(v,{get when(){return!e.isNull},get fallback(){return f(Xu,{get text(){return e.text}})},get children(){return e.text}})}function Qu(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=Fu(),i=r.firstChild;return u(r,f(v,{get when(){return t.pickRank!=null},get children(){var s=Uu();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(v,{get when(){return Rr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=wn();return R(()=>Ae(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Or();return u(r,f(v,{get when(){return Rr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=wn();return R(()=>Ae(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(Rt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=Vu();return u(r,f(Rt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(v,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(v,{get when(){return!W(n.frozen_score)},get fallback(){return f(v,{get when(){return!W(n.score)},get children(){return Hu()}})},get children(){var i=Bu();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=Or();return u(r,f(Rt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(v,{get when(){return lu(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=wn();return u(s,i),R(()=>Ae(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=Wu();return u(r,f(Rt,{get kind(){return e.kind},get value(){return n[e.id]}})),R(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Zu(t){const e=K(()=>rn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=ju(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(ne,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var c=Ku();return c.$$keydown=l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),t.onSort(a.id))},c.$$click=()=>t.onSort(a.id),u(c,f(nt,{get text(){return rt(a.id,t.thresholds)},get children(){var l=Gu();return u(l,()=>a.label,null),u(l,f(v,{get when(){return o()},get children(){return[" ",(()=>{var d=zu();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),l}})),R(l=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==l.e&&c.classList.toggle("num",l.e=d),h!==l.t&&Z(c,"aria-sort",l.t=h),l},{e:void 0,t:void 0}),c})()}}),null),u(s,f(ne,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),c=()=>Yu(a),l=()=>t.openKey()!=null&&t.openKey()===c();return[(()=>{var d=qu(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>l()?"▾":"▸"),u(d,f(ne,{get each(){return e()},children:g=>f(Qu,{col:g,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),R(g=>{var _=o()!=null,w=!!W(a.score),k=!!l();return _!==g.e&&d.classList.toggle("pick",g.e=_),w!==g.t&&d.classList.toggle("prow",g.t=w),k!==g.a&&d.classList.toggle("open",g.a=k),g},{e:void 0,t:void 0,a:void 0}),d})(),f(v,{get when(){return l()},get children(){var d=Ju(),h=d.firstChild;return u(h,f(Lu,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),R(()=>Z(h,"colspan",e().length+1)),d}})]}})),n})()}ce(["click","keydown"]);function ed(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const Ge=t=>W(t);function td(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],c=Ge(a),l=Ge(o);return c||l?c&&l?0:c?1:-1:r*ed(a,o)})}function nd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=Ge(r),a=Ge(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const c=e.rate_of_return,l=n.rate_of_return,d=Ge(c),h=Ge(l);return d||h?d&&h?0:d?1:-1:l-c})}var rd=p("<div class=stage-badges>"),id=p("<pre class=errbox>"),sd=p("<details><summary> "),ad=p("<div class=scroll-region>"),od=p('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),cd=p("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),ld=p("<div class=empty-panel>No rows match the current filter."),ud=p('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const yn=100,dd=150,Nr={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function hd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=rd();return u(i,f(ne,{get each(){return t.stages??[]},children:s=>(()=>{var a=sd(),o=a.firstChild,c=o.firstChild;return u(o,()=>n(s.status),c),u(o,()=>r(s.name),null),u(a,f(v,{get when(){return s.error},get children(){var l=id();return u(l,()=>s.error),l}}),null),R(()=>Ae(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function Dr(t){const[e,n]=$(""),[r,i]=$(""),[s,a]=$(!0),[o,c]=$(null),[l,d]=$("asc"),[h,g]=$(1);let _;Re(()=>clearTimeout(_));const w=()=>{var b;return((b=t.tf)==null?void 0:b.rows)??[]},k=K(()=>{const b=t.scoring.params(),A=t.scoring.isCustom();return w().map(B=>{const U=Fl(B,b);return{...B,frozen_score:B.score,live_parts:U,score:A?U==null?null:U.total:B.score}})}),m=K(()=>k().filter(b=>!W(b.score)&&W(b.frozen_score)).length),I=b=>{const A=b.currentTarget.value;n(A),clearTimeout(_),_=setTimeout(()=>{i(A.trim().toLowerCase()),g(1)},dd)},T=b=>{a(b),g(1)},O=b=>{o()!==b?(c(b),d("asc")):l()==="asc"?d("desc"):(c(null),d("asc")),g(1)},[P,y]=$(null),C=b=>{const A=`${b.underlying}|${b.strike}`;y(B=>B===A?null:A)};Ue(ct([o,l,h,r,s],()=>y(null))),Ue(ct(t.active,()=>y(null))),Ue(ct(t.columns.visible,()=>g(1)));const L=()=>rn.filter(b=>!t.columns.visible().includes(b.id)),x=()=>(t.stages??[]).find(b=>b.name===Nr[t.id].id),N=K(()=>{const b=r();return b?k().filter(A=>{const B=A.underlying,U=A.sector;return B!=null&&String(B).toLowerCase().includes(b)||U!=null&&String(U).toLowerCase().includes(b)}):k()}),D=K(()=>{const b=N();return s()?b.filter(A=>!W(A.score)):b}),H=K(()=>o()?td(D(),o(),l()):nd(D())),j=K(()=>Math.max(1,Math.ceil(H().length/yn))),le=()=>Math.min(h(),j()),kt=()=>{const b=le();return H().slice((b-1)*yn,b*yn)},Gn=K(()=>{var A;const b=new Map;if(t.scoring.isCustom()){const B=Bl(k().map(U=>({row:U,score:U.score})));for(const U of B)b.set(`${U.row.underlying}|${U.row.strike}`,b.size+1)}else for(const B of((A=t.tf)==null?void 0:A.top_picks)??[])b.set(`${B.underlying}|${B.strike}`,B.rank??"?");return b}),S=b=>Gn().get(`${b.underlying}|${b.strike}`);return(()=>{var b=od(),A=b.firstChild,B=A.firstChild,U=B.nextSibling,Ie=U.firstChild,z=U.nextSibling,sn=z.firstChild,Kn=sn.nextSibling;return Kn.nextSibling,u(b,f(hd,{get stages(){return t.stages}}),A),B.$$input=I,Ie.addEventListener("change",Y=>T(Y.currentTarget.checked)),u(A,f(tu,{get store(){return t.columns}}),z),u(z,()=>ot(H().length),sn),u(z,()=>ot(w().length),Kn),u(z,f(v,{get when(){return q(()=>!!t.scoring.isCustom())()&&m()>0},get children(){return[" ","· ",q(()=>ot(m()))," re-admitted by lower floor"]}}),null),u(b,f(v,{get when(){return kt().length>0},get children(){var Y=ad();return u(Y,f(Zu,{get visibleCols(){return t.columns.visible},rows:kt,sortKey:o,sortDir:l,onSort:O,get thresholds(){return t.thresholds},pickRankOf:S,openKey:P,onToggleRow:C,hiddenDefs:L,get customScores(){return t.scoring.isCustom}})),Y}}),null),u(b,f(v,{get when(){return kt().length===0},get children(){return f(v,{get when(){var Y,xe;return((Y=x())==null?void 0:Y.status)==="failed"||((xe=x())==null?void 0:xe.status)==="partial"},get fallback(){return f(v,{get when(){return q(()=>!!s())()&&N().length>0},get fallback(){return ld()},get children(){var Y=cd(),xe=Y.firstChild,We=xe.nextSibling,Tt=We.nextSibling,Ct=Tt.nextSibling,At=Ct.nextSibling;return At.nextSibling,u(Y,()=>ot(N().length),At),Y}})},children:Y=>(()=>{var xe=ud(),We=xe.firstChild,Tt=We.firstChild,Ct=Tt.nextSibling;Ct.nextSibling;var At=We.nextSibling;return u(We,()=>Y().status==="partial"?"△":"✗",Tt),u(We,()=>Nr[t.id].label,Ct),u(At,()=>Y().error??"stage produced no data"),xe})()})}}),null),u(b,f(v,{get when(){return H().length>0},get children(){return f(au,{page:le,pageCount:j,onGo:g})}}),null),R(()=>b.hidden=!t.active()),R(()=>B.value=e()),R(()=>Ie.checked=s()),b})()}ce(["input"]);async function fd(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const c=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!c.startsWith("data:"))continue;const l=c.slice(5).trim();if(l)try{e(JSON.parse(l))}catch{}}}return"completed"}catch{return"lost"}}var pd=p("<button type=button class=run-btn>"),gd=p("<span class=run-count>/"),md=p("<span class=run-bar><span class=fill>"),_d=p("<li><span class=mark></span><span class=label>"),bd=p("<div class=toast-cached>Served from cache — last run <!> min old"),wd=p('<div class="toast-cached warn">'),yd=p("<div class=run-headline>"),vd=p("<ul class=run-stages>"),Id=p("<details class=run-errors><summary>details</summary><ul>"),Ed=p("<div class=run-warn>Closing this tab stops the run."),Sd=p("<div class=run-warn>Re-checking every 15 s…"),kd=p("<div class=run-strip>"),Td=p("<li> ");const Ki=["quotes","metrics","chains_short","chains_medium"],qi={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},Cd=15e3,Ji=t=>t!==null&&Date.now()>=t;function xr(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function Ad(t){const[e,n]=$("idle"),[r,i]=$(P()),[s,a]=$(null),[o,c]=$(0),[l,d]=$(null),[h,g]=$(null),[_,w]=$("");let k=null,m=null;const[I,T]=$(0);let O=null;Ue(()=>{const S=t();if(O&&(clearTimeout(O),O=null),(S==null?void 0:S.run_allowed)===!1){const b=Yt(S.next_open_utc);b!==null&&(O=setTimeout(()=>T(A=>A+1),Math.max(0,b-Date.now())))}});function P(){return Object.fromEntries(Ki.map(S=>[S,{status:"pending",error:null}]))}function y(){k&&clearInterval(k),k=null,m&&clearInterval(m),m=null}function C(){c(0),k=setInterval(()=>c(S=>S+1),1e3)}function L(S){switch(S.type){case"stage_started":i(b=>({...b,[S.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:S.stage,done:S.done,total:S.total});break;case"stage_finished":i(b=>({...b,[S.stage]:{status:S.ok?"ok":"failed",error:S.error??null}}));break;case"run_finished":d(S);break}}function x(){y();const S=l(),b=((S==null?void 0:S.stages)??[]).some(A=>A.name.startsWith("chains")&&["ok","partial"].includes(A.status));n(S&&(b||S.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function N(S){let b=!1;return await fd(S,A=>{L(A),A.type==="run_finished"&&(b=!0)}),b?(x(),!0):!1}async function D(S){n("detached"),m=setInterval(async()=>{var b,A,B;try{const U=await jr(),Ie=((A=(b=U==null?void 0:U.result)==null?void 0:b.run)==null?void 0:A.finished_at_utc)??null;if(Ie&&Ie!==S){i(H(U.result)),y(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((B=U==null?void 0:U.run_state)==null?void 0:B.status)!=="running"&&(y(),n("idle"),w("Stream lost and the run was canceled — press Run to retry."))}catch{}},Cd)}function H(S){const b=P();for(const A of(S==null?void 0:S.stages)??[])b[A.name]&&(b[A.name]={status:A.status,error:A.error});return b}async function j(){var B,U,Ie;if(["starting","running","detached"].includes(e()))return;w(""),d(null),a(null),i(P()),g(null);const S=((Ie=(U=(B=t())==null?void 0:B.result)==null?void 0:U.run)==null?void 0:Ie.finished_at_utc)??null;n("running"),C();let b;try{b=await vs()}catch{y(),n("idle"),w("Run failed to start — network or server unreachable.");return}const A=b.headers.get("content-type")??"";if(b.ok&&A.includes("application/json")){const z=await b.json().catch(()=>null);if(y(),n("idle"),(z==null?void 0:z.status)==="cached"){g(z.age_secs),setTimeout(()=>g(null),6e3);return}}if(b.status===403&&A.includes("application/json")){const z=await b.json().catch(()=>null);y(),n("idle"),w(z!=null&&z.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(z.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(b.status===202){const z=await Is();if(z.ok&&(z.headers.get("content-type")??"").includes("text/event-stream")){await N(z)||await D(S);return}await D(S);return}if(A.includes("text/event-stream")){await N(b)||await D(S);return}y(),n("idle"),w(`Unexpected /api/run response (${b.status}, ${A||"no type"}).`)}return Re(()=>{y(),O&&clearTimeout(O)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:l,cachedToast:h,notice:_,triggerRun:j,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{I();const S=t();return(S==null?void 0:S.run_allowed)!==!1?!0:Ji(Yt(S==null?void 0:S.next_open_utc))},nextOpenUtc:()=>{var S;return((S=t())==null?void 0:S.next_open_utc)??null}}}function $d(t){const e=()=>!t.run.runAllowed(),n=()=>Wi(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=pd();return i.$$click=()=>t.run.triggerRun(),u(i,r),R(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&Z(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function Rd(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=_d(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>qi[t.name]),u(i,f(v,{get when(){return r()!==null},get children(){return[(()=>{var o=gd(),c=o.firstChild;return u(o,()=>t.run.batch().done,c),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=md(),c=o.firstChild;return R(l=>lt(c,"width",`${r()}%`)),o})()]}}),null),R(()=>Ae(i,`run-stage ${e()}`)),i})()}function Pd(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",q(()=>xr(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",q(()=>xr(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(v,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=kd();return u(i,f(v,{get when(){return e.cachedToast()},get children(){var s=bd(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(v,{get when(){return e.notice()},get children(){var s=wd();return u(s,()=>e.notice()),s}}),null),u(i,f(v,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=yd();return u(s,r),s})(),(()=>{var s=vd();return u(s,()=>Ki.map(a=>f(Rd,{name:a,run:e}))),s})(),f(v,{get when(){return q(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=Id(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(c=>c.status!=="ok").map(c=>(()=>{var l=Td(),d=l.firstChild;return u(l,()=>c.status==="partial"?"△":"✗",d),u(l,()=>qi[c.name]??c.name,null),u(l,(()=>{var h=q(()=>!!c.error);return()=>h()?`: ${c.error}`:""})(),null),l})())),s}})]}}),null),u(i,f(v,{get when(){return q(()=>e.phase()==="running")()&&!n()},get children(){return Ed()}}),null),u(i,f(v,{get when(){return e.phase()==="detached"},get children(){return Sd()}}),null),i}})}ce(["click"]);var Yi=p("<b>"),Od=p("<span>Market closed · last run <b></b> ago"),Nd=p("<div class=cache-line><span></span><span class=pill>run: "),Dd=p("<span>Cached · <b></b> left"),xd=p("<span>Stale · last run <b></b> ago"),Ld=p("<nav class=tabs role=tablist aria-label=timeframes>"),Md=p("<button type=button role=tab class=tab> (<!>)"),Ud=p('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),Fd=p("<div class=pop-backdrop>"),Bd=p("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),Vd=p("<div class=error-banner>API error: "),Hd=p("<div class=shell><header><div class=user-box></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),Wd=p("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function jd(){const[t,e]=$(Jl()),n=r=>{e(r),Yl(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(at)}}function Lr(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function zd(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function Mr(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function vn(t){return f(v,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=Yi();return u(e,()=>t.at()),e})()]}})}function Gd(t){const[e,n]=$(0);ht(()=>{const _=setInterval(()=>n(w=>w+1),3e4);Re(()=>clearInterval(_))});let r=Date.now(),i=0;Ue(ct(()=>t.envelope,_=>{r=Date.now(),i=(_==null?void 0:_.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,c=()=>{const _=Math.max(0,(t.envelope.cache_secs??0)-s());return _>=60?`${Math.floor(_/60)}m`:`${_}s`},l=()=>{var _,w;return cu((w=(_=t.envelope.result)==null?void 0:_.run)==null?void 0:w.finished_at_utc)},d=()=>{e();const _=t.envelope.next_open_utc,w=Yt(_);if(!(w===null||Ji(w)))return Wi(_)},h=()=>o()&&a()==="stale"?"closed":a(),g=()=>a()==="fresh"||a()==="stale";return(()=>{var _=Nd(),w=_.firstChild,k=w.nextSibling;return k.firstChild,u(_,f(v,{get when(){return q(()=>!!o())()&&g()},get fallback(){return f(v,{get when(){return a()==="fresh"},get fallback(){return f(v,{get when(){return a()==="stale"},get children(){var m=xd(),I=m.firstChild,T=I.nextSibling;return T.nextSibling,u(T,()=>Mr(s())),u(m,f(vn,{at:l}),null),m}})},get children(){var m=Dd(),I=m.firstChild,T=I.nextSibling;return T.nextSibling,u(T,c),u(m,f(vn,{at:l}),null),m}})},get children(){var m=Od(),I=m.firstChild,T=I.nextSibling;return T.nextSibling,u(T,()=>Mr(s())),u(m,f(vn,{at:l}),null),u(m,f(v,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var O=Yi();return u(O,d),O})()]}}),null),m}}),w),u(w,(()=>{var m=q(()=>h()==="closed");return()=>m()?"market closed":a()})()),u(k,()=>{var m;return((m=t.envelope.run_state)==null?void 0:m.status)??"idle"},null),R(()=>Ae(w,"pill "+h())),_})()}function Kd(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"}];return(()=>{var n=Ld();return u(n,()=>e.map(r=>(()=>{var i=Md(),s=i.firstChild,a=s.nextSibling;return a.nextSibling,i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,s),u(i,()=>ot(zd(t.result,r.id)),a),R(o=>{var c=t.tab()===r.id,l=t.tab()===r.id;return c!==o.e&&Z(i,"aria-selected",o.e=c),l!==o.t&&i.classList.toggle("active",o.t=l),o},{e:void 0,t:void 0}),i})())),n})()}function qd(){const[t,e]=$(void 0),[n,{refetch:r}]=rs(t,m=>m?jr():void 0);ht(()=>{if(!Ze){e(null);return}const m=rc(ze(),e);Re(m)});const[i,s]=$(!1);Ue(ct(t,m=>{s(!1),!(!m||!Ze)&&_s().then(I=>s(I.status===403)).catch(()=>{})})),ht(()=>{const m=()=>r();window.addEventListener("webapp:refresh-latest",m),Re(()=>window.removeEventListener("webapp:refresh-latest",m))});const a=()=>{var m,I;return((m=t())==null?void 0:m.email)||((I=t())==null?void 0:I.uid)||""},[o,c]=$(!1),[l,d]=$(!1),h=jd(),[g,_]=$("short"),w=Gl(),k=Ad(()=>n());return f(v,{get when(){return t()},get fallback(){return f(Rl,{})},get children(){return[f(v,{get when(){return!i()},get fallback(){return f($l,{get email(){return a()},onSignOut:()=>Ar()})},get children(){var m=Hd(),I=m.firstChild,T=I.firstChild,O=T.nextSibling,P=O.nextSibling;return u(T,f(v,{get when(){return t()},get children(){return[(()=>{var y=Ud(),C=y.firstChild,L=C.nextSibling;return y.$$click=()=>c(!o()),u(L,a),R(()=>Z(y,"aria-expanded",o())),y})(),f(v,{get when(){return o()},get children(){return[(()=>{var y=Fd();return y.$$click=()=>c(!1),y})(),(()=>{var y=Bd(),C=y.firstChild,L=C.nextSibling,x=L.nextSibling,N=x.nextSibling;return u(L,a),x.$$click=()=>{c(!1),d(!0)},N.$$click=()=>{c(!1),Ar()},y})()]}})]}})),u(I,f(v,{get when(){return q(()=>!n.loading)()&&!n.error},get children(){return f(Gd,{get envelope(){return n()}})}}),P),u(P,f($d,{run:k})),u(m,f(v,{get when(){return n.error},get children(){var y=Vd();return y.firstChild,u(y,()=>n.error.message,null),y}}),null),u(m,f(Pd,{run:k}),null),u(m,f(v,{get when(){var y;return q(()=>!n.loading)()&&((y=n())==null?void 0:y.result)},get fallback(){return f(v,{get when(){return!n.loading},get children(){return Wd()}})},children:y=>{const C=()=>y();return[f(ql,{scoring:w}),f(Kd,{result:C,tab:g,onTab:_}),f(Dr,{id:"short",active:()=>g()==="short",get tf(){var L;return(L=C().timeframes)==null?void 0:L.short},get stageError(){return Lr(C(),"chains_short")},get stages(){return C().stages},get thresholds(){return C().thresholds},columns:h,scoring:w}),f(Dr,{id:"medium",active:()=>g()==="medium",get tf(){var L;return(L=C().timeframes)==null?void 0:L.medium},get stageError(){return Lr(C(),"chains_medium")},get stages(){return C().stages},get thresholds(){return C().thresholds},columns:h,scoring:w})]}}),null),m}}),f(v,{get when(){return l()},get children(){return f(Ll,{onClose:()=>d(!1)})}})]}})}ce(["click"]);fs(()=>f(qd,{}),document.getElementById("root"));
