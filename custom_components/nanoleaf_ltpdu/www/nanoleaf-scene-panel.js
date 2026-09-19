var Qt=Object.defineProperty;var Yt=Object.getOwnPropertyDescriptor;var _=(r,e,t,s)=>{for(var i=s>1?void 0:s?Yt(e,t):e,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(e,t,i):n(i))||i);return s&&i&&Qt(e,t,i),i};var B=globalThis,G=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ot=Symbol(),St=new WeakMap,I=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==ot)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(G&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=St.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&St.set(t,e))}return e}toString(){return this.cssText}},At=r=>new I(typeof r=="string"?r:r+"",void 0,ot),E=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new I(t,r,ot)},xt=(r,e)=>{if(G)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=B.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},nt=G?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return At(t)})(r):r;var{is:Xt,defineProperty:Zt,getOwnPropertyDescriptor:te,getOwnPropertyNames:ee,getOwnPropertySymbols:se,getPrototypeOf:ie}=Object,V=globalThis,Et=V.trustedTypes,re=Et?Et.emptyScript:"",oe=V.reactiveElementPolyfillSupport,U=(r,e)=>r,O={toAttribute(r,e){switch(e){case Boolean:r=r?re:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},W=(r,e)=>!Xt(r,e),Ct={attribute:!0,type:String,converter:O,reflect:!1,useDefault:!1,hasChanged:W};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ct){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Zt(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:o}=te(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:i,set(n){let a=i?.call(this);o?.call(this,n),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ct}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;let e=ie(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){let t=this.properties,s=[...ee(t),...se(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(nt(i))}else e!==void 0&&t.push(nt(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:O).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:O;this._$Em=i;let a=n.fromAttribute(t,o.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(e,t,s,i=!1,o){if(e!==void 0){let n=this.constructor;if(i===!1&&(o=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??W)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:n}=o,a=this[i];n!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,o,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[U("elementProperties")]=new Map,$[U("finalized")]=new Map,oe?.({ReactiveElement:$}),(V.reactiveElementVersions??=[]).push("2.1.2");var lt=globalThis,wt=r=>r,K=lt.trustedTypes,Rt=K?K.createPolicy("lit-html",{createHTML:r=>r}):void 0,ct="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,ht="?"+b,ne=`<${ht}>`,R=document,D=()=>R.createComment(""),j=r=>r===null||typeof r!="object"&&typeof r!="function",dt=Array.isArray,Lt=r=>dt(r)||typeof r?.[Symbol.iterator]=="function",at=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pt=/-->/g,Tt=/>/g,C=RegExp(`>|${at}(?:([^\\s"'>=/]+)(${at}*=${at}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Mt=/'/g,Ht=/"/g,It=/^(?:script|style|textarea|title)$/i,pt=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),d=pt(1),xe=pt(2),Ee=pt(3),P=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),kt=new WeakMap,w=R.createTreeWalker(R,129);function Ut(r,e){if(!dt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Rt!==void 0?Rt.createHTML(e):e}var Ot=(r,e)=>{let t=r.length-1,s=[],i,o=e===2?"<svg>":e===3?"<math>":"",n=N;for(let a=0;a<t;a++){let l=r[a],h,u,p=-1,g=0;for(;g<l.length&&(n.lastIndex=g,u=n.exec(l),u!==null);)g=n.lastIndex,n===N?u[1]==="!--"?n=Pt:u[1]!==void 0?n=Tt:u[2]!==void 0?(It.test(u[2])&&(i=RegExp("</"+u[2],"g")),n=C):u[3]!==void 0&&(n=C):n===C?u[0]===">"?(n=i??N,p=-1):u[1]===void 0?p=-2:(p=n.lastIndex-u[2].length,h=u[1],n=u[3]===void 0?C:u[3]==='"'?Ht:Mt):n===Ht||n===Mt?n=C:n===Pt||n===Tt?n=N:(n=C,i=void 0);let v=n===C&&r[a+1].startsWith("/>")?" ":"";o+=n===N?l+ne:p>=0?(s.push(h),l.slice(0,p)+ct+l.slice(p)+b+v):l+b+(p===-2?a:v)}return[Ut(r,o+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},F=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,n=0,a=e.length-1,l=this.parts,[h,u]=Ot(e,t);if(this.el=r.createElement(h,s),w.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=w.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(ct)){let g=u[n++],v=i.getAttribute(p).split(b),S=/([.?@])?(.*)/.exec(g);l.push({type:1,index:o,name:S[2],strings:v,ctor:S[1]==="."?Q:S[1]==="?"?Y:S[1]==="@"?X:M}),i.removeAttribute(p)}else p.startsWith(b)&&(l.push({type:6,index:o}),i.removeAttribute(p));if(It.test(i.tagName)){let p=i.textContent.split(b),g=p.length-1;if(g>0){i.textContent=K?K.emptyScript:"";for(let v=0;v<g;v++)i.append(p[v],D()),w.nextNode(),l.push({type:2,index:++o});i.append(p[g],D())}}}else if(i.nodeType===8)if(i.data===ht)l.push({type:2,index:o});else{let p=-1;for(;(p=i.data.indexOf(b,p+1))!==-1;)l.push({type:7,index:o}),p+=b.length-1}o++}}static createElement(e,t){let s=R.createElement("template");return s.innerHTML=e,s}};function T(r,e,t=r,s){if(e===P)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,o=j(e)?void 0:e._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=T(r,i._$AS(r,e.values),i,s)),e}var J=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??R).importNode(t,!0);w.currentNode=i;let o=w.nextNode(),n=0,a=0,l=s[0];for(;l!==void 0;){if(n===l.index){let h;l.type===2?h=new H(o,o.nextSibling,this,e):l.type===1?h=new l.ctor(o,l.name,l.strings,this,e):l.type===6&&(h=new Z(o,this,e)),this._$AV.push(h),l=s[++a]}n!==l?.index&&(o=w.nextNode(),n++)}return w.currentNode=R,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},H=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=T(this,e,t),j(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==P&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Lt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&j(this._$AH)?this._$AA.nextSibling.data=e:this.T(R.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=F.createElement(Ut(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let o=new J(i,this),n=o.u(this.options);o.p(t),this.T(n),this._$AH=o}}_$AC(e){let t=kt.get(e.strings);return t===void 0&&kt.set(e.strings,t=new F(e)),t}k(e){dt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let o of e)i===t.length?t.push(s=new r(this.O(D()),this.O(D()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=wt(e).nextSibling;wt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(e,t=this,s,i){let o=this.strings,n=!1;if(o===void 0)e=T(this,e,t,0),n=!j(e)||e!==this._$AH&&e!==P,n&&(this._$AH=e);else{let a=e,l,h;for(e=o[0],l=0;l<o.length-1;l++)h=T(this,a[s+l],t,l),h===P&&(h=this._$AH[l]),n||=!j(h)||h!==this._$AH[l],h===c?e=c:e!==c&&(e+=(h??"")+o[l+1]),this._$AH[l]=h}n&&!i&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Q=class extends M{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},Y=class extends M{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},X=class extends M{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){if((e=T(this,e,t,0)??c)===P)return;let s=this._$AH,i=e===c&&s!==c||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==c&&(s===c||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Z=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){T(this,e)}},Nt={M:ct,P:b,A:ht,C:1,L:Ot,R:J,D:Lt,V:T,I:H,H:M,N:Y,U:X,B:Q,F:Z},ae=lt.litHtmlPolyfillSupport;ae?.(F,H),(lt.litHtmlVersions??=[]).push("3.3.3");var Dt=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let o=t?.renderBefore??null;s._$litPart$=i=new H(e.insertBefore(D(),o),o,void 0,t??{})}return i._$AI(r),i};var ut=globalThis,y=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Dt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};y._$litElement$=!0,y.finalized=!0,ut.litElementHydrateSupport?.({LitElement:y});var le=ut.litElementPolyfillSupport;le?.({LitElement:y});(ut.litElementVersions??=[]).push("4.2.2");var k=r=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(r,e)}):customElements.define(r,e)};var ce={attribute:!0,type:String,converter:O,reflect:!1,hasChanged:W},he=(r=ce,e,t)=>{let{kind:s,metadata:i}=t,o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),o.set(t.name,r),s==="accessor"){let{name:n}=t;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,r,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,r,a),a}}}if(s==="setter"){let{name:n}=t;return function(a){let l=this[n];e.call(this,a),this.requestUpdate(n,l,r,!0,a)}}throw Error("Unsupported decorator location: "+s)};function L(r){return(e,t)=>typeof t=="object"?he(r,e,t):((s,i,o)=>{let n=i.hasOwnProperty(o);return i.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(i,o):void 0})(r,e,t)}function m(r){return L({...r,state:!0,attribute:!1})}var{I:ps}=Nt;var jt=r=>r.strings===void 0;var Ft={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},_t=r=>(...e)=>({_$litDirective$:r,values:e}),et=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var q=(r,e)=>{let t=r._$AN;if(t===void 0)return!1;for(let s of t)s._$AO?.(e,!1),q(s,e);return!0},st=r=>{let e,t;do{if((e=r._$AM)===void 0)break;t=e._$AN,t.delete(r),r=e}while(t?.size===0)},qt=r=>{for(let e;e=r._$AM;r=e){let t=e._$AN;if(t===void 0)e._$AN=t=new Set;else if(t.has(r))break;t.add(r),ue(e)}};function de(r){this._$AN!==void 0?(st(this),this._$AM=r,qt(this)):this._$AM=r}function pe(r,e=!1,t=0){let s=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(e)if(Array.isArray(s))for(let o=t;o<s.length;o++)q(s[o],!1),st(s[o]);else s!=null&&(q(s,!1),st(s));else q(this,r)}var ue=r=>{r.type==Ft.CHILD&&(r._$AP??=pe,r._$AQ??=de)},it=class extends et{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,s){super._$AT(e,t,s),qt(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(q(this,e),st(this))}setValue(e){if(jt(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}};var zt=()=>new ft,ft=class{},mt=new WeakMap,Bt=_t(class extends it{render(r){return c}update(r,[e]){let t=e!==this.G;return t&&this.rt(void 0),(t||this.lt!==this.ct)&&(this.G=e,this.ht=r.options?.host,this.rt(this.ct=r.element)),c}rt(r){if(this.G!==void 0)if(this.isConnected||(r=void 0),typeof this.G=="function"){let e=this.ht??globalThis,t=mt.get(e);t===void 0&&(t=new WeakMap,mt.set(e,t)),t.get(this.G)!==void 0&&this.G.call(this.ht,void 0),t.set(this.G,r),r!==void 0&&this.G.call(this.ht,r)}else this.G.value=r}get lt(){return typeof this.G=="function"?mt.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var _e="nanoleaf_ltpdu";async function gt(r,e,t={},s){return(await r.connection.sendMessagePromise({type:"call_service",domain:_e,service:e,service_data:t,...s?{target:s}:{},return_response:!0})).response}function Gt(r){return gt(r,"get_scene_capabilities")}function Vt(r){return gt(r,"get_scene_library")}function Wt(r){return gt(r,"list_strips")}function vt(r,e){return(r.motion_styles[e]?.param_fields??[]).map(s=>[s,r.field_ranges[s]])}function yt(r){return r.charAt(0).toUpperCase()+r.slice(1).toLowerCase()}function z({hue:r,saturation:e,brightness:t}){let s=e/100,i=t/100,o=i*s,n=(r%360+360)%360/60,a=o*(1-Math.abs(n%2-1)),[l,h,u]=[0,0,0];n<1?[l,h,u]=[o,a,0]:n<2?[l,h,u]=[a,o,0]:n<3?[l,h,u]=[0,o,a]:n<4?[l,h,u]=[0,a,o]:n<5?[l,h,u]=[a,0,o]:[l,h,u]=[o,0,a];let p=i-o,g=S=>Math.round((S+p)*255),v=S=>g(S).toString(16).padStart(2,"0");return`#${v(l)}${v(h)}${v(u)}`}function Kt(r){let e=parseInt(r.slice(1,3),16)/255,t=parseInt(r.slice(3,5),16)/255,s=parseInt(r.slice(5,7),16)/255,i=Math.max(e,t,s),o=Math.min(e,t,s),n=i-o,a=0;n!==0&&(i===e?a=60*((t-s)/n%6):i===t?a=60*((s-e)/n+2):a=60*((e-t)/n+4)),a<0&&(a+=360);let l=i===0?0:n/i,h=i;return{hue:Math.round(a),saturation:Math.round(l*100),brightness:Math.round(h*100)}}var me=16;function rt(r){return(r.speed??24)/10*1e3}function Jt(r){return(r.delay??0)/10*1e3}function fe(r,e){if(r.length<=1||Math.random()*100<e)return r[0];let t=r.slice(1);return t[Math.floor(Math.random()*t.length)]}var A=class extends y{constructor(){super(...arguments);this.params={};this.colors=[];this._startedAt=0;this._segmentEls=[];this._fadeIndex=0;this._colorAdvanceAt=0;this._tick=()=>{this._animate(performance.now()),this._rafId=requestAnimationFrame(this._tick)}}connectedCallback(){super.connectedCallback(),this._startedAt=performance.now(),this._tick()}disconnectedCallback(){super.disconnectedCallback(),this._rafId!==void 0&&cancelAnimationFrame(this._rafId)}updated(){if(this._renderedStyle!==this.motionStyle){this._renderedStyle=this.motionStyle,this._segmentEls=Array.from(this.shadowRoot?.querySelectorAll(".segment")??[]);let t=performance.now();this._startedAt=t,this._fadeIndex=0,this._currentColor=void 0,this._colorAdvanceAt=t}}_animate(t){if(this.colors.length)switch(this.motionStyle){case"Fade":this._animateFade(t);break;case"Random":this._animateScatter(t,0);break;case"Highlight":this._animateScatter(t,this.params.first_colour_frequency??50);break;case"Flow":this._animateGradientScroll(t,!1);break;case"Stripes":this._animateGradientScroll(t,!0);break}}_applyColorToAllSegments(t){let s=z(t);for(let i of this._segmentEls)i.style.transitionDuration=`${rt(this.params)}ms`,i.style.backgroundColor=s}_animateFade(t){t>=this._colorAdvanceAt&&(this._fadeIndex=(this._fadeIndex+1)%this.colors.length,this._colorAdvanceAt=t+rt(this.params)+Jt(this.params)),this._applyColorToAllSegments(this.colors[this._fadeIndex])}_animateScatter(t,s){(t>=this._colorAdvanceAt||!this._currentColor)&&(this._currentColor=fe(this.colors,s),this._colorAdvanceAt=t+rt(this.params)+Jt(this.params)),this._applyColorToAllSegments(this._currentColor)}_animateGradientScroll(t,s){let i=this._segmentEls[0];if(!i)return;let o=this.colors.map(v=>z(v)),n=s?this._hardStops(o):this._softStops(o);i.style.backgroundImage=`linear-gradient(90deg, ${n})`;let a=s?this._stripeRepeats():1;i.style.backgroundRepeat="repeat",i.style.backgroundSize=`${o.length*100/a}% 100%`;let l=(this.params.direction??0)===0?-1:1,h=rt(this.params)*o.length,p=(t-this._startedAt)%h/h,g=l*p*100;i.style.backgroundPositionX=`${g}%`}_stripeRepeats(){let t=this.params.segment??50;return Math.max(1,Math.round(1+(100-t)/100*6))}_softStops(t){return[...t,t[0]].join(", ")}_hardStops(t){let s=100/t.length,i=[];return t.forEach((o,n)=>{let a=n*s,l=a+s;i.push(`${o} ${a}%`,`${o} ${l}%`)}),i.join(", ")}render(){return this.motionStyle==="Flow"||this.motionStyle==="Stripes"?d`<div class="preview-strip"><div class="segment gradient"></div></div>`:d`
          <div class="preview-strip">
            ${Array.from({length:me},()=>d`<div class="segment"></div>`)}
          </div>
        `}};A.styles=E`
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
  `,_([L({attribute:!1})],A.prototype,"motionStyle",2),_([L({attribute:!1})],A.prototype,"params",2),_([L({attribute:!1})],A.prototype,"colors",2),A=_([k("nanoleaf-motion-preview")],A);var $t="nanoleaf_ltpdu",bt="Northern Lights",ge={Fade:{speed:24,delay:0,loop:1},Random:{speed:24,delay:0},Highlight:{speed:24,delay:15,first_colour_frequency:80},Flow:{speed:24,delay:0,direction:1,loop:1},Stripes:{speed:24,direction:1,segment:50}};function ve(r){return r.split("_").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}var f=class extends y{constructor(){super(...arguments);this._locallyDeleted=new Set;this._locallySaved=new Set;this._editorParams={};this._editorColors=[];this._editorName="";this._saving=!1;this._loadStarted=!1}static getStubConfig(){return{type:"custom:nanoleaf-scene-card",entity:""}}setConfig(t){if(!t.entity)throw new Error("nanoleaf-scene-card requires an `entity`");this._config=t}getCardSize(){return 6}set hass(t){this._hass=t,this._loadStarted||(this._loadStarted=!0,this._loadCapabilitiesAndLibrary()),this.requestUpdate()}get hass(){return this._hass}async _loadCapabilitiesAndLibrary(){if(this._hass)try{let[t,s]=await Promise.all([Gt(this._hass),Vt(this._hass)]);this._capabilities=t,this._library=s,this._resetEditor()}catch(t){this._loadError=t instanceof Error?t.message:String(t)}}_defaultParamsForStyle(t){let s={},i=ge[t]??{};for(let[o,n]of vt(this._capabilities,t))s[o]=o in i?i[o]:Math.round((n.min+n.max)/2);return s}_resetEditor(){if(!this._capabilities)return;let t=Object.keys(this._capabilities.motion_styles)[0];this._editorStyle=t,this._editorParams=this._defaultParamsForStyle(t),this._editorColors=[{hue:0,saturation:100,brightness:100}],this._editorName="",this._saveError=void 0}_loadRecipeIntoEditor(t){let s=this._library?.recipes[t];s&&(this._editorStyle=yt(s.motion_style),this._editorParams={...s.motion_params},this._editorColors=s.colors.map(i=>({...i})),this._editorName=t,this._saveError=void 0)}_onNameInput(t){this._editorName=t}_onStyleSelect(t){this._editorStyle=t,this._editorParams=this._defaultParamsForStyle(t)}_onParamInput(t,s){this._editorParams={...this._editorParams,[t]:s}}_onColorInput(t,s){let i=[...this._editorColors];i[t]=Kt(s),this._editorColors=i}_addColorSlot(){let t=this._capabilities?.color_slots.max??7;this._editorColors.length>=t||(this._editorColors=[...this._editorColors,{hue:0,saturation:100,brightness:100}])}_removeColorSlot(t){let s=this._capabilities?.color_slots.min??1;this._editorColors.length<=s||(this._editorColors=this._editorColors.filter((i,o)=>o!==t))}_captureSnapshot(){let t=this._config.entity,s=this._hass.states[t];s&&(this._preSnapshot={on:s.state==="on",effect:s.attributes.effect,hsColor:s.attributes.hs_color,brightness:s.attributes.brightness})}async _previewNow(){if(!this._hass||!this._editorStyle)return;this._preSnapshot||this._captureSnapshot();let t=this._config.entity;try{await this._hass.callService($t,"preview_scene",{motion_style:this._editorStyle.toLowerCase(),motion_params:this._editorParams,colors:this._editorColors},{entity_id:t}),this._previewError=void 0}catch(s){this._previewError=s instanceof Error?s.message:String(s)}}async _cancelPreview(){let t=this._preSnapshot;if(!t||!this._hass)return;let s=this._config.entity;try{if(!t.on)await this._hass.callService("light","turn_off",{entity_id:s});else if(t.effect)await this._hass.callService("light","turn_on",{entity_id:s,effect:t.effect});else{let i={entity_id:s};t.hsColor&&(i.hs_color=t.hsColor),t.brightness!==void 0&&(i.brightness=t.brightness),await this._hass.callService("light","turn_on",i)}this._preSnapshot=void 0,this._previewError=void 0}catch(i){this._previewError=i instanceof Error?i.message:String(i)}}async _saveScene(){let t=this._editorName.trim();if(!this._hass||!this._editorStyle)return;if(!t){this._saveError="Enter a name for the scene.";return}if(t===bt){this._saveError=`"${bt}" is a reserved factory scene and can't be overwritten.`;return}let s=this._config.entity,i=this._editorStyle.toLowerCase();this._saving=!0;try{await this._hass.callService($t,"save_scene",{name:t,motion_style:i,motion_params:this._editorParams,colors:this._editorColors},{entity_id:s}),this._saveError=void 0,this._locallySaved=new Set(this._locallySaved).add(t);let o=new Set(this._locallyDeleted);o.delete(t),this._locallyDeleted=o,this._library={recipes:{...this._library?.recipes,[t]:{motion_style:i,motion_params:{...this._editorParams},colors:this._editorColors.map(n=>({...n}))}}}}catch(o){this._saveError=o instanceof Error?o.message:String(o)}finally{this._saving=!1}}async _activateScene(t){let s=this._config.entity;await this._hass.callService("light","turn_on",{entity_id:s,effect:t})}async _deleteScene(t){let s=this._config.entity;this._locallyDeleted=new Set(this._locallyDeleted).add(t);let i=new Set(this._locallySaved),o=new Set(this._locallySaved);o.delete(t),this._locallySaved=o;try{await this._hass.callService($t,"delete_scene",{name:t},{entity_id:s})}catch(n){let a=new Set(this._locallyDeleted);a.delete(t),this._locallyDeleted=a,this._locallySaved=i,this._loadError=n instanceof Error?n.message:String(n)}}_savedSceneNames(){let t=this._config?.entity,i=(t?this._hass?.states[t]:void 0)?.attributes.effect_list??[],o=new Set([...i,...this._locallySaved]);for(let n of this._locallyDeleted)o.delete(n);return[...o]}render(){if(!this._config||!this._hass)return c;let t=this._config.entity,s=this._hass.states[t],i=this._savedSceneNames(),o=this._library?Object.keys(this._library.recipes):[];return d`
      <ha-card header="Nanoleaf Scene Editor">
        <div class="content">
          ${s?c:d`<p class="error">Entity not found: ${t}</p>`}
          ${this._loadError?d`<p class="error">${this._loadError}</p>`:c}
          ${!this._capabilities&&!this._loadError?d`<p>Loading…</p>`:c}

          <h3>Saved on this device</h3>
          ${i.length===0?d`<p class="muted">No scenes saved yet.</p>`:d`
                <ul class="scene-list">
                  ${i.map(n=>d`
                      <li>
                        <button class="scene-name" @click=${()=>this._activateScene(n)}>${n}</button>
                        ${n===bt?c:d`<button class="delete" @click=${()=>this._deleteScene(n)}>✕</button>`}
                      </li>
                    `)}
                </ul>
              `}

          <h3>Scene library</h3>
          ${o.length===0?d`<p class="muted">No scene recipes saved anywhere yet.</p>`:d`
                <ul class="scene-list">
                  ${o.map(n=>{let a=this._library.recipes[n],l=i.includes(n);return d`
                      <li>
                        <span class="scene-name">${n}</span>
                        <span class="muted">(${yt(a.motion_style)}${l?" \xB7 on this device":""})</span>
                        <button class="load" @click=${()=>this._loadRecipeIntoEditor(n)}>Load into editor</button>
                      </li>
                    `})}
                </ul>
              `}

          ${this._capabilities?this._renderEditor():c}
        </div>
      </ha-card>
    `}_renderEditor(){let t=this._capabilities,s=Object.keys(t.motion_styles),i=this._editorStyle?vt(t,this._editorStyle):[],o=t.color_slots.max,n=t.color_slots.min;return d`
      <h3>
        Scene editor
        <button class="load" @click=${()=>this._resetEditor()}>New scene</button>
      </h3>
      ${this._previewError?d`<p class="error">${this._previewError}</p>`:c}

      <label class="field">
        <span>Motion style</span>
        <select @change=${a=>this._onStyleSelect(a.target.value)}>
          ${s.map(a=>d`<option value=${a} ?selected=${a===this._editorStyle}>${a}</option>`)}
        </select>
      </label>

      ${i.map(([a,l])=>{let h=this._editorParams[a]??l.min,u=l.max-l.min===1,p=t.field_notes[a];return d`
          <label class="field">
            <span>${ve(a)}${p?d`<span class="muted"> — ${p}</span>`:c}</span>
            ${u?d`<input
                  type="checkbox"
                  .checked=${h===l.max}
                  @change=${g=>this._onParamInput(a,g.target.checked?l.max:l.min)}
                />`:d`
                  <input
                    type="range"
                    min=${l.min}
                    max=${l.max}
                    .value=${String(h)}
                    @input=${g=>this._onParamInput(a,Number(g.target.value))}
                  />
                  <span class="value">${h}</span>
                `}
          </label>
        `})}

      <div class="colors">
        <span>Colors</span>
        <div class="color-slots">
          ${this._editorColors.map((a,l)=>d`
              <span class="color-slot">
                <input
                  type="color"
                  .value=${z(a)}
                  @input=${h=>this._onColorInput(l,h.target.value)}
                />
                ${this._editorColors.length>n?d`<button class="delete" @click=${()=>this._removeColorSlot(l)}>✕</button>`:c}
              </span>
            `)}
          ${this._editorColors.length<o?d`<button class="add-color" @click=${()=>this._addColorSlot()}>+</button>`:c}
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
      ${this._preSnapshot?d`<button class="cancel" @click=${()=>this._cancelPreview()}>Cancel preview</button>`:c}

      <label class="field name-field">
        <span>Name</span>
        <input
          type="text"
          .value=${this._editorName}
          placeholder="Scene name"
          @input=${a=>this._onNameInput(a.target.value)}
        />
      </label>
      ${this._saveError?d`<p class="error">${this._saveError}</p>`:c}
      <button class="save" ?disabled=${this._saving} @click=${()=>this._saveScene()}>
        ${this._saving?"Saving\u2026":"Save"}
      </button>
    `}};f.styles=E`
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
  `,_([m()],f.prototype,"_config",2),_([m()],f.prototype,"_capabilities",2),_([m()],f.prototype,"_library",2),_([m()],f.prototype,"_loadError",2),_([m()],f.prototype,"_locallyDeleted",2),_([m()],f.prototype,"_locallySaved",2),_([m()],f.prototype,"_editorStyle",2),_([m()],f.prototype,"_editorParams",2),_([m()],f.prototype,"_editorColors",2),_([m()],f.prototype,"_editorName",2),_([m()],f.prototype,"_previewError",2),_([m()],f.prototype,"_saveError",2),_([m()],f.prototype,"_saving",2),_([m()],f.prototype,"_preSnapshot",2),f=_([k("nanoleaf-scene-card")],f);var x=class extends y{constructor(){super(...arguments);this._loadStarted=!1;this._cardRef=zt()}set hass(t){this._hass=t,this._loadStarted||(this._loadStarted=!0,this._loadStrips()),this.requestUpdate()}get hass(){return this._hass}async _loadStrips(){if(this._hass)try{let{strips:t}=await Wt(this._hass);this._strips=t;let s=Object.keys(t);s.length===1&&(this._selected=s[0])}catch(t){this._loadError=t instanceof Error?t.message:String(t)}}_onSelect(t){this._selected=t||void 0}updated(){let t=this._cardRef.value;!t||!this._selected||!this._hass||(t.hass=this._hass,this._cardConfiguredFor!==this._selected&&(t.setConfig({type:"custom:nanoleaf-scene-card",entity:this._selected}),this._cardConfiguredFor=this._selected))}render(){if(!this._hass)return c;if(this._loadError)return d`<div class="content"><p class="error">${this._loadError}</p></div>`;if(!this._strips)return d`<div class="content"><p>Loading…</p></div>`;let t=Object.keys(this._strips);return t.length===0?d`
        <div class="content">
          <h1>Nanoleaf Scenes</h1>
          <p class="muted">No Nanoleaf LTPDU strips configured yet. Add one under Settings → Devices & Services.</p>
        </div>
      `:d`
      <div class="content">
        <h1>Nanoleaf Scenes</h1>
        ${t.length>1?d`
              <label class="field">
                <span>Strip</span>
                <select @change=${s=>this._onSelect(s.target.value)}>
                  <option value="" ?selected=${!this._selected}>Select a strip…</option>
                  ${t.map(s=>d`<option value=${s} ?selected=${s===this._selected}>${this._strips[s].name}</option>`)}
                </select>
              </label>
            `:c}
        ${this._selected?d`<nanoleaf-scene-card ${Bt(this._cardRef)}></nanoleaf-scene-card>`:c}
      </div>
    `}};x.styles=E`
    .content {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      font-size: 1.5em;
      margin: 0 0 16px;
    }
    .field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .muted {
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color, #db4437);
    }
  `,_([m()],x.prototype,"_strips",2),_([m()],x.prototype,"_selected",2),_([m()],x.prototype,"_loadError",2),x=_([k("nanoleaf-scene-panel")],x);export{x as NanoleafScenePanel};
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
