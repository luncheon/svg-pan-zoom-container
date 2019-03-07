var svgPanZoomSelect = (function () {
  'use strict';

  function svgPanZoomSelect(svg, options) {
      return new SvgPanZoomSelect(svg, options);
  }
  var SvgPanZoomSelect = (function () {
      function SvgPanZoomSelect(_svg, _options) {
          var _this = this;
          this._svg = _svg;
          this._options = _options;
          this._panning = false;
          this._offsetX = 0;
          this._offsetY = 0;
          this._scale = 1;
          this._onPointerDown = function (event) {
              if (event.button === 0) {
                  event.preventDefault();
                  _this._selectStartedPoint = { clientX: event.clientX, clientY: event.clientY };
              }
              else if (event.button === 2) {
                  event.preventDefault();
                  _this._panning = true;
              }
          };
          this._onPointerMove = function (event) {
              if (_this._panning) {
                  _this.pan(-event.movementX, -event.movementY);
              }
              if (_this._selectStartedPoint) {
                  var rect = new DOMRect();
                  rect.x = Math.min(_this._selectStartedPoint.clientX, event.clientX);
                  rect.y = Math.min(_this._selectStartedPoint.clientY, event.clientY);
                  rect.width = Math.abs(_this._selectStartedPoint.clientX - event.clientX);
                  rect.height = Math.abs(_this._selectStartedPoint.clientY - event.clientY);
                  _this.selectIntersection(rect);
              }
          };
          this._onPointerUp = function (event) {
              _this._onPointerMove(event);
              _this._panning = false;
              _this._selectStartedPoint = undefined;
          };
          this._onWheel = function (event) {
              event.preventDefault();
              _this.zoom(1 + event.deltaY * .005, event.clientX, event.clientY);
          };
          this._onContextMenu = function (event) {
              event.preventDefault();
          };
          _svg.addEventListener('pointerdown', this._onPointerDown);
          addEventListener('pointerup', this._onPointerUp, true);
          addEventListener('pointermove', this._onPointerMove);
          _svg.addEventListener('wheel', this._onWheel);
          _svg.addEventListener('contextmenu', this._onContextMenu);
          var bbox = _svg.getBBox();
          _svg.setAttribute('viewBox', bbox.x + " " + bbox.y + " " + bbox.width + " " + bbox.height);
      }
      Object.defineProperty(SvgPanZoomSelect.prototype, "svg", {
          get: function () { return this._svg; },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SvgPanZoomSelect.prototype, "offsetX", {
          get: function () { return this._offsetX; },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SvgPanZoomSelect.prototype, "offsetY", {
          get: function () { return this._offsetY; },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SvgPanZoomSelect.prototype, "scale", {
          get: function () { return this._scale; },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SvgPanZoomSelect.prototype, "minScale", {
          get: function () { return this._options.minScale || .01; },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SvgPanZoomSelect.prototype, "maxScale", {
          get: function () { return this._options.maxScale || 100; },
          enumerable: true,
          configurable: true
      });
      SvgPanZoomSelect.prototype.reset = function () {
          this._offsetX = 0;
          this._offsetY = 0;
          this._scale = 1;
          this._redraw();
      };
      SvgPanZoomSelect.prototype.pan = function (deltaX, deltaY) {
          deltaX && (this._offsetX += deltaX);
          deltaY && (this._offsetY += deltaY);
          var limitX = this.svg.clientWidth * this.scale;
          var limitY = this.svg.clientHeight * this.scale;
          this._offsetX = limit(this._offsetX, -limitX, limitX);
          this._offsetY = limit(this._offsetY, -limitY, limitY);
          this._redraw();
      };
      SvgPanZoomSelect.prototype.zoom = function (deltaScale, centerX, centerY) {
          var scale = limit(this._scale * deltaScale, this.minScale, this.maxScale);
          deltaScale = scale / this._scale;
          this._scale = scale;
          var centerOffsetX = centerX - this.svg.clientWidth / 2;
          var centerOffsetY = centerY - this.svg.clientHeight / 2;
          this._offsetX = (this._offsetX + centerOffsetX) * deltaScale - centerOffsetX;
          this._offsetY = (this._offsetY + centerOffsetY) * deltaScale - centerOffsetY;
          this._redraw();
      };
      SvgPanZoomSelect.prototype.selectIntersection = function (area) {
      };
      SvgPanZoomSelect.prototype._redraw = function () {
          this._options.onChange && this._options.onChange(this);
          this.svg.style.transform = "matrix(" + this._scale + ",0,0," + this._scale + "," + -this._offsetX + "," + -this._offsetY + ")";
      };
      return SvgPanZoomSelect;
  }());
  function limit(value, min, max) {
      return value < min ? min : value > max ? max : value;
  }

  return svgPanZoomSelect;

}());
