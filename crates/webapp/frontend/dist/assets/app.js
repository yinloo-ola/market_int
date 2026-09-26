(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const ks=!1,Es=(t,e)=>t===e,Bn=Symbol("solid-proxy"),Is=typeof Proxy=="function",Cs=Symbol("solid-track"),en={equals:Es};let ai=ui;const Le=1,tn=2,oi={owned:null,cleanups:null,context:null,owner:null},wn={};var X=null;let $n=null,Ts=null,J=null,oe=null,xe=null,gn=0;function Gt(t,e){const n=J,r=X,i=t.length===0,s=e===void 0?r:e,a=i?oi:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>pe(()=>Pt(a)));X=a,J=null;try{return Ke(o,!0)}finally{J=n,X=r}}function O(t,e){e=e?Object.assign({},en,e):en;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),ci(n,i));return[li.bind(n),r]}function As(t,e,n){const r=pn(t,e,!0,Le);yt(r)}function v(t,e,n){const r=pn(t,e,!1,Le);yt(r)}function et(t,e,n){ai=Ls;const r=pn(t,e,!1,Le);r.user=!0,xe?xe.push(r):yt(r)}function ae(t,e,n){n=n?Object.assign({},en,n):en;const r=pn(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,yt(r),li.bind(r)}function Ps(t){return t&&typeof t=="object"&&"then"in t}function Rs(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=wn,l=!1,c="initialValue"in s,d=typeof r=="function"&&ae(r);const h=new Set,[g,m]=(s.storage||O)(s.initialValue),[b,I]=O(void 0),[_,w]=O(void 0,{equals:!1}),[S,C]=O(c?"ready":"unresolved");X&&Oe(()=>{for(const x of h.keys())x.decrement();h.clear(),a=null});function T(x,$,U,W){return a===x&&(a=null,W!==void 0&&(c=!0),(x===o||$===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(W,{value:$})),o=wn,P($,U)),$}function P(x,$){Ke(()=>{$===void 0&&m(()=>x),C($!==void 0?"errored":c?"ready":"unresolved"),I($);for(const U of h.keys())U.decrement();h.clear()},!1)}function N(){const x=Os,$=g(),U=b();if(U!==void 0&&!a)throw U;return J&&J.user,$}function M(x=!0){if(x!==!1&&l)return;l=!1;const $=d?d():r;if($==null||$===!1){T(a,pe(g));return}let U;const W=o!==wn?o:pe(()=>{try{return i($,{value:g(),refetching:x})}catch(ne){U=ne}});if(U!==void 0){T(a,void 0,qt(U),$);return}else if(!Ps(W))return T(a,W,void 0,$),W;return a=W,"v"in W?(W.s===1?T(a,W.v,void 0,$):T(a,void 0,qt(W.v),$),W):(l=!0,queueMicrotask(()=>l=!1),Ke(()=>{C(c?"refreshing":"pending"),w()},!1),W.then(ne=>T(W,ne,void 0,$),ne=>T(W,void 0,qt(ne),$)))}Object.defineProperties(N,{state:{get:()=>S()},error:{get:()=>b()},loading:{get(){const x=S();return x==="pending"||x==="refreshing"}},latest:{get(){if(!c)return N();const x=b();if(x&&!a)throw x;return g()}}});let R=X;return d?As(()=>(R=X,M(!1))):M(!1),[N,{refetch:x=>xs(R,()=>M(x)),mutate:m}]}function pe(t){if(J===null)return t();const e=J;J=null;try{return t()}finally{J=e}}function Ct(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=pe(()=>e(a,i,s));return i=a,o}}function gt(t){et(()=>pe(t))}function Oe(t){return X===null||(X.cleanups===null?X.cleanups=[t]:X.cleanups.push(t)),t}function xs(t,e){const n=X,r=J;X=t,J=null;try{return Ke(e,!0)}catch(i){Yn(i)}finally{X=n,J=r}}const[Of,Nf]=O(!1);let Os;function li(){if(this.sources&&this.state)if(this.state===Le)yt(this);else{const t=oe;oe=null,Ke(()=>rn(this),!1),oe=t}if(J){const t=this.observers;if(!t||t[t.length-1]!==J){const e=t?t.length:0;J.sources?(J.sources.push(this),J.sourceSlots.push(e)):(J.sources=[this],J.sourceSlots=[e]),t?(t.push(J),this.observerSlots.push(J.sources.length-1)):(this.observers=[J],this.observerSlots=[J.sources.length-1])}}return this.value}function ci(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Ke(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=$n&&$n.running;a&&$n.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?oe.push(s):xe.push(s),s.observers&&di(s)),a||(s.state=Le)}if(oe.length>1e6)throw oe=[],new Error},!1)),e}function yt(t){if(!t.fn)return;Pt(t);const e=gn;Ns(t,t.value,e)}function Ns(t,e,n){let r;const i=X,s=J;J=X=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Le,t.owned&&t.owned.forEach(Pt),t.owned=null),t.updatedAt=n+1,Yn(a)}finally{J=s,X=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?ci(t,r):t.value=r,t.updatedAt=n)}function pn(t,e,n,r=Le,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:X,context:X?X.context:null,pure:n};return X===null||X!==oi&&(X.owned?X.owned.push(s):X.owned=[s]),s}function nn(t){if(t.state===0)return;if(t.state===tn)return rn(t);if(t.suspense&&pe(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<gn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Le)yt(t);else if(t.state===tn){const r=oe;oe=null,Ke(()=>rn(t,e[0]),!1),oe=r}}function Ke(t,e){if(oe)return t();let n=!1;e||(oe=[]),xe?n=!0:xe=[],gn++;try{const r=t();return Ds(n),r}catch(r){n||(xe=null),oe=null,Yn(r)}}function Ds(t){if(oe&&(ui(oe),oe=null),t)return;const e=xe;xe=null,e.length&&Ke(()=>ai(e),!1)}function ui(t){for(let e=0;e<t.length;e++)nn(t[e])}function Ls(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:nn(r)}for(e=0;e<n;e++)nn(t[e])}function rn(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Le?r!==e&&(!r.updatedAt||r.updatedAt<gn)&&nn(r):i===tn&&rn(r,e)}}}function di(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=tn,n.pure?oe.push(n):xe.push(n),n.observers&&di(n))}}function Pt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)Pt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)Pt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function qt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function Yn(t,e=X){throw qt(t)}const Ms=Symbol("fallback");function fr(t){for(let e=0;e<t.length;e++)t[e]()}function Us(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Oe(()=>fr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[Cs],pe(()=>{let m,b,I,_,w,S,C,T,P;if(c===0)a!==0&&(fr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Ms],i[0]=Gt(N=>(s[0]=N,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=Gt(g);a=c}else{for(I=new Array(c),_=new Array(c),o&&(w=new Array(c)),S=0,C=Math.min(a,c);S<C&&r[S]===l[S];S++);for(C=a-1,T=c-1;C>=S&&T>=S&&r[C]===l[T];C--,T--)I[T]=i[C],_[T]=s[C],o&&(w[T]=o[C]);for(m=new Map,b=new Array(T+1),h=T;h>=S;h--)P=l[h],d=m.get(P),b[h]=d===void 0?-1:d,m.set(P,h);for(d=S;d<=C;d++)P=r[d],h=m.get(P),h!==void 0&&h!==-1?(I[h]=i[d],_[h]=s[d],o&&(w[h]=o[d]),h=b[h],m.set(P,h)):s[d]();for(h=S;h<c;h++)h in I?(i[h]=I[h],s[h]=_[h],o&&(o[h]=w[h],o[h](h))):i[h]=Gt(g);i=i.slice(0,a=c),r=l.slice(0)}return i});function g(m){if(s[h]=m,o){const[b,I]=O(h);return o[h]=I,e(l[h],b)}return e(l[h])}}}function f(t,e){return pe(()=>t(e||{}))}function Wt(){return!0}const Fs={get(t,e,n){return e===Bn?n:t.get(e)},has(t,e){return e===Bn?!0:t.has(e)},set:Wt,deleteProperty:Wt,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:Wt,deleteProperty:Wt}},ownKeys(t){return t.keys()}};function Sn(t){return(t=typeof t=="function"?t():t)?t:{}}function Bs(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function Hs(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Bn in o,t[a]=typeof o=="function"?(e=!0,ae(o)):o}if(Is&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=Sn(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in Sn(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys(Sn(t[o])));return[...new Set(a)]}},Fs);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let c=l.length-1;c>=0;c--){const d=l[c];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:Bs.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const g=n[d];g&&(h.get?g.push(h.get.bind(o)):h.value!==void 0&&g.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const Vs=t=>`Stale read from <${t}>.`;function ie(t){const e="fallback"in t&&{fallback:()=>t.fallback};return ae(Us(()=>t.each,t.children,e||void 0))}function E(t){const e=t.keyed,n=ae(()=>t.when,void 0,void 0),r=e?n:ae(n,void 0,{equals:(i,s)=>!i==!s});return ae(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?pe(()=>s(e?i:()=>{if(!pe(r))throw Vs("Show");return n()})):s}return t.fallback},void 0,void 0)}const Y=t=>ae(()=>t());function Ws(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,g=1,m;for(;++h<i&&h<s&&!((m=c.get(e[h]))==null||m!==d+g);)g++;if(g>d-o){const b=e[a];for(;o<d;)t.insertBefore(n[o++],b)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const gr="_$DX_DELEGATE";function js(t,e,n,r={}){let i;return Gt(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function p(t,e,n,r){let i;const s=()=>{const o=r?document.createElementNS("http://www.w3.org/1998/Math/MathML","template"):document.createElement("template");return o.innerHTML=t,n?o.content.firstChild.firstChild:r?o.firstChild:o.content.firstChild},a=e?()=>pe(()=>document.importNode(i||(i=s()),!0)):()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function ve(t,e=window.document){const n=e[gr]||(e[gr]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,Gs))}}function ee(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function ue(t,e){e==null?t.removeAttribute("class"):t.className=e}function j(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function tt(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function zs(t,e,n){return pe(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return sn(t,e,r,n);v(i=>sn(t,e(),i,n),r)}function Gs(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function sn(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=ot(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=ot(t,n,r);else{if(s==="function")return v(()=>{let o=e();for(;typeof o=="function";)o=o();n=sn(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Hn(o,e,n,i))return v(()=>n=sn(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=ot(t,n,r),a)return n}else l?n.length===0?pr(t,o,r):Ws(t,n,o):(n&&ot(t),pr(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=ot(t,n,r,e);ot(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Hn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Hn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=Hn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function pr(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function ot(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let Kt=null;function qs(t){Kt=t}async function de(t,e={}){if(!Kt)return fetch(t,e);const n=new Headers(e.headers??{}),r=await Kt(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await Kt(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function hi(){const t=await de("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function Ks(){return de("/api/me")}async function Js(){const t=await de("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function Ys(t){const e=await de("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function Xs(t){const e=await de("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function Qs(){return await de("/api/run",{method:"POST"})}async function Zs(){return de("/api/progress")}async function ea(){const t=await de("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function kn(t){const e=await de("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function En(t){const e=await de(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function ta(t,e){const n=await de(`/api/holdings/${encodeURIComponent(t)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pool_id:e})}),r=await n.json().catch(()=>null);if(!n.ok)throw new Error((r==null?void 0:r.error)??`PATCH /api/holdings/${t} -> ${n.status}`);return r}async function na(){const t=await de("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function mr(t){const e=await de("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function ra(t){const e=await de("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const ia=()=>{};var _r={};/**
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
 */const fi=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},sa=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},gi={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let g=(o&15)<<2|c>>6,m=c&63;l||(m=64,a||(g=64)),r.push(n[d],n[h],n[g],n[m])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(fi(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):sa(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||c==null||h==null)throw new aa;const g=s<<2|o>>4;if(r.push(g),c!==64){const m=o<<4&240|c>>2;if(r.push(m),h!==64){const b=c<<6&192|h;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class aa extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const oa=function(t){const e=fi(t);return gi.encodeByteArray(e,!0)},pi=function(t){return oa(t).replace(/\./g,"")},mi=function(t){try{return gi.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function la(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const ca=()=>la().__FIREBASE_DEFAULTS__,ua=()=>{if(typeof process>"u"||typeof _r>"u")return;const t=_r.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},da=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&mi(t[1]);return e&&JSON.parse(e)},Xn=()=>{try{return ia()||ca()||ua()||da()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},ha=t=>{var e,n;return(n=(e=Xn())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},_i=()=>{var t;return(t=Xn())==null?void 0:t.config},bi=t=>{var e;return(e=Xn())==null?void 0:e[`_${t}`]};/**
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
 */class yi{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function le(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function fa(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(le())}function ga(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function pa(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function ma(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function _a(){const t=le();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function ba(){try{return typeof indexedDB=="object"}catch{return!1}}function ya(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const va="FirebaseError";class Je extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=va,Object.setPrototypeOf(this,Je.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Dt.prototype.create)}}class Dt{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?wa(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new Je(i,o,r)}}function wa(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function $a(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function pt(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(br(s)&&br(a)){if(!pt(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function br(t){return t!==null&&typeof t=="object"}/**
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
 */function Lt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function St(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function kt(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Sa(t,e){const n=new ka(t,e);return n.subscribe.bind(n)}class ka{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Ea(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=In),i.error===void 0&&(i.error=In),i.complete===void 0&&(i.complete=In);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Ea(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function In(){}/**
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
 */function Qn(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ia(t){return(await fetch(t,{credentials:"include"})).ok}class mt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */class Ca{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new yi;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Aa(e))try{this.getOrInitializeService({instanceIdentifier:Qe})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Qe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Qe){return this.instances.has(e)}getOptions(e=Qe){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Ta(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Qe){return this.component?this.component.multipleInstances?e:Qe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ta(t){return t===Qe?void 0:t}function Aa(t){return t.instantiationMode==="EAGER"}/**
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
 */class Pa{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Ca(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var q;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(q||(q={}));const Ra={debug:q.DEBUG,verbose:q.VERBOSE,info:q.INFO,warn:q.WARN,error:q.ERROR,silent:q.SILENT},xa=q.INFO,Oa={[q.DEBUG]:"log",[q.VERBOSE]:"log",[q.INFO]:"info",[q.WARN]:"warn",[q.ERROR]:"error"},Na=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Oa[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class vi{constructor(e){this.name=e,this._logLevel=xa,this._logHandler=Na,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in q))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ra[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,q.DEBUG,...e),this._logHandler(this,q.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,q.VERBOSE,...e),this._logHandler(this,q.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,q.INFO,...e),this._logHandler(this,q.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,q.WARN,...e),this._logHandler(this,q.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,q.ERROR,...e),this._logHandler(this,q.ERROR,...e)}}const Da=(t,e)=>e.some(n=>t instanceof n);let yr,vr;function La(){return yr||(yr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ma(){return vr||(vr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const wi=new WeakMap,Vn=new WeakMap,$i=new WeakMap,Cn=new WeakMap,Zn=new WeakMap;function Ua(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Ge(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&wi.set(n,t)}).catch(()=>{}),Zn.set(e,t),e}function Fa(t){if(Vn.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Vn.set(t,e)}let Wn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Vn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||$i.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Ge(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Ba(t){Wn=t(Wn)}function Ha(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Tn(this),e,...n);return $i.set(r,e.sort?e.sort():[e]),Ge(r)}:Ma().includes(t)?function(...e){return t.apply(Tn(this),e),Ge(wi.get(this))}:function(...e){return Ge(t.apply(Tn(this),e))}}function Va(t){return typeof t=="function"?Ha(t):(t instanceof IDBTransaction&&Fa(t),Da(t,La())?new Proxy(t,Wn):t)}function Ge(t){if(t instanceof IDBRequest)return Ua(t);if(Cn.has(t))return Cn.get(t);const e=Va(t);return e!==t&&(Cn.set(t,e),Zn.set(e,t)),e}const Tn=t=>Zn.get(t);function Wa(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Ge(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Ge(a.result),l.oldVersion,l.newVersion,Ge(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const ja=["get","getKey","getAll","getAllKeys","count"],za=["put","add","delete","clear"],An=new Map;function wr(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(An.get(e))return An.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=za.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||ja.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(o.shift())),(await Promise.all([c[n](...o),i&&l.done]))[0]};return An.set(e,s),s}Ba(t=>({...t,get:(e,n,r)=>wr(e,n)||t.get(e,n,r),has:(e,n)=>!!wr(e,n)||t.has(e,n)}));/**
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
 */class Ga{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(qa(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function qa(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const jn="@firebase/app",$r="0.16.1";/**
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
 */const Ne=new vi("@firebase/app"),Ka="@firebase/app-compat",Ja="@firebase/analytics-compat",Ya="@firebase/analytics",Xa="@firebase/app-check-compat",Qa="@firebase/app-check",Za="@firebase/auth",eo="@firebase/auth-compat",to="@firebase/database",no="@firebase/data-connect",ro="@firebase/database-compat",io="@firebase/functions",so="@firebase/functions-compat",ao="@firebase/installations",oo="@firebase/installations-compat",lo="@firebase/messaging",co="@firebase/messaging-compat",uo="@firebase/performance",ho="@firebase/performance-compat",fo="@firebase/remote-config",go="@firebase/remote-config-compat",po="@firebase/storage",mo="@firebase/storage-compat",_o="@firebase/firestore",bo="@firebase/ai",yo="@firebase/firestore-compat",vo="firebase",wo="12.18.0";/**
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
 */const zn="[DEFAULT]",$o={[jn]:"fire-core",[Ka]:"fire-core-compat",[Ya]:"fire-analytics",[Ja]:"fire-analytics-compat",[Qa]:"fire-app-check",[Xa]:"fire-app-check-compat",[Za]:"fire-auth",[eo]:"fire-auth-compat",[to]:"fire-rtdb",[no]:"fire-data-connect",[ro]:"fire-rtdb-compat",[io]:"fire-fn",[so]:"fire-fn-compat",[ao]:"fire-iid",[oo]:"fire-iid-compat",[lo]:"fire-fcm",[co]:"fire-fcm-compat",[uo]:"fire-perf",[ho]:"fire-perf-compat",[fo]:"fire-rc",[go]:"fire-rc-compat",[po]:"fire-gcs",[mo]:"fire-gcs-compat",[_o]:"fire-fst",[yo]:"fire-fst-compat",[bo]:"fire-vertex","fire-js":"fire-js",[vo]:"fire-js-all"};/**
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
 */const an=new Map,So=new Map,Gn=new Map;function Sr(t,e){try{t.container.addComponent(e)}catch(n){Ne.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Rt(t){const e=t.name;if(Gn.has(e))return Ne.debug(`There were multiple attempts to register component ${e}.`),!1;Gn.set(e,t);for(const n of an.values())Sr(n,t);for(const n of So.values())Sr(n,t);return!0}function Si(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function fe(t){return t==null?!1:t.settings!==void 0}/**
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
 */const ko={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ce=new Dt("app","Firebase",ko);/**
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
 */class Eo{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new mt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ce.create("app-deleted",{appName:this._name})}}/**
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
 */const Mt=wo;function ki(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:zn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw Ce.create("bad-app-name",{appName:String(i)});if(n||(n=_i()),!n)throw Ce.create("no-options");const s=an.get(i);if(s)if(pt(n,s.options)){if(pt(r,s.config))return s;throw Ce.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw Ce.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new Pa(i);for(const l of Gn.values())a.addComponent(l);const o=new Eo(n,r,a);return an.set(i,o),o}function Io(t=zn){const e=an.get(t);if(!e&&t===zn&&_i())return ki();if(!e)throw Ce.create("no-app",{appName:t});return e}function ut(t,e,n){let r=$o[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ne.warn(a.join(" "));return}Rt(new mt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Co="firebase-heartbeat-database",To=1,xt="firebase-heartbeat-store";let Pn=null;function Ei(){return Pn||(Pn=Wa(Co,To,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(xt)}catch(n){console.warn(n)}}}}).catch(t=>{throw Ce.create("idb-open",{originalErrorMessage:t.message})})),Pn}async function Ao(t){try{const n=(await Ei()).transaction(xt),r=await n.objectStore(xt).get(Ii(t));return await n.done,r}catch(e){if(e instanceof Je)Ne.warn(e.message);else{const n=Ce.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ne.warn(n.message)}}}async function kr(t,e){try{const r=(await Ei()).transaction(xt,"readwrite");await r.objectStore(xt).put(e,Ii(t)),await r.done}catch(n){if(n instanceof Je)Ne.warn(n.message);else{const r=Ce.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Ne.warn(r.message)}}}function Ii(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Po=1024,Ro=30;class xo{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new No(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Er();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Ro){const a=Do(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Ne.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Er(),{heartbeatsToSend:r,unsentEntries:i}=Oo(this._heartbeatsCache.heartbeats),s=pi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Ne.warn(n),""}}}function Er(){return new Date().toISOString().substring(0,10)}function Oo(t,e=Po){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Ir(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Ir(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class No{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ba()?ya().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Ao(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return kr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return kr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Ir(t){return pi(JSON.stringify({version:2,heartbeats:t})).length}function Do(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function Lo(t){Rt(new mt("platform-logger",e=>new Ga(e),"PRIVATE")),Rt(new mt("heartbeat",e=>new xo(e),"PRIVATE")),ut(jn,$r,t),ut(jn,$r,"esm2020"),ut("fire-js","")}/**
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
 */Lo("");var Mo="firebase",Uo="12.18.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ut(Mo,Uo,"app");function Ci(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Fo=Ci,Ti=new Dt("auth","Firebase",Ci());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const on=new vi("@firebase/auth");function Ai(t,...e){on.logLevel<=q.WARN&&on.warn(`Auth (${Mt}): ${t}`,...e)}function Jt(t,...e){on.logLevel<=q.ERROR&&on.error(`Auth (${Mt}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function me(t,...e){throw tr(t,...e)}function ye(t,...e){return tr(t,...e)}function er(t,e,n){const r={...Fo(),[e]:n};return new Dt("auth","Firebase",r).create(e,{appName:t.name})}function $e(t){return er(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Pi(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&me(t,"argument-error"),er(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function tr(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return Ti.create(t,...e)}function H(t,e,...n){if(!t)throw tr(e,...n)}function Te(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Jt(e),new Error(e)}function De(t,e){t||Te(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qn(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function Bo(){return Cr()==="http:"||Cr()==="https:"}function Cr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ho(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Bo()||pa()||"connection"in navigator)?navigator.onLine:!0}function Vo(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ut{constructor(e,n){this.shortDelay=e,this.longDelay=n,De(n>e,"Short delay should be less than long delay!"),this.isMobile=fa()||ma()}get(){return Ho()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nr(t,e){De(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ri{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Te("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Te("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Te("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wo={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jo=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],zo=new Ut(3e4,6e4);function Ye(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function Xe(t,e,n,r,i={}){return xi(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Lt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:l,...s};return ga()||(c.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&Qn(t.emulatorConfig.host)&&(c.credentials="include"),Ri.fetch()(await Oi(t,t.config.apiHost,n,o),c)})}async function xi(t,e,n){t._canInitEmulator=!1;const r={...Wo,...e};try{const i=new qo(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw jt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,c]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw jt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw jt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw jt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw er(t,d,c);me(t,d)}}catch(i){if(i instanceof Je)throw i;me(t,"network-request-failed",{message:String(i)})}}async function Ft(t,e,n,r,i={}){const s=await Xe(t,e,n,r,i);return"mfaPendingCredential"in s&&me(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function Oi(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?nr(t.config,i):`${t.config.apiScheme}://${i}`;return jo.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function Go(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class qo{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(ye(this.auth,"network-request-failed")),zo.get())})}}function jt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=ye(t,e,r);return i.customData._tokenResponse=n,i}function Tr(t){return t!==void 0&&t.enterprise!==void 0}class Ko{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Go(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Jo(t,e){return Xe(t,"GET","/v2/recaptchaConfig",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yo(t,e){return Xe(t,"POST","/v1/accounts:delete",e)}async function ln(t,e){return Xe(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tt(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Xo(t,e=!1){const n=Me(t),r=await n.getIdToken(e),i=rr(r);H(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Tt(Rn(i.auth_time)),issuedAtTime:Tt(Rn(i.iat)),expirationTime:Tt(Rn(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Rn(t){return Number(t)*1e3}function rr(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Jt("JWT malformed, contained fewer than 3 sections"),null;try{const i=mi(n);return i?JSON.parse(i):(Jt("Failed to decode base64 JWT payload"),null)}catch(i){return Jt("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Ar(t){const e=rr(t);return H(e,"internal-error"),H(typeof e.exp<"u","internal-error"),H(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ot(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Je&&Qo(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Qo({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zo{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Tt(this.lastLoginAt),this.creationTime=Tt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function cn(t){var h;const e=t.auth,n=await t.getIdToken(),r=await Ot(t,ln(e,{idToken:n}));H(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?Ni(i.providerUserInfo):[],a=tl(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),c=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Kn(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function el(t){const e=Me(t);await cn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function tl(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Ni(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nl(t,e){const n=await xi(t,{},async()=>{const r=Lt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await Oi(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&Qn(t.emulatorConfig.host)&&(l.credentials="include"),Ri.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function rl(t,e){return Xe(t,"POST","/v2/accounts:revokeToken",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){H(e.idToken,"internal-error"),H(typeof e.idToken<"u","internal-error"),H(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ar(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){H(e.length!==0,"internal-error");const n=Ar(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(H(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await nl(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new dt;return r&&(H(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(H(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(H(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new dt,this.toJSON())}_performRefresh(){return Te("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function He(t,e){H(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class be{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Zo(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Kn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Ot(this,this.stsTokenManager.getToken(this.auth,e));return H(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Xo(this,e)}reload(){return el(this)}_assign(e){this!==e&&(H(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new be({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){H(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await cn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(fe(this.auth.app))return Promise.reject($e(this.auth));const e=await this.getIdToken();return await Ot(this,Yo(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,c=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:g,isAnonymous:m,providerData:b,stsTokenManager:I}=n;H(h&&I,e,"internal-error");const _=dt.fromJSON(this.name,I);H(typeof h=="string",e,"internal-error"),He(r,e.name),He(i,e.name),H(typeof g=="boolean",e,"internal-error"),H(typeof m=="boolean",e,"internal-error"),He(s,e.name),He(a,e.name),He(o,e.name),He(l,e.name),He(c,e.name),He(d,e.name);const w=new be({uid:h,auth:e,email:i,emailVerified:g,displayName:r,isAnonymous:m,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:_,createdAt:c,lastLoginAt:d});return b&&Array.isArray(b)&&(w.providerData=b.map(S=>({...S}))),l&&(w._redirectEventId=l),w}static async _fromIdTokenResponse(e,n,r=!1){const i=new dt;i.updateFromServerResponse(n);const s=new be({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await cn(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];H(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Ni(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new dt;o.updateFromIdToken(r);const l=new be({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Kn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pr=new Map;function Ae(t){De(t instanceof Function,"Expected a class definition");let e=Pr.get(t);return e?(De(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Pr.set(t,e),e)}/**
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
 */class Di{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Di.type="NONE";const Rr=Di;/**
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
 */function Yt(t,e,n){return`firebase:${t}:${e}:${n}`}class ht{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Yt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Yt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await ln(this.auth,{idToken:e}).catch(()=>{});return n?be._fromGetAccountInfoResponse(this.auth,n,e):null}return be._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new ht(Ae(Rr),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||Ae(Rr);const a=Yt(r,e.config.apiKey,e.name);let o=null;for(const c of n)try{const d=await c._get(a);if(d){let h;if(typeof d=="string"){const g=await ln(e,{idToken:d}).catch(()=>{});if(!g)break;h=await be._fromGetAccountInfoResponse(e,g,d)}else h=be._fromJSON(e,d);c!==s&&(o=h),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new ht(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(a)}catch{}})),new ht(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xr(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Fi(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Li(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Hi(e))return"Blackberry";if(Vi(e))return"Webos";if(Mi(e))return"Safari";if((e.includes("chrome/")||Ui(e))&&!e.includes("edge/"))return"Chrome";if(Bi(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Li(t=le()){return/firefox\//i.test(t)}function Mi(t=le()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ui(t=le()){return/crios\//i.test(t)}function Fi(t=le()){return/iemobile/i.test(t)}function Bi(t=le()){return/android/i.test(t)}function Hi(t=le()){return/blackberry/i.test(t)}function Vi(t=le()){return/webos/i.test(t)}function ir(t=le()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function il(t=le()){var e;return ir(t)&&!!((e=window.navigator)!=null&&e.standalone)}function sl(){return _a()&&document.documentMode===10}function Wi(t=le()){return ir(t)||Bi(t)||Vi(t)||Hi(t)||/windows phone/i.test(t)||Fi(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ji(t,e=[]){let n;switch(t){case"Browser":n=xr(le());break;case"Worker":n=`${xr(le())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Mt}/${r}`}/**
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
 */class al{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function ol(t,e={}){return Xe(t,"GET","/v2/passwordPolicy",Ye(t,e))}/**
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
 */const ll=6;class cl{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??ll,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ul{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Or(this),this.idTokenSubscription=new Or(this),this.beforeStateQueue=new al(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Ti,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Ae(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await ht.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await ln(this,{idToken:e}),r=await be._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(fe(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return H(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await cn(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Vo()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(fe(this.app))return Promise.reject($e(this));const n=e?Me(e):null;return n&&H(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&H(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return fe(this.app)?Promise.reject($e(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return fe(this.app)?Promise.reject($e(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ae(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await ol(this),n=new cl(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Dt("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await rl(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Ae(e)||this._popupRedirectResolver;H(n,this,"argument-error"),this.redirectPersistenceManager=await ht.create(this,[Ae(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(H(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return H(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=ji(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(fe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&Ai(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Ue(t){return Me(t)}class Or{constructor(e){this.auth=e,this.observer=null,this.addObserver=Sa(n=>this.observer=n)}get next(){return H(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let mn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function dl(t){mn=t}function zi(t){return mn.loadJS(t)}function hl(){return mn.recaptchaEnterpriseScript}function fl(){return mn.gapiScript}function gl(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class pl{constructor(){this.enterprise=new ml}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class ml{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
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
 */const _l="recaptcha-enterprise",Gi="NO_RECAPTCHA",Nr="onFirebaseAuthREInstanceReady";class Ve{constructor(e){this.type=_l,this.auth=Ue(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{Jo(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const c=new Ko(l);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,a(c.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;Tr(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(c=>{a(c)}).catch(()=>{a(Gi)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new pl().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&Tr(window.grecaptcha)&&Ve.scriptInjectionDeferred)await Ve.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=hl();l.length!==0&&(l+=o+`&onload=${Nr}`),Ve.scriptInjectionDeferred=new yi,window[Nr]=()=>{var c;(c=Ve.scriptInjectionDeferred)==null||c.resolve()},zi(l).then(()=>{var c;return(c=Ve.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{i(o,s,a)}).catch(c=>{a(c)})}}).catch(o=>{a(o)})})}}Ve.scriptInjectionDeferred=null;async function Dr(t,e,n,r=!1,i=!1){const s=new Ve(t);let a;if(i)a=Gi;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,c=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Jn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Dr(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Dr(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bl(t,e){const n=Si(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(pt(s,e??{}))return i;me(i,"already-initialized")}return n.initialize({options:e})}function yl(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Ae);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function vl(t,e,n){const r=Ue(t);H(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=qi(e),{host:a,port:o}=wl(e),l=o===null?"":`:${o}`,c={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){H(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),H(pt(c,r.config.emulator)&&pt(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,Qn(a)?Ia(`${s}//${a}${l}`):$l()}function qi(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function wl(t){const e=qi(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Lr(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Lr(a)}}}function Lr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function $l(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sr{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Te("not implemented")}_getIdTokenResponse(e){return Te("not implemented")}_linkToIdToken(e,n){return Te("not implemented")}_getReauthenticationResolver(e){return Te("not implemented")}}async function Sl(t,e){return Xe(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kl(t,e){return Ft(t,"POST","/v1/accounts:signInWithPassword",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function El(t,e){return Ft(t,"POST","/v1/accounts:signInWithEmailLink",Ye(t,e))}async function Il(t,e){return Ft(t,"POST","/v1/accounts:signInWithEmailLink",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt extends sr{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new Nt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new Nt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Jn(e,n,"signInWithPassword",kl);case"emailLink":return El(e,{email:this._email,oobCode:this._password});default:me(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Jn(e,r,"signUpPassword",Sl);case"emailLink":return Il(e,{idToken:n,email:this._email,oobCode:this._password});default:me(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ft(t,e){return Ft(t,"POST","/v1/accounts:signInWithIdp",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cl="http://localhost";class rt extends sr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new rt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):me("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new rt(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return ft(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,ft(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,ft(e,n)}buildRequest(){const e={requestUri:Cl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Lt(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tl(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Al(t){const e=St(kt(t)).link,n=e?St(kt(e)).deep_link_id:null,r=St(kt(t)).deep_link_id;return(r?St(kt(r)).link:null)||r||n||e||t}class ar{constructor(e){const n=St(kt(e)),r=n.apiKey??null,i=n.oobCode??null,s=Tl(n.mode??null);H(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=Al(e);try{return new ar(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(){this.providerId=vt.PROVIDER_ID}static credential(e,n){return Nt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=ar.parseLink(n);return H(r,"argument-error"),Nt._fromEmailAndCode(e,r.code,r.tenantId)}}vt.PROVIDER_ID="password";vt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";vt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _n{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Bt extends _n{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We extends Bt{constructor(){super("facebook.com")}static credential(e){return rt._fromParams({providerId:We.PROVIDER_ID,signInMethod:We.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return We.credentialFromTaggedObject(e)}static credentialFromError(e){return We.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return We.credential(e.oauthAccessToken)}catch{return null}}}We.FACEBOOK_SIGN_IN_METHOD="facebook.com";We.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie extends Bt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return rt._fromParams({providerId:Ie.PROVIDER_ID,signInMethod:Ie.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Ie.credentialFromTaggedObject(e)}static credentialFromError(e){return Ie.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Ie.credential(n,r)}catch{return null}}}Ie.GOOGLE_SIGN_IN_METHOD="google.com";Ie.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je extends Bt{constructor(){super("github.com")}static credential(e){return rt._fromParams({providerId:je.PROVIDER_ID,signInMethod:je.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return je.credentialFromTaggedObject(e)}static credentialFromError(e){return je.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return je.credential(e.oauthAccessToken)}catch{return null}}}je.GITHUB_SIGN_IN_METHOD="github.com";je.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze extends Bt{constructor(){super("twitter.com")}static credential(e,n){return rt._fromParams({providerId:ze.PROVIDER_ID,signInMethod:ze.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ze.credentialFromTaggedObject(e)}static credentialFromError(e){return ze.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return ze.credential(n,r)}catch{return null}}}ze.TWITTER_SIGN_IN_METHOD="twitter.com";ze.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pl(t,e){return Ft(t,"POST","/v1/accounts:signUp",Ye(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await be._fromIdTokenResponse(e,r,i),a=Mr(r);return new it({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Mr(r);return new it({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Mr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class un extends Je{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,un.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new un(e,n,r,i)}}function Ki(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?un._fromErrorAndOperation(t,s,e,r):s})}async function Rl(t,e,n=!1){const r=await Ot(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return it._forOperation(t,"link",r)}/**
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
 */async function xl(t,e,n=!1){const{auth:r}=t;if(fe(r.app))return Promise.reject($e(r));const i="reauthenticate";try{const s=await Ot(t,Ki(r,i,e,t),n);H(s.idToken,r,"internal-error");const a=rr(s.idToken);H(a,r,"internal-error");const{sub:o}=a;return H(t.uid===o,r,"user-mismatch"),it._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&me(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ji(t,e,n=!1){if(fe(t.app))return Promise.reject($e(t));const r="signIn",i=await Ki(t,r,e),s=await it._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Ol(t,e){return Ji(Ue(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yi(t){const e=Ue(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Nl(t,e,n){if(fe(t.app))return Promise.reject($e(t));const r=Ue(t),a=await Jn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Pl).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Yi(t),l}),o=await it._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function Dl(t,e,n){return fe(t.app)?Promise.reject($e(t)):Ol(Me(t),vt.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Yi(t),r})}function Ll(t,e,n,r){return Me(t).onIdTokenChanged(e,n,r)}function Ml(t,e,n){return Me(t).beforeAuthStateChanged(e,n)}function Ul(t,e,n,r){return Me(t).onAuthStateChanged(e,n,r)}function Fl(t){return Me(t).signOut()}const dn="__sak";/**
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
 */class Xi{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(dn,"1"),this.storage.removeItem(dn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bl=1e3,Hl=10;class Qi extends Xi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Wi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);sl()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Hl):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Bl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Qi.type="LOCAL";const Vl=Qi;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi extends Xi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Zi.type="SESSION";const es=Zi;/**
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
 */function Wl(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class bn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new bn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async c=>c(n.origin,s)),l=await Wl(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}bn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function or(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class jl{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const c=or("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const g=h;if(g.data.eventId===c)switch(g.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(g.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Se(){return window}function zl(t){Se().location.href=t}/**
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
 */function ts(){return typeof Se().WorkerGlobalScope<"u"&&typeof Se().importScripts=="function"}async function Gl(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function ql(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function Kl(){return ts()?self:null}/**
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
 */const ns="firebaseLocalStorageDb",Jl=1,hn="firebaseLocalStorage",rs="fbase_key";class Ht{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function yn(t,e){return t.transaction([hn],e?"readwrite":"readonly").objectStore(hn)}function Yl(){const t=indexedDB.deleteDatabase(ns);return new Ht(t).toPromise()}function is(){const t=indexedDB.open(ns,Jl);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(hn,{keyPath:rs})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(hn)?e(r):(r.close(),await Yl(),e(await is()))})})}async function Ur(t,e,n){const r=yn(t,!0).put({[rs]:e,value:n});return new Ht(r).toPromise()}async function Xl(t,e){const n=yn(t,!1).get(e),r=await new Ht(n).toPromise();return r===void 0?null:r.value}function Fr(t,e){const n=yn(t,!0).delete(e);return new Ht(n).toPromise()}const Ql=800,Zl=3;class ss{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=is(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>Zl)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return ts()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=bn._getInstance(Kl()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await Gl(),!this.activeServiceWorker)return;this.sender=new jl(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||ql()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Ur(e,dn,"1"),await Fr(e,dn)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Ur(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>Xl(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Fr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=yn(i,!1).getAll();return new Ht(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||Ai(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Ql)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}ss.type="LOCAL";const ec=ss;new Ut(3e4,6e4);/**
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
 */function lr(t,e){return e?Ae(e):(H(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class cr extends sr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ft(e,this._buildIdpRequest())}_linkToIdToken(e,n){return ft(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return ft(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function tc(t){return Ji(t.auth,new cr(t),t.bypassAuthState)}function nc(t){const{auth:e,user:n}=t;return H(n,e,"internal-error"),xl(n,new cr(t),t.bypassAuthState)}async function rc(t){const{auth:e,user:n}=t;return H(n,e,"internal-error"),Rl(n,new cr(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class as{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return tc;case"linkViaPopup":case"linkViaRedirect":return rc;case"reauthViaPopup":case"reauthViaRedirect":return nc;default:me(this.auth,"internal-error")}}resolve(e){De(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){De(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ic=new Ut(2e3,1e4);async function sc(t,e,n){if(fe(t.app))return Promise.reject(ye(t,"operation-not-supported-in-this-environment"));const r=Ue(t);Pi(t,e,_n);const i=lr(r,n);return new Ze(r,"signInViaPopup",e,i).executeNotNull()}class Ze extends as{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Ze.currentPopupAction&&Ze.currentPopupAction.cancel(),Ze.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return H(e,this.auth,"internal-error"),e}async onExecution(){De(this.filter.length===1,"Popup operations only handle one event");const e=or();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(ye(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(ye(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ze.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ye(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,ic.get())};e()}}Ze.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ac="pendingRedirect",Xt=new Map;class oc extends as{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Xt.get(this.auth._key());if(!e){try{const r=await lc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Xt.set(this.auth._key(),e)}return this.bypassAuthState||Xt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function lc(t,e){const n=ls(e),r=os(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function cc(t,e){return os(t)._set(ls(e),"true")}function uc(t,e){Xt.set(t._key(),e)}function os(t){return Ae(t._redirectPersistence)}function ls(t){return Yt(ac,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dc(t,e,n){return hc(t,e,n)}async function hc(t,e,n){if(fe(t.app))return Promise.reject($e(t));const r=Ue(t);Pi(t,e,_n),await r._initializationPromise;const i=lr(r,n);return await cc(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function fc(t,e,n=!1){if(fe(t.app))return Promise.reject($e(t));const r=Ue(t),i=lr(r,e),a=await new oc(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gc=600*1e3;class pc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!mc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!cs(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(ye(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=gc&&this.cachedEventUids.clear(),this.cachedEventUids.has(Br(e))}saveEventToCache(e){this.cachedEventUids.add(Br(e)),this.lastProcessedEventTime=Date.now()}}function Br(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function cs({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function mc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return cs(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _c(t,e={}){return Xe(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,yc=/^https?/;async function vc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await _c(t);for(const n of e)try{if(wc(n))return}catch{}me(t,"unauthorized-domain")}function wc(t){const e=qn(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!yc.test(n))return!1;if(bc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const $c=new Ut(3e4,6e4);function Hr(){const t=Se().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Sc(t){return new Promise((e,n)=>{var i,s,a;function r(){Hr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Hr(),n(ye(t,"network-request-failed"))},timeout:$c.get()})}if((s=(i=Se().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=Se().gapi)!=null&&a.load)r();else{const o=gl("iframefcb");return Se()[o]=()=>{gapi.load?r():n(ye(t,"network-request-failed"))},zi(`${fl()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw Qt=null,e})}let Qt=null;function kc(t){return Qt=Qt||Sc(t),Qt}/**
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
 */const Ec=new Ut(5e3,15e3),Ic="__/auth/iframe",Cc="emulator/auth/iframe",Tc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Ac=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Pc(t){const e=t.config;H(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?nr(e,Cc):`https://${t.config.authDomain}/${Ic}`,r={apiKey:e.apiKey,appName:t.name,v:Mt},i=Ac.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Lt(r).slice(1)}`}async function Rc(t){const e=await kc(t),n=Se().gapi;return H(n,t,"internal-error"),e.open({where:document.body,url:Pc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Tc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=ye(t,"network-request-failed"),o=Se().setTimeout(()=>{s(a)},Ec.get());function l(){Se().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
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
 */const xc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Oc=500,Nc=600,Dc="_blank",Lc="http://localhost";class Vr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Mc(t,e,n,r=Oc,i=Nc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...xc,width:r.toString(),height:i.toString(),top:s,left:a},c=le().toLowerCase();n&&(o=Ui(c)?Dc:n),Li(c)&&(e=e||Lc,l.scrollbars="yes");const d=Object.entries(l).reduce((g,[m,b])=>`${g}${m}=${b},`,"");if(il(c)&&o!=="_self")return Uc(e||"",o),new Vr(null);const h=window.open(e||"",o,d);H(h,t,"popup-blocked");try{h.focus()}catch{}return new Vr(h)}function Uc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const Fc="__/auth/handler",Bc="emulator/auth/handler",Hc=encodeURIComponent("fac");async function Wr(t,e,n,r,i,s){H(t.config.authDomain,t,"auth-domain-config-required"),H(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Mt,eventId:i};if(e instanceof _n){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",$a(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Bt){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),c=l?`#${Hc}=${encodeURIComponent(l)}`:"";return`${Vc(t)}?${Lt(o).slice(1)}${c}`}function Vc({config:t}){return t.emulator?nr(t,Bc):`https://${t.authDomain}/${Fc}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xn="webStorageSupport";class Wc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=es,this._completeRedirectFn=fc,this._overrideRedirectResult=uc}async _openPopup(e,n,r,i){var a;De((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Wr(e,n,r,qn(),i);return Mc(e,s,or())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Wr(e,n,r,qn(),i);return zl(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(De(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Rc(e),r=new pc(e);return n.register("authEvent",i=>(H(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(xn,{type:xn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[xn];s!==void 0&&n(!!s),me(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=vc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Wi()||Mi()||ir()}}const jc=Wc;var jr="@firebase/auth",zr="1.13.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zc{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){H(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gc(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function qc(t){Rt(new mt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;H(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:ji(t)},c=new ul(r,i,s,l);return yl(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Rt(new mt("auth-internal",e=>{const n=Ue(e.getProvider("auth").getImmediate());return(r=>new zc(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),ut(jr,zr,Gc(t)),ut(jr,zr,"esm2020")}/**
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
 */const Kc=300,Jc=bi("authIdTokenMaxAge")||Kc;let Gr=null;const Yc=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Jc)return;const i=n==null?void 0:n.token;Gr!==i&&(Gr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Xc(t=Io()){const e=Si(t,"auth");if(e.isInitialized())return e.getImmediate();const n=bl(t,{popupRedirectResolver:jc,persistence:[ec,Vl,es]}),r=bi("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=Yc(s.toString());Ml(n,a,()=>a(n.currentUser)),Ll(n,o=>a(o))}}const i=ha("auth");return i&&vl(n,`http://${i}`),n}function Qc(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}dl({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=ye("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",Qc().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});qc("Browser");const Zc={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},Ee=Zc,_t=!!Ee.VITE_FIREBASE_APP_ID;let On=null;function lt(){if(!_t)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!On){const t=ki({apiKey:Ee.VITE_FIREBASE_API_KEY,authDomain:Ee.VITE_FIREBASE_AUTH_DOMAIN,projectId:Ee.VITE_FIREBASE_PROJECT_ID,appId:Ee.VITE_FIREBASE_APP_ID,...Ee.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:Ee.VITE_FIREBASE_STORAGE_BUCKET},...Ee.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:Ee.VITE_FIREBASE_MESSAGING_SENDER_ID}});On=Xc(t)}return On}function qr(){return new Ie}async function Kr(){if(!_t)return;const t=lt();t.currentUser&&await Fl(t)}var eu=p(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),tu=p('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),nu=p("<button type=button class=gate-toggle>"),ru=p("<div class=gate-or>── or ──"),iu=p("<button type=button class=btn>Continue with Google"),su=p("<div class=gate-error role=alert>"),au=p("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),ou=p("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),lu=p("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const cu={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Jr(t){const e=(t==null?void 0:t.code)??"";return cu[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function uu(t){return(()=>{var e=eu(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),j(l,"click",t.onSignOut),e})()}function du(){const[t,e]=O("signin"),[n,r]=O(""),[i,s]=O(""),[a,o]=O(!1),[l,c]=O("");qs(async g=>{if(!_t)return null;const m=lt().currentUser;return m?await m.getIdToken(g):null});async function d(g){if(g.preventDefault(),!a()){o(!0),c("");try{const m=lt();t()==="create"?await Nl(m,n(),i()):await Dl(m,n(),i())}catch(m){c(Jr(m))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await sc(lt(),qr())}catch(g){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(g==null?void 0:g.code)){await dc(lt(),qr());return}c(Jr(g))}finally{o(!1)}}}return(()=>{var g=au(),m=g.firstChild;return m.firstChild,u(m,f(E,{when:_t,get fallback(){return[ou(),lu()]},get children(){return[(()=>{var b=tu(),I=b.firstChild,_=I.firstChild,w=_.nextSibling,S=I.nextSibling,C=S.firstChild,T=C.nextSibling,P=S.nextSibling;return b.addEventListener("submit",d),w.$$input=N=>r(N.currentTarget.value),T.$$input=N=>s(N.currentTarget.value),u(P,(()=>{var N=Y(()=>!!a());return()=>N()?"Working…":t()==="create"?"Create account":"Sign in"})()),v(N=>{var M=t()==="create"?"new-password":"current-password",R=a();return M!==N.e&&ee(T,"autocomplete",N.e=M),R!==N.t&&(P.disabled=N.t=R),N},{e:void 0,t:void 0}),v(()=>w.value=n()),v(()=>T.value=i()),b})(),(()=>{var b=nu();return b.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(b,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),v(()=>b.disabled=a()),b})(),ru(),(()=>{var b=iu();return b.$$click=h,v(()=>b.disabled=a()),b})(),f(E,{get when(){return l()},get children(){var b=su();return u(b,l),b}})]}}),null),g})()}ve(["click","input"]);var hu=p("<div class=gate-error role=alert>"),fu=p("<p class=gate-note>No grant-file entries yet."),gu=p("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),pu=p('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),mu=p("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function _u(t){const[e,n]=O([]),[r,i]=O([]),[s,a]=O(""),[o,l]=O(!1),[c,d]=O(""),h=_=>{n((_==null?void 0:_.file_grants)??[]),i((_==null?void 0:_.static_emails)??[])};gt(async()=>{try{h(await Js())}catch{d("Could not load the grant list.")}});const m=_=>{_.key==="Escape"&&t.onClose()};gt(()=>{window.addEventListener("keydown",m),Oe(()=>window.removeEventListener("keydown",m));const _=document.querySelector(".access-add input");_==null||_.focus()});const b=async _=>{if(_.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await Ys(s())),a("")}catch(w){d(w.message)}l(!1)}},I=async _=>{if(!o()){l(!0),d("");try{h(await Xs(_))}catch(w){d(w.message)}l(!1)}};return(()=>{var _=pu(),w=_.firstChild,S=w.firstChild,C=S.nextSibling,T=C.nextSibling,P=T.firstChild,N=P.nextSibling,M=T.nextSibling;return j(_,"click",t.onClose),w.$$click=R=>R.stopPropagation(),u(w,f(E,{get when(){return c()},get children(){var R=hu();return u(R,c),R}}),T),u(w,f(ie,{get each(){return e()},children:R=>(()=>{var x=mu(),$=x.firstChild,U=$.nextSibling;return u($,R),U.$$click=()=>I(R),ee(U,"title",`Remove ${R}`),ee(U,"aria-label",`Remove ${R}`),v(()=>U.disabled=o()),x})()}),T),u(w,f(E,{get when(){return e().length===0},get children(){return fu()}}),T),T.addEventListener("submit",b),P.$$input=R=>a(R.currentTarget.value),u(N,()=>o()?"…":"Add"),u(w,f(E,{get when(){return r().length>0},get children(){var R=gu();return R.firstChild,u(R,()=>r().join(", "),null),R}}),M),j(M,"click",t.onClose),v(()=>N.disabled=o()),v(()=>P.value=s()),_})()}ve(["click","input"]);const Pe=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),At=(t,e,n)=>Math.min(n,Math.max(e,t));function bu(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:At((n-t)/r,0,1)}function yu(t,e,n,r,i=Pe){if(n<i.minRateOfReturn||t<=0)return null;const s=At(t/2,0,1),a=At(e,0,1),o=Math.min(n/i.idealReturn,1),l=At((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function vu(t,e=Pe){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?At(1+t.delta,0,1):bu(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),yu(r,a,n,i,e)}function wu(t,e=Pe.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function $u(t){return t.weightSharpe===Pe.weightSharpe&&t.weightSafety===Pe.weightSafety&&t.weightReturn===Pe.weightReturn&&t.minRateOfReturn===Pe.minRateOfReturn}var Su=p("<span class=hint>production defaults · drag to re-rank live"),ku=p("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),Eu=p('<span class="hint hint-custom">custom weights'),Iu=p("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function Cu(){const[t,e]=O({...Pe});return{params:t,isCustom:()=>!$u(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Pe})}}const Tu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function Au(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=ku(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(E,{get when(){return!e()},get fallback(){return Eu()},get children(){return Su()}}),null),u(s,f(ie,{each:Tu,children:o=>(()=>{var l=Iu(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,g=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(E,{get when(){return o.weight},get children(){return[" ","· ",Y(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),g.$$input=m=>t.scoring.setParam(o.key,Number(m.currentTarget.value)),v(m=>{var b=o.max,I=o.step;return b!==m.e&&ee(g,"max",m.e=b),I!==m.t&&ee(g,"step",m.t=I),m},{e:void 0,t:void 0}),v(()=>g.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),v(()=>r.open=e()),r})()}ve(["click","input"]);const vn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],Et=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],us="webapp.columns.v1";function Pu(){try{const t=localStorage.getItem(us);if(!t)return Et;const e=JSON.parse(t);if(!Array.isArray(e))return Et;const n=new Set(vn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:Et}catch{return Et}}function Ru(t){try{localStorage.setItem(us,JSON.stringify(t))}catch{}}var xu=p("<div class=pop-backdrop>"),Ou=p('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Nu=p("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Du=p("<label class=pick-item><input type=checkbox>");function Lu(t){const[e,n]=O(!1);return(()=>{var r=Nu(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(E,{get when(){return e()},get children(){return[(()=>{var s=xu();return s.$$click=()=>n(!1),s})(),(()=>{var s=Ou(),a=s.firstChild,o=a.nextSibling;return u(a,f(ie,{each:vn,children:l=>(()=>{var c=Du(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),v(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),v(()=>ee(i,"aria-expanded",e())),r})()}ve(["click"]);var Mu=p('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),Uu=p("<span class=pggap>…"),Fu=p("<button type=button class=pgbtn>");function Bu(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function Hu(t){const e=ae(()=>Bu(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Mu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,f(ie,{get each(){return e()},children:d=>d==="…"?Uu():(()=>{var h=Fu();return h.$$click=()=>t.onGo(d),u(h,d),v(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,v(d=>{var h=t.page()<=1,g=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),g!==d.t&&(c.disabled=d.t=g),d},{e:void 0,t:void 0}),i})()}ve(["click"]);var Vu=p("<span class=tip>");function wt(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=Vu();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?zs(i,r):e=r,u(r,()=>t.children),v(()=>ee(r,"data-tip",t.text??"")),r})()}ve(["focusin"]);const nt="∅";function Z(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function It(t){return Number(t??0).toLocaleString("en-US")}function fn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function ds(t){return hs(t,{hour:"2-digit",minute:"2-digit"})}function Wu(t){return hs(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function hs(t,e){const n=fn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const fs={text:nt,isNull:!0},Nn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Yr(t,e){return!e||Z(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function ju(t,e){return!e||Z(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function zu(t){if(!t||typeof t!="object"||Z(t.report_date))return fs;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function ge(t,e){if(Z(e))return fs;switch(t){case"fixed2":return Nn(e,2);case"fixed3":return Nn(e,3);case"ivrv":return Nn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return zu(e);default:return{text:String(e),isNull:!1}}}const Xr=t=>Number(t*100).toFixed(0);function Gu(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Xr(e.momentum_high),s=Xr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function $t(t,e){return Gu(e)[t]??t}var gs=p("<span class=tip-target>"),qu=p("<div class=kv><span class=kv-label></span><span class=kv-value>"),Ku=p("<span class=tip-target>Strike position in band"),Ju=p('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),Yu=p("<div class=exp-block><h4>"),Xu=p("<div class=kv-value>Band unavailable (∅)"),Qu=p("<div><span class=marker-tick></span><span class=marker-cap><br>"),Zu=p("<div class=exp-block><h4>Premium economics"),ed=p("<b>"),td=p('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),nd=p("<div class=muted-note>earnings-discounted safety applied"),rd=p("<div class=exp-block><h4>Score breakdown"),id=p("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),sd=p('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),ad=p("<span class=muted-note>all columns visible"),od=p('<div class="exp-block exp-chips"><h4>Hidden columns'),ld=p("<span class=tip-target>: "),cd=p("<span>"),ud=p("<span class=tip-target>band safety is already discounted by the earnings rule."),dd=p("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),hd=p("<div class=expansion><div class=exp-grid>");const Dn={sharpe:.2,safety:.4,return_part:.4};function Ln(t,e=2){return Z(t)?nt:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function we(t,e,n){return(()=>{var r=qu(),i=r.firstChild,s=i.nextSibling;return u(i,f(wt,{get text(){return $t(t,e)},get children(){var a=gs();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function fd(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=Z(e.mid)?null:e.strike-e.mid,s=i!=null&&!Z(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!Z(a)&&l>a&&!Z(e.strike),d=g=>{if(Z(g))return null;const m=(g-a)/(l-a)*100;return Math.min(100,Math.max(0,m))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(g=>d(g.v)!=null):[];return(()=>{var g=Yu(),m=g.firstChild;return u(m,f(wt,{get text(){return $t("band_range",t.thresholds)},get children(){return Ku()}})),u(g,f(E,{when:c,get fallback(){return Xu()},get children(){var b=Ju(),I=b.firstChild;return u(b,f(ie,{each:h,children:_=>(()=>{var w=Qu(),S=w.firstChild,C=S.nextSibling,T=C.firstChild;return u(C,()=>_.label,T),u(C,()=>ge("fixed2",_.v).text,null),v(P=>{var N=`marker ${_.cls}`,M=`${d(_.v)}%`;return N!==P.e&&ue(w,P.e=N),M!==P.t&&tt(w,"left",P.t=M),P},{e:void 0,t:void 0}),w})()}),null),v(_=>{var w=`${d(e.strike_from)}%`,S=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return w!==_.e&&tt(I,"left",_.e=w),S!==_.t&&tt(I,"width",_.t=S),_},{e:void 0,t:void 0}),b}}),null),u(g,()=>we("band_range",t.thresholds,`${ge("fixed2",e.strike_from).text} → ${ge("fixed2",e.strike_to).text}`),null),u(g,()=>we("band_depth",t.thresholds,r==null?nt:`${(r*100).toFixed(1)}%`),null),u(g,()=>we("cushion_be",t.thresholds,s==null?nt:`${s.toFixed(1)}%`),null),g})()}function gd(t){const e=t.row,n=Z(e.strike)?null:e.strike*100,r=Z(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=ge("pct1",e.rate_of_return);return(()=>{var a=Zu();return a.firstChild,u(a,()=>we("capital",t.thresholds,n==null?nt:Ln(n,0)),null),u(a,()=>we("premium",t.thresholds,r==null?nt:Ln(r)),null),u(a,()=>we("breakeven",t.thresholds,i==null?nt:Ln(i)),null),u(a,()=>we("ann_ror",t.thresholds,(()=>{var o=ed();return u(o,()=>s.text),o})()),null),u(a,()=>we("bid",t.thresholds,ge("fixed2",e.bid).text),null),u(a,()=>we("ask",t.thresholds,ge("fixed2",e.ask).text),null),u(a,()=>we("expiration",t.thresholds,e.expiration),null),a})()}function pd(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:Dn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:Dn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:Dn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=rd();return i.firstChild,u(i,f(E,{when:n,get fallback(){return(()=>{var s=id(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ge("fixed3",e.score).text),s})()},get children(){return[f(ie,{each:r,children:s=>{const a=Z(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=sd(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,g=h.nextSibling;g.nextSibling;var m=l.nextSibling,b=m.firstChild,I=m.nextSibling;return u(l,f(wt,{get text(){return $t(s.key,t.thresholds)},get children(){var _=gs();return u(_,()=>s.label),_}}),c),u(d,()=>s.weight*100,g),u(I,()=>ge("fixed3",s.v).text),v(_=>tt(b,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=td(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ge("fixed3",e.score).text),s})(),f(E,{get when(){return e.earnings_before_expiry},get children(){return nd()}})]}}),null),i})()}function md(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:ge(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=od();return n.firstChild,u(n,f(ie,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=cd();return u(s,f(wt,{get text(){return $t(r.id,t.thresholds)},get children(){var a=ld(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),v(()=>ue(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(E,{get when(){return t.hiddenDefs.length===0},get children(){return ad()}}),null),n})()}function _d(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=hd(),i=r.firstChild;return u(r,f(E,{when:n,get children(){var s=dd(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(E,{get when(){return n.report_time},children:g=>g().replaceAll("_"," ")}),c),u(s,f(E,{get when(){return!Z(n.expected_eps)},get children(){return[" ","· expected EPS ",Y(()=>ge("fixed2",n.expected_eps).text)]}}),h),u(s,f(wt,{get text(){return $t("earnings_before_expiry",t.thresholds)},get children(){return ud()}}),null),s}}),i),u(i,f(fd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(gd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(pd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(md,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var bd=p("<span class=null-mark>"),yd=p("<span class=star>★"),vd=p("<td><b>"),Mn=p("<span>"),Qr=p("<td class=num>"),wd=p("<span class=score-frozen>prod "),$d=p('<td class="num score-cell">'),Sd=p('<span class="score-frozen readmit">re-admitted'),kd=p("<td>"),Ed=p("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),Id=p("<span class=sort-arrow>"),Cd=p("<span class=tip-target>"),Td=p("<th role=button tabindex=0>"),Ad=p("<tr class=expandable><td class=exp-col>"),Pd=p("<tr class=exp-row><td>");const Rd=t=>`${t.underlying}|${t.strike}`;function xd(t){return(()=>{var e=bd();return u(e,()=>t.text),e})()}function zt(t){const e=ge(t.kind,t.value);return f(E,{get when(){return!e.isNull},get fallback(){return f(xd,{get text(){return e.text}})},get children(){return e.text}})}function Od(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=vd(),i=r.firstChild;return u(r,f(E,{get when(){return t.pickRank!=null},get children(){var s=yd();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(E,{get when(){return Yr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=Mn();return v(()=>ue(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Qr();return u(r,f(E,{get when(){return Yr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=Mn();return v(()=>ue(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=$d();return u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(E,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(E,{get when(){return!Z(n.frozen_score)},get fallback(){return f(E,{get when(){return!Z(n.score)},get children(){return Sd()}})},get children(){var i=wd();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=Qr();return u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(E,{get when(){return ju(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=Mn();return u(s,i),v(()=>ue(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=kd();return u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}})),v(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Nd(t){const e=ae(()=>vn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=Ed(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(ie,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=Td();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,f(wt,{get text(){return $t(a.id,t.thresholds)},get children(){var c=Cd();return u(c,()=>a.label,null),u(c,f(E,{get when(){return o()},get children(){return[" ",(()=>{var d=Id();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),v(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&ee(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,f(ie,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>Rd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=Ad(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,f(ie,{get each(){return e()},children:g=>f(Od,{col:g,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),v(g=>{var m=o()!=null,b=!!Z(a.score),I=!!c();return m!==g.e&&d.classList.toggle("pick",g.e=m),b!==g.t&&d.classList.toggle("prow",g.t=b),I!==g.a&&d.classList.toggle("open",g.a=I),g},{e:void 0,t:void 0,a:void 0}),d})(),f(E,{get when(){return c()},get children(){var d=Pd(),h=d.firstChild;return u(h,f(_d,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),v(()=>ee(h,"colspan",e().length+1)),d}})]}})),n})()}ve(["click","keydown"]);function Dd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const ct=t=>Z(t);function Ld(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=ct(a),c=ct(o);return l||c?l&&c?0:l?1:-1:r*Dd(a,o)})}function Md(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=ct(r),a=ct(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=ct(l),h=ct(c);return d||h?d&&h?0:d?1:-1:c-l})}var Ud=p("<div class=stage-badges>"),Fd=p("<pre class=errbox>"),Bd=p("<details><summary> "),Hd=p("<div class=scroll-region>"),Vd=p('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),Wd=p("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),jd=p("<div class=empty-panel>No rows match the current filter."),zd=p('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Un=100,Gd=150,Zr={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function qd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=Ud();return u(i,f(ie,{get each(){return t.stages??[]},children:s=>(()=>{var a=Bd(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,f(E,{get when(){return s.error},get children(){var c=Fd();return u(c,()=>s.error),c}}),null),v(()=>ue(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function ei(t){const[e,n]=O(""),[r,i]=O(""),[s,a]=O(!0),[o,l]=O(null),[c,d]=O("asc"),[h,g]=O(1);let m;Oe(()=>clearTimeout(m));const b=()=>{var k;return((k=t.tf)==null?void 0:k.rows)??[]},I=ae(()=>{const k=t.scoring.params(),B=t.scoring.isCustom();return b().map(A=>{const V=vu(A,k);return{...A,frozen_score:A.score,live_parts:V,score:B?V==null?null:V.total:A.score}})}),_=ae(()=>I().filter(k=>!Z(k.score)&&Z(k.frozen_score)).length),w=k=>{const B=k.currentTarget.value;n(B),clearTimeout(m),m=setTimeout(()=>{i(B.trim().toLowerCase()),g(1)},Gd)},S=k=>{a(k),g(1)},C=k=>{o()!==k?(l(k),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),g(1)},[T,P]=O(null),N=k=>{const B=`${k.underlying}|${k.strike}`;P(A=>A===B?null:B)};et(Ct([o,c,h,r,s],()=>P(null))),et(Ct(t.active,()=>P(null))),et(Ct(t.columns.visible,()=>g(1)));const M=()=>vn.filter(k=>!t.columns.visible().includes(k.id)),R=()=>(t.stages??[]).find(k=>k.name===Zr[t.id].id),x=ae(()=>{const k=r();return k?I().filter(B=>{const A=B.underlying,V=B.sector;return A!=null&&String(A).toLowerCase().includes(k)||V!=null&&String(V).toLowerCase().includes(k)}):I()}),$=ae(()=>{const k=x();return s()?k.filter(B=>!Z(B.score)):k}),U=ae(()=>o()?Ld($(),o(),c()):Md($())),W=ae(()=>Math.max(1,Math.ceil(U().length/Un))),ne=()=>Math.min(h(),W()),te=()=>{const k=ne();return U().slice((k-1)*Un,k*Un)},he=ae(()=>{var B;const k=new Map;if(t.scoring.isCustom()){const A=wu(I().map(V=>({row:V,score:V.score})));for(const V of A)k.set(`${V.row.underlying}|${V.row.strike}`,k.size+1)}else for(const A of((B=t.tf)==null?void 0:B.top_picks)??[])k.set(`${A.underlying}|${A.strike}`,A.rank??"?");return k}),L=k=>he().get(`${k.underlying}|${k.strike}`);return(()=>{var k=Vd(),B=k.firstChild,A=B.firstChild,V=A.nextSibling,K=V.firstChild,z=V.nextSibling,ce=z.firstChild,Fe=ce.nextSibling;return Fe.nextSibling,u(k,f(qd,{get stages(){return t.stages}}),B),A.$$input=w,K.addEventListener("change",se=>S(se.currentTarget.checked)),u(B,f(Lu,{get store(){return t.columns}}),z),u(z,()=>It(U().length),ce),u(z,()=>It(b().length),Fe),u(z,f(E,{get when(){return Y(()=>!!t.scoring.isCustom())()&&_()>0},get children(){return[" ","· ",Y(()=>It(_()))," re-admitted by lower floor"]}}),null),u(k,f(E,{get when(){return te().length>0},get children(){var se=Hd();return u(se,f(Nd,{get visibleCols(){return t.columns.visible},rows:te,sortKey:o,sortDir:c,onSort:C,get thresholds(){return t.thresholds},pickRankOf:L,openKey:T,onToggleRow:N,hiddenDefs:M,get customScores(){return t.scoring.isCustom}})),se}}),null),u(k,f(E,{get when(){return te().length===0},get children(){return f(E,{get when(){var se,ke;return((se=R())==null?void 0:se.status)==="failed"||((ke=R())==null?void 0:ke.status)==="partial"},get fallback(){return f(E,{get when(){return Y(()=>!!s())()&&x().length>0},get fallback(){return jd()},get children(){var se=Wd(),ke=se.firstChild,Be=ke.nextSibling,st=Be.nextSibling,at=st.nextSibling,y=at.nextSibling;return y.nextSibling,u(se,()=>It(x().length),y),se}})},children:se=>(()=>{var ke=zd(),Be=ke.firstChild,st=Be.firstChild,at=st.nextSibling;at.nextSibling;var y=Be.nextSibling;return u(Be,()=>se().status==="partial"?"△":"✗",st),u(Be,()=>Zr[t.id].label,at),u(y,()=>se().error??"stage produced no data"),ke})()})}}),null),u(k,f(E,{get when(){return U().length>0},get children(){return f(Hu,{page:ne,pageCount:W,onGo:g})}}),null),v(()=>k.hidden=!t.active()),v(()=>A.value=e()),v(()=>K.checked=s()),k})()}ve(["input"]);var Kd=p("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),Jd=p('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save</button><button type=button class=btn>cancel'),Yd=p('<button type=button class="btn-ghost hp-cash-edit">'),Xd=p("<div class=hp-pool-list>"),Qd=p('<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add'),Zd=p('<span class=hp-pool-name-row><button type=button class=hp-pool-name></button><button type=button class="btn hp-pool-del">×'),eh=p('<span class=hp-pool-line><span class=hp-pool-cash></span><button type=button class="btn-ghost hp-pool-act">cash</button><button type=button class="btn-ghost hp-pool-act">rename'),th=p("<div class=hp-pool-item>"),nh=p("<span class=hp-pool-row><input><button type=button class=btn>save</button><button type=button class=btn>cancel"),rh=p('<button type=button class="btn-ghost holdings-close-btn">sell call…'),ih=p("<div class=hp-slot><div class=hp-lot-row><div class=hp-lot-row-top><span> sh </span><b></b></div><div class=hp-lot-row-sub><span>bought <!> · </span><b></b></div><div class=hp-lot-row-meta><i>last </i><i>covered <!>/"),sh=p("<i class=hp-spot-session>"),ah=p("<select class=hp-pool-pick>"),oh=p('<span class="chip high">buy back?'),lh=p('<span class="chip high">ITM — called away?'),ur=p("<b>"),ch=p("<i>"),uh=p('<div class=hp-slot><div class=hp-list-row><span class=hp-list-pos><span class=hp-kind></span><b> <!> ×</b><i>exp <!> · <!>/<!> wd</i></span><span></span><span class=hp-list-pace><i>target </i></span><span class=hp-list-status></span><button type=button class="btn-ghost holdings-close-btn">close…</button><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),ps=p("<option>"),dh=p('<span class="chip normal">holding'),hh=p("<b>—"),fh=p("<label>pool<select>"),gh=p("<div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares"),ph=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal></label><label>premium<input inputmode=decimal></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary"></button><button type=button class=btn>Cancel'),mh=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),_h=p('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class=btn>Cancel'),ms=p("<label class=holdings-outcome-price><input inputmode=decimal>"),bh=p("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),yh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),vh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),wh=p("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),$h=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),Sh=p("<div class=hp-list>"),ti=p("<div class=empty-panel>"),kh=p('<div class=hp-list><div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),Eh=p("<span class=hp-pane-hint> sh held"),Ih=p("<div class=hp-toolbar-row><button type=button class=btn>"),Ch=p('<button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),Th=p("<div class=holdings-notice>"),Ah=p('<div class="holdings-panel hp-tabs-shell"><div class=hp-tabs-grid><aside class=hp-tabs-rail><div class=hp-tabs-brand>Wheel ledger</div></aside><main class=hp-tabs-main><div class=hp-pane-head><span class=hp-pane-title>'),Ph=p("<button type=button class=hp-tab-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>");const Re=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),bt=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),Zt=(t,e=0)=>`${(t*100).toFixed(e)}%`,qe=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),_s=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(Date.UTC(n,r-1,i+e,12)).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function bs(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function Rh(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=Kd(),r=n.firstChild,i=r.nextSibling;return v(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&tt(r,"width",s.e=a),o!==s.t&&tt(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function xh(t){const[e,n]=O(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=Jd(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling;return s.$$keydown=l=>{var c;return l.key==="Escape"&&((c=t.onCancel)==null?void 0:c.call(t))},s.$$input=l=>n(l.target.value),a.$$click=()=>t.onSave(Number(e())),o.$$click=()=>{var l;return(l=t.onCancel)==null?void 0:l.call(t)},v(()=>{var l;return a.disabled=!r()||((l=t.busy)==null?void 0:l.call(t))}),v(()=>s.value=e()),i})()}function Oh(t){const[e,n]=O(!1),[r,i]=O(null),[s,a]=O(""),o=()=>t.pools??[],l=()=>t.pool,c=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,g=()=>c()==null,m=_=>{var w;_&&_!==((w=l())==null?void 0:w.id)&&t.onSelectPool(_),i(_??null),n(!0)},b=()=>{const _=o().find(w=>w.id===r());return _?_.cash:t.cash},I=async()=>{var _;!s().trim()||(_=t.busy)!=null&&_.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var _=Qd(),w=_.firstChild,S=w.nextSibling,C=S.nextSibling,T=C.firstChild,P=T.nextSibling;P.nextSibling;var N=C.nextSibling,M=N.firstChild,R=M.firstChild,x=R.nextSibling;return u(S,(()=>{var $=Y(()=>h()==null);return()=>$()?"—":Re(h())})()),u(C,(()=>{var $=Y(()=>c()==null);return()=>$()?"—":Re(c())})(),T),u(C,()=>Re(d()),P),u(_,f(E,{get when(){return!e()},get fallback(){return f(xh,{get cash(){return b()},get busy(){return t.busy},onSave:async $=>{await t.onSaveCash($,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var $=Yd();return $.$$click=()=>{var U;return m(((U=l())==null?void 0:U.id)??null)},u($,()=>g()?"set cash":"edit cash"),$}}),N),u(N,f(E,{get when(){return o().length>0},get children(){var $=Xd();return u($,f(ie,{get each(){return o()},children:U=>f(Nh,{pool:U,get selected(){var W;return((W=l())==null?void 0:W.id)===U.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(U.id)},onEditCash:()=>m(U.id),onRename:W=>t.onRenamePool(U.id,W),onDelete:()=>t.onDeletePool(U.id)})})),$}}),M),R.$$keydown=$=>$.key==="Enter"&&I(),R.$$input=$=>a($.target.value),x.$$click=I,v(()=>{var $;return x.disabled=!s().trim()||(($=t.busy)==null?void 0:$.call(t))}),v(()=>R.value=s()),_})()}function Nh(t){const[e,n]=O(!1),[r,i]=O(t.pool.name),s=()=>{i(t.pool.name),n(!0)},a=()=>{var l;const o=r().trim();!o||o===t.pool.name||(l=t.busy)!=null&&l.call(t)||(t.onRename(o),n(!1))};return(()=>{var o=th();return u(o,f(E,{get when(){return!e()},get fallback(){return(()=>{var l=nh(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling;return c.$$keydown=g=>{g.key==="Enter"?a():g.key==="Escape"&&n(!1)},c.$$input=g=>i(g.target.value),d.$$click=a,h.$$click=()=>n(!1),v(g=>{var I;var m=`rename ${t.pool.name}`,b=((I=t.busy)==null?void 0:I.call(t))||!r().trim()||r().trim()===t.pool.name;return m!==g.e&&ee(c,"aria-label",g.e=m),b!==g.t&&(d.disabled=g.t=b),g},{e:void 0,t:void 0}),v(()=>c.value=r()),l})()},get children(){return[(()=>{var l=Zd(),c=l.firstChild,d=c.nextSibling;return j(c,"click",t.onSelect),u(c,()=>t.pool.name),j(d,"click",t.onDelete),v(h=>{var b;var g=(b=t.busy)==null?void 0:b.call(t),m=`delete ${t.pool.name}`;return g!==h.e&&(d.disabled=h.e=g),m!==h.t&&ee(d,"aria-label",h.t=m),h},{e:void 0,t:void 0}),l})(),(()=>{var l=eh(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling;return u(c,()=>Re(t.pool.cash)),j(d,"click",t.onEditCash),h.$$click=s,l})()]}})),v(()=>o.classList.toggle("active",!!t.selected)),o})()}const Dh={PreMarket:"pre",AfterHours:"post",OverNight:"overnight"};function Lh(t){const e=t.lot,n=()=>e.view;return(()=>{var r=ih(),i=r.firstChild,s=i.firstChild,a=s.firstChild,o=a.firstChild,l=a.nextSibling,c=s.nextSibling,d=c.firstChild,h=d.firstChild,g=h.nextSibling;g.nextSibling;var m=d.nextSibling,b=c.nextSibling,I=b.firstChild;I.firstChild;var _=I.nextSibling,w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(a,()=>e.shares,o),u(a,()=>e.symbol,null),u(l,(()=>{var C=Y(()=>n().spot==null);return()=>C()?"—":bt(n().spot)})(),null),u(l,f(E,{get when(){var C;return Dh[(C=e.mark)==null?void 0:C.session]},children:C=>(()=>{var T=sh();return u(T,C),T})()}),null),u(d,()=>bt(e.basis_per_share),g),u(d,()=>e.acquired,null),u(m,f(E,{get when(){return n().pl_dollars!=null},fallback:"—",get children(){return`${Re(n().pl_dollars)} (${(n().pl_pct??0)>=0?"+":""}${Zt(n().pl_pct,1)})`}})),u(I,()=>{var C;return bs((C=e.mark)==null?void 0:C.as_of)||"—"},null),u(_,()=>n().covered,S),u(_,()=>n().capacity,null),u(r,f(E,{get when(){return n().capacity>0},get children(){var C=rh();return C.$$click=()=>t.onSellDialog(e),C}}),null),u(r,f(E,{get when(){return t.dialogFor("sellCall",e.id)},keyed:!0,children:C=>f(Bh,{get lot(){return C.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}),null),v(()=>ue(m,(n().pl_dollars??0)>=0?"holdings-pos":"holdings-neg")),r})()}function Mh(t){const e=t.x,n=()=>e.v.spot_pct_vs_strike!=null&&e.v.spot_pct_vs_strike>0,r=()=>e.p.kind==="call"?e.v.spot_pct_vs_strike>0:e.v.spot_pct_vs_strike<0;return(()=>{var i=uh(),s=i.firstChild,a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,m=g.nextSibling,b=m.nextSibling,I=b.nextSibling,_=I.nextSibling,w=_.nextSibling;w.nextSibling;var S=a.nextSibling,C=S.nextSibling,T=C.firstChild;T.firstChild;var P=C.nextSibling,N=P.nextSibling,M=N.nextSibling,R=M.firstChild,x=R.firstChild,$=x.nextSibling,U=R.nextSibling,W=U.firstChild,ne=W.nextSibling,te=ne.nextSibling,he=U.nextSibling;he.firstChild;var L=he.nextSibling,k=L.firstChild,B=k.nextSibling;return u(o,()=>e.p.kind.toUpperCase()),u(l,()=>e.p.symbol,c),u(l,()=>e.p.strike,d),u(l,()=>e.p.kind==="put"?"P":"C",d),u(l,()=>e.p.contracts,null),u(a,f(E,{get when(){return Y(()=>e.p.kind==="put")()&&t.showPool},get children(){var A=ah();return A.addEventListener("change",V=>{var K;return(K=t.onPoolChange)==null?void 0:K.call(t,e.p.id,V.target.value)}),u(A,f(ie,{get each(){return t.pools},children:V=>(()=>{var K=ps();return u(K,()=>V.name),v(()=>K.value=V.id),K})()})),v(V=>{var ce,Fe;var K=`cash pool for ${e.p.symbol} ${e.p.strike} put`,z=(Fe=(ce=t.dialogActions)==null?void 0:ce.busy)==null?void 0:Fe.call(ce);return K!==V.e&&ee(A,"aria-label",V.e=K),z!==V.t&&(A.disabled=V.t=z),V},{e:void 0,t:void 0}),v(()=>{var V,K;return A.value=((K=(V=t.pools)==null?void 0:V.find(z=>z.name===e.p.pool_name))==null?void 0:K.id)??""}),A}}),h),u(h,()=>e.p.expiry,m),u(h,()=>e.v.days_elapsed,I),u(h,()=>e.v.days_total,w),u(S,(()=>{var A=Y(()=>e.v.pl_pct==null);return()=>A()?"—":`${e.v.pl_pct>=0?"+":""}${Zt(e.v.pl_pct,1)}`})()),u(C,f(Rh,{get v(){return e.v}}),T),u(T,()=>Zt(e.v.target_pct),null),u(P,f(E,{get when(){return e.v.pace_met},get fallback(){return dh()},get children(){return oh()}}),null),u(P,f(E,{get when(){return Y(()=>e.p.kind==="call")()&&n()},get children(){return lh()}}),null),N.$$click=()=>t.onClose(e),u($,()=>bt(e.p.premium)),u(ne,(()=>{var A=Y(()=>e.p.mark==null);return()=>A()?"—":e.p.mark.mid.toFixed(2)})()),u(te,(()=>{var A=Y(()=>e.p.mark==null);return()=>A()?"unpriced":bs(e.p.mark.as_of)})()),u(he,f(E,{get when(){var A;return((A=e.p.mark)==null?void 0:A.underlying_price)!=null},get fallback(){return hh()},get children(){return[(()=>{var A=ur();return u(A,()=>e.p.mark.underlying_price.toFixed(2)),A})(),(()=>{var A=ch();return u(A,(()=>{var V=Y(()=>e.v.spot_pct_vs_strike==null);return()=>V()?"":`${e.v.spot_pct_vs_strike>=0?"+":""}${Zt(e.v.spot_pct_vs_strike,1)} vs strike`})()),v(()=>ue(A,r()&&e.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),A})()]}}),null),u(B,(()=>{var A=Y(()=>e.v.pl_dollars==null);return()=>A()?"—":bt(e.v.pl_dollars)})()),u(i,f(E,{get when(){return t.dialogFor(e.p.kind,e.p.id)},keyed:!0,children:A=>f(jh,Hs({d:A},()=>t.dialogActions))}),null),v(A=>{var V=!!e.v.pace_met,K=e.p.kind,z=e.v.pl_pct>=0?"holdings-pos":"holdings-neg",ce=(e.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return V!==A.e&&s.classList.toggle("hp-row-met",A.e=V),K!==A.t&&ee(o,"data-kind",A.t=K),z!==A.a&&ue(S,A.a=z),ce!==A.o&&ue(B,A.o=ce),A},{e:void 0,t:void 0,a:void 0,o:void 0}),i})()}function Uh(t){var o,l;const e=t.kind,n=()=>e==="put"?t.pools??[]:[],[r,i]=O({symbol:"",strike:"",premium:"",contracts:"1",sold:qe(),expiry:_s(qe(),7),pool_id:((l=(o=t.pools)==null?void 0:o[0])==null?void 0:l.id)??""}),s=c=>d=>i({...r(),[c]:d.target.value}),a=()=>r().symbol.trim()&&[r().strike,r().premium,r().contracts].every(c=>Number(c)>0)&&r().expiry>r().sold&&r().sold<=qe();return(()=>{var c=ph(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=d.nextSibling,b=m.firstChild,I=b.nextSibling,_=m.nextSibling,w=_.firstChild,S=w.nextSibling,C=_.nextSibling,T=C.firstChild,P=T.nextSibling,N=C.nextSibling,M=N.firstChild,R=M.nextSibling,x=N.nextSibling,$=x.firstChild,U=$.nextSibling,W=x.nextSibling,ne=W.nextSibling;return c.addEventListener("submit",te=>{var he,L;te.preventDefault(),!(!a()||(he=t.busy)!=null&&he.call(t))&&t.onAdd({...e==="call"?{kind:"call"}:{},...e==="put"&&n().length>0?{pool_id:r().pool_id||((L=n()[0])==null?void 0:L.id)}:{},symbol:r().symbol.trim().toUpperCase(),strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:r().sold,expiry:r().expiry})}),j(g,"input",s("symbol")),j(I,"input",s("strike")),ee(I,"placeholder",e==="call"?"e.g. 355.00":"e.g. 350.00"),j(S,"input",s("premium")),ee(S,"placeholder",e==="call"?"e.g. 1.80":"e.g. 1.00"),j(P,"input",s("contracts")),u(c,f(E,{get when(){return n().length>1},get children(){var te=fh(),he=te.firstChild,L=he.nextSibling;return j(L,"input",s("pool_id")),u(L,f(ie,{get each(){return n()},children:k=>(()=>{var B=ps();return u(B,()=>k.name),v(()=>B.value=k.id),B})()})),v(()=>L.value=r().pool_id),te}}),N),j(R,"input",s("sold")),j(U,"input",s("expiry")),u(W,e==="call"?"Sell call":"Sell put"),j(ne,"click",t.onDone),u(c,f(E,{when:e==="call",get children(){return gh()}}),null),v(()=>{var te;return W.disabled=!a()||((te=t.busy)==null?void 0:te.call(t))}),v(()=>g.value=r().symbol),v(()=>I.value=r().strike),v(()=>S.value=r().premium),v(()=>P.value=r().contracts),v(()=>R.value=r().sold),v(()=>U.value=r().expiry),c})()}function Fh(t){const[e,n]=O({symbol:"",shares:"",basis_per_share:"",acquired:qe()}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=mh(),a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=a.nextSibling,d=c.firstChild,h=d.nextSibling,g=c.nextSibling,m=g.firstChild,b=m.nextSibling,I=g.nextSibling,_=I.firstChild,w=_.nextSibling,S=I.nextSibling,C=S.nextSibling;return s.addEventListener("submit",T=>{var P;T.preventDefault(),!(!i()||(P=t.busy)!=null&&P.call(t))&&t.onAdd({kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired})}),j(l,"input",r("symbol")),j(h,"input",r("shares")),j(b,"input",r("basis_per_share")),j(w,"input",r("acquired")),j(C,"click",t.onDone),v(()=>{var T;return S.disabled=!i()||((T=t.busy)==null?void 0:T.call(t))}),v(()=>l.value=e().symbol),v(()=>h.value=e().shares),v(()=>b.value=e().basis_per_share),v(()=>w.value=e().acquired),s})()}function Bh(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=O({strike:"",premium:"",contracts:String(n()),expiry:_s(qe(),7)}),s=o=>l=>i({...r(),[o]:l.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>qe();return(()=>{var o=_h(),l=o.firstChild,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,m=g.firstChild,b=m.nextSibling,I=g.nextSibling,_=I.firstChild,w=_.nextSibling,S=I.nextSibling,C=S.firstChild,T=C.nextSibling,P=S.nextSibling,N=P.firstChild,M=N.nextSibling,R=P.nextSibling,x=R.nextSibling;return u(l,()=>e.shares,d),u(l,()=>e.symbol,null),h.addEventListener("submit",$=>{var U;$.preventDefault(),!(!a()||(U=t.busy)!=null&&U.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:qe(),expiry:r().expiry})}),j(b,"input",s("strike")),j(w,"input",s("premium")),j(T,"input",s("contracts")),j(M,"input",s("expiry")),j(x,"click",t.onDone),v(()=>{var $;return R.disabled=!a()||(($=t.busy)==null?void 0:$.call(t))}),v(()=>b.value=r().strike),v(()=>w.value=r().premium),v(()=>T.value=r().contracts),v(()=>M.value=r().expiry),o})()}function Hh(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="assigned"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=yh(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=g.nextSibling,b=m.nextSibling;b.nextSibling;var I=d.nextSibling,_=I.firstChild,w=_.firstChild,S=_.nextSibling,C=S.firstChild,T=S.nextSibling,P=T.firstChild,N=I.nextSibling;N.firstChild;var M=N.nextSibling,R=M.firstChild,x=R.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),w.addEventListener("change",()=>r("bought-back")),C.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("assigned")),u(c,f(E,{get when(){return n()!=="expired"},get children(){var $=ms(),U=$.firstChild;return u($,()=>n()==="assigned"?"share price at assignment":"close price/share",U),U.$$input=W=>s(W.target.value),v(()=>U.value=i()),$}}),N),u(N,f(E,{get when(){return a()!==null},fallback:"—",get children(){var $=ur();return u($,()=>bt(a())),v(()=>ue($,a()>=0?"holdings-pos":"holdings-neg")),$}}),null),j(R,"click",t.onDone),x.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),u(c,f(E,{get when(){return n()==="assigned"},get children(){return bh()}}),null),v(()=>{var $;return x.disabled=(($=t.busy)==null?void 0:$.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),v(()=>w.checked=n()==="bought-back"),v(()=>C.checked=n()==="expired"),v(()=>P.checked=n()==="assigned"),c})()}function Vh(t){const[e,n]=O({...t.d.prefill}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=vh(),a=s.firstChild,o=a.nextSibling,l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=l.nextSibling,g=h.firstChild,m=g.nextSibling,b=h.nextSibling,I=b.firstChild,_=I.nextSibling,w=b.nextSibling,S=w.firstChild,C=S.nextSibling,T=w.nextSibling,P=T.nextSibling;return o.addEventListener("submit",N=>{var M;N.preventDefault(),!(!i()||(M=t.busy)!=null&&M.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired,assigned_from:t.d.pos.id})}),j(d,"input",r("symbol")),j(m,"input",r("shares")),j(_,"input",r("basis_per_share")),j(C,"input",r("acquired")),j(P,"click",t.onDone),v(()=>{var N;return T.disabled=!i()||((N=t.busy)==null?void 0:N.call(t))}),v(()=>d.value=e().symbol),v(()=>m.value=e().shares),v(()=>_.value=e().basis_per_share),v(()=>C.value=e().acquired),s})()}function Wh(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="called-away"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=$h(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=g.nextSibling,b=m.nextSibling;b.nextSibling;var I=d.nextSibling,_=I.firstChild,w=_.firstChild,S=_.nextSibling,C=S.firstChild,T=S.nextSibling,P=T.firstChild,N=I.nextSibling;N.firstChild;var M=N.nextSibling,R=M.firstChild,x=R.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),w.addEventListener("change",()=>r("bought-back")),C.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("called-away")),u(c,f(E,{get when(){return n()!=="expired"},get children(){var $=ms(),U=$.firstChild;return u($,()=>n()==="called-away"?"share price at call":"close price/share",U),U.$$input=W=>s(W.target.value),v(()=>U.value=i()),$}}),N),u(N,f(E,{get when(){return a()!==null},fallback:"—",get children(){var $=ur();return u($,()=>bt(a())),v(()=>ue($,a()>=0?"holdings-pos":"holdings-neg")),$}}),null),j(R,"click",t.onDone),x.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),u(c,f(E,{get when(){return n()==="called-away"},get children(){var $=wh(),U=$.firstChild,W=U.nextSibling,ne=W.nextSibling,te=ne.nextSibling;return te.nextSibling,u($,()=>e.symbol,W),u($,()=>e.contracts*100,te),$}}),null),v(()=>{var $;return x.disabled=(($=t.busy)==null?void 0:$.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),v(()=>w.checked=n()==="bought-back"),v(()=>C.checked=n()==="expired"),v(()=>P.checked=n()==="called-away"),c})()}function jh(t){return t.d.type==="put"?t.d.stage==="lot"?f(Vh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(Hh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f(Wh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function zh(){const[t,e]=O(null),[n,r]=O("");let i;const s=y=>{r(y),clearTimeout(i),i=setTimeout(()=>r(""),4e3)};Oe(()=>clearTimeout(i));const[a,o]=O(null),[l,c]=O(!1),d=async()=>{try{e(await ea())}catch(y){s(`Holdings API error: ${y.message}`)}};gt(d);const h=()=>{var y;return((y=t())==null?void 0:y.positions)??[]},g=()=>{var y;return((y=t())==null?void 0:y.calls)??[]},m=()=>{var y;return((y=t())==null?void 0:y.lots)??[]},b=()=>h().map(y=>({p:{...y,kind:"put"},v:y.view})),I=()=>g().map(y=>({p:{...y,kind:"call"},v:y.view})),_=y=>y.v.pl_pct==null?-1/0:y.v.pl_pct-y.v.target_pct,w=(y,D)=>{var Q,_e;const F=a();return!F||F.type!==y?null:(((Q=F.pos)==null?void 0:Q.id)??((_e=F.lot)==null?void 0:_e.id))===D?F:null},S=async y=>{if(l())return null;c(!0);try{return await y()}catch(D){return s(D.message),null}finally{c(!1)}},C=async()=>{var F;const y=await S(()=>na());if(!y)return;const D=((F=y.refresh)==null?void 0:F.stale)??[];s(D.length?`Marks refreshed — ${D.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await d()},T=async(y,D)=>{await S(()=>kn(y))&&(s(D),o(null),await d())},P=async(y,D)=>{await S(()=>kn(D))&&(s(`Assigned — recorded ${D.shares} sh ${D.symbol} at $${D.basis_per_share.toFixed(2)} basis.`),o(null),await d())},N=async(y,D,F)=>{if(D==="assigned"){o({type:"put",pos:y,stage:"lot",prefill:{symbol:y.symbol,shares:y.contracts*100,basis_per_share:+(y.strike-y.premium).toFixed(2),acquired:qe()}});return}await S(()=>En(y.id))&&(s(D==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},M=async(y,D,F)=>{if(D==="called-away"){const Q=await S(()=>ra(y.id));if(!Q)return;s(Q.reduced?`Called away — ${y.symbol} lot reduced by ${y.contracts*100} sh.`:`Called away — call removed. ${Q.reason??""}`),o(null),await d();return}await S(()=>En(y.id))&&(s(D==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},R=async(y,D)=>{const F=await S(()=>mr(D?{cash:y,pool_id:D}:{cash:y}));return F?(e(G=>({...G??{},cash:F.cash,cash_reserved:F.cash_reserved,cash_free:F.cash_free,cash_pools:F.pool?((G==null?void 0:G.cash_pools)??[]).map(Q=>Q.id===F.pool.id?{...Q,...F.pool}:Q):(G==null?void 0:G.cash_pools)??[]})),s(F.pool?`Cash set to ${Re(F.pool.cash)} — ${Re(F.pool.free)} free in ${F.pool.name}.`:`Cash set to ${Re(F.cash)} — ${Re(F.cash_free)} free.`),!0):!1},x=()=>{var y;return((y=t())==null?void 0:y.cash_pools)??[]},[$,U]=O(null),W=()=>{const y=x();return y.length?y.find(D=>D.id===$())??y[0]:null},ne=async y=>{var F;const D=await S(()=>kn({kind:"pool",name:y}));return D?(s(`Pool “${y}” added — set its cash with the strip.`),U(((F=D.pool)==null?void 0:F.id)??null),await d(),!0):!1},te=async(y,D)=>{await S(()=>mr({pool_id:y,name:D}))&&(s(`Pool renamed to “${D}”.`),await d())},he=async y=>{await S(()=>En(y))&&(s("Pool deleted."),$()===y&&U(null),await d())},L=async(y,D)=>{var G;const F=await S(()=>ta(y,D));F&&(s(`Put moved to ${((G=F.position)==null?void 0:G.pool_name)??"the pool"}.`),await d())},k={busy:l,onDone:()=>o(null),onConfirmPut:N,onConfirmCall:M,onAssign:P},[B,A]=O("lots"),V=()=>[{id:"lots",label:"Lots",count:m().length,sub:`${m().reduce((y,D)=>y+D.shares,0)} sh held`},{id:"puts",label:"Puts",count:h().length,sub:`${h().filter(y=>y.view.pace_met).length} pace-met`},{id:"calls",label:"Calls",count:g().length,sub:`${g().filter(y=>y.view.spot_pct_vs_strike>0).length} ITM`}],K=()=>[...b()].sort((y,D)=>_(D)-_(y)),z=()=>[...I()].sort((y,D)=>_(D)-_(y)),ce={lots:{label:"+ New lot",type:"addLot"},puts:{label:"+ Sell put",type:"addPut"},calls:{label:"+ Sell call",type:"addCall"}},Fe={lots:"No recorded lots — assignments land here.",puts:"No open puts — press “+ Sell put” to record one.",calls:"No open calls — press “+ Sell call” to record one."},se=y=>{if(y==="lots")return f(E,{get when(){return m().length>0},get fallback(){return(()=>{var F=ti();return u(F,()=>Fe.lots),F})()},get children(){var F=Sh();return u(F,f(ie,{get each(){return m()},children:G=>f(Lh,{lot:G,dialogFor:w,busy:l,onSellDialog:Q=>o({type:"sellCall",lot:Q}),onDialogDone:()=>o(null),onSellCall:(Q,_e)=>T(_e,`Sold ${_e.symbol} ${_e.strike}C ×${_e.contracts} — Refresh marks to price.`)})})),F}});const D=y==="puts"?K():z();return f(E,{get when(){return D.length>0},get fallback(){return(()=>{var F=ti();return u(F,()=>Fe[y]),F})()},get children(){var F=kh();return F.firstChild,u(F,f(ie,{each:D,children:G=>f(Mh,{x:G,get showPool(){return x().length>1},get pools(){return x()},onPoolChange:L,dialogFor:w,dialogActions:k,onClose:Q=>o({type:Q.p.kind,pos:Q.p})})}),null),F}})},ke=y=>f(E,{get when(){var D,F,G;return y==="lots"&&((D=a())==null?void 0:D.type)==="addLot"||y==="puts"&&((F=a())==null?void 0:F.type)==="addPut"||y==="calls"&&((G=a())==null?void 0:G.type)==="addCall"},keyed:!0,get children(){return y==="lots"?f(Fh,{busy:l,onDone:()=>o(null),onAdd:D=>T(D,`Recorded ${D.shares} sh ${D.symbol}.`)}):f(Uh,{kind:y==="puts"?"put":"call",get pools(){return x()},busy:l,onDone:()=>o(null),onAdd:D=>T(D,`Sold ${D.symbol} ${D.strike}${y==="puts"?"P":"C"} ×${D.contracts} — Refresh marks to price.`)})}}),Be=y=>(()=>{var D=Ih(),F=D.firstChild;return F.$$click=()=>o({type:ce[y].type}),u(F,()=>ce[y].label),u(D,f(E,{when:y==="lots",get children(){var G=Eh(),Q=G.firstChild;return u(G,()=>m().reduce((_e,re)=>_e+re.shares,0),Q),G}}),null),D})(),st=()=>(()=>{var y=Ch();return y.$$click=C,v(()=>y.disabled=l()),y})(),at=()=>f(E,{get when(){return n()},get children(){var y=Th();return u(y,n),y}});return(()=>{var y=Ah(),D=y.firstChild,F=D.firstChild;F.firstChild;var G=F.nextSibling,Q=G.firstChild,_e=Q.firstChild;return u(F,f(Oh,{get cash(){var re;return((re=t())==null?void 0:re.cash)??null},get reserved(){var re;return((re=t())==null?void 0:re.cash_reserved)??0},get free(){var re;return((re=t())==null?void 0:re.cash_free)??null},get pools(){return x()},get pool(){return W()},busy:l,onSaveCash:R,onSelectPool:U,onAddPool:ne,onRenamePool:te,onDeletePool:he}),null),u(F,f(ie,{get each(){return V()},children:re=>(()=>{var Vt=Ph(),dr=Vt.firstChild,hr=dr.nextSibling,Ss=hr.nextSibling;return Vt.$$click=()=>A(re.id),u(dr,()=>re.label.toUpperCase()),u(hr,()=>re.count),u(Ss,()=>re.sub),v(()=>Vt.classList.toggle("active",B()===re.id)),Vt})()}),null),u(_e,()=>V().find(re=>re.id===B()).label),u(Q,st,null),u(G,at,null),u(G,()=>Be(B()),null),u(G,()=>ke(B()),null),u(G,()=>se(B()),null),y})()}ve(["input","keydown","click"]);async function Gh(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var qh=p("<button type=button class=run-btn>"),Kh=p("<span class=run-count>/"),Jh=p("<span class=run-bar><span class=fill>"),Yh=p("<li><span class=mark></span><span class=label>"),Xh=p("<div class=toast-cached>Served from cache — last run <!> min old"),Qh=p('<div class="toast-cached warn">'),Zh=p("<div class=run-headline>"),ef=p("<ul class=run-stages>"),tf=p("<details class=run-errors><summary>details</summary><ul>"),nf=p("<div class=run-warn>Closing this tab stops the run."),rf=p("<div class=run-warn>Re-checking every 15 s…"),sf=p("<div class=run-strip>"),af=p("<li> ");const ys=["quotes","metrics","chains_short","chains_medium"],vs={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},of=15e3,ws=t=>t!==null&&Date.now()>=t;function ni(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function lf(t){const[e,n]=O("idle"),[r,i]=O(T()),[s,a]=O(null),[o,l]=O(0),[c,d]=O(null),[h,g]=O(null),[m,b]=O("");let I=null,_=null;const[w,S]=O(0);let C=null;et(()=>{const L=t();if(C&&(clearTimeout(C),C=null),(L==null?void 0:L.run_allowed)===!1){const k=fn(L.next_open_utc);k!==null&&(C=setTimeout(()=>S(B=>B+1),Math.max(0,k-Date.now())))}});function T(){return Object.fromEntries(ys.map(L=>[L,{status:"pending",error:null}]))}function P(){I&&clearInterval(I),I=null,_&&clearInterval(_),_=null}function N(){l(0),I=setInterval(()=>l(L=>L+1),1e3)}function M(L){switch(L.type){case"stage_started":i(k=>({...k,[L.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:L.stage,done:L.done,total:L.total});break;case"stage_finished":i(k=>({...k,[L.stage]:{status:L.ok?"ok":"failed",error:L.error??null}}));break;case"run_finished":d(L);break}}function R(){P();const L=c(),k=((L==null?void 0:L.stages)??[]).some(B=>B.name.startsWith("chains")&&["ok","partial"].includes(B.status));n(L&&(k||L.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function x(L){let k=!1;return await Gh(L,B=>{M(B),B.type==="run_finished"&&(k=!0)}),k?(R(),!0):!1}async function $(L){n("detached"),_=setInterval(async()=>{var k,B,A;try{const V=await hi(),K=((B=(k=V==null?void 0:V.result)==null?void 0:k.run)==null?void 0:B.finished_at_utc)??null;if(K&&K!==L){i(U(V.result)),P(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((A=V==null?void 0:V.run_state)==null?void 0:A.status)!=="running"&&(P(),n("idle"),b("Stream lost and the run was canceled — press Run to retry."))}catch{}},of)}function U(L){const k=T();for(const B of(L==null?void 0:L.stages)??[])k[B.name]&&(k[B.name]={status:B.status,error:B.error});return k}async function W(){var A,V,K;if(["starting","running","detached"].includes(e()))return;b(""),d(null),a(null),i(T()),g(null);const L=((K=(V=(A=t())==null?void 0:A.result)==null?void 0:V.run)==null?void 0:K.finished_at_utc)??null;n("running"),N();let k;try{k=await Qs()}catch{P(),n("idle"),b("Run failed to start — network or server unreachable.");return}const B=k.headers.get("content-type")??"";if(k.ok&&B.includes("application/json")){const z=await k.json().catch(()=>null);if(P(),n("idle"),(z==null?void 0:z.status)==="cached"){g(z.age_secs),setTimeout(()=>g(null),6e3);return}}if(k.status===403&&B.includes("application/json")){const z=await k.json().catch(()=>null);P(),n("idle"),b(z!=null&&z.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(z.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(k.status===202){const z=await Zs();if(z.ok&&(z.headers.get("content-type")??"").includes("text/event-stream")){await x(z)||await $(L);return}await $(L);return}if(B.includes("text/event-stream")){await x(k)||await $(L);return}P(),n("idle"),b(`Unexpected /api/run response (${k.status}, ${B||"no type"}).`)}return Oe(()=>{P(),C&&clearTimeout(C)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:m,triggerRun:W,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{w();const L=t();return(L==null?void 0:L.run_allowed)!==!1?!0:ws(fn(L==null?void 0:L.next_open_utc))},nextOpenUtc:()=>{var L;return((L=t())==null?void 0:L.next_open_utc)??null}}}function cf(t){const e=()=>!t.run.runAllowed(),n=()=>ds(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=qh();return i.$$click=()=>t.run.triggerRun(),u(i,r),v(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&ee(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function uf(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=Yh(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>vs[t.name]),u(i,f(E,{get when(){return r()!==null},get children(){return[(()=>{var o=Kh(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=Jh(),l=o.firstChild;return v(c=>tt(l,"width",`${r()}%`)),o})()]}}),null),v(()=>ue(i,`run-stage ${e()}`)),i})()}function df(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",Y(()=>ni(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",Y(()=>ni(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(E,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=sf();return u(i,f(E,{get when(){return e.cachedToast()},get children(){var s=Xh(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(E,{get when(){return e.notice()},get children(){var s=Qh();return u(s,()=>e.notice()),s}}),null),u(i,f(E,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=Zh();return u(s,r),s})(),(()=>{var s=ef();return u(s,()=>ys.map(a=>f(uf,{name:a,run:e}))),s})(),f(E,{get when(){return Y(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=tf(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=af(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>vs[l.name]??l.name,null),u(c,(()=>{var h=Y(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,f(E,{get when(){return Y(()=>e.phase()==="running")()&&!n()},get children(){return nf()}}),null),u(i,f(E,{get when(){return e.phase()==="detached"},get children(){return rf()}}),null),i}})}ve(["click"]);var $s=p("<b>"),hf=p("<span>Market closed · last run <b></b> ago"),ff=p("<div class=cache-line><span></span><span class=pill>run: "),gf=p("<span>Cached · <b></b> left"),pf=p("<span>Stale · last run <b></b> ago"),mf=p("<nav class=tabs role=tablist aria-label=timeframes>"),_f=p("<button type=button role=tab class=tab>"),bf=p("<svg><circle cx=12 cy=12 r=4></svg>",!1,!0,!1),yf=p('<svg><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></svg>',!1,!0,!1),vf=p('<button type=button class="btn-ghost theme-toggle"><svg width=14 height=14 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true>'),wf=p('<svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></svg>',!1,!0,!1),$f=p('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),Sf=p("<div class=pop-backdrop>"),kf=p("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),Ef=p("<div class=error-banner>API error: "),If=p("<div class=shell><header><div class=user-box></div><div class=theme-slot-head></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),Cf=p("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function Tf(){const[t,e]=O(Pu()),n=r=>{e(r),Ru(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(Et)}}function ri(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function Af(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function ii(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function Fn(t){return f(E,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=$s();return u(e,()=>t.at()),e})()]}})}function Pf(t){const[e,n]=O(0);gt(()=>{const m=setInterval(()=>n(b=>b+1),3e4);Oe(()=>clearInterval(m))});let r=Date.now(),i=0;et(Ct(()=>t.envelope,m=>{r=Date.now(),i=(m==null?void 0:m.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const m=Math.max(0,(t.envelope.cache_secs??0)-s());return m>=60?`${Math.floor(m/60)}m`:`${m}s`},c=()=>{var m,b;return Wu((b=(m=t.envelope.result)==null?void 0:m.run)==null?void 0:b.finished_at_utc)},d=()=>{e();const m=t.envelope.next_open_utc,b=fn(m);if(!(b===null||ws(b)))return ds(m)},h=()=>o()&&a()==="stale"?"closed":a(),g=()=>a()==="fresh"||a()==="stale";return(()=>{var m=ff(),b=m.firstChild,I=b.nextSibling;return I.firstChild,u(m,f(E,{get when(){return Y(()=>!!o())()&&g()},get fallback(){return f(E,{get when(){return a()==="fresh"},get fallback(){return f(E,{get when(){return a()==="stale"},get children(){var _=pf(),w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(S,()=>ii(s())),u(_,f(Fn,{at:c}),null),_}})},get children(){var _=gf(),w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(S,l),u(_,f(Fn,{at:c}),null),_}})},get children(){var _=hf(),w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(S,()=>ii(s())),u(_,f(Fn,{at:c}),null),u(_,f(E,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var C=$s();return u(C,d),C})()]}}),null),_}}),b),u(b,(()=>{var _=Y(()=>h()==="closed");return()=>_()?"market closed":a()})()),u(I,()=>{var _;return((_=t.envelope.run_state)==null?void 0:_.status)??"idle"},null),v(()=>ue(b,"pill "+h())),m})()}function si(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=mf();return u(n,()=>e.map(r=>(()=>{var i=_f();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=Y(()=>!r.holdings);return()=>s()&&` (${It(Af(t.result,r.id))})`})(),null),v(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&ee(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function Rf(){const[t,e]=O(null),n=()=>window.matchMedia("(prefers-color-scheme: dark)").matches,r=()=>t()??(n()?"dark":"light"),i=()=>{const a=r()==="dark"?"light":"dark";document.documentElement.dataset.theme=a,e(a)},s=()=>r()==="dark"?"Switch to light theme":"Switch to dark theme";return(()=>{var a=vf(),o=a.firstChild;return a.$$click=i,u(o,f(E,{get when(){return r()==="dark"},get fallback(){return wf()},get children(){return[bf(),yf()]}})),v(l=>{var c=s(),d=s();return c!==l.e&&ee(a,"aria-label",l.e=c),d!==l.t&&ee(a,"title",l.t=d),l},{e:void 0,t:void 0}),a})()}function xf(){const[t,e]=O(void 0),[n,{refetch:r}]=Rs(t,w=>w?hi():void 0);gt(()=>{if(!_t){e(null);return}const w=Ul(lt(),e);Oe(w)});const[i,s]=O(!1);et(Ct(t,w=>{s(!1),!(!w||!_t)&&Ks().then(S=>s(S.status===403)).catch(()=>{})})),gt(()=>{const w=()=>r();window.addEventListener("webapp:refresh-latest",w),Oe(()=>window.removeEventListener("webapp:refresh-latest",w))});const a=()=>{var w,S;return((w=t())==null?void 0:w.email)||((S=t())==null?void 0:S.uid)||""},[o,l]=O(!1),[c,d]=O(!1),h=Tf(),[g,m]=O("short"),b=()=>g()==="holdings",I=Cu(),_=lf(()=>n());return f(E,{get when(){return t()},get fallback(){return f(du,{})},get children(){return[f(E,{get when(){return!i()},get fallback(){return f(uu,{get email(){return a()},onSignOut:()=>Kr()})},get children(){var w=If(),S=w.firstChild,C=S.firstChild,T=C.nextSibling,P=T.nextSibling,N=P.nextSibling;return u(C,f(E,{get when(){return t()},get children(){return[(()=>{var M=$f(),R=M.firstChild,x=R.nextSibling;return M.$$click=()=>l(!o()),u(x,a),v(()=>ee(M,"aria-expanded",o())),M})(),f(E,{get when(){return o()},get children(){return[(()=>{var M=Sf();return M.$$click=()=>l(!1),M})(),(()=>{var M=kf(),R=M.firstChild,x=R.nextSibling,$=x.nextSibling,U=$.nextSibling;return u(x,a),$.$$click=()=>{l(!1),d(!0)},U.$$click=()=>{l(!1),Kr()},M})()]}})]}})),u(T,f(Rf,{})),u(S,f(E,{get when(){return Y(()=>!n.loading)()&&!n.error},get children(){return f(Pf,{get envelope(){return n()}})}}),N),u(N,f(cf,{run:_})),u(w,f(E,{get when(){return n.error},get children(){var M=Ef();return M.firstChild,u(M,()=>n.error.message,null),M}}),null),u(w,f(df,{run:_}),null),u(w,f(E,{get when(){return b()},get children(){return[f(si,{result:()=>{var M;return(M=n())==null?void 0:M.result},tab:g,onTab:m}),f(zh,{})]}}),null),u(w,f(E,{get when(){return!b()},get children(){return f(E,{get when(){var M;return Y(()=>!n.loading)()&&((M=n())==null?void 0:M.result)},get fallback(){return f(E,{get when(){return!n.loading},get children(){return Cf()}})},children:M=>{const R=()=>M();return[f(Au,{scoring:I}),f(si,{result:R,tab:g,onTab:m}),f(ei,{id:"short",active:()=>g()==="short",get tf(){var x;return(x=R().timeframes)==null?void 0:x.short},get stageError(){return ri(R(),"chains_short")},get stages(){return R().stages},get thresholds(){return R().thresholds},columns:h,scoring:I}),f(ei,{id:"medium",active:()=>g()==="medium",get tf(){var x;return(x=R().timeframes)==null?void 0:x.medium},get stageError(){return ri(R(),"chains_medium")},get stages(){return R().stages},get thresholds(){return R().thresholds},columns:h,scoring:I})]}})}}),null),w}}),f(E,{get when(){return c()},get children(){return f(_u,{onClose:()=>d(!1)})}})]}})}ve(["click"]);js(()=>f(xf,{}),document.getElementById("root"));
