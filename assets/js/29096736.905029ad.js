"use strict";(self.webpackChunkdoc_app=self.webpackChunkdoc_app||[]).push([[324],{6907:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>s,metadata:()=>i,toc:()=>c});var r=o(2322),n=o(5392);const s={sidebar_position:1},a="Storage",i={id:"plugins/storage",title:"Storage",description:"Demo",source:"@site/docs/plugins/storage.md",sourceDirName:"plugins",slug:"/plugins/storage",permalink:"/ngrx-lite/docs/plugins/storage",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/plugins/storage.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"RouterStore",permalink:"/ngrx-lite/docs/router-store"},next:{title:"StoreFactory",permalink:"/ngrx-lite/docs/api/store-factory"}},l={},c=[{value:"Session Storage",id:"session-storage",level:2},{value:"install Session Storage",id:"install-session-storage",level:3},{value:"create a new Store sync to Session Storage",id:"create-a-new-store-sync-to-session-storage",level:3},{value:"write a Custom Session Storage",id:"write-a-custom-session-storage",level:3},{value:"Local Storage",id:"local-storage",level:2},{value:"install Local Storage",id:"install-local-storage",level:3},{value:"create a new Store sync to Local Storage",id:"create-a-new-store-sync-to-local-storage",level:3},{value:"write a Custom Local Storage",id:"write-a-custom-local-storage",level:3}];function g(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,n.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"storage",children:"Storage"}),"\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.a,{href:"https://gernsdorfer.github.io/ngrx-lite/sample-app/#/storage",children:"Demo"})}),"\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.a,{href:"https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/storage",children:"Demo-Code"})}),"\n",(0,r.jsx)(t.h2,{id:"session-storage",children:"Session Storage"}),"\n",(0,r.jsx)(t.p,{children:"Store your State in the Client Session Storage"}),"\n",(0,r.jsx)(t.h3,{id:"install-session-storage",children:"install Session Storage"}),"\n",(0,r.jsxs)(t.p,{children:["provide ",(0,r.jsx)(t.code,{children:"SessionStoragePlugin"})," with ",(0,r.jsx)(t.code,{children:"sessionStoragePlugin"})," in your root module."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="app.module.ts"',children:"import { NgModule } from '@angular/core';\nimport { SessionStoragePlugin, sessionStoragePlugin } from '@gernsdorfer/ngrx-lite';\n\n@NgModule({\n  providers: [{ provide: SessionStoragePlugin, useValue: sessionStoragePlugin }],\n})\nexport class AppModule {}\n"})}),"\n",(0,r.jsx)(t.h3,{id:"create-a-new-store-sync-to-session-storage",children:"create a new Store sync to Session Storage"}),"\n",(0,r.jsxs)(t.p,{children:["Based on ",(0,r.jsx)(t.a,{href:"/docs/api/store-factory#createStore",children:"Created Store"})," you can add the storage option ",(0,r.jsx)(t.code,{children:"localStoragePlugin"})," for the new Store.\nThe data will write and read from the SessionStorage the Session Storage Key is the StoreName in the Example above it's named ",(0,r.jsx)(t.code,{children:"myStore"})]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="app.component.ts"',children:"export class AppComponent {\n  myStore = this.storeFactory.createStore<string, string>('myStore', { storage: 'localStoragePlugin' });\n\n  constructor(private storeFactory: StoreFactory) {}\n}\n"})}),"\n",(0,r.jsx)(t.h3,{id:"write-a-custom-session-storage",children:"write a Custom Session Storage"}),"\n",(0,r.jsx)(t.p,{children:"To write your own Session Storage, you muss create Service implement's the"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="my-session-storage.plugin.ts"',children:"import { ClientStoragePlugin } from '@gernsdorfer/ngrx-lite';\n\nclass MySessionStoragePlugin implements ClientStoragePlugin {\n  getDefaultState<T, E>(storeName: string): StoreState<T, E> | undefined {\n    // Your Busincess Logic\n  }\n\n  setStateToStorage<T, E>(storeName: string, state: StoreState<T, E>) {\n    // Your Busincess Logic\n  }\n}\n"})}),"\n",(0,r.jsx)(t.p,{children:"and provide this new Storage in your root Module"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="app.module.ts"',children:"import { NgModule } from '@angular/core';\nimport { SessionStoragePlugin, sessionStoragePlugin } from '@gernsdorfer/ngrx-lite';\nimport { MySessionStoragePlugin } from './my-session-storage.plugin.ts';\n\n@NgModule({\n  providers: [{ provide: SessionStoragePlugin, useClass: MySessionStoragePlugin }],\n})\nexport class AppModule {}\n"})}),"\n",(0,r.jsx)(t.h2,{id:"local-storage",children:"Local Storage"}),"\n",(0,r.jsx)(t.p,{children:"Store your State in the Client Local Storage"}),"\n",(0,r.jsx)(t.h3,{id:"install-local-storage",children:"install Local Storage"}),"\n",(0,r.jsxs)(t.p,{children:["provide ",(0,r.jsx)(t.code,{children:"LocalStoragePlugin"})," with ",(0,r.jsx)(t.code,{children:"LocalStoragePlugin"})," in your root module."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="app.module.ts"',children:"import { NgModule } from '@angular/core';\nimport { LocalStoragePlugin, LocalStoragePlugin } from '@gernsdorfer/ngrx-lite';\n\n@NgModule({\n  providers: [{ provide: LocalStoragePlugin, useValue: LocalStoragePlugin }],\n})\nexport class AppModule {}\n"})}),"\n",(0,r.jsx)(t.h3,{id:"create-a-new-store-sync-to-local-storage",children:"create a new Store sync to Local Storage"}),"\n",(0,r.jsxs)(t.p,{children:["Based on ",(0,r.jsx)(t.a,{href:"/docs/api/store-factory#createStore",children:"Created Store"})," you can add the storage option ",(0,r.jsx)(t.code,{children:"localStoragePlugin"})," for the new Store.\nThe data will write and read from the LocalStorage the Local Storage Key is the StoreName in the Example above it's named ",(0,r.jsx)(t.code,{children:"myStore"})]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="app.component.ts"',children:"export interface MyState {\n  counter: number;\n}\nexport class AppComponent {\n  private store = this.storeFactory.createComponentStore<MyState>({\n    storeName: 'BASIC_COUNTER',\n    defaultState: { counter: 0 },\n    plugins: {\n      storage: 'localStoragePlugin',\n    },\n  });\n\n  constructor(private storeFactory: StoreFactory) {}\n}\n"})}),"\n",(0,r.jsx)(t.h3,{id:"write-a-custom-local-storage",children:"write a Custom Local Storage"}),"\n",(0,r.jsx)(t.p,{children:"To write your own Local Storage, you muss create Service implement's the"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="my-Local-storage.plugin.ts"',children:"import { ClientStoragePlugin } from '@gernsdorfer/ngrx-lite';\n\nclass MyLocalStoragePlugin implements ClientStoragePlugin {\n  getDefaultState<STATE>(storeName: string): StoreState<STATE> | undefined {\n    // Your Busincess Logic\n  }\n\n  setStateToStorage<STATE>(storeName: string, state: StoreState<STATE>) {\n    // Your Busincess Logic\n  }\n}\n"})}),"\n",(0,r.jsx)(t.p,{children:"and provide this new Storage in your root Module"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="app.module.ts"',children:"import { NgModule } from '@angular/core';\nimport { LocalStoragePlugin, LocalStoragePlugin } from '@gernsdorfer/ngrx-lite';\nimport { MyLocalStoragePlugin } from './my-Local-storage.plugin.ts';\n\n@NgModule({\n  providers: [{ provide: LocalStoragePlugin, useClass: MyLocalStoragePlugin }],\n})\nexport class AppModule {}\n"})})]})}function d(e={}){const{wrapper:t}={...(0,n.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(g,{...e})}):g(e)}},5392:(e,t,o)=>{o.d(t,{Z:()=>i,a:()=>a});var r=o(2784);const n={},s=r.createContext(n);function a(e){const t=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:a(e.components),r.createElement(s.Provider,{value:t},e.children)}}}]);