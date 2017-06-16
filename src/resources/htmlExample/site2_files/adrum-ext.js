;/* Version 63e9f33be79086444fbb75051659bdae v:4.0.8.0, c:a333e70831ea94d5e2b2997bfeeb2553e7317210, b:7955 n:17-4.0.8.next */(function(){/*


 Copyright (c) 2013, AppDynamics, Inc. All rights reserved.

 Derivative of Google Episodes:

 Copyright 2010 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 See the source code here:
 http://code.google.com/p/episodes/
*/
(function(){var a=window.ADRUM;a&&a.q&&!0!==window["adrum-disable"]&&(function(b){var c=b.b||(b.b={});c.Cc="2";c.va=3E3;c.Na=b.isDebug;c.kb=0;c.lb=1;c.ad=2;c.Tb=1E3;c.Pa=2E3;c.ib=10;c.Mc=2;c.wa=5;c.Qc=2;c.Ic=5;c.Hc=99999999;c.$c=-1;c.jb=180;c.Rc=50;c.Sc=50;c.Nc=40;c.xa=50;c.Gc=50;c.Zc=128;c.Kc=30;c.Lc=30;c.Jc=30;c.Oc=8;c.Qb=-99999;c.Ob=999999;c.Oa=20;c.ma=3E5;c.Vc=140;c.Pb=10;c.Tc=30;c.Xc=10;c.Yc=30;c.Uc=30;c.Wc=20;c.Pc=100;c.kc={eumAppKey:"ky",userPageName:"un",clientRequestGUID:"cg",otherClientRequestGUIDs:"og",
baseGUID:"bg",parentGUID:"mg",parentPageUrl:"mu",parentPageType:"mt",parentLifecyclePhase:"pp",pageType:"pt",pageUrl:"pu",pageReferrer:"pr",pageTitle:"pl",navOrXhrMetrics:"mn",resourceTimingInfo:"rt",cookieMetrics:"mc",userData:"ud",errors:"er",ajaxError:"ae",btTime:"bt",serverSnapshotType:"ss",hasEntryPointErrors:"se",dataType:"dt",geoCountry:"gc",geoRegion:"gr",geoCity:"gt",localIP:"lp",ip:"ip",BEACONS:"B",ver:"vr",eom:"em"}}(a||(a={})),function(b){(function(c){var e=function(){function d(){this.buffer=
[];this.xb=b.b.ma+this.now()}d.prototype.Ca=function(){var d=this.buffer;this.buffer=[];this.xb=b.b.ma+this.now();return d};d.prototype.add=function(d){this.buffer.push(d);1==this.buffer.length&&(this.xb=b.b.ma+this.now())};d.prototype.zd=function(){return 0==this.buffer.length};d.prototype.Ga=function(){return this.xb>this.now()};d.prototype.ra=function(){return this.buffer.length<b.b.Oa};d.prototype.now=function(){return(new Date).getTime()};return d}();c.hb=e})(b.b||(b.b={}))}(a||(a={})),function(b){(function(c){c.K=
function(e,d){function g(b){for(var d=0;d<b.length;d++){var g=b[d];g!=f&&0>c.Ua(m,g)&&m.push(g)}}if(!(e&&0<e.l.length))return null;d||(d=e);var f;if(0<d.l.length){if(f=d.l[0],0>c.Ua(e.l,f))return null}else return b.error("M48"),null;var k=d.k||e.k,h=d.j||e.j,m=[];g(e.l);g(d.l);return{F:f,M:m,h:b.b.lc(e.h,d.h),k:k,j:h}};c.lc=function(b,d){for(var g=b.concat(d),f={},c={},h=0;h<g.length;h++){var m=g[h],l=m[0],n=m[1],m=m[2];l in f||(f[l]=-1);f[l]=Math.max(f[l],n);l in c||(c[l]=-1);c[l]=Math.max(c[l],
m)}g=[];for(l in f)f.hasOwnProperty(l)&&g.push([l,f[l],c[l]]);return g};c.bb=function(c){if(!b.TPL.isArray(c))return null;for(var d=[],g=[],f=null,k=null,h=0;h<c.length;h++){if("string"!==typeof c[h])return null;c[h]=c[h].replace(/^"|"$/g,"");var m=decodeURIComponent(c[h]).split(":");if(2===m.length){var l=m[1];switch(m[0]){case "clientRequestGUID":case "g":d.push(l);break;case "btId":case "i":g.push([l,-1,-1]);break;case "btDuration":case "d":if(0===g.length)return null;m=b.b.wc(l);if(!b.b.jc(m)||
-1>m)return null;g[g.length-1][1]=m;break;case "btERT":case "e":if(0===g.length)return null;m=b.b.wc(l);if(!b.b.jc(m)||-1>m)return null;g[g.length-1][2]=m;break;case "serverSnapshotType":case "s":f=l;break;case "hasEntryPointErrors":case "h":k=l}}}return 0===d.length?null:{l:d,h:g,k:f,j:k}};c.ac="undefined"!==typeof window.crypto&&"undefined"!==typeof window.crypto.getRandomValues?function(){function b(d){for(d=d.toString(16);4>d.length;)d="0"+d;return d}var d=new Uint16Array(8);window.crypto.getRandomValues(d);
return b(d[0])+b(d[1])+"_"+b(d[2])+"_"+b(d[3])+"_"+b(d[4])+"_"+b(d[5])+b(d[6])+b(d[7])}:function(){return"xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx".replace(/[xy]/g,function(b){var d=16*Math.random()|0;return("x"==b?d:d&3|8).toString(16)})}})(b.b||(b.b={}))}(a||(a={})),function(b){(function(c){(function(c){function d(d,g){var c=d/b.b.sa*b.b.Pa;return g?Math.floor(c+0.001):c}function g(d,g){var c=d/b.b.Pa*b.b.sa;return g?Math.floor(c+0.001):c}function f(d){return"undefined"===typeof d||null===d||0===d.length?
null:b.b.Da(d)}c.ed=function(b,d,g){"undefined"!==typeof g&&null!==g&&(b+=d+"="+g+"&");return b};c.Qd=d;c.Jd=g;c.w=f;c.element=function(d){return b.b.Da(b.b.Da(d))};c.W=function(b,d){if(0===b.length)return null;for(var g=f("["),c=0;c<b.length;c++)g+=b[c]+f(",");return g+=f(d?">":"]")};c.qb=function(b){var d=!0,g=f("{"),c;for(c in b)b.hasOwnProperty(c)&&(d=!1,g+=c+f(":")+b[c]+f(","));return d?null:g+=f("}")};c.pa=function(d){d=Math.round(d);d<b.b.Qb&&(d=b.b.Qb);d>b.b.Ob&&(d=b.b.Ob);return f(d)};c.yb=
function(d,g){if(d>g||0>d)d=b.b.$c;return f(d)};c.truncate=function(d,c,f,e){"undefined"===typeof e&&(e=!0);if("undefined"===typeof d||null===d||0===d.length)return null;var n=3<=f?"...":"";f=g(f,!0);b.assert(f>=n.length);for(var a=!1,q=null;;){try{q=c(d);if(null===q)return null;if(q.length<=f)break}catch(r){}var s;a?s=d.length-1:(a=!0,s=f-=n.length);var t=e?0:Math.max(d.length-s,0);d=d.substr(t,s)}a&&(q=e?q+n:n+q);return q};c.Ab=function(c,f,e){if(0==e)return b.b.xa;if(f<c)return 0;f=d(g(b.b.xa,
!1)+(f-c)/e,!1);b.assert(f>=b.b.xa);b.debug("M49",c,f);return f}})(c.A||(c.A={}))})(b.b||(b.b={}))}(a||(a={})),function(b){(function(b){var e=function(){function b(){this.oc=/;jsessionid=[^/?]+/}b.Ld=function(b){for(var d=0,c=0;c<b.length;c++)d=(d<<5)-d+b.charCodeAt(c),d|=0;return d};b.prototype.D=function(b){if(null===b||void 0===b)return null;var d=b.match(this.oc);if(null!=d){var c=b.indexOf("?");if(0>c||c>d.index)return b.replace(this.oc,"")}return b};b.prototype.sb=function(b){if(null===b||void 0===
b)return null;var d=b.indexOf("?"),c=b.indexOf("#");0>d&&(d=Number.MAX_VALUE);0>c&&(c=Number.MAX_VALUE);return b.substring(0,Math.min(d,c))};b.prototype.Gd=function(g){if(null===g||void 0===g)return null;var c=this.sb(g);return c+"?"+b.Ld(g.substring(c.length))};return b}();b.Pd=e;b.N=new e})(b.b||(b.b={}))}(a||(a={})),function(b){(function(c){function e(d,c,f){var e=b.navTiming;c=e[c];f=e[f];c&&f?g[d]=f-c:b.debug("M50","NT",d,c,f)}function d(d,c,g){var e=b.b.marks;c=e[c];g=e[g];c&&g?f[d]=g-c:b.debug("M50",
"CK",d,c,g)}var g={},f={};c.cc=function(){if(!b.navTiming)return null;e("PLT","navigationStart","loadEventEnd");e("FBT","navigationStart","responseStart");e("SCT","navigationStart","requestStart");e("SHT","secureConnectionStart","connectEnd");e("DLT","domainLookupStart","domainLookupEnd");e("TCP","connectStart","connectEnd");e("RAT","requestStart","responseStart");e("FET","responseStart","loadEventEnd");e("DRT","responseStart","domContentLoadedEventStart");e("DDT","responseStart","responseEnd");e("DPT",
"responseEnd","domContentLoadedEventStart");e("PRT","domContentLoadedEventStart","loadEventEnd");e("DOM","navigationStart","domContentLoadedEventStart");b.viz&&b.b.rb(document.getElementById(b.viz),g,"navtime");return g};c.qd=function(){if(!b.b.marks)return{};d("PLT","starttime","onload");d("FBT","starttime","firstbyte");d("FET","firstbyte","onload");d("DRT","firstbyte","onready");d("PRT","onready","onload");d("DOM","starttime","onready");b.viz&&b.b.rb(document.getElementById(b.viz),f,"cookie");return f};
c.rb=function(d,c,g){var f=d,e=g;"xhr"===g&&(f=document.createElement("div"),d.appendChild(f),e="xhr_"+d.getElementsByTagName("div").length);d=document.createElement("p");d.innerHTML="Script loaded from "+b.adrumExtUrl+". Metrics collected are:";f.appendChild(d);d=document.createElement("table");d.id="ADRUM_"+e;var e=document.createElement("tbody"),a;for(a in c){g=document.createElement("tr");var q=document.createElement("td");q.innerHTML=a;q.className="name";var r=document.createElement("td");r.innerHTML=
c[a];r.className="value";g.appendChild(q);g.appendChild(r);e.appendChild(g)}d.appendChild(e);f.appendChild(d)}})(b.b||(b.b={}))}(a||(a={})),function(b){(function(c){var e=function(){function c(){this.dc=function(b){var d;return(b=b.pathname)&&-1!=(d=b.lastIndexOf("."))?c.da[b.substring(d+1,b.length).toLowerCase()]||c.V.Rb:c.V.Rb};this.Sa=function(f,e){this.Md=f;for(var h=new d,m=new d,l=0;l<e.length;l++){var n=e[l],a=b.TPL.parseURI(b.b.N.D(n.name)),q=n.initiatorType,r=this.dc(a);"xmlhttprequest"==
q&&(r=c.V.Bc);var s=this.rd(n),t=this.td(s,n),u=t?Math.round(t):t;this.fc(this.gc,q);this.fc(this.qc,r);this.zb.length<b.b.Pc&&this.zb.push({u:b.b.Da(this.Ma(a)),i:h.bc(this.hc,q),r:m.bc(this.sc,r),f:s,o:0===l&&n.isBase?1:u,m:this.sd(s,t,n)})}};this.version=2;this.Vd={};this.gc={};this.hc={};this.qc={};this.sc={};this.ub={};this.ub[c.g]=c.za;this.ub[c.B]=c.ua;this.zb=[]}c.xd=function(){for(var b=0;b<c.Nb.length;b++)c.da[c.Nb[b]]=c.V.Fc;for(b=0;b<c.Lb.length;b++)c.da[c.Lb[b]]=c.V.Ec;c.da.js=c.V.bd;
c.da.css=c.V.CSS;c.da.svg=c.V.cd;c.da.html=c.V.Mb;c.da.htm=c.V.Mb};c.prototype.fc=function(b,d){b[d]=b[d]?b[d]+1:1};c.prototype.rd=function(b){return b.fetchStart<=b.domainLookupStart?c.g:c.B};c.prototype.td=function(d,e){if(d==c.g||d==c.B)return e.startTime;b.error("M51",d)};c.prototype.sd=function(d,e,h){function m(b){l.push(0==h[b]?-1:Math.round(h[b]-e))}var l=[];d==c.g?(m("startTime"),m("redirectStart"),m("redirectEnd"),m("fetchStart"),m("domainLookupStart"),m("domainLookupEnd"),m("connectStart"),
m("connectEnd"),m("requestStart"),m("responseStart"),m("responseEnd")):d==c.B?(m("startTime"),m("fetchStart"),m("responseEnd")):b.error("M52",d);return l};c.prototype.P=function(b,d){if(3>=d)return"...";b.length>d&&(b=b.substring(0,d-3)+"...");return b};c.prototype.R=function(b,d){if(3>=d)return"...";b.length>d&&(b=b.substring(0,(d-3)/2)+"..."+b.substring(b.length-(d-3)/2,b.length));return b};c.prototype.Nd=function(d){d.length<=b.b.Pb||(d=this.P(d,b.b.Pb-1),d+=":");return d};c.prototype.U=function(d,
c,g){d=this.Nd(d);c=this.P(c,b.b.Tc);g=this.P(g,b.b.Xc);return 0<g.length?d+"//"+c+":"+g:d+"//"+c};c.prototype.Ma=function(d){function c(){return 0==n.length?g+a+e+l:g+n.join("/")+"/"+a+e+l}var g=this.U(d.protocol,d.hostname,d.port),e=this.P(d.search,b.b.Yc),l=this.P(d.hash,b.b.Uc),n=d.pathname.split("/"),a="";0<n.length&&(a=n.pop(),a=this.R(a,b.b.Wc));for(d=c();d.length>b.b.Vc;){if(0>=n.length)return b.error("Programming Error: All Url segments have been truncated and still cannot meet the requirement. Check max length limit"),
null;n.pop();n.push("...");d=c();n.pop()}return d};c.prototype.ob=function(){return{v:this.version,ic:this.gc,it:this.hc,rc:this.qc,rt:this.sc,f:this.ub,t:this.Md,r:this.zb}};c.g=1;c.B=2;c.za="startTime redirectStart redirectEnd fetchStart dnsLookupStart dnsLookupEnd connectStart connectEnd requestStart responseStart responseEnd".split(" ");c.ua=["startTime","fetchStart","responseEnd"];c.V={Fc:"img",bd:"script",CSS:"css",cd:"svg",Mb:"html",Ec:"font",Bc:"ajax",Rb:"other"};c.Nb="bmp gif jpeg jpg png webp".split(" ");
c.Lb=["ttf","woff","otf","eot"];c.da={};return c}();c.J=e;var d=function(){function b(){this.Dd=1}b.prototype.bc=function(b,d){b[d]||(b[d]=this.Dd++);return b[d]};return b}();e.xd()})(b.b||(b.b={}))}(a||(a={})),function(b){(function(c){c.n=[];c.vc=!1;c.$=0;c.Ia=function(){b.debug("M53");var c=b.b.Ia;b.b.Ia=function(){};setTimeout(function(){try{b.debug("M54"),b.b.Ia=c,0<b.b.n.length&&b.b.$<b.b.ib&&b.b.uc(!0)}catch(d){b.exception(d,"M55")}},b.b.va)}})(b.b||(b.b={}))}(a||(a={})),function(b){(function(b){var e=
function(){function b(){}b.Id=function(){return window.attachEvent?window.addEventListener?this.Jb:this.xc:this.yc};b.yc="uCT";b.Jb="uNET";b.xc="tIA";return b}();b.dd=e})(b.b||(b.b={}))}(a||(a={})),function(b){(function(c){function e(b){return 10<b?null:[1,50,100,500][b-1]||1E3}function d(b,d,c,e){function m(){if(d())c&&c();else{var n=b(++l);null!==n?setTimeout(m,n):e&&e()}}var l=0;m()}c.Bd=function(){if(b.geoResolverUrl){b.b.Kb(!0);var c=document.createElement("script");c.src=b.geoResolverUrl+"/resolve.js";
c.async=!0;var f=document.getElementsByTagName("script")[0];f&&f.parentNode.insertBefore(c,f);d(e,function(){return b.geo.failed||b.geo.result},function(){b.geo.failed?b.warn("M56"):(b.assert("object"===typeof b.geo.result),b.debug("M57",b.geo.result));b.b.Kb(!1)},function(){b.warn("M58");b.b.Kb(!1)})}};c.Kb=function(d){b.b.Ya=d;b.b.Za()}})(b.b||(b.b={}));b.geo={failed:!1,result:null}}(a||(a={})),function(b){(function(c){function e(d,c){for(var e in d)if(d.hasOwnProperty(e)){var a=d[e];if(0>a)return b.error("XHR "+
e+" ["+a+"] "+c),!1}return!0}c.oa=new b.b.hb;c.X=[];c.Rd=[];c.numBeaconsSent=0;c.F;c.M;c.h;c.k;c.j;c.Hb=function(d){var c={a:[1,2,3,"str"]};if(b.b.Z){if('{"a":[1,2,3,"str"]}'===JSON.stringify(c).replace(/\s/g,""))return JSON.stringify(d);if("function"===typeof Object.toJSON&&'{"a":[1,2,3,"str"]}'===Object.toJSON(c).replace(/\s/g,""))return b.error("M59"),Object.toJSON(d)}b.error("M60");return null};c.eb=function(d){var g={PLC:1,FBT:d.fbt-d.send,DDT:d.rat-d.fbt,DPT:d.eut-d.rat,PLT:d.eut-d.send,ARE:d.error?
1:0};if(e(g,d.url)){var f=null,a=b.b.dd,h=a.Id();h==a.xc?f=null:h==a.yc&&(f=d.parentPhaseAtSendTime);b.viz&&b.b.rb(document.getElementById(b.viz),g,"xhr");var m=b.b.S,l=function(){b.b.X.push(function(){b.debug("M61");var e=b.geo.result;h==a.Jb&&(f=b.lifecycle.findPhaseAtNominalTime(d.send));e=c.makeBeacon({clientRequestGUID:d.clientRequestGUID||b.b.ac(),otherClientRequestGUIDs:d.otherGUIDs,pageUrl:d.url,btTime:d.btTime,serverSnapshotType:d.serverSnapshotType,hasEntryPointErrors:d.hasEntryPointErrors,
pageType:b.b.ad,navOrXhrMetrics:g,baseGUID:m.Ea?m.Ea.ADRUM.b.F:b.b.F,parentGUID:b.b.F,parentUrl:document.URL,parentType:b.compareWindows(top,window)?b.b.kb:b.b.lb,parentLifecyclePhaseName:f,geoCountry:e?e.country:null,geoRegion:e?e.region:null,geoCity:e?e.city:null,localIP:e?e.localIP:null,ajaxError:d.error,isErrorBeacon:!1});b.b.oa.add(e)});b.b.Za()};h==a.Jb?(b.debug("M62"),setTimeout(l,0)):l()}};c.Kd=function(d){if(b.b.Z)b.isDebug&&b.debug("M63",d.length),c.sendCorsBeacons(d);else{b.isDebug&&b.debug("M64",
d.length);for(var g=0;g<d.length;g++)c.sendImgBeacon(d[g].beacon,d[g].useHTTPS)}};c.ud=function(){if(!b.resTiming)return null;if(!b.b.Z)return b.debug("M65"),null;var d=new c.J;d.Sa(b.navTiming.navigationStart,b.resTiming);return b.b.Hb(d.ob())};c.Va=function(d,c){if(!d)return null;var e=d.ADRUM.lifecycle;if(!e||!e.getPhaseCallbackTime)return null;var a=c.getPhaseCallbackTime("AT_ONLOAD"),e=e.getPhaseCallbackTime("AT_ONLOAD"),h=null==e;return null==a?(b.error("M66"),null):h||a<=e?"AFTER_FIRST_BYTE":
"AFTER_ONLOAD"};c.uc=function(d){var g=d?{}:b.b.cc(),e=d?{}:b.b.qd(),a=d?null:b.b.ud(),h=[];if(0<b.b.n.length){var m=d?b.b.wa:b.b.Mc,h=b.b.n.slice(0,m);h.length<b.b.n.length&&b.b.Ia();b.b.n=b.b.n.slice(m);b.b.vc||(g&&(g.EPM=1),e.EPM=1,b.b.vc=!0)}else d||(g&&(g.EPM=0),e.EPM=0);var l=b.b.S,n=null;d||(g&&(g.PLC=1),e.PLC=1,n=b.b.Va(l.Y,b.lifecycle));b.debug("M67");b.b.X.push(function(){var m=b.geo.result,m=c.makeBeacon({clientRequestGUID:c.F,otherClientRequestGUIDs:c.M,pageUrl:document.URL,pageTitle:document.title,
userPageName:b.b.Ac||null,pageReferrer:document.referrer,btTime:c.h,serverSnapshotType:c.k,hasEntryPointErrors:c.j,pageType:b.compareWindows(top,window)?b.b.kb:b.b.lb,navOrXhrMetrics:g,cookieMetrics:e,resourceTimingInfo:a,errors:h,baseGUID:l.Ea?l.Ea.ADRUM.b.F:b.b.F,parentGUID:l.Y?l.Y.ADRUM.b.F:null,parentUrl:l.Y?l.Y.document.URL:null,parentType:l.Y?b.compareWindows(top,l.Y)?b.b.kb:b.b.lb:null,parentLifecyclePhaseName:n,geoCountry:m?m.country:null,geoRegion:m?m.region:null,geoCity:m?m.city:null,localIP:m?
m.localIP:null,userData:b.b.zc,isErrorBeacon:d});b.b.oa.add(m)});b.b.Za()};c.sendCorsBeacons=function(d){for(var g=!1,e=0;e<d.length;e++)g=g||d[e].useHTTPS;g=(g?b.beaconUrlHttps:b.beaconUrlHttp)+"/eumcollector/beacons";e=new XMLHttpRequest;b.xhrOpen?b.xhrOpen.call(e,"POST",g):e.open("POST",g);e.setRequestHeader("Content-type","text/plain");var a=c.Hb(d);if(null!=a){b.xhrSend?b.xhrSend.call(e,a):(e.send(a),b.error("Sending CORS beacon over plain ADRUM.xhrSend"));b.info("Sending CORS Beacon:"+g+"\n");
b.info("<hr/>");if(b.isDebug)for(g=0;g<d.length;g++)b.beaconsSent.push(d[g].beacon);b.b.numBeaconsSent+=d.length}};c.sendImgBeacon=function(d,c){var e=(c?b.beaconUrlHttps:b.beaconUrlHttp)+"/eumcollector/adrum.gif?"+d,a=new Image;try{a.src=e}catch(h){b.assert(b.b.sa>b.b.Pa,"M68")}b.info("Sending Beacon:\n"+decodeURIComponent(e.replace(/&/g,"&<br/>")));b.info("<hr/>");b.isDebug&&b.beaconsSent.push(d);b.b.numBeaconsSent++};c.makeBeacon=function(d){function c(d,e){if(!b.b.Na){var g=b.b.kc[d];if(g)d=g;
else{b.error("M70",d);return}}a=h.ed(a,d,e);"undefined"!==typeof e&&null!==e&&(m[d]=e)}function e(d){if(!d)return null;var c={},g;for(g in d)d.hasOwnProperty(g)&&(c[g]=h.pa(d[g]));return b.b.Z?c:h.qb(c)}b.isDebug&&(b.debug("M69"),b.debug(Array.prototype.slice.call(arguments).join("\n\t")));var a="",h=b.b.A,m={};c("eumAppKey",h.w(b.appKey));c("ver",h.w(b.b.Cc));c("dataType",h.w("R"));c("clientRequestGUID",h.w(d.clientRequestGUID));c("pageUrl",h.truncate(b.b.N.D(d.pageUrl),h.w,b.b.jb));c("pageTitle",
h.truncate(d.pageTitle,h.w,b.b.Rc));c("userPageName",h.truncate(d.userPageName,h.w,b.b.Sc));c("pageReferrer",h.truncate(b.b.N.D(d.pageReferrer),h.w,b.b.jb));c("pageType",h.w(d.pageType));c("baseGUID",h.w(d.baseGUID));c("parentGUID",h.w(d.parentGUID));c("parentPageUrl",h.truncate(b.b.N.D(d.parentUrl),h.w,b.b.jb));c("parentPageType",h.w(d.parentType));c("parentLifecyclePhase",h.w(b.lifecycle.getPhaseID(d.parentLifecyclePhaseName)));c("geoCountry",h.truncate(d.geoCountry,h.w,b.b.Kc));c("geoRegion",h.truncate(d.geoRegion,
h.w,b.b.Lc));c("geoCity",h.truncate(d.geoCity,h.w,b.b.Jc));c("localIP",h.truncate(d.localIP,h.w,b.b.Oc));c("navOrXhrMetrics",e(d.navOrXhrMetrics));c("cookieMetrics",e(d.cookieMetrics));c("resourceTimingInfo",d.resourceTimingInfo);var l;d.otherClientRequestGUIDs=d.otherClientRequestGUIDs||[];var n=d.otherClientRequestGUIDs.slice(0,b.b.Qc);for(l=0;l<n.length;l++)n[l]=h.w(n[l]);c("otherClientRequestGUIDs",h.W(n,d.otherClientRequestGUIDs.length>n.length));d.btTime=d.btTime||[];var n=d.btTime.slice(0,
b.b.Ic),p=[];for(l=0;l<n.length;l++){var q=n[l];p.push(h.W([h.yb(Number(q[0]),b.b.Hc),h.pa(q[1]),h.pa(q[2])],!1))}c("btTime",h.W(p,d.btTime.length>n.length));d.userData=d.userData||[];c("userData",function(){for(var c=!1,e=h.Jd(b.b.Zc,!0),g=0,f=[],a=0;a<d.userData.length;a++){var m=d.userData[a];f[a]=h.W([h.element(m[0]),h.element(m[1])],!1);g+=f[a].length;if(g>e){c=!0;break}}for(;;){c=h.W(f,c);if(null===c||c.length<=e)return c;f.pop();c=!0}}());d.ajaxError&&c("ajaxError",h.W([h.element(d.ajaxError[0]),
h.truncate(d.ajaxError[1],h.element,b.b.Gc)],!1));d.errors=d.errors||[];n=d.errors.slice(0,b.b.ib-b.b.$);p=h.Ab(d.isErrorBeacon?870:354,b.b.sa-a.length-4,n.length);q=[];for(l=0;l<n.length;l++){var r=n[l],s=b.b.N.sb(b.b.N.D(r[0]));q.push(h.W([h.truncate(s,h.element,b.b.Nc,!1),h.pa(r[1]),h.truncate(r[2],h.element,p)],!1))}c("errors",h.W(q,!1));b.b.$+=n.length;d.serverSnapshotType&&c("serverSnapshotType",d.serverSnapshotType);d.hasEntryPointErrors&&c("hasEntryPointErrors",d.hasEntryPointErrors);c("eom",
1);return{beacon:b.b.Z?m:a,useHTTPS:0==d.pageUrl.indexOf("https:")||d.parentUrl&&0==d.parentUrl.indexOf("https:")}};c.prettyFormatBeacon=function(b){b=b.split("&");for(var c=0;c<b.length;c++)b[c]=decodeURIComponent(b[c]);return b.join("\n")}})(b.b||(b.b={}));b.beaconsSent=[]}(a||(a={})),function(b){(function(c){window.ADRUM.EXT=c;c.$b=function(){function e(d,g){try{if("object"!=typeof d)return String(d);if(0<=c.Ua(g,d))return"Already visited";g.push(d);var f;if(b.TPL.isArray(d)){for(var a="[ ",h=
0;h<d.length;h++)0!=h&&(a+=", "),a+=e(d[h],g);f=a+" ]"}else{var a="{ ",h=!0,m;for(m in d)h?h=!1:a+=", ",a+=e(m,g)+" => "+e(d[m],g);f=a+" }"}return f}catch(l){return"dumpObject failed: "+l}}return function(b){return e(b,[])}}();c.Ua="function"===typeof Array.prototype.indexOf?function(b,d){return b.indexOf(d)}:function(b,d){for(var c=0;c<b.length;c++)if(b[c]==d)return c;return-1};c.md=function(c){return b.b.Z?c:encodeURIComponent(c)};c.ld=function(b){return b};c.jc=function(b){return"number"===typeof b&&
!isNaN(b)&&isFinite(b)};c.wc=function(b){return/^[0-9]+$/.test(b)?Number(b):null};c.Za=function(){if(b.b.Fa||b.b.Ya)b.isDebug&&(b.b.Fa&&b.debug("M71"),b.b.Ya&&b.debug("M72"));else{for(var c=0;c<b.b.X.length;c++)try{b.b.X[c]()}catch(d){b.exception(d,"M73")}b.b.X=[];b.b.Z&&!b.b.fa&&b.b.oa.Ga()&&b.b.oa.ra()?b.debug("M74"):b.b.oa.zd()?b.debug("M75"):b.b.Kd(b.b.oa.Ca())}};c.S;c.Z;c.Da;c.marks={};c.sa;c.zc=[];c.Fa;c.Ya=!1;c.fa=!1;c.Ac})(b.b||(b.b={}))}(a||(a={})),function(b){(function(c){c.mc=0;(function(e){e.reportError=
function(d,c,e){b.debug("M76",d,c,e);b.b.$<b.b.ib&&(c&&0!==c.length||(c="CROSSORIGIN"),b.b.n.push([c,e,d]),b.b.fa&&b.b.Ia())};e.reportXhr=function(d,e,f,a){var h=c.ga(e);e=b.b.K(b.b.bb(h));b.debug("M77",h);h=null;400<=f&&(h=[f,a||""]);b.assert(d.url&&d.sendTime&&d.firstByteTime&&d.respAvailTime&&d.respProcTime,"missing some pieces of XHR data: url="+d.url+", send="+d.sendTime+", fbt="+d.firstByteTime+", rat="+d.respAvailTime+", eut="+d.respProcTime+", parentPhase="+d.parentPhase);if(d.url&&d.sendTime&&
d.firstByteTime&&d.respAvailTime&&d.respProcTime)if(f=b.TPL.getFullyQualifiedUrl(d.url),f===b.beaconUrlHttp+"/eumcollector/beacons"||f===b.beaconUrlHttps+"/eumcollector/beacons"){if(b.info("~EXT Ignoring XHR metrics captured for fat beacons URL [%s]",f),0===b.b.mc){b.b.mc++;d=new Image;f="Re-entrancy URL ["+f+"] ";f=b.xhrSend?f+("send ["+b.xhrSend.toString().substr(0,100)+"]"):f+"no native send captured";f=b.beaconUrlHttps+"/eumcollector/error.gif?version=1&appKey="+b.appKey+"&msg="+encodeURIComponent(f);
try{d.src=f}catch(m){}}}else b.b.eb({url:f,send:d.sendTime,fbt:d.firstByteTime,rat:d.respAvailTime,eut:d.respProcTime,parentPhaseAtSendTime:d.parentPhase,error:h,clientRequestGUID:e?e.F:null,otherGUIDs:e?e.M:null,btTime:e?e.h:null,serverSnapshotType:e?e.k:null,hasEntryPointErrors:e?e.j:null})};e.setPageName=function(c){b.b.Ac=c};e.setMaxBeaconLength=function(c){b.b.sa=Math.max(c,2E3)};e.addUserData=function(c,e){b.b.zc.push([c,e])};e.mark=function(c,e){b.debug("M78",c,e);b.b.marks[c]=e};e.reportOnload=
function(){setTimeout(function(){c.kd()},b.b.Tb)};e.listenForOkToSendChildFrameBeacons=function(c){b.debug("M79");try{c()}catch(e){b.exception(e,"M80")}}})(c.G||(c.G={}));c.ga=function(c){var d=c.split("\r\n"),g=/^\s*ADRUM_(\d+): (.+)\s*$/i;c=[];for(var f=0;f<d.length;f++){var a=d[f];try{var h=g.exec(a);h&&c.push([Number(h[1]),h[2]])}catch(m){b.exception(m,"M81",a)}}Array.prototype.sort.call(c,function(b,c){return b[0]-c[0]});h=[];for(d=0;d<c.length;d++)h.push(c[d][1]);return h};c.kd=function(){b.b.fa||
(b.b.fa=!0,b.debug("M82"),b.b.uc(!1),window.onerror!==b.windowErrorHandler&&b.warn("M83"))}})(b.b||(b.b={}))}(a||(a={})),function(b){(function(c){c.gb=function(){b.b.gb=function(){};b.b.Q(document.location.href,document.domain,"https:"===document.location.protocol,function(){return document.cookie},function(b){document.cookie=b})};c.Q=function(c,d,g,f,a){c="ADRUM=s="+Number(new Date)+"&r="+b.b.qa(c);var h=c+";path=/";g&&(h+=";secure");b.debug("M84",c);if(!b.useStrictDomainCookies){g=f();d=d.split(".");
for(var m="",l=d.length-1;0<=l;l--){m="."+d[l]+m;b.debug("M85",m);a(h+";domain="+m);var n=f();if(n!=g&&0<=n.indexOf(c)){b.debug("M86");b.debug("M87");return}}b.debug("M88")}b.debug("M89");a(h);b.debug("M90")};c.qa=function(c){return encodeURIComponent(b.b.N.Gd(c))}})(b.b||(b.b={}))}(a||(a={})),function(b){(function(c){c.Cd=function(){var b=c.pd()||c.tb();b&&c.G.mark("starttime",b)};c.pd=function(){var c;if(window.external&&"undefined"!=typeof window.external&&window.external.pageT&&"undefined"!=typeof window.external.pageT)c=
(new Date).getTime()-window.external.pageT;else if(window.Wa&&"undefined"!=typeof window.Wa&&window.Wa.pageT&&"function"===typeof window.Wa.pageT){var d=window.Wa.pageT();d&&(c=(new Date).getTime()-d)}else window.chrome&&"undefined"!=typeof window.chrome&&window.chrome.csi&&"function"===typeof window.chrome.csi&&(d=window.chrome.csi(),d.pageT&&"undefined"!=typeof d.pageT&&(c=(new Date).getTime()-d.pageT));c&&b.debug("M91",c);return c};c.tb=function(){var c=b.startTimeCookie;if(c){b.debug("M92",c.startTime,
c.startPage);var d=b.b.qa(document.referrer);if(d===c.startPage)if(isNaN(c.startTime))b.warn("M93",c.startTime);else return c.startTime;else b.debug("M94",d,c.startPage)}else b.debug("M95")}})(b.b||(b.b={}))}(a||(a={})),function(b){(function(c){(function(c){c.fd=function(){for(var c=[],e=window;!b.compareWindows(e,top);)e=e.parent,c.push(e);for(var e=[],f=0;f<c.length;f++)try{c[f].ADRUM&&e.push(c[f])}catch(a){}return{Y:e[0],Ea:e[e.length-1]}}})(c.Sb||(c.Sb={}))})(b.b||(b.b={}))}(a||(a={})),function(b){b.printSentBeacons;
(function(c){b.info("M96");c.descendantInstrumentedWindows;c.s=function(){b.info("M97");c.S=c.Sb.fd();c.Fa=Boolean(c.S.Y);var e=0==document.URL.indexOf("https:")||c.S&&c.S.document&&c.S.document.URL&&0==c.S.document.URL.indexOf("https:"),d=window.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest,g="undefined"!==typeof JSON&&!(!JSON||!JSON.stringify),e=-1<navigator.userAgent.toLowerCase().indexOf("firefox")&&e;c.Z=!("true"===b.sendImageBeacon||!0===window["adrum-send-image-beacon"])&&d&&g&&!e;
c.Da=c.Z?c.ld:c.md;d=c.K(c.bb(b.cookieMetadataChunks),c.bb(b.footerMetadataChunks));b.isDebug&&(b.debug("M98",b.cookieMetadataChunks),b.debug("M99",b.footerMetadataChunks),b.debug("M100",d));c.F=d?d.F:c.ac();c.M=d?d.M:[];c.h=d?d.h:[];c.k=d?d.k:null;c.j=d?d.j:null;c.sa=c.Pa;if(b.isDebug){c.descendantInstrumentedWindows=[];b.beaconsSent=[];var f=c.S.Ea;c.X.push(function(){f&&f.descendantInstrumentedWindows&&f.descendantInstrumentedWindows.push(window)})}c.Cd();b.addEventListener(window,"pagehide",function(){c.gb()});
b.addEventListener(window,"beforeunload",function(){c.gb()});b.addEventListener(window,"unload",function(){c.gb()});c.Bd();b.q.processQ();c.S.Y&&(b.debug("M104"),c.S.Y.ADRUM.command("listenForOkToSendChildFrameBeacons",function(){b.debug("M105");c.Fa=!1;c.Za()}));b.initEXTDone=!0;b.info("M106")};b.isDebug&&(b.printSentBeacons=function(){var e="";if(c.Z){if(e=c.Hb(b.beaconsSent),null==e)return""}else for(var d=0;d<b.beaconsSent.length;d++)e+=c.prettyFormatBeacon(b.beaconsSent[d])+"\n";for(d=0;d<c.descendantInstrumentedWindows.length;d++)var g=
c.descendantInstrumentedWindows[d],e=e+("---- Descendant window "+g.location.href+"\n"),e=e+g.ADRUM.printSentBeacons(),e=e+("---- End "+g.location.href+"\n");return e});c.s()})(b.b||(b.b={}))}(a||(a={})),function(b){var c=b.b||(b.b={});c.mm=b.b.K;c.pxh=b.b.ga;c.cPLPI=b.b.Va;c.dWC=b.b.Q;c.la=c.J.prototype.R;c.arti=c.J.prototype.Sa}(a||(a={})))})();})();
