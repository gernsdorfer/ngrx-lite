"use strict";(self.webpackChunkngrx_lite=self.webpackChunkngrx_lite||[]).push([[906],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>y});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),m=c(r),y=o,f=m["".concat(l,".").concat(y)]||m[y]||u[y]||i;return r?n.createElement(f,s(s({ref:t},p),{},{components:r})):n.createElement(f,s({ref:t},p))}));function y(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,s=new Array(i);s[0]=m;var a={};for(var l in t)hasOwnProperty.call(t,l)&&(a[l]=t[l]);a.originalType=e,a.mdxType="string"==typeof e?e:o,s[1]=a;for(var c=2;c<i;c++)s[c]=r[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},4414:(e,t,r)=>{r.r(t),r.d(t,{contentTitle:()=>l,default:()=>m,frontMatter:()=>a,metadata:()=>c,toc:()=>p});var n=r(7462),o=r(3366),i=(r(7294),r(3905)),s=["components"],a={sidebar_position:3},l="Global Store",c={unversionedId:"store-strategies/global-store",id:"store-strategies/global-store",title:"Global Store",description:"A Module Store live in your Application",source:"@site/docs/store-strategies/global-store.md",sourceDirName:"store-strategies",slug:"/store-strategies/global-store",permalink:"/ngrx-lite/docs/store-strategies/global-store",editUrl:"https://github.com/gernsdorfer/ngrx-lite/edit/master/apps/doc-app/docs/store-strategies/global-store.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Module Store",permalink:"/ngrx-lite/docs/store-strategies/module-store"},next:{title:"Store Devtools",permalink:"/ngrx-lite/docs/dev-tools"}},p=[{value:"Define the Store as Service",id:"define-the-store-as-service",children:[],level:2},{value:"Consume your Store in your Component",id:"consume-your-store-in-your-component",children:[],level:2}],u={toc:p};function m(e){var t=e.components,r=(0,o.Z)(e,s);return(0,i.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"global-store"},"Global Store"),(0,i.kt)("p",null,"A Module Store live in your Application"),(0,i.kt)("h2",{id:"define-the-store-as-service"},"Define the Store as Service"),(0,i.kt)("p",null,"Define your Service providedIn in ",(0,i.kt)("inlineCode",{parentName:"p"},"root")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="my-store.service.ts"',title:'"my-store.service.ts"'},"import {Injectable, OnDestroy} from '@angular/core';\nimport {delay, of} from 'rxjs';\nimport {StoreFactory} from '@gernsdorfer/ngrx-lite';\n\n@Injectable({ providedIn: 'root' })\nexport class MyStore implements OnDestroy {\n  private myStore = this.storeFactory.createStore<number, string>('serviceCounter');\n\n  public myStoreState$ = this.myStore.state$;\n\n  public incrementEffect = this.myStore.createEffect('increment', (counter: number = 0) => of(counter + 1));\n\n  constructor(private storeFactory: StoreFactory) {}\n} \n")),(0,i.kt)("h2",{id:"consume-your-store-in-your-component"},"Consume your Store in your Component"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="my-component.component.ts"',title:'"my-component.component.ts"'},"import { Component, OnDestroy } from '@angular/core';\nimport { MyStore } from './my-store.service';\n\n@Component()\nexport class CounterComponent implements OnDestroy {\n  \n  public myStoreState$ = this.myStore.myStoreState$;\n\n  constructor(private myStore: MyStore) {\n  }\n\n  public increment (counter: number): void {\n      this.myStore.incrementEffect(counter);\n  }\n  \n}\n")))}m.isMDXComponent=!0}}]);