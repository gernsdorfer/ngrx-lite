"use strict";(self.webpackChunkdoc_app=self.webpackChunkdoc_app||[]).push([[31],{3393:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var o=n(2322),r=n(5392);const s={sidebar_position:2},i="Multiple Store instances",a={id:"store-strategies/multiple-store-instances",title:"Multiple Store instances",description:"Demo",source:"@site/docs/store-strategies/multiple-store-instances.md",sourceDirName:"store-strategies",slug:"/store-strategies/multiple-store-instances",permalink:"/ngrx-lite/docs/store-strategies/multiple-store-instances",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/store-strategies/multiple-store-instances.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Module Store",permalink:"/ngrx-lite/docs/store-strategies/module-store"},next:{title:"Global Store",permalink:"/ngrx-lite/docs/store-strategies/global-store"}},c={},l=[{value:"Define the Store as Service and a dynamic Store Name",id:"define-the-store-as-service-and-a-dynamic-store-name",level:2},{value:"Consume and provide your Store in your Component",id:"consume-and-provide-your-store-in-your-component",level:2}];function m(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h1,{id:"multiple-store-instances",children:"Multiple Store instances"}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.a,{href:"https://gernsdorfer.github.io/ngrx-lite/sample-app/#/multiple-storage-instances",children:"Demo"})}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.a,{href:"https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/muliple-instances",children:"Demo-Code"})}),"\n",(0,o.jsx)(t.p,{children:"A Store can live in multiple Components/Module with own Scope"}),"\n",(0,o.jsx)(t.h2,{id:"define-the-store-as-service-and-a-dynamic-store-name",children:"Define the Store as Service and a dynamic Store Name"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-ts",metastring:'title="my-component-store.service.ts"',children:"import { Inject, Injectable, OnDestroy, Optional } from '@angular/core';\nimport { of } from 'rxjs';\nimport { StoreFactory } from '@gernsdorfer/ngrx-lite';\n\n// define an InjectionToken for your StoreName\nexport const MyStoreName = new InjectionToken('MyStoreName');\nexport interface MyState {\n  counter: number;\n}\n\n@Injectable()\nexport class MyStore implements OnDestroy {\n  private store = this.storeFactory.createComponentStore<MyState>({\n    // use the provided StoreName\n    storeName: this.storeName || 'BASIC_COUNTER',\n    defaultState: { counter: 0 },\n  });\n\n  public counterState$ = this.store.state$;\n\n  constructor(\n    private storeFactory: StoreFactory,\n    // import your StoreName\n    @Optional() @Inject(MyStoreName) private storeName: string,\n  ) {}\n\n  ngOnDestroy() {\n    this.store.ngOnDestroy();\n  }\n}\n"})}),"\n",(0,o.jsx)(t.admonition,{title:"It's necessary to destroy your store after your component destroyed, to avoid side effects. Here you muss call",type:"note",children:(0,o.jsxs)(t.p,{children:["the ",(0,o.jsx)(t.code,{children:"ngOnDestroy"}),"."]})}),"\n",(0,o.jsx)(t.h2,{id:"consume-and-provide-your-store-in-your-component",children:"Consume and provide your Store in your Component"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-ts",metastring:'title="my-component.component.ts"',children:"import { Component, OnDestroy } from '@angular/core';\nimport { MyStore, MyStoreName } from './my-store.service';\n\n@Component({\n  providers: [\n    MyStore,\n    // Define a Dynamic StoreName\n    {\n      provide: MyStoreName,\n      useValue: 'counterStore',\n    },\n  ],\n})\nexport class CounterComponent implements OnDestroy {\n  public myStoreState$ = this.myStore.counterState$;\n\n  constructor(private myStore: MyStore) {}\n}\n"})})]})}function p(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(m,{...e})}):m(e)}},5392:(e,t,n)=>{n.d(t,{Z:()=>a,a:()=>i});var o=n(2784);const r={},s=o.createContext(r);function i(e){const t=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),o.createElement(s.Provider,{value:t},e.children)}}}]);