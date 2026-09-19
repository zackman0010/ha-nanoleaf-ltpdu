var Yt=Object.defineProperty;var Xt=Object.getOwnPropertyDescriptor;var _=(i,e,t,s)=>{for(var r=s>1?void 0:s?Xt(e,t):e,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(e,t,r):n(r))||r);return s&&r&&Yt(e,t,r),r};var G=globalThis,V=G.ShadowRoot&&(G.ShadyCSS===void 0||G.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,nt=Symbol(),At=new WeakMap,U=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==nt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(V&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=At.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&At.set(t,e))}return e}toString(){return this.cssText}},xt=i=>new U(typeof i=="string"?i:i+"",void 0,nt),C=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new U(t,i,nt)},Et=(i,e)=>{if(V)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),r=G.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},at=V?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return xt(t)})(i):i;var{is:Zt,defineProperty:te,getOwnPropertyDescriptor:ee,getOwnPropertyNames:se,getOwnPropertySymbols:ie,getPrototypeOf:re}=Object,W=globalThis,Ct=W.trustedTypes,oe=Ct?Ct.emptyScript:"",ne=W.reactiveElementPolyfillSupport,O=(i,e)=>i,N={toAttribute(i,e){switch(e){case Boolean:i=i?oe:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},J=(i,e)=>!Zt(i,e),wt={attribute:!0,type:String,converter:N,reflect:!1,useDefault:!1,hasChanged:J};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=wt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&te(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){let{get:r,set:o}=ee(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:r,set(n){let a=r?.call(this);o?.call(this,n),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??wt}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let e=re(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let t=this.properties,s=[...se(t),...ie(t)];for(let r of s)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let r of s)t.unshift(at(r))}else e!==void 0&&t.push(at(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Et(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:N).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){let s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:N;this._$Em=r;let a=n.fromAttribute(t,o.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,s,r=!1,o){if(e!==void 0){let n=this.constructor;if(r===!1&&(o=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??J)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,a=this[r];n!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,o,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[O("elementProperties")]=new Map,$[O("finalized")]=new Map,ne?.({ReactiveElement:$}),(W.reactiveElementVersions??=[]).push("2.1.2");var ct=globalThis,Rt=i=>i,K=ct.trustedTypes,Pt=K?K.createPolicy("lit-html",{createHTML:i=>i}):void 0,ht="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,dt="?"+b,ae=`<${dt}>`,P=document,j=()=>P.createComment(""),F=i=>i===null||typeof i!="object"&&typeof i!="function",pt=Array.isArray,It=i=>pt(i)||typeof i?.[Symbol.iterator]=="function",lt=`[ 	
\f\r]`,D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Tt=/-->/g,Mt=/>/g,w=RegExp(`>|${lt}(?:([^\\s"'>=/]+)(${lt}*=${lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ht=/'/g,kt=/"/g,Ut=/^(?:script|style|textarea|title)$/i,ut=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),d=ut(1),Ee=ut(2),Ce=ut(3),T=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Lt=new WeakMap,R=P.createTreeWalker(P,129);function Ot(i,e){if(!pt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Pt!==void 0?Pt.createHTML(e):e}var Nt=(i,e)=>{let t=i.length-1,s=[],r,o=e===2?"<svg>":e===3?"<math>":"",n=D;for(let a=0;a<t;a++){let l=i[a],h,u,p=-1,g=0;for(;g<l.length&&(n.lastIndex=g,u=n.exec(l),u!==null);)g=n.lastIndex,n===D?u[1]==="!--"?n=Tt:u[1]!==void 0?n=Mt:u[2]!==void 0?(Ut.test(u[2])&&(r=RegExp("</"+u[2],"g")),n=w):u[3]!==void 0&&(n=w):n===w?u[0]===">"?(n=r??D,p=-1):u[1]===void 0?p=-2:(p=n.lastIndex-u[2].length,h=u[1],n=u[3]===void 0?w:u[3]==='"'?kt:Ht):n===kt||n===Ht?n=w:n===Tt||n===Mt?n=D:(n=w,r=void 0);let v=n===w&&i[a+1].startsWith("/>")?" ":"";o+=n===D?l+ae:p>=0?(s.push(h),l.slice(0,p)+ht+l.slice(p)+b+v):l+b+(p===-2?a:v)}return[Ot(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},q=class i{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let o=0,n=0,a=e.length-1,l=this.parts,[h,u]=Nt(e,t);if(this.el=i.createElement(h,s),R.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=R.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(let p of r.getAttributeNames())if(p.endsWith(ht)){let g=u[n++],v=r.getAttribute(p).split(b),S=/([.?@])?(.*)/.exec(g);l.push({type:1,index:o,name:S[2],strings:v,ctor:S[1]==="."?Y:S[1]==="?"?X:S[1]==="@"?Z:H}),r.removeAttribute(p)}else p.startsWith(b)&&(l.push({type:6,index:o}),r.removeAttribute(p));if(Ut.test(r.tagName)){let p=r.textContent.split(b),g=p.length-1;if(g>0){r.textContent=K?K.emptyScript:"";for(let v=0;v<g;v++)r.append(p[v],j()),R.nextNode(),l.push({type:2,index:++o});r.append(p[g],j())}}}else if(r.nodeType===8)if(r.data===dt)l.push({type:2,index:o});else{let p=-1;for(;(p=r.data.indexOf(b,p+1))!==-1;)l.push({type:7,index:o}),p+=b.length-1}o++}}static createElement(e,t){let s=P.createElement("template");return s.innerHTML=e,s}};function M(i,e,t=i,s){if(e===T)return e;let r=s!==void 0?t._$Co?.[s]:t._$Cl,o=F(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,t,s)),s!==void 0?(t._$Co??=[])[s]=r:t._$Cl=r),r!==void 0&&(e=M(i,r._$AS(i,e.values),r,s)),e}var Q=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,r=(e?.creationScope??P).importNode(t,!0);R.currentNode=r;let o=R.nextNode(),n=0,a=0,l=s[0];for(;l!==void 0;){if(n===l.index){let h;l.type===2?h=new k(o,o.nextSibling,this,e):l.type===1?h=new l.ctor(o,l.name,l.strings,this,e):l.type===6&&(h=new tt(o,this,e)),this._$AV.push(h),l=s[++a]}n!==l?.index&&(o=R.nextNode(),n++)}return R.currentNode=P,r}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},k=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=M(this,e,t),F(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==T&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):It(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&F(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=q.createElement(Ot(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(t);else{let o=new Q(r,this),n=o.u(this.options);o.p(t),this.T(n),this._$AH=o}}_$AC(e){let t=Lt.get(e.strings);return t===void 0&&Lt.set(e.strings,t=new q(e)),t}k(e){pt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,r=0;for(let o of e)r===t.length?t.push(s=new i(this.O(j()),this.O(j()),this,this.options)):s=t[r],s._$AI(o),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=Rt(e).nextSibling;Rt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(e,t=this,s,r){let o=this.strings,n=!1;if(o===void 0)e=M(this,e,t,0),n=!F(e)||e!==this._$AH&&e!==T,n&&(this._$AH=e);else{let a=e,l,h;for(e=o[0],l=0;l<o.length-1;l++)h=M(this,a[s+l],t,l),h===T&&(h=this._$AH[l]),n||=!F(h)||h!==this._$AH[l],h===c?e=c:e!==c&&(e+=(h??"")+o[l+1]),this._$AH[l]=h}n&&!r&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Y=class extends H{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},X=class extends H{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},Z=class extends H{constructor(e,t,s,r,o){super(e,t,s,r,o),this.type=5}_$AI(e,t=this){if((e=M(this,e,t,0)??c)===T)return;let s=this._$AH,r=e===c&&s!==c||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==c&&(s===c||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},tt=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){M(this,e)}},Dt={M:ht,P:b,A:dt,C:1,L:Nt,R:Q,D:It,V:M,I:k,H,N:X,U:Z,B:Y,F:tt},le=ct.litHtmlPolyfillSupport;le?.(q,k),(ct.litHtmlVersions??=[]).push("3.3.3");var jt=(i,e,t)=>{let s=t?.renderBefore??e,r=s._$litPart$;if(r===void 0){let o=t?.renderBefore??null;s._$litPart$=r=new k(e.insertBefore(j(),o),o,void 0,t??{})}return r._$AI(i),r};var _t=globalThis,y=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=jt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return T}};y._$litElement$=!0,y.finalized=!0,_t.litElementHydrateSupport?.({LitElement:y});var ce=_t.litElementPolyfillSupport;ce?.({LitElement:y});(_t.litElementVersions??=[]).push("4.2.2");var L=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};var he={attribute:!0,type:String,converter:N,reflect:!1,hasChanged:J},de=(i=he,e,t)=>{let{kind:s,metadata:r}=t,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(t.name,i),s==="accessor"){let{name:n}=t;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,i,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,i,a),a}}}if(s==="setter"){let{name:n}=t;return function(a){let l=this[n];e.call(this,a),this.requestUpdate(n,l,i,!0,a)}}throw Error("Unsupported decorator location: "+s)};function I(i){return(e,t)=>typeof t=="object"?de(i,e,t):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,e,t)}function m(i){return I({...i,state:!0,attribute:!1})}var{I:us}=Dt;var Ft=i=>i.strings===void 0;var qt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},mt=i=>(...e)=>({_$litDirective$:i,values:e}),st=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var z=(i,e)=>{let t=i._$AN;if(t===void 0)return!1;for(let s of t)s._$AO?.(e,!1),z(s,e);return!0},it=i=>{let e,t;do{if((e=i._$AM)===void 0)break;t=e._$AN,t.delete(i),i=e}while(t?.size===0)},zt=i=>{for(let e;e=i._$AM;i=e){let t=e._$AN;if(t===void 0)e._$AN=t=new Set;else if(t.has(i))break;t.add(i),_e(e)}};function pe(i){this._$AN!==void 0?(it(this),this._$AM=i,zt(this)):this._$AM=i}function ue(i,e=!1,t=0){let s=this._$AH,r=this._$AN;if(r!==void 0&&r.size!==0)if(e)if(Array.isArray(s))for(let o=t;o<s.length;o++)z(s[o],!1),it(s[o]);else s!=null&&(z(s,!1),it(s));else z(this,i)}var _e=i=>{i.type==qt.CHILD&&(i._$AP??=ue,i._$AQ??=pe)},rt=class extends st{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,s){super._$AT(e,t,s),zt(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(z(this,e),it(this))}setValue(e){if(Ft(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}};var Bt=()=>new gt,gt=class{},ft=new WeakMap,Gt=mt(class extends rt{render(i){return c}update(i,[e]){let t=e!==this.G;return t&&this.rt(void 0),(t||this.lt!==this.ct)&&(this.G=e,this.ht=i.options?.host,this.rt(this.ct=i.element)),c}rt(i){if(this.G!==void 0)if(this.isConnected||(i=void 0),typeof this.G=="function"){let e=this.ht??globalThis,t=ft.get(e);t===void 0&&(t=new WeakMap,ft.set(e,t)),t.get(this.G)!==void 0&&this.G.call(this.ht,void 0),t.set(this.G,i),i!==void 0&&this.G.call(this.ht,i)}else this.G.value=i}get lt(){return typeof this.G=="function"?ft.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var me="nanoleaf_ltpdu";async function vt(i,e,t={},s){return(await i.connection.sendMessagePromise({type:"call_service",domain:me,service:e,service_data:t,...s?{target:s}:{},return_response:!0})).response}function Vt(i){return vt(i,"get_scene_capabilities")}function Wt(i){return vt(i,"get_scene_library")}function Jt(i){return vt(i,"list_strips")}function yt(i,e){return(i.motion_styles[e]?.param_fields??[]).map(s=>[s,i.field_ranges[s]])}function $t(i){return i.charAt(0).toUpperCase()+i.slice(1).toLowerCase()}function A(i){if(i instanceof Error||i&&typeof i=="object"&&"message"in i&&typeof i.message=="string")return i.message;try{return JSON.stringify(i)}catch{return String(i)}}function B({hue:i,saturation:e,brightness:t}){let s=e/100,r=t/100,o=r*s,n=(i%360+360)%360/60,a=o*(1-Math.abs(n%2-1)),[l,h,u]=[0,0,0];n<1?[l,h,u]=[o,a,0]:n<2?[l,h,u]=[a,o,0]:n<3?[l,h,u]=[0,o,a]:n<4?[l,h,u]=[0,a,o]:n<5?[l,h,u]=[a,0,o]:[l,h,u]=[o,0,a];let p=r-o,g=S=>Math.round((S+p)*255),v=S=>g(S).toString(16).padStart(2,"0");return`#${v(l)}${v(h)}${v(u)}`}function Kt(i){let e=parseInt(i.slice(1,3),16)/255,t=parseInt(i.slice(3,5),16)/255,s=parseInt(i.slice(5,7),16)/255,r=Math.max(e,t,s),o=Math.min(e,t,s),n=r-o,a=0;n!==0&&(r===e?a=60*((t-s)/n%6):r===t?a=60*((s-e)/n+2):a=60*((e-t)/n+4)),a<0&&(a+=360);let l=r===0?0:n/r,h=r;return{hue:Math.round(a),saturation:Math.round(l*100),brightness:Math.round(h*100)}}var fe=16;function ot(i){return(i.speed??24)/10*1e3}function Qt(i){return(i.delay??0)/10*1e3}function ge(i,e){if(i.length<=1||Math.random()*100<e)return i[0];let t=i.slice(1);return t[Math.floor(Math.random()*t.length)]}var x=class extends y{constructor(){super(...arguments);this.params={};this.colors=[];this._startedAt=0;this._segmentEls=[];this._fadeIndex=0;this._colorAdvanceAt=0;this._tick=()=>{this._animate(performance.now()),this._rafId=requestAnimationFrame(this._tick)}}connectedCallback(){super.connectedCallback(),this._startedAt=performance.now(),this._tick()}disconnectedCallback(){super.disconnectedCallback(),this._rafId!==void 0&&cancelAnimationFrame(this._rafId)}updated(){if(this._renderedStyle!==this.motionStyle){this._renderedStyle=this.motionStyle,this._segmentEls=Array.from(this.shadowRoot?.querySelectorAll(".segment")??[]);let t=performance.now();this._startedAt=t,this._fadeIndex=0,this._currentColor=void 0,this._colorAdvanceAt=t}}_animate(t){if(this.colors.length)switch(this.motionStyle){case"Fade":this._animateFade(t);break;case"Random":this._animateScatter(t,0);break;case"Highlight":this._animateScatter(t,this.params.first_colour_frequency??50);break;case"Flow":this._animateGradientScroll(t,!1);break;case"Stripes":this._animateGradientScroll(t,!0);break}}_applyColorToAllSegments(t){let s=B(t);for(let r of this._segmentEls)r.style.transitionDuration=`${ot(this.params)}ms`,r.style.backgroundColor=s}_animateFade(t){t>=this._colorAdvanceAt&&(this._fadeIndex=(this._fadeIndex+1)%this.colors.length,this._colorAdvanceAt=t+ot(this.params)+Qt(this.params)),this._applyColorToAllSegments(this.colors[this._fadeIndex])}_animateScatter(t,s){(t>=this._colorAdvanceAt||!this._currentColor)&&(this._currentColor=ge(this.colors,s),this._colorAdvanceAt=t+ot(this.params)+Qt(this.params)),this._applyColorToAllSegments(this._currentColor)}_animateGradientScroll(t,s){let r=this._segmentEls[0];if(!r)return;let o=this.colors.map(v=>B(v)),n=s?this._hardStops(o):this._softStops(o);r.style.backgroundImage=`linear-gradient(90deg, ${n})`;let a=s?this._stripeRepeats():1;r.style.backgroundRepeat="repeat",r.style.backgroundSize=`${o.length*100/a}% 100%`;let l=(this.params.direction??0)===0?-1:1,h=ot(this.params)*o.length,p=(t-this._startedAt)%h/h,g=l*p*100;r.style.backgroundPositionX=`${g}%`}_stripeRepeats(){let t=this.params.segment??50;return Math.max(1,Math.round(1+(100-t)/100*6))}_softStops(t){return[...t,t[0]].join(", ")}_hardStops(t){let s=100/t.length,r=[];return t.forEach((o,n)=>{let a=n*s,l=a+s;r.push(`${o} ${a}%`,`${o} ${l}%`)}),r.join(", ")}render(){return this.motionStyle==="Flow"||this.motionStyle==="Stripes"?d`<div class="preview-strip"><div class="segment gradient"></div></div>`:d`
          <div class="preview-strip">
            ${Array.from({length:fe},()=>d`<div class="segment"></div>`)}
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
  `,_([I({attribute:!1})],x.prototype,"motionStyle",2),_([I({attribute:!1})],x.prototype,"params",2),_([I({attribute:!1})],x.prototype,"colors",2),x=_([L("nanoleaf-motion-preview")],x);var bt="nanoleaf_ltpdu",St="Northern Lights",ve={Fade:{speed:24,delay:0,loop:1},Random:{speed:24,delay:0},Highlight:{speed:24,delay:15,first_colour_frequency:80},Flow:{speed:24,delay:0,direction:1,loop:1},Stripes:{speed:24,direction:1,segment:50}};function ye(i){return i.split("_").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}var f=class extends y{constructor(){super(...arguments);this._locallyDeleted=new Set;this._locallySaved=new Set;this._editorParams={};this._editorColors=[];this._editorName="";this._saving=!1;this._loadStarted=!1}static getStubConfig(){return{type:"custom:nanoleaf-scene-card",entity:""}}setConfig(t){if(!t.entity)throw new Error("nanoleaf-scene-card requires an `entity`");this._config=t}getCardSize(){return 6}set hass(t){this._hass=t,this._loadStarted||(this._loadStarted=!0,this._loadCapabilitiesAndLibrary()),this.requestUpdate()}get hass(){return this._hass}async _loadCapabilitiesAndLibrary(){if(this._hass)try{let[t,s]=await Promise.all([Vt(this._hass),Wt(this._hass)]);this._capabilities=t,this._library=s,this._resetEditor()}catch(t){this._loadError=A(t)}}_defaultParamsForStyle(t){let s={},r=ve[t]??{};for(let[o,n]of yt(this._capabilities,t))s[o]=o in r?r[o]:Math.round((n.min+n.max)/2);return s}_resetEditor(){if(!this._capabilities)return;let t=Object.keys(this._capabilities.motion_styles)[0];this._editorStyle=t,this._editorParams=this._defaultParamsForStyle(t),this._editorColors=[{hue:0,saturation:100,brightness:100}],this._editorName="",this._saveError=void 0}_loadRecipeIntoEditor(t){let s=this._library?.recipes[t];s&&(this._editorStyle=$t(s.motion_style),this._editorParams={...s.motion_params},this._editorColors=s.colors.map(r=>({...r})),this._editorName=t,this._saveError=void 0)}_onNameInput(t){this._editorName=t}_onStyleSelect(t){this._editorStyle=t,this._editorParams=this._defaultParamsForStyle(t)}_onParamInput(t,s){this._editorParams={...this._editorParams,[t]:s}}_onColorInput(t,s){let r=[...this._editorColors];r[t]=Kt(s),this._editorColors=r}_addColorSlot(){let t=this._capabilities?.color_slots.max??7;this._editorColors.length>=t||(this._editorColors=[...this._editorColors,{hue:0,saturation:100,brightness:100}])}_removeColorSlot(t){let s=this._capabilities?.color_slots.min??1;this._editorColors.length<=s||(this._editorColors=this._editorColors.filter((r,o)=>o!==t))}_captureSnapshot(){let t=this._config.entity,s=this._hass.states[t];s&&(this._preSnapshot={on:s.state==="on",effect:s.attributes.effect,hsColor:s.attributes.hs_color,brightness:s.attributes.brightness})}async _previewNow(){if(!this._hass||!this._editorStyle)return;this._preSnapshot||this._captureSnapshot();let t=this._config.entity;try{await this._hass.callService(bt,"preview_scene",{motion_style:this._editorStyle.toLowerCase(),motion_params:this._editorParams,colors:this._editorColors},{entity_id:t}),this._previewError=void 0}catch(s){this._previewError=A(s)}}async _cancelPreview(){let t=this._preSnapshot;if(!t||!this._hass)return;let s=this._config.entity;try{if(!t.on)await this._hass.callService("light","turn_off",{entity_id:s});else if(t.effect)await this._hass.callService("light","turn_on",{entity_id:s,effect:t.effect});else{let r={entity_id:s};t.hsColor&&(r.hs_color=t.hsColor),t.brightness!==void 0&&(r.brightness=t.brightness),await this._hass.callService("light","turn_on",r)}this._preSnapshot=void 0,this._previewError=void 0}catch(r){this._previewError=A(r)}}async _saveScene(){let t=this._editorName.trim();if(!this._hass||!this._editorStyle)return;if(!t){this._saveError="Enter a name for the scene.";return}if(t===St){this._saveError=`"${St}" is a reserved factory scene and can't be overwritten.`;return}let s=this._config.entity,r=this._editorStyle.toLowerCase();this._saving=!0;try{await this._hass.callService(bt,"save_scene",{name:t,motion_style:r,motion_params:this._editorParams,colors:this._editorColors},{entity_id:s}),this._saveError=void 0,this._locallySaved=new Set(this._locallySaved).add(t);let o=new Set(this._locallyDeleted);o.delete(t),this._locallyDeleted=o,this._library={recipes:{...this._library?.recipes,[t]:{motion_style:r,motion_params:{...this._editorParams},colors:this._editorColors.map(n=>({...n}))}}}}catch(o){this._saveError=A(o)}finally{this._saving=!1}}async _activateScene(t){let s=this._config.entity;await this._hass.callService("light","turn_on",{entity_id:s,effect:t})}async _deleteScene(t){let s=this._config.entity;this._locallyDeleted=new Set(this._locallyDeleted).add(t);let r=new Set(this._locallySaved),o=new Set(this._locallySaved);o.delete(t),this._locallySaved=o;try{await this._hass.callService(bt,"delete_scene",{name:t},{entity_id:s})}catch(n){let a=new Set(this._locallyDeleted);a.delete(t),this._locallyDeleted=a,this._locallySaved=r,this._loadError=A(n)}}_savedSceneNames(){let t=this._config?.entity,r=(t?this._hass?.states[t]:void 0)?.attributes.effect_list??[],o=new Set([...r,...this._locallySaved]);for(let n of this._locallyDeleted)o.delete(n);return[...o]}render(){if(!this._config||!this._hass)return c;let t=this._config.entity,s=this._hass.states[t],r=this._savedSceneNames(),o=this._library?Object.keys(this._library.recipes):[];return d`
      <ha-card header="Nanoleaf Scene Editor">
        <div class="content">
          ${s?c:d`<p class="error">Entity not found: ${t}</p>`}
          ${this._loadError?d`<p class="error">${this._loadError}</p>`:c}
          ${!this._capabilities&&!this._loadError?d`<p>Loading…</p>`:c}

          <h3>Saved on this device</h3>
          ${r.length===0?d`<p class="muted">No scenes saved yet.</p>`:d`
                <ul class="scene-list">
                  ${r.map(n=>d`
                      <li>
                        <button class="scene-name" @click=${()=>this._activateScene(n)}>${n}</button>
                        ${n===St?c:d`<button class="delete" @click=${()=>this._deleteScene(n)}>✕</button>`}
                      </li>
                    `)}
                </ul>
              `}

          <h3>Scene library</h3>
          ${o.length===0?d`<p class="muted">No scene recipes saved anywhere yet.</p>`:d`
                <ul class="scene-list">
                  ${o.map(n=>{let a=this._library.recipes[n],l=r.includes(n);return d`
                      <li>
                        <span class="scene-name">${n}</span>
                        <span class="muted">(${$t(a.motion_style)}${l?" \xB7 on this device":""})</span>
                        <button class="load" @click=${()=>this._loadRecipeIntoEditor(n)}>Load into editor</button>
                      </li>
                    `})}
                </ul>
              `}

          ${this._capabilities?this._renderEditor():c}
        </div>
      </ha-card>
    `}_renderEditor(){let t=this._capabilities,s=Object.keys(t.motion_styles),r=this._editorStyle?yt(t,this._editorStyle):[],o=t.color_slots.max,n=t.color_slots.min;return d`
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

      ${r.map(([a,l])=>{let h=this._editorParams[a]??l.min,u=l.max-l.min===1,p=t.field_notes[a];return d`
          <label class="field">
            <span>${ye(a)}${p?d`<span class="muted"> — ${p}</span>`:c}</span>
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
                  .value=${B(a)}
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
    `}};f.styles=C`
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
  `,_([m()],f.prototype,"_config",2),_([m()],f.prototype,"_capabilities",2),_([m()],f.prototype,"_library",2),_([m()],f.prototype,"_loadError",2),_([m()],f.prototype,"_locallyDeleted",2),_([m()],f.prototype,"_locallySaved",2),_([m()],f.prototype,"_editorStyle",2),_([m()],f.prototype,"_editorParams",2),_([m()],f.prototype,"_editorColors",2),_([m()],f.prototype,"_editorName",2),_([m()],f.prototype,"_previewError",2),_([m()],f.prototype,"_saveError",2),_([m()],f.prototype,"_saving",2),_([m()],f.prototype,"_preSnapshot",2),f=_([L("nanoleaf-scene-card")],f);var E=class extends y{constructor(){super(...arguments);this._loadStarted=!1;this._cardRef=Bt()}set hass(t){this._hass=t,this._loadStarted||(this._loadStarted=!0,this._loadStrips()),this.requestUpdate()}get hass(){return this._hass}async _loadStrips(){if(this._hass)try{let{strips:t}=await Jt(this._hass);this._strips=t;let s=Object.keys(t);s.length===1&&(this._selected=s[0])}catch(t){this._loadError=A(t)}}_onSelect(t){this._selected=t||void 0}updated(){let t=this._cardRef.value;!t||!this._selected||!this._hass||(t.hass=this._hass,this._cardConfiguredFor!==this._selected&&(t.setConfig({type:"custom:nanoleaf-scene-card",entity:this._selected}),this._cardConfiguredFor=this._selected))}render(){if(!this._hass)return c;if(this._loadError)return d`<div class="content"><p class="error">${this._loadError}</p></div>`;if(!this._strips)return d`<div class="content"><p>Loading…</p></div>`;let t=Object.keys(this._strips);return t.length===0?d`
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
        ${this._selected?d`<nanoleaf-scene-card ${Gt(this._cardRef)}></nanoleaf-scene-card>`:c}
      </div>
    `}};E.styles=C`
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
  `,_([m()],E.prototype,"_strips",2),_([m()],E.prototype,"_selected",2),_([m()],E.prototype,"_loadError",2),E=_([L("nanoleaf-scene-panel")],E);export{E as NanoleafScenePanel};
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
