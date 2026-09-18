var Ct=Object.defineProperty;var xt=Object.getOwnPropertyDescriptor;var A=(r,t,e,s)=>{for(var i=s>1?void 0:s?xt(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Ct(t,e,i),i};var D=globalThis,k=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),st=new WeakMap,P=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(k&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=st.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&st.set(e,t))}return t}toString(){return this.cssText}},it=r=>new P(typeof r=="string"?r:r+"",void 0,B),W=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new P(e,r,B)},rt=(r,t)=>{if(k)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},V=k?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return it(e)})(r):r;var{is:wt,defineProperty:Pt,getOwnPropertyDescriptor:Rt,getOwnPropertyNames:Ut,getOwnPropertySymbols:Ot,getPrototypeOf:Mt}=Object,j=globalThis,nt=j.trustedTypes,Ht=nt?nt.emptyScript:"",Tt=j.reactiveElementPolyfillSupport,R=(r,t)=>r,U={toAttribute(r,t){switch(t){case Boolean:r=r?Ht:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},q=(r,t)=>!wt(r,t),ot={attribute:!0,type:String,converter:U,reflect:!1,useDefault:!1,hasChanged:q};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ot){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Pt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=Rt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let c=i?.call(this);n?.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ot}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let t=Mt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let e=this.properties,s=[...Ut(e),...Ot(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(V(i))}else t!==void 0&&e.push(V(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:U).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:U;this._$Em=i;let c=o.fromAttribute(e,n.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let o=this.constructor;if(i===!1&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??q)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,c=this[i];o!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,n,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[R("elementProperties")]=new Map,_[R("finalized")]=new Map,Tt?.({ReactiveElement:_}),(j.reactiveElementVersions??=[]).push("2.1.2");var X=globalThis,at=r=>r,I=X.trustedTypes,ct=I?I.createPolicy("lit-html",{createHTML:r=>r}):void 0,ft="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,mt="?"+$,Nt=`<${mt}>`,S=document,M=()=>S.createComment(""),H=r=>r===null||typeof r!="object"&&typeof r!="function",Y=Array.isArray,Lt=r=>Y(r)||typeof r?.[Symbol.iterator]=="function",F=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,lt=/-->/g,ht=/>/g,v=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),dt=/'/g,pt=/"/g,_t=/^(?:script|style|textarea|title)$/i,tt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),u=tt(1),Gt=tt(2),Qt=tt(3),E=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ut=new WeakMap,b=S.createTreeWalker(S,129);function gt(r,t){if(!Y(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ct!==void 0?ct.createHTML(t):t}var Dt=(r,t)=>{let e=r.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=O;for(let c=0;c<e;c++){let a=r[c],d,p,l=-1,m=0;for(;m<a.length&&(o.lastIndex=m,p=o.exec(a),p!==null);)m=o.lastIndex,o===O?p[1]==="!--"?o=lt:p[1]!==void 0?o=ht:p[2]!==void 0?(_t.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=v):p[3]!==void 0&&(o=v):o===v?p[0]===">"?(o=i??O,l=-1):p[1]===void 0?l=-2:(l=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?v:p[3]==='"'?pt:dt):o===pt||o===dt?o=v:o===lt||o===ht?o=O:(o=v,i=void 0);let g=o===v&&r[c+1].startsWith("/>")?" ":"";n+=o===O?a+Nt:l>=0?(s.push(d),a.slice(0,l)+ft+a.slice(l)+$+g):a+$+(l===-2?c:g)}return[gt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},T=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0,c=t.length-1,a=this.parts,[d,p]=Dt(t,e);if(this.el=r.createElement(d,s),b.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(i=b.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let l of i.getAttributeNames())if(l.endsWith(ft)){let m=p[o++],g=i.getAttribute(l).split($),L=/([.?@])?(.*)/.exec(m);a.push({type:1,index:n,name:L[2],strings:g,ctor:L[1]==="."?J:L[1]==="?"?Z:L[1]==="@"?G:x}),i.removeAttribute(l)}else l.startsWith($)&&(a.push({type:6,index:n}),i.removeAttribute(l));if(_t.test(i.tagName)){let l=i.textContent.split($),m=l.length-1;if(m>0){i.textContent=I?I.emptyScript:"";for(let g=0;g<m;g++)i.append(l[g],M()),b.nextNode(),a.push({type:2,index:++n});i.append(l[m],M())}}}else if(i.nodeType===8)if(i.data===mt)a.push({type:2,index:n});else{let l=-1;for(;(l=i.data.indexOf($,l+1))!==-1;)a.push({type:7,index:n}),l+=$.length-1}n++}}static createElement(t,e){let s=S.createElement("template");return s.innerHTML=t,s}};function C(r,t,e=r,s){if(t===E)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=H(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=C(r,i._$AS(r,t.values),i,s)),t}var K=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??S).importNode(e,!0);b.currentNode=i;let n=b.nextNode(),o=0,c=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new N(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Q(n,this,t)),this._$AV.push(d),a=s[++c]}o!==a?.index&&(n=b.nextNode(),o++)}return b.currentNode=S,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},N=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),H(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Lt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=T.createElement(gt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new K(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=ut.get(t.strings);return e===void 0&&ut.set(t.strings,e=new T(t)),e}k(t){Y(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new r(this.O(M()),this.O(M()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=at(t).nextSibling;at(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},x=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(t,e=this,s,i){let n=this.strings,o=!1;if(n===void 0)t=C(this,t,e,0),o=!H(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{let c=t,a,d;for(t=n[0],a=0;a<n.length-1;a++)d=C(this,c[s+a],e,a),d===E&&(d=this._$AH[a]),o||=!H(d)||d!==this._$AH[a],d===h?t=h:t!==h&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},J=class extends x{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},Z=class extends x{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},G=class extends x{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??h)===E)return;let s=this._$AH,i=t===h&&s!==h||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Q=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}};var kt=X.litHtmlPolyfillSupport;kt?.(T,N),(X.litHtmlVersions??=[]).push("3.3.3");var $t=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new N(t.insertBefore(M(),n),n,void 0,e??{})}return i._$AI(r),i};var et=globalThis,y=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$t(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};y._$litElement$=!0,y.finalized=!0,et.litElementHydrateSupport?.({LitElement:y});var jt=et.litElementPolyfillSupport;jt?.({LitElement:y});(et.litElementVersions??=[]).push("4.2.2");var yt=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};var qt={attribute:!0,type:String,converter:U,reflect:!1,hasChanged:q},It=(r=qt,t,e)=>{let{kind:s,metadata:i}=e,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),s==="accessor"){let{name:o}=e;return{set(c){let a=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,a,r,!0,c)},init(c){return c!==void 0&&this.C(o,void 0,r,c),c}}}if(s==="setter"){let{name:o}=e;return function(c){let a=this[o];t.call(this,c),this.requestUpdate(o,a,r,!0,c)}}throw Error("Unsupported decorator location: "+s)};function At(r){return(t,e)=>typeof e=="object"?It(r,t,e):((s,i,n)=>{let o=i.hasOwnProperty(n);return i.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}function w(r){return At({...r,state:!0,attribute:!1})}var zt="nanoleaf_ltpdu";async function vt(r,t,e={},s){return(await r.connection.sendMessagePromise({type:"call_service",domain:zt,service:t,service_data:e,...s?{target:s}:{},return_response:!0})).response}function bt(r){return vt(r,"get_scene_capabilities")}function St(r){return vt(r,"get_scene_library")}function Et(r){return r.charAt(0).toUpperCase()+r.slice(1).toLowerCase()}var Bt="nanoleaf_ltpdu",Wt="Northern Lights",f=class extends y{constructor(){super(...arguments);this._locallyDeleted=new Set;this._loadStarted=!1}static getStubConfig(){return{type:"custom:nanoleaf-scene-card",entity:""}}setConfig(e){if(!e.entity)throw new Error("nanoleaf-scene-card requires an `entity`");this._config=e}getCardSize(){return 6}set hass(e){this._hass=e,this._loadStarted||(this._loadStarted=!0,this._loadCapabilitiesAndLibrary()),this.requestUpdate()}get hass(){return this._hass}async _loadCapabilitiesAndLibrary(){if(this._hass)try{let[e,s]=await Promise.all([bt(this._hass),St(this._hass)]);this._capabilities=e,this._library=s}catch(e){this._loadError=e instanceof Error?e.message:String(e)}}async _activateScene(e){let s=this._config.entity;await this._hass.callService("light","turn_on",{entity_id:s,effect:e})}async _deleteScene(e){let s=this._config.entity;this._locallyDeleted=new Set(this._locallyDeleted).add(e);try{await this._hass.callService(Bt,"delete_scene",{name:e},{entity_id:s})}catch(i){let n=new Set(this._locallyDeleted);n.delete(e),this._locallyDeleted=n,this._loadError=i instanceof Error?i.message:String(i)}}_savedSceneNames(){let e=this._config?.entity;return((e?this._hass?.states[e]:void 0)?.attributes.effect_list??[]).filter(n=>!this._locallyDeleted.has(n))}render(){if(!this._config||!this._hass)return h;let e=this._config.entity,s=this._hass.states[e],i=this._savedSceneNames(),n=this._library?Object.keys(this._library.recipes):[];return u`
      <ha-card header="Nanoleaf Scene Editor">
        <div class="content">
          ${s?h:u`<p class="error">Entity not found: ${e}</p>`}
          ${this._loadError?u`<p class="error">${this._loadError}</p>`:h}
          ${!this._capabilities&&!this._loadError?u`<p>Loading…</p>`:h}

          <h3>Saved on this device</h3>
          ${i.length===0?u`<p class="muted">No scenes saved yet.</p>`:u`
                <ul class="scene-list">
                  ${i.map(o=>u`
                      <li>
                        <button class="scene-name" @click=${()=>this._activateScene(o)}>${o}</button>
                        ${o===Wt?h:u`<button class="delete" @click=${()=>this._deleteScene(o)}>✕</button>`}
                      </li>
                    `)}
                </ul>
              `}

          <h3>Scene library</h3>
          ${n.length===0?u`<p class="muted">No scene recipes saved anywhere yet.</p>`:u`
                <ul class="scene-list">
                  ${n.map(o=>{let c=this._library.recipes[o],a=i.includes(o);return u`
                      <li>
                        <span class="scene-name">${o}</span>
                        <span class="muted">(${Et(c.motion_style)}${a?" \xB7 on this device":""})</span>
                      </li>
                    `})}
                </ul>
              `}
        </div>
      </ha-card>
    `}};f.styles=W`
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
  `,A([w()],f.prototype,"_config",2),A([w()],f.prototype,"_capabilities",2),A([w()],f.prototype,"_library",2),A([w()],f.prototype,"_loadError",2),A([w()],f.prototype,"_locallyDeleted",2),f=A([yt("nanoleaf-scene-card")],f);window.customCards??=[];window.customCards.push({type:"nanoleaf-scene-card",name:"Nanoleaf Scene Editor",description:"Create, preview, and manage Nanoleaf LTPDU scenes."});export{f as NanoleafSceneCard};
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
