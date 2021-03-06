'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (configs) {
  return function (_ref2) {
    var getState = _ref2.getState,
        dispatch = _ref2.dispatch;
    return function (next) {
      return function (action) {
        var _getClient = (0, _getClient2.getClient)(configs, action),
            client = _getClient.client,
            providedOptions = _getClient.providedOptions;

        var options = _extends({}, defaultOptions, providedOptions);
        if (!options.isAxiosRequest(action)) {
          return next(action);
        }
        if (options.interceptors) {
          bindInterceptors(client, getState, options.interceptors);
        }

        var _getActionTypes = (0, _getActionTypes3.getActionTypes)(action, options),
            _getActionTypes2 = _slicedToArray(_getActionTypes, 1),
            REQUEST = _getActionTypes2[0];

        next(_extends({}, action, { type: REQUEST }));
        return client.request(options.getRequestConfig(action)).then(function (response) {
          var newAction = options.onSuccess({ action: action, next: next, response: response, getState: getState, dispatch: dispatch }, options);
          options.onComplete({ action: newAction, next: next, getState: getState, dispatch: dispatch }, options);
          return newAction;
        }, function (error) {
          var newAction = options.onError({ action: action, next: next, error: error, getState: getState, dispatch: dispatch }, options);
          options.onComplete({ action: newAction, next: next, getState: getState, dispatch: dispatch }, options);
          return options.returnRejectedPromiseOnError ? Promise.reject(newAction) : newAction;
        });
      };
    };
  };
};

var _defaults = require('./defaults');

var defaultOptions = _interopRequireWildcard(_defaults);

var _getClient2 = require('./getClient');

var _getActionTypes3 = require('./getActionTypes');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function bindInterceptors(client, getState) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$request = _ref.request,
      request = _ref$request === undefined ? [] : _ref$request,
      _ref$response = _ref.response,
      response = _ref$response === undefined ? [] : _ref$response;

  request.forEach(function (interceptor) {
    client.interceptors.request.use(interceptor.bind(null, getState));
  });

  response.forEach(function (interceptor) {
    client.interceptors.response.use(interceptor.bind(null, getState));
  });
}