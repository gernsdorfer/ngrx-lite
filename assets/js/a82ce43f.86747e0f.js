"use strict";(self.webpackChunkngrx_lite=self.webpackChunkngrx_lite||[]).push([[747],{6443:(e,t,r)=>{r.r(t),r.d(t,{contentTitle:()=>s,default:()=>d,frontMatter:()=>l,metadata:()=>u,toc:()=>p});var o=r(7462),n=r(3366),i=(r(7294),r(3905)),a=["components"],l={sidebar_position:6},s="RouterStore",u={unversionedId:"router-store",id:"router-store",title:"RouterStore",description:"Import the RouterStoreModule into your main application to debug your state across all visited URL's. This module",source:"@site/docs/router-store.md",sourceDirName:".",slug:"/router-store",permalink:"/ngrx-lite/docs/router-store",editUrl:"https://github.com/gernsdorfer/ngrx-lite/edit/master/apps/doc-app/docs/router-store.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Testing",permalink:"/ngrx-lite/docs/testing"},next:{title:"Storage",permalink:"/ngrx-lite/docs/plugins/storage"}},p=[],c={toc:p};function d(e){var t=e.components,r=(0,n.Z)(e,a);return(0,i.kt)("wrapper",(0,o.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"routerstore"},"RouterStore"),(0,i.kt)("p",null,"Import the ",(0,i.kt)("inlineCode",{parentName:"p"},"RouterStoreModule")," into your main application to debug your state across all visited URL's. This module\nstore's related URL to the current Store.",(0,i.kt)("br",{parentName:"p"}),"\n","So it's possible to replay your state changes by revisiting the related url."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="app.module.ts"',title:'"app.module.ts"'},"import { NgModule } from '@angular/core';\nimport { RouterStoreModule } from '@gernsdorfer/ngrx-lite';\n\n@NgModule({\n  imports: [RouterStoreModule],\n})\nexport class AppModule {}\n")))}d.isMDXComponent=!0},3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>m});var o=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},i=Object.keys(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=o.createContext({}),u=function(e){var t=o.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},p=function(e){var t=u(e.components);return o.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=u(r),m=n,f=d["".concat(s,".").concat(m)]||d[m]||c[m]||i;return r?o.createElement(f,a(a({ref:t},p),{},{components:r})):o.createElement(f,a({ref:t},p))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,a=new Array(i);a[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,a[1]=l;for(var u=2;u<i;u++)a[u]=r[u];return o.createElement.apply(null,a)}return o.createElement.apply(null,r)}d.displayName="MDXCreateElement"}}]);