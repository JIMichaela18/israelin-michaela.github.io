
(function(){
  var d = document, R = d.documentElement; R.classList.add("js");
  var $ = function(s){ return d.querySelector(s); }, $$ = function(s){ return [].slice.call(d.querySelectorAll(s)); };
  var rm = matchMedia("(prefers-reduced-motion:reduce)").matches;

  var mb = $("#mode");
  mb.onclick = function(){
    var c = R.dataset.mode === "create";
    R.dataset.mode = c ? "tech" : "create";
    mb.setAttribute("aria-pressed", String(!c));
    mb.textContent = c ? "Switch to Create ✦" : "Switch to Compile ▸";
  };
  addEventListener("pointermove", function(e){ R.style.setProperty("--mx", e.clientX + "px"); R.style.setProperty("--my", e.clientY + "px"); });

  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); }, {threshold:.12});
  $$(".rv").forEach(function(n){ io.observe(n); });

  var roles = ["Java Backend Engineer","Full Stack Developer","Spring Boot Developer","Cook, Painter, Gardener","Curious builder"], ri = 0, ci = 0, del = false, ty = $("#type");
  function tick(){
    var w = roles[ri]; ci += del ? -1 : 1; ty.textContent = w.slice(0, ci);
    var s = del ? 30 : 70;
    if (!del && ci === w.length){ del = true; s = 1400; } else if (del && ci === 0){ del = false; ri = (ri + 1) % roles.length; s = 300; }
    setTimeout(tick, s);
  }
  if (rm) ty.textContent = roles[0]; else tick();

  $$("[data-n]").forEach(function(n){
    var to = +n.dataset.n, dec = n.dataset.n.indexOf(".") > -1, t0 = null;
    function f(t){ t0 = t0 || t; var p = Math.min((t - t0) / 1200, 1); n.textContent = (to * p).toFixed(dec ? 1 : 0); if (p < 1) requestAnimationFrame(f); }
    if (rm) n.textContent = to; else requestAnimationFrame(f);
  });

  var DK = [["about","\u263A\uFE0E","/about","Hello!"],["skills","\u2699\uFE0E","/skills","Toolbox"],["experience","\u279C","/experience","The road"],["education","\u2726","/learning","Gold stars"],["creative","\u2740","/creative","Craft corner"],["work","\u2318","/projects","Makes"],["ask","\u275D","/ask-tob","Chat with TOB"],["contact","\u2709\uFE0E","/contact","Say hi"]];
  var dock = $("#dock");
  DK.forEach(function(x){
    var a = d.createElement("a"); a.href = "#" + x[0]; a.textContent = x[1];
    a.setAttribute("data-l", x[2]); a.setAttribute("data-c", x[3]); a.setAttribute("aria-label", x[3]);
    a.addEventListener("click", function(){
      a.classList.remove("pop"); void a.offsetWidth; a.classList.add("pop");
      var t = d.getElementById(x[0]);
      setTimeout(function(){ t.classList.remove("flash"); void t.offsetWidth; t.classList.add("flash"); setTimeout(function(){ t.classList.remove("flash"); }, 1200); }, rm ? 0 : 500);
    });
    dock.appendChild(a);
  });
  var dl = $$("#dock a"), hl = d.createElement("i"), cur = null, hov = false;
  hl.className = "hl"; dock.insertBefore(hl, dock.firstChild);
  function place(a){
    if (!a){ hl.style.opacity = 0; return; }
    hl.style.width = a.offsetWidth + "px"; hl.style.height = a.offsetHeight + "px"; hl.style.left = a.offsetLeft + "px";
    hl.style.setProperty("--y", a.offsetTop + "px"); hl.style.opacity = 1;
  }
  dl.forEach(function(a){
    a.addEventListener("pointerenter", function(){ hov = true; place(a); });
    a.addEventListener("focus", function(){ place(a); });
  });
  dock.addEventListener("pointerleave", function(){ hov = false; place(cur); });
  dock.addEventListener("focusout", function(){ place(cur); });
  addEventListener("resize", function(){ place(cur); });
  var spy = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (!e.isIntersecting) return;
      cur = null;
      dl.forEach(function(a){ var on = a.getAttribute("href") === "#" + e.target.id; a.classList.toggle("on", on); if (on) cur = a; });
      if (!hov) place(cur);
    });
  }, {rootMargin:"-45% 0px -50% 0px"});
  $$("main section[id]").forEach(function(s){ spy.observe(s); });
  function prog(){ var h = R.scrollHeight - innerHeight; R.style.setProperty("--p", h > 0 ? (scrollY / h * 100).toFixed(1) : 0); }
  addEventListener("scroll", prog, {passive:true}); prog();
  var tt = $("#totop"), snd = $("#snd"), rideEl = $("#ride"), cab = $("#cab"), flr = $("#flr"), riding = false, muted = false, AC = null;
  try { muted = localStorage.getItem("im-mute") === "1"; } catch (e) {}
  function syncSnd(){ snd.classList.toggle("off", muted); snd.setAttribute("aria-pressed", String(!muted)); snd.setAttribute("aria-label", muted ? "Turn sound effects on" : "Turn sound effects off"); }
  syncSnd();
  snd.addEventListener("click", function(){ muted = !muted; try { localStorage.setItem("im-mute", muted ? "1" : "0"); } catch (e) {} syncSnd(); });
  function audio(){
    if (muted || rm) return null;
    if (!AC){ var C = window.AudioContext || window.webkitAudioContext; if (C) AC = new C(); }
    if (AC && AC.state === "suspended") AC.resume();
    return AC;
  }
  function tone(f, at, dur, type, vol){
    var o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(f, at);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g); g.connect(AC.destination); o.start(at); o.stop(at + dur + 0.05);
  }
  function beep(){ if (!audio()) return; if (R.dataset.mode === "create"){ rustle(); return; } var t = AC.currentTime; tone(880, t, .12, "sine", .1); tone(880, t + .2, .12, "sine", .1); }
  function rustle(){
    var len = Math.floor(AC.sampleRate * .5), buf = AC.createBuffer(1, len, AC.sampleRate), data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / len);
    var src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    f.type = "bandpass"; f.frequency.value = 2400; g.gain.value = .12;
    src.buffer = buf; src.connect(f); f.connect(g); g.connect(AC.destination); src.start();
  }
  function floorTick(n){ if (R.dataset.mode === "create") tone(440 + (n || 0) * 110, AC.currentTime, .3, "sine", .07); else tone(1046, AC.currentTime, .05, "square", .04); }
  function ding(){
    if (!AC || muted) return;
    var t = AC.currentTime;
    if (R.dataset.mode === "create"){ [523, 659, 784, 1047].forEach(function(f, i){ tone(f, t + i * .13, .7, "sine", .08); }); return; }
    tone(1175, t, .5, "sine", .12); tone(880, t + .4, .8, "sine", .12);
  }
  function replayName(){ $$("h1 span").forEach(function(sp){ sp.style.animation = "none"; void sp.offsetWidth; sp.style.animation = ""; }); }
  function toggleTop(){
    var vis = scrollY > 500 && !riding, was = tt.classList.contains("show");
    tt.classList.toggle("show", vis); snd.classList.toggle("show", vis);
    tt.setAttribute("aria-label", R.dataset.mode === "create" ? "Grow the vine back to the top" : "Take the elevator back to the top");
    if (vis && !was){ tt.classList.add("peek"); setTimeout(function(){ tt.classList.remove("peek"); }, 2600); }
  }
  addEventListener("scroll", toggleTop, {passive:true}); toggleTop();
  function ease(t){ return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function ride(y0){
    riding = true; R.classList.add("riding"); toggleTop();
    var plant = R.dataset.mode === "create", leaves = [], side = 0;
    var FL = [["about","1 \u00b7 About"],["skills","2 \u00b7 Skills"],["experience","3 \u00b7 Experience"],["education","4 \u00b7 Learning"],["creative","5 \u00b7 Creative"],["work","6 \u00b7 Projects"],["ask","7 \u00b7 Ask TOB"],["contact","8 \u00b7 Contact"]];
    var tops = FL.map(function(f){ var el = d.getElementById(f[0]); return el ? el.getBoundingClientRect().top + scrollY : 0; });
    function floorAt(y){ var line = y + innerHeight * .4, cur = "G \u00b7 Home"; for (var i = 0; i < FL.length; i++){ if (tops[i] <= line) cur = FL[i][1]; } return cur; }
    var STG = ["Seed", "Sprout", "Leaves", "Bud", "Bloom"];
    function stageAt(p){ return STG[p < .2 ? 0 : p < .45 ? 1 : p < .7 ? 2 : p < .95 ? 3 : 4]; }
    var last = plant ? STG[0] : floorAt(y0); flr.textContent = last;
    rideEl.classList.add("go"); cab.classList.remove("bloom"); cab.classList.add("open"); cab.style.setProperty("--ty", "0px");
    beep();
    var hum = null;
    if (!plant && audio() && !muted){ var g = AC.createGain(); hum = AC.createOscillator(); hum.type = "sawtooth"; hum.frequency.value = 58; g.gain.value = .02; hum.connect(g); g.connect(AC.destination); hum.start(); }
    var t0 = null, dur = Math.min(3200, 1800 + y0 * 0.1), travel = innerHeight - 60, nextLeaf = 40;
    function leaf(y){ var l = d.createElement("i"); l.className = "leaf " + (side++ % 2 ? "r" : "l"); l.style.bottom = y + "px"; rideEl.appendChild(l); leaves.push(l); }
    function arrive(){
      if (hum){ try { hum.stop(); } catch (e) {} }
      if (plant) cab.classList.add("bloom"); else cab.classList.add("open");
      ding(); replayName();
      setTimeout(function(){
        rideEl.classList.remove("go"); riding = false; R.classList.remove("riding"); toggleTop();
        leaves.forEach(function(l){ l.remove(); }); cab.classList.remove("bloom");
      }, plant ? 1800 : 1100);
    }
    function step(t){
      t0 = t0 || t;
      var p = Math.min((t - t0) / dur, 1), e = ease(p), y = y0 * (1 - e);
      cab.style.setProperty("--ty", (-travel * e) + "px");
      scrollTo({top: y, behavior:"instant"});
      var lb = plant ? stageAt(p) : floorAt(y);
      if (lb !== last){ last = lb; flr.textContent = lb; if (AC && !muted) floorTick(plant ? STG.indexOf(lb) : 0); }
      if (plant && travel * e >= nextLeaf){ leaf(travel * e); nextLeaf += 64; }
      if (p < 1) requestAnimationFrame(step); else arrive();
    }
    setTimeout(function(){ cab.classList.remove("open"); }, 80);
    setTimeout(function(){ requestAnimationFrame(step); }, plant ? 300 : 650);
  }
  tt.addEventListener("click", function(){
    if (riding) return;
    var y0 = scrollY;
    if (rm){ scrollTo({top:0, behavior:"instant"}); return; }
    ride(y0);
  });

  var mt = $(".mq-t"); mt.innerHTML += mt.innerHTML;

  var ST = {"Languages":["Java 11","SQL","JavaScript","HTML","CSS"],
    "Frameworks":["Spring Boot","Spring MVC","Spring Data JPA","Hibernate","Spring Batch","Spring Tiles","Java EE","Jakarta EE","Struts2","DWR","EHCache","Bootstrap","jQuery"],
    "Databases":["MySQL","PostgreSQL","IBM DB2"],
    "Cloud & DevOps":["AWS S3","AWS SES","Docker","Azure Repos","Azure DevOps"],
    "APIs & Security":["RESTful APIs","OAuth 2.0","JJWT"],
    "Testing":["JUnit","Mockito","Postman"],
    "Reporting & Visualization":["Jaspersoft Studio","Apache ECharts"],
    "Version Control":["Git","TortoiseSVN"],
    "Methodologies":["Agile","Waterfall","Jira"]};
  var tb = $("#tabs"), pl = $("#pills");
  function show(k){
    $$("#tabs button").forEach(function(b){ b.setAttribute("aria-pressed", String(b.textContent === k)); });
    pl.innerHTML = "";
    ST[k].forEach(function(x, i){ var e = d.createElement("span"); e.className = "pill"; e.textContent = x; e.style.animationDelay = i * 40 + "ms"; pl.appendChild(e); });
  }
  Object.keys(ST).forEach(function(k){ var b = d.createElement("button"); b.type = "button"; b.className = "tab"; b.textContent = k; b.onclick = function(){ show(k); }; tb.appendChild(b); });
  show("Languages");

  var CT = [["🎨","Drawing","Sketching first, like designing a schema before writing code."],
    ["🖌️","Painting","Working in layers, like building features and refining the details."],
    ["📖","Crafting recipes","A recipe is an algorithm: inputs, clear steps and a tested result."],
    ["🍳","Cooking","Improvising under pressure, like debugging a production issue."],
    ["🧁","Baking","Precision and patience, like a careful deployment."],
    ["✂️","Art and craft projects","Making something from scratch, end to end, with full ownership."],
    ["🌱","Gardening","Slow growth and regular care, like maintaining a healthy codebase."]];
  var tg = $("#tiles");
  CT.forEach(function(c){
    var b = d.createElement("div"); b.className = "tile";
    b.innerHTML = "<b>" + c[0] + "</b><strong>" + c[1] + "</strong><span>" + c[2] + "</span>";
    tg.appendChild(b);
  });

  var RESUME = "JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNSAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0EgPDwKL1MgL1VSSSAvVHlwZSAvQWN0aW9uIC9VUkkgKGh0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9pc3JhZWxpbi1taWNoYWVsYS1qb3NlcGgtYjA4ODI0MWIwLykKPj4gL0JvcmRlciBbIDAgMCAwIF0gL1JlY3QgWyAxNTguMTg1IDc2Mi4yMjMzIDM2NS4yNTcgNzczLjAyMzMgXSAvU3VidHlwZSAvTGluayAvVHlwZSAvQW5ub3QKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtT2JsaXF1ZSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjMgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Bbm5vdHMgWyA0IDAgUiBdIC9Db250ZW50cyAxMCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA5IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAKICAvVHJhbnMgPDwKCj4+IC9UeXBlIC9QYWdlCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgOSAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjggMCBvYmoKPDwKL0F1dGhvciAoSXNyYWVsaW4gTWljaGFlbGEgSm9zZXBoKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYxMTE3MDk0ODM4KzAwJzAwJykgL0NyZWF0b3IgKFwodW5zcGVjaWZpZWRcKSkgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYxMTE3MDk0ODM4KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKFwodW5zcGVjaWZpZWRcKSkgL1RpdGxlIChJc3JhZWxpbiBNaWNoYWVsYSBKb3NlcGggLSBSZXN1bWUpIC9UcmFwcGVkIC9GYWxzZQo+PgplbmRvYmoKOSAwIG9iago8PAovQ291bnQgMSAvS2lkcyBbIDYgMCBSIF0gL1R5cGUgL1BhZ2VzCj4+CmVuZG9iagoxMCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAyODU3Cj4+CnN0cmVhbQpHYiE7Zj5CQU4+JnE4MDFrYmciRiRTL2ZAY0k5VXNBRlVTbSE+OyMnamQvN0FkX3E7PFI/QCElZyluJ20nJC5xRz1QaCJzaFJHJkhjaC1ra2xgWVhoNWZaKmFwdHEsNWM9WlMpVUItKVVaUiRIc0IjRXNKTDlsKl1oXGhuQkQrQVlvTmMlNG5rQGZsbT1uaiIkZWRVQyFvaDlUbVJZS2pLK0crZXNWR1UmdF8oPFNUOUpBUmRLa1tPbjouQSttKVIwRmJiUmE2Jl5dZyZdJUgjKGkpcEViMiZxJV42LTdRTzdWT05oYmBUL3BqW2MrY0MlbERiYW5TQ3UuIjI/OGdfNnJRcztsblFzUzVQZSk/WTBnOjpgKE1bOS4xTixgLFA2Xkk0Tj1fPlw1XixyJkRFWlpybTY3U1xgRSwoMm0vXG9fb2ZKS0xNP1VkNk5DNi1cJUc7Yy9tbmFfWy5nY1NoPS0+XkFicDIlckEkKmUqWlkmaFszKU1jPzIiITEiVFZcZWpkXkRdajBgXD1XKFJyVUBCbnNFSVtRWjJILSo2cEdmUF8mLD1HaDVvRCNBaEJnLFAwcWBZRzpObWVrTGdZT0pJLDM9aG87LDMhQE8vSGZKK0IxTi0/cnAkI1dCaT5WRjN1NTkxVDRuO0NOSlo4LUpSR1BSOWtuVDdUYjljVWMhJ1lUczQtTlhOLTo1YHU6RTtrXCoiRUxwa3VYP0thYlFQT1szLEcqb2RYWkI4LS1TdS0kaWlCOUZgNHIzcDdvSFUkNSpcci5jRFxOVSxtQkkvJmJBU0tpbERXKTRHcTRNJGJYSnQkZV1zRVYqJiZHTTReJVdCOV4/cjBKWG1JMiEhJjlpbFgjX1BDUSdlKnUia1ZTaGlaQlM/RGN0Sl4xYmxWOUYiO2c2ISFuTzdIYXBtPE5WaEhfK2o4N3MyYy04IWZSazJEXVIpUnBPRE8/JWIpOWYrcTAra09JVnIsWEcwLC5mV0V1WSZgJFVkXSFZTSI0UFNfU2A0REwkXlBCRnBoX3EvNCtoNWRJNWxzbmZvPlEzKDtVZW4vRloucUBmIW1aXW5CYSM3Zj4lIiZKJiFdIWMjUXVmajlXUCVdXSxBUCRwUGJsL1JCSlM7TXUxWyFIbWIxLV9rQ0FoOVteZSxddTVTXVo6NGE/Oiw8RT1ccTdhPjdPUmk7QGNISmAxTUxpZUtMYlJVJ05XVWBLNygzTiQ/QjY+KVVeb3VuWjc9PW5WaUE6b2NabGJeLmo+XDhQW2BWSl82JS1NODgkU2ZudEIha0JOL104VnM0Qz1hWWNmc15VaDNZTyE0LCg7MVdKLj5uOkBJJjdVLGg0dWtXby88TlxFTWYuQDhlSUVla0tIME8xYCxiXSlrKU4wSVtFV0xqUWFYbk5TYyksPWhmNDlHMV4jSG1xYV9QWDxza1pcazRaUE4sc05iNWptUF1vVG5fWElIXXMsbydwUlBDaDBBXEBZc1FtQyFOa11pRUVEJT8/VS1fW2lILiEhTmJuPE0rI1Y3ZSZYMiNuRVM3M09DaEBQSHBQTDE5bVUnbm49XUtHXlU9cjUlV2NSWCotKHFoYkhLWD4mUigtP3VtRm8tXkJyKShxIlxMN05lLEMqQCVmZj1LITJdLnFQc149W3JhLlg/dDUzQEhaUUlMJCxgS0g3UWtVX0hINzdIaDBSTzs5VDUoN2xPJis1XkMjSVlabl5ETUZBJm43alhuLEQpbTRZPUszRlgvaWYhTVs8ajBNLDNwKiE0YTlEVC8vZFQ0a3VIOyhELzpaLTJpRVtkN1MxLlorczR0PmR0QUZVOzokM182YyZaYFBwTStgOCUsbTguOCVIVy5HJU9MYWVSVUFncT1WL1p1L2pFYW5fJzI/ZmdQJz84XDk3M1RoIkkvTTpSRylKcTNgY2Q6NkczN0lgMWBsMVhmYEVzRmFmMUQxNT5sNC5mT04/Ji9xPzQqSmhUUk8qNjIjLHJpWiVwLDUzbUAwOzhWX1kmaXJla0ZQYEcqUy1TNTQtN09COCJURC0kSlYhNE9OJVZNQUZob04yLmFHNz9BTFVCI0tbMisrVVxKIiIiWXFrREhSUWY9Oj5tJEs0TD82QGhzbWtEMV8lV1omQy0jVkklOj9NWCJNR0oqZmFKP11jXlUiYGMzOyQvPEdZWjcyXWIyPEJqLW9WZSZHYGdVJ2MtX2dMV2F0a1FFbWJHdSFiY1Z1JXIwNU5pa0QlJltNXTJebl5hRkQlaltkMDZLPiZPOjkkJiVIYENVdCliYldIXz8rNnJqM3EqXGlwJkdecyVQZ2hoPW9FPU9YU0w7I1lEWD0nTkUpS3UiW2w8SmZuKVFIMlcjNz9hayIpTDAnSjI/I0JdJCM8QidcZiJAOjxLYiNrTHNDU2djX0RYNy0+P1okI2JRQWImakBPaC8/OCFrRFQ+VUY5LCZbVD0oQko6R0EjPj5APUglSEA8bkIsa0JPajhtR2QpK0EkW2UuVyxEN11NRyRWdWg9QVtTLFBINmAyREtOcDJRO2xUYipUZUp1WlMma0JaRWtwV2wvIThtWDJsQF5XSmQtS2cxK3EuTmxwbDUnL29DTy9fR29TUmE1dSZCYkY5K0lXRzQ9Q1ByJHErQyxaY3A2KWskZjRBJkZBRiZrW2BPXVosOmMoaCQhWzQpMjonL1pBWEMzX0RgRFNILi1DOmdxOjJLQWMramArb25NX2E/VFcmOzpnSTgkOS4iL1pySk8uNUlPaD44RGRrOEI+Y05kcTwtRi8/L2ReQj1FWic0YUlhOms6LU1gcygubCYoUC1aWDFqTjJmTjNMSyxePl9pV2IyMEVUU1RpWEQmXUEsVTFuTXU/PzhePFtWVTg/a29Sai9LKDxAY1NxMVktL0wxNXAlQV4laWZoQTxwSGlLRTRhdWcyZEpqailvUFZJWVxBJTBbaSE/SWhmIlkpaUA4SztvKTNpZkpTMG88ak4rXE9gLzhpOl0yVFRDLyZfJjFDMmhEJl8xPD9ZRD0hKFArQk90QSxtaVtZYShdZVhXTkNpIkBCOTU4ZGRrJElnZU5MVSleaUlWNGE7bkY/M0kubylxZi5DPSVUJjoyRDxPRUBrZ2ZNUnAmNjhDZSdIXVIqLEdgJSVUTTNTVnFWLWRxJCFnQkxKamBVcithcEhsVWBcJFBDbTktPmYyJT1HND1VXy5MMGdiQl9wLnFGLVxYbjtvaHFGbWQyWGY8U2EuRjEqNChoZDRUQDIjY1VRTTw+KDxGKFhtYD41XW5eL1tvZl9uVlprZU06NVpcQSVedUk3UWtQYSpdLCdyXVs8S2c1NE4jYGJhZUU4T1lfaF1aNjxHK21XYFcvWFIpR2lnMmAvJjtmKGJPLlBsPiQvbXBCOkImclEwPlNNNE4/ciErKktWI2hYPWxUInM3PUBbbE1bTy5IcGFUPDFqYyUrVWVtZz0pb1FnOycuUlQqR10iSllBc1gxMVdbcVx1ZmcuNDFYWWUjYS1zLls3SGBkPVk/QllBWSRHSTVVNWxcPUtSajY7Vk4oREo3LjttLC1DREBiXEp0RUJwaFdfJ0UvUWoiYVluM00wX05WWjBeWTVAc0Y7TysjVFZwX29aYGVFUlpuRCVGOyFHUUIoRFM3XnB1Q1QpUkNxPm9DdUNoXCtGS3BaYz9LXV4zRUZELDRTKlopVic3V2JeRzpLM0kyPldyYTlFPiVlNTFxZitSZTBEZWhDXkBYVyE+TzVjO05xXVEjcU0rQ2dHZys+S2ZBOTpyJjI1PVVfW2FtXWJiP0htS1FobkhVOUosMH4+ZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMTEKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMTIgMDAwMDAgbiAKMDAwMDAwMDIxOSAwMDAwMCBuIAowMDAwMDAwMzMxIDAwMDAwIG4gCjAwMDAwMDA1NDQgMDAwMDAgbiAKMDAwMDAwMDY1OSAwMDAwMCBuIAowMDAwMDAwODgxIDAwMDAwIG4gCjAwMDAwMDA5NDkgMDAwMDAgbiAKMDAwMDAwMTI2MCAwMDAwMCBuIAowMDAwMDAxMzE5IDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPDYzMWQzMzdkNzRiZTVmM2QwZTliZjdiY2YyODQyYzMyPjw2MzFkMzM3ZDc0YmU1ZjNkMGU5YmY3YmNmMjg0MmMzMj5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0IChvcGVuc291cmNlKQoKL0luZm8gOCAwIFIKL1Jvb3QgNyAwIFIKL1NpemUgMTEKPj4Kc3RhcnR4cmVmCjQyNjgKJSVFT0YK";
  $$("[data-resume]").forEach(function(a){ a.href = "data:application/pdf;base64," + RESUME; });
})();
