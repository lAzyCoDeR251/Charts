(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const e of document.querySelectorAll('link[rel="modulepreload"]')) s(e);
  new MutationObserver((e) => {
    for (const n of e)
      if (n.type === "childList")
        for (const r of n.addedNodes)
          r.tagName === "LINK" && r.rel === "modulepreload" && s(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function i(e) {
    const n = {};
    return (
      e.integrity && (n.integrity = e.integrity),
      e.referrerPolicy && (n.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === "use-credentials"
        ? (n.credentials = "include")
        : e.crossOrigin === "anonymous"
        ? (n.credentials = "omit")
        : (n.credentials = "same-origin"),
      n
    );
  }
  function s(e) {
    if (e.ep) return;
    e.ep = !0;
    const n = i(e);
    fetch(e.href, n);
  }
})();
function S(h) {
  var t = h.width,
    i = h.height;
  if (t < 0) throw new Error("Negative width is not allowed for Size");
  if (i < 0) throw new Error("Negative height is not allowed for Size");
  return { width: t, height: i };
}
function F(h, t) {
  return h.width === t.width && h.height === t.height;
}
var js = (function () {
  function h(t) {
    var i = this;
    (this._resolutionListener = function () {
      return i._onResolutionChanged();
    }),
      (this._resolutionMediaQueryList = null),
      (this._observers = []),
      (this._window = t),
      this._installResolutionListener();
  }
  return (
    (h.prototype.dispose = function () {
      this._uninstallResolutionListener(), (this._window = null);
    }),
    Object.defineProperty(h.prototype, "value", {
      get: function () {
        return this._window.devicePixelRatio;
      },
      enumerable: !1,
      configurable: !0,
    }),
    (h.prototype.subscribe = function (t) {
      var i = this,
        s = { next: t };
      return (
        this._observers.push(s),
        {
          unsubscribe: function () {
            i._observers = i._observers.filter(function (e) {
              return e !== s;
            });
          },
        }
      );
    }),
    (h.prototype._installResolutionListener = function () {
      if (this._resolutionMediaQueryList !== null)
        throw new Error("Resolution listener is already installed");
      var t = this._window.devicePixelRatio;
      (this._resolutionMediaQueryList = this._window.matchMedia(
        "all and (resolution: ".concat(t, "dppx)")
      )),
        this._resolutionMediaQueryList.addListener(this._resolutionListener);
    }),
    (h.prototype._uninstallResolutionListener = function () {
      this._resolutionMediaQueryList !== null &&
        (this._resolutionMediaQueryList.removeListener(
          this._resolutionListener
        ),
        (this._resolutionMediaQueryList = null));
    }),
    (h.prototype._reinstallResolutionListener = function () {
      this._uninstallResolutionListener(), this._installResolutionListener();
    }),
    (h.prototype._onResolutionChanged = function () {
      var t = this;
      this._observers.forEach(function (i) {
        return i.next(t._window.devicePixelRatio);
      }),
        this._reinstallResolutionListener();
    }),
    h
  );
})();
function Us(h) {
  return new js(h);
}
var Zs = (function () {
  function h(t, i, s) {
    var e;
    (this._canvasElement = null),
      (this._bitmapSizeChangedListeners = []),
      (this._suggestedBitmapSize = null),
      (this._suggestedBitmapSizeChangedListeners = []),
      (this._devicePixelRatioObservable = null),
      (this._canvasElementResizeObserver = null),
      (this._canvasElement = t),
      (this._canvasElementClientSize = S({
        width: this._canvasElement.clientWidth,
        height: this._canvasElement.clientHeight,
      })),
      (this._transformBitmapSize =
        i ??
        function (n) {
          return n;
        }),
      (this._allowResizeObserver =
        (e = s == null ? void 0 : s.allowResizeObserver) !== null &&
        e !== void 0
          ? e
          : !0),
      this._chooseAndInitObserver();
  }
  return (
    (h.prototype.dispose = function () {
      var t, i;
      if (this._canvasElement === null) throw new Error("Object is disposed");
      (t = this._canvasElementResizeObserver) === null ||
        t === void 0 ||
        t.disconnect(),
        (this._canvasElementResizeObserver = null),
        (i = this._devicePixelRatioObservable) === null ||
          i === void 0 ||
          i.dispose(),
        (this._devicePixelRatioObservable = null),
        (this._suggestedBitmapSizeChangedListeners.length = 0),
        (this._bitmapSizeChangedListeners.length = 0),
        (this._canvasElement = null);
    }),
    Object.defineProperty(h.prototype, "canvasElement", {
      get: function () {
        if (this._canvasElement === null) throw new Error("Object is disposed");
        return this._canvasElement;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(h.prototype, "canvasElementClientSize", {
      get: function () {
        return this._canvasElementClientSize;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(h.prototype, "bitmapSize", {
      get: function () {
        return S({
          width: this.canvasElement.width,
          height: this.canvasElement.height,
        });
      },
      enumerable: !1,
      configurable: !0,
    }),
    (h.prototype.resizeCanvasElement = function (t) {
      (this._canvasElementClientSize = S(t)),
        (this.canvasElement.style.width = "".concat(
          this._canvasElementClientSize.width,
          "px"
        )),
        (this.canvasElement.style.height = "".concat(
          this._canvasElementClientSize.height,
          "px"
        )),
        this._invalidateBitmapSize();
    }),
    (h.prototype.subscribeBitmapSizeChanged = function (t) {
      this._bitmapSizeChangedListeners.push(t);
    }),
    (h.prototype.unsubscribeBitmapSizeChanged = function (t) {
      this._bitmapSizeChangedListeners =
        this._bitmapSizeChangedListeners.filter(function (i) {
          return i !== t;
        });
    }),
    Object.defineProperty(h.prototype, "suggestedBitmapSize", {
      get: function () {
        return this._suggestedBitmapSize;
      },
      enumerable: !1,
      configurable: !0,
    }),
    (h.prototype.subscribeSuggestedBitmapSizeChanged = function (t) {
      this._suggestedBitmapSizeChangedListeners.push(t);
    }),
    (h.prototype.unsubscribeSuggestedBitmapSizeChanged = function (t) {
      this._suggestedBitmapSizeChangedListeners =
        this._suggestedBitmapSizeChangedListeners.filter(function (i) {
          return i !== t;
        });
    }),
    (h.prototype.applySuggestedBitmapSize = function () {
      if (this._suggestedBitmapSize !== null) {
        var t = this._suggestedBitmapSize;
        (this._suggestedBitmapSize = null),
          this._resizeBitmap(t),
          this._emitSuggestedBitmapSizeChanged(t, this._suggestedBitmapSize);
      }
    }),
    (h.prototype._resizeBitmap = function (t) {
      var i = this.bitmapSize;
      F(i, t) ||
        ((this.canvasElement.width = t.width),
        (this.canvasElement.height = t.height),
        this._emitBitmapSizeChanged(i, t));
    }),
    (h.prototype._emitBitmapSizeChanged = function (t, i) {
      var s = this;
      this._bitmapSizeChangedListeners.forEach(function (e) {
        return e.call(s, t, i);
      });
    }),
    (h.prototype._suggestNewBitmapSize = function (t) {
      var i = this._suggestedBitmapSize,
        s = S(this._transformBitmapSize(t, this._canvasElementClientSize)),
        e = F(this.bitmapSize, s) ? null : s;
      (i === null && e === null) ||
        (i !== null && e !== null && F(i, e)) ||
        ((this._suggestedBitmapSize = e),
        this._emitSuggestedBitmapSizeChanged(i, e));
    }),
    (h.prototype._emitSuggestedBitmapSizeChanged = function (t, i) {
      var s = this;
      this._suggestedBitmapSizeChangedListeners.forEach(function (e) {
        return e.call(s, t, i);
      });
    }),
    (h.prototype._chooseAndInitObserver = function () {
      var t = this;
      if (!this._allowResizeObserver) {
        this._initDevicePixelRatioObservable();
        return;
      }
      Qs().then(function (i) {
        return i
          ? t._initResizeObserver()
          : t._initDevicePixelRatioObservable();
      });
    }),
    (h.prototype._initDevicePixelRatioObservable = function () {
      var t = this;
      if (this._canvasElement !== null) {
        var i = xi(this._canvasElement);
        if (i === null)
          throw new Error("No window is associated with the canvas");
        (this._devicePixelRatioObservable = Us(i)),
          this._devicePixelRatioObservable.subscribe(function () {
            return t._invalidateBitmapSize();
          }),
          this._invalidateBitmapSize();
      }
    }),
    (h.prototype._invalidateBitmapSize = function () {
      var t, i;
      if (this._canvasElement !== null) {
        var s = xi(this._canvasElement);
        if (s !== null) {
          var e =
              (i =
                (t = this._devicePixelRatioObservable) === null || t === void 0
                  ? void 0
                  : t.value) !== null && i !== void 0
                ? i
                : s.devicePixelRatio,
            n = this._canvasElement.getClientRects(),
            r =
              n[0] !== void 0
                ? Xs(n[0], e)
                : S({
                    width: this._canvasElementClientSize.width * e,
                    height: this._canvasElementClientSize.height * e,
                  });
          this._suggestNewBitmapSize(r);
        }
      }
    }),
    (h.prototype._initResizeObserver = function () {
      var t = this;
      this._canvasElement !== null &&
        ((this._canvasElementResizeObserver = new ResizeObserver(function (i) {
          var s = i.find(function (r) {
            return r.target === t._canvasElement;
          });
          if (
            !(
              !s ||
              !s.devicePixelContentBoxSize ||
              !s.devicePixelContentBoxSize[0]
            )
          ) {
            var e = s.devicePixelContentBoxSize[0],
              n = S({ width: e.inlineSize, height: e.blockSize });
            t._suggestNewBitmapSize(n);
          }
        })),
        this._canvasElementResizeObserver.observe(this._canvasElement, {
          box: "device-pixel-content-box",
        }));
    }),
    h
  );
})();
function Ys(h, t) {
  if (t.type === "device-pixel-content-box")
    return new Zs(h, t.transform, t.options);
  throw new Error("Unsupported binding target");
}
function xi(h) {
  return h.ownerDocument.defaultView;
}
function Qs() {
  return new Promise(function (h) {
    var t = new ResizeObserver(function (i) {
      h(
        i.every(function (s) {
          return "devicePixelContentBoxSize" in s;
        })
      ),
        t.disconnect();
    });
    t.observe(document.body, { box: "device-pixel-content-box" });
  }).catch(function () {
    return !1;
  });
}
function Xs(h, t) {
  return S({
    width: Math.round(h.left * t + h.width * t) - Math.round(h.left * t),
    height: Math.round(h.top * t + h.height * t) - Math.round(h.top * t),
  });
}
var qs = (function () {
  function h(t, i, s) {
    if (i.width === 0 || i.height === 0)
      throw new TypeError(
        "Rendering target could only be created on a media with positive width and height"
      );
    if (((this._mediaSize = i), s.width === 0 || s.height === 0))
      throw new TypeError(
        "Rendering target could only be created using a bitmap with positive integer width and height"
      );
    (this._bitmapSize = s), (this._context = t);
  }
  return (
    (h.prototype.useMediaCoordinateSpace = function (t) {
      try {
        return (
          this._context.save(),
          this._context.setTransform(1, 0, 0, 1, 0, 0),
          this._context.scale(
            this._horizontalPixelRatio,
            this._verticalPixelRatio
          ),
          t({ context: this._context, mediaSize: this._mediaSize })
        );
      } finally {
        this._context.restore();
      }
    }),
    (h.prototype.useBitmapCoordinateSpace = function (t) {
      try {
        return (
          this._context.save(),
          this._context.setTransform(1, 0, 0, 1, 0, 0),
          t({
            context: this._context,
            mediaSize: this._mediaSize,
            bitmapSize: this._bitmapSize,
            horizontalPixelRatio: this._horizontalPixelRatio,
            verticalPixelRatio: this._verticalPixelRatio,
          })
        );
      } finally {
        this._context.restore();
      }
    }),
    Object.defineProperty(h.prototype, "_horizontalPixelRatio", {
      get: function () {
        return this._bitmapSize.width / this._mediaSize.width;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(h.prototype, "_verticalPixelRatio", {
      get: function () {
        return this._bitmapSize.height / this._mediaSize.height;
      },
      enumerable: !1,
      configurable: !0,
    }),
    h
  );
})();
function H(h, t) {
  var i = h.canvasElementClientSize;
  if (i.width === 0 || i.height === 0) return null;
  var s = h.bitmapSize;
  if (s.width === 0 || s.height === 0) return null;
  var e = h.canvasElement.getContext("2d", t);
  return e === null ? null : new qs(e, i, s);
}
/*!
 * @license
 * TradingView Lightweight Charts™ v4.2.0-dev+202402061713
 * Copyright (c) 2024 TradingView, Inc.
 * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
 */ const Js = {
    upColor: "#26a69a",
    downColor: "#ef5350",
    wickVisible: !0,
    borderVisible: !0,
    borderColor: "#378658",
    borderUpColor: "#26a69a",
    borderDownColor: "#ef5350",
    wickColor: "#737375",
    wickUpColor: "#26a69a",
    wickDownColor: "#ef5350",
  },
  Ks = {
    upColor: "#26a69a",
    downColor: "#ef5350",
    openVisible: !0,
    thinBars: !0,
  },
  Gs = {
    color: "#2196f3",
    lineStyle: 0,
    lineWidth: 3,
    lineType: 0,
    lineVisible: !0,
    crosshairMarkerVisible: !0,
    crosshairMarkerRadius: 4,
    crosshairMarkerBorderColor: "",
    crosshairMarkerBorderWidth: 2,
    crosshairMarkerBackgroundColor: "",
    lastPriceAnimation: 0,
    pointMarkersVisible: !1,
  },
  te = {
    topColor: "rgba( 46, 220, 135, 0.4)",
    bottomColor: "rgba( 40, 221, 100, 0)",
    invertFilledArea: !1,
    lineColor: "#33D778",
    lineStyle: 0,
    lineWidth: 3,
    lineType: 0,
    lineVisible: !0,
    crosshairMarkerVisible: !0,
    crosshairMarkerRadius: 4,
    crosshairMarkerBorderColor: "",
    crosshairMarkerBorderWidth: 2,
    crosshairMarkerBackgroundColor: "",
    lastPriceAnimation: 0,
    pointMarkersVisible: !1,
  },
  ie = {
    baseValue: { type: "price", price: 0 },
    topFillColor1: "rgba(38, 166, 154, 0.28)",
    topFillColor2: "rgba(38, 166, 154, 0.05)",
    topLineColor: "rgba(38, 166, 154, 1)",
    bottomFillColor1: "rgba(239, 83, 80, 0.05)",
    bottomFillColor2: "rgba(239, 83, 80, 0.28)",
    bottomLineColor: "rgba(239, 83, 80, 1)",
    lineWidth: 3,
    lineStyle: 0,
    lineType: 0,
    lineVisible: !0,
    crosshairMarkerVisible: !0,
    crosshairMarkerRadius: 4,
    crosshairMarkerBorderColor: "",
    crosshairMarkerBorderWidth: 2,
    crosshairMarkerBackgroundColor: "",
    lastPriceAnimation: 0,
    pointMarkersVisible: !1,
  },
  se = { color: "#26a69a", base: 0 },
  gs = { color: "#2196f3" },
  ws = {
    title: "",
    visible: !0,
    lastValueVisible: !0,
    priceLineVisible: !0,
    priceLineSource: 0,
    priceLineWidth: 1,
    priceLineColor: "",
    priceLineStyle: 2,
    baseLineVisible: !0,
    baseLineWidth: 1,
    baseLineColor: "#B2B5BE",
    baseLineStyle: 0,
    priceFormat: { type: "price", precision: 2, minMove: 0.01 },
  };
var Ci, Oi;
function j(h, t) {
  const i = {
    0: [],
    1: [h.lineWidth, h.lineWidth],
    2: [2 * h.lineWidth, 2 * h.lineWidth],
    3: [6 * h.lineWidth, 6 * h.lineWidth],
    4: [h.lineWidth, 4 * h.lineWidth],
  }[t];
  h.setLineDash(i);
}
function _s(h, t, i, s) {
  h.beginPath();
  const e = h.lineWidth % 2 ? 0.5 : 0;
  h.moveTo(i, t + e), h.lineTo(s, t + e), h.stroke();
}
function A(h, t) {
  if (!h) throw new Error("Assertion failed" + (t ? ": " + t : ""));
}
function E(h) {
  if (h === void 0) throw new Error("Value is undefined");
  return h;
}
function p(h) {
  if (h === null) throw new Error("Value is null");
  return h;
}
function X(h) {
  return p(E(h));
}
(function (h) {
  (h[(h.Simple = 0)] = "Simple"),
    (h[(h.WithSteps = 1)] = "WithSteps"),
    (h[(h.Curved = 2)] = "Curved");
})(Ci || (Ci = {})),
  (function (h) {
    (h[(h.Solid = 0)] = "Solid"),
      (h[(h.Dotted = 1)] = "Dotted"),
      (h[(h.Dashed = 2)] = "Dashed"),
      (h[(h.LargeDashed = 3)] = "LargeDashed"),
      (h[(h.SparseDotted = 4)] = "SparseDotted");
  })(Oi || (Oi = {}));
const Ei = {
  khaki: "#f0e68c",
  azure: "#f0ffff",
  aliceblue: "#f0f8ff",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gainsboro: "#dcdcdc",
  gray: "#808080",
  green: "#008000",
  honeydew: "#f0fff0",
  floralwhite: "#fffaf0",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lemonchiffon: "#fffacd",
  hotpink: "#ff69b4",
  lightyellow: "#ffffe0",
  greenyellow: "#adff2f",
  lightgoldenrodyellow: "#fafad2",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  lightcyan: "#e0ffff",
  magenta: "#f0f",
  maroon: "#800000",
  olive: "#808000",
  orange: "#ffa500",
  oldlace: "#fdf5e6",
  mediumblue: "#0000cd",
  transparent: "#0000",
  lime: "#0f0",
  lightpink: "#ffb6c1",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  midnightblue: "#191970",
  orchid: "#da70d6",
  mediumorchid: "#ba55d3",
  mediumturquoise: "#48d1cc",
  orangered: "#ff4500",
  royalblue: "#4169e1",
  powderblue: "#b0e0e6",
  red: "#f00",
  coral: "#ff7f50",
  turquoise: "#40e0d0",
  white: "#fff",
  whitesmoke: "#f5f5f5",
  wheat: "#f5deb3",
  teal: "#008080",
  steelblue: "#4682b4",
  bisque: "#ffe4c4",
  aquamarine: "#7fffd4",
  aqua: "#0ff",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  springgreen: "#00ff7f",
  antiquewhite: "#faebd7",
  burlywood: "#deb887",
  brown: "#a52a2a",
  beige: "#f5f5dc",
  chocolate: "#d2691e",
  chartreuse: "#7fff00",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cadetblue: "#5f9ea0",
  tomato: "#ff6347",
  fuchsia: "#f0f",
  blue: "#00f",
  salmon: "#fa8072",
  blanchedalmond: "#ffebcd",
  slateblue: "#6a5acd",
  slategray: "#708090",
  thistle: "#d8bfd8",
  tan: "#d2b48c",
  cyan: "#0ff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  blueviolet: "#8a2be2",
  black: "#000",
  darkmagenta: "#8b008b",
  darkslateblue: "#483d8b",
  darkkhaki: "#bdb76b",
  darkorchid: "#9932cc",
  darkorange: "#ff8c00",
  darkgreen: "#006400",
  darkred: "#8b0000",
  dodgerblue: "#1e90ff",
  darkslategray: "#2f4f4f",
  dimgray: "#696969",
  deepskyblue: "#00bfff",
  firebrick: "#b22222",
  forestgreen: "#228b22",
  indigo: "#4b0082",
  ivory: "#fffff0",
  lavenderblush: "#fff0f5",
  feldspar: "#d19275",
  indianred: "#cd5c5c",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightskyblue: "#87cefa",
  lightslategray: "#789",
  lightslateblue: "#8470ff",
  snow: "#fffafa",
  lightseagreen: "#20b2aa",
  lightsalmon: "#ffa07a",
  darksalmon: "#e9967a",
  darkviolet: "#9400d3",
  mediumpurple: "#9370d8",
  mediumaquamarine: "#66cdaa",
  skyblue: "#87ceeb",
  lavender: "#e6e6fa",
  lightsteelblue: "#b0c4de",
  mediumvioletred: "#c71585",
  mintcream: "#f5fffa",
  navajowhite: "#ffdead",
  navy: "#000080",
  olivedrab: "#6b8e23",
  palevioletred: "#d87093",
  violetred: "#d02090",
  yellow: "#ff0",
  yellowgreen: "#9acd32",
  lawngreen: "#7cfc00",
  pink: "#ffc0cb",
  paleturquoise: "#afeeee",
  palegoldenrod: "#eee8aa",
  darkolivegreen: "#556b2f",
  darkseagreen: "#8fbc8f",
  darkturquoise: "#00ced1",
  peachpuff: "#ffdab9",
  deeppink: "#ff1493",
  violet: "#ee82ee",
  palegreen: "#98fb98",
  mediumseagreen: "#3cb371",
  peru: "#cd853f",
  saddlebrown: "#8b4513",
  sandybrown: "#f4a460",
  rosybrown: "#bc8f8f",
  purple: "#800080",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  papayawhip: "#ffefd5",
  mediumslateblue: "#7b68ee",
  plum: "#dda0dd",
  mediumspringgreen: "#00fa9a",
};
function N(h) {
  return h < 0 ? 0 : h > 255 ? 255 : Math.round(h) || 0;
}
function Ss(h) {
  return h <= 0 || h > 0
    ? h < 0
      ? 0
      : h > 1
      ? 1
      : Math.round(1e4 * h) / 1e4
    : 0;
}
const ee = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i,
  he = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i,
  ne = /^rgb\(\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*\)$/,
  re =
    /^rgba\(\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?[\d]{0,10}(?:\.\d+)?)\s*\)$/;
function zt(h) {
  (h = h.toLowerCase()) in Ei && (h = Ei[h]);
  {
    const t = re.exec(h) || ne.exec(h);
    if (t)
      return [
        N(parseInt(t[1], 10)),
        N(parseInt(t[2], 10)),
        N(parseInt(t[3], 10)),
        Ss(t.length < 5 ? 1 : parseFloat(t[4])),
      ];
  }
  {
    const t = he.exec(h);
    if (t)
      return [
        N(parseInt(t[1], 16)),
        N(parseInt(t[2], 16)),
        N(parseInt(t[3], 16)),
        1,
      ];
  }
  {
    const t = ee.exec(h);
    if (t)
      return [
        N(17 * parseInt(t[1], 16)),
        N(17 * parseInt(t[2], 16)),
        N(17 * parseInt(t[3], 16)),
        1,
      ];
  }
  throw new Error(`Cannot parse color: ${h}`);
}
function Ot(h) {
  const t = zt(h);
  return {
    t: `rgb(${t[0]}, ${t[1]}, ${t[2]})`,
    i:
      ((i = t),
      0.199 * i[0] + 0.687 * i[1] + 0.114 * i[2] > 160 ? "black" : "white"),
  };
  var i;
}
class M {
  constructor() {
    this.h = [];
  }
  l(t, i, s) {
    const e = { o: t, _: i, u: s === !0 };
    this.h.push(e);
  }
  v(t) {
    const i = this.h.findIndex((s) => t === s.o);
    i > -1 && this.h.splice(i, 1);
  }
  p(t) {
    this.h = this.h.filter((i) => i._ !== t);
  }
  m(t, i, s) {
    const e = [...this.h];
    (this.h = this.h.filter((n) => !n.u)), e.forEach((n) => n.o(t, i, s));
  }
  M() {
    return this.h.length > 0;
  }
  S() {
    this.h = [];
  }
}
function R(h, ...t) {
  for (const i of t)
    for (const s in i)
      i[s] !== void 0 &&
        (typeof i[s] != "object" || h[s] === void 0 || Array.isArray(i[s])
          ? (h[s] = i[s])
          : R(h[s], i[s]));
  return h;
}
function P(h) {
  return typeof h == "number" && isFinite(h);
}
function rt(h) {
  return typeof h == "number" && h % 1 == 0;
}
function ut(h) {
  return typeof h == "string";
}
function ft(h) {
  return typeof h == "boolean";
}
function W(h) {
  const t = h;
  if (!t || typeof t != "object") return t;
  let i, s, e;
  for (s in ((i = Array.isArray(t) ? [] : {}), t))
    t.hasOwnProperty(s) &&
      ((e = t[s]), (i[s] = e && typeof e == "object" ? W(e) : e));
  return i;
}
function oe(h) {
  return h !== null;
}
function ot(h) {
  return h === null ? void 0 : h;
}
const ai =
  "-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif";
function K(h, t, i) {
  return (
    t === void 0 && (t = ai), `${(i = i !== void 0 ? `${i} ` : "")}${h}px ${t}`
  );
}
class le {
  constructor(t) {
    (this.k = {
      C: 1,
      T: 5,
      P: NaN,
      R: "",
      D: "",
      O: "",
      A: "",
      V: 0,
      B: 0,
      I: 0,
      L: 0,
      N: 0,
    }),
      (this.F = t);
  }
  W() {
    const t = this.k,
      i = this.j(),
      s = this.H();
    return (
      (t.P === i && t.D === s) ||
        ((t.P = i),
        (t.D = s),
        (t.R = K(i, s)),
        (t.L = (2.5 / 12) * i),
        (t.V = t.L),
        (t.B = (i / 12) * t.T),
        (t.I = (i / 12) * t.T),
        (t.N = 0)),
      (t.O = this.$()),
      (t.A = this.U()),
      this.k
    );
  }
  $() {
    return this.F.W().layout.textColor;
  }
  U() {
    return this.F.q();
  }
  j() {
    return this.F.W().layout.fontSize;
  }
  H() {
    return this.F.W().layout.fontFamily;
  }
}
class ui {
  constructor() {
    this.Y = [];
  }
  X(t) {
    this.Y = t;
  }
  K(t, i, s) {
    this.Y.forEach((e) => {
      e.K(t, i, s);
    });
  }
}
class B {
  K(t, i, s) {
    t.useBitmapCoordinateSpace((e) => this.Z(e, i, s));
  }
}
class ae extends B {
  constructor() {
    super(...arguments), (this.G = null);
  }
  J(t) {
    this.G = t;
  }
  Z({ context: t, horizontalPixelRatio: i, verticalPixelRatio: s }) {
    if (this.G === null || this.G.tt === null) return;
    const e = this.G.tt,
      n = this.G,
      r = (Math.max(1, Math.floor(i)) % 2) / 2,
      o = (l) => {
        t.beginPath();
        for (let a = e.to - 1; a >= e.from; --a) {
          const u = n.it[a],
            c = Math.round(u.nt * i) + r,
            d = u.st * s,
            f = l * s + r;
          t.moveTo(c, d), t.arc(c, d, f, 0, 2 * Math.PI);
        }
        t.fill();
      };
    n.et > 0 && ((t.fillStyle = n.rt), o(n.ht + n.et)),
      (t.fillStyle = n.lt),
      o(n.ht);
  }
}
function ue() {
  return {
    it: [{ nt: 0, st: 0, ot: 0, _t: 0 }],
    lt: "",
    rt: "",
    ht: 0,
    et: 0,
    tt: null,
  };
}
const ce = { from: 0, to: 1 };
class de {
  constructor(t, i) {
    (this.ut = new ui()),
      (this.ct = []),
      (this.dt = []),
      (this.ft = !0),
      (this.F = t),
      (this.vt = i),
      this.ut.X(this.ct);
  }
  bt(t) {
    const i = this.F.wt();
    i.length !== this.ct.length &&
      ((this.dt = i.map(ue)),
      (this.ct = this.dt.map((s) => {
        const e = new ae();
        return e.J(s), e;
      })),
      this.ut.X(this.ct)),
      (this.ft = !0);
  }
  gt() {
    return this.ft && (this.Mt(), (this.ft = !1)), this.ut;
  }
  Mt() {
    const t = this.vt.W().mode === 2,
      i = this.F.wt(),
      s = this.vt.xt(),
      e = this.F.St();
    i.forEach((n, r) => {
      var o;
      const l = this.dt[r],
        a = n.kt(s);
      if (t || a === null || !n.yt()) return void (l.tt = null);
      const u = p(n.Ct());
      (l.lt = a.Tt),
        (l.ht = a.ht),
        (l.et = a.Pt),
        (l.it[0]._t = a._t),
        (l.it[0].st = n.Dt().Rt(a._t, u.Ot)),
        (l.rt =
          (o = a.At) !== null && o !== void 0
            ? o
            : this.F.Vt(l.it[0].st / n.Dt().Bt())),
        (l.it[0].ot = s),
        (l.it[0].nt = e.It(s)),
        (l.tt = ce);
    });
  }
}
class fe extends B {
  constructor(t) {
    super(), (this.zt = t);
  }
  Z({
    context: t,
    bitmapSize: i,
    horizontalPixelRatio: s,
    verticalPixelRatio: e,
  }) {
    if (this.zt === null) return;
    const n = this.zt.Lt.yt,
      r = this.zt.Et.yt;
    if (!n && !r) return;
    const o = Math.round(this.zt.nt * s),
      l = Math.round(this.zt.st * e);
    (t.lineCap = "butt"),
      n &&
        o >= 0 &&
        ((t.lineWidth = Math.floor(this.zt.Lt.et * s)),
        (t.strokeStyle = this.zt.Lt.O),
        (t.fillStyle = this.zt.Lt.O),
        j(t, this.zt.Lt.Nt),
        (function (a, u, c, d) {
          a.beginPath();
          const f = a.lineWidth % 2 ? 0.5 : 0;
          a.moveTo(u + f, c), a.lineTo(u + f, d), a.stroke();
        })(t, o, 0, i.height)),
      r &&
        l >= 0 &&
        ((t.lineWidth = Math.floor(this.zt.Et.et * e)),
        (t.strokeStyle = this.zt.Et.O),
        (t.fillStyle = this.zt.Et.O),
        j(t, this.zt.Et.Nt),
        _s(t, l, 0, i.width));
  }
}
class me {
  constructor(t) {
    (this.ft = !0),
      (this.Ft = {
        Lt: { et: 1, Nt: 0, O: "", yt: !1 },
        Et: { et: 1, Nt: 0, O: "", yt: !1 },
        nt: 0,
        st: 0,
      }),
      (this.Wt = new fe(this.Ft)),
      (this.jt = t);
  }
  bt() {
    this.ft = !0;
  }
  gt() {
    return this.ft && (this.Mt(), (this.ft = !1)), this.Wt;
  }
  Mt() {
    const t = this.jt.yt(),
      i = p(this.jt.Ht()),
      s = i.$t().W().crosshair,
      e = this.Ft;
    if (s.mode === 2) return (e.Et.yt = !1), void (e.Lt.yt = !1);
    (e.Et.yt = t && this.jt.Ut(i)),
      (e.Lt.yt = t && this.jt.qt()),
      (e.Et.et = s.horzLine.width),
      (e.Et.Nt = s.horzLine.style),
      (e.Et.O = s.horzLine.color),
      (e.Lt.et = s.vertLine.width),
      (e.Lt.Nt = s.vertLine.style),
      (e.Lt.O = s.vertLine.color),
      (e.nt = this.jt.Yt()),
      (e.st = this.jt.Xt());
  }
}
function ve(h, t, i, s, e, n) {
  h.fillRect(t + n, i, s - 2 * n, n),
    h.fillRect(t + n, i + e - n, s - 2 * n, n),
    h.fillRect(t, i, n, e),
    h.fillRect(t + s - n, i, n, e);
}
function Et(h, t, i, s, e, n) {
  h.save(),
    (h.globalCompositeOperation = "copy"),
    (h.fillStyle = n),
    h.fillRect(t, i, s, e),
    h.restore();
}
function Ti(h, t) {
  return h.map((i) => (i === 0 ? i : i + t));
}
function It(h, t, i, s, e, n) {
  h.beginPath(),
    h.lineTo(t + s - n[1], i),
    n[1] !== 0 && h.arcTo(t + s, i, t + s, i + n[1], n[1]),
    h.lineTo(t + s, i + e - n[2]),
    n[2] !== 0 && h.arcTo(t + s, i + e, t + s - n[2], i + e, n[2]),
    h.lineTo(t + n[3], i + e),
    n[3] !== 0 && h.arcTo(t, i + e, t, i + e - n[3], n[3]),
    h.lineTo(t, i + n[0]),
    n[0] !== 0 && h.arcTo(t, i, t + n[0], i, n[0]);
}
function ki(h, t, i, s, e, n, r = 0, o = [0, 0, 0, 0], l = "") {
  if ((h.save(), !r || !l || l === n))
    return It(h, t, i, s, e, o), (h.fillStyle = n), h.fill(), void h.restore();
  const a = r / 2;
  n !== "transparent" &&
    (It(h, t + r, i + r, s - 2 * r, e - 2 * r, Ti(o, -r)),
    (h.fillStyle = n),
    h.fill()),
    l !== "transparent" &&
      (It(h, t + a, i + a, s - r, e - r, Ti(o, -a)),
      (h.lineWidth = r),
      (h.strokeStyle = l),
      h.closePath(),
      h.stroke()),
    h.restore();
}
function ys(h, t, i, s, e, n, r) {
  h.save(), (h.globalCompositeOperation = "copy");
  const o = h.createLinearGradient(0, 0, 0, e);
  o.addColorStop(0, n),
    o.addColorStop(1, r),
    (h.fillStyle = o),
    h.fillRect(t, i, s, e),
    h.restore();
}
class Ni {
  constructor(t, i) {
    this.J(t, i);
  }
  J(t, i) {
    (this.zt = t), (this.Kt = i);
  }
  Bt(t, i) {
    return this.zt.yt ? t.P + t.L + t.V : 0;
  }
  K(t, i, s, e) {
    if (!this.zt.yt || this.zt.Zt.length === 0) return;
    const n = this.zt.O,
      r = this.Kt.t,
      o = t.useBitmapCoordinateSpace((l) => {
        const a = l.context;
        a.font = i.R;
        const u = this.Gt(l, i, s, e),
          c = u.Jt,
          d = (f, m) => {
            u.Qt
              ? ki(a, c.ti, c.ii, c.ni, c.si, f, c.ei, [c.ht, 0, 0, c.ht], m)
              : ki(a, c.ri, c.ii, c.ni, c.si, f, c.ei, [0, c.ht, c.ht, 0], m);
          };
        return (
          d(r, "transparent"),
          this.zt.hi &&
            ((a.fillStyle = n), a.fillRect(c.ri, c.li, c.ai - c.ri, c.oi)),
          d("transparent", r),
          this.zt._i &&
            ((a.fillStyle = i.A),
            a.fillRect(u.Qt ? c.ui - c.ei : 0, c.ii, c.ei, c.ci - c.ii)),
          u
        );
      });
    t.useMediaCoordinateSpace(({ context: l }) => {
      const a = o.di;
      (l.font = i.R),
        (l.textAlign = o.Qt ? "right" : "left"),
        (l.textBaseline = "middle"),
        (l.fillStyle = n),
        l.fillText(this.zt.Zt, a.fi, (a.ii + a.ci) / 2 + a.vi);
    });
  }
  Gt(t, i, s, e) {
    var n;
    const {
        context: r,
        bitmapSize: o,
        mediaSize: l,
        horizontalPixelRatio: a,
        verticalPixelRatio: u,
      } = t,
      c = this.zt.hi || !this.zt.pi ? i.T : 0,
      d = this.zt.mi ? i.C : 0,
      f = i.L + this.Kt.bi,
      m = i.V + this.Kt.wi,
      v = i.B,
      b = i.I,
      g = this.zt.Zt,
      w = i.P,
      y = s.gi(r, g),
      _ = Math.ceil(s.Mi(r, g)),
      z = w + f + m,
      k = i.C + v + b + _ + c,
      O = Math.max(1, Math.floor(u));
    let C = Math.round(z * u);
    C % 2 != O % 2 && (C += 1);
    const D = d > 0 ? Math.max(1, Math.floor(d * a)) : 0,
      Y = Math.round(k * a),
      Si = Math.round(c * a),
      Hs = (n = this.Kt.xi) !== null && n !== void 0 ? n : this.Kt.Si,
      yi = Math.round(Hs * u) - Math.floor(0.5 * u),
      Bt = Math.floor(yi + O / 2 - C / 2),
      Mi = Bt + C,
      dt = e === "right",
      zi = dt ? l.width - d : d,
      tt = dt ? o.width - D : D;
    let Lt, Pt, Wt;
    return (
      dt
        ? ((Lt = tt - Y), (Pt = tt - Si), (Wt = zi - c - v - d))
        : ((Lt = tt + Y), (Pt = tt + Si), (Wt = zi + c + v)),
      {
        Qt: dt,
        Jt: {
          ii: Bt,
          li: yi,
          ci: Mi,
          ni: Y,
          si: C,
          ht: 2 * a,
          ei: D,
          ti: Lt,
          ri: tt,
          ai: Pt,
          oi: O,
          ui: o.width,
        },
        di: { ii: Bt / u, ci: Mi / u, fi: Wt, vi: y },
      }
    );
  }
}
class Tt {
  constructor(t) {
    (this.ki = { Si: 0, t: "#000", wi: 0, bi: 0 }),
      (this.yi = {
        Zt: "",
        yt: !1,
        hi: !0,
        pi: !1,
        At: "",
        O: "#FFF",
        _i: !1,
        mi: !1,
      }),
      (this.Ci = {
        Zt: "",
        yt: !1,
        hi: !1,
        pi: !0,
        At: "",
        O: "#FFF",
        _i: !0,
        mi: !0,
      }),
      (this.ft = !0),
      (this.Ti = new (t || Ni)(this.yi, this.ki)),
      (this.Pi = new (t || Ni)(this.Ci, this.ki));
  }
  Zt() {
    return this.Ri(), this.yi.Zt;
  }
  Si() {
    return this.Ri(), this.ki.Si;
  }
  bt() {
    this.ft = !0;
  }
  Bt(t, i = !1) {
    return Math.max(this.Ti.Bt(t, i), this.Pi.Bt(t, i));
  }
  Di() {
    return this.ki.xi || 0;
  }
  Oi(t) {
    this.ki.xi = t;
  }
  Ai() {
    return this.Ri(), this.yi.yt || this.Ci.yt;
  }
  Vi() {
    return this.Ri(), this.yi.yt;
  }
  gt(t) {
    return (
      this.Ri(),
      (this.yi.hi = this.yi.hi && t.W().ticksVisible),
      (this.Ci.hi = this.Ci.hi && t.W().ticksVisible),
      this.Ti.J(this.yi, this.ki),
      this.Pi.J(this.Ci, this.ki),
      this.Ti
    );
  }
  Bi() {
    return (
      this.Ri(),
      this.Ti.J(this.yi, this.ki),
      this.Pi.J(this.Ci, this.ki),
      this.Pi
    );
  }
  Ri() {
    this.ft &&
      ((this.yi.hi = !0),
      (this.Ci.hi = !1),
      this.Ii(this.yi, this.Ci, this.ki));
  }
}
class pe extends Tt {
  constructor(t, i, s) {
    super(), (this.jt = t), (this.zi = i), (this.Li = s);
  }
  Ii(t, i, s) {
    if (((t.yt = !1), this.jt.W().mode === 2)) return;
    const e = this.jt.W().horzLine;
    if (!e.labelVisible) return;
    const n = this.zi.Ct();
    if (!this.jt.yt() || this.zi.Ei() || n === null) return;
    const r = Ot(e.labelBackgroundColor);
    (s.t = r.t), (t.O = r.i);
    const o = (2 / 12) * this.zi.P();
    (s.bi = o), (s.wi = o);
    const l = this.Li(this.zi);
    (s.Si = l.Si), (t.Zt = this.zi.Ni(l._t, n)), (t.yt = !0);
  }
}
const be = /[1-9]/g;
class Ms {
  constructor() {
    this.zt = null;
  }
  J(t) {
    this.zt = t;
  }
  K(t, i) {
    if (this.zt === null || this.zt.yt === !1 || this.zt.Zt.length === 0)
      return;
    const s = t.useMediaCoordinateSpace(
      ({ context: d }) => (
        (d.font = i.R), Math.round(i.Fi.Mi(d, p(this.zt).Zt, be))
      )
    );
    if (s <= 0) return;
    const e = i.Wi,
      n = s + 2 * e,
      r = n / 2,
      o = this.zt.ji;
    let l = this.zt.Si,
      a = Math.floor(l - r) + 0.5;
    a < 0
      ? ((l += Math.abs(0 - a)), (a = Math.floor(l - r) + 0.5))
      : a + n > o &&
        ((l -= Math.abs(o - (a + n))), (a = Math.floor(l - r) + 0.5));
    const u = a + n,
      c = Math.ceil(0 + i.C + i.T + i.L + i.P + i.V);
    t.useBitmapCoordinateSpace(
      ({ context: d, horizontalPixelRatio: f, verticalPixelRatio: m }) => {
        const v = p(this.zt);
        d.fillStyle = v.t;
        const b = Math.round(a * f),
          g = Math.round(0 * m),
          w = Math.round(u * f),
          y = Math.round(c * m),
          _ = Math.round(2 * f);
        if (
          (d.beginPath(),
          d.moveTo(b, g),
          d.lineTo(b, y - _),
          d.arcTo(b, y, b + _, y, _),
          d.lineTo(w - _, y),
          d.arcTo(w, y, w, y - _, _),
          d.lineTo(w, g),
          d.fill(),
          v.hi)
        ) {
          const z = Math.round(v.Si * f),
            k = g,
            O = Math.round((k + i.T) * m);
          d.fillStyle = v.O;
          const C = Math.max(1, Math.floor(f)),
            D = Math.floor(0.5 * f);
          d.fillRect(z - D, k, C, O - k);
        }
      }
    ),
      t.useMediaCoordinateSpace(({ context: d }) => {
        const f = p(this.zt),
          m = 0 + i.C + i.T + i.L + i.P / 2;
        (d.font = i.R),
          (d.textAlign = "left"),
          (d.textBaseline = "middle"),
          (d.fillStyle = f.O);
        const v = i.Fi.gi(d, "Apr0");
        d.translate(a + e, m + v), d.fillText(f.Zt, 0, 0);
      });
  }
}
class ge {
  constructor(t, i, s) {
    (this.ft = !0),
      (this.Wt = new Ms()),
      (this.Ft = {
        yt: !1,
        t: "#4c525e",
        O: "white",
        Zt: "",
        ji: 0,
        Si: NaN,
        hi: !0,
      }),
      (this.vt = t),
      (this.Hi = i),
      (this.Li = s);
  }
  bt() {
    this.ft = !0;
  }
  gt() {
    return this.ft && (this.Mt(), (this.ft = !1)), this.Wt.J(this.Ft), this.Wt;
  }
  Mt() {
    const t = this.Ft;
    if (((t.yt = !1), this.vt.W().mode === 2)) return;
    const i = this.vt.W().vertLine;
    if (!i.labelVisible) return;
    const s = this.Hi.St();
    if (s.Ei()) return;
    t.ji = s.ji();
    const e = this.Li();
    if (e === null) return;
    t.Si = e.Si;
    const n = s.$i(this.vt.xt());
    (t.Zt = s.Ui(p(n))), (t.yt = !0);
    const r = Ot(i.labelBackgroundColor);
    (t.t = r.t), (t.O = r.i), (t.hi = s.W().ticksVisible);
  }
}
class ci {
  constructor() {
    (this.qi = null), (this.Yi = 0);
  }
  Xi() {
    return this.Yi;
  }
  Ki(t) {
    this.Yi = t;
  }
  Dt() {
    return this.qi;
  }
  Zi(t) {
    this.qi = t;
  }
  Gi(t) {
    return [];
  }
  Ji() {
    return [];
  }
  yt() {
    return !0;
  }
}
var Ri;
(function (h) {
  (h[(h.Normal = 0)] = "Normal"),
    (h[(h.Magnet = 1)] = "Magnet"),
    (h[(h.Hidden = 2)] = "Hidden");
})(Ri || (Ri = {}));
class we extends ci {
  constructor(t, i) {
    super(),
      (this.Qi = null),
      (this.tn = NaN),
      (this.nn = 0),
      (this.sn = !0),
      (this.en = new Map()),
      (this.rn = !1),
      (this.hn = NaN),
      (this.ln = NaN),
      (this.an = NaN),
      (this.on = NaN),
      (this.Hi = t),
      (this._n = i),
      (this.un = new de(t, this)),
      (this.cn = ((e, n) => (r) => {
        const o = n(),
          l = e();
        if (r === p(this.Qi).dn()) return { _t: l, Si: o };
        {
          const a = p(r.Ct());
          return { _t: r.fn(o, a), Si: o };
        }
      })(
        () => this.tn,
        () => this.ln
      ));
    const s = ((e, n) => () => {
      const r = this.Hi.St().vn(e()),
        o = n();
      return r && Number.isFinite(o) ? { ot: r, Si: o } : null;
    })(
      () => this.nn,
      () => this.Yt()
    );
    (this.pn = new ge(this, t, s)), (this.mn = new me(this));
  }
  W() {
    return this._n;
  }
  bn(t, i) {
    (this.an = t), (this.on = i);
  }
  wn() {
    (this.an = NaN), (this.on = NaN);
  }
  gn() {
    return this.an;
  }
  Mn() {
    return this.on;
  }
  xn(t, i, s) {
    this.rn || (this.rn = !0), (this.sn = !0), this.Sn(t, i, s);
  }
  xt() {
    return this.nn;
  }
  Yt() {
    return this.hn;
  }
  Xt() {
    return this.ln;
  }
  yt() {
    return this.sn;
  }
  kn() {
    (this.sn = !1),
      this.yn(),
      (this.tn = NaN),
      (this.hn = NaN),
      (this.ln = NaN),
      (this.Qi = null),
      this.wn();
  }
  Cn(t) {
    return this.Qi !== null ? [this.mn, this.un] : [];
  }
  Ut(t) {
    return t === this.Qi && this._n.horzLine.visible;
  }
  qt() {
    return this._n.vertLine.visible;
  }
  Tn(t, i) {
    (this.sn && this.Qi === t) || this.en.clear();
    const s = [];
    return this.Qi === t && s.push(this.Pn(this.en, i, this.cn)), s;
  }
  Ji() {
    return this.sn ? [this.pn] : [];
  }
  Ht() {
    return this.Qi;
  }
  Rn() {
    this.mn.bt(), this.en.forEach((t) => t.bt()), this.pn.bt(), this.un.bt();
  }
  Dn(t) {
    return t && !t.dn().Ei() ? t.dn() : null;
  }
  Sn(t, i, s) {
    this.On(t, i, s) && this.Rn();
  }
  On(t, i, s) {
    const e = this.hn,
      n = this.ln,
      r = this.tn,
      o = this.nn,
      l = this.Qi,
      a = this.Dn(s);
    (this.nn = t),
      (this.hn = isNaN(t) ? NaN : this.Hi.St().It(t)),
      (this.Qi = s);
    const u = a !== null ? a.Ct() : null;
    return (
      a !== null && u !== null
        ? ((this.tn = i), (this.ln = a.Rt(i, u)))
        : ((this.tn = NaN), (this.ln = NaN)),
      e !== this.hn ||
        n !== this.ln ||
        o !== this.nn ||
        r !== this.tn ||
        l !== this.Qi
    );
  }
  yn() {
    const t = this.Hi.wt()
        .map((s) => s.Vn().An())
        .filter(oe),
      i = t.length === 0 ? null : Math.max(...t);
    this.nn = i !== null ? i : NaN;
  }
  Pn(t, i, s) {
    let e = t.get(i);
    return e === void 0 && ((e = new pe(this, i, s)), t.set(i, e)), e;
  }
}
function kt(h) {
  return h === "left" || h === "right";
}
class x {
  constructor(t) {
    (this.Bn = new Map()), (this.In = []), (this.zn = t);
  }
  Ln(t, i) {
    const s = (function (e, n) {
      return e === void 0 ? n : { En: Math.max(e.En, n.En), Nn: e.Nn || n.Nn };
    })(this.Bn.get(t), i);
    this.Bn.set(t, s);
  }
  Fn() {
    return this.zn;
  }
  Wn(t) {
    const i = this.Bn.get(t);
    return i === void 0
      ? { En: this.zn }
      : { En: Math.max(this.zn, i.En), Nn: i.Nn };
  }
  jn() {
    this.Hn(), (this.In = [{ $n: 0 }]);
  }
  Un(t) {
    this.Hn(), (this.In = [{ $n: 1, Ot: t }]);
  }
  qn(t) {
    this.Yn(), this.In.push({ $n: 5, Ot: t });
  }
  Hn() {
    this.Yn(), this.In.push({ $n: 6 });
  }
  Xn() {
    this.Hn(), (this.In = [{ $n: 4 }]);
  }
  Kn(t) {
    this.Hn(), this.In.push({ $n: 2, Ot: t });
  }
  Zn(t) {
    this.Hn(), this.In.push({ $n: 3, Ot: t });
  }
  Gn() {
    return this.In;
  }
  Jn(t) {
    for (const i of t.In) this.Qn(i);
    (this.zn = Math.max(this.zn, t.zn)),
      t.Bn.forEach((i, s) => {
        this.Ln(s, i);
      });
  }
  static ts() {
    return new x(2);
  }
  static ns() {
    return new x(3);
  }
  Qn(t) {
    switch (t.$n) {
      case 0:
        this.jn();
        break;
      case 1:
        this.Un(t.Ot);
        break;
      case 2:
        this.Kn(t.Ot);
        break;
      case 3:
        this.Zn(t.Ot);
        break;
      case 4:
        this.Xn();
        break;
      case 5:
        this.qn(t.Ot);
        break;
      case 6:
        this.Yn();
    }
  }
  Yn() {
    const t = this.In.findIndex((i) => i.$n === 5);
    t !== -1 && this.In.splice(t, 1);
  }
}
const Bi = ".";
function I(h, t) {
  if (!P(h)) return "n/a";
  if (!rt(t)) throw new TypeError("invalid length");
  if (t < 0 || t > 16) throw new TypeError("invalid length");
  return t === 0 ? h.toString() : ("0000000000000000" + h.toString()).slice(-t);
}
class Nt {
  constructor(t, i) {
    if ((i || (i = 1), (P(t) && rt(t)) || (t = 100), t < 0))
      throw new TypeError("invalid base");
    (this.zi = t), (this.ss = i), this.es();
  }
  format(t) {
    const i = t < 0 ? "−" : "";
    return (t = Math.abs(t)), i + this.rs(t);
  }
  es() {
    if (((this.hs = 0), this.zi > 0 && this.ss > 0)) {
      let t = this.zi;
      for (; t > 1; ) (t /= 10), this.hs++;
    }
  }
  rs(t) {
    const i = this.zi / this.ss;
    let s = Math.floor(t),
      e = "";
    const n = this.hs !== void 0 ? this.hs : NaN;
    if (i > 1) {
      let r = +(Math.round(t * i) - s * i).toFixed(this.hs);
      r >= i && ((r -= i), (s += 1)),
        (e = Bi + I(+r.toFixed(this.hs) * this.ss, n));
    } else (s = Math.round(s * i) / i), n > 0 && (e = Bi + I(0, n));
    return s.toFixed(0) + e;
  }
}
class zs extends Nt {
  constructor(t = 100) {
    super(t);
  }
  format(t) {
    return `${super.format(t)}%`;
  }
}
class _e {
  constructor(t) {
    this.ls = t;
  }
  format(t) {
    let i = "";
    return (
      t < 0 && ((i = "-"), (t = -t)),
      t < 995
        ? i + this.os(t)
        : t < 999995
        ? i + this.os(t / 1e3) + "K"
        : t < 999999995
        ? ((t = 1e3 * Math.round(t / 1e3)), i + this.os(t / 1e6) + "M")
        : ((t = 1e6 * Math.round(t / 1e6)), i + this.os(t / 1e9) + "B")
    );
  }
  os(t) {
    let i;
    const s = Math.pow(10, this.ls);
    return (
      (i =
        (t = Math.round(t * s) / s) >= 1e-15 && t < 1
          ? t.toFixed(this.ls).replace(/\.?0+$/, "")
          : String(t)),
      i.replace(/(\.[1-9]*)0+$/, (e, n) => n)
    );
  }
}
function xs(h, t, i, s, e, n, r) {
  if (t.length === 0 || s.from >= t.length || s.to <= 0) return;
  const { context: o, horizontalPixelRatio: l, verticalPixelRatio: a } = h,
    u = t[s.from];
  let c = n(h, u),
    d = u;
  if (s.to - s.from < 2) {
    const f = e / 2;
    o.beginPath();
    const m = { nt: u.nt - f, st: u.st },
      v = { nt: u.nt + f, st: u.st };
    o.moveTo(m.nt * l, m.st * a), o.lineTo(v.nt * l, v.st * a), r(h, c, m, v);
  } else {
    const f = (v, b) => {
      r(h, c, d, b), o.beginPath(), (c = v), (d = b);
    };
    let m = d;
    o.beginPath(), o.moveTo(u.nt * l, u.st * a);
    for (let v = s.from + 1; v < s.to; ++v) {
      m = t[v];
      const b = n(h, m);
      switch (i) {
        case 0:
          o.lineTo(m.nt * l, m.st * a);
          break;
        case 1:
          o.lineTo(m.nt * l, t[v - 1].st * a),
            b !== c && (f(b, m), o.lineTo(m.nt * l, t[v - 1].st * a)),
            o.lineTo(m.nt * l, m.st * a);
          break;
        case 2: {
          const [g, w] = Se(t, v - 1, v);
          o.bezierCurveTo(
            g.nt * l,
            g.st * a,
            w.nt * l,
            w.st * a,
            m.nt * l,
            m.st * a
          );
          break;
        }
      }
      i !== 1 && b !== c && (f(b, m), o.moveTo(m.nt * l, m.st * a));
    }
    (d !== m || (d === m && i === 1)) && r(h, c, d, m);
  }
}
const Li = 6;
function Dt(h, t) {
  return { nt: h.nt - t.nt, st: h.st - t.st };
}
function Pi(h, t) {
  return { nt: h.nt / t, st: h.st / t };
}
function Se(h, t, i) {
  const s = Math.max(0, t - 1),
    e = Math.min(h.length - 1, i + 1);
  var n, r;
  return [
    ((n = h[t]),
    (r = Pi(Dt(h[i], h[s]), Li)),
    { nt: n.nt + r.nt, st: n.st + r.st }),
    Dt(h[i], Pi(Dt(h[e], h[t]), Li)),
  ];
}
function ye(h, t, i, s, e) {
  const { context: n, horizontalPixelRatio: r, verticalPixelRatio: o } = t;
  n.lineTo(e.nt * r, h * o),
    n.lineTo(s.nt * r, h * o),
    n.closePath(),
    (n.fillStyle = i),
    n.fill();
}
class Cs extends B {
  constructor() {
    super(...arguments), (this.G = null);
  }
  J(t) {
    this.G = t;
  }
  Z(t) {
    var i;
    if (this.G === null) return;
    const { it: s, tt: e, _s: n, et: r, Nt: o, us: l } = this.G,
      a =
        (i = this.G.cs) !== null && i !== void 0
          ? i
          : this.G.ds
          ? 0
          : t.mediaSize.height;
    if (e === null) return;
    const u = t.context;
    (u.lineCap = "butt"),
      (u.lineJoin = "round"),
      (u.lineWidth = r),
      j(u, o),
      (u.lineWidth = 1),
      xs(t, s, l, e, n, this.fs.bind(this), ye.bind(null, a));
  }
}
function ei(h, t, i) {
  return Math.min(Math.max(h, t), i);
}
function mt(h, t, i) {
  return t - h <= i;
}
function Os(h) {
  const t = Math.ceil(h);
  return t % 2 == 0 ? t - 1 : t;
}
class di {
  vs(t, i) {
    const s = this.ps,
      { bs: e, ws: n, gs: r, Ms: o, xs: l, cs: a } = i;
    if (
      this.Ss === void 0 ||
      s === void 0 ||
      s.bs !== e ||
      s.ws !== n ||
      s.gs !== r ||
      s.Ms !== o ||
      s.cs !== a ||
      s.xs !== l
    ) {
      const u = t.context.createLinearGradient(0, 0, 0, l);
      if ((u.addColorStop(0, e), a != null)) {
        const c = ei((a * t.verticalPixelRatio) / l, 0, 1);
        u.addColorStop(c, n), u.addColorStop(c, r);
      }
      u.addColorStop(1, o), (this.Ss = u), (this.ps = i);
    }
    return this.Ss;
  }
}
class Me extends Cs {
  constructor() {
    super(...arguments), (this.ks = new di());
  }
  fs(t, i) {
    return this.ks.vs(t, {
      bs: i.ys,
      ws: "",
      gs: "",
      Ms: i.Cs,
      xs: t.bitmapSize.height,
    });
  }
}
function ze(h, t) {
  const i = h.context;
  (i.strokeStyle = t), i.stroke();
}
class Es extends B {
  constructor() {
    super(...arguments), (this.G = null);
  }
  J(t) {
    this.G = t;
  }
  Z(t) {
    if (this.G === null) return;
    const { it: i, tt: s, _s: e, us: n, et: r, Nt: o, Ts: l } = this.G;
    if (s === null) return;
    const a = t.context;
    (a.lineCap = "butt"),
      (a.lineWidth = r * t.verticalPixelRatio),
      j(a, o),
      (a.lineJoin = "round");
    const u = this.Ps.bind(this);
    n !== void 0 && xs(t, i, n, s, e, u, ze),
      l &&
        (function (c, d, f, m, v) {
          const {
            horizontalPixelRatio: b,
            verticalPixelRatio: g,
            context: w,
          } = c;
          let y = null;
          const _ = (Math.max(1, Math.floor(b)) % 2) / 2,
            z = f * g + _;
          for (let k = m.to - 1; k >= m.from; --k) {
            const O = d[k];
            if (O) {
              const C = v(c, O);
              C !== y &&
                (w.beginPath(),
                y !== null && w.fill(),
                (w.fillStyle = C),
                (y = C));
              const D = Math.round(O.nt * b) + _,
                Y = O.st * g;
              w.moveTo(D, Y), w.arc(D, Y, z, 0, 2 * Math.PI);
            }
          }
          w.fill();
        })(t, i, l, s, u);
  }
}
class Ts extends Es {
  Ps(t, i) {
    return i.lt;
  }
}
function ks(h, t, i, s, e = 0, n = t.length) {
  let r = n - e;
  for (; 0 < r; ) {
    const o = r >> 1,
      l = e + o;
    s(t[l], i) === h ? ((e = l + 1), (r -= o + 1)) : (r = o);
  }
  return e;
}
const ct = ks.bind(null, !0),
  Ns = ks.bind(null, !1);
function xe(h, t) {
  return h.ot < t;
}
function Ce(h, t) {
  return t < h.ot;
}
function Rs(h, t, i) {
  const s = t.Rs(),
    e = t.ui(),
    n = ct(h, s, xe),
    r = Ns(h, e, Ce);
  if (!i) return { from: n, to: r };
  let o = n,
    l = r;
  return (
    n > 0 && n < h.length && h[n].ot >= s && (o = n - 1),
    r > 0 && r < h.length && h[r - 1].ot <= e && (l = r + 1),
    { from: o, to: l }
  );
}
class fi {
  constructor(t, i, s) {
    (this.Ds = !0),
      (this.Os = !0),
      (this.As = !0),
      (this.Vs = []),
      (this.Bs = null),
      (this.Is = t),
      (this.zs = i),
      (this.Ls = s);
  }
  bt(t) {
    (this.Ds = !0),
      t === "data" && (this.Os = !0),
      t === "options" && (this.As = !0);
  }
  gt() {
    return this.Is.yt() ? (this.Es(), this.Bs === null ? null : this.Ns) : null;
  }
  Fs() {
    this.Vs = this.Vs.map((t) =>
      Object.assign(Object.assign({}, t), this.Is.js().Ws(t.ot))
    );
  }
  Hs() {
    this.Bs = null;
  }
  Es() {
    this.Os && (this.$s(), (this.Os = !1)),
      this.As && (this.Fs(), (this.As = !1)),
      this.Ds && (this.Us(), (this.Ds = !1));
  }
  Us() {
    const t = this.Is.Dt(),
      i = this.zs.St();
    if ((this.Hs(), i.Ei() || t.Ei())) return;
    const s = i.qs();
    if (s === null || this.Is.Vn().Ys() === 0) return;
    const e = this.Is.Ct();
    e !== null &&
      ((this.Bs = Rs(this.Vs, s, this.Ls)), this.Xs(t, i, e.Ot), this.Ks());
  }
}
class Rt extends fi {
  constructor(t, i) {
    super(t, i, !0);
  }
  Xs(t, i, s) {
    i.Zs(this.Vs, ot(this.Bs)), t.Gs(this.Vs, s, ot(this.Bs));
  }
  Js(t, i) {
    return { ot: t, _t: i, nt: NaN, st: NaN };
  }
  $s() {
    const t = this.Is.js();
    this.Vs = this.Is.Vn()
      .Qs()
      .map((i) => {
        const s = i.Ot[3];
        return this.te(i.ie, s, t);
      });
  }
}
class Oe extends Rt {
  constructor(t, i) {
    super(t, i),
      (this.Ns = new ui()),
      (this.ne = new Me()),
      (this.se = new Ts()),
      this.Ns.X([this.ne, this.se]);
  }
  te(t, i, s) {
    return Object.assign(Object.assign({}, this.Js(t, i)), s.Ws(t));
  }
  Ks() {
    const t = this.Is.W();
    this.ne.J({
      us: t.lineType,
      it: this.Vs,
      Nt: t.lineStyle,
      et: t.lineWidth,
      cs: null,
      ds: t.invertFilledArea,
      tt: this.Bs,
      _s: this.zs.St().ee(),
    }),
      this.se.J({
        us: t.lineVisible ? t.lineType : void 0,
        it: this.Vs,
        Nt: t.lineStyle,
        et: t.lineWidth,
        tt: this.Bs,
        _s: this.zs.St().ee(),
        Ts: t.pointMarkersVisible
          ? t.pointMarkersRadius || t.lineWidth / 2 + 2
          : void 0,
      });
  }
}
class Ee extends B {
  constructor() {
    super(...arguments), (this.zt = null), (this.re = 0), (this.he = 0);
  }
  J(t) {
    this.zt = t;
  }
  Z({ context: t, horizontalPixelRatio: i, verticalPixelRatio: s }) {
    if (this.zt === null || this.zt.Vn.length === 0 || this.zt.tt === null)
      return;
    (this.re = this.le(i)),
      this.re >= 2 &&
        Math.max(1, Math.floor(i)) % 2 != this.re % 2 &&
        this.re--,
      (this.he = this.zt.ae ? Math.min(this.re, Math.floor(i)) : this.re);
    let e = null;
    const n = this.he <= this.re && this.zt.ee >= Math.floor(1.5 * i);
    for (let r = this.zt.tt.from; r < this.zt.tt.to; ++r) {
      const o = this.zt.Vn[r];
      e !== o.oe && ((t.fillStyle = o.oe), (e = o.oe));
      const l = Math.floor(0.5 * this.he),
        a = Math.round(o.nt * i),
        u = a - l,
        c = this.he,
        d = u + c - 1,
        f = Math.min(o._e, o.ue),
        m = Math.max(o._e, o.ue),
        v = Math.round(f * s) - l,
        b = Math.round(m * s) + l,
        g = Math.max(b - v, this.he);
      t.fillRect(u, v, c, g);
      const w = Math.ceil(1.5 * this.re);
      if (n) {
        if (this.zt.ce) {
          const k = a - w;
          let O = Math.max(v, Math.round(o.de * s) - l),
            C = O + c - 1;
          C > v + g - 1 && ((C = v + g - 1), (O = C - c + 1)),
            t.fillRect(k, O, u - k, C - O + 1);
        }
        const y = a + w;
        let _ = Math.max(v, Math.round(o.fe * s) - l),
          z = _ + c - 1;
        z > v + g - 1 && ((z = v + g - 1), (_ = z - c + 1)),
          t.fillRect(d + 1, _, y - d, z - _ + 1);
      }
    }
  }
  le(t) {
    const i = Math.floor(t);
    return Math.max(
      i,
      Math.floor(
        (function (s, e) {
          return Math.floor(0.3 * s * e);
        })(p(this.zt).ee, t)
      )
    );
  }
}
class Bs extends fi {
  constructor(t, i) {
    super(t, i, !1);
  }
  Xs(t, i, s) {
    i.Zs(this.Vs, ot(this.Bs)), t.ve(this.Vs, s, ot(this.Bs));
  }
  pe(t, i, s) {
    return {
      ot: t,
      me: i.Ot[0],
      be: i.Ot[1],
      we: i.Ot[2],
      ge: i.Ot[3],
      nt: NaN,
      de: NaN,
      _e: NaN,
      ue: NaN,
      fe: NaN,
    };
  }
  $s() {
    const t = this.Is.js();
    this.Vs = this.Is.Vn()
      .Qs()
      .map((i) => this.te(i.ie, i, t));
  }
}
class Te extends Bs {
  constructor() {
    super(...arguments), (this.Ns = new Ee());
  }
  te(t, i, s) {
    return Object.assign(Object.assign({}, this.pe(t, i, s)), s.Ws(t));
  }
  Ks() {
    const t = this.Is.W();
    this.Ns.J({
      Vn: this.Vs,
      ee: this.zs.St().ee(),
      ce: t.openVisible,
      ae: t.thinBars,
      tt: this.Bs,
    });
  }
}
class ke extends Cs {
  constructor() {
    super(...arguments), (this.ks = new di());
  }
  fs(t, i) {
    const s = this.G;
    return this.ks.vs(t, {
      bs: i.Me,
      ws: i.xe,
      gs: i.Se,
      Ms: i.ke,
      xs: t.bitmapSize.height,
      cs: s.cs,
    });
  }
}
class Ne extends Es {
  constructor() {
    super(...arguments), (this.ye = new di());
  }
  Ps(t, i) {
    const s = this.G;
    return this.ye.vs(t, {
      bs: i.Ce,
      ws: i.Ce,
      gs: i.Te,
      Ms: i.Te,
      xs: t.bitmapSize.height,
      cs: s.cs,
    });
  }
}
class Re extends Rt {
  constructor(t, i) {
    super(t, i),
      (this.Ns = new ui()),
      (this.Pe = new ke()),
      (this.Re = new Ne()),
      this.Ns.X([this.Pe, this.Re]);
  }
  te(t, i, s) {
    return Object.assign(Object.assign({}, this.Js(t, i)), s.Ws(t));
  }
  Ks() {
    const t = this.Is.Ct();
    if (t === null) return;
    const i = this.Is.W(),
      s = this.Is.Dt().Rt(i.baseValue.price, t.Ot),
      e = this.zs.St().ee();
    this.Pe.J({
      it: this.Vs,
      et: i.lineWidth,
      Nt: i.lineStyle,
      us: i.lineType,
      cs: s,
      ds: !1,
      tt: this.Bs,
      _s: e,
    }),
      this.Re.J({
        it: this.Vs,
        et: i.lineWidth,
        Nt: i.lineStyle,
        us: i.lineVisible ? i.lineType : void 0,
        Ts: i.pointMarkersVisible
          ? i.pointMarkersRadius || i.lineWidth / 2 + 2
          : void 0,
        cs: s,
        tt: this.Bs,
        _s: e,
      });
  }
}
class Be extends B {
  constructor() {
    super(...arguments), (this.zt = null), (this.re = 0);
  }
  J(t) {
    this.zt = t;
  }
  Z(t) {
    if (this.zt === null || this.zt.Vn.length === 0 || this.zt.tt === null)
      return;
    const { horizontalPixelRatio: i } = t;
    (this.re = (function (n, r) {
      if (n >= 2.5 && n <= 4) return Math.floor(3 * r);
      const o = 1 - (0.2 * Math.atan(Math.max(4, n) - 4)) / (0.5 * Math.PI),
        l = Math.floor(n * o * r),
        a = Math.floor(n * r),
        u = Math.min(l, a);
      return Math.max(Math.floor(r), u);
    })(this.zt.ee, i)),
      this.re >= 2 && Math.floor(i) % 2 != this.re % 2 && this.re--;
    const s = this.zt.Vn;
    this.zt.De && this.Oe(t, s, this.zt.tt),
      this.zt._i && this.Ae(t, s, this.zt.tt);
    const e = this.Ve(i);
    (!this.zt._i || this.re > 2 * e) && this.Be(t, s, this.zt.tt);
  }
  Oe(t, i, s) {
    if (this.zt === null) return;
    const { context: e, horizontalPixelRatio: n, verticalPixelRatio: r } = t;
    let o = "",
      l = Math.min(Math.floor(n), Math.floor(this.zt.ee * n));
    l = Math.max(Math.floor(n), Math.min(l, this.re));
    const a = Math.floor(0.5 * l);
    let u = null;
    for (let c = s.from; c < s.to; c++) {
      const d = i[c];
      d.Ie !== o && ((e.fillStyle = d.Ie), (o = d.Ie));
      const f = Math.round(Math.min(d.de, d.fe) * r),
        m = Math.round(Math.max(d.de, d.fe) * r),
        v = Math.round(d._e * r),
        b = Math.round(d.ue * r);
      let g = Math.round(n * d.nt) - a;
      const w = g + l - 1;
      u !== null && ((g = Math.max(u + 1, g)), (g = Math.min(g, w)));
      const y = w - g + 1;
      e.fillRect(g, v, y, f - v), e.fillRect(g, m + 1, y, b - m), (u = w);
    }
  }
  Ve(t) {
    let i = Math.floor(1 * t);
    this.re <= 2 * i && (i = Math.floor(0.5 * (this.re - 1)));
    const s = Math.max(Math.floor(t), i);
    return this.re <= 2 * s ? Math.max(Math.floor(t), Math.floor(1 * t)) : s;
  }
  Ae(t, i, s) {
    if (this.zt === null) return;
    const { context: e, horizontalPixelRatio: n, verticalPixelRatio: r } = t;
    let o = "";
    const l = this.Ve(n);
    let a = null;
    for (let u = s.from; u < s.to; u++) {
      const c = i[u];
      c.ze !== o && ((e.fillStyle = c.ze), (o = c.ze));
      let d = Math.round(c.nt * n) - Math.floor(0.5 * this.re);
      const f = d + this.re - 1,
        m = Math.round(Math.min(c.de, c.fe) * r),
        v = Math.round(Math.max(c.de, c.fe) * r);
      if (
        (a !== null && ((d = Math.max(a + 1, d)), (d = Math.min(d, f))),
        this.zt.ee * n > 2 * l)
      )
        ve(e, d, m, f - d + 1, v - m + 1, l);
      else {
        const b = f - d + 1;
        e.fillRect(d, m, b, v - m + 1);
      }
      a = f;
    }
  }
  Be(t, i, s) {
    if (this.zt === null) return;
    const { context: e, horizontalPixelRatio: n, verticalPixelRatio: r } = t;
    let o = "";
    const l = this.Ve(n);
    for (let a = s.from; a < s.to; a++) {
      const u = i[a];
      let c = Math.round(Math.min(u.de, u.fe) * r),
        d = Math.round(Math.max(u.de, u.fe) * r),
        f = Math.round(u.nt * n) - Math.floor(0.5 * this.re),
        m = f + this.re - 1;
      if (u.oe !== o) {
        const v = u.oe;
        (e.fillStyle = v), (o = v);
      }
      this.zt._i && ((f += l), (c += l), (m -= l), (d -= l)),
        c > d || e.fillRect(f, c, m - f + 1, d - c + 1);
    }
  }
}
class Le extends Bs {
  constructor() {
    super(...arguments), (this.Ns = new Be());
  }
  te(t, i, s) {
    return Object.assign(Object.assign({}, this.pe(t, i, s)), s.Ws(t));
  }
  Ks() {
    const t = this.Is.W();
    this.Ns.J({
      Vn: this.Vs,
      ee: this.zs.St().ee(),
      De: t.wickVisible,
      _i: t.borderVisible,
      tt: this.Bs,
    });
  }
}
class Pe {
  constructor(t, i) {
    (this.Le = t), (this.zi = i);
  }
  K(t, i, s) {
    this.Le.draw(t, this.zi, i, s);
  }
}
class Vt extends fi {
  constructor(t, i, s) {
    super(t, i, !1),
      (this.mn = s),
      (this.Ns = new Pe(this.mn.renderer(), (e) => {
        const n = t.Ct();
        return n === null ? null : t.Dt().Rt(e, n.Ot);
      }));
  }
  Ee(t) {
    return this.mn.priceValueBuilder(t);
  }
  Ne(t) {
    return this.mn.isWhitespace(t);
  }
  $s() {
    const t = this.Is.js();
    this.Vs = this.Is.Vn()
      .Qs()
      .map((i) =>
        Object.assign(Object.assign({ ot: i.ie, nt: NaN }, t.Ws(i.ie)), {
          Fe: i.We,
        })
      );
  }
  Xs(t, i) {
    i.Zs(this.Vs, ot(this.Bs));
  }
  Ks() {
    this.mn.update(
      {
        bars: this.Vs.map(We),
        barSpacing: this.zs.St().ee(),
        visibleRange: this.Bs,
      },
      this.Is.W()
    );
  }
}
function We(h) {
  return { x: h.nt, time: h.ot, originalData: h.Fe, barColor: h.oe };
}
class Ie extends B {
  constructor() {
    super(...arguments), (this.zt = null), (this.je = []);
  }
  J(t) {
    (this.zt = t), (this.je = []);
  }
  Z({ context: t, horizontalPixelRatio: i, verticalPixelRatio: s }) {
    if (this.zt === null || this.zt.it.length === 0 || this.zt.tt === null)
      return;
    this.je.length || this.He(i);
    const e = Math.max(1, Math.floor(s)),
      n = Math.round(this.zt.$e * s) - Math.floor(e / 2),
      r = n + e;
    for (let o = this.zt.tt.from; o < this.zt.tt.to; o++) {
      const l = this.zt.it[o],
        a = this.je[o - this.zt.tt.from],
        u = Math.round(l.st * s);
      let c, d;
      (t.fillStyle = l.oe),
        u <= n
          ? ((c = u), (d = r))
          : ((c = n), (d = u - Math.floor(e / 2) + e)),
        t.fillRect(a.Rs, c, a.ui - a.Rs + 1, d - c);
    }
  }
  He(t) {
    if (this.zt === null || this.zt.it.length === 0 || this.zt.tt === null)
      return void (this.je = []);
    const i = Math.ceil(this.zt.ee * t) <= 1 ? 0 : Math.max(1, Math.floor(t)),
      s = Math.round(this.zt.ee * t) - i;
    this.je = new Array(this.zt.tt.to - this.zt.tt.from);
    for (let n = this.zt.tt.from; n < this.zt.tt.to; n++) {
      const r = this.zt.it[n],
        o = Math.round(r.nt * t);
      let l, a;
      if (s % 2) {
        const u = (s - 1) / 2;
        (l = o - u), (a = o + u);
      } else {
        const u = s / 2;
        (l = o - u), (a = o + u - 1);
      }
      this.je[n - this.zt.tt.from] = {
        Rs: l,
        ui: a,
        Ue: o,
        qe: r.nt * t,
        ot: r.ot,
      };
    }
    for (let n = this.zt.tt.from + 1; n < this.zt.tt.to; n++) {
      const r = this.je[n - this.zt.tt.from],
        o = this.je[n - this.zt.tt.from - 1];
      r.ot === o.ot + 1 &&
        r.Rs - o.ui !== i + 1 &&
        (o.Ue > o.qe ? (o.ui = r.Rs - i - 1) : (r.Rs = o.ui + i + 1));
    }
    let e = Math.ceil(this.zt.ee * t);
    for (let n = this.zt.tt.from; n < this.zt.tt.to; n++) {
      const r = this.je[n - this.zt.tt.from];
      r.ui < r.Rs && (r.ui = r.Rs);
      const o = r.ui - r.Rs + 1;
      e = Math.min(o, e);
    }
    if (i > 0 && e < 4)
      for (let n = this.zt.tt.from; n < this.zt.tt.to; n++) {
        const r = this.je[n - this.zt.tt.from];
        r.ui - r.Rs + 1 > e && (r.Ue > r.qe ? (r.ui -= 1) : (r.Rs += 1));
      }
  }
}
class De extends Rt {
  constructor() {
    super(...arguments), (this.Ns = new Ie());
  }
  te(t, i, s) {
    return Object.assign(Object.assign({}, this.Js(t, i)), s.Ws(t));
  }
  Ks() {
    const t = {
      it: this.Vs,
      ee: this.zs.St().ee(),
      tt: this.Bs,
      $e: this.Is.Dt().Rt(this.Is.W().base, p(this.Is.Ct()).Ot),
    };
    this.Ns.J(t);
  }
}
class Ve extends Rt {
  constructor() {
    super(...arguments), (this.Ns = new Ts());
  }
  te(t, i, s) {
    return Object.assign(Object.assign({}, this.Js(t, i)), s.Ws(t));
  }
  Ks() {
    const t = this.Is.W(),
      i = {
        it: this.Vs,
        Nt: t.lineStyle,
        us: t.lineVisible ? t.lineType : void 0,
        et: t.lineWidth,
        Ts: t.pointMarkersVisible
          ? t.pointMarkersRadius || t.lineWidth / 2 + 2
          : void 0,
        tt: this.Bs,
        _s: this.zs.St().ee(),
      };
    this.Ns.J(i);
  }
}
const Ae = /[2-9]/g;
class lt {
  constructor(t = 50) {
    (this.Ye = 0),
      (this.Xe = 1),
      (this.Ke = 1),
      (this.Ze = {}),
      (this.Ge = new Map()),
      (this.Je = t);
  }
  Qe() {
    (this.Ye = 0),
      this.Ge.clear(),
      (this.Xe = 1),
      (this.Ke = 1),
      (this.Ze = {});
  }
  Mi(t, i, s) {
    return this.tr(t, i, s).width;
  }
  gi(t, i, s) {
    const e = this.tr(t, i, s);
    return (
      ((e.actualBoundingBoxAscent || 0) - (e.actualBoundingBoxDescent || 0)) / 2
    );
  }
  tr(t, i, s) {
    const e = s || Ae,
      n = String(i).replace(e, "0");
    if (this.Ge.has(n)) return E(this.Ge.get(n)).ir;
    if (this.Ye === this.Je) {
      const o = this.Ze[this.Ke];
      delete this.Ze[this.Ke], this.Ge.delete(o), this.Ke++, this.Ye--;
    }
    t.save(), (t.textBaseline = "middle");
    const r = t.measureText(n);
    return (
      t.restore(),
      (r.width === 0 && i.length) ||
        (this.Ge.set(n, { ir: r, nr: this.Xe }),
        (this.Ze[this.Xe] = n),
        this.Ye++,
        this.Xe++),
      r
    );
  }
}
class $e {
  constructor(t) {
    (this.sr = null), (this.k = null), (this.er = "right"), (this.rr = t);
  }
  hr(t, i, s) {
    (this.sr = t), (this.k = i), (this.er = s);
  }
  K(t) {
    this.k !== null &&
      this.sr !== null &&
      this.sr.K(t, this.k, this.rr, this.er);
  }
}
class Ls {
  constructor(t, i, s) {
    (this.lr = t),
      (this.rr = new lt(50)),
      (this.ar = i),
      (this.F = s),
      (this.j = -1),
      (this.Wt = new $e(this.rr));
  }
  gt() {
    const t = this.F._r(this.ar);
    if (t === null) return null;
    const i = t.ur(this.ar) ? t.cr() : this.ar.Dt();
    if (i === null) return null;
    const s = t.dr(i);
    if (s === "overlay") return null;
    const e = this.F.vr();
    return (
      e.P !== this.j && ((this.j = e.P), this.rr.Qe()),
      this.Wt.hr(this.lr.Bi(), e, s),
      this.Wt
    );
  }
}
class Fe extends B {
  constructor() {
    super(...arguments), (this.zt = null);
  }
  J(t) {
    this.zt = t;
  }
  pr(t, i) {
    var s;
    if (!(!((s = this.zt) === null || s === void 0) && s.yt)) return null;
    const { st: e, et: n, mr: r } = this.zt;
    return i >= e - n - 7 && i <= e + n + 7 ? { br: this.zt, mr: r } : null;
  }
  Z({
    context: t,
    bitmapSize: i,
    horizontalPixelRatio: s,
    verticalPixelRatio: e,
  }) {
    if (this.zt === null || this.zt.yt === !1) return;
    const n = Math.round(this.zt.st * e);
    n < 0 ||
      n > i.height ||
      ((t.lineCap = "butt"),
      (t.strokeStyle = this.zt.O),
      (t.lineWidth = Math.floor(this.zt.et * s)),
      j(t, this.zt.Nt),
      _s(t, n, 0, i.width));
  }
}
class mi {
  constructor(t) {
    (this.wr = { st: 0, O: "rgba(0, 0, 0, 0)", et: 1, Nt: 0, yt: !1 }),
      (this.gr = new Fe()),
      (this.ft = !0),
      (this.Is = t),
      (this.zs = t.$t()),
      this.gr.J(this.wr);
  }
  bt() {
    this.ft = !0;
  }
  gt() {
    return this.Is.yt()
      ? (this.ft && (this.Mr(), (this.ft = !1)), this.gr)
      : null;
  }
}
class He extends mi {
  constructor(t) {
    super(t);
  }
  Mr() {
    this.wr.yt = !1;
    const t = this.Is.Dt(),
      i = t.Sr().Sr;
    if (i !== 2 && i !== 3) return;
    const s = this.Is.W();
    if (!s.baseLineVisible || !this.Is.yt()) return;
    const e = this.Is.Ct();
    e !== null &&
      ((this.wr.yt = !0),
      (this.wr.st = t.Rt(e.Ot, e.Ot)),
      (this.wr.O = s.baseLineColor),
      (this.wr.et = s.baseLineWidth),
      (this.wr.Nt = s.baseLineStyle));
  }
}
class je extends B {
  constructor() {
    super(...arguments), (this.zt = null);
  }
  J(t) {
    this.zt = t;
  }
  We() {
    return this.zt;
  }
  Z({ context: t, horizontalPixelRatio: i, verticalPixelRatio: s }) {
    const e = this.zt;
    if (e === null) return;
    const n = Math.max(1, Math.floor(i)),
      r = (n % 2) / 2,
      o = Math.round(e.qe.x * i) + r,
      l = e.qe.y * s;
    (t.fillStyle = e.kr), t.beginPath();
    const a = Math.max(2, 1.5 * e.yr) * i;
    t.arc(o, l, a, 0, 2 * Math.PI, !1),
      t.fill(),
      (t.fillStyle = e.Cr),
      t.beginPath(),
      t.arc(o, l, e.ht * i, 0, 2 * Math.PI, !1),
      t.fill(),
      (t.lineWidth = n),
      (t.strokeStyle = e.Tr),
      t.beginPath(),
      t.arc(o, l, e.ht * i + n / 2, 0, 2 * Math.PI, !1),
      t.stroke();
  }
}
const Ue = [
  { Pr: 0, Rr: 0.25, Dr: 4, Or: 10, Ar: 0.25, Vr: 0, Br: 0.4, Ir: 0.8 },
  { Pr: 0.25, Rr: 0.525, Dr: 10, Or: 14, Ar: 0, Vr: 0, Br: 0.8, Ir: 0 },
  { Pr: 0.525, Rr: 1, Dr: 14, Or: 14, Ar: 0, Vr: 0, Br: 0, Ir: 0 },
];
function Wi(h, t, i, s) {
  return (function (e, n) {
    if (e === "transparent") return e;
    const r = zt(e),
      o = r[3];
    return `rgba(${r[0]}, ${r[1]}, ${r[2]}, ${n * o})`;
  })(h, i + (s - i) * t);
}
function Ii(h, t) {
  const i = (h % 2600) / 2600;
  let s;
  for (const l of Ue)
    if (i >= l.Pr && i <= l.Rr) {
      s = l;
      break;
    }
  A(s !== void 0, "Last price animation internal logic error");
  const e = (i - s.Pr) / (s.Rr - s.Pr);
  return {
    Cr: Wi(t, e, s.Ar, s.Vr),
    Tr: Wi(t, e, s.Br, s.Ir),
    ht: ((n = e), (r = s.Dr), (o = s.Or), r + (o - r) * n),
  };
  var n, r, o;
}
class Ze {
  constructor(t) {
    (this.Wt = new je()),
      (this.ft = !0),
      (this.zr = !0),
      (this.Lr = performance.now()),
      (this.Er = this.Lr - 1),
      (this.Nr = t);
  }
  Fr() {
    (this.Er = this.Lr - 1), this.bt();
  }
  Wr() {
    if ((this.bt(), this.Nr.W().lastPriceAnimation === 2)) {
      const t = performance.now(),
        i = this.Er - t;
      if (i > 0) return void (i < 650 && (this.Er += 2600));
      (this.Lr = t), (this.Er = t + 2600);
    }
  }
  bt() {
    this.ft = !0;
  }
  jr() {
    this.zr = !0;
  }
  yt() {
    return this.Nr.W().lastPriceAnimation !== 0;
  }
  Hr() {
    switch (this.Nr.W().lastPriceAnimation) {
      case 0:
        return !1;
      case 1:
        return !0;
      case 2:
        return performance.now() <= this.Er;
    }
  }
  gt() {
    return (
      this.ft
        ? (this.Mt(), (this.ft = !1), (this.zr = !1))
        : this.zr && (this.$r(), (this.zr = !1)),
      this.Wt
    );
  }
  Mt() {
    this.Wt.J(null);
    const t = this.Nr.$t().St(),
      i = t.qs(),
      s = this.Nr.Ct();
    if (i === null || s === null) return;
    const e = this.Nr.Ur(!0);
    if (e.qr || !i.Yr(e.ie)) return;
    const n = { x: t.It(e.ie), y: this.Nr.Dt().Rt(e._t, s.Ot) },
      r = e.O,
      o = this.Nr.W().lineWidth,
      l = Ii(this.Xr(), r);
    this.Wt.J({ kr: r, yr: o, Cr: l.Cr, Tr: l.Tr, ht: l.ht, qe: n });
  }
  $r() {
    const t = this.Wt.We();
    if (t !== null) {
      const i = Ii(this.Xr(), t.kr);
      (t.Cr = i.Cr), (t.Tr = i.Tr), (t.ht = i.ht);
    }
  }
  Xr() {
    return this.Hr() ? performance.now() - this.Lr : 2599;
  }
}
function st(h, t) {
  return Os(Math.min(Math.max(h, 12), 30) * t);
}
function at(h, t) {
  switch (h) {
    case "arrowDown":
    case "arrowUp":
      return st(t, 1);
    case "circle":
      return st(t, 0.8);
    case "square":
      return st(t, 0.7);
  }
}
function Ps(h) {
  return (function (t) {
    const i = Math.ceil(t);
    return i % 2 != 0 ? i - 1 : i;
  })(st(h, 1));
}
function Di(h) {
  return Math.max(st(h, 0.1), 3);
}
function Ws(h, t, i, s, e) {
  const n = at("square", i),
    r = (n - 1) / 2,
    o = h - r,
    l = t - r;
  return s >= o && s <= o + n && e >= l && e <= l + n;
}
function Vi(h, t, i, s) {
  const e = ((at("arrowUp", s) - 1) / 2) * i.Kr,
    n = ((Os(s / 2) - 1) / 2) * i.Kr;
  t.beginPath(),
    h
      ? (t.moveTo(i.nt - e, i.st),
        t.lineTo(i.nt, i.st - e),
        t.lineTo(i.nt + e, i.st),
        t.lineTo(i.nt + n, i.st),
        t.lineTo(i.nt + n, i.st + e),
        t.lineTo(i.nt - n, i.st + e),
        t.lineTo(i.nt - n, i.st))
      : (t.moveTo(i.nt - e, i.st),
        t.lineTo(i.nt, i.st + e),
        t.lineTo(i.nt + e, i.st),
        t.lineTo(i.nt + n, i.st),
        t.lineTo(i.nt + n, i.st - e),
        t.lineTo(i.nt - n, i.st - e),
        t.lineTo(i.nt - n, i.st)),
    t.fill();
}
function Ye(h, t, i, s, e, n) {
  return Ws(t, i, s, e, n);
}
class Qe extends B {
  constructor() {
    super(...arguments),
      (this.zt = null),
      (this.rr = new lt()),
      (this.j = -1),
      (this.H = ""),
      (this.Zr = "");
  }
  J(t) {
    this.zt = t;
  }
  hr(t, i) {
    (this.j === t && this.H === i) ||
      ((this.j = t), (this.H = i), (this.Zr = K(t, i)), this.rr.Qe());
  }
  pr(t, i) {
    if (this.zt === null || this.zt.tt === null) return null;
    for (let s = this.zt.tt.from; s < this.zt.tt.to; s++) {
      const e = this.zt.it[s];
      if (qe(e, t, i)) return { br: e.Gr, mr: e.mr };
    }
    return null;
  }
  Z({ context: t, horizontalPixelRatio: i, verticalPixelRatio: s }, e, n) {
    if (this.zt !== null && this.zt.tt !== null) {
      (t.textBaseline = "middle"), (t.font = this.Zr);
      for (let r = this.zt.tt.from; r < this.zt.tt.to; r++) {
        const o = this.zt.it[r];
        o.Zt !== void 0 &&
          ((o.Zt.ji = this.rr.Mi(t, o.Zt.Jr)),
          (o.Zt.Bt = this.j),
          (o.Zt.nt = o.nt - o.Zt.ji / 2)),
          Xe(o, t, i, s);
      }
    }
  }
}
function Xe(h, t, i, s) {
  (t.fillStyle = h.O),
    h.Zt !== void 0 &&
      (function (e, n, r, o, l, a) {
        e.save(), e.scale(l, a), e.fillText(n, r, o), e.restore();
      })(t, h.Zt.Jr, h.Zt.nt, h.Zt.st, i, s),
    (function (e, n, r) {
      if (e.Ys !== 0) {
        switch (e.Qr) {
          case "arrowDown":
            return void Vi(!1, n, r, e.Ys);
          case "arrowUp":
            return void Vi(!0, n, r, e.Ys);
          case "circle":
            return void (function (o, l, a) {
              const u = (at("circle", a) - 1) / 2;
              o.beginPath(),
                o.arc(l.nt, l.st, u * l.Kr, 0, 2 * Math.PI, !1),
                o.fill();
            })(n, r, e.Ys);
          case "square":
            return void (function (o, l, a) {
              const u = at("square", a),
                c = ((u - 1) * l.Kr) / 2,
                d = l.nt - c,
                f = l.st - c;
              o.fillRect(d, f, u * l.Kr, u * l.Kr);
            })(n, r, e.Ys);
        }
        e.Qr;
      }
    })(
      h,
      t,
      (function (e, n, r) {
        const o = (Math.max(1, Math.floor(n)) % 2) / 2;
        return { nt: Math.round(e.nt * n) + o, st: e.st * r, Kr: n };
      })(h, i, s)
    );
}
function qe(h, t, i) {
  return (
    !(
      h.Zt === void 0 ||
      !(function (s, e, n, r, o, l) {
        const a = r / 2;
        return o >= s && o <= s + n && l >= e - a && l <= e + a;
      })(h.Zt.nt, h.Zt.st, h.Zt.ji, h.Zt.Bt, t, i)
    ) ||
    (function (s, e, n) {
      if (s.Ys === 0) return !1;
      switch (s.Qr) {
        case "arrowDown":
        case "arrowUp":
          return Ye(0, s.nt, s.st, s.Ys, e, n);
        case "circle":
          return (function (r, o, l, a, u) {
            const c = 2 + at("circle", l) / 2,
              d = r - a,
              f = o - u;
            return Math.sqrt(d * d + f * f) <= c;
          })(s.nt, s.st, s.Ys, e, n);
        case "square":
          return Ws(s.nt, s.st, s.Ys, e, n);
      }
    })(h, t, i)
  );
}
function Je(h, t, i, s, e, n, r, o, l) {
  const a = P(i) ? i : i.ge,
    u = P(i) ? i : i.be,
    c = P(i) ? i : i.we,
    d = P(t.size) ? Math.max(t.size, 0) : 1,
    f = Ps(o.ee()) * d,
    m = f / 2;
  switch (((h.Ys = f), t.position)) {
    case "inBar":
      return (
        (h.st = r.Rt(a, l)),
        void (h.Zt !== void 0 && (h.Zt.st = h.st + m + n + 0.6 * e))
      );
    case "aboveBar":
      return (
        (h.st = r.Rt(u, l) - m - s.th),
        h.Zt !== void 0 && ((h.Zt.st = h.st - m - 0.6 * e), (s.th += 1.2 * e)),
        void (s.th += f + n)
      );
    case "belowBar":
      return (
        (h.st = r.Rt(c, l) + m + s.ih),
        h.Zt !== void 0 &&
          ((h.Zt.st = h.st + m + n + 0.6 * e), (s.ih += 1.2 * e)),
        void (s.ih += f + n)
      );
  }
  t.position;
}
class Ke {
  constructor(t, i) {
    (this.ft = !0),
      (this.nh = !0),
      (this.sh = !0),
      (this.eh = null),
      (this.Wt = new Qe()),
      (this.Nr = t),
      (this.Hi = i),
      (this.zt = { it: [], tt: null });
  }
  bt(t) {
    (this.ft = !0), (this.sh = !0), t === "data" && (this.nh = !0);
  }
  gt(t) {
    if (!this.Nr.yt()) return null;
    this.ft && this.rh();
    const i = this.Hi.W().layout;
    return this.Wt.hr(i.fontSize, i.fontFamily), this.Wt.J(this.zt), this.Wt;
  }
  hh() {
    if (this.sh) {
      if (this.Nr.lh().length > 0) {
        const t = this.Hi.St().ee(),
          i = Di(t),
          s = 1.5 * Ps(t) + 2 * i;
        this.eh = { above: s, below: s };
      } else this.eh = null;
      this.sh = !1;
    }
    return this.eh;
  }
  rh() {
    const t = this.Nr.Dt(),
      i = this.Hi.St(),
      s = this.Nr.lh();
    this.nh &&
      ((this.zt.it = s.map((u) => ({
        ot: u.time,
        nt: 0,
        st: 0,
        Ys: 0,
        Qr: u.shape,
        O: u.color,
        Gr: u.Gr,
        mr: u.id,
        Zt: void 0,
      }))),
      (this.nh = !1));
    const e = this.Hi.W().layout;
    this.zt.tt = null;
    const n = i.qs();
    if (n === null) return;
    const r = this.Nr.Ct();
    if (r === null || this.zt.it.length === 0) return;
    let o = NaN;
    const l = Di(i.ee()),
      a = { th: l, ih: l };
    this.zt.tt = Rs(this.zt.it, n, !0);
    for (let u = this.zt.tt.from; u < this.zt.tt.to; u++) {
      const c = s[u];
      c.time !== o && ((a.th = l), (a.ih = l), (o = c.time));
      const d = this.zt.it[u];
      (d.nt = i.It(c.time)),
        c.text !== void 0 &&
          c.text.length > 0 &&
          (d.Zt = { Jr: c.text, nt: 0, st: 0, ji: 0, Bt: 0 });
      const f = this.Nr.ah(c.time);
      f !== null && Je(d, c, f, a, e.fontSize, l, t, i, r.Ot);
    }
    this.ft = !1;
  }
}
class Ge extends mi {
  constructor(t) {
    super(t);
  }
  Mr() {
    const t = this.wr;
    t.yt = !1;
    const i = this.Is.W();
    if (!i.priceLineVisible || !this.Is.yt()) return;
    const s = this.Is.Ur(i.priceLineSource === 0);
    s.qr ||
      ((t.yt = !0),
      (t.st = s.Si),
      (t.O = this.Is.oh(s.O)),
      (t.et = i.priceLineWidth),
      (t.Nt = i.priceLineStyle));
  }
}
class th extends Tt {
  constructor(t) {
    super(), (this.jt = t);
  }
  Ii(t, i, s) {
    (t.yt = !1), (i.yt = !1);
    const e = this.jt;
    if (!e.yt()) return;
    const n = e.W(),
      r = n.lastValueVisible,
      o = e._h() !== "",
      l = n.seriesLastValueMode === 0,
      a = e.Ur(!1);
    if (a.qr) return;
    r && ((t.Zt = this.uh(a, r, l)), (t.yt = t.Zt.length !== 0)),
      (o || l) && ((i.Zt = this.dh(a, r, o, l)), (i.yt = i.Zt.length > 0));
    const u = e.oh(a.O),
      c = Ot(u);
    (s.t = c.t),
      (s.Si = a.Si),
      (i.At = e.$t().Vt(a.Si / e.Dt().Bt())),
      (t.At = u),
      (t.O = c.i),
      (i.O = c.i);
  }
  dh(t, i, s, e) {
    let n = "";
    const r = this.jt._h();
    return (
      s && r.length !== 0 && (n += `${r} `),
      i && e && (n += this.jt.Dt().fh() ? t.ph : t.mh),
      n.trim()
    );
  }
  uh(t, i, s) {
    return i ? (s ? (this.jt.Dt().fh() ? t.mh : t.ph) : t.Zt) : "";
  }
}
function Ai(h, t, i, s) {
  const e = Number.isFinite(t),
    n = Number.isFinite(i);
  return e && n ? h(t, i) : e || n ? (e ? t : i) : s;
}
class T {
  constructor(t, i) {
    (this.bh = t), (this.wh = i);
  }
  gh(t) {
    return t !== null && this.bh === t.bh && this.wh === t.wh;
  }
  Mh() {
    return new T(this.bh, this.wh);
  }
  xh() {
    return this.bh;
  }
  Sh() {
    return this.wh;
  }
  kh() {
    return this.wh - this.bh;
  }
  Ei() {
    return (
      this.wh === this.bh || Number.isNaN(this.wh) || Number.isNaN(this.bh)
    );
  }
  Jn(t) {
    return t === null
      ? this
      : new T(
          Ai(Math.min, this.xh(), t.xh(), -1 / 0),
          Ai(Math.max, this.Sh(), t.Sh(), 1 / 0)
        );
  }
  yh(t) {
    if (!P(t) || this.wh - this.bh === 0) return;
    const i = 0.5 * (this.wh + this.bh);
    let s = this.wh - i,
      e = this.bh - i;
    (s *= t), (e *= t), (this.wh = i + s), (this.bh = i + e);
  }
  Ch(t) {
    P(t) && ((this.wh += t), (this.bh += t));
  }
  Th() {
    return { minValue: this.bh, maxValue: this.wh };
  }
  static Ph(t) {
    return t === null ? null : new T(t.minValue, t.maxValue);
  }
}
class xt {
  constructor(t, i) {
    (this.Rh = t), (this.Dh = i || null);
  }
  Oh() {
    return this.Rh;
  }
  Ah() {
    return this.Dh;
  }
  Th() {
    return this.Rh === null
      ? null
      : { priceRange: this.Rh.Th(), margins: this.Dh || void 0 };
  }
  static Ph(t) {
    return t === null ? null : new xt(T.Ph(t.priceRange), t.margins);
  }
}
class ih extends mi {
  constructor(t, i) {
    super(t), (this.Vh = i);
  }
  Mr() {
    const t = this.wr;
    t.yt = !1;
    const i = this.Vh.W();
    if (!this.Is.yt() || !i.lineVisible) return;
    const s = this.Vh.Bh();
    s !== null &&
      ((t.yt = !0),
      (t.st = s),
      (t.O = i.color),
      (t.et = i.lineWidth),
      (t.Nt = i.lineStyle),
      (t.mr = this.Vh.W().id));
  }
}
class sh extends Tt {
  constructor(t, i) {
    super(), (this.Nr = t), (this.Vh = i);
  }
  Ii(t, i, s) {
    (t.yt = !1), (i.yt = !1);
    const e = this.Vh.W(),
      n = e.axisLabelVisible,
      r = e.title !== "",
      o = this.Nr;
    if (!n || !o.yt()) return;
    const l = this.Vh.Bh();
    if (l === null) return;
    r && ((i.Zt = e.title), (i.yt = !0)),
      (i.At = o.$t().Vt(l / o.Dt().Bt())),
      (t.Zt = this.Ih(e.price)),
      (t.yt = !0);
    const a = Ot(e.axisLabelColor || e.color);
    s.t = a.t;
    const u = e.axisLabelTextColor || a.i;
    (t.O = u), (i.O = u), (s.Si = l);
  }
  Ih(t) {
    const i = this.Nr.Ct();
    return i === null ? "" : this.Nr.Dt().Ni(t, i.Ot);
  }
}
class eh {
  constructor(t, i) {
    (this.Nr = t),
      (this._n = i),
      (this.zh = new ih(t, this)),
      (this.lr = new sh(t, this)),
      (this.Lh = new Ls(this.lr, t, t.$t()));
  }
  Eh(t) {
    R(this._n, t), this.bt(), this.Nr.$t().Nh();
  }
  W() {
    return this._n;
  }
  Fh() {
    return this.zh;
  }
  Wh() {
    return this.Lh;
  }
  jh() {
    return this.lr;
  }
  bt() {
    this.zh.bt(), this.lr.bt();
  }
  Bh() {
    const t = this.Nr,
      i = t.Dt();
    if (t.$t().St().Ei() || i.Ei()) return null;
    const s = t.Ct();
    return s === null ? null : i.Rt(this._n.price, s.Ot);
  }
}
class hh extends ci {
  constructor(t) {
    super(), (this.Hi = t);
  }
  $t() {
    return this.Hi;
  }
}
const nh = {
  Bar: (h, t, i, s) => {
    var e;
    const n = t.upColor,
      r = t.downColor,
      o = p(h(i, s)),
      l = X(o.Ot[0]) <= X(o.Ot[3]);
    return { oe: (e = o.O) !== null && e !== void 0 ? e : l ? n : r };
  },
  Candlestick: (h, t, i, s) => {
    var e, n, r;
    const o = t.upColor,
      l = t.downColor,
      a = t.borderUpColor,
      u = t.borderDownColor,
      c = t.wickUpColor,
      d = t.wickDownColor,
      f = p(h(i, s)),
      m = X(f.Ot[0]) <= X(f.Ot[3]);
    return {
      oe: (e = f.O) !== null && e !== void 0 ? e : m ? o : l,
      ze: (n = f.At) !== null && n !== void 0 ? n : m ? a : u,
      Ie: (r = f.Hh) !== null && r !== void 0 ? r : m ? c : d,
    };
  },
  Custom: (h, t, i, s) => {
    var e;
    return { oe: (e = p(h(i, s)).O) !== null && e !== void 0 ? e : t.color };
  },
  Area: (h, t, i, s) => {
    var e, n, r, o;
    const l = p(h(i, s));
    return {
      oe: (e = l.lt) !== null && e !== void 0 ? e : t.lineColor,
      lt: (n = l.lt) !== null && n !== void 0 ? n : t.lineColor,
      ys: (r = l.ys) !== null && r !== void 0 ? r : t.topColor,
      Cs: (o = l.Cs) !== null && o !== void 0 ? o : t.bottomColor,
    };
  },
  Baseline: (h, t, i, s) => {
    var e, n, r, o, l, a;
    const u = p(h(i, s));
    return {
      oe: u.Ot[3] >= t.baseValue.price ? t.topLineColor : t.bottomLineColor,
      Ce: (e = u.Ce) !== null && e !== void 0 ? e : t.topLineColor,
      Te: (n = u.Te) !== null && n !== void 0 ? n : t.bottomLineColor,
      Me: (r = u.Me) !== null && r !== void 0 ? r : t.topFillColor1,
      xe: (o = u.xe) !== null && o !== void 0 ? o : t.topFillColor2,
      Se: (l = u.Se) !== null && l !== void 0 ? l : t.bottomFillColor1,
      ke: (a = u.ke) !== null && a !== void 0 ? a : t.bottomFillColor2,
    };
  },
  Line: (h, t, i, s) => {
    var e, n;
    const r = p(h(i, s));
    return {
      oe: (e = r.O) !== null && e !== void 0 ? e : t.color,
      lt: (n = r.O) !== null && n !== void 0 ? n : t.color,
    };
  },
  Histogram: (h, t, i, s) => {
    var e;
    return { oe: (e = p(h(i, s)).O) !== null && e !== void 0 ? e : t.color };
  },
};
class rh {
  constructor(t) {
    (this.$h = (i, s) => (s !== void 0 ? s.Ot : this.Nr.Vn().Uh(i))),
      (this.Nr = t),
      (this.qh = nh[t.Yh()]);
  }
  Ws(t, i) {
    return this.qh(this.$h, this.Nr.W(), t, i);
  }
}
var $i;
(function (h) {
  (h[(h.NearestLeft = -1)] = "NearestLeft"),
    (h[(h.None = 0)] = "None"),
    (h[(h.NearestRight = 1)] = "NearestRight");
})($i || ($i = {}));
const V = 30;
class oh {
  constructor() {
    (this.Xh = []), (this.Kh = new Map()), (this.Zh = new Map());
  }
  Gh() {
    return this.Ys() > 0 ? this.Xh[this.Xh.length - 1] : null;
  }
  Jh() {
    return this.Ys() > 0 ? this.Qh(0) : null;
  }
  An() {
    return this.Ys() > 0 ? this.Qh(this.Xh.length - 1) : null;
  }
  Ys() {
    return this.Xh.length;
  }
  Ei() {
    return this.Ys() === 0;
  }
  Yr(t) {
    return this.tl(t, 0) !== null;
  }
  Uh(t) {
    return this.il(t);
  }
  il(t, i = 0) {
    const s = this.tl(t, i);
    return s === null
      ? null
      : Object.assign(Object.assign({}, this.nl(s)), { ie: this.Qh(s) });
  }
  Qs() {
    return this.Xh;
  }
  sl(t, i, s) {
    if (this.Ei()) return null;
    let e = null;
    for (const n of s) e = vt(e, this.el(t, i, n));
    return e;
  }
  J(t) {
    this.Zh.clear(), this.Kh.clear(), (this.Xh = t);
  }
  Qh(t) {
    return this.Xh[t].ie;
  }
  nl(t) {
    return this.Xh[t];
  }
  tl(t, i) {
    const s = this.rl(t);
    if (s === null && i !== 0)
      switch (i) {
        case -1:
          return this.hl(t);
        case 1:
          return this.ll(t);
        default:
          throw new TypeError("Unknown search mode");
      }
    return s;
  }
  hl(t) {
    let i = this.al(t);
    return i > 0 && (i -= 1), i !== this.Xh.length && this.Qh(i) < t ? i : null;
  }
  ll(t) {
    const i = this.ol(t);
    return i !== this.Xh.length && t < this.Qh(i) ? i : null;
  }
  rl(t) {
    const i = this.al(t);
    return i === this.Xh.length || t < this.Xh[i].ie ? null : i;
  }
  al(t) {
    return ct(this.Xh, t, (i, s) => i.ie < s);
  }
  ol(t) {
    return Ns(this.Xh, t, (i, s) => i.ie > s);
  }
  _l(t, i, s) {
    let e = null;
    for (let n = t; n < i; n++) {
      const r = this.Xh[n].Ot[s];
      Number.isNaN(r) ||
        (e === null
          ? (e = { ul: r, cl: r })
          : (r < e.ul && (e.ul = r), r > e.cl && (e.cl = r)));
    }
    return e;
  }
  el(t, i, s) {
    if (this.Ei()) return null;
    let e = null;
    const n = p(this.Jh()),
      r = p(this.An()),
      o = Math.max(t, n),
      l = Math.min(i, r),
      a = Math.ceil(o / V) * V,
      u = Math.max(a, Math.floor(l / V) * V);
    {
      const d = this.al(o),
        f = this.ol(Math.min(l, a, i));
      e = vt(e, this._l(d, f, s));
    }
    let c = this.Kh.get(s);
    c === void 0 && ((c = new Map()), this.Kh.set(s, c));
    for (let d = Math.max(a + 1, o); d < u; d += V) {
      const f = Math.floor(d / V);
      let m = c.get(f);
      if (m === void 0) {
        const v = this.al(f * V),
          b = this.ol((f + 1) * V - 1);
        (m = this._l(v, b, s)), c.set(f, m);
      }
      e = vt(e, m);
    }
    {
      const d = this.al(u),
        f = this.ol(l);
      e = vt(e, this._l(d, f, s));
    }
    return e;
  }
}
function vt(h, t) {
  return h === null
    ? t
    : t === null
    ? h
    : { ul: Math.min(h.ul, t.ul), cl: Math.max(h.cl, t.cl) };
}
class lh {
  constructor(t) {
    this.dl = t;
  }
  K(t, i, s) {
    this.dl.draw(t);
  }
  fl(t, i, s) {
    var e, n;
    (n = (e = this.dl).drawBackground) === null || n === void 0 || n.call(e, t);
  }
}
class At {
  constructor(t) {
    (this.Ge = null), (this.mn = t);
  }
  gt() {
    var t;
    const i = this.mn.renderer();
    if (i === null) return null;
    if (((t = this.Ge) === null || t === void 0 ? void 0 : t.vl) === i)
      return this.Ge.pl;
    const s = new lh(i);
    return (this.Ge = { vl: i, pl: s }), s;
  }
  ml() {
    var t, i, s;
    return (s =
      (i = (t = this.mn).zOrder) === null || i === void 0
        ? void 0
        : i.call(t)) !== null && s !== void 0
      ? s
      : "normal";
  }
}
function Is(h) {
  var t, i, s, e, n;
  return {
    Zt: h.text(),
    Si: h.coordinate(),
    xi: (t = h.fixedCoordinate) === null || t === void 0 ? void 0 : t.call(h),
    O: h.textColor(),
    t: h.backColor(),
    yt:
      (s = (i = h.visible) === null || i === void 0 ? void 0 : i.call(h)) ===
        null ||
      s === void 0 ||
      s,
    hi:
      (n =
        (e = h.tickVisible) === null || e === void 0 ? void 0 : e.call(h)) ===
        null ||
      n === void 0 ||
      n,
  };
}
class ah {
  constructor(t, i) {
    (this.Wt = new Ms()), (this.bl = t), (this.wl = i);
  }
  gt() {
    return this.Wt.J(Object.assign({ ji: this.wl.ji() }, Is(this.bl))), this.Wt;
  }
}
class uh extends Tt {
  constructor(t, i) {
    super(), (this.bl = t), (this.zi = i);
  }
  Ii(t, i, s) {
    const e = Is(this.bl);
    (s.t = e.t), (t.O = e.O);
    const n = (2 / 12) * this.zi.P();
    (s.bi = n),
      (s.wi = n),
      (s.Si = e.Si),
      (s.xi = e.xi),
      (t.Zt = e.Zt),
      (t.yt = e.yt),
      (t.hi = e.hi);
  }
}
class ch {
  constructor(t, i) {
    (this.gl = null),
      (this.Ml = null),
      (this.xl = null),
      (this.Sl = null),
      (this.kl = null),
      (this.yl = t),
      (this.Nr = i);
  }
  Cl() {
    return this.yl;
  }
  Rn() {
    var t, i;
    (i = (t = this.yl).updateAllViews) === null || i === void 0 || i.call(t);
  }
  Cn() {
    var t, i, s, e;
    const n =
      (s =
        (i = (t = this.yl).paneViews) === null || i === void 0
          ? void 0
          : i.call(t)) !== null && s !== void 0
        ? s
        : [];
    if (((e = this.gl) === null || e === void 0 ? void 0 : e.vl) === n)
      return this.gl.pl;
    const r = n.map((o) => new At(o));
    return (this.gl = { vl: n, pl: r }), r;
  }
  Ji() {
    var t, i, s, e;
    const n =
      (s =
        (i = (t = this.yl).timeAxisViews) === null || i === void 0
          ? void 0
          : i.call(t)) !== null && s !== void 0
        ? s
        : [];
    if (((e = this.Ml) === null || e === void 0 ? void 0 : e.vl) === n)
      return this.Ml.pl;
    const r = this.Nr.$t().St(),
      o = n.map((l) => new ah(l, r));
    return (this.Ml = { vl: n, pl: o }), o;
  }
  Tn() {
    var t, i, s, e;
    const n =
      (s =
        (i = (t = this.yl).priceAxisViews) === null || i === void 0
          ? void 0
          : i.call(t)) !== null && s !== void 0
        ? s
        : [];
    if (((e = this.xl) === null || e === void 0 ? void 0 : e.vl) === n)
      return this.xl.pl;
    const r = this.Nr.Dt(),
      o = n.map((l) => new uh(l, r));
    return (this.xl = { vl: n, pl: o }), o;
  }
  Tl() {
    var t, i, s, e;
    const n =
      (s =
        (i = (t = this.yl).priceAxisPaneViews) === null || i === void 0
          ? void 0
          : i.call(t)) !== null && s !== void 0
        ? s
        : [];
    if (((e = this.Sl) === null || e === void 0 ? void 0 : e.vl) === n)
      return this.Sl.pl;
    const r = n.map((o) => new At(o));
    return (this.Sl = { vl: n, pl: r }), r;
  }
  Pl() {
    var t, i, s, e;
    const n =
      (s =
        (i = (t = this.yl).timeAxisPaneViews) === null || i === void 0
          ? void 0
          : i.call(t)) !== null && s !== void 0
        ? s
        : [];
    if (((e = this.kl) === null || e === void 0 ? void 0 : e.vl) === n)
      return this.kl.pl;
    const r = n.map((o) => new At(o));
    return (this.kl = { vl: n, pl: r }), r;
  }
  Rl(t, i) {
    var s, e, n;
    return (n =
      (e = (s = this.yl).autoscaleInfo) === null || e === void 0
        ? void 0
        : e.call(s, t, i)) !== null && n !== void 0
      ? n
      : null;
  }
  pr(t, i) {
    var s, e, n;
    return (n =
      (e = (s = this.yl).hitTest) === null || e === void 0
        ? void 0
        : e.call(s, t, i)) !== null && n !== void 0
      ? n
      : null;
  }
}
function $t(h, t, i, s) {
  h.forEach((e) => {
    t(e).forEach((n) => {
      n.ml() === i && s.push(n);
    });
  });
}
function Ft(h) {
  return h.Cn();
}
function dh(h) {
  return h.Tl();
}
function fh(h) {
  return h.Pl();
}
class vi extends hh {
  constructor(t, i, s, e, n) {
    super(t),
      (this.zt = new oh()),
      (this.zh = new Ge(this)),
      (this.Dl = []),
      (this.Ol = new He(this)),
      (this.Al = null),
      (this.Vl = null),
      (this.Bl = []),
      (this.Il = []),
      (this.zl = null),
      (this.Ll = []),
      (this._n = i),
      (this.El = s);
    const r = new th(this);
    (this.en = [r]),
      (this.Lh = new Ls(r, this, t)),
      (s !== "Area" && s !== "Line" && s !== "Baseline") ||
        (this.Al = new Ze(this)),
      this.Nl(),
      this.Fl(n);
  }
  S() {
    this.zl !== null && clearTimeout(this.zl);
  }
  oh(t) {
    return this._n.priceLineColor || t;
  }
  Ur(t) {
    const i = { qr: !0 },
      s = this.Dt();
    if (this.$t().St().Ei() || s.Ei() || this.zt.Ei()) return i;
    const e = this.$t().St().qs(),
      n = this.Ct();
    if (e === null || n === null) return i;
    let r, o;
    if (t) {
      const c = this.zt.Gh();
      if (c === null) return i;
      (r = c), (o = c.ie);
    } else {
      const c = this.zt.il(e.ui(), -1);
      if (c === null || ((r = this.zt.Uh(c.ie)), r === null)) return i;
      o = c.ie;
    }
    const l = r.Ot[3],
      a = this.js().Ws(o, { Ot: r }),
      u = s.Rt(l, n.Ot);
    return {
      qr: !1,
      _t: l,
      Zt: s.Ni(l, n.Ot),
      ph: s.Wl(l),
      mh: s.jl(l, n.Ot),
      O: a.oe,
      Si: u,
      ie: o,
    };
  }
  js() {
    return this.Vl !== null || (this.Vl = new rh(this)), this.Vl;
  }
  W() {
    return this._n;
  }
  Eh(t) {
    const i = t.priceScaleId;
    i !== void 0 && i !== this._n.priceScaleId && this.$t().Hl(this, i),
      R(this._n, t),
      t.priceFormat !== void 0 && (this.Nl(), this.$t().$l()),
      this.$t().Ul(this),
      this.$t().ql(),
      this.mn.bt("options");
  }
  J(t, i) {
    this.zt.J(t),
      this.Yl(),
      this.mn.bt("data"),
      this.un.bt("data"),
      this.Al !== null &&
        (i && i.Xl ? this.Al.Wr() : t.length === 0 && this.Al.Fr());
    const s = this.$t()._r(this);
    this.$t().Kl(s), this.$t().Ul(this), this.$t().ql(), this.$t().Nh();
  }
  Zl(t) {
    (this.Bl = t), this.Yl();
    const i = this.$t()._r(this);
    this.un.bt("data"),
      this.$t().Kl(i),
      this.$t().Ul(this),
      this.$t().ql(),
      this.$t().Nh();
  }
  Gl() {
    return this.Bl;
  }
  lh() {
    return this.Il;
  }
  Jl(t) {
    const i = new eh(this, t);
    return this.Dl.push(i), this.$t().Ul(this), i;
  }
  Ql(t) {
    const i = this.Dl.indexOf(t);
    i !== -1 && this.Dl.splice(i, 1), this.$t().Ul(this);
  }
  Yh() {
    return this.El;
  }
  Ct() {
    const t = this.ta();
    return t === null ? null : { Ot: t.Ot[3], ia: t.ot };
  }
  ta() {
    const t = this.$t().St().qs();
    if (t === null) return null;
    const i = t.Rs();
    return this.zt.il(i, 1);
  }
  Vn() {
    return this.zt;
  }
  ah(t) {
    const i = this.zt.Uh(t);
    return i === null
      ? null
      : this.El === "Bar" || this.El === "Candlestick" || this.El === "Custom"
      ? { me: i.Ot[0], be: i.Ot[1], we: i.Ot[2], ge: i.Ot[3] }
      : i.Ot[3];
  }
  na(t) {
    const i = [];
    $t(this.Ll, Ft, "top", i);
    const s = this.Al;
    return (
      s !== null &&
        s.yt() &&
        (this.zl === null &&
          s.Hr() &&
          (this.zl = setTimeout(() => {
            (this.zl = null), this.$t().sa();
          }, 0)),
        s.jr(),
        i.push(s)),
      i
    );
  }
  Cn() {
    const t = [];
    this.ea() || t.push(this.Ol), t.push(this.mn, this.zh, this.un);
    const i = this.Dl.map((s) => s.Fh());
    return t.push(...i), $t(this.Ll, Ft, "normal", t), t;
  }
  ra() {
    return this.ha(Ft, "bottom");
  }
  la(t) {
    return this.ha(dh, t);
  }
  aa(t) {
    return this.ha(fh, t);
  }
  oa(t, i) {
    return this.Ll.map((s) => s.pr(t, i)).filter((s) => s !== null);
  }
  Gi(t) {
    return [this.Lh, ...this.Dl.map((i) => i.Wh())];
  }
  Tn(t, i) {
    if (i !== this.qi && !this.ea()) return [];
    const s = [...this.en];
    for (const e of this.Dl) s.push(e.jh());
    return (
      this.Ll.forEach((e) => {
        s.push(...e.Tn());
      }),
      s
    );
  }
  Ji() {
    const t = [];
    return (
      this.Ll.forEach((i) => {
        t.push(...i.Ji());
      }),
      t
    );
  }
  Rl(t, i) {
    if (this._n.autoscaleInfoProvider !== void 0) {
      const s = this._n.autoscaleInfoProvider(() => {
        const e = this._a(t, i);
        return e === null ? null : e.Th();
      });
      return xt.Ph(s);
    }
    return this._a(t, i);
  }
  ua() {
    return this._n.priceFormat.minMove;
  }
  ca() {
    return this.da;
  }
  Rn() {
    var t;
    this.mn.bt(), this.un.bt();
    for (const i of this.en) i.bt();
    for (const i of this.Dl) i.bt();
    this.zh.bt(),
      this.Ol.bt(),
      (t = this.Al) === null || t === void 0 || t.bt(),
      this.Ll.forEach((i) => i.Rn());
  }
  Dt() {
    return p(super.Dt());
  }
  kt(t) {
    if (
      !(
        (this.El === "Line" || this.El === "Area" || this.El === "Baseline") &&
        this._n.crosshairMarkerVisible
      )
    )
      return null;
    const i = this.zt.Uh(t);
    return i === null
      ? null
      : {
          _t: i.Ot[3],
          ht: this.fa(),
          At: this.va(),
          Pt: this.pa(),
          Tt: this.ma(t),
        };
  }
  _h() {
    return this._n.title;
  }
  yt() {
    return this._n.visible;
  }
  ba(t) {
    this.Ll.push(new ch(t, this));
  }
  wa(t) {
    this.Ll = this.Ll.filter((i) => i.Cl() !== t);
  }
  ga() {
    if (this.mn instanceof Vt) return (t) => this.mn.Ee(t);
  }
  Ma() {
    if (this.mn instanceof Vt) return (t) => this.mn.Ne(t);
  }
  ea() {
    return !kt(this.Dt().xa());
  }
  _a(t, i) {
    if (!rt(t) || !rt(i) || this.zt.Ei()) return null;
    const s =
        this.El === "Line" ||
        this.El === "Area" ||
        this.El === "Baseline" ||
        this.El === "Histogram"
          ? [3]
          : [2, 1],
      e = this.zt.sl(t, i, s);
    let n = e !== null ? new T(e.ul, e.cl) : null;
    if (this.Yh() === "Histogram") {
      const o = this._n.base,
        l = new T(o, o);
      n = n !== null ? n.Jn(l) : l;
    }
    let r = this.un.hh();
    return (
      this.Ll.forEach((o) => {
        const l = o.Rl(t, i);
        if (l != null && l.priceRange) {
          const f = new T(l.priceRange.minValue, l.priceRange.maxValue);
          n = n !== null ? n.Jn(f) : f;
        }
        var a, u, c, d;
        l != null &&
          l.margins &&
          ((a = r),
          (u = l.margins),
          (r = {
            above: Math.max(
              (c = a == null ? void 0 : a.above) !== null && c !== void 0
                ? c
                : 0,
              u.above
            ),
            below: Math.max(
              (d = a == null ? void 0 : a.below) !== null && d !== void 0
                ? d
                : 0,
              u.below
            ),
          }));
      }),
      new xt(n, r)
    );
  }
  fa() {
    switch (this.El) {
      case "Line":
      case "Area":
      case "Baseline":
        return this._n.crosshairMarkerRadius;
    }
    return 0;
  }
  va() {
    switch (this.El) {
      case "Line":
      case "Area":
      case "Baseline": {
        const t = this._n.crosshairMarkerBorderColor;
        if (t.length !== 0) return t;
      }
    }
    return null;
  }
  pa() {
    switch (this.El) {
      case "Line":
      case "Area":
      case "Baseline":
        return this._n.crosshairMarkerBorderWidth;
    }
    return 0;
  }
  ma(t) {
    switch (this.El) {
      case "Line":
      case "Area":
      case "Baseline": {
        const i = this._n.crosshairMarkerBackgroundColor;
        if (i.length !== 0) return i;
      }
    }
    return this.js().Ws(t).oe;
  }
  Nl() {
    switch (this._n.priceFormat.type) {
      case "custom":
        this.da = { format: this._n.priceFormat.formatter };
        break;
      case "volume":
        this.da = new _e(this._n.priceFormat.precision);
        break;
      case "percent":
        this.da = new zs(this._n.priceFormat.precision);
        break;
      default: {
        const t = Math.pow(10, this._n.priceFormat.precision);
        this.da = new Nt(t, this._n.priceFormat.minMove * t);
      }
    }
    this.qi !== null && this.qi.Sa();
  }
  Yl() {
    const t = this.$t().St();
    if (!t.ka() || this.zt.Ei()) return void (this.Il = []);
    const i = p(this.zt.Jh());
    this.Il = this.Bl.map((s, e) => {
      const n = p(t.ya(s.time, !0)),
        r = n < i ? 1 : -1;
      return {
        time: p(this.zt.il(n, r)).ie,
        position: s.position,
        shape: s.shape,
        color: s.color,
        id: s.id,
        Gr: e,
        text: s.text,
        size: s.size,
        originalTime: s.originalTime,
      };
    });
  }
  Fl(t) {
    switch (((this.un = new Ke(this, this.$t())), this.El)) {
      case "Bar":
        this.mn = new Te(this, this.$t());
        break;
      case "Candlestick":
        this.mn = new Le(this, this.$t());
        break;
      case "Line":
        this.mn = new Ve(this, this.$t());
        break;
      case "Custom":
        this.mn = new Vt(this, this.$t(), E(t));
        break;
      case "Area":
        this.mn = new Oe(this, this.$t());
        break;
      case "Baseline":
        this.mn = new Re(this, this.$t());
        break;
      case "Histogram":
        this.mn = new De(this, this.$t());
        break;
      default:
        throw Error("Unknown chart style assigned: " + this.El);
    }
  }
  ha(t, i) {
    const s = [];
    return $t(this.Ll, t, i, s), s;
  }
}
class mh {
  constructor(t) {
    this._n = t;
  }
  Ca(t, i, s) {
    let e = t;
    if (this._n.mode === 0) return e;
    const n = s.dn(),
      r = n.Ct();
    if (r === null) return e;
    const o = n.Rt(t, r),
      l = s
        .Ta()
        .filter((u) => u instanceof vi)
        .reduce((u, c) => {
          if (s.ur(c) || !c.yt()) return u;
          const d = c.Dt(),
            f = c.Vn();
          if (d.Ei() || !f.Yr(i)) return u;
          const m = f.Uh(i);
          if (m === null) return u;
          const v = X(c.Ct());
          return u.concat([d.Rt(m.Ot[3], v.Ot)]);
        }, []);
    if (l.length === 0) return e;
    l.sort((u, c) => Math.abs(u - o) - Math.abs(c - o));
    const a = l[0];
    return (e = n.fn(a, r)), e;
  }
}
class vh extends B {
  constructor() {
    super(...arguments), (this.zt = null);
  }
  J(t) {
    this.zt = t;
  }
  Z({
    context: t,
    bitmapSize: i,
    horizontalPixelRatio: s,
    verticalPixelRatio: e,
  }) {
    if (this.zt === null) return;
    const n = Math.max(1, Math.floor(s));
    (t.lineWidth = n),
      (function (r, o) {
        r.save(), r.lineWidth % 2 && r.translate(0.5, 0.5), o(), r.restore();
      })(t, () => {
        const r = p(this.zt);
        if (r.Pa) {
          (t.strokeStyle = r.Ra), j(t, r.Da), t.beginPath();
          for (const o of r.Oa) {
            const l = Math.round(o.Aa * s);
            t.moveTo(l, -n), t.lineTo(l, i.height + n);
          }
          t.stroke();
        }
        if (r.Va) {
          (t.strokeStyle = r.Ba), j(t, r.Ia), t.beginPath();
          for (const o of r.za) {
            const l = Math.round(o.Aa * e);
            t.moveTo(-n, l), t.lineTo(i.width + n, l);
          }
          t.stroke();
        }
      });
  }
}
class ph {
  constructor(t) {
    (this.Wt = new vh()), (this.ft = !0), (this.Qi = t);
  }
  bt() {
    this.ft = !0;
  }
  gt() {
    if (this.ft) {
      const t = this.Qi.$t().W().grid,
        i = {
          Va: t.horzLines.visible,
          Pa: t.vertLines.visible,
          Ba: t.horzLines.color,
          Ra: t.vertLines.color,
          Ia: t.horzLines.style,
          Da: t.vertLines.style,
          za: this.Qi.dn().La(),
          Oa: (this.Qi.$t().St().La() || []).map((s) => ({ Aa: s.coord })),
        };
      this.Wt.J(i), (this.ft = !1);
    }
    return this.Wt;
  }
}
class bh {
  constructor(t) {
    this.mn = new ph(t);
  }
  Fh() {
    return this.mn;
  }
}
const Ht = { Ea: 4, Na: 1e-4 };
function q(h, t) {
  const i = (100 * (h - t)) / t;
  return t < 0 ? -i : i;
}
function gh(h, t) {
  const i = q(h.xh(), t),
    s = q(h.Sh(), t);
  return new T(i, s);
}
function et(h, t) {
  const i = (100 * (h - t)) / t + 100;
  return t < 0 ? -i : i;
}
function wh(h, t) {
  const i = et(h.xh(), t),
    s = et(h.Sh(), t);
  return new T(i, s);
}
function Ct(h, t) {
  const i = Math.abs(h);
  if (i < 1e-15) return 0;
  const s = Math.log10(i + t.Na) + t.Ea;
  return h < 0 ? -s : s;
}
function ht(h, t) {
  const i = Math.abs(h);
  if (i < 1e-15) return 0;
  const s = Math.pow(10, i - t.Ea) - t.Na;
  return h < 0 ? -s : s;
}
function it(h, t) {
  if (h === null) return null;
  const i = Ct(h.xh(), t),
    s = Ct(h.Sh(), t);
  return new T(i, s);
}
function pt(h, t) {
  if (h === null) return null;
  const i = ht(h.xh(), t),
    s = ht(h.Sh(), t);
  return new T(i, s);
}
function jt(h) {
  if (h === null) return Ht;
  const t = Math.abs(h.Sh() - h.xh());
  if (t >= 1 || t < 1e-15) return Ht;
  const i = Math.ceil(Math.abs(Math.log10(t))),
    s = Ht.Ea + i;
  return { Ea: s, Na: 1 / Math.pow(10, s) };
}
class Ut {
  constructor(t, i) {
    if (
      ((this.Fa = t),
      (this.Wa = i),
      (function (s) {
        if (s < 0) return !1;
        for (let e = s; e > 1; e /= 10) if (e % 10 != 0) return !1;
        return !0;
      })(this.Fa))
    )
      this.ja = [2, 2.5, 2];
    else {
      this.ja = [];
      for (let s = this.Fa; s !== 1; ) {
        if (s % 2 == 0) this.ja.push(2), (s /= 2);
        else {
          if (s % 5 != 0) throw new Error("unexpected base");
          this.ja.push(2, 2.5), (s /= 5);
        }
        if (this.ja.length > 100) throw new Error("something wrong with base");
      }
    }
  }
  Ha(t, i, s) {
    const e = this.Fa === 0 ? 0 : 1 / this.Fa;
    let n = Math.pow(10, Math.max(0, Math.ceil(Math.log10(t - i)))),
      r = 0,
      o = this.Wa[0];
    for (;;) {
      const c = mt(n, e, 1e-14) && n > e + 1e-14,
        d = mt(n, s * o, 1e-14),
        f = mt(n, 1, 1e-14);
      if (!(c && d && f)) break;
      (n /= o), (o = this.Wa[++r % this.Wa.length]);
    }
    if (
      (n <= e + 1e-14 && (n = e),
      (n = Math.max(1, n)),
      this.ja.length > 0 &&
        ((l = n), (a = 1), (u = 1e-14), Math.abs(l - a) < u))
    )
      for (r = 0, o = this.ja[0]; mt(n, s * o, 1e-14) && n > e + 1e-14; )
        (n /= o), (o = this.ja[++r % this.ja.length]);
    var l, a, u;
    return n;
  }
}
class Fi {
  constructor(t, i, s, e) {
    (this.$a = []), (this.zi = t), (this.Fa = i), (this.Ua = s), (this.qa = e);
  }
  Ha(t, i) {
    if (t < i) throw new Error("high < low");
    const s = this.zi.Bt(),
      e = ((t - i) * this.Ya()) / s,
      n = new Ut(this.Fa, [2, 2.5, 2]),
      r = new Ut(this.Fa, [2, 2, 2.5]),
      o = new Ut(this.Fa, [2.5, 2, 2]),
      l = [];
    return (
      l.push(n.Ha(t, i, e), r.Ha(t, i, e), o.Ha(t, i, e)),
      (function (a) {
        if (a.length < 1) throw Error("array is empty");
        let u = a[0];
        for (let c = 1; c < a.length; ++c) a[c] < u && (u = a[c]);
        return u;
      })(l)
    );
  }
  Xa() {
    const t = this.zi,
      i = t.Ct();
    if (i === null) return void (this.$a = []);
    const s = t.Bt(),
      e = this.Ua(s - 1, i),
      n = this.Ua(0, i),
      r = this.zi.W().entireTextOnly ? this.Ka() / 2 : 0,
      o = r,
      l = s - 1 - r,
      a = Math.max(e, n),
      u = Math.min(e, n);
    if (a === u) return void (this.$a = []);
    let c = this.Ha(a, u),
      d = a % c;
    d += d < 0 ? c : 0;
    const f = a >= u ? 1 : -1;
    let m = null,
      v = 0;
    for (let b = a - d; b > u; b -= c) {
      const g = this.qa(b, i, !0);
      (m !== null && Math.abs(g - m) < this.Ya()) ||
        g < o ||
        g > l ||
        (v < this.$a.length
          ? ((this.$a[v].Aa = g), (this.$a[v].Za = t.Ga(b)))
          : this.$a.push({ Aa: g, Za: t.Ga(b) }),
        v++,
        (m = g),
        t.Ja() && (c = this.Ha(b * f, u)));
    }
    this.$a.length = v;
  }
  La() {
    return this.$a;
  }
  Ka() {
    return this.zi.P();
  }
  Ya() {
    return Math.ceil(2.5 * this.Ka());
  }
}
function Ds(h) {
  return h.slice().sort((t, i) => p(t.Xi()) - p(i.Xi()));
}
var Hi;
(function (h) {
  (h[(h.Normal = 0)] = "Normal"),
    (h[(h.Logarithmic = 1)] = "Logarithmic"),
    (h[(h.Percentage = 2)] = "Percentage"),
    (h[(h.IndexedTo100 = 3)] = "IndexedTo100");
})(Hi || (Hi = {}));
const ji = new zs(),
  Ui = new Nt(100, 1);
class _h {
  constructor(t, i, s, e) {
    (this.Qa = 0),
      (this.io = null),
      (this.Rh = null),
      (this.no = null),
      (this.so = { eo: !1, ro: null }),
      (this.ho = 0),
      (this.lo = 0),
      (this.ao = new M()),
      (this.oo = new M()),
      (this._o = []),
      (this.uo = null),
      (this.co = null),
      (this.do = null),
      (this.fo = null),
      (this.da = Ui),
      (this.vo = jt(null)),
      (this.po = t),
      (this._n = i),
      (this.mo = s),
      (this.bo = e),
      (this.wo = new Fi(this, 100, this.Mo.bind(this), this.xo.bind(this)));
  }
  xa() {
    return this.po;
  }
  W() {
    return this._n;
  }
  Eh(t) {
    if (
      (R(this._n, t),
      this.Sa(),
      t.mode !== void 0 && this.So({ Sr: t.mode }),
      t.scaleMargins !== void 0)
    ) {
      const i = E(t.scaleMargins.top),
        s = E(t.scaleMargins.bottom);
      if (i < 0 || i > 1)
        throw new Error(
          `Invalid top margin - expect value between 0 and 1, given=${i}`
        );
      if (s < 0 || s > 1)
        throw new Error(
          `Invalid bottom margin - expect value between 0 and 1, given=${s}`
        );
      if (i + s > 1)
        throw new Error(
          `Invalid margins - sum of margins must be less than 1, given=${i + s}`
        );
      this.ko(), (this.co = null);
    }
  }
  yo() {
    return this._n.autoScale;
  }
  Ja() {
    return this._n.mode === 1;
  }
  fh() {
    return this._n.mode === 2;
  }
  Co() {
    return this._n.mode === 3;
  }
  Sr() {
    return { Nn: this._n.autoScale, To: this._n.invertScale, Sr: this._n.mode };
  }
  So(t) {
    const i = this.Sr();
    let s = null;
    t.Nn !== void 0 && (this._n.autoScale = t.Nn),
      t.Sr !== void 0 &&
        ((this._n.mode = t.Sr),
        (t.Sr !== 2 && t.Sr !== 3) || (this._n.autoScale = !0),
        (this.so.eo = !1)),
      i.Sr === 1 &&
        t.Sr !== i.Sr &&
        ((function (n, r) {
          if (n === null) return !1;
          const o = ht(n.xh(), r),
            l = ht(n.Sh(), r);
          return isFinite(o) && isFinite(l);
        })(this.Rh, this.vo)
          ? ((s = pt(this.Rh, this.vo)), s !== null && this.Po(s))
          : (this._n.autoScale = !0)),
      t.Sr === 1 &&
        t.Sr !== i.Sr &&
        ((s = it(this.Rh, this.vo)), s !== null && this.Po(s));
    const e = i.Sr !== this._n.mode;
    e && (i.Sr === 2 || this.fh()) && this.Sa(),
      e && (i.Sr === 3 || this.Co()) && this.Sa(),
      t.To !== void 0 &&
        i.To !== t.To &&
        ((this._n.invertScale = t.To), this.Ro()),
      this.oo.m(i, this.Sr());
  }
  Do() {
    return this.oo;
  }
  P() {
    return this.mo.fontSize;
  }
  Bt() {
    return this.Qa;
  }
  Oo(t) {
    this.Qa !== t && ((this.Qa = t), this.ko(), (this.co = null));
  }
  Ao() {
    if (this.io) return this.io;
    const t = this.Bt() - this.Vo() - this.Bo();
    return (this.io = t), t;
  }
  Oh() {
    return this.Io(), this.Rh;
  }
  Po(t, i) {
    const s = this.Rh;
    (i || (s === null && t !== null) || (s !== null && !s.gh(t))) &&
      ((this.co = null), (this.Rh = t));
  }
  Ei() {
    return this.Io(), this.Qa === 0 || !this.Rh || this.Rh.Ei();
  }
  zo(t) {
    return this.To() ? t : this.Bt() - 1 - t;
  }
  Rt(t, i) {
    return (
      this.fh() ? (t = q(t, i)) : this.Co() && (t = et(t, i)), this.xo(t, i)
    );
  }
  Gs(t, i, s) {
    this.Io();
    const e = this.Bo(),
      n = p(this.Oh()),
      r = n.xh(),
      o = n.Sh(),
      l = this.Ao() - 1,
      a = this.To(),
      u = l / (o - r),
      c = s === void 0 ? 0 : s.from,
      d = s === void 0 ? t.length : s.to,
      f = this.Lo();
    for (let m = c; m < d; m++) {
      const v = t[m],
        b = v._t;
      if (isNaN(b)) continue;
      let g = b;
      f !== null && (g = f(v._t, i));
      const w = e + u * (g - r),
        y = a ? w : this.Qa - 1 - w;
      v.st = y;
    }
  }
  ve(t, i, s) {
    this.Io();
    const e = this.Bo(),
      n = p(this.Oh()),
      r = n.xh(),
      o = n.Sh(),
      l = this.Ao() - 1,
      a = this.To(),
      u = l / (o - r),
      c = s === void 0 ? 0 : s.from,
      d = s === void 0 ? t.length : s.to,
      f = this.Lo();
    for (let m = c; m < d; m++) {
      const v = t[m];
      let b = v.me,
        g = v.be,
        w = v.we,
        y = v.ge;
      f !== null &&
        ((b = f(v.me, i)),
        (g = f(v.be, i)),
        (w = f(v.we, i)),
        (y = f(v.ge, i)));
      let _ = e + u * (b - r),
        z = a ? _ : this.Qa - 1 - _;
      (v.de = z),
        (_ = e + u * (g - r)),
        (z = a ? _ : this.Qa - 1 - _),
        (v._e = z),
        (_ = e + u * (w - r)),
        (z = a ? _ : this.Qa - 1 - _),
        (v.ue = z),
        (_ = e + u * (y - r)),
        (z = a ? _ : this.Qa - 1 - _),
        (v.fe = z);
    }
  }
  fn(t, i) {
    const s = this.Mo(t, i);
    return this.Eo(s, i);
  }
  Eo(t, i) {
    let s = t;
    return (
      this.fh()
        ? (s = (function (e, n) {
            return n < 0 && (e = -e), (e / 100) * n + n;
          })(s, i))
        : this.Co() &&
          (s = (function (e, n) {
            return (e -= 100), n < 0 && (e = -e), (e / 100) * n + n;
          })(s, i)),
      s
    );
  }
  Ta() {
    return this._o;
  }
  No() {
    if (this.uo) return this.uo;
    let t = [];
    for (let i = 0; i < this._o.length; i++) {
      const s = this._o[i];
      s.Xi() === null && s.Ki(i + 1), t.push(s);
    }
    return (t = Ds(t)), (this.uo = t), this.uo;
  }
  Fo(t) {
    this._o.indexOf(t) === -1 && (this._o.push(t), this.Sa(), this.Wo());
  }
  jo(t) {
    const i = this._o.indexOf(t);
    if (i === -1) throw new Error("source is not attached to scale");
    this._o.splice(i, 1),
      this._o.length === 0 && (this.So({ Nn: !0 }), this.Po(null)),
      this.Sa(),
      this.Wo();
  }
  Ct() {
    let t = null;
    for (const i of this._o) {
      const s = i.Ct();
      s !== null && (t === null || s.ia < t.ia) && (t = s);
    }
    return t === null ? null : t.Ot;
  }
  To() {
    return this._n.invertScale;
  }
  La() {
    const t = this.Ct() === null;
    if (this.co !== null && (t || this.co.Ho === t)) return this.co.La;
    this.wo.Xa();
    const i = this.wo.La();
    return (this.co = { La: i, Ho: t }), this.ao.m(), i;
  }
  $o() {
    return this.ao;
  }
  Uo(t) {
    this.fh() ||
      this.Co() ||
      (this.do === null &&
        this.no === null &&
        (this.Ei() ||
          ((this.do = this.Qa - t), (this.no = p(this.Oh()).Mh()))));
  }
  qo(t) {
    if (this.fh() || this.Co() || this.do === null) return;
    this.So({ Nn: !1 }), (t = this.Qa - t) < 0 && (t = 0);
    let i = (this.do + 0.2 * (this.Qa - 1)) / (t + 0.2 * (this.Qa - 1));
    const s = p(this.no).Mh();
    (i = Math.max(i, 0.1)), s.yh(i), this.Po(s);
  }
  Yo() {
    this.fh() || this.Co() || ((this.do = null), (this.no = null));
  }
  Xo(t) {
    this.yo() ||
      (this.fo === null &&
        this.no === null &&
        (this.Ei() || ((this.fo = t), (this.no = p(this.Oh()).Mh()))));
  }
  Ko(t) {
    if (this.yo() || this.fo === null) return;
    const i = p(this.Oh()).kh() / (this.Ao() - 1);
    let s = t - this.fo;
    this.To() && (s *= -1);
    const e = s * i,
      n = p(this.no).Mh();
    n.Ch(e), this.Po(n, !0), (this.co = null);
  }
  Zo() {
    this.yo() || (this.fo !== null && ((this.fo = null), (this.no = null)));
  }
  ca() {
    return this.da || this.Sa(), this.da;
  }
  Ni(t, i) {
    switch (this._n.mode) {
      case 2:
        return this.Go(q(t, i));
      case 3:
        return this.ca().format(et(t, i));
      default:
        return this.Ih(t);
    }
  }
  Ga(t) {
    switch (this._n.mode) {
      case 2:
        return this.Go(t);
      case 3:
        return this.ca().format(t);
      default:
        return this.Ih(t);
    }
  }
  Wl(t) {
    return this.Ih(t, p(this.Jo()).ca());
  }
  jl(t, i) {
    return (t = q(t, i)), this.Go(t, ji);
  }
  Qo() {
    return this._o;
  }
  t_(t) {
    this.so = { ro: t, eo: !1 };
  }
  Rn() {
    this._o.forEach((t) => t.Rn());
  }
  Sa() {
    this.co = null;
    const t = this.Jo();
    let i = 100;
    t !== null && (i = Math.round(1 / t.ua())),
      (this.da = Ui),
      this.fh()
        ? ((this.da = ji), (i = 100))
        : this.Co()
        ? ((this.da = new Nt(100, 1)), (i = 100))
        : t !== null && (this.da = t.ca()),
      (this.wo = new Fi(this, i, this.Mo.bind(this), this.xo.bind(this))),
      this.wo.Xa();
  }
  Wo() {
    this.uo = null;
  }
  Jo() {
    return this._o[0] || null;
  }
  Vo() {
    return this.To()
      ? this._n.scaleMargins.bottom * this.Bt() + this.lo
      : this._n.scaleMargins.top * this.Bt() + this.ho;
  }
  Bo() {
    return this.To()
      ? this._n.scaleMargins.top * this.Bt() + this.ho
      : this._n.scaleMargins.bottom * this.Bt() + this.lo;
  }
  Io() {
    this.so.eo || ((this.so.eo = !0), this.i_());
  }
  ko() {
    this.io = null;
  }
  xo(t, i) {
    if ((this.Io(), this.Ei())) return 0;
    t = this.Ja() && t ? Ct(t, this.vo) : t;
    const s = p(this.Oh()),
      e = this.Bo() + ((this.Ao() - 1) * (t - s.xh())) / s.kh();
    return this.zo(e);
  }
  Mo(t, i) {
    if ((this.Io(), this.Ei())) return 0;
    const s = this.zo(t),
      e = p(this.Oh()),
      n = e.xh() + e.kh() * ((s - this.Bo()) / (this.Ao() - 1));
    return this.Ja() ? ht(n, this.vo) : n;
  }
  Ro() {
    (this.co = null), this.wo.Xa();
  }
  i_() {
    const t = this.so.ro;
    if (t === null) return;
    let i = null;
    const s = this.Qo();
    let e = 0,
      n = 0;
    for (const l of s) {
      if (!l.yt()) continue;
      const a = l.Ct();
      if (a === null) continue;
      const u = l.Rl(t.Rs(), t.ui());
      let c = u && u.Oh();
      if (c !== null) {
        switch (this._n.mode) {
          case 1:
            c = it(c, this.vo);
            break;
          case 2:
            c = gh(c, a.Ot);
            break;
          case 3:
            c = wh(c, a.Ot);
        }
        if (((i = i === null ? c : i.Jn(p(c))), u !== null)) {
          const d = u.Ah();
          d !== null &&
            ((e = Math.max(e, d.above)), (n = Math.max(e, d.below)));
        }
      }
    }
    if (
      ((e === this.ho && n === this.lo) ||
        ((this.ho = e), (this.lo = n), (this.co = null), this.ko()),
      i !== null)
    ) {
      if (i.xh() === i.Sh()) {
        const l = this.Jo(),
          a = 5 * (l === null || this.fh() || this.Co() ? 1 : l.ua());
        this.Ja() && (i = pt(i, this.vo)),
          (i = new T(i.xh() - a, i.Sh() + a)),
          this.Ja() && (i = it(i, this.vo));
      }
      if (this.Ja()) {
        const l = pt(i, this.vo),
          a = jt(l);
        if (((r = a), (o = this.vo), r.Ea !== o.Ea || r.Na !== o.Na)) {
          const u = this.no !== null ? pt(this.no, this.vo) : null;
          (this.vo = a), (i = it(l, a)), u !== null && (this.no = it(u, a));
        }
      }
      this.Po(i);
    } else
      this.Rh === null && (this.Po(new T(-0.5, 0.5)), (this.vo = jt(null)));
    var r, o;
    this.so.eo = !0;
  }
  Lo() {
    return this.fh()
      ? q
      : this.Co()
      ? et
      : this.Ja()
      ? (t) => Ct(t, this.vo)
      : null;
  }
  n_(t, i, s) {
    return i === void 0 ? (s === void 0 && (s = this.ca()), s.format(t)) : i(t);
  }
  Ih(t, i) {
    return this.n_(t, this.bo.priceFormatter, i);
  }
  Go(t, i) {
    return this.n_(t, this.bo.percentageFormatter, i);
  }
}
class Sh {
  constructor(t, i) {
    (this._o = []),
      (this.s_ = new Map()),
      (this.Qa = 0),
      (this.e_ = 0),
      (this.r_ = 1e3),
      (this.uo = null),
      (this.h_ = new M()),
      (this.wl = t),
      (this.Hi = i),
      (this.l_ = new bh(this));
    const s = i.W();
    (this.a_ = this.o_("left", s.leftPriceScale)),
      (this.__ = this.o_("right", s.rightPriceScale)),
      this.a_.Do().l(this.u_.bind(this, this.a_), this),
      this.__.Do().l(this.u_.bind(this, this.__), this),
      this.c_(s);
  }
  c_(t) {
    if (
      (t.leftPriceScale && this.a_.Eh(t.leftPriceScale),
      t.rightPriceScale && this.__.Eh(t.rightPriceScale),
      t.localization && (this.a_.Sa(), this.__.Sa()),
      t.overlayPriceScales)
    ) {
      const i = Array.from(this.s_.values());
      for (const s of i) {
        const e = p(s[0].Dt());
        e.Eh(t.overlayPriceScales), t.localization && e.Sa();
      }
    }
  }
  d_(t) {
    switch (t) {
      case "left":
        return this.a_;
      case "right":
        return this.__;
    }
    return this.s_.has(t) ? E(this.s_.get(t))[0].Dt() : null;
  }
  S() {
    this.$t().f_().p(this),
      this.a_.Do().p(this),
      this.__.Do().p(this),
      this._o.forEach((t) => {
        t.S && t.S();
      }),
      this.h_.m();
  }
  v_() {
    return this.r_;
  }
  p_(t) {
    this.r_ = t;
  }
  $t() {
    return this.Hi;
  }
  ji() {
    return this.e_;
  }
  Bt() {
    return this.Qa;
  }
  m_(t) {
    (this.e_ = t), this.b_();
  }
  Oo(t) {
    (this.Qa = t),
      this.a_.Oo(t),
      this.__.Oo(t),
      this._o.forEach((i) => {
        if (this.ur(i)) {
          const s = i.Dt();
          s !== null && s.Oo(t);
        }
      }),
      this.b_();
  }
  Ta() {
    return this._o;
  }
  ur(t) {
    const i = t.Dt();
    return i === null || (this.a_ !== i && this.__ !== i);
  }
  Fo(t, i, s) {
    const e = s !== void 0 ? s : this.g_().w_ + 1;
    this.M_(t, i, e);
  }
  jo(t) {
    const i = this._o.indexOf(t);
    A(i !== -1, "removeDataSource: invalid data source"), this._o.splice(i, 1);
    const s = p(t.Dt()).xa();
    if (this.s_.has(s)) {
      const n = E(this.s_.get(s)),
        r = n.indexOf(t);
      r !== -1 && (n.splice(r, 1), n.length === 0 && this.s_.delete(s));
    }
    const e = t.Dt();
    e && e.Ta().indexOf(t) >= 0 && e.jo(t),
      e !== null && (e.Wo(), this.x_(e)),
      (this.uo = null);
  }
  dr(t) {
    return t === this.a_ ? "left" : t === this.__ ? "right" : "overlay";
  }
  S_() {
    return this.a_;
  }
  k_() {
    return this.__;
  }
  y_(t, i) {
    t.Uo(i);
  }
  C_(t, i) {
    t.qo(i), this.b_();
  }
  T_(t) {
    t.Yo();
  }
  P_(t, i) {
    t.Xo(i);
  }
  R_(t, i) {
    t.Ko(i), this.b_();
  }
  D_(t) {
    t.Zo();
  }
  b_() {
    this._o.forEach((t) => {
      t.Rn();
    });
  }
  dn() {
    let t = null;
    return (
      this.Hi.W().rightPriceScale.visible && this.__.Ta().length !== 0
        ? (t = this.__)
        : this.Hi.W().leftPriceScale.visible && this.a_.Ta().length !== 0
        ? (t = this.a_)
        : this._o.length !== 0 && (t = this._o[0].Dt()),
      t === null && (t = this.__),
      t
    );
  }
  cr() {
    let t = null;
    return (
      this.Hi.W().rightPriceScale.visible
        ? (t = this.__)
        : this.Hi.W().leftPriceScale.visible && (t = this.a_),
      t
    );
  }
  x_(t) {
    t !== null && t.yo() && this.O_(t);
  }
  A_(t) {
    const i = this.wl.qs();
    t.So({ Nn: !0 }), i !== null && t.t_(i), this.b_();
  }
  V_() {
    this.O_(this.a_), this.O_(this.__);
  }
  B_() {
    this.x_(this.a_),
      this.x_(this.__),
      this._o.forEach((t) => {
        this.ur(t) && this.x_(t.Dt());
      }),
      this.b_(),
      this.Hi.Nh();
  }
  No() {
    return this.uo === null && (this.uo = Ds(this._o)), this.uo;
  }
  I_() {
    return this.h_;
  }
  z_() {
    return this.l_;
  }
  O_(t) {
    const i = t.Qo();
    if (i && i.length > 0 && !this.wl.Ei()) {
      const s = this.wl.qs();
      s !== null && t.t_(s);
    }
    t.Rn();
  }
  g_() {
    const t = this.No();
    if (t.length === 0) return { L_: 0, w_: 0 };
    let i = 0,
      s = 0;
    for (let e = 0; e < t.length; e++) {
      const n = t[e].Xi();
      n !== null && (n < i && (i = n), n > s && (s = n));
    }
    return { L_: i, w_: s };
  }
  M_(t, i, s) {
    let e = this.d_(i);
    if (
      (e === null && (e = this.o_(i, this.Hi.W().overlayPriceScales)),
      this._o.push(t),
      !kt(i))
    ) {
      const n = this.s_.get(i) || [];
      n.push(t), this.s_.set(i, n);
    }
    e.Fo(t), t.Zi(e), t.Ki(s), this.x_(e), (this.uo = null);
  }
  u_(t, i, s) {
    i.Sr !== s.Sr && this.O_(t);
  }
  o_(t, i) {
    const s = Object.assign({ visible: !0, autoScale: !0 }, W(i)),
      e = new _h(t, s, this.Hi.W().layout, this.Hi.W().localization);
    return e.Oo(this.Bt()), e;
  }
}
class yh {
  constructor(t, i, s = 50) {
    (this.Ye = 0),
      (this.Xe = 1),
      (this.Ke = 1),
      (this.Ge = new Map()),
      (this.Ze = new Map()),
      (this.E_ = t),
      (this.N_ = i),
      (this.Je = s);
  }
  F_(t) {
    const i = t.time,
      s = this.N_.cacheKey(i),
      e = this.Ge.get(s);
    if (e !== void 0) return e.W_;
    if (this.Ye === this.Je) {
      const r = this.Ze.get(this.Ke);
      this.Ze.delete(this.Ke), this.Ge.delete(E(r)), this.Ke++, this.Ye--;
    }
    const n = this.E_(t);
    return (
      this.Ge.set(s, { W_: n, nr: this.Xe }),
      this.Ze.set(this.Xe, s),
      this.Ye++,
      this.Xe++,
      n
    );
  }
}
class nt {
  constructor(t, i) {
    A(t <= i, "right should be >= left"), (this.j_ = t), (this.H_ = i);
  }
  Rs() {
    return this.j_;
  }
  ui() {
    return this.H_;
  }
  U_() {
    return this.H_ - this.j_ + 1;
  }
  Yr(t) {
    return this.j_ <= t && t <= this.H_;
  }
  gh(t) {
    return this.j_ === t.Rs() && this.H_ === t.ui();
  }
}
function Zi(h, t) {
  return h === null || t === null ? h === t : h.gh(t);
}
class Mh {
  constructor() {
    (this.q_ = new Map()), (this.Ge = null), (this.Y_ = !1);
  }
  X_(t) {
    (this.Y_ = t), (this.Ge = null);
  }
  K_(t, i) {
    this.Z_(i), (this.Ge = null);
    for (let s = i; s < t.length; ++s) {
      const e = t[s];
      let n = this.q_.get(e.timeWeight);
      n === void 0 && ((n = []), this.q_.set(e.timeWeight, n)),
        n.push({
          index: s,
          time: e.time,
          weight: e.timeWeight,
          originalTime: e.originalTime,
        });
    }
  }
  G_(t, i) {
    const s = Math.ceil(i / t);
    return (
      (this.Ge !== null && this.Ge.J_ === s) ||
        (this.Ge = { La: this.Q_(s), J_: s }),
      this.Ge.La
    );
  }
  Z_(t) {
    if (t === 0) return void this.q_.clear();
    const i = [];
    this.q_.forEach((s, e) => {
      t <= s[0].index
        ? i.push(e)
        : s.splice(
            ct(s, t, (n) => n.index < t),
            1 / 0
          );
    });
    for (const s of i) this.q_.delete(s);
  }
  Q_(t) {
    let i = [];
    for (const s of Array.from(this.q_.keys()).sort((e, n) => n - e)) {
      if (!this.q_.get(s)) continue;
      const e = i;
      i = [];
      const n = e.length;
      let r = 0;
      const o = E(this.q_.get(s)),
        l = o.length;
      let a = 1 / 0,
        u = -1 / 0;
      for (let c = 0; c < l; c++) {
        const d = o[c],
          f = d.index;
        for (; r < n; ) {
          const m = e[r],
            v = m.index;
          if (!(v < f)) {
            a = v;
            break;
          }
          r++, i.push(m), (u = v), (a = 1 / 0);
        }
        if (a - f >= t && f - u >= t) i.push(d), (u = f);
        else if (this.Y_) return e;
      }
      for (; r < n; r++) i.push(e[r]);
    }
    return i;
  }
}
class J {
  constructor(t) {
    this.tu = t;
  }
  iu() {
    return this.tu === null
      ? null
      : new nt(Math.floor(this.tu.Rs()), Math.ceil(this.tu.ui()));
  }
  nu() {
    return this.tu;
  }
  static su() {
    return new J(null);
  }
}
function zh(h, t) {
  return h.weight > t.weight ? h : t;
}
class xh {
  constructor(t, i, s, e) {
    (this.e_ = 0),
      (this.eu = null),
      (this.ru = []),
      (this.fo = null),
      (this.do = null),
      (this.hu = new Mh()),
      (this.lu = new Map()),
      (this.au = J.su()),
      (this.ou = !0),
      (this._u = new M()),
      (this.uu = new M()),
      (this.cu = new M()),
      (this.du = null),
      (this.fu = null),
      (this.vu = []),
      (this._n = i),
      (this.bo = s),
      (this.pu = i.rightOffset),
      (this.mu = i.barSpacing),
      (this.Hi = t),
      (this.N_ = e),
      this.bu(),
      this.hu.X_(i.uniformDistribution);
  }
  W() {
    return this._n;
  }
  wu(t) {
    R(this.bo, t), this.gu(), this.bu();
  }
  Eh(t, i) {
    var s;
    R(this._n, t),
      this._n.fixLeftEdge && this.Mu(),
      this._n.fixRightEdge && this.xu(),
      t.barSpacing !== void 0 && this.Hi.Kn(t.barSpacing),
      t.rightOffset !== void 0 && this.Hi.Zn(t.rightOffset),
      t.minBarSpacing !== void 0 &&
        this.Hi.Kn((s = t.barSpacing) !== null && s !== void 0 ? s : this.mu),
      this.gu(),
      this.bu(),
      this.cu.m();
  }
  vn(t) {
    var i, s;
    return (s = (i = this.ru[t]) === null || i === void 0 ? void 0 : i.time) !==
      null && s !== void 0
      ? s
      : null;
  }
  $i(t) {
    var i;
    return (i = this.ru[t]) !== null && i !== void 0 ? i : null;
  }
  ya(t, i) {
    if (this.ru.length < 1) return null;
    if (this.N_.key(t) > this.N_.key(this.ru[this.ru.length - 1].time))
      return i ? this.ru.length - 1 : null;
    const s = ct(this.ru, this.N_.key(t), (e, n) => this.N_.key(e.time) < n);
    return this.N_.key(t) < this.N_.key(this.ru[s].time) ? (i ? s : null) : s;
  }
  Ei() {
    return this.e_ === 0 || this.ru.length === 0 || this.eu === null;
  }
  ka() {
    return this.ru.length > 0;
  }
  qs() {
    return this.Su(), this.au.iu();
  }
  ku() {
    return this.Su(), this.au.nu();
  }
  yu() {
    const t = this.qs();
    if (t === null) return null;
    const i = { from: t.Rs(), to: t.ui() };
    return this.Cu(i);
  }
  Cu(t) {
    const i = Math.round(t.from),
      s = Math.round(t.to),
      e = p(this.Tu()),
      n = p(this.Pu());
    return { from: p(this.$i(Math.max(e, i))), to: p(this.$i(Math.min(n, s))) };
  }
  Ru(t) {
    return { from: p(this.ya(t.from, !0)), to: p(this.ya(t.to, !0)) };
  }
  ji() {
    return this.e_;
  }
  m_(t) {
    if (!isFinite(t) || t <= 0 || this.e_ === t) return;
    const i = this.ku(),
      s = this.e_;
    if (
      ((this.e_ = t),
      (this.ou = !0),
      this._n.lockVisibleTimeRangeOnResize && s !== 0)
    ) {
      const e = (this.mu * t) / s;
      this.mu = e;
    }
    if (this._n.fixLeftEdge && i !== null && i.Rs() <= 0) {
      const e = s - t;
      (this.pu -= Math.round(e / this.mu) + 1), (this.ou = !0);
    }
    this.Du(), this.Ou();
  }
  It(t) {
    if (this.Ei() || !rt(t)) return 0;
    const i = this.Au() + this.pu - t;
    return this.e_ - (i + 0.5) * this.mu - 1;
  }
  Zs(t, i) {
    const s = this.Au(),
      e = i === void 0 ? 0 : i.from,
      n = i === void 0 ? t.length : i.to;
    for (let r = e; r < n; r++) {
      const o = t[r].ot,
        l = s + this.pu - o,
        a = this.e_ - (l + 0.5) * this.mu - 1;
      t[r].nt = a;
    }
  }
  Vu(t) {
    return Math.ceil(this.Bu(t));
  }
  Zn(t) {
    (this.ou = !0), (this.pu = t), this.Ou(), this.Hi.Iu(), this.Hi.Nh();
  }
  ee() {
    return this.mu;
  }
  Kn(t) {
    this.zu(t), this.Ou(), this.Hi.Iu(), this.Hi.Nh();
  }
  Lu() {
    return this.pu;
  }
  La() {
    if (this.Ei()) return null;
    if (this.fu !== null) return this.fu;
    const t = this.mu,
      i =
        ((5 * (this.Hi.W().layout.fontSize + 4)) / 8) *
        (this._n.tickMarkMaxCharacterLength || 8),
      s = Math.round(i / t),
      e = p(this.qs()),
      n = Math.max(e.Rs(), e.Rs() - s),
      r = Math.max(e.ui(), e.ui() - s),
      o = this.hu.G_(t, i),
      l = this.Tu() + s,
      a = this.Pu() - s,
      u = this.Eu(),
      c = this._n.fixLeftEdge || u,
      d = this._n.fixRightEdge || u;
    let f = 0;
    for (const m of o) {
      if (!(n <= m.index && m.index <= r)) continue;
      let v;
      f < this.vu.length
        ? ((v = this.vu[f]),
          (v.coord = this.It(m.index)),
          (v.label = this.Nu(m)),
          (v.weight = m.weight))
        : ((v = {
            needAlignCoordinate: !1,
            coord: this.It(m.index),
            label: this.Nu(m),
            weight: m.weight,
          }),
          this.vu.push(v)),
        this.mu > i / 2 && !u
          ? (v.needAlignCoordinate = !1)
          : (v.needAlignCoordinate =
              (c && m.index <= l) || (d && m.index >= a)),
        f++;
    }
    return (this.vu.length = f), (this.fu = this.vu), this.vu;
  }
  Fu() {
    (this.ou = !0), this.Kn(this._n.barSpacing), this.Zn(this._n.rightOffset);
  }
  Wu(t) {
    (this.ou = !0), (this.eu = t), this.Ou(), this.Mu();
  }
  ju(t, i) {
    const s = this.Bu(t),
      e = this.ee(),
      n = e + i * (e / 10);
    this.Kn(n),
      this._n.rightBarStaysOnScroll || this.Zn(this.Lu() + (s - this.Bu(t)));
  }
  Uo(t) {
    this.fo && this.Zo(),
      this.do === null &&
        this.du === null &&
        (this.Ei() || ((this.do = t), this.Hu()));
  }
  qo(t) {
    if (this.du === null) return;
    const i = ei(this.e_ - t, 0, this.e_),
      s = ei(this.e_ - p(this.do), 0, this.e_);
    i !== 0 && s !== 0 && this.Kn((this.du.ee * i) / s);
  }
  Yo() {
    this.do !== null && ((this.do = null), this.$u());
  }
  Xo(t) {
    this.fo === null &&
      this.du === null &&
      (this.Ei() || ((this.fo = t), this.Hu()));
  }
  Ko(t) {
    if (this.fo === null) return;
    const i = (this.fo - t) / this.ee();
    (this.pu = p(this.du).Lu + i), (this.ou = !0), this.Ou();
  }
  Zo() {
    this.fo !== null && ((this.fo = null), this.$u());
  }
  Uu() {
    this.qu(this._n.rightOffset);
  }
  qu(t, i = 400) {
    if (!isFinite(t))
      throw new RangeError("offset is required and must be finite number");
    if (!isFinite(i) || i <= 0)
      throw new RangeError(
        "animationDuration (optional) must be finite positive number"
      );
    const s = this.pu,
      e = performance.now();
    this.Hi.qn({
      Yu: (n) => (n - e) / i >= 1,
      Xu: (n) => {
        const r = (n - e) / i;
        return r >= 1 ? t : s + (t - s) * r;
      },
    });
  }
  bt(t, i) {
    (this.ou = !0), (this.ru = t), this.hu.K_(t, i), this.Ou();
  }
  Ku() {
    return this._u;
  }
  Zu() {
    return this.uu;
  }
  Gu() {
    return this.cu;
  }
  Au() {
    return this.eu || 0;
  }
  Ju(t) {
    const i = t.U_();
    this.zu(this.e_ / i),
      (this.pu = t.ui() - this.Au()),
      this.Ou(),
      (this.ou = !0),
      this.Hi.Iu(),
      this.Hi.Nh();
  }
  Qu() {
    const t = this.Tu(),
      i = this.Pu();
    t !== null && i !== null && this.Ju(new nt(t, i + this._n.rightOffset));
  }
  tc(t) {
    const i = new nt(t.from, t.to);
    this.Ju(i);
  }
  Ui(t) {
    return this.bo.timeFormatter !== void 0
      ? this.bo.timeFormatter(t.originalTime)
      : this.N_.formatHorzItem(t.time);
  }
  Eu() {
    const { handleScroll: t, handleScale: i } = this.Hi.W();
    return !(
      t.horzTouchDrag ||
      t.mouseWheel ||
      t.pressedMouseMove ||
      t.vertTouchDrag ||
      i.axisDoubleClickReset.time ||
      i.axisPressedMouseMove.time ||
      i.mouseWheel ||
      i.pinch
    );
  }
  Tu() {
    return this.ru.length === 0 ? null : 0;
  }
  Pu() {
    return this.ru.length === 0 ? null : this.ru.length - 1;
  }
  ic(t) {
    return (this.e_ - 1 - t) / this.mu;
  }
  Bu(t) {
    const i = this.ic(t),
      s = this.Au() + this.pu - i;
    return Math.round(1e6 * s) / 1e6;
  }
  zu(t) {
    const i = this.mu;
    (this.mu = t), this.Du(), i !== this.mu && ((this.ou = !0), this.nc());
  }
  Su() {
    if (!this.ou) return;
    if (((this.ou = !1), this.Ei())) return void this.sc(J.su());
    const t = this.Au(),
      i = this.e_ / this.mu,
      s = this.pu + t,
      e = new nt(s - i + 1, s);
    this.sc(new J(e));
  }
  Du() {
    const t = this.ec();
    if ((this.mu < t && ((this.mu = t), (this.ou = !0)), this.e_ !== 0)) {
      const i = 0.5 * this.e_;
      this.mu > i && ((this.mu = i), (this.ou = !0));
    }
  }
  ec() {
    return this._n.fixLeftEdge && this._n.fixRightEdge && this.ru.length !== 0
      ? this.e_ / this.ru.length
      : this._n.minBarSpacing;
  }
  Ou() {
    const t = this.rc();
    this.pu > t && ((this.pu = t), (this.ou = !0));
    const i = this.hc();
    i !== null && this.pu < i && ((this.pu = i), (this.ou = !0));
  }
  hc() {
    const t = this.Tu(),
      i = this.eu;
    return t === null || i === null
      ? null
      : t -
          i -
          1 +
          (this._n.fixLeftEdge
            ? this.e_ / this.mu
            : Math.min(2, this.ru.length));
  }
  rc() {
    return this._n.fixRightEdge
      ? 0
      : this.e_ / this.mu - Math.min(2, this.ru.length);
  }
  Hu() {
    this.du = { ee: this.ee(), Lu: this.Lu() };
  }
  $u() {
    this.du = null;
  }
  Nu(t) {
    let i = this.lu.get(t.weight);
    return (
      i === void 0 &&
        ((i = new yh((s) => this.lc(s), this.N_)), this.lu.set(t.weight, i)),
      i.F_(t)
    );
  }
  lc(t) {
    return this.N_.formatTickmark(t, this.bo);
  }
  sc(t) {
    const i = this.au;
    (this.au = t),
      Zi(i.iu(), this.au.iu()) || this._u.m(),
      Zi(i.nu(), this.au.nu()) || this.uu.m(),
      this.nc();
  }
  nc() {
    this.fu = null;
  }
  gu() {
    this.nc(), this.lu.clear();
  }
  bu() {
    this.N_.updateFormatter(this.bo);
  }
  Mu() {
    if (!this._n.fixLeftEdge) return;
    const t = this.Tu();
    if (t === null) return;
    const i = this.qs();
    if (i === null) return;
    const s = i.Rs() - t;
    if (s < 0) {
      const e = this.pu - s - 1;
      this.Zn(e);
    }
    this.Du();
  }
  xu() {
    this.Ou(), this.Du();
  }
}
class Ch {
  K(t, i, s) {
    t.useMediaCoordinateSpace((e) => this.Z(e, i, s));
  }
  fl(t, i, s) {
    t.useMediaCoordinateSpace((e) => this.ac(e, i, s));
  }
  ac(t, i, s) {}
}
class Oh extends Ch {
  constructor(t) {
    super(), (this.oc = new Map()), (this.zt = t);
  }
  Z(t) {}
  ac(t) {
    if (!this.zt.yt) return;
    const { context: i, mediaSize: s } = t;
    let e = 0;
    for (const r of this.zt._c) {
      if (r.Zt.length === 0) continue;
      i.font = r.R;
      const o = this.uc(i, r.Zt);
      o > s.width ? (r.ju = s.width / o) : (r.ju = 1), (e += r.cc * r.ju);
    }
    let n = 0;
    switch (this.zt.dc) {
      case "top":
        n = 0;
        break;
      case "center":
        n = Math.max((s.height - e) / 2, 0);
        break;
      case "bottom":
        n = Math.max(s.height - e, 0);
    }
    i.fillStyle = this.zt.O;
    for (const r of this.zt._c) {
      i.save();
      let o = 0;
      switch (this.zt.fc) {
        case "left":
          (i.textAlign = "left"), (o = r.cc / 2);
          break;
        case "center":
          (i.textAlign = "center"), (o = s.width / 2);
          break;
        case "right":
          (i.textAlign = "right"), (o = s.width - 1 - r.cc / 2);
      }
      i.translate(o, n),
        (i.textBaseline = "top"),
        (i.font = r.R),
        i.scale(r.ju, r.ju),
        i.fillText(r.Zt, 0, r.vc),
        i.restore(),
        (n += r.cc * r.ju);
    }
  }
  uc(t, i) {
    const s = this.mc(t.font);
    let e = s.get(i);
    return e === void 0 && ((e = t.measureText(i).width), s.set(i, e)), e;
  }
  mc(t) {
    let i = this.oc.get(t);
    return i === void 0 && ((i = new Map()), this.oc.set(t, i)), i;
  }
}
class Eh {
  constructor(t) {
    (this.ft = !0),
      (this.Ft = { yt: !1, O: "", _c: [], dc: "center", fc: "center" }),
      (this.Wt = new Oh(this.Ft)),
      (this.jt = t);
  }
  bt() {
    this.ft = !0;
  }
  gt() {
    return this.ft && (this.Mt(), (this.ft = !1)), this.Wt;
  }
  Mt() {
    const t = this.jt.W(),
      i = this.Ft;
    (i.yt = t.visible),
      i.yt &&
        ((i.O = t.color),
        (i.fc = t.horzAlign),
        (i.dc = t.vertAlign),
        (i._c = [
          {
            Zt: t.text,
            R: K(t.fontSize, t.fontFamily, t.fontStyle),
            cc: 1.2 * t.fontSize,
            vc: 0,
            ju: 0,
          },
        ]));
  }
}
class Th extends ci {
  constructor(t, i) {
    super(), (this._n = i), (this.mn = new Eh(this));
  }
  Tn() {
    return [];
  }
  Cn() {
    return [this.mn];
  }
  W() {
    return this._n;
  }
  Rn() {
    this.mn.bt();
  }
}
var Yi, Qi, Xi, qi, Ji;
(function (h) {
  (h[(h.OnTouchEnd = 0)] = "OnTouchEnd"), (h[(h.OnNextTap = 1)] = "OnNextTap");
})(Yi || (Yi = {}));
class kh {
  constructor(t, i, s) {
    (this.bc = []),
      (this.wc = []),
      (this.e_ = 0),
      (this.gc = null),
      (this.Mc = new M()),
      (this.xc = new M()),
      (this.Sc = null),
      (this.kc = t),
      (this._n = i),
      (this.N_ = s),
      (this.yc = new le(this)),
      (this.wl = new xh(this, i.timeScale, this._n.localization, s)),
      (this.vt = new we(this, i.crosshair)),
      (this.Cc = new mh(i.crosshair)),
      (this.Tc = new Th(this, i.watermark)),
      this.Pc(),
      this.bc[0].p_(2e3),
      (this.Rc = this.Dc(0)),
      (this.Oc = this.Dc(1));
  }
  $l() {
    this.Ac(x.ns());
  }
  Nh() {
    this.Ac(x.ts());
  }
  sa() {
    this.Ac(new x(1));
  }
  Ul(t) {
    const i = this.Vc(t);
    this.Ac(i);
  }
  Bc() {
    return this.gc;
  }
  Ic(t) {
    const i = this.gc;
    (this.gc = t), i !== null && this.Ul(i.zc), t !== null && this.Ul(t.zc);
  }
  W() {
    return this._n;
  }
  Eh(t) {
    R(this._n, t),
      this.bc.forEach((i) => i.c_(t)),
      t.timeScale !== void 0 && this.wl.Eh(t.timeScale),
      t.localization !== void 0 && this.wl.wu(t.localization),
      (t.leftPriceScale || t.rightPriceScale) && this.Mc.m(),
      (this.Rc = this.Dc(0)),
      (this.Oc = this.Dc(1)),
      this.$l();
  }
  Lc(t, i) {
    if (t === "left") return void this.Eh({ leftPriceScale: i });
    if (t === "right") return void this.Eh({ rightPriceScale: i });
    const s = this.Ec(t);
    s !== null && (s.Dt.Eh(i), this.Mc.m());
  }
  Ec(t) {
    for (const i of this.bc) {
      const s = i.d_(t);
      if (s !== null) return { Ht: i, Dt: s };
    }
    return null;
  }
  St() {
    return this.wl;
  }
  Nc() {
    return this.bc;
  }
  Fc() {
    return this.Tc;
  }
  Wc() {
    return this.vt;
  }
  jc() {
    return this.xc;
  }
  Hc(t, i) {
    t.Oo(i), this.Iu();
  }
  m_(t) {
    (this.e_ = t),
      this.wl.m_(this.e_),
      this.bc.forEach((i) => i.m_(t)),
      this.Iu();
  }
  Pc(t) {
    const i = new Sh(this.wl, this);
    t !== void 0 ? this.bc.splice(t, 0, i) : this.bc.push(i);
    const s = t === void 0 ? this.bc.length - 1 : t,
      e = x.ns();
    return e.Ln(s, { En: 0, Nn: !0 }), this.Ac(e), i;
  }
  y_(t, i, s) {
    t.y_(i, s);
  }
  C_(t, i, s) {
    t.C_(i, s), this.ql(), this.Ac(this.$c(t, 2));
  }
  T_(t, i) {
    t.T_(i), this.Ac(this.$c(t, 2));
  }
  P_(t, i, s) {
    i.yo() || t.P_(i, s);
  }
  R_(t, i, s) {
    i.yo() || (t.R_(i, s), this.ql(), this.Ac(this.$c(t, 2)));
  }
  D_(t, i) {
    i.yo() || (t.D_(i), this.Ac(this.$c(t, 2)));
  }
  A_(t, i) {
    t.A_(i), this.Ac(this.$c(t, 2));
  }
  Uc(t) {
    this.wl.Uo(t);
  }
  qc(t, i) {
    const s = this.St();
    if (s.Ei() || i === 0) return;
    const e = s.ji();
    (t = Math.max(1, Math.min(t, e))), s.ju(t, i), this.Iu();
  }
  Yc(t) {
    this.Xc(0), this.Kc(t), this.Zc();
  }
  Gc(t) {
    this.wl.qo(t), this.Iu();
  }
  Jc() {
    this.wl.Yo(), this.Nh();
  }
  Xc(t) {
    this.wl.Xo(t);
  }
  Kc(t) {
    this.wl.Ko(t), this.Iu();
  }
  Zc() {
    this.wl.Zo(), this.Nh();
  }
  wt() {
    return this.wc;
  }
  Qc(t, i, s, e, n) {
    this.vt.bn(t, i);
    let r = NaN,
      o = this.wl.Vu(t);
    const l = this.wl.qs();
    l !== null && (o = Math.min(Math.max(l.Rs(), o), l.ui()));
    const a = e.dn(),
      u = a.Ct();
    u !== null && (r = a.fn(i, u)),
      (r = this.Cc.Ca(r, o, e)),
      this.vt.xn(o, r, e),
      this.sa(),
      n || this.xc.m(this.vt.xt(), { x: t, y: i }, s);
  }
  td(t, i, s) {
    const e = s.dn(),
      n = e.Ct(),
      r = e.Rt(t, p(n)),
      o = this.wl.ya(i, !0),
      l = this.wl.It(p(o));
    this.Qc(l, r, null, s, !0);
  }
  nd(t) {
    this.Wc().kn(), this.sa(), t || this.xc.m(null, null, null);
  }
  ql() {
    const t = this.vt.Ht();
    if (t !== null) {
      const i = this.vt.gn(),
        s = this.vt.Mn();
      this.Qc(i, s, null, t);
    }
    this.vt.Rn();
  }
  sd(t, i, s) {
    const e = this.wl.vn(0);
    i !== void 0 && s !== void 0 && this.wl.bt(i, s);
    const n = this.wl.vn(0),
      r = this.wl.Au(),
      o = this.wl.qs();
    if (o !== null && e !== null && n !== null) {
      const l = o.Yr(r),
        a = this.N_.key(e) > this.N_.key(n),
        u = t !== null && t > r && !a,
        c = this.wl.W().allowShiftVisibleRangeOnWhitespaceReplacement,
        d = l && (s !== void 0 || c) && this.wl.W().shiftVisibleRangeOnNewBar;
      if (u && !d) {
        const f = t - r;
        this.wl.Zn(this.wl.Lu() - f);
      }
    }
    this.wl.Wu(t);
  }
  Kl(t) {
    t !== null && t.B_();
  }
  _r(t) {
    const i = this.bc.find((s) => s.No().includes(t));
    return i === void 0 ? null : i;
  }
  Iu() {
    this.Tc.Rn(), this.bc.forEach((t) => t.B_()), this.ql();
  }
  S() {
    this.bc.forEach((t) => t.S()),
      (this.bc.length = 0),
      (this._n.localization.priceFormatter = void 0),
      (this._n.localization.percentageFormatter = void 0),
      (this._n.localization.timeFormatter = void 0);
  }
  ed() {
    return this.yc;
  }
  vr() {
    return this.yc.W();
  }
  f_() {
    return this.Mc;
  }
  rd(t, i, s) {
    const e = this.bc[0],
      n = this.hd(i, t, e, s);
    return this.wc.push(n), this.wc.length === 1 ? this.$l() : this.Nh(), n;
  }
  ld(t) {
    const i = this._r(t),
      s = this.wc.indexOf(t);
    A(s !== -1, "Series not found"),
      this.wc.splice(s, 1),
      p(i).jo(t),
      t.S && t.S();
  }
  Hl(t, i) {
    const s = p(this._r(t));
    s.jo(t);
    const e = this.Ec(i);
    if (e === null) {
      const n = t.Xi();
      s.Fo(t, i, n);
    } else {
      const n = e.Ht === s ? t.Xi() : void 0;
      e.Ht.Fo(t, i, n);
    }
  }
  Qu() {
    const t = x.ts();
    t.jn(), this.Ac(t);
  }
  ad(t) {
    const i = x.ts();
    i.Un(t), this.Ac(i);
  }
  Xn() {
    const t = x.ts();
    t.Xn(), this.Ac(t);
  }
  Kn(t) {
    const i = x.ts();
    i.Kn(t), this.Ac(i);
  }
  Zn(t) {
    const i = x.ts();
    i.Zn(t), this.Ac(i);
  }
  qn(t) {
    const i = x.ts();
    i.qn(t), this.Ac(i);
  }
  Hn() {
    const t = x.ts();
    t.Hn(), this.Ac(t);
  }
  od() {
    return this._n.rightPriceScale.visible ? "right" : "left";
  }
  _d() {
    return this.Oc;
  }
  q() {
    return this.Rc;
  }
  Vt(t) {
    const i = this.Oc,
      s = this.Rc;
    if (i === s) return i;
    if (
      ((t = Math.max(0, Math.min(100, Math.round(100 * t)))),
      this.Sc === null || this.Sc.ys !== s || this.Sc.Cs !== i)
    )
      this.Sc = { ys: s, Cs: i, ud: new Map() };
    else {
      const n = this.Sc.ud.get(t);
      if (n !== void 0) return n;
    }
    const e = (function (n, r, o) {
      const [l, a, u, c] = zt(n),
        [d, f, m, v] = zt(r),
        b = [
          N(l + o * (d - l)),
          N(a + o * (f - a)),
          N(u + o * (m - u)),
          Ss(c + o * (v - c)),
        ];
      return `rgba(${b[0]}, ${b[1]}, ${b[2]}, ${b[3]})`;
    })(s, i, t / 100);
    return this.Sc.ud.set(t, e), e;
  }
  $c(t, i) {
    const s = new x(i);
    if (t !== null) {
      const e = this.bc.indexOf(t);
      s.Ln(e, { En: i });
    }
    return s;
  }
  Vc(t, i) {
    return i === void 0 && (i = 2), this.$c(this._r(t), i);
  }
  Ac(t) {
    this.kc && this.kc(t), this.bc.forEach((i) => i.z_().Fh().bt());
  }
  hd(t, i, s, e) {
    const n = new vi(this, t, i, s, e),
      r = t.priceScaleId !== void 0 ? t.priceScaleId : this.od();
    return s.Fo(n, r), kt(r) || n.Eh(t), n;
  }
  Dc(t) {
    const i = this._n.layout;
    return i.background.type === "gradient"
      ? t === 0
        ? i.background.topColor
        : i.background.bottomColor
      : i.background.color;
  }
}
function hi(h) {
  return !P(h) && !ut(h);
}
function Vs(h) {
  return P(h);
}
(function (h) {
  (h[(h.Disabled = 0)] = "Disabled"),
    (h[(h.Continuous = 1)] = "Continuous"),
    (h[(h.OnDataUpdate = 2)] = "OnDataUpdate");
})(Qi || (Qi = {})),
  (function (h) {
    (h[(h.LastBar = 0)] = "LastBar"), (h[(h.LastVisible = 1)] = "LastVisible");
  })(Xi || (Xi = {})),
  (function (h) {
    (h.Solid = "solid"), (h.VerticalGradient = "gradient");
  })(qi || (qi = {})),
  (function (h) {
    (h[(h.Year = 0)] = "Year"),
      (h[(h.Month = 1)] = "Month"),
      (h[(h.DayOfMonth = 2)] = "DayOfMonth"),
      (h[(h.Time = 3)] = "Time"),
      (h[(h.TimeWithSeconds = 4)] = "TimeWithSeconds");
  })(Ji || (Ji = {}));
const Ki = (h) => h.getUTCFullYear();
function Nh(h, t, i) {
  return t
    .replace(/yyyy/g, ((s) => I(Ki(s), 4))(h))
    .replace(/yy/g, ((s) => I(Ki(s) % 100, 2))(h))
    .replace(
      /MMMM/g,
      ((s, e) =>
        new Date(s.getUTCFullYear(), s.getUTCMonth(), 1).toLocaleString(e, {
          month: "long",
        }))(h, i)
    )
    .replace(
      /MMM/g,
      ((s, e) =>
        new Date(s.getUTCFullYear(), s.getUTCMonth(), 1).toLocaleString(e, {
          month: "short",
        }))(h, i)
    )
    .replace(/MM/g, ((s) => I(((e) => e.getUTCMonth() + 1)(s), 2))(h))
    .replace(/dd/g, ((s) => I(((e) => e.getUTCDate())(s), 2))(h));
}
class As {
  constructor(t = "yyyy-MM-dd", i = "default") {
    (this.dd = t), (this.fd = i);
  }
  F_(t) {
    return Nh(t, this.dd, this.fd);
  }
}
class Rh {
  constructor(t) {
    this.vd = t || "%h:%m:%s";
  }
  F_(t) {
    return this.vd
      .replace("%h", I(t.getUTCHours(), 2))
      .replace("%m", I(t.getUTCMinutes(), 2))
      .replace("%s", I(t.getUTCSeconds(), 2));
  }
}
const Bh = { pd: "yyyy-MM-dd", md: "%h:%m:%s", bd: " ", wd: "default" };
class Lh {
  constructor(t = {}) {
    const i = Object.assign(Object.assign({}, Bh), t);
    (this.gd = new As(i.pd, i.wd)), (this.Md = new Rh(i.md)), (this.xd = i.bd);
  }
  F_(t) {
    return `${this.gd.F_(t)}${this.xd}${this.Md.F_(t)}`;
  }
}
function bt(h) {
  return 60 * h * 60 * 1e3;
}
function Zt(h) {
  return 60 * h * 1e3;
}
const gt = [
  { Sd: ((Gi = 1), 1e3 * Gi), kd: 10 },
  { Sd: Zt(1), kd: 20 },
  { Sd: Zt(5), kd: 21 },
  { Sd: Zt(30), kd: 22 },
  { Sd: bt(1), kd: 30 },
  { Sd: bt(3), kd: 31 },
  { Sd: bt(6), kd: 32 },
  { Sd: bt(12), kd: 33 },
];
var Gi;
function ts(h, t) {
  if (h.getUTCFullYear() !== t.getUTCFullYear()) return 70;
  if (h.getUTCMonth() !== t.getUTCMonth()) return 60;
  if (h.getUTCDate() !== t.getUTCDate()) return 50;
  for (let i = gt.length - 1; i >= 0; --i)
    if (
      Math.floor(t.getTime() / gt[i].Sd) !== Math.floor(h.getTime() / gt[i].Sd)
    )
      return gt[i].kd;
  return 0;
}
function Yt(h) {
  let t = h;
  if ((ut(h) && (t = pi(h)), !hi(t)))
    throw new Error("time must be of type BusinessDay");
  const i = new Date(Date.UTC(t.year, t.month - 1, t.day, 0, 0, 0, 0));
  return { yd: Math.round(i.getTime() / 1e3), Cd: t };
}
function is(h) {
  if (!Vs(h)) throw new Error("time must be of type isUTCTimestamp");
  return { yd: h };
}
function pi(h) {
  const t = new Date(h);
  if (isNaN(t.getTime()))
    throw new Error(`Invalid date string=${h}, expected format=yyyy-mm-dd`);
  return {
    day: t.getUTCDate(),
    month: t.getUTCMonth() + 1,
    year: t.getUTCFullYear(),
  };
}
function ss(h) {
  ut(h.time) && (h.time = pi(h.time));
}
class es {
  options() {
    return this._n;
  }
  setOptions(t) {
    (this._n = t), this.updateFormatter(t.localization);
  }
  preprocessData(t) {
    Array.isArray(t)
      ? (function (i) {
          i.forEach(ss);
        })(t)
      : ss(t);
  }
  createConverterToInternalObj(t) {
    return p(
      (function (i) {
        return i.length === 0 ? null : hi(i[0].time) || ut(i[0].time) ? Yt : is;
      })(t)
    );
  }
  key(t) {
    return typeof t == "object" && "yd" in t
      ? t.yd
      : this.key(this.convertHorzItemToInternal(t));
  }
  cacheKey(t) {
    const i = t;
    return i.Cd === void 0
      ? new Date(1e3 * i.yd).getTime()
      : new Date(Date.UTC(i.Cd.year, i.Cd.month - 1, i.Cd.day)).getTime();
  }
  convertHorzItemToInternal(t) {
    return Vs((i = t)) ? is(i) : hi(i) ? Yt(i) : Yt(pi(i));
    var i;
  }
  updateFormatter(t) {
    if (!this._n) return;
    const i = t.dateFormat;
    this._n.timeScale.timeVisible
      ? (this.Td = new Lh({
          pd: i,
          md: this._n.timeScale.secondsVisible ? "%h:%m:%s" : "%h:%m",
          bd: "   ",
          wd: t.locale,
        }))
      : (this.Td = new As(i, t.locale));
  }
  formatHorzItem(t) {
    const i = t;
    return this.Td.F_(new Date(1e3 * i.yd));
  }
  formatTickmark(t, i) {
    const s = (function (n, r, o) {
        switch (n) {
          case 0:
          case 10:
            return r ? (o ? 4 : 3) : 2;
          case 20:
          case 21:
          case 22:
          case 30:
          case 31:
          case 32:
          case 33:
            return r ? 3 : 2;
          case 50:
            return 2;
          case 60:
            return 1;
          case 70:
            return 0;
        }
      })(
        t.weight,
        this._n.timeScale.timeVisible,
        this._n.timeScale.secondsVisible
      ),
      e = this._n.timeScale;
    if (e.tickMarkFormatter !== void 0) {
      const n = e.tickMarkFormatter(t.originalTime, s, i.locale);
      if (n !== null) return n;
    }
    return (function (n, r, o) {
      const l = {};
      switch (r) {
        case 0:
          l.year = "numeric";
          break;
        case 1:
          l.month = "short";
          break;
        case 2:
          l.day = "numeric";
          break;
        case 3:
          (l.hour12 = !1), (l.hour = "2-digit"), (l.minute = "2-digit");
          break;
        case 4:
          (l.hour12 = !1),
            (l.hour = "2-digit"),
            (l.minute = "2-digit"),
            (l.second = "2-digit");
      }
      const a =
        n.Cd === void 0
          ? new Date(1e3 * n.yd)
          : new Date(Date.UTC(n.Cd.year, n.Cd.month - 1, n.Cd.day));
      return new Date(
        a.getUTCFullYear(),
        a.getUTCMonth(),
        a.getUTCDate(),
        a.getUTCHours(),
        a.getUTCMinutes(),
        a.getUTCSeconds(),
        a.getUTCMilliseconds()
      ).toLocaleString(o, l);
    })(t.time, s, i.locale);
  }
  maxTickMarkWeight(t) {
    let i = t.reduce(zh, t[0]).weight;
    return i > 30 && i < 50 && (i = 30), i;
  }
  fillWeightsForPoints(t, i) {
    (function (s, e = 0) {
      if (s.length === 0) return;
      let n = e === 0 ? null : s[e - 1].time.yd,
        r = n !== null ? new Date(1e3 * n) : null,
        o = 0;
      for (let l = e; l < s.length; ++l) {
        const a = s[l],
          u = new Date(1e3 * a.time.yd);
        r !== null && (a.timeWeight = ts(u, r)),
          (o += a.time.yd - (n || a.time.yd)),
          (n = a.time.yd),
          (r = u);
      }
      if (e === 0 && s.length > 1) {
        const l = Math.ceil(o / (s.length - 1)),
          a = new Date(1e3 * (s[0].time.yd - l));
        s[0].timeWeight = ts(new Date(1e3 * s[0].time.yd), a);
      }
    })(t, i);
  }
  static Pd(t) {
    return R({ localization: { dateFormat: "dd MMM 'yy" } }, t ?? {});
  }
}
const G = typeof window < "u";
function hs() {
  return (
    !!G && window.navigator.userAgent.toLowerCase().indexOf("firefox") > -1
  );
}
function Qt() {
  return !!G && /iPhone|iPad|iPod/.test(window.navigator.platform);
}
function ni(h) {
  return h + (h % 2);
}
function Xt(h, t) {
  return h.Rd - t.Rd;
}
function qt(h, t, i) {
  const s = (h.Rd - t.Rd) / (h.ot - t.ot);
  return Math.sign(s) * Math.min(Math.abs(s), i);
}
class Ph {
  constructor(t, i, s, e) {
    (this.Dd = null),
      (this.Od = null),
      (this.Ad = null),
      (this.Vd = null),
      (this.Bd = null),
      (this.Id = 0),
      (this.zd = 0),
      (this.Ld = t),
      (this.Ed = i),
      (this.Nd = s),
      (this.ss = e);
  }
  Fd(t, i) {
    if (this.Dd !== null) {
      if (this.Dd.ot === i) return void (this.Dd.Rd = t);
      if (Math.abs(this.Dd.Rd - t) < this.ss) return;
    }
    (this.Vd = this.Ad),
      (this.Ad = this.Od),
      (this.Od = this.Dd),
      (this.Dd = { ot: i, Rd: t });
  }
  Pr(t, i) {
    if (this.Dd === null || this.Od === null || i - this.Dd.ot > 50) return;
    let s = 0;
    const e = qt(this.Dd, this.Od, this.Ed),
      n = Xt(this.Dd, this.Od),
      r = [e],
      o = [n];
    if (((s += n), this.Ad !== null)) {
      const a = qt(this.Od, this.Ad, this.Ed);
      if (Math.sign(a) === Math.sign(e)) {
        const u = Xt(this.Od, this.Ad);
        if ((r.push(a), o.push(u), (s += u), this.Vd !== null)) {
          const c = qt(this.Ad, this.Vd, this.Ed);
          if (Math.sign(c) === Math.sign(e)) {
            const d = Xt(this.Ad, this.Vd);
            r.push(c), o.push(d), (s += d);
          }
        }
      }
    }
    let l = 0;
    for (let a = 0; a < r.length; ++a) l += (o[a] / s) * r[a];
    Math.abs(l) < this.Ld ||
      ((this.Bd = { Rd: t, ot: i }),
      (this.zd = l),
      (this.Id = (function (a, u) {
        const c = Math.log(u);
        return Math.log((1 * c) / -a) / c;
      })(Math.abs(l), this.Nd)));
  }
  Xu(t) {
    const i = p(this.Bd),
      s = t - i.ot;
    return i.Rd + (this.zd * (Math.pow(this.Nd, s) - 1)) / Math.log(this.Nd);
  }
  Yu(t) {
    return this.Bd === null || this.Wd(t) === this.Id;
  }
  Wd(t) {
    const i = t - p(this.Bd).ot;
    return Math.min(i, this.Id);
  }
}
function U(h, t) {
  const i = p(h.ownerDocument).createElement("canvas");
  h.appendChild(i);
  const s = Ys(i, {
    type: "device-pixel-content-box",
    options: { allowResizeObserver: !1 },
    transform: (e, n) => ({
      width: Math.max(e.width, n.width),
      height: Math.max(e.height, n.height),
    }),
  });
  return s.resizeCanvasElement(t), s;
}
function Z(h) {
  var t;
  (h.width = 1),
    (h.height = 1),
    (t = h.getContext("2d")) === null ||
      t === void 0 ||
      t.clearRect(0, 0, 1, 1);
}
function ri(h, t, i, s) {
  h.fl && h.fl(t, i, s);
}
function Mt(h, t, i, s) {
  h.K(t, i, s);
}
function oi(h, t, i, s) {
  const e = h(i, s);
  for (const n of e) {
    const r = n.gt();
    r !== null && t(r);
  }
}
function Wh(h) {
  G &&
    window.chrome !== void 0 &&
    h.addEventListener("mousedown", (t) => {
      if (t.button === 1) return t.preventDefault(), !1;
    });
}
class bi {
  constructor(t, i, s) {
    (this.jd = 0),
      (this.Hd = null),
      (this.$d = {
        nt: Number.NEGATIVE_INFINITY,
        st: Number.POSITIVE_INFINITY,
      }),
      (this.Ud = 0),
      (this.qd = null),
      (this.Yd = {
        nt: Number.NEGATIVE_INFINITY,
        st: Number.POSITIVE_INFINITY,
      }),
      (this.Xd = null),
      (this.Kd = !1),
      (this.Zd = null),
      (this.Gd = null),
      (this.Jd = !1),
      (this.Qd = !1),
      (this.tf = !1),
      (this.if = null),
      (this.nf = null),
      (this.sf = null),
      (this.ef = null),
      (this.rf = null),
      (this.hf = null),
      (this.lf = null),
      (this.af = 0),
      (this._f = !1),
      (this.uf = !1),
      (this.cf = !1),
      (this.df = 0),
      (this.ff = null),
      (this.vf = !Qt()),
      (this.pf = (e) => {
        this.mf(e);
      }),
      (this.bf = (e) => {
        if (this.wf(e)) {
          const n = this.gf(e);
          if ((++this.Ud, this.qd && this.Ud > 1)) {
            const { Mf: r } = this.xf(L(e), this.Yd);
            r < 30 && !this.tf && this.Sf(n, this.yf.kf), this.Cf();
          }
        } else {
          const n = this.gf(e);
          if ((++this.jd, this.Hd && this.jd > 1)) {
            const { Mf: r } = this.xf(L(e), this.$d);
            r < 5 && !this.Qd && this.Tf(n, this.yf.Pf), this.Rf();
          }
        }
      }),
      (this.Df = t),
      (this.yf = i),
      (this._n = s),
      this.Of();
  }
  S() {
    this.if !== null && (this.if(), (this.if = null)),
      this.nf !== null && (this.nf(), (this.nf = null)),
      this.ef !== null && (this.ef(), (this.ef = null)),
      this.rf !== null && (this.rf(), (this.rf = null)),
      this.hf !== null && (this.hf(), (this.hf = null)),
      this.sf !== null && (this.sf(), (this.sf = null)),
      this.Af(),
      this.Rf();
  }
  Vf(t) {
    this.ef && this.ef();
    const i = this.Bf.bind(this);
    if (
      ((this.ef = () => {
        this.Df.removeEventListener("mousemove", i);
      }),
      this.Df.addEventListener("mousemove", i),
      this.wf(t))
    )
      return;
    const s = this.gf(t);
    this.Tf(s, this.yf.If), (this.vf = !0);
  }
  Rf() {
    this.Hd !== null && clearTimeout(this.Hd),
      (this.jd = 0),
      (this.Hd = null),
      (this.$d = {
        nt: Number.NEGATIVE_INFINITY,
        st: Number.POSITIVE_INFINITY,
      });
  }
  Cf() {
    this.qd !== null && clearTimeout(this.qd),
      (this.Ud = 0),
      (this.qd = null),
      (this.Yd = {
        nt: Number.NEGATIVE_INFINITY,
        st: Number.POSITIVE_INFINITY,
      });
  }
  Bf(t) {
    if (this.cf || this.Gd !== null || this.wf(t)) return;
    const i = this.gf(t);
    this.Tf(i, this.yf.zf), (this.vf = !0);
  }
  Lf(t) {
    const i = Jt(t.changedTouches, p(this.ff));
    if (i === null || ((this.df = wt(t)), this.lf !== null) || this.uf) return;
    this._f = !0;
    const s = this.xf(L(i), p(this.Gd)),
      { Ef: e, Nf: n, Mf: r } = s;
    if (this.Jd || !(r < 5)) {
      if (!this.Jd) {
        const o = 0.5 * e,
          l = n >= o && !this._n.Ff(),
          a = o > n && !this._n.Wf();
        l || a || (this.uf = !0),
          (this.Jd = !0),
          (this.tf = !0),
          this.Af(),
          this.Cf();
      }
      if (!this.uf) {
        const o = this.gf(t, i);
        this.Sf(o, this.yf.jf), Q(t);
      }
    }
  }
  Hf(t) {
    if (t.button !== 0) return;
    const i = this.xf(L(t), p(this.Zd)),
      { Mf: s } = i;
    if ((s >= 5 && ((this.Qd = !0), this.Rf()), this.Qd)) {
      const e = this.gf(t);
      this.Tf(e, this.yf.$f);
    }
  }
  xf(t, i) {
    const s = Math.abs(i.nt - t.nt),
      e = Math.abs(i.st - t.st);
    return { Ef: s, Nf: e, Mf: s + e };
  }
  Uf(t) {
    let i = Jt(t.changedTouches, p(this.ff));
    if (
      (i === null && t.touches.length === 0 && (i = t.changedTouches[0]),
      i === null)
    )
      return;
    (this.ff = null),
      (this.df = wt(t)),
      this.Af(),
      (this.Gd = null),
      this.hf && (this.hf(), (this.hf = null));
    const s = this.gf(t, i);
    if ((this.Sf(s, this.yf.qf), ++this.Ud, this.qd && this.Ud > 1)) {
      const { Mf: e } = this.xf(L(i), this.Yd);
      e < 30 && !this.tf && this.Sf(s, this.yf.kf), this.Cf();
    } else this.tf || (this.Sf(s, this.yf.Yf), this.yf.Yf && Q(t));
    this.Ud === 0 && Q(t),
      t.touches.length === 0 && this.Kd && ((this.Kd = !1), Q(t));
  }
  mf(t) {
    if (t.button !== 0) return;
    const i = this.gf(t);
    if (
      ((this.Zd = null),
      (this.cf = !1),
      this.rf && (this.rf(), (this.rf = null)),
      hs() &&
        this.Df.ownerDocument.documentElement.removeEventListener(
          "mouseleave",
          this.pf
        ),
      !this.wf(t))
    )
      if ((this.Tf(i, this.yf.Xf), ++this.jd, this.Hd && this.jd > 1)) {
        const { Mf: s } = this.xf(L(t), this.$d);
        s < 5 && !this.Qd && this.Tf(i, this.yf.Pf), this.Rf();
      } else this.Qd || this.Tf(i, this.yf.Kf);
  }
  Af() {
    this.Xd !== null && (clearTimeout(this.Xd), (this.Xd = null));
  }
  Zf(t) {
    if (this.ff !== null) return;
    const i = t.changedTouches[0];
    (this.ff = i.identifier), (this.df = wt(t));
    const s = this.Df.ownerDocument.documentElement;
    (this.tf = !1),
      (this.Jd = !1),
      (this.uf = !1),
      (this.Gd = L(i)),
      this.hf && (this.hf(), (this.hf = null));
    {
      const n = this.Lf.bind(this),
        r = this.Uf.bind(this);
      (this.hf = () => {
        s.removeEventListener("touchmove", n),
          s.removeEventListener("touchend", r);
      }),
        s.addEventListener("touchmove", n, { passive: !1 }),
        s.addEventListener("touchend", r, { passive: !1 }),
        this.Af(),
        (this.Xd = setTimeout(this.Gf.bind(this, t), 240));
    }
    const e = this.gf(t, i);
    this.Sf(e, this.yf.Jf),
      this.qd ||
        ((this.Ud = 0),
        (this.qd = setTimeout(this.Cf.bind(this), 500)),
        (this.Yd = L(i)));
  }
  Qf(t) {
    if (t.button !== 0) return;
    const i = this.Df.ownerDocument.documentElement;
    hs() && i.addEventListener("mouseleave", this.pf),
      (this.Qd = !1),
      (this.Zd = L(t)),
      this.rf && (this.rf(), (this.rf = null));
    {
      const e = this.Hf.bind(this),
        n = this.mf.bind(this);
      (this.rf = () => {
        i.removeEventListener("mousemove", e),
          i.removeEventListener("mouseup", n);
      }),
        i.addEventListener("mousemove", e),
        i.addEventListener("mouseup", n);
    }
    if (((this.cf = !0), this.wf(t))) return;
    const s = this.gf(t);
    this.Tf(s, this.yf.tv),
      this.Hd ||
        ((this.jd = 0),
        (this.Hd = setTimeout(this.Rf.bind(this), 500)),
        (this.$d = L(t)));
  }
  Of() {
    this.Df.addEventListener("mouseenter", this.Vf.bind(this)),
      this.Df.addEventListener("touchcancel", this.Af.bind(this));
    {
      const t = this.Df.ownerDocument,
        i = (s) => {
          this.yf.iv &&
            ((s.composed && this.Df.contains(s.composedPath()[0])) ||
              (s.target && this.Df.contains(s.target)) ||
              this.yf.iv());
        };
      (this.nf = () => {
        t.removeEventListener("touchstart", i);
      }),
        (this.if = () => {
          t.removeEventListener("mousedown", i);
        }),
        t.addEventListener("mousedown", i),
        t.addEventListener("touchstart", i, { passive: !0 });
    }
    Qt() &&
      ((this.sf = () => {
        this.Df.removeEventListener("dblclick", this.bf);
      }),
      this.Df.addEventListener("dblclick", this.bf)),
      this.Df.addEventListener("mouseleave", this.nv.bind(this)),
      this.Df.addEventListener("touchstart", this.Zf.bind(this), {
        passive: !0,
      }),
      Wh(this.Df),
      this.Df.addEventListener("mousedown", this.Qf.bind(this)),
      this.sv(),
      this.Df.addEventListener("touchmove", () => {}, { passive: !1 });
  }
  sv() {
    (this.yf.ev === void 0 && this.yf.rv === void 0 && this.yf.hv === void 0) ||
      (this.Df.addEventListener("touchstart", (t) => this.lv(t.touches), {
        passive: !0,
      }),
      this.Df.addEventListener(
        "touchmove",
        (t) => {
          if (
            t.touches.length === 2 &&
            this.lf !== null &&
            this.yf.rv !== void 0
          ) {
            const i = ns(t.touches[0], t.touches[1]) / this.af;
            this.yf.rv(this.lf, i), Q(t);
          }
        },
        { passive: !1 }
      ),
      this.Df.addEventListener("touchend", (t) => {
        this.lv(t.touches);
      }));
  }
  lv(t) {
    t.length === 1 && (this._f = !1),
      t.length !== 2 || this._f || this.Kd ? this.av() : this.ov(t);
  }
  ov(t) {
    const i = this.Df.getBoundingClientRect() || { left: 0, top: 0 };
    (this.lf = {
      nt: (t[0].clientX - i.left + (t[1].clientX - i.left)) / 2,
      st: (t[0].clientY - i.top + (t[1].clientY - i.top)) / 2,
    }),
      (this.af = ns(t[0], t[1])),
      this.yf.ev !== void 0 && this.yf.ev(),
      this.Af();
  }
  av() {
    this.lf !== null &&
      ((this.lf = null), this.yf.hv !== void 0 && this.yf.hv());
  }
  nv(t) {
    if ((this.ef && this.ef(), this.wf(t) || !this.vf)) return;
    const i = this.gf(t);
    this.Tf(i, this.yf._v), (this.vf = !Qt());
  }
  Gf(t) {
    const i = Jt(t.touches, p(this.ff));
    if (i === null) return;
    const s = this.gf(t, i);
    this.Sf(s, this.yf.uv), (this.tf = !0), (this.Kd = !0);
  }
  wf(t) {
    return t.sourceCapabilities &&
      t.sourceCapabilities.firesTouchEvents !== void 0
      ? t.sourceCapabilities.firesTouchEvents
      : wt(t) < this.df + 500;
  }
  Sf(t, i) {
    i && i.call(this.yf, t);
  }
  Tf(t, i) {
    i && i.call(this.yf, t);
  }
  gf(t, i) {
    const s = i || t,
      e = this.Df.getBoundingClientRect() || { left: 0, top: 0 };
    return {
      clientX: s.clientX,
      clientY: s.clientY,
      pageX: s.pageX,
      pageY: s.pageY,
      screenX: s.screenX,
      screenY: s.screenY,
      localX: s.clientX - e.left,
      localY: s.clientY - e.top,
      ctrlKey: t.ctrlKey,
      altKey: t.altKey,
      shiftKey: t.shiftKey,
      metaKey: t.metaKey,
      cv:
        !t.type.startsWith("mouse") &&
        t.type !== "contextmenu" &&
        t.type !== "click",
      dv: t.type,
      fv: s.target,
      vv: t.view,
      pv: () => {
        t.type !== "touchstart" && Q(t);
      },
    };
  }
}
function ns(h, t) {
  const i = h.clientX - t.clientX,
    s = h.clientY - t.clientY;
  return Math.sqrt(i * i + s * s);
}
function Q(h) {
  h.cancelable && h.preventDefault();
}
function L(h) {
  return { nt: h.pageX, st: h.pageY };
}
function wt(h) {
  return h.timeStamp || performance.now();
}
function Jt(h, t) {
  for (let i = 0; i < h.length; ++i) if (h[i].identifier === t) return h[i];
  return null;
}
function _t(h) {
  return { zc: h.zc, mv: { mr: h.bv.externalId }, wv: h.bv.cursorStyle };
}
function Ih(h, t, i) {
  for (const s of h) {
    const e = s.gt();
    if (e !== null && e.pr) {
      const n = e.pr(t, i);
      if (n !== null) return { vv: s, mv: n };
    }
  }
  return null;
}
function Kt(h, t) {
  return (i) => {
    var s, e, n, r;
    return ((e = (s = i.Dt()) === null || s === void 0 ? void 0 : s.xa()) !==
      null && e !== void 0
      ? e
      : "") !== t
      ? []
      : (r = (n = i.la) === null || n === void 0 ? void 0 : n.call(i, h)) !==
          null && r !== void 0
      ? r
      : [];
  };
}
class rs {
  constructor(t, i, s, e) {
    (this.zi = null),
      (this.gv = null),
      (this.Mv = !1),
      (this.xv = new lt(200)),
      (this.Zr = null),
      (this.Sv = 0),
      (this.kv = !1),
      (this.yv = () => {
        this.kv || this.Qi.Cv().$t().Nh();
      }),
      (this.Tv = () => {
        this.kv || this.Qi.Cv().$t().Nh();
      }),
      (this.Qi = t),
      (this._n = i),
      (this.mo = i.layout),
      (this.yc = s),
      (this.Pv = e === "left"),
      (this.Rv = Kt("normal", e)),
      (this.Dv = Kt("top", e)),
      (this.Ov = Kt("bottom", e)),
      (this.Av = document.createElement("div")),
      (this.Av.style.height = "100%"),
      (this.Av.style.overflow = "hidden"),
      (this.Av.style.width = "25px"),
      (this.Av.style.left = "0"),
      (this.Av.style.position = "relative"),
      (this.Vv = U(this.Av, S({ width: 16, height: 16 }))),
      this.Vv.subscribeSuggestedBitmapSizeChanged(this.yv);
    const n = this.Vv.canvasElement;
    (n.style.position = "absolute"),
      (n.style.zIndex = "1"),
      (n.style.left = "0"),
      (n.style.top = "0"),
      (this.Bv = U(this.Av, S({ width: 16, height: 16 }))),
      this.Bv.subscribeSuggestedBitmapSizeChanged(this.Tv);
    const r = this.Bv.canvasElement;
    (r.style.position = "absolute"),
      (r.style.zIndex = "2"),
      (r.style.left = "0"),
      (r.style.top = "0");
    const o = {
      tv: this.Iv.bind(this),
      Jf: this.Iv.bind(this),
      $f: this.zv.bind(this),
      jf: this.zv.bind(this),
      iv: this.Lv.bind(this),
      Xf: this.Ev.bind(this),
      qf: this.Ev.bind(this),
      Pf: this.Nv.bind(this),
      kf: this.Nv.bind(this),
      If: this.Fv.bind(this),
      _v: this.Wv.bind(this),
    };
    this.jv = new bi(this.Bv.canvasElement, o, {
      Ff: () => !this._n.handleScroll.vertTouchDrag,
      Wf: () => !0,
    });
  }
  S() {
    this.jv.S(),
      this.Bv.unsubscribeSuggestedBitmapSizeChanged(this.Tv),
      Z(this.Bv.canvasElement),
      this.Bv.dispose(),
      this.Vv.unsubscribeSuggestedBitmapSizeChanged(this.yv),
      Z(this.Vv.canvasElement),
      this.Vv.dispose(),
      this.zi !== null && this.zi.$o().p(this),
      (this.zi = null);
  }
  Hv() {
    return this.Av;
  }
  P() {
    return this.mo.fontSize;
  }
  $v() {
    const t = this.yc.W();
    return this.Zr !== t.R && (this.xv.Qe(), (this.Zr = t.R)), t;
  }
  Uv() {
    if (this.zi === null) return 0;
    let t = 0;
    const i = this.$v(),
      s = p(this.Vv.canvasElement.getContext("2d"));
    s.save();
    const e = this.zi.La();
    (s.font = this.qv()),
      e.length > 0 &&
        (t = Math.max(
          this.xv.Mi(s, e[0].Za),
          this.xv.Mi(s, e[e.length - 1].Za)
        ));
    const n = this.Yv();
    for (let l = n.length; l--; ) {
      const a = this.xv.Mi(s, n[l].Zt());
      a > t && (t = a);
    }
    const r = this.zi.Ct();
    if (r !== null && this.gv !== null) {
      const l = this.zi.fn(1, r),
        a = this.zi.fn(this.gv.height - 2, r);
      t = Math.max(
        t,
        this.xv.Mi(
          s,
          this.zi.Ni(Math.floor(Math.min(l, a)) + 0.11111111111111, r)
        ),
        this.xv.Mi(
          s,
          this.zi.Ni(Math.ceil(Math.max(l, a)) - 0.11111111111111, r)
        )
      );
    }
    s.restore();
    const o = t || 34;
    return ni(Math.ceil(i.C + i.T + i.B + i.I + 5 + o));
  }
  Xv(t) {
    (this.gv !== null && F(this.gv, t)) ||
      ((this.gv = t),
      (this.kv = !0),
      this.Vv.resizeCanvasElement(t),
      this.Bv.resizeCanvasElement(t),
      (this.kv = !1),
      (this.Av.style.width = `${t.width}px`),
      (this.Av.style.height = `${t.height}px`));
  }
  Kv() {
    return p(this.gv).width;
  }
  Zi(t) {
    this.zi !== t &&
      (this.zi !== null && this.zi.$o().p(this),
      (this.zi = t),
      t.$o().l(this.ao.bind(this), this));
  }
  Dt() {
    return this.zi;
  }
  Qe() {
    const t = this.Qi.Zv();
    this.Qi.Cv().$t().A_(t, p(this.Dt()));
  }
  Gv(t) {
    if (this.gv === null) return;
    if (t !== 1) {
      this.Jv(), this.Vv.applySuggestedBitmapSize();
      const s = H(this.Vv);
      s !== null &&
        (s.useBitmapCoordinateSpace((e) => {
          this.Qv(e), this.Ae(e);
        }),
        this.Qi.tp(s, this.Ov),
        this.ip(s),
        this.Qi.tp(s, this.Rv),
        this.np(s));
    }
    this.Bv.applySuggestedBitmapSize();
    const i = H(this.Bv);
    i !== null &&
      (i.useBitmapCoordinateSpace(({ context: s, bitmapSize: e }) => {
        s.clearRect(0, 0, e.width, e.height);
      }),
      this.sp(i),
      this.Qi.tp(i, this.Dv));
  }
  ep() {
    return this.Vv.bitmapSize;
  }
  rp(t, i, s) {
    const e = this.ep();
    e.width > 0 && e.height > 0 && t.drawImage(this.Vv.canvasElement, i, s);
  }
  bt() {
    var t;
    (t = this.zi) === null || t === void 0 || t.La();
  }
  Iv(t) {
    if (
      this.zi === null ||
      this.zi.Ei() ||
      !this._n.handleScale.axisPressedMouseMove.price
    )
      return;
    const i = this.Qi.Cv().$t(),
      s = this.Qi.Zv();
    (this.Mv = !0), i.y_(s, this.zi, t.localY);
  }
  zv(t) {
    if (this.zi === null || !this._n.handleScale.axisPressedMouseMove.price)
      return;
    const i = this.Qi.Cv().$t(),
      s = this.Qi.Zv(),
      e = this.zi;
    i.C_(s, e, t.localY);
  }
  Lv() {
    if (this.zi === null || !this._n.handleScale.axisPressedMouseMove.price)
      return;
    const t = this.Qi.Cv().$t(),
      i = this.Qi.Zv(),
      s = this.zi;
    this.Mv && ((this.Mv = !1), t.T_(i, s));
  }
  Ev(t) {
    if (this.zi === null || !this._n.handleScale.axisPressedMouseMove.price)
      return;
    const i = this.Qi.Cv().$t(),
      s = this.Qi.Zv();
    (this.Mv = !1), i.T_(s, this.zi);
  }
  Nv(t) {
    this._n.handleScale.axisDoubleClickReset.price && this.Qe();
  }
  Fv(t) {
    this.zi !== null &&
      (!this.Qi.Cv().$t().W().handleScale.axisPressedMouseMove.price ||
        this.zi.fh() ||
        this.zi.Co() ||
        this.hp(1));
  }
  Wv(t) {
    this.hp(0);
  }
  Yv() {
    const t = [],
      i = this.zi === null ? void 0 : this.zi;
    return (
      ((s) => {
        for (let e = 0; e < s.length; ++e) {
          const n = s[e].Tn(this.Qi.Zv(), i);
          for (let r = 0; r < n.length; r++) t.push(n[r]);
        }
      })(this.Qi.Zv().No()),
      t
    );
  }
  Qv({ context: t, bitmapSize: i }) {
    const { width: s, height: e } = i,
      n = this.Qi.Zv().$t(),
      r = n.q(),
      o = n._d();
    r === o ? Et(t, 0, 0, s, e, r) : ys(t, 0, 0, s, e, r, o);
  }
  Ae({ context: t, bitmapSize: i, horizontalPixelRatio: s }) {
    if (this.gv === null || this.zi === null || !this.zi.W().borderVisible)
      return;
    t.fillStyle = this.zi.W().borderColor;
    const e = Math.max(1, Math.floor(this.$v().C * s));
    let n;
    (n = this.Pv ? i.width - e : 0), t.fillRect(n, 0, e, i.height);
  }
  ip(t) {
    if (this.gv === null || this.zi === null) return;
    const i = this.zi.La(),
      s = this.zi.W(),
      e = this.$v(),
      n = this.Pv ? this.gv.width - e.T : 0;
    s.borderVisible &&
      s.ticksVisible &&
      t.useBitmapCoordinateSpace(
        ({ context: r, horizontalPixelRatio: o, verticalPixelRatio: l }) => {
          r.fillStyle = s.borderColor;
          const a = Math.max(1, Math.floor(l)),
            u = Math.floor(0.5 * l),
            c = Math.round(e.T * o);
          r.beginPath();
          for (const d of i)
            r.rect(Math.floor(n * o), Math.round(d.Aa * l) - u, c, a);
          r.fill();
        }
      ),
      t.useMediaCoordinateSpace(({ context: r }) => {
        var o;
        (r.font = this.qv()),
          (r.fillStyle =
            (o = s.textColor) !== null && o !== void 0 ? o : this.mo.textColor),
          (r.textAlign = this.Pv ? "right" : "left"),
          (r.textBaseline = "middle");
        const l = this.Pv ? Math.round(n - e.B) : Math.round(n + e.T + e.B),
          a = i.map((u) => this.xv.gi(r, u.Za));
        for (let u = i.length; u--; ) {
          const c = i[u];
          r.fillText(c.Za, l, c.Aa + a[u]);
        }
      });
  }
  Jv() {
    if (this.gv === null || this.zi === null) return;
    let t = this.gv.height / 2;
    const i = [],
      s = this.zi.No().slice(),
      e = this.Qi.Zv(),
      n = this.$v();
    this.zi === e.cr() &&
      this.Qi.Zv()
        .No()
        .forEach((l) => {
          e.ur(l) && s.push(l);
        });
    const r = this.zi.Ta()[0],
      o = this.zi;
    s.forEach((l) => {
      const a = l.Tn(e, o);
      a.forEach((u) => {
        u.Oi(null), u.Ai() && i.push(u);
      }),
        r === l && a.length > 0 && (t = a[0].Si());
    }),
      i.forEach((l) => l.Oi(l.Si())),
      this.zi.W().alignLabels && this.lp(i, n, t);
  }
  lp(t, i, s) {
    if (this.gv === null) return;
    const e = t.filter((r) => r.Si() <= s),
      n = t.filter((r) => r.Si() > s);
    e.sort((r, o) => o.Si() - r.Si()),
      e.length && n.length && n.push(e[0]),
      n.sort((r, o) => r.Si() - o.Si());
    for (const r of t) {
      const o = Math.floor(r.Bt(i) / 2),
        l = r.Si();
      l > -o && l < o && r.Oi(o),
        l > this.gv.height - o &&
          l < this.gv.height + o &&
          r.Oi(this.gv.height - o);
    }
    for (let r = 1; r < e.length; r++) {
      const o = e[r],
        l = e[r - 1],
        a = l.Bt(i, !1),
        u = o.Si(),
        c = l.Di();
      u > c - a && o.Oi(c - a);
    }
    for (let r = 1; r < n.length; r++) {
      const o = n[r],
        l = n[r - 1],
        a = l.Bt(i, !0),
        u = o.Si(),
        c = l.Di();
      u < c + a && o.Oi(c + a);
    }
  }
  np(t) {
    if (this.gv === null) return;
    const i = this.Yv(),
      s = this.$v(),
      e = this.Pv ? "right" : "left";
    i.forEach((n) => {
      n.Vi() && n.gt(p(this.zi)).K(t, s, this.xv, e);
    });
  }
  sp(t) {
    if (this.gv === null || this.zi === null) return;
    const i = this.Qi.Cv().$t(),
      s = [],
      e = this.Qi.Zv(),
      n = i.Wc().Tn(e, this.zi);
    n.length && s.push(n);
    const r = this.$v(),
      o = this.Pv ? "right" : "left";
    s.forEach((l) => {
      l.forEach((a) => {
        a.gt(p(this.zi)).K(t, r, this.xv, o);
      });
    });
  }
  hp(t) {
    this.Av.style.cursor = t === 1 ? "ns-resize" : "default";
  }
  ao() {
    const t = this.Uv();
    this.Sv < t && this.Qi.Cv().$t().$l(), (this.Sv = t);
  }
  qv() {
    return K(this.mo.fontSize, this.mo.fontFamily);
  }
}
function Dh(h, t) {
  var i, s;
  return (s = (i = h.ra) === null || i === void 0 ? void 0 : i.call(h, t)) !==
    null && s !== void 0
    ? s
    : [];
}
function St(h, t) {
  var i, s;
  return (s = (i = h.Cn) === null || i === void 0 ? void 0 : i.call(h, t)) !==
    null && s !== void 0
    ? s
    : [];
}
function Vh(h, t) {
  var i, s;
  return (s = (i = h.Gi) === null || i === void 0 ? void 0 : i.call(h, t)) !==
    null && s !== void 0
    ? s
    : [];
}
function Ah(h, t) {
  var i, s;
  return (s = (i = h.na) === null || i === void 0 ? void 0 : i.call(h, t)) !==
    null && s !== void 0
    ? s
    : [];
}
class gi {
  constructor(t, i) {
    (this.gv = S({ width: 0, height: 0 })),
      (this.ap = null),
      (this.op = null),
      (this._p = null),
      (this.up = !1),
      (this.cp = new M()),
      (this.dp = new M()),
      (this.fp = 0),
      (this.vp = !1),
      (this.pp = null),
      (this.mp = !1),
      (this.bp = null),
      (this.wp = null),
      (this.kv = !1),
      (this.yv = () => {
        this.kv || this.gp === null || this.Hi().Nh();
      }),
      (this.Tv = () => {
        this.kv || this.gp === null || this.Hi().Nh();
      }),
      (this.Mp = t),
      (this.gp = i),
      this.gp.I_().l(this.xp.bind(this), this, !0),
      (this.Sp = document.createElement("td")),
      (this.Sp.style.padding = "0"),
      (this.Sp.style.position = "relative");
    const s = document.createElement("div");
    (s.style.width = "100%"),
      (s.style.height = "100%"),
      (s.style.position = "relative"),
      (s.style.overflow = "hidden"),
      (this.kp = document.createElement("td")),
      (this.kp.style.padding = "0"),
      (this.yp = document.createElement("td")),
      (this.yp.style.padding = "0"),
      this.Sp.appendChild(s),
      (this.Vv = U(s, S({ width: 16, height: 16 }))),
      this.Vv.subscribeSuggestedBitmapSizeChanged(this.yv);
    const e = this.Vv.canvasElement;
    (e.style.position = "absolute"),
      (e.style.zIndex = "1"),
      (e.style.left = "0"),
      (e.style.top = "0"),
      (this.Bv = U(s, S({ width: 16, height: 16 }))),
      this.Bv.subscribeSuggestedBitmapSizeChanged(this.Tv);
    const n = this.Bv.canvasElement;
    (n.style.position = "absolute"),
      (n.style.zIndex = "2"),
      (n.style.left = "0"),
      (n.style.top = "0"),
      (this.Cp = document.createElement("tr")),
      this.Cp.appendChild(this.kp),
      this.Cp.appendChild(this.Sp),
      this.Cp.appendChild(this.yp),
      this.Tp(),
      (this.jv = new bi(this.Bv.canvasElement, this, {
        Ff: () => this.pp === null && !this.Mp.W().handleScroll.vertTouchDrag,
        Wf: () => this.pp === null && !this.Mp.W().handleScroll.horzTouchDrag,
      }));
  }
  S() {
    this.ap !== null && this.ap.S(),
      this.op !== null && this.op.S(),
      this.Bv.unsubscribeSuggestedBitmapSizeChanged(this.Tv),
      Z(this.Bv.canvasElement),
      this.Bv.dispose(),
      this.Vv.unsubscribeSuggestedBitmapSizeChanged(this.yv),
      Z(this.Vv.canvasElement),
      this.Vv.dispose(),
      this.gp !== null && this.gp.I_().p(this),
      this.jv.S();
  }
  Zv() {
    return p(this.gp);
  }
  Pp(t) {
    this.gp !== null && this.gp.I_().p(this),
      (this.gp = t),
      this.gp !== null && this.gp.I_().l(gi.prototype.xp.bind(this), this, !0),
      this.Tp();
  }
  Cv() {
    return this.Mp;
  }
  Hv() {
    return this.Cp;
  }
  Tp() {
    if (this.gp !== null && (this.Rp(), this.Hi().wt().length !== 0)) {
      if (this.ap !== null) {
        const t = this.gp.S_();
        this.ap.Zi(p(t));
      }
      if (this.op !== null) {
        const t = this.gp.k_();
        this.op.Zi(p(t));
      }
    }
  }
  Dp() {
    this.ap !== null && this.ap.bt(), this.op !== null && this.op.bt();
  }
  v_() {
    return this.gp !== null ? this.gp.v_() : 0;
  }
  p_(t) {
    this.gp && this.gp.p_(t);
  }
  If(t) {
    if (!this.gp) return;
    this.Op();
    const i = t.localX,
      s = t.localY;
    this.Ap(i, s, t);
  }
  tv(t) {
    this.Op(), this.Vp(), this.Ap(t.localX, t.localY, t);
  }
  zf(t) {
    var i;
    if (!this.gp) return;
    this.Op();
    const s = t.localX,
      e = t.localY;
    this.Ap(s, e, t);
    const n = this.pr(s, e);
    this.Mp.Bp(
      (i = n == null ? void 0 : n.wv) !== null && i !== void 0 ? i : null
    ),
      this.Hi().Ic(n && { zc: n.zc, mv: n.mv });
  }
  Kf(t) {
    this.gp !== null && (this.Op(), this.Ip(t));
  }
  Pf(t) {
    this.gp !== null && this.zp(this.dp, t);
  }
  kf(t) {
    this.Pf(t);
  }
  $f(t) {
    this.Op(), this.Lp(t), this.Ap(t.localX, t.localY, t);
  }
  Xf(t) {
    this.gp !== null && (this.Op(), (this.vp = !1), this.Ep(t));
  }
  Yf(t) {
    this.gp !== null && this.Ip(t);
  }
  uv(t) {
    if (((this.vp = !0), this.pp === null)) {
      const i = { x: t.localX, y: t.localY };
      this.Np(i, i, t);
    }
  }
  _v(t) {
    this.gp !== null && (this.Op(), this.gp.$t().Ic(null), this.Fp());
  }
  Wp() {
    return this.cp;
  }
  jp() {
    return this.dp;
  }
  ev() {
    (this.fp = 1), this.Hi().Hn();
  }
  rv(t, i) {
    if (!this.Mp.W().handleScale.pinch) return;
    const s = 5 * (i - this.fp);
    (this.fp = i), this.Hi().qc(t.nt, s);
  }
  Jf(t) {
    (this.vp = !1), (this.mp = this.pp !== null), this.Vp();
    const i = this.Hi().Wc();
    this.pp !== null &&
      i.yt() &&
      ((this.bp = { x: i.Yt(), y: i.Xt() }),
      (this.pp = { x: t.localX, y: t.localY }));
  }
  jf(t) {
    if (this.gp === null) return;
    const i = t.localX,
      s = t.localY;
    if (this.pp === null) this.Lp(t);
    else {
      this.mp = !1;
      const e = p(this.bp),
        n = e.x + (i - this.pp.x),
        r = e.y + (s - this.pp.y);
      this.Ap(n, r, t);
    }
  }
  qf(t) {
    this.Cv().W().trackingMode.exitMode === 0 && (this.mp = !0),
      this.Hp(),
      this.Ep(t);
  }
  pr(t, i) {
    const s = this.gp;
    return s === null
      ? null
      : (function (e, n, r) {
          const o = e.No(),
            l = (function (a, u, c) {
              var d, f;
              let m, v;
              for (const w of a) {
                const y =
                  (f =
                    (d = w.oa) === null || d === void 0
                      ? void 0
                      : d.call(w, u, c)) !== null && f !== void 0
                    ? f
                    : [];
                for (const _ of y)
                  (b = _.zOrder),
                    (!(g = m == null ? void 0 : m.zOrder) ||
                      (b === "top" && g !== "top") ||
                      (b === "normal" && g === "bottom")) &&
                      ((m = _), (v = w));
              }
              var b, g;
              return m && v ? { bv: m, zc: v } : null;
            })(o, n, r);
          if ((l == null ? void 0 : l.bv.zOrder) === "top") return _t(l);
          for (const a of o) {
            if (
              l &&
              l.zc === a &&
              l.bv.zOrder !== "bottom" &&
              !l.bv.isBackground
            )
              return _t(l);
            const u = Ih(a.Cn(e), n, r);
            if (u !== null) return { zc: a, vv: u.vv, mv: u.mv };
            if (
              l &&
              l.zc === a &&
              l.bv.zOrder !== "bottom" &&
              l.bv.isBackground
            )
              return _t(l);
          }
          return l != null && l.bv ? _t(l) : null;
        })(s, t, i);
  }
  $p(t, i) {
    p(i === "left" ? this.ap : this.op).Xv(
      S({ width: t, height: this.gv.height })
    );
  }
  Up() {
    return this.gv;
  }
  Xv(t) {
    F(this.gv, t) ||
      ((this.gv = t),
      (this.kv = !0),
      this.Vv.resizeCanvasElement(t),
      this.Bv.resizeCanvasElement(t),
      (this.kv = !1),
      (this.Sp.style.width = t.width + "px"),
      (this.Sp.style.height = t.height + "px"));
  }
  qp() {
    const t = p(this.gp);
    t.x_(t.S_()), t.x_(t.k_());
    for (const i of t.Ta())
      if (t.ur(i)) {
        const s = i.Dt();
        s !== null && t.x_(s), i.Rn();
      }
  }
  ep() {
    return this.Vv.bitmapSize;
  }
  rp(t, i, s) {
    const e = this.ep();
    e.width > 0 && e.height > 0 && t.drawImage(this.Vv.canvasElement, i, s);
  }
  Gv(t) {
    if (t === 0 || this.gp === null) return;
    if (
      (t > 1 && this.qp(),
      this.ap !== null && this.ap.Gv(t),
      this.op !== null && this.op.Gv(t),
      t !== 1)
    ) {
      this.Vv.applySuggestedBitmapSize();
      const s = H(this.Vv);
      s !== null &&
        (s.useBitmapCoordinateSpace((e) => {
          this.Qv(e);
        }),
        this.gp &&
          (this.Yp(s, Dh),
          this.Xp(s),
          this.Kp(s),
          this.Yp(s, St),
          this.Yp(s, Vh)));
    }
    this.Bv.applySuggestedBitmapSize();
    const i = H(this.Bv);
    i !== null &&
      (i.useBitmapCoordinateSpace(({ context: s, bitmapSize: e }) => {
        s.clearRect(0, 0, e.width, e.height);
      }),
      this.Zp(i),
      this.Yp(i, Ah));
  }
  Gp() {
    return this.ap;
  }
  Jp() {
    return this.op;
  }
  tp(t, i) {
    this.Yp(t, i);
  }
  xp() {
    this.gp !== null && this.gp.I_().p(this), (this.gp = null);
  }
  Ip(t) {
    this.zp(this.cp, t);
  }
  zp(t, i) {
    const s = i.localX,
      e = i.localY;
    t.M() && t.m(this.Hi().St().Vu(s), { x: s, y: e }, i);
  }
  Qv({ context: t, bitmapSize: i }) {
    const { width: s, height: e } = i,
      n = this.Hi(),
      r = n.q(),
      o = n._d();
    r === o ? Et(t, 0, 0, s, e, o) : ys(t, 0, 0, s, e, r, o);
  }
  Xp(t) {
    const i = p(this.gp).z_().Fh().gt();
    i !== null && i.K(t, !1);
  }
  Kp(t) {
    const i = this.Hi().Fc();
    this.Qp(t, St, ri, i), this.Qp(t, St, Mt, i);
  }
  Zp(t) {
    this.Qp(t, St, Mt, this.Hi().Wc());
  }
  Yp(t, i) {
    const s = p(this.gp).No();
    for (const e of s) this.Qp(t, i, ri, e);
    for (const e of s) this.Qp(t, i, Mt, e);
  }
  Qp(t, i, s, e) {
    const n = p(this.gp),
      r = n.$t().Bc(),
      o = r !== null && r.zc === e,
      l = r !== null && o && r.mv !== void 0 ? r.mv.br : void 0;
    oi(i, (a) => s(a, t, o, l), e, n);
  }
  Rp() {
    if (this.gp === null) return;
    const t = this.Mp,
      i = this.gp.S_().W().visible,
      s = this.gp.k_().W().visible;
    i ||
      this.ap === null ||
      (this.kp.removeChild(this.ap.Hv()), this.ap.S(), (this.ap = null)),
      s ||
        this.op === null ||
        (this.yp.removeChild(this.op.Hv()), this.op.S(), (this.op = null));
    const e = t.$t().ed();
    i &&
      this.ap === null &&
      ((this.ap = new rs(this, t.W(), e, "left")),
      this.kp.appendChild(this.ap.Hv())),
      s &&
        this.op === null &&
        ((this.op = new rs(this, t.W(), e, "right")),
        this.yp.appendChild(this.op.Hv()));
  }
  tm(t) {
    return (t.cv && this.vp) || this.pp !== null;
  }
  im(t) {
    return Math.max(0, Math.min(t, this.gv.width - 1));
  }
  nm(t) {
    return Math.max(0, Math.min(t, this.gv.height - 1));
  }
  Ap(t, i, s) {
    this.Hi().Qc(this.im(t), this.nm(i), s, p(this.gp));
  }
  Fp() {
    this.Hi().nd();
  }
  Hp() {
    this.mp && ((this.pp = null), this.Fp());
  }
  Np(t, i, s) {
    (this.pp = t), (this.mp = !1), this.Ap(i.x, i.y, s);
    const e = this.Hi().Wc();
    this.bp = { x: e.Yt(), y: e.Xt() };
  }
  Hi() {
    return this.Mp.$t();
  }
  Ep(t) {
    if (!this.up) return;
    const i = this.Hi(),
      s = this.Zv();
    if (
      (i.D_(s, s.dn()),
      (this._p = null),
      (this.up = !1),
      i.Zc(),
      this.wp !== null)
    ) {
      const e = performance.now(),
        n = i.St();
      this.wp.Pr(n.Lu(), e), this.wp.Yu(e) || i.qn(this.wp);
    }
  }
  Op() {
    this.pp = null;
  }
  Vp() {
    if (this.gp) {
      if (
        (this.Hi().Hn(),
        document.activeElement !== document.body &&
          document.activeElement !== document.documentElement)
      )
        p(document.activeElement).blur();
      else {
        const t = document.getSelection();
        t !== null && t.removeAllRanges();
      }
      !this.gp.dn().Ei() && this.Hi().St().Ei();
    }
  }
  Lp(t) {
    if (this.gp === null) return;
    const i = this.Hi(),
      s = i.St();
    if (s.Ei()) return;
    const e = this.Mp.W(),
      n = e.handleScroll,
      r = e.kineticScroll;
    if (
      (!n.pressedMouseMove || t.cv) &&
      ((!n.horzTouchDrag && !n.vertTouchDrag) || !t.cv)
    )
      return;
    const o = this.gp.dn(),
      l = performance.now();
    if (
      (this._p !== null ||
        this.tm(t) ||
        (this._p = {
          x: t.clientX,
          y: t.clientY,
          yd: l,
          sm: t.localX,
          rm: t.localY,
        }),
      this._p !== null &&
        !this.up &&
        (this._p.x !== t.clientX || this._p.y !== t.clientY))
    ) {
      if ((t.cv && r.touch) || (!t.cv && r.mouse)) {
        const a = s.ee();
        (this.wp = new Ph(0.2 / a, 7 / a, 0.997, 15 / a)),
          this.wp.Fd(s.Lu(), this._p.yd);
      } else this.wp = null;
      o.Ei() || i.P_(this.gp, o, t.localY), i.Xc(t.localX), (this.up = !0);
    }
    this.up &&
      (o.Ei() || i.R_(this.gp, o, t.localY),
      i.Kc(t.localX),
      this.wp !== null && this.wp.Fd(s.Lu(), l));
  }
}
class os {
  constructor(t, i, s, e, n) {
    (this.ft = !0),
      (this.gv = S({ width: 0, height: 0 })),
      (this.yv = () => this.Gv(3)),
      (this.Pv = t === "left"),
      (this.yc = s.ed),
      (this._n = i),
      (this.hm = e),
      (this.lm = n),
      (this.Av = document.createElement("div")),
      (this.Av.style.width = "25px"),
      (this.Av.style.height = "100%"),
      (this.Av.style.overflow = "hidden"),
      (this.Vv = U(this.Av, S({ width: 16, height: 16 }))),
      this.Vv.subscribeSuggestedBitmapSizeChanged(this.yv);
  }
  S() {
    this.Vv.unsubscribeSuggestedBitmapSizeChanged(this.yv),
      Z(this.Vv.canvasElement),
      this.Vv.dispose();
  }
  Hv() {
    return this.Av;
  }
  Up() {
    return this.gv;
  }
  Xv(t) {
    F(this.gv, t) ||
      ((this.gv = t),
      this.Vv.resizeCanvasElement(t),
      (this.Av.style.width = `${t.width}px`),
      (this.Av.style.height = `${t.height}px`),
      (this.ft = !0));
  }
  Gv(t) {
    if ((t < 3 && !this.ft) || this.gv.width === 0 || this.gv.height === 0)
      return;
    (this.ft = !1), this.Vv.applySuggestedBitmapSize();
    const i = H(this.Vv);
    i !== null &&
      i.useBitmapCoordinateSpace((s) => {
        this.Qv(s), this.Ae(s);
      });
  }
  ep() {
    return this.Vv.bitmapSize;
  }
  rp(t, i, s) {
    const e = this.ep();
    e.width > 0 && e.height > 0 && t.drawImage(this.Vv.canvasElement, i, s);
  }
  Ae({
    context: t,
    bitmapSize: i,
    horizontalPixelRatio: s,
    verticalPixelRatio: e,
  }) {
    if (!this.hm()) return;
    t.fillStyle = this._n.timeScale.borderColor;
    const n = Math.floor(this.yc.W().C * s),
      r = Math.floor(this.yc.W().C * e),
      o = this.Pv ? i.width - n : 0;
    t.fillRect(o, 0, n, r);
  }
  Qv({ context: t, bitmapSize: i }) {
    Et(t, 0, 0, i.width, i.height, this.lm());
  }
}
function wi(h) {
  return (t) => {
    var i, s;
    return (s = (i = t.aa) === null || i === void 0 ? void 0 : i.call(t, h)) !==
      null && s !== void 0
      ? s
      : [];
  };
}
const $h = wi("normal"),
  Fh = wi("top"),
  Hh = wi("bottom");
class jh {
  constructor(t, i) {
    (this.am = null),
      (this.om = null),
      (this.k = null),
      (this._m = !1),
      (this.gv = S({ width: 0, height: 0 })),
      (this.um = new M()),
      (this.xv = new lt(5)),
      (this.kv = !1),
      (this.yv = () => {
        this.kv || this.Mp.$t().Nh();
      }),
      (this.Tv = () => {
        this.kv || this.Mp.$t().Nh();
      }),
      (this.Mp = t),
      (this.N_ = i),
      (this._n = t.W().layout),
      (this.dm = document.createElement("tr")),
      (this.fm = document.createElement("td")),
      (this.fm.style.padding = "0"),
      (this.vm = document.createElement("td")),
      (this.vm.style.padding = "0"),
      (this.Av = document.createElement("td")),
      (this.Av.style.height = "25px"),
      (this.Av.style.padding = "0"),
      (this.pm = document.createElement("div")),
      (this.pm.style.width = "100%"),
      (this.pm.style.height = "100%"),
      (this.pm.style.position = "relative"),
      (this.pm.style.overflow = "hidden"),
      this.Av.appendChild(this.pm),
      (this.Vv = U(this.pm, S({ width: 16, height: 16 }))),
      this.Vv.subscribeSuggestedBitmapSizeChanged(this.yv);
    const s = this.Vv.canvasElement;
    (s.style.position = "absolute"),
      (s.style.zIndex = "1"),
      (s.style.left = "0"),
      (s.style.top = "0"),
      (this.Bv = U(this.pm, S({ width: 16, height: 16 }))),
      this.Bv.subscribeSuggestedBitmapSizeChanged(this.Tv);
    const e = this.Bv.canvasElement;
    (e.style.position = "absolute"),
      (e.style.zIndex = "2"),
      (e.style.left = "0"),
      (e.style.top = "0"),
      this.dm.appendChild(this.fm),
      this.dm.appendChild(this.Av),
      this.dm.appendChild(this.vm),
      this.bm(),
      this.Mp.$t().f_().l(this.bm.bind(this), this),
      (this.jv = new bi(this.Bv.canvasElement, this, {
        Ff: () => !0,
        Wf: () => !this.Mp.W().handleScroll.horzTouchDrag,
      }));
  }
  S() {
    this.jv.S(),
      this.am !== null && this.am.S(),
      this.om !== null && this.om.S(),
      this.Bv.unsubscribeSuggestedBitmapSizeChanged(this.Tv),
      Z(this.Bv.canvasElement),
      this.Bv.dispose(),
      this.Vv.unsubscribeSuggestedBitmapSizeChanged(this.yv),
      Z(this.Vv.canvasElement),
      this.Vv.dispose();
  }
  Hv() {
    return this.dm;
  }
  wm() {
    return this.am;
  }
  gm() {
    return this.om;
  }
  tv(t) {
    if (this._m) return;
    this._m = !0;
    const i = this.Mp.$t();
    !i.St().Ei() &&
      this.Mp.W().handleScale.axisPressedMouseMove.time &&
      i.Uc(t.localX);
  }
  Jf(t) {
    this.tv(t);
  }
  iv() {
    const t = this.Mp.$t();
    !t.St().Ei() &&
      this._m &&
      ((this._m = !1),
      this.Mp.W().handleScale.axisPressedMouseMove.time && t.Jc());
  }
  $f(t) {
    const i = this.Mp.$t();
    !i.St().Ei() &&
      this.Mp.W().handleScale.axisPressedMouseMove.time &&
      i.Gc(t.localX);
  }
  jf(t) {
    this.$f(t);
  }
  Xf() {
    this._m = !1;
    const t = this.Mp.$t();
    (t.St().Ei() && !this.Mp.W().handleScale.axisPressedMouseMove.time) ||
      t.Jc();
  }
  qf() {
    this.Xf();
  }
  Pf() {
    this.Mp.W().handleScale.axisDoubleClickReset.time && this.Mp.$t().Xn();
  }
  kf() {
    this.Pf();
  }
  If() {
    this.Mp.$t().W().handleScale.axisPressedMouseMove.time && this.hp(1);
  }
  _v() {
    this.hp(0);
  }
  Up() {
    return this.gv;
  }
  Mm() {
    return this.um;
  }
  xm(t, i, s) {
    F(this.gv, t) ||
      ((this.gv = t),
      (this.kv = !0),
      this.Vv.resizeCanvasElement(t),
      this.Bv.resizeCanvasElement(t),
      (this.kv = !1),
      (this.Av.style.width = `${t.width}px`),
      (this.Av.style.height = `${t.height}px`),
      this.um.m(t)),
      this.am !== null && this.am.Xv(S({ width: i, height: t.height })),
      this.om !== null && this.om.Xv(S({ width: s, height: t.height }));
  }
  Sm() {
    const t = this.km();
    return Math.ceil(t.C + t.T + t.P + t.L + t.V + t.ym);
  }
  bt() {
    this.Mp.$t().St().La();
  }
  ep() {
    return this.Vv.bitmapSize;
  }
  rp(t, i, s) {
    const e = this.ep();
    e.width > 0 && e.height > 0 && t.drawImage(this.Vv.canvasElement, i, s);
  }
  Gv(t) {
    if (t === 0) return;
    if (t !== 1) {
      this.Vv.applySuggestedBitmapSize();
      const s = H(this.Vv);
      s !== null &&
        (s.useBitmapCoordinateSpace((e) => {
          this.Qv(e), this.Ae(e), this.Cm(s, Hh);
        }),
        this.ip(s),
        this.Cm(s, $h)),
        this.am !== null && this.am.Gv(t),
        this.om !== null && this.om.Gv(t);
    }
    this.Bv.applySuggestedBitmapSize();
    const i = H(this.Bv);
    i !== null &&
      (i.useBitmapCoordinateSpace(({ context: s, bitmapSize: e }) => {
        s.clearRect(0, 0, e.width, e.height);
      }),
      this.Tm([...this.Mp.$t().wt(), this.Mp.$t().Wc()], i),
      this.Cm(i, Fh));
  }
  Cm(t, i) {
    const s = this.Mp.$t().wt();
    for (const e of s) oi(i, (n) => ri(n, t, !1, void 0), e, void 0);
    for (const e of s) oi(i, (n) => Mt(n, t, !1, void 0), e, void 0);
  }
  Qv({ context: t, bitmapSize: i }) {
    Et(t, 0, 0, i.width, i.height, this.Mp.$t()._d());
  }
  Ae({ context: t, bitmapSize: i, verticalPixelRatio: s }) {
    if (this.Mp.W().timeScale.borderVisible) {
      t.fillStyle = this.Pm();
      const e = Math.max(1, Math.floor(this.km().C * s));
      t.fillRect(0, 0, i.width, e);
    }
  }
  ip(t) {
    const i = this.Mp.$t().St(),
      s = i.La();
    if (!s || s.length === 0) return;
    const e = this.N_.maxTickMarkWeight(s),
      n = this.km(),
      r = i.W();
    r.borderVisible &&
      r.ticksVisible &&
      t.useBitmapCoordinateSpace(
        ({ context: o, horizontalPixelRatio: l, verticalPixelRatio: a }) => {
          (o.strokeStyle = this.Pm()), (o.fillStyle = this.Pm());
          const u = Math.max(1, Math.floor(l)),
            c = Math.floor(0.5 * l);
          o.beginPath();
          const d = Math.round(n.T * a);
          for (let f = s.length; f--; ) {
            const m = Math.round(s[f].coord * l);
            o.rect(m - c, 0, u, d);
          }
          o.fill();
        }
      ),
      t.useMediaCoordinateSpace(({ context: o }) => {
        const l = n.C + n.T + n.L + n.P / 2;
        (o.textAlign = "center"),
          (o.textBaseline = "middle"),
          (o.fillStyle = this.$()),
          (o.font = this.qv());
        for (const a of s)
          if (a.weight < e) {
            const u = a.needAlignCoordinate
              ? this.Rm(o, a.coord, a.label)
              : a.coord;
            o.fillText(a.label, u, l);
          }
        this.Mp.W().timeScale.allowBoldLabels && (o.font = this.Dm());
        for (const a of s)
          if (a.weight >= e) {
            const u = a.needAlignCoordinate
              ? this.Rm(o, a.coord, a.label)
              : a.coord;
            o.fillText(a.label, u, l);
          }
      });
  }
  Rm(t, i, s) {
    const e = this.xv.Mi(t, s),
      n = e / 2,
      r = Math.floor(i - n) + 0.5;
    return (
      r < 0
        ? (i += Math.abs(0 - r))
        : r + e > this.gv.width && (i -= Math.abs(this.gv.width - (r + e))),
      i
    );
  }
  Tm(t, i) {
    const s = this.km();
    for (const e of t) for (const n of e.Ji()) n.gt().K(i, s);
  }
  Pm() {
    return this.Mp.W().timeScale.borderColor;
  }
  $() {
    return this._n.textColor;
  }
  j() {
    return this._n.fontSize;
  }
  qv() {
    return K(this.j(), this._n.fontFamily);
  }
  Dm() {
    return K(this.j(), this._n.fontFamily, "bold");
  }
  km() {
    this.k === null &&
      (this.k = {
        C: 1,
        N: NaN,
        L: NaN,
        V: NaN,
        Wi: NaN,
        T: 5,
        P: NaN,
        R: "",
        Fi: new lt(),
        ym: 0,
      });
    const t = this.k,
      i = this.qv();
    if (t.R !== i) {
      const s = this.j();
      (t.P = s),
        (t.R = i),
        (t.L = (3 * s) / 12),
        (t.V = (3 * s) / 12),
        (t.Wi = (9 * s) / 12),
        (t.N = 0),
        (t.ym = (4 * s) / 12),
        t.Fi.Qe();
    }
    return this.k;
  }
  hp(t) {
    this.Av.style.cursor = t === 1 ? "ew-resize" : "default";
  }
  bm() {
    const t = this.Mp.$t(),
      i = t.W();
    i.leftPriceScale.visible ||
      this.am === null ||
      (this.fm.removeChild(this.am.Hv()), this.am.S(), (this.am = null)),
      i.rightPriceScale.visible ||
        this.om === null ||
        (this.vm.removeChild(this.om.Hv()), this.om.S(), (this.om = null));
    const s = { ed: this.Mp.$t().ed() },
      e = () => i.leftPriceScale.borderVisible && t.St().W().borderVisible,
      n = () => t._d();
    i.leftPriceScale.visible &&
      this.am === null &&
      ((this.am = new os("left", i, s, e, n)),
      this.fm.appendChild(this.am.Hv())),
      i.rightPriceScale.visible &&
        this.om === null &&
        ((this.om = new os("right", i, s, e, n)),
        this.vm.appendChild(this.om.Hv()));
  }
}
const Uh =
  !!G &&
  !!navigator.userAgentData &&
  navigator.userAgentData.brands.some((h) => h.brand.includes("Chromium")) &&
  !!G &&
  (!(
    (Gt = navigator == null ? void 0 : navigator.userAgentData) === null ||
    Gt === void 0
  ) && Gt.platform
    ? navigator.userAgentData.platform === "Windows"
    : navigator.userAgent.toLowerCase().indexOf("win") >= 0);
var Gt;
class Zh {
  constructor(t, i, s) {
    var e;
    (this.Om = []),
      (this.Am = 0),
      (this.Qa = 0),
      (this.e_ = 0),
      (this.Vm = 0),
      (this.Bm = 0),
      (this.Im = null),
      (this.zm = !1),
      (this.cp = new M()),
      (this.dp = new M()),
      (this.xc = new M()),
      (this.Lm = null),
      (this.Em = null),
      (this.Nm = t),
      (this._n = i),
      (this.N_ = s),
      (this.dm = document.createElement("div")),
      this.dm.classList.add("tv-lightweight-charts"),
      (this.dm.style.overflow = "hidden"),
      (this.dm.style.direction = "ltr"),
      (this.dm.style.width = "100%"),
      (this.dm.style.height = "100%"),
      ((e = this.dm).style.userSelect = "none"),
      (e.style.webkitUserSelect = "none"),
      (e.style.msUserSelect = "none"),
      (e.style.MozUserSelect = "none"),
      (e.style.webkitTapHighlightColor = "transparent"),
      (this.Fm = document.createElement("table")),
      this.Fm.setAttribute("cellspacing", "0"),
      this.dm.appendChild(this.Fm),
      (this.Wm = this.jm.bind(this)),
      ti(this._n) && this.Hm(!0),
      (this.Hi = new kh(this.kc.bind(this), this._n, s)),
      this.$t().jc().l(this.$m.bind(this), this),
      (this.Um = new jh(this, this.N_)),
      this.Fm.appendChild(this.Um.Hv());
    const n = i.autoSize && this.qm();
    let r = this._n.width,
      o = this._n.height;
    if (n || r === 0 || o === 0) {
      const l = t.getBoundingClientRect();
      (r = r || l.width), (o = o || l.height);
    }
    this.Ym(r, o),
      this.Xm(),
      t.appendChild(this.dm),
      this.Km(),
      this.Hi.St().Gu().l(this.Hi.$l.bind(this.Hi), this),
      this.Hi.f_().l(this.Hi.$l.bind(this.Hi), this);
  }
  $t() {
    return this.Hi;
  }
  W() {
    return this._n;
  }
  Zm() {
    return this.Om;
  }
  Gm() {
    return this.Um;
  }
  S() {
    this.Hm(!1),
      this.Am !== 0 && window.cancelAnimationFrame(this.Am),
      this.Hi.jc().p(this),
      this.Hi.St().Gu().p(this),
      this.Hi.f_().p(this),
      this.Hi.S();
    for (const t of this.Om)
      this.Fm.removeChild(t.Hv()), t.Wp().p(this), t.jp().p(this), t.S();
    (this.Om = []),
      p(this.Um).S(),
      this.dm.parentElement !== null &&
        this.dm.parentElement.removeChild(this.dm),
      this.xc.S(),
      this.cp.S(),
      this.dp.S(),
      this.Jm();
  }
  Ym(t, i, s = !1) {
    if (this.Qa === i && this.e_ === t) return;
    const e = (function (o) {
      const l = Math.floor(o.width),
        a = Math.floor(o.height);
      return S({ width: l - (l % 2), height: a - (a % 2) });
    })(S({ width: t, height: i }));
    (this.Qa = e.height), (this.e_ = e.width);
    const n = this.Qa + "px",
      r = this.e_ + "px";
    (p(this.dm).style.height = n),
      (p(this.dm).style.width = r),
      (this.Fm.style.height = n),
      (this.Fm.style.width = r),
      s ? this.Qm(x.ns(), performance.now()) : this.Hi.$l();
  }
  Gv(t) {
    t === void 0 && (t = x.ns());
    for (let i = 0; i < this.Om.length; i++) this.Om[i].Gv(t.Wn(i).En);
    this._n.timeScale.visible && this.Um.Gv(t.Fn());
  }
  Eh(t) {
    const i = ti(this._n);
    this.Hi.Eh(t);
    const s = ti(this._n);
    s !== i && this.Hm(s), this.Km(), this.tb(t);
  }
  Wp() {
    return this.cp;
  }
  jp() {
    return this.dp;
  }
  jc() {
    return this.xc;
  }
  ib() {
    this.Im !== null && (this.Qm(this.Im, performance.now()), (this.Im = null));
    const t = this.nb(null),
      i = document.createElement("canvas");
    (i.width = t.width), (i.height = t.height);
    const s = p(i.getContext("2d"));
    return this.nb(s), i;
  }
  sb(t) {
    return (t === "left" && !this.eb()) ||
      (t === "right" && !this.rb()) ||
      this.Om.length === 0
      ? 0
      : p(t === "left" ? this.Om[0].Gp() : this.Om[0].Jp()).Kv();
  }
  hb() {
    return this._n.autoSize && this.Lm !== null;
  }
  lb() {
    return this.dm;
  }
  Bp(t) {
    (this.Em = t),
      this.Em
        ? this.lb().style.setProperty("cursor", t)
        : this.lb().style.removeProperty("cursor");
  }
  ab() {
    return this.Em;
  }
  ob() {
    return E(this.Om[0]).Up();
  }
  tb(t) {
    (t.autoSize !== void 0 ||
      !this.Lm ||
      (t.width === void 0 && t.height === void 0)) &&
      (t.autoSize && !this.Lm && this.qm(),
      t.autoSize === !1 && this.Lm !== null && this.Jm(),
      t.autoSize ||
        (t.width === void 0 && t.height === void 0) ||
        this.Ym(t.width || this.e_, t.height || this.Qa));
  }
  nb(t) {
    let i = 0,
      s = 0;
    const e = this.Om[0],
      n = (o, l) => {
        let a = 0;
        for (let u = 0; u < this.Om.length; u++) {
          const c = this.Om[u],
            d = p(o === "left" ? c.Gp() : c.Jp()),
            f = d.ep();
          t !== null && d.rp(t, l, a), (a += f.height);
        }
      };
    this.eb() && (n("left", 0), (i += p(e.Gp()).ep().width));
    for (let o = 0; o < this.Om.length; o++) {
      const l = this.Om[o],
        a = l.ep();
      t !== null && l.rp(t, i, s), (s += a.height);
    }
    (i += e.ep().width),
      this.rb() && (n("right", i), (i += p(e.Jp()).ep().width));
    const r = (o, l, a) => {
      p(o === "left" ? this.Um.wm() : this.Um.gm()).rp(p(t), l, a);
    };
    if (this._n.timeScale.visible) {
      const o = this.Um.ep();
      if (t !== null) {
        let l = 0;
        this.eb() && (r("left", l, s), (l = p(e.Gp()).ep().width)),
          this.Um.rp(t, l, s),
          (l += o.width),
          this.rb() && r("right", l, s);
      }
      s += o.height;
    }
    return S({ width: i, height: s });
  }
  _b() {
    let t = 0,
      i = 0,
      s = 0;
    for (const m of this.Om)
      this.eb() &&
        (i = Math.max(i, p(m.Gp()).Uv(), this._n.leftPriceScale.minimumWidth)),
        this.rb() &&
          (s = Math.max(
            s,
            p(m.Jp()).Uv(),
            this._n.rightPriceScale.minimumWidth
          )),
        (t += m.v_());
    (i = ni(i)), (s = ni(s));
    const e = this.e_,
      n = this.Qa,
      r = Math.max(e - i - s, 0),
      o = this._n.timeScale.visible;
    let l = o ? Math.max(this.Um.Sm(), this._n.timeScale.minimumHeight) : 0;
    var a;
    l = (a = l) + (a % 2);
    const u = 0 + l,
      c = n < u ? 0 : n - u,
      d = c / t;
    let f = 0;
    for (let m = 0; m < this.Om.length; ++m) {
      const v = this.Om[m];
      v.Pp(this.Hi.Nc()[m]);
      let b = 0,
        g = 0;
      (g = m === this.Om.length - 1 ? c - f : Math.round(v.v_() * d)),
        (b = Math.max(g, 2)),
        (f += b),
        v.Xv(S({ width: r, height: b })),
        this.eb() && v.$p(i, "left"),
        this.rb() && v.$p(s, "right"),
        v.Zv() && this.Hi.Hc(v.Zv(), b);
    }
    this.Um.xm(S({ width: o ? r : 0, height: l }), o ? i : 0, o ? s : 0),
      this.Hi.m_(r),
      this.Vm !== i && (this.Vm = i),
      this.Bm !== s && (this.Bm = s);
  }
  Hm(t) {
    t
      ? this.dm.addEventListener("wheel", this.Wm, { passive: !1 })
      : this.dm.removeEventListener("wheel", this.Wm);
  }
  ub(t) {
    switch (t.deltaMode) {
      case t.DOM_DELTA_PAGE:
        return 120;
      case t.DOM_DELTA_LINE:
        return 32;
    }
    return Uh ? 1 / window.devicePixelRatio : 1;
  }
  jm(t) {
    if (
      !(
        (t.deltaX !== 0 && this._n.handleScroll.mouseWheel) ||
        (t.deltaY !== 0 && this._n.handleScale.mouseWheel)
      )
    )
      return;
    const i = this.ub(t),
      s = (i * t.deltaX) / 100,
      e = (-i * t.deltaY) / 100;
    if (
      (t.cancelable && t.preventDefault(),
      e !== 0 && this._n.handleScale.mouseWheel)
    ) {
      const n = Math.sign(e) * Math.min(1, Math.abs(e)),
        r = t.clientX - this.dm.getBoundingClientRect().left;
      this.$t().qc(r, n);
    }
    s !== 0 && this._n.handleScroll.mouseWheel && this.$t().Yc(-80 * s);
  }
  Qm(t, i) {
    var s;
    const e = t.Fn();
    e === 3 && this.cb(),
      (e !== 3 && e !== 2) ||
        (this.fb(t),
        this.vb(t, i),
        this.Um.bt(),
        this.Om.forEach((n) => {
          n.Dp();
        }),
        ((s = this.Im) === null || s === void 0 ? void 0 : s.Fn()) === 3 &&
          (this.Im.Jn(t),
          this.cb(),
          this.fb(this.Im),
          this.vb(this.Im, i),
          (t = this.Im),
          (this.Im = null))),
      this.Gv(t);
  }
  vb(t, i) {
    for (const s of t.Gn()) this.Qn(s, i);
  }
  fb(t) {
    const i = this.Hi.Nc();
    for (let s = 0; s < i.length; s++) t.Wn(s).Nn && i[s].V_();
  }
  Qn(t, i) {
    const s = this.Hi.St();
    switch (t.$n) {
      case 0:
        s.Qu();
        break;
      case 1:
        s.tc(t.Ot);
        break;
      case 2:
        s.Kn(t.Ot);
        break;
      case 3:
        s.Zn(t.Ot);
        break;
      case 4:
        s.Fu();
        break;
      case 5:
        t.Ot.Yu(i) || s.Zn(t.Ot.Xu(i));
    }
  }
  kc(t) {
    this.Im !== null ? this.Im.Jn(t) : (this.Im = t),
      this.zm ||
        ((this.zm = !0),
        (this.Am = window.requestAnimationFrame((i) => {
          if (((this.zm = !1), (this.Am = 0), this.Im !== null)) {
            const s = this.Im;
            (this.Im = null), this.Qm(s, i);
            for (const e of s.Gn())
              if (e.$n === 5 && !e.Ot.Yu(i)) {
                this.$t().qn(e.Ot);
                break;
              }
          }
        })));
  }
  cb() {
    this.Xm();
  }
  Xm() {
    const t = this.Hi.Nc(),
      i = t.length,
      s = this.Om.length;
    for (let e = i; e < s; e++) {
      const n = E(this.Om.pop());
      this.Fm.removeChild(n.Hv()), n.Wp().p(this), n.jp().p(this), n.S();
    }
    for (let e = s; e < i; e++) {
      const n = new gi(this, t[e]);
      n.Wp().l(this.pb.bind(this), this),
        n.jp().l(this.mb.bind(this), this),
        this.Om.push(n),
        this.Fm.insertBefore(n.Hv(), this.Um.Hv());
    }
    for (let e = 0; e < i; e++) {
      const n = t[e],
        r = this.Om[e];
      r.Zv() !== n ? r.Pp(n) : r.Tp();
    }
    this.Km(), this._b();
  }
  bb(t, i, s) {
    var e;
    const n = new Map();
    t !== null &&
      this.Hi.wt().forEach((u) => {
        const c = u.Vn().il(t);
        c !== null && n.set(u, c);
      });
    let r;
    if (t !== null) {
      const u =
        (e = this.Hi.St().$i(t)) === null || e === void 0
          ? void 0
          : e.originalTime;
      u !== void 0 && (r = u);
    }
    const o = this.$t().Bc(),
      l = o !== null && o.zc instanceof vi ? o.zc : void 0,
      a = o !== null && o.mv !== void 0 ? o.mv.mr : void 0;
    return {
      wb: r,
      ie: t ?? void 0,
      gb: i ?? void 0,
      Mb: l,
      xb: n,
      Sb: a,
      kb: s ?? void 0,
    };
  }
  pb(t, i, s) {
    this.cp.m(() => this.bb(t, i, s));
  }
  mb(t, i, s) {
    this.dp.m(() => this.bb(t, i, s));
  }
  $m(t, i, s) {
    this.xc.m(() => this.bb(t, i, s));
  }
  Km() {
    const t = this._n.timeScale.visible ? "" : "none";
    this.Um.Hv().style.display = t;
  }
  eb() {
    return this.Om[0].Zv().S_().W().visible;
  }
  rb() {
    return this.Om[0].Zv().k_().W().visible;
  }
  qm() {
    return (
      "ResizeObserver" in window &&
      ((this.Lm = new ResizeObserver((t) => {
        const i = t.find((s) => s.target === this.Nm);
        i && this.Ym(i.contentRect.width, i.contentRect.height);
      })),
      this.Lm.observe(this.Nm, { box: "border-box" }),
      !0)
    );
  }
  Jm() {
    this.Lm !== null && this.Lm.disconnect(), (this.Lm = null);
  }
}
function ti(h) {
  return !!(h.handleScroll.mouseWheel || h.handleScale.mouseWheel);
}
function $s(h, t) {
  var i = {};
  for (var s in h)
    Object.prototype.hasOwnProperty.call(h, s) &&
      t.indexOf(s) < 0 &&
      (i[s] = h[s]);
  if (h != null && typeof Object.getOwnPropertySymbols == "function") {
    var e = 0;
    for (s = Object.getOwnPropertySymbols(h); e < s.length; e++)
      t.indexOf(s[e]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(h, s[e]) &&
        (i[s[e]] = h[s[e]]);
  }
  return i;
}
function ls(h, t, i, s) {
  const e = i.value,
    n = { ie: t, ot: h, Ot: [e, e, e, e], wb: s };
  return i.color !== void 0 && (n.O = i.color), n;
}
function Yh(h, t, i, s) {
  const e = i.value,
    n = { ie: t, ot: h, Ot: [e, e, e, e], wb: s };
  return (
    i.lineColor !== void 0 && (n.lt = i.lineColor),
    i.topColor !== void 0 && (n.ys = i.topColor),
    i.bottomColor !== void 0 && (n.Cs = i.bottomColor),
    n
  );
}
function Qh(h, t, i, s) {
  const e = i.value,
    n = { ie: t, ot: h, Ot: [e, e, e, e], wb: s };
  return (
    i.topLineColor !== void 0 && (n.Ce = i.topLineColor),
    i.bottomLineColor !== void 0 && (n.Te = i.bottomLineColor),
    i.topFillColor1 !== void 0 && (n.Me = i.topFillColor1),
    i.topFillColor2 !== void 0 && (n.xe = i.topFillColor2),
    i.bottomFillColor1 !== void 0 && (n.Se = i.bottomFillColor1),
    i.bottomFillColor2 !== void 0 && (n.ke = i.bottomFillColor2),
    n
  );
}
function Xh(h, t, i, s) {
  const e = { ie: t, ot: h, Ot: [i.open, i.high, i.low, i.close], wb: s };
  return i.color !== void 0 && (e.O = i.color), e;
}
function qh(h, t, i, s) {
  const e = { ie: t, ot: h, Ot: [i.open, i.high, i.low, i.close], wb: s };
  return (
    i.color !== void 0 && (e.O = i.color),
    i.borderColor !== void 0 && (e.At = i.borderColor),
    i.wickColor !== void 0 && (e.Hh = i.wickColor),
    e
  );
}
function Jh(h, t, i, s, e) {
  const n = E(e)(i),
    r = Math.max(...n),
    o = Math.min(...n),
    l = n[n.length - 1],
    a = [l, r, o, l],
    u = i,
    { time: c, color: d } = u;
  return { ie: t, ot: h, Ot: a, wb: s, We: $s(u, ["time", "color"]), O: d };
}
function yt(h) {
  return h.Ot !== void 0;
}
function as(h, t) {
  return t.customValues !== void 0 && (h.yb = t.customValues), h;
}
function $(h) {
  return (t, i, s, e, n, r) =>
    (function (o, l) {
      return l ? l(o) : (a = o).open === void 0 && a.value === void 0;
      var a;
    })(s, r)
      ? as({ ot: t, ie: i, wb: e }, s)
      : as(h(t, i, s, e, n), s);
}
function us(h) {
  return {
    Candlestick: $(qh),
    Bar: $(Xh),
    Area: $(Yh),
    Baseline: $(Qh),
    Histogram: $(ls),
    Line: $(ls),
    Custom: $(Jh),
  }[h];
}
function cs(h) {
  return { ie: 0, Cb: new Map(), ia: h };
}
function ds(h, t) {
  if (h !== void 0 && h.length !== 0)
    return { Tb: t.key(h[0].ot), Pb: t.key(h[h.length - 1].ot) };
}
function fs(h) {
  let t;
  return (
    h.forEach((i) => {
      t === void 0 && (t = i.wb);
    }),
    E(t)
  );
}
class Kh {
  constructor(t) {
    (this.Rb = new Map()),
      (this.Db = new Map()),
      (this.Ob = new Map()),
      (this.Ab = []),
      (this.N_ = t);
  }
  S() {
    this.Rb.clear(), this.Db.clear(), this.Ob.clear(), (this.Ab = []);
  }
  Vb(t, i) {
    let s = this.Rb.size !== 0,
      e = !1;
    const n = this.Db.get(t);
    if (n !== void 0)
      if (this.Db.size === 1) (s = !1), (e = !0), this.Rb.clear();
      else for (const l of this.Ab) l.pointData.Cb.delete(t) && (e = !0);
    let r = [];
    if (i.length !== 0) {
      const l = i.map((f) => f.time),
        a = this.N_.createConverterToInternalObj(i),
        u = us(t.Yh()),
        c = t.ga(),
        d = t.Ma();
      r = i.map((f, m) => {
        const v = a(f.time),
          b = this.N_.key(v);
        let g = this.Rb.get(b);
        g === void 0 && ((g = cs(v)), this.Rb.set(b, g), (e = !0));
        const w = u(v, g.ie, f, l[m], c, d);
        return g.Cb.set(t, w), w;
      });
    }
    s && this.Bb(), this.Ib(t, r);
    let o = -1;
    if (e) {
      const l = [];
      this.Rb.forEach((a) => {
        l.push({
          timeWeight: 0,
          time: a.ia,
          pointData: a,
          originalTime: fs(a.Cb),
        });
      }),
        l.sort((a, u) => this.N_.key(a.time) - this.N_.key(u.time)),
        (o = this.zb(l));
    }
    return this.Lb(
      t,
      o,
      (function (l, a, u) {
        const c = ds(l, u),
          d = ds(a, u);
        if (c !== void 0 && d !== void 0)
          return { Xl: c.Pb >= d.Pb && c.Tb >= d.Tb };
      })(this.Db.get(t), n, this.N_)
    );
  }
  ld(t) {
    return this.Vb(t, []);
  }
  Eb(t, i) {
    const s = i;
    (function (v) {
      v.wb === void 0 && (v.wb = v.time);
    })(s),
      this.N_.preprocessData(i);
    const e = this.N_.createConverterToInternalObj([i])(i.time),
      n = this.Ob.get(t);
    if (n !== void 0 && this.N_.key(e) < this.N_.key(n))
      throw new Error(
        `Cannot update oldest data, last time=${n}, new time=${e}`
      );
    let r = this.Rb.get(this.N_.key(e));
    const o = r === void 0;
    r === void 0 && ((r = cs(e)), this.Rb.set(this.N_.key(e), r));
    const l = us(t.Yh()),
      a = t.ga(),
      u = t.Ma(),
      c = l(e, r.ie, i, s.wb, a, u);
    r.Cb.set(t, c), this.Nb(t, c);
    const d = { Xl: yt(c) };
    if (!o) return this.Lb(t, -1, d);
    const f = {
        timeWeight: 0,
        time: r.ia,
        pointData: r,
        originalTime: fs(r.Cb),
      },
      m = ct(this.Ab, this.N_.key(f.time), (v, b) => this.N_.key(v.time) < b);
    this.Ab.splice(m, 0, f);
    for (let v = m; v < this.Ab.length; ++v) ii(this.Ab[v].pointData, v);
    return this.N_.fillWeightsForPoints(this.Ab, m), this.Lb(t, m, d);
  }
  Nb(t, i) {
    let s = this.Db.get(t);
    s === void 0 && ((s = []), this.Db.set(t, s));
    const e = s.length !== 0 ? s[s.length - 1] : null;
    e === null || this.N_.key(i.ot) > this.N_.key(e.ot)
      ? yt(i) && s.push(i)
      : yt(i)
      ? (s[s.length - 1] = i)
      : s.splice(-1, 1),
      this.Ob.set(t, i.ot);
  }
  Ib(t, i) {
    i.length !== 0
      ? (this.Db.set(t, i.filter(yt)), this.Ob.set(t, i[i.length - 1].ot))
      : (this.Db.delete(t), this.Ob.delete(t));
  }
  Bb() {
    for (const t of this.Ab)
      t.pointData.Cb.size === 0 && this.Rb.delete(this.N_.key(t.time));
  }
  zb(t) {
    let i = -1;
    for (let s = 0; s < this.Ab.length && s < t.length; ++s) {
      const e = this.Ab[s],
        n = t[s];
      if (this.N_.key(e.time) !== this.N_.key(n.time)) {
        i = s;
        break;
      }
      (n.timeWeight = e.timeWeight), ii(n.pointData, s);
    }
    if (
      (i === -1 &&
        this.Ab.length !== t.length &&
        (i = Math.min(this.Ab.length, t.length)),
      i === -1)
    )
      return -1;
    for (let s = i; s < t.length; ++s) ii(t[s].pointData, s);
    return this.N_.fillWeightsForPoints(t, i), (this.Ab = t), i;
  }
  Fb() {
    if (this.Db.size === 0) return null;
    let t = 0;
    return (
      this.Db.forEach((i) => {
        i.length !== 0 && (t = Math.max(t, i[i.length - 1].ie));
      }),
      t
    );
  }
  Lb(t, i, s) {
    const e = { Wb: new Map(), St: { Au: this.Fb() } };
    if (i !== -1)
      this.Db.forEach((n, r) => {
        e.Wb.set(r, { We: n, jb: r === t ? s : void 0 });
      }),
        this.Db.has(t) || e.Wb.set(t, { We: [], jb: s }),
        (e.St.Hb = this.Ab),
        (e.St.$b = i);
    else {
      const n = this.Db.get(t);
      e.Wb.set(t, { We: n || [], jb: s });
    }
    return e;
  }
}
function ii(h, t) {
  (h.ie = t),
    h.Cb.forEach((i) => {
      i.ie = t;
    });
}
function _i(h) {
  const t = { value: h.Ot[3], time: h.wb };
  return h.yb !== void 0 && (t.customValues = h.yb), t;
}
function ms(h) {
  const t = _i(h);
  return h.O !== void 0 && (t.color = h.O), t;
}
function Gh(h) {
  const t = _i(h);
  return (
    h.lt !== void 0 && (t.lineColor = h.lt),
    h.ys !== void 0 && (t.topColor = h.ys),
    h.Cs !== void 0 && (t.bottomColor = h.Cs),
    t
  );
}
function tn(h) {
  const t = _i(h);
  return (
    h.Ce !== void 0 && (t.topLineColor = h.Ce),
    h.Te !== void 0 && (t.bottomLineColor = h.Te),
    h.Me !== void 0 && (t.topFillColor1 = h.Me),
    h.xe !== void 0 && (t.topFillColor2 = h.xe),
    h.Se !== void 0 && (t.bottomFillColor1 = h.Se),
    h.ke !== void 0 && (t.bottomFillColor2 = h.ke),
    t
  );
}
function Fs(h) {
  const t = {
    open: h.Ot[0],
    high: h.Ot[1],
    low: h.Ot[2],
    close: h.Ot[3],
    time: h.wb,
  };
  return h.yb !== void 0 && (t.customValues = h.yb), t;
}
function sn(h) {
  const t = Fs(h);
  return h.O !== void 0 && (t.color = h.O), t;
}
function en(h) {
  const t = Fs(h),
    { O: i, At: s, Hh: e } = h;
  return (
    i !== void 0 && (t.color = i),
    s !== void 0 && (t.borderColor = s),
    e !== void 0 && (t.wickColor = e),
    t
  );
}
function li(h) {
  return {
    Area: Gh,
    Line: ms,
    Baseline: tn,
    Histogram: ms,
    Bar: sn,
    Candlestick: en,
    Custom: hn,
  }[h];
}
function hn(h) {
  const t = h.wb;
  return Object.assign(Object.assign({}, h.We), { time: t });
}
const nn = {
    vertLine: {
      color: "#9598A1",
      width: 1,
      style: 3,
      visible: !0,
      labelVisible: !0,
      labelBackgroundColor: "#131722",
    },
    horzLine: {
      color: "#9598A1",
      width: 1,
      style: 3,
      visible: !0,
      labelVisible: !0,
      labelBackgroundColor: "#131722",
    },
    mode: 1,
  },
  rn = {
    vertLines: { color: "#D6DCDE", style: 0, visible: !0 },
    horzLines: { color: "#D6DCDE", style: 0, visible: !0 },
  },
  on = {
    background: { type: "solid", color: "#FFFFFF" },
    textColor: "#191919",
    fontSize: 12,
    fontFamily: ai,
  },
  si = {
    autoScale: !0,
    mode: 0,
    invertScale: !1,
    alignLabels: !0,
    borderVisible: !0,
    borderColor: "#2B2B43",
    entireTextOnly: !1,
    visible: !1,
    ticksVisible: !1,
    scaleMargins: { bottom: 0.1, top: 0.2 },
    minimumWidth: 0,
  },
  ln = {
    rightOffset: 0,
    barSpacing: 6,
    minBarSpacing: 0.5,
    fixLeftEdge: !1,
    fixRightEdge: !1,
    lockVisibleTimeRangeOnResize: !1,
    rightBarStaysOnScroll: !1,
    borderVisible: !0,
    borderColor: "#2B2B43",
    visible: !0,
    timeVisible: !1,
    secondsVisible: !0,
    shiftVisibleRangeOnNewBar: !0,
    allowShiftVisibleRangeOnWhitespaceReplacement: !1,
    ticksVisible: !1,
    uniformDistribution: !1,
    minimumHeight: 0,
    allowBoldLabels: !0,
  },
  an = {
    color: "rgba(0, 0, 0, 0)",
    visible: !1,
    fontSize: 48,
    fontFamily: ai,
    fontStyle: "",
    text: "",
    horzAlign: "center",
    vertAlign: "center",
  };
function vs() {
  return {
    width: 0,
    height: 0,
    autoSize: !1,
    layout: on,
    crosshair: nn,
    grid: rn,
    overlayPriceScales: Object.assign({}, si),
    leftPriceScale: Object.assign(Object.assign({}, si), { visible: !1 }),
    rightPriceScale: Object.assign(Object.assign({}, si), { visible: !0 }),
    timeScale: ln,
    watermark: an,
    localization: {
      locale: G ? navigator.language : "",
      dateFormat: "dd MMM 'yy",
    },
    handleScroll: {
      mouseWheel: !0,
      pressedMouseMove: !0,
      horzTouchDrag: !0,
      vertTouchDrag: !0,
    },
    handleScale: {
      axisPressedMouseMove: { time: !0, price: !0 },
      axisDoubleClickReset: { time: !0, price: !0 },
      mouseWheel: !0,
      pinch: !0,
    },
    kineticScroll: { mouse: !1, touch: !0 },
    trackingMode: { exitMode: 1 },
  };
}
class un {
  constructor(t, i) {
    (this.Ub = t), (this.qb = i);
  }
  applyOptions(t) {
    this.Ub.$t().Lc(this.qb, t);
  }
  options() {
    return this.zi().W();
  }
  width() {
    return kt(this.qb) ? this.Ub.sb(this.qb) : 0;
  }
  zi() {
    return p(this.Ub.$t().Ec(this.qb)).Dt;
  }
}
function ps(h, t, i) {
  const s = $s(h, ["time", "originalTime"]),
    e = Object.assign({ time: t }, s);
  return i !== void 0 && (e.originalTime = i), e;
}
const cn = {
  color: "#FF0000",
  price: 0,
  lineStyle: 2,
  lineWidth: 1,
  lineVisible: !0,
  axisLabelVisible: !0,
  title: "",
  axisLabelColor: "",
  axisLabelTextColor: "",
};
class dn {
  constructor(t) {
    this.Vh = t;
  }
  applyOptions(t) {
    this.Vh.Eh(t);
  }
  options() {
    return this.Vh.W();
  }
  Yb() {
    return this.Vh;
  }
}
class fn {
  constructor(t, i, s, e, n) {
    (this.Xb = new M()),
      (this.Is = t),
      (this.Kb = i),
      (this.Zb = s),
      (this.N_ = n),
      (this.Gb = e);
  }
  S() {
    this.Xb.S();
  }
  priceFormatter() {
    return this.Is.ca();
  }
  priceToCoordinate(t) {
    const i = this.Is.Ct();
    return i === null ? null : this.Is.Dt().Rt(t, i.Ot);
  }
  coordinateToPrice(t) {
    const i = this.Is.Ct();
    return i === null ? null : this.Is.Dt().fn(t, i.Ot);
  }
  barsInLogicalRange(t) {
    if (t === null) return null;
    const i = new J(new nt(t.from, t.to)).iu(),
      s = this.Is.Vn();
    if (s.Ei()) return null;
    const e = s.il(i.Rs(), 1),
      n = s.il(i.ui(), -1),
      r = p(s.Jh()),
      o = p(s.An());
    if (e !== null && n !== null && e.ie > n.ie)
      return { barsBefore: t.from - r, barsAfter: o - t.to };
    const l = {
      barsBefore: e === null || e.ie === r ? t.from - r : e.ie - r,
      barsAfter: n === null || n.ie === o ? o - t.to : o - n.ie,
    };
    return e !== null && n !== null && ((l.from = e.wb), (l.to = n.wb)), l;
  }
  setData(t) {
    this.N_, this.Is.Yh(), this.Kb.Jb(this.Is, t), this.Qb("full");
  }
  update(t) {
    this.Is.Yh(), this.Kb.tw(this.Is, t), this.Qb("update");
  }
  dataByIndex(t, i) {
    const s = this.Is.Vn().il(t, i);
    return s === null ? null : li(this.seriesType())(s);
  }
  data() {
    const t = li(this.seriesType());
    return this.Is.Vn()
      .Qs()
      .map((i) => t(i));
  }
  subscribeDataChanged(t) {
    this.Xb.l(t);
  }
  unsubscribeDataChanged(t) {
    this.Xb.v(t);
  }
  setMarkers(t) {
    this.N_;
    const i = t.map((s) =>
      ps(s, this.N_.convertHorzItemToInternal(s.time), s.time)
    );
    this.Is.Zl(i);
  }
  markers() {
    return this.Is.Gl().map((t) => ps(t, t.originalTime, void 0));
  }
  applyOptions(t) {
    this.Is.Eh(t);
  }
  options() {
    return W(this.Is.W());
  }
  priceScale() {
    return this.Zb.priceScale(this.Is.Dt().xa());
  }
  createPriceLine(t) {
    const i = R(W(cn), t),
      s = this.Is.Jl(i);
    return new dn(s);
  }
  removePriceLine(t) {
    this.Is.Ql(t.Yb());
  }
  seriesType() {
    return this.Is.Yh();
  }
  attachPrimitive(t) {
    this.Is.ba(t),
      t.attached &&
        t.attached({
          chart: this.Gb,
          series: this,
          requestUpdate: () => this.Is.$t().$l(),
        });
  }
  detachPrimitive(t) {
    this.Is.wa(t), t.detached && t.detached();
  }
  Qb(t) {
    this.Xb.M() && this.Xb.m(t);
  }
}
class mn {
  constructor(t, i, s) {
    (this.iw = new M()),
      (this.uu = new M()),
      (this.um = new M()),
      (this.Hi = t),
      (this.wl = t.St()),
      (this.Um = i),
      this.wl.Ku().l(this.nw.bind(this)),
      this.wl.Zu().l(this.sw.bind(this)),
      this.Um.Mm().l(this.ew.bind(this)),
      (this.N_ = s);
  }
  S() {
    this.wl.Ku().p(this),
      this.wl.Zu().p(this),
      this.Um.Mm().p(this),
      this.iw.S(),
      this.uu.S(),
      this.um.S();
  }
  scrollPosition() {
    return this.wl.Lu();
  }
  scrollToPosition(t, i) {
    i ? this.wl.qu(t, 1e3) : this.Hi.Zn(t);
  }
  scrollToRealTime() {
    this.wl.Uu();
  }
  getVisibleRange() {
    const t = this.wl.yu();
    return t === null
      ? null
      : { from: t.from.originalTime, to: t.to.originalTime };
  }
  setVisibleRange(t) {
    const i = {
        from: this.N_.convertHorzItemToInternal(t.from),
        to: this.N_.convertHorzItemToInternal(t.to),
      },
      s = this.wl.Ru(i);
    this.Hi.ad(s);
  }
  getVisibleLogicalRange() {
    const t = this.wl.ku();
    return t === null ? null : { from: t.Rs(), to: t.ui() };
  }
  setVisibleLogicalRange(t) {
    A(t.from <= t.to, "The from index cannot be after the to index."),
      this.Hi.ad(t);
  }
  resetTimeScale() {
    this.Hi.Xn();
  }
  fitContent() {
    this.Hi.Qu();
  }
  logicalToCoordinate(t) {
    const i = this.Hi.St();
    return i.Ei() ? null : i.It(t);
  }
  coordinateToLogical(t) {
    return this.wl.Ei() ? null : this.wl.Vu(t);
  }
  timeToCoordinate(t) {
    const i = this.N_.convertHorzItemToInternal(t),
      s = this.wl.ya(i, !1);
    return s === null ? null : this.wl.It(s);
  }
  coordinateToTime(t) {
    const i = this.Hi.St(),
      s = i.Vu(t),
      e = i.$i(s);
    return e === null ? null : e.originalTime;
  }
  width() {
    return this.Um.Up().width;
  }
  height() {
    return this.Um.Up().height;
  }
  subscribeVisibleTimeRangeChange(t) {
    this.iw.l(t);
  }
  unsubscribeVisibleTimeRangeChange(t) {
    this.iw.v(t);
  }
  subscribeVisibleLogicalRangeChange(t) {
    this.uu.l(t);
  }
  unsubscribeVisibleLogicalRangeChange(t) {
    this.uu.v(t);
  }
  subscribeSizeChange(t) {
    this.um.l(t);
  }
  unsubscribeSizeChange(t) {
    this.um.v(t);
  }
  applyOptions(t) {
    this.wl.Eh(t);
  }
  options() {
    return Object.assign(Object.assign({}, W(this.wl.W())), {
      barSpacing: this.wl.ee(),
    });
  }
  nw() {
    this.iw.M() && this.iw.m(this.getVisibleRange());
  }
  sw() {
    this.uu.M() && this.uu.m(this.getVisibleLogicalRange());
  }
  ew(t) {
    this.um.m(t.width, t.height);
  }
}
function vn(h) {
  if (h === void 0 || h.type === "custom") return;
  const t = h;
  t.minMove !== void 0 &&
    t.precision === void 0 &&
    (t.precision = (function (i) {
      if (i >= 1) return 0;
      let s = 0;
      for (; s < 8; s++) {
        const e = Math.round(i);
        if (Math.abs(e - i) < 1e-8) return s;
        i *= 10;
      }
      return s;
    })(t.minMove));
}
function bs(h) {
  return (
    (function (t) {
      if (ft(t.handleScale)) {
        const s = t.handleScale;
        t.handleScale = {
          axisDoubleClickReset: { time: s, price: s },
          axisPressedMouseMove: { time: s, price: s },
          mouseWheel: s,
          pinch: s,
        };
      } else if (t.handleScale !== void 0) {
        const { axisPressedMouseMove: s, axisDoubleClickReset: e } =
          t.handleScale;
        ft(s) && (t.handleScale.axisPressedMouseMove = { time: s, price: s }),
          ft(e) && (t.handleScale.axisDoubleClickReset = { time: e, price: e });
      }
      const i = t.handleScroll;
      ft(i) &&
        (t.handleScroll = {
          horzTouchDrag: i,
          vertTouchDrag: i,
          mouseWheel: i,
          pressedMouseMove: i,
        });
    })(h),
    h
  );
}
class pn {
  constructor(t, i, s) {
    (this.rw = new Map()),
      (this.hw = new Map()),
      (this.lw = new M()),
      (this.aw = new M()),
      (this.ow = new M()),
      (this._w = new Kh(i));
    const e = s === void 0 ? W(vs()) : R(W(vs()), bs(s));
    (this.N_ = i),
      (this.Ub = new Zh(t, e, i)),
      this.Ub.Wp().l((r) => {
        this.lw.M() && this.lw.m(this.uw(r()));
      }, this),
      this.Ub.jp().l((r) => {
        this.aw.M() && this.aw.m(this.uw(r()));
      }, this),
      this.Ub.jc().l((r) => {
        this.ow.M() && this.ow.m(this.uw(r()));
      }, this);
    const n = this.Ub.$t();
    this.cw = new mn(n, this.Ub.Gm(), this.N_);
  }
  remove() {
    this.Ub.Wp().p(this),
      this.Ub.jp().p(this),
      this.Ub.jc().p(this),
      this.cw.S(),
      this.Ub.S(),
      this.rw.clear(),
      this.hw.clear(),
      this.lw.S(),
      this.aw.S(),
      this.ow.S(),
      this._w.S();
  }
  resize(t, i, s) {
    this.autoSizeActive() || this.Ub.Ym(t, i, s);
  }
  addCustomSeries(t, i) {
    const s = X(t),
      e = Object.assign(Object.assign({}, gs), s.defaultOptions());
    return this.dw("Custom", e, i, s);
  }
  addAreaSeries(t) {
    return this.dw("Area", te, t);
  }
  addBaselineSeries(t) {
    return this.dw("Baseline", ie, t);
  }
  addBarSeries(t) {
    return this.dw("Bar", Ks, t);
  }
  addCandlestickSeries(t = {}) {
    return (
      (function (i) {
        i.borderColor !== void 0 &&
          ((i.borderUpColor = i.borderColor),
          (i.borderDownColor = i.borderColor)),
          i.wickColor !== void 0 &&
            ((i.wickUpColor = i.wickColor), (i.wickDownColor = i.wickColor));
      })(t),
      this.dw("Candlestick", Js, t)
    );
  }
  addHistogramSeries(t) {
    return this.dw("Histogram", se, t);
  }
  addLineSeries(t) {
    return this.dw("Line", Gs, t);
  }
  removeSeries(t) {
    const i = E(this.rw.get(t)),
      s = this._w.ld(i);
    this.Ub.$t().ld(i), this.fw(s), this.rw.delete(t), this.hw.delete(i);
  }
  Jb(t, i) {
    this.fw(this._w.Vb(t, i));
  }
  tw(t, i) {
    this.fw(this._w.Eb(t, i));
  }
  subscribeClick(t) {
    this.lw.l(t);
  }
  unsubscribeClick(t) {
    this.lw.v(t);
  }
  subscribeCrosshairMove(t) {
    this.ow.l(t);
  }
  unsubscribeCrosshairMove(t) {
    this.ow.v(t);
  }
  subscribeDblClick(t) {
    this.aw.l(t);
  }
  unsubscribeDblClick(t) {
    this.aw.v(t);
  }
  priceScale(t) {
    return new un(this.Ub, t);
  }
  timeScale() {
    return this.cw;
  }
  applyOptions(t) {
    this.Ub.Eh(bs(t));
  }
  options() {
    return this.Ub.W();
  }
  takeScreenshot() {
    return this.Ub.ib();
  }
  autoSizeActive() {
    return this.Ub.hb();
  }
  chartElement() {
    return this.Ub.lb();
  }
  paneSize() {
    const t = this.Ub.ob();
    return { height: t.height, width: t.width };
  }
  setCrosshairPosition(t, i, s) {
    const e = this.rw.get(s);
    if (e === void 0) return;
    const n = this.Ub.$t()._r(e);
    n !== null && this.Ub.$t().td(t, i, n);
  }
  clearCrosshairPosition() {
    this.Ub.$t().nd(!0);
  }
  dw(t, i, s = {}, e) {
    vn(s.priceFormat);
    const n = R(W(ws), W(i), s),
      r = this.Ub.$t().rd(t, n, e),
      o = new fn(r, this, this, this, this.N_);
    return this.rw.set(o, r), this.hw.set(r, o), o;
  }
  fw(t) {
    const i = this.Ub.$t();
    i.sd(t.St.Au, t.St.Hb, t.St.$b),
      t.Wb.forEach((s, e) => e.J(s.We, s.jb)),
      i.Iu();
  }
  pw(t) {
    return E(this.hw.get(t));
  }
  uw(t) {
    const i = new Map();
    t.xb.forEach((e, n) => {
      const r = n.Yh(),
        o = li(r)(e);
      if (r !== "Custom")
        A(
          (function (l) {
            return l.open !== void 0 || l.value !== void 0;
          })(o)
        );
      else {
        const l = n.Ma();
        A(!l || l(o) === !1);
      }
      i.set(this.pw(n), o);
    });
    const s = t.Mb === void 0 ? void 0 : this.pw(t.Mb);
    return {
      time: t.wb,
      logical: t.ie,
      point: t.gb,
      hoveredSeries: s,
      hoveredObjectId: t.Sb,
      seriesData: i,
      sourceEvent: t.kb,
    };
  }
}
function bn(h, t, i) {
  let s;
  if (ut(h)) {
    const n = document.getElementById(h);
    A(n !== null, `Cannot find element in DOM with id=${h}`), (s = n);
  } else s = h;
  const e = new pn(s, t, i);
  return t.setOptions(e.options()), e;
}
function gn(h, t) {
  return bn(h, new es(), es.Pd(t));
}
const wn = Object.assign(Object.assign({}, ws), gs);
export {
  Qi as A,
  qi as B,
  Vs as E,
  hi as L,
  wn as P,
  gn as T,
  Ri as a,
  Oi as d,
  $i as z,
};
