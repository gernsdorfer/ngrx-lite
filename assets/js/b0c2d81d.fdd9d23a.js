"use strict";(self.webpackChunkngrx_lite=self.webpackChunkngrx_lite||[]).push([[885],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>u});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),s=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},p=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),f=s(r),u=a,d=f["".concat(l,".").concat(u)]||f[u]||m[u]||o;return r?n.createElement(d,c(c({ref:t},p),{},{components:r})):n.createElement(d,c({ref:t},p))}));function u(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,c=new Array(o);c[0]=f;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,c[1]=i;for(var s=2;s<o;s++)c[s]=r[s];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},7554:(e,t,r)=>{r.r(t),r.d(t,{contentTitle:()=>l,default:()=>f,frontMatter:()=>i,metadata:()=>s,toc:()=>p});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),c=["components"],i={sidebar_position:2},l="StoreFactory",s={unversionedId:"api/store-factory",id:"api/store-factory",title:"StoreFactory",description:"Here you can find a list of the StoreFactory API and their usages:",source:"@site/docs/api/store-factory.md",sourceDirName:"api",slug:"/api/store-factory",permalink:"/ngrx-lite/docs/api/store-factory",editUrl:"https://github.com/gernsdorfer/ngrx-lite/edit/master/apps/doc-app/docs/api/store-factory.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Storage",permalink:"/ngrx-lite/docs/plugins/storage"},next:{title:"Store",permalink:"/ngrx-lite/docs/api/store"}},p=[{value:"<code>createStore</code>",id:"createstore",children:[],level:2},{value:"createEffect",id:"createeffect",children:[{value:"Example for a successfully callback Observable",id:"example-for-a-successfully-callback-observable",children:[],level:3},{value:"Example for a Error Callback Observable",id:"example-for-a-error-callback-observable",children:[],level:3}],level:2}],m={toc:p};function f(e){var t=e.components,r=(0,a.Z)(e,c);return(0,o.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"storefactory"},"StoreFactory"),(0,o.kt)("p",null,"Here you can find a list of the ",(0,o.kt)("inlineCode",{parentName:"p"},"StoreFactory")," API and their usages:"),(0,o.kt)("h2",{id:"createstore"},(0,o.kt)("inlineCode",{parentName:"h2"},"createStore")),(0,o.kt)("p",null,"Create a new Store based on ",(0,o.kt)("a",{parentName:"p",href:"https://ngrx.io/guide/component-store"},"ngrx Component Store"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="app.component.ts"',title:'"app.component.ts"'},"export class AppComponent {\n  myStore = this.storeFactory.createStore<number, never>('myStore');\n\n  constructor(private storeFactory: StoreFactory) {\n  }\n}\n")),(0,o.kt)("h2",{id:"createeffect"},"createEffect"),(0,o.kt)("p",null,"Create your custom Effect. Here you must define your EffectName, in this Example below it's ",(0,o.kt)("inlineCode",{parentName:"p"},"LOAD_NAME"),"\nThe second Argument is a Callback Function. The Callback Function returns an Observable based on the created Store Interface."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="app.component.ts"',title:'"app.component.ts"'},"export class AppComponent {\n  private myStore = this.storeFactory.createStore<{ name: string }, { errorCode: number }>('myStore');\n  private nameEffect = this.myStore.createEffect('LOAD_NAME', (name: string) => of({name: name}));\n\n  constructor(private storeFactory: StoreFactory) {\n  }\n\n  public setName(name: string): void {\n    this.nameEffect(name);\n  }\n}\n")),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"Every Effect set ",(0,o.kt)("inlineCode",{parentName:"h5"},"isLoading")," to ",(0,o.kt)("inlineCode",{parentName:"h5"},"true")," during the effect is running. Here it's possible to show a loading")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"indicator in your ui."))),(0,o.kt)("h3",{id:"example-for-a-successfully-callback-observable"},"Example for a successfully callback Observable"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"  nameEffect = this.myStore.createEffect('LOAD_NAME', (name: string) => of({name: name}));\n")),(0,o.kt)("h3",{id:"example-for-a-error-callback-observable"},"Example for a Error Callback Observable"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"\nnameEffect = this.myStore.createEffect('LOAD_NAME', (name: string) => throwError(() => {\n  errorCode: 'myError'\n}));\n")))}f.isMDXComponent=!0}}]);