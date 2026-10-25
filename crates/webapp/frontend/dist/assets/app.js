(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const Hs=!1,Ws=(t,e)=>t===e,Qn=Symbol("solid-proxy"),js=typeof Proxy=="function",zs=Symbol("solid-track"),dn={equals:Ws};let bi=$i;const Ge=1,hn=2,vi={owned:null,cleanups:null,context:null,owner:null},On={};var le=null;let Nn=null,Gs=null,oe=null,pe=null,He=null,Cn=0;function nn(t,e){const n=oe,r=le,i=t.length===0,s=e===void 0?r:e,a=i?vi:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>Ce(()=>Bt(a)));le=a,oe=null;try{return tt(o,!0)}finally{oe=n,le=r}}function V(t,e){e=e?Object.assign({},dn,e):dn;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),wi(n,i));return[yi.bind(n),r]}function qs(t,e,n){const r=En(t,e,!0,Ge);Et(r)}function v(t,e,n){const r=En(t,e,!1,Ge);Et(r)}function lt(t,e,n){bi=ea;const r=En(t,e,!1,Ge);r.user=!0,He?He.push(r):Et(r)}function he(t,e,n){n=n?Object.assign({},dn,n):dn;const r=En(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,Et(r),yi.bind(r)}function Ks(t){return t&&typeof t=="object"&&"then"in t}function Js(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=On,l=!1,u="initialValue"in s,d=typeof r=="function"&&he(r);const h=new Set,[p,b]=(s.storage||V)(s.initialValue),[_,T]=V(void 0),[m,y]=V(void 0,{equals:!1}),[A,M]=V(u?"ready":"unresolved");le&&We(()=>{for(const D of h.keys())D.decrement();h.clear(),a=null});function R(D,I,w,U){return a===D&&(a=null,U!==void 0&&(u=!0),(D===o||I===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(U,{value:I})),o=On,L(I,w)),I}function L(D,I){tt(()=>{I===void 0&&b(()=>D),M(I!==void 0?"errored":u?"ready":"unresolved"),T(I);for(const w of h.keys())w.decrement();h.clear()},!1)}function N(){const D=Xs,I=p(),w=_();if(w!==void 0&&!a)throw w;return oe&&oe.user,I}function k(D=!0){if(D!==!1&&l)return;l=!1;const I=d?d():r;if(I==null||I===!1){R(a,Ce(p));return}let w;const U=o!==On?o:Ce(()=>{try{return i(I,{value:p(),refetching:D})}catch(C){w=C}});if(w!==void 0){R(a,void 0,rn(w),I);return}else if(!Ks(U))return R(a,U,void 0,I),U;return a=U,"v"in U?(U.s===1?R(a,U.v,void 0,I):R(a,void 0,rn(U.v),I),U):(l=!0,queueMicrotask(()=>l=!1),tt(()=>{M(u?"refreshing":"pending"),y()},!1),U.then(C=>R(U,C,void 0,I),C=>R(U,void 0,rn(C),I)))}Object.defineProperties(N,{state:{get:()=>A()},error:{get:()=>_()},loading:{get(){const D=A();return D==="pending"||D==="refreshing"}},latest:{get(){if(!u)return N();const D=_();if(D&&!a)throw D;return p()}}});let x=le;return d?qs(()=>(x=le,k(!1))):k(!1),[N,{refetch:D=>Ys(x,()=>k(D)),mutate:b}]}function Ce(t){if(oe===null)return t();const e=oe;oe=null;try{return t()}finally{oe=e}}function Mt(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=Ce(()=>e(a,i,s));return i=a,o}}function wt(t){lt(()=>Ce(t))}function We(t){return le===null||(le.cleanups===null?le.cleanups=[t]:le.cleanups.push(t)),t}function Ys(t,e){const n=le,r=oe;le=t,oe=null;try{return tt(e,!0)}catch(i){cr(i)}finally{le=n,oe=r}}const[pg,mg]=V(!1);let Xs;function yi(){if(this.sources&&this.state)if(this.state===Ge)Et(this);else{const t=pe;pe=null,tt(()=>gn(this),!1),pe=t}if(oe){const t=this.observers;if(!t||t[t.length-1]!==oe){const e=t?t.length:0;oe.sources?(oe.sources.push(this),oe.sourceSlots.push(e)):(oe.sources=[this],oe.sourceSlots=[e]),t?(t.push(oe),this.observerSlots.push(oe.sources.length-1)):(this.observers=[oe],this.observerSlots=[oe.sources.length-1])}}return this.value}function wi(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&tt(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=Nn&&Nn.running;a&&Nn.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?pe.push(s):He.push(s),s.observers&&Si(s)),a||(s.state=Ge)}if(pe.length>1e6)throw pe=[],new Error},!1)),e}function Et(t){if(!t.fn)return;Bt(t);const e=Cn;Qs(t,t.value,e)}function Qs(t,e,n){let r;const i=le,s=oe;oe=le=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Ge,t.owned&&t.owned.forEach(Bt),t.owned=null),t.updatedAt=n+1,cr(a)}finally{oe=s,le=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?wi(t,r):t.value=r,t.updatedAt=n)}function En(t,e,n,r=Ge,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:le,context:le?le.context:null,pure:n};return le===null||le!==vi&&(le.owned?le.owned.push(s):le.owned=[s]),s}function fn(t){if(t.state===0)return;if(t.state===hn)return gn(t);if(t.suspense&&Ce(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<Cn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Ge)Et(t);else if(t.state===hn){const r=pe;pe=null,tt(()=>gn(t,e[0]),!1),pe=r}}function tt(t,e){if(pe)return t();let n=!1;e||(pe=[]),He?n=!0:He=[],Cn++;try{const r=t();return Zs(n),r}catch(r){n||(He=null),pe=null,cr(r)}}function Zs(t){if(pe&&($i(pe),pe=null),t)return;const e=He;He=null,e.length&&tt(()=>bi(e),!1)}function $i(t){for(let e=0;e<t.length;e++)fn(t[e])}function ea(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:fn(r)}for(e=0;e<n;e++)fn(t[e])}function gn(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Ge?r!==e&&(!r.updatedAt||r.updatedAt<Cn)&&fn(r):i===hn&&gn(r,e)}}}function Si(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=hn,n.pure?pe.push(n):He.push(n),n.observers&&Si(n))}}function Bt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)Bt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)Bt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function rn(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function cr(t,e=le){throw rn(t)}const ta=Symbol("fallback");function kr(t){for(let e=0;e<t.length;e++)t[e]()}function na(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return We(()=>kr(s)),()=>{let l=t()||[],u=l.length,d,h;return l[zs],Ce(()=>{let b,_,T,m,y,A,M,R,L;if(u===0)a!==0&&(kr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[ta],i[0]=nn(N=>(s[0]=N,n.fallback())),a=1);else if(a===0){for(i=new Array(u),h=0;h<u;h++)r[h]=l[h],i[h]=nn(p);a=u}else{for(T=new Array(u),m=new Array(u),o&&(y=new Array(u)),A=0,M=Math.min(a,u);A<M&&r[A]===l[A];A++);for(M=a-1,R=u-1;M>=A&&R>=A&&r[M]===l[R];M--,R--)T[R]=i[M],m[R]=s[M],o&&(y[R]=o[M]);for(b=new Map,_=new Array(R+1),h=R;h>=A;h--)L=l[h],d=b.get(L),_[h]=d===void 0?-1:d,b.set(L,h);for(d=A;d<=M;d++)L=r[d],h=b.get(L),h!==void 0&&h!==-1?(T[h]=i[d],m[h]=s[d],o&&(y[h]=o[d]),h=_[h],b.set(L,h)):s[d]();for(h=A;h<u;h++)h in T?(i[h]=T[h],s[h]=m[h],o&&(o[h]=y[h],o[h](h))):i[h]=nn(p);i=i.slice(0,a=u),r=l.slice(0)}return i});function p(b){if(s[h]=b,o){const[_,T]=V(h);return o[h]=T,e(l[h],_)}return e(l[h])}}}function f(t,e){return Ce(()=>t(e||{}))}function Zt(){return!0}const ra={get(t,e,n){return e===Qn?n:t.get(e)},has(t,e){return e===Qn?!0:t.has(e)},set:Zt,deleteProperty:Zt,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:Zt,deleteProperty:Zt}},ownKeys(t){return t.keys()}};function Dn(t){return(t=typeof t=="function"?t():t)?t:{}}function ia(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function sa(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Qn in o,t[a]=typeof o=="function"?(e=!0,he(o)):o}if(js&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=Dn(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in Dn(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys(Dn(t[o])));return[...new Set(a)]}},ra);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let u=l.length-1;u>=0;u--){const d=l[u];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:ia.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const p=n[d];p&&(h.get?p.push(h.get.bind(o)):h.value!==void 0&&p.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const aa=t=>`Stale read from <${t}>.`;function de(t){const e="fallback"in t&&{fallback:()=>t.fallback};return he(na(()=>t.each,t.children,e||void 0))}function S(t){const e=t.keyed,n=he(()=>t.when,void 0,void 0),r=e?n:he(n,void 0,{equals:(i,s)=>!i==!s});return he(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?Ce(()=>s(e?i:()=>{if(!Ce(r))throw aa("Show");return n()})):s}return t.fallback},void 0,void 0)}const ee=t=>he(()=>t());function oa(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,u=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!u||!u.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!u){u=new Map;let h=o;for(;h<s;)u.set(n[h],h++)}const d=u.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,p=1,b;for(;++h<i&&h<s&&!((b=u.get(e[h]))==null||b!==d+p);)p++;if(p>d-o){const _=e[a];for(;o<d;)t.insertBefore(n[o++],_)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const Cr="_$DX_DELEGATE";function la(t,e,n,r={}){let i;return nn(s=>{i=s,e===document?t():c(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function g(t,e,n,r){let i;const s=()=>{const o=r?document.createElementNS("http://www.w3.org/1998/Math/MathML","template"):document.createElement("template");return o.innerHTML=t,n?o.content.firstChild.firstChild:r?o.firstChild:o.content.firstChild},a=e?()=>Ce(()=>document.importNode(i||(i=s()),!0)):()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function Ie(t,e=window.document){const n=e[Cr]||(e[Cr]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,ua))}}function re(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function ve(t,e){e==null?t.removeAttribute("class"):t.className=e}function X(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function ct(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function ca(t,e,n){return Ce(()=>t(e,n))}function c(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return pn(t,e,r,n);v(i=>pn(t,e(),i,n),r)}function ua(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const u=e[`${n}Data`];if(u!==void 0?l.call(e,u,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let u=0;u<l.length-2&&(e=l[u],!!a());u++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function pn(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=gt(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=gt(t,n,r);else{if(s==="function")return v(()=>{let o=e();for(;typeof o=="function";)o=o();n=pn(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Zn(o,e,n,i))return v(()=>n=pn(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=gt(t,n,r),a)return n}else l?n.length===0?Er(t,o,r):oa(t,n,o):(n&&gt(t),Er(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=gt(t,n,r,e);gt(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Zn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],u;if(!(o==null||o===!0||o===!1))if((u=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Zn(t,o,l)||i;else if(u==="function")if(r){for(;typeof o=="function";)o=o();i=Zn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function Er(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function gt(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let sn=null;function da(t){sn=t}async function _e(t,e={}){if(!sn)return fetch(t,e);const n=new Headers(e.headers??{}),r=await sn(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await sn(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function ki(){const t=await _e("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function ha(){return _e("/api/me")}async function fa(){const t=await _e("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function ga(t){const e=await _e("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function pa(t){const e=await _e("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function ma(){return await _e("/api/run",{method:"POST"})}async function _a(){return _e("/api/progress")}async function ba(){const t=await _e("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function Ln(t){const e=await _e("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function Mn(t){const e=await _e(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function Ir(t,e){const n=await _e(`/api/holdings/${encodeURIComponent(t)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pool_id:e})}),r=await n.json().catch(()=>null);if(!n.ok)throw new Error((r==null?void 0:r.error)??`PATCH /api/holdings/${t} -> ${n.status}`);return r}async function va(){const t=await _e("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function Tr(t){const e=await _e("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function ya(t,e,n,r){const i=await _e("/api/holdings/close",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lot_id:t,shares:e,price:n,...r?{pool_id:r}:{}})}),s=await i.json().catch(()=>null);if(!i.ok)throw new Error((s==null?void 0:s.error)??`POST /api/holdings/close -> ${i.status}`);return s}async function wa(t){const e=await _e("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const $a=()=>{};var Pr={};/**
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
 */const Ci=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Sa=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Ei={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,u=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let p=(o&15)<<2|u>>6,b=u&63;l||(b=64,a||(p=64)),r.push(n[d],n[h],n[p],n[b])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Ci(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Sa(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const u=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||u==null||h==null)throw new ka;const p=s<<2|o>>4;if(r.push(p),u!==64){const b=o<<4&240|u>>2;if(r.push(b),h!==64){const _=u<<6&192|h;r.push(_)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class ka extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ca=function(t){const e=Ci(t);return Ei.encodeByteArray(e,!0)},Ii=function(t){return Ca(t).replace(/\./g,"")},Ti=function(t){try{return Ei.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Ea(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Ia=()=>Ea().__FIREBASE_DEFAULTS__,Ta=()=>{if(typeof process>"u"||typeof Pr>"u")return;const t=Pr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Pa=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Ti(t[1]);return e&&JSON.parse(e)},ur=()=>{try{return $a()||Ia()||Ta()||Pa()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},xa=t=>{var e,n;return(n=(e=ur())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},Pi=()=>{var t;return(t=ur())==null?void 0:t.config},xi=t=>{var e;return(e=ur())==null?void 0:e[`_${t}`]};/**
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
 */class Ai{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function me(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Aa(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(me())}function Ra(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Oa(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Na(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Da(){const t=me();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function La(){try{return typeof indexedDB=="object"}catch{return!1}}function Ma(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const Ua="FirebaseError";class nt extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Ua,Object.setPrototypeOf(this,nt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,zt.prototype.create)}}class zt{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Fa(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new nt(i,o,r)}}function Fa(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function Ba(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function $t(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(xr(s)&&xr(a)){if(!$t(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function xr(t){return t!==null&&typeof t=="object"}/**
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
 */function Gt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ot(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function Nt(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Va(t,e){const n=new Ha(t,e);return n.subscribe.bind(n)}class Ha{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Wa(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Un),i.error===void 0&&(i.error=Un),i.complete===void 0&&(i.complete=Un);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Wa(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Un(){}/**
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
 */function qe(t){return t&&t._delegate?t._delegate:t}/**
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
 */function dr(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ja(t){return(await fetch(t,{credentials:"include"})).ok}class St{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const at="[DEFAULT]";/**
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
 */class za{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new Ai;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(qa(e))try{this.getOrInitializeService({instanceIdentifier:at})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=at){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=at){return this.instances.has(e)}getOptions(e=at){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Ga(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=at){return this.component?this.component.multipleInstances?e:at:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ga(t){return t===at?void 0:t}function qa(t){return t.instantiationMode==="EAGER"}/**
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
 */class Ka{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new za(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var se;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(se||(se={}));const Ja={debug:se.DEBUG,verbose:se.VERBOSE,info:se.INFO,warn:se.WARN,error:se.ERROR,silent:se.SILENT},Ya=se.INFO,Xa={[se.DEBUG]:"log",[se.VERBOSE]:"log",[se.INFO]:"info",[se.WARN]:"warn",[se.ERROR]:"error"},Qa=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Xa[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ri{constructor(e){this.name=e,this._logLevel=Ya,this._logHandler=Qa,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in se))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ja[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,se.DEBUG,...e),this._logHandler(this,se.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,se.VERBOSE,...e),this._logHandler(this,se.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,se.INFO,...e),this._logHandler(this,se.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,se.WARN,...e),this._logHandler(this,se.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,se.ERROR,...e),this._logHandler(this,se.ERROR,...e)}}const Za=(t,e)=>e.some(n=>t instanceof n);let Ar,Rr;function eo(){return Ar||(Ar=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function to(){return Rr||(Rr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Oi=new WeakMap,er=new WeakMap,Ni=new WeakMap,Fn=new WeakMap,hr=new WeakMap;function no(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(et(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&Oi.set(n,t)}).catch(()=>{}),hr.set(e,t),e}function ro(t){if(er.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});er.set(t,e)}let tr={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return er.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Ni.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return et(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function io(t){tr=t(tr)}function so(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Bn(this),e,...n);return Ni.set(r,e.sort?e.sort():[e]),et(r)}:to().includes(t)?function(...e){return t.apply(Bn(this),e),et(Oi.get(this))}:function(...e){return et(t.apply(Bn(this),e))}}function ao(t){return typeof t=="function"?so(t):(t instanceof IDBTransaction&&ro(t),Za(t,eo())?new Proxy(t,tr):t)}function et(t){if(t instanceof IDBRequest)return no(t);if(Fn.has(t))return Fn.get(t);const e=ao(t);return e!==t&&(Fn.set(t,e),hr.set(e,t)),e}const Bn=t=>hr.get(t);function oo(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=et(a);return r&&a.addEventListener("upgradeneeded",l=>{r(et(a.result),l.oldVersion,l.newVersion,et(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),o}const lo=["get","getKey","getAll","getAllKeys","count"],co=["put","add","delete","clear"],Vn=new Map;function Or(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Vn.get(e))return Vn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=co.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||lo.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let u=l.store;return r&&(u=u.index(o.shift())),(await Promise.all([u[n](...o),i&&l.done]))[0]};return Vn.set(e,s),s}io(t=>({...t,get:(e,n,r)=>Or(e,n)||t.get(e,n,r),has:(e,n)=>!!Or(e,n)||t.has(e,n)}));/**
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
 */class uo{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(ho(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function ho(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const nr="@firebase/app",Nr="0.16.1";/**
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
 */const je=new Ri("@firebase/app"),fo="@firebase/app-compat",go="@firebase/analytics-compat",po="@firebase/analytics",mo="@firebase/app-check-compat",_o="@firebase/app-check",bo="@firebase/auth",vo="@firebase/auth-compat",yo="@firebase/database",wo="@firebase/data-connect",$o="@firebase/database-compat",So="@firebase/functions",ko="@firebase/functions-compat",Co="@firebase/installations",Eo="@firebase/installations-compat",Io="@firebase/messaging",To="@firebase/messaging-compat",Po="@firebase/performance",xo="@firebase/performance-compat",Ao="@firebase/remote-config",Ro="@firebase/remote-config-compat",Oo="@firebase/storage",No="@firebase/storage-compat",Do="@firebase/firestore",Lo="@firebase/ai",Mo="@firebase/firestore-compat",Uo="firebase",Fo="12.18.0";/**
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
 */const rr="[DEFAULT]",Bo={[nr]:"fire-core",[fo]:"fire-core-compat",[po]:"fire-analytics",[go]:"fire-analytics-compat",[_o]:"fire-app-check",[mo]:"fire-app-check-compat",[bo]:"fire-auth",[vo]:"fire-auth-compat",[yo]:"fire-rtdb",[wo]:"fire-data-connect",[$o]:"fire-rtdb-compat",[So]:"fire-fn",[ko]:"fire-fn-compat",[Co]:"fire-iid",[Eo]:"fire-iid-compat",[Io]:"fire-fcm",[To]:"fire-fcm-compat",[Po]:"fire-perf",[xo]:"fire-perf-compat",[Ao]:"fire-rc",[Ro]:"fire-rc-compat",[Oo]:"fire-gcs",[No]:"fire-gcs-compat",[Do]:"fire-fst",[Mo]:"fire-fst-compat",[Lo]:"fire-vertex","fire-js":"fire-js",[Uo]:"fire-js-all"};/**
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
 */const mn=new Map,Vo=new Map,ir=new Map;function Dr(t,e){try{t.container.addComponent(e)}catch(n){je.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Vt(t){const e=t.name;if(ir.has(e))return je.debug(`There were multiple attempts to register component ${e}.`),!1;ir.set(e,t);for(const n of mn.values())Dr(n,t);for(const n of Vo.values())Dr(n,t);return!0}function Di(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Se(t){return t==null?!1:t.settings!==void 0}/**
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
 */const Ho={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Me=new zt("app","Firebase",Ho);/**
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
 */class Wo{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new St("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Me.create("app-deleted",{appName:this._name})}}/**
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
 */const qt=Fo;function Li(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:rr,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw Me.create("bad-app-name",{appName:String(i)});if(n||(n=Pi()),!n)throw Me.create("no-options");const s=mn.get(i);if(s)if($t(n,s.options)){if($t(r,s.config))return s;throw Me.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw Me.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new Ka(i);for(const l of ir.values())a.addComponent(l);const o=new Wo(n,r,a);return mn.set(i,o),o}function jo(t=rr){const e=mn.get(t);if(!e&&t===rr&&Pi())return Li();if(!e)throw Me.create("no-app",{appName:t});return e}function _t(t,e,n){let r=Bo[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),je.warn(a.join(" "));return}Vt(new St(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const zo="firebase-heartbeat-database",Go=1,Ht="firebase-heartbeat-store";let Hn=null;function Mi(){return Hn||(Hn=oo(zo,Go,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Ht)}catch(n){console.warn(n)}}}}).catch(t=>{throw Me.create("idb-open",{originalErrorMessage:t.message})})),Hn}async function qo(t){try{const n=(await Mi()).transaction(Ht),r=await n.objectStore(Ht).get(Ui(t));return await n.done,r}catch(e){if(e instanceof nt)je.warn(e.message);else{const n=Me.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});je.warn(n.message)}}}async function Lr(t,e){try{const r=(await Mi()).transaction(Ht,"readwrite");await r.objectStore(Ht).put(e,Ui(t)),await r.done}catch(n){if(n instanceof nt)je.warn(n.message);else{const r=Me.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});je.warn(r.message)}}}function Ui(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Ko=1024,Jo=30;class Yo{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Qo(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Mr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Jo){const a=Zo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){je.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Mr(),{heartbeatsToSend:r,unsentEntries:i}=Xo(this._heartbeatsCache.heartbeats),s=Ii(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return je.warn(n),""}}}function Mr(){return new Date().toISOString().substring(0,10)}function Xo(t,e=Ko){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Ur(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Ur(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Qo{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return La()?Ma().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await qo(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Lr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Lr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Ur(t){return Ii(JSON.stringify({version:2,heartbeats:t})).length}function Zo(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function el(t){Vt(new St("platform-logger",e=>new uo(e),"PRIVATE")),Vt(new St("heartbeat",e=>new Yo(e),"PRIVATE")),_t(nr,Nr,t),_t(nr,Nr,"esm2020"),_t("fire-js","")}/**
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
 */el("");var tl="firebase",nl="12.18.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */_t(tl,nl,"app");function Fi(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const rl=Fi,Bi=new zt("auth","Firebase",Fi());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _n=new Ri("@firebase/auth");function Vi(t,...e){_n.logLevel<=se.WARN&&_n.warn(`Auth (${qt}): ${t}`,...e)}function an(t,...e){_n.logLevel<=se.ERROR&&_n.error(`Auth (${qt}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ee(t,...e){throw gr(t,...e)}function Pe(t,...e){return gr(t,...e)}function fr(t,e,n){const r={...rl(),[e]:n};return new zt("auth","Firebase",r).create(e,{appName:t.name})}function Re(t){return fr(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Hi(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&Ee(t,"argument-error"),fr(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function gr(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return Bi.create(t,...e)}function J(t,e,...n){if(!t)throw gr(e,...n)}function Ue(t){const e="INTERNAL ASSERTION FAILED: "+t;throw an(e),new Error(e)}function ze(t,e){t||Ue(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function il(){return Fr()==="http:"||Fr()==="https:"}function Fr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sl(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(il()||Oa()||"connection"in navigator)?navigator.onLine:!0}function al(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(e,n){this.shortDelay=e,this.longDelay=n,ze(n>e,"Short delay should be less than long delay!"),this.isMobile=Aa()||Na()}get(){return sl()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pr(t,e){ze(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ue("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ue("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ue("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ol={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ll=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],cl=new Kt(3e4,6e4);function rt(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function it(t,e,n,r,i={}){return ji(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Gt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const u={method:e,headers:l,...s};return Ra()||(u.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&dr(t.emulatorConfig.host)&&(u.credentials="include"),Wi.fetch()(await zi(t,t.config.apiHost,n,o),u)})}async function ji(t,e,n){t._canInitEmulator=!1;const r={...ol,...e};try{const i=new dl(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw en(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,u]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw en(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw en(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw en(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw fr(t,d,u);Ee(t,d)}}catch(i){if(i instanceof nt)throw i;Ee(t,"network-request-failed",{message:String(i)})}}async function Jt(t,e,n,r,i={}){const s=await it(t,e,n,r,i);return"mfaPendingCredential"in s&&Ee(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function zi(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?pr(t.config,i):`${t.config.apiScheme}://${i}`;return ll.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function ul(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class dl{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Pe(this.auth,"network-request-failed")),cl.get())})}}function en(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=Pe(t,e,r);return i.customData._tokenResponse=n,i}function Br(t){return t!==void 0&&t.enterprise!==void 0}class hl{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return ul(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function fl(t,e){return it(t,"GET","/v2/recaptchaConfig",rt(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gl(t,e){return it(t,"POST","/v1/accounts:delete",e)}async function bn(t,e){return it(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ut(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function pl(t,e=!1){const n=qe(t),r=await n.getIdToken(e),i=mr(r);J(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Ut(Wn(i.auth_time)),issuedAtTime:Ut(Wn(i.iat)),expirationTime:Ut(Wn(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Wn(t){return Number(t)*1e3}function mr(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return an("JWT malformed, contained fewer than 3 sections"),null;try{const i=Ti(n);return i?JSON.parse(i):(an("Failed to decode base64 JWT payload"),null)}catch(i){return an("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Vr(t){const e=mr(t);return J(e,"internal-error"),J(typeof e.exp<"u","internal-error"),J(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wt(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof nt&&ml(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function ml({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _l{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ar{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ut(this.lastLoginAt),this.creationTime=Ut(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function vn(t){var h;const e=t.auth,n=await t.getIdToken(),r=await Wt(t,bn(e,{idToken:n}));J(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?Gi(i.providerUserInfo):[],a=vl(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),u=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new ar(i.createdAt,i.lastLoginAt),isAnonymous:u};Object.assign(t,d)}async function bl(t){const e=qe(t);await vn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function vl(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Gi(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yl(t,e){const n=await ji(t,{},async()=>{const r=Gt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await zi(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&dr(t.emulatorConfig.host)&&(l.credentials="include"),Wi.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function wl(t,e){return it(t,"POST","/v2/accounts:revokeToken",rt(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){J(e.idToken,"internal-error"),J(typeof e.idToken<"u","internal-error"),J(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Vr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){J(e.length!==0,"internal-error");const n=Vr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(J(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await yl(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new bt;return r&&(J(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(J(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(J(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new bt,this.toJSON())}_performRefresh(){return Ue("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Je(t,e){J(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Te{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new _l(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new ar(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Wt(this,this.stsTokenManager.getToken(this.auth,e));return J(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return pl(this,e)}reload(){return bl(this)}_assign(e){this!==e&&(J(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Te({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){J(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await vn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Se(this.auth.app))return Promise.reject(Re(this.auth));const e=await this.getIdToken();return await Wt(this,gl(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,u=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:p,isAnonymous:b,providerData:_,stsTokenManager:T}=n;J(h&&T,e,"internal-error");const m=bt.fromJSON(this.name,T);J(typeof h=="string",e,"internal-error"),Je(r,e.name),Je(i,e.name),J(typeof p=="boolean",e,"internal-error"),J(typeof b=="boolean",e,"internal-error"),Je(s,e.name),Je(a,e.name),Je(o,e.name),Je(l,e.name),Je(u,e.name),Je(d,e.name);const y=new Te({uid:h,auth:e,email:i,emailVerified:p,displayName:r,isAnonymous:b,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:m,createdAt:u,lastLoginAt:d});return _&&Array.isArray(_)&&(y.providerData=_.map(A=>({...A}))),l&&(y._redirectEventId=l),y}static async _fromIdTokenResponse(e,n,r=!1){const i=new bt;i.updateFromServerResponse(n);const s=new Te({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await vn(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];J(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Gi(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new bt;o.updateFromIdToken(r);const l=new Te({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new ar(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,u),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hr=new Map;function Fe(t){ze(t instanceof Function,"Expected a class definition");let e=Hr.get(t);return e?(ze(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Hr.set(t,e),e)}/**
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
 */class qi{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}qi.type="NONE";const Wr=qi;/**
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
 */function on(t,e,n){return`firebase:${t}:${e}:${n}`}class vt{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=on(this.userKey,i.apiKey,s),this.fullPersistenceKey=on("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await bn(this.auth,{idToken:e}).catch(()=>{});return n?Te._fromGetAccountInfoResponse(this.auth,n,e):null}return Te._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new vt(Fe(Wr),e,r);const i=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=i[0]||Fe(Wr);const a=on(r,e.config.apiKey,e.name);let o=null;for(const u of n)try{const d=await u._get(a);if(d){let h;if(typeof d=="string"){const p=await bn(e,{idToken:d}).catch(()=>{});if(!p)break;h=await Te._fromGetAccountInfoResponse(e,p,d)}else h=Te._fromJSON(e,d);u!==s&&(o=h),s=u;break}}catch{}const l=i.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new vt(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async u=>{if(u!==s)try{await u._remove(a)}catch{}})),new vt(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jr(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Xi(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ki(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Zi(e))return"Blackberry";if(es(e))return"Webos";if(Ji(e))return"Safari";if((e.includes("chrome/")||Yi(e))&&!e.includes("edge/"))return"Chrome";if(Qi(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Ki(t=me()){return/firefox\//i.test(t)}function Ji(t=me()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Yi(t=me()){return/crios\//i.test(t)}function Xi(t=me()){return/iemobile/i.test(t)}function Qi(t=me()){return/android/i.test(t)}function Zi(t=me()){return/blackberry/i.test(t)}function es(t=me()){return/webos/i.test(t)}function _r(t=me()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function $l(t=me()){var e;return _r(t)&&!!((e=window.navigator)!=null&&e.standalone)}function Sl(){return Da()&&document.documentMode===10}function ts(t=me()){return _r(t)||Qi(t)||es(t)||Zi(t)||/windows phone/i.test(t)||Xi(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ns(t,e=[]){let n;switch(t){case"Browser":n=jr(me());break;case"Worker":n=`${jr(me())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${qt}/${r}`}/**
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
 */class kl{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function Cl(t,e={}){return it(t,"GET","/v2/passwordPolicy",rt(t,e))}/**
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
 */const El=6;class Il{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??El,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tl{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new zr(this),this.idTokenSubscription=new zr(this),this.beforeStateQueue=new kl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Bi,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Fe(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await vt.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await bn(this,{idToken:e}),r=await Te._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(Se(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return J(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await vn(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=al()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Se(this.app))return Promise.reject(Re(this));const n=e?qe(e):null;return n&&J(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&J(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Se(this.app)?Promise.reject(Re(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Se(this.app)?Promise.reject(Re(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Fe(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Cl(this),n=new Il(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new zt("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await wl(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Fe(e)||this._popupRedirectResolver;J(n,this,"argument-error"),this.redirectPersistenceManager=await vt.create(this,[Fe(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(J(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return J(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=ns(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(Se(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&Vi(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Ke(t){return qe(t)}class zr{constructor(e){this.auth=e,this.observer=null,this.addObserver=Va(n=>this.observer=n)}get next(){return J(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let In={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Pl(t){In=t}function rs(t){return In.loadJS(t)}function xl(){return In.recaptchaEnterpriseScript}function Al(){return In.gapiScript}function Rl(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class Ol{constructor(){this.enterprise=new Nl}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class Nl{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
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
 */const Dl="recaptcha-enterprise",is="NO_RECAPTCHA",Gr="onFirebaseAuthREInstanceReady";class Ye{constructor(e){this.type=Dl,this.auth=Ke(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{fl(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const u=new hl(l);return s.tenantId==null?s._agentRecaptchaConfig=u:s._tenantRecaptchaConfigs[s.tenantId]=u,a(u.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;Br(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(u=>{a(u)}).catch(()=>{a(is)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Ol().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&Br(window.grecaptcha)&&Ye.scriptInjectionDeferred)await Ye.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=xl();l.length!==0&&(l+=o+`&onload=${Gr}`),Ye.scriptInjectionDeferred=new Ai,window[Gr]=()=>{var u;(u=Ye.scriptInjectionDeferred)==null||u.resolve()},rs(l).then(()=>{var u;return(u=Ye.scriptInjectionDeferred)==null?void 0:u.promise}).then(()=>{i(o,s,a)}).catch(u=>{a(u)})}}).catch(o=>{a(o)})})}}Ye.scriptInjectionDeferred=null;async function qr(t,e,n,r=!1,i=!1){const s=new Ye(t);let a;if(i)a=is;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,u=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:u,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function or(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await qr(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await qr(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ll(t,e){const n=Di(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if($t(s,e??{}))return i;Ee(i,"already-initialized")}return n.initialize({options:e})}function Ml(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Fe);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Ul(t,e,n){const r=Ke(t);J(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=ss(e),{host:a,port:o}=Fl(e),l=o===null?"":`:${o}`,u={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){J(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),J($t(u,r.config.emulator)&&$t(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=u,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,dr(a)?ja(`${s}//${a}${l}`):Bl()}function ss(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Fl(t){const e=ss(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Kr(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Kr(a)}}}function Kr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Bl(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Ue("not implemented")}_getIdTokenResponse(e){return Ue("not implemented")}_linkToIdToken(e,n){return Ue("not implemented")}_getReauthenticationResolver(e){return Ue("not implemented")}}async function Vl(t,e){return it(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hl(t,e){return Jt(t,"POST","/v1/accounts:signInWithPassword",rt(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wl(t,e){return Jt(t,"POST","/v1/accounts:signInWithEmailLink",rt(t,e))}async function jl(t,e){return Jt(t,"POST","/v1/accounts:signInWithEmailLink",rt(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt extends br{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new jt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new jt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return or(e,n,"signInWithPassword",Hl);case"emailLink":return Wl(e,{email:this._email,oobCode:this._password});default:Ee(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return or(e,r,"signUpPassword",Vl);case"emailLink":return jl(e,{idToken:n,email:this._email,oobCode:this._password});default:Ee(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yt(t,e){return Jt(t,"POST","/v1/accounts:signInWithIdp",rt(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zl="http://localhost";class dt extends br{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new dt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Ee("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new dt(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return yt(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,yt(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,yt(e,n)}buildRequest(){const e={requestUri:zl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Gt(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gl(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function ql(t){const e=Ot(Nt(t)).link,n=e?Ot(Nt(e)).deep_link_id:null,r=Ot(Nt(t)).deep_link_id;return(r?Ot(Nt(r)).link:null)||r||n||e||t}class vr{constructor(e){const n=Ot(Nt(e)),r=n.apiKey??null,i=n.oobCode??null,s=Gl(n.mode??null);J(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=ql(e);try{return new vr(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(){this.providerId=It.PROVIDER_ID}static credential(e,n){return jt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=vr.parseLink(n);return J(r,"argument-error"),jt._fromEmailAndCode(e,r.code,r.tenantId)}}It.PROVIDER_ID="password";It.EMAIL_PASSWORD_SIGN_IN_METHOD="password";It.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Yt extends Tn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe extends Yt{constructor(){super("facebook.com")}static credential(e){return dt._fromParams({providerId:Xe.PROVIDER_ID,signInMethod:Xe.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Xe.credentialFromTaggedObject(e)}static credentialFromError(e){return Xe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Xe.credential(e.oauthAccessToken)}catch{return null}}}Xe.FACEBOOK_SIGN_IN_METHOD="facebook.com";Xe.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le extends Yt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return dt._fromParams({providerId:Le.PROVIDER_ID,signInMethod:Le.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Le.credentialFromTaggedObject(e)}static credentialFromError(e){return Le.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Le.credential(n,r)}catch{return null}}}Le.GOOGLE_SIGN_IN_METHOD="google.com";Le.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe extends Yt{constructor(){super("github.com")}static credential(e){return dt._fromParams({providerId:Qe.PROVIDER_ID,signInMethod:Qe.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Qe.credentialFromTaggedObject(e)}static credentialFromError(e){return Qe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Qe.credential(e.oauthAccessToken)}catch{return null}}}Qe.GITHUB_SIGN_IN_METHOD="github.com";Qe.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze extends Yt{constructor(){super("twitter.com")}static credential(e,n){return dt._fromParams({providerId:Ze.PROVIDER_ID,signInMethod:Ze.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Ze.credentialFromTaggedObject(e)}static credentialFromError(e){return Ze.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Ze.credential(n,r)}catch{return null}}}Ze.TWITTER_SIGN_IN_METHOD="twitter.com";Ze.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kl(t,e){return Jt(t,"POST","/v1/accounts:signUp",rt(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await Te._fromIdTokenResponse(e,r,i),a=Jr(r);return new ht({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Jr(r);return new ht({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Jr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn extends nt{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,yn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new yn(e,n,r,i)}}function as(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?yn._fromErrorAndOperation(t,s,e,r):s})}async function Jl(t,e,n=!1){const r=await Wt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return ht._forOperation(t,"link",r)}/**
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
 */async function Yl(t,e,n=!1){const{auth:r}=t;if(Se(r.app))return Promise.reject(Re(r));const i="reauthenticate";try{const s=await Wt(t,as(r,i,e,t),n);J(s.idToken,r,"internal-error");const a=mr(s.idToken);J(a,r,"internal-error");const{sub:o}=a;return J(t.uid===o,r,"user-mismatch"),ht._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Ee(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function os(t,e,n=!1){if(Se(t.app))return Promise.reject(Re(t));const r="signIn",i=await as(t,r,e),s=await ht._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Xl(t,e){return os(Ke(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ls(t){const e=Ke(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Ql(t,e,n){if(Se(t.app))return Promise.reject(Re(t));const r=Ke(t),a=await or(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Kl).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&ls(t),l}),o=await ht._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function Zl(t,e,n){return Se(t.app)?Promise.reject(Re(t)):Xl(qe(t),It.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&ls(t),r})}function ec(t,e,n,r){return qe(t).onIdTokenChanged(e,n,r)}function tc(t,e,n){return qe(t).beforeAuthStateChanged(e,n)}function nc(t,e,n,r){return qe(t).onAuthStateChanged(e,n,r)}function rc(t){return qe(t).signOut()}const wn="__sak";/**
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
 */class cs{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(wn,"1"),this.storage.removeItem(wn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ic=1e3,sc=10;class us extends cs{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ts(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);Sl()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,sc):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},ic)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}us.type="LOCAL";const ac=us;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ds extends cs{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}ds.type="SESSION";const hs=ds;/**
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
 */function oc(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class Pn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new Pn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async u=>u(n.origin,s)),l=await oc(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Pn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yr(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class lc{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const u=yr("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const p=h;if(p.data.eventId===u)switch(p.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(p.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oe(){return window}function cc(t){Oe().location.href=t}/**
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
 */function fs(){return typeof Oe().WorkerGlobalScope<"u"&&typeof Oe().importScripts=="function"}async function uc(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function dc(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function hc(){return fs()?self:null}/**
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
 */const gs="firebaseLocalStorageDb",fc=1,$n="firebaseLocalStorage",ps="fbase_key";class Xt{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function xn(t,e){return t.transaction([$n],e?"readwrite":"readonly").objectStore($n)}function gc(){const t=indexedDB.deleteDatabase(gs);return new Xt(t).toPromise()}function ms(){const t=indexedDB.open(gs,fc);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore($n,{keyPath:ps})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains($n)?e(r):(r.close(),await gc(),e(await ms()))})})}async function Yr(t,e,n){const r=xn(t,!0).put({[ps]:e,value:n});return new Xt(r).toPromise()}async function pc(t,e){const n=xn(t,!1).get(e),r=await new Xt(n).toPromise();return r===void 0?null:r.value}function Xr(t,e){const n=xn(t,!0).delete(e);return new Xt(n).toPromise()}const mc=800,_c=3;class _s{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=ms(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>_c)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return fs()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Pn._getInstance(hc()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await uc(),!this.activeServiceWorker)return;this.sender=new lc(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||dc()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Yr(e,wn,"1"),await Xr(e,wn)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Yr(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>pc(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Xr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=xn(i,!1).getAll();return new Xt(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||Vi(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),mc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}_s.type="LOCAL";const bc=_s;new Kt(3e4,6e4);/**
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
 */function wr(t,e){return e?Fe(e):(J(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class $r extends br{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return yt(e,this._buildIdpRequest())}_linkToIdToken(e,n){return yt(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return yt(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function vc(t){return os(t.auth,new $r(t),t.bypassAuthState)}function yc(t){const{auth:e,user:n}=t;return J(n,e,"internal-error"),Yl(n,new $r(t),t.bypassAuthState)}async function wc(t){const{auth:e,user:n}=t;return J(n,e,"internal-error"),Jl(n,new $r(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bs{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return vc;case"linkViaPopup":case"linkViaRedirect":return wc;case"reauthViaPopup":case"reauthViaRedirect":return yc;default:Ee(this.auth,"internal-error")}}resolve(e){ze(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ze(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $c=new Kt(2e3,1e4);async function Sc(t,e,n){if(Se(t.app))return Promise.reject(Pe(t,"operation-not-supported-in-this-environment"));const r=Ke(t);Hi(t,e,Tn);const i=wr(r,n);return new ot(r,"signInViaPopup",e,i).executeNotNull()}class ot extends bs{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,ot.currentPopupAction&&ot.currentPopupAction.cancel(),ot.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return J(e,this.auth,"internal-error"),e}async onExecution(){ze(this.filter.length===1,"Popup operations only handle one event");const e=yr();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Pe(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Pe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ot.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Pe(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,$c.get())};e()}}ot.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kc="pendingRedirect",ln=new Map;class Cc extends bs{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=ln.get(this.auth._key());if(!e){try{const r=await Ec(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}ln.set(this.auth._key(),e)}return this.bypassAuthState||ln.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Ec(t,e){const n=ys(e),r=vs(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function Ic(t,e){return vs(t)._set(ys(e),"true")}function Tc(t,e){ln.set(t._key(),e)}function vs(t){return Fe(t._redirectPersistence)}function ys(t){return on(kc,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pc(t,e,n){return xc(t,e,n)}async function xc(t,e,n){if(Se(t.app))return Promise.reject(Re(t));const r=Ke(t);Hi(t,e,Tn),await r._initializationPromise;const i=wr(r,n);return await Ic(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function Ac(t,e,n=!1){if(Se(t.app))return Promise.reject(Re(t));const r=Ke(t),i=wr(r,e),a=await new Cc(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rc=600*1e3;class Oc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Nc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!ws(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(Pe(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Rc&&this.cachedEventUids.clear(),this.cachedEventUids.has(Qr(e))}saveEventToCache(e){this.cachedEventUids.add(Qr(e)),this.lastProcessedEventTime=Date.now()}}function Qr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function ws({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Nc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ws(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dc(t,e={}){return it(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Mc=/^https?/;async function Uc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Dc(t);for(const n of e)try{if(Fc(n))return}catch{}Ee(t,"unauthorized-domain")}function Fc(t){const e=sr(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!Mc.test(n))return!1;if(Lc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const Bc=new Kt(3e4,6e4);function Zr(){const t=Oe().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Vc(t){return new Promise((e,n)=>{var i,s,a;function r(){Zr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Zr(),n(Pe(t,"network-request-failed"))},timeout:Bc.get()})}if((s=(i=Oe().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=Oe().gapi)!=null&&a.load)r();else{const o=Rl("iframefcb");return Oe()[o]=()=>{gapi.load?r():n(Pe(t,"network-request-failed"))},rs(`${Al()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw cn=null,e})}let cn=null;function Hc(t){return cn=cn||Vc(t),cn}/**
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
 */const Wc=new Kt(5e3,15e3),jc="__/auth/iframe",zc="emulator/auth/iframe",Gc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},qc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Kc(t){const e=t.config;J(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?pr(e,zc):`https://${t.config.authDomain}/${jc}`,r={apiKey:e.apiKey,appName:t.name,v:qt},i=qc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Gt(r).slice(1)}`}async function Jc(t){const e=await Hc(t),n=Oe().gapi;return J(n,t,"internal-error"),e.open({where:document.body,url:Kc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Gc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=Pe(t,"network-request-failed"),o=Oe().setTimeout(()=>{s(a)},Wc.get());function l(){Oe().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
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
 */const Yc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Xc=500,Qc=600,Zc="_blank",eu="http://localhost";class ei{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function tu(t,e,n,r=Xc,i=Qc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...Yc,width:r.toString(),height:i.toString(),top:s,left:a},u=me().toLowerCase();n&&(o=Yi(u)?Zc:n),Ki(u)&&(e=e||eu,l.scrollbars="yes");const d=Object.entries(l).reduce((p,[b,_])=>`${p}${b}=${_},`,"");if($l(u)&&o!=="_self")return nu(e||"",o),new ei(null);const h=window.open(e||"",o,d);J(h,t,"popup-blocked");try{h.focus()}catch{}return new ei(h)}function nu(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const ru="__/auth/handler",iu="emulator/auth/handler",su=encodeURIComponent("fac");async function ti(t,e,n,r,i,s){J(t.config.authDomain,t,"auth-domain-config-required"),J(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:qt,eventId:i};if(e instanceof Tn){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",Ba(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Yt){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),u=l?`#${su}=${encodeURIComponent(l)}`:"";return`${au(t)}?${Gt(o).slice(1)}${u}`}function au({config:t}){return t.emulator?pr(t,iu):`https://${t.authDomain}/${ru}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jn="webStorageSupport";class ou{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=hs,this._completeRedirectFn=Ac,this._overrideRedirectResult=Tc}async _openPopup(e,n,r,i){var a;ze((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await ti(e,n,r,sr(),i);return tu(e,s,yr())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await ti(e,n,r,sr(),i);return cc(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(ze(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Jc(e),r=new Oc(e);return n.register("authEvent",i=>(J(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(jn,{type:jn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[jn];s!==void 0&&n(!!s),Ee(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Uc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return ts()||Ji()||_r()}}const lu=ou;var ni="@firebase/auth",ri="1.13.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cu{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){J(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uu(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function du(t){Vt(new St("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;J(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:ns(t)},u=new Tl(r,i,s,l);return Ml(u,n),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Vt(new St("auth-internal",e=>{const n=Ke(e.getProvider("auth").getImmediate());return(r=>new cu(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),_t(ni,ri,uu(t)),_t(ni,ri,"esm2020")}/**
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
 */const hu=300,fu=xi("authIdTokenMaxAge")||hu;let ii=null;const gu=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>fu)return;const i=n==null?void 0:n.token;ii!==i&&(ii=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function pu(t=jo()){const e=Di(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Ll(t,{popupRedirectResolver:lu,persistence:[bc,ac,hs]}),r=xi("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=gu(s.toString());tc(n,a,()=>a(n.currentUser)),ec(n,o=>a(o))}}const i=xa("auth");return i&&Ul(n,`http://${i}`),n}function mu(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}Pl({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=Pe("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",mu().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});du("Browser");const _u={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},De=_u,kt=!!De.VITE_FIREBASE_APP_ID;let zn=null;function pt(){if(!kt)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!zn){const t=Li({apiKey:De.VITE_FIREBASE_API_KEY,authDomain:De.VITE_FIREBASE_AUTH_DOMAIN,projectId:De.VITE_FIREBASE_PROJECT_ID,appId:De.VITE_FIREBASE_APP_ID,...De.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:De.VITE_FIREBASE_STORAGE_BUCKET},...De.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:De.VITE_FIREBASE_MESSAGING_SENDER_ID}});zn=pu(t)}return zn}function si(){return new Le}async function ai(){if(!kt)return;const t=pt();t.currentUser&&await rc(t)}var bu=g(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),vu=g('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),yu=g("<button type=button class=gate-toggle>"),wu=g("<div class=gate-or>── or ──"),$u=g("<button type=button class=btn>Continue with Google"),Su=g("<div class=gate-error role=alert>"),ku=g("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),Cu=g("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),Eu=g("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const Iu={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function oi(t){const e=(t==null?void 0:t.code)??"";return Iu[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function Tu(t){return(()=>{var e=bu(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return c(a,()=>t.email),X(l,"click",t.onSignOut),e})()}function Pu(){const[t,e]=V("signin"),[n,r]=V(""),[i,s]=V(""),[a,o]=V(!1),[l,u]=V("");da(async p=>{if(!kt)return null;const b=pt().currentUser;return b?await b.getIdToken(p):null});async function d(p){if(p.preventDefault(),!a()){o(!0),u("");try{const b=pt();t()==="create"?await Ql(b,n(),i()):await Zl(b,n(),i())}catch(b){u(oi(b))}finally{o(!1)}}}async function h(){if(!a()){o(!0),u("");try{await Sc(pt(),si())}catch(p){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(p==null?void 0:p.code)){await Pc(pt(),si());return}u(oi(p))}finally{o(!1)}}}return(()=>{var p=ku(),b=p.firstChild;return b.firstChild,c(b,f(S,{when:kt,get fallback(){return[Cu(),Eu()]},get children(){return[(()=>{var _=vu(),T=_.firstChild,m=T.firstChild,y=m.nextSibling,A=T.nextSibling,M=A.firstChild,R=M.nextSibling,L=A.nextSibling;return _.addEventListener("submit",d),y.$$input=N=>r(N.currentTarget.value),R.$$input=N=>s(N.currentTarget.value),c(L,(()=>{var N=ee(()=>!!a());return()=>N()?"Working…":t()==="create"?"Create account":"Sign in"})()),v(N=>{var k=t()==="create"?"new-password":"current-password",x=a();return k!==N.e&&re(R,"autocomplete",N.e=k),x!==N.t&&(L.disabled=N.t=x),N},{e:void 0,t:void 0}),v(()=>y.value=n()),v(()=>R.value=i()),_})(),(()=>{var _=yu();return _.$$click=()=>{u(""),e(t()==="create"?"signin":"create")},c(_,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),v(()=>_.disabled=a()),_})(),wu(),(()=>{var _=$u();return _.$$click=h,v(()=>_.disabled=a()),_})(),f(S,{get when(){return l()},get children(){var _=Su();return c(_,l),_}})]}}),null),p})()}Ie(["click","input"]);var xu=g("<div class=gate-error role=alert>"),Au=g("<p class=gate-note>No grant-file entries yet."),Ru=g("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),Ou=g('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),Nu=g("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function Du(t){const[e,n]=V([]),[r,i]=V([]),[s,a]=V(""),[o,l]=V(!1),[u,d]=V(""),h=m=>{n((m==null?void 0:m.file_grants)??[]),i((m==null?void 0:m.static_emails)??[])};wt(async()=>{try{h(await fa())}catch{d("Could not load the grant list.")}});const b=m=>{m.key==="Escape"&&t.onClose()};wt(()=>{window.addEventListener("keydown",b),We(()=>window.removeEventListener("keydown",b));const m=document.querySelector(".access-add input");m==null||m.focus()});const _=async m=>{if(m.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await ga(s())),a("")}catch(y){d(y.message)}l(!1)}},T=async m=>{if(!o()){l(!0),d("");try{h(await pa(m))}catch(y){d(y.message)}l(!1)}};return(()=>{var m=Ou(),y=m.firstChild,A=y.firstChild,M=A.nextSibling,R=M.nextSibling,L=R.firstChild,N=L.nextSibling,k=R.nextSibling;return X(m,"click",t.onClose),y.$$click=x=>x.stopPropagation(),c(y,f(S,{get when(){return u()},get children(){var x=xu();return c(x,u),x}}),R),c(y,f(de,{get each(){return e()},children:x=>(()=>{var D=Nu(),I=D.firstChild,w=I.nextSibling;return c(I,x),w.$$click=()=>T(x),re(w,"title",`Remove ${x}`),re(w,"aria-label",`Remove ${x}`),v(()=>w.disabled=o()),D})()}),R),c(y,f(S,{get when(){return e().length===0},get children(){return Au()}}),R),R.addEventListener("submit",_),L.$$input=x=>a(x.currentTarget.value),c(N,()=>o()?"…":"Add"),c(y,f(S,{get when(){return r().length>0},get children(){var x=Ru();return x.firstChild,c(x,()=>r().join(", "),null),x}}),k),X(k,"click",t.onClose),v(()=>N.disabled=o()),v(()=>L.value=s()),m})()}Ie(["click","input"]);const Be=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),Ft=(t,e,n)=>Math.min(n,Math.max(e,t));function Lu(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:Ft((n-t)/r,0,1)}function Mu(t,e,n,r,i=Be){if(n<i.minRateOfReturn||t<=0)return null;const s=Ft(t/2,0,1),a=Ft(e,0,1),o=Math.min(n/i.idealReturn,1),l=Ft((r-i.trendScoreFloor)/i.trendScoreBand,0,1),u={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return u.total=u.sharpe+u.safety+u.return+u.trend,u}function Uu(t,e=Be){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?Ft(1+t.delta,0,1):Lu(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),Mu(r,a,n,i,e)}function Fu(t,e=Be.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function Bu(t){return t.weightSharpe===Be.weightSharpe&&t.weightSafety===Be.weightSafety&&t.weightReturn===Be.weightReturn&&t.minRateOfReturn===Be.minRateOfReturn}var Vu=g("<span class=hint>production defaults · drag to re-rank live"),Hu=g("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),Wu=g('<span class="hint hint-custom">custom weights'),ju=g("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function zu(){const[t,e]=V({...Be});return{params:t,isCustom:()=>!Bu(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Be})}}const Gu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function qu(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=Hu(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return c(i,f(S,{get when(){return!e()},get fallback(){return Wu()},get children(){return Vu()}}),null),c(s,f(de,{each:Gu,children:o=>(()=>{var l=ju(),u=l.firstChild,d=u.firstChild,h=d.nextSibling,p=u.nextSibling;return c(u,()=>o.label,d),c(h,()=>o.fmt(t.scoring.params()[o.key]),null),c(h,f(S,{get when(){return o.weight},get children(){return[" ","· ",ee(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),p.$$input=b=>t.scoring.setParam(o.key,Number(b.currentTarget.value)),v(b=>{var _=o.max,T=o.step;return _!==b.e&&re(p,"max",b.e=_),T!==b.t&&re(p,"step",b.t=T),b},{e:void 0,t:void 0}),v(()=>p.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),v(()=>r.open=e()),r})()}Ie(["click","input"]);const An=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],Dt=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],$s="webapp.columns.v1";function Ku(){try{const t=localStorage.getItem($s);if(!t)return Dt;const e=JSON.parse(t);if(!Array.isArray(e))return Dt;const n=new Set(An.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:Dt}catch{return Dt}}function Ju(t){try{localStorage.setItem($s,JSON.stringify(t))}catch{}}var Yu=g("<div class=pop-backdrop>"),Xu=g('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Qu=g("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Zu=g("<label class=pick-item><input type=checkbox>");function ed(t){const[e,n]=V(!1);return(()=>{var r=Qu(),i=r.firstChild;return i.$$click=()=>n(!e()),c(r,f(S,{get when(){return e()},get children(){return[(()=>{var s=Yu();return s.$$click=()=>n(!1),s})(),(()=>{var s=Xu(),a=s.firstChild,o=a.nextSibling;return c(a,f(de,{each:An,children:l=>(()=>{var u=Zu(),d=u.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),c(u,()=>l.label,null),v(()=>d.checked=t.store.isOn(l.id)),u})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),v(()=>re(i,"aria-expanded",e())),r})()}Ie(["click"]);var td=g('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),nd=g("<span class=pggap>…"),rd=g("<button type=button class=pgbtn>");function id(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,u)=>u+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,u)=>l-u),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function sd(t){const e=he(()=>id(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=td(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,u=l.nextSibling;return c(s,()=>t.page(),o),c(s,()=>t.pageCount(),null),l.$$click=n,c(i,f(de,{get each(){return e()},children:d=>d==="…"?nd():(()=>{var h=rd();return h.$$click=()=>t.onGo(d),c(h,d),v(()=>h.classList.toggle("active",d===t.page())),h})()}),u),u.$$click=r,v(d=>{var h=t.page()<=1,p=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),p!==d.t&&(u.disabled=d.t=p),d},{e:void 0,t:void 0}),i})()}Ie(["click"]);var ad=g("<span class=tip>");function Tt(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=ad();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?ca(i,r):e=r,c(r,()=>t.children),v(()=>re(r,"data-tip",t.text??"")),r})()}Ie(["focusin"]);const ut="∅";function ae(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function Lt(t){return Number(t??0).toLocaleString("en-US")}function Sn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function Ss(t){return ks(t,{hour:"2-digit",minute:"2-digit"})}function od(t){return ks(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function ks(t,e){const n=Sn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const Cs={text:ut,isNull:!0},Gn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function lr(t,e){return!e||ae(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function Es(t,e){return!e||ae(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function ld(t){if(!t||typeof t!="object"||ae(t.report_date))return Cs;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function fe(t,e){if(ae(e))return Cs;switch(t){case"fixed2":return Gn(e,2);case"fixed3":return Gn(e,3);case"ivrv":return Gn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return ld(e);default:return{text:String(e),isNull:!1}}}const li=t=>Number(t*100).toFixed(0);function cd(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=li(e.momentum_high),s=li(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function Pt(t,e){return cd(e)[t]??t}var Is=g("<span class=tip-target>"),ud=g("<div class=kv><span class=kv-label></span><span class=kv-value>"),dd=g("<span class=tip-target>Strike position in band"),hd=g('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),fd=g("<div class=exp-block><h4>"),gd=g("<div class=kv-value>Band unavailable (∅)"),pd=g("<div><span class=marker-tick></span><span class=marker-cap><br>"),md=g("<div class=exp-block><h4>Premium economics"),_d=g("<b>"),bd=g('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),vd=g("<div class=muted-note>earnings-discounted safety applied"),yd=g("<div class=exp-block><h4>Score breakdown"),wd=g("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),$d=g('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),Sd=g("<span class=muted-note>all columns visible"),kd=g('<div class="exp-block exp-chips"><h4>Hidden columns'),Cd=g("<span class=tip-target>: "),Ed=g("<span>"),Id=g("<span class=tip-target>band safety is already discounted by the earnings rule."),Td=g("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),Pd=g("<div class=expansion><div class=exp-grid>");const qn={sharpe:.2,safety:.4,return_part:.4};function Kn(t,e=2){return ae(t)?ut:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function Ae(t,e,n){return(()=>{var r=ud(),i=r.firstChild,s=i.nextSibling;return c(i,f(Tt,{get text(){return Pt(t,e)},get children(){var a=Is();return c(a,()=>t.replace(/_/g," ")),a}})),c(s,n),r})()}function xd(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=ae(e.mid)?null:e.strike-e.mid,s=i!=null&&!ae(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),u=!ae(a)&&l>a&&!ae(e.strike),d=p=>{if(ae(p))return null;const b=(p-a)/(l-a)*100;return Math.min(100,Math.max(0,b))},h=u?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(p=>d(p.v)!=null):[];return(()=>{var p=fd(),b=p.firstChild;return c(b,f(Tt,{get text(){return Pt("band_range",t.thresholds)},get children(){return dd()}})),c(p,f(S,{when:u,get fallback(){return gd()},get children(){var _=hd(),T=_.firstChild;return c(_,f(de,{each:h,children:m=>(()=>{var y=pd(),A=y.firstChild,M=A.nextSibling,R=M.firstChild;return c(M,()=>m.label,R),c(M,()=>fe("fixed2",m.v).text,null),v(L=>{var N=`marker ${m.cls}`,k=`${d(m.v)}%`;return N!==L.e&&ve(y,L.e=N),k!==L.t&&ct(y,"left",L.t=k),L},{e:void 0,t:void 0}),y})()}),null),v(m=>{var y=`${d(e.strike_from)}%`,A=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return y!==m.e&&ct(T,"left",m.e=y),A!==m.t&&ct(T,"width",m.t=A),m},{e:void 0,t:void 0}),_}}),null),c(p,()=>Ae("band_range",t.thresholds,`${fe("fixed2",e.strike_from).text} → ${fe("fixed2",e.strike_to).text}`),null),c(p,()=>Ae("band_depth",t.thresholds,r==null?ut:`${(r*100).toFixed(1)}%`),null),c(p,()=>Ae("cushion_be",t.thresholds,s==null?ut:`${s.toFixed(1)}%`),null),p})()}function Ad(t){const e=t.row,n=ae(e.strike)?null:e.strike*100,r=ae(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=fe("pct1",e.rate_of_return);return(()=>{var a=md();return a.firstChild,c(a,()=>Ae("capital",t.thresholds,n==null?ut:Kn(n,0)),null),c(a,()=>Ae("premium",t.thresholds,r==null?ut:Kn(r)),null),c(a,()=>Ae("breakeven",t.thresholds,i==null?ut:Kn(i)),null),c(a,()=>Ae("ann_ror",t.thresholds,(()=>{var o=_d();return c(o,()=>s.text),o})()),null),c(a,()=>Ae("bid",t.thresholds,fe("fixed2",e.bid).text),null),c(a,()=>Ae("ask",t.thresholds,fe("fixed2",e.ask).text),null),c(a,()=>Ae("expiration",t.thresholds,e.expiration),null),a})()}function Rd(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:qn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:qn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:qn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=yd();return i.firstChild,c(i,f(S,{when:n,get fallback(){return(()=>{var s=wd(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return c(l,()=>fe("fixed3",e.score).text),s})()},get children(){return[f(de,{each:r,children:s=>{const a=ae(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=$d(),l=o.firstChild,u=l.firstChild,d=u.nextSibling,h=d.firstChild,p=h.nextSibling;p.nextSibling;var b=l.nextSibling,_=b.firstChild,T=b.nextSibling;return c(l,f(Tt,{get text(){return Pt(s.key,t.thresholds)},get children(){var m=Is();return c(m,()=>s.label),m}}),u),c(d,()=>s.weight*100,p),c(T,()=>fe("fixed3",s.v).text),v(m=>ct(_,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=bd(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return c(l,()=>fe("fixed3",e.score).text),s})(),f(S,{get when(){return e.earnings_before_expiry},get children(){return vd()}})]}}),null),i})()}function Od(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:fe(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=kd();return n.firstChild,c(n,f(de,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=Ed();return c(s,f(Tt,{get text(){return Pt(r.id,t.thresholds)},get children(){var a=Cd(),o=a.firstChild;return c(a,()=>r.label,o),c(a,()=>i.text,null),a}})),v(()=>ve(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),c(n,f(S,{get when(){return t.hiddenDefs.length===0},get children(){return Sd()}}),null),n})()}function Ts(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=Pd(),i=r.firstChild;return c(r,f(S,{when:n,get children(){var s=Td(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,u=l.nextSibling,d=u.nextSibling,h=d.nextSibling;return h.nextSibling,c(o,()=>n.report_date),c(s,f(S,{get when(){return n.report_time},children:p=>p().replaceAll("_"," ")}),u),c(s,f(S,{get when(){return!ae(n.expected_eps)},get children(){return[" ","· expected EPS ",ee(()=>fe("fixed2",n.expected_eps).text)]}}),h),c(s,f(Tt,{get text(){return Pt("earnings_before_expiry",t.thresholds)},get children(){return Id()}}),null),s}}),i),c(i,f(xd,{row:e,get thresholds(){return t.thresholds}}),null),c(i,f(Ad,{row:e,get thresholds(){return t.thresholds}}),null),c(i,f(Rd,{row:e,get thresholds(){return t.thresholds}}),null),c(i,f(Od,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var Nd=g("<span class=null-mark>"),Dd=g("<span class=star>★"),Ld=g("<td><b>"),Jn=g("<span>"),ci=g("<td class=num>"),Md=g("<span class=score-frozen>prod "),Ud=g('<td class="num score-cell">'),Fd=g('<span class="score-frozen readmit">re-admitted'),Bd=g("<td>"),Vd=g("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),Hd=g("<span class=sort-arrow>"),Wd=g("<span class=tip-target>"),jd=g("<th role=button tabindex=0>"),zd=g("<tr class=expandable><td class=exp-col>"),Gd=g("<tr class=exp-row><td>");const qd=t=>`${t.underlying}|${t.strike}`;function Kd(t){return(()=>{var e=Nd();return c(e,()=>t.text),e})()}function tn(t){const e=fe(t.kind,t.value);return f(S,{get when(){return!e.isNull},get fallback(){return f(Kd,{get text(){return e.text}})},get children(){return e.text}})}function Jd(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=Ld(),i=r.firstChild;return c(r,f(S,{get when(){return t.pickRank!=null},get children(){var s=Dd();return s.firstChild,c(s,()=>t.pickRank,null),s}}),i),c(i,()=>n.underlying),c(r,f(S,{get when(){return lr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=Jn();return v(()=>ve(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=ci();return c(r,f(S,{get when(){return lr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=Jn();return v(()=>ve(s,`dot ${i()}`)),s})()," "]}),null),c(r,f(tn,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=Ud();return c(r,f(tn,{get kind(){return e.kind},get value(){return n[e.id]}}),null),c(r,f(S,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(S,{get when(){return!ae(n.frozen_score)},get fallback(){return f(S,{get when(){return!ae(n.score)},get children(){return Fd()}})},get children(){var i=Md();return i.firstChild,c(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=ci();return c(r,f(tn,{get kind(){return e.kind},get value(){return n[e.id]}}),null),c(r,f(S,{get when(){return Es(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=Jn();return c(s,i),v(()=>ve(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=Bd();return c(r,f(tn,{get kind(){return e.kind},get value(){return n[e.id]}})),v(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Yd(t){const e=he(()=>An.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=Vd(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return c(i,f(de,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=jd();return l.$$keydown=u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),c(l,f(Tt,{get text(){return Pt(a.id,t.thresholds)},get children(){var u=Wd();return c(u,()=>a.label,null),c(u,f(S,{get when(){return o()},get children(){return[" ",(()=>{var d=Hd();return c(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),u}})),v(u=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==u.e&&l.classList.toggle("num",u.e=d),h!==u.t&&re(l,"aria-sort",u.t=h),u},{e:void 0,t:void 0}),l})()}}),null),c(s,f(de,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>qd(a),u=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=zd(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),c(h,()=>u()?"▾":"▸"),c(d,f(de,{get each(){return e()},children:p=>f(Jd,{col:p,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),v(p=>{var b=o()!=null,_=!!ae(a.score),T=!!u();return b!==p.e&&d.classList.toggle("pick",p.e=b),_!==p.t&&d.classList.toggle("prow",p.t=_),T!==p.a&&d.classList.toggle("open",p.a=T),p},{e:void 0,t:void 0,a:void 0}),d})(),f(S,{get when(){return u()},get children(){var d=Gd(),h=d.firstChild;return c(h,f(Ts,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),v(()=>re(h,"colspan",e().length+1)),d}})]}})),n})()}Ie(["click","keydown"]);var Xd=g("<span class=candidate-star-badge>★"),Qd=g("<span class=candidate-sector-chip>"),Zd=g("<span class=candidate-frozen-score>prod "),eh=g("<span class=candidate-delta-chip>Δ "),th=g("<div class=hp-card-drawer>"),nh=g('<div class="hp-pos-card candidate-card"><div class=hp-card-summary role=button tabindex=0><div class=hp-card-top><span class=hp-card-symbol-line><b class=hp-card-symbol></b><span class=candidate-strike-badge>$<!> Put</span></span><span class=hp-card-pl><span class=candidate-ror-sub>Ann. RoR</span></span></div><div class=hp-card-main><div class=candidate-metrics-row><span class=candidate-metric>Spot: <b>$</b></span><span class=candidate-metric>Cushion: <b></b></span><span class=candidate-metric>Mid: <b>$</b></span><span class=candidate-score-pill>Score: <b></b></span></div><div class=candidate-tags-row><span class=candidate-expiry-chip>exp </span><button type=button class="btn-ghost candidate-details-btn">'),ui=g("<span>"),rh=g("<span class=candidate-earnings-alert>⚠ Earnings ");function ih(t){const e=()=>t.row,n=he(()=>{const o=e();return!o.underlying_price||o.underlying_price<=0||ae(o.strike)?null:(o.underlying_price-o.strike)/o.underlying_price*100}),r=()=>fe("pct1",e().rate_of_return).text,i=()=>fe("fixed2",e().strike).text,s=()=>fe("fixed2",e().underlying_price).text,a=()=>fe("fixed2",e().mid).text;return(()=>{var o=nh(),l=o.firstChild,u=l.firstChild,d=u.firstChild,h=d.firstChild,p=h.nextSibling,b=p.firstChild,_=b.nextSibling;_.nextSibling;var T=d.nextSibling,m=T.firstChild,y=u.nextSibling,A=y.firstChild,M=A.firstChild,R=M.firstChild,L=R.nextSibling;L.firstChild;var N=M.nextSibling,k=N.firstChild,x=k.nextSibling,D=N.nextSibling,I=D.firstChild,w=I.nextSibling;w.firstChild;var U=D.nextSibling,C=U.firstChild,Z=C.nextSibling,z=A.nextSibling,F=z.firstChild;F.firstChild;var j=F.nextSibling;return l.$$keydown=E=>{(E.key==="Enter"||E.key===" ")&&(E.preventDefault(),t.onToggle(e()))},l.$$click=()=>t.onToggle(e()),c(d,f(S,{get when(){return t.pickRank!=null},get children(){var E=Xd();return E.firstChild,c(E,()=>t.pickRank,null),v(()=>re(E,"aria-label",`Rank ${t.pickRank}`)),E}}),h),c(h,()=>e().underlying),c(p,i,_),c(d,f(S,{get when(){return lr(e().realized_vol,t.thresholds)},children:E=>(()=>{var W=ui();return v(Y=>{var O=`dot ${E()}`,q=`Realized Vol Tier: ${E()}`,te=`Vol tier ${E()}`;return O!==Y.e&&ve(W,Y.e=O),q!==Y.t&&re(W,"title",Y.t=q),te!==Y.a&&re(W,"aria-label",Y.a=te),Y},{e:void 0,t:void 0,a:void 0}),W})()}),null),c(d,f(S,{get when(){return e().sector},get children(){var E=Qd();return c(E,()=>e().sector),E}}),null),c(T,r,m),c(L,s,null),c(x,(()=>{var E=ee(()=>n()!=null);return()=>E()?`${n()>0?"+":""}${n().toFixed(1)}%`:"—"})()),c(w,a,null),c(Z,(()=>{var E=ee(()=>!!ae(e().score));return()=>E()?"—":fe("fixed3",e().score).text})()),c(U,f(S,{get when(){return ee(()=>{var E;return!!((E=t.customScores)!=null&&E.call(t))})()&&!ae(e().frozen_score)},get children(){var E=Zd();return E.firstChild,c(E,()=>e().frozen_score.toFixed(3),null),E}}),null),c(F,()=>e().expiration,null),c(z,f(S,{get when(){return e().delta!=null},get children(){var E=eh();return E.firstChild,c(E,()=>e().delta.toFixed(2),null),E}}),j),c(z,f(S,{get when(){return Es(e().price_percentile,t.thresholds)},children:E=>(()=>{var W=ui();return c(W,E),v(()=>ve(W,`chip ${E().toLowerCase()}`)),W})()}),j),c(z,f(S,{get when(){return e().earnings_before_expiry},children:E=>(()=>{var W=rh();return W.firstChild,c(W,()=>E().report_date,null),W})()}),j),j.$$click=E=>{E.stopPropagation(),t.onToggle(e())},c(j,()=>t.isOpen?"Less ▲":"Details ▼"),c(o,f(S,{get when(){return t.isOpen},get children(){var E=th();return c(E,f(Ts,{get row(){return e()},get thresholds(){return t.thresholds},get hiddenDefs(){return ee(()=>typeof t.hiddenDefs=="function")()?t.hiddenDefs():t.hiddenDefs??[]}})),E}}),null),v(E=>{var W=t.pickRank!=null,Y=!!ae(e().score),O=!!t.isOpen,q=t.isOpen,te=`${e().underlying} strike ${i()} put option details`,ce=!ae(e().rate_of_return)&&e().rate_of_return>=0,ke=!ae(e().rate_of_return)&&e().rate_of_return<0,H=(n()??0)>=0,ne=(n()??0)<0;return W!==E.e&&o.classList.toggle("pick-card",E.e=W),Y!==E.t&&o.classList.toggle("unscored-card",E.t=Y),O!==E.a&&o.classList.toggle("open",E.a=O),q!==E.o&&re(l,"aria-expanded",E.o=q),te!==E.i&&re(l,"aria-label",E.i=te),ce!==E.n&&T.classList.toggle("holdings-pos",E.n=ce),ke!==E.s&&T.classList.toggle("holdings-neg",E.s=ke),H!==E.h&&x.classList.toggle("holdings-pos",E.h=H),ne!==E.r&&x.classList.toggle("holdings-neg",E.r=ne),E},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0}),o})()}Ie(["click","keydown"]);function sh(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const mt=t=>ae(t);function ah(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=mt(a),u=mt(o);return l||u?l&&u?0:l?1:-1:r*sh(a,o)})}function oh(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=mt(r),a=mt(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,u=n.rate_of_return,d=mt(l),h=mt(u);return d||h?d&&h?0:d?1:-1:u-l})}var lh=g("<div class=stage-badges>"),ch=g("<pre class=errbox>"),uh=g("<details><summary> "),dh=g("<div class=results-cards-wrapper><div class=candidate-cards-list>"),hh=g('<div class="scroll-region results-view-region">'),fh=g('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><div class=sort-control><label class=sort-label>Sort:<select class=sort-select aria-label="Sort candidates by"><option value=score>Score</option><option value=rate_of_return>Rate of Return</option><option value=underlying>Symbol (A–Z)</option><option value=strike>Strike</option><option value=underlying_price>Spot Price</option><option value=realized_vol>Realized Vol</option><option value=delta>Delta</option></select></label><button type=button class="btn sort-dir-btn"></button></div><div class=view-switch role=group aria-label="Display format"><button type=button class="btn view-btn">Cards</button><button type=button class="btn view-btn">Table</button></div><span class=count-line> rows (filtered from <!>)'),gh=g("<div class=results-table-wrapper>"),ph=g("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),mh=g("<div class=empty-panel>No rows match the current filter."),_h=g('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Yn=100,bh=150,di={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function vh(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=lh();return c(i,f(de,{get each(){return t.stages??[]},children:s=>(()=>{var a=uh(),o=a.firstChild,l=o.firstChild;return c(o,()=>n(s.status),l),c(o,()=>r(s.name),null),c(a,f(S,{get when(){return s.error},get children(){var u=ch();return c(u,()=>s.error),u}}),null),v(()=>ve(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function hi(t){const[e,n]=V(""),[r,i]=V(""),[s,a]=V(!0),[o,l]=V(null),[u,d]=V("asc"),[h,p]=V(1);let b;We(()=>clearTimeout(b));const _=()=>{var O;return((O=t.tf)==null?void 0:O.rows)??[]},T=he(()=>{const O=t.scoring.params(),q=t.scoring.isCustom();return _().map(te=>{const ce=Uu(te,O);return{...te,frozen_score:te.score,live_parts:ce,score:q?ce==null?null:ce.total:te.score}})}),m=he(()=>T().filter(O=>!ae(O.score)&&ae(O.frozen_score)).length),y=O=>{const q=O.currentTarget.value;n(q),clearTimeout(b),b=setTimeout(()=>{i(q.trim().toLowerCase()),p(1)},bh)},A=O=>{a(O),p(1)},M=O=>{o()!==O?(l(O),d("asc")):u()==="asc"?d("desc"):(l(null),d("asc")),p(1)},[R,L]=V(typeof window<"u"&&window.innerWidth<=900?"cards":"table"),N=O=>{O==="score"?(l(null),d("asc")):(l(O),d(O==="rate_of_return"||O==="realized_vol"||O==="strike"||O==="underlying_price"?"desc":"asc")),p(1)},k=()=>{d(O=>O==="asc"?"desc":"asc"),p(1)},[x,D]=V(null),I=O=>{const q=`${O.underlying}|${O.strike}`;D(te=>te===q?null:q)};lt(Mt([o,u,h,r,s],()=>D(null))),lt(Mt(t.active,()=>D(null))),lt(Mt(t.columns.visible,()=>p(1)));const w=()=>An.filter(O=>!t.columns.visible().includes(O.id)),U=()=>(t.stages??[]).find(O=>O.name===di[t.id].id),C=he(()=>{const O=r();return O?T().filter(q=>{const te=q.underlying,ce=q.sector;return te!=null&&String(te).toLowerCase().includes(O)||ce!=null&&String(ce).toLowerCase().includes(O)}):T()}),Z=he(()=>{const O=C();return s()?O.filter(q=>!ae(q.score)):O}),z=he(()=>o()?ah(Z(),o(),u()):oh(Z())),F=he(()=>Math.max(1,Math.ceil(z().length/Yn))),j=()=>Math.min(h(),F()),E=()=>{const O=j();return z().slice((O-1)*Yn,O*Yn)},W=he(()=>{var q;const O=new Map;if(t.scoring.isCustom()){const te=Fu(T().map(ce=>({row:ce,score:ce.score})));for(const ce of te)O.set(`${ce.row.underlying}|${ce.row.strike}`,O.size+1)}else for(const te of((q=t.tf)==null?void 0:q.top_picks)??[])O.set(`${te.underlying}|${te.strike}`,te.rank??"?");return O}),Y=O=>W().get(`${O.underlying}|${O.strike}`);return(()=>{var O=fh(),q=O.firstChild,te=q.firstChild,ce=te.nextSibling,ke=ce.firstChild,H=ce.nextSibling,ne=H.firstChild,ue=ne.firstChild,ye=ue.nextSibling,we=ne.nextSibling,xe=H.nextSibling,Ne=xe.firstChild,xt=Ne.nextSibling,st=xe.nextSibling,$=st.firstChild,B=$.nextSibling;return B.nextSibling,c(O,f(vh,{get stages(){return t.stages}}),q),te.$$input=y,ke.addEventListener("change",P=>A(P.currentTarget.checked)),ye.addEventListener("change",P=>N(P.currentTarget.value)),we.$$click=k,c(we,()=>u()==="asc"?"↑ Asc":"↓ Desc"),Ne.$$click=()=>L(R()==="cards"?"auto":"cards"),xt.$$click=()=>L(R()==="table"?"auto":"table"),c(q,f(ed,{get store(){return t.columns}}),st),c(st,()=>Lt(z().length),$),c(st,()=>Lt(_().length),B),c(st,f(S,{get when(){return ee(()=>!!t.scoring.isCustom())()&&m()>0},get children(){return[" ","· ",ee(()=>Lt(m()))," re-admitted by lower floor"]}}),null),c(O,f(S,{get when(){return E().length>0},get children(){var P=hh();return c(P,f(S,{get when(){return R()==="cards"},get fallback(){return(()=>{var K=gh();return c(K,f(Yd,{get visibleCols(){return t.columns.visible},rows:E,sortKey:o,sortDir:u,onSort:M,get thresholds(){return t.thresholds},pickRankOf:Y,openKey:x,onToggleRow:I,hiddenDefs:w,get customScores(){return t.scoring.isCustom}})),K})()},get children(){var K=dh(),Q=K.firstChild;return c(Q,f(de,{get each(){return E()},children:ie=>f(ih,{row:ie,get thresholds(){return t.thresholds},get pickRank(){return Y(ie)},get isOpen(){return x()===`${ie.underlying}|${ie.strike}`},onToggle:I,hiddenDefs:w,get customScores(){return t.scoring.isCustom}})})),K}})),P}}),null),c(O,f(S,{get when(){return E().length===0},get children(){return f(S,{get when(){var P,K;return((P=U())==null?void 0:P.status)==="failed"||((K=U())==null?void 0:K.status)==="partial"},get fallback(){return f(S,{get when(){return ee(()=>!!s())()&&C().length>0},get fallback(){return mh()},get children(){var P=ph(),K=P.firstChild,Q=K.nextSibling,ie=Q.nextSibling,be=ie.nextSibling,G=be.nextSibling;return G.nextSibling,c(P,()=>Lt(C().length),G),P}})},children:P=>(()=>{var K=_h(),Q=K.firstChild,ie=Q.firstChild,be=ie.nextSibling;be.nextSibling;var G=Q.nextSibling;return c(Q,()=>P().status==="partial"?"△":"✗",ie),c(Q,()=>di[t.id].label,be),c(G,()=>P().error??"stage produced no data"),K})()})}}),null),c(O,f(S,{get when(){return z().length>0},get children(){return f(sd,{page:j,pageCount:F,onGo:p})}}),null),v(P=>{var K=!t.active(),Q=`Toggle sort direction, currently ${u()==="asc"?"ascending":"descending"}`,ie=R()==="cards",be=R()==="cards",G=R()==="table",$e=R()==="table";return K!==P.e&&(O.hidden=P.e=K),Q!==P.t&&re(we,"aria-label",P.t=Q),ie!==P.a&&Ne.classList.toggle("active",P.a=ie),be!==P.o&&re(Ne,"aria-pressed",P.o=be),G!==P.i&&xt.classList.toggle("active",P.i=G),$e!==P.n&&re(xt,"aria-pressed",P.n=$e),P},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0}),v(()=>te.value=e()),v(()=>ke.checked=s()),v(()=>ye.value=o()??"score"),O})()}Ie(["input","click"]);var yh=g("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),wh=g('<div class=hp-cash-bar><div class=hp-cash-bar-headline><span class=hp-cash-bar-total> <span style=font-size:0.85rem;font-weight:500;color:var(--muted)>cash</span></span><span class=hp-cash-bar-free> <span style=font-size:0.85rem;font-weight:500;color:var(--muted)>free</span></span></div><div class=hp-cash-bar-subline><span class=hp-cash-bar-reserved> reserved · </span><button type=button class="btn hp-pool-sheet-btn">Accounts / Pools'),Ps=g('<button type=button class="btn-ghost hp-cash-edit">'),xs=g("<div class=hp-pool-list>"),$h=g('<div class=hp-pool-sheet><div class=hp-sheet-backdrop></div><div class=hp-sheet-container role=dialog aria-modal=true aria-label="Manage Cash and Pools"><div class=hp-sheet-header><div class=hp-sheet-title>Accounts & Cash Pools</div><button type=button class=hp-sheet-close aria-label="Close sheet">×</button></div><div class=hp-sheet-body><div class=hp-rail-block><div class=hp-rail-label></div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div></div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"style=margin-top:0.5rem><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add</button></div></div></div><div class=hp-sheet-footer><button type=button class="btn btn-primary">Done'),Sh=g('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save</button><button type=button class=btn>cancel'),kh=g('<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add'),Ch=g('<span class=hp-pool-name-row><button type=button class=hp-pool-name></button><button type=button class="btn hp-pool-del">×'),Eh=g('<span class=hp-pool-line><span class=hp-pool-cash></span><button type=button class="btn-ghost hp-pool-act">cash</button><button type=button class="btn-ghost hp-pool-act">rename'),Ih=g("<div class=hp-pool-item>"),Th=g("<span class=hp-pool-row><input><button type=button class=btn>save</button><button type=button class=btn>cancel"),As=g("<select class=hp-pool-pick>"),Ph=g('<button type=button class="btn-ghost holdings-close-btn">sell call…'),xh=g('<div class=hp-slot><div class="hp-pos-card hp-lot-card hp-lot-row"><div class=hp-card-summary><div class="hp-lot-row-top hp-card-top"><span class=hp-card-symbol-line><span class=hp-card-symbol> sh </span></span><b></b></div><div class="hp-lot-row-sub hp-card-main"><span>bought <!> · </span><b class=hp-card-pl></b></div><div class="hp-lot-actions hp-card-actions"><button type=button class="btn-ghost holdings-close-btn">close…</button></div></div><div class=hp-card-drawer><div class=hp-lot-row-meta><i>last price </i><i>covered <!>/</i></div><div class=holdings-preview>Total Value: <!> · Account: '),Rs=g("<span class=hp-pool-tag>"),Qt=g("<option>"),Ah=g("<i class=hp-spot-session>"),Rh=g("<span style=font-size:0.85rem;font-weight:600;margin-left:4px>(<!>)"),Oh=g('<span class="chip high">buy back?'),Nh=g('<span class="chip high">ITM — called away?'),Sr=g("<b>"),Dh=g("<i>"),Lh=g('<div class=hp-slot><div class="hp-pos-card hp-list-row"><div class=hp-card-summary><div class=hp-card-top><span class="hp-list-pos hp-card-symbol-line"><span class=hp-kind></span><b class=hp-card-symbol> <!> ×</b></span><span class=hp-card-pl></span></div><div class=hp-card-main><span class=hp-card-meta>exp <!> · <!>/<!> wd</span><span class=hp-list-status></span></div><div class=hp-card-actions><button type=button class="btn-ghost holdings-close-btn">close…</button></div></div><div class=hp-card-drawer><div class=hp-list-pace style=display:flex;align-items:center;gap:10px><i style=font-size:0.85rem;color:var(--muted)>target </i></div><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),Mh=g('<span class="chip normal">holding'),Uh=g("<b>—"),Fh=g('<div class=hp-action-sheet role=dialog aria-modal=true><div class=hp-sheet-backdrop></div><div class=hp-sheet-container><div class=hp-sheet-header><div class=hp-sheet-title></div><button type=button class="hp-sheet-close hp-sheet-cancel"aria-label=Close>×</button></div><div class=hp-sheet-body>'),Bh=g("<label class=hp-form-full>pool<select>"),ft=g("<div class=hp-form-hint>"),Vh=g("<div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares"),Hh=g('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>contracts <input inputmode=numeric></label><label>strike<input inputmode=decimal></label><label>premium<input inputmode=decimal></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary"></button><button type=button class="btn hp-sheet-cancel">Cancel'),Wh=g("<label class=hp-form-full>pool (deduct <!> from)<select>"),jh=g('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class="btn hp-sheet-cancel">Cancel'),zh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class="btn hp-sheet-cancel">Cancel'),Gh=g("<i class=holdings-preview>"),qh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close lot · <!> sh </div><form class=holdings-add><label>shares<input inputmode=numeric></label><label>sale price<input inputmode=decimal placeholder="e.g. 360.00"></label><button type=submit class="btn btn-primary">Close </button><button type=button class="btn hp-sheet-cancel">Cancel'),Os=g("<label class=holdings-outcome-price><input inputmode=decimal>"),Kh=g("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),Jh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class="btn hp-sheet-cancel">Cancel</button><button type=button class="btn btn-primary">Confirm'),Yh=g("<label class=hp-form-full>pool (deduct strike × 100 × contracts from)<select>"),Xh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class="btn hp-sheet-cancel">Cancel'),Qh=g("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),Zh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class="btn hp-sheet-cancel">Cancel</button><button type=button class="btn btn-primary">Confirm'),ef=g("<div class=hp-toast-container aria-live=polite>"),tf=g('<div class="hp-toast holdings-notice"role=alert><span class=hp-toast-msg></span><button type=button class=hp-toast-dismiss aria-label="Dismiss notice">×'),nf=g("<div class=hp-list>"),fi=g("<div class=empty-panel>"),rf=g('<div class=hp-list><div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),sf=g("<span class=hp-pane-hint> sh held"),af=g('<div class=hp-toolbar-row><button type=button class="btn hp-add-btn">'),of=g('<button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),lf=g("<div class=holdings-notice style=display:none>"),cf=g('<div class="holdings-panel hp-tabs-shell"><div class=hp-mobile-tabs></div><div class=hp-tabs-grid><aside class=hp-tabs-rail><div class=hp-tabs-brand>Wheel ledger</div></aside><main class=hp-tabs-main><div class=hp-pane-head><span class=hp-pane-title>'),uf=g("<button type=button class=hp-mobile-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>"),df=g("<button type=button class=hp-tab-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>");const ge=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),Ct=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),un=(t,e=0)=>`${(t*100).toFixed(e)}%`,Ve=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),Ns=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(Date.UTC(n,r-1,i+e,12)).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function Ds(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function hf(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=yh(),r=n.firstChild,i=r.nextSibling;return v(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&ct(r,"width",s.e=a),o!==s.t&&ct(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function ff(t){const e=()=>t.pool,n=()=>e()?e().cash:t.cash,r=()=>e()?e().reserved:t.reserved,i=()=>e()?e().free:t.free,s=()=>e()?e().name:"All Pools";return(()=>{var a=wh(),o=a.firstChild,l=o.firstChild,u=l.firstChild;u.nextSibling;var d=l.nextSibling,h=d.firstChild;h.nextSibling;var p=o.nextSibling,b=p.firstChild,_=b.firstChild,T=b.nextSibling;return c(l,(()=>{var m=ee(()=>n()==null);return()=>m()?"—":ge(n())})(),u),c(d,(()=>{var m=ee(()=>i()==null);return()=>m()?"—":ge(i())})(),h),c(b,()=>ge(r()),_),c(b,s,null),X(T,"click",t.onOpenPools),v(()=>d.classList.toggle("holdings-neg",(i()??0)<0)),a})()}function gf(t){const[e,n]=V(!1),[r,i]=V(null),[s,a]=V(""),o=()=>t.pools??[],l=()=>t.pool,u=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,p=()=>u()==null,b=m=>{var y;m&&m!==((y=l())==null?void 0:y.id)&&t.onSelectPool(m),i(m??null),n(!0)},_=()=>{const m=o().find(y=>y.id===r());return m?m.cash:t.cash},T=async()=>{var m;!s().trim()||(m=t.busy)!=null&&m.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var m=$h(),y=m.firstChild,A=y.nextSibling,M=A.firstChild,R=M.firstChild,L=R.nextSibling,N=M.nextSibling,k=N.firstChild,x=k.firstChild,D=x.nextSibling,I=D.nextSibling,w=I.firstChild,U=w.nextSibling;U.nextSibling;var C=k.nextSibling,Z=C.firstChild,z=Z.firstChild,F=z.nextSibling,j=N.nextSibling,E=j.firstChild;return X(y,"click",t.onClose),X(L,"click",t.onClose),c(x,(()=>{var W=ee(()=>!!l());return()=>W()?`${l().name} — free to sell puts`:"Total Free Cash"})()),c(D,(()=>{var W=ee(()=>h()==null);return()=>W()?"—":ge(h())})()),c(I,(()=>{var W=ee(()=>u()==null);return()=>W()?"—":ge(u())})(),w),c(I,()=>ge(d()),U),c(k,f(S,{get when(){return!e()},get fallback(){return f(Ls,{get cash(){return _()},get busy(){return t.busy},onSave:async W=>{await t.onSaveCash(W,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var W=Ps();return W.$$click=()=>{var Y;return b(((Y=l())==null?void 0:Y.id)??null)},c(W,()=>p()?"set cash":"edit cash"),W}}),null),c(C,f(S,{get when(){return o().length>0},get children(){var W=xs();return c(W,f(de,{get each(){return o()},children:Y=>f(Ms,{pool:Y,get selected(){var O;return((O=l())==null?void 0:O.id)===Y.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(Y.id)},onEditCash:()=>b(Y.id),onRename:O=>t.onRenamePool(Y.id,O),onDelete:()=>t.onDeletePool(Y.id)})})),W}}),Z),z.$$keydown=W=>W.key==="Enter"&&T(),z.$$input=W=>a(W.target.value),F.$$click=T,X(E,"click",t.onClose),v(W=>{var te;var Y=!t.open,O=(h()??0)<0,q=!s().trim()||((te=t.busy)==null?void 0:te.call(t));return Y!==W.e&&(m.hidden=W.e=Y),O!==W.t&&D.classList.toggle("holdings-neg",W.t=O),q!==W.a&&(F.disabled=W.a=q),W},{e:void 0,t:void 0,a:void 0}),v(()=>z.value=s()),m})()}function Ls(t){const[e,n]=V(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=Sh(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling;return s.$$keydown=l=>{var u;return l.key==="Escape"&&((u=t.onCancel)==null?void 0:u.call(t))},s.$$input=l=>n(l.target.value),a.$$click=()=>t.onSave(Number(e())),o.$$click=()=>{var l;return(l=t.onCancel)==null?void 0:l.call(t)},v(()=>{var l;return a.disabled=!r()||((l=t.busy)==null?void 0:l.call(t))}),v(()=>s.value=e()),i})()}function pf(t){const[e,n]=V(!1),[r,i]=V(null),[s,a]=V(""),o=()=>t.pools??[],l=()=>t.pool,u=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,p=()=>u()==null,b=m=>{var y;m&&m!==((y=l())==null?void 0:y.id)&&t.onSelectPool(m),i(m??null),n(!0)},_=()=>{const m=o().find(y=>y.id===r());return m?m.cash:t.cash},T=async()=>{var m;!s().trim()||(m=t.busy)!=null&&m.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var m=kh(),y=m.firstChild,A=y.nextSibling,M=A.nextSibling,R=M.firstChild,L=R.nextSibling;L.nextSibling;var N=M.nextSibling,k=N.firstChild,x=k.firstChild,D=x.nextSibling;return c(A,(()=>{var I=ee(()=>h()==null);return()=>I()?"—":ge(h())})()),c(M,(()=>{var I=ee(()=>u()==null);return()=>I()?"—":ge(u())})(),R),c(M,()=>ge(d()),L),c(m,f(S,{get when(){return!e()},get fallback(){return f(Ls,{get cash(){return _()},get busy(){return t.busy},onSave:async I=>{await t.onSaveCash(I,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var I=Ps();return I.$$click=()=>{var w;return b(((w=l())==null?void 0:w.id)??null)},c(I,()=>p()?"set cash":"edit cash"),I}}),N),c(N,f(S,{get when(){return o().length>0},get children(){var I=xs();return c(I,f(de,{get each(){return o()},children:w=>f(Ms,{pool:w,get selected(){var U;return((U=l())==null?void 0:U.id)===w.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(w.id)},onEditCash:()=>b(w.id),onRename:U=>t.onRenamePool(w.id,U),onDelete:()=>t.onDeletePool(w.id)})})),I}}),k),x.$$keydown=I=>I.key==="Enter"&&T(),x.$$input=I=>a(I.target.value),D.$$click=T,v(I=>{var C;var w=(h()??0)<0,U=!s().trim()||((C=t.busy)==null?void 0:C.call(t));return w!==I.e&&A.classList.toggle("holdings-neg",I.e=w),U!==I.t&&(D.disabled=I.t=U),I},{e:void 0,t:void 0}),v(()=>x.value=s()),m})()}function Ms(t){const[e,n]=V(!1),[r,i]=V(t.pool.name),s=()=>{i(t.pool.name),n(!0)},a=()=>{var l;const o=r().trim();!o||o===t.pool.name||(l=t.busy)!=null&&l.call(t)||(t.onRename(o),n(!1))};return(()=>{var o=Ih();return c(o,f(S,{get when(){return!e()},get fallback(){return(()=>{var l=Th(),u=l.firstChild,d=u.nextSibling,h=d.nextSibling;return u.$$keydown=p=>{p.key==="Enter"?a():p.key==="Escape"&&n(!1)},u.$$input=p=>i(p.target.value),d.$$click=a,h.$$click=()=>n(!1),v(p=>{var T;var b=`rename ${t.pool.name}`,_=((T=t.busy)==null?void 0:T.call(t))||!r().trim()||r().trim()===t.pool.name;return b!==p.e&&re(u,"aria-label",p.e=b),_!==p.t&&(d.disabled=p.t=_),p},{e:void 0,t:void 0}),v(()=>u.value=r()),l})()},get children(){return[(()=>{var l=Ch(),u=l.firstChild,d=u.nextSibling;return X(u,"click",t.onSelect),c(u,()=>t.pool.name),X(d,"click",t.onDelete),v(h=>{var _;var p=(_=t.busy)==null?void 0:_.call(t),b=`delete ${t.pool.name}`;return p!==h.e&&(d.disabled=h.e=p),b!==h.t&&re(d,"aria-label",h.t=b),h},{e:void 0,t:void 0}),l})(),(()=>{var l=Eh(),u=l.firstChild,d=u.nextSibling,h=d.nextSibling;return c(u,()=>ge(t.pool.cash)),X(d,"click",t.onEditCash),h.$$click=s,l})()]}})),v(()=>o.classList.toggle("active",!!t.selected)),o})()}const mf={PreMarket:"pre",AfterHours:"post",OverNight:"overnight"};function _f(t){const[e,n]=V(!1),r=t.lot,i=()=>r.view;return(()=>{var s=xh(),a=s.firstChild,o=a.firstChild,l=o.firstChild,u=l.firstChild,d=u.firstChild,h=d.firstChild,p=u.nextSibling,b=l.nextSibling,_=b.firstChild,T=_.firstChild,m=T.nextSibling;m.nextSibling;var y=_.nextSibling,A=b.nextSibling,M=A.firstChild,R=o.nextSibling,L=R.firstChild,N=L.firstChild;N.firstChild;var k=N.nextSibling,x=k.firstChild,D=x.nextSibling;D.nextSibling;var I=L.nextSibling,w=I.firstChild,U=w.nextSibling;return U.nextSibling,o.$$click=()=>n(C=>!C),c(d,()=>r.shares,h),c(d,()=>r.symbol,null),c(u,f(S,{get when(){var C;return(((C=t.pools)==null?void 0:C.length)??0)>1},get fallback(){return f(S,{get when(){return t.showPool},get children(){var C=Rs();return c(C,()=>r.pool_name??"Main"),C}})},get children(){var C=As();return C.addEventListener("change",Z=>{var z;return(z=t.onPoolChange)==null?void 0:z.call(t,r,Z.currentTarget.value)}),C.$$click=Z=>Z.stopPropagation(),c(C,f(de,{get each(){return t.pools},children:Z=>(()=>{var z=Qt();return c(z,()=>Z.name),v(()=>z.value=Z.id),z})()})),v(()=>re(C,"aria-label",`cash pool for ${r.symbol} lot`)),v(()=>{var Z,z;return C.value=r.pool_id??((z=(Z=t.pools)==null?void 0:Z[0])==null?void 0:z.id)??""}),C}}),null),c(p,(()=>{var C=ee(()=>i().spot==null);return()=>C()?"—":Ct(i().spot)})(),null),c(p,f(S,{get when(){var C;return mf[(C=r.mark)==null?void 0:C.session]},children:C=>(()=>{var Z=Ah();return c(Z,C),Z})()}),null),c(_,()=>Ct(r.basis_per_share),m),c(_,()=>r.acquired,null),c(y,f(S,{get when(){return i().pl_dollars!=null},fallback:"—",get children(){return`${ge(i().pl_dollars)} (${(i().pl_pct??0)>=0?"+":""}${un(i().pl_pct,1)})`}})),c(A,f(S,{get when(){return i().capacity>0},get children(){var C=Ph();return C.$$click=Z=>{Z.stopPropagation(),t.onSellDialog(r)},C}}),M),M.$$click=C=>{C.stopPropagation(),t.onCloseDialog(r)},c(N,()=>{var C;return Ds((C=r.mark)==null?void 0:C.as_of)||"—"},null),c(k,()=>i().covered,D),c(k,()=>i().capacity,null),c(I,(()=>{var C=ee(()=>i().value==null);return()=>C()?"—":ge(i().value)})(),U),c(I,()=>r.pool_name??"Main",null),c(s,f(S,{get when(){return t.dialogFor("sellCall",r.id)},keyed:!0,children:C=>f(kn,{get title(){return`Sell covered call · ${C.lot.shares} sh ${C.lot.symbol}`},get onDone(){return t.onDialogDone},get children(){return f(wf,{get lot(){return C.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}})}),null),c(s,f(S,{get when(){return t.dialogFor("closeLot",r.id)},keyed:!0,children:C=>f(kn,{get title(){return`Close lot · ${C.lot.shares} sh ${C.lot.symbol}`},get onDone(){return t.onDialogDone},get children(){return f($f,{get lot(){return C.lot},get busy(){return t.busy},get onDone(){return t.onDialogDone},get onClose(){return t.onCloseLot}})}})}),null),v(C=>{var Z=(i().pl_dollars??0)>=0,z=(i().pl_dollars??0)<0,F=!e();return Z!==C.e&&y.classList.toggle("holdings-pos",C.e=Z),z!==C.t&&y.classList.toggle("holdings-neg",C.t=z),F!==C.a&&(R.hidden=C.a=F),C},{e:void 0,t:void 0,a:void 0}),s})()}function bf(t){const[e,n]=V(!1),r=t.x,i=()=>r.v.spot_pct_vs_strike!=null&&r.v.spot_pct_vs_strike>0,s=()=>r.p.kind==="call"?r.v.spot_pct_vs_strike>0:r.v.spot_pct_vs_strike<0;return(()=>{var a=Lh(),o=a.firstChild,l=o.firstChild,u=l.firstChild,d=u.firstChild,h=d.firstChild,p=h.nextSibling,b=p.firstChild,_=b.nextSibling;_.nextSibling;var T=d.nextSibling,m=u.nextSibling,y=m.firstChild,A=y.firstChild,M=A.nextSibling,R=M.nextSibling,L=R.nextSibling,N=L.nextSibling,k=N.nextSibling;k.nextSibling;var x=y.nextSibling,D=m.nextSibling,I=D.firstChild,w=l.nextSibling,U=w.firstChild,C=U.firstChild;C.firstChild;var Z=U.nextSibling,z=Z.firstChild,F=z.firstChild,j=F.nextSibling,E=z.nextSibling,W=E.firstChild,Y=W.nextSibling,O=Y.nextSibling,q=E.nextSibling;q.firstChild;var te=q.nextSibling,ce=te.firstChild,ke=ce.nextSibling;return l.$$click=()=>n(H=>!H),c(h,()=>r.p.kind.toUpperCase()),c(p,()=>r.p.symbol,b),c(p,()=>r.p.strike,_),c(p,()=>r.p.kind==="put"?"P":"C",_),c(p,()=>r.p.contracts,null),c(d,f(S,{get when(){return ee(()=>r.p.kind==="call")()&&t.showPool},get children(){var H=Rs();return c(H,()=>r.p.pool_name),H}}),null),c(d,f(S,{get when(){return ee(()=>r.p.kind==="put")()&&t.showPool},get children(){var H=As();return H.addEventListener("change",ne=>{var ue;return(ue=t.onPoolChange)==null?void 0:ue.call(t,r.p.id,ne.target.value)}),H.$$click=ne=>ne.stopPropagation(),c(H,f(de,{get each(){return t.pools},children:ne=>(()=>{var ue=Qt();return c(ue,()=>ne.name),v(()=>ue.value=ne.id),ue})()})),v(ne=>{var we,xe;var ue=`cash pool for ${r.p.symbol} ${r.p.strike} put`,ye=(xe=(we=t.dialogActions)==null?void 0:we.busy)==null?void 0:xe.call(we);return ue!==ne.e&&re(H,"aria-label",ne.e=ue),ye!==ne.t&&(H.disabled=ne.t=ye),ne},{e:void 0,t:void 0}),v(()=>{var ne,ue;return H.value=((ue=(ne=t.pools)==null?void 0:ne.find(ye=>ye.name===r.p.pool_name))==null?void 0:ue.id)??""}),H}}),null),c(T,(()=>{var H=ee(()=>r.v.pl_pct==null);return()=>H()?"—":`${r.v.pl_pct>=0?"+":""}${un(r.v.pl_pct,1)}`})(),null),c(T,f(S,{get when(){return r.v.pl_dollars!=null},get children(){var H=Rh(),ne=H.firstChild,ue=ne.nextSibling;return ue.nextSibling,c(H,()=>ge(r.v.pl_dollars),ue),H}}),null),c(y,()=>r.p.expiry,M),c(y,()=>r.v.days_elapsed,L),c(y,()=>r.v.days_total,k),c(x,f(S,{get when(){return r.v.pace_met},get fallback(){return Mh()},get children(){return Oh()}}),null),c(x,f(S,{get when(){return ee(()=>r.p.kind==="call")()&&i()},get children(){return Nh()}}),null),I.$$click=H=>{H.stopPropagation(),t.onClose(r)},c(U,f(hf,{get v(){return r.v}}),C),c(C,()=>un(r.v.target_pct),null),c(j,()=>Ct(r.p.premium)),c(Y,(()=>{var H=ee(()=>r.p.mark==null);return()=>H()?"—":r.p.mark.mid.toFixed(2)})()),c(O,(()=>{var H=ee(()=>r.p.mark==null);return()=>H()?"unpriced":Ds(r.p.mark.as_of)})()),c(q,f(S,{get when(){var H;return((H=r.p.mark)==null?void 0:H.underlying_price)!=null},get fallback(){return Uh()},get children(){return[(()=>{var H=Sr();return c(H,()=>r.p.mark.underlying_price.toFixed(2)),H})(),(()=>{var H=Dh();return c(H,(()=>{var ne=ee(()=>r.v.spot_pct_vs_strike==null);return()=>ne()?"":`${r.v.spot_pct_vs_strike>=0?"+":""}${un(r.v.spot_pct_vs_strike,1)} vs strike`})()),v(()=>ve(H,s()&&r.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),H})()]}}),null),c(ke,(()=>{var H=ee(()=>r.v.pl_dollars==null);return()=>H()?"—":Ct(r.v.pl_dollars)})()),c(a,f(S,{get when(){return t.dialogFor(r.p.kind,r.p.id)},keyed:!0,children:H=>f(kn,{get title(){return ee(()=>H.type==="put"&&H.stage==="lot")()?"Record assigned shares":`Close ${H.pos.symbol} ${H.pos.strike}${H.type==="put"?"P":"C"} ×${H.pos.contracts}`},get onDone(){var ne;return(ne=t.dialogActions)==null?void 0:ne.onDone},get children(){return f(Ef,sa({d:H,get pools(){return t.pools}},()=>t.dialogActions))}})}),null),v(H=>{var ne=!!r.v.pace_met,ue=r.p.kind,ye=r.v.pl_pct>=0,we=r.v.pl_pct<0,xe=!e(),Ne=(r.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return ne!==H.e&&o.classList.toggle("hp-row-met",H.e=ne),ue!==H.t&&re(h,"data-kind",H.t=ue),ye!==H.a&&T.classList.toggle("holdings-pos",H.a=ye),we!==H.o&&T.classList.toggle("holdings-neg",H.o=we),xe!==H.i&&(w.hidden=H.i=xe),Ne!==H.n&&ve(ke,H.n=Ne),H},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0}),a})()}function kn(t){return(()=>{var e=Fh(),n=e.firstChild,r=n.nextSibling,i=r.firstChild,s=i.firstChild,a=s.nextSibling,o=i.nextSibling;return X(n,"click",t.onDone),c(s,()=>t.title),X(a,"click",t.onDone),c(o,()=>t.children),v(()=>re(e,"aria-label",t.title||"Position Action")),e})()}function vf(t){var l,u;const e=t.kind,n=()=>t.pools??[],[r,i]=V({symbol:"",strike:"",premium:"",contracts:"1",sold:Ve(),expiry:Ns(Ve(),7),pool_id:((u=(l=t.pools)==null?void 0:l[0])==null?void 0:u.id)??""}),s=d=>h=>i({...r(),[d]:h.target.value}),a=()=>r().symbol.trim()&&[r().strike,r().premium,r().contracts].every(d=>Number(d)>0)&&r().expiry>r().sold&&r().sold<=Ve(),o=()=>r().symbol.trim()?!r().strike||Number(r().strike)<=0?"Please enter a positive strike price.":!r().premium||Number(r().premium)<=0?"Please enter a positive option premium.":!r().contracts||Number(r().contracts)<1?"Contracts must be at least 1.":r().expiry<=r().sold?"Expiration date must be after the sold date.":null:"Please enter a stock symbol (e.g. AAPL, NVDA).";return(()=>{var d=Hh(),h=d.firstChild,p=h.firstChild,b=p.nextSibling,_=h.nextSibling,T=_.firstChild,m=T.nextSibling,y=_.nextSibling,A=y.firstChild,M=A.nextSibling,R=y.nextSibling,L=R.firstChild,N=L.nextSibling,k=R.nextSibling,x=k.firstChild,D=x.nextSibling,I=k.nextSibling,w=I.firstChild,U=w.nextSibling,C=I.nextSibling,Z=C.nextSibling;return d.addEventListener("submit",z=>{var F,j;z.preventDefault(),!(!a()||(F=t.busy)!=null&&F.call(t))&&t.onAdd({...e==="call"?{kind:"call"}:{},...n().length>0?{pool_id:r().pool_id||((j=n()[0])==null?void 0:j.id)}:{},symbol:r().symbol.trim().toUpperCase(),strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:r().sold,expiry:r().expiry})}),X(b,"input",s("symbol")),X(m,"input",s("contracts")),X(M,"input",s("strike")),re(M,"placeholder",e==="call"?"e.g. 355.00":"e.g. 350.00"),X(N,"input",s("premium")),re(N,"placeholder",e==="call"?"e.g. 1.80":"e.g. 1.00"),X(D,"input",s("sold")),X(U,"input",s("expiry")),c(d,f(S,{get when(){return n().length>1},get children(){var z=Bh(),F=z.firstChild,j=F.nextSibling;return X(j,"input",s("pool_id")),c(j,f(de,{get each(){return n()},children:E=>(()=>{var W=Qt();return c(W,()=>E.name),v(()=>W.value=E.id),W})()})),v(()=>j.value=r().pool_id),z}}),C),c(d,f(S,{get when(){return o()},get children(){var z=ft();return c(z,o),z}}),C),c(C,e==="call"?"Sell call":"Sell put"),X(Z,"click",t.onDone),c(d,f(S,{when:e==="call",get children(){return Vh()}}),null),v(()=>{var z;return C.disabled=!a()||((z=t.busy)==null?void 0:z.call(t))}),v(()=>b.value=r().symbol),v(()=>m.value=r().contracts),v(()=>M.value=r().strike),v(()=>N.value=r().premium),v(()=>D.value=r().sold),v(()=>U.value=r().expiry),d})()}function yf(t){var o;const e=()=>t.pools??[],[n,r]=V({symbol:"",shares:"",basis_per_share:"",acquired:Ve(),pool_id:((o=e()[0])==null?void 0:o.id)??""}),i=l=>u=>r({...n(),[l]:u.target.value}),s=()=>n().symbol.trim()&&Number(n().shares)>0&&Number(n().basis_per_share)>0,a=()=>n().symbol.trim()?!n().shares||Number(n().shares)<=0?"Shares must be at least 1.":!n().basis_per_share||Number(n().basis_per_share)<=0?"Please enter a positive cost basis per share.":null:"Please enter a stock symbol (e.g. AAPL, GOOG).";return(()=>{var l=jh(),u=l.firstChild,d=u.firstChild,h=d.nextSibling,p=u.nextSibling,b=p.firstChild,_=b.nextSibling,T=p.nextSibling,m=T.firstChild,y=m.nextSibling,A=T.nextSibling,M=A.firstChild,R=M.nextSibling,L=A.nextSibling,N=L.nextSibling;return l.addEventListener("submit",k=>{var x,D;k.preventDefault(),!(!s()||(x=t.busy)!=null&&x.call(t))&&t.onAdd({kind:"lot",symbol:n().symbol.trim().toUpperCase(),shares:Math.trunc(Number(n().shares)),basis_per_share:Number(n().basis_per_share),acquired:n().acquired,...e().length>0?{pool_id:n().pool_id||((D=e()[0])==null?void 0:D.id)}:{}})}),X(h,"input",i("symbol")),X(_,"input",i("shares")),X(y,"input",i("basis_per_share")),X(R,"input",i("acquired")),c(l,f(S,{get when(){return e().length>1},get children(){var k=Wh(),x=k.firstChild,D=x.nextSibling,I=D.nextSibling,w=I.nextSibling;return c(k,()=>Math.trunc(Number(n().shares)*Number(n().basis_per_share)||0).toLocaleString(),D),X(w,"input",i("pool_id")),c(w,f(de,{get each(){return e()},children:U=>(()=>{var C=Qt();return c(C,()=>U.name),v(()=>C.value=U.id),C})()})),v(()=>w.value=n().pool_id),k}}),L),c(l,f(S,{get when(){return a()},get children(){var k=ft();return c(k,a),k}}),L),X(N,"click",t.onDone),v(()=>{var k;return L.disabled=!s()||((k=t.busy)==null?void 0:k.call(t))}),v(()=>h.value=n().symbol),v(()=>_.value=n().shares),v(()=>y.value=n().basis_per_share),v(()=>R.value=n().acquired),l})()}function wf(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=V({strike:"",premium:"",contracts:String(n()),expiry:Ns(Ve(),7)}),s=l=>u=>i({...r(),[l]:u.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>Ve(),o=()=>!r().strike||Number(r().strike)<=0?"Please enter a positive strike price.":!r().premium||Number(r().premium)<=0?"Please enter a positive premium.":!r().contracts||Number(r().contracts)<1?"Contracts must be at least 1.":Number(r().contracts)>n()?`Contracts cannot exceed lot capacity of ${n()}.`:r().expiry<=Ve()?"Expiration date must be in the future.":null;return(()=>{var l=zh(),u=l.firstChild,d=u.firstChild,h=d.nextSibling;h.nextSibling;var p=u.nextSibling,b=p.firstChild,_=b.firstChild,T=_.nextSibling,m=b.nextSibling,y=m.firstChild,A=y.nextSibling,M=m.nextSibling,R=M.firstChild,L=R.nextSibling,N=M.nextSibling,k=N.firstChild,x=k.nextSibling,D=N.nextSibling,I=D.nextSibling;return c(u,()=>e.shares,h),c(u,()=>e.symbol,null),p.addEventListener("submit",w=>{var U;w.preventDefault(),!(!a()||(U=t.busy)!=null&&U.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:Ve(),expiry:r().expiry})}),X(T,"input",s("strike")),X(A,"input",s("premium")),X(L,"input",s("contracts")),X(x,"input",s("expiry")),c(p,f(S,{get when(){return o()},get children(){var w=ft();return c(w,o),w}}),D),X(I,"click",t.onDone),v(()=>{var w;return D.disabled=!a()||((w=t.busy)==null?void 0:w.call(t))}),v(()=>T.value=r().strike),v(()=>A.value=r().premium),v(()=>L.value=r().contracts),v(()=>x.value=r().expiry),l})()}function $f(t){const e=t.lot,[n,r]=V({shares:String(e.shares),price:""}),i=d=>h=>r({...n(),[d]:h.target.value}),s=()=>Math.trunc(Number(n().shares)),a=()=>Number(n().price),o=()=>Number.isInteger(s())&&s()>=1&&s()<=e.shares&&a()>0,l=()=>!s()||s()<1||s()>e.shares?`Shares to close must be between 1 and ${e.shares}.`:!a()||a()<=0?"Please enter a positive sale price per share.":null,u=()=>o()?s()*a():null;return(()=>{var d=qh(),h=d.firstChild,p=h.firstChild,b=p.nextSibling;b.nextSibling;var _=h.nextSibling,T=_.firstChild,m=T.firstChild,y=m.nextSibling,A=T.nextSibling,M=A.firstChild,R=M.nextSibling,L=A.nextSibling;L.firstChild;var N=L.nextSibling;return c(h,()=>e.shares,b),c(h,()=>e.symbol,null),_.addEventListener("submit",k=>{var x;k.preventDefault(),!(!o()||(x=t.busy)!=null&&x.call(t))&&t.onClose(e,s(),a())}),_.$$keydown=k=>{k.key==="Escape"&&t.onDone()},X(y,"input",i("shares")),X(R,"input",i("price")),c(_,f(S,{get when(){return u()!=null},get children(){var k=Gh();return c(k,()=>`${s()} sh × $${a().toFixed(2)} → $${u().toFixed(2)} → pool ${e.pool_name??"Main"}`),k}}),L),c(_,f(S,{get when(){return l()},get children(){var k=ft();return c(k,l),k}}),L),c(L,(()=>{var k=ee(()=>s()===e.shares);return()=>k()?"lot":`${s()} sh`})(),null),X(N,"click",t.onDone),v(()=>{var k;return L.disabled=!o()||((k=t.busy)==null?void 0:k.call(t))}),v(()=>y.value=n().shares),v(()=>R.value=n().price),d})()}function Sf(t){var l,u;const e=t.d.pos,[n,r]=V("bought-back"),[i,s]=V(((u=(l=e.mark)==null?void 0:l.mid)==null?void 0:u.toFixed(2))??""),a=()=>n()!=="expired"&&(!i()||!Number.isFinite(Number(i()))||Number(i())<0)?"Please enter a valid price per share.":null,o=()=>{if(n()==="expired")return e.premium*100*e.contracts;const d=Number(i());return Number.isFinite(d)?n()==="assigned"?(e.strike-d+e.premium)*100*e.contracts:(e.premium-d)*100*e.contracts:null};return(()=>{var d=Jh(),h=d.firstChild,p=h.firstChild,b=p.nextSibling,_=b.nextSibling,T=_.nextSibling;T.nextSibling;var m=h.nextSibling,y=m.firstChild,A=y.firstChild,M=y.nextSibling,R=M.firstChild,L=M.nextSibling,N=L.firstChild,k=m.nextSibling;k.firstChild;var x=k.nextSibling,D=x.firstChild,I=D.nextSibling;return c(h,()=>e.symbol,b),c(h,()=>e.strike,T),c(h,()=>e.contracts,null),A.addEventListener("change",()=>{var w;r("bought-back"),((w=e.mark)==null?void 0:w.mid)!=null&&s(e.mark.mid.toFixed(2))}),R.addEventListener("change",()=>r("expired")),N.addEventListener("change",()=>{var w;r("assigned"),((w=e.mark)==null?void 0:w.underlying_price)!=null&&s(e.mark.underlying_price.toFixed(2))}),c(d,f(S,{get when(){return n()!=="expired"},get children(){var w=Os(),U=w.firstChild;return c(w,()=>n()==="assigned"?"share price at assignment":"close price/share",U),U.$$input=C=>s(C.target.value),v(()=>U.value=i()),w}}),k),c(k,f(S,{get when(){return o()!==null},fallback:"—",get children(){var w=Sr();return c(w,()=>Ct(o())),v(()=>ve(w,o()>=0?"holdings-pos":"holdings-neg")),w}}),null),c(d,f(S,{get when(){return a()},get children(){var w=ft();return c(w,a),w}}),x),X(D,"click",t.onDone),I.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),c(d,f(S,{get when(){return n()==="assigned"},get children(){return Kh()}}),null),v(()=>{var w;return I.disabled=((w=t.busy)==null?void 0:w.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),v(()=>A.checked=n()==="bought-back"),v(()=>R.checked=n()==="expired"),v(()=>N.checked=n()==="assigned"),d})()}function kf(t){var o,l;const e=()=>t.pools??[],[n,r]=V({...t.d.prefill,pool_id:((o=t.d.pos)==null?void 0:o.pool_id)??((l=e()[0])==null?void 0:l.id)??""}),i=u=>d=>r({...n(),[u]:d.target.value}),s=()=>n().symbol.trim()&&Number(n().shares)>0&&Number(n().basis_per_share)>0,a=()=>n().symbol.trim()?!n().shares||Number(n().shares)<=0?"Shares must be greater than 0.":!n().basis_per_share||Number(n().basis_per_share)<=0?"Cost basis must be greater than 0.":null:"Please enter a stock symbol.";return(()=>{var u=Xh(),d=u.firstChild,h=d.nextSibling,p=h.firstChild,b=p.firstChild,_=b.nextSibling,T=p.nextSibling,m=T.firstChild,y=m.nextSibling,A=T.nextSibling,M=A.firstChild,R=M.nextSibling,L=A.nextSibling,N=L.firstChild,k=N.nextSibling,x=L.nextSibling,D=x.nextSibling;return h.addEventListener("submit",I=>{var w,U;I.preventDefault(),!(!s()||(w=t.busy)!=null&&w.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:n().symbol.trim().toUpperCase(),shares:Math.trunc(Number(n().shares)),basis_per_share:Number(n().basis_per_share),acquired:n().acquired,assigned_from:t.d.pos.id,...e().length>0?{pool_id:n().pool_id||((U=e()[0])==null?void 0:U.id)}:{}})}),X(_,"input",i("symbol")),X(y,"input",i("shares")),X(R,"input",i("basis_per_share")),X(k,"input",i("acquired")),c(h,f(S,{get when(){return e().length>1},get children(){var I=Yh(),w=I.firstChild,U=w.nextSibling;return X(U,"input",i("pool_id")),c(U,f(de,{get each(){return e()},children:C=>(()=>{var Z=Qt();return c(Z,()=>C.name),v(()=>Z.value=C.id),Z})()})),v(()=>U.value=n().pool_id),I}}),x),c(h,f(S,{get when(){return a()},get children(){var I=ft();return c(I,a),I}}),x),X(D,"click",t.onDone),v(()=>{var I;return x.disabled=!s()||((I=t.busy)==null?void 0:I.call(t))}),v(()=>_.value=n().symbol),v(()=>y.value=n().shares),v(()=>R.value=n().basis_per_share),v(()=>k.value=n().acquired),u})()}function Cf(t){var l,u;const e=t.d.pos,[n,r]=V("bought-back"),[i,s]=V(((u=(l=e.mark)==null?void 0:l.mid)==null?void 0:u.toFixed(2))??""),a=()=>n()!=="expired"&&(!i()||!Number.isFinite(Number(i()))||Number(i())<0)?"Please enter a valid price per share.":null,o=()=>{if(n()==="expired")return e.premium*100*e.contracts;const d=Number(i());return Number.isFinite(d)?n()==="called-away"?(e.strike-d+e.premium)*100*e.contracts:(e.premium-d)*100*e.contracts:null};return(()=>{var d=Zh(),h=d.firstChild,p=h.firstChild,b=p.nextSibling,_=b.nextSibling,T=_.nextSibling;T.nextSibling;var m=h.nextSibling,y=m.firstChild,A=y.firstChild,M=y.nextSibling,R=M.firstChild,L=M.nextSibling,N=L.firstChild,k=m.nextSibling;k.firstChild;var x=k.nextSibling,D=x.firstChild,I=D.nextSibling;return c(h,()=>e.symbol,b),c(h,()=>e.strike,T),c(h,()=>e.contracts,null),A.addEventListener("change",()=>{var w;r("bought-back"),((w=e.mark)==null?void 0:w.mid)!=null&&s(e.mark.mid.toFixed(2))}),R.addEventListener("change",()=>r("expired")),N.addEventListener("change",()=>{var w;r("called-away"),((w=e.mark)==null?void 0:w.underlying_price)!=null&&s(e.mark.underlying_price.toFixed(2))}),c(d,f(S,{get when(){return n()!=="expired"},get children(){var w=Os(),U=w.firstChild;return c(w,()=>n()==="called-away"?"share price at call":"close price/share",U),U.$$input=C=>s(C.target.value),v(()=>U.value=i()),w}}),k),c(k,f(S,{get when(){return o()!==null},fallback:"—",get children(){var w=Sr();return c(w,()=>Ct(o())),v(()=>ve(w,o()>=0?"holdings-pos":"holdings-neg")),w}}),null),c(d,f(S,{get when(){return a()},get children(){var w=ft();return c(w,a),w}}),x),X(D,"click",t.onDone),I.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),c(d,f(S,{get when(){return n()==="called-away"},get children(){var w=Qh(),U=w.firstChild,C=U.nextSibling,Z=C.nextSibling,z=Z.nextSibling;return z.nextSibling,c(w,()=>e.symbol,C),c(w,()=>e.contracts*100,z),w}}),null),v(()=>{var w;return I.disabled=((w=t.busy)==null?void 0:w.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),v(()=>A.checked=n()==="bought-back"),v(()=>R.checked=n()==="expired"),v(()=>N.checked=n()==="called-away"),d})()}function Ef(t){return t.d.type==="put"?t.d.stage==="lot"?f(kf,{get d(){return t.d},get pools(){return t.pools},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(Sf,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f(Cf,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function If(t){return(()=>{var e=ef();return c(e,f(S,{get when(){return t.toast()},keyed:!0,children:n=>(()=>{var r=tf(),i=r.firstChild,s=i.nextSibling;return X(r,"click",t.onDismiss),c(i,()=>n.msg),s.$$click=a=>{a.stopPropagation(),t.onDismiss()},v(a=>{var o=n.kind==="ok",l=n.kind==="err";return o!==a.e&&r.classList.toggle("hp-toast-ok",a.e=o),l!==a.t&&r.classList.toggle("hp-toast-err",a.t=l),a},{e:void 0,t:void 0}),r})()})),e})()}function Tf(){const[t,e]=V(null),[n,r]=V(null),[i,s]=V(!1);let a;const o=()=>{clearTimeout(a),r(null)},l=($,B="ok")=>{r({msg:$,kind:B}),clearTimeout(a),B==="ok"&&(a=setTimeout(()=>r(null),8e3))},u=()=>{var $;return(($=n())==null?void 0:$.msg)??""};We(()=>clearTimeout(a));const[d,h]=V(null),[p,b]=V(!1),_=async()=>{try{e(await ba())}catch($){l(`Holdings API error: ${$.message}`,"err")}};wt(_);const T=()=>{var $;return(($=t())==null?void 0:$.positions)??[]},m=()=>{var $;return(($=t())==null?void 0:$.calls)??[]},y=()=>{var $;return(($=t())==null?void 0:$.lots)??[]},A=()=>T().map($=>({p:{...$,kind:"put"},v:$.view})),M=()=>m().map($=>({p:{...$,kind:"call"},v:$.view})),R=$=>$.v.pl_pct==null?-1/0:$.v.pl_pct-$.v.target_pct,L=($,B)=>{var Q,ie;const P=d();return!P||P.type!==$?null:(((Q=P.pos)==null?void 0:Q.id)??((ie=P.lot)==null?void 0:ie.id))===B?P:null},N=async $=>{if(p())return null;b(!0);try{return await $()}catch(B){return l(B.message,"err"),null}finally{b(!1)}},k=async()=>{var P;const $=await N(()=>va());if(!$)return;const B=((P=$.refresh)==null?void 0:P.stale)??[];l(B.length?`Marks refreshed — ${B.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await _()},x=async($,B)=>{await N(()=>Ln($))&&(l(B),h(null),await _())},D=async($,B)=>{await N(()=>Ln(B))&&(l(`Assigned — recorded ${B.shares} sh ${B.symbol} at $${B.basis_per_share.toFixed(2)} basis.`),h(null),await _())},I=async($,B,P)=>{if(B==="assigned"){h({type:"put",pos:$,stage:"lot",prefill:{symbol:$.symbol,shares:$.contracts*100,basis_per_share:+($.strike-$.premium).toFixed(2),acquired:Ve()}});return}await N(()=>Mn($.id))&&(l(B==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),h(null),await _())},w=async($,B,P)=>{if(B==="called-away"){const Q=await N(()=>wa($.id));if(!Q)return;l(Q.reduced?`Called away — ${$.symbol} lot reduced by ${$.contracts*100} sh.`:`Called away — call removed. ${Q.reason??""}`),h(null),await _();return}await N(()=>Mn($.id))&&(l(B==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),h(null),await _())},U=async($,B)=>{const P=await N(()=>Tr(B?{cash:$,pool_id:B}:{cash:$}));return P?(e(K=>({...K??{},cash:P.cash,cash_reserved:P.cash_reserved,cash_free:P.cash_free,cash_pools:P.pool?((K==null?void 0:K.cash_pools)??[]).map(Q=>Q.id===P.pool.id?{...Q,...P.pool}:Q):(K==null?void 0:K.cash_pools)??[]})),l(P.pool?`Cash set to ${ge(P.pool.cash)} — ${ge(P.pool.free)} free in ${P.pool.name}.`:`Cash set to ${ge(P.cash)} — ${ge(P.cash_free)} free.`),!0):!1},C=()=>{var $;return(($=t())==null?void 0:$.cash_pools)??[]},[Z,z]=V(null),F=()=>{const $=C();return $.length?$.find(B=>B.id===Z())??$[0]:null},j=async $=>{var P;const B=await N(()=>Ln({kind:"pool",name:$}));return B?(l(`Pool “${$}” added — set its cash with the strip.`),z(((P=B.pool)==null?void 0:P.id)??null),await _(),!0):!1},E=async($,B)=>{await N(()=>Tr({pool_id:$,name:B}))&&(l(`Pool renamed to “${B}”.`),await _())},W=async $=>{await N(()=>Mn($))&&(l("Pool deleted."),Z()===$&&z(null),await _())},Y=async($,B)=>{var K;const P=await N(()=>Ir($,B));P&&(l(`Put moved to ${((K=P.position)==null?void 0:K.pool_name)??"the pool"}.`),await _())},O=async($,B)=>{var K;const P=await N(()=>Ir($.id,B));P&&(l(`${$.symbol} lot moved to ${((K=P.lot)==null?void 0:K.pool_name)??"the pool"}.`),await _())},q={busy:p,onDone:()=>h(null),onConfirmPut:I,onConfirmCall:w,onAssign:D},[te,ce]=V("lots"),ke=()=>[{id:"lots",label:"Lots",count:y().length,sub:`${y().reduce(($,B)=>$+B.shares,0)} sh held`},{id:"puts",label:"Puts",count:T().length,sub:`${T().filter($=>$.view.pace_met).length} pace-met`},{id:"calls",label:"Calls",count:m().length,sub:`${m().filter($=>$.view.spot_pct_vs_strike>0).length} ITM`}],H=()=>[...A()].sort(($,B)=>R(B)-R($)),ne=()=>[...M()].sort(($,B)=>R(B)-R($)),ue={lots:{label:"+ New lot",type:"addLot"},puts:{label:"+ Sell put",type:"addPut"},calls:{label:"+ Sell call",type:"addCall"}},ye={lots:"No recorded lots — assignments land here.",puts:"No open puts — press “+ Sell put” to record one.",calls:"No open calls — press “+ Sell call” to record one."},we=$=>{if($==="lots")return f(S,{get when(){return y().length>0},get fallback(){return(()=>{var P=fi();return c(P,()=>ye.lots),P})()},get children(){var P=nf();return c(P,f(de,{get each(){return y()},children:K=>f(_f,{lot:K,dialogFor:L,busy:p,get pools(){return C()},get showPool(){return C().length>1},onPoolChange:O,onSellDialog:Q=>h({type:"sellCall",lot:Q}),onCloseDialog:Q=>h({type:"closeLot",lot:Q}),onDialogDone:()=>h(null),onSellCall:(Q,ie)=>x(ie,`Sold ${ie.symbol} ${ie.strike}C ×${ie.contracts} — Refresh marks to price.`),onCloseLot:async(Q,ie,be,G)=>{await N(()=>ya(Q.id,ie,be,G))&&(l(`Closed ${ie} sh ${Q.symbol} — $${(ie*be).toFixed(2)} to the pool.`),h(null),await _())}})})),P}});const B=$==="puts"?H():ne();return f(S,{get when(){return B.length>0},get fallback(){return(()=>{var P=fi();return c(P,()=>ye[$]),P})()},get children(){var P=rf();return P.firstChild,c(P,f(de,{each:B,children:K=>f(bf,{x:K,get showPool(){return C().length>1},get pools(){return C()},onPoolChange:Y,dialogFor:L,dialogActions:q,onClose:Q=>h({type:Q.p.kind,pos:Q.p})})}),null),P}})},xe=$=>f(S,{get when(){var B,P,K;return $==="lots"&&((B=d())==null?void 0:B.type)==="addLot"||$==="puts"&&((P=d())==null?void 0:P.type)==="addPut"||$==="calls"&&((K=d())==null?void 0:K.type)==="addCall"},keyed:!0,get children(){return f(kn,{title:$==="lots"?"Record Share Lot":$==="puts"?"Sell Put Option":"Sell Call Option",onDone:()=>h(null),get children(){return $==="lots"?f(yf,{get pools(){return C()},busy:p,onDone:()=>h(null),onAdd:B=>x(B,`Recorded ${B.shares} sh ${B.symbol}.`)}):f(vf,{kind:$==="puts"?"put":"call",get pools(){return C()},busy:p,onDone:()=>h(null),onAdd:B=>x(B,`Sold ${B.symbol} ${B.strike}${$==="puts"?"P":"C"} ×${B.contracts} — Refresh marks to price.`)})}})}}),Ne=$=>(()=>{var B=af(),P=B.firstChild;return P.$$click=()=>h({type:ue[$].type}),c(P,()=>ue[$].label),c(B,f(S,{when:$==="lots",get children(){var K=sf(),Q=K.firstChild;return c(K,()=>y().reduce((ie,be)=>ie+be.shares,0),Q),K}}),null),B})(),xt=()=>(()=>{var $=of();return $.$$click=k,v(()=>$.disabled=p()),$})(),st=()=>f(S,{get when(){return u()},get children(){var $=lf();return c($,u),$}});return(()=>{var $=cf(),B=$.firstChild,P=B.nextSibling,K=P.firstChild;K.firstChild;var Q=K.nextSibling,ie=Q.firstChild,be=ie.firstChild;return c($,f(ff,{get cash(){var G;return((G=t())==null?void 0:G.cash)??null},get reserved(){var G;return((G=t())==null?void 0:G.cash_reserved)??0},get free(){var G;return((G=t())==null?void 0:G.cash_free)??null},get pools(){return C()},get pool(){return F()},onOpenPools:()=>s(!0)}),B),c(B,f(de,{get each(){return ke()},children:G=>(()=>{var $e=uf(),At=$e.firstChild,Rt=At.nextSibling,Rn=Rt.nextSibling;return $e.$$click=()=>ce(G.id),c(At,()=>G.label.toUpperCase()),c(Rt,()=>G.count),c(Rn,()=>G.sub),v(()=>$e.classList.toggle("active",te()===G.id)),$e})()})),c($,f(S,{get when(){return i()},get children(){return f(gf,{open:!0,onClose:()=>s(!1),get cash(){var G;return((G=t())==null?void 0:G.cash)??null},get reserved(){var G;return((G=t())==null?void 0:G.cash_reserved)??0},get free(){var G;return((G=t())==null?void 0:G.cash_free)??null},get pools(){return C()},get pool(){return F()},busy:p,onSaveCash:U,onSelectPool:z,onAddPool:j,onRenamePool:E,onDeletePool:W})}}),P),c(K,f(pf,{get cash(){var G;return((G=t())==null?void 0:G.cash)??null},get reserved(){var G;return((G=t())==null?void 0:G.cash_reserved)??0},get free(){var G;return((G=t())==null?void 0:G.cash_free)??null},get pools(){return C()},get pool(){return F()},busy:p,onSaveCash:U,onSelectPool:z,onAddPool:j,onRenamePool:E,onDeletePool:W}),null),c(K,f(de,{get each(){return ke()},children:G=>(()=>{var $e=df(),At=$e.firstChild,Rt=At.nextSibling,Rn=Rt.nextSibling;return $e.$$click=()=>ce(G.id),c(At,()=>G.label.toUpperCase()),c(Rt,()=>G.count),c(Rn,()=>G.sub),v(()=>$e.classList.toggle("active",te()===G.id)),$e})()}),null),c(be,()=>ke().find(G=>G.id===te()).label),c(ie,xt,null),c(Q,st,null),c(Q,()=>Ne(te()),null),c(Q,()=>xe(te()),null),c(Q,()=>we(te()),null),c($,f(If,{toast:n,onDismiss:o}),null),$})()}Ie(["click","input","keydown"]);async function Pf(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const u=l.slice(5).trim();if(u)try{e(JSON.parse(u))}catch{}}}return"completed"}catch{return"lost"}}var xf=g("<button type=button class=run-btn>"),Af=g("<span class=run-count>/"),Rf=g("<span class=run-bar><span class=fill>"),Of=g("<li><span class=mark></span><span class=label>"),Nf=g("<div class=toast-cached>Served from cache — last run <!> min old"),Df=g('<div class="toast-cached warn">'),Lf=g("<div class=run-headline>"),Mf=g("<ul class=run-stages>"),Uf=g("<details class=run-errors><summary>details</summary><ul>"),Ff=g("<div class=run-warn>Closing this tab stops the run."),Bf=g("<div class=run-warn>Re-checking every 15 s…"),Vf=g("<div class=run-strip>"),Hf=g("<li> ");const Us=["quotes","metrics","chains_short","chains_medium"],Fs={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},Wf=15e3,Bs=t=>t!==null&&Date.now()>=t;function gi(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function jf(t){const[e,n]=V("idle"),[r,i]=V(R()),[s,a]=V(null),[o,l]=V(0),[u,d]=V(null),[h,p]=V(null),[b,_]=V("");let T=null,m=null;const[y,A]=V(0);let M=null;lt(()=>{const F=t();if(M&&(clearTimeout(M),M=null),(F==null?void 0:F.run_allowed)===!1){const j=Sn(F.next_open_utc);j!==null&&(M=setTimeout(()=>A(E=>E+1),Math.max(0,j-Date.now())))}});function R(){return Object.fromEntries(Us.map(F=>[F,{status:"pending",error:null}]))}function L(){T&&clearInterval(T),T=null,m&&clearInterval(m),m=null}function N(){l(0),T=setInterval(()=>l(F=>F+1),1e3)}function k(F){switch(F.type){case"stage_started":i(j=>({...j,[F.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:F.stage,done:F.done,total:F.total});break;case"stage_finished":i(j=>({...j,[F.stage]:{status:F.ok?"ok":"failed",error:F.error??null}}));break;case"run_finished":d(F);break}}function x(){L();const F=u(),j=((F==null?void 0:F.stages)??[]).some(E=>E.name.startsWith("chains")&&["ok","partial"].includes(E.status));n(F&&(j||F.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function D(F){let j=!1;return await Pf(F,E=>{k(E),E.type==="run_finished"&&(j=!0)}),j?(x(),!0):!1}async function I(F){n("detached"),m=setInterval(async()=>{var j,E,W;try{const Y=await ki(),O=((E=(j=Y==null?void 0:Y.result)==null?void 0:j.run)==null?void 0:E.finished_at_utc)??null;if(O&&O!==F){i(w(Y.result)),L(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((W=Y==null?void 0:Y.run_state)==null?void 0:W.status)!=="running"&&(L(),n("idle"),_("Stream lost and the run was canceled — press Run to retry."))}catch{}},Wf)}function w(F){const j=R();for(const E of(F==null?void 0:F.stages)??[])j[E.name]&&(j[E.name]={status:E.status,error:E.error});return j}async function U(){var W,Y,O;if(["starting","running","detached"].includes(e()))return;_(""),d(null),a(null),i(R()),p(null);const F=((O=(Y=(W=t())==null?void 0:W.result)==null?void 0:Y.run)==null?void 0:O.finished_at_utc)??null;n("running"),N();let j;try{j=await ma()}catch{L(),n("idle"),_("Run failed to start — network or server unreachable.");return}const E=j.headers.get("content-type")??"";if(j.ok&&E.includes("application/json")){const q=await j.json().catch(()=>null);if(L(),n("idle"),(q==null?void 0:q.status)==="cached"){p(q.age_secs),setTimeout(()=>p(null),6e3);return}}if(j.status===403&&E.includes("application/json")){const q=await j.json().catch(()=>null);L(),n("idle"),_(q!=null&&q.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(q.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(j.status===202){const q=await _a();if(q.ok&&(q.headers.get("content-type")??"").includes("text/event-stream")){await D(q)||await I(F);return}await I(F);return}if(E.includes("text/event-stream")){await D(j)||await I(F);return}L(),n("idle"),_(`Unexpected /api/run response (${j.status}, ${E||"no type"}).`)}return We(()=>{L(),M&&clearTimeout(M)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:u,cachedToast:h,notice:b,triggerRun:U,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{y();const F=t();return(F==null?void 0:F.run_allowed)!==!1?!0:Bs(Sn(F==null?void 0:F.next_open_utc))},nextOpenUtc:()=>{var F;return((F=t())==null?void 0:F.next_open_utc)??null}}}function zf(t){const e=()=>!t.run.runAllowed(),n=()=>Ss(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=xf();return i.$$click=()=>t.run.triggerRun(),c(i,r),v(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&re(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function Gf(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=Of(),s=i.firstChild,a=s.nextSibling;return c(s,n),c(a,()=>Fs[t.name]),c(i,f(S,{get when(){return r()!==null},get children(){return[(()=>{var o=Af(),l=o.firstChild;return c(o,()=>t.run.batch().done,l),c(o,()=>t.run.batch().total,null),o})(),(()=>{var o=Rf(),l=o.firstChild;return v(u=>ct(l,"width",`${r()}%`)),o})()]}}),null),v(()=>ve(i,`run-stage ${e()}`)),i})()}function qf(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",ee(()=>gi(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",ee(()=>gi(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(S,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=Vf();return c(i,f(S,{get when(){return e.cachedToast()},get children(){var s=Nf(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,c(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),c(i,f(S,{get when(){return e.notice()},get children(){var s=Df();return c(s,()=>e.notice()),s}}),null),c(i,f(S,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=Lf();return c(s,r),s})(),(()=>{var s=Mf();return c(s,()=>Us.map(a=>f(Gf,{name:a,run:e}))),s})(),f(S,{get when(){return ee(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=Uf(),a=s.firstChild,o=a.nextSibling;return c(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var u=Hf(),d=u.firstChild;return c(u,()=>l.status==="partial"?"△":"✗",d),c(u,()=>Fs[l.name]??l.name,null),c(u,(()=>{var h=ee(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),u})())),s}})]}}),null),c(i,f(S,{get when(){return ee(()=>e.phase()==="running")()&&!n()},get children(){return Ff()}}),null),c(i,f(S,{get when(){return e.phase()==="detached"},get children(){return Bf()}}),null),i}})}Ie(["click"]);var Vs=g("<b>"),Kf=g("<span>Market closed · last run <b></b> ago"),Jf=g("<div class=cache-line><span></span><span class=pill>run: "),Yf=g("<span>Cached · <b></b> left"),Xf=g("<span>Stale · last run <b></b> ago"),Qf=g("<nav class=tabs role=tablist aria-label=timeframes>"),Zf=g("<button type=button role=tab class=tab>"),eg=g("<svg><circle cx=12 cy=12 r=4></svg>",!1,!0,!1),tg=g('<svg><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></svg>',!1,!0,!1),ng=g('<button type=button class="btn-ghost theme-toggle"><svg width=14 height=14 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true>'),rg=g('<svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></svg>',!1,!0,!1),ig=g('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),sg=g("<div class=pop-backdrop>"),ag=g("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),og=g("<div class=error-banner>API error: "),lg=g("<div class=shell><header><div class=user-box></div><div class=theme-slot-head></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),cg=g("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function ug(){const[t,e]=V(Ku()),n=r=>{e(r),Ju(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(Dt)}}function pi(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function dg(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function mi(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function Xn(t){return f(S,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=Vs();return c(e,()=>t.at()),e})()]}})}function hg(t){const[e,n]=V(0);wt(()=>{const b=setInterval(()=>n(_=>_+1),3e4);We(()=>clearInterval(b))});let r=Date.now(),i=0;lt(Mt(()=>t.envelope,b=>{r=Date.now(),i=(b==null?void 0:b.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const b=Math.max(0,(t.envelope.cache_secs??0)-s());return b>=60?`${Math.floor(b/60)}m`:`${b}s`},u=()=>{var b,_;return od((_=(b=t.envelope.result)==null?void 0:b.run)==null?void 0:_.finished_at_utc)},d=()=>{e();const b=t.envelope.next_open_utc,_=Sn(b);if(!(_===null||Bs(_)))return Ss(b)},h=()=>o()&&a()==="stale"?"closed":a(),p=()=>a()==="fresh"||a()==="stale";return(()=>{var b=Jf(),_=b.firstChild,T=_.nextSibling;return T.firstChild,c(b,f(S,{get when(){return ee(()=>!!o())()&&p()},get fallback(){return f(S,{get when(){return a()==="fresh"},get fallback(){return f(S,{get when(){return a()==="stale"},get children(){var m=Xf(),y=m.firstChild,A=y.nextSibling;return A.nextSibling,c(A,()=>mi(s())),c(m,f(Xn,{at:u}),null),m}})},get children(){var m=Yf(),y=m.firstChild,A=y.nextSibling;return A.nextSibling,c(A,l),c(m,f(Xn,{at:u}),null),m}})},get children(){var m=Kf(),y=m.firstChild,A=y.nextSibling;return A.nextSibling,c(A,()=>mi(s())),c(m,f(Xn,{at:u}),null),c(m,f(S,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var M=Vs();return c(M,d),M})()]}}),null),m}}),_),c(_,(()=>{var m=ee(()=>h()==="closed");return()=>m()?"market closed":a()})()),c(T,()=>{var m;return((m=t.envelope.run_state)==null?void 0:m.status)??"idle"},null),v(()=>ve(_,"pill "+h())),b})()}function _i(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=Qf();return c(n,()=>e.map(r=>(()=>{var i=Zf();return i.$$click=()=>t.onTab(r.id),c(i,()=>r.label,null),c(i,(()=>{var s=ee(()=>!r.holdings);return()=>s()&&` (${Lt(dg(t.result,r.id))})`})(),null),v(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&re(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function fg(){const[t,e]=V(null),n=()=>window.matchMedia("(prefers-color-scheme: dark)").matches,r=()=>t()??(n()?"dark":"light"),i=()=>{const a=r()==="dark"?"light":"dark";document.documentElement.dataset.theme=a,e(a)},s=()=>r()==="dark"?"Switch to light theme":"Switch to dark theme";return(()=>{var a=ng(),o=a.firstChild;return a.$$click=i,c(o,f(S,{get when(){return r()==="dark"},get fallback(){return rg()},get children(){return[eg(),tg()]}})),v(l=>{var u=s(),d=s();return u!==l.e&&re(a,"aria-label",l.e=u),d!==l.t&&re(a,"title",l.t=d),l},{e:void 0,t:void 0}),a})()}function gg(){const[t,e]=V(void 0),[n,{refetch:r}]=Js(t,y=>y?ki():void 0);wt(()=>{if(!kt){e(null);return}const y=nc(pt(),e);We(y)});const[i,s]=V(!1);lt(Mt(t,y=>{s(!1),!(!y||!kt)&&ha().then(A=>s(A.status===403)).catch(()=>{})})),wt(()=>{const y=()=>r();window.addEventListener("webapp:refresh-latest",y),We(()=>window.removeEventListener("webapp:refresh-latest",y))});const a=()=>{var y,A;return((y=t())==null?void 0:y.email)||((A=t())==null?void 0:A.uid)||""},[o,l]=V(!1),[u,d]=V(!1),h=ug(),[p,b]=V("short"),_=()=>p()==="holdings",T=zu(),m=jf(()=>n());return f(S,{get when(){return t()},get fallback(){return f(Pu,{})},get children(){return[f(S,{get when(){return!i()},get fallback(){return f(Tu,{get email(){return a()},onSignOut:()=>ai()})},get children(){var y=lg(),A=y.firstChild,M=A.firstChild,R=M.nextSibling,L=R.nextSibling,N=L.nextSibling;return c(M,f(S,{get when(){return t()},get children(){return[(()=>{var k=ig(),x=k.firstChild,D=x.nextSibling;return k.$$click=()=>l(!o()),c(D,a),v(()=>re(k,"aria-expanded",o())),k})(),f(S,{get when(){return o()},get children(){return[(()=>{var k=sg();return k.$$click=()=>l(!1),k})(),(()=>{var k=ag(),x=k.firstChild,D=x.nextSibling,I=D.nextSibling,w=I.nextSibling;return c(D,a),I.$$click=()=>{l(!1),d(!0)},w.$$click=()=>{l(!1),ai()},k})()]}})]}})),c(R,f(fg,{})),c(A,f(S,{get when(){return ee(()=>!n.loading)()&&!n.error},get children(){return f(hg,{get envelope(){return n()}})}}),N),c(N,f(zf,{run:m})),c(y,f(S,{get when(){return n.error},get children(){var k=og();return k.firstChild,c(k,()=>n.error.message,null),k}}),null),c(y,f(qf,{run:m}),null),c(y,f(S,{get when(){return _()},get children(){return[f(_i,{result:()=>{var k;return(k=n())==null?void 0:k.result},tab:p,onTab:b}),f(Tf,{})]}}),null),c(y,f(S,{get when(){return!_()},get children(){return f(S,{get when(){var k;return ee(()=>!n.loading)()&&((k=n())==null?void 0:k.result)},get fallback(){return f(S,{get when(){return!n.loading},get children(){return cg()}})},children:k=>{const x=()=>k();return[f(qu,{scoring:T}),f(_i,{result:x,tab:p,onTab:b}),f(hi,{id:"short",active:()=>p()==="short",get tf(){var D;return(D=x().timeframes)==null?void 0:D.short},get stageError(){return pi(x(),"chains_short")},get stages(){return x().stages},get thresholds(){return x().thresholds},columns:h,scoring:T}),f(hi,{id:"medium",active:()=>p()==="medium",get tf(){var D;return(D=x().timeframes)==null?void 0:D.medium},get stageError(){return pi(x(),"chains_medium")},get stages(){return x().stages},get thresholds(){return x().thresholds},columns:h,scoring:T})]}})}}),null),y}}),f(S,{get when(){return u()},get children(){return f(Du,{onClose:()=>d(!1)})}})]}})}Ie(["click"]);la(()=>f(gg,{}),document.getElementById("root"));
