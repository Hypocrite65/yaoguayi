/* 页脚版本号：读取 data/versions.json，每条 git 记录即一个版本 */
(function () {
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  fetch("data/versions.json")
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var vs = d.versions || [];
      var el = document.getElementById("site-ver");
      var panel = document.getElementById("ver-panel");
      if (!el || !panel || !vs.length) return;
      var cur = vs[0];
      el.textContent = "版本 v" + cur.v;
      el.title = "查看版本历史（共 " + vs.length + " 个版本）";
      panel.innerHTML = vs.map(function (x) {
        return '<div class="ver-row"><span class="ver-n">v' + x.v + "</span>" +
          '<span class="ver-sha">' + esc(x.sha) + "</span>" +
          '<span class="ver-date">' + esc(x.date) + "</span>" +
          '<span class="ver-sub">' + esc(x.subject) + "</span></div>";
      }).join("");
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        panel.hidden = !panel.hidden;
      });
      document.addEventListener("click", function (e) {
        if (!panel.hidden && !panel.contains(e.target)) panel.hidden = true;
      });
    })
    .catch(function () { /* 版本文件缺失时静默 */ });
})();
