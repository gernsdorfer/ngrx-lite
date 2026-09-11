import{$ as R$1,$t as fe,A as Ht,Ct as YJ,D as Gn,En as no,Et as Yt,F as KJ,Fn as ro,Ht as bo,It as _o,Jn as xa,Kn as we,Lt as _r,Mn as qZ,Nn as qi,O as Gp,Pn as ree,St as Y,T as GQ,Tn as nF,Ut as br,Vt as bi,W as NC,Wn as w,Xn as ye,Xt as f,Yn as y,Yt as et,Zn as yr,_ as Eo,_n as md,at as Td,bt as Xg,cn as hE,en as fy,er as zp,fn as j,ft as W,in as gn,it as T$1,j as JP,jt as Zs,kn as ov,kt as ZZ,m as Dt,mn as ke,mt as Wi,o as Be,ot as Ut,pn as k0,q as Oo,qn as x,rt as St,sn as hC,st as V,tn as g,tr as zu,tt as S,un as hn,v as Er,w as G,xn as mo}from"./main-QH42444X.js";import"./chunk-CIxtunjg.js";import{t as F}from"./chunk-C-jqF8J0.js";function Tt(a,l){if(a&1){let t=zp();mo(0,`div`,1)(1,`button`,2),_o(`click`,function(){no(t);return ro(Eo().action())}),k0(2),bi()()}if(a&2){let t=Eo();hn(2),Gp(` `,t.data.action,` `)}}var Rt=[`label`];function It(a,l){}var Nt=Math.pow(2,31)-1;var _=class{_overlayRef;instance;containerInstance;_afterDismissed=new T$1;_afterOpened=new T$1;_onAction=new T$1;_durationTimeoutId;_dismissedByAction=!1;constructor(l,t){this._overlayRef=t,this.containerInstance=l,l._onExit.subscribe(()=>this._finishDismiss())}dismiss(){this._afterDismissed.closed||this.containerInstance.exit(),clearTimeout(this._durationTimeoutId)}dismissWithAction(){this._onAction.closed||(this._dismissedByAction=!0,this._onAction.next(),this._onAction.complete(),this.dismiss()),clearTimeout(this._durationTimeoutId)}closeWithAction(){this.dismissWithAction()}_dismissAfter(l){this._durationTimeoutId=setTimeout(()=>this.dismiss(),Math.min(l,Nt))}_open(){this._afterOpened.closed||(this._afterOpened.next(),this._afterOpened.complete())}_finishDismiss(){this._overlayRef.dispose(),this._onAction.closed||this._onAction.complete(),this._afterDismissed.next({dismissedByAction:this._dismissedByAction}),this._afterDismissed.complete(),this._dismissedByAction=!1}afterDismissed(){return this._afterDismissed}afterOpened(){return this.containerInstance._onEnter}onAction(){return this._onAction}};var xt=new g(`MatSnackBarData`);var d=class{politeness=`polite`;announcementMessage=``;viewContainerRef;duration=0;panelClass;direction;data=null;horizontalPosition=`center`;verticalPosition=`bottom`};var Ot=(()=>{class a{static ɵfac=function(e){return new(e||a)};static ɵdir=we({type:a,selectors:[[``,`matSnackBarLabel`,``]],hostAttrs:[1,`mat-mdc-snack-bar-label`,`mdc-snackbar__label`]})}return a})();var Pt=(()=>{class a{static ɵfac=function(e){return new(e||a)};static ɵdir=we({type:a,selectors:[[``,`matSnackBarActions`,``]],hostAttrs:[1,`mat-mdc-snack-bar-actions`,`mdc-snackbar__actions`]})}return a})();var jt=(()=>{class a{static ɵfac=function(e){return new(e||a)};static ɵdir=we({type:a,selectors:[[``,`matSnackBarAction`,``]],hostAttrs:[1,`mat-mdc-snack-bar-action`,`mdc-snackbar__action`]})}return a})();var Bt=(()=>{class a{snackBarRef=f(_);data=f(xt);action(){this.snackBarRef.dismissWithAction()}get hasAction(){return!!this.data.action}static ɵfac=function(e){return new(e||a)};static ɵcmp=ke({type:a,selectors:[[`simple-snack-bar`]],hostAttrs:[1,`mat-mdc-simple-snack-bar`],exportAs:[`matSnackBar`],decls:3,vars:2,consts:[[`matSnackBarLabel`,``],[`matSnackBarActions`,``],[`matButton`,``,`matSnackBarAction`,``,3,`click`]],template:function(e,n){e&1&&(mo(0,`div`,0),k0(1),bi(),yr(2,Tt,3,1,`div`,1)),e&2&&(hn(),Gp(` `,n.data.message,`
`),hn(),br(n.hasAction?2:-1))},dependencies:[YJ,Ot,Pt,jt],styles:[`.mat-mdc-simple-snack-bar {
  display: flex;
}
.mat-mdc-simple-snack-bar .mat-mdc-snack-bar-label {
  max-height: 50vh;
  overflow: auto;
}
`],encapsulation:2})}return a})();var T=`_mat-snack-bar-enter`;var R=`_mat-snack-bar-exit`;var Ft=(()=>{class a extends md{_ngZone=f(R$1);_elementRef=f(fe);_changeDetectorRef=f(gn);_platform=f(Be);_animationsDisabled=Gn();snackBarConfig=f(d);_document=f(j);_trackedModals=new Set;_enterFallback;_exitFallback;_injector=f(V);_announceDelay=150;_announceTimeoutId;_destroyed=!1;_portalOutlet;_onAnnounce=new T$1;_onExit=new T$1;_onEnter=new T$1;_animationState=`void`;_live;_label;_role;_liveElementId=f(Oo).getId(`mat-snack-bar-container-live-`);constructor(){super();let t=this.snackBarConfig;t.politeness===`assertive`&&!t.announcementMessage?this._live=`assertive`:t.politeness===`off`?this._live=`off`:this._live=`polite`,this._platform.FIREFOX&&(this._live===`polite`&&(this._role=`status`),this._live===`assertive`&&(this._role=`alert`))}attachComponentPortal(t){this._assertNotAttached();let e=this._portalOutlet.attachComponentPortal(t);return this._afterPortalAttached(),e}attachTemplatePortal(t){this._assertNotAttached();let e=this._portalOutlet.attachTemplatePortal(t);return this._afterPortalAttached(),e}attachDomPortal=t=>{this._assertNotAttached();let e=this._portalOutlet.attachDomPortal(t);return this._afterPortalAttached(),e};onAnimationEnd(t){t===R?this._completeExit():t===T&&(clearTimeout(this._enterFallback),this._ngZone.run(()=>{this._onEnter.next(),this._onEnter.complete()}))}enter(){this._destroyed||(this._animationState=`visible`,this._changeDetectorRef.markForCheck(),this._changeDetectorRef.detectChanges(),this._screenReaderAnnounce(),this._animationsDisabled?Ht(()=>{this._ngZone.run(()=>queueMicrotask(()=>this.onAnimationEnd(T)))},{injector:this._injector}):(clearTimeout(this._enterFallback),this._enterFallback=setTimeout(()=>{this._elementRef.nativeElement.classList.add(`mat-snack-bar-fallback-visible`),this.onAnimationEnd(T)},200)))}exit(){return this._destroyed?w(void 0):(this._ngZone.run(()=>{this._animationState=`hidden`,this._changeDetectorRef.markForCheck(),this._elementRef.nativeElement.setAttribute(`mat-exit`,``),clearTimeout(this._announceTimeoutId),this._animationsDisabled?Ht(()=>{this._ngZone.run(()=>queueMicrotask(()=>this.onAnimationEnd(R)))},{injector:this._injector}):(clearTimeout(this._exitFallback),this._exitFallback=setTimeout(()=>this.onAnimationEnd(R),200))}),this._onExit)}ngOnDestroy(){this._destroyed=!0,this._clearFromModals(),this._completeExit()}_completeExit(){clearTimeout(this._exitFallback),queueMicrotask(()=>{this._onExit.next(),this._onExit.complete()})}_afterPortalAttached(){let t=this._elementRef.nativeElement,e=this.snackBarConfig.panelClass;e&&(Array.isArray(e)?e.forEach(o=>t.classList.add(o)):t.classList.add(e)),this._exposeToModals();let n=this._label.nativeElement,i=`mdc-snackbar__label`;n.classList.toggle(i,!n.querySelector(`.${i}`))}_exposeToModals(){let t=this._liveElementId,e=this._document.querySelectorAll(`body > .cdk-overlay-container [aria-modal="true"]`);for(let n=0;n<e.length;n++){let i=e[n],o=i.getAttribute(`aria-owns`);this._trackedModals.add(i),o?o.indexOf(t)===-1&&i.setAttribute(`aria-owns`,o+` `+t):i.setAttribute(`aria-owns`,t)}}_clearFromModals(){this._trackedModals.forEach(t=>{let e=t.getAttribute(`aria-owns`);if(e){let n=e.replace(this._liveElementId,``).trim();n.length>0?t.setAttribute(`aria-owns`,n):t.removeAttribute(`aria-owns`)}}),this._trackedModals.clear()}_assertNotAttached(){this._portalOutlet.hasAttached()}_screenReaderAnnounce(){this._announceTimeoutId||this._ngZone.runOutsideAngular(()=>{this._announceTimeoutId=setTimeout(()=>{if(this._destroyed)return;let t=this._elementRef.nativeElement,e=t.querySelector(`[aria-hidden]`),n=t.querySelector(`[aria-live]`);if(e&&n){let i=null;this._platform.isBrowser&&document.activeElement instanceof HTMLElement&&e.contains(document.activeElement)&&(i=document.activeElement),e.removeAttribute(`aria-hidden`),n.appendChild(e),i?.focus(),this._onAnnounce.next(),this._onAnnounce.complete()}},this._announceDelay)})}static ɵfac=function(e){return new(e||a)};static ɵcmp=ke({type:a,selectors:[[`mat-snack-bar-container`]],viewQuery:function(e,n){if(e&1&&Zs(ree,7)(Rt,7),e&2){let i;_r(i=Er())&&(n._portalOutlet=i.first),_r(i=Er())&&(n._label=i.first)}},hostAttrs:[1,`mdc-snackbar`,`mat-mdc-snack-bar-container`],hostVars:6,hostBindings:function(e,n){e&1&&_o(`animationend`,function(o){return n.onAnimationEnd(o.animationName)})(`animationcancel`,function(o){return n.onAnimationEnd(o.animationName)}),e&2&&et(`mat-snack-bar-container-enter`,n._animationState===`visible`)(`mat-snack-bar-container-exit`,n._animationState===`hidden`)(`mat-snack-bar-container-animations-enabled`,!n._animationsDisabled)},features:[Dt],decls:6,vars:3,consts:[[`label`,``],[1,`mdc-snackbar__surface`,`mat-mdc-snackbar-surface`],[1,`mat-mdc-snack-bar-label`],[`aria-hidden`,`true`],[`cdkPortalOutlet`,``]],template:function(e,n){e&1&&(mo(0,`div`,1)(1,`div`,2,0)(3,`div`,3),hE(4,It,0,0,`ng-template`,4),bi(),bo(5,`div`),bi()()),e&2&&(hn(5),St(`aria-live`,n._live)(`role`,n._role)(`id`,n._liveElementId))},dependencies:[ree],styles:[`@keyframes _mat-snack-bar-enter {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes _mat-snack-bar-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-snack-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  margin: 8px;
}
.mat-mdc-snack-bar-handset .mat-mdc-snack-bar-container {
  width: 100vw;
}

.mat-snack-bar-container-animations-enabled {
  opacity: 0;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-fallback-visible {
  opacity: 1;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-enter {
  animation: _mat-snack-bar-enter 150ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-exit {
  animation: _mat-snack-bar-exit 75ms cubic-bezier(0.4, 0, 1, 1) forwards;
}

.mat-mdc-snackbar-surface {
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 8px;
}
[dir=rtl] .mat-mdc-snackbar-surface {
  padding-right: 0;
  padding-left: 8px;
}
.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface {
  min-width: 344px;
  max-width: 672px;
}
.mat-mdc-snack-bar-handset .mat-mdc-snackbar-surface {
  width: 100%;
  min-width: 0;
}
@media (forced-colors: active) {
  .mat-mdc-snackbar-surface {
    outline: solid 1px;
  }
}
.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface {
  color: var(--%NS%mat-snack-bar-supporting-text-color, var(--%NS%mat-sys-inverse-on-surface));
  border-radius: var(--%NS%mat-snack-bar-container-shape, var(--%NS%mat-sys-corner-extra-small));
  background-color: var(--%NS%mat-snack-bar-container-color, var(--%NS%mat-sys-inverse-surface));
}

.mdc-snackbar__label {
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  margin: 0;
  padding: 14px 8px 14px 16px;
}
[dir=rtl] .mdc-snackbar__label {
  padding-left: 8px;
  padding-right: 16px;
}
.mat-mdc-snack-bar-container .mdc-snackbar__label {
  font-family: var(--%NS%mat-snack-bar-supporting-text-font, var(--%NS%mat-sys-body-medium-font));
  font-size: var(--%NS%mat-snack-bar-supporting-text-size, var(--%NS%mat-sys-body-medium-size));
  font-weight: var(--%NS%mat-snack-bar-supporting-text-weight, var(--%NS%mat-sys-body-medium-weight));
  line-height: var(--%NS%mat-snack-bar-supporting-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
}

.mat-mdc-snack-bar-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  box-sizing: border-box;
}

.mat-mdc-snack-bar-handset,
.mat-mdc-snack-bar-container,
.mat-mdc-snack-bar-label {
  flex: 1 1 auto;
}

.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled).mat-unthemed {
  color: var(--%NS%mat-snack-bar-button-color, var(--%NS%mat-sys-inverse-primary));
}
.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) {
  --%NS%mat-button-text-state-layer-color: currentColor;
  --%NS%mat-button-text-ripple-color: currentColor;
}
.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element {
  opacity: 0.1;
}
`],encapsulation:2,changeDetection:1})}return a})();var Lt=new g(`mat-snack-bar-default-options`,{providedIn:`root`,factory:()=>new d});var I=(()=>{class a{_live=f(nF);_injector=f(V);_breakpointObserver=f(JP);_parentSnackBar=f(a,{optional:!0,skipSelf:!0});_defaultConfig=f(Lt);_animationsDisabled=Gn();_snackBarRefAtThisLevel=null;simpleSnackBarComponent=Bt;snackBarContainerComponent=Ft;handsetCssClass=`mat-mdc-snack-bar-handset`;get _openedSnackBarRef(){let t=this._parentSnackBar;return t?t._openedSnackBarRef:this._snackBarRefAtThisLevel}set _openedSnackBarRef(t){this._parentSnackBar?this._parentSnackBar._openedSnackBarRef=t:this._snackBarRefAtThisLevel=t}openFromComponent(t,e){return this._attach(t,e)}openFromTemplate(t,e){return this._attach(t,e)}open(t,e=``,n){let i=y(y({},this._defaultConfig),n);return i.data={message:t,action:e},i.announcementMessage===t&&(i.announcementMessage=void 0),this.openFromComponent(this.simpleSnackBarComponent,i)}dismiss(){this._openedSnackBarRef&&this._openedSnackBarRef.dismiss()}ngOnDestroy(){this._snackBarRefAtThisLevel&&this._snackBarRefAtThisLevel.dismiss()}_attachSnackBarContainer(t,e){let n=e&&e.viewContainerRef&&e.viewContainerRef.injector,i=V.create({parent:n||this._injector,providers:[{provide:d,useValue:e}]}),o=new Xg(this.snackBarContainerComponent,e.viewContainerRef,i),s=t.attach(o);return s.instance.snackBarConfig=e,s.instance}_attach(t,e){let n=y(y(y({},new d),this._defaultConfig),e),i=this._createOverlay(n),o=this._attachSnackBarContainer(i,n),s=new _(o,i);if(t instanceof Ut){let f=new Wi(t,null,{$implicit:n.data,snackBarRef:s});s.instance=o.attachTemplatePortal(f)}else{let wt=new Xg(t,void 0,this._createInjector(n,s));s.instance=o.attachComponentPortal(wt).instance}return this._breakpointObserver.observe(GQ.HandsetPortrait).pipe(Y(i.detachments())).subscribe(f=>{i.overlayElement.classList.toggle(this.handsetCssClass,f.matches)}),n.announcementMessage&&o._onAnnounce.subscribe(()=>{this._live.announce(n.announcementMessage,n.politeness)}),this._animateSnackBar(s,n),this._openedSnackBarRef=s,this._openedSnackBarRef}_animateSnackBar(t,e){t.afterDismissed().subscribe(()=>{this._openedSnackBarRef==t&&(this._openedSnackBarRef=null),e.announcementMessage&&this._live.clear()}),e.duration&&e.duration>0&&t.afterOpened().subscribe(()=>t._dismissAfter(e.duration)),this._openedSnackBarRef?(this._openedSnackBarRef.afterDismissed().subscribe(()=>{t.containerInstance.enter()}),this._openedSnackBarRef.dismiss()):t.containerInstance.enter()}_createOverlay(t){let e=new qi;e.direction=t.direction;let n=NC(this._injector),i=t.direction===`rtl`,o=t.horizontalPosition===`left`||t.horizontalPosition===`start`&&!i||t.horizontalPosition===`end`&&i,s=!o&&t.horizontalPosition!==`center`;return o?n.left(`0`):s?n.right(`0`):n.centerHorizontally(),t.verticalPosition===`top`?n.top(`0`):n.bottom(`0`),e.positionStrategy=n,e.disableAnimations=this._animationsDisabled,Td(this._injector,e)}_createInjector(t,e){let n=t&&t.viewContainerRef&&t.viewContainerRef.injector;return V.create({parent:n||this._injector,providers:[{provide:_,useValue:e},{provide:xt,useValue:t.data}]})}static ɵfac=function(e){return new(e||a)};static ɵprov=x({token:a,factory:a.ɵfac})}return a})();var Ct=(()=>{class a{static ɵfac=function(e){return new(e||a)};static ɵmod=G({type:a});static ɵinj=W({providers:[I],imports:[ov,hC,KJ,Bt,Yt]})}return a})();var Mt=(()=>{class a{constructor(){this.actions$=f(xa),this.snackbar=f(I),this.logActions$=qZ(()=>this.actions$.pipe(zu(F),ye(({payload:t})=>this.snackbar.open(`counter increment: ${t.counter}`,void 0,{horizontalPosition:`center`,verticalPosition:`top`,panelClass:`snackbar`,duration:2e3}))),{dispatch:!1})}static{this.ɵfac=function(e){return new(e||a)}}static{this.ɵprov=S({token:a,factory:a.ɵfac})}}return a})();var be=[{path:``,loadComponent:()=>import(`./chunk-DGGhK-yP.js`),providers:[fy(Ct,ZZ.forFeature([Mt]))]}];export{be as default};