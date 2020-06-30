(my["webpackJsonp"] = my["webpackJsonp"] || []).push([["npm/taro-listview/dist/weapp/components/skeleton/index"],{

/***/ "./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js?!./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=script&parse=COMPONENT&":
/*!************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js??ref--6-0!./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=script&parse=COMPONENT& ***!
  \************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _taroAlipay = __webpack_require__(/*! @tarojs/taro-alipay */ "./node_modules/@tarojs/taro-alipay/index.js");

var _taroAlipay2 = _interopRequireDefault(_taroAlipay);

__webpack_require__(/*! ./index.scss */ "./node_modules/taro-listview/dist/weapp/components/skeleton/index.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var Skeleton = /** @class */function () {
  var _class, _temp2;

  var Skeleton = (_temp2 = _class = function (_BaseComponent) {
    _inherits(Skeleton, _BaseComponent);

    function Skeleton() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Skeleton);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Skeleton.__proto__ || Object.getPrototypeOf(Skeleton)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "loopArray61", "loopArray62", "loopArray63", "isLoaded", "bg", "list", "listRadius", "parentRect", "selector", "children"], _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Skeleton, [{
      key: "_constructor",
      value: function _constructor() {
        _get(Skeleton.prototype.__proto__ || Object.getPrototypeOf(Skeleton.prototype), "_constructor", this).apply(this, arguments);
        this.state = {
          parentRect: {},
          bg: [],
          list: [],
          listRadius: []
        };
        this.$$refs = new _taroAlipay2.default.RefsArray();
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        if (_taroAlipay2.default.getEnv() === 'WEAPP') {
          this.weappSkl();
        } else {
          this.h5Skl();
        }
      }
    }, {
      key: "h5Skl",
      value: function h5Skl() {
        var _this2 = this;

        var selObj = {
          bg: '.skeleton-bg',
          list: '.skeleton-rect',
          listRadius: '.skeleton-radius'
        };
        var selAll = function selAll(selector) {
          var list = [];
          document.querySelectorAll(selObj[selector]).forEach(function (i) {
            // @ts-ignore
            list.push(i.getBoundingClientRect());
          });
          // @ts-ignore
          _this2.setState(_defineProperty({}, selector, list));
        };
        //todo 渲染完毕
        setTimeout(function () {
          var selector = _this2.props.selector;
          // @ts-ignore

          var dom = document.querySelector(selector);
          if (dom) {
            var rect = dom.getBoundingClientRect();
            var parentStyle = {};
            Object.keys(rect.toJSON()).forEach(function (i) {
              parentStyle[i] = rect[i] + "px";
            });
            _this2.setState({
              parentRect: parentStyle
            });
            selAll('bg');
            selAll('list');
            selAll('listRadius');
          }
        }, 300);
      }
    }, {
      key: "weappSkl",
      value: function weappSkl() {
        var _this3 = this;

        var selector = this.props.selector;

        _taroAlipay2.default.createSelectorQuery().selectAll(selector + " >>> .skeleton-bg").boundingClientRect().exec(function (res) {
          _this3.setState({ bg: res[0] });
        });
        _taroAlipay2.default.createSelectorQuery().selectAll(selector + " >>> .skeleton-rect").boundingClientRect().exec(function (res) {
          _this3.setState({ list: res[0] });
        });
        _taroAlipay2.default.createSelectorQuery().selectAll(selector + " >>> .skeleton-radius").boundingClientRect().exec(function (res) {
          _this3.setState({ listRadius: res[0] });
        });
      }
    }, {
      key: "_createData",
      value: function _createData() {
        this.__state = arguments[0] || this.state || {};
        this.__props = arguments[1] || this.props || {};
        var __isRunloopRef = arguments[2];
        var __prefix = this.$prefix;
        ;

        var _state = this.__state,
            list = _state.list,
            bg = _state.bg,
            listRadius = _state.listRadius,
            parentRect = _state.parentRect;
        var isLoaded = this.__props.isLoaded; // 是否加载完成

        var anonymousState__temp = (0, _taroAlipay.internal_inline_style)({ opacity: isLoaded ? 1 : 0 });
        var anonymousState__temp2 = (0, _taroAlipay.internal_inline_style)(_extends({}, parentRect, { backgroundColor: 'white', position: 'fixed', overflow: 'hidden' }));
        var loopArray61 = !isLoaded ? bg.map(function (item, _anonIdx) {
          item = {
            $original: (0, _taroAlipay.internal_get_original)(item)
          };

          var _item$$original = item.$original,
              width = _item$$original.width,
              height = _item$$original.height,
              top = _item$$original.top,
              left = _item$$original.left;

          var $loopState__temp4 = (0, _taroAlipay.internal_inline_style)({
            background: 'white',
            width: width + "px",
            height: height + "px",
            top: top + "px",
            left: left + "px",
            position: 'fixed'
          });
          return {
            width: width,
            height: height,
            top: top,
            left: left,
            $loopState__temp4: $loopState__temp4,
            $original: item.$original
          };
        }) : [];
        var loopArray62 = !isLoaded ? list.map(function (item, _anonIdx3) {
          item = {
            $original: (0, _taroAlipay.internal_get_original)(item)
          };

          var _item$$original2 = item.$original,
              width = _item$$original2.width,
              height = _item$$original2.height,
              top = _item$$original2.top,
              left = _item$$original2.left;

          var $loopState__temp6 = (0, _taroAlipay.internal_inline_style)({
            width: width + "px",
            height: height + "px",
            top: top + "px",
            left: left + "px",
            position: 'fixed'
          });
          return {
            width: width,
            height: height,
            top: top,
            left: left,
            $loopState__temp6: $loopState__temp6,
            $original: item.$original
          };
        }) : [];
        var loopArray63 = !isLoaded ? listRadius.map(function (item, _anonIdx5) {
          item = {
            $original: (0, _taroAlipay.internal_get_original)(item)
          };

          var _item$$original3 = item.$original,
              width = _item$$original3.width,
              height = _item$$original3.height,
              top = _item$$original3.top,
              left = _item$$original3.left;

          var $loopState__temp8 = (0, _taroAlipay.internal_inline_style)({
            borderRadius: '50%',
            width: width + "px",
            height: height + "px",
            top: top + "px",
            left: left + "px",
            position: 'fixed'
          });
          return {
            width: width,
            height: height,
            top: top,
            left: left,
            $loopState__temp8: $loopState__temp8,
            $original: item.$original
          };
        }) : [];
        Object.assign(this.__state, {
          anonymousState__temp: anonymousState__temp,
          anonymousState__temp2: anonymousState__temp2,
          loopArray61: loopArray61,
          loopArray62: loopArray62,
          loopArray63: loopArray63,
          isLoaded: isLoaded
        });
        return this.__state;
      }
    }]);

    return Skeleton;
  }(_taroAlipay.Component), _class.$$events = [], _class.$$componentPath = "node_modules/taro-listview/dist/weapp/components/skeleton/index", _temp2);

  Skeleton.defaultProps = {
    isLoaded: false,
    selector: '.skeleton'
  };
  return Skeleton;
}();
exports.default = Skeleton;

Component(__webpack_require__(/*! @tarojs/taro-alipay */ "./node_modules/@tarojs/taro-alipay/index.js").default.createComponent(Skeleton));

/***/ }),

/***/ "./node_modules/file-loader/dist/cjs.js?name=[path][name].axml&context=/Users/mac/Desktop/personal-store/node_modules&outputPath=npm!./node_modules/@tarojs/mini-runner/dist/loaders/miniTemplateLoader.js!./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js?!./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=template&parse=COMPONENT&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/file-loader/dist/cjs.js?name=[path][name].axml&context=/Users/mac/Desktop/personal-store/node_modules&outputPath=npm!./node_modules/@tarojs/mini-runner/dist/loaders/miniTemplateLoader.js!./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js??ref--6-0!./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=template&parse=COMPONENT& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "npm/taro-listview/dist/weapp/components/skeleton/index.axml";

/***/ }),

/***/ "./node_modules/taro-listview/dist/weapp/components/skeleton/index.scss":
/*!******************************************************************************!*\
  !*** ./node_modules/taro-listview/dist/weapp/components/skeleton/index.scss ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx":
/*!*****************************************************************************!*\
  !*** ./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.tsx?taro&type=template&parse=COMPONENT& */ "./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=template&parse=COMPONENT&");
/* harmony import */ var _index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.tsx?taro&type=script&parse=COMPONENT& */ "./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=script&parse=COMPONENT&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ }),

/***/ "./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=script&parse=COMPONENT&":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=script&parse=COMPONENT& ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js??ref--6-0!./index.tsx?taro&type=script&parse=COMPONENT& */ "./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js?!./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=script&parse=COMPONENT&");
/* harmony import */ var _tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=template&parse=COMPONENT&":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=template&parse=COMPONENT& ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _file_loader_name_path_name_axml_context_Users_mac_Desktop_personal_store_node_modules_outputPath_npm_tarojs_mini_runner_dist_loaders_miniTemplateLoader_js_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!file-loader?name=[path][name].axml&context=/Users/mac/Desktop/personal-store/node_modules&outputPath=npm!../../../../../@tarojs/mini-runner/dist/loaders/miniTemplateLoader.js!../../../../../@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js??ref--6-0!./index.tsx?taro&type=template&parse=COMPONENT& */ "./node_modules/file-loader/dist/cjs.js?name=[path][name].axml&context=/Users/mac/Desktop/personal-store/node_modules&outputPath=npm!./node_modules/@tarojs/mini-runner/dist/loaders/miniTemplateLoader.js!./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js?!./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx?taro&type=template&parse=COMPONENT&");
/* harmony import */ var _file_loader_name_path_name_axml_context_Users_mac_Desktop_personal_store_node_modules_outputPath_npm_tarojs_mini_runner_dist_loaders_miniTemplateLoader_js_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_file_loader_name_path_name_axml_context_Users_mac_Desktop_personal_store_node_modules_outputPath_npm_tarojs_mini_runner_dist_loaders_miniTemplateLoader_js_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _file_loader_name_path_name_axml_context_Users_mac_Desktop_personal_store_node_modules_outputPath_npm_tarojs_mini_runner_dist_loaders_miniTemplateLoader_js_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _file_loader_name_path_name_axml_context_Users_mac_Desktop_personal_store_node_modules_outputPath_npm_tarojs_mini_runner_dist_loaders_miniTemplateLoader_js_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ })

},[["./node_modules/taro-listview/dist/weapp/components/skeleton/index.tsx","runtime","taro","vendors"]]]);