"use strict";(self.webpackChunkdoc_app=self.webpackChunkdoc_app||[]).push([[753],{2806:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>a,contentTitle:()=>i,default:()=>u,frontMatter:()=>r,metadata:()=>d,toc:()=>l});var n=o(2322),s=o(5392);const r={sidebar_position:4},i="Store Devtools",d={id:"dev-tools",title:"Store Devtools",description:"For Debug the State with the Redux Devtools Extension, it's",source:"@site/docs/dev-tools.md",sourceDirName:".",slug:"/dev-tools",permalink:"/ngrx-lite/docs/dev-tools",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/dev-tools.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Share Action events for ngrx",permalink:"/ngrx-lite/docs/store-strategies/combine-with-ngrx-effects"},next:{title:"Testing",permalink:"/ngrx-lite/docs/testing"}},a={},l=[];function c(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"store-devtools",children:"Store Devtools"}),"\n",(0,n.jsxs)(t.p,{children:["For Debug the State with the ",(0,n.jsx)(t.a,{href:"https://github.com/zalmoxisus/redux-devtools-extension/",children:"Redux Devtools Extension"}),", it's\nonly necessary to install and register the ",(0,n.jsx)(t.a,{href:"https://ngrx.io/guide/store-devtools",children:"@ngrx/store-devtools"})," in your root Module."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",metastring:'title="app.module.ts"',children:"import { NgModule } from '@angular/core';\nimport { StoreDevtoolsModule } from '@ngrx/store-devtools';\n\n@NgModule({\n  imports: [\n    StoreDevtoolsModule.instrument({\n      name: 'ngrx-lite-demo',\n      maxAge: 25,\n      logOnly: false,\n      // define the monitor Property here\n      monitor: (state, action) => action,\n    }),\n  ],\n})\nexport class AppModule {}\n"})}),"\n",(0,n.jsx)(t.admonition,{type:"note",children:(0,n.jsxs)(t.mdxAdmonitionTitle,{children:["It's important to set the ",(0,n.jsx)(t.code,{children:"monitor"})," property in your devToolConfig, otherwise an State Import is not possible."]})})]})}function u(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},5392:(e,t,o)=>{o.d(t,{Z:()=>d,a:()=>i});var n=o(2784);const s={},r=n.createContext(s);function i(e){const t=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),n.createElement(r.Provider,{value:t},e.children)}}}]);