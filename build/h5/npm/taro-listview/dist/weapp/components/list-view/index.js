(my["webpackJsonp"] = my["webpackJsonp"] || []).push([["npm/taro-listview/dist/weapp/components/list-view/index"],{

/***/ "./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js?!./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=script&parse=COMPONENT&":
/*!*************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js??ref--6-0!./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=script&parse=COMPONENT& ***!
  \*************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _taroAlipay = __webpack_require__(/*! @tarojs/taro-alipay */ "./node_modules/@tarojs/taro-alipay/index.js");

var _taroAlipay2 = _interopRequireDefault(_taroAlipay);

var _tool = __webpack_require__(/*! ./tool */ "./node_modules/taro-listview/dist/weapp/components/list-view/tool.ts");

var _tool2 = _interopRequireDefault(_tool);

var _init = __webpack_require__(/*! ./init */ "./node_modules/taro-listview/dist/weapp/components/list-view/init.tsx");

__webpack_require__(/*! ./index.scss */ "./node_modules/taro-listview/dist/weapp/components/list-view/index.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var ListView = /** @class */function () {
  var _class, _temp2;

  var ListView = (_temp2 = _class = function (_BaseComponent) {
    _inherits(ListView, _BaseComponent);

    function ListView() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, ListView);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ListView.__proto__ || Object.getPrototypeOf(ListView)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "$compid__181", "$compid__182", "$compid__183", "className", "canScrollY", "downLoading", "showChildren", "footerLoading", "customFooterLoading", "footerLoaded", "customFooterLoaded", "dampText", "footerLoadingText", "noMore", "footerLoadedText", "lazy", "needInit", "style", "hasMore", "isEmpty", "emptyText", "isError", "isLoaded", "selector", "launch", "damping", "circleColor", "customizeLoading", "distanceToRefresh", "indicator", "tipFreedText", "tipText", "renderCustomizeLoading", "children", "renderError", "renderEmpty", "renderFooterLoading", "renderFooterLoaded"], _this.touchEvent = function (e) {
        var type = e.type,
            touches = e.touches;
        var _this$props = _this.props,
            onPullDownRefresh = _this$props.onPullDownRefresh,
            distanceToRefresh = _this$props.distanceToRefresh,
            damping = _this$props.damping;

        if (!onPullDownRefresh) {
          return;
        }switch (type) {
          case 'touchstart':
            {
              _this.touchScrollTop = _this.state.scrollTop;
              _this.needPullDown = true, _this.startY = touches[0].clientY;
              break;
            }
          // 拖动方向不符合的不处理
          case 'touchmove':
            {
              var clientY = touches[0].clientY;
              var _this2 = _this,
                  touchScrollTop = _this2.touchScrollTop;

              var height = Math.floor((clientY - _this.startY) / 5);
              if (height < 0 || touchScrollTop > 5) {
                return;
              }e.preventDefault(); // 阻止默认的处理方式(阻止下拉滑动的效果)
              if (height > 0 && height < (damping || 0)) {
                var needPullDown = false;
                if (height < (distanceToRefresh || 0)) {
                  needPullDown = true;
                }
                _this.updateDampText(needPullDown);
                _this.moveBox(height);
              }
              break;
            }
          case 'touchend':
            {
              if (!_this.needPullDown) {
                _this.fetchInit();
              } else {
                _this.resetLoad(0);
              }
              break;
            }
          case 'touchcancel':
            {
              _this.resetLoad(0);
              break;
            }
          default:
            {
              // console.log('foo');
            }
        }
      }, _this.fetchInit = function () {
        var onPullDownRefresh = _this.props.onPullDownRefresh;

        _this.resetLoad(1);
        if (onPullDownRefresh) {
          _this.props.onPullDownRefresh(function () {
            _this.setState({ isInit: true });
            _this.resetLoad(0, function () {
              _this.setState({ isInit: false });
            });
          });
        }
      }, _this.resetLoad = function () {
        var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var cb = arguments[1];

        // status: 0:回复初始值 1：加载中
        // console.log({ status })
        var distanceToRefresh = _this.props.distanceToRefresh;

        var state = {};
        switch (status) {
          case 0:
            state = {
              canScrollY: true,
              downLoading: false
            };
            _this.updateDampText(true);
            _this.moveBox(0);
            break;
          case 1:
            state = {
              canScrollY: false,
              downLoading: true
            };
            _this.updateDampText(false);
            _this.moveBox(distanceToRefresh);
            break;
          default:
        }
        // state = Object.assign({}, state,{ blockStyle });
        // this.moveBox(0);
        _this.setState(state);
        // todo 监听真正动画结束
        setTimeout(function () {
          if (cb) {
            cb();
          }
        }, 400);
      }, _this.handleScrollToLower = function () {
        _tool2.default.debounce(function () {
          _this.getMore();
        })();
      }, _this.getMore = function () {
        var _this$props2 = _this.props,
            onScrollToLower = _this$props2.onScrollToLower,
            hasMore = _this$props2.hasMore;
        var lowerLoading = _this.state.lowerLoading;

        if (hasMore && !lowerLoading && onScrollToLower) {
          _this.setState({ lowerLoading: true });
          _this.props.onScrollToLower(function () {
            _this.setState({ lowerLoading: false });
          });
        }
      }, _this.onScroll = function (e) {
        var scrollTop = e.detail.scrollTop;

        if (_this.props.onScroll) {
          _this.props.onScroll();
        }_this.setState({ scrollTop: scrollTop });
        if (_this.props.lazy) {
          _tool2.default.lazyScroll(_this.lazyKey, _this.lazyClassName, _this.lazyViewHeight);
        }
      }, _this.moveBox = function (y) {
        var transition = y ? 'none' : '300ms linear';
        // console.log({ y })
        if (_taroAlipay2.default.getEnv() === 'WEB') {
          var target = document.getElementById('bodyView');
          target.style.transform = "translate3d(0," + y + "px,0)";
          target.style.transition = transition;
        } else {
          _this.setState({
            canScrollY: !y,
            blockStyle: {
              transform: "translate3d(0," + y + "px,0)",
              transition: transition
            }
          });
        }
      }, _this.updateDampText = function (act) {
        _this.needPullDown = act;
        var _this$state = _this.state,
            isInit = _this$state.isInit,
            downLoading = _this$state.downLoading;

        var showTip = !downLoading && !isInit; // 展示下拉区域文案
        if (!showTip) {
          return '';
        }var _this$props3 = _this.props,
            _this$props3$indicato = _this$props3.indicator,
            indicator = _this$props3$indicato === undefined ? {} : _this$props3$indicato,
            tipFreedText = _this$props3.tipFreedText,
            tipText = _this$props3.tipText;
        var _indicator$activate = indicator.activate,
            activate = _indicator$activate === undefined ? '释放刷新' : _indicator$activate,
            _indicator$deactivate = indicator.deactivate,
            deactivate = _indicator$deactivate === undefined ? '下拉刷新' : _indicator$deactivate;

        var text = '';
        if (act) {
          text = activate || tipText;
        } else {
          text = deactivate || tipFreedText;
        }
        if (_taroAlipay2.default.getEnv() === 'WEB') {
          var target = document.getElementById('tip-dampText');
          target.innerText = text;
        } else {
          _this.setState({ dampText: text });
        }
      }, _this.customComponents = ["Skeleton", "Loading", "ResultPage"], _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ListView, [{
      key: '_constructor',
      value: function _constructor() {
        var _this3 = this;

        _get(ListView.prototype.__proto__ || Object.getPrototypeOf(ListView.prototype), '_constructor', this).apply(this, arguments);
        // eslint-disable-next-line react/sort-comp
        this.lazyClassName = function () {
          return typeof _this3.props.lazy === 'boolean' ? '.lazy-view' : _this3.props.lazy;
        }();
        this.lazyKey = function () {
          if (_this3.props.lazy) {
            return _tool2.default.lazyScrollInit(_this3.lazyClassName);
          }
        }();
        this.lazyViewHeight = 0;
        this.scrollView = {};
        this.state = _init.initialState;
        this.startY = 0;
        this.needPullDown = true;
        this.touchScrollTop = 0;
        this.$$refs = new _taroAlipay2.default.RefsArray();
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this4 = this;

        this.moveBox(0);
        if (this.props.lazy) {
          _taroAlipay2.default.createSelectorQuery().in(this.$scope).select('.scrollView').boundingClientRect().exec(function (res) {
            _tool2.default.updateScrollHeight(_this4.lazyKey, res[0].height);
            _this4.lazyViewHeight = res[0].height;
          });
        }
        if (this.props.needInit) {
          this.fetchInit();
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        _tool2.default.lazyScrollRemove();
      }
    }, {
      key: '_createData',
      value: function _createData() {
        var _this5 = this;

        this.__state = arguments[0] || this.state || {};
        this.__props = arguments[1] || this.props || {};
        var __isRunloopRef = arguments[2];
        var __prefix = this.$prefix;
        ;

        var _genCompid = (0, _taroAlipay.genCompid)(__prefix + "$compid__181"),
            _genCompid2 = _slicedToArray(_genCompid, 2),
            $prevCompid__181 = _genCompid2[0],
            $compid__181 = _genCompid2[1];

        var _genCompid3 = (0, _taroAlipay.genCompid)(__prefix + "$compid__182"),
            _genCompid4 = _slicedToArray(_genCompid3, 2),
            $prevCompid__182 = _genCompid4[0],
            $compid__182 = _genCompid4[1];

        var _genCompid5 = (0, _taroAlipay.genCompid)(__prefix + "$compid__183"),
            _genCompid6 = _slicedToArray(_genCompid5, 2),
            $prevCompid__183 = _genCompid6[0],
            $compid__183 = _genCompid6[1];

        var _props = this.__props,
            style = _props.style,
            hasMore = _props.hasMore,
            noMore = _props.noMore,
            isEmpty = _props.isEmpty,
            emptyText = _props.emptyText,
            className = _props.className,
            isError = _props.isError,
            isLoaded = _props.isLoaded,
            selector = _props.selector,
            _props$launch = _props.launch,
            launch = _props$launch === undefined ? {} : _props$launch,
            footerLoadingText = _props.footerLoadingText,
            footerLoadedText = _props.footerLoadedText,
            damping = _props.damping,
            circleColor = _props.circleColor;
        var _launch$launchError = launch.launchError,
            launchError = _launch$launchError === undefined ? false : _launch$launchError,
            _launch$launchEmpty = launch.launchEmpty,
            launchEmpty = _launch$launchEmpty === undefined ? false : _launch$launchEmpty,
            _launch$launchFooterL = launch.launchFooterLoaded,
            launchFooterLoaded = _launch$launchFooterL === undefined ? false : _launch$launchFooterL,
            _launch$launchFooterL2 = launch.launchFooterLoading,
            launchFooterLoading = _launch$launchFooterL2 === undefined ? false : _launch$launchFooterL2;
        var _state = this.__state,
            canScrollY = _state.canScrollY,
            blockStyle = _state.blockStyle,
            downLoading = _state.downLoading,
            dampText = _state.dampText;

        var showChildren = !(isEmpty || isError); // 展示children内容
        var showFooter = !downLoading && !isEmpty && !isError; // 空、错状态不展示底部
        var footerLoaded = showFooter && !launchFooterLoaded && !hasMore;
        var customFooterLoaded = showFooter && launchFooterLoaded && !hasMore; // 渲染renderLoadedText
        var footerLoading = showFooter && !launchFooterLoading && hasMore;
        var customFooterLoading = showFooter && launchFooterLoading && hasMore; // 渲染renderNoMore
        var anonymousState__temp = (0, _taroAlipay.internal_inline_style)(style);
        var anonymousState__temp2 = (0, _taroAlipay.internal_inline_style)({ minHeight: '100%', overflowY: 'hidden' });

        this.anonymousFunc0 = function (e) {
          return _this5.touchEvent(e);
        };

        this.anonymousFunc1 = function (e) {
          return _this5.touchEvent(e);
        };

        this.anonymousFunc2 = function (e) {
          return _this5.touchEvent(e);
        };

        this.anonymousFunc3 = function (e) {
          return _this5.touchEvent(e);
        };

        var anonymousState__temp3 = (0, _taroAlipay.internal_inline_style)(blockStyle);
        var anonymousState__temp4 = (0, _taroAlipay.internal_inline_style)({ height: damping + "px", marginTop: "-" + damping + "px" });
        propsManager.set({
          "isLoaded": isLoaded || isError,
          "selector": selector
        }, $compid__181, $prevCompid__181);
        downLoading && !this.__props.customizeLoading && propsManager.set({
          "color": circleColor
        }, $compid__182, $prevCompid__182);
        propsManager.set({
          "launchError": launchError,
          "launchEmpty": launchEmpty,
          "isError": isError || false,
          "isEmpty": isEmpty || false,
          "emptyText": emptyText || '',
          "fetchInit": this.fetchInit
        }, $compid__183, $prevCompid__183);
        this.$$refs.pushRefs([{
          type: "dom",
          id: "iizzz",
          refName: "",
          fn: function fn(node) {
            _this5.scrollView = node;
          }
        }]);
        Object.assign(this.__state, {
          anonymousState__temp: anonymousState__temp,
          anonymousState__temp2: anonymousState__temp2,
          anonymousState__temp3: anonymousState__temp3,
          anonymousState__temp4: anonymousState__temp4,
          $compid__181: $compid__181,
          $compid__182: $compid__182,
          $compid__183: $compid__183,
          className: className,
          canScrollY: canScrollY,
          downLoading: downLoading,
          showChildren: showChildren,
          footerLoading: footerLoading,
          customFooterLoading: customFooterLoading,
          footerLoaded: footerLoaded,
          customFooterLoaded: customFooterLoaded,
          dampText: dampText,
          footerLoadingText: footerLoadingText,
          noMore: noMore,
          footerLoadedText: footerLoadedText
        });
        return this.__state;
      }
    }, {
      key: 'anonymousFunc0',
      value: function anonymousFunc0(e) {
        ;
      }
    }, {
      key: 'anonymousFunc1',
      value: function anonymousFunc1(e) {
        ;
      }
    }, {
      key: 'anonymousFunc2',
      value: function anonymousFunc2(e) {
        ;
      }
    }, {
      key: 'anonymousFunc3',
      value: function anonymousFunc3(e) {
        ;
      }
    }]);

    return ListView;
  }(_taroAlipay.Component), _class.$$events = ["handleScrollToLower", "onScroll", "$collectChilds", "anonymousFunc0", "anonymousFunc1", "anonymousFunc2", "anonymousFunc3"], _class.multipleSlots = true, _class.$$componentPath = "node_modules/taro-listview/dist/weapp/components/list-view/index", _temp2);

  ListView.options = {
    addGlobalClass: true
  };
  ListView.defaultProps = _init.initialProps;
  return ListView;
}();
exports.default = ListView;

Component(__webpack_require__(/*! @tarojs/taro-alipay */ "./node_modules/@tarojs/taro-alipay/index.js").default.createComponent(ListView));

/***/ }),

/***/ "./node_modules/file-loader/dist/cjs.js?name=[path][name].axml&context=/Users/mac/Desktop/personal-store/node_modules&outputPath=npm!./node_modules/@tarojs/mini-runner/dist/loaders/miniTemplateLoader.js!./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js?!./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=template&parse=COMPONENT&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/file-loader/dist/cjs.js?name=[path][name].axml&context=/Users/mac/Desktop/personal-store/node_modules&outputPath=npm!./node_modules/@tarojs/mini-runner/dist/loaders/miniTemplateLoader.js!./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js??ref--6-0!./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=template&parse=COMPONENT& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "npm/taro-listview/dist/weapp/components/list-view/index.axml";

/***/ }),

/***/ "./node_modules/taro-listview/dist/weapp/components/list-view/index.scss":
/*!*******************************************************************************!*\
  !*** ./node_modules/taro-listview/dist/weapp/components/list-view/index.scss ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx":
/*!******************************************************************************!*\
  !*** ./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.tsx?taro&type=template&parse=COMPONENT& */ "./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=template&parse=COMPONENT&");
/* harmony import */ var _index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.tsx?taro&type=script&parse=COMPONENT& */ "./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=script&parse=COMPONENT&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ }),

/***/ "./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=script&parse=COMPONENT&":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=script&parse=COMPONENT& ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js??ref--6-0!./index.tsx?taro&type=script&parse=COMPONENT& */ "./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js?!./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=script&parse=COMPONENT&");
/* harmony import */ var _tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_script_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=template&parse=COMPONENT&":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=template&parse=COMPONENT& ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _file_loader_name_path_name_axml_context_Users_mac_Desktop_personal_store_node_modules_outputPath_npm_tarojs_mini_runner_dist_loaders_miniTemplateLoader_js_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!file-loader?name=[path][name].axml&context=/Users/mac/Desktop/personal-store/node_modules&outputPath=npm!../../../../../@tarojs/mini-runner/dist/loaders/miniTemplateLoader.js!../../../../../@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js??ref--6-0!./index.tsx?taro&type=template&parse=COMPONENT& */ "./node_modules/file-loader/dist/cjs.js?name=[path][name].axml&context=/Users/mac/Desktop/personal-store/node_modules&outputPath=npm!./node_modules/@tarojs/mini-runner/dist/loaders/miniTemplateLoader.js!./node_modules/@tarojs/mini-runner/dist/loaders/wxTransformerLoader.js?!./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx?taro&type=template&parse=COMPONENT&");
/* harmony import */ var _file_loader_name_path_name_axml_context_Users_mac_Desktop_personal_store_node_modules_outputPath_npm_tarojs_mini_runner_dist_loaders_miniTemplateLoader_js_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_file_loader_name_path_name_axml_context_Users_mac_Desktop_personal_store_node_modules_outputPath_npm_tarojs_mini_runner_dist_loaders_miniTemplateLoader_js_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _file_loader_name_path_name_axml_context_Users_mac_Desktop_personal_store_node_modules_outputPath_npm_tarojs_mini_runner_dist_loaders_miniTemplateLoader_js_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _file_loader_name_path_name_axml_context_Users_mac_Desktop_personal_store_node_modules_outputPath_npm_tarojs_mini_runner_dist_loaders_miniTemplateLoader_js_tarojs_mini_runner_dist_loaders_wxTransformerLoader_js_ref_6_0_index_tsx_taro_type_template_parse_COMPONENT___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./node_modules/taro-listview/dist/weapp/components/list-view/init.tsx":
/*!*****************************************************************************!*\
  !*** ./node_modules/taro-listview/dist/weapp/components/list-view/init.tsx ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = exports.initialState = {
  hideInd: false,
  touchScrollTop: 0,
  scrollTop: 0,
  startY: 0,
  downLoading: false,
  lowerLoading: false,
  // needPullDown: true,
  canScrollY: true,
  isInit: false,
  blockStyle: {
    transform: 'translate3d(0,0,0)',
    transition: 'none'
  },
  dampText: ''
};
var initialProps = exports.initialProps = {
  lazy: false,
  distanceToRefresh: 50,
  damping: 150,
  isLoaded: true,
  isEmpty: false,
  emptyText: '',
  noMore: '暂无更多内容',
  footerLoadingText: '加载中',
  footerLoadedText: '暂无更多内容',
  scrollTop: 0,
  touchScrollTop: 0,
  onScrollToLower: function onScrollToLower() {},
  showIndicator: true,
  className: '',
  onPullDownRefresh: null,
  hasMore: false,
  needInit: false,
  isError: false,
  launch: {},
  renderEmpty: null,
  renderError: null,
  indicator: {
    activate: '下拉刷新',
    deactivate: '释放刷新'
  }
};

/***/ }),

/***/ "./node_modules/taro-listview/dist/weapp/components/list-view/tool.ts":
/*!****************************************************************************!*\
  !*** ./node_modules/taro-listview/dist/weapp/components/list-view/tool.ts ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.debounce = debounce;

var _taroAlipay = __webpack_require__(/*! @tarojs/taro-alipay */ "./node_modules/@tarojs/taro-alipay/index.js");

var _taroAlipay2 = _interopRequireDefault(_taroAlipay);

var _storage = __webpack_require__(/*! ../../utils/storage */ "./node_modules/taro-listview/dist/weapp/utils/storage.ts");

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function debounce(method) {
  var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

  var timer = null;
  return function () {
    var context = this;
    // 在函数执行的时候先清除timer定时器;
    // @ts-ignore
    clearTimeout(timer);
    // @ts-ignore
    timer = setTimeout(function () {
      method.call(context);
    }, time);
  };
}
var timer = null;
var startTime = Date.now();
var throttle = function throttle(func, delay) {
  return function () {
    var curTime = Date.now();
    var remaining = delay - (curTime - startTime);
    var context = this;
    var args = arguments;
    // @ts-ignore
    clearTimeout(timer);
    if (remaining <= 0) {
      func.apply(context, args);
      startTime = Date.now();
    } else {
      // @ts-ignore
      timer = setTimeout(func, remaining);
    }
  };
};
var wait = function wait() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;

  return new Promise(function (res) {
    setTimeout(function () {
      res();
    }, time);
  });
};
function lazyScrollInit(className) {
  var lazyKey = "lazy" + new Date().getTime();
  var lazyBox = _storage2.default.get('lazyBox', []);
  if (lazyBox.length) {
    var length = lazyBox.length;
    var lastKey = lazyBox[length - 1];
    if (new Date().getTime() - Number(lastKey.key.replace('lazy', '')) > 86400000) {
      lazyBox.splice(0, length);
    }
  }
  lazyBox.push({ key: lazyKey, className: className, viewHeight: 0 });
  _storage2.default.set('lazyBox', lazyBox);
  return lazyKey;
}
function lazyScrollRemove() {
  var lazyBox = _storage2.default.get('lazyBox', []);
  lazyBox.pop();
  _storage2.default.set('lazyBox', lazyBox);
}
function updateScrollHeight(key, viewHeight) {
  var lazyBox = _storage2.default.get('lazyBox', []);
  var index = lazyBox.findIndex(function (i) {
    return i.key === key;
  });
  var targetLazy = lazyBox[index];
  lazyBox.splice(index, 1, _extends({}, targetLazy, { viewHeight: viewHeight }));
  _storage2.default.set('lazyBox', lazyBox);
}
function lazyScroll(key, selector, height) {
  var query = _taroAlipay2.default.getEnv() === 'WEB' ? ".lazy-image-" + key : selector + " >>> .lazy-image-" + key;
  throttle(function () {
    _taroAlipay2.default.createSelectorQuery().selectAll(query).boundingClientRect().exec(function (res) {
      var list = res[0];
      var indexs = [];
      list.forEach(function (i, index) {
        if (i.top > -height * 1.5 && i.top < height * 1.5) {
          // @ts-ignore
          indexs.push(index);
        }
      });
      // @ts-ignore
      if (_taroAlipay2.default[key] && typeof _taroAlipay2.default[key] === 'function') _taroAlipay2.default[key](indexs);
    });
  }, 500)();
}
exports.default = { lazyScroll: lazyScroll, wait: wait, debounce: debounce, updateScrollHeight: updateScrollHeight, lazyScrollInit: lazyScrollInit, lazyScrollRemove: lazyScrollRemove };

/***/ }),

/***/ "./node_modules/taro-listview/dist/weapp/utils/storage.ts":
/*!****************************************************************!*\
  !*** ./node_modules/taro-listview/dist/weapp/utils/storage.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taroAlipay = __webpack_require__(/*! @tarojs/taro-alipay */ "./node_modules/@tarojs/taro-alipay/index.js");

var _taroAlipay2 = _interopRequireDefault(_taroAlipay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function get(key, defaultValue) {
  var value = _taroAlipay2.default.getStorageSync(key);
  if (!value || value === ' ' || value === 'undefined' || value === 'null') {
    value = '';
  }
  return value ? JSON.parse(value) : defaultValue;
}
function set(key, value) {
  _taroAlipay2.default.setStorageSync(key, JSON.stringify(value));
}
function remove(key) {
  _taroAlipay2.default.removeStorageSync(key);
}
function clear() {
  _taroAlipay2.default.clearStorageSync();
}
exports.default = {
  get: get,
  set: set,
  remove: remove,
  clear: clear
};

/***/ })

},[["./node_modules/taro-listview/dist/weapp/components/list-view/index.tsx","runtime","taro","vendors"]]]);