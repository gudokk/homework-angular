import{a as yt}from"./chunk-ZRIRIH5W.js";import{A as pt,B as gt,M as ft,O as vt,P as ht,Q as bt,R as Ct,d as mt,e as dt,f as lt,y as ut}from"./chunk-2ABIKGFA.js";import{a as st,b as xt}from"./chunk-67RACIES.js";import{a as x}from"./chunk-FKV4YZEY.js";import{e as nt,f as at,j as it,m as rt,o as ot,q as ct}from"./chunk-O7IOYJ5M.js";import{Ab as V,Eb as g,Gb as l,Hb as Q,Ib as W,La as J,M as D,Na as d,Rb as w,S as b,T as H,Tb as m,Ub as C,V as M,Vb as B,W as S,Wa as G,Wb as Z,X as v,Zb as tt,_b as et,a as T,aa as u,ab as A,b as k,ba as p,bb as K,dc as R,ea as U,k as f,la as h,nb as j,o as z,ob as N,rb as X,sb as Y,tb as _,u as F,ub as o,vb as c,wb as q,y as $}from"./chunk-OXUCV4BC.js";var P=class i{post=h(null);comments=h([]);articleRating=h(0);hasPost=R(()=>this.post()!==null);setData(t){this.post.set(t.post),this.comments.set(t.comments),this.articleRating.set(t.articleRating)}static \u0275fac=function(e){return new(e||i)};static \u0275prov=b({token:i,factory:i.\u0275fac})};var L=new M("POST_DETAILS_SERVICE");var O=class i{constructor(t,e,n){this.http=t;this.articleMapper=e;this.categoriesApi=n}getPostDetails(t){return F({article:this.http.get(`/api/articles/${t}`),comments:this.http.get(`/api/comments/article/${t}`),categories:this.categoriesApi.getAll()}).pipe(z(({article:e,comments:n,categories:a})=>{let r=a.find(y=>y.id===e.categoryId)?.name;return{post:this.articleMapper.articleToPost(e,r),comments:n.map(y=>this.mapComment(y)),articleRating:e.rating}}),$(()=>f({post:null,comments:[],articleRating:0})))}addComment(t,e){return this.http.post("/api/comments",{username:e.author.trim(),content:e.text.trim(),articleId:t}).pipe(D(()=>this.getPostDetails(t)))}changeCommentRating(t,e,n){return this.http.get(`/api/comments/article/${t}`).pipe(D(a=>{let r=a.find(y=>y.id===e);if(!r)return this.getPostDetails(t);let s=r.rating+n;return this.http.patch(`/api/comments/${e}/rating`,{rating:s}).pipe(D(()=>this.getPostDetails(t)))}))}changeArticleRating(t,e){let n=Math.min(Math.abs(e),50);if(n===0)return this.getPostDetails(t);let a=e>=0?`/api/articles/${t}/rating-up`:`/api/articles/${t}/rating-down`,r=Array.from({length:n},()=>this.http.patch(a,{}));return F(r).pipe(D(()=>this.getPostDetails(t)))}mapComment(t){return{id:t.id,postId:t.articleId,author:t.username,text:t.content,createdAt:t.createdAt,rating:t.rating}}static \u0275fac=function(e){return new(e||i)(S(it),S(yt),S(xt))};static \u0275prov=b({token:i,factory:i.\u0275fac})};var At="posts",Dt="postComments",_t="postRatings",E=class i{getPostDetails(t){return f(this.buildResult(t))}addComment(t,e){let n=this.getCommentsByPost(),a=n[t]??[],r={id:crypto.randomUUID(),postId:t,author:e.author.trim(),text:e.text.trim(),createdAt:new Date().toISOString(),rating:0};return n[t]=[r,...a],this.saveCommentsByPost(n),f(this.buildResult(t))}changeCommentRating(t,e,n){let a=this.getCommentsByPost(),r=a[t]??[];return a[t]=r.map(s=>s.id===e?k(T({},s),{rating:s.rating+n}):s),this.saveCommentsByPost(a),f(this.buildResult(t))}changeArticleRating(t,e){let n=this.getArticleRatings(),a=n[t]??0;return n[t]=a+e,this.saveArticleRatings(n),f(this.buildResult(t))}buildResult(t){let e=this.getPostById(t),n=this.getCommentsByPost(),a=this.getArticleRatings();return{post:e,comments:n[t]??[],articleRating:a[t]??e?.rating??0}}getPostById(t){return this.getAllPosts().find(n=>n.id===t)??null}getAllPosts(){let t=localStorage.getItem(At);if(!t)return[];try{let e=JSON.parse(t);return Array.isArray(e)?e.map(n=>this.coercePost(n)).filter(n=>n!==null):[]}catch{return[]}}coercePost(t){if(!t||typeof t!="object")return null;let e=t,n=e.id!=null?String(e.id):"",a=String(e.title??""),r=String(e.text??"");return n?{id:n,title:a,text:r,imageUrl:e.imageUrl!=null?String(e.imageUrl):null,categoryName:e.categoryName!=null?String(e.categoryName):void 0,rating:typeof e.rating=="number"?e.rating:void 0}:null}getCommentsByPost(){let t=localStorage.getItem(Dt);if(!t)return{};try{let e=JSON.parse(t);return this.migrateCommentsMap(e)}catch{return{}}}migrateCommentsMap(t){let e={};for(let[n,a]of Object.entries(t)){let r=String(n);Array.isArray(a)&&(e[r]=a.map(s=>k(T({},s),{id:String(s.id),postId:String(s.postId)})))}return e}saveCommentsByPost(t){localStorage.setItem(Dt,JSON.stringify(t))}getArticleRatings(){let t=localStorage.getItem(_t);if(!t)return{};try{let e=JSON.parse(t),n={};for(let[a,r]of Object.entries(e))n[String(a)]=r;return n}catch{return{}}}saveArticleRatings(t){localStorage.setItem(_t,JSON.stringify(t))}static \u0275fac=function(e){return new(e||i)};static \u0275prov=b({token:i,factory:i.\u0275fac})};var wt=["*"];var Rt=new M("MAT_CARD_CONFIG"),Pt=(()=>{class i{appearance;constructor(){let e=v(Rt,{optional:!0});this.appearance=e?.appearance||"raised"}static \u0275fac=function(n){return new(n||i)};static \u0275cmp=A({type:i,selectors:[["mat-card"]],hostAttrs:[1,"mat-mdc-card","mdc-card"],hostVars:8,hostBindings:function(n,a){n&2&&w("mat-mdc-card-outlined",a.appearance==="outlined")("mdc-card--outlined",a.appearance==="outlined")("mat-mdc-card-filled",a.appearance==="filled")("mdc-card--filled",a.appearance==="filled")},inputs:{appearance:"appearance"},exportAs:["matCard"],ngContentSelectors:wt,decls:1,vars:0,template:function(n,a){n&1&&(Q(),W(0))},styles:[`.mat-mdc-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  border-style: solid;
  border-width: 0;
  background-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));
  border-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));
  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));
  box-shadow: var(--mat-card-elevated-container-elevation, var(--mat-sys-level1));
}
.mat-mdc-card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: solid 1px transparent;
  content: "";
  display: block;
  pointer-events: none;
  box-sizing: border-box;
  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));
}

.mat-mdc-card-outlined {
  background-color: var(--mat-card-outlined-container-color, var(--mat-sys-surface));
  border-radius: var(--mat-card-outlined-container-shape, var(--mat-sys-corner-medium));
  border-width: var(--mat-card-outlined-outline-width, 1px);
  border-color: var(--mat-card-outlined-outline-color, var(--mat-sys-outline-variant));
  box-shadow: var(--mat-card-outlined-container-elevation, var(--mat-sys-level0));
}
.mat-mdc-card-outlined::after {
  border: none;
}

.mat-mdc-card-filled {
  background-color: var(--mat-card-filled-container-color, var(--mat-sys-surface-container-highest));
  border-radius: var(--mat-card-filled-container-shape, var(--mat-sys-corner-medium));
  box-shadow: var(--mat-card-filled-container-elevation, var(--mat-sys-level0));
}

.mdc-card__media {
  position: relative;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.mdc-card__media::before {
  display: block;
  content: "";
}
.mdc-card__media:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.mdc-card__media:last-child {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.mat-mdc-card-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  min-height: 52px;
  padding: 8px;
}

.mat-mdc-card-title {
  font-family: var(--mat-card-title-text-font, var(--mat-sys-title-large-font));
  line-height: var(--mat-card-title-text-line-height, var(--mat-sys-title-large-line-height));
  font-size: var(--mat-card-title-text-size, var(--mat-sys-title-large-size));
  letter-spacing: var(--mat-card-title-text-tracking, var(--mat-sys-title-large-tracking));
  font-weight: var(--mat-card-title-text-weight, var(--mat-sys-title-large-weight));
}

.mat-mdc-card-subtitle {
  color: var(--mat-card-subtitle-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-card-subtitle-text-font, var(--mat-sys-title-medium-font));
  line-height: var(--mat-card-subtitle-text-line-height, var(--mat-sys-title-medium-line-height));
  font-size: var(--mat-card-subtitle-text-size, var(--mat-sys-title-medium-size));
  letter-spacing: var(--mat-card-subtitle-text-tracking, var(--mat-sys-title-medium-tracking));
  font-weight: var(--mat-card-subtitle-text-weight, var(--mat-sys-title-medium-weight));
}

.mat-mdc-card-title,
.mat-mdc-card-subtitle {
  display: block;
  margin: 0;
}
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title,
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle {
  padding: 16px 16px 0;
}

.mat-mdc-card-header {
  display: flex;
  padding: 16px 16px 0;
}

.mat-mdc-card-content {
  display: block;
  padding: 0 16px;
}
.mat-mdc-card-content:first-child {
  padding-top: 16px;
}
.mat-mdc-card-content:last-child {
  padding-bottom: 16px;
}

.mat-mdc-card-title-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.mat-mdc-card-avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-bottom: 16px;
  object-fit: cover;
}
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle,
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title {
  line-height: normal;
}

.mat-mdc-card-sm-image {
  width: 80px;
  height: 80px;
}

.mat-mdc-card-md-image {
  width: 112px;
  height: 112px;
}

.mat-mdc-card-lg-image {
  width: 152px;
  height: 152px;
}

.mat-mdc-card-xl-image {
  width: 240px;
  height: 240px;
}

.mat-mdc-card-subtitle ~ .mat-mdc-card-title,
.mat-mdc-card-title ~ .mat-mdc-card-subtitle,
.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,
.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,
.mat-mdc-card-title-group .mat-mdc-card-title,
.mat-mdc-card-title-group .mat-mdc-card-subtitle {
  padding-top: 0;
}

.mat-mdc-card-content > :last-child:not(.mat-mdc-card-footer) {
  margin-bottom: 0;
}

.mat-mdc-card-actions-align-end {
  justify-content: flex-end;
}
`],encapsulation:2,changeDetection:0})}return i})();var Mt=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=K({type:i});static \u0275inj=H({imports:[mt]})}return i})();var Ot=(i,t)=>t.id;function Et(i,t){i&1&&q(0,"img",7),i&2&&_("src",t,J)}function Tt(i,t){if(i&1){let e=V();o(0,"mat-card",14)(1,"div",21)(2,"strong"),m(3),c(),o(4,"span"),m(5),tt(6,"date"),c()(),o(7,"p"),m(8),c(),o(9,"div",22)(10,"span"),m(11),c(),o(12,"button",11),g("click",function(){let a=u(e).$implicit,r=l(2);return p(r.changeCommentRating(a.id,1))}),o(13,"mat-icon"),m(14,"add"),c()(),o(15,"button",11),g("click",function(){let a=u(e).$implicit,r=l(2);return p(r.changeCommentRating(a.id,-1))}),o(16,"mat-icon"),m(17,"remove"),c()()()()}if(i&2){let e=t.$implicit;d(3),C(e.author),d(2),C(et(6,4,e.createdAt,"dd.MM.yyyy HH:mm")),d(3),C(e.text),d(3),B("\u0420\u0435\u0439\u0442\u0438\u043D\u0433: ",e.rating)}}function kt(i,t){i&1&&(o(0,"p",15),m(1,"\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432 \u0435\u0449\u0435 \u043D\u0435\u0442."),c())}function Ft(i,t){if(i&1){let e=V();o(0,"mat-card",4)(1,"div",5)(2,"div",6),j(3,Et,1,1,"img",7),c(),o(4,"div",8)(5,"h2"),m(6),c(),o(7,"p",9),m(8),c(),o(9,"div",10)(10,"span"),m(11),c(),o(12,"button",11),g("click",function(){u(e);let a=l();return p(a.changeArticleRating(1))}),o(13,"mat-icon"),m(14,"add"),c()(),o(15,"button",11),g("click",function(){u(e);let a=l();return p(a.changeArticleRating(-1))}),o(16,"mat-icon"),m(17,"remove"),c()()()()()(),o(18,"section",12)(19,"h3"),m(20,"\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438"),c(),o(21,"div",13),X(22,Tt,18,7,"mat-card",14,Ot,!1,kt,2,0,"p",15),c(),o(25,"form",16),g("submit",function(a){u(e);let r=l();return p(r.onCommentFormSubmit(a))}),o(26,"h3"),m(27,"\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439"),c(),o(28,"mat-form-field",17)(29,"mat-label"),m(30,"\u0418\u043C\u044F"),c(),o(31,"input",18),g("input",function(a){u(e);let r=l();return p(r.setCommentAuthor(a.target.value))}),c()(),o(32,"mat-form-field",17)(33,"mat-label"),m(34,"\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439"),c(),o(35,"textarea",19),g("input",function(a){u(e);let r=l();return p(r.setCommentText(a.target.value))}),m(36,"            "),c()(),o(37,"button",20),m(38," \u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C "),c()()()}if(i&2){let e,n,a,r,s=l();d(2),w("post-image-placeholder--empty",!((e=s.post())!=null&&e.imageUrl)),d(),N((n=(n=s.post())==null?null:n.imageUrl)?3:-1,n),d(3),C((a=s.post())==null?null:a.title),d(2),C((r=s.post())==null?null:r.text),d(3),B("\u0420\u0435\u0439\u0442\u0438\u043D\u0433: ",s.articleRating()),d(11),Y(s.comments()),d(9),_("value",s.commentAuthor()),d(4),_("value",s.commentText()),d(2),_("disabled",s.isCommentFormInvalid())}}function jt(i,t){i&1&&(o(0,"div",3),m(1,"\u041F\u043E\u0441\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D."),c())}var Nt=st.articlesSource==="api"?O:E,St=class i{constructor(t){this.postDetailsService=t}route=v(ot);destroyRef=v(U);title=v(rt);detailsStore=v(P);post=this.detailsStore.post;comments=this.detailsStore.comments;articleRating=this.detailsStore.articleRating;hasPost=this.detailsStore.hasPost;commentAuthor=h("");commentText=h("");isCommentFormInvalid=R(()=>this.commentAuthor().trim().length===0||this.commentText().trim().length===0);ngOnInit(){this.route.paramMap.pipe(x(this.destroyRef)).subscribe(t=>{let e=t.get("id")?.trim()??"";if(!e){this.title.setTitle("\u041F\u043E\u0441\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D | MyProject"),this.detailsStore.setData({post:null,comments:[],articleRating:0});return}this.loadPostDetails(e)})}setCommentAuthor(t){this.commentAuthor.set(t)}setCommentText(t){this.commentText.set(t)}onCommentFormSubmit(t){t.preventDefault(),this.addComment()}addComment(){if(this.isCommentFormInvalid()||!this.post())return;let t=this.post();if(!t)return;let e={author:this.commentAuthor(),text:this.commentText()};this.postDetailsService.addComment(t.id,e).pipe(x(this.destroyRef)).subscribe(n=>{this.detailsStore.setData(n),this.commentAuthor.set(""),this.commentText.set("")})}changeArticleRating(t){let e=this.post();e&&this.postDetailsService.changeArticleRating(e.id,t).pipe(x(this.destroyRef)).subscribe(n=>{this.detailsStore.setData(n)})}changeCommentRating(t,e){let n=this.post();n&&this.postDetailsService.changeCommentRating(n.id,t,e).pipe(x(this.destroyRef)).subscribe(a=>{this.detailsStore.setData(a)})}loadPostDetails(t){this.postDetailsService.getPostDetails(t).pipe(x(this.destroyRef)).subscribe(e=>{this.detailsStore.setData(e),this.title.setTitle(e.post?`${e.post.title} | MyProject`:"\u041F\u043E\u0441\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D | MyProject")})}static \u0275fac=function(e){return new(e||i)(G(L))};static \u0275cmp=A({type:i,selectors:[["app-post-details-page"]],features:[Z([P,{provide:L,useClass:Nt}])],decls:6,vars:1,consts:[[1,"post-details"],[1,"post-details-container"],["routerLink","/blog",1,"post-back-link"],[1,"post-not-found"],[1,"post-card"],[1,"post-card-content"],[1,"post-image-placeholder"],["alt","",3,"src"],[1,"post-info"],[1,"post-text"],[1,"rating-box","rating-box--article"],["mat-icon-button","",3,"click"],[1,"comments-section"],[1,"comments-list"],[1,"comment-card"],[1,"empty-comments"],[1,"comment-form",3,"submit"],["appearance","outline"],["matInput","",3,"input","value"],["matInput","","rows","4",3,"input","value"],["mat-raised-button","","color","primary","type","submit",3,"disabled"],[1,"comment-header"],[1,"rating-box","rating-box--comment"]],template:function(e,n){e&1&&(o(0,"section",0)(1,"div",1)(2,"a",2),m(3,"\u2190 \u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u0432 \u0431\u043B\u043E\u0433"),c(),j(4,Ft,39,10)(5,jt,2,0,"div",3),c()()),e&2&&(d(4),N(n.hasPost()?4:5))},dependencies:[at,ct,Mt,Pt,gt,pt,ut,Ct,bt,vt,ft,lt,dt,ht,nt],styles:[".post-details[_ngcontent-%COMP%]{padding:80px 7vw}.post-details-container[_ngcontent-%COMP%]{max-width:900px;margin:0 auto}.post-back-link[_ngcontent-%COMP%]{display:inline-block;margin-bottom:24px;color:var(--accent-green);text-decoration:none}.post-card[_ngcontent-%COMP%]{border:1px solid #e5e6eb;border-radius:var(--radius);padding:24px;margin-bottom:30px;background:#fff}.post-card-content[_ngcontent-%COMP%]{display:flex;gap:20px;align-items:flex-start}.post-image-placeholder[_ngcontent-%COMP%]{width:40%;height:230px;border-radius:var(--radius);background:#d9d9df;flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center}.post-image-placeholder[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;object-fit:cover}.post-image-placeholder--empty[_ngcontent-%COMP%]{background:#d9d9df}.post-info[_ngcontent-%COMP%]{flex:1;min-height:230px;display:flex;flex-direction:column}.post-text[_ngcontent-%COMP%]{margin:12px 0 20px;color:var(--text-secondary)}.rating-box[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}.rating-box--article[_ngcontent-%COMP%]{margin-top:auto;justify-content:flex-end}.comments-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-bottom:16px}.comment-form[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:10px;margin-bottom:24px;margin-top:44px}.comment-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .comment-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]{padding:10px;border:1px solid #d1d5db;border-radius:var(--radius)}.comment-form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:fit-content;padding:10px 18px;border:1px solid var(--accent-green);border-radius:var(--radius);background:var(--accent-green);color:#fff;cursor:pointer}.comment-form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled{opacity:.5;cursor:not-allowed}.comments-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:14px}.comment-card[_ngcontent-%COMP%]{border:1px solid #e5e6eb;border-radius:var(--radius);padding:14px;display:flex;flex-direction:column;gap:8px;background:#fff}.comment-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.comment-header[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--text-secondary);font-size:13px}.rating-box--comment[_ngcontent-%COMP%]{align-self:flex-end}.empty-comments[_ngcontent-%COMP%], .post-not-found[_ngcontent-%COMP%]{color:var(--text-secondary)}"],changeDetection:0})};export{St as PostDetailsPage};
