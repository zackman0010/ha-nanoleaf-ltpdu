var Ze=Object.defineProperty;var et=Object.getOwnPropertyDescriptor;var p=(r,t,e,s)=>{for(var i=s>1?void 0:s?et(t,e):t,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Ze(t,e,i),i};var G=globalThis,V=G.ShadowRoot&&(G.ShadyCSS===void 0||G.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ce=Symbol(),Se=new WeakMap,D=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(V&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=Se.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Se.set(e,t))}return t}toString(){return this.cssText}},Ae=r=>new D(typeof r=="string"?r:r+"",void 0,ce),C=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new D(e,r,ce)},Ee=(r,t)=>{if(V)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=G.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},le=V?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return Ae(e)})(r):r;var{is:tt,defineProperty:st,getOwnPropertyDescriptor:it,getOwnPropertyNames:rt,getOwnPropertySymbols:ot,getPrototypeOf:nt}=Object,W=globalThis,xe=W.trustedTypes,at=xe?xe.emptyScript:"",ct=W.reactiveElementPolyfillSupport,U=(r,t)=>r,O={toAttribute(r,t){switch(t){case Boolean:r=r?at:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},J=(r,t)=>!tt(r,t),Ce={attribute:!0,type:String,converter:O,reflect:!1,useDefault:!1,hasChanged:J};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ce){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&st(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=it(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let c=i?.call(this);o?.call(this,n),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ce}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;let t=nt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){let e=this.properties,s=[...rt(e),...ot(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(le(i))}else t!==void 0&&e.push(le(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ee(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:O).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:O;this._$Em=i;let c=n.fromAttribute(e,o.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??J)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:n}=o,c=this[i];n!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,o,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[U("elementProperties")]=new Map,S[U("finalized")]=new Map,ct?.({ReactiveElement:S}),(W.reactiveElementVersions??=[]).push("2.1.2");var he=globalThis,we=r=>r,K=he.trustedTypes,Re=K?K.createPolicy("lit-html",{createHTML:r=>r}):void 0,pe="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,ue="?"+A,lt=`<${ue}>`,T=document,j=()=>T.createComment(""),z=r=>r===null||typeof r!="object"&&typeof r!="function",_e=Array.isArray,He=r=>_e(r)||typeof r?.[Symbol.iterator]=="function",de=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Te=/-->/g,Pe=/>/g,w=RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Me=/'/g,Ie=/"/g,Le=/^(?:script|style|textarea|title)$/i,me=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),l=me(1),Rt=me(2),Tt=me(3),P=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ke=new WeakMap,R=T.createTreeWalker(T,129);function De(r,t){if(!_e(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Re!==void 0?Re.createHTML(t):t}var Ue=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=N;for(let c=0;c<e;c++){let a=r[c],d,u,_=-1,g=0;for(;g<a.length&&(n.lastIndex=g,u=n.exec(a),u!==null);)g=n.lastIndex,n===N?u[1]==="!--"?n=Te:u[1]!==void 0?n=Pe:u[2]!==void 0?(Le.test(u[2])&&(i=RegExp("</"+u[2],"g")),n=w):u[3]!==void 0&&(n=w):n===w?u[0]===">"?(n=i??N,_=-1):u[1]===void 0?_=-2:(_=n.lastIndex-u[2].length,d=u[1],n=u[3]===void 0?w:u[3]==='"'?Ie:Me):n===Ie||n===Me?n=w:n===Te||n===Pe?n=N:(n=w,i=void 0);let f=n===w&&r[c+1].startsWith("/>")?" ":"";o+=n===N?a+lt:_>=0?(s.push(d),a.slice(0,_)+pe+a.slice(_)+A+f):a+A+(_===-2?c:f)}return[De(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},F=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,c=t.length-1,a=this.parts,[d,u]=Ue(t,e);if(this.el=r.createElement(d,s),R.currentNode=this.el.content,e===2||e===3){let _=this.el.content.firstChild;_.replaceWith(..._.childNodes)}for(;(i=R.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let _ of i.getAttributeNames())if(_.endsWith(pe)){let g=u[n++],f=i.getAttribute(_).split(A),E=/([.?@])?(.*)/.exec(g);a.push({type:1,index:o,name:E[2],strings:f,ctor:E[1]==="."?Y:E[1]==="?"?X:E[1]==="@"?Z:I}),i.removeAttribute(_)}else _.startsWith(A)&&(a.push({type:6,index:o}),i.removeAttribute(_));if(Le.test(i.tagName)){let _=i.textContent.split(A),g=_.length-1;if(g>0){i.textContent=K?K.emptyScript:"";for(let f=0;f<g;f++)i.append(_[f],j()),R.nextNode(),a.push({type:2,index:++o});i.append(_[g],j())}}}else if(i.nodeType===8)if(i.data===ue)a.push({type:2,index:o});else{let _=-1;for(;(_=i.data.indexOf(A,_+1))!==-1;)a.push({type:7,index:o}),_+=A.length-1}o++}}static createElement(t,e){let s=T.createElement("template");return s.innerHTML=t,s}};function M(r,t,e=r,s){if(t===P)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=z(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=M(r,i._$AS(r,t.values),i,s)),t}var Q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??T).importNode(e,!0);R.currentNode=i;let o=R.nextNode(),n=0,c=0,a=s[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new k(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new ee(o,this,t)),this._$AV.push(d),a=s[++c]}n!==a?.index&&(o=R.nextNode(),n++)}return R.currentNode=T,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},k=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=M(this,t,e),z(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==P&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):He(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=F.createElement(De(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new Q(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=ke.get(t.strings);return e===void 0&&ke.set(t.strings,e=new F(t)),e}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(j()),this.O(j()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=we(t).nextSibling;we(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},I=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=M(this,t,e,0),n=!z(t)||t!==this._$AH&&t!==P,n&&(this._$AH=t);else{let c=t,a,d;for(t=o[0],a=0;a<o.length-1;a++)d=M(this,c[s+a],e,a),d===P&&(d=this._$AH[a]),n||=!z(d)||d!==this._$AH[a],d===h?t=h:t!==h&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}n&&!i&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Y=class extends I{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},X=class extends I{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},Z=class extends I{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=M(this,t,e,0)??h)===P)return;let s=this._$AH,i=t===h&&s!==h||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ee=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}},Oe={M:pe,P:A,A:ue,C:1,L:Ue,R:Q,D:He,V:M,I:k,H:I,N:X,U:Z,B:Y,F:ee},dt=he.litHtmlPolyfillSupport;dt?.(F,k),(he.litHtmlVersions??=[]).push("3.3.3");var Ne=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new k(t.insertBefore(j(),o),o,void 0,e??{})}return i._$AI(r),i};var fe=globalThis,$=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ne(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};$._$litElement$=!0,$.finalized=!0,fe.litElementHydrateSupport?.({LitElement:$});var ht=fe.litElementPolyfillSupport;ht?.({LitElement:$});(fe.litElementVersions??=[]).push("4.2.2");var H=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};var pt={attribute:!0,type:String,converter:O,reflect:!1,hasChanged:J},ut=(r=pt,t,e)=>{let{kind:s,metadata:i}=e,o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),o.set(e.name,r),s==="accessor"){let{name:n}=e;return{set(c){let a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,r,!0,c)},init(c){return c!==void 0&&this.C(n,void 0,r,c),c}}}if(s==="setter"){let{name:n}=e;return function(c){let a=this[n];t.call(this,c),this.requestUpdate(n,a,r,!0,c)}}throw Error("Unsupported decorator location: "+s)};function L(r){return(t,e)=>typeof e=="object"?ut(r,t,e):((s,i,o)=>{let n=i.hasOwnProperty(o);return i.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(i,o):void 0})(r,t,e)}function m(r){return L({...r,state:!0,attribute:!1})}var{I:fs}=Oe;var je=r=>r.strings===void 0;var ze={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ve=r=>(...t)=>({_$litDirective$:r,values:t}),se=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var q=(r,t)=>{let e=r._$AN;if(e===void 0)return!1;for(let s of e)s._$AO?.(t,!1),q(s,t);return!0},ie=r=>{let t,e;do{if((t=r._$AM)===void 0)break;e=t._$AN,e.delete(r),r=t}while(e?.size===0)},Fe=r=>{for(let t;t=r._$AM;r=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(r))break;e.add(r),ft(t)}};function _t(r){this._$AN!==void 0?(ie(this),this._$AM=r,Fe(this)):this._$AM=r}function mt(r,t=!1,e=0){let s=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(s))for(let o=e;o<s.length;o++)q(s[o],!1),ie(s[o]);else s!=null&&(q(s,!1),ie(s));else q(this,r)}var ft=r=>{r.type==ze.CHILD&&(r._$AP??=mt,r._$AQ??=_t)},re=class extends se{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,s){super._$AT(t,e,s),Fe(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(q(this,t),ie(this))}setValue(t){if(je(this._$Ct))this._$Ct._$AI(t,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var qe=()=>new ye,ye=class{},ge=new WeakMap,Be=ve(class extends re{render(r){return h}update(r,[t]){let e=t!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=t,this.ht=r.options?.host,this.rt(this.ct=r.element)),h}rt(r){if(this.G!==void 0)if(this.isConnected||(r=void 0),typeof this.G=="function"){let t=this.ht??globalThis,e=ge.get(t);e===void 0&&(e=new WeakMap,ge.set(t,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,r),r!==void 0&&this.G.call(this.ht,r)}else this.G.value=r}get lt(){return typeof this.G=="function"?ge.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var vt="nanoleaf_ltpdu";async function oe(r,t,e={},s){return(await r.connection.sendMessagePromise({type:"call_service",domain:vt,service:t,service_data:e,...s?{target:s}:{},return_response:!0})).response}function Ge(r){return oe(r,"get_scene_capabilities")}function Ve(r){return oe(r,"get_scene_library")}function We(r){return oe(r,"list_strips")}function Je(r,t){return oe(r,"list_device_scenes",{},{entity_id:t})}function $e(r,t){return(r.motion_styles[t]?.param_fields??[]).map(s=>[s,r.field_ranges[s]])}function ne(r){return r.charAt(0).toUpperCase()+r.slice(1).toLowerCase()}function b(r){if(r instanceof Error||r&&typeof r=="object"&&"message"in r&&typeof r.message=="string")return r.message;try{return JSON.stringify(r)}catch{return String(r)}}function B({hue:r,saturation:t,brightness:e}){let s=t/100,i=e/100,o=i*s,n=(r%360+360)%360/60,c=o*(1-Math.abs(n%2-1)),[a,d,u]=[0,0,0];n<1?[a,d,u]=[o,c,0]:n<2?[a,d,u]=[c,o,0]:n<3?[a,d,u]=[0,o,c]:n<4?[a,d,u]=[0,c,o]:n<5?[a,d,u]=[c,0,o]:[a,d,u]=[o,0,c];let _=i-o,g=E=>Math.round((E+_)*255),f=E=>g(E).toString(16).padStart(2,"0");return`#${f(a)}${f(d)}${f(u)}`}function Ke(r){let t=parseInt(r.slice(1,3),16)/255,e=parseInt(r.slice(3,5),16)/255,s=parseInt(r.slice(5,7),16)/255,i=Math.max(t,e,s),o=Math.min(t,e,s),n=i-o,c=0;n!==0&&(i===t?c=60*((e-s)/n%6):i===e?c=60*((s-t)/n+2):c=60*((t-e)/n+4)),c<0&&(c+=360);let a=i===0?0:n/i,d=i;return{hue:Math.round(c),saturation:Math.round(a*100),brightness:Math.round(d*100)}}var gt=16;function ae(r){return(r.speed??24)/10*1e3}function Qe(r){return(r.delay??0)/10*1e3}function yt(r,t){if(r.length<=1||Math.random()*100<t)return r[0];let e=r.slice(1);return e[Math.floor(Math.random()*e.length)]}var x=class extends ${constructor(){super(...arguments);this.params={};this.colors=[];this._startedAt=0;this._segmentEls=[];this._fadeIndex=0;this._colorAdvanceAt=0;this._tick=()=>{this._animate(performance.now()),this._rafId=requestAnimationFrame(this._tick)}}connectedCallback(){super.connectedCallback(),this._startedAt=performance.now(),this._tick()}disconnectedCallback(){super.disconnectedCallback(),this._rafId!==void 0&&cancelAnimationFrame(this._rafId)}updated(){if(this._renderedStyle!==this.motionStyle){this._renderedStyle=this.motionStyle,this._segmentEls=Array.from(this.shadowRoot?.querySelectorAll(".segment")??[]);let e=performance.now();this._startedAt=e,this._fadeIndex=0,this._currentColor=void 0,this._colorAdvanceAt=e}}_animate(e){if(this.colors.length)switch(this.motionStyle){case"Fade":this._animateFade(e);break;case"Random":this._animateScatter(e,0);break;case"Highlight":this._animateScatter(e,this.params.first_colour_frequency??50);break;case"Flow":this._animateGradientScroll(e,!1);break;case"Stripes":this._animateGradientScroll(e,!0);break}}_applyColorToAllSegments(e){let s=B(e);for(let i of this._segmentEls)i.style.transitionDuration=`${ae(this.params)}ms`,i.style.backgroundColor=s}_animateFade(e){e>=this._colorAdvanceAt&&(this._fadeIndex=(this._fadeIndex+1)%this.colors.length,this._colorAdvanceAt=e+ae(this.params)+Qe(this.params)),this._applyColorToAllSegments(this.colors[this._fadeIndex])}_animateScatter(e,s){(e>=this._colorAdvanceAt||!this._currentColor)&&(this._currentColor=yt(this.colors,s),this._colorAdvanceAt=e+ae(this.params)+Qe(this.params)),this._applyColorToAllSegments(this._currentColor)}_animateGradientScroll(e,s){let i=this._segmentEls[0];if(!i)return;let o=this.colors.map(f=>B(f)),n=s?this._hardStops(o):this._softStops(o);i.style.backgroundImage=`linear-gradient(90deg, ${n})`;let c=s?this._stripeRepeats():1;i.style.backgroundRepeat="repeat",i.style.backgroundSize=`${o.length*100/c}% 100%`;let a=(this.params.direction??0)===0?-1:1,d=ae(this.params)*o.length,_=(e-this._startedAt)%d/d,g=a*_*100;i.style.backgroundPositionX=`${g}%`}_stripeRepeats(){let e=this.params.segment??50;return Math.max(1,Math.round(1+(100-e)/100*6))}_softStops(e){return[...e,e[0]].join(", ")}_hardStops(e){let s=100/e.length,i=[];return e.forEach((o,n)=>{let c=n*s,a=c+s;i.push(`${o} ${c}%`,`${o} ${a}%`)}),i.join(", ")}render(){return this.motionStyle==="Flow"||this.motionStyle==="Stripes"?l`<div class="preview-strip"><div class="segment gradient"></div></div>`:l`
          <div class="preview-strip">
            ${Array.from({length:gt},()=>l`<div class="segment"></div>`)}
          </div>
        `}};x.styles=C`
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
  `,p([L({attribute:!1})],x.prototype,"motionStyle",2),p([L({attribute:!1})],x.prototype,"params",2),p([L({attribute:!1})],x.prototype,"colors",2),x=p([H("nanoleaf-motion-preview")],x);var be="nanoleaf_ltpdu",Ye="Northern Lights",$t={Fade:{speed:24,delay:0,loop:1},Random:{speed:24,delay:0},Highlight:{speed:24,delay:15,first_colour_frequency:80},Flow:{speed:24,delay:0,direction:1,loop:1},Stripes:{speed:24,direction:1,segment:50}};function bt(r){return r.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}var v=class extends ${constructor(){super(...arguments);this._editorParams={};this._editorColors=[];this._editorName="";this._saveTarget="strip";this._saving=!1;this._loadStarted=!1}static getStubConfig(){return{type:"custom:nanoleaf-scene-card",entity:""}}setConfig(e){if(!e.entity)throw new Error("nanoleaf-scene-card requires an `entity`");this._config=e}getCardSize(){return 6}set hass(e){this._hass=e,this._loadStarted||(this._loadStarted=!0,this._loadCapabilities()),this.requestUpdate()}get hass(){return this._hass}async _loadCapabilities(){if(this._hass)try{this._capabilities=await Ge(this._hass),this._resetEditor()}catch(e){this._loadError=b(e)}}_defaultParamsForStyle(e){let s={},i=$t[e]??{};for(let[o,n]of $e(this._capabilities,e))s[o]=o in i?i[o]:Math.round((n.min+n.max)/2);return s}_resetEditor(){if(!this._capabilities)return;let e=Object.keys(this._capabilities.motion_styles)[0];this._editorStyle=e,this._editorParams=this._defaultParamsForStyle(e),this._editorColors=[{hue:0,saturation:100,brightness:100}],this._editorName="",this._saveTarget="strip",this._saveSceneId=void 0,this._saveError=void 0}loadRecipe(e){this._editorStyle=e.motionStyle,this._editorParams={...e.motionParams},this._editorColors=e.colors.map(s=>({...s})),this._editorName=e.name,this._saveTarget=e.sceneId!=null?"strip":"library",this._saveSceneId=e.sceneId,this._saveError=void 0}_onNameInput(e){this._editorName=e}_onSaveTargetSelect(e){this._saveTarget=e==="library"?"library":"strip"}_onSceneIdInput(e){this._saveSceneId=e===""?void 0:Number(e)}_onStyleSelect(e){this._editorStyle=e,this._editorParams=this._defaultParamsForStyle(e)}_onParamInput(e,s){this._editorParams={...this._editorParams,[e]:s}}_onColorInput(e,s){let i=[...this._editorColors];i[e]=Ke(s),this._editorColors=i}_addColorSlot(){let e=this._capabilities?.color_slots.max??7;this._editorColors.length>=e||(this._editorColors=[...this._editorColors,{hue:0,saturation:100,brightness:100}])}_removeColorSlot(e){let s=this._capabilities?.color_slots.min??1;this._editorColors.length<=s||(this._editorColors=this._editorColors.filter((i,o)=>o!==e))}_captureSnapshot(){let e=this._config.entity,s=this._hass.states[e];s&&(this._preSnapshot={on:s.state==="on",effect:s.attributes.effect,hsColor:s.attributes.hs_color,brightness:s.attributes.brightness})}async _previewNow(){if(!this._hass||!this._editorStyle)return;this._preSnapshot||this._captureSnapshot();let e=this._config.entity;try{await this._hass.callService(be,"preview_scene",{motion_style:this._editorStyle.toLowerCase(),motion_params:this._editorParams,colors:this._editorColors},{entity_id:e}),this._previewError=void 0}catch(s){this._previewError=b(s)}}async _cancelPreview(){let e=this._preSnapshot;if(!e||!this._hass)return;let s=this._config.entity;try{if(!e.on)await this._hass.callService("light","turn_off",{entity_id:s});else if(e.effect)await this._hass.callService("light","turn_on",{entity_id:s,effect:e.effect});else{let i={entity_id:s};e.hsColor&&(i.hs_color=e.hsColor),e.brightness!==void 0&&(i.brightness=e.brightness),await this._hass.callService("light","turn_on",i)}this._preSnapshot=void 0,this._previewError=void 0}catch(i){this._previewError=b(i)}}async _saveScene(){let e=this._editorName.trim();if(!this._hass||!this._editorStyle)return;if(!e){this._saveError="Enter a name for the scene.";return}if(e===Ye){this._saveError=`"${Ye}" is a reserved factory scene and can't be overwritten.`;return}let s=this._capabilities?.scene_id_range;if(this._saveTarget==="strip"&&this._saveSceneId!=null&&s&&(this._saveSceneId<s.min||this._saveSceneId>s.max)){this._saveError=`Scene ID must be between ${s.min} and ${s.max}.`;return}let i=this._editorStyle.toLowerCase();this._saving=!0;try{if(this._saveTarget==="library")await this._hass.callService(be,"save_scene_to_library",{name:e,motion_style:i,motion_params:this._editorParams,colors:this._editorColors});else{let o=this._config.entity,n={name:e,motion_style:i,motion_params:this._editorParams,colors:this._editorColors};this._saveSceneId!=null&&(n.scene_id=this._saveSceneId),await this._hass.callService(be,"save_scene",n,{entity_id:o})}this._saveError=void 0,this.dispatchEvent(new CustomEvent("scene-saved",{detail:{target:this._saveTarget,name:e,entityId:this._config.entity,recipe:{motion_style:i,motion_params:{...this._editorParams},colors:this._editorColors.map(o=>({...o}))}}}))}catch(o){this._saveError=b(o)}finally{this._saving=!1}}render(){if(!this._config||!this._hass)return h;let e=this._config.entity,s=this._hass.states[e];return l`
      <ha-card header="Nanoleaf Scene Editor">
        <div class="content">
          ${s?h:l`<p class="error">Entity not found: ${e}</p>`}
          ${this._loadError?l`<p class="error">${this._loadError}</p>`:h}
          ${!this._capabilities&&!this._loadError?l`<p>Loading…</p>`:h}
          ${this._capabilities?this._renderEditor():h}
        </div>
      </ha-card>
    `}_renderEditor(){let e=this._capabilities,s=Object.keys(e.motion_styles),i=this._editorStyle?$e(e,this._editorStyle):[],o=e.color_slots.max,n=e.color_slots.min,c=e.scene_id_range;return l`
      <h3>
        Scene editor
        <button class="load" @click=${()=>this._resetEditor()}>New scene</button>
      </h3>
      ${this._previewError?l`<p class="error">${this._previewError}</p>`:h}

      <label class="field">
        <span>Motion style</span>
        <select @change=${a=>this._onStyleSelect(a.target.value)}>
          ${s.map(a=>l`<option value=${a} ?selected=${a===this._editorStyle}>${a}</option>`)}
        </select>
      </label>

      ${i.map(([a,d])=>{let u=this._editorParams[a]??d.min,_=d.max-d.min===1,g=e.field_notes[a];return l`
          <label class="field">
            <span>${bt(a)}${g?l`<span class="muted"> — ${g}</span>`:h}</span>
            ${_?l`<input
                  type="checkbox"
                  .checked=${u===d.max}
                  @change=${f=>this._onParamInput(a,f.target.checked?d.max:d.min)}
                />`:l`
                  <input
                    type="range"
                    min=${d.min}
                    max=${d.max}
                    .value=${String(u)}
                    @input=${f=>this._onParamInput(a,Number(f.target.value))}
                  />
                  <span class="value">${u}</span>
                `}
          </label>
        `})}

      <div class="colors">
        <span>Colors</span>
        <div class="color-slots">
          ${this._editorColors.map((a,d)=>l`
              <span class="color-slot">
                <input
                  type="color"
                  .value=${B(a)}
                  @input=${u=>this._onColorInput(d,u.target.value)}
                />
                ${this._editorColors.length>n?l`<button class="delete" @click=${()=>this._removeColorSlot(d)}>✕</button>`:h}
              </span>
            `)}
          ${this._editorColors.length<o?l`<button class="add-color" @click=${()=>this._addColorSlot()}>+</button>`:h}
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
      ${this._preSnapshot?l`<button class="cancel" @click=${()=>this._cancelPreview()}>Cancel preview</button>`:h}

      <label class="field">
        <span>Save to</span>
        <select @change=${a=>this._onSaveTargetSelect(a.target.value)}>
          <option value="strip" ?selected=${this._saveTarget==="strip"}>Strip</option>
          <option value="library" ?selected=${this._saveTarget==="library"}>Library</option>
        </select>
      </label>
      ${this._saveTarget==="strip"?l`
            <label class="field">
              <span>Scene ID<span class="muted"> — leave blank to auto-assign</span></span>
              <input
                type="number"
                min=${c.min}
                max=${c.max}
                placeholder="auto"
                .value=${this._saveSceneId!=null?String(this._saveSceneId):""}
                @input=${a=>this._onSceneIdInput(a.target.value)}
              />
            </label>
          `:h}
      <label class="field name-field">
        <span>Name</span>
        <input
          type="text"
          .value=${this._editorName}
          placeholder="Scene name"
          @input=${a=>this._onNameInput(a.target.value)}
        />
      </label>
      ${this._saveError?l`<p class="error">${this._saveError}</p>`:h}
      <button class="save" ?disabled=${this._saving} @click=${()=>this._saveScene()}>
        ${this._saving?"Saving\u2026":"Save"}
      </button>
    `}};v.styles=C`
    .content {
      padding: 0 16px 16px;
    }
    h3 {
      margin: 16px 0 8px;
      font-size: 1em;
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
    .field input[type="number"] {
      flex: 1;
      background: none;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      color: var(--primary-text-color);
      padding: 4px 8px;
    }
    .field select {
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
    .delete {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      cursor: pointer;
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
  `,p([m()],v.prototype,"_config",2),p([m()],v.prototype,"_capabilities",2),p([m()],v.prototype,"_loadError",2),p([m()],v.prototype,"_editorStyle",2),p([m()],v.prototype,"_editorParams",2),p([m()],v.prototype,"_editorColors",2),p([m()],v.prototype,"_editorName",2),p([m()],v.prototype,"_saveTarget",2),p([m()],v.prototype,"_saveSceneId",2),p([m()],v.prototype,"_previewError",2),p([m()],v.prototype,"_saveError",2),p([m()],v.prototype,"_saving",2),p([m()],v.prototype,"_preSnapshot",2),v=p([H("nanoleaf-scene-card")],v);var St="nanoleaf_ltpdu",Xe="Northern Lights",y=class extends ${constructor(){super(...arguments);this._deviceScenes={};this._refreshing=!1;this._locallySaved={};this._locallyDeleted={};this._loadStarted=!1;this._cardRef=qe()}set hass(e){this._hass=e,this._loadStarted||(this._loadStarted=!0,this._loadStripsAndLibrary()),this.requestUpdate()}get hass(){return this._hass}async _loadStripsAndLibrary(){if(this._hass)try{let[{strips:e},s]=await Promise.all([We(this._hass),Ve(this._hass)]);this._strips=e,this._library=s;let i=Object.keys(e);i.length===1&&(this._selected=i[0])}catch(e){this._loadError=b(e)}}_onSelect(e){this._selected=e||void 0,this._refreshError=void 0,this._actionError=void 0,this._loadIntoEditorError=void 0}updated(){let e=this._cardRef.value;!e||!this._selected||!this._hass||(e.hass=this._hass,this._cardConfiguredFor!==this._selected&&(e.setConfig({type:"custom:nanoleaf-scene-card",entity:this._selected}),this._cardConfiguredFor=this._selected))}_knownSceneNames(e){let i=this._hass?.states[e]?.attributes.effect_list??[],o=new Set([...i,...this._locallySaved[e]??[]]);for(let n of this._locallyDeleted[e]??[])o.delete(n);return[...o]}async _refreshFromStrip(){if(!this._hass||!this._selected)return;let e=this._selected;this._refreshing=!0,this._refreshError=void 0;try{let s=await Je(this._hass,e);this._deviceScenes={...this._deviceScenes,[e]:s}}catch(s){this._refreshError=b(s)}finally{this._refreshing=!1}}async _activateScene(e,s){if(this._hass)try{await this._hass.callService("light","turn_on",{entity_id:e,effect:s}),this._actionError=void 0}catch(i){this._actionError=b(i)}}async _deleteScene(e,s){if(!this._hass)return;let i=new Set(this._locallyDeleted[e]??[]);this._locallyDeleted={...this._locallyDeleted,[e]:new Set(i).add(s)};let o=new Set(this._locallySaved[e]??[]),n=new Set(o);n.delete(s),this._locallySaved={...this._locallySaved,[e]:n};try{await this._hass.callService(St,"delete_scene",{name:s},{entity_id:e}),this._actionError=void 0,this._invalidateDeviceScenes(e)}catch(c){this._locallyDeleted={...this._locallyDeleted,[e]:i},this._locallySaved={...this._locallySaved,[e]:o},this._actionError=b(c)}}_loadRowIntoEditor(e){this._loadIntoEditorError=void 0;let s=this._selected;if(!s)return;if(e.sceneId!=null){let o=this._deviceScenes[s]?.scenes[String(e.sceneId)];if(o){this._cardRef.value?.loadRecipe({name:e.name,motionStyle:ne(o.motion_style),motionParams:o.motion_params,colors:o.colors,sceneId:e.sceneId});return}}let i=this._library?.recipes[e.name];if(i){this._loadLibraryRecipeIntoEditor(e.name,i);return}this._loadIntoEditorError=`Refresh from strip to load "${e.name}" into the editor.`}_renderStripPanel(){let e=this._selected;if(!e)return l`<h2>Scenes on strip</h2><p class="muted">Select a strip.</p>`;let s=this._deviceScenes[e],i=s?Object.entries(s.scenes).map(([o,n])=>({name:n.name??`Unknown Scene ${o}`,sceneId:Number(o),deletable:n.name!=null&&n.name!==Xe})):this._knownSceneNames(e).map(o=>({name:o,deletable:o!==Xe}));return l`
      <h2>
        Scenes on strip
        <button class="load" ?disabled=${this._refreshing} @click=${()=>this._refreshFromStrip()}>
          ${this._refreshing?"Refreshing\u2026":"Refresh from strip"}
        </button>
      </h2>
      ${this._refreshError?l`<p class="error">${this._refreshError}</p>`:h}
      ${this._actionError?l`<p class="error">${this._actionError}</p>`:h}
      ${this._loadIntoEditorError?l`<p class="error">${this._loadIntoEditorError}</p>`:h}
      ${i.length===0?l`<p class="muted">No scenes saved yet.</p>`:l`
            <ul class="scene-list">
              ${i.map(o=>l`
                  <li>
                    <button class="scene-name" @click=${()=>this._loadRowIntoEditor(o)}>${o.name}</button>
                    ${o.deletable?l`
                          <button class="activate" title="Activate" @click=${()=>this._activateScene(e,o.name)}>▶</button>
                          <button class="delete" title="Delete" @click=${()=>this._deleteScene(e,o.name)}>✕</button>
                        `:h}
                  </li>
                `)}
            </ul>
          `}
    `}_loadLibraryRecipeIntoEditor(e,s){this._cardRef.value?.loadRecipe({name:e,motionStyle:ne(s.motion_style),motionParams:s.motion_params,colors:s.colors})}_renderLibraryPanel(){let e=this._library?Object.keys(this._library.recipes):[];return l`
      <h2>Scene library</h2>
      ${e.length===0?l`<p class="muted">No scene recipes saved anywhere yet.</p>`:l`
            <ul class="scene-list">
              ${e.map(s=>{let i=this._library.recipes[s];return l`
                  <li>
                    <button class="scene-name" @click=${()=>this._loadLibraryRecipeIntoEditor(s,i)}>${s}</button>
                    <span class="muted">(${ne(i.motion_style)})</span>
                  </li>
                `})}
            </ul>
          `}
    `}_invalidateDeviceScenes(e){if(!(e in this._deviceScenes))return;let s={...this._deviceScenes};delete s[e],this._deviceScenes=s}_onSceneSaved(e){let{target:s,name:i,entityId:o,recipe:n}=e.detail;if(this._library={recipes:{...this._library?.recipes,[i]:n}},s==="strip"){let c=new Set(this._locallySaved[o]??[]).add(i);this._locallySaved={...this._locallySaved,[o]:c};let a=new Set(this._locallyDeleted[o]??[]);a.delete(i),this._locallyDeleted={...this._locallyDeleted,[o]:a},this._invalidateDeviceScenes(o)}}render(){if(!this._hass)return h;if(this._loadError)return l`<div class="content"><p class="error">${this._loadError}</p></div>`;if(!this._strips)return l`<div class="content"><p>Loading…</p></div>`;let e=Object.keys(this._strips);return e.length===0?l`
        <div class="content">
          <h1>Nanoleaf Scenes</h1>
          <p class="muted">No Nanoleaf LTPDU strips configured yet. Add one under Settings → Devices & Services.</p>
        </div>
      `:l`
      <div class="content">
        <h1>Nanoleaf Scenes</h1>
        ${e.length>1?l`
              <label class="field">
                <span>Strip</span>
                <select @change=${s=>this._onSelect(s.target.value)}>
                  <option value="" ?selected=${!this._selected}>Select a strip…</option>
                  ${e.map(s=>l`<option value=${s} ?selected=${s===this._selected}>${this._strips[s].name}</option>`)}
                </select>
              </label>
            `:h}
        <div class="panels">
          <section class="panel">${this._renderStripPanel()}</section>
          <section class="panel">
            ${this._selected?l`<nanoleaf-scene-card
                  ${Be(this._cardRef)}
                  @scene-saved=${s=>this._onSceneSaved(s)}
                ></nanoleaf-scene-card>`:l`<p class="muted">Select a strip to begin.</p>`}
          </section>
          <section class="panel">${this._renderLibraryPanel()}</section>
        </div>
      </div>
    `}};y.styles=C`
    .content {
      padding: 16px;
      max-width: 1400px;
      margin: 0 auto;
    }
    h1 {
      font-size: 1.5em;
      margin: 0 0 16px;
    }
    h2 {
      font-size: 1.1em;
      margin: 0 0 8px;
    }
    .panels {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      align-items: start;
      gap: 16px;
      margin-top: 16px;
    }
    .panel {
      min-width: 0;
    }
    .field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .field select {
      flex: 1;
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
    .load:disabled {
      opacity: 0.6;
      cursor: default;
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
      flex: 1;
      overflow-wrap: anywhere;
    }
    button.scene-name:hover {
      text-decoration: underline;
    }
    .activate {
      background: none;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      margin-left: 8px;
    }
    .delete {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      cursor: pointer;
      margin-left: 4px;
    }
  `,p([m()],y.prototype,"_strips",2),p([m()],y.prototype,"_selected",2),p([m()],y.prototype,"_loadError",2),p([m()],y.prototype,"_library",2),p([m()],y.prototype,"_deviceScenes",2),p([m()],y.prototype,"_refreshing",2),p([m()],y.prototype,"_refreshError",2),p([m()],y.prototype,"_actionError",2),p([m()],y.prototype,"_loadIntoEditorError",2),p([m()],y.prototype,"_locallySaved",2),p([m()],y.prototype,"_locallyDeleted",2),y=p([H("nanoleaf-scene-panel")],y);export{y as NanoleafScenePanel};
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

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
