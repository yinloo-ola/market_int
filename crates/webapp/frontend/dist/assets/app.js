(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const $s=!1,Ss=(t,e)=>t===e,Fn=Symbol("solid-proxy"),ks=typeof Proxy=="function",Es=Symbol("solid-track"),Zt={equals:Ss};let si=ci;const Le=1,en=2,ai={owned:null,cleanups:null,context:null,owner:null},vn={};var Y=null;let wn=null,Is=null,K=null,se=null,xe=null,fn=0;function zt(t,e){const n=K,r=Y,i=t.length===0,s=e===void 0?r:e,a=i?ai:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>ge(()=>Tt(a)));Y=a,K=null;try{return qe(o,!0)}finally{K=n,Y=r}}function O(t,e){e=e?Object.assign({},Zt,e):Zt;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),li(n,i));return[oi.bind(n),r]}function Cs(t,e,n){const r=gn(t,e,!0,Le);_t(r)}function $(t,e,n){const r=gn(t,e,!1,Le);_t(r)}function Ze(t,e,n){si=Ns;const r=gn(t,e,!1,Le);r.user=!0,xe?xe.push(r):_t(r)}function ie(t,e,n){n=n?Object.assign({},Zt,n):Zt;const r=gn(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,_t(r),oi.bind(r)}function Ts(t){return t&&typeof t=="object"&&"then"in t}function As(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=vn,l=!1,c="initialValue"in s,d=typeof r=="function"&&ie(r);const h=new Set,[g,m]=(s.storage||O)(s.initialValue),[b,E]=O(void 0),[_,v]=O(void 0,{equals:!1}),[k,T]=O(c?"ready":"unresolved");Y&&Oe(()=>{for(const U of h.keys())U.decrement();h.clear(),a=null});function A(U,w,L,H){return a===U&&(a=null,H!==void 0&&(c=!0),(U===o||w===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(H,{value:w})),o=vn,P(w,L)),w}function P(U,w){qe(()=>{w===void 0&&m(()=>U),T(w!==void 0?"errored":c?"ready":"unresolved"),E(w);for(const L of h.keys())L.decrement();h.clear()},!1)}function C(){const U=Rs,w=g(),L=b();if(L!==void 0&&!a)throw L;return K&&K.user,w}function F(U=!0){if(U!==!1&&l)return;l=!1;const w=d?d():r;if(w==null||w===!1){A(a,ge(g));return}let L;const H=o!==vn?o:ge(()=>{try{return i(w,{value:g(),refetching:U})}catch(te){L=te}});if(L!==void 0){A(a,void 0,Gt(L),w);return}else if(!Ts(H))return A(a,H,void 0,w),H;return a=H,"v"in H?(H.s===1?A(a,H.v,void 0,w):A(a,void 0,Gt(H.v),w),H):(l=!0,queueMicrotask(()=>l=!1),qe(()=>{T(c?"refreshing":"pending"),v()},!1),H.then(te=>A(H,te,void 0,w),te=>A(H,void 0,Gt(te),w)))}Object.defineProperties(C,{state:{get:()=>k()},error:{get:()=>b()},loading:{get(){const U=k();return U==="pending"||U==="refreshing"}},latest:{get(){if(!c)return C();const U=b();if(U&&!a)throw U;return g()}}});let N=Y;return d?Cs(()=>(N=Y,F(!1))):F(!1),[C,{refetch:U=>Ps(N,()=>F(U)),mutate:m}]}function ge(t){if(K===null)return t();const e=K;K=null;try{return t()}finally{K=e}}function Et(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=ge(()=>e(a,i,s));return i=a,o}}function ht(t){Ze(()=>ge(t))}function Oe(t){return Y===null||(Y.cleanups===null?Y.cleanups=[t]:Y.cleanups.push(t)),t}function Ps(t,e){const n=Y,r=K;Y=t,K=null;try{return qe(e,!0)}catch(i){Jn(i)}finally{Y=n,K=r}}const[Tf,Af]=O(!1);let Rs;function oi(){if(this.sources&&this.state)if(this.state===Le)_t(this);else{const t=se;se=null,qe(()=>nn(this),!1),se=t}if(K){const t=this.observers;if(!t||t[t.length-1]!==K){const e=t?t.length:0;K.sources?(K.sources.push(this),K.sourceSlots.push(e)):(K.sources=[this],K.sourceSlots=[e]),t?(t.push(K),this.observerSlots.push(K.sources.length-1)):(this.observers=[K],this.observerSlots=[K.sources.length-1])}}return this.value}function li(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&qe(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=wn&&wn.running;a&&wn.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?se.push(s):xe.push(s),s.observers&&ui(s)),a||(s.state=Le)}if(se.length>1e6)throw se=[],new Error},!1)),e}function _t(t){if(!t.fn)return;Tt(t);const e=fn;xs(t,t.value,e)}function xs(t,e,n){let r;const i=Y,s=K;K=Y=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Le,t.owned&&t.owned.forEach(Tt),t.owned=null),t.updatedAt=n+1,Jn(a)}finally{K=s,Y=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?li(t,r):t.value=r,t.updatedAt=n)}function gn(t,e,n,r=Le,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:Y,context:Y?Y.context:null,pure:n};return Y===null||Y!==ai&&(Y.owned?Y.owned.push(s):Y.owned=[s]),s}function tn(t){if(t.state===0)return;if(t.state===en)return nn(t);if(t.suspense&&ge(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<fn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Le)_t(t);else if(t.state===en){const r=se;se=null,qe(()=>nn(t,e[0]),!1),se=r}}function qe(t,e){if(se)return t();let n=!1;e||(se=[]),xe?n=!0:xe=[],fn++;try{const r=t();return Os(n),r}catch(r){n||(xe=null),se=null,Jn(r)}}function Os(t){if(se&&(ci(se),se=null),t)return;const e=xe;xe=null,e.length&&qe(()=>si(e),!1)}function ci(t){for(let e=0;e<t.length;e++)tn(t[e])}function Ns(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:tn(r)}for(e=0;e<n;e++)tn(t[e])}function nn(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Le?r!==e&&(!r.updatedAt||r.updatedAt<fn)&&tn(r):i===en&&nn(r,e)}}}function ui(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=en,n.pure?se.push(n):xe.push(n),n.observers&&ui(n))}}function Tt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)Tt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)Tt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function Gt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function Jn(t,e=Y){throw Gt(t)}const Ds=Symbol("fallback");function hr(t){for(let e=0;e<t.length;e++)t[e]()}function Ls(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Oe(()=>hr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[Es],ge(()=>{let m,b,E,_,v,k,T,A,P;if(c===0)a!==0&&(hr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Ds],i[0]=zt(C=>(s[0]=C,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=zt(g);a=c}else{for(E=new Array(c),_=new Array(c),o&&(v=new Array(c)),k=0,T=Math.min(a,c);k<T&&r[k]===l[k];k++);for(T=a-1,A=c-1;T>=k&&A>=k&&r[T]===l[A];T--,A--)E[A]=i[T],_[A]=s[T],o&&(v[A]=o[T]);for(m=new Map,b=new Array(A+1),h=A;h>=k;h--)P=l[h],d=m.get(P),b[h]=d===void 0?-1:d,m.set(P,h);for(d=k;d<=T;d++)P=r[d],h=m.get(P),h!==void 0&&h!==-1?(E[h]=i[d],_[h]=s[d],o&&(v[h]=o[d]),h=b[h],m.set(P,h)):s[d]();for(h=k;h<c;h++)h in E?(i[h]=E[h],s[h]=_[h],o&&(o[h]=v[h],o[h](h))):i[h]=zt(g);i=i.slice(0,a=c),r=l.slice(0)}return i});function g(m){if(s[h]=m,o){const[b,E]=O(h);return o[h]=E,e(l[h],b)}return e(l[h])}}}function f(t,e){return ge(()=>t(e||{}))}function Ht(){return!0}const Ms={get(t,e,n){return e===Fn?n:t.get(e)},has(t,e){return e===Fn?!0:t.has(e)},set:Ht,deleteProperty:Ht,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:Ht,deleteProperty:Ht}},ownKeys(t){return t.keys()}};function $n(t){return(t=typeof t=="function"?t():t)?t:{}}function Us(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function Fs(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Fn in o,t[a]=typeof o=="function"?(e=!0,ie(o)):o}if(ks&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=$n(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in $n(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys($n(t[o])));return[...new Set(a)]}},Ms);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let c=l.length-1;c>=0;c--){const d=l[c];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:Us.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const g=n[d];g&&(h.get?g.push(h.get.bind(o)):h.value!==void 0&&g.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const Bs=t=>`Stale read from <${t}>.`;function ae(t){const e="fallback"in t&&{fallback:()=>t.fallback};return ie(Ls(()=>t.each,t.children,e||void 0))}function I(t){const e=t.keyed,n=ie(()=>t.when,void 0,void 0),r=e?n:ie(n,void 0,{equals:(i,s)=>!i==!s});return ie(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?ge(()=>s(e?i:()=>{if(!ge(r))throw Bs("Show");return n()})):s}return t.fallback},void 0,void 0)}const J=t=>ie(()=>t());function Vs(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,g=1,m;for(;++h<i&&h<s&&!((m=c.get(e[h]))==null||m!==d+g);)g++;if(g>d-o){const b=e[a];for(;o<d;)t.insertBefore(n[o++],b)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const fr="_$DX_DELEGATE";function Hs(t,e,n,r={}){let i;return zt(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function p(t,e,n,r){let i;const s=()=>{const o=r?document.createElementNS("http://www.w3.org/1998/Math/MathML","template"):document.createElement("template");return o.innerHTML=t,n?o.content.firstChild.firstChild:r?o.firstChild:o.content.firstChild},a=e?()=>ge(()=>document.importNode(i||(i=s()),!0)):()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function ye(t,e=window.document){const n=e[fr]||(e[fr]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,js))}}function ee(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function le(t,e){e==null?t.removeAttribute("class"):t.className=e}function j(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function et(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function Ws(t,e,n){return ge(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return rn(t,e,r,n);$(i=>rn(t,e(),i,n),r)}function js(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function rn(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=st(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=st(t,n,r);else{if(s==="function")return $(()=>{let o=e();for(;typeof o=="function";)o=o();n=rn(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Bn(o,e,n,i))return $(()=>n=rn(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=st(t,n,r),a)return n}else l?n.length===0?gr(t,o,r):Vs(t,n,o):(n&&st(t),gr(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=st(t,n,r,e);st(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Bn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Bn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=Bn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function gr(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function st(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let qt=null;function zs(t){qt=t}async function he(t,e={}){if(!qt)return fetch(t,e);const n=new Headers(e.headers??{}),r=await qt(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await qt(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function di(){const t=await he("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function Gs(){return he("/api/me")}async function qs(){const t=await he("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function Ks(t){const e=await he("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function Js(t){const e=await he("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function Ys(){return await he("/api/run",{method:"POST"})}async function Xs(){return he("/api/progress")}async function Qs(){const t=await he("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function Sn(t){const e=await he("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function kn(t){const e=await he(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function Zs(){const t=await he("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function pr(t){const e=await he("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function ea(t){const e=await he("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const ta=()=>{};var mr={};/**
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
 */const hi=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},na=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},fi={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let g=(o&15)<<2|c>>6,m=c&63;l||(m=64,a||(g=64)),r.push(n[d],n[h],n[g],n[m])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(hi(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):na(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||c==null||h==null)throw new ra;const g=s<<2|o>>4;if(r.push(g),c!==64){const m=o<<4&240|c>>2;if(r.push(m),h!==64){const b=c<<6&192|h;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class ra extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const ia=function(t){const e=hi(t);return fi.encodeByteArray(e,!0)},gi=function(t){return ia(t).replace(/\./g,"")},pi=function(t){try{return fi.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function sa(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const aa=()=>sa().__FIREBASE_DEFAULTS__,oa=()=>{if(typeof process>"u"||typeof mr>"u")return;const t=mr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},la=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&pi(t[1]);return e&&JSON.parse(e)},Yn=()=>{try{return ta()||aa()||oa()||la()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},ca=t=>{var e,n;return(n=(e=Yn())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},mi=()=>{var t;return(t=Yn())==null?void 0:t.config},_i=t=>{var e;return(e=Yn())==null?void 0:e[`_${t}`]};/**
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
 */class bi{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function oe(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ua(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(oe())}function da(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ha(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function fa(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ga(){const t=oe();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function pa(){try{return typeof indexedDB=="object"}catch{return!1}}function ma(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const _a="FirebaseError";class Ke extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=_a,Object.setPrototypeOf(this,Ke.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ot.prototype.create)}}class Ot{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?ba(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new Ke(i,o,r)}}function ba(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function ya(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function ft(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(_r(s)&&_r(a)){if(!ft(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function _r(t){return t!==null&&typeof t=="object"}/**
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
 */function Nt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function wt(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function $t(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function va(t,e){const n=new wa(t,e);return n.subscribe.bind(n)}class wa{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");$a(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=En),i.error===void 0&&(i.error=En),i.complete===void 0&&(i.complete=En);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function $a(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function En(){}/**
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
 */function Me(t){return t&&t._delegate?t._delegate:t}/**
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
 */function Xn(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Sa(t){return(await fetch(t,{credentials:"include"})).ok}class gt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Xe="[DEFAULT]";/**
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
 */class ka{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new bi;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ia(e))try{this.getOrInitializeService({instanceIdentifier:Xe})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Xe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Xe){return this.instances.has(e)}getOptions(e=Xe){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Ea(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Xe){return this.component?this.component.multipleInstances?e:Xe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ea(t){return t===Xe?void 0:t}function Ia(t){return t.instantiationMode==="EAGER"}/**
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
 */class Ca{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new ka(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var G;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(G||(G={}));const Ta={debug:G.DEBUG,verbose:G.VERBOSE,info:G.INFO,warn:G.WARN,error:G.ERROR,silent:G.SILENT},Aa=G.INFO,Pa={[G.DEBUG]:"log",[G.VERBOSE]:"log",[G.INFO]:"info",[G.WARN]:"warn",[G.ERROR]:"error"},Ra=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Pa[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class yi{constructor(e){this.name=e,this._logLevel=Aa,this._logHandler=Ra,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in G))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ta[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,G.DEBUG,...e),this._logHandler(this,G.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,G.VERBOSE,...e),this._logHandler(this,G.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,G.INFO,...e),this._logHandler(this,G.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,G.WARN,...e),this._logHandler(this,G.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,G.ERROR,...e),this._logHandler(this,G.ERROR,...e)}}const xa=(t,e)=>e.some(n=>t instanceof n);let br,yr;function Oa(){return br||(br=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Na(){return yr||(yr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const vi=new WeakMap,Vn=new WeakMap,wi=new WeakMap,In=new WeakMap,Qn=new WeakMap;function Da(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(ze(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&vi.set(n,t)}).catch(()=>{}),Qn.set(e,t),e}function La(t){if(Vn.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Vn.set(t,e)}let Hn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Vn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||wi.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ze(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Ma(t){Hn=t(Hn)}function Ua(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Cn(this),e,...n);return wi.set(r,e.sort?e.sort():[e]),ze(r)}:Na().includes(t)?function(...e){return t.apply(Cn(this),e),ze(vi.get(this))}:function(...e){return ze(t.apply(Cn(this),e))}}function Fa(t){return typeof t=="function"?Ua(t):(t instanceof IDBTransaction&&La(t),xa(t,Oa())?new Proxy(t,Hn):t)}function ze(t){if(t instanceof IDBRequest)return Da(t);if(In.has(t))return In.get(t);const e=Fa(t);return e!==t&&(In.set(t,e),Qn.set(e,t)),e}const Cn=t=>Qn.get(t);function Ba(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=ze(a);return r&&a.addEventListener("upgradeneeded",l=>{r(ze(a.result),l.oldVersion,l.newVersion,ze(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const Va=["get","getKey","getAll","getAllKeys","count"],Ha=["put","add","delete","clear"],Tn=new Map;function vr(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Tn.get(e))return Tn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Ha.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Va.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(o.shift())),(await Promise.all([c[n](...o),i&&l.done]))[0]};return Tn.set(e,s),s}Ma(t=>({...t,get:(e,n,r)=>vr(e,n)||t.get(e,n,r),has:(e,n)=>!!vr(e,n)||t.has(e,n)}));/**
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
 */class Wa{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(ja(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function ja(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Wn="@firebase/app",wr="0.16.1";/**
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
 */const Ne=new yi("@firebase/app"),za="@firebase/app-compat",Ga="@firebase/analytics-compat",qa="@firebase/analytics",Ka="@firebase/app-check-compat",Ja="@firebase/app-check",Ya="@firebase/auth",Xa="@firebase/auth-compat",Qa="@firebase/database",Za="@firebase/data-connect",eo="@firebase/database-compat",to="@firebase/functions",no="@firebase/functions-compat",ro="@firebase/installations",io="@firebase/installations-compat",so="@firebase/messaging",ao="@firebase/messaging-compat",oo="@firebase/performance",lo="@firebase/performance-compat",co="@firebase/remote-config",uo="@firebase/remote-config-compat",ho="@firebase/storage",fo="@firebase/storage-compat",go="@firebase/firestore",po="@firebase/ai",mo="@firebase/firestore-compat",_o="firebase",bo="12.18.0";/**
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
 */const jn="[DEFAULT]",yo={[Wn]:"fire-core",[za]:"fire-core-compat",[qa]:"fire-analytics",[Ga]:"fire-analytics-compat",[Ja]:"fire-app-check",[Ka]:"fire-app-check-compat",[Ya]:"fire-auth",[Xa]:"fire-auth-compat",[Qa]:"fire-rtdb",[Za]:"fire-data-connect",[eo]:"fire-rtdb-compat",[to]:"fire-fn",[no]:"fire-fn-compat",[ro]:"fire-iid",[io]:"fire-iid-compat",[so]:"fire-fcm",[ao]:"fire-fcm-compat",[oo]:"fire-perf",[lo]:"fire-perf-compat",[co]:"fire-rc",[uo]:"fire-rc-compat",[ho]:"fire-gcs",[fo]:"fire-gcs-compat",[go]:"fire-fst",[mo]:"fire-fst-compat",[po]:"fire-vertex","fire-js":"fire-js",[_o]:"fire-js-all"};/**
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
 */const sn=new Map,vo=new Map,zn=new Map;function $r(t,e){try{t.container.addComponent(e)}catch(n){Ne.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function At(t){const e=t.name;if(zn.has(e))return Ne.debug(`There were multiple attempts to register component ${e}.`),!1;zn.set(e,t);for(const n of sn.values())$r(n,t);for(const n of vo.values())$r(n,t);return!0}function $i(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function de(t){return t==null?!1:t.settings!==void 0}/**
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
 */const wo={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ce=new Ot("app","Firebase",wo);/**
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
 */class $o{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new gt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ce.create("app-deleted",{appName:this._name})}}/**
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
 */const Dt=bo;function Si(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:jn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw Ce.create("bad-app-name",{appName:String(i)});if(n||(n=mi()),!n)throw Ce.create("no-options");const s=sn.get(i);if(s)if(ft(n,s.options)){if(ft(r,s.config))return s;throw Ce.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw Ce.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new Ca(i);for(const l of zn.values())a.addComponent(l);const o=new $o(n,r,a);return sn.set(i,o),o}function So(t=jn){const e=sn.get(t);if(!e&&t===jn&&mi())return Si();if(!e)throw Ce.create("no-app",{appName:t});return e}function lt(t,e,n){let r=yo[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ne.warn(a.join(" "));return}At(new gt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const ko="firebase-heartbeat-database",Eo=1,Pt="firebase-heartbeat-store";let An=null;function ki(){return An||(An=Ba(ko,Eo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Pt)}catch(n){console.warn(n)}}}}).catch(t=>{throw Ce.create("idb-open",{originalErrorMessage:t.message})})),An}async function Io(t){try{const n=(await ki()).transaction(Pt),r=await n.objectStore(Pt).get(Ei(t));return await n.done,r}catch(e){if(e instanceof Ke)Ne.warn(e.message);else{const n=Ce.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ne.warn(n.message)}}}async function Sr(t,e){try{const r=(await ki()).transaction(Pt,"readwrite");await r.objectStore(Pt).put(e,Ei(t)),await r.done}catch(n){if(n instanceof Ke)Ne.warn(n.message);else{const r=Ce.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Ne.warn(r.message)}}}function Ei(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Co=1024,To=30;class Ao{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Ro(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=kr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>To){const a=xo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Ne.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=kr(),{heartbeatsToSend:r,unsentEntries:i}=Po(this._heartbeatsCache.heartbeats),s=gi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Ne.warn(n),""}}}function kr(){return new Date().toISOString().substring(0,10)}function Po(t,e=Co){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Er(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Er(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Ro{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return pa()?ma().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Io(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Sr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Sr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Er(t){return gi(JSON.stringify({version:2,heartbeats:t})).length}function xo(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function Oo(t){At(new gt("platform-logger",e=>new Wa(e),"PRIVATE")),At(new gt("heartbeat",e=>new Ao(e),"PRIVATE")),lt(Wn,wr,t),lt(Wn,wr,"esm2020"),lt("fire-js","")}/**
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
 */Oo("");var No="firebase",Do="12.18.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */lt(No,Do,"app");function Ii(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Lo=Ii,Ci=new Ot("auth","Firebase",Ii());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const an=new yi("@firebase/auth");function Ti(t,...e){an.logLevel<=G.WARN&&an.warn(`Auth (${Dt}): ${t}`,...e)}function Kt(t,...e){an.logLevel<=G.ERROR&&an.error(`Auth (${Dt}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(t,...e){throw er(t,...e)}function be(t,...e){return er(t,...e)}function Zn(t,e,n){const r={...Lo(),[e]:n};return new Ot("auth","Firebase",r).create(e,{appName:t.name})}function we(t){return Zn(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ai(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&pe(t,"argument-error"),Zn(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function er(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return Ci.create(t,...e)}function V(t,e,...n){if(!t)throw er(e,...n)}function Te(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Kt(e),new Error(e)}function De(t,e){t||Te(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gn(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function Mo(){return Ir()==="http:"||Ir()==="https:"}function Ir(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uo(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Mo()||ha()||"connection"in navigator)?navigator.onLine:!0}function Fo(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(e,n){this.shortDelay=e,this.longDelay=n,De(n>e,"Short delay should be less than long delay!"),this.isMobile=ua()||fa()}get(){return Uo()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tr(t,e){De(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pi{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Te("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Te("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Te("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bo={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vo=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Ho=new Lt(3e4,6e4);function Je(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function Ye(t,e,n,r,i={}){return Ri(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Nt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:l,...s};return da()||(c.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&Xn(t.emulatorConfig.host)&&(c.credentials="include"),Pi.fetch()(await xi(t,t.config.apiHost,n,o),c)})}async function Ri(t,e,n){t._canInitEmulator=!1;const r={...Bo,...e};try{const i=new jo(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Wt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,c]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Wt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Wt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Wt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw Zn(t,d,c);pe(t,d)}}catch(i){if(i instanceof Ke)throw i;pe(t,"network-request-failed",{message:String(i)})}}async function Mt(t,e,n,r,i={}){const s=await Ye(t,e,n,r,i);return"mfaPendingCredential"in s&&pe(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function xi(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?tr(t.config,i):`${t.config.apiScheme}://${i}`;return Vo.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function Wo(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class jo{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(be(this.auth,"network-request-failed")),Ho.get())})}}function Wt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=be(t,e,r);return i.customData._tokenResponse=n,i}function Cr(t){return t!==void 0&&t.enterprise!==void 0}class zo{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Wo(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Go(t,e){return Ye(t,"GET","/v2/recaptchaConfig",Je(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qo(t,e){return Ye(t,"POST","/v1/accounts:delete",e)}async function on(t,e){return Ye(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function It(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Ko(t,e=!1){const n=Me(t),r=await n.getIdToken(e),i=nr(r);V(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:It(Pn(i.auth_time)),issuedAtTime:It(Pn(i.iat)),expirationTime:It(Pn(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Pn(t){return Number(t)*1e3}function nr(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Kt("JWT malformed, contained fewer than 3 sections"),null;try{const i=pi(n);return i?JSON.parse(i):(Kt("Failed to decode base64 JWT payload"),null)}catch(i){return Kt("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Tr(t){const e=nr(t);return V(e,"internal-error"),V(typeof e.exp<"u","internal-error"),V(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rt(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Ke&&Jo(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Jo({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yo{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=It(this.lastLoginAt),this.creationTime=It(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function ln(t){var h;const e=t.auth,n=await t.getIdToken(),r=await Rt(t,on(e,{idToken:n}));V(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?Oi(i.providerUserInfo):[],a=Qo(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),c=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new qn(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function Xo(t){const e=Me(t);await ln(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Qo(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Oi(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zo(t,e){const n=await Ri(t,{},async()=>{const r=Nt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await xi(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&Xn(t.emulatorConfig.host)&&(l.credentials="include"),Pi.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function el(t,e){return Ye(t,"POST","/v2/accounts:revokeToken",Je(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){V(e.idToken,"internal-error"),V(typeof e.idToken<"u","internal-error"),V(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Tr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){V(e.length!==0,"internal-error");const n=Tr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(V(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await Zo(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new ct;return r&&(V(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(V(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(V(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ct,this.toJSON())}_performRefresh(){return Te("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Be(t,e){V(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class _e{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Yo(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new qn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Rt(this,this.stsTokenManager.getToken(this.auth,e));return V(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Ko(this,e)}reload(){return Xo(this)}_assign(e){this!==e&&(V(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new _e({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){V(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await ln(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(de(this.auth.app))return Promise.reject(we(this.auth));const e=await this.getIdToken();return await Rt(this,qo(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,c=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:g,isAnonymous:m,providerData:b,stsTokenManager:E}=n;V(h&&E,e,"internal-error");const _=ct.fromJSON(this.name,E);V(typeof h=="string",e,"internal-error"),Be(r,e.name),Be(i,e.name),V(typeof g=="boolean",e,"internal-error"),V(typeof m=="boolean",e,"internal-error"),Be(s,e.name),Be(a,e.name),Be(o,e.name),Be(l,e.name),Be(c,e.name),Be(d,e.name);const v=new _e({uid:h,auth:e,email:i,emailVerified:g,displayName:r,isAnonymous:m,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:_,createdAt:c,lastLoginAt:d});return b&&Array.isArray(b)&&(v.providerData=b.map(k=>({...k}))),l&&(v._redirectEventId=l),v}static async _fromIdTokenResponse(e,n,r=!1){const i=new ct;i.updateFromServerResponse(n);const s=new _e({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await ln(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];V(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Oi(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new ct;o.updateFromIdToken(r);const l=new _e({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new qn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ar=new Map;function Ae(t){De(t instanceof Function,"Expected a class definition");let e=Ar.get(t);return e?(De(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Ar.set(t,e),e)}/**
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
 */class Ni{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Ni.type="NONE";const Pr=Ni;/**
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
 */function Jt(t,e,n){return`firebase:${t}:${e}:${n}`}class ut{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Jt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Jt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await on(this.auth,{idToken:e}).catch(()=>{});return n?_e._fromGetAccountInfoResponse(this.auth,n,e):null}return _e._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new ut(Ae(Pr),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||Ae(Pr);const a=Jt(r,e.config.apiKey,e.name);let o=null;for(const c of n)try{const d=await c._get(a);if(d){let h;if(typeof d=="string"){const g=await on(e,{idToken:d}).catch(()=>{});if(!g)break;h=await _e._fromGetAccountInfoResponse(e,g,d)}else h=_e._fromJSON(e,d);c!==s&&(o=h),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new ut(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(a)}catch{}})),new ut(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rr(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Ui(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Di(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Bi(e))return"Blackberry";if(Vi(e))return"Webos";if(Li(e))return"Safari";if((e.includes("chrome/")||Mi(e))&&!e.includes("edge/"))return"Chrome";if(Fi(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Di(t=oe()){return/firefox\//i.test(t)}function Li(t=oe()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Mi(t=oe()){return/crios\//i.test(t)}function Ui(t=oe()){return/iemobile/i.test(t)}function Fi(t=oe()){return/android/i.test(t)}function Bi(t=oe()){return/blackberry/i.test(t)}function Vi(t=oe()){return/webos/i.test(t)}function rr(t=oe()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function tl(t=oe()){var e;return rr(t)&&!!((e=window.navigator)!=null&&e.standalone)}function nl(){return ga()&&document.documentMode===10}function Hi(t=oe()){return rr(t)||Fi(t)||Vi(t)||Bi(t)||/windows phone/i.test(t)||Ui(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wi(t,e=[]){let n;switch(t){case"Browser":n=Rr(oe());break;case"Worker":n=`${Rr(oe())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Dt}/${r}`}/**
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
 */class rl{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function il(t,e={}){return Ye(t,"GET","/v2/passwordPolicy",Je(t,e))}/**
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
 */const sl=6;class al{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??sl,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ol{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new xr(this),this.idTokenSubscription=new xr(this),this.beforeStateQueue=new rl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Ci,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Ae(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await ut.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await on(this,{idToken:e}),r=await _e._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(de(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return V(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await ln(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Fo()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(de(this.app))return Promise.reject(we(this));const n=e?Me(e):null;return n&&V(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&V(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return de(this.app)?Promise.reject(we(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return de(this.app)?Promise.reject(we(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ae(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await il(this),n=new al(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Ot("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await el(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Ae(e)||this._popupRedirectResolver;V(n,this,"argument-error"),this.redirectPersistenceManager=await ut.create(this,[Ae(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(V(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return V(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Wi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(de(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&Ti(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Ue(t){return Me(t)}class xr{constructor(e){this.auth=e,this.observer=null,this.addObserver=va(n=>this.observer=n)}get next(){return V(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ll(t){pn=t}function ji(t){return pn.loadJS(t)}function cl(){return pn.recaptchaEnterpriseScript}function ul(){return pn.gapiScript}function dl(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class hl{constructor(){this.enterprise=new fl}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class fl{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
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
 */const gl="recaptcha-enterprise",zi="NO_RECAPTCHA",Or="onFirebaseAuthREInstanceReady";class Ve{constructor(e){this.type=gl,this.auth=Ue(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{Go(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const c=new zo(l);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,a(c.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;Cr(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(c=>{a(c)}).catch(()=>{a(zi)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new hl().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&Cr(window.grecaptcha)&&Ve.scriptInjectionDeferred)await Ve.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=cl();l.length!==0&&(l+=o+`&onload=${Or}`),Ve.scriptInjectionDeferred=new bi,window[Or]=()=>{var c;(c=Ve.scriptInjectionDeferred)==null||c.resolve()},ji(l).then(()=>{var c;return(c=Ve.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{i(o,s,a)}).catch(c=>{a(c)})}}).catch(o=>{a(o)})})}}Ve.scriptInjectionDeferred=null;async function Nr(t,e,n,r=!1,i=!1){const s=new Ve(t);let a;if(i)a=zi;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,c=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Kn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Nr(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Nr(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pl(t,e){const n=$i(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(ft(s,e??{}))return i;pe(i,"already-initialized")}return n.initialize({options:e})}function ml(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Ae);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function _l(t,e,n){const r=Ue(t);V(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Gi(e),{host:a,port:o}=bl(e),l=o===null?"":`:${o}`,c={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){V(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),V(ft(c,r.config.emulator)&&ft(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,Xn(a)?Sa(`${s}//${a}${l}`):yl()}function Gi(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function bl(t){const e=Gi(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Dr(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Dr(a)}}}function Dr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function yl(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ir{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Te("not implemented")}_getIdTokenResponse(e){return Te("not implemented")}_linkToIdToken(e,n){return Te("not implemented")}_getReauthenticationResolver(e){return Te("not implemented")}}async function vl(t,e){return Ye(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wl(t,e){return Mt(t,"POST","/v1/accounts:signInWithPassword",Je(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $l(t,e){return Mt(t,"POST","/v1/accounts:signInWithEmailLink",Je(t,e))}async function Sl(t,e){return Mt(t,"POST","/v1/accounts:signInWithEmailLink",Je(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt extends ir{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new xt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new xt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Kn(e,n,"signInWithPassword",wl);case"emailLink":return $l(e,{email:this._email,oobCode:this._password});default:pe(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Kn(e,r,"signUpPassword",vl);case"emailLink":return Sl(e,{idToken:n,email:this._email,oobCode:this._password});default:pe(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dt(t,e){return Mt(t,"POST","/v1/accounts:signInWithIdp",Je(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kl="http://localhost";class nt extends ir{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new nt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):pe("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new nt(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return dt(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,dt(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,dt(e,n)}buildRequest(){const e={requestUri:kl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Nt(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function El(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Il(t){const e=wt($t(t)).link,n=e?wt($t(e)).deep_link_id:null,r=wt($t(t)).deep_link_id;return(r?wt($t(r)).link:null)||r||n||e||t}class sr{constructor(e){const n=wt($t(e)),r=n.apiKey??null,i=n.oobCode??null,s=El(n.mode??null);V(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=Il(e);try{return new sr(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(){this.providerId=bt.PROVIDER_ID}static credential(e,n){return xt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=sr.parseLink(n);return V(r,"argument-error"),xt._fromEmailAndCode(e,r.code,r.tenantId)}}bt.PROVIDER_ID="password";bt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";bt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Ut extends mn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He extends Ut{constructor(){super("facebook.com")}static credential(e){return nt._fromParams({providerId:He.PROVIDER_ID,signInMethod:He.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return He.credentialFromTaggedObject(e)}static credentialFromError(e){return He.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return He.credential(e.oauthAccessToken)}catch{return null}}}He.FACEBOOK_SIGN_IN_METHOD="facebook.com";He.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie extends Ut{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return nt._fromParams({providerId:Ie.PROVIDER_ID,signInMethod:Ie.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Ie.credentialFromTaggedObject(e)}static credentialFromError(e){return Ie.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Ie.credential(n,r)}catch{return null}}}Ie.GOOGLE_SIGN_IN_METHOD="google.com";Ie.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We extends Ut{constructor(){super("github.com")}static credential(e){return nt._fromParams({providerId:We.PROVIDER_ID,signInMethod:We.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return We.credentialFromTaggedObject(e)}static credentialFromError(e){return We.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return We.credential(e.oauthAccessToken)}catch{return null}}}We.GITHUB_SIGN_IN_METHOD="github.com";We.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je extends Ut{constructor(){super("twitter.com")}static credential(e,n){return nt._fromParams({providerId:je.PROVIDER_ID,signInMethod:je.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return je.credentialFromTaggedObject(e)}static credentialFromError(e){return je.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return je.credential(n,r)}catch{return null}}}je.TWITTER_SIGN_IN_METHOD="twitter.com";je.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cl(t,e){return Mt(t,"POST","/v1/accounts:signUp",Je(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await _e._fromIdTokenResponse(e,r,i),a=Lr(r);return new rt({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Lr(r);return new rt({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Lr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn extends Ke{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,cn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new cn(e,n,r,i)}}function qi(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?cn._fromErrorAndOperation(t,s,e,r):s})}async function Tl(t,e,n=!1){const r=await Rt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return rt._forOperation(t,"link",r)}/**
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
 */async function Al(t,e,n=!1){const{auth:r}=t;if(de(r.app))return Promise.reject(we(r));const i="reauthenticate";try{const s=await Rt(t,qi(r,i,e,t),n);V(s.idToken,r,"internal-error");const a=nr(s.idToken);V(a,r,"internal-error");const{sub:o}=a;return V(t.uid===o,r,"user-mismatch"),rt._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&pe(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ki(t,e,n=!1){if(de(t.app))return Promise.reject(we(t));const r="signIn",i=await qi(t,r,e),s=await rt._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Pl(t,e){return Ki(Ue(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ji(t){const e=Ue(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Rl(t,e,n){if(de(t.app))return Promise.reject(we(t));const r=Ue(t),a=await Kn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Cl).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Ji(t),l}),o=await rt._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function xl(t,e,n){return de(t.app)?Promise.reject(we(t)):Pl(Me(t),bt.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Ji(t),r})}function Ol(t,e,n,r){return Me(t).onIdTokenChanged(e,n,r)}function Nl(t,e,n){return Me(t).beforeAuthStateChanged(e,n)}function Dl(t,e,n,r){return Me(t).onAuthStateChanged(e,n,r)}function Ll(t){return Me(t).signOut()}const un="__sak";/**
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
 */class Yi{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(un,"1"),this.storage.removeItem(un),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ml=1e3,Ul=10;class Xi extends Yi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Hi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);nl()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Ul):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Ml)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Xi.type="LOCAL";const Fl=Xi;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi extends Yi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Qi.type="SESSION";const Zi=Qi;/**
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
 */function Bl(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class _n{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new _n(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async c=>c(n.origin,s)),l=await Bl(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}_n.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ar(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class Vl{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const c=ar("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const g=h;if(g.data.eventId===c)switch(g.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(g.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $e(){return window}function Hl(t){$e().location.href=t}/**
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
 */function es(){return typeof $e().WorkerGlobalScope<"u"&&typeof $e().importScripts=="function"}async function Wl(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function jl(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function zl(){return es()?self:null}/**
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
 */const ts="firebaseLocalStorageDb",Gl=1,dn="firebaseLocalStorage",ns="fbase_key";class Ft{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function bn(t,e){return t.transaction([dn],e?"readwrite":"readonly").objectStore(dn)}function ql(){const t=indexedDB.deleteDatabase(ts);return new Ft(t).toPromise()}function rs(){const t=indexedDB.open(ts,Gl);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(dn,{keyPath:ns})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(dn)?e(r):(r.close(),await ql(),e(await rs()))})})}async function Mr(t,e,n){const r=bn(t,!0).put({[ns]:e,value:n});return new Ft(r).toPromise()}async function Kl(t,e){const n=bn(t,!1).get(e),r=await new Ft(n).toPromise();return r===void 0?null:r.value}function Ur(t,e){const n=bn(t,!0).delete(e);return new Ft(n).toPromise()}const Jl=800,Yl=3;class is{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=rs(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>Yl)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return es()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=_n._getInstance(zl()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await Wl(),!this.activeServiceWorker)return;this.sender=new Vl(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||jl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Mr(e,un,"1"),await Ur(e,un)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Mr(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>Kl(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Ur(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=bn(i,!1).getAll();return new Ft(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||Ti(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Jl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}is.type="LOCAL";const Xl=is;new Lt(3e4,6e4);/**
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
 */function or(t,e){return e?Ae(e):(V(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class lr extends ir{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return dt(e,this._buildIdpRequest())}_linkToIdToken(e,n){return dt(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return dt(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Ql(t){return Ki(t.auth,new lr(t),t.bypassAuthState)}function Zl(t){const{auth:e,user:n}=t;return V(n,e,"internal-error"),Al(n,new lr(t),t.bypassAuthState)}async function ec(t){const{auth:e,user:n}=t;return V(n,e,"internal-error"),Tl(n,new lr(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Ql;case"linkViaPopup":case"linkViaRedirect":return ec;case"reauthViaPopup":case"reauthViaRedirect":return Zl;default:pe(this.auth,"internal-error")}}resolve(e){De(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){De(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tc=new Lt(2e3,1e4);async function nc(t,e,n){if(de(t.app))return Promise.reject(be(t,"operation-not-supported-in-this-environment"));const r=Ue(t);Ai(t,e,mn);const i=or(r,n);return new Qe(r,"signInViaPopup",e,i).executeNotNull()}class Qe extends ss{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Qe.currentPopupAction&&Qe.currentPopupAction.cancel(),Qe.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return V(e,this.auth,"internal-error"),e}async onExecution(){De(this.filter.length===1,"Popup operations only handle one event");const e=ar();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(be(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(be(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Qe.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(be(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,tc.get())};e()}}Qe.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rc="pendingRedirect",Yt=new Map;class ic extends ss{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Yt.get(this.auth._key());if(!e){try{const r=await sc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Yt.set(this.auth._key(),e)}return this.bypassAuthState||Yt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function sc(t,e){const n=os(e),r=as(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function ac(t,e){return as(t)._set(os(e),"true")}function oc(t,e){Yt.set(t._key(),e)}function as(t){return Ae(t._redirectPersistence)}function os(t){return Jt(rc,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lc(t,e,n){return cc(t,e,n)}async function cc(t,e,n){if(de(t.app))return Promise.reject(we(t));const r=Ue(t);Ai(t,e,mn),await r._initializationPromise;const i=or(r,n);return await ac(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function uc(t,e,n=!1){if(de(t.app))return Promise.reject(we(t));const r=Ue(t),i=or(r,e),a=await new ic(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dc=600*1e3;class hc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!fc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!ls(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(be(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=dc&&this.cachedEventUids.clear(),this.cachedEventUids.has(Fr(e))}saveEventToCache(e){this.cachedEventUids.add(Fr(e)),this.lastProcessedEventTime=Date.now()}}function Fr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function ls({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function fc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ls(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gc(t,e={}){return Ye(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,mc=/^https?/;async function _c(t){if(t.config.emulator)return;const{authorizedDomains:e}=await gc(t);for(const n of e)try{if(bc(n))return}catch{}pe(t,"unauthorized-domain")}function bc(t){const e=Gn(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!mc.test(n))return!1;if(pc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const yc=new Lt(3e4,6e4);function Br(){const t=$e().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function vc(t){return new Promise((e,n)=>{var i,s,a;function r(){Br(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Br(),n(be(t,"network-request-failed"))},timeout:yc.get()})}if((s=(i=$e().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=$e().gapi)!=null&&a.load)r();else{const o=dl("iframefcb");return $e()[o]=()=>{gapi.load?r():n(be(t,"network-request-failed"))},ji(`${ul()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw Xt=null,e})}let Xt=null;function wc(t){return Xt=Xt||vc(t),Xt}/**
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
 */const $c=new Lt(5e3,15e3),Sc="__/auth/iframe",kc="emulator/auth/iframe",Ec={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Ic=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Cc(t){const e=t.config;V(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?tr(e,kc):`https://${t.config.authDomain}/${Sc}`,r={apiKey:e.apiKey,appName:t.name,v:Dt},i=Ic.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Nt(r).slice(1)}`}async function Tc(t){const e=await wc(t),n=$e().gapi;return V(n,t,"internal-error"),e.open({where:document.body,url:Cc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Ec,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=be(t,"network-request-failed"),o=$e().setTimeout(()=>{s(a)},$c.get());function l(){$e().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
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
 */const Ac={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Pc=500,Rc=600,xc="_blank",Oc="http://localhost";class Vr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Nc(t,e,n,r=Pc,i=Rc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...Ac,width:r.toString(),height:i.toString(),top:s,left:a},c=oe().toLowerCase();n&&(o=Mi(c)?xc:n),Di(c)&&(e=e||Oc,l.scrollbars="yes");const d=Object.entries(l).reduce((g,[m,b])=>`${g}${m}=${b},`,"");if(tl(c)&&o!=="_self")return Dc(e||"",o),new Vr(null);const h=window.open(e||"",o,d);V(h,t,"popup-blocked");try{h.focus()}catch{}return new Vr(h)}function Dc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const Lc="__/auth/handler",Mc="emulator/auth/handler",Uc=encodeURIComponent("fac");async function Hr(t,e,n,r,i,s){V(t.config.authDomain,t,"auth-domain-config-required"),V(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Dt,eventId:i};if(e instanceof mn){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",ya(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Ut){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),c=l?`#${Uc}=${encodeURIComponent(l)}`:"";return`${Fc(t)}?${Nt(o).slice(1)}${c}`}function Fc({config:t}){return t.emulator?tr(t,Mc):`https://${t.authDomain}/${Lc}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rn="webStorageSupport";class Bc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Zi,this._completeRedirectFn=uc,this._overrideRedirectResult=oc}async _openPopup(e,n,r,i){var a;De((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Hr(e,n,r,Gn(),i);return Nc(e,s,ar())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Hr(e,n,r,Gn(),i);return Hl(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(De(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Tc(e),r=new hc(e);return n.register("authEvent",i=>(V(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Rn,{type:Rn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[Rn];s!==void 0&&n(!!s),pe(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=_c(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Hi()||Li()||rr()}}const Vc=Bc;var Wr="@firebase/auth",jr="1.13.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hc{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){V(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wc(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function jc(t){At(new gt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;V(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Wi(t)},c=new ol(r,i,s,l);return ml(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),At(new gt("auth-internal",e=>{const n=Ue(e.getProvider("auth").getImmediate());return(r=>new Hc(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),lt(Wr,jr,Wc(t)),lt(Wr,jr,"esm2020")}/**
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
 */const zc=300,Gc=_i("authIdTokenMaxAge")||zc;let zr=null;const qc=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Gc)return;const i=n==null?void 0:n.token;zr!==i&&(zr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Kc(t=So()){const e=$i(t,"auth");if(e.isInitialized())return e.getImmediate();const n=pl(t,{popupRedirectResolver:Vc,persistence:[Xl,Fl,Zi]}),r=_i("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=qc(s.toString());Nl(n,a,()=>a(n.currentUser)),Ol(n,o=>a(o))}}const i=ca("auth");return i&&_l(n,`http://${i}`),n}function Jc(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}ll({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=be("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",Jc().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});jc("Browser");const Yc={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},Ee=Yc,pt=!!Ee.VITE_FIREBASE_APP_ID;let xn=null;function at(){if(!pt)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!xn){const t=Si({apiKey:Ee.VITE_FIREBASE_API_KEY,authDomain:Ee.VITE_FIREBASE_AUTH_DOMAIN,projectId:Ee.VITE_FIREBASE_PROJECT_ID,appId:Ee.VITE_FIREBASE_APP_ID,...Ee.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:Ee.VITE_FIREBASE_STORAGE_BUCKET},...Ee.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:Ee.VITE_FIREBASE_MESSAGING_SENDER_ID}});xn=Kc(t)}return xn}function Gr(){return new Ie}async function qr(){if(!pt)return;const t=at();t.currentUser&&await Ll(t)}var Xc=p(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),Qc=p('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),Zc=p("<button type=button class=gate-toggle>"),eu=p("<div class=gate-or>── or ──"),tu=p("<button type=button class=btn>Continue with Google"),nu=p("<div class=gate-error role=alert>"),ru=p("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),iu=p("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),su=p("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const au={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Kr(t){const e=(t==null?void 0:t.code)??"";return au[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function ou(t){return(()=>{var e=Xc(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),j(l,"click",t.onSignOut),e})()}function lu(){const[t,e]=O("signin"),[n,r]=O(""),[i,s]=O(""),[a,o]=O(!1),[l,c]=O("");zs(async g=>{if(!pt)return null;const m=at().currentUser;return m?await m.getIdToken(g):null});async function d(g){if(g.preventDefault(),!a()){o(!0),c("");try{const m=at();t()==="create"?await Rl(m,n(),i()):await xl(m,n(),i())}catch(m){c(Kr(m))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await nc(at(),Gr())}catch(g){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(g==null?void 0:g.code)){await lc(at(),Gr());return}c(Kr(g))}finally{o(!1)}}}return(()=>{var g=ru(),m=g.firstChild;return m.firstChild,u(m,f(I,{when:pt,get fallback(){return[iu(),su()]},get children(){return[(()=>{var b=Qc(),E=b.firstChild,_=E.firstChild,v=_.nextSibling,k=E.nextSibling,T=k.firstChild,A=T.nextSibling,P=k.nextSibling;return b.addEventListener("submit",d),v.$$input=C=>r(C.currentTarget.value),A.$$input=C=>s(C.currentTarget.value),u(P,(()=>{var C=J(()=>!!a());return()=>C()?"Working…":t()==="create"?"Create account":"Sign in"})()),$(C=>{var F=t()==="create"?"new-password":"current-password",N=a();return F!==C.e&&ee(A,"autocomplete",C.e=F),N!==C.t&&(P.disabled=C.t=N),C},{e:void 0,t:void 0}),$(()=>v.value=n()),$(()=>A.value=i()),b})(),(()=>{var b=Zc();return b.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(b,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),$(()=>b.disabled=a()),b})(),eu(),(()=>{var b=tu();return b.$$click=h,$(()=>b.disabled=a()),b})(),f(I,{get when(){return l()},get children(){var b=nu();return u(b,l),b}})]}}),null),g})()}ye(["click","input"]);var cu=p("<div class=gate-error role=alert>"),uu=p("<p class=gate-note>No grant-file entries yet."),du=p("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),hu=p('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),fu=p("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function gu(t){const[e,n]=O([]),[r,i]=O([]),[s,a]=O(""),[o,l]=O(!1),[c,d]=O(""),h=_=>{n((_==null?void 0:_.file_grants)??[]),i((_==null?void 0:_.static_emails)??[])};ht(async()=>{try{h(await qs())}catch{d("Could not load the grant list.")}});const m=_=>{_.key==="Escape"&&t.onClose()};ht(()=>{window.addEventListener("keydown",m),Oe(()=>window.removeEventListener("keydown",m));const _=document.querySelector(".access-add input");_==null||_.focus()});const b=async _=>{if(_.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await Ks(s())),a("")}catch(v){d(v.message)}l(!1)}},E=async _=>{if(!o()){l(!0),d("");try{h(await Js(_))}catch(v){d(v.message)}l(!1)}};return(()=>{var _=hu(),v=_.firstChild,k=v.firstChild,T=k.nextSibling,A=T.nextSibling,P=A.firstChild,C=P.nextSibling,F=A.nextSibling;return j(_,"click",t.onClose),v.$$click=N=>N.stopPropagation(),u(v,f(I,{get when(){return c()},get children(){var N=cu();return u(N,c),N}}),A),u(v,f(ae,{get each(){return e()},children:N=>(()=>{var U=fu(),w=U.firstChild,L=w.nextSibling;return u(w,N),L.$$click=()=>E(N),ee(L,"title",`Remove ${N}`),ee(L,"aria-label",`Remove ${N}`),$(()=>L.disabled=o()),U})()}),A),u(v,f(I,{get when(){return e().length===0},get children(){return uu()}}),A),A.addEventListener("submit",b),P.$$input=N=>a(N.currentTarget.value),u(C,()=>o()?"…":"Add"),u(v,f(I,{get when(){return r().length>0},get children(){var N=du();return N.firstChild,u(N,()=>r().join(", "),null),N}}),F),j(F,"click",t.onClose),$(()=>C.disabled=o()),$(()=>P.value=s()),_})()}ye(["click","input"]);const Pe=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),Ct=(t,e,n)=>Math.min(n,Math.max(e,t));function pu(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:Ct((n-t)/r,0,1)}function mu(t,e,n,r,i=Pe){if(n<i.minRateOfReturn||t<=0)return null;const s=Ct(t/2,0,1),a=Ct(e,0,1),o=Math.min(n/i.idealReturn,1),l=Ct((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function _u(t,e=Pe){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?Ct(1+t.delta,0,1):pu(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),mu(r,a,n,i,e)}function bu(t,e=Pe.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function yu(t){return t.weightSharpe===Pe.weightSharpe&&t.weightSafety===Pe.weightSafety&&t.weightReturn===Pe.weightReturn&&t.minRateOfReturn===Pe.minRateOfReturn}var vu=p("<span class=hint>production defaults · drag to re-rank live"),wu=p("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),$u=p('<span class="hint hint-custom">custom weights'),Su=p("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function ku(){const[t,e]=O({...Pe});return{params:t,isCustom:()=>!yu(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Pe})}}const Eu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function Iu(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=wu(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(I,{get when(){return!e()},get fallback(){return $u()},get children(){return vu()}}),null),u(s,f(ae,{each:Eu,children:o=>(()=>{var l=Su(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,g=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(I,{get when(){return o.weight},get children(){return[" ","· ",J(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),g.$$input=m=>t.scoring.setParam(o.key,Number(m.currentTarget.value)),$(m=>{var b=o.max,E=o.step;return b!==m.e&&ee(g,"max",m.e=b),E!==m.t&&ee(g,"step",m.t=E),m},{e:void 0,t:void 0}),$(()=>g.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),$(()=>r.open=e()),r})()}ye(["click","input"]);const yn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],St=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],cs="webapp.columns.v1";function Cu(){try{const t=localStorage.getItem(cs);if(!t)return St;const e=JSON.parse(t);if(!Array.isArray(e))return St;const n=new Set(yn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:St}catch{return St}}function Tu(t){try{localStorage.setItem(cs,JSON.stringify(t))}catch{}}var Au=p("<div class=pop-backdrop>"),Pu=p('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Ru=p("<span class=colpicker><button type=button class=tool-btn>columns ▾"),xu=p("<label class=pick-item><input type=checkbox>");function Ou(t){const[e,n]=O(!1);return(()=>{var r=Ru(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(I,{get when(){return e()},get children(){return[(()=>{var s=Au();return s.$$click=()=>n(!1),s})(),(()=>{var s=Pu(),a=s.firstChild,o=a.nextSibling;return u(a,f(ae,{each:yn,children:l=>(()=>{var c=xu(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),$(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),$(()=>ee(i,"aria-expanded",e())),r})()}ye(["click"]);var Nu=p('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),Du=p("<span class=pggap>…"),Lu=p("<button type=button class=pgbtn>");function Mu(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function Uu(t){const e=ie(()=>Mu(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Nu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,f(ae,{get each(){return e()},children:d=>d==="…"?Du():(()=>{var h=Lu();return h.$$click=()=>t.onGo(d),u(h,d),$(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,$(d=>{var h=t.page()<=1,g=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),g!==d.t&&(c.disabled=d.t=g),d},{e:void 0,t:void 0}),i})()}ye(["click"]);var Fu=p("<span class=tip>");function yt(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=Fu();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?Ws(i,r):e=r,u(r,()=>t.children),$(()=>ee(r,"data-tip",t.text??"")),r})()}ye(["focusin"]);const tt="∅";function Q(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function kt(t){return Number(t??0).toLocaleString("en-US")}function hn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function us(t){return ds(t,{hour:"2-digit",minute:"2-digit"})}function Bu(t){return ds(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function ds(t,e){const n=hn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const hs={text:tt,isNull:!0},On=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Jr(t,e){return!e||Q(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function Vu(t,e){return!e||Q(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function Hu(t){if(!t||typeof t!="object"||Q(t.report_date))return hs;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function fe(t,e){if(Q(e))return hs;switch(t){case"fixed2":return On(e,2);case"fixed3":return On(e,3);case"ivrv":return On(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return Hu(e);default:return{text:String(e),isNull:!1}}}const Yr=t=>Number(t*100).toFixed(0);function Wu(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Yr(e.momentum_high),s=Yr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function vt(t,e){return Wu(e)[t]??t}var fs=p("<span class=tip-target>"),ju=p("<div class=kv><span class=kv-label></span><span class=kv-value>"),zu=p("<span class=tip-target>Strike position in band"),Gu=p('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),qu=p("<div class=exp-block><h4>"),Ku=p("<div class=kv-value>Band unavailable (∅)"),Ju=p("<div><span class=marker-tick></span><span class=marker-cap><br>"),Yu=p("<div class=exp-block><h4>Premium economics"),Xu=p("<b>"),Qu=p('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),Zu=p("<div class=muted-note>earnings-discounted safety applied"),ed=p("<div class=exp-block><h4>Score breakdown"),td=p("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),nd=p('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),rd=p("<span class=muted-note>all columns visible"),id=p('<div class="exp-block exp-chips"><h4>Hidden columns'),sd=p("<span class=tip-target>: "),ad=p("<span>"),od=p("<span class=tip-target>band safety is already discounted by the earnings rule."),ld=p("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),cd=p("<div class=expansion><div class=exp-grid>");const Nn={sharpe:.2,safety:.4,return_part:.4};function Dn(t,e=2){return Q(t)?tt:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function ve(t,e,n){return(()=>{var r=ju(),i=r.firstChild,s=i.nextSibling;return u(i,f(yt,{get text(){return vt(t,e)},get children(){var a=fs();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function ud(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=Q(e.mid)?null:e.strike-e.mid,s=i!=null&&!Q(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!Q(a)&&l>a&&!Q(e.strike),d=g=>{if(Q(g))return null;const m=(g-a)/(l-a)*100;return Math.min(100,Math.max(0,m))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(g=>d(g.v)!=null):[];return(()=>{var g=qu(),m=g.firstChild;return u(m,f(yt,{get text(){return vt("band_range",t.thresholds)},get children(){return zu()}})),u(g,f(I,{when:c,get fallback(){return Ku()},get children(){var b=Gu(),E=b.firstChild;return u(b,f(ae,{each:h,children:_=>(()=>{var v=Ju(),k=v.firstChild,T=k.nextSibling,A=T.firstChild;return u(T,()=>_.label,A),u(T,()=>fe("fixed2",_.v).text,null),$(P=>{var C=`marker ${_.cls}`,F=`${d(_.v)}%`;return C!==P.e&&le(v,P.e=C),F!==P.t&&et(v,"left",P.t=F),P},{e:void 0,t:void 0}),v})()}),null),$(_=>{var v=`${d(e.strike_from)}%`,k=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return v!==_.e&&et(E,"left",_.e=v),k!==_.t&&et(E,"width",_.t=k),_},{e:void 0,t:void 0}),b}}),null),u(g,()=>ve("band_range",t.thresholds,`${fe("fixed2",e.strike_from).text} → ${fe("fixed2",e.strike_to).text}`),null),u(g,()=>ve("band_depth",t.thresholds,r==null?tt:`${(r*100).toFixed(1)}%`),null),u(g,()=>ve("cushion_be",t.thresholds,s==null?tt:`${s.toFixed(1)}%`),null),g})()}function dd(t){const e=t.row,n=Q(e.strike)?null:e.strike*100,r=Q(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=fe("pct1",e.rate_of_return);return(()=>{var a=Yu();return a.firstChild,u(a,()=>ve("capital",t.thresholds,n==null?tt:Dn(n,0)),null),u(a,()=>ve("premium",t.thresholds,r==null?tt:Dn(r)),null),u(a,()=>ve("breakeven",t.thresholds,i==null?tt:Dn(i)),null),u(a,()=>ve("ann_ror",t.thresholds,(()=>{var o=Xu();return u(o,()=>s.text),o})()),null),u(a,()=>ve("bid",t.thresholds,fe("fixed2",e.bid).text),null),u(a,()=>ve("ask",t.thresholds,fe("fixed2",e.ask).text),null),u(a,()=>ve("expiration",t.thresholds,e.expiration),null),a})()}function hd(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:Nn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:Nn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:Nn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=ed();return i.firstChild,u(i,f(I,{when:n,get fallback(){return(()=>{var s=td(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>fe("fixed3",e.score).text),s})()},get children(){return[f(ae,{each:r,children:s=>{const a=Q(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=nd(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,g=h.nextSibling;g.nextSibling;var m=l.nextSibling,b=m.firstChild,E=m.nextSibling;return u(l,f(yt,{get text(){return vt(s.key,t.thresholds)},get children(){var _=fs();return u(_,()=>s.label),_}}),c),u(d,()=>s.weight*100,g),u(E,()=>fe("fixed3",s.v).text),$(_=>et(b,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=Qu(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>fe("fixed3",e.score).text),s})(),f(I,{get when(){return e.earnings_before_expiry},get children(){return Zu()}})]}}),null),i})()}function fd(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:fe(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=id();return n.firstChild,u(n,f(ae,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=ad();return u(s,f(yt,{get text(){return vt(r.id,t.thresholds)},get children(){var a=sd(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),$(()=>le(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(I,{get when(){return t.hiddenDefs.length===0},get children(){return rd()}}),null),n})()}function gd(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=cd(),i=r.firstChild;return u(r,f(I,{when:n,get children(){var s=ld(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(I,{get when(){return n.report_time},children:g=>g().replaceAll("_"," ")}),c),u(s,f(I,{get when(){return!Q(n.expected_eps)},get children(){return[" ","· expected EPS ",J(()=>fe("fixed2",n.expected_eps).text)]}}),h),u(s,f(yt,{get text(){return vt("earnings_before_expiry",t.thresholds)},get children(){return od()}}),null),s}}),i),u(i,f(ud,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(dd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(hd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(fd,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var pd=p("<span class=null-mark>"),md=p("<span class=star>★"),_d=p("<td><b>"),Ln=p("<span>"),Xr=p("<td class=num>"),bd=p("<span class=score-frozen>prod "),yd=p('<td class="num score-cell">'),vd=p('<span class="score-frozen readmit">re-admitted'),wd=p("<td>"),$d=p("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),Sd=p("<span class=sort-arrow>"),kd=p("<span class=tip-target>"),Ed=p("<th role=button tabindex=0>"),Id=p("<tr class=expandable><td class=exp-col>"),Cd=p("<tr class=exp-row><td>");const Td=t=>`${t.underlying}|${t.strike}`;function Ad(t){return(()=>{var e=pd();return u(e,()=>t.text),e})()}function jt(t){const e=fe(t.kind,t.value);return f(I,{get when(){return!e.isNull},get fallback(){return f(Ad,{get text(){return e.text}})},get children(){return e.text}})}function Pd(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=_d(),i=r.firstChild;return u(r,f(I,{get when(){return t.pickRank!=null},get children(){var s=md();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(I,{get when(){return Jr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=Ln();return $(()=>le(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Xr();return u(r,f(I,{get when(){return Jr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=Ln();return $(()=>le(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(jt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=yd();return u(r,f(jt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(I,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(I,{get when(){return!Q(n.frozen_score)},get fallback(){return f(I,{get when(){return!Q(n.score)},get children(){return vd()}})},get children(){var i=bd();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=Xr();return u(r,f(jt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(I,{get when(){return Vu(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=Ln();return u(s,i),$(()=>le(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=wd();return u(r,f(jt,{get kind(){return e.kind},get value(){return n[e.id]}})),$(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Rd(t){const e=ie(()=>yn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=$d(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(ae,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=Ed();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,f(yt,{get text(){return vt(a.id,t.thresholds)},get children(){var c=kd();return u(c,()=>a.label,null),u(c,f(I,{get when(){return o()},get children(){return[" ",(()=>{var d=Sd();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),$(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&ee(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,f(ae,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>Td(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=Id(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,f(ae,{get each(){return e()},children:g=>f(Pd,{col:g,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),$(g=>{var m=o()!=null,b=!!Q(a.score),E=!!c();return m!==g.e&&d.classList.toggle("pick",g.e=m),b!==g.t&&d.classList.toggle("prow",g.t=b),E!==g.a&&d.classList.toggle("open",g.a=E),g},{e:void 0,t:void 0,a:void 0}),d})(),f(I,{get when(){return c()},get children(){var d=Cd(),h=d.firstChild;return u(h,f(gd,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),$(()=>ee(h,"colspan",e().length+1)),d}})]}})),n})()}ye(["click","keydown"]);function xd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const ot=t=>Q(t);function Od(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=ot(a),c=ot(o);return l||c?l&&c?0:l?1:-1:r*xd(a,o)})}function Nd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=ot(r),a=ot(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=ot(l),h=ot(c);return d||h?d&&h?0:d?1:-1:c-l})}var Dd=p("<div class=stage-badges>"),Ld=p("<pre class=errbox>"),Md=p("<details><summary> "),Ud=p("<div class=scroll-region>"),Fd=p('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),Bd=p("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),Vd=p("<div class=empty-panel>No rows match the current filter."),Hd=p('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Mn=100,Wd=150,Qr={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function jd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=Dd();return u(i,f(ae,{get each(){return t.stages??[]},children:s=>(()=>{var a=Md(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,f(I,{get when(){return s.error},get children(){var c=Ld();return u(c,()=>s.error),c}}),null),$(()=>le(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function Zr(t){const[e,n]=O(""),[r,i]=O(""),[s,a]=O(!0),[o,l]=O(null),[c,d]=O("asc"),[h,g]=O(1);let m;Oe(()=>clearTimeout(m));const b=()=>{var S;return((S=t.tf)==null?void 0:S.rows)??[]},E=ie(()=>{const S=t.scoring.params(),B=t.scoring.isCustom();return b().map(x=>{const W=_u(x,S);return{...x,frozen_score:x.score,live_parts:W,score:B?W==null?null:W.total:x.score}})}),_=ie(()=>E().filter(S=>!Q(S.score)&&Q(S.frozen_score)).length),v=S=>{const B=S.currentTarget.value;n(B),clearTimeout(m),m=setTimeout(()=>{i(B.trim().toLowerCase()),g(1)},Wd)},k=S=>{a(S),g(1)},T=S=>{o()!==S?(l(S),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),g(1)},[A,P]=O(null),C=S=>{const B=`${S.underlying}|${S.strike}`;P(x=>x===B?null:B)};Ze(Et([o,c,h,r,s],()=>P(null))),Ze(Et(t.active,()=>P(null))),Ze(Et(t.columns.visible,()=>g(1)));const F=()=>yn.filter(S=>!t.columns.visible().includes(S.id)),N=()=>(t.stages??[]).find(S=>S.name===Qr[t.id].id),U=ie(()=>{const S=r();return S?E().filter(B=>{const x=B.underlying,W=B.sector;return x!=null&&String(x).toLowerCase().includes(S)||W!=null&&String(W).toLowerCase().includes(S)}):E()}),w=ie(()=>{const S=U();return s()?S.filter(B=>!Q(B.score)):S}),L=ie(()=>o()?Od(w(),o(),c()):Nd(w())),H=ie(()=>Math.max(1,Math.ceil(L().length/Mn))),te=()=>Math.min(h(),H()),Z=()=>{const S=te();return L().slice((S-1)*Mn,S*Mn)},ce=ie(()=>{var B;const S=new Map;if(t.scoring.isCustom()){const x=bu(E().map(W=>({row:W,score:W.score})));for(const W of x)S.set(`${W.row.underlying}|${W.row.strike}`,S.size+1)}else for(const x of((B=t.tf)==null?void 0:B.top_picks)??[])S.set(`${x.underlying}|${x.strike}`,x.rank??"?");return S}),D=S=>ce().get(`${S.underlying}|${S.strike}`);return(()=>{var S=Fd(),B=S.firstChild,x=B.firstChild,W=x.nextSibling,ue=W.firstChild,q=W.nextSibling,Se=q.firstChild,Bt=Se.nextSibling;return Bt.nextSibling,u(S,f(jd,{get stages(){return t.stages}}),B),x.$$input=v,ue.addEventListener("change",re=>k(re.currentTarget.checked)),u(B,f(Ou,{get store(){return t.columns}}),q),u(q,()=>kt(L().length),Se),u(q,()=>kt(b().length),Bt),u(q,f(I,{get when(){return J(()=>!!t.scoring.isCustom())()&&_()>0},get children(){return[" ","· ",J(()=>kt(_()))," re-admitted by lower floor"]}}),null),u(S,f(I,{get when(){return Z().length>0},get children(){var re=Ud();return u(re,f(Rd,{get visibleCols(){return t.columns.visible},rows:Z,sortKey:o,sortDir:c,onSort:T,get thresholds(){return t.thresholds},pickRankOf:D,openKey:A,onToggleRow:C,hiddenDefs:F,get customScores(){return t.scoring.isCustom}})),re}}),null),u(S,f(I,{get when(){return Z().length===0},get children(){return f(I,{get when(){var re,ke;return((re=N())==null?void 0:re.status)==="failed"||((ke=N())==null?void 0:ke.status)==="partial"},get fallback(){return f(I,{get when(){return J(()=>!!s())()&&U().length>0},get fallback(){return Vd()},get children(){var re=Bd(),ke=re.firstChild,Fe=ke.nextSibling,it=Fe.nextSibling,y=it.nextSibling,R=y.nextSibling;return R.nextSibling,u(re,()=>kt(U().length),R),re}})},children:re=>(()=>{var ke=Hd(),Fe=ke.firstChild,it=Fe.firstChild,y=it.nextSibling;y.nextSibling;var R=Fe.nextSibling;return u(Fe,()=>re().status==="partial"?"△":"✗",it),u(Fe,()=>Qr[t.id].label,y),u(R,()=>re().error??"stage produced no data"),ke})()})}}),null),u(S,f(I,{get when(){return L().length>0},get children(){return f(Uu,{page:te,pageCount:H,onGo:g})}}),null),$(()=>S.hidden=!t.active()),$(()=>x.value=e()),$(()=>ue.checked=s()),S})()}ye(["input"]);var zd=p("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),Gd=p('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save</button><button type=button class=btn>cancel'),qd=p('<button type=button class="btn-ghost hp-cash-edit">'),Kd=p("<div class=hp-pool-list>"),Jd=p('<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add'),Yd=p('<span class=hp-pool-line><button type=button class=hp-pool-name></button><span class=hp-pool-cash></span><button type=button class="btn-ghost hp-pool-act">cash</button><button type=button class="btn-ghost hp-pool-act">rename</button><button type=button class="btn hp-pool-del">×'),Xd=p("<div class=hp-pool-item>"),Qd=p("<span class=hp-pool-row><input><button type=button class=btn>save</button><button type=button class=btn>cancel"),Zd=p('<button type=button class="btn-ghost holdings-close-btn">sell call…'),eh=p("<div class=hp-slot><div class=hp-lot-row><div class=hp-lot-row-top><span> sh </span><b></b></div><div class=hp-lot-row-sub><span>bought <!> · </span><b></b></div><div class=hp-lot-row-meta><i>last </i><i>covered <!>/"),th=p("<span class=hp-pool-tag>"),nh=p('<span class="chip high">buy back?'),rh=p('<span class="chip high">ITM — called away?'),cr=p("<b>"),ih=p("<i>"),sh=p('<div class=hp-slot><div class=hp-list-row><span class=hp-list-pos><span class=hp-kind></span><b> <!> ×</b><i>exp <!> · <!>/<!> wd</i></span><span></span><span class=hp-list-pace><i>target </i></span><span class=hp-list-status></span><button type=button class="btn-ghost holdings-close-btn">close…</button><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),ah=p('<span class="chip normal">holding'),oh=p("<b>—"),lh=p("<label>pool<select>"),ch=p("<div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares"),uh=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal></label><label>premium<input inputmode=decimal></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary"></button><button type=button class=btn>Cancel'),dh=p("<option>"),hh=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),fh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class=btn>Cancel'),gs=p("<label class=holdings-outcome-price><input inputmode=decimal>"),gh=p("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),ph=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),mh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),_h=p("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),bh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),yh=p("<div class=hp-list>"),ei=p("<div class=empty-panel>"),vh=p('<div class=hp-list><div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),wh=p("<span class=hp-pane-hint> sh held"),$h=p("<div class=hp-toolbar-row><button type=button class=btn>"),Sh=p('<button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),kh=p("<div class=holdings-notice>"),Eh=p('<div class="holdings-panel hp-tabs-shell"><div class=hp-tabs-grid><aside class=hp-tabs-rail><div class=hp-tabs-brand>Wheel ledger</div></aside><main class=hp-tabs-main><div class=hp-pane-head><span class=hp-pane-title>'),Ih=p("<button type=button class=hp-tab-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>");const Re=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),mt=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),Qt=(t,e=0)=>`${(t*100).toFixed(e)}%`,Ge=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),ps=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(Date.UTC(n,r-1,i+e,12)).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function ms(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function Ch(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=zd(),r=n.firstChild,i=r.nextSibling;return $(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&et(r,"width",s.e=a),o!==s.t&&et(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function Th(t){const[e,n]=O(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=Gd(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling;return s.$$keydown=l=>{var c;return l.key==="Escape"&&((c=t.onCancel)==null?void 0:c.call(t))},s.$$input=l=>n(l.target.value),a.$$click=()=>t.onSave(Number(e())),o.$$click=()=>{var l;return(l=t.onCancel)==null?void 0:l.call(t)},$(()=>{var l;return a.disabled=!r()||((l=t.busy)==null?void 0:l.call(t))}),$(()=>s.value=e()),i})()}function Ah(t){const[e,n]=O(!1),[r,i]=O(null),[s,a]=O(""),o=()=>t.pools??[],l=()=>t.pool,c=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,g=()=>c()==null,m=_=>{var v;_&&_!==((v=l())==null?void 0:v.id)&&t.onSelectPool(_),i(_??null),n(!0)},b=()=>{const _=o().find(v=>v.id===r());return _?_.cash:t.cash},E=async()=>{var _;!s().trim()||(_=t.busy)!=null&&_.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var _=Jd(),v=_.firstChild,k=v.nextSibling,T=k.nextSibling,A=T.firstChild,P=A.nextSibling;P.nextSibling;var C=T.nextSibling,F=C.firstChild,N=F.firstChild,U=N.nextSibling;return u(k,(()=>{var w=J(()=>h()==null);return()=>w()?"—":Re(h())})()),u(T,(()=>{var w=J(()=>c()==null);return()=>w()?"—":Re(c())})(),A),u(T,()=>Re(d()),P),u(_,f(I,{get when(){return!e()},get fallback(){return f(Th,{get cash(){return b()},get busy(){return t.busy},onSave:async w=>{await t.onSaveCash(w,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var w=qd();return w.$$click=()=>{var L;return m(((L=l())==null?void 0:L.id)??null)},u(w,()=>g()?"set cash":"edit cash"),w}}),C),u(C,f(I,{get when(){return o().length>0},get children(){var w=Kd();return u(w,f(ae,{get each(){return o()},children:L=>f(Ph,{pool:L,get selected(){var H;return((H=l())==null?void 0:H.id)===L.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(L.id)},onEditCash:()=>m(L.id),onRename:H=>t.onRenamePool(L.id,H),onDelete:()=>t.onDeletePool(L.id)})})),w}}),F),N.$$keydown=w=>w.key==="Enter"&&E(),N.$$input=w=>a(w.target.value),U.$$click=E,$(()=>{var w;return U.disabled=!s().trim()||((w=t.busy)==null?void 0:w.call(t))}),$(()=>N.value=s()),_})()}function Ph(t){const[e,n]=O(!1),[r,i]=O(t.pool.name),s=()=>{i(t.pool.name),n(!0)},a=()=>{var l;const o=r().trim();!o||o===t.pool.name||(l=t.busy)!=null&&l.call(t)||(t.onRename(o),n(!1))};return(()=>{var o=Xd();return u(o,f(I,{get when(){return!e()},get fallback(){return(()=>{var l=Qd(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling;return c.$$keydown=g=>{g.key==="Enter"?a():g.key==="Escape"&&n(!1)},c.$$input=g=>i(g.target.value),d.$$click=a,h.$$click=()=>n(!1),$(g=>{var E;var m=`rename ${t.pool.name}`,b=((E=t.busy)==null?void 0:E.call(t))||!r().trim()||r().trim()===t.pool.name;return m!==g.e&&ee(c,"aria-label",g.e=m),b!==g.t&&(d.disabled=g.t=b),g},{e:void 0,t:void 0}),$(()=>c.value=r()),l})()},get children(){var l=Yd(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling,g=h.nextSibling,m=g.nextSibling;return j(c,"click",t.onSelect),u(c,()=>t.pool.name),u(d,()=>Re(t.pool.cash)),j(h,"click",t.onEditCash),g.$$click=s,j(m,"click",t.onDelete),$(b=>{var v;var E=(v=t.busy)==null?void 0:v.call(t),_=`delete ${t.pool.name}`;return E!==b.e&&(m.disabled=b.e=E),_!==b.t&&ee(m,"aria-label",b.t=_),b},{e:void 0,t:void 0}),l}})),$(()=>o.classList.toggle("active",!!t.selected)),o})()}function Rh(t){const e=t.lot,n=()=>e.view;return(()=>{var r=eh(),i=r.firstChild,s=i.firstChild,a=s.firstChild,o=a.firstChild,l=a.nextSibling,c=s.nextSibling,d=c.firstChild,h=d.firstChild,g=h.nextSibling;g.nextSibling;var m=d.nextSibling,b=c.nextSibling,E=b.firstChild;E.firstChild;var _=E.nextSibling,v=_.firstChild,k=v.nextSibling;return k.nextSibling,u(a,()=>e.shares,o),u(a,()=>e.symbol,null),u(l,(()=>{var T=J(()=>n().spot==null);return()=>T()?"—":mt(n().spot)})()),u(d,()=>mt(e.basis_per_share),g),u(d,()=>e.acquired,null),u(m,f(I,{get when(){return n().pl_dollars!=null},fallback:"—",get children(){return`${Re(n().pl_dollars)} (${(n().pl_pct??0)>=0?"+":""}${Qt(n().pl_pct,1)})`}})),u(E,()=>{var T;return ms((T=e.mark)==null?void 0:T.as_of)||"—"},null),u(_,()=>n().covered,k),u(_,()=>n().capacity,null),u(r,f(I,{get when(){return n().capacity>0},get children(){var T=Zd();return T.$$click=()=>t.onSellDialog(e),T}}),null),u(r,f(I,{get when(){return t.dialogFor("sellCall",e.id)},keyed:!0,children:T=>f(Dh,{get lot(){return T.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}),null),$(()=>le(m,(n().pl_dollars??0)>=0?"holdings-pos":"holdings-neg")),r})()}function xh(t){const e=t.x,n=()=>e.v.spot_pct_vs_strike!=null&&e.v.spot_pct_vs_strike>0,r=()=>e.p.kind==="call"?e.v.spot_pct_vs_strike>0:e.v.spot_pct_vs_strike<0;return(()=>{var i=sh(),s=i.firstChild,a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,m=g.nextSibling,b=m.nextSibling,E=b.nextSibling,_=E.nextSibling,v=_.nextSibling;v.nextSibling;var k=a.nextSibling,T=k.nextSibling,A=T.firstChild;A.firstChild;var P=T.nextSibling,C=P.nextSibling,F=C.nextSibling,N=F.firstChild,U=N.firstChild,w=U.nextSibling,L=N.nextSibling,H=L.firstChild,te=H.nextSibling,Z=te.nextSibling,ce=L.nextSibling;ce.firstChild;var D=ce.nextSibling,S=D.firstChild,B=S.nextSibling;return u(o,()=>e.p.kind.toUpperCase()),u(l,()=>e.p.symbol,c),u(l,()=>e.p.strike,d),u(l,()=>e.p.kind==="put"?"P":"C",d),u(l,()=>e.p.contracts,null),u(a,f(I,{get when(){return J(()=>!!(e.p.kind==="put"&&t.showPool))()&&e.p.pool_name},get children(){var x=th();return u(x,()=>e.p.pool_name),x}}),h),u(h,()=>e.p.expiry,m),u(h,()=>e.v.days_elapsed,E),u(h,()=>e.v.days_total,v),u(k,(()=>{var x=J(()=>e.v.pl_pct==null);return()=>x()?"—":`${e.v.pl_pct>=0?"+":""}${Qt(e.v.pl_pct,1)}`})()),u(T,f(Ch,{get v(){return e.v}}),A),u(A,()=>Qt(e.v.target_pct),null),u(P,f(I,{get when(){return e.v.pace_met},get fallback(){return ah()},get children(){return nh()}}),null),u(P,f(I,{get when(){return J(()=>e.p.kind==="call")()&&n()},get children(){return rh()}}),null),C.$$click=()=>t.onClose(e),u(w,()=>mt(e.p.premium)),u(te,(()=>{var x=J(()=>e.p.mark==null);return()=>x()?"—":e.p.mark.mid.toFixed(2)})()),u(Z,(()=>{var x=J(()=>e.p.mark==null);return()=>x()?"unpriced":ms(e.p.mark.as_of)})()),u(ce,f(I,{get when(){var x;return((x=e.p.mark)==null?void 0:x.underlying_price)!=null},get fallback(){return oh()},get children(){return[(()=>{var x=cr();return u(x,()=>e.p.mark.underlying_price.toFixed(2)),x})(),(()=>{var x=ih();return u(x,(()=>{var W=J(()=>e.v.spot_pct_vs_strike==null);return()=>W()?"":`${e.v.spot_pct_vs_strike>=0?"+":""}${Qt(e.v.spot_pct_vs_strike,1)} vs strike`})()),$(()=>le(x,r()&&e.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),x})()]}}),null),u(B,(()=>{var x=J(()=>e.v.pl_dollars==null);return()=>x()?"—":mt(e.v.pl_dollars)})()),u(i,f(I,{get when(){return t.dialogFor(e.p.kind,e.p.id)},keyed:!0,children:x=>f(Fh,Fs({d:x},()=>t.dialogActions))}),null),$(x=>{var W=!!e.v.pace_met,ue=e.p.kind,q=e.v.pl_pct>=0?"holdings-pos":"holdings-neg",Se=(e.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return W!==x.e&&s.classList.toggle("hp-row-met",x.e=W),ue!==x.t&&ee(o,"data-kind",x.t=ue),q!==x.a&&le(k,x.a=q),Se!==x.o&&le(B,x.o=Se),x},{e:void 0,t:void 0,a:void 0,o:void 0}),i})()}function Oh(t){var o,l;const e=t.kind,n=()=>e==="put"?t.pools??[]:[],[r,i]=O({symbol:"",strike:"",premium:"",contracts:"1",sold:Ge(),expiry:ps(Ge(),7),pool_id:((l=(o=t.pools)==null?void 0:o[0])==null?void 0:l.id)??""}),s=c=>d=>i({...r(),[c]:d.target.value}),a=()=>r().symbol.trim()&&[r().strike,r().premium,r().contracts].every(c=>Number(c)>0)&&r().expiry>r().sold&&r().sold<=Ge();return(()=>{var c=uh(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=d.nextSibling,b=m.firstChild,E=b.nextSibling,_=m.nextSibling,v=_.firstChild,k=v.nextSibling,T=_.nextSibling,A=T.firstChild,P=A.nextSibling,C=T.nextSibling,F=C.firstChild,N=F.nextSibling,U=C.nextSibling,w=U.firstChild,L=w.nextSibling,H=U.nextSibling,te=H.nextSibling;return c.addEventListener("submit",Z=>{var ce,D;Z.preventDefault(),!(!a()||(ce=t.busy)!=null&&ce.call(t))&&t.onAdd({...e==="call"?{kind:"call"}:{},...e==="put"&&n().length>0?{pool_id:r().pool_id||((D=n()[0])==null?void 0:D.id)}:{},symbol:r().symbol.trim().toUpperCase(),strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:r().sold,expiry:r().expiry})}),j(g,"input",s("symbol")),j(E,"input",s("strike")),ee(E,"placeholder",e==="call"?"e.g. 355.00":"e.g. 350.00"),j(k,"input",s("premium")),ee(k,"placeholder",e==="call"?"e.g. 1.80":"e.g. 1.00"),j(P,"input",s("contracts")),u(c,f(I,{get when(){return n().length>1},get children(){var Z=lh(),ce=Z.firstChild,D=ce.nextSibling;return j(D,"input",s("pool_id")),u(D,f(ae,{get each(){return n()},children:S=>(()=>{var B=dh();return u(B,()=>S.name),$(()=>B.value=S.id),B})()})),$(()=>D.value=r().pool_id),Z}}),C),j(N,"input",s("sold")),j(L,"input",s("expiry")),u(H,e==="call"?"Sell call":"Sell put"),j(te,"click",t.onDone),u(c,f(I,{when:e==="call",get children(){return ch()}}),null),$(()=>{var Z;return H.disabled=!a()||((Z=t.busy)==null?void 0:Z.call(t))}),$(()=>g.value=r().symbol),$(()=>E.value=r().strike),$(()=>k.value=r().premium),$(()=>P.value=r().contracts),$(()=>N.value=r().sold),$(()=>L.value=r().expiry),c})()}function Nh(t){const[e,n]=O({symbol:"",shares:"",basis_per_share:"",acquired:Ge()}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=hh(),a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=a.nextSibling,d=c.firstChild,h=d.nextSibling,g=c.nextSibling,m=g.firstChild,b=m.nextSibling,E=g.nextSibling,_=E.firstChild,v=_.nextSibling,k=E.nextSibling,T=k.nextSibling;return s.addEventListener("submit",A=>{var P;A.preventDefault(),!(!i()||(P=t.busy)!=null&&P.call(t))&&t.onAdd({kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired})}),j(l,"input",r("symbol")),j(h,"input",r("shares")),j(b,"input",r("basis_per_share")),j(v,"input",r("acquired")),j(T,"click",t.onDone),$(()=>{var A;return k.disabled=!i()||((A=t.busy)==null?void 0:A.call(t))}),$(()=>l.value=e().symbol),$(()=>h.value=e().shares),$(()=>b.value=e().basis_per_share),$(()=>v.value=e().acquired),s})()}function Dh(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=O({strike:"",premium:"",contracts:String(n()),expiry:ps(Ge(),7)}),s=o=>l=>i({...r(),[o]:l.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>Ge();return(()=>{var o=fh(),l=o.firstChild,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,m=g.firstChild,b=m.nextSibling,E=g.nextSibling,_=E.firstChild,v=_.nextSibling,k=E.nextSibling,T=k.firstChild,A=T.nextSibling,P=k.nextSibling,C=P.firstChild,F=C.nextSibling,N=P.nextSibling,U=N.nextSibling;return u(l,()=>e.shares,d),u(l,()=>e.symbol,null),h.addEventListener("submit",w=>{var L;w.preventDefault(),!(!a()||(L=t.busy)!=null&&L.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:Ge(),expiry:r().expiry})}),j(b,"input",s("strike")),j(v,"input",s("premium")),j(A,"input",s("contracts")),j(F,"input",s("expiry")),j(U,"click",t.onDone),$(()=>{var w;return N.disabled=!a()||((w=t.busy)==null?void 0:w.call(t))}),$(()=>b.value=r().strike),$(()=>v.value=r().premium),$(()=>A.value=r().contracts),$(()=>F.value=r().expiry),o})()}function Lh(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="assigned"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=ph(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=g.nextSibling,b=m.nextSibling;b.nextSibling;var E=d.nextSibling,_=E.firstChild,v=_.firstChild,k=_.nextSibling,T=k.firstChild,A=k.nextSibling,P=A.firstChild,C=E.nextSibling;C.firstChild;var F=C.nextSibling,N=F.firstChild,U=N.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),v.addEventListener("change",()=>r("bought-back")),T.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("assigned")),u(c,f(I,{get when(){return n()!=="expired"},get children(){var w=gs(),L=w.firstChild;return u(w,()=>n()==="assigned"?"share price at assignment":"close price/share",L),L.$$input=H=>s(H.target.value),$(()=>L.value=i()),w}}),C),u(C,f(I,{get when(){return a()!==null},fallback:"—",get children(){var w=cr();return u(w,()=>mt(a())),$(()=>le(w,a()>=0?"holdings-pos":"holdings-neg")),w}}),null),j(N,"click",t.onDone),U.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),u(c,f(I,{get when(){return n()==="assigned"},get children(){return gh()}}),null),$(()=>{var w;return U.disabled=((w=t.busy)==null?void 0:w.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),$(()=>v.checked=n()==="bought-back"),$(()=>T.checked=n()==="expired"),$(()=>P.checked=n()==="assigned"),c})()}function Mh(t){const[e,n]=O({...t.d.prefill}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=mh(),a=s.firstChild,o=a.nextSibling,l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=l.nextSibling,g=h.firstChild,m=g.nextSibling,b=h.nextSibling,E=b.firstChild,_=E.nextSibling,v=b.nextSibling,k=v.firstChild,T=k.nextSibling,A=v.nextSibling,P=A.nextSibling;return o.addEventListener("submit",C=>{var F;C.preventDefault(),!(!i()||(F=t.busy)!=null&&F.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired,assigned_from:t.d.pos.id})}),j(d,"input",r("symbol")),j(m,"input",r("shares")),j(_,"input",r("basis_per_share")),j(T,"input",r("acquired")),j(P,"click",t.onDone),$(()=>{var C;return A.disabled=!i()||((C=t.busy)==null?void 0:C.call(t))}),$(()=>d.value=e().symbol),$(()=>m.value=e().shares),$(()=>_.value=e().basis_per_share),$(()=>T.value=e().acquired),s})()}function Uh(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="called-away"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=bh(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=g.nextSibling,b=m.nextSibling;b.nextSibling;var E=d.nextSibling,_=E.firstChild,v=_.firstChild,k=_.nextSibling,T=k.firstChild,A=k.nextSibling,P=A.firstChild,C=E.nextSibling;C.firstChild;var F=C.nextSibling,N=F.firstChild,U=N.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),v.addEventListener("change",()=>r("bought-back")),T.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("called-away")),u(c,f(I,{get when(){return n()!=="expired"},get children(){var w=gs(),L=w.firstChild;return u(w,()=>n()==="called-away"?"share price at call":"close price/share",L),L.$$input=H=>s(H.target.value),$(()=>L.value=i()),w}}),C),u(C,f(I,{get when(){return a()!==null},fallback:"—",get children(){var w=cr();return u(w,()=>mt(a())),$(()=>le(w,a()>=0?"holdings-pos":"holdings-neg")),w}}),null),j(N,"click",t.onDone),U.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),u(c,f(I,{get when(){return n()==="called-away"},get children(){var w=_h(),L=w.firstChild,H=L.nextSibling,te=H.nextSibling,Z=te.nextSibling;return Z.nextSibling,u(w,()=>e.symbol,H),u(w,()=>e.contracts*100,Z),w}}),null),$(()=>{var w;return U.disabled=((w=t.busy)==null?void 0:w.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),$(()=>v.checked=n()==="bought-back"),$(()=>T.checked=n()==="expired"),$(()=>P.checked=n()==="called-away"),c})()}function Fh(t){return t.d.type==="put"?t.d.stage==="lot"?f(Mh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(Lh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f(Uh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function Bh(){const[t,e]=O(null),[n,r]=O("");let i;const s=y=>{r(y),clearTimeout(i),i=setTimeout(()=>r(""),4e3)};Oe(()=>clearTimeout(i));const[a,o]=O(null),[l,c]=O(!1),d=async()=>{try{e(await Qs())}catch(y){s(`Holdings API error: ${y.message}`)}};ht(d);const h=()=>{var y;return((y=t())==null?void 0:y.positions)??[]},g=()=>{var y;return((y=t())==null?void 0:y.calls)??[]},m=()=>{var y;return((y=t())==null?void 0:y.lots)??[]},b=()=>h().map(y=>({p:{...y,kind:"put"},v:y.view})),E=()=>g().map(y=>({p:{...y,kind:"call"},v:y.view})),_=y=>y.v.pl_pct==null?-1/0:y.v.pl_pct-y.v.target_pct,v=(y,R)=>{var X,me;const M=a();return!M||M.type!==y?null:(((X=M.pos)==null?void 0:X.id)??((me=M.lot)==null?void 0:me.id))===R?M:null},k=async y=>{if(l())return null;c(!0);try{return await y()}catch(R){return s(R.message),null}finally{c(!1)}},T=async()=>{var M;const y=await k(()=>Zs());if(!y)return;const R=((M=y.refresh)==null?void 0:M.stale)??[];s(R.length?`Marks refreshed — ${R.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await d()},A=async(y,R)=>{await k(()=>Sn(y))&&(s(R),o(null),await d())},P=async(y,R)=>{await k(()=>Sn(R))&&(s(`Assigned — recorded ${R.shares} sh ${R.symbol} at $${R.basis_per_share.toFixed(2)} basis.`),o(null),await d())},C=async(y,R,M)=>{if(R==="assigned"){o({type:"put",pos:y,stage:"lot",prefill:{symbol:y.symbol,shares:y.contracts*100,basis_per_share:+(y.strike-y.premium).toFixed(2),acquired:Ge()}});return}await k(()=>kn(y.id))&&(s(R==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},F=async(y,R,M)=>{if(R==="called-away"){const X=await k(()=>ea(y.id));if(!X)return;s(X.reduced?`Called away — ${y.symbol} lot reduced by ${y.contracts*100} sh.`:`Called away — call removed. ${X.reason??""}`),o(null),await d();return}await k(()=>kn(y.id))&&(s(R==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},N=async(y,R)=>{const M=await k(()=>pr(R?{cash:y,pool_id:R}:{cash:y}));return M?(e(z=>({...z??{},cash:M.cash,cash_reserved:M.cash_reserved,cash_free:M.cash_free,cash_pools:M.pool?((z==null?void 0:z.cash_pools)??[]).map(X=>X.id===M.pool.id?{...X,...M.pool}:X):(z==null?void 0:z.cash_pools)??[]})),s(M.pool?`Cash set to ${Re(M.pool.cash)} — ${Re(M.pool.free)} free in ${M.pool.name}.`:`Cash set to ${Re(M.cash)} — ${Re(M.cash_free)} free.`),!0):!1},U=()=>{var y;return((y=t())==null?void 0:y.cash_pools)??[]},[w,L]=O(null),H=()=>{const y=U();return y.length?y.find(R=>R.id===w())??y[0]:null},te=async y=>{var M;const R=await k(()=>Sn({kind:"pool",name:y}));return R?(s(`Pool “${y}” added — set its cash with the strip.`),L(((M=R.pool)==null?void 0:M.id)??null),await d(),!0):!1},Z=async(y,R)=>{await k(()=>pr({pool_id:y,name:R}))&&(s(`Pool renamed to “${R}”.`),await d())},ce=async y=>{await k(()=>kn(y))&&(s("Pool deleted."),w()===y&&L(null),await d())},D={busy:l,onDone:()=>o(null),onConfirmPut:C,onConfirmCall:F,onAssign:P},[S,B]=O("lots"),x=()=>[{id:"lots",label:"Lots",count:m().length,sub:`${m().reduce((y,R)=>y+R.shares,0)} sh held`},{id:"puts",label:"Puts",count:h().length,sub:`${h().filter(y=>y.view.pace_met).length} pace-met`},{id:"calls",label:"Calls",count:g().length,sub:`${g().filter(y=>y.view.spot_pct_vs_strike>0).length} ITM`}],W=()=>[...b()].sort((y,R)=>_(R)-_(y)),ue=()=>[...E()].sort((y,R)=>_(R)-_(y)),q={lots:{label:"+ New lot",type:"addLot"},puts:{label:"+ Sell put",type:"addPut"},calls:{label:"+ Sell call",type:"addCall"}},Se={lots:"No recorded lots — assignments land here.",puts:"No open puts — press “+ Sell put” to record one.",calls:"No open calls — press “+ Sell call” to record one."},Bt=y=>{if(y==="lots")return f(I,{get when(){return m().length>0},get fallback(){return(()=>{var M=ei();return u(M,()=>Se.lots),M})()},get children(){var M=yh();return u(M,f(ae,{get each(){return m()},children:z=>f(Rh,{lot:z,dialogFor:v,busy:l,onSellDialog:X=>o({type:"sellCall",lot:X}),onDialogDone:()=>o(null),onSellCall:(X,me)=>A(me,`Sold ${me.symbol} ${me.strike}C ×${me.contracts} — Refresh marks to price.`)})})),M}});const R=y==="puts"?W():ue();return f(I,{get when(){return R.length>0},get fallback(){return(()=>{var M=ei();return u(M,()=>Se[y]),M})()},get children(){var M=vh();return M.firstChild,u(M,f(ae,{each:R,children:z=>f(xh,{x:z,get showPool(){return U().length>1},dialogFor:v,dialogActions:D,onClose:X=>o({type:X.p.kind,pos:X.p})})}),null),M}})},re=y=>f(I,{get when(){var R,M,z;return y==="lots"&&((R=a())==null?void 0:R.type)==="addLot"||y==="puts"&&((M=a())==null?void 0:M.type)==="addPut"||y==="calls"&&((z=a())==null?void 0:z.type)==="addCall"},keyed:!0,get children(){return y==="lots"?f(Nh,{busy:l,onDone:()=>o(null),onAdd:R=>A(R,`Recorded ${R.shares} sh ${R.symbol}.`)}):f(Oh,{kind:y==="puts"?"put":"call",get pools(){return U()},busy:l,onDone:()=>o(null),onAdd:R=>A(R,`Sold ${R.symbol} ${R.strike}${y==="puts"?"P":"C"} ×${R.contracts} — Refresh marks to price.`)})}}),ke=y=>(()=>{var R=$h(),M=R.firstChild;return M.$$click=()=>o({type:q[y].type}),u(M,()=>q[y].label),u(R,f(I,{when:y==="lots",get children(){var z=wh(),X=z.firstChild;return u(z,()=>m().reduce((me,ne)=>me+ne.shares,0),X),z}}),null),R})(),Fe=()=>(()=>{var y=Sh();return y.$$click=T,$(()=>y.disabled=l()),y})(),it=()=>f(I,{get when(){return n()},get children(){var y=kh();return u(y,n),y}});return(()=>{var y=Eh(),R=y.firstChild,M=R.firstChild;M.firstChild;var z=M.nextSibling,X=z.firstChild,me=X.firstChild;return u(M,f(Ah,{get cash(){var ne;return((ne=t())==null?void 0:ne.cash)??null},get reserved(){var ne;return((ne=t())==null?void 0:ne.cash_reserved)??0},get free(){var ne;return((ne=t())==null?void 0:ne.cash_free)??null},get pools(){return U()},get pool(){return H()},busy:l,onSaveCash:N,onSelectPool:L,onAddPool:te,onRenamePool:Z,onDeletePool:ce}),null),u(M,f(ae,{get each(){return x()},children:ne=>(()=>{var Vt=Ih(),ur=Vt.firstChild,dr=ur.nextSibling,ws=dr.nextSibling;return Vt.$$click=()=>B(ne.id),u(ur,()=>ne.label.toUpperCase()),u(dr,()=>ne.count),u(ws,()=>ne.sub),$(()=>Vt.classList.toggle("active",S()===ne.id)),Vt})()}),null),u(me,()=>x().find(ne=>ne.id===S()).label),u(X,Fe,null),u(z,it,null),u(z,()=>ke(S()),null),u(z,()=>re(S()),null),u(z,()=>Bt(S()),null),y})()}ye(["input","keydown","click"]);async function Vh(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var Hh=p("<button type=button class=run-btn>"),Wh=p("<span class=run-count>/"),jh=p("<span class=run-bar><span class=fill>"),zh=p("<li><span class=mark></span><span class=label>"),Gh=p("<div class=toast-cached>Served from cache — last run <!> min old"),qh=p('<div class="toast-cached warn">'),Kh=p("<div class=run-headline>"),Jh=p("<ul class=run-stages>"),Yh=p("<details class=run-errors><summary>details</summary><ul>"),Xh=p("<div class=run-warn>Closing this tab stops the run."),Qh=p("<div class=run-warn>Re-checking every 15 s…"),Zh=p("<div class=run-strip>"),ef=p("<li> ");const _s=["quotes","metrics","chains_short","chains_medium"],bs={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},tf=15e3,ys=t=>t!==null&&Date.now()>=t;function ti(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function nf(t){const[e,n]=O("idle"),[r,i]=O(A()),[s,a]=O(null),[o,l]=O(0),[c,d]=O(null),[h,g]=O(null),[m,b]=O("");let E=null,_=null;const[v,k]=O(0);let T=null;Ze(()=>{const D=t();if(T&&(clearTimeout(T),T=null),(D==null?void 0:D.run_allowed)===!1){const S=hn(D.next_open_utc);S!==null&&(T=setTimeout(()=>k(B=>B+1),Math.max(0,S-Date.now())))}});function A(){return Object.fromEntries(_s.map(D=>[D,{status:"pending",error:null}]))}function P(){E&&clearInterval(E),E=null,_&&clearInterval(_),_=null}function C(){l(0),E=setInterval(()=>l(D=>D+1),1e3)}function F(D){switch(D.type){case"stage_started":i(S=>({...S,[D.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:D.stage,done:D.done,total:D.total});break;case"stage_finished":i(S=>({...S,[D.stage]:{status:D.ok?"ok":"failed",error:D.error??null}}));break;case"run_finished":d(D);break}}function N(){P();const D=c(),S=((D==null?void 0:D.stages)??[]).some(B=>B.name.startsWith("chains")&&["ok","partial"].includes(B.status));n(D&&(S||D.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function U(D){let S=!1;return await Vh(D,B=>{F(B),B.type==="run_finished"&&(S=!0)}),S?(N(),!0):!1}async function w(D){n("detached"),_=setInterval(async()=>{var S,B,x;try{const W=await di(),ue=((B=(S=W==null?void 0:W.result)==null?void 0:S.run)==null?void 0:B.finished_at_utc)??null;if(ue&&ue!==D){i(L(W.result)),P(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((x=W==null?void 0:W.run_state)==null?void 0:x.status)!=="running"&&(P(),n("idle"),b("Stream lost and the run was canceled — press Run to retry."))}catch{}},tf)}function L(D){const S=A();for(const B of(D==null?void 0:D.stages)??[])S[B.name]&&(S[B.name]={status:B.status,error:B.error});return S}async function H(){var x,W,ue;if(["starting","running","detached"].includes(e()))return;b(""),d(null),a(null),i(A()),g(null);const D=((ue=(W=(x=t())==null?void 0:x.result)==null?void 0:W.run)==null?void 0:ue.finished_at_utc)??null;n("running"),C();let S;try{S=await Ys()}catch{P(),n("idle"),b("Run failed to start — network or server unreachable.");return}const B=S.headers.get("content-type")??"";if(S.ok&&B.includes("application/json")){const q=await S.json().catch(()=>null);if(P(),n("idle"),(q==null?void 0:q.status)==="cached"){g(q.age_secs),setTimeout(()=>g(null),6e3);return}}if(S.status===403&&B.includes("application/json")){const q=await S.json().catch(()=>null);P(),n("idle"),b(q!=null&&q.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(q.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(S.status===202){const q=await Xs();if(q.ok&&(q.headers.get("content-type")??"").includes("text/event-stream")){await U(q)||await w(D);return}await w(D);return}if(B.includes("text/event-stream")){await U(S)||await w(D);return}P(),n("idle"),b(`Unexpected /api/run response (${S.status}, ${B||"no type"}).`)}return Oe(()=>{P(),T&&clearTimeout(T)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:m,triggerRun:H,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{v();const D=t();return(D==null?void 0:D.run_allowed)!==!1?!0:ys(hn(D==null?void 0:D.next_open_utc))},nextOpenUtc:()=>{var D;return((D=t())==null?void 0:D.next_open_utc)??null}}}function rf(t){const e=()=>!t.run.runAllowed(),n=()=>us(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=Hh();return i.$$click=()=>t.run.triggerRun(),u(i,r),$(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&ee(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function sf(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=zh(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>bs[t.name]),u(i,f(I,{get when(){return r()!==null},get children(){return[(()=>{var o=Wh(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=jh(),l=o.firstChild;return $(c=>et(l,"width",`${r()}%`)),o})()]}}),null),$(()=>le(i,`run-stage ${e()}`)),i})()}function af(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",J(()=>ti(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",J(()=>ti(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(I,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=Zh();return u(i,f(I,{get when(){return e.cachedToast()},get children(){var s=Gh(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(I,{get when(){return e.notice()},get children(){var s=qh();return u(s,()=>e.notice()),s}}),null),u(i,f(I,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=Kh();return u(s,r),s})(),(()=>{var s=Jh();return u(s,()=>_s.map(a=>f(sf,{name:a,run:e}))),s})(),f(I,{get when(){return J(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=Yh(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=ef(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>bs[l.name]??l.name,null),u(c,(()=>{var h=J(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,f(I,{get when(){return J(()=>e.phase()==="running")()&&!n()},get children(){return Xh()}}),null),u(i,f(I,{get when(){return e.phase()==="detached"},get children(){return Qh()}}),null),i}})}ye(["click"]);var vs=p("<b>"),of=p("<span>Market closed · last run <b></b> ago"),lf=p("<div class=cache-line><span></span><span class=pill>run: "),cf=p("<span>Cached · <b></b> left"),uf=p("<span>Stale · last run <b></b> ago"),df=p("<nav class=tabs role=tablist aria-label=timeframes>"),hf=p("<button type=button role=tab class=tab>"),ff=p("<svg><circle cx=12 cy=12 r=4></svg>",!1,!0,!1),gf=p('<svg><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></svg>',!1,!0,!1),pf=p('<button type=button class="btn-ghost theme-toggle"><svg width=14 height=14 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true>'),mf=p('<svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></svg>',!1,!0,!1),_f=p('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),bf=p("<div class=pop-backdrop>"),yf=p("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),vf=p("<div class=error-banner>API error: "),wf=p("<div class=shell><header><div class=user-box></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),$f=p("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function Sf(){const[t,e]=O(Cu()),n=r=>{e(r),Tu(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(St)}}function ni(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function kf(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function ri(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function Un(t){return f(I,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=vs();return u(e,()=>t.at()),e})()]}})}function Ef(t){const[e,n]=O(0);ht(()=>{const m=setInterval(()=>n(b=>b+1),3e4);Oe(()=>clearInterval(m))});let r=Date.now(),i=0;Ze(Et(()=>t.envelope,m=>{r=Date.now(),i=(m==null?void 0:m.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const m=Math.max(0,(t.envelope.cache_secs??0)-s());return m>=60?`${Math.floor(m/60)}m`:`${m}s`},c=()=>{var m,b;return Bu((b=(m=t.envelope.result)==null?void 0:m.run)==null?void 0:b.finished_at_utc)},d=()=>{e();const m=t.envelope.next_open_utc,b=hn(m);if(!(b===null||ys(b)))return us(m)},h=()=>o()&&a()==="stale"?"closed":a(),g=()=>a()==="fresh"||a()==="stale";return(()=>{var m=lf(),b=m.firstChild,E=b.nextSibling;return E.firstChild,u(m,f(I,{get when(){return J(()=>!!o())()&&g()},get fallback(){return f(I,{get when(){return a()==="fresh"},get fallback(){return f(I,{get when(){return a()==="stale"},get children(){var _=uf(),v=_.firstChild,k=v.nextSibling;return k.nextSibling,u(k,()=>ri(s())),u(_,f(Un,{at:c}),null),_}})},get children(){var _=cf(),v=_.firstChild,k=v.nextSibling;return k.nextSibling,u(k,l),u(_,f(Un,{at:c}),null),_}})},get children(){var _=of(),v=_.firstChild,k=v.nextSibling;return k.nextSibling,u(k,()=>ri(s())),u(_,f(Un,{at:c}),null),u(_,f(I,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var T=vs();return u(T,d),T})()]}}),null),_}}),b),u(b,(()=>{var _=J(()=>h()==="closed");return()=>_()?"market closed":a()})()),u(E,()=>{var _;return((_=t.envelope.run_state)==null?void 0:_.status)??"idle"},null),$(()=>le(b,"pill "+h())),m})()}function ii(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=df();return u(n,()=>e.map(r=>(()=>{var i=hf();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=J(()=>!r.holdings);return()=>s()&&` (${kt(kf(t.result,r.id))})`})(),null),$(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&ee(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function If(){const[t,e]=O(null),n=()=>window.matchMedia("(prefers-color-scheme: dark)").matches,r=()=>t()??(n()?"dark":"light"),i=()=>{const a=r()==="dark"?"light":"dark";document.documentElement.dataset.theme=a,e(a)},s=()=>r()==="dark"?"Switch to light theme":"Switch to dark theme";return(()=>{var a=pf(),o=a.firstChild;return a.$$click=i,u(o,f(I,{get when(){return r()==="dark"},get fallback(){return mf()},get children(){return[ff(),gf()]}})),$(l=>{var c=s(),d=s();return c!==l.e&&ee(a,"aria-label",l.e=c),d!==l.t&&ee(a,"title",l.t=d),l},{e:void 0,t:void 0}),a})()}function Cf(){const[t,e]=O(void 0),[n,{refetch:r}]=As(t,v=>v?di():void 0);ht(()=>{if(!pt){e(null);return}const v=Dl(at(),e);Oe(v)});const[i,s]=O(!1);Ze(Et(t,v=>{s(!1),!(!v||!pt)&&Gs().then(k=>s(k.status===403)).catch(()=>{})})),ht(()=>{const v=()=>r();window.addEventListener("webapp:refresh-latest",v),Oe(()=>window.removeEventListener("webapp:refresh-latest",v))});const a=()=>{var v,k;return((v=t())==null?void 0:v.email)||((k=t())==null?void 0:k.uid)||""},[o,l]=O(!1),[c,d]=O(!1),h=Sf(),[g,m]=O("short"),b=()=>g()==="holdings",E=ku(),_=nf(()=>n());return f(I,{get when(){return t()},get fallback(){return f(lu,{})},get children(){return[f(I,{get when(){return!i()},get fallback(){return f(ou,{get email(){return a()},onSignOut:()=>qr()})},get children(){var v=wf(),k=v.firstChild,T=k.firstChild,A=T.nextSibling,P=A.nextSibling;return u(T,f(I,{get when(){return t()},get children(){return[(()=>{var C=_f(),F=C.firstChild,N=F.nextSibling;return C.$$click=()=>l(!o()),u(N,a),$(()=>ee(C,"aria-expanded",o())),C})(),f(I,{get when(){return o()},get children(){return[(()=>{var C=bf();return C.$$click=()=>l(!1),C})(),(()=>{var C=yf(),F=C.firstChild,N=F.nextSibling,U=N.nextSibling,w=U.nextSibling;return u(N,a),U.$$click=()=>{l(!1),d(!0)},w.$$click=()=>{l(!1),qr()},C})()]}})]}})),u(k,f(I,{get when(){return J(()=>!n.loading)()&&!n.error},get children(){return f(Ef,{get envelope(){return n()}})}}),P),u(P,f(If,{}),null),u(P,f(rf,{run:_}),null),u(v,f(I,{get when(){return n.error},get children(){var C=vf();return C.firstChild,u(C,()=>n.error.message,null),C}}),null),u(v,f(af,{run:_}),null),u(v,f(I,{get when(){return b()},get children(){return[f(ii,{result:()=>{var C;return(C=n())==null?void 0:C.result},tab:g,onTab:m}),f(Bh,{})]}}),null),u(v,f(I,{get when(){return!b()},get children(){return f(I,{get when(){var C;return J(()=>!n.loading)()&&((C=n())==null?void 0:C.result)},get fallback(){return f(I,{get when(){return!n.loading},get children(){return $f()}})},children:C=>{const F=()=>C();return[f(Iu,{scoring:E}),f(ii,{result:F,tab:g,onTab:m}),f(Zr,{id:"short",active:()=>g()==="short",get tf(){var N;return(N=F().timeframes)==null?void 0:N.short},get stageError(){return ni(F(),"chains_short")},get stages(){return F().stages},get thresholds(){return F().thresholds},columns:h,scoring:E}),f(Zr,{id:"medium",active:()=>g()==="medium",get tf(){var N;return(N=F().timeframes)==null?void 0:N.medium},get stageError(){return ni(F(),"chains_medium")},get stages(){return F().stages},get thresholds(){return F().thresholds},columns:h,scoring:E})]}})}}),null),v}}),f(I,{get when(){return c()},get children(){return f(gu,{onClose:()=>d(!1)})}})]}})}ye(["click"]);Hs(()=>f(Cf,{}),document.getElementById("root"));
