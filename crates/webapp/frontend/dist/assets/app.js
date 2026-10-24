(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const Fs=!1,Bs=(t,e)=>t===e,Yn=Symbol("solid-proxy"),Hs=typeof Proxy=="function",Vs=Symbol("solid-track"),cn={equals:Bs};let pi=vi;const Ve=1,un=2,mi={owned:null,cleanups:null,context:null,owner:null},xn={};var ie=null;let Rn=null,Ws=null,re=null,fe=null,Ue=null,Sn=0;function en(t,e){const n=re,r=ie,i=t.length===0,s=e===void 0?r:e,a=i?mi:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>$e(()=>Mt(a)));ie=a,re=null;try{return Xe(o,!0)}finally{re=n,ie=r}}function M(t,e){e=e?Object.assign({},cn,e):cn;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),bi(n,i));return[_i.bind(n),r]}function js(t,e,n){const r=kn(t,e,!0,Ve);kt(r)}function w(t,e,n){const r=kn(t,e,!1,Ve);kt(r)}function st(t,e,n){pi=Xs;const r=kn(t,e,!1,Ve);r.user=!0,Ue?Ue.push(r):kt(r)}function he(t,e,n){n=n?Object.assign({},cn,n):cn;const r=kn(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,kt(r),_i.bind(r)}function zs(t){return t&&typeof t=="object"&&"then"in t}function Gs(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=xn,l=!1,u="initialValue"in s,d=typeof r=="function"&&he(r);const h=new Set,[g,_]=(s.storage||M)(s.initialValue),[b,T]=M(void 0),[m,v]=M(void 0,{equals:!1}),[P,D]=M(u?"ready":"unresolved");ie&&Fe(()=>{for(const N of h.keys())N.decrement();h.clear(),a=null});function R(N,I,k,B){return a===N&&(a=null,B!==void 0&&(u=!0),(N===o||I===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(B,{value:I})),o=xn,O(I,k)),I}function O(N,I){Xe(()=>{I===void 0&&_(()=>N),D(I!==void 0?"errored":u?"ready":"unresolved"),T(I);for(const k of h.keys())k.decrement();h.clear()},!1)}function x(){const N=Ks,I=g(),k=b();if(k!==void 0&&!a)throw k;return re&&re.user,I}function $(N=!0){if(N!==!1&&l)return;l=!1;const I=d?d():r;if(I==null||I===!1){R(a,$e(g));return}let k;const B=o!==xn?o:$e(()=>{try{return i(I,{value:g(),refetching:N})}catch(E){k=E}});if(k!==void 0){R(a,void 0,tn(k),I);return}else if(!zs(B))return R(a,B,void 0,I),B;return a=B,"v"in B?(B.s===1?R(a,B.v,void 0,I):R(a,void 0,tn(B.v),I),B):(l=!0,queueMicrotask(()=>l=!1),Xe(()=>{D(u?"refreshing":"pending"),v()},!1),B.then(E=>R(B,E,void 0,I),E=>R(B,void 0,tn(E),I)))}Object.defineProperties(x,{state:{get:()=>P()},error:{get:()=>b()},loading:{get(){const N=P();return N==="pending"||N==="refreshing"}},latest:{get(){if(!u)return x();const N=b();if(N&&!a)throw N;return g()}}});let A=ie;return d?js(()=>(A=ie,$(!1))):$(!1),[x,{refetch:N=>qs(A,()=>$(N)),mutate:_}]}function $e(t){if(re===null)return t();const e=re;re=null;try{return t()}finally{re=e}}function Ot(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=$e(()=>e(a,i,s));return i=a,o}}function vt(t){st(()=>$e(t))}function Fe(t){return ie===null||(ie.cleanups===null?ie.cleanups=[t]:ie.cleanups.push(t)),t}function qs(t,e){const n=ie,r=re;ie=t,re=null;try{return Xe(e,!0)}catch(i){ar(i)}finally{ie=n,re=r}}const[ig,sg]=M(!1);let Ks;function _i(){if(this.sources&&this.state)if(this.state===Ve)kt(this);else{const t=fe;fe=null,Xe(()=>hn(this),!1),fe=t}if(re){const t=this.observers;if(!t||t[t.length-1]!==re){const e=t?t.length:0;re.sources?(re.sources.push(this),re.sourceSlots.push(e)):(re.sources=[this],re.sourceSlots=[e]),t?(t.push(re),this.observerSlots.push(re.sources.length-1)):(this.observers=[re],this.observerSlots=[re.sources.length-1])}}return this.value}function bi(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Xe(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=Rn&&Rn.running;a&&Rn.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?fe.push(s):Ue.push(s),s.observers&&yi(s)),a||(s.state=Ve)}if(fe.length>1e6)throw fe=[],new Error},!1)),e}function kt(t){if(!t.fn)return;Mt(t);const e=Sn;Js(t,t.value,e)}function Js(t,e,n){let r;const i=ie,s=re;re=ie=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Ve,t.owned&&t.owned.forEach(Mt),t.owned=null),t.updatedAt=n+1,ar(a)}finally{re=s,ie=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?bi(t,r):t.value=r,t.updatedAt=n)}function kn(t,e,n,r=Ve,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:ie,context:ie?ie.context:null,pure:n};return ie===null||ie!==mi&&(ie.owned?ie.owned.push(s):ie.owned=[s]),s}function dn(t){if(t.state===0)return;if(t.state===un)return hn(t);if(t.suspense&&$e(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<Sn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Ve)kt(t);else if(t.state===un){const r=fe;fe=null,Xe(()=>hn(t,e[0]),!1),fe=r}}function Xe(t,e){if(fe)return t();let n=!1;e||(fe=[]),Ue?n=!0:Ue=[],Sn++;try{const r=t();return Ys(n),r}catch(r){n||(Ue=null),fe=null,ar(r)}}function Ys(t){if(fe&&(vi(fe),fe=null),t)return;const e=Ue;Ue=null,e.length&&Xe(()=>pi(e),!1)}function vi(t){for(let e=0;e<t.length;e++)dn(t[e])}function Xs(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:dn(r)}for(e=0;e<n;e++)dn(t[e])}function hn(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Ve?r!==e&&(!r.updatedAt||r.updatedAt<Sn)&&dn(r):i===un&&hn(r,e)}}}function yi(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=un,n.pure?fe.push(n):Ue.push(n),n.observers&&yi(n))}}function Mt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)Mt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)Mt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function tn(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function ar(t,e=ie){throw tn(t)}const Qs=Symbol("fallback");function wr(t){for(let e=0;e<t.length;e++)t[e]()}function Zs(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Fe(()=>wr(s)),()=>{let l=t()||[],u=l.length,d,h;return l[Vs],$e(()=>{let _,b,T,m,v,P,D,R,O;if(u===0)a!==0&&(wr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Qs],i[0]=en(x=>(s[0]=x,n.fallback())),a=1);else if(a===0){for(i=new Array(u),h=0;h<u;h++)r[h]=l[h],i[h]=en(g);a=u}else{for(T=new Array(u),m=new Array(u),o&&(v=new Array(u)),P=0,D=Math.min(a,u);P<D&&r[P]===l[P];P++);for(D=a-1,R=u-1;D>=P&&R>=P&&r[D]===l[R];D--,R--)T[R]=i[D],m[R]=s[D],o&&(v[R]=o[D]);for(_=new Map,b=new Array(R+1),h=R;h>=P;h--)O=l[h],d=_.get(O),b[h]=d===void 0?-1:d,_.set(O,h);for(d=P;d<=D;d++)O=r[d],h=_.get(O),h!==void 0&&h!==-1?(T[h]=i[d],m[h]=s[d],o&&(v[h]=o[d]),h=b[h],_.set(O,h)):s[d]();for(h=P;h<u;h++)h in T?(i[h]=T[h],s[h]=m[h],o&&(o[h]=v[h],o[h](h))):i[h]=en(g);i=i.slice(0,a=u),r=l.slice(0)}return i});function g(_){if(s[h]=_,o){const[b,T]=M(h);return o[h]=T,e(l[h],b)}return e(l[h])}}}function f(t,e){return $e(()=>t(e||{}))}function Xt(){return!0}const ea={get(t,e,n){return e===Yn?n:t.get(e)},has(t,e){return e===Yn?!0:t.has(e)},set:Xt,deleteProperty:Xt,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:Xt,deleteProperty:Xt}},ownKeys(t){return t.keys()}};function Nn(t){return(t=typeof t=="function"?t():t)?t:{}}function ta(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function na(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Yn in o,t[a]=typeof o=="function"?(e=!0,he(o)):o}if(Hs&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=Nn(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in Nn(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys(Nn(t[o])));return[...new Set(a)]}},ea);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let u=l.length-1;u>=0;u--){const d=l[u];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:ta.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const g=n[d];g&&(h.get?g.push(h.get.bind(o)):h.value!==void 0&&g.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const ra=t=>`Stale read from <${t}>.`;function se(t){const e="fallback"in t&&{fallback:()=>t.fallback};return he(Zs(()=>t.each,t.children,e||void 0))}function S(t){const e=t.keyed,n=he(()=>t.when,void 0,void 0),r=e?n:he(n,void 0,{equals:(i,s)=>!i==!s});return he(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?$e(()=>s(e?i:()=>{if(!$e(r))throw ra("Show");return n()})):s}return t.fallback},void 0,void 0)}const Y=t=>he(()=>t());function ia(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,u=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!u||!u.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!u){u=new Map;let h=o;for(;h<s;)u.set(n[h],h++)}const d=u.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,g=1,_;for(;++h<i&&h<s&&!((_=u.get(e[h]))==null||_!==d+g);)g++;if(g>d-o){const b=e[a];for(;o<d;)t.insertBefore(n[o++],b)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const $r="_$DX_DELEGATE";function sa(t,e,n,r={}){let i;return en(s=>{i=s,e===document?t():c(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function p(t,e,n,r){let i;const s=()=>{const o=r?document.createElementNS("http://www.w3.org/1998/Math/MathML","template"):document.createElement("template");return o.innerHTML=t,n?o.content.firstChild.firstChild:r?o.firstChild:o.content.firstChild},a=e?()=>$e(()=>document.importNode(i||(i=s()),!0)):()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function Ce(t,e=window.document){const n=e[$r]||(e[$r]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,oa))}}function ae(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function ye(t,e){e==null?t.removeAttribute("class"):t.className=e}function G(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function at(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function aa(t,e,n){return $e(()=>t(e,n))}function c(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return fn(t,e,r,n);w(i=>fn(t,e(),i,n),r)}function oa(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const u=e[`${n}Data`];if(u!==void 0?l.call(e,u,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let u=0;u<l.length-2&&(e=l[u],!!a());u++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function fn(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=ht(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=ht(t,n,r);else{if(s==="function")return w(()=>{let o=e();for(;typeof o=="function";)o=o();n=fn(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Xn(o,e,n,i))return w(()=>n=fn(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=ht(t,n,r),a)return n}else l?n.length===0?Sr(t,o,r):ia(t,n,o):(n&&ht(t),Sr(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=ht(t,n,r,e);ht(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Xn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],u;if(!(o==null||o===!0||o===!1))if((u=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Xn(t,o,l)||i;else if(u==="function")if(r){for(;typeof o=="function";)o=o();i=Xn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function Sr(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function ht(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let nn=null;function la(t){nn=t}async function me(t,e={}){if(!nn)return fetch(t,e);const n=new Headers(e.headers??{}),r=await nn(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await nn(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function wi(){const t=await me("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function ca(){return me("/api/me")}async function ua(){const t=await me("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function da(t){const e=await me("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function ha(t){const e=await me("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function fa(){return await me("/api/run",{method:"POST"})}async function ga(){return me("/api/progress")}async function pa(){const t=await me("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function On(t){const e=await me("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function Dn(t){const e=await me(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function kr(t,e){const n=await me(`/api/holdings/${encodeURIComponent(t)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pool_id:e})}),r=await n.json().catch(()=>null);if(!n.ok)throw new Error((r==null?void 0:r.error)??`PATCH /api/holdings/${t} -> ${n.status}`);return r}async function ma(){const t=await me("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function Er(t){const e=await me("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function _a(t,e,n,r){const i=await me("/api/holdings/close",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lot_id:t,shares:e,price:n,...r?{pool_id:r}:{}})}),s=await i.json().catch(()=>null);if(!i.ok)throw new Error((s==null?void 0:s.error)??`POST /api/holdings/close -> ${i.status}`);return s}async function ba(t){const e=await me("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const va=()=>{};var Cr={};/**
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
 */const $i=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},ya=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Si={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,u=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let g=(o&15)<<2|u>>6,_=u&63;l||(_=64,a||(g=64)),r.push(n[d],n[h],n[g],n[_])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray($i(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):ya(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const u=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||u==null||h==null)throw new wa;const g=s<<2|o>>4;if(r.push(g),u!==64){const _=o<<4&240|u>>2;if(r.push(_),h!==64){const b=u<<6&192|h;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class wa extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const $a=function(t){const e=$i(t);return Si.encodeByteArray(e,!0)},ki=function(t){return $a(t).replace(/\./g,"")},Ei=function(t){try{return Si.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Sa(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const ka=()=>Sa().__FIREBASE_DEFAULTS__,Ea=()=>{if(typeof process>"u"||typeof Cr>"u")return;const t=Cr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Ca=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Ei(t[1]);return e&&JSON.parse(e)},or=()=>{try{return va()||ka()||Ea()||Ca()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Ia=t=>{var e,n;return(n=(e=or())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},Ci=()=>{var t;return(t=or())==null?void 0:t.config},Ii=t=>{var e;return(e=or())==null?void 0:e[`_${t}`]};/**
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
 */class Ti{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function pe(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ta(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(pe())}function Pa(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Aa(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function xa(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ra(){const t=pe();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Na(){try{return typeof indexedDB=="object"}catch{return!1}}function Oa(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const Da="FirebaseError";class Qe extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Da,Object.setPrototypeOf(this,Qe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Vt.prototype.create)}}class Vt{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?La(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new Qe(i,o,r)}}function La(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function Ma(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function yt(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(Ir(s)&&Ir(a)){if(!yt(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function Ir(t){return t!==null&&typeof t=="object"}/**
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
 */function Wt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function At(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function xt(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Ua(t,e){const n=new Fa(t,e);return n.subscribe.bind(n)}class Fa{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Ba(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Ln),i.error===void 0&&(i.error=Ln),i.complete===void 0&&(i.complete=Ln);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Ba(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Ln(){}/**
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
 */function We(t){return t&&t._delegate?t._delegate:t}/**
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
 */function lr(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ha(t){return(await fetch(t,{credentials:"include"})).ok}class wt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const rt="[DEFAULT]";/**
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
 */class Va{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new Ti;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ja(e))try{this.getOrInitializeService({instanceIdentifier:rt})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=rt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=rt){return this.instances.has(e)}getOptions(e=rt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Wa(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=rt){return this.component?this.component.multipleInstances?e:rt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Wa(t){return t===rt?void 0:t}function ja(t){return t.instantiationMode==="EAGER"}/**
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
 */class za{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Va(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var te;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(te||(te={}));const Ga={debug:te.DEBUG,verbose:te.VERBOSE,info:te.INFO,warn:te.WARN,error:te.ERROR,silent:te.SILENT},qa=te.INFO,Ka={[te.DEBUG]:"log",[te.VERBOSE]:"log",[te.INFO]:"info",[te.WARN]:"warn",[te.ERROR]:"error"},Ja=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Ka[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Pi{constructor(e){this.name=e,this._logLevel=qa,this._logHandler=Ja,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in te))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ga[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,te.DEBUG,...e),this._logHandler(this,te.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,te.VERBOSE,...e),this._logHandler(this,te.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,te.INFO,...e),this._logHandler(this,te.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,te.WARN,...e),this._logHandler(this,te.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,te.ERROR,...e),this._logHandler(this,te.ERROR,...e)}}const Ya=(t,e)=>e.some(n=>t instanceof n);let Tr,Pr;function Xa(){return Tr||(Tr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Qa(){return Pr||(Pr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ai=new WeakMap,Qn=new WeakMap,xi=new WeakMap,Mn=new WeakMap,cr=new WeakMap;function Za(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Ye(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&Ai.set(n,t)}).catch(()=>{}),cr.set(e,t),e}function eo(t){if(Qn.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Qn.set(t,e)}let Zn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Qn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||xi.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Ye(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function to(t){Zn=t(Zn)}function no(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Un(this),e,...n);return xi.set(r,e.sort?e.sort():[e]),Ye(r)}:Qa().includes(t)?function(...e){return t.apply(Un(this),e),Ye(Ai.get(this))}:function(...e){return Ye(t.apply(Un(this),e))}}function ro(t){return typeof t=="function"?no(t):(t instanceof IDBTransaction&&eo(t),Ya(t,Xa())?new Proxy(t,Zn):t)}function Ye(t){if(t instanceof IDBRequest)return Za(t);if(Mn.has(t))return Mn.get(t);const e=ro(t);return e!==t&&(Mn.set(t,e),cr.set(e,t)),e}const Un=t=>cr.get(t);function io(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Ye(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Ye(a.result),l.oldVersion,l.newVersion,Ye(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),o}const so=["get","getKey","getAll","getAllKeys","count"],ao=["put","add","delete","clear"],Fn=new Map;function Ar(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Fn.get(e))return Fn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=ao.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||so.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let u=l.store;return r&&(u=u.index(o.shift())),(await Promise.all([u[n](...o),i&&l.done]))[0]};return Fn.set(e,s),s}to(t=>({...t,get:(e,n,r)=>Ar(e,n)||t.get(e,n,r),has:(e,n)=>!!Ar(e,n)||t.has(e,n)}));/**
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
 */class oo{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(lo(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function lo(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const er="@firebase/app",xr="0.16.1";/**
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
 */const Be=new Pi("@firebase/app"),co="@firebase/app-compat",uo="@firebase/analytics-compat",ho="@firebase/analytics",fo="@firebase/app-check-compat",go="@firebase/app-check",po="@firebase/auth",mo="@firebase/auth-compat",_o="@firebase/database",bo="@firebase/data-connect",vo="@firebase/database-compat",yo="@firebase/functions",wo="@firebase/functions-compat",$o="@firebase/installations",So="@firebase/installations-compat",ko="@firebase/messaging",Eo="@firebase/messaging-compat",Co="@firebase/performance",Io="@firebase/performance-compat",To="@firebase/remote-config",Po="@firebase/remote-config-compat",Ao="@firebase/storage",xo="@firebase/storage-compat",Ro="@firebase/firestore",No="@firebase/ai",Oo="@firebase/firestore-compat",Do="firebase",Lo="12.18.0";/**
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
 */const tr="[DEFAULT]",Mo={[er]:"fire-core",[co]:"fire-core-compat",[ho]:"fire-analytics",[uo]:"fire-analytics-compat",[go]:"fire-app-check",[fo]:"fire-app-check-compat",[po]:"fire-auth",[mo]:"fire-auth-compat",[_o]:"fire-rtdb",[bo]:"fire-data-connect",[vo]:"fire-rtdb-compat",[yo]:"fire-fn",[wo]:"fire-fn-compat",[$o]:"fire-iid",[So]:"fire-iid-compat",[ko]:"fire-fcm",[Eo]:"fire-fcm-compat",[Co]:"fire-perf",[Io]:"fire-perf-compat",[To]:"fire-rc",[Po]:"fire-rc-compat",[Ao]:"fire-gcs",[xo]:"fire-gcs-compat",[Ro]:"fire-fst",[Oo]:"fire-fst-compat",[No]:"fire-vertex","fire-js":"fire-js",[Do]:"fire-js-all"};/**
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
 */const gn=new Map,Uo=new Map,nr=new Map;function Rr(t,e){try{t.container.addComponent(e)}catch(n){Be.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Ut(t){const e=t.name;if(nr.has(e))return Be.debug(`There were multiple attempts to register component ${e}.`),!1;nr.set(e,t);for(const n of gn.values())Rr(n,t);for(const n of Uo.values())Rr(n,t);return!0}function Ri(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function be(t){return t==null?!1:t.settings!==void 0}/**
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
 */const Fo={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ne=new Vt("app","Firebase",Fo);/**
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
 */class Bo{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new wt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ne.create("app-deleted",{appName:this._name})}}/**
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
 */const jt=Lo;function Ni(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:tr,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw Ne.create("bad-app-name",{appName:String(i)});if(n||(n=Ci()),!n)throw Ne.create("no-options");const s=gn.get(i);if(s)if(yt(n,s.options)){if(yt(r,s.config))return s;throw Ne.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw Ne.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new za(i);for(const l of nr.values())a.addComponent(l);const o=new Bo(n,r,a);return gn.set(i,o),o}function Ho(t=tr){const e=gn.get(t);if(!e&&t===tr&&Ci())return Ni();if(!e)throw Ne.create("no-app",{appName:t});return e}function pt(t,e,n){let r=Mo[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Be.warn(a.join(" "));return}Ut(new wt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Vo="firebase-heartbeat-database",Wo=1,Ft="firebase-heartbeat-store";let Bn=null;function Oi(){return Bn||(Bn=io(Vo,Wo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Ft)}catch(n){console.warn(n)}}}}).catch(t=>{throw Ne.create("idb-open",{originalErrorMessage:t.message})})),Bn}async function jo(t){try{const n=(await Oi()).transaction(Ft),r=await n.objectStore(Ft).get(Di(t));return await n.done,r}catch(e){if(e instanceof Qe)Be.warn(e.message);else{const n=Ne.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Be.warn(n.message)}}}async function Nr(t,e){try{const r=(await Oi()).transaction(Ft,"readwrite");await r.objectStore(Ft).put(e,Di(t)),await r.done}catch(n){if(n instanceof Qe)Be.warn(n.message);else{const r=Ne.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Be.warn(r.message)}}}function Di(t){return`${t.name}!${t.options.appId}`}/**
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
 */const zo=1024,Go=30;class qo{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Jo(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Or();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Go){const a=Yo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Be.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Or(),{heartbeatsToSend:r,unsentEntries:i}=Ko(this._heartbeatsCache.heartbeats),s=ki(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Be.warn(n),""}}}function Or(){return new Date().toISOString().substring(0,10)}function Ko(t,e=zo){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Dr(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Dr(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Jo{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Na()?Oa().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await jo(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Nr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Nr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Dr(t){return ki(JSON.stringify({version:2,heartbeats:t})).length}function Yo(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function Xo(t){Ut(new wt("platform-logger",e=>new oo(e),"PRIVATE")),Ut(new wt("heartbeat",e=>new qo(e),"PRIVATE")),pt(er,xr,t),pt(er,xr,"esm2020"),pt("fire-js","")}/**
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
 */Xo("");var Qo="firebase",Zo="12.18.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */pt(Qo,Zo,"app");function Li(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const el=Li,Mi=new Vt("auth","Firebase",Li());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pn=new Pi("@firebase/auth");function Ui(t,...e){pn.logLevel<=te.WARN&&pn.warn(`Auth (${jt}): ${t}`,...e)}function rn(t,...e){pn.logLevel<=te.ERROR&&pn.error(`Auth (${jt}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Se(t,...e){throw dr(t,...e)}function Ee(t,...e){return dr(t,...e)}function ur(t,e,n){const r={...el(),[e]:n};return new Vt("auth","Firebase",r).create(e,{appName:t.name})}function Pe(t){return ur(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Fi(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&Se(t,"argument-error"),ur(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function dr(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return Mi.create(t,...e)}function j(t,e,...n){if(!t)throw dr(e,...n)}function Oe(t){const e="INTERNAL ASSERTION FAILED: "+t;throw rn(e),new Error(e)}function He(t,e){t||Oe(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function tl(){return Lr()==="http:"||Lr()==="https:"}function Lr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nl(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(tl()||Aa()||"connection"in navigator)?navigator.onLine:!0}function rl(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(e,n){this.shortDelay=e,this.longDelay=n,He(n>e,"Short delay should be less than long delay!"),this.isMobile=Ta()||xa()}get(){return nl()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hr(t,e){He(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bi{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Oe("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Oe("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Oe("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const il={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sl=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],al=new zt(3e4,6e4);function Ze(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function et(t,e,n,r,i={}){return Hi(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Wt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const u={method:e,headers:l,...s};return Pa()||(u.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&lr(t.emulatorConfig.host)&&(u.credentials="include"),Bi.fetch()(await Vi(t,t.config.apiHost,n,o),u)})}async function Hi(t,e,n){t._canInitEmulator=!1;const r={...il,...e};try{const i=new ll(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Qt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,u]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Qt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Qt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Qt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw ur(t,d,u);Se(t,d)}}catch(i){if(i instanceof Qe)throw i;Se(t,"network-request-failed",{message:String(i)})}}async function Gt(t,e,n,r,i={}){const s=await et(t,e,n,r,i);return"mfaPendingCredential"in s&&Se(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function Vi(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?hr(t.config,i):`${t.config.apiScheme}://${i}`;return sl.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function ol(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class ll{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Ee(this.auth,"network-request-failed")),al.get())})}}function Qt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=Ee(t,e,r);return i.customData._tokenResponse=n,i}function Mr(t){return t!==void 0&&t.enterprise!==void 0}class cl{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return ol(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function ul(t,e){return et(t,"GET","/v2/recaptchaConfig",Ze(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dl(t,e){return et(t,"POST","/v1/accounts:delete",e)}async function mn(t,e){return et(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dt(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function hl(t,e=!1){const n=We(t),r=await n.getIdToken(e),i=fr(r);j(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Dt(Hn(i.auth_time)),issuedAtTime:Dt(Hn(i.iat)),expirationTime:Dt(Hn(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Hn(t){return Number(t)*1e3}function fr(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return rn("JWT malformed, contained fewer than 3 sections"),null;try{const i=Ei(n);return i?JSON.parse(i):(rn("Failed to decode base64 JWT payload"),null)}catch(i){return rn("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Ur(t){const e=fr(t);return j(e,"internal-error"),j(typeof e.exp<"u","internal-error"),j(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bt(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Qe&&fl(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function fl({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gl{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ir{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Dt(this.lastLoginAt),this.creationTime=Dt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function _n(t){var h;const e=t.auth,n=await t.getIdToken(),r=await Bt(t,mn(e,{idToken:n}));j(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?Wi(i.providerUserInfo):[],a=ml(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),u=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new ir(i.createdAt,i.lastLoginAt),isAnonymous:u};Object.assign(t,d)}async function pl(t){const e=We(t);await _n(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function ml(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Wi(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _l(t,e){const n=await Hi(t,{},async()=>{const r=Wt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await Vi(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&lr(t.emulatorConfig.host)&&(l.credentials="include"),Bi.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function bl(t,e){return et(t,"POST","/v2/accounts:revokeToken",Ze(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){j(e.idToken,"internal-error"),j(typeof e.idToken<"u","internal-error"),j(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ur(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){j(e.length!==0,"internal-error");const n=Ur(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(j(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await _l(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new mt;return r&&(j(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(j(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(j(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new mt,this.toJSON())}_performRefresh(){return Oe("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ze(t,e){j(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class ke{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new gl(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new ir(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Bt(this,this.stsTokenManager.getToken(this.auth,e));return j(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return hl(this,e)}reload(){return pl(this)}_assign(e){this!==e&&(j(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new ke({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){j(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await _n(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(be(this.auth.app))return Promise.reject(Pe(this.auth));const e=await this.getIdToken();return await Bt(this,dl(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,u=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:g,isAnonymous:_,providerData:b,stsTokenManager:T}=n;j(h&&T,e,"internal-error");const m=mt.fromJSON(this.name,T);j(typeof h=="string",e,"internal-error"),ze(r,e.name),ze(i,e.name),j(typeof g=="boolean",e,"internal-error"),j(typeof _=="boolean",e,"internal-error"),ze(s,e.name),ze(a,e.name),ze(o,e.name),ze(l,e.name),ze(u,e.name),ze(d,e.name);const v=new ke({uid:h,auth:e,email:i,emailVerified:g,displayName:r,isAnonymous:_,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:m,createdAt:u,lastLoginAt:d});return b&&Array.isArray(b)&&(v.providerData=b.map(P=>({...P}))),l&&(v._redirectEventId=l),v}static async _fromIdTokenResponse(e,n,r=!1){const i=new mt;i.updateFromServerResponse(n);const s=new ke({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await _n(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];j(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Wi(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new mt;o.updateFromIdToken(r);const l=new ke({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new ir(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,u),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fr=new Map;function De(t){He(t instanceof Function,"Expected a class definition");let e=Fr.get(t);return e?(He(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Fr.set(t,e),e)}/**
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
 */class ji{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}ji.type="NONE";const Br=ji;/**
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
 */function sn(t,e,n){return`firebase:${t}:${e}:${n}`}class _t{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=sn(this.userKey,i.apiKey,s),this.fullPersistenceKey=sn("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await mn(this.auth,{idToken:e}).catch(()=>{});return n?ke._fromGetAccountInfoResponse(this.auth,n,e):null}return ke._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new _t(De(Br),e,r);const i=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=i[0]||De(Br);const a=sn(r,e.config.apiKey,e.name);let o=null;for(const u of n)try{const d=await u._get(a);if(d){let h;if(typeof d=="string"){const g=await mn(e,{idToken:d}).catch(()=>{});if(!g)break;h=await ke._fromGetAccountInfoResponse(e,g,d)}else h=ke._fromJSON(e,d);u!==s&&(o=h),s=u;break}}catch{}const l=i.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new _t(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async u=>{if(u!==s)try{await u._remove(a)}catch{}})),new _t(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hr(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Ki(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(zi(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Yi(e))return"Blackberry";if(Xi(e))return"Webos";if(Gi(e))return"Safari";if((e.includes("chrome/")||qi(e))&&!e.includes("edge/"))return"Chrome";if(Ji(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function zi(t=pe()){return/firefox\//i.test(t)}function Gi(t=pe()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function qi(t=pe()){return/crios\//i.test(t)}function Ki(t=pe()){return/iemobile/i.test(t)}function Ji(t=pe()){return/android/i.test(t)}function Yi(t=pe()){return/blackberry/i.test(t)}function Xi(t=pe()){return/webos/i.test(t)}function gr(t=pe()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function vl(t=pe()){var e;return gr(t)&&!!((e=window.navigator)!=null&&e.standalone)}function yl(){return Ra()&&document.documentMode===10}function Qi(t=pe()){return gr(t)||Ji(t)||Xi(t)||Yi(t)||/windows phone/i.test(t)||Ki(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zi(t,e=[]){let n;switch(t){case"Browser":n=Hr(pe());break;case"Worker":n=`${Hr(pe())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${jt}/${r}`}/**
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
 */class wl{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function $l(t,e={}){return et(t,"GET","/v2/passwordPolicy",Ze(t,e))}/**
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
 */const Sl=6;class kl{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??Sl,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class El{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Vr(this),this.idTokenSubscription=new Vr(this),this.beforeStateQueue=new wl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Mi,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=De(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await _t.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await mn(this,{idToken:e}),r=await ke._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(be(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return j(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await _n(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=rl()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(be(this.app))return Promise.reject(Pe(this));const n=e?We(e):null;return n&&j(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&j(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return be(this.app)?Promise.reject(Pe(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return be(this.app)?Promise.reject(Pe(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(De(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await $l(this),n=new kl(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Vt("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await bl(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&De(e)||this._popupRedirectResolver;j(n,this,"argument-error"),this.redirectPersistenceManager=await _t.create(this,[De(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(j(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return j(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Zi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(be(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&Ui(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function je(t){return We(t)}class Vr{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ua(n=>this.observer=n)}get next(){return j(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let En={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Cl(t){En=t}function es(t){return En.loadJS(t)}function Il(){return En.recaptchaEnterpriseScript}function Tl(){return En.gapiScript}function Pl(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class Al{constructor(){this.enterprise=new xl}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class xl{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
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
 */const Rl="recaptcha-enterprise",ts="NO_RECAPTCHA",Wr="onFirebaseAuthREInstanceReady";class Ge{constructor(e){this.type=Rl,this.auth=je(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{ul(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const u=new cl(l);return s.tenantId==null?s._agentRecaptchaConfig=u:s._tenantRecaptchaConfigs[s.tenantId]=u,a(u.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;Mr(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(u=>{a(u)}).catch(()=>{a(ts)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Al().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&Mr(window.grecaptcha)&&Ge.scriptInjectionDeferred)await Ge.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=Il();l.length!==0&&(l+=o+`&onload=${Wr}`),Ge.scriptInjectionDeferred=new Ti,window[Wr]=()=>{var u;(u=Ge.scriptInjectionDeferred)==null||u.resolve()},es(l).then(()=>{var u;return(u=Ge.scriptInjectionDeferred)==null?void 0:u.promise}).then(()=>{i(o,s,a)}).catch(u=>{a(u)})}}).catch(o=>{a(o)})})}}Ge.scriptInjectionDeferred=null;async function jr(t,e,n,r=!1,i=!1){const s=new Ge(t);let a;if(i)a=ts;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,u=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:u,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function sr(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await jr(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await jr(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nl(t,e){const n=Ri(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(yt(s,e??{}))return i;Se(i,"already-initialized")}return n.initialize({options:e})}function Ol(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(De);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Dl(t,e,n){const r=je(t);j(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=ns(e),{host:a,port:o}=Ll(e),l=o===null?"":`:${o}`,u={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){j(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),j(yt(u,r.config.emulator)&&yt(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=u,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,lr(a)?Ha(`${s}//${a}${l}`):Ml()}function ns(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Ll(t){const e=ns(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:zr(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:zr(a)}}}function zr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Ml(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pr{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Oe("not implemented")}_getIdTokenResponse(e){return Oe("not implemented")}_linkToIdToken(e,n){return Oe("not implemented")}_getReauthenticationResolver(e){return Oe("not implemented")}}async function Ul(t,e){return et(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fl(t,e){return Gt(t,"POST","/v1/accounts:signInWithPassword",Ze(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bl(t,e){return Gt(t,"POST","/v1/accounts:signInWithEmailLink",Ze(t,e))}async function Hl(t,e){return Gt(t,"POST","/v1/accounts:signInWithEmailLink",Ze(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht extends pr{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new Ht(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new Ht(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return sr(e,n,"signInWithPassword",Fl);case"emailLink":return Bl(e,{email:this._email,oobCode:this._password});default:Se(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return sr(e,r,"signUpPassword",Ul);case"emailLink":return Hl(e,{idToken:n,email:this._email,oobCode:this._password});default:Se(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bt(t,e){return Gt(t,"POST","/v1/accounts:signInWithIdp",Ze(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vl="http://localhost";class lt extends pr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new lt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Se("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new lt(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return bt(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,bt(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,bt(e,n)}buildRequest(){const e={requestUri:Vl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Wt(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wl(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function jl(t){const e=At(xt(t)).link,n=e?At(xt(e)).deep_link_id:null,r=At(xt(t)).deep_link_id;return(r?At(xt(r)).link:null)||r||n||e||t}class mr{constructor(e){const n=At(xt(e)),r=n.apiKey??null,i=n.oobCode??null,s=Wl(n.mode??null);j(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=jl(e);try{return new mr(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Et{constructor(){this.providerId=Et.PROVIDER_ID}static credential(e,n){return Ht._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=mr.parseLink(n);return j(r,"argument-error"),Ht._fromEmailAndCode(e,r.code,r.tenantId)}}Et.PROVIDER_ID="password";Et.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Et.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class qt extends Cn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qe extends qt{constructor(){super("facebook.com")}static credential(e){return lt._fromParams({providerId:qe.PROVIDER_ID,signInMethod:qe.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return qe.credentialFromTaggedObject(e)}static credentialFromError(e){return qe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return qe.credential(e.oauthAccessToken)}catch{return null}}}qe.FACEBOOK_SIGN_IN_METHOD="facebook.com";qe.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re extends qt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return lt._fromParams({providerId:Re.PROVIDER_ID,signInMethod:Re.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Re.credentialFromTaggedObject(e)}static credentialFromError(e){return Re.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Re.credential(n,r)}catch{return null}}}Re.GOOGLE_SIGN_IN_METHOD="google.com";Re.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke extends qt{constructor(){super("github.com")}static credential(e){return lt._fromParams({providerId:Ke.PROVIDER_ID,signInMethod:Ke.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ke.credentialFromTaggedObject(e)}static credentialFromError(e){return Ke.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ke.credential(e.oauthAccessToken)}catch{return null}}}Ke.GITHUB_SIGN_IN_METHOD="github.com";Ke.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je extends qt{constructor(){super("twitter.com")}static credential(e,n){return lt._fromParams({providerId:Je.PROVIDER_ID,signInMethod:Je.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Je.credentialFromTaggedObject(e)}static credentialFromError(e){return Je.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Je.credential(n,r)}catch{return null}}}Je.TWITTER_SIGN_IN_METHOD="twitter.com";Je.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zl(t,e){return Gt(t,"POST","/v1/accounts:signUp",Ze(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await ke._fromIdTokenResponse(e,r,i),a=Gr(r);return new ct({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Gr(r);return new ct({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Gr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn extends Qe{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,bn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new bn(e,n,r,i)}}function rs(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?bn._fromErrorAndOperation(t,s,e,r):s})}async function Gl(t,e,n=!1){const r=await Bt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return ct._forOperation(t,"link",r)}/**
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
 */async function ql(t,e,n=!1){const{auth:r}=t;if(be(r.app))return Promise.reject(Pe(r));const i="reauthenticate";try{const s=await Bt(t,rs(r,i,e,t),n);j(s.idToken,r,"internal-error");const a=fr(s.idToken);j(a,r,"internal-error");const{sub:o}=a;return j(t.uid===o,r,"user-mismatch"),ct._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Se(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function is(t,e,n=!1){if(be(t.app))return Promise.reject(Pe(t));const r="signIn",i=await rs(t,r,e),s=await ct._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Kl(t,e){return is(je(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ss(t){const e=je(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Jl(t,e,n){if(be(t.app))return Promise.reject(Pe(t));const r=je(t),a=await sr(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",zl).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&ss(t),l}),o=await ct._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function Yl(t,e,n){return be(t.app)?Promise.reject(Pe(t)):Kl(We(t),Et.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&ss(t),r})}function Xl(t,e,n,r){return We(t).onIdTokenChanged(e,n,r)}function Ql(t,e,n){return We(t).beforeAuthStateChanged(e,n)}function Zl(t,e,n,r){return We(t).onAuthStateChanged(e,n,r)}function ec(t){return We(t).signOut()}const vn="__sak";/**
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
 */class as{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(vn,"1"),this.storage.removeItem(vn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tc=1e3,nc=10;class os extends as{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Qi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);yl()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,nc):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},tc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}os.type="LOCAL";const rc=os;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ls extends as{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}ls.type="SESSION";const cs=ls;/**
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
 */function ic(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class In{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new In(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async u=>u(n.origin,s)),l=await ic(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}In.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _r(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class sc{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const u=_r("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const g=h;if(g.data.eventId===u)switch(g.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(g.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ae(){return window}function ac(t){Ae().location.href=t}/**
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
 */function us(){return typeof Ae().WorkerGlobalScope<"u"&&typeof Ae().importScripts=="function"}async function oc(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function lc(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function cc(){return us()?self:null}/**
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
 */const ds="firebaseLocalStorageDb",uc=1,yn="firebaseLocalStorage",hs="fbase_key";class Kt{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Tn(t,e){return t.transaction([yn],e?"readwrite":"readonly").objectStore(yn)}function dc(){const t=indexedDB.deleteDatabase(ds);return new Kt(t).toPromise()}function fs(){const t=indexedDB.open(ds,uc);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(yn,{keyPath:hs})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(yn)?e(r):(r.close(),await dc(),e(await fs()))})})}async function qr(t,e,n){const r=Tn(t,!0).put({[hs]:e,value:n});return new Kt(r).toPromise()}async function hc(t,e){const n=Tn(t,!1).get(e),r=await new Kt(n).toPromise();return r===void 0?null:r.value}function Kr(t,e){const n=Tn(t,!0).delete(e);return new Kt(n).toPromise()}const fc=800,gc=3;class gs{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=fs(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>gc)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return us()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=In._getInstance(cc()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await oc(),!this.activeServiceWorker)return;this.sender=new sc(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||lc()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await qr(e,vn,"1"),await Kr(e,vn)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>qr(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>hc(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Kr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=Tn(i,!1).getAll();return new Kt(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||Ui(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),fc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}gs.type="LOCAL";const pc=gs;new zt(3e4,6e4);/**
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
 */function br(t,e){return e?De(e):(j(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class vr extends pr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return bt(e,this._buildIdpRequest())}_linkToIdToken(e,n){return bt(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return bt(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function mc(t){return is(t.auth,new vr(t),t.bypassAuthState)}function _c(t){const{auth:e,user:n}=t;return j(n,e,"internal-error"),ql(n,new vr(t),t.bypassAuthState)}async function bc(t){const{auth:e,user:n}=t;return j(n,e,"internal-error"),Gl(n,new vr(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ps{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return mc;case"linkViaPopup":case"linkViaRedirect":return bc;case"reauthViaPopup":case"reauthViaRedirect":return _c;default:Se(this.auth,"internal-error")}}resolve(e){He(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){He(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vc=new zt(2e3,1e4);async function yc(t,e,n){if(be(t.app))return Promise.reject(Ee(t,"operation-not-supported-in-this-environment"));const r=je(t);Fi(t,e,Cn);const i=br(r,n);return new it(r,"signInViaPopup",e,i).executeNotNull()}class it extends ps{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,it.currentPopupAction&&it.currentPopupAction.cancel(),it.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return j(e,this.auth,"internal-error"),e}async onExecution(){He(this.filter.length===1,"Popup operations only handle one event");const e=_r();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Ee(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Ee(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,it.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ee(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,vc.get())};e()}}it.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wc="pendingRedirect",an=new Map;class $c extends ps{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=an.get(this.auth._key());if(!e){try{const r=await Sc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}an.set(this.auth._key(),e)}return this.bypassAuthState||an.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Sc(t,e){const n=_s(e),r=ms(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function kc(t,e){return ms(t)._set(_s(e),"true")}function Ec(t,e){an.set(t._key(),e)}function ms(t){return De(t._redirectPersistence)}function _s(t){return sn(wc,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cc(t,e,n){return Ic(t,e,n)}async function Ic(t,e,n){if(be(t.app))return Promise.reject(Pe(t));const r=je(t);Fi(t,e,Cn),await r._initializationPromise;const i=br(r,n);return await kc(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function Tc(t,e,n=!1){if(be(t.app))return Promise.reject(Pe(t));const r=je(t),i=br(r,e),a=await new $c(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pc=600*1e3;class Ac{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!xc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!bs(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(Ee(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Pc&&this.cachedEventUids.clear(),this.cachedEventUids.has(Jr(e))}saveEventToCache(e){this.cachedEventUids.add(Jr(e)),this.lastProcessedEventTime=Date.now()}}function Jr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function bs({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function xc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return bs(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rc(t,e={}){return et(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Oc=/^https?/;async function Dc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Rc(t);for(const n of e)try{if(Lc(n))return}catch{}Se(t,"unauthorized-domain")}function Lc(t){const e=rr(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!Oc.test(n))return!1;if(Nc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const Mc=new zt(3e4,6e4);function Yr(){const t=Ae().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Uc(t){return new Promise((e,n)=>{var i,s,a;function r(){Yr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Yr(),n(Ee(t,"network-request-failed"))},timeout:Mc.get()})}if((s=(i=Ae().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=Ae().gapi)!=null&&a.load)r();else{const o=Pl("iframefcb");return Ae()[o]=()=>{gapi.load?r():n(Ee(t,"network-request-failed"))},es(`${Tl()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw on=null,e})}let on=null;function Fc(t){return on=on||Uc(t),on}/**
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
 */const Bc=new zt(5e3,15e3),Hc="__/auth/iframe",Vc="emulator/auth/iframe",Wc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},jc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function zc(t){const e=t.config;j(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?hr(e,Vc):`https://${t.config.authDomain}/${Hc}`,r={apiKey:e.apiKey,appName:t.name,v:jt},i=jc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Wt(r).slice(1)}`}async function Gc(t){const e=await Fc(t),n=Ae().gapi;return j(n,t,"internal-error"),e.open({where:document.body,url:zc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Wc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=Ee(t,"network-request-failed"),o=Ae().setTimeout(()=>{s(a)},Bc.get());function l(){Ae().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
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
 */const qc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Kc=500,Jc=600,Yc="_blank",Xc="http://localhost";class Xr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Qc(t,e,n,r=Kc,i=Jc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...qc,width:r.toString(),height:i.toString(),top:s,left:a},u=pe().toLowerCase();n&&(o=qi(u)?Yc:n),zi(u)&&(e=e||Xc,l.scrollbars="yes");const d=Object.entries(l).reduce((g,[_,b])=>`${g}${_}=${b},`,"");if(vl(u)&&o!=="_self")return Zc(e||"",o),new Xr(null);const h=window.open(e||"",o,d);j(h,t,"popup-blocked");try{h.focus()}catch{}return new Xr(h)}function Zc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const eu="__/auth/handler",tu="emulator/auth/handler",nu=encodeURIComponent("fac");async function Qr(t,e,n,r,i,s){j(t.config.authDomain,t,"auth-domain-config-required"),j(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:jt,eventId:i};if(e instanceof Cn){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",Ma(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof qt){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),u=l?`#${nu}=${encodeURIComponent(l)}`:"";return`${ru(t)}?${Wt(o).slice(1)}${u}`}function ru({config:t}){return t.emulator?hr(t,tu):`https://${t.authDomain}/${eu}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vn="webStorageSupport";class iu{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=cs,this._completeRedirectFn=Tc,this._overrideRedirectResult=Ec}async _openPopup(e,n,r,i){var a;He((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Qr(e,n,r,rr(),i);return Qc(e,s,_r())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Qr(e,n,r,rr(),i);return ac(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(He(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Gc(e),r=new Ac(e);return n.register("authEvent",i=>(j(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Vn,{type:Vn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[Vn];s!==void 0&&n(!!s),Se(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Dc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Qi()||Gi()||gr()}}const su=iu;var Zr="@firebase/auth",ei="1.13.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class au{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){j(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ou(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function lu(t){Ut(new wt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;j(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Zi(t)},u=new El(r,i,s,l);return Ol(u,n),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Ut(new wt("auth-internal",e=>{const n=je(e.getProvider("auth").getImmediate());return(r=>new au(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),pt(Zr,ei,ou(t)),pt(Zr,ei,"esm2020")}/**
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
 */const cu=300,uu=Ii("authIdTokenMaxAge")||cu;let ti=null;const du=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>uu)return;const i=n==null?void 0:n.token;ti!==i&&(ti=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function hu(t=Ho()){const e=Ri(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Nl(t,{popupRedirectResolver:su,persistence:[pc,rc,cs]}),r=Ii("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=du(s.toString());Ql(n,a,()=>a(n.currentUser)),Xl(n,o=>a(o))}}const i=Ia("auth");return i&&Dl(n,`http://${i}`),n}function fu(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}Cl({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=Ee("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",fu().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});lu("Browser");const gu={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},xe=gu,$t=!!xe.VITE_FIREBASE_APP_ID;let Wn=null;function ft(){if(!$t)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!Wn){const t=Ni({apiKey:xe.VITE_FIREBASE_API_KEY,authDomain:xe.VITE_FIREBASE_AUTH_DOMAIN,projectId:xe.VITE_FIREBASE_PROJECT_ID,appId:xe.VITE_FIREBASE_APP_ID,...xe.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:xe.VITE_FIREBASE_STORAGE_BUCKET},...xe.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:xe.VITE_FIREBASE_MESSAGING_SENDER_ID}});Wn=hu(t)}return Wn}function ni(){return new Re}async function ri(){if(!$t)return;const t=ft();t.currentUser&&await ec(t)}var pu=p(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),mu=p('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),_u=p("<button type=button class=gate-toggle>"),bu=p("<div class=gate-or>── or ──"),vu=p("<button type=button class=btn>Continue with Google"),yu=p("<div class=gate-error role=alert>"),wu=p("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),$u=p("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),Su=p("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const ku={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function ii(t){const e=(t==null?void 0:t.code)??"";return ku[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function Eu(t){return(()=>{var e=pu(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return c(a,()=>t.email),G(l,"click",t.onSignOut),e})()}function Cu(){const[t,e]=M("signin"),[n,r]=M(""),[i,s]=M(""),[a,o]=M(!1),[l,u]=M("");la(async g=>{if(!$t)return null;const _=ft().currentUser;return _?await _.getIdToken(g):null});async function d(g){if(g.preventDefault(),!a()){o(!0),u("");try{const _=ft();t()==="create"?await Jl(_,n(),i()):await Yl(_,n(),i())}catch(_){u(ii(_))}finally{o(!1)}}}async function h(){if(!a()){o(!0),u("");try{await yc(ft(),ni())}catch(g){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(g==null?void 0:g.code)){await Cc(ft(),ni());return}u(ii(g))}finally{o(!1)}}}return(()=>{var g=wu(),_=g.firstChild;return _.firstChild,c(_,f(S,{when:$t,get fallback(){return[$u(),Su()]},get children(){return[(()=>{var b=mu(),T=b.firstChild,m=T.firstChild,v=m.nextSibling,P=T.nextSibling,D=P.firstChild,R=D.nextSibling,O=P.nextSibling;return b.addEventListener("submit",d),v.$$input=x=>r(x.currentTarget.value),R.$$input=x=>s(x.currentTarget.value),c(O,(()=>{var x=Y(()=>!!a());return()=>x()?"Working…":t()==="create"?"Create account":"Sign in"})()),w(x=>{var $=t()==="create"?"new-password":"current-password",A=a();return $!==x.e&&ae(R,"autocomplete",x.e=$),A!==x.t&&(O.disabled=x.t=A),x},{e:void 0,t:void 0}),w(()=>v.value=n()),w(()=>R.value=i()),b})(),(()=>{var b=_u();return b.$$click=()=>{u(""),e(t()==="create"?"signin":"create")},c(b,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),w(()=>b.disabled=a()),b})(),bu(),(()=>{var b=vu();return b.$$click=h,w(()=>b.disabled=a()),b})(),f(S,{get when(){return l()},get children(){var b=yu();return c(b,l),b}})]}}),null),g})()}Ce(["click","input"]);var Iu=p("<div class=gate-error role=alert>"),Tu=p("<p class=gate-note>No grant-file entries yet."),Pu=p("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),Au=p('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),xu=p("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function Ru(t){const[e,n]=M([]),[r,i]=M([]),[s,a]=M(""),[o,l]=M(!1),[u,d]=M(""),h=m=>{n((m==null?void 0:m.file_grants)??[]),i((m==null?void 0:m.static_emails)??[])};vt(async()=>{try{h(await ua())}catch{d("Could not load the grant list.")}});const _=m=>{m.key==="Escape"&&t.onClose()};vt(()=>{window.addEventListener("keydown",_),Fe(()=>window.removeEventListener("keydown",_));const m=document.querySelector(".access-add input");m==null||m.focus()});const b=async m=>{if(m.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await da(s())),a("")}catch(v){d(v.message)}l(!1)}},T=async m=>{if(!o()){l(!0),d("");try{h(await ha(m))}catch(v){d(v.message)}l(!1)}};return(()=>{var m=Au(),v=m.firstChild,P=v.firstChild,D=P.nextSibling,R=D.nextSibling,O=R.firstChild,x=O.nextSibling,$=R.nextSibling;return G(m,"click",t.onClose),v.$$click=A=>A.stopPropagation(),c(v,f(S,{get when(){return u()},get children(){var A=Iu();return c(A,u),A}}),R),c(v,f(se,{get each(){return e()},children:A=>(()=>{var N=xu(),I=N.firstChild,k=I.nextSibling;return c(I,A),k.$$click=()=>T(A),ae(k,"title",`Remove ${A}`),ae(k,"aria-label",`Remove ${A}`),w(()=>k.disabled=o()),N})()}),R),c(v,f(S,{get when(){return e().length===0},get children(){return Tu()}}),R),R.addEventListener("submit",b),O.$$input=A=>a(A.currentTarget.value),c(x,()=>o()?"…":"Add"),c(v,f(S,{get when(){return r().length>0},get children(){var A=Pu();return A.firstChild,c(A,()=>r().join(", "),null),A}}),$),G($,"click",t.onClose),w(()=>x.disabled=o()),w(()=>O.value=s()),m})()}Ce(["click","input"]);const Le=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),Lt=(t,e,n)=>Math.min(n,Math.max(e,t));function Nu(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:Lt((n-t)/r,0,1)}function Ou(t,e,n,r,i=Le){if(n<i.minRateOfReturn||t<=0)return null;const s=Lt(t/2,0,1),a=Lt(e,0,1),o=Math.min(n/i.idealReturn,1),l=Lt((r-i.trendScoreFloor)/i.trendScoreBand,0,1),u={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return u.total=u.sharpe+u.safety+u.return+u.trend,u}function Du(t,e=Le){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?Lt(1+t.delta,0,1):Nu(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),Ou(r,a,n,i,e)}function Lu(t,e=Le.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function Mu(t){return t.weightSharpe===Le.weightSharpe&&t.weightSafety===Le.weightSafety&&t.weightReturn===Le.weightReturn&&t.minRateOfReturn===Le.minRateOfReturn}var Uu=p("<span class=hint>production defaults · drag to re-rank live"),Fu=p("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),Bu=p('<span class="hint hint-custom">custom weights'),Hu=p("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function Vu(){const[t,e]=M({...Le});return{params:t,isCustom:()=>!Mu(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Le})}}const Wu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function ju(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=Fu(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return c(i,f(S,{get when(){return!e()},get fallback(){return Bu()},get children(){return Uu()}}),null),c(s,f(se,{each:Wu,children:o=>(()=>{var l=Hu(),u=l.firstChild,d=u.firstChild,h=d.nextSibling,g=u.nextSibling;return c(u,()=>o.label,d),c(h,()=>o.fmt(t.scoring.params()[o.key]),null),c(h,f(S,{get when(){return o.weight},get children(){return[" ","· ",Y(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),g.$$input=_=>t.scoring.setParam(o.key,Number(_.currentTarget.value)),w(_=>{var b=o.max,T=o.step;return b!==_.e&&ae(g,"max",_.e=b),T!==_.t&&ae(g,"step",_.t=T),_},{e:void 0,t:void 0}),w(()=>g.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),w(()=>r.open=e()),r})()}Ce(["click","input"]);const Pn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],Rt=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],vs="webapp.columns.v1";function zu(){try{const t=localStorage.getItem(vs);if(!t)return Rt;const e=JSON.parse(t);if(!Array.isArray(e))return Rt;const n=new Set(Pn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:Rt}catch{return Rt}}function Gu(t){try{localStorage.setItem(vs,JSON.stringify(t))}catch{}}var qu=p("<div class=pop-backdrop>"),Ku=p('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Ju=p("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Yu=p("<label class=pick-item><input type=checkbox>");function Xu(t){const[e,n]=M(!1);return(()=>{var r=Ju(),i=r.firstChild;return i.$$click=()=>n(!e()),c(r,f(S,{get when(){return e()},get children(){return[(()=>{var s=qu();return s.$$click=()=>n(!1),s})(),(()=>{var s=Ku(),a=s.firstChild,o=a.nextSibling;return c(a,f(se,{each:Pn,children:l=>(()=>{var u=Yu(),d=u.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),c(u,()=>l.label,null),w(()=>d.checked=t.store.isOn(l.id)),u})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),w(()=>ae(i,"aria-expanded",e())),r})()}Ce(["click"]);var Qu=p('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),Zu=p("<span class=pggap>…"),ed=p("<button type=button class=pgbtn>");function td(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,u)=>u+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,u)=>l-u),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function nd(t){const e=he(()=>td(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Qu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,u=l.nextSibling;return c(s,()=>t.page(),o),c(s,()=>t.pageCount(),null),l.$$click=n,c(i,f(se,{get each(){return e()},children:d=>d==="…"?Zu():(()=>{var h=ed();return h.$$click=()=>t.onGo(d),c(h,d),w(()=>h.classList.toggle("active",d===t.page())),h})()}),u),u.$$click=r,w(d=>{var h=t.page()<=1,g=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),g!==d.t&&(u.disabled=d.t=g),d},{e:void 0,t:void 0}),i})()}Ce(["click"]);var rd=p("<span class=tip>");function Ct(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=rd();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?aa(i,r):e=r,c(r,()=>t.children),w(()=>ae(r,"data-tip",t.text??"")),r})()}Ce(["focusin"]);const ot="∅";function le(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function Nt(t){return Number(t??0).toLocaleString("en-US")}function wn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function ys(t){return ws(t,{hour:"2-digit",minute:"2-digit"})}function id(t){return ws(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function ws(t,e){const n=wn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const $s={text:ot,isNull:!0},jn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function si(t,e){return!e||le(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function sd(t,e){return!e||le(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function ad(t){if(!t||typeof t!="object"||le(t.report_date))return $s;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function we(t,e){if(le(e))return $s;switch(t){case"fixed2":return jn(e,2);case"fixed3":return jn(e,3);case"ivrv":return jn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return ad(e);default:return{text:String(e),isNull:!1}}}const ai=t=>Number(t*100).toFixed(0);function od(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=ai(e.momentum_high),s=ai(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function It(t,e){return od(e)[t]??t}var Ss=p("<span class=tip-target>"),ld=p("<div class=kv><span class=kv-label></span><span class=kv-value>"),cd=p("<span class=tip-target>Strike position in band"),ud=p('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),dd=p("<div class=exp-block><h4>"),hd=p("<div class=kv-value>Band unavailable (∅)"),fd=p("<div><span class=marker-tick></span><span class=marker-cap><br>"),gd=p("<div class=exp-block><h4>Premium economics"),pd=p("<b>"),md=p('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),_d=p("<div class=muted-note>earnings-discounted safety applied"),bd=p("<div class=exp-block><h4>Score breakdown"),vd=p("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),yd=p('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),wd=p("<span class=muted-note>all columns visible"),$d=p('<div class="exp-block exp-chips"><h4>Hidden columns'),Sd=p("<span class=tip-target>: "),kd=p("<span>"),Ed=p("<span class=tip-target>band safety is already discounted by the earnings rule."),Cd=p("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),Id=p("<div class=expansion><div class=exp-grid>");const zn={sharpe:.2,safety:.4,return_part:.4};function Gn(t,e=2){return le(t)?ot:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function Te(t,e,n){return(()=>{var r=ld(),i=r.firstChild,s=i.nextSibling;return c(i,f(Ct,{get text(){return It(t,e)},get children(){var a=Ss();return c(a,()=>t.replace(/_/g," ")),a}})),c(s,n),r})()}function Td(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=le(e.mid)?null:e.strike-e.mid,s=i!=null&&!le(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),u=!le(a)&&l>a&&!le(e.strike),d=g=>{if(le(g))return null;const _=(g-a)/(l-a)*100;return Math.min(100,Math.max(0,_))},h=u?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(g=>d(g.v)!=null):[];return(()=>{var g=dd(),_=g.firstChild;return c(_,f(Ct,{get text(){return It("band_range",t.thresholds)},get children(){return cd()}})),c(g,f(S,{when:u,get fallback(){return hd()},get children(){var b=ud(),T=b.firstChild;return c(b,f(se,{each:h,children:m=>(()=>{var v=fd(),P=v.firstChild,D=P.nextSibling,R=D.firstChild;return c(D,()=>m.label,R),c(D,()=>we("fixed2",m.v).text,null),w(O=>{var x=`marker ${m.cls}`,$=`${d(m.v)}%`;return x!==O.e&&ye(v,O.e=x),$!==O.t&&at(v,"left",O.t=$),O},{e:void 0,t:void 0}),v})()}),null),w(m=>{var v=`${d(e.strike_from)}%`,P=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return v!==m.e&&at(T,"left",m.e=v),P!==m.t&&at(T,"width",m.t=P),m},{e:void 0,t:void 0}),b}}),null),c(g,()=>Te("band_range",t.thresholds,`${we("fixed2",e.strike_from).text} → ${we("fixed2",e.strike_to).text}`),null),c(g,()=>Te("band_depth",t.thresholds,r==null?ot:`${(r*100).toFixed(1)}%`),null),c(g,()=>Te("cushion_be",t.thresholds,s==null?ot:`${s.toFixed(1)}%`),null),g})()}function Pd(t){const e=t.row,n=le(e.strike)?null:e.strike*100,r=le(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=we("pct1",e.rate_of_return);return(()=>{var a=gd();return a.firstChild,c(a,()=>Te("capital",t.thresholds,n==null?ot:Gn(n,0)),null),c(a,()=>Te("premium",t.thresholds,r==null?ot:Gn(r)),null),c(a,()=>Te("breakeven",t.thresholds,i==null?ot:Gn(i)),null),c(a,()=>Te("ann_ror",t.thresholds,(()=>{var o=pd();return c(o,()=>s.text),o})()),null),c(a,()=>Te("bid",t.thresholds,we("fixed2",e.bid).text),null),c(a,()=>Te("ask",t.thresholds,we("fixed2",e.ask).text),null),c(a,()=>Te("expiration",t.thresholds,e.expiration),null),a})()}function Ad(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:zn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:zn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:zn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=bd();return i.firstChild,c(i,f(S,{when:n,get fallback(){return(()=>{var s=vd(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return c(l,()=>we("fixed3",e.score).text),s})()},get children(){return[f(se,{each:r,children:s=>{const a=le(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=yd(),l=o.firstChild,u=l.firstChild,d=u.nextSibling,h=d.firstChild,g=h.nextSibling;g.nextSibling;var _=l.nextSibling,b=_.firstChild,T=_.nextSibling;return c(l,f(Ct,{get text(){return It(s.key,t.thresholds)},get children(){var m=Ss();return c(m,()=>s.label),m}}),u),c(d,()=>s.weight*100,g),c(T,()=>we("fixed3",s.v).text),w(m=>at(b,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=md(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return c(l,()=>we("fixed3",e.score).text),s})(),f(S,{get when(){return e.earnings_before_expiry},get children(){return _d()}})]}}),null),i})()}function xd(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:we(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=$d();return n.firstChild,c(n,f(se,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=kd();return c(s,f(Ct,{get text(){return It(r.id,t.thresholds)},get children(){var a=Sd(),o=a.firstChild;return c(a,()=>r.label,o),c(a,()=>i.text,null),a}})),w(()=>ye(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),c(n,f(S,{get when(){return t.hiddenDefs.length===0},get children(){return wd()}}),null),n})()}function Rd(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=Id(),i=r.firstChild;return c(r,f(S,{when:n,get children(){var s=Cd(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,u=l.nextSibling,d=u.nextSibling,h=d.nextSibling;return h.nextSibling,c(o,()=>n.report_date),c(s,f(S,{get when(){return n.report_time},children:g=>g().replaceAll("_"," ")}),u),c(s,f(S,{get when(){return!le(n.expected_eps)},get children(){return[" ","· expected EPS ",Y(()=>we("fixed2",n.expected_eps).text)]}}),h),c(s,f(Ct,{get text(){return It("earnings_before_expiry",t.thresholds)},get children(){return Ed()}}),null),s}}),i),c(i,f(Td,{row:e,get thresholds(){return t.thresholds}}),null),c(i,f(Pd,{row:e,get thresholds(){return t.thresholds}}),null),c(i,f(Ad,{row:e,get thresholds(){return t.thresholds}}),null),c(i,f(xd,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var Nd=p("<span class=null-mark>"),Od=p("<span class=star>★"),Dd=p("<td><b>"),qn=p("<span>"),oi=p("<td class=num>"),Ld=p("<span class=score-frozen>prod "),Md=p('<td class="num score-cell">'),Ud=p('<span class="score-frozen readmit">re-admitted'),Fd=p("<td>"),Bd=p("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),Hd=p("<span class=sort-arrow>"),Vd=p("<span class=tip-target>"),Wd=p("<th role=button tabindex=0>"),jd=p("<tr class=expandable><td class=exp-col>"),zd=p("<tr class=exp-row><td>");const Gd=t=>`${t.underlying}|${t.strike}`;function qd(t){return(()=>{var e=Nd();return c(e,()=>t.text),e})()}function Zt(t){const e=we(t.kind,t.value);return f(S,{get when(){return!e.isNull},get fallback(){return f(qd,{get text(){return e.text}})},get children(){return e.text}})}function Kd(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=Dd(),i=r.firstChild;return c(r,f(S,{get when(){return t.pickRank!=null},get children(){var s=Od();return s.firstChild,c(s,()=>t.pickRank,null),s}}),i),c(i,()=>n.underlying),c(r,f(S,{get when(){return si(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=qn();return w(()=>ye(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=oi();return c(r,f(S,{get when(){return si(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=qn();return w(()=>ye(s,`dot ${i()}`)),s})()," "]}),null),c(r,f(Zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=Md();return c(r,f(Zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),c(r,f(S,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(S,{get when(){return!le(n.frozen_score)},get fallback(){return f(S,{get when(){return!le(n.score)},get children(){return Ud()}})},get children(){var i=Ld();return i.firstChild,c(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=oi();return c(r,f(Zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),c(r,f(S,{get when(){return sd(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=qn();return c(s,i),w(()=>ye(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=Fd();return c(r,f(Zt,{get kind(){return e.kind},get value(){return n[e.id]}})),w(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Jd(t){const e=he(()=>Pn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=Bd(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return c(i,f(se,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=Wd();return l.$$keydown=u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),c(l,f(Ct,{get text(){return It(a.id,t.thresholds)},get children(){var u=Vd();return c(u,()=>a.label,null),c(u,f(S,{get when(){return o()},get children(){return[" ",(()=>{var d=Hd();return c(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),u}})),w(u=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==u.e&&l.classList.toggle("num",u.e=d),h!==u.t&&ae(l,"aria-sort",u.t=h),u},{e:void 0,t:void 0}),l})()}}),null),c(s,f(se,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>Gd(a),u=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=jd(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),c(h,()=>u()?"▾":"▸"),c(d,f(se,{get each(){return e()},children:g=>f(Kd,{col:g,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),w(g=>{var _=o()!=null,b=!!le(a.score),T=!!u();return _!==g.e&&d.classList.toggle("pick",g.e=_),b!==g.t&&d.classList.toggle("prow",g.t=b),T!==g.a&&d.classList.toggle("open",g.a=T),g},{e:void 0,t:void 0,a:void 0}),d})(),f(S,{get when(){return u()},get children(){var d=zd(),h=d.firstChild;return c(h,f(Rd,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),w(()=>ae(h,"colspan",e().length+1)),d}})]}})),n})()}Ce(["click","keydown"]);function Yd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const gt=t=>le(t);function Xd(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=gt(a),u=gt(o);return l||u?l&&u?0:l?1:-1:r*Yd(a,o)})}function Qd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=gt(r),a=gt(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,u=n.rate_of_return,d=gt(l),h=gt(u);return d||h?d&&h?0:d?1:-1:u-l})}var Zd=p("<div class=stage-badges>"),eh=p("<pre class=errbox>"),th=p("<details><summary> "),nh=p("<div class=scroll-region>"),rh=p('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),ih=p("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),sh=p("<div class=empty-panel>No rows match the current filter."),ah=p('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Kn=100,oh=150,li={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function lh(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=Zd();return c(i,f(se,{get each(){return t.stages??[]},children:s=>(()=>{var a=th(),o=a.firstChild,l=o.firstChild;return c(o,()=>n(s.status),l),c(o,()=>r(s.name),null),c(a,f(S,{get when(){return s.error},get children(){var u=eh();return c(u,()=>s.error),u}}),null),w(()=>ye(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function ci(t){const[e,n]=M(""),[r,i]=M(""),[s,a]=M(!0),[o,l]=M(null),[u,d]=M("asc"),[h,g]=M(1);let _;Fe(()=>clearTimeout(_));const b=()=>{var C;return((C=t.tf)==null?void 0:C.rows)??[]},T=he(()=>{const C=t.scoring.params(),W=t.scoring.isCustom();return b().map(H=>{const z=Du(H,C);return{...H,frozen_score:H.score,live_parts:z,score:W?z==null?null:z.total:H.score}})}),m=he(()=>T().filter(C=>!le(C.score)&&le(C.frozen_score)).length),v=C=>{const W=C.currentTarget.value;n(W),clearTimeout(_),_=setTimeout(()=>{i(W.trim().toLowerCase()),g(1)},oh)},P=C=>{a(C),g(1)},D=C=>{o()!==C?(l(C),d("asc")):u()==="asc"?d("desc"):(l(null),d("asc")),g(1)},[R,O]=M(null),x=C=>{const W=`${C.underlying}|${C.strike}`;O(H=>H===W?null:W)};st(Ot([o,u,h,r,s],()=>O(null))),st(Ot(t.active,()=>O(null))),st(Ot(t.columns.visible,()=>g(1)));const $=()=>Pn.filter(C=>!t.columns.visible().includes(C.id)),A=()=>(t.stages??[]).find(C=>C.name===li[t.id].id),N=he(()=>{const C=r();return C?T().filter(W=>{const H=W.underlying,z=W.sector;return H!=null&&String(H).toLowerCase().includes(C)||z!=null&&String(z).toLowerCase().includes(C)}):T()}),I=he(()=>{const C=N();return s()?C.filter(W=>!le(W.score)):C}),k=he(()=>o()?Xd(I(),o(),u()):Qd(I())),B=he(()=>Math.max(1,Math.ceil(k().length/Kn))),E=()=>Math.min(h(),B()),J=()=>{const C=E();return k().slice((C-1)*Kn,C*Kn)},q=he(()=>{var W;const C=new Map;if(t.scoring.isCustom()){const H=Lu(T().map(z=>({row:z,score:z.score})));for(const z of H)C.set(`${z.row.underlying}|${z.row.strike}`,C.size+1)}else for(const H of((W=t.tf)==null?void 0:W.top_picks)??[])C.set(`${H.underlying}|${H.strike}`,H.rank??"?");return C}),F=C=>q().get(`${C.underlying}|${C.strike}`);return(()=>{var C=rh(),W=C.firstChild,H=W.firstChild,z=H.nextSibling,ce=z.firstChild,Z=z.nextSibling,ve=Z.firstChild,tt=ve.nextSibling;return tt.nextSibling,c(C,f(lh,{get stages(){return t.stages}}),W),H.$$input=v,ce.addEventListener("change",oe=>P(oe.currentTarget.checked)),c(W,f(Xu,{get store(){return t.columns}}),Z),c(Z,()=>Nt(k().length),ve),c(Z,()=>Nt(b().length),tt),c(Z,f(S,{get when(){return Y(()=>!!t.scoring.isCustom())()&&m()>0},get children(){return[" ","· ",Y(()=>Nt(m()))," re-admitted by lower floor"]}}),null),c(C,f(S,{get when(){return J().length>0},get children(){var oe=nh();return c(oe,f(Jd,{get visibleCols(){return t.columns.visible},rows:J,sortKey:o,sortDir:u,onSort:D,get thresholds(){return t.thresholds},pickRankOf:F,openKey:R,onToggleRow:x,hiddenDefs:$,get customScores(){return t.scoring.isCustom}})),oe}}),null),c(C,f(S,{get when(){return J().length===0},get children(){return f(S,{get when(){var oe,L;return((oe=A())==null?void 0:oe.status)==="failed"||((L=A())==null?void 0:L.status)==="partial"},get fallback(){return f(S,{get when(){return Y(()=>!!s())()&&N().length>0},get fallback(){return sh()},get children(){var oe=ih(),L=oe.firstChild,X=L.nextSibling,ne=X.nextSibling,ge=ne.nextSibling,_e=ge.nextSibling;return _e.nextSibling,c(oe,()=>Nt(N().length),_e),oe}})},children:oe=>(()=>{var L=ah(),X=L.firstChild,ne=X.firstChild,ge=ne.nextSibling;ge.nextSibling;var _e=X.nextSibling;return c(X,()=>oe().status==="partial"?"△":"✗",ne),c(X,()=>li[t.id].label,ge),c(_e,()=>oe().error??"stage produced no data"),L})()})}}),null),c(C,f(S,{get when(){return k().length>0},get children(){return f(nd,{page:E,pageCount:B,onGo:g})}}),null),w(()=>C.hidden=!t.active()),w(()=>H.value=e()),w(()=>ce.checked=s()),C})()}Ce(["input"]);var ch=p("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),uh=p('<div class=hp-cash-bar><div class=hp-cash-bar-headline><span class=hp-cash-bar-total> <span style=font-size:0.85rem;font-weight:500;color:var(--muted)>cash</span></span><span class=hp-cash-bar-free> <span style=font-size:0.85rem;font-weight:500;color:var(--muted)>free</span></span></div><div class=hp-cash-bar-subline><span class=hp-cash-bar-reserved> reserved · </span><button type=button class="btn hp-pool-sheet-btn">Accounts / Pools'),ks=p('<button type=button class="btn-ghost hp-cash-edit">'),Es=p("<div class=hp-pool-list>"),dh=p('<div class=hp-pool-sheet><div class=hp-sheet-backdrop></div><div class=hp-sheet-container role=dialog aria-modal=true aria-label="Manage Cash and Pools"><div class=hp-sheet-header><div class=hp-sheet-title>Accounts & Cash Pools</div><button type=button class=hp-sheet-close aria-label="Close sheet">×</button></div><div class=hp-sheet-body><div class=hp-rail-block><div class=hp-rail-label></div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div></div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"style=margin-top:0.5rem><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add</button></div></div></div><div class=hp-sheet-footer><button type=button class="btn btn-primary">Done'),hh=p('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save</button><button type=button class=btn>cancel'),fh=p('<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add'),gh=p('<span class=hp-pool-name-row><button type=button class=hp-pool-name></button><button type=button class="btn hp-pool-del">×'),ph=p('<span class=hp-pool-line><span class=hp-pool-cash></span><button type=button class="btn-ghost hp-pool-act">cash</button><button type=button class="btn-ghost hp-pool-act">rename'),mh=p("<div class=hp-pool-item>"),_h=p("<span class=hp-pool-row><input><button type=button class=btn>save</button><button type=button class=btn>cancel"),Cs=p("<select class=hp-pool-pick>"),bh=p('<button type=button class="btn-ghost holdings-close-btn">sell call…'),vh=p('<div class=hp-slot><div class="hp-pos-card hp-lot-card hp-lot-row"><div class=hp-card-summary><div class="hp-lot-row-top hp-card-top"><span class=hp-card-symbol-line><span class=hp-card-symbol> sh </span></span><b></b></div><div class="hp-lot-row-sub hp-card-main"><span>bought <!> · </span><b class=hp-card-pl></b></div><div class="hp-lot-actions hp-card-actions"><button type=button class="btn-ghost holdings-close-btn">close…</button></div></div><div class=hp-card-drawer><div class=hp-lot-row-meta><i>last price </i><i>covered <!>/</i></div><div class=holdings-preview>Total Value: <!> · Account: '),Is=p("<span class=hp-pool-tag>"),Jt=p("<option>"),yh=p("<i class=hp-spot-session>"),wh=p("<span style=font-size:0.85rem;font-weight:600;margin-left:4px>(<!>)"),$h=p('<span class="chip high">buy back?'),Sh=p('<span class="chip high">ITM — called away?'),yr=p("<b>"),kh=p("<i>"),Eh=p('<div class=hp-slot><div class="hp-pos-card hp-list-row"><div class=hp-card-summary><div class=hp-card-top><span class="hp-list-pos hp-card-symbol-line"><span class=hp-kind></span><b class=hp-card-symbol> <!> ×</b></span><span class=hp-card-pl></span></div><div class=hp-card-main><span class=hp-card-meta>exp <!> · <!>/<!> wd</span><span class=hp-list-status></span></div><div class=hp-card-actions><button type=button class="btn-ghost holdings-close-btn">close…</button></div></div><div class=hp-card-drawer><div class=hp-list-pace style=display:flex;align-items:center;gap:10px><i style=font-size:0.85rem;color:var(--muted)>target </i></div><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),Ch=p('<span class="chip normal">holding'),Ih=p("<b>—"),Th=p('<div class=hp-action-sheet role=dialog aria-modal=true><div class=hp-sheet-backdrop></div><div class=hp-sheet-container><div class=hp-sheet-header><div class=hp-sheet-title></div><button type=button class="hp-sheet-close hp-sheet-cancel"aria-label=Close>×</button></div><div class=hp-sheet-body>'),Ph=p("<label>pool<select>"),ut=p("<div class=hp-form-hint>"),Ah=p("<div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares"),xh=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal></label><label>premium<input inputmode=decimal></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary"></button><button type=button class="btn hp-sheet-cancel">Cancel'),Rh=p("<label>pool (deduct <!> from)<select>"),Nh=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class="btn hp-sheet-cancel">Cancel'),Oh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class="btn hp-sheet-cancel">Cancel'),Dh=p("<i class=holdings-preview>"),Lh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close lot · <!> sh </div><form class=holdings-add><label>shares<input inputmode=numeric></label><label>sale price<input inputmode=decimal placeholder="e.g. 360.00"></label><button type=submit class="btn btn-primary">Close </button><button type=button class="btn hp-sheet-cancel">Cancel'),Ts=p("<label class=holdings-outcome-price><input inputmode=decimal>"),Mh=p("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),Uh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class="btn hp-sheet-cancel">Cancel</button><button type=button class="btn btn-primary">Confirm'),Fh=p("<label>pool (deduct strike × 100 × contracts from)<select>"),Bh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class="btn hp-sheet-cancel">Cancel'),Hh=p("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),Vh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class="btn hp-sheet-cancel">Cancel</button><button type=button class="btn btn-primary">Confirm'),Wh=p("<div class=hp-toast-container aria-live=polite>"),jh=p('<div class="hp-toast holdings-notice"role=alert><span class=hp-toast-msg></span><button type=button class=hp-toast-dismiss aria-label="Dismiss notice">×'),zh=p("<div class=hp-list>"),ui=p("<div class=empty-panel>"),Gh=p('<div class=hp-list><div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),qh=p("<span class=hp-pane-hint> sh held"),Kh=p('<div class=hp-toolbar-row><button type=button class="btn hp-add-btn">'),Jh=p('<button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),Yh=p("<div class=holdings-notice>"),Xh=p('<div class="holdings-panel hp-tabs-shell"><div class=hp-mobile-tabs></div><div class=hp-tabs-grid><aside class=hp-tabs-rail><div class=hp-tabs-brand>Wheel ledger</div></aside><main class=hp-tabs-main><div class=hp-pane-head><span class=hp-pane-title>'),Qh=p("<button type=button class=hp-mobile-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>"),Zh=p("<button type=button class=hp-tab-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>");const ue=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),St=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),ln=(t,e=0)=>`${(t*100).toFixed(e)}%`,Me=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),Ps=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(Date.UTC(n,r-1,i+e,12)).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function As(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function ef(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=ch(),r=n.firstChild,i=r.nextSibling;return w(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&at(r,"width",s.e=a),o!==s.t&&at(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function tf(t){const e=()=>t.pool,n=()=>e()?e().cash:t.cash,r=()=>e()?e().reserved:t.reserved,i=()=>e()?e().free:t.free,s=()=>e()?e().name:"All Pools";return(()=>{var a=uh(),o=a.firstChild,l=o.firstChild,u=l.firstChild;u.nextSibling;var d=l.nextSibling,h=d.firstChild;h.nextSibling;var g=o.nextSibling,_=g.firstChild,b=_.firstChild,T=_.nextSibling;return c(l,(()=>{var m=Y(()=>n()==null);return()=>m()?"—":ue(n())})(),u),c(d,(()=>{var m=Y(()=>i()==null);return()=>m()?"—":ue(i())})(),h),c(_,()=>ue(r()),b),c(_,s,null),G(T,"click",t.onOpenPools),a})()}function nf(t){const[e,n]=M(!1),[r,i]=M(null),[s,a]=M(""),o=()=>t.pools??[],l=()=>t.pool,u=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,g=()=>u()==null,_=m=>{var v;m&&m!==((v=l())==null?void 0:v.id)&&t.onSelectPool(m),i(m??null),n(!0)},b=()=>{const m=o().find(v=>v.id===r());return m?m.cash:t.cash},T=async()=>{var m;!s().trim()||(m=t.busy)!=null&&m.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var m=dh(),v=m.firstChild,P=v.nextSibling,D=P.firstChild,R=D.firstChild,O=R.nextSibling,x=D.nextSibling,$=x.firstChild,A=$.firstChild,N=A.nextSibling,I=N.nextSibling,k=I.firstChild,B=k.nextSibling;B.nextSibling;var E=$.nextSibling,J=E.firstChild,q=J.firstChild,F=q.nextSibling,C=x.nextSibling,W=C.firstChild;return G(v,"click",t.onClose),G(O,"click",t.onClose),c(A,(()=>{var H=Y(()=>!!l());return()=>H()?`${l().name} — free to sell puts`:"Total Free Cash"})()),c(N,(()=>{var H=Y(()=>h()==null);return()=>H()?"—":ue(h())})()),c(I,(()=>{var H=Y(()=>u()==null);return()=>H()?"—":ue(u())})(),k),c(I,()=>ue(d()),B),c($,f(S,{get when(){return!e()},get fallback(){return f(xs,{get cash(){return b()},get busy(){return t.busy},onSave:async H=>{await t.onSaveCash(H,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var H=ks();return H.$$click=()=>{var z;return _(((z=l())==null?void 0:z.id)??null)},c(H,()=>g()?"set cash":"edit cash"),H}}),null),c(E,f(S,{get when(){return o().length>0},get children(){var H=Es();return c(H,f(se,{get each(){return o()},children:z=>f(Rs,{pool:z,get selected(){var ce;return((ce=l())==null?void 0:ce.id)===z.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(z.id)},onEditCash:()=>_(z.id),onRename:ce=>t.onRenamePool(z.id,ce),onDelete:()=>t.onDeletePool(z.id)})})),H}}),J),q.$$keydown=H=>H.key==="Enter"&&T(),q.$$input=H=>a(H.target.value),F.$$click=T,G(W,"click",t.onClose),w(H=>{var Z;var z=!t.open,ce=!s().trim()||((Z=t.busy)==null?void 0:Z.call(t));return z!==H.e&&(m.hidden=H.e=z),ce!==H.t&&(F.disabled=H.t=ce),H},{e:void 0,t:void 0}),w(()=>q.value=s()),m})()}function xs(t){const[e,n]=M(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=hh(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling;return s.$$keydown=l=>{var u;return l.key==="Escape"&&((u=t.onCancel)==null?void 0:u.call(t))},s.$$input=l=>n(l.target.value),a.$$click=()=>t.onSave(Number(e())),o.$$click=()=>{var l;return(l=t.onCancel)==null?void 0:l.call(t)},w(()=>{var l;return a.disabled=!r()||((l=t.busy)==null?void 0:l.call(t))}),w(()=>s.value=e()),i})()}function rf(t){const[e,n]=M(!1),[r,i]=M(null),[s,a]=M(""),o=()=>t.pools??[],l=()=>t.pool,u=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,g=()=>u()==null,_=m=>{var v;m&&m!==((v=l())==null?void 0:v.id)&&t.onSelectPool(m),i(m??null),n(!0)},b=()=>{const m=o().find(v=>v.id===r());return m?m.cash:t.cash},T=async()=>{var m;!s().trim()||(m=t.busy)!=null&&m.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var m=fh(),v=m.firstChild,P=v.nextSibling,D=P.nextSibling,R=D.firstChild,O=R.nextSibling;O.nextSibling;var x=D.nextSibling,$=x.firstChild,A=$.firstChild,N=A.nextSibling;return c(P,(()=>{var I=Y(()=>h()==null);return()=>I()?"—":ue(h())})()),c(D,(()=>{var I=Y(()=>u()==null);return()=>I()?"—":ue(u())})(),R),c(D,()=>ue(d()),O),c(m,f(S,{get when(){return!e()},get fallback(){return f(xs,{get cash(){return b()},get busy(){return t.busy},onSave:async I=>{await t.onSaveCash(I,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var I=ks();return I.$$click=()=>{var k;return _(((k=l())==null?void 0:k.id)??null)},c(I,()=>g()?"set cash":"edit cash"),I}}),x),c(x,f(S,{get when(){return o().length>0},get children(){var I=Es();return c(I,f(se,{get each(){return o()},children:k=>f(Rs,{pool:k,get selected(){var B;return((B=l())==null?void 0:B.id)===k.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(k.id)},onEditCash:()=>_(k.id),onRename:B=>t.onRenamePool(k.id,B),onDelete:()=>t.onDeletePool(k.id)})})),I}}),$),A.$$keydown=I=>I.key==="Enter"&&T(),A.$$input=I=>a(I.target.value),N.$$click=T,w(()=>{var I;return N.disabled=!s().trim()||((I=t.busy)==null?void 0:I.call(t))}),w(()=>A.value=s()),m})()}function Rs(t){const[e,n]=M(!1),[r,i]=M(t.pool.name),s=()=>{i(t.pool.name),n(!0)},a=()=>{var l;const o=r().trim();!o||o===t.pool.name||(l=t.busy)!=null&&l.call(t)||(t.onRename(o),n(!1))};return(()=>{var o=mh();return c(o,f(S,{get when(){return!e()},get fallback(){return(()=>{var l=_h(),u=l.firstChild,d=u.nextSibling,h=d.nextSibling;return u.$$keydown=g=>{g.key==="Enter"?a():g.key==="Escape"&&n(!1)},u.$$input=g=>i(g.target.value),d.$$click=a,h.$$click=()=>n(!1),w(g=>{var T;var _=`rename ${t.pool.name}`,b=((T=t.busy)==null?void 0:T.call(t))||!r().trim()||r().trim()===t.pool.name;return _!==g.e&&ae(u,"aria-label",g.e=_),b!==g.t&&(d.disabled=g.t=b),g},{e:void 0,t:void 0}),w(()=>u.value=r()),l})()},get children(){return[(()=>{var l=gh(),u=l.firstChild,d=u.nextSibling;return G(u,"click",t.onSelect),c(u,()=>t.pool.name),G(d,"click",t.onDelete),w(h=>{var b;var g=(b=t.busy)==null?void 0:b.call(t),_=`delete ${t.pool.name}`;return g!==h.e&&(d.disabled=h.e=g),_!==h.t&&ae(d,"aria-label",h.t=_),h},{e:void 0,t:void 0}),l})(),(()=>{var l=ph(),u=l.firstChild,d=u.nextSibling,h=d.nextSibling;return c(u,()=>ue(t.pool.cash)),G(d,"click",t.onEditCash),h.$$click=s,l})()]}})),w(()=>o.classList.toggle("active",!!t.selected)),o})()}const sf={PreMarket:"pre",AfterHours:"post",OverNight:"overnight"};function af(t){const[e,n]=M(!1),r=t.lot,i=()=>r.view;return(()=>{var s=vh(),a=s.firstChild,o=a.firstChild,l=o.firstChild,u=l.firstChild,d=u.firstChild,h=d.firstChild,g=u.nextSibling,_=l.nextSibling,b=_.firstChild,T=b.firstChild,m=T.nextSibling;m.nextSibling;var v=b.nextSibling,P=_.nextSibling,D=P.firstChild,R=o.nextSibling,O=R.firstChild,x=O.firstChild;x.firstChild;var $=x.nextSibling,A=$.firstChild,N=A.nextSibling;N.nextSibling;var I=O.nextSibling,k=I.firstChild,B=k.nextSibling;return B.nextSibling,o.$$click=()=>n(E=>!E),c(d,()=>r.shares,h),c(d,()=>r.symbol,null),c(u,f(S,{get when(){var E;return(((E=t.pools)==null?void 0:E.length)??0)>1},get fallback(){return f(S,{get when(){return t.showPool},get children(){var E=Is();return c(E,()=>r.pool_name??"Main"),E}})},get children(){var E=Cs();return E.addEventListener("change",J=>{var q;return(q=t.onPoolChange)==null?void 0:q.call(t,r,J.currentTarget.value)}),E.$$click=J=>J.stopPropagation(),c(E,f(se,{get each(){return t.pools},children:J=>(()=>{var q=Jt();return c(q,()=>J.name),w(()=>q.value=J.id),q})()})),w(()=>ae(E,"aria-label",`cash pool for ${r.symbol} lot`)),w(()=>{var J,q;return E.value=r.pool_id??((q=(J=t.pools)==null?void 0:J[0])==null?void 0:q.id)??""}),E}}),null),c(g,(()=>{var E=Y(()=>i().spot==null);return()=>E()?"—":St(i().spot)})(),null),c(g,f(S,{get when(){var E;return sf[(E=r.mark)==null?void 0:E.session]},children:E=>(()=>{var J=yh();return c(J,E),J})()}),null),c(b,()=>St(r.basis_per_share),m),c(b,()=>r.acquired,null),c(v,f(S,{get when(){return i().pl_dollars!=null},fallback:"—",get children(){return`${ue(i().pl_dollars)} (${(i().pl_pct??0)>=0?"+":""}${ln(i().pl_pct,1)})`}})),c(P,f(S,{get when(){return i().capacity>0},get children(){var E=bh();return E.$$click=J=>{J.stopPropagation(),t.onSellDialog(r)},E}}),D),D.$$click=E=>{E.stopPropagation(),t.onCloseDialog(r)},c(x,()=>{var E;return As((E=r.mark)==null?void 0:E.as_of)||"—"},null),c($,()=>i().covered,N),c($,()=>i().capacity,null),c(I,(()=>{var E=Y(()=>i().value==null);return()=>E()?"—":ue(i().value)})(),B),c(I,()=>r.pool_name??"Main",null),c(s,f(S,{get when(){return t.dialogFor("sellCall",r.id)},keyed:!0,children:E=>f($n,{get title(){return`Sell covered call · ${E.lot.shares} sh ${E.lot.symbol}`},get onDone(){return t.onDialogDone},get children(){return f(uf,{get lot(){return E.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}})}),null),c(s,f(S,{get when(){return t.dialogFor("closeLot",r.id)},keyed:!0,children:E=>f($n,{get title(){return`Close lot · ${E.lot.shares} sh ${E.lot.symbol}`},get onDone(){return t.onDialogDone},get children(){return f(df,{get lot(){return E.lot},get busy(){return t.busy},get onDone(){return t.onDialogDone},get onClose(){return t.onCloseLot}})}})}),null),w(E=>{var J=(i().pl_dollars??0)>=0,q=(i().pl_dollars??0)<0,F=!e();return J!==E.e&&v.classList.toggle("holdings-pos",E.e=J),q!==E.t&&v.classList.toggle("holdings-neg",E.t=q),F!==E.a&&(R.hidden=E.a=F),E},{e:void 0,t:void 0,a:void 0}),s})()}function of(t){const[e,n]=M(!1),r=t.x,i=()=>r.v.spot_pct_vs_strike!=null&&r.v.spot_pct_vs_strike>0,s=()=>r.p.kind==="call"?r.v.spot_pct_vs_strike>0:r.v.spot_pct_vs_strike<0;return(()=>{var a=Eh(),o=a.firstChild,l=o.firstChild,u=l.firstChild,d=u.firstChild,h=d.firstChild,g=h.nextSibling,_=g.firstChild,b=_.nextSibling;b.nextSibling;var T=d.nextSibling,m=u.nextSibling,v=m.firstChild,P=v.firstChild,D=P.nextSibling,R=D.nextSibling,O=R.nextSibling,x=O.nextSibling,$=x.nextSibling;$.nextSibling;var A=v.nextSibling,N=m.nextSibling,I=N.firstChild,k=l.nextSibling,B=k.firstChild,E=B.firstChild;E.firstChild;var J=B.nextSibling,q=J.firstChild,F=q.firstChild,C=F.nextSibling,W=q.nextSibling,H=W.firstChild,z=H.nextSibling,ce=z.nextSibling,Z=W.nextSibling;Z.firstChild;var ve=Z.nextSibling,tt=ve.firstChild,oe=tt.nextSibling;return l.$$click=()=>n(L=>!L),c(h,()=>r.p.kind.toUpperCase()),c(g,()=>r.p.symbol,_),c(g,()=>r.p.strike,b),c(g,()=>r.p.kind==="put"?"P":"C",b),c(g,()=>r.p.contracts,null),c(d,f(S,{get when(){return Y(()=>r.p.kind==="call")()&&t.showPool},get children(){var L=Is();return c(L,()=>r.p.pool_name),L}}),null),c(d,f(S,{get when(){return Y(()=>r.p.kind==="put")()&&t.showPool},get children(){var L=Cs();return L.addEventListener("change",X=>{var ne;return(ne=t.onPoolChange)==null?void 0:ne.call(t,r.p.id,X.target.value)}),L.$$click=X=>X.stopPropagation(),c(L,f(se,{get each(){return t.pools},children:X=>(()=>{var ne=Jt();return c(ne,()=>X.name),w(()=>ne.value=X.id),ne})()})),w(X=>{var _e,nt;var ne=`cash pool for ${r.p.symbol} ${r.p.strike} put`,ge=(nt=(_e=t.dialogActions)==null?void 0:_e.busy)==null?void 0:nt.call(_e);return ne!==X.e&&ae(L,"aria-label",X.e=ne),ge!==X.t&&(L.disabled=X.t=ge),X},{e:void 0,t:void 0}),w(()=>{var X,ne;return L.value=((ne=(X=t.pools)==null?void 0:X.find(ge=>ge.name===r.p.pool_name))==null?void 0:ne.id)??""}),L}}),null),c(T,(()=>{var L=Y(()=>r.v.pl_pct==null);return()=>L()?"—":`${r.v.pl_pct>=0?"+":""}${ln(r.v.pl_pct,1)}`})(),null),c(T,f(S,{get when(){return r.v.pl_dollars!=null},get children(){var L=wh(),X=L.firstChild,ne=X.nextSibling;return ne.nextSibling,c(L,()=>ue(r.v.pl_dollars),ne),L}}),null),c(v,()=>r.p.expiry,D),c(v,()=>r.v.days_elapsed,O),c(v,()=>r.v.days_total,$),c(A,f(S,{get when(){return r.v.pace_met},get fallback(){return Ch()},get children(){return $h()}}),null),c(A,f(S,{get when(){return Y(()=>r.p.kind==="call")()&&i()},get children(){return Sh()}}),null),I.$$click=L=>{L.stopPropagation(),t.onClose(r)},c(B,f(ef,{get v(){return r.v}}),E),c(E,()=>ln(r.v.target_pct),null),c(C,()=>St(r.p.premium)),c(z,(()=>{var L=Y(()=>r.p.mark==null);return()=>L()?"—":r.p.mark.mid.toFixed(2)})()),c(ce,(()=>{var L=Y(()=>r.p.mark==null);return()=>L()?"unpriced":As(r.p.mark.as_of)})()),c(Z,f(S,{get when(){var L;return((L=r.p.mark)==null?void 0:L.underlying_price)!=null},get fallback(){return Ih()},get children(){return[(()=>{var L=yr();return c(L,()=>r.p.mark.underlying_price.toFixed(2)),L})(),(()=>{var L=kh();return c(L,(()=>{var X=Y(()=>r.v.spot_pct_vs_strike==null);return()=>X()?"":`${r.v.spot_pct_vs_strike>=0?"+":""}${ln(r.v.spot_pct_vs_strike,1)} vs strike`})()),w(()=>ye(L,s()&&r.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),L})()]}}),null),c(oe,(()=>{var L=Y(()=>r.v.pl_dollars==null);return()=>L()?"—":St(r.v.pl_dollars)})()),c(a,f(S,{get when(){return t.dialogFor(r.p.kind,r.p.id)},keyed:!0,children:L=>f($n,{get title(){return Y(()=>L.type==="put"&&L.stage==="lot")()?"Record assigned shares":`Close ${L.pos.symbol} ${L.pos.strike}${L.type==="put"?"P":"C"} ×${L.pos.contracts}`},get onDone(){var X;return(X=t.dialogActions)==null?void 0:X.onDone},get children(){return f(pf,na({d:L,get pools(){return t.pools}},()=>t.dialogActions))}})}),null),w(L=>{var X=!!r.v.pace_met,ne=r.p.kind,ge=r.v.pl_pct>=0,_e=r.v.pl_pct<0,nt=!e(),Yt=(r.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return X!==L.e&&o.classList.toggle("hp-row-met",L.e=X),ne!==L.t&&ae(h,"data-kind",L.t=ne),ge!==L.a&&T.classList.toggle("holdings-pos",L.a=ge),_e!==L.o&&T.classList.toggle("holdings-neg",L.o=_e),nt!==L.i&&(k.hidden=L.i=nt),Yt!==L.n&&ye(oe,L.n=Yt),L},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0}),a})()}function $n(t){return(()=>{var e=Th(),n=e.firstChild,r=n.nextSibling,i=r.firstChild,s=i.firstChild,a=s.nextSibling,o=i.nextSibling;return G(n,"click",t.onDone),c(s,()=>t.title),G(a,"click",t.onDone),c(o,()=>t.children),w(()=>ae(e,"aria-label",t.title||"Position Action")),e})()}function lf(t){var l,u;const e=t.kind,n=()=>t.pools??[],[r,i]=M({symbol:"",strike:"",premium:"",contracts:"1",sold:Me(),expiry:Ps(Me(),7),pool_id:((u=(l=t.pools)==null?void 0:l[0])==null?void 0:u.id)??""}),s=d=>h=>i({...r(),[d]:h.target.value}),a=()=>r().symbol.trim()&&[r().strike,r().premium,r().contracts].every(d=>Number(d)>0)&&r().expiry>r().sold&&r().sold<=Me(),o=()=>r().symbol.trim()?!r().strike||Number(r().strike)<=0?"Please enter a positive strike price.":!r().premium||Number(r().premium)<=0?"Please enter a positive option premium.":!r().contracts||Number(r().contracts)<1?"Contracts must be at least 1.":r().expiry<=r().sold?"Expiration date must be after the sold date.":null:"Please enter a stock symbol (e.g. AAPL, NVDA).";return(()=>{var d=xh(),h=d.firstChild,g=h.firstChild,_=g.nextSibling,b=h.nextSibling,T=b.firstChild,m=T.nextSibling,v=b.nextSibling,P=v.firstChild,D=P.nextSibling,R=v.nextSibling,O=R.firstChild,x=O.nextSibling,$=R.nextSibling,A=$.firstChild,N=A.nextSibling,I=$.nextSibling,k=I.firstChild,B=k.nextSibling,E=I.nextSibling,J=E.nextSibling;return d.addEventListener("submit",q=>{var F,C;q.preventDefault(),!(!a()||(F=t.busy)!=null&&F.call(t))&&t.onAdd({...e==="call"?{kind:"call"}:{},...n().length>0?{pool_id:r().pool_id||((C=n()[0])==null?void 0:C.id)}:{},symbol:r().symbol.trim().toUpperCase(),strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:r().sold,expiry:r().expiry})}),G(_,"input",s("symbol")),G(m,"input",s("strike")),ae(m,"placeholder",e==="call"?"e.g. 355.00":"e.g. 350.00"),G(D,"input",s("premium")),ae(D,"placeholder",e==="call"?"e.g. 1.80":"e.g. 1.00"),G(x,"input",s("contracts")),c(d,f(S,{get when(){return n().length>1},get children(){var q=Ph(),F=q.firstChild,C=F.nextSibling;return G(C,"input",s("pool_id")),c(C,f(se,{get each(){return n()},children:W=>(()=>{var H=Jt();return c(H,()=>W.name),w(()=>H.value=W.id),H})()})),w(()=>C.value=r().pool_id),q}}),$),G(N,"input",s("sold")),G(B,"input",s("expiry")),c(d,f(S,{get when(){return o()},get children(){var q=ut();return c(q,o),q}}),E),c(E,e==="call"?"Sell call":"Sell put"),G(J,"click",t.onDone),c(d,f(S,{when:e==="call",get children(){return Ah()}}),null),w(()=>{var q;return E.disabled=!a()||((q=t.busy)==null?void 0:q.call(t))}),w(()=>_.value=r().symbol),w(()=>m.value=r().strike),w(()=>D.value=r().premium),w(()=>x.value=r().contracts),w(()=>N.value=r().sold),w(()=>B.value=r().expiry),d})()}function cf(t){var o;const e=()=>t.pools??[],[n,r]=M({symbol:"",shares:"",basis_per_share:"",acquired:Me(),pool_id:((o=e()[0])==null?void 0:o.id)??""}),i=l=>u=>r({...n(),[l]:u.target.value}),s=()=>n().symbol.trim()&&Number(n().shares)>0&&Number(n().basis_per_share)>0,a=()=>n().symbol.trim()?!n().shares||Number(n().shares)<=0?"Shares must be at least 1.":!n().basis_per_share||Number(n().basis_per_share)<=0?"Please enter a positive cost basis per share.":null:"Please enter a stock symbol (e.g. AAPL, GOOG).";return(()=>{var l=Nh(),u=l.firstChild,d=u.firstChild,h=d.nextSibling,g=u.nextSibling,_=g.firstChild,b=_.nextSibling,T=g.nextSibling,m=T.firstChild,v=m.nextSibling,P=T.nextSibling,D=P.firstChild,R=D.nextSibling,O=P.nextSibling,x=O.nextSibling;return l.addEventListener("submit",$=>{var A,N;$.preventDefault(),!(!s()||(A=t.busy)!=null&&A.call(t))&&t.onAdd({kind:"lot",symbol:n().symbol.trim().toUpperCase(),shares:Math.trunc(Number(n().shares)),basis_per_share:Number(n().basis_per_share),acquired:n().acquired,...e().length>0?{pool_id:n().pool_id||((N=e()[0])==null?void 0:N.id)}:{}})}),G(h,"input",i("symbol")),G(b,"input",i("shares")),G(v,"input",i("basis_per_share")),c(l,f(S,{get when(){return e().length>1},get children(){var $=Rh(),A=$.firstChild,N=A.nextSibling,I=N.nextSibling,k=I.nextSibling;return c($,()=>Math.trunc(Number(n().shares)*Number(n().basis_per_share)||0).toLocaleString(),N),G(k,"input",i("pool_id")),c(k,f(se,{get each(){return e()},children:B=>(()=>{var E=Jt();return c(E,()=>B.name),w(()=>E.value=B.id),E})()})),w(()=>k.value=n().pool_id),$}}),P),G(R,"input",i("acquired")),c(l,f(S,{get when(){return a()},get children(){var $=ut();return c($,a),$}}),O),G(x,"click",t.onDone),w(()=>{var $;return O.disabled=!s()||(($=t.busy)==null?void 0:$.call(t))}),w(()=>h.value=n().symbol),w(()=>b.value=n().shares),w(()=>v.value=n().basis_per_share),w(()=>R.value=n().acquired),l})()}function uf(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=M({strike:"",premium:"",contracts:String(n()),expiry:Ps(Me(),7)}),s=l=>u=>i({...r(),[l]:u.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>Me(),o=()=>!r().strike||Number(r().strike)<=0?"Please enter a positive strike price.":!r().premium||Number(r().premium)<=0?"Please enter a positive premium.":!r().contracts||Number(r().contracts)<1?"Contracts must be at least 1.":Number(r().contracts)>n()?`Contracts cannot exceed lot capacity of ${n()}.`:r().expiry<=Me()?"Expiration date must be in the future.":null;return(()=>{var l=Oh(),u=l.firstChild,d=u.firstChild,h=d.nextSibling;h.nextSibling;var g=u.nextSibling,_=g.firstChild,b=_.firstChild,T=b.nextSibling,m=_.nextSibling,v=m.firstChild,P=v.nextSibling,D=m.nextSibling,R=D.firstChild,O=R.nextSibling,x=D.nextSibling,$=x.firstChild,A=$.nextSibling,N=x.nextSibling,I=N.nextSibling;return c(u,()=>e.shares,h),c(u,()=>e.symbol,null),g.addEventListener("submit",k=>{var B;k.preventDefault(),!(!a()||(B=t.busy)!=null&&B.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:Me(),expiry:r().expiry})}),G(T,"input",s("strike")),G(P,"input",s("premium")),G(O,"input",s("contracts")),G(A,"input",s("expiry")),c(g,f(S,{get when(){return o()},get children(){var k=ut();return c(k,o),k}}),N),G(I,"click",t.onDone),w(()=>{var k;return N.disabled=!a()||((k=t.busy)==null?void 0:k.call(t))}),w(()=>T.value=r().strike),w(()=>P.value=r().premium),w(()=>O.value=r().contracts),w(()=>A.value=r().expiry),l})()}function df(t){const e=t.lot,[n,r]=M({shares:String(e.shares),price:""}),i=d=>h=>r({...n(),[d]:h.target.value}),s=()=>Math.trunc(Number(n().shares)),a=()=>Number(n().price),o=()=>Number.isInteger(s())&&s()>=1&&s()<=e.shares&&a()>0,l=()=>!s()||s()<1||s()>e.shares?`Shares to close must be between 1 and ${e.shares}.`:!a()||a()<=0?"Please enter a positive sale price per share.":null,u=()=>o()?s()*a():null;return(()=>{var d=Lh(),h=d.firstChild,g=h.firstChild,_=g.nextSibling;_.nextSibling;var b=h.nextSibling,T=b.firstChild,m=T.firstChild,v=m.nextSibling,P=T.nextSibling,D=P.firstChild,R=D.nextSibling,O=P.nextSibling;O.firstChild;var x=O.nextSibling;return c(h,()=>e.shares,_),c(h,()=>e.symbol,null),b.addEventListener("submit",$=>{var A;$.preventDefault(),!(!o()||(A=t.busy)!=null&&A.call(t))&&t.onClose(e,s(),a())}),b.$$keydown=$=>{$.key==="Escape"&&t.onDone()},G(v,"input",i("shares")),G(R,"input",i("price")),c(b,f(S,{get when(){return u()!=null},get children(){var $=Dh();return c($,()=>`${s()} sh × $${a().toFixed(2)} → $${u().toFixed(2)} → pool ${e.pool_name??"Main"}`),$}}),O),c(b,f(S,{get when(){return l()},get children(){var $=ut();return c($,l),$}}),O),c(O,(()=>{var $=Y(()=>s()===e.shares);return()=>$()?"lot":`${s()} sh`})(),null),G(x,"click",t.onDone),w(()=>{var $;return O.disabled=!o()||(($=t.busy)==null?void 0:$.call(t))}),w(()=>v.value=n().shares),w(()=>R.value=n().price),d})()}function hf(t){var l,u;const e=t.d.pos,[n,r]=M("bought-back"),[i,s]=M(((u=(l=e.mark)==null?void 0:l.mid)==null?void 0:u.toFixed(2))??""),a=()=>n()!=="expired"&&(!i()||!Number.isFinite(Number(i()))||Number(i())<0)?"Please enter a valid price per share.":null,o=()=>{if(n()==="expired")return e.premium*100*e.contracts;const d=Number(i());return Number.isFinite(d)?n()==="assigned"?(e.strike-d+e.premium)*100*e.contracts:(e.premium-d)*100*e.contracts:null};return(()=>{var d=Uh(),h=d.firstChild,g=h.firstChild,_=g.nextSibling,b=_.nextSibling,T=b.nextSibling;T.nextSibling;var m=h.nextSibling,v=m.firstChild,P=v.firstChild,D=v.nextSibling,R=D.firstChild,O=D.nextSibling,x=O.firstChild,$=m.nextSibling;$.firstChild;var A=$.nextSibling,N=A.firstChild,I=N.nextSibling;return c(h,()=>e.symbol,_),c(h,()=>e.strike,T),c(h,()=>e.contracts,null),P.addEventListener("change",()=>r("bought-back")),R.addEventListener("change",()=>r("expired")),x.addEventListener("change",()=>r("assigned")),c(d,f(S,{get when(){return n()!=="expired"},get children(){var k=Ts(),B=k.firstChild;return c(k,()=>n()==="assigned"?"share price at assignment":"close price/share",B),B.$$input=E=>s(E.target.value),w(()=>B.value=i()),k}}),$),c($,f(S,{get when(){return o()!==null},fallback:"—",get children(){var k=yr();return c(k,()=>St(o())),w(()=>ye(k,o()>=0?"holdings-pos":"holdings-neg")),k}}),null),c(d,f(S,{get when(){return a()},get children(){var k=ut();return c(k,a),k}}),A),G(N,"click",t.onDone),I.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),c(d,f(S,{get when(){return n()==="assigned"},get children(){return Mh()}}),null),w(()=>{var k;return I.disabled=((k=t.busy)==null?void 0:k.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),w(()=>P.checked=n()==="bought-back"),w(()=>R.checked=n()==="expired"),w(()=>x.checked=n()==="assigned"),d})()}function ff(t){var o,l;const e=()=>t.pools??[],[n,r]=M({...t.d.prefill,pool_id:((o=t.d.pos)==null?void 0:o.pool_id)??((l=e()[0])==null?void 0:l.id)??""}),i=u=>d=>r({...n(),[u]:d.target.value}),s=()=>n().symbol.trim()&&Number(n().shares)>0&&Number(n().basis_per_share)>0,a=()=>n().symbol.trim()?!n().shares||Number(n().shares)<=0?"Shares must be greater than 0.":!n().basis_per_share||Number(n().basis_per_share)<=0?"Cost basis must be greater than 0.":null:"Please enter a stock symbol.";return(()=>{var u=Bh(),d=u.firstChild,h=d.nextSibling,g=h.firstChild,_=g.firstChild,b=_.nextSibling,T=g.nextSibling,m=T.firstChild,v=m.nextSibling,P=T.nextSibling,D=P.firstChild,R=D.nextSibling,O=P.nextSibling,x=O.firstChild,$=x.nextSibling,A=O.nextSibling,N=A.nextSibling;return h.addEventListener("submit",I=>{var k,B;I.preventDefault(),!(!s()||(k=t.busy)!=null&&k.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:n().symbol.trim().toUpperCase(),shares:Math.trunc(Number(n().shares)),basis_per_share:Number(n().basis_per_share),acquired:n().acquired,assigned_from:t.d.pos.id,...e().length>0?{pool_id:n().pool_id||((B=e()[0])==null?void 0:B.id)}:{}})}),G(b,"input",i("symbol")),G(v,"input",i("shares")),c(h,f(S,{get when(){return e().length>1},get children(){var I=Fh(),k=I.firstChild,B=k.nextSibling;return G(B,"input",i("pool_id")),c(B,f(se,{get each(){return e()},children:E=>(()=>{var J=Jt();return c(J,()=>E.name),w(()=>J.value=E.id),J})()})),w(()=>B.value=n().pool_id),I}}),P),G(R,"input",i("basis_per_share")),G($,"input",i("acquired")),c(h,f(S,{get when(){return a()},get children(){var I=ut();return c(I,a),I}}),A),G(N,"click",t.onDone),w(()=>{var I;return A.disabled=!s()||((I=t.busy)==null?void 0:I.call(t))}),w(()=>b.value=n().symbol),w(()=>v.value=n().shares),w(()=>R.value=n().basis_per_share),w(()=>$.value=n().acquired),u})()}function gf(t){var l,u;const e=t.d.pos,[n,r]=M("bought-back"),[i,s]=M(((u=(l=e.mark)==null?void 0:l.mid)==null?void 0:u.toFixed(2))??""),a=()=>n()!=="expired"&&(!i()||!Number.isFinite(Number(i()))||Number(i())<0)?"Please enter a valid price per share.":null,o=()=>{if(n()==="expired")return e.premium*100*e.contracts;const d=Number(i());return Number.isFinite(d)?n()==="called-away"?(e.strike-d+e.premium)*100*e.contracts:(e.premium-d)*100*e.contracts:null};return(()=>{var d=Vh(),h=d.firstChild,g=h.firstChild,_=g.nextSibling,b=_.nextSibling,T=b.nextSibling;T.nextSibling;var m=h.nextSibling,v=m.firstChild,P=v.firstChild,D=v.nextSibling,R=D.firstChild,O=D.nextSibling,x=O.firstChild,$=m.nextSibling;$.firstChild;var A=$.nextSibling,N=A.firstChild,I=N.nextSibling;return c(h,()=>e.symbol,_),c(h,()=>e.strike,T),c(h,()=>e.contracts,null),P.addEventListener("change",()=>r("bought-back")),R.addEventListener("change",()=>r("expired")),x.addEventListener("change",()=>r("called-away")),c(d,f(S,{get when(){return n()!=="expired"},get children(){var k=Ts(),B=k.firstChild;return c(k,()=>n()==="called-away"?"share price at call":"close price/share",B),B.$$input=E=>s(E.target.value),w(()=>B.value=i()),k}}),$),c($,f(S,{get when(){return o()!==null},fallback:"—",get children(){var k=yr();return c(k,()=>St(o())),w(()=>ye(k,o()>=0?"holdings-pos":"holdings-neg")),k}}),null),c(d,f(S,{get when(){return a()},get children(){var k=ut();return c(k,a),k}}),A),G(N,"click",t.onDone),I.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),c(d,f(S,{get when(){return n()==="called-away"},get children(){var k=Hh(),B=k.firstChild,E=B.nextSibling,J=E.nextSibling,q=J.nextSibling;return q.nextSibling,c(k,()=>e.symbol,E),c(k,()=>e.contracts*100,q),k}}),null),w(()=>{var k;return I.disabled=((k=t.busy)==null?void 0:k.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),w(()=>P.checked=n()==="bought-back"),w(()=>R.checked=n()==="expired"),w(()=>x.checked=n()==="called-away"),d})()}function pf(t){return t.d.type==="put"?t.d.stage==="lot"?f(ff,{get d(){return t.d},get pools(){return t.pools},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(hf,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f(gf,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function mf(t){return(()=>{var e=Wh();return c(e,f(S,{get when(){return t.toast()},keyed:!0,children:n=>(()=>{var r=jh(),i=r.firstChild,s=i.nextSibling;return G(r,"click",t.onDismiss),c(i,()=>n.msg),s.$$click=a=>{a.stopPropagation(),t.onDismiss()},w(a=>{var o=n.kind==="ok",l=n.kind==="err";return o!==a.e&&r.classList.toggle("hp-toast-ok",a.e=o),l!==a.t&&r.classList.toggle("hp-toast-err",a.t=l),a},{e:void 0,t:void 0}),r})()})),e})()}function _f(){const[t,e]=M(null),[n,r]=M(null),[i,s]=M(!1);let a;const o=()=>{clearTimeout(a),r(null)},l=(y,U="ok")=>{r({msg:y,kind:U}),clearTimeout(a),U==="ok"&&(a=setTimeout(()=>r(null),8e3))},u=()=>{var y;return((y=n())==null?void 0:y.msg)??""};Fe(()=>clearTimeout(a));const[d,h]=M(null),[g,_]=M(!1),b=async()=>{try{e(await pa())}catch(y){l(`Holdings API error: ${y.message}`,"err")}};vt(b);const T=()=>{var y;return((y=t())==null?void 0:y.positions)??[]},m=()=>{var y;return((y=t())==null?void 0:y.calls)??[]},v=()=>{var y;return((y=t())==null?void 0:y.lots)??[]},P=()=>T().map(y=>({p:{...y,kind:"put"},v:y.view})),D=()=>m().map(y=>({p:{...y,kind:"call"},v:y.view})),R=y=>y.v.pl_pct==null?-1/0:y.v.pl_pct-y.v.target_pct,O=(y,U)=>{var ee,de;const V=d();return!V||V.type!==y?null:(((ee=V.pos)==null?void 0:ee.id)??((de=V.lot)==null?void 0:de.id))===U?V:null},x=async y=>{if(g())return null;_(!0);try{return await y()}catch(U){return l(U.message,"err"),null}finally{_(!1)}},$=async()=>{var V;const y=await x(()=>ma());if(!y)return;const U=((V=y.refresh)==null?void 0:V.stale)??[];l(U.length?`Marks refreshed — ${U.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await b()},A=async(y,U)=>{await x(()=>On(y))&&(l(U),h(null),await b())},N=async(y,U)=>{await x(()=>On(U))&&(l(`Assigned — recorded ${U.shares} sh ${U.symbol} at $${U.basis_per_share.toFixed(2)} basis.`),h(null),await b())},I=async(y,U,V)=>{if(U==="assigned"){h({type:"put",pos:y,stage:"lot",prefill:{symbol:y.symbol,shares:y.contracts*100,basis_per_share:+(y.strike-y.premium).toFixed(2),acquired:Me()}});return}await x(()=>Dn(y.id))&&(l(U==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),h(null),await b())},k=async(y,U,V)=>{if(U==="called-away"){const ee=await x(()=>ba(y.id));if(!ee)return;l(ee.reduced?`Called away — ${y.symbol} lot reduced by ${y.contracts*100} sh.`:`Called away — call removed. ${ee.reason??""}`),h(null),await b();return}await x(()=>Dn(y.id))&&(l(U==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),h(null),await b())},B=async(y,U)=>{const V=await x(()=>Er(U?{cash:y,pool_id:U}:{cash:y}));return V?(e(Q=>({...Q??{},cash:V.cash,cash_reserved:V.cash_reserved,cash_free:V.cash_free,cash_pools:V.pool?((Q==null?void 0:Q.cash_pools)??[]).map(ee=>ee.id===V.pool.id?{...ee,...V.pool}:ee):(Q==null?void 0:Q.cash_pools)??[]})),l(V.pool?`Cash set to ${ue(V.pool.cash)} — ${ue(V.pool.free)} free in ${V.pool.name}.`:`Cash set to ${ue(V.cash)} — ${ue(V.cash_free)} free.`),!0):!1},E=()=>{var y;return((y=t())==null?void 0:y.cash_pools)??[]},[J,q]=M(null),F=()=>{const y=E();return y.length?y.find(U=>U.id===J())??y[0]:null},C=async y=>{var V;const U=await x(()=>On({kind:"pool",name:y}));return U?(l(`Pool “${y}” added — set its cash with the strip.`),q(((V=U.pool)==null?void 0:V.id)??null),await b(),!0):!1},W=async(y,U)=>{await x(()=>Er({pool_id:y,name:U}))&&(l(`Pool renamed to “${U}”.`),await b())},H=async y=>{await x(()=>Dn(y))&&(l("Pool deleted."),J()===y&&q(null),await b())},z=async(y,U)=>{var Q;const V=await x(()=>kr(y,U));V&&(l(`Put moved to ${((Q=V.position)==null?void 0:Q.pool_name)??"the pool"}.`),await b())},ce=async(y,U)=>{var Q;const V=await x(()=>kr(y.id,U));V&&(l(`${y.symbol} lot moved to ${((Q=V.lot)==null?void 0:Q.pool_name)??"the pool"}.`),await b())},Z={busy:g,onDone:()=>h(null),onConfirmPut:I,onConfirmCall:k,onAssign:N},[ve,tt]=M("lots"),oe=()=>[{id:"lots",label:"Lots",count:v().length,sub:`${v().reduce((y,U)=>y+U.shares,0)} sh held`},{id:"puts",label:"Puts",count:T().length,sub:`${T().filter(y=>y.view.pace_met).length} pace-met`},{id:"calls",label:"Calls",count:m().length,sub:`${m().filter(y=>y.view.spot_pct_vs_strike>0).length} ITM`}],L=()=>[...P()].sort((y,U)=>R(U)-R(y)),X=()=>[...D()].sort((y,U)=>R(U)-R(y)),ne={lots:{label:"+ New lot",type:"addLot"},puts:{label:"+ Sell put",type:"addPut"},calls:{label:"+ Sell call",type:"addCall"}},ge={lots:"No recorded lots — assignments land here.",puts:"No open puts — press “+ Sell put” to record one.",calls:"No open calls — press “+ Sell call” to record one."},_e=y=>{if(y==="lots")return f(S,{get when(){return v().length>0},get fallback(){return(()=>{var V=ui();return c(V,()=>ge.lots),V})()},get children(){var V=zh();return c(V,f(se,{get each(){return v()},children:Q=>f(af,{lot:Q,dialogFor:O,busy:g,get pools(){return E()},get showPool(){return E().length>1},onPoolChange:ce,onSellDialog:ee=>h({type:"sellCall",lot:ee}),onCloseDialog:ee=>h({type:"closeLot",lot:ee}),onDialogDone:()=>h(null),onSellCall:(ee,de)=>A(de,`Sold ${de.symbol} ${de.strike}C ×${de.contracts} — Refresh marks to price.`),onCloseLot:async(ee,de,dt,K)=>{await x(()=>_a(ee.id,de,dt,K))&&(l(`Closed ${de} sh ${ee.symbol} — $${(de*dt).toFixed(2)} to the pool.`),h(null),await b())}})})),V}});const U=y==="puts"?L():X();return f(S,{get when(){return U.length>0},get fallback(){return(()=>{var V=ui();return c(V,()=>ge[y]),V})()},get children(){var V=Gh();return V.firstChild,c(V,f(se,{each:U,children:Q=>f(of,{x:Q,get showPool(){return E().length>1},get pools(){return E()},onPoolChange:z,dialogFor:O,dialogActions:Z,onClose:ee=>h({type:ee.p.kind,pos:ee.p})})}),null),V}})},nt=y=>f(S,{get when(){var U,V,Q;return y==="lots"&&((U=d())==null?void 0:U.type)==="addLot"||y==="puts"&&((V=d())==null?void 0:V.type)==="addPut"||y==="calls"&&((Q=d())==null?void 0:Q.type)==="addCall"},keyed:!0,get children(){return f($n,{title:y==="lots"?"Record Share Lot":y==="puts"?"Sell Put Option":"Sell Call Option",onDone:()=>h(null),get children(){return y==="lots"?f(cf,{get pools(){return E()},busy:g,onDone:()=>h(null),onAdd:U=>A(U,`Recorded ${U.shares} sh ${U.symbol}.`)}):f(lf,{kind:y==="puts"?"put":"call",get pools(){return E()},busy:g,onDone:()=>h(null),onAdd:U=>A(U,`Sold ${U.symbol} ${U.strike}${y==="puts"?"P":"C"} ×${U.contracts} — Refresh marks to price.`)})}})}}),Yt=y=>(()=>{var U=Kh(),V=U.firstChild;return V.$$click=()=>h({type:ne[y].type}),c(V,()=>ne[y].label),c(U,f(S,{when:y==="lots",get children(){var Q=qh(),ee=Q.firstChild;return c(Q,()=>v().reduce((de,dt)=>de+dt.shares,0),ee),Q}}),null),U})(),Ms=()=>(()=>{var y=Jh();return y.$$click=$,w(()=>y.disabled=g()),y})(),Us=()=>f(S,{get when(){return u()},get children(){var y=Yh();return c(y,u),y}});return(()=>{var y=Xh(),U=y.firstChild,V=U.nextSibling,Q=V.firstChild;Q.firstChild;var ee=Q.nextSibling,de=ee.firstChild,dt=de.firstChild;return c(y,f(tf,{get cash(){var K;return((K=t())==null?void 0:K.cash)??null},get reserved(){var K;return((K=t())==null?void 0:K.cash_reserved)??0},get free(){var K;return((K=t())==null?void 0:K.cash_free)??null},get pools(){return E()},get pool(){return F()},onOpenPools:()=>s(!0)}),U),c(U,f(se,{get each(){return oe()},children:K=>(()=>{var Ie=Qh(),Tt=Ie.firstChild,Pt=Tt.nextSibling,An=Pt.nextSibling;return Ie.$$click=()=>tt(K.id),c(Tt,()=>K.label.toUpperCase()),c(Pt,()=>K.count),c(An,()=>K.sub),w(()=>Ie.classList.toggle("active",ve()===K.id)),Ie})()})),c(y,f(S,{get when(){return i()},get children(){return f(nf,{open:!0,onClose:()=>s(!1),get cash(){var K;return((K=t())==null?void 0:K.cash)??null},get reserved(){var K;return((K=t())==null?void 0:K.cash_reserved)??0},get free(){var K;return((K=t())==null?void 0:K.cash_free)??null},get pools(){return E()},get pool(){return F()},busy:g,onSaveCash:B,onSelectPool:q,onAddPool:C,onRenamePool:W,onDeletePool:H})}}),V),c(Q,f(rf,{get cash(){var K;return((K=t())==null?void 0:K.cash)??null},get reserved(){var K;return((K=t())==null?void 0:K.cash_reserved)??0},get free(){var K;return((K=t())==null?void 0:K.cash_free)??null},get pools(){return E()},get pool(){return F()},busy:g,onSaveCash:B,onSelectPool:q,onAddPool:C,onRenamePool:W,onDeletePool:H}),null),c(Q,f(se,{get each(){return oe()},children:K=>(()=>{var Ie=Zh(),Tt=Ie.firstChild,Pt=Tt.nextSibling,An=Pt.nextSibling;return Ie.$$click=()=>tt(K.id),c(Tt,()=>K.label.toUpperCase()),c(Pt,()=>K.count),c(An,()=>K.sub),w(()=>Ie.classList.toggle("active",ve()===K.id)),Ie})()}),null),c(dt,()=>oe().find(K=>K.id===ve()).label),c(de,Ms,null),c(ee,Us,null),c(ee,()=>Yt(ve()),null),c(ee,()=>nt(ve()),null),c(ee,()=>_e(ve()),null),c(y,f(mf,{toast:n,onDismiss:o}),null),y})()}Ce(["click","input","keydown"]);async function bf(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const u=l.slice(5).trim();if(u)try{e(JSON.parse(u))}catch{}}}return"completed"}catch{return"lost"}}var vf=p("<button type=button class=run-btn>"),yf=p("<span class=run-count>/"),wf=p("<span class=run-bar><span class=fill>"),$f=p("<li><span class=mark></span><span class=label>"),Sf=p("<div class=toast-cached>Served from cache — last run <!> min old"),kf=p('<div class="toast-cached warn">'),Ef=p("<div class=run-headline>"),Cf=p("<ul class=run-stages>"),If=p("<details class=run-errors><summary>details</summary><ul>"),Tf=p("<div class=run-warn>Closing this tab stops the run."),Pf=p("<div class=run-warn>Re-checking every 15 s…"),Af=p("<div class=run-strip>"),xf=p("<li> ");const Ns=["quotes","metrics","chains_short","chains_medium"],Os={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},Rf=15e3,Ds=t=>t!==null&&Date.now()>=t;function di(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function Nf(t){const[e,n]=M("idle"),[r,i]=M(R()),[s,a]=M(null),[o,l]=M(0),[u,d]=M(null),[h,g]=M(null),[_,b]=M("");let T=null,m=null;const[v,P]=M(0);let D=null;st(()=>{const F=t();if(D&&(clearTimeout(D),D=null),(F==null?void 0:F.run_allowed)===!1){const C=wn(F.next_open_utc);C!==null&&(D=setTimeout(()=>P(W=>W+1),Math.max(0,C-Date.now())))}});function R(){return Object.fromEntries(Ns.map(F=>[F,{status:"pending",error:null}]))}function O(){T&&clearInterval(T),T=null,m&&clearInterval(m),m=null}function x(){l(0),T=setInterval(()=>l(F=>F+1),1e3)}function $(F){switch(F.type){case"stage_started":i(C=>({...C,[F.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:F.stage,done:F.done,total:F.total});break;case"stage_finished":i(C=>({...C,[F.stage]:{status:F.ok?"ok":"failed",error:F.error??null}}));break;case"run_finished":d(F);break}}function A(){O();const F=u(),C=((F==null?void 0:F.stages)??[]).some(W=>W.name.startsWith("chains")&&["ok","partial"].includes(W.status));n(F&&(C||F.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function N(F){let C=!1;return await bf(F,W=>{$(W),W.type==="run_finished"&&(C=!0)}),C?(A(),!0):!1}async function I(F){n("detached"),m=setInterval(async()=>{var C,W,H;try{const z=await wi(),ce=((W=(C=z==null?void 0:z.result)==null?void 0:C.run)==null?void 0:W.finished_at_utc)??null;if(ce&&ce!==F){i(k(z.result)),O(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((H=z==null?void 0:z.run_state)==null?void 0:H.status)!=="running"&&(O(),n("idle"),b("Stream lost and the run was canceled — press Run to retry."))}catch{}},Rf)}function k(F){const C=R();for(const W of(F==null?void 0:F.stages)??[])C[W.name]&&(C[W.name]={status:W.status,error:W.error});return C}async function B(){var H,z,ce;if(["starting","running","detached"].includes(e()))return;b(""),d(null),a(null),i(R()),g(null);const F=((ce=(z=(H=t())==null?void 0:H.result)==null?void 0:z.run)==null?void 0:ce.finished_at_utc)??null;n("running"),x();let C;try{C=await fa()}catch{O(),n("idle"),b("Run failed to start — network or server unreachable.");return}const W=C.headers.get("content-type")??"";if(C.ok&&W.includes("application/json")){const Z=await C.json().catch(()=>null);if(O(),n("idle"),(Z==null?void 0:Z.status)==="cached"){g(Z.age_secs),setTimeout(()=>g(null),6e3);return}}if(C.status===403&&W.includes("application/json")){const Z=await C.json().catch(()=>null);O(),n("idle"),b(Z!=null&&Z.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(Z.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(C.status===202){const Z=await ga();if(Z.ok&&(Z.headers.get("content-type")??"").includes("text/event-stream")){await N(Z)||await I(F);return}await I(F);return}if(W.includes("text/event-stream")){await N(C)||await I(F);return}O(),n("idle"),b(`Unexpected /api/run response (${C.status}, ${W||"no type"}).`)}return Fe(()=>{O(),D&&clearTimeout(D)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:u,cachedToast:h,notice:_,triggerRun:B,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{v();const F=t();return(F==null?void 0:F.run_allowed)!==!1?!0:Ds(wn(F==null?void 0:F.next_open_utc))},nextOpenUtc:()=>{var F;return((F=t())==null?void 0:F.next_open_utc)??null}}}function Of(t){const e=()=>!t.run.runAllowed(),n=()=>ys(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=vf();return i.$$click=()=>t.run.triggerRun(),c(i,r),w(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&ae(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function Df(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=$f(),s=i.firstChild,a=s.nextSibling;return c(s,n),c(a,()=>Os[t.name]),c(i,f(S,{get when(){return r()!==null},get children(){return[(()=>{var o=yf(),l=o.firstChild;return c(o,()=>t.run.batch().done,l),c(o,()=>t.run.batch().total,null),o})(),(()=>{var o=wf(),l=o.firstChild;return w(u=>at(l,"width",`${r()}%`)),o})()]}}),null),w(()=>ye(i,`run-stage ${e()}`)),i})()}function Lf(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",Y(()=>di(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",Y(()=>di(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(S,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=Af();return c(i,f(S,{get when(){return e.cachedToast()},get children(){var s=Sf(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,c(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),c(i,f(S,{get when(){return e.notice()},get children(){var s=kf();return c(s,()=>e.notice()),s}}),null),c(i,f(S,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=Ef();return c(s,r),s})(),(()=>{var s=Cf();return c(s,()=>Ns.map(a=>f(Df,{name:a,run:e}))),s})(),f(S,{get when(){return Y(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=If(),a=s.firstChild,o=a.nextSibling;return c(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var u=xf(),d=u.firstChild;return c(u,()=>l.status==="partial"?"△":"✗",d),c(u,()=>Os[l.name]??l.name,null),c(u,(()=>{var h=Y(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),u})())),s}})]}}),null),c(i,f(S,{get when(){return Y(()=>e.phase()==="running")()&&!n()},get children(){return Tf()}}),null),c(i,f(S,{get when(){return e.phase()==="detached"},get children(){return Pf()}}),null),i}})}Ce(["click"]);var Ls=p("<b>"),Mf=p("<span>Market closed · last run <b></b> ago"),Uf=p("<div class=cache-line><span></span><span class=pill>run: "),Ff=p("<span>Cached · <b></b> left"),Bf=p("<span>Stale · last run <b></b> ago"),Hf=p("<nav class=tabs role=tablist aria-label=timeframes>"),Vf=p("<button type=button role=tab class=tab>"),Wf=p("<svg><circle cx=12 cy=12 r=4></svg>",!1,!0,!1),jf=p('<svg><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></svg>',!1,!0,!1),zf=p('<button type=button class="btn-ghost theme-toggle"><svg width=14 height=14 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true>'),Gf=p('<svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></svg>',!1,!0,!1),qf=p('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),Kf=p("<div class=pop-backdrop>"),Jf=p("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),Yf=p("<div class=error-banner>API error: "),Xf=p("<div class=shell><header><div class=user-box></div><div class=theme-slot-head></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),Qf=p("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function Zf(){const[t,e]=M(zu()),n=r=>{e(r),Gu(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(Rt)}}function hi(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function eg(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function fi(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function Jn(t){return f(S,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=Ls();return c(e,()=>t.at()),e})()]}})}function tg(t){const[e,n]=M(0);vt(()=>{const _=setInterval(()=>n(b=>b+1),3e4);Fe(()=>clearInterval(_))});let r=Date.now(),i=0;st(Ot(()=>t.envelope,_=>{r=Date.now(),i=(_==null?void 0:_.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const _=Math.max(0,(t.envelope.cache_secs??0)-s());return _>=60?`${Math.floor(_/60)}m`:`${_}s`},u=()=>{var _,b;return id((b=(_=t.envelope.result)==null?void 0:_.run)==null?void 0:b.finished_at_utc)},d=()=>{e();const _=t.envelope.next_open_utc,b=wn(_);if(!(b===null||Ds(b)))return ys(_)},h=()=>o()&&a()==="stale"?"closed":a(),g=()=>a()==="fresh"||a()==="stale";return(()=>{var _=Uf(),b=_.firstChild,T=b.nextSibling;return T.firstChild,c(_,f(S,{get when(){return Y(()=>!!o())()&&g()},get fallback(){return f(S,{get when(){return a()==="fresh"},get fallback(){return f(S,{get when(){return a()==="stale"},get children(){var m=Bf(),v=m.firstChild,P=v.nextSibling;return P.nextSibling,c(P,()=>fi(s())),c(m,f(Jn,{at:u}),null),m}})},get children(){var m=Ff(),v=m.firstChild,P=v.nextSibling;return P.nextSibling,c(P,l),c(m,f(Jn,{at:u}),null),m}})},get children(){var m=Mf(),v=m.firstChild,P=v.nextSibling;return P.nextSibling,c(P,()=>fi(s())),c(m,f(Jn,{at:u}),null),c(m,f(S,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var D=Ls();return c(D,d),D})()]}}),null),m}}),b),c(b,(()=>{var m=Y(()=>h()==="closed");return()=>m()?"market closed":a()})()),c(T,()=>{var m;return((m=t.envelope.run_state)==null?void 0:m.status)??"idle"},null),w(()=>ye(b,"pill "+h())),_})()}function gi(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=Hf();return c(n,()=>e.map(r=>(()=>{var i=Vf();return i.$$click=()=>t.onTab(r.id),c(i,()=>r.label,null),c(i,(()=>{var s=Y(()=>!r.holdings);return()=>s()&&` (${Nt(eg(t.result,r.id))})`})(),null),w(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&ae(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function ng(){const[t,e]=M(null),n=()=>window.matchMedia("(prefers-color-scheme: dark)").matches,r=()=>t()??(n()?"dark":"light"),i=()=>{const a=r()==="dark"?"light":"dark";document.documentElement.dataset.theme=a,e(a)},s=()=>r()==="dark"?"Switch to light theme":"Switch to dark theme";return(()=>{var a=zf(),o=a.firstChild;return a.$$click=i,c(o,f(S,{get when(){return r()==="dark"},get fallback(){return Gf()},get children(){return[Wf(),jf()]}})),w(l=>{var u=s(),d=s();return u!==l.e&&ae(a,"aria-label",l.e=u),d!==l.t&&ae(a,"title",l.t=d),l},{e:void 0,t:void 0}),a})()}function rg(){const[t,e]=M(void 0),[n,{refetch:r}]=Gs(t,v=>v?wi():void 0);vt(()=>{if(!$t){e(null);return}const v=Zl(ft(),e);Fe(v)});const[i,s]=M(!1);st(Ot(t,v=>{s(!1),!(!v||!$t)&&ca().then(P=>s(P.status===403)).catch(()=>{})})),vt(()=>{const v=()=>r();window.addEventListener("webapp:refresh-latest",v),Fe(()=>window.removeEventListener("webapp:refresh-latest",v))});const a=()=>{var v,P;return((v=t())==null?void 0:v.email)||((P=t())==null?void 0:P.uid)||""},[o,l]=M(!1),[u,d]=M(!1),h=Zf(),[g,_]=M("short"),b=()=>g()==="holdings",T=Vu(),m=Nf(()=>n());return f(S,{get when(){return t()},get fallback(){return f(Cu,{})},get children(){return[f(S,{get when(){return!i()},get fallback(){return f(Eu,{get email(){return a()},onSignOut:()=>ri()})},get children(){var v=Xf(),P=v.firstChild,D=P.firstChild,R=D.nextSibling,O=R.nextSibling,x=O.nextSibling;return c(D,f(S,{get when(){return t()},get children(){return[(()=>{var $=qf(),A=$.firstChild,N=A.nextSibling;return $.$$click=()=>l(!o()),c(N,a),w(()=>ae($,"aria-expanded",o())),$})(),f(S,{get when(){return o()},get children(){return[(()=>{var $=Kf();return $.$$click=()=>l(!1),$})(),(()=>{var $=Jf(),A=$.firstChild,N=A.nextSibling,I=N.nextSibling,k=I.nextSibling;return c(N,a),I.$$click=()=>{l(!1),d(!0)},k.$$click=()=>{l(!1),ri()},$})()]}})]}})),c(R,f(ng,{})),c(P,f(S,{get when(){return Y(()=>!n.loading)()&&!n.error},get children(){return f(tg,{get envelope(){return n()}})}}),x),c(x,f(Of,{run:m})),c(v,f(S,{get when(){return n.error},get children(){var $=Yf();return $.firstChild,c($,()=>n.error.message,null),$}}),null),c(v,f(Lf,{run:m}),null),c(v,f(S,{get when(){return b()},get children(){return[f(gi,{result:()=>{var $;return($=n())==null?void 0:$.result},tab:g,onTab:_}),f(_f,{})]}}),null),c(v,f(S,{get when(){return!b()},get children(){return f(S,{get when(){var $;return Y(()=>!n.loading)()&&(($=n())==null?void 0:$.result)},get fallback(){return f(S,{get when(){return!n.loading},get children(){return Qf()}})},children:$=>{const A=()=>$();return[f(ju,{scoring:T}),f(gi,{result:A,tab:g,onTab:_}),f(ci,{id:"short",active:()=>g()==="short",get tf(){var N;return(N=A().timeframes)==null?void 0:N.short},get stageError(){return hi(A(),"chains_short")},get stages(){return A().stages},get thresholds(){return A().thresholds},columns:h,scoring:T}),f(ci,{id:"medium",active:()=>g()==="medium",get tf(){var N;return(N=A().timeframes)==null?void 0:N.medium},get stageError(){return hi(A(),"chains_medium")},get stages(){return A().stages},get thresholds(){return A().thresholds},columns:h,scoring:T})]}})}}),null),v}}),f(S,{get when(){return u()},get children(){return f(Ru,{onClose:()=>d(!1)})}})]}})}Ce(["click"]);sa(()=>f(rg,{}),document.getElementById("root"));
