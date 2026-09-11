(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const os=!1,ls=(t,e)=>t===e,cs=Symbol("solid-track"),Wt={equals:ls};let Kr=Qr;const ke=1,jt=2,qr={owned:null,cleanups:null,context:null,owner:null},un={};var W=null;let dn=null,us=null,H=null,J=null,Ie=null,nn=0;function Lt(t,e){const n=H,r=W,i=t.length===0,s=e===void 0?r:e,a=i?qr:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>oe(()=>vt(a)));W=a,H=null;try{return Ue(o,!0)}finally{H=n,W=r}}function P(t,e){e=e?Object.assign({},Wt,e):Wt;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),Xr(n,i));return[Yr.bind(n),r]}function ds(t,e,n){const r=rn(t,e,!0,ke);lt(r)}function k(t,e,n){const r=rn(t,e,!1,ke);lt(r)}function Ke(t,e,n){Kr=_s;const r=rn(t,e,!1,ke);r.user=!0,Ie?Ie.push(r):lt(r)}function Y(t,e,n){n=n?Object.assign({},Wt,n):Wt;const r=rn(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,lt(r),Yr.bind(r)}function hs(t){return t&&typeof t=="object"&&"then"in t}function Jr(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=un,l=!1,c="initialValue"in s,h=typeof r=="function"&&Y(r);const d=new Set,[f,m]=(s.storage||P)(s.initialValue),[_,v]=P(void 0),[b,y]=P(void 0,{equals:!1}),[S,A]=P(c?"ready":"unresolved");W&&Me(()=>{for(const x of d.keys())x.decrement();d.clear(),a=null});function R(x,D,M,B){return a===x&&(a=null,B!==void 0&&(c=!0),(x===o||D===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(B,{value:D})),o=un,C(D,M)),D}function C(x,D){Ue(()=>{D===void 0&&m(()=>x),A(D!==void 0?"errored":c?"ready":"unresolved"),v(D);for(const M of d.keys())M.decrement();d.clear()},!1)}function E(){const x=ps,D=f(),M=_();if(M!==void 0&&!a)throw M;return H&&H.user,D}function L(x=!0){if(x!==!1&&l)return;l=!1;const D=h?h():r;if(D==null||D===!1){R(a,oe(f));return}let M;const B=o!==un?o:oe(()=>{try{return i(D,{value:f(),refetching:x})}catch(Q){M=Q}});if(M!==void 0){R(a,void 0,Mt(M),D);return}else if(!hs(B))return R(a,B,void 0,D),B;return a=B,"v"in B?(B.s===1?R(a,B.v,void 0,D):R(a,void 0,Mt(B.v),D),B):(l=!0,queueMicrotask(()=>l=!1),Ue(()=>{A(c?"refreshing":"pending"),y()},!1),B.then(Q=>R(B,Q,void 0,D),Q=>R(B,void 0,Mt(Q),D)))}Object.defineProperties(E,{state:{get:()=>S()},error:{get:()=>_()},loading:{get(){const x=S();return x==="pending"||x==="refreshing"}},latest:{get(){if(!c)return E();const x=_();if(x&&!a)throw x;return f()}}});let O=W;return h?ds(()=>(O=W,L(!1))):L(!1),[E,{refetch:x=>fs(O,()=>L(x)),mutate:m}]}function oe(t){if(H===null)return t();const e=H;H=null;try{return t()}finally{H=e}}function _t(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=oe(()=>e(a,i,s));return i=a,o}}function yt(t){Ke(()=>oe(t))}function Me(t){return W===null||(W.cleanups===null?W.cleanups=[t]:W.cleanups.push(t)),t}function fs(t,e){const n=W,r=H;W=t,H=null;try{return Ue(e,!0)}catch(i){Ln(i)}finally{W=n,H=r}}const[$h,Th]=P(!1);let ps;function Yr(){if(this.sources&&this.state)if(this.state===ke)lt(this);else{const t=J;J=null,Ue(()=>Gt(this),!1),J=t}if(H){const t=this.observers;if(!t||t[t.length-1]!==H){const e=t?t.length:0;H.sources?(H.sources.push(this),H.sourceSlots.push(e)):(H.sources=[this],H.sourceSlots=[e]),t?(t.push(H),this.observerSlots.push(H.sources.length-1)):(this.observers=[H],this.observerSlots=[H.sources.length-1])}}return this.value}function Xr(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Ue(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=dn&&dn.running;a&&dn.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?J.push(s):Ie.push(s),s.observers&&Zr(s)),a||(s.state=ke)}if(J.length>1e6)throw J=[],new Error},!1)),e}function lt(t){if(!t.fn)return;vt(t);const e=nn;gs(t,t.value,e)}function gs(t,e,n){let r;const i=W,s=H;H=W=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=ke,t.owned&&t.owned.forEach(vt),t.owned=null),t.updatedAt=n+1,Ln(a)}finally{H=s,W=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?Xr(t,r):t.value=r,t.updatedAt=n)}function rn(t,e,n,r=ke,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:W,context:W?W.context:null,pure:n};return W===null||W!==qr&&(W.owned?W.owned.push(s):W.owned=[s]),s}function zt(t){if(t.state===0)return;if(t.state===jt)return Gt(t);if(t.suspense&&oe(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<nn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===ke)lt(t);else if(t.state===jt){const r=J;J=null,Ue(()=>Gt(t,e[0]),!1),J=r}}function Ue(t,e){if(J)return t();let n=!1;e||(J=[]),Ie?n=!0:Ie=[],nn++;try{const r=t();return ms(n),r}catch(r){n||(Ie=null),J=null,Ln(r)}}function ms(t){if(J&&(Qr(J),J=null),t)return;const e=Ie;Ie=null,e.length&&Ue(()=>Kr(e),!1)}function Qr(t){for(let e=0;e<t.length;e++)zt(t[e])}function _s(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:zt(r)}for(e=0;e<n;e++)zt(t[e])}function Gt(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===ke?r!==e&&(!r.updatedAt||r.updatedAt<nn)&&zt(r):i===jt&&Gt(r,e)}}}function Zr(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=jt,n.pure?J.push(n):Ie.push(n),n.observers&&Zr(n))}}function vt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)vt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)vt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function Mt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function Ln(t,e=W){throw Mt(t)}const bs=Symbol("fallback");function tr(t){for(let e=0;e<t.length;e++)t[e]()}function ws(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Me(()=>tr(s)),()=>{let l=t()||[],c=l.length,h,d;return l[cs],oe(()=>{let m,_,v,b,y,S,A,R,C;if(c===0)a!==0&&(tr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[bs],i[0]=Lt(E=>(s[0]=E,n.fallback())),a=1);else if(a===0){for(i=new Array(c),d=0;d<c;d++)r[d]=l[d],i[d]=Lt(f);a=c}else{for(v=new Array(c),b=new Array(c),o&&(y=new Array(c)),S=0,A=Math.min(a,c);S<A&&r[S]===l[S];S++);for(A=a-1,R=c-1;A>=S&&R>=S&&r[A]===l[R];A--,R--)v[R]=i[A],b[R]=s[A],o&&(y[R]=o[A]);for(m=new Map,_=new Array(R+1),d=R;d>=S;d--)C=l[d],h=m.get(C),_[d]=h===void 0?-1:h,m.set(C,d);for(h=S;h<=A;h++)C=r[h],d=m.get(C),d!==void 0&&d!==-1?(v[d]=i[h],b[d]=s[h],o&&(y[d]=o[h]),d=_[d],m.set(C,d)):s[h]();for(d=S;d<c;d++)d in v?(i[d]=v[d],s[d]=b[d],o&&(o[d]=y[d],o[d](d))):i[d]=Lt(f);i=i.slice(0,a=c),r=l.slice(0)}return i});function f(m){if(s[d]=m,o){const[_,v]=P(d);return o[d]=v,e(l[d],_)}return e(l[d])}}}function p(t,e){return oe(()=>t(e||{}))}const ys=t=>`Stale read from <${t}>.`;function ee(t){const e="fallback"in t&&{fallback:()=>t.fallback};return Y(ws(()=>t.each,t.children,e||void 0))}function I(t){const e=t.keyed,n=Y(()=>t.when,void 0,void 0),r=e?n:Y(n,void 0,{equals:(i,s)=>!i==!s});return Y(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?oe(()=>s(e?i:()=>{if(!oe(r))throw ys("Show");return n()})):s}return t.fallback},void 0,void 0)}const K=t=>Y(()=>t());function vs(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const h=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],h)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const h=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],h),e[i]=n[s]}else{if(!c){c=new Map;let d=o;for(;d<s;)c.set(n[d],d++)}const h=c.get(e[a]);if(h!=null)if(o<h&&h<s){let d=a,f=1,m;for(;++d<i&&d<s&&!((m=c.get(e[d]))==null||m!==h+f);)f++;if(f>h-o){const _=e[a];for(;o<h;)t.insertBefore(n[o++],_)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const nr="_$DX_DELEGATE";function Is(t,e,n,r={}){let i;return Lt(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function g(t,e,n,r){let i;const s=()=>{const o=document.createElement("template");return o.innerHTML=t,o.content.firstChild},a=()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function le(t,e=window.document){const n=e[nr]||(e[nr]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,Ss))}}function ne(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function se(t,e){e==null?t.removeAttribute("class"):t.className=e}function he(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function qe(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function Es(t,e,n){return oe(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return Kt(t,e,r,n);k(i=>Kt(t,e(),i,n),r)}function Ss(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function Kt(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=Qe(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=Qe(t,n,r);else{if(s==="function")return k(()=>{let o=e();for(;typeof o=="function";)o=o();n=Kt(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if($n(o,e,n,i))return k(()=>n=Kt(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=Qe(t,n,r),a)return n}else l?n.length===0?rr(t,o,r):vs(t,n,o):(n&&Qe(t),rr(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=Qe(t,n,r,e);Qe(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function $n(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=$n(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=$n(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const h=String(o);l&&l.nodeType===3&&l.data===h?t.push(l):t.push(document.createTextNode(h))}}return i}function rr(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function Qe(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let Ut=null;function ks(t){Ut=t}async function ce(t,e={}){if(!Ut)return fetch(t,e);const n=new Headers(e.headers??{}),r=await Ut(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await Ut(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function ei(){const t=await ce("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function $s(){return ce("/api/me")}async function Ts(){const t=await ce("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function Cs(t){const e=await ce("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function As(t){const e=await ce("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function Rs(){return await ce("/api/run",{method:"POST"})}async function Ps(){return ce("/api/progress")}async function Os(){const t=await ce("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);return t.json()}async function xs(t){const e=await ce("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function Ns(t){const e=await ce(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function Ds(){const t=await ce("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}const Ls=()=>{};var ir={};/**
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
 */const ti=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Ms=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},ni={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,h=s>>2,d=(s&3)<<4|o>>4;let f=(o&15)<<2|c>>6,m=c&63;l||(m=64,a||(f=64)),r.push(n[h],n[d],n[f],n[m])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(ti(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Ms(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const d=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||c==null||d==null)throw new Us;const f=s<<2|o>>4;if(r.push(f),c!==64){const m=o<<4&240|c>>2;if(r.push(m),d!==64){const _=c<<6&192|d;r.push(_)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Us extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Fs=function(t){const e=ti(t);return ni.encodeByteArray(e,!0)},ri=function(t){return Fs(t).replace(/\./g,"")},ii=function(t){try{return ni.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Bs(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Vs=()=>Bs().__FIREBASE_DEFAULTS__,Hs=()=>{if(typeof process>"u"||typeof ir>"u")return;const t=ir.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Ws=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&ii(t[1]);return e&&JSON.parse(e)},Mn=()=>{try{return Ls()||Vs()||Hs()||Ws()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},js=t=>{var e,n;return(n=(e=Mn())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},si=()=>{var t;return(t=Mn())==null?void 0:t.config},ai=t=>{var e;return(e=Mn())==null?void 0:e[`_${t}`]};/**
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
 */class oi{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function X(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function zs(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(X())}function Gs(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Ks(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function qs(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Js(){const t=X();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Ys(){try{return typeof indexedDB=="object"}catch{return!1}}function Xs(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const Qs="FirebaseError";class Fe extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Qs,Object.setPrototypeOf(this,Fe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,$t.prototype.create)}}class $t{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Zs(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new Fe(i,o,r)}}function Zs(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function ea(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function st(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(sr(s)&&sr(a)){if(!st(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function sr(t){return t!==null&&typeof t=="object"}/**
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
 */function Tt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function ft(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function pt(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function ta(t,e){const n=new na(t,e);return n.subscribe.bind(n)}class na{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");ra(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=hn),i.error===void 0&&(i.error=hn),i.complete===void 0&&(i.complete=hn);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function ra(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function hn(){}/**
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
 */function $e(t){return t&&t._delegate?t._delegate:t}/**
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
 */function Un(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ia(t){return(await fetch(t,{credentials:"include"})).ok}class at{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const ze="[DEFAULT]";/**
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
 */class sa{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new oi;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(oa(e))try{this.getOrInitializeService({instanceIdentifier:ze})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=ze){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ze){return this.instances.has(e)}getOptions(e=ze){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:aa(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=ze){return this.component?this.component.multipleInstances?e:ze:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function aa(t){return t===ze?void 0:t}function oa(t){return t.instantiationMode==="EAGER"}/**
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
 */class la{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new sa(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var V;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(V||(V={}));const ca={debug:V.DEBUG,verbose:V.VERBOSE,info:V.INFO,warn:V.WARN,error:V.ERROR,silent:V.SILENT},ua=V.INFO,da={[V.DEBUG]:"log",[V.VERBOSE]:"log",[V.INFO]:"info",[V.WARN]:"warn",[V.ERROR]:"error"},ha=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=da[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class li{constructor(e){this.name=e,this._logLevel=ua,this._logHandler=ha,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in V))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?ca[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,V.DEBUG,...e),this._logHandler(this,V.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,V.VERBOSE,...e),this._logHandler(this,V.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,V.INFO,...e),this._logHandler(this,V.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,V.WARN,...e),this._logHandler(this,V.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,V.ERROR,...e),this._logHandler(this,V.ERROR,...e)}}const fa=(t,e)=>e.some(n=>t instanceof n);let ar,or;function pa(){return ar||(ar=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ga(){return or||(or=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ci=new WeakMap,Tn=new WeakMap,ui=new WeakMap,fn=new WeakMap,Fn=new WeakMap;function ma(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Le(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&ci.set(n,t)}).catch(()=>{}),Fn.set(e,t),e}function _a(t){if(Tn.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Tn.set(t,e)}let Cn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Tn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||ui.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Le(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function ba(t){Cn=t(Cn)}function wa(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(pn(this),e,...n);return ui.set(r,e.sort?e.sort():[e]),Le(r)}:ga().includes(t)?function(...e){return t.apply(pn(this),e),Le(ci.get(this))}:function(...e){return Le(t.apply(pn(this),e))}}function ya(t){return typeof t=="function"?wa(t):(t instanceof IDBTransaction&&_a(t),fa(t,pa())?new Proxy(t,Cn):t)}function Le(t){if(t instanceof IDBRequest)return ma(t);if(fn.has(t))return fn.get(t);const e=ya(t);return e!==t&&(fn.set(t,e),Fn.set(e,t)),e}const pn=t=>Fn.get(t);function va(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Le(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Le(a.result),l.oldVersion,l.newVersion,Le(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const Ia=["get","getKey","getAll","getAllKeys","count"],Ea=["put","add","delete","clear"],gn=new Map;function lr(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(gn.get(e))return gn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Ea.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Ia.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(o.shift())),(await Promise.all([c[n](...o),i&&l.done]))[0]};return gn.set(e,s),s}ba(t=>({...t,get:(e,n,r)=>lr(e,n)||t.get(e,n,r),has:(e,n)=>!!lr(e,n)||t.has(e,n)}));/**
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
 */class Sa{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(ka(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function ka(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const An="@firebase/app",cr="0.16.1";/**
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
 */const Ee=new li("@firebase/app"),$a="@firebase/app-compat",Ta="@firebase/analytics-compat",Ca="@firebase/analytics",Aa="@firebase/app-check-compat",Ra="@firebase/app-check",Pa="@firebase/auth",Oa="@firebase/auth-compat",xa="@firebase/database",Na="@firebase/data-connect",Da="@firebase/database-compat",La="@firebase/functions",Ma="@firebase/functions-compat",Ua="@firebase/installations",Fa="@firebase/installations-compat",Ba="@firebase/messaging",Va="@firebase/messaging-compat",Ha="@firebase/performance",Wa="@firebase/performance-compat",ja="@firebase/remote-config",za="@firebase/remote-config-compat",Ga="@firebase/storage",Ka="@firebase/storage-compat",qa="@firebase/firestore",Ja="@firebase/ai",Ya="@firebase/firestore-compat",Xa="firebase",Qa="12.18.0";/**
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
 */const Rn="[DEFAULT]",Za={[An]:"fire-core",[$a]:"fire-core-compat",[Ca]:"fire-analytics",[Ta]:"fire-analytics-compat",[Ra]:"fire-app-check",[Aa]:"fire-app-check-compat",[Pa]:"fire-auth",[Oa]:"fire-auth-compat",[xa]:"fire-rtdb",[Na]:"fire-data-connect",[Da]:"fire-rtdb-compat",[La]:"fire-fn",[Ma]:"fire-fn-compat",[Ua]:"fire-iid",[Fa]:"fire-iid-compat",[Ba]:"fire-fcm",[Va]:"fire-fcm-compat",[Ha]:"fire-perf",[Wa]:"fire-perf-compat",[ja]:"fire-rc",[za]:"fire-rc-compat",[Ga]:"fire-gcs",[Ka]:"fire-gcs-compat",[qa]:"fire-fst",[Ya]:"fire-fst-compat",[Ja]:"fire-vertex","fire-js":"fire-js",[Xa]:"fire-js-all"};/**
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
 */const qt=new Map,eo=new Map,Pn=new Map;function ur(t,e){try{t.container.addComponent(e)}catch(n){Ee.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function It(t){const e=t.name;if(Pn.has(e))return Ee.debug(`There were multiple attempts to register component ${e}.`),!1;Pn.set(e,t);for(const n of qt.values())ur(n,t);for(const n of eo.values())ur(n,t);return!0}function di(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Z(t){return t==null?!1:t.settings!==void 0}/**
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
 */const to={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},be=new $t("app","Firebase",to);/**
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
 */class no{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new at("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw be.create("app-deleted",{appName:this._name})}}/**
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
 */const Ct=Qa;function hi(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Rn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw be.create("bad-app-name",{appName:String(i)});if(n||(n=si()),!n)throw be.create("no-options");const s=qt.get(i);if(s)if(st(n,s.options)){if(st(r,s.config))return s;throw be.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw be.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new la(i);for(const l of Pn.values())a.addComponent(l);const o=new no(n,r,a);return qt.set(i,o),o}function ro(t=Rn){const e=qt.get(t);if(!e&&t===Rn&&si())return hi();if(!e)throw be.create("no-app",{appName:t});return e}function tt(t,e,n){let r=Za[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ee.warn(a.join(" "));return}It(new at(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const io="firebase-heartbeat-database",so=1,Et="firebase-heartbeat-store";let mn=null;function fi(){return mn||(mn=va(io,so,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Et)}catch(n){console.warn(n)}}}}).catch(t=>{throw be.create("idb-open",{originalErrorMessage:t.message})})),mn}async function ao(t){try{const n=(await fi()).transaction(Et),r=await n.objectStore(Et).get(pi(t));return await n.done,r}catch(e){if(e instanceof Fe)Ee.warn(e.message);else{const n=be.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ee.warn(n.message)}}}async function dr(t,e){try{const r=(await fi()).transaction(Et,"readwrite");await r.objectStore(Et).put(e,pi(t)),await r.done}catch(n){if(n instanceof Fe)Ee.warn(n.message);else{const r=be.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Ee.warn(r.message)}}}function pi(t){return`${t.name}!${t.options.appId}`}/**
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
 */const oo=1024,lo=30;class co{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new ho(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=hr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>lo){const a=fo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Ee.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=hr(),{heartbeatsToSend:r,unsentEntries:i}=uo(this._heartbeatsCache.heartbeats),s=ri(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Ee.warn(n),""}}}function hr(){return new Date().toISOString().substring(0,10)}function uo(t,e=oo){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),fr(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),fr(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class ho{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ys()?Xs().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await ao(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return dr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return dr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function fr(t){return ri(JSON.stringify({version:2,heartbeats:t})).length}function fo(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function po(t){It(new at("platform-logger",e=>new Sa(e),"PRIVATE")),It(new at("heartbeat",e=>new co(e),"PRIVATE")),tt(An,cr,t),tt(An,cr,"esm2020"),tt("fire-js","")}/**
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
 */po("");var go="firebase",mo="12.18.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */tt(go,mo,"app");function gi(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const _o=gi,mi=new $t("auth","Firebase",gi());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jt=new li("@firebase/auth");function _i(t,...e){Jt.logLevel<=V.WARN&&Jt.warn(`Auth (${Ct}): ${t}`,...e)}function Ft(t,...e){Jt.logLevel<=V.ERROR&&Jt.error(`Auth (${Ct}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function re(t,...e){throw Vn(t,...e)}function ae(t,...e){return Vn(t,...e)}function Bn(t,e,n){const r={..._o(),[e]:n};return new $t("auth","Firebase",r).create(e,{appName:t.name})}function fe(t){return Bn(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function bi(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&re(t,"argument-error"),Bn(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Vn(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return mi.create(t,...e)}function T(t,e,...n){if(!t)throw Vn(e,...n)}function we(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Ft(e),new Error(e)}function Se(t,e){t||we(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function On(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function bo(){return pr()==="http:"||pr()==="https:"}function pr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wo(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(bo()||Ks()||"connection"in navigator)?navigator.onLine:!0}function yo(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e,n){this.shortDelay=e,this.longDelay=n,Se(n>e,"Short delay should be less than long delay!"),this.isMobile=zs()||qs()}get(){return wo()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hn(t,e){Se(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wi{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;we("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;we("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;we("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vo={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Io=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Eo=new At(3e4,6e4);function Be(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function Ve(t,e,n,r,i={}){return yi(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Tt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:l,...s};return Gs()||(c.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&Un(t.emulatorConfig.host)&&(c.credentials="include"),wi.fetch()(await vi(t,t.config.apiHost,n,o),c)})}async function yi(t,e,n){t._canInitEmulator=!1;const r={...vo,...e};try{const i=new ko(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Nt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,c]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Nt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Nt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Nt(t,"user-disabled",a);const h=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw Bn(t,h,c);re(t,h)}}catch(i){if(i instanceof Fe)throw i;re(t,"network-request-failed",{message:String(i)})}}async function Rt(t,e,n,r,i={}){const s=await Ve(t,e,n,r,i);return"mfaPendingCredential"in s&&re(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function vi(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?Hn(t.config,i):`${t.config.apiScheme}://${i}`;return Io.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function So(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class ko{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(ae(this.auth,"network-request-failed")),Eo.get())})}}function Nt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=ae(t,e,r);return i.customData._tokenResponse=n,i}function gr(t){return t!==void 0&&t.enterprise!==void 0}class $o{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return So(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function To(t,e){return Ve(t,"GET","/v2/recaptchaConfig",Be(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Co(t,e){return Ve(t,"POST","/v1/accounts:delete",e)}async function Yt(t,e){return Ve(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bt(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Ao(t,e=!1){const n=$e(t),r=await n.getIdToken(e),i=Wn(r);T(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:bt(_n(i.auth_time)),issuedAtTime:bt(_n(i.iat)),expirationTime:bt(_n(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function _n(t){return Number(t)*1e3}function Wn(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Ft("JWT malformed, contained fewer than 3 sections"),null;try{const i=ii(n);return i?JSON.parse(i):(Ft("Failed to decode base64 JWT payload"),null)}catch(i){return Ft("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function mr(t){const e=Wn(t);return T(e,"internal-error"),T(typeof e.exp<"u","internal-error"),T(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function St(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Fe&&Ro(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Ro({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Po{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=bt(this.lastLoginAt),this.creationTime=bt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Xt(t){var d;const e=t.auth,n=await t.getIdToken(),r=await St(t,Yt(e,{idToken:n}));T(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(d=i.providerUserInfo)!=null&&d.length?Ii(i.providerUserInfo):[],a=xo(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),c=o?l:!1,h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new xn(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,h)}async function Oo(t){const e=$e(t);await Xt(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function xo(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Ii(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function No(t,e){const n=await yi(t,{},async()=>{const r=Tt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await vi(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&Un(t.emulatorConfig.host)&&(l.credentials="include"),wi.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Do(t,e){return Ve(t,"POST","/v2/accounts:revokeToken",Be(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){T(e.idToken,"internal-error"),T(typeof e.idToken<"u","internal-error"),T(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):mr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){T(e.length!==0,"internal-error");const n=mr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(T(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await No(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new nt;return r&&(T(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(T(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(T(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new nt,this.toJSON())}_performRefresh(){return we("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pe(t,e){T(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class ie{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Po(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new xn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await St(this,this.stsTokenManager.getToken(this.auth,e));return T(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Ao(this,e)}reload(){return Oo(this)}_assign(e){this!==e&&(T(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new ie({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){T(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Xt(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Z(this.auth.app))return Promise.reject(fe(this.auth));const e=await this.getIdToken();return await St(this,Co(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,c=n.createdAt??void 0,h=n.lastLoginAt??void 0,{uid:d,emailVerified:f,isAnonymous:m,providerData:_,stsTokenManager:v}=n;T(d&&v,e,"internal-error");const b=nt.fromJSON(this.name,v);T(typeof d=="string",e,"internal-error"),Pe(r,e.name),Pe(i,e.name),T(typeof f=="boolean",e,"internal-error"),T(typeof m=="boolean",e,"internal-error"),Pe(s,e.name),Pe(a,e.name),Pe(o,e.name),Pe(l,e.name),Pe(c,e.name),Pe(h,e.name);const y=new ie({uid:d,auth:e,email:i,emailVerified:f,displayName:r,isAnonymous:m,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:b,createdAt:c,lastLoginAt:h});return _&&Array.isArray(_)&&(y.providerData=_.map(S=>({...S}))),l&&(y._redirectEventId=l),y}static async _fromIdTokenResponse(e,n,r=!1){const i=new nt;i.updateFromServerResponse(n);const s=new ie({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Xt(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];T(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Ii(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new nt;o.updateFromIdToken(r);const l=new ie({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new xn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _r=new Map;function ye(t){Se(t instanceof Function,"Expected a class definition");let e=_r.get(t);return e?(Se(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,_r.set(t,e),e)}/**
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
 */class Ei{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Ei.type="NONE";const br=Ei;/**
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
 */function Bt(t,e,n){return`firebase:${t}:${e}:${n}`}class rt{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Bt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Bt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await Yt(this.auth,{idToken:e}).catch(()=>{});return n?ie._fromGetAccountInfoResponse(this.auth,n,e):null}return ie._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new rt(ye(br),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||ye(br);const a=Bt(r,e.config.apiKey,e.name);let o=null;for(const c of n)try{const h=await c._get(a);if(h){let d;if(typeof h=="string"){const f=await Yt(e,{idToken:h}).catch(()=>{});if(!f)break;d=await ie._fromGetAccountInfoResponse(e,f,h)}else d=ie._fromJSON(e,h);c!==s&&(o=d),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new rt(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(a)}catch{}})),new rt(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wr(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Ti(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Si(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Ai(e))return"Blackberry";if(Ri(e))return"Webos";if(ki(e))return"Safari";if((e.includes("chrome/")||$i(e))&&!e.includes("edge/"))return"Chrome";if(Ci(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Si(t=X()){return/firefox\//i.test(t)}function ki(t=X()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function $i(t=X()){return/crios\//i.test(t)}function Ti(t=X()){return/iemobile/i.test(t)}function Ci(t=X()){return/android/i.test(t)}function Ai(t=X()){return/blackberry/i.test(t)}function Ri(t=X()){return/webos/i.test(t)}function jn(t=X()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Lo(t=X()){var e;return jn(t)&&!!((e=window.navigator)!=null&&e.standalone)}function Mo(){return Js()&&document.documentMode===10}function Pi(t=X()){return jn(t)||Ci(t)||Ri(t)||Ai(t)||/windows phone/i.test(t)||Ti(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oi(t,e=[]){let n;switch(t){case"Browser":n=wr(X());break;case"Worker":n=`${wr(X())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ct}/${r}`}/**
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
 */class Uo{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function Fo(t,e={}){return Ve(t,"GET","/v2/passwordPolicy",Be(t,e))}/**
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
 */const Bo=6;class Vo{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??Bo,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new yr(this),this.idTokenSubscription=new yr(this),this.beforeStateQueue=new Uo(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=mi,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=ye(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await rt.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Yt(this,{idToken:e}),r=await ie._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(Z(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return T(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Xt(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=yo()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Z(this.app))return Promise.reject(fe(this));const n=e?$e(e):null;return n&&T(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&T(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Z(this.app)?Promise.reject(fe(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Z(this.app)?Promise.reject(fe(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ye(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Fo(this),n=new Vo(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new $t("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Do(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&ye(e)||this._popupRedirectResolver;T(n,this,"argument-error"),this.redirectPersistenceManager=await rt.create(this,[ye(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(T(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return T(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Oi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(Z(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&_i(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Te(t){return $e(t)}class yr{constructor(e){this.auth=e,this.observer=null,this.addObserver=ta(n=>this.observer=n)}get next(){return T(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Wo(t){sn=t}function xi(t){return sn.loadJS(t)}function jo(){return sn.recaptchaEnterpriseScript}function zo(){return sn.gapiScript}function Go(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class Ko{constructor(){this.enterprise=new qo}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class qo{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
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
 */const Jo="recaptcha-enterprise",Ni="NO_RECAPTCHA",vr="onFirebaseAuthREInstanceReady";class Oe{constructor(e){this.type=Jo,this.auth=Te(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{To(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const c=new $o(l);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,a(c.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;gr(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(c=>{a(c)}).catch(()=>{a(Ni)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Ko().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&gr(window.grecaptcha)&&Oe.scriptInjectionDeferred)await Oe.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=jo();l.length!==0&&(l+=o+`&onload=${vr}`),Oe.scriptInjectionDeferred=new oi,window[vr]=()=>{var c;(c=Oe.scriptInjectionDeferred)==null||c.resolve()},xi(l).then(()=>{var c;return(c=Oe.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{i(o,s,a)}).catch(c=>{a(c)})}}).catch(o=>{a(o)})})}}Oe.scriptInjectionDeferred=null;async function Ir(t,e,n,r=!1,i=!1){const s=new Oe(t);let a;if(i)a=Ni;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,c=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Nn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Ir(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Ir(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yo(t,e){const n=di(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(st(s,e??{}))return i;re(i,"already-initialized")}return n.initialize({options:e})}function Xo(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(ye);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Qo(t,e,n){const r=Te(t);T(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Di(e),{host:a,port:o}=Zo(e),l=o===null?"":`:${o}`,c={url:`${s}//${a}${l}/`},h=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){T(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),T(st(c,r.config.emulator)&&st(h,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=h,r.settings.appVerificationDisabledForTesting=!0,Un(a)?ia(`${s}//${a}${l}`):el()}function Di(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Zo(t){const e=Di(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Er(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Er(a)}}}function Er(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function el(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return we("not implemented")}_getIdTokenResponse(e){return we("not implemented")}_linkToIdToken(e,n){return we("not implemented")}_getReauthenticationResolver(e){return we("not implemented")}}async function tl(t,e){return Ve(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nl(t,e){return Rt(t,"POST","/v1/accounts:signInWithPassword",Be(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rl(t,e){return Rt(t,"POST","/v1/accounts:signInWithEmailLink",Be(t,e))}async function il(t,e){return Rt(t,"POST","/v1/accounts:signInWithEmailLink",Be(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt extends zn{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new kt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new kt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Nn(e,n,"signInWithPassword",nl);case"emailLink":return rl(e,{email:this._email,oobCode:this._password});default:re(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Nn(e,r,"signUpPassword",tl);case"emailLink":return il(e,{idToken:n,email:this._email,oobCode:this._password});default:re(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function it(t,e){return Rt(t,"POST","/v1/accounts:signInWithIdp",Be(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sl="http://localhost";class Ye extends zn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Ye(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):re("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new Ye(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return it(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,it(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,it(e,n)}buildRequest(){const e={requestUri:sl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Tt(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function al(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function ol(t){const e=ft(pt(t)).link,n=e?ft(pt(e)).deep_link_id:null,r=ft(pt(t)).deep_link_id;return(r?ft(pt(r)).link:null)||r||n||e||t}class Gn{constructor(e){const n=ft(pt(e)),r=n.apiKey??null,i=n.oobCode??null,s=al(n.mode??null);T(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=ol(e);try{return new Gn(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(){this.providerId=ct.PROVIDER_ID}static credential(e,n){return kt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=Gn.parseLink(n);return T(r,"argument-error"),kt._fromEmailAndCode(e,r.code,r.tenantId)}}ct.PROVIDER_ID="password";ct.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ct.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class xe extends Pt{constructor(){super("facebook.com")}static credential(e){return Ye._fromParams({providerId:xe.PROVIDER_ID,signInMethod:xe.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return xe.credentialFromTaggedObject(e)}static credentialFromError(e){return xe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return xe.credential(e.oauthAccessToken)}catch{return null}}}xe.FACEBOOK_SIGN_IN_METHOD="facebook.com";xe.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e extends Pt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Ye._fromParams({providerId:_e.PROVIDER_ID,signInMethod:_e.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return _e.credentialFromTaggedObject(e)}static credentialFromError(e){return _e.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return _e.credential(n,r)}catch{return null}}}_e.GOOGLE_SIGN_IN_METHOD="google.com";_e.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne extends Pt{constructor(){super("github.com")}static credential(e){return Ye._fromParams({providerId:Ne.PROVIDER_ID,signInMethod:Ne.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ne.credentialFromTaggedObject(e)}static credentialFromError(e){return Ne.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ne.credential(e.oauthAccessToken)}catch{return null}}}Ne.GITHUB_SIGN_IN_METHOD="github.com";Ne.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De extends Pt{constructor(){super("twitter.com")}static credential(e,n){return Ye._fromParams({providerId:De.PROVIDER_ID,signInMethod:De.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return De.credentialFromTaggedObject(e)}static credentialFromError(e){return De.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return De.credential(n,r)}catch{return null}}}De.TWITTER_SIGN_IN_METHOD="twitter.com";De.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ll(t,e){return Rt(t,"POST","/v1/accounts:signUp",Be(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await ie._fromIdTokenResponse(e,r,i),a=Sr(r);return new Xe({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Sr(r);return new Xe({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Sr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt extends Fe{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Qt.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new Qt(e,n,r,i)}}function Li(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Qt._fromErrorAndOperation(t,s,e,r):s})}async function cl(t,e,n=!1){const r=await St(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Xe._forOperation(t,"link",r)}/**
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
 */async function ul(t,e,n=!1){const{auth:r}=t;if(Z(r.app))return Promise.reject(fe(r));const i="reauthenticate";try{const s=await St(t,Li(r,i,e,t),n);T(s.idToken,r,"internal-error");const a=Wn(s.idToken);T(a,r,"internal-error");const{sub:o}=a;return T(t.uid===o,r,"user-mismatch"),Xe._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&re(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mi(t,e,n=!1){if(Z(t.app))return Promise.reject(fe(t));const r="signIn",i=await Li(t,r,e),s=await Xe._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function dl(t,e){return Mi(Te(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ui(t){const e=Te(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function hl(t,e,n){if(Z(t.app))return Promise.reject(fe(t));const r=Te(t),a=await Nn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",ll).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Ui(t),l}),o=await Xe._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function fl(t,e,n){return Z(t.app)?Promise.reject(fe(t)):dl($e(t),ct.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Ui(t),r})}function pl(t,e,n,r){return $e(t).onIdTokenChanged(e,n,r)}function gl(t,e,n){return $e(t).beforeAuthStateChanged(e,n)}function ml(t,e,n,r){return $e(t).onAuthStateChanged(e,n,r)}function _l(t){return $e(t).signOut()}const Zt="__sak";/**
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
 */class Fi{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Zt,"1"),this.storage.removeItem(Zt),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bl=1e3,wl=10;class Bi extends Fi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Pi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);Mo()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,wl):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},bl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Bi.type="LOCAL";const yl=Bi;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vi extends Fi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Vi.type="SESSION";const Hi=Vi;/**
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
 */function vl(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class on{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new on(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async c=>c(n.origin,s)),l=await vl(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}on.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kn(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class Il{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const c=Kn("",20);i.port1.start();const h=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(d){const f=d;if(f.data.eventId===c)switch(f.data.status){case"ack":clearTimeout(h),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(f.data.response);break;default:clearTimeout(h),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(){return window}function El(t){pe().location.href=t}/**
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
 */function Wi(){return typeof pe().WorkerGlobalScope<"u"&&typeof pe().importScripts=="function"}async function Sl(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function kl(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function $l(){return Wi()?self:null}/**
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
 */const ji="firebaseLocalStorageDb",Tl=1,en="firebaseLocalStorage",zi="fbase_key";class Ot{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function ln(t,e){return t.transaction([en],e?"readwrite":"readonly").objectStore(en)}function Cl(){const t=indexedDB.deleteDatabase(ji);return new Ot(t).toPromise()}function Gi(){const t=indexedDB.open(ji,Tl);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(en,{keyPath:zi})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(en)?e(r):(r.close(),await Cl(),e(await Gi()))})})}async function kr(t,e,n){const r=ln(t,!0).put({[zi]:e,value:n});return new Ot(r).toPromise()}async function Al(t,e){const n=ln(t,!1).get(e),r=await new Ot(n).toPromise();return r===void 0?null:r.value}function $r(t,e){const n=ln(t,!0).delete(e);return new Ot(n).toPromise()}const Rl=800,Pl=3;class Ki{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=Gi(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>Pl)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Wi()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=on._getInstance($l()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await Sl(),!this.activeServiceWorker)return;this.sender=new Il(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||kl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await kr(e,Zt,"1"),await $r(e,Zt)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>kr(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>Al(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>$r(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=ln(i,!1).getAll();return new Ot(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||_i(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Rl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}Ki.type="LOCAL";const Ol=Ki;new At(3e4,6e4);/**
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
 */function qn(t,e){return e?ye(e):(T(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class Jn extends zn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return it(e,this._buildIdpRequest())}_linkToIdToken(e,n){return it(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return it(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function xl(t){return Mi(t.auth,new Jn(t),t.bypassAuthState)}function Nl(t){const{auth:e,user:n}=t;return T(n,e,"internal-error"),ul(n,new Jn(t),t.bypassAuthState)}async function Dl(t){const{auth:e,user:n}=t;return T(n,e,"internal-error"),cl(n,new Jn(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qi{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return xl;case"linkViaPopup":case"linkViaRedirect":return Dl;case"reauthViaPopup":case"reauthViaRedirect":return Nl;default:re(this.auth,"internal-error")}}resolve(e){Se(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Se(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ll=new At(2e3,1e4);async function Ml(t,e,n){if(Z(t.app))return Promise.reject(ae(t,"operation-not-supported-in-this-environment"));const r=Te(t);bi(t,e,an);const i=qn(r,n);return new Ge(r,"signInViaPopup",e,i).executeNotNull()}class Ge extends qi{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Ge.currentPopupAction&&Ge.currentPopupAction.cancel(),Ge.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return T(e,this.auth,"internal-error"),e}async onExecution(){Se(this.filter.length===1,"Popup operations only handle one event");const e=Kn();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(ae(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(ae(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ge.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ae(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Ll.get())};e()}}Ge.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ul="pendingRedirect",Vt=new Map;class Fl extends qi{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Vt.get(this.auth._key());if(!e){try{const r=await Bl(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Vt.set(this.auth._key(),e)}return this.bypassAuthState||Vt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Bl(t,e){const n=Yi(e),r=Ji(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function Vl(t,e){return Ji(t)._set(Yi(e),"true")}function Hl(t,e){Vt.set(t._key(),e)}function Ji(t){return ye(t._redirectPersistence)}function Yi(t){return Bt(Ul,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wl(t,e,n){return jl(t,e,n)}async function jl(t,e,n){if(Z(t.app))return Promise.reject(fe(t));const r=Te(t);bi(t,e,an),await r._initializationPromise;const i=qn(r,n);return await Vl(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function zl(t,e,n=!1){if(Z(t.app))return Promise.reject(fe(t));const r=Te(t),i=qn(r,e),a=await new Fl(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gl=600*1e3;class Kl{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!ql(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!Xi(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(ae(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Gl&&this.cachedEventUids.clear(),this.cachedEventUids.has(Tr(e))}saveEventToCache(e){this.cachedEventUids.add(Tr(e)),this.lastProcessedEventTime=Date.now()}}function Tr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Xi({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function ql(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Xi(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jl(t,e={}){return Ve(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yl=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Xl=/^https?/;async function Ql(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Jl(t);for(const n of e)try{if(Zl(n))return}catch{}re(t,"unauthorized-domain")}function Zl(t){const e=On(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!Xl.test(n))return!1;if(Yl.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const ec=new At(3e4,6e4);function Cr(){const t=pe().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function tc(t){return new Promise((e,n)=>{var i,s,a;function r(){Cr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Cr(),n(ae(t,"network-request-failed"))},timeout:ec.get()})}if((s=(i=pe().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=pe().gapi)!=null&&a.load)r();else{const o=Go("iframefcb");return pe()[o]=()=>{gapi.load?r():n(ae(t,"network-request-failed"))},xi(`${zo()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw Ht=null,e})}let Ht=null;function nc(t){return Ht=Ht||tc(t),Ht}/**
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
 */const rc=new At(5e3,15e3),ic="__/auth/iframe",sc="emulator/auth/iframe",ac={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},oc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function lc(t){const e=t.config;T(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Hn(e,sc):`https://${t.config.authDomain}/${ic}`,r={apiKey:e.apiKey,appName:t.name,v:Ct},i=oc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Tt(r).slice(1)}`}async function cc(t){const e=await nc(t),n=pe().gapi;return T(n,t,"internal-error"),e.open({where:document.body,url:lc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:ac,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=ae(t,"network-request-failed"),o=pe().setTimeout(()=>{s(a)},rc.get());function l(){pe().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
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
 */const uc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},dc=500,hc=600,fc="_blank",pc="http://localhost";class Ar{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function gc(t,e,n,r=dc,i=hc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...uc,width:r.toString(),height:i.toString(),top:s,left:a},c=X().toLowerCase();n&&(o=$i(c)?fc:n),Si(c)&&(e=e||pc,l.scrollbars="yes");const h=Object.entries(l).reduce((f,[m,_])=>`${f}${m}=${_},`,"");if(Lo(c)&&o!=="_self")return mc(e||"",o),new Ar(null);const d=window.open(e||"",o,h);T(d,t,"popup-blocked");try{d.focus()}catch{}return new Ar(d)}function mc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const _c="__/auth/handler",bc="emulator/auth/handler",wc=encodeURIComponent("fac");async function Rr(t,e,n,r,i,s){T(t.config.authDomain,t,"auth-domain-config-required"),T(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Ct,eventId:i};if(e instanceof an){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",ea(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,d]of Object.entries({}))a[h]=d}if(e instanceof Pt){const h=e.getScopes().filter(d=>d!=="");h.length>0&&(a.scopes=h.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const h of Object.keys(o))o[h]===void 0&&delete o[h];const l=await t._getAppCheckToken(),c=l?`#${wc}=${encodeURIComponent(l)}`:"";return`${yc(t)}?${Tt(o).slice(1)}${c}`}function yc({config:t}){return t.emulator?Hn(t,bc):`https://${t.authDomain}/${_c}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bn="webStorageSupport";class vc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Hi,this._completeRedirectFn=zl,this._overrideRedirectResult=Hl}async _openPopup(e,n,r,i){var a;Se((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Rr(e,n,r,On(),i);return gc(e,s,Kn())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Rr(e,n,r,On(),i);return El(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Se(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await cc(e),r=new Kl(e);return n.register("authEvent",i=>(T(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(bn,{type:bn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[bn];s!==void 0&&n(!!s),re(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Ql(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Pi()||ki()||jn()}}const Ic=vc;var Pr="@firebase/auth",Or="1.13.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ec{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){T(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sc(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function kc(t){It(new at("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;T(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Oi(t)},c=new Ho(r,i,s,l);return Xo(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),It(new at("auth-internal",e=>{const n=Te(e.getProvider("auth").getImmediate());return(r=>new Ec(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),tt(Pr,Or,Sc(t)),tt(Pr,Or,"esm2020")}/**
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
 */const $c=300,Tc=ai("authIdTokenMaxAge")||$c;let xr=null;const Cc=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Tc)return;const i=n==null?void 0:n.token;xr!==i&&(xr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Ac(t=ro()){const e=di(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Yo(t,{popupRedirectResolver:Ic,persistence:[Ol,yl,Hi]}),r=ai("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=Cc(s.toString());gl(n,a,()=>a(n.currentUser)),pl(n,o=>a(o))}}const i=js("auth");return i&&Qo(n,`http://${i}`),n}function Rc(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}Wo({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=ae("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",Rc().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});kc("Browser");const Pc={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},me=Pc,ot=!!me.VITE_FIREBASE_APP_ID;let wn=null;function Ze(){if(!ot)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!wn){const t=hi({apiKey:me.VITE_FIREBASE_API_KEY,authDomain:me.VITE_FIREBASE_AUTH_DOMAIN,projectId:me.VITE_FIREBASE_PROJECT_ID,appId:me.VITE_FIREBASE_APP_ID,...me.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:me.VITE_FIREBASE_STORAGE_BUCKET},...me.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:me.VITE_FIREBASE_MESSAGING_SENDER_ID}});wn=Ac(t)}return wn}function Nr(){return new _e}async function Dr(){if(!ot)return;const t=Ze();t.currentUser&&await _l(t)}var Oc=g(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),xc=g('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),Nc=g("<button type=button class=gate-toggle>"),Dc=g("<div class=gate-or>── or ──"),Lc=g("<button type=button class=btn>Continue with Google"),Mc=g("<div class=gate-error role=alert>"),Uc=g("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),Fc=g("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),Bc=g("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const Vc={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Lr(t){const e=(t==null?void 0:t.code)??"";return Vc[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function Hc(t){return(()=>{var e=Oc(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),he(l,"click",t.onSignOut),e})()}function Wc(){const[t,e]=P("signin"),[n,r]=P(""),[i,s]=P(""),[a,o]=P(!1),[l,c]=P("");ks(async f=>{if(!ot)return null;const m=Ze().currentUser;return m?await m.getIdToken(f):null});async function h(f){if(f.preventDefault(),!a()){o(!0),c("");try{const m=Ze();t()==="create"?await hl(m,n(),i()):await fl(m,n(),i())}catch(m){c(Lr(m))}finally{o(!1)}}}async function d(){if(!a()){o(!0),c("");try{await Ml(Ze(),Nr())}catch(f){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(f==null?void 0:f.code)){await Wl(Ze(),Nr());return}c(Lr(f))}finally{o(!1)}}}return(()=>{var f=Uc(),m=f.firstChild;return m.firstChild,u(m,p(I,{when:ot,get fallback(){return[Fc(),Bc()]},get children(){return[(()=>{var _=xc(),v=_.firstChild,b=v.firstChild,y=b.nextSibling,S=v.nextSibling,A=S.firstChild,R=A.nextSibling,C=S.nextSibling;return _.addEventListener("submit",h),y.$$input=E=>r(E.currentTarget.value),R.$$input=E=>s(E.currentTarget.value),u(C,(()=>{var E=K(()=>!!a());return()=>E()?"Working…":t()==="create"?"Create account":"Sign in"})()),k(E=>{var L=t()==="create"?"new-password":"current-password",O=a();return L!==E.e&&ne(R,"autocomplete",E.e=L),O!==E.t&&(C.disabled=E.t=O),E},{e:void 0,t:void 0}),k(()=>y.value=n()),k(()=>R.value=i()),_})(),(()=>{var _=Nc();return _.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(_,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),k(()=>_.disabled=a()),_})(),Dc(),(()=>{var _=Lc();return _.$$click=d,k(()=>_.disabled=a()),_})(),p(I,{get when(){return l()},get children(){var _=Mc();return u(_,l),_}})]}}),null),f})()}le(["click","input"]);var jc=g("<div class=gate-error role=alert>"),zc=g("<p class=gate-note>No grant-file entries yet."),Gc=g("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),Kc=g('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),qc=g("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function Jc(t){const[e,n]=P([]),[r,i]=P([]),[s,a]=P(""),[o,l]=P(!1),[c,h]=P(""),d=b=>{n((b==null?void 0:b.file_grants)??[]),i((b==null?void 0:b.static_emails)??[])};yt(async()=>{try{d(await Ts())}catch{h("Could not load the grant list.")}});const m=b=>{b.key==="Escape"&&t.onClose()};yt(()=>{window.addEventListener("keydown",m),Me(()=>window.removeEventListener("keydown",m));const b=document.querySelector(".access-add input");b==null||b.focus()});const _=async b=>{if(b.preventDefault(),!(o()||!s().trim())){l(!0),h("");try{d(await Cs(s())),a("")}catch(y){h(y.message)}l(!1)}},v=async b=>{if(!o()){l(!0),h("");try{d(await As(b))}catch(y){h(y.message)}l(!1)}};return(()=>{var b=Kc(),y=b.firstChild,S=y.firstChild,A=S.nextSibling,R=A.nextSibling,C=R.firstChild,E=C.nextSibling,L=R.nextSibling;return he(b,"click",t.onClose),y.$$click=O=>O.stopPropagation(),u(y,p(I,{get when(){return c()},get children(){var O=jc();return u(O,c),O}}),R),u(y,p(ee,{get each(){return e()},children:O=>(()=>{var x=qc(),D=x.firstChild,M=D.nextSibling;return u(D,O),M.$$click=()=>v(O),ne(M,"title",`Remove ${O}`),ne(M,"aria-label",`Remove ${O}`),k(()=>M.disabled=o()),x})()}),R),u(y,p(I,{get when(){return e().length===0},get children(){return zc()}}),R),R.addEventListener("submit",_),C.$$input=O=>a(O.currentTarget.value),u(E,()=>o()?"…":"Add"),u(y,p(I,{get when(){return r().length>0},get children(){var O=Gc();return O.firstChild,u(O,()=>r().join(", "),null),O}}),L),he(L,"click",t.onClose),k(()=>E.disabled=o()),k(()=>C.value=s()),b})()}le(["click","input"]);const ve=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),wt=(t,e,n)=>Math.min(n,Math.max(e,t));function Yc(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:wt((n-t)/r,0,1)}function Xc(t,e,n,r,i=ve){if(n<i.minRateOfReturn||t<=0)return null;const s=wt(t/2,0,1),a=wt(e,0,1),o=Math.min(n/i.idealReturn,1),l=wt((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function Qc(t,e=ve){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?wt(1+t.delta,0,1):Yc(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),Xc(r,a,n,i,e)}function Zc(t,e=ve.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function eu(t){return t.weightSharpe===ve.weightSharpe&&t.weightSafety===ve.weightSafety&&t.weightReturn===ve.weightReturn&&t.minRateOfReturn===ve.minRateOfReturn}var tu=g("<span class=hint>production defaults · drag to re-rank live"),nu=g("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),ru=g('<span class="hint hint-custom">custom weights'),iu=g("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function su(){const[t,e]=P({...ve});return{params:t,isCustom:()=>!eu(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...ve})}}const au=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function ou(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=nu(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,p(I,{get when(){return!e()},get fallback(){return ru()},get children(){return tu()}}),null),u(s,p(ee,{each:au,children:o=>(()=>{var l=iu(),c=l.firstChild,h=c.firstChild,d=h.nextSibling,f=c.nextSibling;return u(c,()=>o.label,h),u(d,()=>o.fmt(t.scoring.params()[o.key]),null),u(d,p(I,{get when(){return o.weight},get children(){return[" ","· ",K(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),f.$$input=m=>t.scoring.setParam(o.key,Number(m.currentTarget.value)),k(m=>{var _=o.max,v=o.step;return _!==m.e&&ne(f,"max",m.e=_),v!==m.t&&ne(f,"step",m.t=v),m},{e:void 0,t:void 0}),k(()=>f.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),k(()=>r.open=e()),r})()}le(["click","input"]);const cn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],gt=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],Qi="webapp.columns.v1";function lu(){try{const t=localStorage.getItem(Qi);if(!t)return gt;const e=JSON.parse(t);if(!Array.isArray(e))return gt;const n=new Set(cn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:gt}catch{return gt}}function cu(t){try{localStorage.setItem(Qi,JSON.stringify(t))}catch{}}var uu=g("<div class=pop-backdrop>"),du=g('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),hu=g("<span class=colpicker><button type=button class=tool-btn>columns ▾"),fu=g("<label class=pick-item><input type=checkbox>");function pu(t){const[e,n]=P(!1);return(()=>{var r=hu(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,p(I,{get when(){return e()},get children(){return[(()=>{var s=uu();return s.$$click=()=>n(!1),s})(),(()=>{var s=du(),a=s.firstChild,o=a.nextSibling;return u(a,p(ee,{each:cn,children:l=>(()=>{var c=fu(),h=c.firstChild;return h.addEventListener("change",d=>t.store.toggle(l.id,d.currentTarget.checked)),u(c,()=>l.label,null),k(()=>h.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),k(()=>ne(i,"aria-expanded",e())),r})()}le(["click"]);var gu=g('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),mu=g("<span class=pggap>…"),_u=g("<button type=button class=pgbtn>");function bu(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function wu(t){const e=Y(()=>bu(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=gu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,p(ee,{get each(){return e()},children:h=>h==="…"?mu():(()=>{var d=_u();return d.$$click=()=>t.onGo(h),u(d,h),k(()=>d.classList.toggle("active",h===t.page())),d})()}),c),c.$$click=r,k(h=>{var d=t.page()<=1,f=t.page()>=t.pageCount();return d!==h.e&&(l.disabled=h.e=d),f!==h.t&&(c.disabled=h.t=f),h},{e:void 0,t:void 0}),i})()}le(["click"]);var yu=g("<span class=tip>");function ut(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=yu();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?Es(i,r):e=r,u(r,()=>t.children),k(()=>ne(r,"data-tip",t.text??"")),r})()}le(["focusin"]);const Je="∅";function z(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function mt(t){return Number(t??0).toLocaleString("en-US")}function tn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function Zi(t){return es(t,{hour:"2-digit",minute:"2-digit"})}function vu(t){return es(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function es(t,e){const n=tn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const ts={text:Je,isNull:!0},yn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Mr(t,e){return!e||z(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function Iu(t,e){return!e||z(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function Eu(t){if(!t||typeof t!="object"||z(t.report_date))return ts;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function te(t,e){if(z(e))return ts;switch(t){case"fixed2":return yn(e,2);case"fixed3":return yn(e,3);case"ivrv":return yn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return Eu(e);default:return{text:String(e),isNull:!1}}}const Ur=t=>Number(t*100).toFixed(0);function Su(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Ur(e.momentum_high),s=Ur(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function dt(t,e){return Su(e)[t]??t}var ns=g("<span class=tip-target>"),ku=g("<div class=kv><span class=kv-label></span><span class=kv-value>"),$u=g("<span class=tip-target>Strike position in band"),Tu=g('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),Cu=g("<div class=exp-block><h4>"),Au=g("<div class=kv-value>Band unavailable (∅)"),Ru=g("<div><span class=marker-tick></span><span class=marker-cap><br>"),Pu=g("<div class=exp-block><h4>Premium economics"),Ou=g("<b>"),xu=g('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),Nu=g("<div class=muted-note>earnings-discounted safety applied"),Du=g("<div class=exp-block><h4>Score breakdown"),Lu=g("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),Mu=g('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),Uu=g("<span class=muted-note>all columns visible"),Fu=g('<div class="exp-block exp-chips"><h4>Hidden columns'),Bu=g("<span class=tip-target>: "),Vu=g("<span>"),Hu=g("<span class=tip-target>band safety is already discounted by the earnings rule."),Wu=g("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),ju=g("<div class=expansion><div class=exp-grid>");const vn={sharpe:.2,safety:.4,return_part:.4};function In(t,e=2){return z(t)?Je:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function de(t,e,n){return(()=>{var r=ku(),i=r.firstChild,s=i.nextSibling;return u(i,p(ut,{get text(){return dt(t,e)},get children(){var a=ns();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function zu(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=z(e.mid)?null:e.strike-e.mid,s=i!=null&&!z(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!z(a)&&l>a&&!z(e.strike),h=f=>{if(z(f))return null;const m=(f-a)/(l-a)*100;return Math.min(100,Math.max(0,m))},d=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(f=>h(f.v)!=null):[];return(()=>{var f=Cu(),m=f.firstChild;return u(m,p(ut,{get text(){return dt("band_range",t.thresholds)},get children(){return $u()}})),u(f,p(I,{when:c,get fallback(){return Au()},get children(){var _=Tu(),v=_.firstChild;return u(_,p(ee,{each:d,children:b=>(()=>{var y=Ru(),S=y.firstChild,A=S.nextSibling,R=A.firstChild;return u(A,()=>b.label,R),u(A,()=>te("fixed2",b.v).text,null),k(C=>{var E=`marker ${b.cls}`,L=`${h(b.v)}%`;return E!==C.e&&se(y,C.e=E),L!==C.t&&qe(y,"left",C.t=L),C},{e:void 0,t:void 0}),y})()}),null),k(b=>{var y=`${h(e.strike_from)}%`,S=`${Math.max(0,h(e.strike_to)-h(e.strike_from))}%`;return y!==b.e&&qe(v,"left",b.e=y),S!==b.t&&qe(v,"width",b.t=S),b},{e:void 0,t:void 0}),_}}),null),u(f,()=>de("band_range",t.thresholds,`${te("fixed2",e.strike_from).text} → ${te("fixed2",e.strike_to).text}`),null),u(f,()=>de("band_depth",t.thresholds,r==null?Je:`${(r*100).toFixed(1)}%`),null),u(f,()=>de("cushion_be",t.thresholds,s==null?Je:`${s.toFixed(1)}%`),null),f})()}function Gu(t){const e=t.row,n=z(e.strike)?null:e.strike*100,r=z(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=te("pct1",e.rate_of_return);return(()=>{var a=Pu();return a.firstChild,u(a,()=>de("capital",t.thresholds,n==null?Je:In(n,0)),null),u(a,()=>de("premium",t.thresholds,r==null?Je:In(r)),null),u(a,()=>de("breakeven",t.thresholds,i==null?Je:In(i)),null),u(a,()=>de("ann_ror",t.thresholds,(()=>{var o=Ou();return u(o,()=>s.text),o})()),null),u(a,()=>de("bid",t.thresholds,te("fixed2",e.bid).text),null),u(a,()=>de("ask",t.thresholds,te("fixed2",e.ask).text),null),u(a,()=>de("expiration",t.thresholds,e.expiration),null),a})()}function Ku(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:vn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:vn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:vn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=Du();return i.firstChild,u(i,p(I,{when:n,get fallback(){return(()=>{var s=Lu(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>te("fixed3",e.score).text),s})()},get children(){return[p(ee,{each:r,children:s=>{const a=z(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=Mu(),l=o.firstChild,c=l.firstChild,h=c.nextSibling,d=h.firstChild,f=d.nextSibling;f.nextSibling;var m=l.nextSibling,_=m.firstChild,v=m.nextSibling;return u(l,p(ut,{get text(){return dt(s.key,t.thresholds)},get children(){var b=ns();return u(b,()=>s.label),b}}),c),u(h,()=>s.weight*100,f),u(v,()=>te("fixed3",s.v).text),k(b=>qe(_,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=xu(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>te("fixed3",e.score).text),s})(),p(I,{get when(){return e.earnings_before_expiry},get children(){return Nu()}})]}}),null),i})()}function qu(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:te(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=Fu();return n.firstChild,u(n,p(ee,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=Vu();return u(s,p(ut,{get text(){return dt(r.id,t.thresholds)},get children(){var a=Bu(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),k(()=>se(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,p(I,{get when(){return t.hiddenDefs.length===0},get children(){return Uu()}}),null),n})()}function Ju(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=ju(),i=r.firstChild;return u(r,p(I,{when:n,get children(){var s=Wu(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,h=c.nextSibling,d=h.nextSibling;return d.nextSibling,u(o,()=>n.report_date),u(s,p(I,{get when(){return n.report_time},children:f=>f().replaceAll("_"," ")}),c),u(s,p(I,{get when(){return!z(n.expected_eps)},get children(){return[" ","· expected EPS ",K(()=>te("fixed2",n.expected_eps).text)]}}),d),u(s,p(ut,{get text(){return dt("earnings_before_expiry",t.thresholds)},get children(){return Hu()}}),null),s}}),i),u(i,p(zu,{row:e,get thresholds(){return t.thresholds}}),null),u(i,p(Gu,{row:e,get thresholds(){return t.thresholds}}),null),u(i,p(Ku,{row:e,get thresholds(){return t.thresholds}}),null),u(i,p(qu,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var Yu=g("<span class=null-mark>"),Xu=g("<span class=star>★"),Qu=g("<td><b>"),En=g("<span>"),Fr=g("<td class=num>"),Zu=g("<span class=score-frozen>prod "),ed=g('<td class="num score-cell">'),td=g('<span class="score-frozen readmit">re-admitted'),nd=g("<td>"),rd=g("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),id=g("<span class=sort-arrow>"),sd=g("<span class=tip-target>"),ad=g("<th role=button tabindex=0>"),od=g("<tr class=expandable><td class=exp-col>"),ld=g("<tr class=exp-row><td>");const cd=t=>`${t.underlying}|${t.strike}`;function ud(t){return(()=>{var e=Yu();return u(e,()=>t.text),e})()}function Dt(t){const e=te(t.kind,t.value);return p(I,{get when(){return!e.isNull},get fallback(){return p(ud,{get text(){return e.text}})},get children(){return e.text}})}function dd(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=Qu(),i=r.firstChild;return u(r,p(I,{get when(){return t.pickRank!=null},get children(){var s=Xu();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,p(I,{get when(){return Mr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=En();return k(()=>se(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Fr();return u(r,p(I,{get when(){return Mr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=En();return k(()=>se(s,`dot ${i()}`)),s})()," "]}),null),u(r,p(Dt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=ed();return u(r,p(Dt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,p(I,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return p(I,{get when(){return!z(n.frozen_score)},get fallback(){return p(I,{get when(){return!z(n.score)},get children(){return td()}})},get children(){var i=Zu();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=Fr();return u(r,p(Dt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,p(I,{get when(){return Iu(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=En();return u(s,i),k(()=>se(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=nd();return u(r,p(Dt,{get kind(){return e.kind},get value(){return n[e.id]}})),k(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function hd(t){const e=Y(()=>cn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=rd(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,p(ee,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=ad();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,p(ut,{get text(){return dt(a.id,t.thresholds)},get children(){var c=sd();return u(c,()=>a.label,null),u(c,p(I,{get when(){return o()},get children(){return[" ",(()=>{var h=id();return u(h,()=>t.sortDir()==="asc"?"↑":"↓"),h})()]}}),null),c}})),k(c=>{var h=a.align==="num",d=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return h!==c.e&&l.classList.toggle("num",c.e=h),d!==c.t&&ne(l,"aria-sort",c.t=d),c},{e:void 0,t:void 0}),l})()}}),null),u(s,p(ee,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>cd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var h=od(),d=h.firstChild;return h.$$click=()=>t.onToggleRow(a),u(d,()=>c()?"▾":"▸"),u(h,p(ee,{get each(){return e()},children:f=>p(dd,{col:f,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),k(f=>{var m=o()!=null,_=!!z(a.score),v=!!c();return m!==f.e&&h.classList.toggle("pick",f.e=m),_!==f.t&&h.classList.toggle("prow",f.t=_),v!==f.a&&h.classList.toggle("open",f.a=v),f},{e:void 0,t:void 0,a:void 0}),h})(),p(I,{get when(){return c()},get children(){var h=ld(),d=h.firstChild;return u(d,p(Ju,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),k(()=>ne(d,"colspan",e().length+1)),h}})]}})),n})()}le(["click","keydown"]);function fd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const et=t=>z(t);function pd(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=et(a),c=et(o);return l||c?l&&c?0:l?1:-1:r*fd(a,o)})}function gd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=et(r),a=et(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,h=et(l),d=et(c);return h||d?h&&d?0:h?1:-1:c-l})}var md=g("<div class=stage-badges>"),_d=g("<pre class=errbox>"),bd=g("<details><summary> "),wd=g("<div class=scroll-region>"),yd=g('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),vd=g("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),Id=g("<div class=empty-panel>No rows match the current filter."),Ed=g('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Sn=100,Sd=150,Br={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function kd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=md();return u(i,p(ee,{get each(){return t.stages??[]},children:s=>(()=>{var a=bd(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,p(I,{get when(){return s.error},get children(){var c=_d();return u(c,()=>s.error),c}}),null),k(()=>se(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function Vr(t){const[e,n]=P(""),[r,i]=P(""),[s,a]=P(!0),[o,l]=P(null),[c,h]=P("asc"),[d,f]=P(1);let m;Me(()=>clearTimeout(m));const _=()=>{var w;return((w=t.tf)==null?void 0:w.rows)??[]},v=Y(()=>{const w=t.scoring.params(),N=t.scoring.isCustom();return _().map(F=>{const U=Qc(F,w);return{...F,frozen_score:F.score,live_parts:U,score:N?U==null?null:U.total:F.score}})}),b=Y(()=>v().filter(w=>!z(w.score)&&z(w.frozen_score)).length),y=w=>{const N=w.currentTarget.value;n(N),clearTimeout(m),m=setTimeout(()=>{i(N.trim().toLowerCase()),f(1)},Sd)},S=w=>{a(w),f(1)},A=w=>{o()!==w?(l(w),h("asc")):c()==="asc"?h("desc"):(l(null),h("asc")),f(1)},[R,C]=P(null),E=w=>{const N=`${w.underlying}|${w.strike}`;C(F=>F===N?null:N)};Ke(_t([o,c,d,r,s],()=>C(null))),Ke(_t(t.active,()=>C(null))),Ke(_t(t.columns.visible,()=>f(1)));const L=()=>cn.filter(w=>!t.columns.visible().includes(w.id)),O=()=>(t.stages??[]).find(w=>w.name===Br[t.id].id),x=Y(()=>{const w=r();return w?v().filter(N=>{const F=N.underlying,U=N.sector;return F!=null&&String(F).toLowerCase().includes(w)||U!=null&&String(U).toLowerCase().includes(w)}):v()}),D=Y(()=>{const w=x();return s()?w.filter(N=>!z(N.score)):w}),M=Y(()=>o()?pd(D(),o(),c()):gd(D())),B=Y(()=>Math.max(1,Math.ceil(M().length/Sn))),Q=()=>Math.min(d(),B()),Ce=()=>{const w=Q();return M().slice((w-1)*Sn,w*Sn)},ht=Y(()=>{var N;const w=new Map;if(t.scoring.isCustom()){const F=Zc(v().map(U=>({row:U,score:U.score})));for(const U of F)w.set(`${U.row.underlying}|${U.row.strike}`,w.size+1)}else for(const F of((N=t.tf)==null?void 0:N.top_picks)??[])w.set(`${F.underlying}|${F.strike}`,F.rank??"?");return w}),$=w=>ht().get(`${w.underlying}|${w.strike}`);return(()=>{var w=yd(),N=w.firstChild,F=N.firstChild,U=F.nextSibling,ue=U.firstChild,j=U.nextSibling,Ae=j.firstChild,xt=Ae.nextSibling;return xt.nextSibling,u(w,p(kd,{get stages(){return t.stages}}),N),F.$$input=y,ue.addEventListener("change",q=>S(q.currentTarget.checked)),u(N,p(pu,{get store(){return t.columns}}),j),u(j,()=>mt(M().length),Ae),u(j,()=>mt(_().length),xt),u(j,p(I,{get when(){return K(()=>!!t.scoring.isCustom())()&&b()>0},get children(){return[" ","· ",K(()=>mt(b()))," re-admitted by lower floor"]}}),null),u(w,p(I,{get when(){return Ce().length>0},get children(){var q=wd();return u(q,p(hd,{get visibleCols(){return t.columns.visible},rows:Ce,sortKey:o,sortDir:c,onSort:A,get thresholds(){return t.thresholds},pickRankOf:$,openKey:R,onToggleRow:E,hiddenDefs:L,get customScores(){return t.scoring.isCustom}})),q}}),null),u(w,p(I,{get when(){return Ce().length===0},get children(){return p(I,{get when(){var q,ge;return((q=O())==null?void 0:q.status)==="failed"||((ge=O())==null?void 0:ge.status)==="partial"},get fallback(){return p(I,{get when(){return K(()=>!!s())()&&x().length>0},get fallback(){return Id()},get children(){var q=vd(),ge=q.firstChild,Re=ge.nextSibling,He=Re.nextSibling,We=He.nextSibling,je=We.nextSibling;return je.nextSibling,u(q,()=>mt(x().length),je),q}})},children:q=>(()=>{var ge=Ed(),Re=ge.firstChild,He=Re.firstChild,We=He.nextSibling;We.nextSibling;var je=Re.nextSibling;return u(Re,()=>q().status==="partial"?"△":"✗",He),u(Re,()=>Br[t.id].label,We),u(je,()=>q().error??"stage produced no data"),ge})()})}}),null),u(w,p(I,{get when(){return M().length>0},get children(){return p(wu,{page:Q,pageCount:B,onGo:f})}}),null),k(()=>w.hidden=!t.active()),k(()=>F.value=e()),k(()=>ue.checked=s()),w})()}le(["input"]);var $d=g('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal placeholder="e.g. 350.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.00"></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Add</button><button type=button class=btn>Cancel'),Td=g("<button type=button class=btn>+ New position"),Cd=g("<label class=holdings-outcome-price>close price/share<input inputmode=decimal>"),Ad=g("<b>"),Rd=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!> ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),Pd=g("<div class=holdings-notice>"),Od=g("<div class=error-banner>Holdings API error: "),xd=g("<div class=holdings-cards>"),Nd=g('<div class=holdings-panel><div class=holdings-toolbar><button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),Dd=g("<div class=empty-panel>No open positions — press “+ New position” to record one."),Ld=g("<i>"),Md=g("<i>unpriced"),Ud=g('<span class="chip high">buy back?'),Fd=g('<div class=holdings-card><div class=holdings-card-head><b> <!>P ×</b><span class=holdings-age>exp <!> · <!>/<!> wd</span></div><div class=holdings-card-big><span></span><span class=holdings-card-target>target </span></div><div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark></div></div><div class=holdings-card-stats><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b></div><div><span>close captures</span><b></b></div></div><div class=holdings-card-actions><button type=button class="btn-ghost holdings-close-btn">close…'),Bd=g('<span class="chip normal">holding');const Dn=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),Hr=(t,e=0)=>`${(t*100).toFixed(e)}%`;function Vd(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function Hd(t){const e=()=>new Date().toISOString().slice(0,10),n=()=>new Date(Date.now()+6048e5).toISOString().slice(0,10),[r,i]=P(!1),[s,a]=P({symbol:"",strike:"",premium:"",contracts:"1",sold:e(),expiry:n()}),o=c=>h=>a({...s(),[c]:h.target.value}),l=async c=>{c.preventDefault(),s().symbol&&[s().strike,s().premium,s().contracts].every(h=>Number(h)>0)&&(await t.onAdd({symbol:s().symbol,strike:Number(s().strike),premium:Number(s().premium),contracts:Number(s().contracts),sold:s().sold,expiry:s().expiry}),a({...s(),symbol:"",strike:"",premium:""}),i(!1))};return p(I,{get when(){return r()},get fallback(){return(()=>{var c=Td();return c.$$click=()=>i(!0),c})()},get children(){var c=$d(),h=c.firstChild,d=h.firstChild,f=d.nextSibling,m=h.nextSibling,_=m.firstChild,v=_.nextSibling,b=m.nextSibling,y=b.firstChild,S=y.nextSibling,A=b.nextSibling,R=A.firstChild,C=R.nextSibling,E=A.nextSibling,L=E.firstChild,O=L.nextSibling,x=E.nextSibling,D=x.firstChild,M=D.nextSibling,B=x.nextSibling,Q=B.nextSibling;return c.addEventListener("submit",l),he(f,"input",o("symbol")),he(v,"input",o("strike")),he(S,"input",o("premium")),he(C,"input",o("contracts")),he(O,"input",o("sold")),he(M,"input",o("expiry")),Q.$$click=()=>i(!1),k(()=>f.value=s().symbol),k(()=>v.value=s().strike),k(()=>S.value=s().premium),k(()=>C.value=s().contracts),k(()=>O.value=s().sold),k(()=>M.value=s().expiry),c}})}function Wd(t){var a,o;const[e,n]=P("bought-back"),[r,i]=P(((o=(a=t.position.mark)==null?void 0:a.mid)==null?void 0:o.toFixed(2))??""),s=()=>{const l=t.position,c=Number(r());return e()==="expired"?l.premium*100*l.contracts:Number.isFinite(c)?e()==="assigned"?(l.strike-c+l.premium)*100*l.contracts:(l.premium-c)*100*l.contracts:null};return(()=>{var l=Rd(),c=l.firstChild,h=c.firstChild,d=h.nextSibling,f=d.nextSibling,m=f.nextSibling;m.nextSibling;var _=c.nextSibling,v=_.firstChild,b=v.firstChild,y=v.nextSibling,S=y.firstChild,A=y.nextSibling,R=A.firstChild,C=_.nextSibling;C.firstChild;var E=C.nextSibling,L=E.firstChild,O=L.nextSibling;return u(c,()=>t.position.symbol,d),u(c,()=>t.position.strike,m),u(c,()=>t.position.contracts,null),b.addEventListener("change",()=>n("bought-back")),S.addEventListener("change",()=>n("expired")),R.addEventListener("change",()=>n("assigned")),u(l,p(I,{get when(){return e()!=="expired"},get children(){var x=Cd(),D=x.firstChild,M=D.nextSibling;return M.$$input=B=>i(B.target.value),k(()=>M.value=r()),x}}),C),u(C,p(I,{get when(){return s()!==null},fallback:"—",get children(){var x=Ad();return u(x,()=>Dn(s())),k(()=>se(x,s()>=0?"holdings-pos":"holdings-neg")),x}}),null),he(L,"click",t.onClose),O.$$click=()=>t.onConfirm(e(),e()==="expired"?null:Number(r())),k(()=>b.checked=e()==="bought-back"),k(()=>S.checked=e()==="expired"),k(()=>R.checked=e()==="assigned"),l})()}function jd(){const[t,{refetch:e}]=Jr(Os),[n,r]=P(""),[i,s]=P(null),a=d=>{r(d),setTimeout(()=>r(""),4e3)},o=()=>{var d;return[...((d=t())==null?void 0:d.positions)??[]].map(f=>({p:f,v:f.view})).sort((f,m)=>{const _=v=>v.v.pl_pct==null?-1/0:v.v.pl_pct-v.v.target_pct;return _(m)-_(f)})},l=async()=>{var d;try{const m=((d=(await Ds()).refresh)==null?void 0:d.stale)??[];a(m.length?`Marks refreshed — ${m.length} position(s) unpriced (kept last mark).`:"Marks refreshed.")}catch(f){a(`Refresh failed: ${f.message}`)}await e()},c=async d=>{try{const f=await xs(d);a(`Added ${f.position.symbol} ${f.position.strike} — press Refresh marks to price it.`)}catch(f){a(`Add failed: ${f.message}`)}await e()},h=async(d,f,m)=>{try{await Ns(d),a(f==="expired"?"Position removed (expired worthless — premium kept).":"Position removed.")}catch(_){a(`Close failed: ${_.message}`)}s(null),await e()};return(()=>{var d=Nd(),f=d.firstChild,m=f.firstChild;return u(f,p(Hd,{onAdd:c}),m),m.$$click=l,u(d,p(I,{get when(){return n()},get children(){var _=Pd();return u(_,n),_}}),null),u(d,p(I,{get when(){return t.error},fallback:null,get children(){var _=Od();return _.firstChild,u(_,()=>t.error.message,null),_}}),null),u(d,p(I,{get when(){return o().length>0},get fallback(){return Dd()},get children(){var _=xd();return u(_,p(ee,{get each(){return o()},children:({p:v,v:b})=>(()=>{var y=Fd(),S=y.firstChild,A=S.firstChild,R=A.firstChild,C=R.nextSibling;C.nextSibling;var E=A.nextSibling,L=E.firstChild,O=L.nextSibling,x=O.nextSibling,D=x.nextSibling,M=D.nextSibling,B=M.nextSibling;B.nextSibling;var Q=S.nextSibling,Ce=Q.firstChild,ht=Ce.nextSibling;ht.firstChild;var $=Q.nextSibling,w=$.firstChild,N=w.nextSibling,F=$.nextSibling,U=F.firstChild,ue=U.firstChild,j=ue.nextSibling,Ae=U.nextSibling,xt=Ae.firstChild,q=xt.nextSibling,ge=Ae.nextSibling,Re=ge.firstChild,He=Re.nextSibling,We=F.nextSibling,je=We.firstChild;return u(A,()=>v.symbol,R),u(A,()=>v.strike,C),u(A,()=>v.contracts,null),u(E,()=>v.expiry,O),u(E,()=>b.days_elapsed,D),u(E,()=>b.days_total,B),u(Ce,(()=>{var G=K(()=>b.pl_pct==null);return()=>G()?"—":Hr(b.pl_pct,1)})()),u(ht,()=>Hr(b.target_pct),null),u(j,()=>Dn(v.premium)),u(q,(()=>{var G=K(()=>v.mark==null);return()=>G()?"—":v.mark.mid.toFixed(2)})()),u(Ae,p(I,{get when(){return v.mark!=null},get children(){var G=Ld();return u(G,()=>Vd(v.mark.as_of)),G}}),null),u(Ae,p(I,{get when(){return v.mark==null},get children(){return Md()}}),null),u(He,(()=>{var G=K(()=>b.pl_dollars==null);return()=>G()?"—":Dn(b.pl_dollars)})()),u(We,p(I,{get when(){return b.pace_met},get fallback(){return Bd()},get children(){return Ud()}}),je),je.$$click=()=>s(v),k(G=>{var Yn=!!b.pace_met,Xn=b.pl_pct>=0?"holdings-pos":"holdings-neg",Qn=`${b.pl_pct==null?0:Math.max(0,Math.min(100,b.pl_pct*100))}%`,Zn=`${Math.min(100,b.target_pct*100)}%`,er=b.pl_dollars>=0?"holdings-pos":"holdings-neg";return Yn!==G.e&&y.classList.toggle("holdings-card-met",G.e=Yn),Xn!==G.t&&se(Ce,G.t=Xn),Qn!==G.a&&qe(w,"width",G.a=Qn),Zn!==G.o&&qe(N,"left",G.o=Zn),er!==G.i&&se(He,G.i=er),G},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),y})()})),_}}),null),u(d,p(I,{get when(){return i()},get children(){return p(Wd,{get position(){return i()},onClose:()=>s(null),onConfirm:(_,v)=>h(i().id,_)})}}),null),d})()}le(["input","click"]);async function zd(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var Gd=g("<button type=button class=run-btn>"),Kd=g("<span class=run-count>/"),qd=g("<span class=run-bar><span class=fill>"),Jd=g("<li><span class=mark></span><span class=label>"),Yd=g("<div class=toast-cached>Served from cache — last run <!> min old"),Xd=g('<div class="toast-cached warn">'),Qd=g("<div class=run-headline>"),Zd=g("<ul class=run-stages>"),eh=g("<details class=run-errors><summary>details</summary><ul>"),th=g("<div class=run-warn>Closing this tab stops the run."),nh=g("<div class=run-warn>Re-checking every 15 s…"),rh=g("<div class=run-strip>"),ih=g("<li> ");const rs=["quotes","metrics","chains_short","chains_medium"],is={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},sh=15e3,ss=t=>t!==null&&Date.now()>=t;function Wr(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function ah(t){const[e,n]=P("idle"),[r,i]=P(R()),[s,a]=P(null),[o,l]=P(0),[c,h]=P(null),[d,f]=P(null),[m,_]=P("");let v=null,b=null;const[y,S]=P(0);let A=null;Ke(()=>{const $=t();if(A&&(clearTimeout(A),A=null),($==null?void 0:$.run_allowed)===!1){const w=tn($.next_open_utc);w!==null&&(A=setTimeout(()=>S(N=>N+1),Math.max(0,w-Date.now())))}});function R(){return Object.fromEntries(rs.map($=>[$,{status:"pending",error:null}]))}function C(){v&&clearInterval(v),v=null,b&&clearInterval(b),b=null}function E(){l(0),v=setInterval(()=>l($=>$+1),1e3)}function L($){switch($.type){case"stage_started":i(w=>({...w,[$.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:$.stage,done:$.done,total:$.total});break;case"stage_finished":i(w=>({...w,[$.stage]:{status:$.ok?"ok":"failed",error:$.error??null}}));break;case"run_finished":h($);break}}function O(){C();const $=c(),w=(($==null?void 0:$.stages)??[]).some(N=>N.name.startsWith("chains")&&["ok","partial"].includes(N.status));n($&&(w||$.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function x($){let w=!1;return await zd($,N=>{L(N),N.type==="run_finished"&&(w=!0)}),w?(O(),!0):!1}async function D($){n("detached"),b=setInterval(async()=>{var w,N,F;try{const U=await ei(),ue=((N=(w=U==null?void 0:U.result)==null?void 0:w.run)==null?void 0:N.finished_at_utc)??null;if(ue&&ue!==$){i(M(U.result)),C(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((F=U==null?void 0:U.run_state)==null?void 0:F.status)!=="running"&&(C(),n("idle"),_("Stream lost and the run was canceled — press Run to retry."))}catch{}},sh)}function M($){const w=R();for(const N of($==null?void 0:$.stages)??[])w[N.name]&&(w[N.name]={status:N.status,error:N.error});return w}async function B(){var F,U,ue;if(["starting","running","detached"].includes(e()))return;_(""),h(null),a(null),i(R()),f(null);const $=((ue=(U=(F=t())==null?void 0:F.result)==null?void 0:U.run)==null?void 0:ue.finished_at_utc)??null;n("running"),E();let w;try{w=await Rs()}catch{C(),n("idle"),_("Run failed to start — network or server unreachable.");return}const N=w.headers.get("content-type")??"";if(w.ok&&N.includes("application/json")){const j=await w.json().catch(()=>null);if(C(),n("idle"),(j==null?void 0:j.status)==="cached"){f(j.age_secs),setTimeout(()=>f(null),6e3);return}}if(w.status===403&&N.includes("application/json")){const j=await w.json().catch(()=>null);C(),n("idle"),_(j!=null&&j.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(j.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(w.status===202){const j=await Ps();if(j.ok&&(j.headers.get("content-type")??"").includes("text/event-stream")){await x(j)||await D($);return}await D($);return}if(N.includes("text/event-stream")){await x(w)||await D($);return}C(),n("idle"),_(`Unexpected /api/run response (${w.status}, ${N||"no type"}).`)}return Me(()=>{C(),A&&clearTimeout(A)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:d,notice:m,triggerRun:B,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{y();const $=t();return($==null?void 0:$.run_allowed)!==!1?!0:ss(tn($==null?void 0:$.next_open_utc))},nextOpenUtc:()=>{var $;return(($=t())==null?void 0:$.next_open_utc)??null}}}function oh(t){const e=()=>!t.run.runAllowed(),n=()=>Zi(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=Gd();return i.$$click=()=>t.run.triggerRun(),u(i,r),k(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&ne(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function lh(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=Jd(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>is[t.name]),u(i,p(I,{get when(){return r()!==null},get children(){return[(()=>{var o=Kd(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=qd(),l=o.firstChild;return k(c=>qe(l,"width",`${r()}%`)),o})()]}}),null),k(()=>se(i,`run-stage ${e()}`)),i})()}function ch(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",K(()=>Wr(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",K(()=>Wr(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return p(I,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=rh();return u(i,p(I,{get when(){return e.cachedToast()},get children(){var s=Yd(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,p(I,{get when(){return e.notice()},get children(){var s=Xd();return u(s,()=>e.notice()),s}}),null),u(i,p(I,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=Qd();return u(s,r),s})(),(()=>{var s=Zd();return u(s,()=>rs.map(a=>p(lh,{name:a,run:e}))),s})(),p(I,{get when(){return K(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=eh(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=ih(),h=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",h),u(c,()=>is[l.name]??l.name,null),u(c,(()=>{var d=K(()=>!!l.error);return()=>d()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,p(I,{get when(){return K(()=>e.phase()==="running")()&&!n()},get children(){return th()}}),null),u(i,p(I,{get when(){return e.phase()==="detached"},get children(){return nh()}}),null),i}})}le(["click"]);var as=g("<b>"),uh=g("<span>Market closed · last run <b></b> ago"),dh=g("<div class=cache-line><span></span><span class=pill>run: "),hh=g("<span>Cached · <b></b> left"),fh=g("<span>Stale · last run <b></b> ago"),ph=g("<nav class=tabs role=tablist aria-label=timeframes>"),gh=g("<button type=button role=tab class=tab>"),mh=g('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),_h=g("<div class=pop-backdrop>"),bh=g("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),wh=g("<div class=error-banner>API error: "),yh=g("<div class=shell><header><div class=user-box></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),vh=g("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function Ih(){const[t,e]=P(lu()),n=r=>{e(r),cu(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(gt)}}function jr(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function Eh(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function zr(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function kn(t){return p(I,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=as();return u(e,()=>t.at()),e})()]}})}function Sh(t){const[e,n]=P(0);yt(()=>{const m=setInterval(()=>n(_=>_+1),3e4);Me(()=>clearInterval(m))});let r=Date.now(),i=0;Ke(_t(()=>t.envelope,m=>{r=Date.now(),i=(m==null?void 0:m.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const m=Math.max(0,(t.envelope.cache_secs??0)-s());return m>=60?`${Math.floor(m/60)}m`:`${m}s`},c=()=>{var m,_;return vu((_=(m=t.envelope.result)==null?void 0:m.run)==null?void 0:_.finished_at_utc)},h=()=>{e();const m=t.envelope.next_open_utc,_=tn(m);if(!(_===null||ss(_)))return Zi(m)},d=()=>o()&&a()==="stale"?"closed":a(),f=()=>a()==="fresh"||a()==="stale";return(()=>{var m=dh(),_=m.firstChild,v=_.nextSibling;return v.firstChild,u(m,p(I,{get when(){return K(()=>!!o())()&&f()},get fallback(){return p(I,{get when(){return a()==="fresh"},get fallback(){return p(I,{get when(){return a()==="stale"},get children(){var b=fh(),y=b.firstChild,S=y.nextSibling;return S.nextSibling,u(S,()=>zr(s())),u(b,p(kn,{at:c}),null),b}})},get children(){var b=hh(),y=b.firstChild,S=y.nextSibling;return S.nextSibling,u(S,l),u(b,p(kn,{at:c}),null),b}})},get children(){var b=uh(),y=b.firstChild,S=y.nextSibling;return S.nextSibling,u(S,()=>zr(s())),u(b,p(kn,{at:c}),null),u(b,p(I,{get when(){return h()},get children(){return[" ","· next run ",(()=>{var A=as();return u(A,h),A})()]}}),null),b}}),_),u(_,(()=>{var b=K(()=>d()==="closed");return()=>b()?"market closed":a()})()),u(v,()=>{var b;return((b=t.envelope.run_state)==null?void 0:b.status)??"idle"},null),k(()=>se(_,"pill "+d())),m})()}function Gr(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=ph();return u(n,()=>e.map(r=>(()=>{var i=gh();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=K(()=>!r.holdings);return()=>s()&&` (${mt(Eh(t.result,r.id))})`})(),null),k(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&ne(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function kh(){const[t,e]=P(void 0),[n,{refetch:r}]=Jr(t,y=>y?ei():void 0);yt(()=>{if(!ot){e(null);return}const y=ml(Ze(),e);Me(y)});const[i,s]=P(!1);Ke(_t(t,y=>{s(!1),!(!y||!ot)&&$s().then(S=>s(S.status===403)).catch(()=>{})})),yt(()=>{const y=()=>r();window.addEventListener("webapp:refresh-latest",y),Me(()=>window.removeEventListener("webapp:refresh-latest",y))});const a=()=>{var y,S;return((y=t())==null?void 0:y.email)||((S=t())==null?void 0:S.uid)||""},[o,l]=P(!1),[c,h]=P(!1),d=Ih(),[f,m]=P("short"),_=()=>f()==="holdings",v=su(),b=ah(()=>n());return p(I,{get when(){return t()},get fallback(){return p(Wc,{})},get children(){return[p(I,{get when(){return!i()},get fallback(){return p(Hc,{get email(){return a()},onSignOut:()=>Dr()})},get children(){var y=yh(),S=y.firstChild,A=S.firstChild,R=A.nextSibling,C=R.nextSibling;return u(A,p(I,{get when(){return t()},get children(){return[(()=>{var E=mh(),L=E.firstChild,O=L.nextSibling;return E.$$click=()=>l(!o()),u(O,a),k(()=>ne(E,"aria-expanded",o())),E})(),p(I,{get when(){return o()},get children(){return[(()=>{var E=_h();return E.$$click=()=>l(!1),E})(),(()=>{var E=bh(),L=E.firstChild,O=L.nextSibling,x=O.nextSibling,D=x.nextSibling;return u(O,a),x.$$click=()=>{l(!1),h(!0)},D.$$click=()=>{l(!1),Dr()},E})()]}})]}})),u(S,p(I,{get when(){return K(()=>!n.loading)()&&!n.error},get children(){return p(Sh,{get envelope(){return n()}})}}),C),u(C,p(oh,{run:b})),u(y,p(I,{get when(){return n.error},get children(){var E=wh();return E.firstChild,u(E,()=>n.error.message,null),E}}),null),u(y,p(ch,{run:b}),null),u(y,p(I,{get when(){return _()},get children(){return[p(Gr,{result:()=>{var E;return(E=n())==null?void 0:E.result},tab:f,onTab:m}),p(jd,{})]}}),null),u(y,p(I,{get when(){return!_()},get children(){return p(I,{get when(){var E;return K(()=>!n.loading)()&&((E=n())==null?void 0:E.result)},get fallback(){return p(I,{get when(){return!n.loading},get children(){return vh()}})},children:E=>{const L=()=>E();return[p(ou,{scoring:v}),p(Gr,{result:L,tab:f,onTab:m}),p(Vr,{id:"short",active:()=>f()==="short",get tf(){var O;return(O=L().timeframes)==null?void 0:O.short},get stageError(){return jr(L(),"chains_short")},get stages(){return L().stages},get thresholds(){return L().thresholds},columns:d,scoring:v}),p(Vr,{id:"medium",active:()=>f()==="medium",get tf(){var O;return(O=L().timeframes)==null?void 0:O.medium},get stageError(){return jr(L(),"chains_medium")},get stages(){return L().stages},get thresholds(){return L().thresholds},columns:d,scoring:v})]}})}}),null),y}}),p(I,{get when(){return c()},get children(){return p(Jc,{onClose:()=>h(!1)})}})]}})}le(["click"]);Is(()=>p(kh,{}),document.getElementById("root"));
