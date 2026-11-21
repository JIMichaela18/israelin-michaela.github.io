(function(){
  var d = document, $ = function(s){ return d.querySelector(s); }, $$ = function(s){ return [].slice.call(d.querySelectorAll(s)); };
// Chat backend: POST {question} -> {answer}. CORS is configured for the GitHub Pages origin.
  var API_URL = "https://portfolio-chatbot-yoaz.onrender.com/ask";
  var CH = ["What are Israelin's main skills?", "Tell me about her professional experience", "Why did she take a career break?", "What does she create outside of coding?"];
  var lg = $("#log"), qi = $("#q"), busy = false;
  if (window.marked) marked.use({breaks:true, gfm:true});
  function renderMd(text){
    if (!window.marked || !window.DOMPurify) return d.createTextNode(String(text || ""));
    var clean = DOMPurify.sanitize(marked.parse(String(text || "")), {
      ALLOWED_TAGS:["p","br","strong","em","b","i","ul","ol","li","code","pre","a","blockquote"],
      ALLOWED_ATTR:["href","title","target","rel"],
      ALLOWED_URI_REGEXP:/^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i
    });
    var t = d.createElement("template"); t.innerHTML = clean;
    t.content.querySelectorAll("a").forEach(function(l){ l.target = "_blank"; l.rel = "noopener noreferrer"; });
    return t.content;
  }
  function add(t, w){ var m = d.createElement("div"); m.className = "msg " + w; m.textContent = t; lg.appendChild(m); lg.scrollTop = lg.scrollHeight; return m; }
  async function ans(q){
    var ctl = new AbortController(), timer = setTimeout(function(){ ctl.abort(); }, 60000);
    try {
      var r = await fetch(API_URL, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({question:q}), signal:ctl.signal});
      var j = null; try { j = await r.json(); } catch (e) {}
      if (r.status === 429) return "Sorry, too many requests have been sent. Please wait a moment and try again.";
      if (!r.ok) return "Sorry, TOB is unavailable right now. Please try again shortly.";
      if (j && typeof j.answer === "string" && j.answer.trim()) return j.answer;
      return "Sorry, TOB returned an unexpected response. Please try again.";
    } catch (e) {
      return e.name === "AbortError" ? "TOB took too long to wake up. Please try again in a moment." : "Sorry, there was a network problem while contacting TOB. Please check your connection and try again.";
    } finally { clearTimeout(timer); }
  }
  async function ask(q){
    q = (q || "").trim(); if (!q || busy) return;
    busy = true; add(q, "me"); qi.value = "";
    var w = add("Thinking…", "bot");
    var slow = setTimeout(function(){ w.textContent = "Waking up TOB… the free server sleeps when idle, so the first answer can take up to a minute."; }, 4000);
    var a = await ans(q);
    clearTimeout(slow);
    w.replaceChildren(renderMd(a));
    lg.scrollTop = lg.scrollHeight; busy = false;
  }
  CH.forEach(function(c){ var b = d.createElement("button"); b.type = "button"; b.className = "cq"; b.textContent = c; b.onclick = function(){ ask(c); }; $("#chips").appendChild(b); });
  $("#send").onclick = function(){ ask(qi.value); };
  qi.addEventListener("keydown", function(e){ if (e.key === "Enter") ask(qi.value); });

})();
