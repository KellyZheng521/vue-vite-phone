// https://juejin.cn/post/6964357725652254734

function canvasWM({
  container = document.body,
  width = "200px",
  height = "200px",
  textAlign = "center",
  textBaseline = "middle",
  font = "12px Helvetica",
  fillStyle = "rgba(184, 184, 184, 0.4)",
  content = "水印",
  rotate = "-20",
  zIndex = 10000,
} = {}) {
  const args = arguments[0];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const ratio = window.devicePixelRatio || 1;
  canvas.width = parseFloat(width) * ratio;
  canvas.height = parseFloat(height) * ratio;
  ctx.scale(ratio, ratio);

  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.translate(parseFloat(width) / 2, parseFloat(height) / 2);
  ctx.rotate((Math.PI / 180) * rotate);
  ctx.fillText(content, 0, 0);

  const base64Url = canvas.toDataURL();
  const _wm = document.querySelector("._wm");

  const watermarkDiv = _wm || document.createElement("div");
  const styleStr = `
      position:fixed;
      top:0;
      left:0;
      bottom:0;
      right:0;
      width:100%;
      height:100%;
      z-index:${zIndex};
      pointer-events:none;
      background-repeat:repeat;
      background-image:url('${base64Url}');
      background-size:${width} ${height};`;

  watermarkDiv.setAttribute("style", styleStr);
  watermarkDiv.classList.add("_wm");

  if (!_wm) {
    container.style.position = "relative";
    container.insertBefore(watermarkDiv, container.firstChild);
  }

  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  if (MutationObserver) {
    let mo = new MutationObserver(function () {
      const _wm = document.querySelector("._wm");
      // 只在_wm元素变动才重新调用 canvasWM
      if ((_wm && _wm.getAttribute("style") !== styleStr) || !_wm) {
        // 避免一直触发
        mo.disconnect();
        mo = null;
        canvasWM(JSON.parse(JSON.stringify(args)));
      }
    });

    mo.observe(container, {
      attributes: true,
      subtree: true,
      childList: true,
    });
  }
}

export default canvasWM;
