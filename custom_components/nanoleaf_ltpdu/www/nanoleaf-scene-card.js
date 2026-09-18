var Mt=Object.defineProperty;var Ht=Object.getOwnPropertyDescriptor;var m=(r,t,e,s)=>{for(var i=s>1?void 0:s?Ht(t,e):t,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Mt(t,e,i),i};var I=globalThis,D=I.ShadowRoot&&(I.ShadyCSS===void 0||I.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),at=new WeakMap,M=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(D&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=at.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&at.set(e,t))}return t}toString(){return this.cssText}},lt=r=>new M(typeof r=="string"?r:r+"",void 0,V),K=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new M(e,r,V)},ct=(r,t)=>{if(D)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=I.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},J=D?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return lt(e)})(r):r;var{is:Tt,defineProperty:Lt,getOwnPropertyDescriptor:Ut,getOwnPropertyNames:Ot,getOwnPropertySymbols:kt,getPrototypeOf:Nt}=Object,j=globalThis,ht=j.trustedTypes,It=ht?ht.emptyScript:"",Dt=j.reactiveElementPolyfillSupport,H=(r,t)=>r,T={toAttribute(r,t){switch(t){case Boolean:r=r?It:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},q=(r,t)=>!Tt(r,t),pt={attribute:!0,type:String,converter:T,reflect:!1,useDefault:!1,hasChanged:q};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=pt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Lt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=Ut(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let l=i?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??pt}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;let t=Nt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){let e=this.properties,s=[...Ot(e),...kt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(J(i))}else t!==void 0&&e.push(J(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ct(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:T).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:T;this._$Em=i;let l=n.fromAttribute(e,o.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??q)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:n}=o,l=this[i];n!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[H("elementProperties")]=new Map,v[H("finalized")]=new Map,Dt?.({ReactiveElement:v}),(j.reactiveElementVersions??=[]).push("2.1.2");var et=globalThis,dt=r=>r,z=et.trustedTypes,ut=z?z.createPolicy("lit-html",{createHTML:r=>r}):void 0,$t="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,vt="?"+S,jt=`<${vt}>`,E=document,U=()=>E.createComment(""),O=r=>r===null||typeof r!="object"&&typeof r!="function",st=Array.isArray,qt=r=>st(r)||typeof r?.[Symbol.iterator]=="function",Z=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mt=/-->/g,_t=/>/g,A=RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ft=/'/g,gt=/"/g,bt=/^(?:script|style|textarea|title)$/i,it=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),u=it(1),ee=it(2),se=it(3),C=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),yt=new WeakMap,x=E.createTreeWalker(E,129);function St(r,t){if(!st(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ut!==void 0?ut.createHTML(t):t}var zt=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=L;for(let l=0;l<e;l++){let a=r[l],c,d,p=-1,_=0;for(;_<a.length&&(n.lastIndex=_,d=n.exec(a),d!==null);)_=n.lastIndex,n===L?d[1]==="!--"?n=mt:d[1]!==void 0?n=_t:d[2]!==void 0?(bt.test(d[2])&&(i=RegExp("</"+d[2],"g")),n=A):d[3]!==void 0&&(n=A):n===A?d[0]===">"?(n=i??L,p=-1):d[1]===void 0?p=-2:(p=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?A:d[3]==='"'?gt:ft):n===gt||n===ft?n=A:n===mt||n===_t?n=L:(n=A,i=void 0);let y=n===A&&r[l+1].startsWith("/>")?" ":"";o+=n===L?a+jt:p>=0?(s.push(c),a.slice(0,p)+$t+a.slice(p)+S+y):a+S+(p===-2?l:y)}return[St(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},k=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,l=t.length-1,a=this.parts,[c,d]=zt(t,e);if(this.el=r.createElement(c,s),x.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=x.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith($t)){let _=d[n++],y=i.getAttribute(p).split(S),b=/([.?@])?(.*)/.exec(_);a.push({type:1,index:o,name:b[2],strings:y,ctor:b[1]==="."?Q:b[1]==="?"?X:b[1]==="@"?Y:P}),i.removeAttribute(p)}else p.startsWith(S)&&(a.push({type:6,index:o}),i.removeAttribute(p));if(bt.test(i.tagName)){let p=i.textContent.split(S),_=p.length-1;if(_>0){i.textContent=z?z.emptyScript:"";for(let y=0;y<_;y++)i.append(p[y],U()),x.nextNode(),a.push({type:2,index:++o});i.append(p[_],U())}}}else if(i.nodeType===8)if(i.data===vt)a.push({type:2,index:o});else{let p=-1;for(;(p=i.data.indexOf(S,p+1))!==-1;)a.push({type:7,index:o}),p+=S.length-1}o++}}static createElement(t,e){let s=E.createElement("template");return s.innerHTML=t,s}};function w(r,t,e=r,s){if(t===C)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=O(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=w(r,i._$AS(r,t.values),i,s)),t}var G=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??E).importNode(e,!0);x.currentNode=i;let o=x.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new N(o,o.nextSibling,this,t):a.type===1?c=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(c=new tt(o,this,t)),this._$AV.push(c),a=s[++l]}n!==a?.index&&(o=x.nextNode(),n++)}return x.currentNode=E,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},N=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),O(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==C&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):qt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=k.createElement(St(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new G(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=yt.get(t.strings);return e===void 0&&yt.set(t.strings,e=new k(t)),e}k(t){st(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(U()),this.O(U()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=dt(t).nextSibling;dt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},P=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=w(this,t,e,0),n=!O(t)||t!==this._$AH&&t!==C,n&&(this._$AH=t);else{let l=t,a,c;for(t=o[0],a=0;a<o.length-1;a++)c=w(this,l[s+a],e,a),c===C&&(c=this._$AH[a]),n||=!O(c)||c!==this._$AH[a],c===h?t=h:t!==h&&(t+=(c??"")+o[a+1]),this._$AH[a]=c}n&&!i&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Q=class extends P{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},X=class extends P{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},Y=class extends P{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=w(this,t,e,0)??h)===C)return;let s=this._$AH,i=t===h&&s!==h||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},tt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}};var Bt=et.litHtmlPolyfillSupport;Bt?.(k,N),(et.litHtmlVersions??=[]).push("3.3.3");var At=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new N(t.insertBefore(U(),o),o,void 0,e??{})}return i._$AI(r),i};var rt=globalThis,$=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=At(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};$._$litElement$=!0,$.finalized=!0,rt.litElementHydrateSupport?.({LitElement:$});var Ft=rt.litElementPolyfillSupport;Ft?.({LitElement:$});(rt.litElementVersions??=[]).push("4.2.2");var B=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};var Wt={attribute:!0,type:String,converter:T,reflect:!1,hasChanged:q},Vt=(r=Wt,t,e)=>{let{kind:s,metadata:i}=e,o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),o.set(e.name,r),s==="accessor"){let{name:n}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,r,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,r,l),l}}}if(s==="setter"){let{name:n}=e;return function(l){let a=this[n];t.call(this,l),this.requestUpdate(n,a,r,!0,l)}}throw Error("Unsupported decorator location: "+s)};function F(r){return(t,e)=>typeof e=="object"?Vt(r,t,e):((s,i,o)=>{let n=i.hasOwnProperty(o);return i.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(i,o):void 0})(r,t,e)}function g(r){return F({...r,state:!0,attribute:!1})}var Kt="nanoleaf_ltpdu";async function xt(r,t,e={},s){return(await r.connection.sendMessagePromise({type:"call_service",domain:Kt,service:t,service_data:e,...s?{target:s}:{},return_response:!0})).response}function Et(r){return xt(r,"get_scene_capabilities")}function Ct(r){return xt(r,"get_scene_library")}function ot(r,t){return(r.motion_styles[t]?.param_fields??[]).map(s=>[s,r.field_ranges[s]])}function nt(r){return r.charAt(0).toUpperCase()+r.slice(1).toLowerCase()}function wt({hue:r,saturation:t,brightness:e}){let s=t/100,i=e/100,o=i*s,n=(r%360+360)%360/60,l=o*(1-Math.abs(n%2-1)),[a,c,d]=[0,0,0];n<1?[a,c,d]=[o,l,0]:n<2?[a,c,d]=[l,o,0]:n<3?[a,c,d]=[0,o,l]:n<4?[a,c,d]=[0,l,o]:n<5?[a,c,d]=[l,0,o]:[a,c,d]=[o,0,l];let p=i-o,_=b=>Math.round((b+p)*255),y=b=>_(b).toString(16).padStart(2,"0");return`#${y(a)}${y(c)}${y(d)}`}function Pt(r){let t=parseInt(r.slice(1,3),16)/255,e=parseInt(r.slice(3,5),16)/255,s=parseInt(r.slice(5,7),16)/255,i=Math.max(t,e,s),o=Math.min(t,e,s),n=i-o,l=0;n!==0&&(i===t?l=60*((e-s)/n%6):i===e?l=60*((s-t)/n+2):l=60*((t-e)/n+4)),l<0&&(l+=360);let a=i===0?0:n/i,c=i;return{hue:Math.round(l),saturation:Math.round(a*100),brightness:Math.round(c*100)}}var R=class extends ${setConfig(t){this._config=t}render(){return!this.hass||!this._config?h:u`
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this._config.entity??""}
        .includeDomains=${["light"]}
        label="Entity"
        allow-custom-entity
        @value-changed=${this._entityChanged}
      ></ha-entity-picker>
    `}_entityChanged(t){let e={...this._config,entity:t.detail.value};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}};m([F({attribute:!1})],R.prototype,"hass",2),m([g()],R.prototype,"_config",2),R=m([B("nanoleaf-scene-card-editor")],R);var Rt="nanoleaf_ltpdu",Jt="Northern Lights";function Zt(r){return r.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}var f=class extends ${constructor(){super(...arguments);this._locallyDeleted=new Set;this._editorParams={};this._editorColors=[];this._loadStarted=!1}static getStubConfig(){return{type:"custom:nanoleaf-scene-card",entity:""}}static getConfigElement(){return document.createElement("nanoleaf-scene-card-editor")}setConfig(e){if(!e.entity)throw new Error("nanoleaf-scene-card requires an `entity`");this._config=e}getCardSize(){return 6}set hass(e){this._hass=e,this._loadStarted||(this._loadStarted=!0,this._loadCapabilitiesAndLibrary()),this.requestUpdate()}get hass(){return this._hass}async _loadCapabilitiesAndLibrary(){if(this._hass)try{let[e,s]=await Promise.all([Et(this._hass),Ct(this._hass)]);this._capabilities=e,this._library=s,this._resetEditor()}catch(e){this._loadError=e instanceof Error?e.message:String(e)}}_defaultParamsForStyle(e){let s={};for(let[i,o]of ot(this._capabilities,e))s[i]=Math.round((o.min+o.max)/2);return s}_resetEditor(){if(!this._capabilities)return;let e=Object.keys(this._capabilities.motion_styles)[0];this._editorStyle=e,this._editorParams=this._defaultParamsForStyle(e),this._editorColors=[{hue:0,saturation:100,brightness:100}]}_loadRecipeIntoEditor(e){let s=this._library?.recipes[e];s&&(this._editorStyle=nt(s.motion_style),this._editorParams={...s.motion_params},this._editorColors=s.colors.map(i=>({...i})))}_onStyleSelect(e){this._editorStyle=e,this._editorParams=this._defaultParamsForStyle(e)}_onParamInput(e,s){this._editorParams={...this._editorParams,[e]:s}}_onColorInput(e,s){let i=[...this._editorColors];i[e]=Pt(s),this._editorColors=i}_addColorSlot(){let e=this._capabilities?.color_slots.max??7;this._editorColors.length>=e||(this._editorColors=[...this._editorColors,{hue:0,saturation:100,brightness:100}])}_removeColorSlot(e){let s=this._capabilities?.color_slots.min??1;this._editorColors.length<=s||(this._editorColors=this._editorColors.filter((i,o)=>o!==e))}_captureSnapshot(){let e=this._config.entity,s=this._hass.states[e];s&&(this._preSnapshot={on:s.state==="on",effect:s.attributes.effect,hsColor:s.attributes.hs_color,brightness:s.attributes.brightness})}async _previewNow(){if(!this._hass||!this._editorStyle)return;this._preSnapshot||this._captureSnapshot();let e=this._config.entity;try{await this._hass.callService(Rt,"preview_scene",{motion_style:this._editorStyle.toLowerCase(),motion_params:this._editorParams,colors:this._editorColors},{entity_id:e}),this._previewError=void 0}catch(s){this._previewError=s instanceof Error?s.message:String(s)}}async _cancelPreview(){let e=this._preSnapshot;if(!e||!this._hass)return;let s=this._config.entity;try{if(!e.on)await this._hass.callService("light","turn_off",{entity_id:s});else if(e.effect)await this._hass.callService("light","turn_on",{entity_id:s,effect:e.effect});else{let i={entity_id:s};e.hsColor&&(i.hs_color=e.hsColor),e.brightness!==void 0&&(i.brightness=e.brightness),await this._hass.callService("light","turn_on",i)}this._preSnapshot=void 0,this._previewError=void 0}catch(i){this._previewError=i instanceof Error?i.message:String(i)}}async _activateScene(e){let s=this._config.entity;await this._hass.callService("light","turn_on",{entity_id:s,effect:e})}async _deleteScene(e){let s=this._config.entity;this._locallyDeleted=new Set(this._locallyDeleted).add(e);try{await this._hass.callService(Rt,"delete_scene",{name:e},{entity_id:s})}catch(i){let o=new Set(this._locallyDeleted);o.delete(e),this._locallyDeleted=o,this._loadError=i instanceof Error?i.message:String(i)}}_savedSceneNames(){let e=this._config?.entity;return((e?this._hass?.states[e]:void 0)?.attributes.effect_list??[]).filter(o=>!this._locallyDeleted.has(o))}render(){if(!this._config||!this._hass)return h;let e=this._config.entity,s=this._hass.states[e],i=this._savedSceneNames(),o=this._library?Object.keys(this._library.recipes):[];return u`
      <ha-card header="Nanoleaf Scene Editor">
        <div class="content">
          ${s?h:u`<p class="error">Entity not found: ${e}</p>`}
          ${this._loadError?u`<p class="error">${this._loadError}</p>`:h}
          ${!this._capabilities&&!this._loadError?u`<p>Loading…</p>`:h}

          <h3>Saved on this device</h3>
          ${i.length===0?u`<p class="muted">No scenes saved yet.</p>`:u`
                <ul class="scene-list">
                  ${i.map(n=>u`
                      <li>
                        <button class="scene-name" @click=${()=>this._activateScene(n)}>${n}</button>
                        ${n===Jt?h:u`<button class="delete" @click=${()=>this._deleteScene(n)}>✕</button>`}
                      </li>
                    `)}
                </ul>
              `}

          <h3>Scene library</h3>
          ${o.length===0?u`<p class="muted">No scene recipes saved anywhere yet.</p>`:u`
                <ul class="scene-list">
                  ${o.map(n=>{let l=this._library.recipes[n],a=i.includes(n);return u`
                      <li>
                        <span class="scene-name">${n}</span>
                        <span class="muted">(${nt(l.motion_style)}${a?" \xB7 on this device":""})</span>
                        <button class="load" @click=${()=>this._loadRecipeIntoEditor(n)}>Load into editor</button>
                      </li>
                    `})}
                </ul>
              `}

          ${this._capabilities?this._renderEditor():h}
        </div>
      </ha-card>
    `}_renderEditor(){let e=this._capabilities,s=Object.keys(e.motion_styles),i=this._editorStyle?ot(e,this._editorStyle):[],o=e.color_slots.max,n=e.color_slots.min;return u`
      <h3>
        Scene editor
        <button class="load" @click=${()=>this._resetEditor()}>New scene</button>
      </h3>
      ${this._previewError?u`<p class="error">${this._previewError}</p>`:h}

      <label class="field">
        <span>Motion style</span>
        <select @change=${l=>this._onStyleSelect(l.target.value)}>
          ${s.map(l=>u`<option value=${l} ?selected=${l===this._editorStyle}>${l}</option>`)}
        </select>
      </label>

      ${i.map(([l,a])=>{let c=this._editorParams[l]??a.min,d=a.max-a.min===1,p=e.field_notes[l];return u`
          <label class="field">
            <span>${Zt(l)}${p?u`<span class="muted"> — ${p}</span>`:h}</span>
            ${d?u`<input
                  type="checkbox"
                  .checked=${c===a.max}
                  @change=${_=>this._onParamInput(l,_.target.checked?a.max:a.min)}
                />`:u`
                  <input
                    type="range"
                    min=${a.min}
                    max=${a.max}
                    .value=${String(c)}
                    @input=${_=>this._onParamInput(l,Number(_.target.value))}
                  />
                  <span class="value">${c}</span>
                `}
          </label>
        `})}

      <div class="colors">
        <span>Colors</span>
        <div class="color-slots">
          ${this._editorColors.map((l,a)=>u`
              <span class="color-slot">
                <input
                  type="color"
                  .value=${wt(l)}
                  @input=${c=>this._onColorInput(a,c.target.value)}
                />
                ${this._editorColors.length>n?u`<button class="delete" @click=${()=>this._removeColorSlot(a)}>✕</button>`:h}
              </span>
            `)}
          ${this._editorColors.length<o?u`<button class="add-color" @click=${()=>this._addColorSlot()}>+</button>`:h}
        </div>
      </div>

      <button class="preview" @click=${()=>this._previewNow()}>Preview</button>
      ${this._preSnapshot?u`<button class="cancel" @click=${()=>this._cancelPreview()}>Cancel preview</button>`:h}
    `}};f.styles=K`
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
  `,m([g()],f.prototype,"_config",2),m([g()],f.prototype,"_capabilities",2),m([g()],f.prototype,"_library",2),m([g()],f.prototype,"_loadError",2),m([g()],f.prototype,"_locallyDeleted",2),m([g()],f.prototype,"_editorStyle",2),m([g()],f.prototype,"_editorParams",2),m([g()],f.prototype,"_editorColors",2),m([g()],f.prototype,"_previewError",2),m([g()],f.prototype,"_preSnapshot",2),f=m([B("nanoleaf-scene-card")],f);window.customCards??=[];window.customCards.push({type:"nanoleaf-scene-card",name:"Nanoleaf Scene Editor",description:"Create, preview, and manage Nanoleaf LTPDU scenes."});export{f as NanoleafSceneCard};
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
