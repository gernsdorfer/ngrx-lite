"use strict";(self.webpackChunksample_app=self.webpackChunksample_app||[]).push([[703],{703:(f,i,c)=>{c.r(i),c.d(i,{StorageFromServiceComponent:()=>d});var t=c(9212),u=c(9934);let a=(()=>{class e{constructor(o){this.storeFactory=o,this.store=this.storeFactory.createComponentStore({storeName:"SERVICE_COUNTER",defaultState:{counter:0}}),this.state=this.store.state}increment(){this.store.patchState(({counter:o})=>({counter:o+1}),"INCREMENT")}ngOnDestroy(){this.store.ngOnDestroy()}static#t=this.\u0275fac=function(n){return new(n||e)(t.LFG(u.Cn))};static#e=this.\u0275prov=t.Yz7({token:e,factory:e.\u0275fac,providedIn:"any"})}return e})();var r=c(2296),m=c(7238);let p=(()=>{class e{constructor(o){this.counterStore=o,this.title="Demo A Component",this.counterState=this.counterStore.state}increment(){this.counterStore.increment()}static#t=this.\u0275fac=function(n){return new(n||e)(t.Y36(a))};static#e=this.\u0275cmp=t.Xpm({type:e,selectors:[["my-app-same-instance-demo-a"]],standalone:!0,features:[t.jDz],decls:11,vars:2,consts:[["title",""],["subtitle",""],["content",""],[1,"counter"],["actions",""],["mat-fab","",1,"increment",3,"click"]],template:function(n,s){1&n&&(t.TgZ(0,"my-app-ui-card")(1,"div",0),t._uU(2,"Component-Store"),t.qZA(),t.TgZ(3,"div",1),t._uU(4),t.qZA(),t.TgZ(5,"div",2)(6,"h2",3),t._uU(7),t.qZA()(),t.TgZ(8,"div",4)(9,"button",5),t.NdJ("click",function(){return s.increment()}),t._uU(10,"+"),t.qZA()()()),2&n&&(t.xp6(4),t.hij("Same Instance (",s.title,")"),t.xp6(3),t.Oqu(s.counterState().counter))},dependencies:[m.o,r.ot,r.cs],encapsulation:2})}return e})(),l=(()=>{class e{constructor(o){this.counterStore=o,this.title="Demo B Component",this.counterState=this.counterStore.state}increment(){this.counterStore.increment()}static#t=this.\u0275fac=function(n){return new(n||e)(t.Y36(a))};static#e=this.\u0275cmp=t.Xpm({type:e,selectors:[["my-app-same-instance-demo-b"]],standalone:!0,features:[t.jDz],decls:11,vars:2,consts:[["title",""],["subtitle",""],["content",""],[1,"counter"],["actions",""],["mat-fab","",1,"increment",3,"click"]],template:function(n,s){1&n&&(t.TgZ(0,"my-app-ui-card")(1,"div",0),t._uU(2,"Component-Store"),t.qZA(),t.TgZ(3,"div",1),t._uU(4),t.qZA(),t.TgZ(5,"div",2)(6,"h2",3),t._uU(7),t.qZA()(),t.TgZ(8,"div",4)(9,"button",5),t.NdJ("click",function(){return s.increment()}),t._uU(10,"+"),t.qZA()()()),2&n&&(t.xp6(4),t.hij("Same Instance (",s.title,")"),t.xp6(3),t.Oqu(s.counterState().counter))},dependencies:[m.o,r.ot,r.cs],encapsulation:2})}return e})(),d=(()=>{class e{static#t=this.\u0275fac=function(n){return new(n||e)};static#e=this.\u0275cmp=t.Xpm({type:e,selectors:[["my-app-service-counter"]],standalone:!0,features:[t._Bn([a]),t.jDz],decls:5,vars:0,template:function(n,s){1&n&&(t.TgZ(0,"h1"),t._uU(1,"Share Store to ChildComponents"),t.qZA(),t._UZ(2,"my-app-same-instance-demo-a")(3,"br")(4,"my-app-same-instance-demo-b"))},dependencies:[p,l],encapsulation:2})}return e})()}}]);