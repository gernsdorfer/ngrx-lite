"use strict";(self.webpackChunksample_app=self.webpackChunksample_app||[]).push([[680],{9680:(x,f,d)=>{d.r(f),d.d(f,{MultipleInstancesComponent:()=>D});var t=d(5e3),C=d(4115);const p=new t.OlP("MULTIPLE_COUNTER");let i=(()=>{class o{constructor(n,m){this.storeFactory=n,this.storeName=m,this.store=this.storeFactory.createComponentStore({storeName:this.storeName||"MULTIPLE_COUNTER_STORE",defaultState:{counter:0}}),this.counterState$=this.store.state$}increment(){this.store.patchState(({counter:n})=>({counter:n+1}),"INCREMENT")}ngOnDestroy(){this.store.ngOnDestroy()}}return o.\u0275fac=function(n){return new(n||o)(t.LFG(C.Cn),t.LFG(p,8))},o.\u0275prov=t.Yz7({token:o,factory:o.\u0275fac,providedIn:"any"}),o})();var l=d(7423),s=d(9808),v=d(5494);function u(o,c){if(1&o){const n=t.EpF();t.ynx(0),t.TgZ(1,"my-app-ui-card")(2,"div",1),t._uU(3,"Component-Store"),t.qZA(),t.TgZ(4,"div",2),t._uU(5),t.qZA(),t.TgZ(6,"div",3)(7,"h2",4),t._uU(8),t.qZA()(),t.TgZ(9,"div",5)(10,"button",6),t.NdJ("click",function(){t.CHM(n);const y=t.oxw();return t.KtG(y.increment())}),t._uU(11,"+"),t.qZA()()(),t.BQk()}if(2&o){const n=c.ngIf,m=t.oxw();t.xp6(5),t.hij("Multiple Instance (",m.title,")"),t.xp6(3),t.Oqu(n.counter)}}let M=(()=>{class o{constructor(n){this.counterStore=n,this.title="Demo A Component",this.counterState$=this.counterStore.counterState$}increment(){this.counterStore.increment()}ngOnDestroy(){this.counterStore.ngOnDestroy()}}return o.\u0275fac=function(n){return new(n||o)(t.Y36(i))},o.\u0275cmp=t.Xpm({type:o,selectors:[["my-app-multi-instance-demo-a"]],standalone:!0,features:[t._Bn([i,{provide:p,useValue:"DemoAComponentStore"}]),t.jDz],decls:2,vars:3,consts:[[4,"ngIf"],["title",""],["subtitle",""],["content",""],[1,"counter"],["actions",""],["mat-fab","",1,"increment",3,"click"]],template:function(n,m){1&n&&(t.YNc(0,u,12,2,"ng-container",0),t.ALo(1,"async")),2&n&&t.Q6J("ngIf",t.lcZ(1,1,m.counterState$))},dependencies:[v.o,l.ot,l.lW,s.ez,s.O5,s.Ov],encapsulation:2}),o})();function g(o,c){if(1&o){const n=t.EpF();t.ynx(0),t.TgZ(1,"my-app-ui-card")(2,"div",1),t._uU(3,"Component-Store"),t.qZA(),t.TgZ(4,"div",2),t._uU(5),t.qZA(),t.TgZ(6,"div",3)(7,"h2",4),t._uU(8),t.qZA()(),t.TgZ(9,"div",5)(10,"button",6),t.NdJ("click",function(){t.CHM(n);const y=t.oxw();return t.KtG(y.increment())}),t._uU(11,"+"),t.qZA()()(),t.BQk()}if(2&o){const n=c.ngIf,m=t.oxw();t.xp6(5),t.hij("Multiple Instance (",m.title,")"),t.xp6(3),t.Oqu(n.counter)}}let _=(()=>{class o{constructor(n){this.counterStore=n,this.title="Demo B Component",this.counterState$=this.counterStore.counterState$}increment(){this.counterStore.increment()}ngOnDestroy(){this.counterStore.ngOnDestroy()}}return o.\u0275fac=function(n){return new(n||o)(t.Y36(i))},o.\u0275cmp=t.Xpm({type:o,selectors:[["my-app-multi-instance-demo-b"]],standalone:!0,features:[t._Bn([i,{provide:p,useValue:"DemoBComponentStore"}]),t.jDz],decls:2,vars:3,consts:[[4,"ngIf"],["title",""],["subtitle",""],["content",""],[1,"counter"],["actions",""],["mat-fab","",1,"increment",3,"click"]],template:function(n,m){1&n&&(t.YNc(0,g,12,2,"ng-container",0),t.ALo(1,"async")),2&n&&t.Q6J("ngIf",t.lcZ(1,1,m.counterState$))},dependencies:[v.o,l.ot,l.lW,s.ez,s.O5,s.Ov],encapsulation:2}),o})(),D=(()=>{class o{}return o.\u0275fac=function(n){return new(n||o)},o.\u0275cmp=t.Xpm({type:o,selectors:[["my-app-multi-instance"]],standalone:!0,features:[t.jDz],decls:5,vars:0,template:function(n,m){1&n&&(t.TgZ(0,"h1"),t._uU(1,"Multiple Store instances"),t.qZA(),t._UZ(2,"my-app-multi-instance-demo-a")(3,"br")(4,"my-app-multi-instance-demo-b"))},dependencies:[M,_],encapsulation:2}),o})()},5494:(x,f,d)=>{d.d(f,{o:()=>v});var t=d(9224),C=d(2181),p=d(7423),i=d(5e3);const l=[[["","title",""]],[["","subtitle",""]],[["","content",""]],[["","actions",""]]],s=["[title]","[subtitle]","[content]","[actions]"];let v=(()=>{class u{}return u.\u0275fac=function(g){return new(g||u)},u.\u0275cmp=i.Xpm({type:u,selectors:[["my-app-ui-card"]],standalone:!0,features:[i.jDz],ngContentSelectors:s,decls:10,vars:0,consts:[[1,"demo-card"]],template:function(g,_){1&g&&(i.F$t(l),i.TgZ(0,"mat-card",0)(1,"mat-card-header")(2,"mat-card-title"),i.Hsn(3),i.qZA(),i.TgZ(4,"mat-card-subtitle"),i.Hsn(5,1),i.qZA()(),i.TgZ(6,"mat-card-content"),i.Hsn(7,2),i.qZA(),i.TgZ(8,"mat-card-actions"),i.Hsn(9,3),i.qZA()())},dependencies:[t.QW,t.a8,t.dk,t.dn,t.n5,t.$j,t.hq,C.Tx,p.ot],styles:[".demo-card[_ngcontent-%COMP%]{max-width:400px}"]}),u})()},9224:(x,f,d)=>{d.d(f,{$j:()=>_,QW:()=>A,a8:()=>I,dk:()=>b,dn:()=>M,hq:()=>D,n5:()=>g});var t=d(5e3),C=d(508);const p=["*",[["mat-card-footer"]]],i=["*","mat-card-footer"],l=[[["","mat-card-avatar",""],["","matCardAvatar",""]],[["mat-card-title"],["mat-card-subtitle"],["","mat-card-title",""],["","mat-card-subtitle",""],["","matCardTitle",""],["","matCardSubtitle",""]],"*"],s=["[mat-card-avatar], [matCardAvatar]","mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]","*"];let M=(()=>{class a{}return a.\u0275fac=function(r){return new(r||a)},a.\u0275dir=t.lG2({type:a,selectors:[["mat-card-content"],["","mat-card-content",""],["","matCardContent",""]],hostAttrs:[1,"mat-card-content"]}),a})(),g=(()=>{class a{}return a.\u0275fac=function(r){return new(r||a)},a.\u0275dir=t.lG2({type:a,selectors:[["mat-card-title"],["","mat-card-title",""],["","matCardTitle",""]],hostAttrs:[1,"mat-card-title"]}),a})(),_=(()=>{class a{}return a.\u0275fac=function(r){return new(r||a)},a.\u0275dir=t.lG2({type:a,selectors:[["mat-card-subtitle"],["","mat-card-subtitle",""],["","matCardSubtitle",""]],hostAttrs:[1,"mat-card-subtitle"]}),a})(),D=(()=>{class a{constructor(){this.align="start"}}return a.\u0275fac=function(r){return new(r||a)},a.\u0275dir=t.lG2({type:a,selectors:[["mat-card-actions"]],hostAttrs:[1,"mat-card-actions"],hostVars:2,hostBindings:function(r,h){2&r&&t.ekj("mat-card-actions-align-end","end"===h.align)},inputs:{align:"align"},exportAs:["matCardActions"]}),a})(),I=(()=>{class a{constructor(r){this._animationMode=r}}return a.\u0275fac=function(r){return new(r||a)(t.Y36(t.QbO,8))},a.\u0275cmp=t.Xpm({type:a,selectors:[["mat-card"]],hostAttrs:[1,"mat-card","mat-focus-indicator"],hostVars:2,hostBindings:function(r,h){2&r&&t.ekj("_mat-animation-noopable","NoopAnimations"===h._animationMode)},exportAs:["matCard"],ngContentSelectors:i,decls:2,vars:0,template:function(r,h){1&r&&(t.F$t(p),t.Hsn(0),t.Hsn(1,1))},styles:[".mat-card{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:block;position:relative;padding:16px;border-radius:4px}.mat-card._mat-animation-noopable{transition:none !important;animation:none !important}.mat-card>.mat-divider-horizontal{position:absolute;left:0;width:100%}[dir=rtl] .mat-card>.mat-divider-horizontal{left:auto;right:0}.mat-card>.mat-divider-horizontal.mat-divider-inset{position:static;margin:0}[dir=rtl] .mat-card>.mat-divider-horizontal.mat-divider-inset{margin-right:0}.cdk-high-contrast-active .mat-card{outline:solid 1px}.mat-card-actions,.mat-card-subtitle,.mat-card-content{display:block;margin-bottom:16px}.mat-card-title{display:block;margin-bottom:8px}.mat-card-actions{margin-left:-8px;margin-right:-8px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 32px);margin:0 -16px 16px -16px;display:block;overflow:hidden}.mat-card-image img{width:100%}.mat-card-footer{display:block;margin:0 -16px -16px -16px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button,.mat-card-actions .mat-stroked-button{margin:0 8px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header .mat-card-title{margin-bottom:12px}.mat-card-header-text{margin:0 16px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;object-fit:cover}.mat-card-title-group{display:flex;justify-content:space-between}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-title-group>.mat-card-xl-image{margin:-8px 0 8px}@media(max-width: 599px){.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}}.mat-card>:first-child,.mat-card-content>:first-child{margin-top:0}.mat-card>:last-child:not(.mat-card-footer),.mat-card-content>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-16px;border-top-left-radius:inherit;border-top-right-radius:inherit}.mat-card>.mat-card-actions:last-child{margin-bottom:-8px;padding-bottom:0}.mat-card-actions:not(.mat-card-actions-align-end) .mat-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-raised-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-stroked-button:first-child{margin-left:0;margin-right:0}.mat-card-actions-align-end .mat-button:last-child,.mat-card-actions-align-end .mat-raised-button:last-child,.mat-card-actions-align-end .mat-stroked-button:last-child{margin-left:0;margin-right:0}.mat-card-title:not(:first-child),.mat-card-subtitle:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}"],encapsulation:2,changeDetection:0}),a})(),b=(()=>{class a{}return a.\u0275fac=function(r){return new(r||a)},a.\u0275cmp=t.Xpm({type:a,selectors:[["mat-card-header"]],hostAttrs:[1,"mat-card-header"],ngContentSelectors:s,decls:4,vars:0,consts:[[1,"mat-card-header-text"]],template:function(r,h){1&r&&(t.F$t(l),t.Hsn(0),t.TgZ(1,"div",0),t.Hsn(2,1),t.qZA(),t.Hsn(3,2))},encapsulation:2,changeDetection:0}),a})(),A=(()=>{class a{}return a.\u0275fac=function(r){return new(r||a)},a.\u0275mod=t.oAB({type:a}),a.\u0275inj=t.cJS({imports:[C.BQ,C.BQ]}),a})()}}]);