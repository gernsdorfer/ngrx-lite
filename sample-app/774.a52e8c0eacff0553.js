"use strict";(self.webpackChunksample_app=self.webpackChunksample_app||[]).push([[774],{8774:(x,f,c)=>{c.r(f),c.d(f,{StorageFromServiceComponent:()=>_});var i=c(4115),t=c(5e3);let g=(()=>{class n{constructor(r){this.storeFactory=r,this.store=this.storeFactory.createComponentStore({storeName:"SERVICE_COUNTER",defaultState:{counter:0}}),this.counterState$=this.store.state$}increment(){this.store.patchState(({counter:r})=>({counter:r+1}),"INCREMENT")}ngOnDestroy(){this.store.ngOnDestroy()}}return n.\u0275fac=function(r){return new(r||n)(t.LFG(i.Cn))},n.\u0275prov=t.Yz7({token:n,factory:n.\u0275fac,providedIn:"any"}),n})();var d=c(7423),l=c(9808),C=c(5494);function v(n,m){if(1&n){const r=t.EpF();t.ynx(0),t.TgZ(1,"my-app-ui-card")(2,"div",1),t._uU(3,"Component-Store"),t.qZA(),t.TgZ(4,"div",2),t._uU(5),t.qZA(),t.TgZ(6,"div",3)(7,"h2",4),t._uU(8),t.qZA()(),t.TgZ(9,"div",5)(10,"button",6),t.NdJ("click",function(){t.CHM(r);const y=t.oxw();return t.KtG(y.increment())}),t._uU(11,"+"),t.qZA()()(),t.BQk()}if(2&n){const r=m.ngIf,s=t.oxw();t.xp6(5),t.hij("Same Instance (",s.title,")"),t.xp6(3),t.Oqu(r.counter)}}let u=(()=>{class n{constructor(r){this.counterStore=r,this.title="Demo A Component",this.counterState$=this.counterStore.counterState$}increment(){this.counterStore.increment()}}return n.\u0275fac=function(r){return new(r||n)(t.Y36(g))},n.\u0275cmp=t.Xpm({type:n,selectors:[["my-app-same-instance-demo-a"]],standalone:!0,features:[t.jDz],decls:2,vars:3,consts:[[4,"ngIf"],["title",""],["subtitle",""],["content",""],[1,"counter"],["actions",""],["mat-fab","",1,"increment",3,"click"]],template:function(r,s){1&r&&(t.YNc(0,v,12,2,"ng-container",0),t.ALo(1,"async")),2&r&&t.Q6J("ngIf",t.lcZ(1,1,s.counterState$))},dependencies:[C.o,d.ot,d.lW,l.ez,l.O5,l.Ov],encapsulation:2}),n})();function M(n,m){if(1&n){const r=t.EpF();t.ynx(0),t.TgZ(1,"my-app-ui-card")(2,"div",1),t._uU(3,"Component-Store"),t.qZA(),t.TgZ(4,"div",2),t._uU(5),t.qZA(),t.TgZ(6,"div",3)(7,"h2",4),t._uU(8),t.qZA()(),t.TgZ(9,"div",5)(10,"button",6),t.NdJ("click",function(){t.CHM(r);const y=t.oxw();return t.KtG(y.increment())}),t._uU(11,"+"),t.qZA()()(),t.BQk()}if(2&n){const r=m.ngIf,s=t.oxw();t.xp6(5),t.hij("Same Instance (",s.title,")"),t.xp6(3),t.Oqu(r.counter)}}let p=(()=>{class n{constructor(r){this.counterStore=r,this.title="Demo B Component",this.counterState$=this.counterStore.counterState$}increment(){this.counterStore.increment()}}return n.\u0275fac=function(r){return new(r||n)(t.Y36(g))},n.\u0275cmp=t.Xpm({type:n,selectors:[["my-app-same-instance-demo-b"]],standalone:!0,features:[t.jDz],decls:2,vars:3,consts:[[4,"ngIf"],["title",""],["subtitle",""],["content",""],[1,"counter"],["actions",""],["mat-fab","",1,"increment",3,"click"]],template:function(r,s){1&r&&(t.YNc(0,M,12,2,"ng-container",0),t.ALo(1,"async")),2&r&&t.Q6J("ngIf",t.lcZ(1,1,s.counterState$))},dependencies:[C.o,d.ot,d.lW,l.ez,l.O5,l.Ov],encapsulation:2}),n})(),_=(()=>{class n{}return n.\u0275fac=function(r){return new(r||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["my-app-service-counter"]],standalone:!0,features:[t._Bn([g]),t.jDz],decls:5,vars:0,template:function(r,s){1&r&&(t.TgZ(0,"h1"),t._uU(1,"Share Store to ChildComponents"),t.qZA(),t._UZ(2,"my-app-same-instance-demo-a")(3,"br")(4,"my-app-same-instance-demo-b"))},dependencies:[u,p],encapsulation:2}),n})()},5494:(x,f,c)=>{c.d(f,{o:()=>v});var i=c(9224),t=c(2181),g=c(7423),d=c(5e3);const l=[[["","title",""]],[["","subtitle",""]],[["","content",""]],[["","actions",""]]],C=["[title]","[subtitle]","[content]","[actions]"];let v=(()=>{class u{}return u.\u0275fac=function(p){return new(p||u)},u.\u0275cmp=d.Xpm({type:u,selectors:[["my-app-ui-card"]],standalone:!0,features:[d.jDz],ngContentSelectors:C,decls:10,vars:0,consts:[[1,"demo-card"]],template:function(p,_){1&p&&(d.F$t(l),d.TgZ(0,"mat-card",0)(1,"mat-card-header")(2,"mat-card-title"),d.Hsn(3),d.qZA(),d.TgZ(4,"mat-card-subtitle"),d.Hsn(5,1),d.qZA()(),d.TgZ(6,"mat-card-content"),d.Hsn(7,2),d.qZA(),d.TgZ(8,"mat-card-actions"),d.Hsn(9,3),d.qZA()())},dependencies:[i.QW,i.a8,i.dk,i.dn,i.n5,i.$j,i.hq,t.Tx,g.ot],styles:[".demo-card[_ngcontent-%COMP%]{max-width:400px}"]}),u})()},9224:(x,f,c)=>{c.d(f,{$j:()=>_,QW:()=>A,a8:()=>D,dk:()=>b,dn:()=>M,hq:()=>n,n5:()=>p});var i=c(5e3),t=c(508);const g=["*",[["mat-card-footer"]]],d=["*","mat-card-footer"],l=[[["","mat-card-avatar",""],["","matCardAvatar",""]],[["mat-card-title"],["mat-card-subtitle"],["","mat-card-title",""],["","mat-card-subtitle",""],["","matCardTitle",""],["","matCardSubtitle",""]],"*"],C=["[mat-card-avatar], [matCardAvatar]","mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]","*"];let M=(()=>{class a{}return a.\u0275fac=function(o){return new(o||a)},a.\u0275dir=i.lG2({type:a,selectors:[["mat-card-content"],["","mat-card-content",""],["","matCardContent",""]],hostAttrs:[1,"mat-card-content"]}),a})(),p=(()=>{class a{}return a.\u0275fac=function(o){return new(o||a)},a.\u0275dir=i.lG2({type:a,selectors:[["mat-card-title"],["","mat-card-title",""],["","matCardTitle",""]],hostAttrs:[1,"mat-card-title"]}),a})(),_=(()=>{class a{}return a.\u0275fac=function(o){return new(o||a)},a.\u0275dir=i.lG2({type:a,selectors:[["mat-card-subtitle"],["","mat-card-subtitle",""],["","matCardSubtitle",""]],hostAttrs:[1,"mat-card-subtitle"]}),a})(),n=(()=>{class a{constructor(){this.align="start"}}return a.\u0275fac=function(o){return new(o||a)},a.\u0275dir=i.lG2({type:a,selectors:[["mat-card-actions"]],hostAttrs:[1,"mat-card-actions"],hostVars:2,hostBindings:function(o,h){2&o&&i.ekj("mat-card-actions-align-end","end"===h.align)},inputs:{align:"align"},exportAs:["matCardActions"]}),a})(),D=(()=>{class a{constructor(o){this._animationMode=o}}return a.\u0275fac=function(o){return new(o||a)(i.Y36(i.QbO,8))},a.\u0275cmp=i.Xpm({type:a,selectors:[["mat-card"]],hostAttrs:[1,"mat-card","mat-focus-indicator"],hostVars:2,hostBindings:function(o,h){2&o&&i.ekj("_mat-animation-noopable","NoopAnimations"===h._animationMode)},exportAs:["matCard"],ngContentSelectors:d,decls:2,vars:0,template:function(o,h){1&o&&(i.F$t(g),i.Hsn(0),i.Hsn(1,1))},styles:[".mat-card{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:block;position:relative;padding:16px;border-radius:4px}.mat-card._mat-animation-noopable{transition:none !important;animation:none !important}.mat-card>.mat-divider-horizontal{position:absolute;left:0;width:100%}[dir=rtl] .mat-card>.mat-divider-horizontal{left:auto;right:0}.mat-card>.mat-divider-horizontal.mat-divider-inset{position:static;margin:0}[dir=rtl] .mat-card>.mat-divider-horizontal.mat-divider-inset{margin-right:0}.cdk-high-contrast-active .mat-card{outline:solid 1px}.mat-card-actions,.mat-card-subtitle,.mat-card-content{display:block;margin-bottom:16px}.mat-card-title{display:block;margin-bottom:8px}.mat-card-actions{margin-left:-8px;margin-right:-8px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 32px);margin:0 -16px 16px -16px;display:block;overflow:hidden}.mat-card-image img{width:100%}.mat-card-footer{display:block;margin:0 -16px -16px -16px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button,.mat-card-actions .mat-stroked-button{margin:0 8px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header .mat-card-title{margin-bottom:12px}.mat-card-header-text{margin:0 16px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;object-fit:cover}.mat-card-title-group{display:flex;justify-content:space-between}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-title-group>.mat-card-xl-image{margin:-8px 0 8px}@media(max-width: 599px){.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}}.mat-card>:first-child,.mat-card-content>:first-child{margin-top:0}.mat-card>:last-child:not(.mat-card-footer),.mat-card-content>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-16px;border-top-left-radius:inherit;border-top-right-radius:inherit}.mat-card>.mat-card-actions:last-child{margin-bottom:-8px;padding-bottom:0}.mat-card-actions:not(.mat-card-actions-align-end) .mat-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-raised-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-stroked-button:first-child{margin-left:0;margin-right:0}.mat-card-actions-align-end .mat-button:last-child,.mat-card-actions-align-end .mat-raised-button:last-child,.mat-card-actions-align-end .mat-stroked-button:last-child{margin-left:0;margin-right:0}.mat-card-title:not(:first-child),.mat-card-subtitle:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}"],encapsulation:2,changeDetection:0}),a})(),b=(()=>{class a{}return a.\u0275fac=function(o){return new(o||a)},a.\u0275cmp=i.Xpm({type:a,selectors:[["mat-card-header"]],hostAttrs:[1,"mat-card-header"],ngContentSelectors:C,decls:4,vars:0,consts:[[1,"mat-card-header-text"]],template:function(o,h){1&o&&(i.F$t(l),i.Hsn(0),i.TgZ(1,"div",0),i.Hsn(2,1),i.qZA(),i.Hsn(3,2))},encapsulation:2,changeDetection:0}),a})(),A=(()=>{class a{}return a.\u0275fac=function(o){return new(o||a)},a.\u0275mod=i.oAB({type:a}),a.\u0275inj=i.cJS({imports:[t.BQ,t.BQ]}),a})()}}]);