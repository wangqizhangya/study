/**
*  @author: zhaoxuan
*  created: 2017.4.14
*  Description: addressService.js
**/
(function(){

	'use strict';

	var services = angular.module('xydzpApp');

	services.service('addressService', ['ajaxService', '$rootScope', function(ajaxService, $rootScope) {

		var _url = {
			// 抽奖接口
			luckyRoll: '/eas_cmcc/anniToRoll/luckyRoll',

		};
		return {
			luckyRoll: function(datas ,callback,error) {
				var obj = {url: _url.luckyRoll, data: datas};
				ajaxService.post(obj,callback,error);
			},
		}
	}]);
})();