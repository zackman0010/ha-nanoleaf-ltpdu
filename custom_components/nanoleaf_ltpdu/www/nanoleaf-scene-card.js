var Lt=Object.defineProperty;var Ut=Object.getOwnPropertyDescriptor;var m=(r,t,e,s)=>{for(var i=s>1?void 0:s?Ut(t,e):t,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Lt(t,e,i),i};var B=globalThis,W=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),ut=new WeakMap,U=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(W&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=ut.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ut.set(e,t))}return t}toString(){return this.cssText}},mt=r=>new U(typeof r=="string"?r:r+"",void 0,X),I=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new U(e,r,X)},_t=(r,t)=>{if(W)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=B.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Y=W?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return mt(e)})(r):r;var{is:It,defineProperty:Ot,getOwnPropertyDescriptor:Nt,getOwnPropertyNames:Dt,getOwnPropertySymbols:jt,getPrototypeOf:qt}=Object,V=globalThis,ft=V.trustedTypes,Ft=ft?ft.emptyScript:"",zt=V.reactiveElementPolyfillSupport,O=(r,t)=>r,N={toAttribute(r,t){switch(t){case Boolean:r=r?Ft:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},G=(r,t)=>!It(r,t),gt={attribute:!0,type:String,converter:N,reflect:!1,useDefault:!1,hasChanged:G};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=gt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Ot(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=Nt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let a=i?.call(this);o?.call(this,n),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??gt}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=qt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,s=[...Dt(e),...jt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(Y(i))}else t!==void 0&&e.push(Y(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _t(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:N).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:N;this._$Em=i;let a=n.fromAttribute(e,o.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??G)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:n}=o,a=this[i];n!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,o,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[O("elementProperties")]=new Map,$[O("finalized")]=new Map,zt?.({ReactiveElement:$}),(V.reactiveElementVersions??=[]).push("2.1.2");var rt=globalThis,yt=r=>r,K=rt.trustedTypes,vt=K?K.createPolicy("lit-html",{createHTML:r=>r}):void 0,Et="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,Ct="?"+S,Bt=`<${Ct}>`,w=document,j=()=>w.createComment(""),q=r=>r===null||typeof r!="object"&&typeof r!="function",ot=Array.isArray,Wt=r=>ot(r)||typeof r?.[Symbol.iterator]=="function",Z=`[ 	
\f\r]`,D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bt=/-->/g,$t=/>/g,E=RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),St=/'/g,xt=/"/g,wt=/^(?:script|style|textarea|title)$/i,nt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),p=nt(1),ae=nt(2),le=nt(3),P=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),At=new WeakMap,C=w.createTreeWalker(w,129);function Pt(r,t){if(!ot(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return vt!==void 0?vt.createHTML(t):t}var Vt=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=D;for(let a=0;a<e;a++){let l=r[a],c,u,d=-1,f=0;for(;f<l.length&&(n.lastIndex=f,u=n.exec(l),u!==null);)f=n.lastIndex,n===D?u[1]==="!--"?n=bt:u[1]!==void 0?n=$t:u[2]!==void 0?(wt.test(u[2])&&(i=RegExp("</"+u[2],"g")),n=E):u[3]!==void 0&&(n=E):n===E?u[0]===">"?(n=i??D,d=-1):u[1]===void 0?d=-2:(d=n.lastIndex-u[2].length,c=u[1],n=u[3]===void 0?E:u[3]==='"'?xt:St):n===xt||n===St?n=E:n===bt||n===$t?n=D:(n=E,i=void 0);let y=n===E&&r[a+1].startsWith("/>")?" ":"";o+=n===D?l+Bt:d>=0?(s.push(c),l.slice(0,d)+Et+l.slice(d)+S+y):l+S+(d===-2?a:y)}return[Pt(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},F=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,a=t.length-1,l=this.parts,[c,u]=Vt(t,e);if(this.el=r.createElement(c,s),C.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=C.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(Et)){let f=u[n++],y=i.getAttribute(d).split(S),b=/([.?@])?(.*)/.exec(f);l.push({type:1,index:o,name:b[2],strings:y,ctor:b[1]==="."?tt:b[1]==="?"?et:b[1]==="@"?st:M}),i.removeAttribute(d)}else d.startsWith(S)&&(l.push({type:6,index:o}),i.removeAttribute(d));if(wt.test(i.tagName)){let d=i.textContent.split(S),f=d.length-1;if(f>0){i.textContent=K?K.emptyScript:"";for(let y=0;y<f;y++)i.append(d[y],j()),C.nextNode(),l.push({type:2,index:++o});i.append(d[f],j())}}}else if(i.nodeType===8)if(i.data===Ct)l.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(S,d+1))!==-1;)l.push({type:7,index:o}),d+=S.length-1}o++}}static createElement(t,e){let s=w.createElement("template");return s.innerHTML=t,s}};function R(r,t,e=r,s){if(t===P)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=q(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=R(r,i._$AS(r,t.values),i,s)),t}var Q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??w).importNode(e,!0);C.currentNode=i;let o=C.nextNode(),n=0,a=0,l=s[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new z(o,o.nextSibling,this,t):l.type===1?c=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(c=new it(o,this,t)),this._$AV.push(c),l=s[++a]}n!==l?.index&&(o=C.nextNode(),n++)}return C.currentNode=w,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},z=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=R(this,t,e),q(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==P&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Wt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&q(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=F.createElement(Pt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new Q(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=At.get(t.strings);return e===void 0&&At.set(t.strings,e=new F(t)),e}k(t){ot(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(j()),this.O(j()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=yt(t).nextSibling;yt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=R(this,t,e,0),n=!q(t)||t!==this._$AH&&t!==P,n&&(this._$AH=t);else{let a=t,l,c;for(t=o[0],l=0;l<o.length-1;l++)c=R(this,a[s+l],e,l),c===P&&(c=this._$AH[l]),n||=!q(c)||c!==this._$AH[l],c===h?t=h:t!==h&&(t+=(c??"")+o[l+1]),this._$AH[l]=c}n&&!i&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},tt=class extends M{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},et=class extends M{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},st=class extends M{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=R(this,t,e,0)??h)===P)return;let s=this._$AH,i=t===h&&s!==h||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},it=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){R(this,t)}};var Gt=rt.litHtmlPolyfillSupport;Gt?.(F,z),(rt.litHtmlVersions??=[]).push("3.3.3");var Rt=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new z(t.insertBefore(j(),o),o,void 0,e??{})}return i._$AI(r),i};var at=globalThis,v=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};v._$litElement$=!0,v.finalized=!0,at.litElementHydrateSupport?.({LitElement:v});var Kt=at.litElementPolyfillSupport;Kt?.({LitElement:v});(at.litElementVersions??=[]).push("4.2.2");var k=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};var Jt={attribute:!0,type:String,converter:N,reflect:!1,hasChanged:G},Xt=(r=Jt,t,e)=>{let{kind:s,metadata:i}=e,o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),o.set(e.name,r),s==="accessor"){let{name:n}=e;return{set(a){let l=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,l,r,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,r,a),a}}}if(s==="setter"){let{name:n}=e;return function(a){let l=this[n];t.call(this,a),this.requestUpdate(n,l,r,!0,a)}}throw Error("Unsupported decorator location: "+s)};function x(r){return(t,e)=>typeof e=="object"?Xt(r,t,e):((s,i,o)=>{let n=i.hasOwnProperty(o);return i.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(i,o):void 0})(r,t,e)}function g(r){return x({...r,state:!0,attribute:!1})}var Yt="nanoleaf_ltpdu";async function Mt(r,t,e={},s){return(await r.connection.sendMessagePromise({type:"call_service",domain:Yt,service:t,service_data:e,...s?{target:s}:{},return_response:!0})).response}function kt(r){return Mt(r,"get_scene_capabilities")}function Ht(r){return Mt(r,"get_scene_library")}function lt(r,t){return(r.motion_styles[t]?.param_fields??[]).map(s=>[s,r.field_ranges[s]])}function ct(r){return r.charAt(0).toUpperCase()+r.slice(1).toLowerCase()}function H({hue:r,saturation:t,brightness:e}){let s=t/100,i=e/100,o=i*s,n=(r%360+360)%360/60,a=o*(1-Math.abs(n%2-1)),[l,c,u]=[0,0,0];n<1?[l,c,u]=[o,a,0]:n<2?[l,c,u]=[a,o,0]:n<3?[l,c,u]=[0,o,a]:n<4?[l,c,u]=[0,a,o]:n<5?[l,c,u]=[a,0,o]:[l,c,u]=[o,0,a];let d=i-o,f=b=>Math.round((b+d)*255),y=b=>f(b).toString(16).padStart(2,"0");return`#${y(l)}${y(c)}${y(u)}`}function Tt(r){let t=parseInt(r.slice(1,3),16)/255,e=parseInt(r.slice(3,5),16)/255,s=parseInt(r.slice(5,7),16)/255,i=Math.max(t,e,s),o=Math.min(t,e,s),n=i-o,a=0;n!==0&&(i===t?a=60*((e-s)/n%6):i===e?a=60*((s-t)/n+2):a=60*((t-e)/n+4)),a<0&&(a+=360);let l=i===0?0:n/i,c=i;return{hue:Math.round(a),saturation:Math.round(l*100),brightness:Math.round(c*100)}}var Zt=16;function T(r){return(r.speed??24)/10*1e3}function ht(r){return(r.delay??0)/10*1e3}function Qt(r,t){if(r.length<=1||Math.random()*100<t)return r[0];let e=r.slice(1);return e[Math.floor(Math.random()*e.length)]}var A=class extends v{constructor(){super(...arguments);this.params={};this.colors=[];this._startedAt=0;this._segmentEls=[];this._schedule=[];this._fadeIndex=0;this._fadeAdvanceAt=0;this._tick=()=>{this._animate(performance.now()),this._rafId=requestAnimationFrame(this._tick)}}connectedCallback(){super.connectedCallback(),this._startedAt=performance.now(),this._tick()}disconnectedCallback(){super.disconnectedCallback(),this._rafId!==void 0&&cancelAnimationFrame(this._rafId)}updated(){if(this._renderedStyle!==this.motionStyle){this._renderedStyle=this.motionStyle,this._segmentEls=Array.from(this.shadowRoot?.querySelectorAll(".segment")??[]);let e=performance.now();this._startedAt=e,this._schedule=this._segmentEls.map(()=>({nextChangeAt:e+Math.random()*400})),this._fadeIndex=0,this._fadeAdvanceAt=e+T(this.params)+ht(this.params)}}_animate(e){if(this.colors.length)switch(this.motionStyle){case"Fade":this._animateFade(e);break;case"Random":this._animateScatter(e,0);break;case"Highlight":this._animateScatter(e,this.params.first_colour_frequency??50);break;case"Flow":this._animateGradientScroll(e,!1);break;case"Stripes":this._animateGradientScroll(e,!0);break}}_animateFade(e){let s=T(this.params)+ht(this.params),i=(this.params.loop??1)!==0;e>=this._fadeAdvanceAt&&((!(this._fadeIndex>=this.colors.length-1)||i)&&(this._fadeIndex=(this._fadeIndex+1)%this.colors.length),this._fadeAdvanceAt=e+s);let o=H(this.colors[this._fadeIndex]);for(let n of this._segmentEls)n.style.transitionDuration=`${T(this.params)}ms`,n.style.backgroundColor=o}_animateScatter(e,s){let i=T(this.params)+ht(this.params);this._segmentEls.forEach((o,n)=>{let a=this._schedule[n];if(!a||e<a.nextChangeAt)return;let l=Qt(this.colors,s);o.style.transitionDuration=`${T(this.params)}ms`,o.style.backgroundColor=H(l),a.nextChangeAt=e+i})}_animateGradientScroll(e,s){let i=this._segmentEls[0];if(!i)return;let o=this.colors.map(b=>H(b)),n=s?this._hardStops(o):this._softStops(o);i.style.backgroundImage=`linear-gradient(90deg, ${n})`;let a=s?this._stripeRepeats():1;i.style.backgroundRepeat=s?"repeat":"no-repeat",i.style.backgroundSize=`${o.length*100/a}% 100%`;let l=(this.params.direction??0)===0?1:-1,c=T(this.params)*o.length,u=(this.params.loop??1)!==0,d=e-this._startedAt,f=u?d%c/c:Math.min(d/c,1),y=l*f*100;i.style.backgroundPositionX=`${y}%`}_stripeRepeats(){let e=this.params.segment??50;return Math.max(1,Math.round(1+(100-e)/100*6))}_softStops(e){return[...e,e[0]].join(", ")}_hardStops(e){let s=100/e.length,i=[];return e.forEach((o,n)=>{let a=n*s,l=a+s;i.push(`${o} ${a}%`,`${o} ${l}%`)}),i.join(", ")}render(){return this.motionStyle==="Flow"||this.motionStyle==="Stripes"?p`<div class="preview-strip"><div class="segment gradient"></div></div>`:p`
          <div class="preview-strip">
            ${Array.from({length:Zt},()=>p`<div class="segment"></div>`)}
          </div>
        `}};A.styles=I`
    .preview-strip {
      display: flex;
      height: 36px;
      border-radius: 6px;
      overflow: hidden;
      margin: 8px 0;
    }
    .segment {
      flex: 1;
      background-color: #222;
      transition-property: background-color;
      transition-timing-function: linear;
    }
    .segment.gradient {
      transition-property: none;
      /* background-repeat is set per-frame in JS (Flow: no-repeat, Stripes: repeat) */
    }
  `,m([x({attribute:!1})],A.prototype,"motionStyle",2),m([x({attribute:!1})],A.prototype,"params",2),m([x({attribute:!1})],A.prototype,"colors",2),A=m([k("nanoleaf-motion-preview")],A);var L=class extends v{setConfig(t){this._config=t}render(){return!this.hass||!this._config?h:p`
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this._config.entity??""}
        .includeDomains=${["light"]}
        label="Entity"
        allow-custom-entity
        @value-changed=${this._entityChanged}
      ></ha-entity-picker>
    `}_entityChanged(t){let e={...this._config,entity:t.detail.value};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}};m([x({attribute:!1})],L.prototype,"hass",2),m([g()],L.prototype,"_config",2),L=m([k("nanoleaf-scene-card-editor")],L);var dt="nanoleaf_ltpdu",pt="Northern Lights",te={Fade:{speed:24,delay:0,loop:1},Random:{speed:24,delay:0},Highlight:{speed:24,delay:15,first_colour_frequency:80},Flow:{speed:24,delay:0,direction:1,loop:1},Stripes:{speed:24,direction:1,segment:50}};function ee(r){return r.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}var _=class extends v{constructor(){super(...arguments);this._locallyDeleted=new Set;this._locallySaved=new Set;this._editorParams={};this._editorColors=[];this._editorName="";this._saving=!1;this._loadStarted=!1}static getStubConfig(){return{type:"custom:nanoleaf-scene-card",entity:""}}static getConfigElement(){return document.createElement("nanoleaf-scene-card-editor")}setConfig(e){if(!e.entity)throw new Error("nanoleaf-scene-card requires an `entity`");this._config=e}getCardSize(){return 6}set hass(e){this._hass=e,this._loadStarted||(this._loadStarted=!0,this._loadCapabilitiesAndLibrary()),this.requestUpdate()}get hass(){return this._hass}async _loadCapabilitiesAndLibrary(){if(this._hass)try{let[e,s]=await Promise.all([kt(this._hass),Ht(this._hass)]);this._capabilities=e,this._library=s,this._resetEditor()}catch(e){this._loadError=e instanceof Error?e.message:String(e)}}_defaultParamsForStyle(e){let s={},i=te[e]??{};for(let[o,n]of lt(this._capabilities,e))s[o]=o in i?i[o]:Math.round((n.min+n.max)/2);return s}_resetEditor(){if(!this._capabilities)return;let e=Object.keys(this._capabilities.motion_styles)[0];this._editorStyle=e,this._editorParams=this._defaultParamsForStyle(e),this._editorColors=[{hue:0,saturation:100,brightness:100}],this._editorName="",this._saveError=void 0}_loadRecipeIntoEditor(e){let s=this._library?.recipes[e];s&&(this._editorStyle=ct(s.motion_style),this._editorParams={...s.motion_params},this._editorColors=s.colors.map(i=>({...i})),this._editorName=e,this._saveError=void 0)}_onNameInput(e){this._editorName=e}_onStyleSelect(e){this._editorStyle=e,this._editorParams=this._defaultParamsForStyle(e)}_onParamInput(e,s){this._editorParams={...this._editorParams,[e]:s}}_onColorInput(e,s){let i=[...this._editorColors];i[e]=Tt(s),this._editorColors=i}_addColorSlot(){let e=this._capabilities?.color_slots.max??7;this._editorColors.length>=e||(this._editorColors=[...this._editorColors,{hue:0,saturation:100,brightness:100}])}_removeColorSlot(e){let s=this._capabilities?.color_slots.min??1;this._editorColors.length<=s||(this._editorColors=this._editorColors.filter((i,o)=>o!==e))}_captureSnapshot(){let e=this._config.entity,s=this._hass.states[e];s&&(this._preSnapshot={on:s.state==="on",effect:s.attributes.effect,hsColor:s.attributes.hs_color,brightness:s.attributes.brightness})}async _previewNow(){if(!this._hass||!this._editorStyle)return;this._preSnapshot||this._captureSnapshot();let e=this._config.entity;try{await this._hass.callService(dt,"preview_scene",{motion_style:this._editorStyle.toLowerCase(),motion_params:this._editorParams,colors:this._editorColors},{entity_id:e}),this._previewError=void 0}catch(s){this._previewError=s instanceof Error?s.message:String(s)}}async _cancelPreview(){let e=this._preSnapshot;if(!e||!this._hass)return;let s=this._config.entity;try{if(!e.on)await this._hass.callService("light","turn_off",{entity_id:s});else if(e.effect)await this._hass.callService("light","turn_on",{entity_id:s,effect:e.effect});else{let i={entity_id:s};e.hsColor&&(i.hs_color=e.hsColor),e.brightness!==void 0&&(i.brightness=e.brightness),await this._hass.callService("light","turn_on",i)}this._preSnapshot=void 0,this._previewError=void 0}catch(i){this._previewError=i instanceof Error?i.message:String(i)}}async _saveScene(){let e=this._editorName.trim();if(!this._hass||!this._editorStyle)return;if(!e){this._saveError="Enter a name for the scene.";return}if(e===pt){this._saveError=`"${pt}" is a reserved factory scene and can't be overwritten.`;return}let s=this._config.entity,i=this._editorStyle.toLowerCase();this._saving=!0;try{await this._hass.callService(dt,"save_scene",{name:e,motion_style:i,motion_params:this._editorParams,colors:this._editorColors},{entity_id:s}),this._saveError=void 0,this._locallySaved=new Set(this._locallySaved).add(e);let o=new Set(this._locallyDeleted);o.delete(e),this._locallyDeleted=o,this._library={recipes:{...this._library?.recipes,[e]:{motion_style:i,motion_params:{...this._editorParams},colors:this._editorColors.map(n=>({...n}))}}}}catch(o){this._saveError=o instanceof Error?o.message:String(o)}finally{this._saving=!1}}async _activateScene(e){let s=this._config.entity;await this._hass.callService("light","turn_on",{entity_id:s,effect:e})}async _deleteScene(e){let s=this._config.entity;this._locallyDeleted=new Set(this._locallyDeleted).add(e);let i=new Set(this._locallySaved),o=new Set(this._locallySaved);o.delete(e),this._locallySaved=o;try{await this._hass.callService(dt,"delete_scene",{name:e},{entity_id:s})}catch(n){let a=new Set(this._locallyDeleted);a.delete(e),this._locallyDeleted=a,this._locallySaved=i,this._loadError=n instanceof Error?n.message:String(n)}}_savedSceneNames(){let e=this._config?.entity,i=(e?this._hass?.states[e]:void 0)?.attributes.effect_list??[],o=new Set([...i,...this._locallySaved]);for(let n of this._locallyDeleted)o.delete(n);return[...o]}render(){if(!this._config||!this._hass)return h;let e=this._config.entity,s=this._hass.states[e],i=this._savedSceneNames(),o=this._library?Object.keys(this._library.recipes):[];return p`
      <ha-card header="Nanoleaf Scene Editor">
        <div class="content">
          ${s?h:p`<p class="error">Entity not found: ${e}</p>`}
          ${this._loadError?p`<p class="error">${this._loadError}</p>`:h}
          ${!this._capabilities&&!this._loadError?p`<p>Loading…</p>`:h}

          <h3>Saved on this device</h3>
          ${i.length===0?p`<p class="muted">No scenes saved yet.</p>`:p`
                <ul class="scene-list">
                  ${i.map(n=>p`
                      <li>
                        <button class="scene-name" @click=${()=>this._activateScene(n)}>${n}</button>
                        ${n===pt?h:p`<button class="delete" @click=${()=>this._deleteScene(n)}>✕</button>`}
                      </li>
                    `)}
                </ul>
              `}

          <h3>Scene library</h3>
          ${o.length===0?p`<p class="muted">No scene recipes saved anywhere yet.</p>`:p`
                <ul class="scene-list">
                  ${o.map(n=>{let a=this._library.recipes[n],l=i.includes(n);return p`
                      <li>
                        <span class="scene-name">${n}</span>
                        <span class="muted">(${ct(a.motion_style)}${l?" \xB7 on this device":""})</span>
                        <button class="load" @click=${()=>this._loadRecipeIntoEditor(n)}>Load into editor</button>
                      </li>
                    `})}
                </ul>
              `}

          ${this._capabilities?this._renderEditor():h}
        </div>
      </ha-card>
    `}_renderEditor(){let e=this._capabilities,s=Object.keys(e.motion_styles),i=this._editorStyle?lt(e,this._editorStyle):[],o=e.color_slots.max,n=e.color_slots.min;return p`
      <h3>
        Scene editor
        <button class="load" @click=${()=>this._resetEditor()}>New scene</button>
      </h3>
      ${this._previewError?p`<p class="error">${this._previewError}</p>`:h}

      <label class="field">
        <span>Motion style</span>
        <select @change=${a=>this._onStyleSelect(a.target.value)}>
          ${s.map(a=>p`<option value=${a} ?selected=${a===this._editorStyle}>${a}</option>`)}
        </select>
      </label>

      ${i.map(([a,l])=>{let c=this._editorParams[a]??l.min,u=l.max-l.min===1,d=e.field_notes[a];return p`
          <label class="field">
            <span>${ee(a)}${d?p`<span class="muted"> — ${d}</span>`:h}</span>
            ${u?p`<input
                  type="checkbox"
                  .checked=${c===l.max}
                  @change=${f=>this._onParamInput(a,f.target.checked?l.max:l.min)}
                />`:p`
                  <input
                    type="range"
                    min=${l.min}
                    max=${l.max}
                    .value=${String(c)}
                    @input=${f=>this._onParamInput(a,Number(f.target.value))}
                  />
                  <span class="value">${c}</span>
                `}
          </label>
        `})}

      <div class="colors">
        <span>Colors</span>
        <div class="color-slots">
          ${this._editorColors.map((a,l)=>p`
              <span class="color-slot">
                <input
                  type="color"
                  .value=${H(a)}
                  @input=${c=>this._onColorInput(l,c.target.value)}
                />
                ${this._editorColors.length>n?p`<button class="delete" @click=${()=>this._removeColorSlot(l)}>✕</button>`:h}
              </span>
            `)}
          ${this._editorColors.length<o?p`<button class="add-color" @click=${()=>this._addColorSlot()}>+</button>`:h}
        </div>
      </div>

      <nanoleaf-motion-preview
        .motionStyle=${this._editorStyle}
        .params=${this._editorParams}
        .colors=${this._editorColors}
      ></nanoleaf-motion-preview>
      <p class="muted preview-hint">
        Simulated approximation only — press Preview below to see it on the strip.
      </p>

      <button class="preview" @click=${()=>this._previewNow()}>Preview</button>
      ${this._preSnapshot?p`<button class="cancel" @click=${()=>this._cancelPreview()}>Cancel preview</button>`:h}

      <label class="field name-field">
        <span>Name</span>
        <input
          type="text"
          .value=${this._editorName}
          placeholder="Scene name"
          @input=${a=>this._onNameInput(a.target.value)}
        />
      </label>
      ${this._saveError?p`<p class="error">${this._saveError}</p>`:h}
      <button class="save" ?disabled=${this._saving} @click=${()=>this._saveScene()}>
        ${this._saving?"Saving\u2026":"Save"}
      </button>
    `}};_.styles=I`
    .content {
      padding: 0 16px 16px;
    }
    h3 {
      margin: 16px 0 8px;
      font-size: 1em;
    }
    .scene-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .scene-list li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
    }
    .scene-name {
      background: none;
      border: none;
      color: var(--primary-text-color);
      font-size: 1em;
      text-align: left;
      cursor: pointer;
      padding: 0;
    }
    button.scene-name:hover {
      text-decoration: underline;
    }
    .delete {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      cursor: pointer;
    }
    .muted {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .preview-hint {
      margin: 0 0 8px;
    }
    .error {
      color: var(--error-color, #db4437);
    }
    .load {
      background: none;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.85em;
      padding: 2px 8px;
      margin-left: 8px;
    }
    .field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    .field > span:first-child {
      flex: 0 0 40%;
    }
    .field input[type="range"] {
      flex: 1;
    }
    .field .value {
      flex: 0 0 2.5em;
      text-align: right;
    }
    .colors {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 12px 0;
    }
    .color-slots {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
    }
    .color-slot {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
    .color-slot input[type="color"] {
      width: 32px;
      height: 32px;
      border: none;
      padding: 0;
      background: none;
    }
    .add-color {
      width: 32px;
      height: 32px;
      border: 1px dashed var(--divider-color, #ccc);
      border-radius: 4px;
      background: none;
      cursor: pointer;
      font-size: 1.2em;
      color: var(--primary-text-color);
    }
    .preview {
      margin-top: 8px;
      border: none;
      border-radius: 4px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      padding: 8px 16px;
      cursor: pointer;
    }
    .cancel {
      margin-top: 8px;
      margin-left: 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: none;
      color: var(--primary-text-color);
      padding: 8px 16px;
      cursor: pointer;
    }
    .name-field {
      margin-top: 16px;
    }
    .name-field input[type="text"] {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 1px solid var(--divider-color, #ccc);
      color: var(--primary-text-color);
      font-size: 1em;
      padding: 4px 0;
    }
    .save {
      margin-top: 8px;
      border: none;
      border-radius: 4px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      padding: 8px 16px;
      cursor: pointer;
    }
    .save:disabled {
      opacity: 0.6;
      cursor: default;
    }
  `,m([g()],_.prototype,"_config",2),m([g()],_.prototype,"_capabilities",2),m([g()],_.prototype,"_library",2),m([g()],_.prototype,"_loadError",2),m([g()],_.prototype,"_locallyDeleted",2),m([g()],_.prototype,"_locallySaved",2),m([g()],_.prototype,"_editorStyle",2),m([g()],_.prototype,"_editorParams",2),m([g()],_.prototype,"_editorColors",2),m([g()],_.prototype,"_editorName",2),m([g()],_.prototype,"_previewError",2),m([g()],_.prototype,"_saveError",2),m([g()],_.prototype,"_saving",2),m([g()],_.prototype,"_preSnapshot",2),_=m([k("nanoleaf-scene-card")],_);window.customCards??=[];window.customCards.push({type:"nanoleaf-scene-card",name:"Nanoleaf Scene Editor",description:"Create, preview, and manage Nanoleaf LTPDU scenes."});export{_ as NanoleafSceneCard};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
