"use strict";(self.webpackChunksample_app=self.webpackChunksample_app||[]).push([[996],{996:(D,u,r)=>{r.r(u),r.d(u,{ListenOnGlobalStoreComponent:()=>g});var c=r(1728),m=r(5653),t=r(2223),f=r(9507),C=r(8505),p=r(8784);const d=(0,p.PH)("reset");var h=r(9528);const i=new t.OlP("MULTIPLE_COUNTER");let a=(()=>{class e{constructor(n,s){this.storeFactory=n,this.storeName=s,this.store=this.storeFactory.createComponentStore({storeName:this.storeName||"MULTIPLE_COUNTER_STORE",defaultState:{counter:0}}),this.state=this.store.state,this.reset$=this.store.createEffect(l=>l.pipe((0,f.l4)(d),(0,C.b)(()=>this.store.setState({counter:0},"RESET"))))}increment(){this.store.patchState(({counter:n})=>({counter:n+1}),"INCREMENT")}ngOnDestroy(){this.store.ngOnDestroy()}}return e.\u0275fac=function(n){return new(n||e)(t.LFG(h.Cn),t.LFG(i,8))},e.\u0275prov=t.Yz7({token:e,factory:e.\u0275fac,providedIn:"any"}),e})(),S=(()=>{class e{constructor(n){this.counterStore=n,this.title="Demo A Component",this.counterState=this.counterStore.state}increment(){this.counterStore.increment()}ngOnDestroy(){this.counterStore.ngOnDestroy()}}return e.\u0275fac=function(n){return new(n||e)(t.Y36(a))},e.\u0275cmp=t.Xpm({type:e,selectors:[["my-app-listen-on-global-store-demo-a"]],standalone:!0,features:[t._Bn([a,{provide:i,useValue:"DemoAComponentStore"}]),t.jDz],decls:11,vars:1,consts:[["title",""],["subtitle",""],["content",""],[1,"counter"],["actions",""],["mat-fab","",1,"increment",3,"click"]],template:function(n,s){1&n&&(t.TgZ(0,"my-app-ui-card")(1,"div",0),t._uU(2,"Component-Store A"),t.qZA(),t.TgZ(3,"div",1),t._uU(4,"Listen on Global"),t.qZA(),t.TgZ(5,"div",2)(6,"h2",3),t._uU(7),t.qZA()(),t.TgZ(8,"div",4)(9,"button",5),t.NdJ("click",function(){return s.increment()}),t._uU(10,"+"),t.qZA()()()),2&n&&(t.xp6(7),t.Oqu(s.counterState().counter))},dependencies:[m.o,c.ot,c.cs],encapsulation:2}),e})(),y=(()=>{class e{constructor(n){this.counterStore=n,this.title="Demo B Component",this.counterState=this.counterStore.state}increment(){this.counterStore.increment()}ngOnDestroy(){this.counterStore.ngOnDestroy()}}return e.\u0275fac=function(n){return new(n||e)(t.Y36(a))},e.\u0275cmp=t.Xpm({type:e,selectors:[["my-app-listen-on-global-store-demo-b"]],standalone:!0,features:[t._Bn([a,{provide:i,useValue:"DemoBComponentStore"}]),t.jDz],decls:11,vars:1,consts:[["title",""],["subtitle",""],["content",""],[1,"counter"],["actions",""],["mat-fab","",1,"increment",3,"click"]],template:function(n,s){1&n&&(t.TgZ(0,"my-app-ui-card")(1,"div",0),t._uU(2,"Component-Store A"),t.qZA(),t.TgZ(3,"div",1),t._uU(4,"Listen on Global"),t.qZA(),t.TgZ(5,"div",2)(6,"h2",3),t._uU(7),t.qZA()(),t.TgZ(8,"div",4)(9,"button",5),t.NdJ("click",function(){return s.increment()}),t._uU(10,"+"),t.qZA()()()),2&n&&(t.xp6(7),t.Oqu(s.counterState().counter))},dependencies:[m.o,c.ot,c.cs],encapsulation:2}),e})(),b=(()=>{class e{constructor(n){this.store=n}reset(){this.store.dispatch(d())}}return e.\u0275fac=function(n){return new(n||e)(t.Y36(p.yh))},e.\u0275cmp=t.Xpm({type:e,selectors:[["my-app-listen-on-global-store-reset"]],standalone:!0,features:[t.jDz],decls:3,vars:0,consts:[["mat-fab","",1,"reset",3,"click"]],template:function(n,s){1&n&&(t._uU(0," Dispatch Global Actions "),t.TgZ(1,"button",0),t.NdJ("click",function(){return s.reset()}),t._uU(2,"reset"),t.qZA())},dependencies:[c.ot,c.cs],encapsulation:2}),e})(),g=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["my-app-listen-on-global-store"]],standalone:!0,features:[t.jDz],decls:6,vars:0,template:function(n,s){1&n&&(t.TgZ(0,"h1"),t._uU(1,"Listen on global Store"),t.qZA(),t._UZ(2,"my-app-listen-on-global-store-reset")(3,"my-app-listen-on-global-store-demo-a")(4,"br")(5,"my-app-listen-on-global-store-demo-b"))},dependencies:[S,y,b],encapsulation:2}),e})()}}]);