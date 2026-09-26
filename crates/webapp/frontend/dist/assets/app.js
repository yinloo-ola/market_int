(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const Ts=!1,As=(t,e)=>t===e,Wn=Symbol("solid-proxy"),Ps=typeof Proxy=="function",Rs=Symbol("solid-track"),nn={equals:As};let ci=fi;const Le=1,rn=2,ui={owned:null,cleanups:null,context:null,owner:null},kn={};var Q=null;let En=null,xs=null,X=null,oe=null,xe=null,mn=0;function Kt(t,e){const n=X,r=Q,i=t.length===0,s=e===void 0?r:e,a=i?ui:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>me(()=>xt(a)));Q=a,X=null;try{return Ke(o,!0)}finally{X=n,Q=r}}function M(t,e){e=e?Object.assign({},nn,e):nn;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),hi(n,i));return[di.bind(n),r]}function Os(t,e,n){const r=_n(t,e,!0,Le);wt(r)}function y(t,e,n){const r=_n(t,e,!1,Le);wt(r)}function et(t,e,n){ci=Bs;const r=_n(t,e,!1,Le);r.user=!0,xe?xe.push(r):wt(r)}function ae(t,e,n){n=n?Object.assign({},nn,n):nn;const r=_n(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,wt(r),di.bind(r)}function Ns(t){return t&&typeof t=="object"&&"then"in t}function Ds(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=kn,l=!1,c="initialValue"in s,d=typeof r=="function"&&ae(r);const h=new Set,[p,m]=(s.storage||M)(s.initialValue),[b,T]=M(void 0),[_,$]=M(void 0,{equals:!1}),[E,O]=M(c?"ready":"unresolved");Q&&Oe(()=>{for(const P of h.keys())P.decrement();h.clear(),a=null});function R(P,w,D,V){return a===P&&(a=null,V!==void 0&&(c=!0),(P===o||w===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(V,{value:w})),o=kn,S(w,D)),w}function S(P,w){Ke(()=>{w===void 0&&m(()=>P),O(w!==void 0?"errored":c?"ready":"unresolved"),T(w);for(const D of h.keys())D.decrement();h.clear()},!1)}function k(){const P=Ms,w=p(),D=b();if(D!==void 0&&!a)throw D;return X&&X.user,w}function A(P=!0){if(P!==!1&&l)return;l=!1;const w=d?d():r;if(w==null||w===!1){R(a,me(p));return}let D;const V=o!==kn?o:me(()=>{try{return i(w,{value:p(),refetching:P})}catch(Z){D=Z}});if(D!==void 0){R(a,void 0,Jt(D),w);return}else if(!Ns(V))return R(a,V,void 0,w),V;return a=V,"v"in V?(V.s===1?R(a,V.v,void 0,w):R(a,void 0,Jt(V.v),w),V):(l=!0,queueMicrotask(()=>l=!1),Ke(()=>{O(c?"refreshing":"pending"),$()},!1),V.then(Z=>R(V,Z,void 0,w),Z=>R(V,void 0,Jt(Z),w)))}Object.defineProperties(k,{state:{get:()=>E()},error:{get:()=>b()},loading:{get(){const P=E();return P==="pending"||P==="refreshing"}},latest:{get(){if(!c)return k();const P=b();if(P&&!a)throw P;return p()}}});let N=Q;return d?Os(()=>(N=Q,A(!1))):A(!1),[k,{refetch:P=>Ls(N,()=>A(P)),mutate:m}]}function me(t){if(X===null)return t();const e=X;X=null;try{return t()}finally{X=e}}function At(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=me(()=>e(a,i,s));return i=a,o}}function mt(t){et(()=>me(t))}function Oe(t){return Q===null||(Q.cleanups===null?Q.cleanups=[t]:Q.cleanups.push(t)),t}function Ls(t,e){const n=Q,r=X;Q=t,X=null;try{return Ke(e,!0)}catch(i){Zn(i)}finally{Q=n,X=r}}const[Hf,Vf]=M(!1);let Ms;function di(){if(this.sources&&this.state)if(this.state===Le)wt(this);else{const t=oe;oe=null,Ke(()=>an(this),!1),oe=t}if(X){const t=this.observers;if(!t||t[t.length-1]!==X){const e=t?t.length:0;X.sources?(X.sources.push(this),X.sourceSlots.push(e)):(X.sources=[this],X.sourceSlots=[e]),t?(t.push(X),this.observerSlots.push(X.sources.length-1)):(this.observers=[X],this.observerSlots=[X.sources.length-1])}}return this.value}function hi(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Ke(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=En&&En.running;a&&En.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?oe.push(s):xe.push(s),s.observers&&gi(s)),a||(s.state=Le)}if(oe.length>1e6)throw oe=[],new Error},!1)),e}function wt(t){if(!t.fn)return;xt(t);const e=mn;Us(t,t.value,e)}function Us(t,e,n){let r;const i=Q,s=X;X=Q=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Le,t.owned&&t.owned.forEach(xt),t.owned=null),t.updatedAt=n+1,Zn(a)}finally{X=s,Q=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?hi(t,r):t.value=r,t.updatedAt=n)}function _n(t,e,n,r=Le,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:Q,context:Q?Q.context:null,pure:n};return Q===null||Q!==ui&&(Q.owned?Q.owned.push(s):Q.owned=[s]),s}function sn(t){if(t.state===0)return;if(t.state===rn)return an(t);if(t.suspense&&me(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<mn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Le)wt(t);else if(t.state===rn){const r=oe;oe=null,Ke(()=>an(t,e[0]),!1),oe=r}}function Ke(t,e){if(oe)return t();let n=!1;e||(oe=[]),xe?n=!0:xe=[],mn++;try{const r=t();return Fs(n),r}catch(r){n||(xe=null),oe=null,Zn(r)}}function Fs(t){if(oe&&(fi(oe),oe=null),t)return;const e=xe;xe=null,e.length&&Ke(()=>ci(e),!1)}function fi(t){for(let e=0;e<t.length;e++)sn(t[e])}function Bs(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:sn(r)}for(e=0;e<n;e++)sn(t[e])}function an(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Le?r!==e&&(!r.updatedAt||r.updatedAt<mn)&&sn(r):i===rn&&an(r,e)}}}function gi(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=rn,n.pure?oe.push(n):xe.push(n),n.observers&&gi(n))}}function xt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)xt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)xt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function Jt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function Zn(t,e=Q){throw Jt(t)}const Hs=Symbol("fallback");function pr(t){for(let e=0;e<t.length;e++)t[e]()}function Vs(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Oe(()=>pr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[Rs],me(()=>{let m,b,T,_,$,E,O,R,S;if(c===0)a!==0&&(pr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Hs],i[0]=Kt(k=>(s[0]=k,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=Kt(p);a=c}else{for(T=new Array(c),_=new Array(c),o&&($=new Array(c)),E=0,O=Math.min(a,c);E<O&&r[E]===l[E];E++);for(O=a-1,R=c-1;O>=E&&R>=E&&r[O]===l[R];O--,R--)T[R]=i[O],_[R]=s[O],o&&($[R]=o[O]);for(m=new Map,b=new Array(R+1),h=R;h>=E;h--)S=l[h],d=m.get(S),b[h]=d===void 0?-1:d,m.set(S,h);for(d=E;d<=O;d++)S=r[d],h=m.get(S),h!==void 0&&h!==-1?(T[h]=i[d],_[h]=s[d],o&&($[h]=o[d]),h=b[h],m.set(S,h)):s[d]();for(h=E;h<c;h++)h in T?(i[h]=T[h],s[h]=_[h],o&&(o[h]=$[h],o[h](h))):i[h]=Kt(p);i=i.slice(0,a=c),r=l.slice(0)}return i});function p(m){if(s[h]=m,o){const[b,T]=M(h);return o[h]=T,e(l[h],b)}return e(l[h])}}}function f(t,e){return me(()=>t(e||{}))}function zt(){return!0}const Ws={get(t,e,n){return e===Wn?n:t.get(e)},has(t,e){return e===Wn?!0:t.has(e)},set:zt,deleteProperty:zt,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:zt,deleteProperty:zt}},ownKeys(t){return t.keys()}};function In(t){return(t=typeof t=="function"?t():t)?t:{}}function js(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function zs(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Wn in o,t[a]=typeof o=="function"?(e=!0,ae(o)):o}if(Ps&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=In(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in In(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys(In(t[o])));return[...new Set(a)]}},Ws);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let c=l.length-1;c>=0;c--){const d=l[c];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:js.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const p=n[d];p&&(h.get?p.push(h.get.bind(o)):h.value!==void 0&&p.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const Gs=t=>`Stale read from <${t}>.`;function re(t){const e="fallback"in t&&{fallback:()=>t.fallback};return ae(Vs(()=>t.each,t.children,e||void 0))}function I(t){const e=t.keyed,n=ae(()=>t.when,void 0,void 0),r=e?n:ae(n,void 0,{equals:(i,s)=>!i==!s});return ae(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?me(()=>s(e?i:()=>{if(!me(r))throw Gs("Show");return n()})):s}return t.fallback},void 0,void 0)}const q=t=>ae(()=>t());function qs(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,p=1,m;for(;++h<i&&h<s&&!((m=c.get(e[h]))==null||m!==d+p);)p++;if(p>d-o){const b=e[a];for(;o<d;)t.insertBefore(n[o++],b)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const mr="_$DX_DELEGATE";function Ks(t,e,n,r={}){let i;return Kt(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function g(t,e,n,r){let i;const s=()=>{const o=r?document.createElementNS("http://www.w3.org/1998/Math/MathML","template"):document.createElement("template");return o.innerHTML=t,n?o.content.firstChild.firstChild:r?o.firstChild:o.content.firstChild},a=e?()=>me(()=>document.importNode(i||(i=s()),!0)):()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function ve(t,e=window.document){const n=e[mr]||(e[mr]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,Ys))}}function ne(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function de(t,e){e==null?t.removeAttribute("class"):t.className=e}function j(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function tt(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function Js(t,e,n){return me(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return on(t,e,r,n);y(i=>on(t,e(),i,n),r)}function Ys(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function on(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=ct(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=ct(t,n,r);else{if(s==="function")return y(()=>{let o=e();for(;typeof o=="function";)o=o();n=on(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(jn(o,e,n,i))return y(()=>n=on(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=ct(t,n,r),a)return n}else l?n.length===0?_r(t,o,r):qs(t,n,o):(n&&ct(t),_r(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=ct(t,n,r,e);ct(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function jn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=jn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=jn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function _r(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function ct(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let Yt=null;function Xs(t){Yt=t}async function ue(t,e={}){if(!Yt)return fetch(t,e);const n=new Headers(e.headers??{}),r=await Yt(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await Yt(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function pi(){const t=await ue("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function Qs(){return ue("/api/me")}async function Zs(){const t=await ue("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function ea(t){const e=await ue("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function ta(t){const e=await ue("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function na(){return await ue("/api/run",{method:"POST"})}async function ra(){return ue("/api/progress")}async function ia(){const t=await ue("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function Cn(t){const e=await ue("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function Tn(t){const e=await ue(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function br(t,e){const n=await ue(`/api/holdings/${encodeURIComponent(t)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pool_id:e})}),r=await n.json().catch(()=>null);if(!n.ok)throw new Error((r==null?void 0:r.error)??`PATCH /api/holdings/${t} -> ${n.status}`);return r}async function sa(){const t=await ue("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function yr(t){const e=await ue("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function aa(t,e,n,r){const i=await ue("/api/holdings/close",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lot_id:t,shares:e,price:n,...r?{pool_id:r}:{}})}),s=await i.json().catch(()=>null);if(!i.ok)throw new Error((s==null?void 0:s.error)??`POST /api/holdings/close -> ${i.status}`);return s}async function oa(t){const e=await ue("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const la=()=>{};var vr={};/**
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
 */const mi=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},ca=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},_i={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let p=(o&15)<<2|c>>6,m=c&63;l||(m=64,a||(p=64)),r.push(n[d],n[h],n[p],n[m])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(mi(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):ca(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||c==null||h==null)throw new ua;const p=s<<2|o>>4;if(r.push(p),c!==64){const m=o<<4&240|c>>2;if(r.push(m),h!==64){const b=c<<6&192|h;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class ua extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const da=function(t){const e=mi(t);return _i.encodeByteArray(e,!0)},bi=function(t){return da(t).replace(/\./g,"")},yi=function(t){try{return _i.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function ha(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const fa=()=>ha().__FIREBASE_DEFAULTS__,ga=()=>{if(typeof process>"u"||typeof vr>"u")return;const t=vr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},pa=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&yi(t[1]);return e&&JSON.parse(e)},er=()=>{try{return la()||fa()||ga()||pa()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},ma=t=>{var e,n;return(n=(e=er())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},vi=()=>{var t;return(t=er())==null?void 0:t.config},wi=t=>{var e;return(e=er())==null?void 0:e[`_${t}`]};/**
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
 */class $i{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function ce(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function _a(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ce())}function ba(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ya(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function va(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function wa(){const t=ce();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function $a(){try{return typeof indexedDB=="object"}catch{return!1}}function Sa(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const ka="FirebaseError";class Je extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=ka,Object.setPrototypeOf(this,Je.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Mt.prototype.create)}}class Mt{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Ea(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new Je(i,o,r)}}function Ea(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function Ia(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function _t(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(wr(s)&&wr(a)){if(!_t(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function wr(t){return t!==null&&typeof t=="object"}/**
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
 */function Ut(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Et(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function It(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Ca(t,e){const n=new Ta(t,e);return n.subscribe.bind(n)}class Ta{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Aa(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=An),i.error===void 0&&(i.error=An),i.complete===void 0&&(i.complete=An);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Aa(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function An(){}/**
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
 */function tr(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Pa(t){return(await fetch(t,{credentials:"include"})).ok}class bt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Qe="[DEFAULT]";/**
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
 */class Ra{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new $i;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Oa(e))try{this.getOrInitializeService({instanceIdentifier:Qe})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Qe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Qe){return this.instances.has(e)}getOptions(e=Qe){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:xa(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Qe){return this.component?this.component.multipleInstances?e:Qe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function xa(t){return t===Qe?void 0:t}function Oa(t){return t.instantiationMode==="EAGER"}/**
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
 */class Na{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Ra(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var J;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(J||(J={}));const Da={debug:J.DEBUG,verbose:J.VERBOSE,info:J.INFO,warn:J.WARN,error:J.ERROR,silent:J.SILENT},La=J.INFO,Ma={[J.DEBUG]:"log",[J.VERBOSE]:"log",[J.INFO]:"info",[J.WARN]:"warn",[J.ERROR]:"error"},Ua=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Ma[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Si{constructor(e){this.name=e,this._logLevel=La,this._logHandler=Ua,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in J))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Da[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,J.DEBUG,...e),this._logHandler(this,J.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,J.VERBOSE,...e),this._logHandler(this,J.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,J.INFO,...e),this._logHandler(this,J.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,J.WARN,...e),this._logHandler(this,J.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,J.ERROR,...e),this._logHandler(this,J.ERROR,...e)}}const Fa=(t,e)=>e.some(n=>t instanceof n);let $r,Sr;function Ba(){return $r||($r=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ha(){return Sr||(Sr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ki=new WeakMap,zn=new WeakMap,Ei=new WeakMap,Pn=new WeakMap,nr=new WeakMap;function Va(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Ge(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&ki.set(n,t)}).catch(()=>{}),nr.set(e,t),e}function Wa(t){if(zn.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});zn.set(t,e)}let Gn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return zn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Ei.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Ge(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function ja(t){Gn=t(Gn)}function za(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Rn(this),e,...n);return Ei.set(r,e.sort?e.sort():[e]),Ge(r)}:Ha().includes(t)?function(...e){return t.apply(Rn(this),e),Ge(ki.get(this))}:function(...e){return Ge(t.apply(Rn(this),e))}}function Ga(t){return typeof t=="function"?za(t):(t instanceof IDBTransaction&&Wa(t),Fa(t,Ba())?new Proxy(t,Gn):t)}function Ge(t){if(t instanceof IDBRequest)return Va(t);if(Pn.has(t))return Pn.get(t);const e=Ga(t);return e!==t&&(Pn.set(t,e),nr.set(e,t)),e}const Rn=t=>nr.get(t);function qa(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Ge(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Ge(a.result),l.oldVersion,l.newVersion,Ge(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const Ka=["get","getKey","getAll","getAllKeys","count"],Ja=["put","add","delete","clear"],xn=new Map;function kr(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(xn.get(e))return xn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Ja.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Ka.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(o.shift())),(await Promise.all([c[n](...o),i&&l.done]))[0]};return xn.set(e,s),s}ja(t=>({...t,get:(e,n,r)=>kr(e,n)||t.get(e,n,r),has:(e,n)=>!!kr(e,n)||t.has(e,n)}));/**
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
 */class Ya{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Xa(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Xa(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const qn="@firebase/app",Er="0.16.1";/**
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
 */const Ne=new Si("@firebase/app"),Qa="@firebase/app-compat",Za="@firebase/analytics-compat",eo="@firebase/analytics",to="@firebase/app-check-compat",no="@firebase/app-check",ro="@firebase/auth",io="@firebase/auth-compat",so="@firebase/database",ao="@firebase/data-connect",oo="@firebase/database-compat",lo="@firebase/functions",co="@firebase/functions-compat",uo="@firebase/installations",ho="@firebase/installations-compat",fo="@firebase/messaging",go="@firebase/messaging-compat",po="@firebase/performance",mo="@firebase/performance-compat",_o="@firebase/remote-config",bo="@firebase/remote-config-compat",yo="@firebase/storage",vo="@firebase/storage-compat",wo="@firebase/firestore",$o="@firebase/ai",So="@firebase/firestore-compat",ko="firebase",Eo="12.18.0";/**
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
 */const Kn="[DEFAULT]",Io={[qn]:"fire-core",[Qa]:"fire-core-compat",[eo]:"fire-analytics",[Za]:"fire-analytics-compat",[no]:"fire-app-check",[to]:"fire-app-check-compat",[ro]:"fire-auth",[io]:"fire-auth-compat",[so]:"fire-rtdb",[ao]:"fire-data-connect",[oo]:"fire-rtdb-compat",[lo]:"fire-fn",[co]:"fire-fn-compat",[uo]:"fire-iid",[ho]:"fire-iid-compat",[fo]:"fire-fcm",[go]:"fire-fcm-compat",[po]:"fire-perf",[mo]:"fire-perf-compat",[_o]:"fire-rc",[bo]:"fire-rc-compat",[yo]:"fire-gcs",[vo]:"fire-gcs-compat",[wo]:"fire-fst",[So]:"fire-fst-compat",[$o]:"fire-vertex","fire-js":"fire-js",[ko]:"fire-js-all"};/**
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
 */const ln=new Map,Co=new Map,Jn=new Map;function Ir(t,e){try{t.container.addComponent(e)}catch(n){Ne.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Ot(t){const e=t.name;if(Jn.has(e))return Ne.debug(`There were multiple attempts to register component ${e}.`),!1;Jn.set(e,t);for(const n of ln.values())Ir(n,t);for(const n of Co.values())Ir(n,t);return!0}function Ii(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function ge(t){return t==null?!1:t.settings!==void 0}/**
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
 */const To={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ce=new Mt("app","Firebase",To);/**
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
 */class Ao{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new bt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ce.create("app-deleted",{appName:this._name})}}/**
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
 */const Ft=Eo;function Ci(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Kn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw Ce.create("bad-app-name",{appName:String(i)});if(n||(n=vi()),!n)throw Ce.create("no-options");const s=ln.get(i);if(s)if(_t(n,s.options)){if(_t(r,s.config))return s;throw Ce.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw Ce.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new Na(i);for(const l of Jn.values())a.addComponent(l);const o=new Ao(n,r,a);return ln.set(i,o),o}function Po(t=Kn){const e=ln.get(t);if(!e&&t===Kn&&vi())return Ci();if(!e)throw Ce.create("no-app",{appName:t});return e}function ht(t,e,n){let r=Io[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ne.warn(a.join(" "));return}Ot(new bt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Ro="firebase-heartbeat-database",xo=1,Nt="firebase-heartbeat-store";let On=null;function Ti(){return On||(On=qa(Ro,xo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Nt)}catch(n){console.warn(n)}}}}).catch(t=>{throw Ce.create("idb-open",{originalErrorMessage:t.message})})),On}async function Oo(t){try{const n=(await Ti()).transaction(Nt),r=await n.objectStore(Nt).get(Ai(t));return await n.done,r}catch(e){if(e instanceof Je)Ne.warn(e.message);else{const n=Ce.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ne.warn(n.message)}}}async function Cr(t,e){try{const r=(await Ti()).transaction(Nt,"readwrite");await r.objectStore(Nt).put(e,Ai(t)),await r.done}catch(n){if(n instanceof Je)Ne.warn(n.message);else{const r=Ce.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Ne.warn(r.message)}}}function Ai(t){return`${t.name}!${t.options.appId}`}/**
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
 */const No=1024,Do=30;class Lo{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Uo(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Tr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Do){const a=Fo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Ne.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Tr(),{heartbeatsToSend:r,unsentEntries:i}=Mo(this._heartbeatsCache.heartbeats),s=bi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Ne.warn(n),""}}}function Tr(){return new Date().toISOString().substring(0,10)}function Mo(t,e=No){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Ar(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Ar(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Uo{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return $a()?Sa().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Oo(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Cr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Cr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Ar(t){return bi(JSON.stringify({version:2,heartbeats:t})).length}function Fo(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function Bo(t){Ot(new bt("platform-logger",e=>new Ya(e),"PRIVATE")),Ot(new bt("heartbeat",e=>new Lo(e),"PRIVATE")),ht(qn,Er,t),ht(qn,Er,"esm2020"),ht("fire-js","")}/**
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
 */Bo("");var Ho="firebase",Vo="12.18.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ht(Ho,Vo,"app");function Pi(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Wo=Pi,Ri=new Mt("auth","Firebase",Pi());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn=new Si("@firebase/auth");function xi(t,...e){cn.logLevel<=J.WARN&&cn.warn(`Auth (${Ft}): ${t}`,...e)}function Xt(t,...e){cn.logLevel<=J.ERROR&&cn.error(`Auth (${Ft}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _e(t,...e){throw ir(t,...e)}function ye(t,...e){return ir(t,...e)}function rr(t,e,n){const r={...Wo(),[e]:n};return new Mt("auth","Firebase",r).create(e,{appName:t.name})}function $e(t){return rr(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Oi(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&_e(t,"argument-error"),rr(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function ir(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return Ri.create(t,...e)}function H(t,e,...n){if(!t)throw ir(e,...n)}function Te(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Xt(e),new Error(e)}function De(t,e){t||Te(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yn(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function jo(){return Pr()==="http:"||Pr()==="https:"}function Pr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zo(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(jo()||ya()||"connection"in navigator)?navigator.onLine:!0}function Go(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(e,n){this.shortDelay=e,this.longDelay=n,De(n>e,"Short delay should be less than long delay!"),this.isMobile=_a()||va()}get(){return zo()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sr(t,e){De(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ni{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Te("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Te("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Te("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qo={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ko=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Jo=new Bt(3e4,6e4);function Ye(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function Xe(t,e,n,r,i={}){return Di(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Ut({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:l,...s};return ba()||(c.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&tr(t.emulatorConfig.host)&&(c.credentials="include"),Ni.fetch()(await Li(t,t.config.apiHost,n,o),c)})}async function Di(t,e,n){t._canInitEmulator=!1;const r={...qo,...e};try{const i=new Xo(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Gt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,c]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Gt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Gt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Gt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw rr(t,d,c);_e(t,d)}}catch(i){if(i instanceof Je)throw i;_e(t,"network-request-failed",{message:String(i)})}}async function Ht(t,e,n,r,i={}){const s=await Xe(t,e,n,r,i);return"mfaPendingCredential"in s&&_e(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function Li(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?sr(t.config,i):`${t.config.apiScheme}://${i}`;return Ko.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function Yo(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Xo{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(ye(this.auth,"network-request-failed")),Jo.get())})}}function Gt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=ye(t,e,r);return i.customData._tokenResponse=n,i}function Rr(t){return t!==void 0&&t.enterprise!==void 0}class Qo{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Yo(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Zo(t,e){return Xe(t,"GET","/v2/recaptchaConfig",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function el(t,e){return Xe(t,"POST","/v1/accounts:delete",e)}async function un(t,e){return Xe(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pt(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function tl(t,e=!1){const n=Me(t),r=await n.getIdToken(e),i=ar(r);H(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Pt(Nn(i.auth_time)),issuedAtTime:Pt(Nn(i.iat)),expirationTime:Pt(Nn(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Nn(t){return Number(t)*1e3}function ar(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Xt("JWT malformed, contained fewer than 3 sections"),null;try{const i=yi(n);return i?JSON.parse(i):(Xt("Failed to decode base64 JWT payload"),null)}catch(i){return Xt("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function xr(t){const e=ar(t);return H(e,"internal-error"),H(typeof e.exp<"u","internal-error"),H(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dt(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Je&&nl(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function nl({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Pt(this.lastLoginAt),this.creationTime=Pt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function dn(t){var h;const e=t.auth,n=await t.getIdToken(),r=await Dt(t,un(e,{idToken:n}));H(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?Mi(i.providerUserInfo):[],a=sl(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),c=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Xn(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function il(t){const e=Me(t);await dn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function sl(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Mi(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function al(t,e){const n=await Di(t,{},async()=>{const r=Ut({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await Li(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&tr(t.emulatorConfig.host)&&(l.credentials="include"),Ni.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function ol(t,e){return Xe(t,"POST","/v2/accounts:revokeToken",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){H(e.idToken,"internal-error"),H(typeof e.idToken<"u","internal-error"),H(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):xr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){H(e.length!==0,"internal-error");const n=xr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(H(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await al(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new ft;return r&&(H(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(H(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(H(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ft,this.toJSON())}_performRefresh(){return Te("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function He(t,e){H(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class be{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new rl(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Xn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Dt(this,this.stsTokenManager.getToken(this.auth,e));return H(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return tl(this,e)}reload(){return il(this)}_assign(e){this!==e&&(H(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new be({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){H(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await dn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ge(this.auth.app))return Promise.reject($e(this.auth));const e=await this.getIdToken();return await Dt(this,el(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,c=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:p,isAnonymous:m,providerData:b,stsTokenManager:T}=n;H(h&&T,e,"internal-error");const _=ft.fromJSON(this.name,T);H(typeof h=="string",e,"internal-error"),He(r,e.name),He(i,e.name),H(typeof p=="boolean",e,"internal-error"),H(typeof m=="boolean",e,"internal-error"),He(s,e.name),He(a,e.name),He(o,e.name),He(l,e.name),He(c,e.name),He(d,e.name);const $=new be({uid:h,auth:e,email:i,emailVerified:p,displayName:r,isAnonymous:m,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:_,createdAt:c,lastLoginAt:d});return b&&Array.isArray(b)&&($.providerData=b.map(E=>({...E}))),l&&($._redirectEventId=l),$}static async _fromIdTokenResponse(e,n,r=!1){const i=new ft;i.updateFromServerResponse(n);const s=new be({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await dn(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];H(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Mi(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new ft;o.updateFromIdToken(r);const l=new be({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Xn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Or=new Map;function Ae(t){De(t instanceof Function,"Expected a class definition");let e=Or.get(t);return e?(De(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Or.set(t,e),e)}/**
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
 */class Ui{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Ui.type="NONE";const Nr=Ui;/**
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
 */function Qt(t,e,n){return`firebase:${t}:${e}:${n}`}class gt{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Qt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Qt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await un(this.auth,{idToken:e}).catch(()=>{});return n?be._fromGetAccountInfoResponse(this.auth,n,e):null}return be._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new gt(Ae(Nr),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||Ae(Nr);const a=Qt(r,e.config.apiKey,e.name);let o=null;for(const c of n)try{const d=await c._get(a);if(d){let h;if(typeof d=="string"){const p=await un(e,{idToken:d}).catch(()=>{});if(!p)break;h=await be._fromGetAccountInfoResponse(e,p,d)}else h=be._fromJSON(e,d);c!==s&&(o=h),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new gt(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(a)}catch{}})),new gt(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dr(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Vi(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Fi(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(ji(e))return"Blackberry";if(zi(e))return"Webos";if(Bi(e))return"Safari";if((e.includes("chrome/")||Hi(e))&&!e.includes("edge/"))return"Chrome";if(Wi(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Fi(t=ce()){return/firefox\//i.test(t)}function Bi(t=ce()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Hi(t=ce()){return/crios\//i.test(t)}function Vi(t=ce()){return/iemobile/i.test(t)}function Wi(t=ce()){return/android/i.test(t)}function ji(t=ce()){return/blackberry/i.test(t)}function zi(t=ce()){return/webos/i.test(t)}function or(t=ce()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function ll(t=ce()){var e;return or(t)&&!!((e=window.navigator)!=null&&e.standalone)}function cl(){return wa()&&document.documentMode===10}function Gi(t=ce()){return or(t)||Wi(t)||zi(t)||ji(t)||/windows phone/i.test(t)||Vi(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qi(t,e=[]){let n;switch(t){case"Browser":n=Dr(ce());break;case"Worker":n=`${Dr(ce())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ft}/${r}`}/**
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
 */class ul{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function dl(t,e={}){return Xe(t,"GET","/v2/passwordPolicy",Ye(t,e))}/**
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
 */const hl=6;class fl{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??hl,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gl{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Lr(this),this.idTokenSubscription=new Lr(this),this.beforeStateQueue=new ul(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Ri,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Ae(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await gt.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await un(this,{idToken:e}),r=await be._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(ge(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return H(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await dn(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Go()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ge(this.app))return Promise.reject($e(this));const n=e?Me(e):null;return n&&H(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&H(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ge(this.app)?Promise.reject($e(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ge(this.app)?Promise.reject($e(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ae(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await dl(this),n=new fl(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Mt("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await ol(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Ae(e)||this._popupRedirectResolver;H(n,this,"argument-error"),this.redirectPersistenceManager=await gt.create(this,[Ae(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(H(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return H(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=qi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(ge(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&xi(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Ue(t){return Me(t)}class Lr{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ca(n=>this.observer=n)}get next(){return H(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let bn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function pl(t){bn=t}function Ki(t){return bn.loadJS(t)}function ml(){return bn.recaptchaEnterpriseScript}function _l(){return bn.gapiScript}function bl(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class yl{constructor(){this.enterprise=new vl}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class vl{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
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
 */const wl="recaptcha-enterprise",Ji="NO_RECAPTCHA",Mr="onFirebaseAuthREInstanceReady";class Ve{constructor(e){this.type=wl,this.auth=Ue(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{Zo(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const c=new Qo(l);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,a(c.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;Rr(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(c=>{a(c)}).catch(()=>{a(Ji)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new yl().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&Rr(window.grecaptcha)&&Ve.scriptInjectionDeferred)await Ve.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=ml();l.length!==0&&(l+=o+`&onload=${Mr}`),Ve.scriptInjectionDeferred=new $i,window[Mr]=()=>{var c;(c=Ve.scriptInjectionDeferred)==null||c.resolve()},Ki(l).then(()=>{var c;return(c=Ve.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{i(o,s,a)}).catch(c=>{a(c)})}}).catch(o=>{a(o)})})}}Ve.scriptInjectionDeferred=null;async function Ur(t,e,n,r=!1,i=!1){const s=new Ve(t);let a;if(i)a=Ji;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,c=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Qn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Ur(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Ur(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $l(t,e){const n=Ii(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(_t(s,e??{}))return i;_e(i,"already-initialized")}return n.initialize({options:e})}function Sl(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Ae);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function kl(t,e,n){const r=Ue(t);H(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Yi(e),{host:a,port:o}=El(e),l=o===null?"":`:${o}`,c={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){H(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),H(_t(c,r.config.emulator)&&_t(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,tr(a)?Pa(`${s}//${a}${l}`):Il()}function Yi(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function El(t){const e=Yi(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Fr(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Fr(a)}}}function Fr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Il(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Te("not implemented")}_getIdTokenResponse(e){return Te("not implemented")}_linkToIdToken(e,n){return Te("not implemented")}_getReauthenticationResolver(e){return Te("not implemented")}}async function Cl(t,e){return Xe(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tl(t,e){return Ht(t,"POST","/v1/accounts:signInWithPassword",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Al(t,e){return Ht(t,"POST","/v1/accounts:signInWithEmailLink",Ye(t,e))}async function Pl(t,e){return Ht(t,"POST","/v1/accounts:signInWithEmailLink",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt extends lr{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new Lt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new Lt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qn(e,n,"signInWithPassword",Tl);case"emailLink":return Al(e,{email:this._email,oobCode:this._password});default:_e(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qn(e,r,"signUpPassword",Cl);case"emailLink":return Pl(e,{idToken:n,email:this._email,oobCode:this._password});default:_e(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pt(t,e){return Ht(t,"POST","/v1/accounts:signInWithIdp",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rl="http://localhost";class rt extends lr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new rt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):_e("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new rt(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return pt(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,pt(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,pt(e,n)}buildRequest(){const e={requestUri:Rl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Ut(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xl(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Ol(t){const e=Et(It(t)).link,n=e?Et(It(e)).deep_link_id:null,r=Et(It(t)).deep_link_id;return(r?Et(It(r)).link:null)||r||n||e||t}class cr{constructor(e){const n=Et(It(e)),r=n.apiKey??null,i=n.oobCode??null,s=xl(n.mode??null);H(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=Ol(e);try{return new cr(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(){this.providerId=$t.PROVIDER_ID}static credential(e,n){return Lt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=cr.parseLink(n);return H(r,"argument-error"),Lt._fromEmailAndCode(e,r.code,r.tenantId)}}$t.PROVIDER_ID="password";$t.EMAIL_PASSWORD_SIGN_IN_METHOD="password";$t.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Vt extends yn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We extends Vt{constructor(){super("facebook.com")}static credential(e){return rt._fromParams({providerId:We.PROVIDER_ID,signInMethod:We.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return We.credentialFromTaggedObject(e)}static credentialFromError(e){return We.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return We.credential(e.oauthAccessToken)}catch{return null}}}We.FACEBOOK_SIGN_IN_METHOD="facebook.com";We.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie extends Vt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return rt._fromParams({providerId:Ie.PROVIDER_ID,signInMethod:Ie.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Ie.credentialFromTaggedObject(e)}static credentialFromError(e){return Ie.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Ie.credential(n,r)}catch{return null}}}Ie.GOOGLE_SIGN_IN_METHOD="google.com";Ie.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je extends Vt{constructor(){super("github.com")}static credential(e){return rt._fromParams({providerId:je.PROVIDER_ID,signInMethod:je.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return je.credentialFromTaggedObject(e)}static credentialFromError(e){return je.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return je.credential(e.oauthAccessToken)}catch{return null}}}je.GITHUB_SIGN_IN_METHOD="github.com";je.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze extends Vt{constructor(){super("twitter.com")}static credential(e,n){return rt._fromParams({providerId:ze.PROVIDER_ID,signInMethod:ze.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ze.credentialFromTaggedObject(e)}static credentialFromError(e){return ze.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return ze.credential(n,r)}catch{return null}}}ze.TWITTER_SIGN_IN_METHOD="twitter.com";ze.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nl(t,e){return Ht(t,"POST","/v1/accounts:signUp",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await be._fromIdTokenResponse(e,r,i),a=Br(r);return new it({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Br(r);return new it({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Br(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hn extends Je{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,hn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new hn(e,n,r,i)}}function Xi(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?hn._fromErrorAndOperation(t,s,e,r):s})}async function Dl(t,e,n=!1){const r=await Dt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return it._forOperation(t,"link",r)}/**
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
 */async function Ll(t,e,n=!1){const{auth:r}=t;if(ge(r.app))return Promise.reject($e(r));const i="reauthenticate";try{const s=await Dt(t,Xi(r,i,e,t),n);H(s.idToken,r,"internal-error");const a=ar(s.idToken);H(a,r,"internal-error");const{sub:o}=a;return H(t.uid===o,r,"user-mismatch"),it._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&_e(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qi(t,e,n=!1){if(ge(t.app))return Promise.reject($e(t));const r="signIn",i=await Xi(t,r,e),s=await it._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Ml(t,e){return Qi(Ue(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zi(t){const e=Ue(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Ul(t,e,n){if(ge(t.app))return Promise.reject($e(t));const r=Ue(t),a=await Qn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Nl).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Zi(t),l}),o=await it._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function Fl(t,e,n){return ge(t.app)?Promise.reject($e(t)):Ml(Me(t),$t.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Zi(t),r})}function Bl(t,e,n,r){return Me(t).onIdTokenChanged(e,n,r)}function Hl(t,e,n){return Me(t).beforeAuthStateChanged(e,n)}function Vl(t,e,n,r){return Me(t).onAuthStateChanged(e,n,r)}function Wl(t){return Me(t).signOut()}const fn="__sak";/**
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
 */class es{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(fn,"1"),this.storage.removeItem(fn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jl=1e3,zl=10;class ts extends es{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Gi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);cl()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,zl):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},jl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}ts.type="LOCAL";const Gl=ts;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns extends es{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}ns.type="SESSION";const rs=ns;/**
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
 */function ql(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class vn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new vn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async c=>c(n.origin,s)),l=await ql(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}vn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ur(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class Kl{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const c=ur("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const p=h;if(p.data.eventId===c)switch(p.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(p.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Se(){return window}function Jl(t){Se().location.href=t}/**
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
 */function is(){return typeof Se().WorkerGlobalScope<"u"&&typeof Se().importScripts=="function"}async function Yl(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Xl(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function Ql(){return is()?self:null}/**
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
 */const ss="firebaseLocalStorageDb",Zl=1,gn="firebaseLocalStorage",as="fbase_key";class Wt{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function wn(t,e){return t.transaction([gn],e?"readwrite":"readonly").objectStore(gn)}function ec(){const t=indexedDB.deleteDatabase(ss);return new Wt(t).toPromise()}function os(){const t=indexedDB.open(ss,Zl);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(gn,{keyPath:as})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(gn)?e(r):(r.close(),await ec(),e(await os()))})})}async function Hr(t,e,n){const r=wn(t,!0).put({[as]:e,value:n});return new Wt(r).toPromise()}async function tc(t,e){const n=wn(t,!1).get(e),r=await new Wt(n).toPromise();return r===void 0?null:r.value}function Vr(t,e){const n=wn(t,!0).delete(e);return new Wt(n).toPromise()}const nc=800,rc=3;class ls{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=os(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>rc)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return is()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=vn._getInstance(Ql()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await Yl(),!this.activeServiceWorker)return;this.sender=new Kl(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Xl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Hr(e,fn,"1"),await Vr(e,fn)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Hr(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>tc(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Vr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=wn(i,!1).getAll();return new Wt(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||xi(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),nc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}ls.type="LOCAL";const ic=ls;new Bt(3e4,6e4);/**
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
 */function dr(t,e){return e?Ae(e):(H(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class hr extends lr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return pt(e,this._buildIdpRequest())}_linkToIdToken(e,n){return pt(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return pt(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function sc(t){return Qi(t.auth,new hr(t),t.bypassAuthState)}function ac(t){const{auth:e,user:n}=t;return H(n,e,"internal-error"),Ll(n,new hr(t),t.bypassAuthState)}async function oc(t){const{auth:e,user:n}=t;return H(n,e,"internal-error"),Dl(n,new hr(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cs{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return sc;case"linkViaPopup":case"linkViaRedirect":return oc;case"reauthViaPopup":case"reauthViaRedirect":return ac;default:_e(this.auth,"internal-error")}}resolve(e){De(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){De(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lc=new Bt(2e3,1e4);async function cc(t,e,n){if(ge(t.app))return Promise.reject(ye(t,"operation-not-supported-in-this-environment"));const r=Ue(t);Oi(t,e,yn);const i=dr(r,n);return new Ze(r,"signInViaPopup",e,i).executeNotNull()}class Ze extends cs{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Ze.currentPopupAction&&Ze.currentPopupAction.cancel(),Ze.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return H(e,this.auth,"internal-error"),e}async onExecution(){De(this.filter.length===1,"Popup operations only handle one event");const e=ur();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(ye(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(ye(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ze.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ye(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,lc.get())};e()}}Ze.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uc="pendingRedirect",Zt=new Map;class dc extends cs{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Zt.get(this.auth._key());if(!e){try{const r=await hc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Zt.set(this.auth._key(),e)}return this.bypassAuthState||Zt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function hc(t,e){const n=ds(e),r=us(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function fc(t,e){return us(t)._set(ds(e),"true")}function gc(t,e){Zt.set(t._key(),e)}function us(t){return Ae(t._redirectPersistence)}function ds(t){return Qt(uc,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pc(t,e,n){return mc(t,e,n)}async function mc(t,e,n){if(ge(t.app))return Promise.reject($e(t));const r=Ue(t);Oi(t,e,yn),await r._initializationPromise;const i=dr(r,n);return await fc(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function _c(t,e,n=!1){if(ge(t.app))return Promise.reject($e(t));const r=Ue(t),i=dr(r,e),a=await new dc(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bc=600*1e3;class yc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!vc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!hs(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(ye(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=bc&&this.cachedEventUids.clear(),this.cachedEventUids.has(Wr(e))}saveEventToCache(e){this.cachedEventUids.add(Wr(e)),this.lastProcessedEventTime=Date.now()}}function Wr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function hs({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function vc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return hs(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wc(t,e={}){return Xe(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $c=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Sc=/^https?/;async function kc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await wc(t);for(const n of e)try{if(Ec(n))return}catch{}_e(t,"unauthorized-domain")}function Ec(t){const e=Yn(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!Sc.test(n))return!1;if($c.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const Ic=new Bt(3e4,6e4);function jr(){const t=Se().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Cc(t){return new Promise((e,n)=>{var i,s,a;function r(){jr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{jr(),n(ye(t,"network-request-failed"))},timeout:Ic.get()})}if((s=(i=Se().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=Se().gapi)!=null&&a.load)r();else{const o=bl("iframefcb");return Se()[o]=()=>{gapi.load?r():n(ye(t,"network-request-failed"))},Ki(`${_l()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw en=null,e})}let en=null;function Tc(t){return en=en||Cc(t),en}/**
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
 */const Ac=new Bt(5e3,15e3),Pc="__/auth/iframe",Rc="emulator/auth/iframe",xc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Oc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Nc(t){const e=t.config;H(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?sr(e,Rc):`https://${t.config.authDomain}/${Pc}`,r={apiKey:e.apiKey,appName:t.name,v:Ft},i=Oc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Ut(r).slice(1)}`}async function Dc(t){const e=await Tc(t),n=Se().gapi;return H(n,t,"internal-error"),e.open({where:document.body,url:Nc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:xc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=ye(t,"network-request-failed"),o=Se().setTimeout(()=>{s(a)},Ac.get());function l(){Se().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
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
 */const Lc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Mc=500,Uc=600,Fc="_blank",Bc="http://localhost";class zr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Hc(t,e,n,r=Mc,i=Uc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...Lc,width:r.toString(),height:i.toString(),top:s,left:a},c=ce().toLowerCase();n&&(o=Hi(c)?Fc:n),Fi(c)&&(e=e||Bc,l.scrollbars="yes");const d=Object.entries(l).reduce((p,[m,b])=>`${p}${m}=${b},`,"");if(ll(c)&&o!=="_self")return Vc(e||"",o),new zr(null);const h=window.open(e||"",o,d);H(h,t,"popup-blocked");try{h.focus()}catch{}return new zr(h)}function Vc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const Wc="__/auth/handler",jc="emulator/auth/handler",zc=encodeURIComponent("fac");async function Gr(t,e,n,r,i,s){H(t.config.authDomain,t,"auth-domain-config-required"),H(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Ft,eventId:i};if(e instanceof yn){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",Ia(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Vt){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),c=l?`#${zc}=${encodeURIComponent(l)}`:"";return`${Gc(t)}?${Ut(o).slice(1)}${c}`}function Gc({config:t}){return t.emulator?sr(t,jc):`https://${t.authDomain}/${Wc}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dn="webStorageSupport";class qc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=rs,this._completeRedirectFn=_c,this._overrideRedirectResult=gc}async _openPopup(e,n,r,i){var a;De((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Gr(e,n,r,Yn(),i);return Hc(e,s,ur())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Gr(e,n,r,Yn(),i);return Jl(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(De(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Dc(e),r=new yc(e);return n.register("authEvent",i=>(H(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Dn,{type:Dn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[Dn];s!==void 0&&n(!!s),_e(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=kc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Gi()||Bi()||or()}}const Kc=qc;var qr="@firebase/auth",Kr="1.13.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jc{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){H(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yc(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Xc(t){Ot(new bt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;H(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:qi(t)},c=new gl(r,i,s,l);return Sl(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Ot(new bt("auth-internal",e=>{const n=Ue(e.getProvider("auth").getImmediate());return(r=>new Jc(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),ht(qr,Kr,Yc(t)),ht(qr,Kr,"esm2020")}/**
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
 */const Qc=300,Zc=wi("authIdTokenMaxAge")||Qc;let Jr=null;const eu=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Zc)return;const i=n==null?void 0:n.token;Jr!==i&&(Jr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function tu(t=Po()){const e=Ii(t,"auth");if(e.isInitialized())return e.getImmediate();const n=$l(t,{popupRedirectResolver:Kc,persistence:[ic,Gl,rs]}),r=wi("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=eu(s.toString());Hl(n,a,()=>a(n.currentUser)),Bl(n,o=>a(o))}}const i=ma("auth");return i&&kl(n,`http://${i}`),n}function nu(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}pl({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=ye("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",nu().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Xc("Browser");const ru={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},Ee=ru,yt=!!Ee.VITE_FIREBASE_APP_ID;let Ln=null;function ut(){if(!yt)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!Ln){const t=Ci({apiKey:Ee.VITE_FIREBASE_API_KEY,authDomain:Ee.VITE_FIREBASE_AUTH_DOMAIN,projectId:Ee.VITE_FIREBASE_PROJECT_ID,appId:Ee.VITE_FIREBASE_APP_ID,...Ee.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:Ee.VITE_FIREBASE_STORAGE_BUCKET},...Ee.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:Ee.VITE_FIREBASE_MESSAGING_SENDER_ID}});Ln=tu(t)}return Ln}function Yr(){return new Ie}async function Xr(){if(!yt)return;const t=ut();t.currentUser&&await Wl(t)}var iu=g(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),su=g('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),au=g("<button type=button class=gate-toggle>"),ou=g("<div class=gate-or>── or ──"),lu=g("<button type=button class=btn>Continue with Google"),cu=g("<div class=gate-error role=alert>"),uu=g("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),du=g("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),hu=g("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const fu={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Qr(t){const e=(t==null?void 0:t.code)??"";return fu[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function gu(t){return(()=>{var e=iu(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),j(l,"click",t.onSignOut),e})()}function pu(){const[t,e]=M("signin"),[n,r]=M(""),[i,s]=M(""),[a,o]=M(!1),[l,c]=M("");Xs(async p=>{if(!yt)return null;const m=ut().currentUser;return m?await m.getIdToken(p):null});async function d(p){if(p.preventDefault(),!a()){o(!0),c("");try{const m=ut();t()==="create"?await Ul(m,n(),i()):await Fl(m,n(),i())}catch(m){c(Qr(m))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await cc(ut(),Yr())}catch(p){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(p==null?void 0:p.code)){await pc(ut(),Yr());return}c(Qr(p))}finally{o(!1)}}}return(()=>{var p=uu(),m=p.firstChild;return m.firstChild,u(m,f(I,{when:yt,get fallback(){return[du(),hu()]},get children(){return[(()=>{var b=su(),T=b.firstChild,_=T.firstChild,$=_.nextSibling,E=T.nextSibling,O=E.firstChild,R=O.nextSibling,S=E.nextSibling;return b.addEventListener("submit",d),$.$$input=k=>r(k.currentTarget.value),R.$$input=k=>s(k.currentTarget.value),u(S,(()=>{var k=q(()=>!!a());return()=>k()?"Working…":t()==="create"?"Create account":"Sign in"})()),y(k=>{var A=t()==="create"?"new-password":"current-password",N=a();return A!==k.e&&ne(R,"autocomplete",k.e=A),N!==k.t&&(S.disabled=k.t=N),k},{e:void 0,t:void 0}),y(()=>$.value=n()),y(()=>R.value=i()),b})(),(()=>{var b=au();return b.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(b,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),y(()=>b.disabled=a()),b})(),ou(),(()=>{var b=lu();return b.$$click=h,y(()=>b.disabled=a()),b})(),f(I,{get when(){return l()},get children(){var b=cu();return u(b,l),b}})]}}),null),p})()}ve(["click","input"]);var mu=g("<div class=gate-error role=alert>"),_u=g("<p class=gate-note>No grant-file entries yet."),bu=g("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),yu=g('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),vu=g("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function wu(t){const[e,n]=M([]),[r,i]=M([]),[s,a]=M(""),[o,l]=M(!1),[c,d]=M(""),h=_=>{n((_==null?void 0:_.file_grants)??[]),i((_==null?void 0:_.static_emails)??[])};mt(async()=>{try{h(await Zs())}catch{d("Could not load the grant list.")}});const m=_=>{_.key==="Escape"&&t.onClose()};mt(()=>{window.addEventListener("keydown",m),Oe(()=>window.removeEventListener("keydown",m));const _=document.querySelector(".access-add input");_==null||_.focus()});const b=async _=>{if(_.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await ea(s())),a("")}catch($){d($.message)}l(!1)}},T=async _=>{if(!o()){l(!0),d("");try{h(await ta(_))}catch($){d($.message)}l(!1)}};return(()=>{var _=yu(),$=_.firstChild,E=$.firstChild,O=E.nextSibling,R=O.nextSibling,S=R.firstChild,k=S.nextSibling,A=R.nextSibling;return j(_,"click",t.onClose),$.$$click=N=>N.stopPropagation(),u($,f(I,{get when(){return c()},get children(){var N=mu();return u(N,c),N}}),R),u($,f(re,{get each(){return e()},children:N=>(()=>{var P=vu(),w=P.firstChild,D=w.nextSibling;return u(w,N),D.$$click=()=>T(N),ne(D,"title",`Remove ${N}`),ne(D,"aria-label",`Remove ${N}`),y(()=>D.disabled=o()),P})()}),R),u($,f(I,{get when(){return e().length===0},get children(){return _u()}}),R),R.addEventListener("submit",b),S.$$input=N=>a(N.currentTarget.value),u(k,()=>o()?"…":"Add"),u($,f(I,{get when(){return r().length>0},get children(){var N=bu();return N.firstChild,u(N,()=>r().join(", "),null),N}}),A),j(A,"click",t.onClose),y(()=>k.disabled=o()),y(()=>S.value=s()),_})()}ve(["click","input"]);const Pe=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),Rt=(t,e,n)=>Math.min(n,Math.max(e,t));function $u(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:Rt((n-t)/r,0,1)}function Su(t,e,n,r,i=Pe){if(n<i.minRateOfReturn||t<=0)return null;const s=Rt(t/2,0,1),a=Rt(e,0,1),o=Math.min(n/i.idealReturn,1),l=Rt((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function ku(t,e=Pe){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?Rt(1+t.delta,0,1):$u(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),Su(r,a,n,i,e)}function Eu(t,e=Pe.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function Iu(t){return t.weightSharpe===Pe.weightSharpe&&t.weightSafety===Pe.weightSafety&&t.weightReturn===Pe.weightReturn&&t.minRateOfReturn===Pe.minRateOfReturn}var Cu=g("<span class=hint>production defaults · drag to re-rank live"),Tu=g("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),Au=g('<span class="hint hint-custom">custom weights'),Pu=g("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function Ru(){const[t,e]=M({...Pe});return{params:t,isCustom:()=>!Iu(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Pe})}}const xu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function Ou(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=Tu(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(I,{get when(){return!e()},get fallback(){return Au()},get children(){return Cu()}}),null),u(s,f(re,{each:xu,children:o=>(()=>{var l=Pu(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,p=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(I,{get when(){return o.weight},get children(){return[" ","· ",q(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),p.$$input=m=>t.scoring.setParam(o.key,Number(m.currentTarget.value)),y(m=>{var b=o.max,T=o.step;return b!==m.e&&ne(p,"max",m.e=b),T!==m.t&&ne(p,"step",m.t=T),m},{e:void 0,t:void 0}),y(()=>p.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),y(()=>r.open=e()),r})()}ve(["click","input"]);const $n=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],Ct=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],fs="webapp.columns.v1";function Nu(){try{const t=localStorage.getItem(fs);if(!t)return Ct;const e=JSON.parse(t);if(!Array.isArray(e))return Ct;const n=new Set($n.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:Ct}catch{return Ct}}function Du(t){try{localStorage.setItem(fs,JSON.stringify(t))}catch{}}var Lu=g("<div class=pop-backdrop>"),Mu=g('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Uu=g("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Fu=g("<label class=pick-item><input type=checkbox>");function Bu(t){const[e,n]=M(!1);return(()=>{var r=Uu(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(I,{get when(){return e()},get children(){return[(()=>{var s=Lu();return s.$$click=()=>n(!1),s})(),(()=>{var s=Mu(),a=s.firstChild,o=a.nextSibling;return u(a,f(re,{each:$n,children:l=>(()=>{var c=Fu(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),y(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),y(()=>ne(i,"aria-expanded",e())),r})()}ve(["click"]);var Hu=g('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),Vu=g("<span class=pggap>…"),Wu=g("<button type=button class=pgbtn>");function ju(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function zu(t){const e=ae(()=>ju(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Hu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,f(re,{get each(){return e()},children:d=>d==="…"?Vu():(()=>{var h=Wu();return h.$$click=()=>t.onGo(d),u(h,d),y(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,y(d=>{var h=t.page()<=1,p=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),p!==d.t&&(c.disabled=d.t=p),d},{e:void 0,t:void 0}),i})()}ve(["click"]);var Gu=g("<span class=tip>");function St(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=Gu();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?Js(i,r):e=r,u(r,()=>t.children),y(()=>ne(r,"data-tip",t.text??"")),r})()}ve(["focusin"]);const nt="∅";function te(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function Tt(t){return Number(t??0).toLocaleString("en-US")}function pn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function gs(t){return ps(t,{hour:"2-digit",minute:"2-digit"})}function qu(t){return ps(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function ps(t,e){const n=pn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const ms={text:nt,isNull:!0},Mn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Zr(t,e){return!e||te(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function Ku(t,e){return!e||te(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function Ju(t){if(!t||typeof t!="object"||te(t.report_date))return ms;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function pe(t,e){if(te(e))return ms;switch(t){case"fixed2":return Mn(e,2);case"fixed3":return Mn(e,3);case"ivrv":return Mn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return Ju(e);default:return{text:String(e),isNull:!1}}}const ei=t=>Number(t*100).toFixed(0);function Yu(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=ei(e.momentum_high),s=ei(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function kt(t,e){return Yu(e)[t]??t}var _s=g("<span class=tip-target>"),Xu=g("<div class=kv><span class=kv-label></span><span class=kv-value>"),Qu=g("<span class=tip-target>Strike position in band"),Zu=g('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),ed=g("<div class=exp-block><h4>"),td=g("<div class=kv-value>Band unavailable (∅)"),nd=g("<div><span class=marker-tick></span><span class=marker-cap><br>"),rd=g("<div class=exp-block><h4>Premium economics"),id=g("<b>"),sd=g('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),ad=g("<div class=muted-note>earnings-discounted safety applied"),od=g("<div class=exp-block><h4>Score breakdown"),ld=g("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),cd=g('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),ud=g("<span class=muted-note>all columns visible"),dd=g('<div class="exp-block exp-chips"><h4>Hidden columns'),hd=g("<span class=tip-target>: "),fd=g("<span>"),gd=g("<span class=tip-target>band safety is already discounted by the earnings rule."),pd=g("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),md=g("<div class=expansion><div class=exp-grid>");const Un={sharpe:.2,safety:.4,return_part:.4};function Fn(t,e=2){return te(t)?nt:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function we(t,e,n){return(()=>{var r=Xu(),i=r.firstChild,s=i.nextSibling;return u(i,f(St,{get text(){return kt(t,e)},get children(){var a=_s();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function _d(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=te(e.mid)?null:e.strike-e.mid,s=i!=null&&!te(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!te(a)&&l>a&&!te(e.strike),d=p=>{if(te(p))return null;const m=(p-a)/(l-a)*100;return Math.min(100,Math.max(0,m))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(p=>d(p.v)!=null):[];return(()=>{var p=ed(),m=p.firstChild;return u(m,f(St,{get text(){return kt("band_range",t.thresholds)},get children(){return Qu()}})),u(p,f(I,{when:c,get fallback(){return td()},get children(){var b=Zu(),T=b.firstChild;return u(b,f(re,{each:h,children:_=>(()=>{var $=nd(),E=$.firstChild,O=E.nextSibling,R=O.firstChild;return u(O,()=>_.label,R),u(O,()=>pe("fixed2",_.v).text,null),y(S=>{var k=`marker ${_.cls}`,A=`${d(_.v)}%`;return k!==S.e&&de($,S.e=k),A!==S.t&&tt($,"left",S.t=A),S},{e:void 0,t:void 0}),$})()}),null),y(_=>{var $=`${d(e.strike_from)}%`,E=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return $!==_.e&&tt(T,"left",_.e=$),E!==_.t&&tt(T,"width",_.t=E),_},{e:void 0,t:void 0}),b}}),null),u(p,()=>we("band_range",t.thresholds,`${pe("fixed2",e.strike_from).text} → ${pe("fixed2",e.strike_to).text}`),null),u(p,()=>we("band_depth",t.thresholds,r==null?nt:`${(r*100).toFixed(1)}%`),null),u(p,()=>we("cushion_be",t.thresholds,s==null?nt:`${s.toFixed(1)}%`),null),p})()}function bd(t){const e=t.row,n=te(e.strike)?null:e.strike*100,r=te(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=pe("pct1",e.rate_of_return);return(()=>{var a=rd();return a.firstChild,u(a,()=>we("capital",t.thresholds,n==null?nt:Fn(n,0)),null),u(a,()=>we("premium",t.thresholds,r==null?nt:Fn(r)),null),u(a,()=>we("breakeven",t.thresholds,i==null?nt:Fn(i)),null),u(a,()=>we("ann_ror",t.thresholds,(()=>{var o=id();return u(o,()=>s.text),o})()),null),u(a,()=>we("bid",t.thresholds,pe("fixed2",e.bid).text),null),u(a,()=>we("ask",t.thresholds,pe("fixed2",e.ask).text),null),u(a,()=>we("expiration",t.thresholds,e.expiration),null),a})()}function yd(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:Un.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:Un.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:Un.return_part,v:n==null?void 0:n.return}];return(()=>{var i=od();return i.firstChild,u(i,f(I,{when:n,get fallback(){return(()=>{var s=ld(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>pe("fixed3",e.score).text),s})()},get children(){return[f(re,{each:r,children:s=>{const a=te(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=cd(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,p=h.nextSibling;p.nextSibling;var m=l.nextSibling,b=m.firstChild,T=m.nextSibling;return u(l,f(St,{get text(){return kt(s.key,t.thresholds)},get children(){var _=_s();return u(_,()=>s.label),_}}),c),u(d,()=>s.weight*100,p),u(T,()=>pe("fixed3",s.v).text),y(_=>tt(b,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=sd(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>pe("fixed3",e.score).text),s})(),f(I,{get when(){return e.earnings_before_expiry},get children(){return ad()}})]}}),null),i})()}function vd(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:pe(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=dd();return n.firstChild,u(n,f(re,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=fd();return u(s,f(St,{get text(){return kt(r.id,t.thresholds)},get children(){var a=hd(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),y(()=>de(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(I,{get when(){return t.hiddenDefs.length===0},get children(){return ud()}}),null),n})()}function wd(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=md(),i=r.firstChild;return u(r,f(I,{when:n,get children(){var s=pd(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(I,{get when(){return n.report_time},children:p=>p().replaceAll("_"," ")}),c),u(s,f(I,{get when(){return!te(n.expected_eps)},get children(){return[" ","· expected EPS ",q(()=>pe("fixed2",n.expected_eps).text)]}}),h),u(s,f(St,{get text(){return kt("earnings_before_expiry",t.thresholds)},get children(){return gd()}}),null),s}}),i),u(i,f(_d,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(bd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(yd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(vd,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var $d=g("<span class=null-mark>"),Sd=g("<span class=star>★"),kd=g("<td><b>"),Bn=g("<span>"),ti=g("<td class=num>"),Ed=g("<span class=score-frozen>prod "),Id=g('<td class="num score-cell">'),Cd=g('<span class="score-frozen readmit">re-admitted'),Td=g("<td>"),Ad=g("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),Pd=g("<span class=sort-arrow>"),Rd=g("<span class=tip-target>"),xd=g("<th role=button tabindex=0>"),Od=g("<tr class=expandable><td class=exp-col>"),Nd=g("<tr class=exp-row><td>");const Dd=t=>`${t.underlying}|${t.strike}`;function Ld(t){return(()=>{var e=$d();return u(e,()=>t.text),e})()}function qt(t){const e=pe(t.kind,t.value);return f(I,{get when(){return!e.isNull},get fallback(){return f(Ld,{get text(){return e.text}})},get children(){return e.text}})}function Md(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=kd(),i=r.firstChild;return u(r,f(I,{get when(){return t.pickRank!=null},get children(){var s=Sd();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(I,{get when(){return Zr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=Bn();return y(()=>de(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=ti();return u(r,f(I,{get when(){return Zr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=Bn();return y(()=>de(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(qt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=Id();return u(r,f(qt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(I,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(I,{get when(){return!te(n.frozen_score)},get fallback(){return f(I,{get when(){return!te(n.score)},get children(){return Cd()}})},get children(){var i=Ed();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=ti();return u(r,f(qt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(I,{get when(){return Ku(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=Bn();return u(s,i),y(()=>de(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=Td();return u(r,f(qt,{get kind(){return e.kind},get value(){return n[e.id]}})),y(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Ud(t){const e=ae(()=>$n.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=Ad(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(re,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=xd();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,f(St,{get text(){return kt(a.id,t.thresholds)},get children(){var c=Rd();return u(c,()=>a.label,null),u(c,f(I,{get when(){return o()},get children(){return[" ",(()=>{var d=Pd();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),y(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&ne(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,f(re,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>Dd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=Od(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,f(re,{get each(){return e()},children:p=>f(Md,{col:p,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),y(p=>{var m=o()!=null,b=!!te(a.score),T=!!c();return m!==p.e&&d.classList.toggle("pick",p.e=m),b!==p.t&&d.classList.toggle("prow",p.t=b),T!==p.a&&d.classList.toggle("open",p.a=T),p},{e:void 0,t:void 0,a:void 0}),d})(),f(I,{get when(){return c()},get children(){var d=Nd(),h=d.firstChild;return u(h,f(wd,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),y(()=>ne(h,"colspan",e().length+1)),d}})]}})),n})()}ve(["click","keydown"]);function Fd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const dt=t=>te(t);function Bd(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=dt(a),c=dt(o);return l||c?l&&c?0:l?1:-1:r*Fd(a,o)})}function Hd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=dt(r),a=dt(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=dt(l),h=dt(c);return d||h?d&&h?0:d?1:-1:c-l})}var Vd=g("<div class=stage-badges>"),Wd=g("<pre class=errbox>"),jd=g("<details><summary> "),zd=g("<div class=scroll-region>"),Gd=g('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),qd=g("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),Kd=g("<div class=empty-panel>No rows match the current filter."),Jd=g('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Hn=100,Yd=150,ni={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function Xd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=Vd();return u(i,f(re,{get each(){return t.stages??[]},children:s=>(()=>{var a=jd(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,f(I,{get when(){return s.error},get children(){var c=Wd();return u(c,()=>s.error),c}}),null),y(()=>de(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function ri(t){const[e,n]=M(""),[r,i]=M(""),[s,a]=M(!0),[o,l]=M(null),[c,d]=M("asc"),[h,p]=M(1);let m;Oe(()=>clearTimeout(m));const b=()=>{var C;return((C=t.tf)==null?void 0:C.rows)??[]},T=ae(()=>{const C=t.scoring.params(),B=t.scoring.isCustom();return b().map(x=>{const W=ku(x,C);return{...x,frozen_score:x.score,live_parts:W,score:B?W==null?null:W.total:x.score}})}),_=ae(()=>T().filter(C=>!te(C.score)&&te(C.frozen_score)).length),$=C=>{const B=C.currentTarget.value;n(B),clearTimeout(m),m=setTimeout(()=>{i(B.trim().toLowerCase()),p(1)},Yd)},E=C=>{a(C),p(1)},O=C=>{o()!==C?(l(C),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),p(1)},[R,S]=M(null),k=C=>{const B=`${C.underlying}|${C.strike}`;S(x=>x===B?null:B)};et(At([o,c,h,r,s],()=>S(null))),et(At(t.active,()=>S(null))),et(At(t.columns.visible,()=>p(1)));const A=()=>$n.filter(C=>!t.columns.visible().includes(C.id)),N=()=>(t.stages??[]).find(C=>C.name===ni[t.id].id),P=ae(()=>{const C=r();return C?T().filter(B=>{const x=B.underlying,W=B.sector;return x!=null&&String(x).toLowerCase().includes(C)||W!=null&&String(W).toLowerCase().includes(C)}):T()}),w=ae(()=>{const C=P();return s()?C.filter(B=>!te(B.score)):C}),D=ae(()=>o()?Bd(w(),o(),c()):Hd(w())),V=ae(()=>Math.max(1,Math.ceil(D().length/Hn))),Z=()=>Math.min(h(),V()),ie=()=>{const C=Z();return D().slice((C-1)*Hn,C*Hn)},he=ae(()=>{var B;const C=new Map;if(t.scoring.isCustom()){const x=Eu(T().map(W=>({row:W,score:W.score})));for(const W of x)C.set(`${W.row.underlying}|${W.row.strike}`,C.size+1)}else for(const x of((B=t.tf)==null?void 0:B.top_picks)??[])C.set(`${x.underlying}|${x.strike}`,x.rank??"?");return C}),F=C=>he().get(`${C.underlying}|${C.strike}`);return(()=>{var C=Gd(),B=C.firstChild,x=B.firstChild,W=x.nextSibling,K=W.firstChild,G=W.nextSibling,fe=G.firstChild,Fe=fe.nextSibling;return Fe.nextSibling,u(C,f(Xd,{get stages(){return t.stages}}),B),x.$$input=$,K.addEventListener("change",se=>E(se.currentTarget.checked)),u(B,f(Bu,{get store(){return t.columns}}),G),u(G,()=>Tt(D().length),fe),u(G,()=>Tt(b().length),Fe),u(G,f(I,{get when(){return q(()=>!!t.scoring.isCustom())()&&_()>0},get children(){return[" ","· ",q(()=>Tt(_()))," re-admitted by lower floor"]}}),null),u(C,f(I,{get when(){return ie().length>0},get children(){var se=zd();return u(se,f(Ud,{get visibleCols(){return t.columns.visible},rows:ie,sortKey:o,sortDir:c,onSort:O,get thresholds(){return t.thresholds},pickRankOf:F,openKey:R,onToggleRow:k,hiddenDefs:A,get customScores(){return t.scoring.isCustom}})),se}}),null),u(C,f(I,{get when(){return ie().length===0},get children(){return f(I,{get when(){var se,ke;return((se=N())==null?void 0:se.status)==="failed"||((ke=N())==null?void 0:ke.status)==="partial"},get fallback(){return f(I,{get when(){return q(()=>!!s())()&&P().length>0},get fallback(){return Kd()},get children(){var se=qd(),ke=se.firstChild,Be=ke.nextSibling,st=Be.nextSibling,at=st.nextSibling,ot=at.nextSibling;return ot.nextSibling,u(se,()=>Tt(P().length),ot),se}})},children:se=>(()=>{var ke=Jd(),Be=ke.firstChild,st=Be.firstChild,at=st.nextSibling;at.nextSibling;var ot=Be.nextSibling;return u(Be,()=>se().status==="partial"?"△":"✗",st),u(Be,()=>ni[t.id].label,at),u(ot,()=>se().error??"stage produced no data"),ke})()})}}),null),u(C,f(I,{get when(){return D().length>0},get children(){return f(zu,{page:Z,pageCount:V,onGo:p})}}),null),y(()=>C.hidden=!t.active()),y(()=>x.value=e()),y(()=>K.checked=s()),C})()}ve(["input"]);var Qd=g("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),Zd=g('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save</button><button type=button class=btn>cancel'),eh=g('<button type=button class="btn-ghost hp-cash-edit">'),th=g("<div class=hp-pool-list>"),nh=g('<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add'),rh=g('<span class=hp-pool-name-row><button type=button class=hp-pool-name></button><button type=button class="btn hp-pool-del">×'),ih=g('<span class=hp-pool-line><span class=hp-pool-cash></span><button type=button class="btn-ghost hp-pool-act">cash</button><button type=button class="btn-ghost hp-pool-act">rename'),sh=g("<div class=hp-pool-item>"),ah=g("<span class=hp-pool-row><input><button type=button class=btn>save</button><button type=button class=btn>cancel"),bs=g("<select class=hp-pool-pick>"),oh=g('<button type=button class="btn-ghost holdings-close-btn">sell call…'),lh=g('<div class=hp-slot><div class=hp-lot-row><div class=hp-lot-row-top><span> sh </span><b></b></div><div class=hp-lot-row-sub><span>bought <!> · </span><b></b></div><div class=hp-lot-row-meta><i>last </i><i>covered <!>/</i></div></div><div class=hp-lot-actions><button type=button class="btn-ghost holdings-close-btn">close…'),ys=g("<span class=hp-pool-tag>"),jt=g("<option>"),ch=g("<i class=hp-spot-session>"),uh=g('<span class="chip high">buy back?'),dh=g('<span class="chip high">ITM — called away?'),fr=g("<b>"),hh=g("<i>"),fh=g('<div class=hp-slot><div class=hp-list-row><span class=hp-list-pos><span class=hp-kind></span><b> <!> ×</b><i>exp <!> · <!>/<!> wd</i></span><span></span><span class=hp-list-pace><i>target </i></span><span class=hp-list-status></span><button type=button class="btn-ghost holdings-close-btn">close…</button><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),gh=g('<span class="chip normal">holding'),ph=g("<b>—"),mh=g("<label>pool<select>"),_h=g("<div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares"),bh=g('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal></label><label>premium<input inputmode=decimal></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary"></button><button type=button class=btn>Cancel'),yh=g("<label>pool (deduct <!> from)<select>"),vh=g('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),wh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class=btn>Cancel'),$h=g("<i class=holdings-preview>"),Sh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close lot · <!> sh </div><form class=holdings-add><label>shares<input inputmode=numeric></label><label>sale price<input inputmode=decimal placeholder="e.g. 360.00"></label><button type=submit class="btn btn-primary">Close </button><button type=button class=btn>Cancel'),vs=g("<label class=holdings-outcome-price><input inputmode=decimal>"),kh=g("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),Eh=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),Ih=g("<label>pool (deduct strike × 100 × contracts from)<select>"),Ch=g('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),Th=g("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),Ah=g('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),Ph=g("<div class=hp-list>"),ii=g("<div class=empty-panel>"),Rh=g('<div class=hp-list><div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),xh=g("<span class=hp-pane-hint> sh held"),Oh=g("<div class=hp-toolbar-row><button type=button class=btn>"),Nh=g('<button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),Dh=g("<div class=holdings-notice>"),Lh=g('<div class="holdings-panel hp-tabs-shell"><div class=hp-tabs-grid><aside class=hp-tabs-rail><div class=hp-tabs-brand>Wheel ledger</div></aside><main class=hp-tabs-main><div class=hp-pane-head><span class=hp-pane-title>'),Mh=g("<button type=button class=hp-tab-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>");const Re=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),vt=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),tn=(t,e=0)=>`${(t*100).toFixed(e)}%`,qe=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),ws=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(Date.UTC(n,r-1,i+e,12)).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function $s(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function Uh(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=Qd(),r=n.firstChild,i=r.nextSibling;return y(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&tt(r,"width",s.e=a),o!==s.t&&tt(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function Fh(t){const[e,n]=M(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=Zd(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling;return s.$$keydown=l=>{var c;return l.key==="Escape"&&((c=t.onCancel)==null?void 0:c.call(t))},s.$$input=l=>n(l.target.value),a.$$click=()=>t.onSave(Number(e())),o.$$click=()=>{var l;return(l=t.onCancel)==null?void 0:l.call(t)},y(()=>{var l;return a.disabled=!r()||((l=t.busy)==null?void 0:l.call(t))}),y(()=>s.value=e()),i})()}function Bh(t){const[e,n]=M(!1),[r,i]=M(null),[s,a]=M(""),o=()=>t.pools??[],l=()=>t.pool,c=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,p=()=>c()==null,m=_=>{var $;_&&_!==(($=l())==null?void 0:$.id)&&t.onSelectPool(_),i(_??null),n(!0)},b=()=>{const _=o().find($=>$.id===r());return _?_.cash:t.cash},T=async()=>{var _;!s().trim()||(_=t.busy)!=null&&_.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var _=nh(),$=_.firstChild,E=$.nextSibling,O=E.nextSibling,R=O.firstChild,S=R.nextSibling;S.nextSibling;var k=O.nextSibling,A=k.firstChild,N=A.firstChild,P=N.nextSibling;return u(E,(()=>{var w=q(()=>h()==null);return()=>w()?"—":Re(h())})()),u(O,(()=>{var w=q(()=>c()==null);return()=>w()?"—":Re(c())})(),R),u(O,()=>Re(d()),S),u(_,f(I,{get when(){return!e()},get fallback(){return f(Fh,{get cash(){return b()},get busy(){return t.busy},onSave:async w=>{await t.onSaveCash(w,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var w=eh();return w.$$click=()=>{var D;return m(((D=l())==null?void 0:D.id)??null)},u(w,()=>p()?"set cash":"edit cash"),w}}),k),u(k,f(I,{get when(){return o().length>0},get children(){var w=th();return u(w,f(re,{get each(){return o()},children:D=>f(Hh,{pool:D,get selected(){var V;return((V=l())==null?void 0:V.id)===D.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(D.id)},onEditCash:()=>m(D.id),onRename:V=>t.onRenamePool(D.id,V),onDelete:()=>t.onDeletePool(D.id)})})),w}}),A),N.$$keydown=w=>w.key==="Enter"&&T(),N.$$input=w=>a(w.target.value),P.$$click=T,y(()=>{var w;return P.disabled=!s().trim()||((w=t.busy)==null?void 0:w.call(t))}),y(()=>N.value=s()),_})()}function Hh(t){const[e,n]=M(!1),[r,i]=M(t.pool.name),s=()=>{i(t.pool.name),n(!0)},a=()=>{var l;const o=r().trim();!o||o===t.pool.name||(l=t.busy)!=null&&l.call(t)||(t.onRename(o),n(!1))};return(()=>{var o=sh();return u(o,f(I,{get when(){return!e()},get fallback(){return(()=>{var l=ah(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling;return c.$$keydown=p=>{p.key==="Enter"?a():p.key==="Escape"&&n(!1)},c.$$input=p=>i(p.target.value),d.$$click=a,h.$$click=()=>n(!1),y(p=>{var T;var m=`rename ${t.pool.name}`,b=((T=t.busy)==null?void 0:T.call(t))||!r().trim()||r().trim()===t.pool.name;return m!==p.e&&ne(c,"aria-label",p.e=m),b!==p.t&&(d.disabled=p.t=b),p},{e:void 0,t:void 0}),y(()=>c.value=r()),l})()},get children(){return[(()=>{var l=rh(),c=l.firstChild,d=c.nextSibling;return j(c,"click",t.onSelect),u(c,()=>t.pool.name),j(d,"click",t.onDelete),y(h=>{var b;var p=(b=t.busy)==null?void 0:b.call(t),m=`delete ${t.pool.name}`;return p!==h.e&&(d.disabled=h.e=p),m!==h.t&&ne(d,"aria-label",h.t=m),h},{e:void 0,t:void 0}),l})(),(()=>{var l=ih(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling;return u(c,()=>Re(t.pool.cash)),j(d,"click",t.onEditCash),h.$$click=s,l})()]}})),y(()=>o.classList.toggle("active",!!t.selected)),o})()}const Vh={PreMarket:"pre",AfterHours:"post",OverNight:"overnight"};function Wh(t){const e=t.lot,n=()=>e.view;return(()=>{var r=lh(),i=r.firstChild,s=i.firstChild,a=s.firstChild,o=a.firstChild,l=a.nextSibling,c=s.nextSibling,d=c.firstChild,h=d.firstChild,p=h.nextSibling;p.nextSibling;var m=d.nextSibling,b=c.nextSibling,T=b.firstChild;T.firstChild;var _=T.nextSibling,$=_.firstChild,E=$.nextSibling;E.nextSibling;var O=i.nextSibling,R=O.firstChild;return u(a,()=>e.shares,o),u(a,()=>e.symbol,null),u(a,f(I,{get when(){var S;return(((S=t.pools)==null?void 0:S.length)??0)>1},get fallback(){return f(I,{get when(){return t.showPool},get children(){var S=ys();return u(S,()=>e.pool_name??"Main"),S}})},get children(){var S=bs();return S.addEventListener("change",k=>{var A;return(A=t.onPoolChange)==null?void 0:A.call(t,e,k.currentTarget.value)}),u(S,f(re,{get each(){return t.pools},children:k=>(()=>{var A=jt();return u(A,()=>k.name),y(()=>A.value=k.id),A})()})),y(()=>ne(S,"aria-label",`cash pool for ${e.symbol} lot`)),y(()=>{var k,A;return S.value=e.pool_id??((A=(k=t.pools)==null?void 0:k[0])==null?void 0:A.id)??""}),S}}),null),u(l,(()=>{var S=q(()=>n().spot==null);return()=>S()?"—":vt(n().spot)})(),null),u(l,f(I,{get when(){var S;return Vh[(S=e.mark)==null?void 0:S.session]},children:S=>(()=>{var k=ch();return u(k,S),k})()}),null),u(d,()=>vt(e.basis_per_share),p),u(d,()=>e.acquired,null),u(m,f(I,{get when(){return n().pl_dollars!=null},fallback:"—",get children(){return`${Re(n().pl_dollars)} (${(n().pl_pct??0)>=0?"+":""}${tn(n().pl_pct,1)})`}})),u(T,()=>{var S;return $s((S=e.mark)==null?void 0:S.as_of)||"—"},null),u(_,()=>n().covered,E),u(_,()=>n().capacity,null),u(O,f(I,{get when(){return n().capacity>0},get children(){var S=oh();return S.$$click=()=>t.onSellDialog(e),S}}),R),R.$$click=()=>t.onCloseDialog(e),u(r,f(I,{get when(){return t.dialogFor("sellCall",e.id)},keyed:!0,children:S=>f(qh,{get lot(){return S.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}),null),u(r,f(I,{get when(){return t.dialogFor("closeLot",e.id)},keyed:!0,children:S=>f(Kh,{get lot(){return S.lot},get busy(){return t.busy},get onDone(){return t.onDialogDone},get onClose(){return t.onCloseLot}})}),null),y(()=>de(m,(n().pl_dollars??0)>=0?"holdings-pos":"holdings-neg")),r})()}function jh(t){const e=t.x,n=()=>e.v.spot_pct_vs_strike!=null&&e.v.spot_pct_vs_strike>0,r=()=>e.p.kind==="call"?e.v.spot_pct_vs_strike>0:e.v.spot_pct_vs_strike<0;return(()=>{var i=fh(),s=i.firstChild,a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,p=h.firstChild,m=p.nextSibling,b=m.nextSibling,T=b.nextSibling,_=T.nextSibling,$=_.nextSibling;$.nextSibling;var E=a.nextSibling,O=E.nextSibling,R=O.firstChild;R.firstChild;var S=O.nextSibling,k=S.nextSibling,A=k.nextSibling,N=A.firstChild,P=N.firstChild,w=P.nextSibling,D=N.nextSibling,V=D.firstChild,Z=V.nextSibling,ie=Z.nextSibling,he=D.nextSibling;he.firstChild;var F=he.nextSibling,C=F.firstChild,B=C.nextSibling;return u(o,()=>e.p.kind.toUpperCase()),u(l,()=>e.p.symbol,c),u(l,()=>e.p.strike,d),u(l,()=>e.p.kind==="put"?"P":"C",d),u(l,()=>e.p.contracts,null),u(a,f(I,{get when(){return q(()=>e.p.kind==="call")()&&t.showPool},get children(){var x=ys();return u(x,()=>e.p.pool_name),x}}),h),u(a,f(I,{get when(){return q(()=>e.p.kind==="put")()&&t.showPool},get children(){var x=bs();return x.addEventListener("change",W=>{var K;return(K=t.onPoolChange)==null?void 0:K.call(t,e.p.id,W.target.value)}),u(x,f(re,{get each(){return t.pools},children:W=>(()=>{var K=jt();return u(K,()=>W.name),y(()=>K.value=W.id),K})()})),y(W=>{var fe,Fe;var K=`cash pool for ${e.p.symbol} ${e.p.strike} put`,G=(Fe=(fe=t.dialogActions)==null?void 0:fe.busy)==null?void 0:Fe.call(fe);return K!==W.e&&ne(x,"aria-label",W.e=K),G!==W.t&&(x.disabled=W.t=G),W},{e:void 0,t:void 0}),y(()=>{var W,K;return x.value=((K=(W=t.pools)==null?void 0:W.find(G=>G.name===e.p.pool_name))==null?void 0:K.id)??""}),x}}),h),u(h,()=>e.p.expiry,m),u(h,()=>e.v.days_elapsed,T),u(h,()=>e.v.days_total,$),u(E,(()=>{var x=q(()=>e.v.pl_pct==null);return()=>x()?"—":`${e.v.pl_pct>=0?"+":""}${tn(e.v.pl_pct,1)}`})()),u(O,f(Uh,{get v(){return e.v}}),R),u(R,()=>tn(e.v.target_pct),null),u(S,f(I,{get when(){return e.v.pace_met},get fallback(){return gh()},get children(){return uh()}}),null),u(S,f(I,{get when(){return q(()=>e.p.kind==="call")()&&n()},get children(){return dh()}}),null),k.$$click=()=>t.onClose(e),u(w,()=>vt(e.p.premium)),u(Z,(()=>{var x=q(()=>e.p.mark==null);return()=>x()?"—":e.p.mark.mid.toFixed(2)})()),u(ie,(()=>{var x=q(()=>e.p.mark==null);return()=>x()?"unpriced":$s(e.p.mark.as_of)})()),u(he,f(I,{get when(){var x;return((x=e.p.mark)==null?void 0:x.underlying_price)!=null},get fallback(){return ph()},get children(){return[(()=>{var x=fr();return u(x,()=>e.p.mark.underlying_price.toFixed(2)),x})(),(()=>{var x=hh();return u(x,(()=>{var W=q(()=>e.v.spot_pct_vs_strike==null);return()=>W()?"":`${e.v.spot_pct_vs_strike>=0?"+":""}${tn(e.v.spot_pct_vs_strike,1)} vs strike`})()),y(()=>de(x,r()&&e.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),x})()]}}),null),u(B,(()=>{var x=q(()=>e.v.pl_dollars==null);return()=>x()?"—":vt(e.v.pl_dollars)})()),u(i,f(I,{get when(){return t.dialogFor(e.p.kind,e.p.id)},keyed:!0,children:x=>f(Qh,zs({d:x,get pools(){return t.pools}},()=>t.dialogActions))}),null),y(x=>{var W=!!e.v.pace_met,K=e.p.kind,G=e.v.pl_pct>=0?"holdings-pos":"holdings-neg",fe=(e.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return W!==x.e&&s.classList.toggle("hp-row-met",x.e=W),K!==x.t&&ne(o,"data-kind",x.t=K),G!==x.a&&de(E,x.a=G),fe!==x.o&&de(B,x.o=fe),x},{e:void 0,t:void 0,a:void 0,o:void 0}),i})()}function zh(t){var o,l;const e=t.kind,n=()=>t.pools??[],[r,i]=M({symbol:"",strike:"",premium:"",contracts:"1",sold:qe(),expiry:ws(qe(),7),pool_id:((l=(o=t.pools)==null?void 0:o[0])==null?void 0:l.id)??""}),s=c=>d=>i({...r(),[c]:d.target.value}),a=()=>r().symbol.trim()&&[r().strike,r().premium,r().contracts].every(c=>Number(c)>0)&&r().expiry>r().sold&&r().sold<=qe();return(()=>{var c=bh(),d=c.firstChild,h=d.firstChild,p=h.nextSibling,m=d.nextSibling,b=m.firstChild,T=b.nextSibling,_=m.nextSibling,$=_.firstChild,E=$.nextSibling,O=_.nextSibling,R=O.firstChild,S=R.nextSibling,k=O.nextSibling,A=k.firstChild,N=A.nextSibling,P=k.nextSibling,w=P.firstChild,D=w.nextSibling,V=P.nextSibling,Z=V.nextSibling;return c.addEventListener("submit",ie=>{var he,F;ie.preventDefault(),!(!a()||(he=t.busy)!=null&&he.call(t))&&t.onAdd({...e==="call"?{kind:"call"}:{},...n().length>0?{pool_id:r().pool_id||((F=n()[0])==null?void 0:F.id)}:{},symbol:r().symbol.trim().toUpperCase(),strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:r().sold,expiry:r().expiry})}),j(p,"input",s("symbol")),j(T,"input",s("strike")),ne(T,"placeholder",e==="call"?"e.g. 355.00":"e.g. 350.00"),j(E,"input",s("premium")),ne(E,"placeholder",e==="call"?"e.g. 1.80":"e.g. 1.00"),j(S,"input",s("contracts")),u(c,f(I,{get when(){return n().length>1},get children(){var ie=mh(),he=ie.firstChild,F=he.nextSibling;return j(F,"input",s("pool_id")),u(F,f(re,{get each(){return n()},children:C=>(()=>{var B=jt();return u(B,()=>C.name),y(()=>B.value=C.id),B})()})),y(()=>F.value=r().pool_id),ie}}),k),j(N,"input",s("sold")),j(D,"input",s("expiry")),u(V,e==="call"?"Sell call":"Sell put"),j(Z,"click",t.onDone),u(c,f(I,{when:e==="call",get children(){return _h()}}),null),y(()=>{var ie;return V.disabled=!a()||((ie=t.busy)==null?void 0:ie.call(t))}),y(()=>p.value=r().symbol),y(()=>T.value=r().strike),y(()=>E.value=r().premium),y(()=>S.value=r().contracts),y(()=>N.value=r().sold),y(()=>D.value=r().expiry),c})()}function Gh(t){var a;const e=()=>t.pools??[],[n,r]=M({symbol:"",shares:"",basis_per_share:"",acquired:qe(),pool_id:((a=e()[0])==null?void 0:a.id)??""}),i=o=>l=>r({...n(),[o]:l.target.value}),s=()=>n().symbol.trim()&&Number(n().shares)>0&&Number(n().basis_per_share)>0;return(()=>{var o=vh(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=l.nextSibling,p=h.firstChild,m=p.nextSibling,b=h.nextSibling,T=b.firstChild,_=T.nextSibling,$=b.nextSibling,E=$.firstChild,O=E.nextSibling,R=$.nextSibling,S=R.nextSibling;return o.addEventListener("submit",k=>{var A,N;k.preventDefault(),!(!s()||(A=t.busy)!=null&&A.call(t))&&t.onAdd({kind:"lot",symbol:n().symbol.trim().toUpperCase(),shares:Math.trunc(Number(n().shares)),basis_per_share:Number(n().basis_per_share),acquired:n().acquired,...e().length>0?{pool_id:n().pool_id||((N=e()[0])==null?void 0:N.id)}:{}})}),j(d,"input",i("symbol")),j(m,"input",i("shares")),j(_,"input",i("basis_per_share")),u(o,f(I,{get when(){return e().length>1},get children(){var k=yh(),A=k.firstChild,N=A.nextSibling,P=N.nextSibling,w=P.nextSibling;return u(k,()=>Math.trunc(Number(n().shares)*Number(n().basis_per_share)||0).toLocaleString(),N),j(w,"input",i("pool_id")),u(w,f(re,{get each(){return e()},children:D=>(()=>{var V=jt();return u(V,()=>D.name),y(()=>V.value=D.id),V})()})),y(()=>w.value=n().pool_id),k}}),$),j(O,"input",i("acquired")),j(S,"click",t.onDone),y(()=>{var k;return R.disabled=!s()||((k=t.busy)==null?void 0:k.call(t))}),y(()=>d.value=n().symbol),y(()=>m.value=n().shares),y(()=>_.value=n().basis_per_share),y(()=>O.value=n().acquired),o})()}function qh(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=M({strike:"",premium:"",contracts:String(n()),expiry:ws(qe(),7)}),s=o=>l=>i({...r(),[o]:l.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>qe();return(()=>{var o=wh(),l=o.firstChild,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,p=h.firstChild,m=p.firstChild,b=m.nextSibling,T=p.nextSibling,_=T.firstChild,$=_.nextSibling,E=T.nextSibling,O=E.firstChild,R=O.nextSibling,S=E.nextSibling,k=S.firstChild,A=k.nextSibling,N=S.nextSibling,P=N.nextSibling;return u(l,()=>e.shares,d),u(l,()=>e.symbol,null),h.addEventListener("submit",w=>{var D;w.preventDefault(),!(!a()||(D=t.busy)!=null&&D.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:qe(),expiry:r().expiry})}),j(b,"input",s("strike")),j($,"input",s("premium")),j(R,"input",s("contracts")),j(A,"input",s("expiry")),j(P,"click",t.onDone),y(()=>{var w;return N.disabled=!a()||((w=t.busy)==null?void 0:w.call(t))}),y(()=>b.value=r().strike),y(()=>$.value=r().premium),y(()=>R.value=r().contracts),y(()=>A.value=r().expiry),o})()}function Kh(t){const e=t.lot,[n,r]=M({shares:String(e.shares),price:""}),i=c=>d=>r({...n(),[c]:d.target.value}),s=()=>Math.trunc(Number(n().shares)),a=()=>Number(n().price),o=()=>Number.isInteger(s())&&s()>=1&&s()<=e.shares&&a()>0,l=()=>o()?s()*a():null;return(()=>{var c=Sh(),d=c.firstChild,h=d.firstChild,p=h.nextSibling;p.nextSibling;var m=d.nextSibling,b=m.firstChild,T=b.firstChild,_=T.nextSibling,$=b.nextSibling,E=$.firstChild,O=E.nextSibling,R=$.nextSibling;R.firstChild;var S=R.nextSibling;return u(d,()=>e.shares,p),u(d,()=>e.symbol,null),m.addEventListener("submit",k=>{var A;k.preventDefault(),!(!o()||(A=t.busy)!=null&&A.call(t))&&t.onClose(e,s(),a())}),m.$$keydown=k=>{k.key==="Escape"&&t.onDone()},j(_,"input",i("shares")),j(O,"input",i("price")),u(m,f(I,{get when(){return l()!=null},get children(){var k=$h();return u(k,()=>`${s()} sh × $${a().toFixed(2)} → $${l().toFixed(2)} → pool ${e.pool_name??"Main"}`),k}}),R),u(R,(()=>{var k=q(()=>s()===e.shares);return()=>k()?"lot":`${s()} sh`})(),null),j(S,"click",t.onDone),y(()=>{var k;return R.disabled=!o()||((k=t.busy)==null?void 0:k.call(t))}),y(()=>_.value=n().shares),y(()=>O.value=n().price),c})()}function Jh(t){var o,l;const e=t.d.pos,[n,r]=M("bought-back"),[i,s]=M(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="assigned"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=Eh(),d=c.firstChild,h=d.firstChild,p=h.nextSibling,m=p.nextSibling,b=m.nextSibling;b.nextSibling;var T=d.nextSibling,_=T.firstChild,$=_.firstChild,E=_.nextSibling,O=E.firstChild,R=E.nextSibling,S=R.firstChild,k=T.nextSibling;k.firstChild;var A=k.nextSibling,N=A.firstChild,P=N.nextSibling;return u(d,()=>e.symbol,p),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),$.addEventListener("change",()=>r("bought-back")),O.addEventListener("change",()=>r("expired")),S.addEventListener("change",()=>r("assigned")),u(c,f(I,{get when(){return n()!=="expired"},get children(){var w=vs(),D=w.firstChild;return u(w,()=>n()==="assigned"?"share price at assignment":"close price/share",D),D.$$input=V=>s(V.target.value),y(()=>D.value=i()),w}}),k),u(k,f(I,{get when(){return a()!==null},fallback:"—",get children(){var w=fr();return u(w,()=>vt(a())),y(()=>de(w,a()>=0?"holdings-pos":"holdings-neg")),w}}),null),j(N,"click",t.onDone),P.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),u(c,f(I,{get when(){return n()==="assigned"},get children(){return kh()}}),null),y(()=>{var w;return P.disabled=((w=t.busy)==null?void 0:w.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),y(()=>$.checked=n()==="bought-back"),y(()=>O.checked=n()==="expired"),y(()=>S.checked=n()==="assigned"),c})()}function Yh(t){var a,o;const e=()=>t.pools??[],[n,r]=M({...t.d.prefill,pool_id:((a=t.d.pos)==null?void 0:a.pool_id)??((o=e()[0])==null?void 0:o.id)??""}),i=l=>c=>r({...n(),[l]:c.target.value}),s=()=>n().symbol.trim()&&Number(n().shares)>0&&Number(n().basis_per_share)>0;return(()=>{var l=Ch(),c=l.firstChild,d=c.nextSibling,h=d.firstChild,p=h.firstChild,m=p.nextSibling,b=h.nextSibling,T=b.firstChild,_=T.nextSibling,$=b.nextSibling,E=$.firstChild,O=E.nextSibling,R=$.nextSibling,S=R.firstChild,k=S.nextSibling,A=R.nextSibling,N=A.nextSibling;return d.addEventListener("submit",P=>{var w,D;P.preventDefault(),!(!s()||(w=t.busy)!=null&&w.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:n().symbol.trim().toUpperCase(),shares:Math.trunc(Number(n().shares)),basis_per_share:Number(n().basis_per_share),acquired:n().acquired,assigned_from:t.d.pos.id,...e().length>0?{pool_id:n().pool_id||((D=e()[0])==null?void 0:D.id)}:{}})}),j(m,"input",i("symbol")),j(_,"input",i("shares")),u(d,f(I,{get when(){return e().length>1},get children(){var P=Ih(),w=P.firstChild,D=w.nextSibling;return j(D,"input",i("pool_id")),u(D,f(re,{get each(){return e()},children:V=>(()=>{var Z=jt();return u(Z,()=>V.name),y(()=>Z.value=V.id),Z})()})),y(()=>D.value=n().pool_id),P}}),$),j(O,"input",i("basis_per_share")),j(k,"input",i("acquired")),j(N,"click",t.onDone),y(()=>{var P;return A.disabled=!s()||((P=t.busy)==null?void 0:P.call(t))}),y(()=>m.value=n().symbol),y(()=>_.value=n().shares),y(()=>O.value=n().basis_per_share),y(()=>k.value=n().acquired),l})()}function Xh(t){var o,l;const e=t.d.pos,[n,r]=M("bought-back"),[i,s]=M(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="called-away"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=Ah(),d=c.firstChild,h=d.firstChild,p=h.nextSibling,m=p.nextSibling,b=m.nextSibling;b.nextSibling;var T=d.nextSibling,_=T.firstChild,$=_.firstChild,E=_.nextSibling,O=E.firstChild,R=E.nextSibling,S=R.firstChild,k=T.nextSibling;k.firstChild;var A=k.nextSibling,N=A.firstChild,P=N.nextSibling;return u(d,()=>e.symbol,p),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),$.addEventListener("change",()=>r("bought-back")),O.addEventListener("change",()=>r("expired")),S.addEventListener("change",()=>r("called-away")),u(c,f(I,{get when(){return n()!=="expired"},get children(){var w=vs(),D=w.firstChild;return u(w,()=>n()==="called-away"?"share price at call":"close price/share",D),D.$$input=V=>s(V.target.value),y(()=>D.value=i()),w}}),k),u(k,f(I,{get when(){return a()!==null},fallback:"—",get children(){var w=fr();return u(w,()=>vt(a())),y(()=>de(w,a()>=0?"holdings-pos":"holdings-neg")),w}}),null),j(N,"click",t.onDone),P.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),u(c,f(I,{get when(){return n()==="called-away"},get children(){var w=Th(),D=w.firstChild,V=D.nextSibling,Z=V.nextSibling,ie=Z.nextSibling;return ie.nextSibling,u(w,()=>e.symbol,V),u(w,()=>e.contracts*100,ie),w}}),null),y(()=>{var w;return P.disabled=((w=t.busy)==null?void 0:w.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),y(()=>$.checked=n()==="bought-back"),y(()=>O.checked=n()==="expired"),y(()=>S.checked=n()==="called-away"),c})()}function Qh(t){return t.d.type==="put"?t.d.stage==="lot"?f(Yh,{get d(){return t.d},get pools(){return t.pools},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(Jh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f(Xh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function Zh(){const[t,e]=M(null),[n,r]=M("");let i;const s=v=>{r(v),clearTimeout(i),i=setTimeout(()=>r(""),4e3)};Oe(()=>clearTimeout(i));const[a,o]=M(null),[l,c]=M(!1),d=async()=>{try{e(await ia())}catch(v){s(`Holdings API error: ${v.message}`)}};mt(d);const h=()=>{var v;return((v=t())==null?void 0:v.positions)??[]},p=()=>{var v;return((v=t())==null?void 0:v.calls)??[]},m=()=>{var v;return((v=t())==null?void 0:v.lots)??[]},b=()=>h().map(v=>({p:{...v,kind:"put"},v:v.view})),T=()=>p().map(v=>({p:{...v,kind:"call"},v:v.view})),_=v=>v.v.pl_pct==null?-1/0:v.v.pl_pct-v.v.target_pct,$=(v,L)=>{var Y,le;const U=a();return!U||U.type!==v?null:(((Y=U.pos)==null?void 0:Y.id)??((le=U.lot)==null?void 0:le.id))===L?U:null},E=async v=>{if(l())return null;c(!0);try{return await v()}catch(L){return s(L.message),null}finally{c(!1)}},O=async()=>{var U;const v=await E(()=>sa());if(!v)return;const L=((U=v.refresh)==null?void 0:U.stale)??[];s(L.length?`Marks refreshed — ${L.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await d()},R=async(v,L)=>{await E(()=>Cn(v))&&(s(L),o(null),await d())},S=async(v,L)=>{await E(()=>Cn(L))&&(s(`Assigned — recorded ${L.shares} sh ${L.symbol} at $${L.basis_per_share.toFixed(2)} basis.`),o(null),await d())},k=async(v,L,U)=>{if(L==="assigned"){o({type:"put",pos:v,stage:"lot",prefill:{symbol:v.symbol,shares:v.contracts*100,basis_per_share:+(v.strike-v.premium).toFixed(2),acquired:qe()}});return}await E(()=>Tn(v.id))&&(s(L==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},A=async(v,L,U)=>{if(L==="called-away"){const Y=await E(()=>oa(v.id));if(!Y)return;s(Y.reduced?`Called away — ${v.symbol} lot reduced by ${v.contracts*100} sh.`:`Called away — call removed. ${Y.reason??""}`),o(null),await d();return}await E(()=>Tn(v.id))&&(s(L==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},N=async(v,L)=>{const U=await E(()=>yr(L?{cash:v,pool_id:L}:{cash:v}));return U?(e(z=>({...z??{},cash:U.cash,cash_reserved:U.cash_reserved,cash_free:U.cash_free,cash_pools:U.pool?((z==null?void 0:z.cash_pools)??[]).map(Y=>Y.id===U.pool.id?{...Y,...U.pool}:Y):(z==null?void 0:z.cash_pools)??[]})),s(U.pool?`Cash set to ${Re(U.pool.cash)} — ${Re(U.pool.free)} free in ${U.pool.name}.`:`Cash set to ${Re(U.cash)} — ${Re(U.cash_free)} free.`),!0):!1},P=()=>{var v;return((v=t())==null?void 0:v.cash_pools)??[]},[w,D]=M(null),V=()=>{const v=P();return v.length?v.find(L=>L.id===w())??v[0]:null},Z=async v=>{var U;const L=await E(()=>Cn({kind:"pool",name:v}));return L?(s(`Pool “${v}” added — set its cash with the strip.`),D(((U=L.pool)==null?void 0:U.id)??null),await d(),!0):!1},ie=async(v,L)=>{await E(()=>yr({pool_id:v,name:L}))&&(s(`Pool renamed to “${L}”.`),await d())},he=async v=>{await E(()=>Tn(v))&&(s("Pool deleted."),w()===v&&D(null),await d())},F=async(v,L)=>{var z;const U=await E(()=>br(v,L));U&&(s(`Put moved to ${((z=U.position)==null?void 0:z.pool_name)??"the pool"}.`),await d())},C=async(v,L)=>{var z;const U=await E(()=>br(v.id,L));U&&(s(`${v.symbol} lot moved to ${((z=U.lot)==null?void 0:z.pool_name)??"the pool"}.`),await d())},B={busy:l,onDone:()=>o(null),onConfirmPut:k,onConfirmCall:A,onAssign:S},[x,W]=M("lots"),K=()=>[{id:"lots",label:"Lots",count:m().length,sub:`${m().reduce((v,L)=>v+L.shares,0)} sh held`},{id:"puts",label:"Puts",count:h().length,sub:`${h().filter(v=>v.view.pace_met).length} pace-met`},{id:"calls",label:"Calls",count:p().length,sub:`${p().filter(v=>v.view.spot_pct_vs_strike>0).length} ITM`}],G=()=>[...b()].sort((v,L)=>_(L)-_(v)),fe=()=>[...T()].sort((v,L)=>_(L)-_(v)),Fe={lots:{label:"+ New lot",type:"addLot"},puts:{label:"+ Sell put",type:"addPut"},calls:{label:"+ Sell call",type:"addCall"}},se={lots:"No recorded lots — assignments land here.",puts:"No open puts — press “+ Sell put” to record one.",calls:"No open calls — press “+ Sell call” to record one."},ke=v=>{if(v==="lots")return f(I,{get when(){return m().length>0},get fallback(){return(()=>{var U=ii();return u(U,()=>se.lots),U})()},get children(){var U=Ph();return u(U,f(re,{get each(){return m()},children:z=>f(Wh,{lot:z,dialogFor:$,busy:l,get pools(){return P()},get showPool(){return P().length>1},onPoolChange:C,onSellDialog:Y=>o({type:"sellCall",lot:Y}),onCloseDialog:Y=>o({type:"closeLot",lot:Y}),onDialogDone:()=>o(null),onSellCall:(Y,le)=>R(le,`Sold ${le.symbol} ${le.strike}C ×${le.contracts} — Refresh marks to price.`),onCloseLot:async(Y,le,ee,lt)=>{await E(()=>aa(Y.id,le,ee,lt))&&(s(`Closed ${le} sh ${Y.symbol} — $${(le*ee).toFixed(2)} to the pool.`),o(null),await d())}})})),U}});const L=v==="puts"?G():fe();return f(I,{get when(){return L.length>0},get fallback(){return(()=>{var U=ii();return u(U,()=>se[v]),U})()},get children(){var U=Rh();return U.firstChild,u(U,f(re,{each:L,children:z=>f(jh,{x:z,get showPool(){return P().length>1},get pools(){return P()},onPoolChange:F,dialogFor:$,dialogActions:B,onClose:Y=>o({type:Y.p.kind,pos:Y.p})})}),null),U}})},Be=v=>f(I,{get when(){var L,U,z;return v==="lots"&&((L=a())==null?void 0:L.type)==="addLot"||v==="puts"&&((U=a())==null?void 0:U.type)==="addPut"||v==="calls"&&((z=a())==null?void 0:z.type)==="addCall"},keyed:!0,get children(){return v==="lots"?f(Gh,{get pools(){return P()},busy:l,onDone:()=>o(null),onAdd:L=>R(L,`Recorded ${L.shares} sh ${L.symbol}.`)}):f(zh,{kind:v==="puts"?"put":"call",get pools(){return P()},busy:l,onDone:()=>o(null),onAdd:L=>R(L,`Sold ${L.symbol} ${L.strike}${v==="puts"?"P":"C"} ×${L.contracts} — Refresh marks to price.`)})}}),st=v=>(()=>{var L=Oh(),U=L.firstChild;return U.$$click=()=>o({type:Fe[v].type}),u(U,()=>Fe[v].label),u(L,f(I,{when:v==="lots",get children(){var z=xh(),Y=z.firstChild;return u(z,()=>m().reduce((le,ee)=>le+ee.shares,0),Y),z}}),null),L})(),at=()=>(()=>{var v=Nh();return v.$$click=O,y(()=>v.disabled=l()),v})(),ot=()=>f(I,{get when(){return n()},get children(){var v=Dh();return u(v,n),v}});return(()=>{var v=Lh(),L=v.firstChild,U=L.firstChild;U.firstChild;var z=U.nextSibling,Y=z.firstChild,le=Y.firstChild;return u(U,f(Bh,{get cash(){var ee;return((ee=t())==null?void 0:ee.cash)??null},get reserved(){var ee;return((ee=t())==null?void 0:ee.cash_reserved)??0},get free(){var ee;return((ee=t())==null?void 0:ee.cash_free)??null},get pools(){return P()},get pool(){return V()},busy:l,onSaveCash:N,onSelectPool:D,onAddPool:Z,onRenamePool:ie,onDeletePool:he}),null),u(U,f(re,{get each(){return K()},children:ee=>(()=>{var lt=Mh(),Sn=lt.firstChild,gr=Sn.nextSibling,Cs=gr.nextSibling;return lt.$$click=()=>W(ee.id),u(Sn,()=>ee.label.toUpperCase()),u(gr,()=>ee.count),u(Cs,()=>ee.sub),y(()=>lt.classList.toggle("active",x()===ee.id)),lt})()}),null),u(le,()=>K().find(ee=>ee.id===x()).label),u(Y,at,null),u(z,ot,null),u(z,()=>st(x()),null),u(z,()=>Be(x()),null),u(z,()=>ke(x()),null),v})()}ve(["input","keydown","click"]);async function ef(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var tf=g("<button type=button class=run-btn>"),nf=g("<span class=run-count>/"),rf=g("<span class=run-bar><span class=fill>"),sf=g("<li><span class=mark></span><span class=label>"),af=g("<div class=toast-cached>Served from cache — last run <!> min old"),of=g('<div class="toast-cached warn">'),lf=g("<div class=run-headline>"),cf=g("<ul class=run-stages>"),uf=g("<details class=run-errors><summary>details</summary><ul>"),df=g("<div class=run-warn>Closing this tab stops the run."),hf=g("<div class=run-warn>Re-checking every 15 s…"),ff=g("<div class=run-strip>"),gf=g("<li> ");const Ss=["quotes","metrics","chains_short","chains_medium"],ks={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},pf=15e3,Es=t=>t!==null&&Date.now()>=t;function si(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function mf(t){const[e,n]=M("idle"),[r,i]=M(R()),[s,a]=M(null),[o,l]=M(0),[c,d]=M(null),[h,p]=M(null),[m,b]=M("");let T=null,_=null;const[$,E]=M(0);let O=null;et(()=>{const F=t();if(O&&(clearTimeout(O),O=null),(F==null?void 0:F.run_allowed)===!1){const C=pn(F.next_open_utc);C!==null&&(O=setTimeout(()=>E(B=>B+1),Math.max(0,C-Date.now())))}});function R(){return Object.fromEntries(Ss.map(F=>[F,{status:"pending",error:null}]))}function S(){T&&clearInterval(T),T=null,_&&clearInterval(_),_=null}function k(){l(0),T=setInterval(()=>l(F=>F+1),1e3)}function A(F){switch(F.type){case"stage_started":i(C=>({...C,[F.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:F.stage,done:F.done,total:F.total});break;case"stage_finished":i(C=>({...C,[F.stage]:{status:F.ok?"ok":"failed",error:F.error??null}}));break;case"run_finished":d(F);break}}function N(){S();const F=c(),C=((F==null?void 0:F.stages)??[]).some(B=>B.name.startsWith("chains")&&["ok","partial"].includes(B.status));n(F&&(C||F.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function P(F){let C=!1;return await ef(F,B=>{A(B),B.type==="run_finished"&&(C=!0)}),C?(N(),!0):!1}async function w(F){n("detached"),_=setInterval(async()=>{var C,B,x;try{const W=await pi(),K=((B=(C=W==null?void 0:W.result)==null?void 0:C.run)==null?void 0:B.finished_at_utc)??null;if(K&&K!==F){i(D(W.result)),S(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((x=W==null?void 0:W.run_state)==null?void 0:x.status)!=="running"&&(S(),n("idle"),b("Stream lost and the run was canceled — press Run to retry."))}catch{}},pf)}function D(F){const C=R();for(const B of(F==null?void 0:F.stages)??[])C[B.name]&&(C[B.name]={status:B.status,error:B.error});return C}async function V(){var x,W,K;if(["starting","running","detached"].includes(e()))return;b(""),d(null),a(null),i(R()),p(null);const F=((K=(W=(x=t())==null?void 0:x.result)==null?void 0:W.run)==null?void 0:K.finished_at_utc)??null;n("running"),k();let C;try{C=await na()}catch{S(),n("idle"),b("Run failed to start — network or server unreachable.");return}const B=C.headers.get("content-type")??"";if(C.ok&&B.includes("application/json")){const G=await C.json().catch(()=>null);if(S(),n("idle"),(G==null?void 0:G.status)==="cached"){p(G.age_secs),setTimeout(()=>p(null),6e3);return}}if(C.status===403&&B.includes("application/json")){const G=await C.json().catch(()=>null);S(),n("idle"),b(G!=null&&G.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(G.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(C.status===202){const G=await ra();if(G.ok&&(G.headers.get("content-type")??"").includes("text/event-stream")){await P(G)||await w(F);return}await w(F);return}if(B.includes("text/event-stream")){await P(C)||await w(F);return}S(),n("idle"),b(`Unexpected /api/run response (${C.status}, ${B||"no type"}).`)}return Oe(()=>{S(),O&&clearTimeout(O)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:m,triggerRun:V,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{$();const F=t();return(F==null?void 0:F.run_allowed)!==!1?!0:Es(pn(F==null?void 0:F.next_open_utc))},nextOpenUtc:()=>{var F;return((F=t())==null?void 0:F.next_open_utc)??null}}}function _f(t){const e=()=>!t.run.runAllowed(),n=()=>gs(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=tf();return i.$$click=()=>t.run.triggerRun(),u(i,r),y(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&ne(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function bf(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=sf(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>ks[t.name]),u(i,f(I,{get when(){return r()!==null},get children(){return[(()=>{var o=nf(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=rf(),l=o.firstChild;return y(c=>tt(l,"width",`${r()}%`)),o})()]}}),null),y(()=>de(i,`run-stage ${e()}`)),i})()}function yf(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",q(()=>si(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",q(()=>si(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(I,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=ff();return u(i,f(I,{get when(){return e.cachedToast()},get children(){var s=af(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(I,{get when(){return e.notice()},get children(){var s=of();return u(s,()=>e.notice()),s}}),null),u(i,f(I,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=lf();return u(s,r),s})(),(()=>{var s=cf();return u(s,()=>Ss.map(a=>f(bf,{name:a,run:e}))),s})(),f(I,{get when(){return q(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=uf(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=gf(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>ks[l.name]??l.name,null),u(c,(()=>{var h=q(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,f(I,{get when(){return q(()=>e.phase()==="running")()&&!n()},get children(){return df()}}),null),u(i,f(I,{get when(){return e.phase()==="detached"},get children(){return hf()}}),null),i}})}ve(["click"]);var Is=g("<b>"),vf=g("<span>Market closed · last run <b></b> ago"),wf=g("<div class=cache-line><span></span><span class=pill>run: "),$f=g("<span>Cached · <b></b> left"),Sf=g("<span>Stale · last run <b></b> ago"),kf=g("<nav class=tabs role=tablist aria-label=timeframes>"),Ef=g("<button type=button role=tab class=tab>"),If=g("<svg><circle cx=12 cy=12 r=4></svg>",!1,!0,!1),Cf=g('<svg><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></svg>',!1,!0,!1),Tf=g('<button type=button class="btn-ghost theme-toggle"><svg width=14 height=14 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true>'),Af=g('<svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></svg>',!1,!0,!1),Pf=g('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),Rf=g("<div class=pop-backdrop>"),xf=g("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),Of=g("<div class=error-banner>API error: "),Nf=g("<div class=shell><header><div class=user-box></div><div class=theme-slot-head></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),Df=g("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function Lf(){const[t,e]=M(Nu()),n=r=>{e(r),Du(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(Ct)}}function ai(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function Mf(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function oi(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function Vn(t){return f(I,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=Is();return u(e,()=>t.at()),e})()]}})}function Uf(t){const[e,n]=M(0);mt(()=>{const m=setInterval(()=>n(b=>b+1),3e4);Oe(()=>clearInterval(m))});let r=Date.now(),i=0;et(At(()=>t.envelope,m=>{r=Date.now(),i=(m==null?void 0:m.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const m=Math.max(0,(t.envelope.cache_secs??0)-s());return m>=60?`${Math.floor(m/60)}m`:`${m}s`},c=()=>{var m,b;return qu((b=(m=t.envelope.result)==null?void 0:m.run)==null?void 0:b.finished_at_utc)},d=()=>{e();const m=t.envelope.next_open_utc,b=pn(m);if(!(b===null||Es(b)))return gs(m)},h=()=>o()&&a()==="stale"?"closed":a(),p=()=>a()==="fresh"||a()==="stale";return(()=>{var m=wf(),b=m.firstChild,T=b.nextSibling;return T.firstChild,u(m,f(I,{get when(){return q(()=>!!o())()&&p()},get fallback(){return f(I,{get when(){return a()==="fresh"},get fallback(){return f(I,{get when(){return a()==="stale"},get children(){var _=Sf(),$=_.firstChild,E=$.nextSibling;return E.nextSibling,u(E,()=>oi(s())),u(_,f(Vn,{at:c}),null),_}})},get children(){var _=$f(),$=_.firstChild,E=$.nextSibling;return E.nextSibling,u(E,l),u(_,f(Vn,{at:c}),null),_}})},get children(){var _=vf(),$=_.firstChild,E=$.nextSibling;return E.nextSibling,u(E,()=>oi(s())),u(_,f(Vn,{at:c}),null),u(_,f(I,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var O=Is();return u(O,d),O})()]}}),null),_}}),b),u(b,(()=>{var _=q(()=>h()==="closed");return()=>_()?"market closed":a()})()),u(T,()=>{var _;return((_=t.envelope.run_state)==null?void 0:_.status)??"idle"},null),y(()=>de(b,"pill "+h())),m})()}function li(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=kf();return u(n,()=>e.map(r=>(()=>{var i=Ef();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=q(()=>!r.holdings);return()=>s()&&` (${Tt(Mf(t.result,r.id))})`})(),null),y(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&ne(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function Ff(){const[t,e]=M(null),n=()=>window.matchMedia("(prefers-color-scheme: dark)").matches,r=()=>t()??(n()?"dark":"light"),i=()=>{const a=r()==="dark"?"light":"dark";document.documentElement.dataset.theme=a,e(a)},s=()=>r()==="dark"?"Switch to light theme":"Switch to dark theme";return(()=>{var a=Tf(),o=a.firstChild;return a.$$click=i,u(o,f(I,{get when(){return r()==="dark"},get fallback(){return Af()},get children(){return[If(),Cf()]}})),y(l=>{var c=s(),d=s();return c!==l.e&&ne(a,"aria-label",l.e=c),d!==l.t&&ne(a,"title",l.t=d),l},{e:void 0,t:void 0}),a})()}function Bf(){const[t,e]=M(void 0),[n,{refetch:r}]=Ds(t,$=>$?pi():void 0);mt(()=>{if(!yt){e(null);return}const $=Vl(ut(),e);Oe($)});const[i,s]=M(!1);et(At(t,$=>{s(!1),!(!$||!yt)&&Qs().then(E=>s(E.status===403)).catch(()=>{})})),mt(()=>{const $=()=>r();window.addEventListener("webapp:refresh-latest",$),Oe(()=>window.removeEventListener("webapp:refresh-latest",$))});const a=()=>{var $,E;return(($=t())==null?void 0:$.email)||((E=t())==null?void 0:E.uid)||""},[o,l]=M(!1),[c,d]=M(!1),h=Lf(),[p,m]=M("short"),b=()=>p()==="holdings",T=Ru(),_=mf(()=>n());return f(I,{get when(){return t()},get fallback(){return f(pu,{})},get children(){return[f(I,{get when(){return!i()},get fallback(){return f(gu,{get email(){return a()},onSignOut:()=>Xr()})},get children(){var $=Nf(),E=$.firstChild,O=E.firstChild,R=O.nextSibling,S=R.nextSibling,k=S.nextSibling;return u(O,f(I,{get when(){return t()},get children(){return[(()=>{var A=Pf(),N=A.firstChild,P=N.nextSibling;return A.$$click=()=>l(!o()),u(P,a),y(()=>ne(A,"aria-expanded",o())),A})(),f(I,{get when(){return o()},get children(){return[(()=>{var A=Rf();return A.$$click=()=>l(!1),A})(),(()=>{var A=xf(),N=A.firstChild,P=N.nextSibling,w=P.nextSibling,D=w.nextSibling;return u(P,a),w.$$click=()=>{l(!1),d(!0)},D.$$click=()=>{l(!1),Xr()},A})()]}})]}})),u(R,f(Ff,{})),u(E,f(I,{get when(){return q(()=>!n.loading)()&&!n.error},get children(){return f(Uf,{get envelope(){return n()}})}}),k),u(k,f(_f,{run:_})),u($,f(I,{get when(){return n.error},get children(){var A=Of();return A.firstChild,u(A,()=>n.error.message,null),A}}),null),u($,f(yf,{run:_}),null),u($,f(I,{get when(){return b()},get children(){return[f(li,{result:()=>{var A;return(A=n())==null?void 0:A.result},tab:p,onTab:m}),f(Zh,{})]}}),null),u($,f(I,{get when(){return!b()},get children(){return f(I,{get when(){var A;return q(()=>!n.loading)()&&((A=n())==null?void 0:A.result)},get fallback(){return f(I,{get when(){return!n.loading},get children(){return Df()}})},children:A=>{const N=()=>A();return[f(Ou,{scoring:T}),f(li,{result:N,tab:p,onTab:m}),f(ri,{id:"short",active:()=>p()==="short",get tf(){var P;return(P=N().timeframes)==null?void 0:P.short},get stageError(){return ai(N(),"chains_short")},get stages(){return N().stages},get thresholds(){return N().thresholds},columns:h,scoring:T}),f(ri,{id:"medium",active:()=>p()==="medium",get tf(){var P;return(P=N().timeframes)==null?void 0:P.medium},get stageError(){return ai(N(),"chains_medium")},get stages(){return N().stages},get thresholds(){return N().thresholds},columns:h,scoring:T})]}})}}),null),$}}),f(I,{get when(){return c()},get children(){return f(wu,{onClose:()=>d(!1)})}})]}})}ve(["click"]);Ks(()=>f(Bf,{}),document.getElementById("root"));
