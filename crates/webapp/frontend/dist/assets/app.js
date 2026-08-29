(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const Hi=!1,Wi=(t,e)=>t===e,ji=Symbol("solid-track"),Dt={equals:Wi};let Or=xr;const me=1,Lt=2,Nr={owned:null,cleanups:null,context:null,owner:null},Zt={};var B=null;let en=null,zi=null,U=null,G=null,fe=null,Gt=0;function Tt(t,e){const n=U,r=B,i=t.length===0,s=e===void 0?r:e,a=i?Nr:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>te(()=>ut(a)));B=a,U=null;try{return $e(o,!0)}finally{U=n,B=r}}function A(t,e){e=e?Object.assign({},Dt,e):Dt;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),Lr(n,i));return[Dr.bind(n),r]}function Gi(t,e,n){const r=Kt(t,e,!0,me);Ze(r)}function P(t,e,n){const r=Kt(t,e,!1,me);Ze(r)}function ze(t,e,n){Or=Zi;const r=Kt(t,e,!1,me);r.user=!0,fe?fe.push(r):Ze(r)}function q(t,e,n){n=n?Object.assign({},Dt,n):Dt;const r=Kt(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,Ze(r),Dr.bind(r)}function Ki(t){return t&&typeof t=="object"&&"then"in t}function qi(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=Zt,c=!1,l="initialValue"in s,u=typeof r=="function"&&q(r);const h=new Set,[f,m]=(s.storage||A)(s.initialValue),[b,y]=A(void 0),[_,k]=A(void 0,{equals:!1}),[$,R]=A(l?"ready":"unresolved");B&&Ae(()=>{for(const O of h.keys())O.decrement();h.clear(),a=null});function v(O,D,V,H){return a===O&&(a=null,H!==void 0&&(l=!0),(O===o||D===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(H,{value:D})),o=Zt,C(D,V)),D}function C(O,D){$e(()=>{D===void 0&&m(()=>O),R(D!==void 0?"errored":l?"ready":"unresolved"),y(D);for(const V of h.keys())V.decrement();h.clear()},!1)}function T(){const O=Yi,D=f(),V=b();if(V!==void 0&&!a)throw V;return U&&U.user,D}function F(O=!0){if(O!==!1&&c)return;c=!1;const D=u?u():r;if(D==null||D===!1){v(a,te(f));return}let V;const H=o!==Zt?o:te(()=>{try{return i(D,{value:f(),refetching:O})}catch(S){V=S}});if(V!==void 0){v(a,void 0,Ct(V),D);return}else if(!Ki(H))return v(a,H,void 0,D),H;return a=H,"v"in H?(H.s===1?v(a,H.v,void 0,D):v(a,void 0,Ct(H.v),D),H):(c=!0,queueMicrotask(()=>c=!1),$e(()=>{R(l?"refreshing":"pending"),k()},!1),H.then(S=>v(H,S,void 0,D),S=>v(H,void 0,Ct(S),D)))}Object.defineProperties(T,{state:{get:()=>$()},error:{get:()=>b()},loading:{get(){const O=$();return O==="pending"||O==="refreshing"}},latest:{get(){if(!l)return T();const O=b();if(O&&!a)throw O;return f()}}});let N=B;return u?Gi(()=>(N=B,F(!1))):F(!1),[T,{refetch:O=>Ji(N,()=>F(O)),mutate:m}]}function te(t){if(U===null)return t();const e=U;U=null;try{return t()}finally{U=e}}function at(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let c=0;c<t.length;c++)a[c]=t[c]()}else a=t();const o=te(()=>e(a,i,s));return i=a,o}}function lt(t){ze(()=>te(t))}function Ae(t){return B===null||(B.cleanups===null?B.cleanups=[t]:B.cleanups.push(t)),t}function Ji(t,e){const n=B,r=U;B=t,U=null;try{return $e(e,!0)}catch(i){Tn(i)}finally{B=n,U=r}}const[Id,Ed]=A(!1);let Yi;function Dr(){if(this.sources&&this.state)if(this.state===me)Ze(this);else{const t=G;G=null,$e(()=>Mt(this),!1),G=t}if(U){const t=this.observers;if(!t||t[t.length-1]!==U){const e=t?t.length:0;U.sources?(U.sources.push(this),U.sourceSlots.push(e)):(U.sources=[this],U.sourceSlots=[e]),t?(t.push(U),this.observerSlots.push(U.sources.length-1)):(this.observers=[U],this.observerSlots=[U.sources.length-1])}}return this.value}function Lr(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&$e(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=en&&en.running;a&&en.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?G.push(s):fe.push(s),s.observers&&Mr(s)),a||(s.state=me)}if(G.length>1e6)throw G=[],new Error},!1)),e}function Ze(t){if(!t.fn)return;ut(t);const e=Gt;Xi(t,t.value,e)}function Xi(t,e,n){let r;const i=B,s=U;U=B=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=me,t.owned&&t.owned.forEach(ut),t.owned=null),t.updatedAt=n+1,Tn(a)}finally{U=s,B=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?Lr(t,r):t.value=r,t.updatedAt=n)}function Kt(t,e,n,r=me,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:B,context:B?B.context:null,pure:n};return B===null||B!==Nr&&(B.owned?B.owned.push(s):B.owned=[s]),s}function xt(t){if(t.state===0)return;if(t.state===Lt)return Mt(t);if(t.suspense&&te(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<Gt);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===me)Ze(t);else if(t.state===Lt){const r=G;G=null,$e(()=>Mt(t,e[0]),!1),G=r}}function $e(t,e){if(G)return t();let n=!1;e||(G=[]),fe?n=!0:fe=[],Gt++;try{const r=t();return Qi(n),r}catch(r){n||(fe=null),G=null,Tn(r)}}function Qi(t){if(G&&(xr(G),G=null),t)return;const e=fe;fe=null,e.length&&$e(()=>Or(e),!1)}function xr(t){for(let e=0;e<t.length;e++)xt(t[e])}function Zi(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:xt(r)}for(e=0;e<n;e++)xt(t[e])}function Mt(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===me?r!==e&&(!r.updatedAt||r.updatedAt<Gt)&&xt(r):i===Lt&&Mt(r,e)}}}function Mr(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=Lt,n.pure?G.push(n):fe.push(n),n.observers&&Mr(n))}}function ut(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)ut(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)ut(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function Ct(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function Tn(t,e=B){throw Ct(t)}const es=Symbol("fallback");function Hn(t){for(let e=0;e<t.length;e++)t[e]()}function ts(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Ae(()=>Hn(s)),()=>{let c=t()||[],l=c.length,u,h;return c[ji],te(()=>{let m,b,y,_,k,$,R,v,C;if(l===0)a!==0&&(Hn(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[es],i[0]=Tt(T=>(s[0]=T,n.fallback())),a=1);else if(a===0){for(i=new Array(l),h=0;h<l;h++)r[h]=c[h],i[h]=Tt(f);a=l}else{for(y=new Array(l),_=new Array(l),o&&(k=new Array(l)),$=0,R=Math.min(a,l);$<R&&r[$]===c[$];$++);for(R=a-1,v=l-1;R>=$&&v>=$&&r[R]===c[v];R--,v--)y[v]=i[R],_[v]=s[R],o&&(k[v]=o[R]);for(m=new Map,b=new Array(v+1),h=v;h>=$;h--)C=c[h],u=m.get(C),b[h]=u===void 0?-1:u,m.set(C,h);for(u=$;u<=R;u++)C=r[u],h=m.get(C),h!==void 0&&h!==-1?(y[h]=i[u],_[h]=s[u],o&&(k[h]=o[u]),h=b[h],m.set(C,h)):s[u]();for(h=$;h<l;h++)h in y?(i[h]=y[h],s[h]=_[h],o&&(o[h]=k[h],o[h](h))):i[h]=Tt(f);i=i.slice(0,a=l),r=c.slice(0)}return i});function f(m){if(s[h]=m,o){const[b,y]=A(h);return o[h]=y,e(c[h],b)}return e(c[h])}}}function p(t,e){return te(()=>t(e||{}))}const ns=t=>`Stale read from <${t}>.`;function ie(t){const e="fallback"in t&&{fallback:()=>t.fallback};return q(ts(()=>t.each,t.children,e||void 0))}function E(t){const e=t.keyed,n=q(()=>t.when,void 0,void 0),r=e?n:q(n,void 0,{equals:(i,s)=>!i==!s});return q(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?te(()=>s(e?i:()=>{if(!te(r))throw ns("Show");return n()})):s}return t.fallback},void 0,void 0)}const re=t=>q(()=>t());function rs(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,c=e[i-1].nextSibling,l=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const u=s<r?o?n[o-1].nextSibling:n[s-o]:c;for(;o<s;)t.insertBefore(n[o++],u)}else if(s===o)for(;a<i;)(!l||!l.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const u=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],u),e[i]=n[s]}else{if(!l){l=new Map;let h=o;for(;h<s;)l.set(n[h],h++)}const u=l.get(e[a]);if(u!=null)if(o<u&&u<s){let h=a,f=1,m;for(;++h<i&&h<s&&!((m=l.get(e[h]))==null||m!==u+f);)f++;if(f>u-o){const b=e[a];for(;o<u;)t.insertBefore(n[o++],b)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const Wn="_$DX_DELEGATE";function is(t,e,n,r={}){let i;return Tt(s=>{i=s,e===document?t():d(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function g(t,e,n,r){let i;const s=()=>{const o=document.createElement("template");return o.innerHTML=t,o.content.firstChild},a=()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function _e(t,e=window.document){const n=e[Wn]||(e[Wn]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,as))}}function oe(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function Te(t,e){e==null?t.removeAttribute("class"):t.className=e}function mn(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function ot(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function ss(t,e,n){return te(()=>t(e,n))}function d(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return Ut(t,e,r,n);P(i=>Ut(t,e(),i,n),r)}function as(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=c=>Object.defineProperty(t,"target",{configurable:!0,value:c}),a=()=>{const c=e[n];if(c&&!e.disabled){const l=e[`${n}Data`];if(l!==void 0?c.call(e,l,t):c.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const c=t.composedPath();s(c[0]);for(let l=0;l<c.length-2&&(e=c[l],!!a());l++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function Ut(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=He(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=He(t,n,r);else{if(s==="function")return P(()=>{let o=e();for(;typeof o=="function";)o=o();n=Ut(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],c=n&&Array.isArray(n);if(_n(o,e,n,i))return P(()=>n=Ut(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=He(t,n,r),a)return n}else c?n.length===0?jn(t,o,r):rs(t,n,o):(n&&He(t),jn(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=He(t,n,r,e);He(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function _n(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],c=n&&n[t.length],l;if(!(o==null||o===!0||o===!1))if((l=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=_n(t,o,c)||i;else if(l==="function")if(r){for(;typeof o=="function";)o=o();i=_n(t,Array.isArray(o)?o:[o],Array.isArray(c)?c:[c])||i}else t.push(o),i=!0;else{const u=String(o);c&&c.nodeType===3&&c.data===u?t.push(c):t.push(document.createTextNode(u))}}return i}function jn(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function He(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const c=o.parentNode===t;!s&&!a?c?t.replaceChild(i,o):t.insertBefore(i,n):c&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let At=null;function os(t){At=t}async function Fe(t,e={}){if(!At)return fetch(t,e);const n=new Headers(e.headers??{}),r=await At(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await At(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function Ur(){const t=await Fe("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function cs(){return Fe("/api/me")}async function ls(){const t=await Fe("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function us(t){const e=await Fe("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function ds(t){const e=await Fe("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function hs(){return await Fe("/api/run",{method:"POST"})}async function fs(){return Fe("/api/progress")}const ps=()=>{};var zn={};/**
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
 */const Br=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},gs=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],c=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Fr={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,c=i+2<t.length,l=c?t[i+2]:0,u=s>>2,h=(s&3)<<4|o>>4;let f=(o&15)<<2|l>>6,m=l&63;c||(m=64,a||(f=64)),r.push(n[u],n[h],n[f],n[m])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Br(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):gs(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const l=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||l==null||h==null)throw new ms;const f=s<<2|o>>4;if(r.push(f),l!==64){const m=o<<4&240|l>>2;if(r.push(m),h!==64){const b=l<<6&192|h;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class ms extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const _s=function(t){const e=Br(t);return Fr.encodeByteArray(e,!0)},Vr=function(t){return _s(t).replace(/\./g,"")},Hr=function(t){try{return Fr.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function bs(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const ws=()=>bs().__FIREBASE_DEFAULTS__,ys=()=>{if(typeof process>"u"||typeof zn>"u")return;const t=zn.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},vs=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Hr(t[1]);return e&&JSON.parse(e)},Cn=()=>{try{return ps()||ws()||ys()||vs()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Is=t=>{var e,n;return(n=(e=Cn())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},Wr=()=>{var t;return(t=Cn())==null?void 0:t.config},jr=t=>{var e;return(e=Cn())==null?void 0:e[`_${t}`]};/**
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
 */class zr{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function K(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Es(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(K())}function Ss(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ks(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Ts(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Cs(){const t=K();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function As(){try{return typeof indexedDB=="object"}catch{return!1}}function $s(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const Ps="FirebaseError";class Pe extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Ps,Object.setPrototypeOf(this,Pe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,gt.prototype.create)}}class gt{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Rs(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new Pe(i,o,r)}}function Rs(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function Os(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Ye(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(Gn(s)&&Gn(a)){if(!Ye(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function Gn(t){return t!==null&&typeof t=="object"}/**
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
 */function mt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function rt(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function it(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Ns(t,e){const n=new Ds(t,e);return n.subscribe.bind(n)}class Ds{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Ls(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=tn),i.error===void 0&&(i.error=tn),i.complete===void 0&&(i.complete=tn);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Ls(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function tn(){}/**
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
 */function be(t){return t&&t._delegate?t._delegate:t}/**
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
 */function An(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function xs(t){return(await fetch(t,{credentials:"include"})).ok}class Xe{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */class Ms{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new zr;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Bs(e))try{this.getOrInitializeService({instanceIdentifier:Le})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Le){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Le){return this.instances.has(e)}getOptions(e=Le){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Us(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Le){return this.component?this.component.multipleInstances?e:Le:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Us(t){return t===Le?void 0:t}function Bs(t){return t.instantiationMode==="EAGER"}/**
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
 */class Fs{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Ms(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var x;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(x||(x={}));const Vs={debug:x.DEBUG,verbose:x.VERBOSE,info:x.INFO,warn:x.WARN,error:x.ERROR,silent:x.SILENT},Hs=x.INFO,Ws={[x.DEBUG]:"log",[x.VERBOSE]:"log",[x.INFO]:"info",[x.WARN]:"warn",[x.ERROR]:"error"},js=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Ws[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Gr{constructor(e){this.name=e,this._logLevel=Hs,this._logHandler=js,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in x))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Vs[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,x.DEBUG,...e),this._logHandler(this,x.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,x.VERBOSE,...e),this._logHandler(this,x.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,x.INFO,...e),this._logHandler(this,x.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,x.WARN,...e),this._logHandler(this,x.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,x.ERROR,...e),this._logHandler(this,x.ERROR,...e)}}const zs=(t,e)=>e.some(n=>t instanceof n);let Kn,qn;function Gs(){return Kn||(Kn=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ks(){return qn||(qn=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Kr=new WeakMap,bn=new WeakMap,qr=new WeakMap,nn=new WeakMap,$n=new WeakMap;function qs(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Ce(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&Kr.set(n,t)}).catch(()=>{}),$n.set(e,t),e}function Js(t){if(bn.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});bn.set(t,e)}let wn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return bn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||qr.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Ce(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Ys(t){wn=t(wn)}function Xs(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(rn(this),e,...n);return qr.set(r,e.sort?e.sort():[e]),Ce(r)}:Ks().includes(t)?function(...e){return t.apply(rn(this),e),Ce(Kr.get(this))}:function(...e){return Ce(t.apply(rn(this),e))}}function Qs(t){return typeof t=="function"?Xs(t):(t instanceof IDBTransaction&&Js(t),zs(t,Gs())?new Proxy(t,wn):t)}function Ce(t){if(t instanceof IDBRequest)return qs(t);if(nn.has(t))return nn.get(t);const e=Qs(t);return e!==t&&(nn.set(t,e),$n.set(e,t)),e}const rn=t=>$n.get(t);function Zs(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Ce(a);return r&&a.addEventListener("upgradeneeded",c=>{r(Ce(a.result),c.oldVersion,c.newVersion,Ce(a.transaction),c)}),n&&a.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),o.then(c=>{s&&c.addEventListener("close",()=>s()),i&&c.addEventListener("versionchange",l=>i(l.oldVersion,l.newVersion,l))}).catch(()=>{}),o}const ea=["get","getKey","getAll","getAllKeys","count"],ta=["put","add","delete","clear"],sn=new Map;function Jn(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(sn.get(e))return sn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=ta.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||ea.includes(n)))return;const s=async function(a,...o){const c=this.transaction(a,i?"readwrite":"readonly");let l=c.store;return r&&(l=l.index(o.shift())),(await Promise.all([l[n](...o),i&&c.done]))[0]};return sn.set(e,s),s}Ys(t=>({...t,get:(e,n,r)=>Jn(e,n)||t.get(e,n,r),has:(e,n)=>!!Jn(e,n)||t.has(e,n)}));/**
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
 */class na{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(ra(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function ra(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const yn="@firebase/app",Yn="0.16.1";/**
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
 */const pe=new Gr("@firebase/app"),ia="@firebase/app-compat",sa="@firebase/analytics-compat",aa="@firebase/analytics",oa="@firebase/app-check-compat",ca="@firebase/app-check",la="@firebase/auth",ua="@firebase/auth-compat",da="@firebase/database",ha="@firebase/data-connect",fa="@firebase/database-compat",pa="@firebase/functions",ga="@firebase/functions-compat",ma="@firebase/installations",_a="@firebase/installations-compat",ba="@firebase/messaging",wa="@firebase/messaging-compat",ya="@firebase/performance",va="@firebase/performance-compat",Ia="@firebase/remote-config",Ea="@firebase/remote-config-compat",Sa="@firebase/storage",ka="@firebase/storage-compat",Ta="@firebase/firestore",Ca="@firebase/ai",Aa="@firebase/firestore-compat",$a="firebase",Pa="12.18.0";/**
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
 */const vn="[DEFAULT]",Ra={[yn]:"fire-core",[ia]:"fire-core-compat",[aa]:"fire-analytics",[sa]:"fire-analytics-compat",[ca]:"fire-app-check",[oa]:"fire-app-check-compat",[la]:"fire-auth",[ua]:"fire-auth-compat",[da]:"fire-rtdb",[ha]:"fire-data-connect",[fa]:"fire-rtdb-compat",[pa]:"fire-fn",[ga]:"fire-fn-compat",[ma]:"fire-iid",[_a]:"fire-iid-compat",[ba]:"fire-fcm",[wa]:"fire-fcm-compat",[ya]:"fire-perf",[va]:"fire-perf-compat",[Ia]:"fire-rc",[Ea]:"fire-rc-compat",[Sa]:"fire-gcs",[ka]:"fire-gcs-compat",[Ta]:"fire-fst",[Aa]:"fire-fst-compat",[Ca]:"fire-vertex","fire-js":"fire-js",[$a]:"fire-js-all"};/**
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
 */const Bt=new Map,Oa=new Map,In=new Map;function Xn(t,e){try{t.container.addComponent(e)}catch(n){pe.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function dt(t){const e=t.name;if(In.has(e))return pe.debug(`There were multiple attempts to register component ${e}.`),!1;In.set(e,t);for(const n of Bt.values())Xn(n,t);for(const n of Oa.values())Xn(n,t);return!0}function Jr(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function J(t){return t==null?!1:t.settings!==void 0}/**
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
 */const Na={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ue=new gt("app","Firebase",Na);/**
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
 */class Da{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Xe("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ue.create("app-deleted",{appName:this._name})}}/**
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
 */const _t=Pa;function Yr(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:vn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw ue.create("bad-app-name",{appName:String(i)});if(n||(n=Wr()),!n)throw ue.create("no-options");const s=Bt.get(i);if(s)if(Ye(n,s.options)){if(Ye(r,s.config))return s;throw ue.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw ue.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new Fs(i);for(const c of In.values())a.addComponent(c);const o=new Da(n,r,a);return Bt.set(i,o),o}function La(t=vn){const e=Bt.get(t);if(!e&&t===vn&&Wr())return Yr();if(!e)throw ue.create("no-app",{appName:t});return e}function Ge(t,e,n){let r=Ra[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),pe.warn(a.join(" "));return}dt(new Xe(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const xa="firebase-heartbeat-database",Ma=1,ht="firebase-heartbeat-store";let an=null;function Xr(){return an||(an=Zs(xa,Ma,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(ht)}catch(n){console.warn(n)}}}}).catch(t=>{throw ue.create("idb-open",{originalErrorMessage:t.message})})),an}async function Ua(t){try{const n=(await Xr()).transaction(ht),r=await n.objectStore(ht).get(Qr(t));return await n.done,r}catch(e){if(e instanceof Pe)pe.warn(e.message);else{const n=ue.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});pe.warn(n.message)}}}async function Qn(t,e){try{const r=(await Xr()).transaction(ht,"readwrite");await r.objectStore(ht).put(e,Qr(t)),await r.done}catch(n){if(n instanceof Pe)pe.warn(n.message);else{const r=ue.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});pe.warn(r.message)}}}function Qr(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Ba=1024,Fa=30;class Va{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Wa(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Zn();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Fa){const a=ja(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){pe.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Zn(),{heartbeatsToSend:r,unsentEntries:i}=Ha(this._heartbeatsCache.heartbeats),s=Vr(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return pe.warn(n),""}}}function Zn(){return new Date().toISOString().substring(0,10)}function Ha(t,e=Ba){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),er(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),er(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Wa{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return As()?$s().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Ua(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Qn(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Qn(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function er(t){return Vr(JSON.stringify({version:2,heartbeats:t})).length}function ja(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function za(t){dt(new Xe("platform-logger",e=>new na(e),"PRIVATE")),dt(new Xe("heartbeat",e=>new Va(e),"PRIVATE")),Ge(yn,Yn,t),Ge(yn,Yn,"esm2020"),Ge("fire-js","")}/**
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
 */za("");var Ga="firebase",Ka="12.18.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ge(Ga,Ka,"app");function Zr(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const qa=Zr,ei=new gt("auth","Firebase",Zr());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ft=new Gr("@firebase/auth");function ti(t,...e){Ft.logLevel<=x.WARN&&Ft.warn(`Auth (${_t}): ${t}`,...e)}function $t(t,...e){Ft.logLevel<=x.ERROR&&Ft.error(`Auth (${_t}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X(t,...e){throw Rn(t,...e)}function ee(t,...e){return Rn(t,...e)}function Pn(t,e,n){const r={...qa(),[e]:n};return new gt("auth","Firebase",r).create(e,{appName:t.name})}function se(t){return Pn(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ni(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&X(t,"argument-error"),Pn(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Rn(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return ei.create(t,...e)}function I(t,e,...n){if(!t)throw Rn(e,...n)}function de(t){const e="INTERNAL ASSERTION FAILED: "+t;throw $t(e),new Error(e)}function ge(t,e){t||de(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function En(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function Ja(){return tr()==="http:"||tr()==="https:"}function tr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ya(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Ja()||ks()||"connection"in navigator)?navigator.onLine:!0}function Xa(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(e,n){this.shortDelay=e,this.longDelay=n,ge(n>e,"Short delay should be less than long delay!"),this.isMobile=Es()||Ts()}get(){return Ya()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function On(t,e){ge(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ri{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;de("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;de("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;de("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qa={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Za=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],eo=new bt(3e4,6e4);function Re(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function Oe(t,e,n,r,i={}){return ii(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=mt({...a,key:t.config.apiKey}).slice(1),c=await t._getAdditionalHeaders();c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode);const l={method:e,headers:c,...s};return Ss()||(l.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&An(t.emulatorConfig.host)&&(l.credentials="include"),ri.fetch()(await si(t,t.config.apiHost,n,o),l)})}async function ii(t,e,n){t._canInitEmulator=!1;const r={...Qa,...e};try{const i=new no(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw kt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[c,l]=o.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw kt(t,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw kt(t,"email-already-in-use",a);if(c==="USER_DISABLED")throw kt(t,"user-disabled",a);const u=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw Pn(t,u,l);X(t,u)}}catch(i){if(i instanceof Pe)throw i;X(t,"network-request-failed",{message:String(i)})}}async function wt(t,e,n,r,i={}){const s=await Oe(t,e,n,r,i);return"mfaPendingCredential"in s&&X(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function si(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?On(t.config,i):`${t.config.apiScheme}://${i}`;return Za.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function to(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class no{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(ee(this.auth,"network-request-failed")),eo.get())})}}function kt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=ee(t,e,r);return i.customData._tokenResponse=n,i}function nr(t){return t!==void 0&&t.enterprise!==void 0}class ro{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return to(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function io(t,e){return Oe(t,"GET","/v2/recaptchaConfig",Re(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function so(t,e){return Oe(t,"POST","/v1/accounts:delete",e)}async function Vt(t,e){return Oe(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ct(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function ao(t,e=!1){const n=be(t),r=await n.getIdToken(e),i=Nn(r);I(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:ct(on(i.auth_time)),issuedAtTime:ct(on(i.iat)),expirationTime:ct(on(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function on(t){return Number(t)*1e3}function Nn(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return $t("JWT malformed, contained fewer than 3 sections"),null;try{const i=Hr(n);return i?JSON.parse(i):($t("Failed to decode base64 JWT payload"),null)}catch(i){return $t("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function rr(t){const e=Nn(t);return I(e,"internal-error"),I(typeof e.exp<"u","internal-error"),I(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ft(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Pe&&oo(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function oo({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class co{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=ct(this.lastLoginAt),this.creationTime=ct(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Ht(t){var h;const e=t.auth,n=await t.getIdToken(),r=await ft(t,Vt(e,{idToken:n}));I(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?ai(i.providerUserInfo):[],a=uo(t.providerData,s),o=t.isAnonymous,c=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),l=o?c:!1,u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Sn(i.createdAt,i.lastLoginAt),isAnonymous:l};Object.assign(t,u)}async function lo(t){const e=be(t);await Ht(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function uo(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function ai(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ho(t,e){const n=await ii(t,{},async()=>{const r=mt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await si(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:o,body:r};return t.emulatorConfig&&An(t.emulatorConfig.host)&&(c.credentials="include"),ri.fetch()(a,c)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function fo(t,e){return Oe(t,"POST","/v2/accounts:revokeToken",Re(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){I(e.idToken,"internal-error"),I(typeof e.idToken<"u","internal-error"),I(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):rr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){I(e.length!==0,"internal-error");const n=rr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(I(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await ho(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new Ke;return r&&(I(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(I(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(I(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ke,this.toJSON())}_performRefresh(){return de("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ve(t,e){I(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Z{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new co(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Sn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await ft(this,this.stsTokenManager.getToken(this.auth,e));return I(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return ao(this,e)}reload(){return lo(this)}_assign(e){this!==e&&(I(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Z({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){I(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Ht(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(J(this.auth.app))return Promise.reject(se(this.auth));const e=await this.getIdToken();return await ft(this,so(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,c=n._redirectEventId??void 0,l=n.createdAt??void 0,u=n.lastLoginAt??void 0,{uid:h,emailVerified:f,isAnonymous:m,providerData:b,stsTokenManager:y}=n;I(h&&y,e,"internal-error");const _=Ke.fromJSON(this.name,y);I(typeof h=="string",e,"internal-error"),ve(r,e.name),ve(i,e.name),I(typeof f=="boolean",e,"internal-error"),I(typeof m=="boolean",e,"internal-error"),ve(s,e.name),ve(a,e.name),ve(o,e.name),ve(c,e.name),ve(l,e.name),ve(u,e.name);const k=new Z({uid:h,auth:e,email:i,emailVerified:f,displayName:r,isAnonymous:m,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:_,createdAt:l,lastLoginAt:u});return b&&Array.isArray(b)&&(k.providerData=b.map($=>({...$}))),c&&(k._redirectEventId=c),k}static async _fromIdTokenResponse(e,n,r=!1){const i=new Ke;i.updateFromServerResponse(n);const s=new Z({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Ht(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];I(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?ai(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new Ke;o.updateFromIdToken(r);const c=new Z({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),l={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Sn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(c,l),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ir=new Map;function he(t){ge(t instanceof Function,"Expected a class definition");let e=ir.get(t);return e?(ge(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,ir.set(t,e),e)}/**
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
 */class oi{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}oi.type="NONE";const sr=oi;/**
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
 */function Pt(t,e,n){return`firebase:${t}:${e}:${n}`}class qe{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Pt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Pt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await Vt(this.auth,{idToken:e}).catch(()=>{});return n?Z._fromGetAccountInfoResponse(this.auth,n,e):null}return Z._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new qe(he(sr),e,r);const i=(await Promise.all(n.map(async l=>{if(await l._isAvailable())return l}))).filter(l=>l);let s=i[0]||he(sr);const a=Pt(r,e.config.apiKey,e.name);let o=null;for(const l of n)try{const u=await l._get(a);if(u){let h;if(typeof u=="string"){const f=await Vt(e,{idToken:u}).catch(()=>{});if(!f)break;h=await Z._fromGetAccountInfoResponse(e,f,u)}else h=Z._fromJSON(e,u);l!==s&&(o=h),s=l;break}}catch{}const c=i.filter(l=>l._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new qe(s,e,r):(s=c[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async l=>{if(l!==s)try{await l._remove(a)}catch{}})),new qe(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ar(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(di(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(ci(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(fi(e))return"Blackberry";if(pi(e))return"Webos";if(li(e))return"Safari";if((e.includes("chrome/")||ui(e))&&!e.includes("edge/"))return"Chrome";if(hi(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function ci(t=K()){return/firefox\//i.test(t)}function li(t=K()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function ui(t=K()){return/crios\//i.test(t)}function di(t=K()){return/iemobile/i.test(t)}function hi(t=K()){return/android/i.test(t)}function fi(t=K()){return/blackberry/i.test(t)}function pi(t=K()){return/webos/i.test(t)}function Dn(t=K()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function po(t=K()){var e;return Dn(t)&&!!((e=window.navigator)!=null&&e.standalone)}function go(){return Cs()&&document.documentMode===10}function gi(t=K()){return Dn(t)||hi(t)||pi(t)||fi(t)||/windows phone/i.test(t)||di(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mi(t,e=[]){let n;switch(t){case"Browser":n=ar(K());break;case"Worker":n=`${ar(K())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${_t}/${r}`}/**
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
 */class mo{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const c=e(s);a(c)}catch(c){o(c)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function _o(t,e={}){return Oe(t,"GET","/v2/passwordPolicy",Re(t,e))}/**
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
 */const bo=6;class wo{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??bo,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yo{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new or(this),this.idTokenSubscription=new or(this),this.beforeStateQueue=new mo(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ei,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=he(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await qe.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Vt(this,{idToken:e}),r=await Z._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(J(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,c=await this.tryRedirectSignIn(e);(!a||a===o)&&(c!=null&&c.user)&&(r=c.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return I(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Ht(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Xa()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(J(this.app))return Promise.reject(se(this));const n=e?be(e):null;return n&&I(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&I(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return J(this.app)?Promise.reject(se(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return J(this.app)?Promise.reject(se(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(he(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await _o(this),n=new wo(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new gt("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await fo(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&he(e)||this._popupRedirectResolver;I(n,this,"argument-error"),this.redirectPersistenceManager=await qe.create(this,[he(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(I(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const c=e.addObserver(n,r,i);return()=>{a=!0,c()}}else{const c=e.addObserver(n);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return I(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=mi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(J(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&ti(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function we(t){return be(t)}class or{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ns(n=>this.observer=n)}get next(){return I(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let qt={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function vo(t){qt=t}function _i(t){return qt.loadJS(t)}function Io(){return qt.recaptchaEnterpriseScript}function Eo(){return qt.gapiScript}function So(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class ko{constructor(){this.enterprise=new To}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class To{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
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
 */const Co="recaptcha-enterprise",bi="NO_RECAPTCHA",cr="onFirebaseAuthREInstanceReady";class Ie{constructor(e){this.type=Co,this.auth=we(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{io(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const l=new ro(c);return s.tenantId==null?s._agentRecaptchaConfig=l:s._tenantRecaptchaConfigs[s.tenantId]=l,a(l.siteKey)}}).catch(c=>{o(c)})})}function i(s,a,o){const c=window.grecaptcha;nr(c)?c.enterprise.ready(()=>{c.enterprise.execute(s,{action:e}).then(l=>{a(l)}).catch(()=>{a(bi)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new ko().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&nr(window.grecaptcha)&&Ie.scriptInjectionDeferred)await Ie.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=Io();c.length!==0&&(c+=o+`&onload=${cr}`),Ie.scriptInjectionDeferred=new zr,window[cr]=()=>{var l;(l=Ie.scriptInjectionDeferred)==null||l.resolve()},_i(c).then(()=>{var l;return(l=Ie.scriptInjectionDeferred)==null?void 0:l.promise}).then(()=>{i(o,s,a)}).catch(l=>{a(l)})}}).catch(o=>{a(o)})})}}Ie.scriptInjectionDeferred=null;async function lr(t,e,n,r=!1,i=!1){const s=new Ie(t);let a;if(i)a=bi;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const c=o.phoneEnrollmentInfo.phoneNumber,l=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:c,recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const c=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function kn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await lr(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await lr(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ao(t,e){const n=Jr(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(Ye(s,e??{}))return i;X(i,"already-initialized")}return n.initialize({options:e})}function $o(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(he);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Po(t,e,n){const r=we(t);I(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=wi(e),{host:a,port:o}=Ro(e),c=o===null?"":`:${o}`,l={url:`${s}//${a}${c}/`},u=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){I(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),I(Ye(l,r.config.emulator)&&Ye(u,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=l,r.emulatorConfig=u,r.settings.appVerificationDisabledForTesting=!0,An(a)?xs(`${s}//${a}${c}`):Oo()}function wi(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Ro(t){const e=wi(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:ur(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:ur(a)}}}function ur(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Oo(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return de("not implemented")}_getIdTokenResponse(e){return de("not implemented")}_linkToIdToken(e,n){return de("not implemented")}_getReauthenticationResolver(e){return de("not implemented")}}async function No(t,e){return Oe(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Do(t,e){return wt(t,"POST","/v1/accounts:signInWithPassword",Re(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Lo(t,e){return wt(t,"POST","/v1/accounts:signInWithEmailLink",Re(t,e))}async function xo(t,e){return wt(t,"POST","/v1/accounts:signInWithEmailLink",Re(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt extends Ln{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new pt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new pt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return kn(e,n,"signInWithPassword",Do);case"emailLink":return Lo(e,{email:this._email,oobCode:this._password});default:X(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return kn(e,r,"signUpPassword",No);case"emailLink":return xo(e,{idToken:n,email:this._email,oobCode:this._password});default:X(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Je(t,e){return wt(t,"POST","/v1/accounts:signInWithIdp",Re(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mo="http://localhost";class Ue extends Ln{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Ue(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):X("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new Ue(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return Je(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Je(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Je(e,n)}buildRequest(){const e={requestUri:Mo,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=mt(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uo(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Bo(t){const e=rt(it(t)).link,n=e?rt(it(e)).deep_link_id:null,r=rt(it(t)).deep_link_id;return(r?rt(it(r)).link:null)||r||n||e||t}class xn{constructor(e){const n=rt(it(e)),r=n.apiKey??null,i=n.oobCode??null,s=Uo(n.mode??null);I(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=Bo(e);try{return new xn(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(){this.providerId=et.PROVIDER_ID}static credential(e,n){return pt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=xn.parseLink(n);return I(r,"argument-error"),pt._fromEmailAndCode(e,r.code,r.tenantId)}}et.PROVIDER_ID="password";et.EMAIL_PASSWORD_SIGN_IN_METHOD="password";et.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class yt extends Jt{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee extends yt{constructor(){super("facebook.com")}static credential(e){return Ue._fromParams({providerId:Ee.PROVIDER_ID,signInMethod:Ee.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ee.credentialFromTaggedObject(e)}static credentialFromError(e){return Ee.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ee.credential(e.oauthAccessToken)}catch{return null}}}Ee.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ee.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le extends yt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Ue._fromParams({providerId:le.PROVIDER_ID,signInMethod:le.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return le.credentialFromTaggedObject(e)}static credentialFromError(e){return le.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return le.credential(n,r)}catch{return null}}}le.GOOGLE_SIGN_IN_METHOD="google.com";le.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se extends yt{constructor(){super("github.com")}static credential(e){return Ue._fromParams({providerId:Se.PROVIDER_ID,signInMethod:Se.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Se.credentialFromTaggedObject(e)}static credentialFromError(e){return Se.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Se.credential(e.oauthAccessToken)}catch{return null}}}Se.GITHUB_SIGN_IN_METHOD="github.com";Se.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke extends yt{constructor(){super("twitter.com")}static credential(e,n){return Ue._fromParams({providerId:ke.PROVIDER_ID,signInMethod:ke.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ke.credentialFromTaggedObject(e)}static credentialFromError(e){return ke.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return ke.credential(n,r)}catch{return null}}}ke.TWITTER_SIGN_IN_METHOD="twitter.com";ke.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fo(t,e){return wt(t,"POST","/v1/accounts:signUp",Re(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await Z._fromIdTokenResponse(e,r,i),a=dr(r);return new Be({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=dr(r);return new Be({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function dr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt extends Pe{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Wt.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new Wt(e,n,r,i)}}function yi(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Wt._fromErrorAndOperation(t,s,e,r):s})}async function Vo(t,e,n=!1){const r=await ft(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Be._forOperation(t,"link",r)}/**
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
 */async function Ho(t,e,n=!1){const{auth:r}=t;if(J(r.app))return Promise.reject(se(r));const i="reauthenticate";try{const s=await ft(t,yi(r,i,e,t),n);I(s.idToken,r,"internal-error");const a=Nn(s.idToken);I(a,r,"internal-error");const{sub:o}=a;return I(t.uid===o,r,"user-mismatch"),Be._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&X(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vi(t,e,n=!1){if(J(t.app))return Promise.reject(se(t));const r="signIn",i=await yi(t,r,e),s=await Be._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Wo(t,e){return vi(we(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ii(t){const e=we(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function jo(t,e,n){if(J(t.app))return Promise.reject(se(t));const r=we(t),a=await kn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Fo).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&Ii(t),c}),o=await Be._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function zo(t,e,n){return J(t.app)?Promise.reject(se(t)):Wo(be(t),et.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Ii(t),r})}function Go(t,e,n,r){return be(t).onIdTokenChanged(e,n,r)}function Ko(t,e,n){return be(t).beforeAuthStateChanged(e,n)}function qo(t,e,n,r){return be(t).onAuthStateChanged(e,n,r)}function Jo(t){return be(t).signOut()}const jt="__sak";/**
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
 */class Ei{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(jt,"1"),this.storage.removeItem(jt),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yo=1e3,Xo=10;class Si extends Ei{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=gi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,c)=>{this.notifyListeners(a,c)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);go()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Xo):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Yo)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Si.type="LOCAL";const Qo=Si;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki extends Ei{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}ki.type="SESSION";const Ti=ki;/**
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
 */function Zo(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class Yt{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new Yt(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async l=>l(n.origin,s)),c=await Zo(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Yt.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mn(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class ec{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,c)=>{const l=Mn("",20);i.port1.start();const u=setTimeout(()=>{c(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const f=h;if(f.data.eventId===l)switch(f.data.status){case"ack":clearTimeout(u),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(f.data.response);break;default:clearTimeout(u),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:l,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ae(){return window}function tc(t){ae().location.href=t}/**
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
 */function Ci(){return typeof ae().WorkerGlobalScope<"u"&&typeof ae().importScripts=="function"}async function nc(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function rc(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function ic(){return Ci()?self:null}/**
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
 */const Ai="firebaseLocalStorageDb",sc=1,zt="firebaseLocalStorage",$i="fbase_key";class vt{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Xt(t,e){return t.transaction([zt],e?"readwrite":"readonly").objectStore(zt)}function ac(){const t=indexedDB.deleteDatabase(Ai);return new vt(t).toPromise()}function Pi(){const t=indexedDB.open(Ai,sc);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(zt,{keyPath:$i})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(zt)?e(r):(r.close(),await ac(),e(await Pi()))})})}async function hr(t,e,n){const r=Xt(t,!0).put({[$i]:e,value:n});return new vt(r).toPromise()}async function oc(t,e){const n=Xt(t,!1).get(e),r=await new vt(n).toPromise();return r===void 0?null:r.value}function fr(t,e){const n=Xt(t,!0).delete(e);return new vt(n).toPromise()}const cc=800,lc=3;class Ri{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=Pi(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>lc)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Ci()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Yt._getInstance(ic()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await nc(),!this.activeServiceWorker)return;this.sender=new ec(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||rc()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await hr(e,jt,"1"),await fr(e,jt)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>hr(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>oc(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>fr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=Xt(i,!1).getAll();return new vt(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||ti(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),cc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}Ri.type="LOCAL";const uc=Ri;new bt(3e4,6e4);/**
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
 */function Un(t,e){return e?he(e):(I(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class Bn extends Ln{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Je(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Je(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Je(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function dc(t){return vi(t.auth,new Bn(t),t.bypassAuthState)}function hc(t){const{auth:e,user:n}=t;return I(n,e,"internal-error"),Ho(n,new Bn(t),t.bypassAuthState)}async function fc(t){const{auth:e,user:n}=t;return I(n,e,"internal-error"),Vo(n,new Bn(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(c))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return dc;case"linkViaPopup":case"linkViaRedirect":return fc;case"reauthViaPopup":case"reauthViaRedirect":return hc;default:X(this.auth,"internal-error")}}resolve(e){ge(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ge(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pc=new bt(2e3,1e4);async function gc(t,e,n){if(J(t.app))return Promise.reject(ee(t,"operation-not-supported-in-this-environment"));const r=we(t);ni(t,e,Jt);const i=Un(r,n);return new xe(r,"signInViaPopup",e,i).executeNotNull()}class xe extends Oi{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,xe.currentPopupAction&&xe.currentPopupAction.cancel(),xe.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return I(e,this.auth,"internal-error"),e}async onExecution(){ge(this.filter.length===1,"Popup operations only handle one event");const e=Mn();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(ee(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(ee(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,xe.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ee(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,pc.get())};e()}}xe.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mc="pendingRedirect",Rt=new Map;class _c extends Oi{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Rt.get(this.auth._key());if(!e){try{const r=await bc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Rt.set(this.auth._key(),e)}return this.bypassAuthState||Rt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function bc(t,e){const n=Di(e),r=Ni(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function wc(t,e){return Ni(t)._set(Di(e),"true")}function yc(t,e){Rt.set(t._key(),e)}function Ni(t){return he(t._redirectPersistence)}function Di(t){return Pt(mc,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vc(t,e,n){return Ic(t,e,n)}async function Ic(t,e,n){if(J(t.app))return Promise.reject(se(t));const r=we(t);ni(t,e,Jt),await r._initializationPromise;const i=Un(r,n);return await wc(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function Ec(t,e,n=!1){if(J(t.app))return Promise.reject(se(t));const r=we(t),i=Un(r,e),a=await new _c(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sc=600*1e3;class kc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Tc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!Li(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(ee(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Sc&&this.cachedEventUids.clear(),this.cachedEventUids.has(pr(e))}saveEventToCache(e){this.cachedEventUids.add(pr(e)),this.lastProcessedEventTime=Date.now()}}function pr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Li({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Tc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Li(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cc(t,e={}){return Oe(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ac=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,$c=/^https?/;async function Pc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Cc(t);for(const n of e)try{if(Rc(n))return}catch{}X(t,"unauthorized-domain")}function Rc(t){const e=En(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!$c.test(n))return!1;if(Ac.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const Oc=new bt(3e4,6e4);function gr(){const t=ae().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Nc(t){return new Promise((e,n)=>{var i,s,a;function r(){gr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{gr(),n(ee(t,"network-request-failed"))},timeout:Oc.get()})}if((s=(i=ae().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=ae().gapi)!=null&&a.load)r();else{const o=So("iframefcb");return ae()[o]=()=>{gapi.load?r():n(ee(t,"network-request-failed"))},_i(`${Eo()}?onload=${o}`).catch(c=>n(c))}}).catch(e=>{throw Ot=null,e})}let Ot=null;function Dc(t){return Ot=Ot||Nc(t),Ot}/**
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
 */const Lc=new bt(5e3,15e3),xc="__/auth/iframe",Mc="emulator/auth/iframe",Uc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Bc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Fc(t){const e=t.config;I(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?On(e,Mc):`https://${t.config.authDomain}/${xc}`,r={apiKey:e.apiKey,appName:t.name,v:_t},i=Bc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${mt(r).slice(1)}`}async function Vc(t){const e=await Dc(t),n=ae().gapi;return I(n,t,"internal-error"),e.open({where:document.body,url:Fc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Uc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=ee(t,"network-request-failed"),o=ae().setTimeout(()=>{s(a)},Lc.get());function c(){ae().clearTimeout(o),i(r)}r.ping(c).then(c,()=>{s(a)})}))}/**
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
 */const Hc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Wc=500,jc=600,zc="_blank",Gc="http://localhost";class mr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Kc(t,e,n,r=Wc,i=jc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const c={...Hc,width:r.toString(),height:i.toString(),top:s,left:a},l=K().toLowerCase();n&&(o=ui(l)?zc:n),ci(l)&&(e=e||Gc,c.scrollbars="yes");const u=Object.entries(c).reduce((f,[m,b])=>`${f}${m}=${b},`,"");if(po(l)&&o!=="_self")return qc(e||"",o),new mr(null);const h=window.open(e||"",o,u);I(h,t,"popup-blocked");try{h.focus()}catch{}return new mr(h)}function qc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const Jc="__/auth/handler",Yc="emulator/auth/handler",Xc=encodeURIComponent("fac");async function _r(t,e,n,r,i,s){I(t.config.authDomain,t,"auth-domain-config-required"),I(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:_t,eventId:i};if(e instanceof Jt){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",Os(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[u,h]of Object.entries({}))a[u]=h}if(e instanceof yt){const u=e.getScopes().filter(h=>h!=="");u.length>0&&(a.scopes=u.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const u of Object.keys(o))o[u]===void 0&&delete o[u];const c=await t._getAppCheckToken(),l=c?`#${Xc}=${encodeURIComponent(c)}`:"";return`${Qc(t)}?${mt(o).slice(1)}${l}`}function Qc({config:t}){return t.emulator?On(t,Yc):`https://${t.authDomain}/${Jc}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn="webStorageSupport";class Zc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ti,this._completeRedirectFn=Ec,this._overrideRedirectResult=yc}async _openPopup(e,n,r,i){var a;ge((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await _r(e,n,r,En(),i);return Kc(e,s,Mn())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await _r(e,n,r,En(),i);return tc(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(ge(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Vc(e),r=new kc(e);return n.register("authEvent",i=>(I(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(cn,{type:cn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[cn];s!==void 0&&n(!!s),X(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Pc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return gi()||li()||Dn()}}const el=Zc;var br="@firebase/auth",wr="1.13.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tl{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){I(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nl(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function rl(t){dt(new Xe("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;I(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:mi(t)},l=new yo(r,i,s,c);return $o(l,n),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),dt(new Xe("auth-internal",e=>{const n=we(e.getProvider("auth").getImmediate());return(r=>new tl(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ge(br,wr,nl(t)),Ge(br,wr,"esm2020")}/**
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
 */const il=300,sl=jr("authIdTokenMaxAge")||il;let yr=null;const al=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>sl)return;const i=n==null?void 0:n.token;yr!==i&&(yr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function ol(t=La()){const e=Jr(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Ao(t,{popupRedirectResolver:el,persistence:[uc,Qo,Ti]}),r=jr("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=al(s.toString());Ko(n,a,()=>a(n.currentUser)),Go(n,o=>a(o))}}const i=Is("auth");return i&&Po(n,`http://${i}`),n}function cl(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}vo({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=ee("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",cl().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});rl("Browser");const ll={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},ce=ll,Qe=!!ce.VITE_FIREBASE_APP_ID;let ln=null;function We(){if(!Qe)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!ln){const t=Yr({apiKey:ce.VITE_FIREBASE_API_KEY,authDomain:ce.VITE_FIREBASE_AUTH_DOMAIN,projectId:ce.VITE_FIREBASE_PROJECT_ID,appId:ce.VITE_FIREBASE_APP_ID,...ce.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:ce.VITE_FIREBASE_STORAGE_BUCKET},...ce.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:ce.VITE_FIREBASE_MESSAGING_SENDER_ID}});ln=ol(t)}return ln}function vr(){return new le}async function Ir(){if(!Qe)return;const t=We();t.currentUser&&await Jo(t)}var ul=g(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),dl=g('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),hl=g("<button type=button class=gate-toggle>"),fl=g("<div class=gate-or>── or ──"),pl=g("<button type=button class=btn>Continue with Google"),gl=g("<div class=gate-error role=alert>"),ml=g("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),_l=g("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),bl=g("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const wl={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Er(t){const e=(t==null?void 0:t.code)??"";return wl[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function yl(t){return(()=>{var e=ul(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,c=o.nextSibling;return d(a,()=>t.email),mn(c,"click",t.onSignOut),e})()}function vl(){const[t,e]=A("signin"),[n,r]=A(""),[i,s]=A(""),[a,o]=A(!1),[c,l]=A("");os(async f=>{if(!Qe)return null;const m=We().currentUser;return m?await m.getIdToken(f):null});async function u(f){if(f.preventDefault(),!a()){o(!0),l("");try{const m=We();t()==="create"?await jo(m,n(),i()):await zo(m,n(),i())}catch(m){l(Er(m))}finally{o(!1)}}}async function h(){if(!a()){o(!0),l("");try{await gc(We(),vr())}catch(f){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(f==null?void 0:f.code)){await vc(We(),vr());return}l(Er(f))}finally{o(!1)}}}return(()=>{var f=ml(),m=f.firstChild;return m.firstChild,d(m,p(E,{when:Qe,get fallback(){return[_l(),bl()]},get children(){return[(()=>{var b=dl(),y=b.firstChild,_=y.firstChild,k=_.nextSibling,$=y.nextSibling,R=$.firstChild,v=R.nextSibling,C=$.nextSibling;return b.addEventListener("submit",u),k.$$input=T=>r(T.currentTarget.value),v.$$input=T=>s(T.currentTarget.value),d(C,(()=>{var T=re(()=>!!a());return()=>T()?"Working…":t()==="create"?"Create account":"Sign in"})()),P(T=>{var F=t()==="create"?"new-password":"current-password",N=a();return F!==T.e&&oe(v,"autocomplete",T.e=F),N!==T.t&&(C.disabled=T.t=N),T},{e:void 0,t:void 0}),P(()=>k.value=n()),P(()=>v.value=i()),b})(),(()=>{var b=hl();return b.$$click=()=>{l(""),e(t()==="create"?"signin":"create")},d(b,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),P(()=>b.disabled=a()),b})(),fl(),(()=>{var b=pl();return b.$$click=h,P(()=>b.disabled=a()),b})(),p(E,{get when(){return c()},get children(){var b=gl();return d(b,c),b}})]}}),null),f})()}_e(["click","input"]);var Il=g("<div class=gate-error role=alert>"),El=g("<p class=gate-note>No grant-file entries yet."),Sl=g("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),kl=g('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),Tl=g("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function Cl(t){const[e,n]=A([]),[r,i]=A([]),[s,a]=A(""),[o,c]=A(!1),[l,u]=A(""),h=_=>{n((_==null?void 0:_.file_grants)??[]),i((_==null?void 0:_.static_emails)??[])};lt(async()=>{try{h(await ls())}catch{u("Could not load the grant list.")}});const m=_=>{_.key==="Escape"&&t.onClose()};lt(()=>{window.addEventListener("keydown",m),Ae(()=>window.removeEventListener("keydown",m));const _=document.querySelector(".access-add input");_==null||_.focus()});const b=async _=>{if(_.preventDefault(),!(o()||!s().trim())){c(!0),u("");try{h(await us(s())),a("")}catch(k){u(k.message)}c(!1)}},y=async _=>{if(!o()){c(!0),u("");try{h(await ds(_))}catch(k){u(k.message)}c(!1)}};return(()=>{var _=kl(),k=_.firstChild,$=k.firstChild,R=$.nextSibling,v=R.nextSibling,C=v.firstChild,T=C.nextSibling,F=v.nextSibling;return mn(_,"click",t.onClose),k.$$click=N=>N.stopPropagation(),d(k,p(E,{get when(){return l()},get children(){var N=Il();return d(N,l),N}}),v),d(k,p(ie,{get each(){return e()},children:N=>(()=>{var O=Tl(),D=O.firstChild,V=D.nextSibling;return d(D,N),V.$$click=()=>y(N),oe(V,"title",`Remove ${N}`),oe(V,"aria-label",`Remove ${N}`),P(()=>V.disabled=o()),O})()}),v),d(k,p(E,{get when(){return e().length===0},get children(){return El()}}),v),v.addEventListener("submit",b),C.$$input=N=>a(N.currentTarget.value),d(T,()=>o()?"…":"Add"),d(k,p(E,{get when(){return r().length>0},get children(){var N=Sl();return N.firstChild,d(N,()=>r().join(", "),null),N}}),F),mn(F,"click",t.onClose),P(()=>T.disabled=o()),P(()=>C.value=s()),_})()}_e(["click","input"]);const Qt=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],st=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],xi="webapp.columns.v1";function Al(){try{const t=localStorage.getItem(xi);if(!t)return st;const e=JSON.parse(t);if(!Array.isArray(e))return st;const n=new Set(Qt.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:st}catch{return st}}function $l(t){try{localStorage.setItem(xi,JSON.stringify(t))}catch{}}var Pl=g("<div class=pop-backdrop>"),Rl=g('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Ol=g("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Nl=g("<label class=pick-item><input type=checkbox>");function Dl(t){const[e,n]=A(!1);return(()=>{var r=Ol(),i=r.firstChild;return i.$$click=()=>n(!e()),d(r,p(E,{get when(){return e()},get children(){return[(()=>{var s=Pl();return s.$$click=()=>n(!1),s})(),(()=>{var s=Rl(),a=s.firstChild,o=a.nextSibling;return d(a,p(ie,{each:Qt,children:c=>(()=>{var l=Nl(),u=l.firstChild;return u.addEventListener("change",h=>t.store.toggle(c.id,h.currentTarget.checked)),d(l,()=>c.label,null),P(()=>u.checked=t.store.isOn(c.id)),l})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),P(()=>oe(i,"aria-expanded",e())),r})()}_e(["click"]);var Ll=g('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),xl=g("<span class=pggap>…"),Ml=g("<button type=button class=pgbtn>");function Ul(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(c,l)=>l+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(c=>c>=1&&c<=n).sort((c,l)=>c-l),a=[];let o=0;for(const c of s)c-o>1&&a.push("…"),a.push(c),o=c;return a}function Bl(t){const e=q(()=>Ul(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Ll(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var c=s.nextSibling,l=c.nextSibling;return d(s,()=>t.page(),o),d(s,()=>t.pageCount(),null),c.$$click=n,d(i,p(ie,{get each(){return e()},children:u=>u==="…"?xl():(()=>{var h=Ml();return h.$$click=()=>t.onGo(u),d(h,u),P(()=>h.classList.toggle("active",u===t.page())),h})()}),l),l.$$click=r,P(u=>{var h=t.page()<=1,f=t.page()>=t.pageCount();return h!==u.e&&(c.disabled=u.e=h),f!==u.t&&(l.disabled=u.t=f),u},{e:void 0,t:void 0}),i})()}_e(["click"]);var Fl=g("<span class=tip>");function tt(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=Fl();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?ss(i,r):e=r,d(r,()=>t.children),P(()=>oe(r,"data-tip",t.text??"")),r})()}_e(["focusin"]);const Me="∅";function z(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function Nt(t){return Number(t??0).toLocaleString("en-US")}const Mi={text:Me,isNull:!0},un=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Sr(t,e){return!e||z(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function Vl(t,e){return!e||z(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function Hl(t){if(!t||typeof t!="object"||z(t.report_date))return Mi;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function Y(t,e){if(z(e))return Mi;switch(t){case"fixed2":return un(e,2);case"fixed3":return un(e,3);case"ivrv":return un(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return Hl(e);default:return{text:String(e),isNull:!1}}}const kr=t=>Number(t*100).toFixed(0);function Wl(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=kr(e.momentum_high),s=kr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function nt(t,e){return Wl(e)[t]??t}var Ui=g("<span class=tip-target>"),jl=g("<div class=kv><span class=kv-label></span><span class=kv-value>"),zl=g("<span class=tip-target>Strike position in band"),Gl=g('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),Kl=g("<div class=exp-block><h4>"),ql=g("<div class=kv-value>Band unavailable (∅)"),Jl=g("<div><span class=marker-tick></span><span class=marker-cap><br>"),Yl=g("<div class=exp-block><h4>Premium economics"),Xl=g("<b>"),Ql=g('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),Zl=g("<div class=muted-note>earnings-discounted safety applied"),eu=g("<div class=exp-block><h4>Score breakdown"),tu=g("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),nu=g('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),ru=g("<span class=muted-note>all columns visible"),iu=g('<div class="exp-block exp-chips"><h4>Hidden columns'),su=g("<span class=tip-target>: "),au=g("<span>"),ou=g("<span class=tip-target>band safety is already discounted by the earnings rule."),cu=g("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),lu=g("<div class=expansion><div class=exp-grid>");const dn={sharpe:.2,safety:.4,return_part:.4};function hn(t,e=2){return z(t)?Me:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function ne(t,e,n){return(()=>{var r=jl(),i=r.firstChild,s=i.nextSibling;return d(i,p(tt,{get text(){return nt(t,e)},get children(){var a=Ui();return d(a,()=>t.replace(/_/g," ")),a}})),d(s,n),r})()}function uu(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=z(e.mid)?null:e.strike-e.mid,s=i!=null&&!z(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,c=Math.max(o,a),l=!z(a)&&c>a&&!z(e.strike),u=f=>{if(z(f))return null;const m=(f-a)/(c-a)*100;return Math.min(100,Math.max(0,m))},h=l?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(f=>u(f.v)!=null):[];return(()=>{var f=Kl(),m=f.firstChild;return d(m,p(tt,{get text(){return nt("band_range",t.thresholds)},get children(){return zl()}})),d(f,p(E,{when:l,get fallback(){return ql()},get children(){var b=Gl(),y=b.firstChild;return d(b,p(ie,{each:h,children:_=>(()=>{var k=Jl(),$=k.firstChild,R=$.nextSibling,v=R.firstChild;return d(R,()=>_.label,v),d(R,()=>Y("fixed2",_.v).text,null),P(C=>{var T=`marker ${_.cls}`,F=`${u(_.v)}%`;return T!==C.e&&Te(k,C.e=T),F!==C.t&&ot(k,"left",C.t=F),C},{e:void 0,t:void 0}),k})()}),null),P(_=>{var k=`${u(e.strike_from)}%`,$=`${Math.max(0,u(e.strike_to)-u(e.strike_from))}%`;return k!==_.e&&ot(y,"left",_.e=k),$!==_.t&&ot(y,"width",_.t=$),_},{e:void 0,t:void 0}),b}}),null),d(f,()=>ne("band_range",t.thresholds,`${Y("fixed2",e.strike_from).text} → ${Y("fixed2",e.strike_to).text}`),null),d(f,()=>ne("band_depth",t.thresholds,r==null?Me:`${(r*100).toFixed(1)}%`),null),d(f,()=>ne("cushion_be",t.thresholds,s==null?Me:`${s.toFixed(1)}%`),null),f})()}function du(t){const e=t.row,n=z(e.strike)?null:e.strike*100,r=z(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=Y("pct1",e.rate_of_return);return(()=>{var a=Yl();return a.firstChild,d(a,()=>ne("capital",t.thresholds,n==null?Me:hn(n,0)),null),d(a,()=>ne("premium",t.thresholds,r==null?Me:hn(r)),null),d(a,()=>ne("breakeven",t.thresholds,i==null?Me:hn(i)),null),d(a,()=>ne("ann_ror",t.thresholds,(()=>{var o=Xl();return d(o,()=>s.text),o})()),null),d(a,()=>ne("bid",t.thresholds,Y("fixed2",e.bid).text),null),d(a,()=>ne("ask",t.thresholds,Y("fixed2",e.ask).text),null),d(a,()=>ne("expiration",t.thresholds,e.expiration),null),a})()}function hu(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:dn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:dn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:dn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=eu();return i.firstChild,d(i,p(E,{when:n,get fallback(){return(()=>{var s=tu(),a=s.firstChild,o=a.nextSibling,c=o.firstChild;return d(c,()=>Y("fixed3",e.score).text),s})()},get children(){return[p(ie,{each:r,children:s=>{const a=z(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=nu(),c=o.firstChild,l=c.firstChild,u=l.nextSibling,h=u.firstChild,f=h.nextSibling;f.nextSibling;var m=c.nextSibling,b=m.firstChild,y=m.nextSibling;return d(c,p(tt,{get text(){return nt(s.key,t.thresholds)},get children(){var _=Ui();return d(_,()=>s.label),_}}),l),d(u,()=>s.weight*100,f),d(y,()=>Y("fixed3",s.v).text),P(_=>ot(b,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=Ql(),a=s.firstChild,o=a.nextSibling,c=o.firstChild;return d(c,()=>Y("fixed3",e.score).text),s})(),p(E,{get when(){return e.earnings_before_expiry},get children(){return Zl()}})]}}),null),i})()}function fu(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:Y(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=iu();return n.firstChild,d(n,p(ie,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=au();return d(s,p(tt,{get text(){return nt(r.id,t.thresholds)},get children(){var a=su(),o=a.firstChild;return d(a,()=>r.label,o),d(a,()=>i.text,null),a}})),P(()=>Te(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),d(n,p(E,{get when(){return t.hiddenDefs.length===0},get children(){return ru()}}),null),n})()}function pu(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=lu(),i=r.firstChild;return d(r,p(E,{when:n,get children(){var s=cu(),a=s.firstChild,o=a.nextSibling,c=o.nextSibling,l=c.nextSibling,u=l.nextSibling,h=u.nextSibling;return h.nextSibling,d(o,()=>n.report_date),d(s,p(E,{get when(){return n.report_time},children:f=>f().replaceAll("_"," ")}),l),d(s,p(E,{get when(){return!z(n.expected_eps)},get children(){return[" ","· expected EPS ",re(()=>Y("fixed2",n.expected_eps).text)]}}),h),d(s,p(tt,{get text(){return nt("earnings_before_expiry",t.thresholds)},get children(){return ou()}}),null),s}}),i),d(i,p(uu,{row:e,get thresholds(){return t.thresholds}}),null),d(i,p(du,{row:e,get thresholds(){return t.thresholds}}),null),d(i,p(hu,{row:e,get thresholds(){return t.thresholds}}),null),d(i,p(fu,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var gu=g("<span class=null-mark>"),mu=g("<span class=star>★"),_u=g("<td><b>"),fn=g("<span>"),Tr=g("<td class=num>"),bu=g("<td>"),wu=g("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),yu=g("<span class=sort-arrow>"),vu=g("<span class=tip-target>"),Iu=g("<th role=button tabindex=0>"),Eu=g("<tr class=expandable><td class=exp-col>"),Su=g("<tr class=exp-row><td>");const ku=t=>`${t.underlying}|${t.strike}`;function Tu(t){return(()=>{var e=gu();return d(e,()=>t.text),e})()}function pn(t){const e=Y(t.kind,t.value);return p(E,{get when(){return!e.isNull},get fallback(){return p(Tu,{get text(){return e.text}})},get children(){return e.text}})}function Cu(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=_u(),i=r.firstChild;return d(r,p(E,{get when(){return t.pickRank!=null},get children(){var s=mu();return s.firstChild,d(s,()=>t.pickRank,null),s}}),i),d(i,()=>n.underlying),d(r,p(E,{get when(){return Sr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=fn();return P(()=>Te(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Tr();return d(r,p(E,{get when(){return Sr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=fn();return P(()=>Te(s,`dot ${i()}`)),s})()," "]}),null),d(r,p(pn,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="price_percentile"?(()=>{var r=Tr();return d(r,p(pn,{get kind(){return e.kind},get value(){return n[e.id]}}),null),d(r,p(E,{get when(){return Vl(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=fn();return d(s,i),P(()=>Te(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=bu();return d(r,p(pn,{get kind(){return e.kind},get value(){return n[e.id]}})),P(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Au(t){const e=q(()=>Qt.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=wu(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return d(i,p(ie,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var c=Iu();return c.$$keydown=l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),t.onSort(a.id))},c.$$click=()=>t.onSort(a.id),d(c,p(tt,{get text(){return nt(a.id,t.thresholds)},get children(){var l=vu();return d(l,()=>a.label,null),d(l,p(E,{get when(){return o()},get children(){return[" ",(()=>{var u=yu();return d(u,()=>t.sortDir()==="asc"?"↑":"↓"),u})()]}}),null),l}})),P(l=>{var u=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return u!==l.e&&c.classList.toggle("num",l.e=u),h!==l.t&&oe(c,"aria-sort",l.t=h),l},{e:void 0,t:void 0}),c})()}}),null),d(s,p(ie,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),c=()=>ku(a),l=()=>t.openKey()!=null&&t.openKey()===c();return[(()=>{var u=Eu(),h=u.firstChild;return u.$$click=()=>t.onToggleRow(a),d(h,()=>l()?"▾":"▸"),d(u,p(ie,{get each(){return e()},children:f=>p(Cu,{col:f,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()}})}),null),P(f=>{var m=o()!=null,b=!!z(a.score),y=!!l();return m!==f.e&&u.classList.toggle("pick",f.e=m),b!==f.t&&u.classList.toggle("prow",f.t=b),y!==f.a&&u.classList.toggle("open",f.a=y),f},{e:void 0,t:void 0,a:void 0}),u})(),p(E,{get when(){return l()},get children(){var u=Su(),h=u.firstChild;return d(h,p(pu,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),P(()=>oe(h,"colspan",e().length+1)),u}})]}})),n})()}_e(["click","keydown"]);function $u(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const je=t=>z(t);function Pu(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],c=je(a),l=je(o);return c||l?c&&l?0:c?1:-1:r*$u(a,o)})}function Ru(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=je(r),a=je(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const c=e.rate_of_return,l=n.rate_of_return,u=je(c),h=je(l);return u||h?u&&h?0:u?1:-1:l-c})}var Ou=g("<div class=stage-badges>"),Nu=g("<pre class=errbox>"),Du=g("<details><summary> "),Lu=g('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)</span></div><div class=scroll-region>'),xu=g("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (annualized return ≥ 30%, Sharpe &gt; 0)."),Mu=g("<div class=empty-panel>No rows match the current filter."),Uu=g('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const gn=100,Bu=150,Cr={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function Fu(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=Ou();return d(i,p(ie,{get each(){return t.stages??[]},children:s=>(()=>{var a=Du(),o=a.firstChild,c=o.firstChild;return d(o,()=>n(s.status),c),d(o,()=>r(s.name),null),d(a,p(E,{get when(){return s.error},get children(){var l=Nu();return d(l,()=>s.error),l}}),null),P(()=>Te(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function Ar(t){const[e,n]=A(""),[r,i]=A(""),[s,a]=A(!0),[o,c]=A(null),[l,u]=A("asc"),[h,f]=A(1);let m;Ae(()=>clearTimeout(m));const b=()=>{var w;return((w=t.tf)==null?void 0:w.rows)??[]},y=w=>{const M=w.currentTarget.value;n(M),clearTimeout(m),m=setTimeout(()=>{i(M.trim().toLowerCase()),f(1)},Bu)},_=w=>{a(w),f(1)},k=w=>{o()!==w?(c(w),u("asc")):l()==="asc"?u("desc"):(c(null),u("asc")),f(1)},[$,R]=A(null),v=w=>{const M=`${w.underlying}|${w.strike}`;R(W=>W===M?null:M)};ze(at([o,l,h,r,s],()=>R(null))),ze(at(t.active,()=>R(null))),ze(at(t.columns.visible,()=>f(1)));const C=()=>Qt.filter(w=>!t.columns.visible().includes(w.id)),T=()=>(t.stages??[]).find(w=>w.name===Cr[t.id].id),F=q(()=>{const w=r();return w?b().filter(M=>{const W=M.underlying,ye=M.sector;return W!=null&&String(W).toLowerCase().includes(w)||ye!=null&&String(ye).toLowerCase().includes(w)}):b()}),N=q(()=>{const w=F();return s()?w.filter(M=>!z(M.score)):w}),O=q(()=>o()?Pu(N(),o(),l()):Ru(N())),D=q(()=>Math.max(1,Math.ceil(O().length/gn))),V=()=>Math.min(h(),D()),H=()=>{const w=V();return O().slice((w-1)*gn,w*gn)},S=q(()=>{var M;const w=new Map;for(const W of((M=t.tf)==null?void 0:M.top_picks)??[])w.set(`${W.underlying}|${W.strike}`,W.rank??"?");return w}),L=w=>S().get(`${w.underlying}|${w.strike}`);return(()=>{var w=Lu(),M=w.firstChild,W=M.firstChild,ye=W.nextSibling,j=ye.firstChild,Ne=ye.nextSibling,Fn=Ne.firstChild,Vn=Fn.nextSibling;Vn.nextSibling;var Vi=M.nextSibling;return d(w,p(Fu,{get stages(){return t.stages}}),M),W.$$input=y,j.addEventListener("change",Q=>_(Q.currentTarget.checked)),d(M,p(Dl,{get store(){return t.columns}}),Ne),d(Ne,()=>Nt(O().length),Fn),d(Ne,()=>Nt(b().length),Vn),d(Vi,p(E,{get when(){return H().length>0},get fallback(){return p(E,{get when(){var Q,De;return((Q=T())==null?void 0:Q.status)==="failed"||((De=T())==null?void 0:De.status)==="partial"},get fallback(){return p(E,{get when(){return re(()=>!!s())()&&F().length>0},get fallback(){return Mu()},get children(){var Q=xu(),De=Q.firstChild,Ve=De.nextSibling,It=Ve.nextSibling,Et=It.nextSibling,St=Et.nextSibling;return St.nextSibling,d(Q,()=>Nt(F().length),St),Q}})},children:Q=>(()=>{var De=Uu(),Ve=De.firstChild,It=Ve.firstChild,Et=It.nextSibling;Et.nextSibling;var St=Ve.nextSibling;return d(Ve,()=>Q().status==="partial"?"△":"✗",It),d(Ve,()=>Cr[t.id].label,Et),d(St,()=>Q().error??"stage produced no data"),De})()})},get children(){return p(Au,{get visibleCols(){return t.columns.visible},rows:H,sortKey:o,sortDir:l,onSort:k,get thresholds(){return t.thresholds},pickRankOf:L,openKey:$,onToggleRow:v,hiddenDefs:C})}})),d(w,p(E,{get when(){return O().length>0},get children(){return p(Bl,{page:V,pageCount:D,onGo:f})}}),null),P(()=>w.hidden=!t.active()),P(()=>W.value=e()),P(()=>j.checked=s()),w})()}_e(["input"]);async function Vu(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const c=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!c.startsWith("data:"))continue;const l=c.slice(5).trim();if(l)try{e(JSON.parse(l))}catch{}}}return"completed"}catch{return"lost"}}var Hu=g("<button type=button class=run-btn>"),Wu=g("<span class=run-count>/"),ju=g("<span class=run-bar><span class=fill>"),zu=g("<li><span class=mark></span><span class=label>"),Gu=g("<div class=toast-cached>Served from cache — last run <!> min old"),Ku=g('<div class="toast-cached warn">'),qu=g("<div class=run-headline>"),Ju=g("<ul class=run-stages>"),Yu=g("<details class=run-errors><summary>details</summary><ul>"),Xu=g("<div class=run-warn>Closing this tab stops the run."),Qu=g("<div class=run-warn>Re-checking every 15 s…"),Zu=g("<div class=run-strip>"),ed=g("<li> ");const Bi=["quotes","metrics","chains_short","chains_medium"],Fi={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},td=15e3;function $r(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function nd(t){const[e,n]=A("idle"),[r,i]=A(k()),[s,a]=A(null),[o,c]=A(0),[l,u]=A(null),[h,f]=A(null),[m,b]=A("");let y=null,_=null;function k(){return Object.fromEntries(Bi.map(S=>[S,{status:"pending",error:null}]))}function $(){y&&clearInterval(y),y=null,_&&clearInterval(_),_=null}function R(){c(0),y=setInterval(()=>c(S=>S+1),1e3)}function v(S){switch(S.type){case"stage_started":i(L=>({...L,[S.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:S.stage,done:S.done,total:S.total});break;case"stage_finished":i(L=>({...L,[S.stage]:{status:S.ok?"ok":"failed",error:S.error??null}}));break;case"run_finished":u(S);break}}function C(){$();const S=l(),L=((S==null?void 0:S.stages)??[]).some(w=>w.name.startsWith("chains")&&["ok","partial"].includes(w.status));n(S&&(L||S.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function T(S){let L=!1;return await Vu(S,w=>{v(w),w.type==="run_finished"&&(L=!0)}),L?(C(),!0):!1}async function F(S){n("detached"),_=setInterval(async()=>{var L,w;try{const M=await Ur(),W=((w=(L=M==null?void 0:M.result)==null?void 0:L.run)==null?void 0:w.finished_at_utc)??null;W&&W!==S&&(i(N(M.result)),$(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest")))}catch{}},td)}function N(S){const L=k();for(const w of(S==null?void 0:S.stages)??[])L[w.name]&&(L[w.name]={status:w.status,error:w.error});return L}async function O(){var M,W,ye;if(["starting","running","detached"].includes(e()))return;b(""),u(null),a(null),i(k()),f(null);const S=((ye=(W=(M=t())==null?void 0:M.result)==null?void 0:W.run)==null?void 0:ye.finished_at_utc)??null;n("running"),R();let L;try{L=await hs()}catch{$(),n("idle"),b("Run failed to start — network or server unreachable.");return}const w=L.headers.get("content-type")??"";if(L.ok&&w.includes("application/json")){const j=await L.json().catch(()=>null);if($(),n("idle"),(j==null?void 0:j.status)==="cached"){f(j.age_secs),setTimeout(()=>f(null),6e3);return}}if(L.status===403&&w.includes("application/json")){const j=await L.json().catch(()=>null);$(),n("idle");const Ne=j!=null&&j.next_open_utc?new Date(j.next_open_utc).toLocaleString():"the next market open";b(`One off-hours run already completed — the next unlocks at market open (${Ne}).`);return}if(L.status===202){const j=await fs();if(j.ok&&(j.headers.get("content-type")??"").includes("text/event-stream")){await T(j)||await F(S);return}await F(S);return}if(w.includes("text/event-stream")){await T(L)||await F(S);return}$(),n("idle"),b(`Unexpected /api/run response (${L.status}, ${w||"no type"}).`)}return Ae($),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:l,cachedToast:h,notice:m,triggerRun:O,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{var S;return((S=t())==null?void 0:S.run_allowed)!==!1},nextOpenUtc:()=>{var S;return((S=t())==null?void 0:S.next_open_utc)??null}}}function rd(t){const e=()=>!t.run.runAllowed(),n=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?"Run at next open":"▶ Run pipeline";return(()=>{var r=Hu();return r.$$click=()=>t.run.triggerRun(),d(r,n),P(i=>{var s=t.run.isBusy()||e(),a=e()&&t.run.nextOpenUtc()?`Unlocks at market open: ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return s!==i.e&&(r.disabled=i.e=s),a!==i.t&&oe(r,"title",i.t=a),i},{e:void 0,t:void 0}),r})()}function id(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=zu(),s=i.firstChild,a=s.nextSibling;return d(s,n),d(a,()=>Fi[t.name]),d(i,p(E,{get when(){return r()!==null},get children(){return[(()=>{var o=Wu(),c=o.firstChild;return d(o,()=>t.run.batch().done,c),d(o,()=>t.run.batch().total,null),o})(),(()=>{var o=ju(),c=o.firstChild;return P(l=>ot(c,"width",`${r()}%`)),o})()]}}),null),P(()=>Te(i,`run-stage ${e()}`)),i})()}function sd(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",re(()=>$r(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",re(()=>$r(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return p(E,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=Zu();return d(i,p(E,{get when(){return e.cachedToast()},get children(){var s=Gu(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,d(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),d(i,p(E,{get when(){return e.notice()},get children(){var s=Ku();return d(s,()=>e.notice()),s}}),null),d(i,p(E,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=qu();return d(s,r),s})(),(()=>{var s=Ju();return d(s,()=>Bi.map(a=>p(id,{name:a,run:e}))),s})(),p(E,{get when(){return re(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=Yu(),a=s.firstChild,o=a.nextSibling;return d(o,()=>(n().stages??[]).filter(c=>c.status!=="ok").map(c=>(()=>{var l=ed(),u=l.firstChild;return d(l,()=>c.status==="partial"?"△":"✗",u),d(l,()=>Fi[c.name]??c.name,null),d(l,(()=>{var h=re(()=>!!c.error);return()=>h()?`: ${c.error}`:""})(),null),l})())),s}})]}}),null),d(i,p(E,{get when(){return re(()=>e.phase()==="running")()&&!n()},get children(){return Xu()}}),null),d(i,p(E,{get when(){return e.phase()==="detached"},get children(){return Qu()}}),null),i}})}_e(["click"]);var Pr=g("<b>"),ad=g("<span>Cached · <b></b> left"),od=g("<div class=cache-line><span></span><span class=pill>run: "),cd=g("<span>Stale · last run <b></b> min ago"),ld=g("<nav class=tabs role=tablist aria-label=timeframes>"),ud=g("<button type=button role=tab class=tab> (<!>)"),dd=g('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),hd=g("<div class=pop-backdrop>"),fd=g("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),pd=g("<div class=error-banner>API error: "),gd=g("<div class=shell><header><div class=user-box></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),md=g("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function _d(){const[t,e]=A(Al()),n=r=>{e(r),$l(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(st)}}function Rr(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function bd(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function wd(t){const[e,n]=A(0);lt(()=>{const u=setInterval(()=>n(h=>h+1),3e4);Ae(()=>clearInterval(u))});let r=Date.now(),i=0;ze(at(()=>t.envelope,u=>{r=Date.now(),i=(u==null?void 0:u.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>Math.floor(s()/60),c=()=>{const u=Math.max(0,(t.envelope.cache_secs??0)-s());return u>=60?`${Math.floor(u/60)}m`:`${u}s`},l=()=>{var h,f;const u=(f=(h=t.envelope.result)==null?void 0:h.run)==null?void 0:f.finished_at_utc;if(u)try{const m=new Date(u);return Number.isNaN(m.getTime())?void 0:new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(m)+" ET"}catch{return}};return(()=>{var u=od(),h=u.firstChild,f=h.nextSibling;return f.firstChild,d(u,p(E,{get when(){return a()==="fresh"},get fallback(){return p(E,{get when(){return a()==="stale"},get children(){var m=cd(),b=m.firstChild,y=b.nextSibling;return y.nextSibling,d(y,o),d(m,p(E,{get when(){return l()},get children(){return[" ","· run ",(()=>{var _=Pr();return d(_,l),_})()]}}),null),m}})},get children(){var m=ad(),b=m.firstChild,y=b.nextSibling;return y.nextSibling,d(y,c),d(m,p(E,{get when(){return l()},get children(){return[" ","· run ",(()=>{var _=Pr();return d(_,l),_})()]}}),null),m}}),h),d(h,a),d(f,()=>{var m;return((m=t.envelope.run_state)==null?void 0:m.status)??"idle"},null),P(()=>Te(h,"pill "+a())),u})()}function yd(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"}];return(()=>{var n=ld();return d(n,()=>e.map(r=>(()=>{var i=ud(),s=i.firstChild,a=s.nextSibling;return a.nextSibling,i.$$click=()=>t.onTab(r.id),d(i,()=>r.label,s),d(i,()=>Nt(bd(t.result,r.id)),a),P(o=>{var c=t.tab()===r.id,l=t.tab()===r.id;return c!==o.e&&oe(i,"aria-selected",o.e=c),l!==o.t&&i.classList.toggle("active",o.t=l),o},{e:void 0,t:void 0}),i})())),n})()}function vd(){const[t,e]=A(void 0),[n,{refetch:r}]=qi(t,y=>y?Ur():void 0);lt(()=>{if(!Qe){e(null);return}const y=qo(We(),e);Ae(y)});const[i,s]=A(!1);ze(at(t,y=>{s(!1),!(!y||!Qe)&&cs().then(_=>s(_.status===403)).catch(()=>{})})),lt(()=>{const y=()=>r();window.addEventListener("webapp:refresh-latest",y),Ae(()=>window.removeEventListener("webapp:refresh-latest",y))});const a=()=>{var y,_;return((y=t())==null?void 0:y.email)||((_=t())==null?void 0:_.uid)||""},[o,c]=A(!1),[l,u]=A(!1),h=_d(),[f,m]=A("short"),b=nd(()=>n());return p(E,{get when(){return t()},get fallback(){return p(vl,{})},get children(){return[p(E,{get when(){return!i()},get fallback(){return p(yl,{get email(){return a()},onSignOut:()=>Ir()})},get children(){var y=gd(),_=y.firstChild,k=_.firstChild,$=k.nextSibling,R=$.nextSibling;return d(k,p(E,{get when(){return t()},get children(){return[(()=>{var v=dd(),C=v.firstChild,T=C.nextSibling;return v.$$click=()=>c(!o()),d(T,a),P(()=>oe(v,"aria-expanded",o())),v})(),p(E,{get when(){return o()},get children(){return[(()=>{var v=hd();return v.$$click=()=>c(!1),v})(),(()=>{var v=fd(),C=v.firstChild,T=C.nextSibling,F=T.nextSibling,N=F.nextSibling;return d(T,a),F.$$click=()=>{c(!1),u(!0)},N.$$click=()=>{c(!1),Ir()},v})()]}})]}})),d(_,p(E,{get when(){return re(()=>!n.loading)()&&!n.error},get children(){return p(wd,{get envelope(){return n()}})}}),R),d(R,p(rd,{run:b})),d(y,p(E,{get when(){return n.error},get children(){var v=pd();return v.firstChild,d(v,()=>n.error.message,null),v}}),null),d(y,p(sd,{run:b}),null),d(y,p(E,{get when(){var v;return re(()=>!n.loading)()&&((v=n())==null?void 0:v.result)},get fallback(){return p(E,{get when(){return!n.loading},get children(){return md()}})},children:v=>{const C=()=>v();return[p(yd,{result:C,tab:f,onTab:m}),p(Ar,{id:"short",active:()=>f()==="short",get tf(){var T;return(T=C().timeframes)==null?void 0:T.short},get stageError(){return Rr(C(),"chains_short")},get stages(){return C().stages},get thresholds(){return C().thresholds},columns:h}),p(Ar,{id:"medium",active:()=>f()==="medium",get tf(){var T;return(T=C().timeframes)==null?void 0:T.medium},get stageError(){return Rr(C(),"chains_medium")},get stages(){return C().stages},get thresholds(){return C().thresholds},columns:h})]}}),null),y}}),p(E,{get when(){return l()},get children(){return p(Cl,{onClose:()=>u(!1)})}})]}})}_e(["click"]);is(()=>p(vd,{}),document.getElementById("root"));
