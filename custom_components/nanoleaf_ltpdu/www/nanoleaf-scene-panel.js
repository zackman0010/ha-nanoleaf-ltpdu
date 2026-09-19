var Ze=Object.defineProperty;var et=Object.getOwnPropertyDescriptor;var u=(i,t,e,s)=>{for(var r=s>1?void 0:s?et(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Ze(t,e,r),r};var G=globalThis,V=G.ShadowRoot&&(G.ShadyCSS===void 0||G.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,le=Symbol(),Ae=new WeakMap,L=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==le)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(V&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=Ae.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ae.set(e,t))}return t}toString(){return this.cssText}},Ee=i=>new L(typeof i=="string"?i:i+"",void 0,le),C=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new L(e,i,le)},xe=(i,t)=>{if(V)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=G.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},ce=V?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return Ee(e)})(i):i;var{is:tt,defineProperty:st,getOwnPropertyDescriptor:rt,getOwnPropertyNames:it,getOwnPropertySymbols:ot,getPrototypeOf:nt}=Object,W=globalThis,Ce=W.trustedTypes,at=Ce?Ce.emptyScript:"",lt=W.reactiveElementPolyfillSupport,U=(i,t)=>i,O={toAttribute(i,t){switch(t){case Boolean:i=i?at:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},J=(i,t)=>!tt(i,t),we={attribute:!0,type:String,converter:O,reflect:!1,useDefault:!1,hasChanged:J};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=we){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&st(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:o}=rt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let l=r?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??we}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;let t=nt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){let e=this.properties,s=[...it(e),...ot(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(ce(r))}else t!==void 0&&e.push(ce(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xe(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:O).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:O;this._$Em=r;let l=n.fromAttribute(e,o.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s,r=!1,o){if(t!==void 0){let n=this.constructor;if(r===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??J)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[U("elementProperties")]=new Map,S[U("finalized")]=new Map,lt?.({ReactiveElement:S}),(W.reactiveElementVersions??=[]).push("2.1.2");var he=globalThis,Re=i=>i,K=he.trustedTypes,Te=K?K.createPolicy("lit-html",{createHTML:i=>i}):void 0,pe="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,ue="?"+A,ct=`<${ue}>`,T=document,j=()=>T.createComment(""),F=i=>i===null||typeof i!="object"&&typeof i!="function",_e=Array.isArray,He=i=>_e(i)||typeof i?.[Symbol.iterator]=="function",de=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pe=/-->/g,De=/>/g,w=RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ie=/'/g,Me=/"/g,Le=/^(?:script|style|textarea|title)$/i,me=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),h=me(1),Tt=me(2),Pt=me(3),P=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),ke=new WeakMap,R=T.createTreeWalker(T,129);function Ue(i,t){if(!_e(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Te!==void 0?Te.createHTML(t):t}var Oe=(i,t)=>{let e=i.length-1,s=[],r,o=t===2?"<svg>":t===3?"<math>":"",n=N;for(let l=0;l<e;l++){let a=i[l],d,c,_=-1,v=0;for(;v<a.length&&(n.lastIndex=v,c=n.exec(a),c!==null);)v=n.lastIndex,n===N?c[1]==="!--"?n=Pe:c[1]!==void 0?n=De:c[2]!==void 0?(Le.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=w):c[3]!==void 0&&(n=w):n===w?c[0]===">"?(n=r??N,_=-1):c[1]===void 0?_=-2:(_=n.lastIndex-c[2].length,d=c[1],n=c[3]===void 0?w:c[3]==='"'?Me:Ie):n===Me||n===Ie?n=w:n===Pe||n===De?n=N:(n=w,r=void 0);let g=n===w&&i[l+1].startsWith("/>")?" ":"";o+=n===N?a+ct:_>=0?(s.push(d),a.slice(0,_)+pe+a.slice(_)+A+g):a+A+(_===-2?l:g)}return[Ue(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},z=class i{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0,l=t.length-1,a=this.parts,[d,c]=Oe(t,e);if(this.el=i.createElement(d,s),R.currentNode=this.el.content,e===2||e===3){let _=this.el.content.firstChild;_.replaceWith(..._.childNodes)}for(;(r=R.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let _ of r.getAttributeNames())if(_.endsWith(pe)){let v=c[n++],g=r.getAttribute(_).split(A),E=/([.?@])?(.*)/.exec(v);a.push({type:1,index:o,name:E[2],strings:g,ctor:E[1]==="."?Y:E[1]==="?"?X:E[1]==="@"?Z:I}),r.removeAttribute(_)}else _.startsWith(A)&&(a.push({type:6,index:o}),r.removeAttribute(_));if(Le.test(r.tagName)){let _=r.textContent.split(A),v=_.length-1;if(v>0){r.textContent=K?K.emptyScript:"";for(let g=0;g<v;g++)r.append(_[g],j()),R.nextNode(),a.push({type:2,index:++o});r.append(_[v],j())}}}else if(r.nodeType===8)if(r.data===ue)a.push({type:2,index:o});else{let _=-1;for(;(_=r.data.indexOf(A,_+1))!==-1;)a.push({type:7,index:o}),_+=A.length-1}o++}}static createElement(t,e){let s=T.createElement("template");return s.innerHTML=t,s}};function D(i,t,e=i,s){if(t===P)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,o=F(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=D(i,r._$AS(i,t.values),r,s)),t}var Q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??T).importNode(e,!0);R.currentNode=r;let o=R.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new M(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new ee(o,this,t)),this._$AV.push(d),a=s[++l]}n!==a?.index&&(o=R.nextNode(),n++)}return R.currentNode=T,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},M=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=D(this,t,e),F(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==P&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):He(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&F(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=z.createElement(Ue(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new Q(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=ke.get(t.strings);return e===void 0&&ke.set(t.strings,e=new z(t)),e}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let o of t)r===e.length?e.push(s=new i(this.O(j()),this.O(j()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=Re(t).nextSibling;Re(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},I=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,r){let o=this.strings,n=!1;if(o===void 0)t=D(this,t,e,0),n=!F(t)||t!==this._$AH&&t!==P,n&&(this._$AH=t);else{let l=t,a,d;for(t=o[0],a=0;a<o.length-1;a++)d=D(this,l[s+a],e,a),d===P&&(d=this._$AH[a]),n||=!F(d)||d!==this._$AH[a],d===p?t=p:t!==p&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}n&&!r&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Y=class extends I{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},X=class extends I{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},Z=class extends I{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=D(this,t,e,0)??p)===P)return;let s=this._$AH,r=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ee=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){D(this,t)}},Ne={M:pe,P:A,A:ue,C:1,L:Oe,R:Q,D:He,V:D,I:M,H:I,N:X,U:Z,B:Y,F:ee},dt=he.litHtmlPolyfillSupport;dt?.(z,M),(he.litHtmlVersions??=[]).push("3.3.3");var je=(i,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let o=e?.renderBefore??null;s._$litPart$=r=new M(t.insertBefore(j(),o),o,void 0,e??{})}return r._$AI(i),r};var fe=globalThis,$=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=je(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};$._$litElement$=!0,$.finalized=!0,fe.litElementHydrateSupport?.({LitElement:$});var ht=fe.litElementPolyfillSupport;ht?.({LitElement:$});(fe.litElementVersions??=[]).push("4.2.2");var k=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var pt={attribute:!0,type:String,converter:O,reflect:!1,hasChanged:J},ut=(i=pt,t,e)=>{let{kind:s,metadata:r}=e,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){let{name:n}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){let{name:n}=e;return function(l){let a=this[n];t.call(this,l),this.requestUpdate(n,a,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function H(i){return(t,e)=>typeof e=="object"?ut(i,t,e):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}function m(i){return H({...i,state:!0,attribute:!1})}var{I:vs}=Ne;var Fe=i=>i.strings===void 0;var ze={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ve=i=>(...t)=>({_$litDirective$:i,values:t}),se=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var q=(i,t)=>{let e=i._$AN;if(e===void 0)return!1;for(let s of e)s._$AO?.(t,!1),q(s,t);return!0},re=i=>{let t,e;do{if((t=i._$AM)===void 0)break;e=t._$AN,e.delete(i),i=t}while(e?.size===0)},qe=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),ft(t)}};function _t(i){this._$AN!==void 0?(re(this),this._$AM=i,qe(this)):this._$AM=i}function mt(i,t=!1,e=0){let s=this._$AH,r=this._$AN;if(r!==void 0&&r.size!==0)if(t)if(Array.isArray(s))for(let o=e;o<s.length;o++)q(s[o],!1),re(s[o]);else s!=null&&(q(s,!1),re(s));else q(this,i)}var ft=i=>{i.type==ze.CHILD&&(i._$AP??=mt,i._$AQ??=_t)},ie=class extends se{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,s){super._$AT(t,e,s),qe(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(q(this,t),re(this))}setValue(t){if(Fe(this._$Ct))this._$Ct._$AI(t,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var Be=()=>new ye,ye=class{},ge=new WeakMap,Ge=ve(class extends ie{render(i){return p}update(i,[t]){let e=t!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=t,this.ht=i.options?.host,this.rt(this.ct=i.element)),p}rt(i){if(this.G!==void 0)if(this.isConnected||(i=void 0),typeof this.G=="function"){let t=this.ht??globalThis,e=ge.get(t);e===void 0&&(e=new WeakMap,ge.set(t,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,i),i!==void 0&&this.G.call(this.ht,i)}else this.G.value=i}get lt(){return typeof this.G=="function"?ge.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var vt="nanoleaf_ltpdu";async function oe(i,t,e={},s){return(await i.connection.sendMessagePromise({type:"call_service",domain:vt,service:t,service_data:e,...s?{target:s}:{},return_response:!0})).response}function Ve(i){return oe(i,"get_scene_capabilities")}function $e(i){return oe(i,"get_scene_library")}function We(i){return oe(i,"list_strips")}async function Je(i,t){return(await oe(i,"list_device_scenes",{},{entity_id:t}))[t]}function be(i,t){return(i.motion_styles[t]?.param_fields??[]).map(s=>[s,i.field_ranges[s]])}function ne(i){return i.charAt(0).toUpperCase()+i.slice(1).toLowerCase()}function b(i){if(i instanceof Error||i&&typeof i=="object"&&"message"in i&&typeof i.message=="string")return i.message;try{return JSON.stringify(i)}catch{return String(i)}}function B({hue:i,saturation:t,brightness:e}){let s=t/100,r=e/100,o=r*s,n=(i%360+360)%360/60,l=o*(1-Math.abs(n%2-1)),[a,d,c]=[0,0,0];n<1?[a,d,c]=[o,l,0]:n<2?[a,d,c]=[l,o,0]:n<3?[a,d,c]=[0,o,l]:n<4?[a,d,c]=[0,l,o]:n<5?[a,d,c]=[l,0,o]:[a,d,c]=[o,0,l];let _=r-o,v=E=>Math.round((E+_)*255),g=E=>v(E).toString(16).padStart(2,"0");return`#${g(a)}${g(d)}${g(c)}`}function Ke(i){let t=parseInt(i.slice(1,3),16)/255,e=parseInt(i.slice(3,5),16)/255,s=parseInt(i.slice(5,7),16)/255,r=Math.max(t,e,s),o=Math.min(t,e,s),n=r-o,l=0;n!==0&&(r===t?l=60*((e-s)/n%6):r===e?l=60*((s-t)/n+2):l=60*((t-e)/n+4)),l<0&&(l+=360);let a=r===0?0:n/r,d=r;return{hue:Math.round(l),saturation:Math.round(a*100),brightness:Math.round(d*100)}}var gt=16;function ae(i){return(i.speed??24)/10*1e3}function Qe(i){return(i.delay??0)/10*1e3}function yt(i,t){if(i.length<=1||Math.random()*100<t)return i[0];let e=i.slice(1);return e[Math.floor(Math.random()*e.length)]}var x=class extends ${constructor(){super(...arguments);this.params={};this.colors=[];this._startedAt=0;this._segmentEls=[];this._fadeIndex=0;this._colorAdvanceAt=0;this._tick=()=>{this._animate(performance.now()),this._rafId=requestAnimationFrame(this._tick)}}connectedCallback(){super.connectedCallback(),this._startedAt=performance.now(),this._tick()}disconnectedCallback(){super.disconnectedCallback(),this._rafId!==void 0&&cancelAnimationFrame(this._rafId)}updated(){if(this._renderedStyle!==this.motionStyle){this._renderedStyle=this.motionStyle,this._segmentEls=Array.from(this.shadowRoot?.querySelectorAll(".segment")??[]);let e=performance.now();this._startedAt=e,this._fadeIndex=0,this._currentColor=void 0,this._colorAdvanceAt=e}}_animate(e){if(this.colors.length)switch(this.motionStyle){case"Fade":this._animateFade(e);break;case"Random":this._animateScatter(e,0);break;case"Highlight":this._animateScatter(e,this.params.first_colour_frequency??50);break;case"Flow":this._animateGradientScroll(e,!1);break;case"Stripes":this._animateGradientScroll(e,!0);break}}_applyColorToAllSegments(e){let s=B(e);for(let r of this._segmentEls)r.style.transitionDuration=`${ae(this.params)}ms`,r.style.backgroundColor=s}_animateFade(e){e>=this._colorAdvanceAt&&(this._fadeIndex=(this._fadeIndex+1)%this.colors.length,this._colorAdvanceAt=e+ae(this.params)+Qe(this.params)),this._applyColorToAllSegments(this.colors[this._fadeIndex])}_animateScatter(e,s){(e>=this._colorAdvanceAt||!this._currentColor)&&(this._currentColor=yt(this.colors,s),this._colorAdvanceAt=e+ae(this.params)+Qe(this.params)),this._applyColorToAllSegments(this._currentColor)}_animateGradientScroll(e,s){let r=this._segmentEls[0];if(!r)return;let o=r.clientWidth;if(!o)return;let n=this.colors.map(v=>B(v)),l=s?this._hardStops(n):this._softStops(n);r.style.backgroundImage=`linear-gradient(90deg, ${l})`;let a=s?Math.max(1,(this.params.segment??50)/100*o*n.length):o;r.style.backgroundRepeat="repeat",r.style.backgroundSize=`${a}px 100%`;let d=(this.params.direction??0)===0?1:-1,c=e-this._startedAt,_=d*(c/ae(this.params))*o;r.style.backgroundPositionX=`${_}px`}_softStops(e){return e.join(", ")}_hardStops(e){let s=100/e.length,r=[];return e.forEach((o,n)=>{let l=n*s,a=l+s;r.push(`${o} ${l}%`,`${o} ${a}%`)}),r.join(", ")}render(){return this.motionStyle==="Flow"||this.motionStyle==="Stripes"?h`<div class="preview-strip"><div class="segment gradient"></div></div>`:h`
          <div class="preview-strip">
            ${Array.from({length:gt},()=>h`<div class="segment"></div>`)}
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
      /* background-image/size/repeat/position are all set per-frame in JS */
    }
  `,u([H({attribute:!1})],x.prototype,"motionStyle",2),u([H({attribute:!1})],x.prototype,"params",2),u([H({attribute:!1})],x.prototype,"colors",2),x=u([k("nanoleaf-motion-preview")],x);var Se="nanoleaf_ltpdu",Ye="Northern Lights",$t={Fade:{speed:24,delay:0,loop:1},Random:{speed:24,delay:0},Highlight:{speed:24,delay:15,first_colour_frequency:80},Flow:{speed:24,delay:0,direction:1,loop:1},Stripes:{speed:24,direction:1,segment:50}};function bt(i){return i.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function St(i,t){return i==="speed"||i==="delay"?`${(t/10).toFixed(1)}s`:String(t)}var f=class extends ${constructor(){super(...arguments);this._editorParams={};this._editorColors=[];this._editorName="";this._saveTarget="strip";this._saving=!1;this._loadStarted=!1}static getStubConfig(){return{type:"custom:nanoleaf-scene-card",entity:""}}setConfig(e){if(!e.entity)throw new Error("nanoleaf-scene-card requires an `entity`");this._config=e}getCardSize(){return 6}set hass(e){this._hass=e,this._loadStarted||(this._loadStarted=!0,this._loadCapabilities()),this.requestUpdate()}get hass(){return this._hass}async _loadCapabilities(){if(this._hass)try{this._capabilities=await Ve(this._hass),this._resetEditor()}catch(e){this._loadError=b(e)}}_defaultParamsForStyle(e){let s={},r=$t[e]??{};for(let[o,n]of be(this._capabilities,e))s[o]=o in r?r[o]:Math.round((n.min+n.max)/2);return s}_resetEditor(){if(!this._capabilities)return;let e=Object.keys(this._capabilities.motion_styles)[0];this._editorStyle=e,this._editorParams=this._defaultParamsForStyle(e),this._editorColors=[{hue:0,saturation:100,brightness:100}],this._editorName="",this._saveTarget="strip",this._saveSceneId=void 0,this._saveError=void 0}loadRecipe(e){this._editorStyle=e.motionStyle,this._editorParams={...e.motionParams},this._editorColors=e.colors.map(s=>({...s})),this._editorName=e.name,this._saveTarget=e.sceneId!=null?"strip":"library",this._saveSceneId=e.sceneId,this._saveError=void 0}_onNameInput(e){this._editorName=e}_onSaveTargetSelect(e){this._saveTarget=e==="library"?"library":"strip"}_onSceneIdInput(e){this._saveSceneId=e===""?void 0:Number(e)}_onStyleSelect(e){this._editorStyle=e,this._editorParams=this._defaultParamsForStyle(e)}_onParamInput(e,s){this._editorParams={...this._editorParams,[e]:s}}_onColorInput(e,s){let r=[...this._editorColors];r[e]=Ke(s),this._editorColors=r}_addColorSlot(){let e=this._capabilities?.color_slots.max??7;this._editorColors.length>=e||(this._editorColors=[...this._editorColors,{hue:0,saturation:100,brightness:100}])}_removeColorSlot(e){let s=this._capabilities?.color_slots.min??1;this._editorColors.length<=s||(this._editorColors=this._editorColors.filter((r,o)=>o!==e))}_onColorDragStart(e,s){this._colorDragFromIndex=s,e.dataTransfer?.setData("text/plain",String(s)),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}_onColorDrop(e,s){e.preventDefault();let r=this._colorDragFromIndex;if(this._colorDragFromIndex=void 0,r==null||r===s)return;let o=[...this._editorColors],[n]=o.splice(r,1);o.splice(s,0,n),this._editorColors=o}_captureSnapshot(){let e=this._config.entity,s=this._hass.states[e];s&&(this._preSnapshot={on:s.state==="on",effect:s.attributes.effect,hsColor:s.attributes.hs_color,brightness:s.attributes.brightness})}async _previewNow(){if(!this._hass||!this._editorStyle)return;this._preSnapshot||this._captureSnapshot();let e=this._config.entity;try{await this._hass.callService(Se,"preview_scene",{motion_style:this._editorStyle.toLowerCase(),motion_params:this._editorParams,colors:this._editorColors},{entity_id:e}),this._previewError=void 0}catch(s){this._previewError=b(s)}}async _cancelPreview(){let e=this._preSnapshot;if(!e||!this._hass)return;let s=this._config.entity;try{if(!e.on)await this._hass.callService("light","turn_off",{entity_id:s});else if(e.effect)await this._hass.callService("light","turn_on",{entity_id:s,effect:e.effect});else{let r={entity_id:s};e.hsColor&&(r.hs_color=e.hsColor),e.brightness!==void 0&&(r.brightness=e.brightness),await this._hass.callService("light","turn_on",r)}this._preSnapshot=void 0,this._previewError=void 0}catch(r){this._previewError=b(r)}}async _saveScene(){let e=this._editorName.trim();if(!this._hass||!this._editorStyle)return;if(!e){this._saveError="Enter a name for the scene.";return}if(e===Ye){this._saveError=`"${Ye}" is a reserved factory scene and can't be overwritten.`;return}let s=this._capabilities?.scene_id_range;if(this._saveTarget==="strip"&&this._saveSceneId!=null&&s&&(this._saveSceneId<s.min||this._saveSceneId>s.max)){this._saveError=`Scene ID must be between ${s.min} and ${s.max}.`;return}let r=this._editorStyle.toLowerCase();this._saving=!0;try{if(this._saveTarget==="library")await this._hass.callService(Se,"save_scene_to_library",{name:e,motion_style:r,motion_params:this._editorParams,colors:this._editorColors});else{let o=this._config.entity,n={name:e,motion_style:r,motion_params:this._editorParams,colors:this._editorColors};this._saveSceneId!=null&&(n.scene_id=this._saveSceneId),await this._hass.callService(Se,"save_scene",n,{entity_id:o})}this._saveError=void 0,this.dispatchEvent(new CustomEvent("scene-saved",{detail:{target:this._saveTarget,name:e,entityId:this._config.entity,recipe:{motion_style:r,motion_params:{...this._editorParams},colors:this._editorColors.map(o=>({...o}))}}}))}catch(o){this._saveError=b(o)}finally{this._saving=!1}}render(){if(!this._config||!this._hass)return p;let e=this._config.entity,s=this._hass.states[e];return h`
      <ha-card header="Nanoleaf Scene Editor">
        <div class="content">
          ${s?p:h`<p class="error">Entity not found: ${e}</p>`}
          ${this._loadError?h`<p class="error">${this._loadError}</p>`:p}
          ${!this._capabilities&&!this._loadError?h`<p>Loading…</p>`:p}
          ${this._capabilities?this._renderEditor():p}
        </div>
      </ha-card>
    `}_renderEditor(){let e=this._capabilities,s=Object.keys(e.motion_styles),r=this._editorStyle?be(e,this._editorStyle):[],o=e.color_slots.max,n=e.color_slots.min,l=e.scene_id_range;return h`
      <h3>
        Scene editor
        <button class="load" @click=${()=>this._resetEditor()}>New scene</button>
      </h3>
      ${this._previewError?h`<p class="error">${this._previewError}</p>`:p}

      <label class="field">
        <span>Motion style</span>
        <select @change=${a=>this._onStyleSelect(a.target.value)}>
          ${s.map(a=>h`<option value=${a} ?selected=${a===this._editorStyle}>${a}</option>`)}
        </select>
      </label>

      ${r.map(([a,d])=>{let c=this._editorParams[a]??d.min,_=d.max-d.min===1,v=e.field_notes[a];return h`
          <label class="field">
            <span>${bt(a)}${v?h`<span class="muted"> — ${v}</span>`:p}</span>
            ${_?h`<input
                  type="checkbox"
                  .checked=${c===d.max}
                  @change=${g=>this._onParamInput(a,g.target.checked?d.max:d.min)}
                />`:h`
                  <input
                    type="range"
                    min=${d.min}
                    max=${d.max}
                    .value=${String(c)}
                    @input=${g=>this._onParamInput(a,Number(g.target.value))}
                  />
                  <span class="value">${St(a,c)}</span>
                `}
          </label>
        `})}

      <div class="colors">
        <span>Colors<span class="muted"> — drag ☰ to reorder</span></span>
        <div class="color-slots">
          ${this._editorColors.map((a,d)=>h`
              <input
                type="color"
                .value=${B(a)}
                @input=${c=>this._onColorInput(d,c.target.value)}
                @dragover=${c=>c.preventDefault()}
                @drop=${c=>this._onColorDrop(c,d)}
              />
              <span
                class="drag-handle"
                draggable="true"
                @dragstart=${c=>this._onColorDragStart(c,d)}
                @dragover=${c=>c.preventDefault()}
                @drop=${c=>this._onColorDrop(c,d)}
                >☰</span
              >
              ${this._editorColors.length>n?h`<button
                    class="delete"
                    @click=${()=>this._removeColorSlot(d)}
                    @dragover=${c=>c.preventDefault()}
                    @drop=${c=>this._onColorDrop(c,d)}
                  >
                    ✕
                  </button>`:h`<span
                    class="delete-placeholder"
                    @dragover=${c=>c.preventDefault()}
                    @drop=${c=>this._onColorDrop(c,d)}
                  ></span>`}
            `)}
          ${this._editorColors.length<o?h`<button class="add-color" @click=${()=>this._addColorSlot()}>+</button>`:p}
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
      ${this._preSnapshot?h`<button class="cancel" @click=${()=>this._cancelPreview()}>Cancel preview</button>`:p}

      <label class="field">
        <span>Save to</span>
        <select @change=${a=>this._onSaveTargetSelect(a.target.value)}>
          <option value="strip" ?selected=${this._saveTarget==="strip"}>Strip</option>
          <option value="library" ?selected=${this._saveTarget==="library"}>Library</option>
        </select>
      </label>
      ${this._saveTarget==="strip"?h`
            <label class="field">
              <span>Scene ID<span class="muted"> — leave blank to auto-assign</span></span>
              <input
                type="number"
                min=${l.min}
                max=${l.max}
                placeholder="auto"
                .value=${this._saveSceneId!=null?String(this._saveSceneId):""}
                @input=${a=>this._onSceneIdInput(a.target.value)}
              />
            </label>
          `:p}
      <label class="field name-field">
        <span>Name</span>
        <input
          type="text"
          .value=${this._editorName}
          placeholder="Scene name"
          @input=${a=>this._onNameInput(a.target.value)}
        />
      </label>
      ${this._saveError?h`<p class="error">${this._saveError}</p>`:p}
      <button class="save" ?disabled=${this._saving} @click=${()=>this._saveScene()}>
        ${this._saving?"Saving\u2026":"Save"}
      </button>
    `}};f.styles=C`
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
      flex: 0 0 3.5em;
      text-align: right;
    }
    .colors {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin: 12px 0;
    }
    .color-slots {
      display: grid;
      grid-auto-flow: column;
      grid-template-rows: repeat(3, auto);
      align-items: center;
      justify-items: center;
      gap: 4px 6px;
    }
    .color-slots input[type="color"] {
      width: 32px;
      height: 32px;
      border: none;
      padding: 0;
      background: none;
    }
    .drag-handle {
      cursor: grab;
      color: var(--secondary-text-color);
      line-height: 1;
      user-select: none;
    }
    .drag-handle:active {
      cursor: grabbing;
    }
    .delete,
    .delete-placeholder {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      min-height: 20px;
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
  `,u([m()],f.prototype,"_config",2),u([m()],f.prototype,"_capabilities",2),u([m()],f.prototype,"_loadError",2),u([m()],f.prototype,"_editorStyle",2),u([m()],f.prototype,"_editorParams",2),u([m()],f.prototype,"_editorColors",2),u([m()],f.prototype,"_editorName",2),u([m()],f.prototype,"_saveTarget",2),u([m()],f.prototype,"_saveSceneId",2),u([m()],f.prototype,"_previewError",2),u([m()],f.prototype,"_saveError",2),u([m()],f.prototype,"_saving",2),u([m()],f.prototype,"_preSnapshot",2),f=u([k("nanoleaf-scene-card")],f);var At="nanoleaf_ltpdu",Xe="Northern Lights",y=class extends ${constructor(){super(...arguments);this._deviceScenes={};this._refreshing=!1;this._locallySaved={};this._locallyDeleted={};this._loadStarted=!1;this._cardRef=Be()}set hass(e){this._hass=e,this._loadStarted||(this._loadStarted=!0,this._loadStripsAndLibrary()),this.requestUpdate()}get hass(){return this._hass}async _loadStripsAndLibrary(){if(this._hass)try{let[{strips:e},s]=await Promise.all([We(this._hass),$e(this._hass)]);this._strips=e,this._library=s;let r=Object.keys(e);r.length===1&&(this._selected=r[0])}catch(e){this._loadError=b(e)}}_onSelect(e){this._selected=e||void 0,this._refreshError=void 0,this._actionError=void 0,this._loadIntoEditorError=void 0}updated(){let e=this._cardRef.value;!e||!this._selected||!this._hass||(e.hass=this._hass,this._cardConfiguredFor!==this._selected&&(e.setConfig({type:"custom:nanoleaf-scene-card",entity:this._selected}),this._cardConfiguredFor=this._selected))}_knownSceneNames(e){let r=this._hass?.states[e]?.attributes.effect_list??[],o=new Set([...r,...this._locallySaved[e]??[]]);for(let n of this._locallyDeleted[e]??[])o.delete(n);return[...o]}async _refreshFromStrip(){if(!this._hass||!this._selected)return;let e=this._selected;this._refreshing=!0,this._refreshError=void 0;try{let[s,r]=await Promise.all([Je(this._hass,e),$e(this._hass)]);this._deviceScenes={...this._deviceScenes,[e]:s},this._library=r}catch(s){this._refreshError=b(s)}finally{this._refreshing=!1}}async _activateScene(e,s){if(this._hass)try{await this._hass.callService("light","turn_on",{entity_id:e,effect:s}),this._actionError=void 0}catch(r){this._actionError=b(r)}}async _deleteScene(e,s){if(!this._hass)return;let r=new Set(this._locallyDeleted[e]??[]);this._locallyDeleted={...this._locallyDeleted,[e]:new Set(r).add(s)};let o=new Set(this._locallySaved[e]??[]),n=new Set(o);n.delete(s),this._locallySaved={...this._locallySaved,[e]:n};try{await this._hass.callService(At,"delete_scene",{name:s},{entity_id:e}),this._actionError=void 0,this._invalidateDeviceScenes(e)}catch(l){this._locallyDeleted={...this._locallyDeleted,[e]:r},this._locallySaved={...this._locallySaved,[e]:o},this._actionError=b(l)}}_loadRowIntoEditor(e){this._loadIntoEditorError=void 0;let s=this._selected;if(!s)return;if(e.sceneId!=null){let o=this._deviceScenes[s]?.scenes[String(e.sceneId)];if(o){this._cardRef.value?.loadRecipe({name:e.name,motionStyle:ne(o.motion_style),motionParams:o.motion_params,colors:o.colors,sceneId:e.sceneId});return}}let r=this._library?.recipes[e.name];if(r){this._loadLibraryRecipeIntoEditor(e.name,r);return}this._loadIntoEditorError=`Refresh from strip to load "${e.name}" into the editor.`}_renderStripPanel(){let e=this._selected;if(!e)return h`<h2>Scenes on strip</h2><p class="muted">Select a strip.</p>`;let s=this._deviceScenes[e],r=s?Object.entries(s.scenes).map(([o,n])=>({name:n.name??`Unknown Scene ${o}`,sceneId:Number(o),deletable:n.name!=null&&n.name!==Xe})):this._knownSceneNames(e).map(o=>({name:o,deletable:o!==Xe}));return h`
      <h2>
        Scenes on strip
        <button class="load" ?disabled=${this._refreshing} @click=${()=>this._refreshFromStrip()}>
          ${this._refreshing?"Refreshing\u2026":"Refresh from strip"}
        </button>
      </h2>
      ${this._refreshError?h`<p class="error">${this._refreshError}</p>`:p}
      ${this._actionError?h`<p class="error">${this._actionError}</p>`:p}
      ${this._loadIntoEditorError?h`<p class="error">${this._loadIntoEditorError}</p>`:p}
      ${r.length===0?h`<p class="muted">No scenes saved yet.</p>`:h`
            <ul class="scene-list">
              ${r.map(o=>h`
                  <li>
                    <button class="scene-name" @click=${()=>this._loadRowIntoEditor(o)}>${o.name}</button>
                    ${o.deletable?h`
                          <button class="activate" title="Activate" @click=${()=>this._activateScene(e,o.name)}>▶</button>
                          <button class="delete" title="Delete" @click=${()=>this._deleteScene(e,o.name)}>✕</button>
                        `:p}
                  </li>
                `)}
            </ul>
          `}
    `}_loadLibraryRecipeIntoEditor(e,s){this._cardRef.value?.loadRecipe({name:e,motionStyle:ne(s.motion_style),motionParams:s.motion_params,colors:s.colors})}_renderLibraryPanel(){let e=this._library?Object.keys(this._library.recipes):[];return h`
      <h2>Scene library</h2>
      ${e.length===0?h`<p class="muted">No scene recipes saved anywhere yet.</p>`:h`
            <ul class="scene-list">
              ${e.map(s=>{let r=this._library.recipes[s];return h`
                  <li>
                    <button class="scene-name" @click=${()=>this._loadLibraryRecipeIntoEditor(s,r)}>${s}</button>
                    <span class="muted">(${ne(r.motion_style)})</span>
                  </li>
                `})}
            </ul>
          `}
    `}_invalidateDeviceScenes(e){if(!(e in this._deviceScenes))return;let s={...this._deviceScenes};delete s[e],this._deviceScenes=s}_onSceneSaved(e){let{target:s,name:r,entityId:o,recipe:n}=e.detail;if(this._library={recipes:{...this._library?.recipes,[r]:n}},s==="strip"){let l=new Set(this._locallySaved[o]??[]).add(r);this._locallySaved={...this._locallySaved,[o]:l};let a=new Set(this._locallyDeleted[o]??[]);a.delete(r),this._locallyDeleted={...this._locallyDeleted,[o]:a},this._invalidateDeviceScenes(o)}}render(){if(!this._hass)return p;if(this._loadError)return h`<div class="content"><p class="error">${this._loadError}</p></div>`;if(!this._strips)return h`<div class="content"><p>Loading…</p></div>`;let e=Object.keys(this._strips);return e.length===0?h`
        <div class="content">
          <h1>Nanoleaf Scenes</h1>
          <p class="muted">No Nanoleaf LTPDU strips configured yet. Add one under Settings → Devices & Services.</p>
        </div>
      `:h`
      <div class="content">
        <h1>Nanoleaf Scenes</h1>
        ${e.length>1?h`
              <label class="field">
                <span>Strip</span>
                <select @change=${s=>this._onSelect(s.target.value)}>
                  <option value="" ?selected=${!this._selected}>Select a strip…</option>
                  ${e.map(s=>h`<option value=${s} ?selected=${s===this._selected}>${this._strips[s].name}</option>`)}
                </select>
              </label>
            `:p}
        <div class="panels">
          <section class="panel">${this._renderStripPanel()}</section>
          <section class="panel">
            ${this._selected?h`<nanoleaf-scene-card
                  ${Ge(this._cardRef)}
                  @scene-saved=${s=>this._onSceneSaved(s)}
                ></nanoleaf-scene-card>`:h`<p class="muted">Select a strip to begin.</p>`}
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
  `,u([m()],y.prototype,"_strips",2),u([m()],y.prototype,"_selected",2),u([m()],y.prototype,"_loadError",2),u([m()],y.prototype,"_library",2),u([m()],y.prototype,"_deviceScenes",2),u([m()],y.prototype,"_refreshing",2),u([m()],y.prototype,"_refreshError",2),u([m()],y.prototype,"_actionError",2),u([m()],y.prototype,"_loadIntoEditorError",2),u([m()],y.prototype,"_locallySaved",2),u([m()],y.prototype,"_locallyDeleted",2),y=u([k("nanoleaf-scene-panel")],y);export{y as NanoleafScenePanel};
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
