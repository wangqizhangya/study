/**
*  @author: zhaoxuan
*  created: 2016.12.19
*  Description: ajaxService.js
**/
(function(){
	'use strict';
	var services = angular.module('xydzpApp');
	/**
	 *  XHR请求配置
	 */
	services.constant('httpGetConfig', {
		method:'GET',
		url:'',
		cache: false,
		transformRequest:function(obj){
			if((typeof obj).toLocaleLowerCase() !== 'object') return obj;
	        var str=[];
	        for(var p in obj){
	            str.push(encodeURIComponent(p)+'='+encodeURIComponent(obj[p]))
	        }
	        return str.join('&');
	    },
	    data: '',
	   	headers: {
	   		'Content-Type': 'application/x-www-form-urlencoded'
	   	}
	});

	services.constant('httpPostConfig', {
		method:'POST',
		url:'',
		cache: false,
		timeout: 10000,
		transformRequest:function(obj){
			if((typeof obj).toLocaleLowerCase() !== 'object') return obj;
	        var str=[];
	        for(var p in obj){
	            str.push(encodeURIComponent(p)+'='+encodeURIComponent(obj[p]))
	        }
	        return str.join('&');
	    },
	    data: '',
	    headers: {
	   		'Content-Type': 'application/x-www-form-urlencoded'
	   	}
	});

	services.constant('httpPutConfig', {
		method:'PUT',
		url:'',
		transformRequest:function(obj){
			if((typeof obj).toLocaleLowerCase() !== 'object') return obj;
	        var str=[];
	        for(var p in obj){
	            str.push(encodeURIComponent(p)+'='+encodeURIComponent(obj[p]))
	        }
	        return str.join('&');
	    },
	    data: '',
	   	headers: { 
	   		'Content-Type': 'application/x-www-form-urlencoded'
	   	}
	});

	services.constant('httpDelConfig', {
		method:'DELETE',
		url:'',
		transformRequest:function(obj){
			if((typeof obj).toLocaleLowerCase() !== 'object') return obj;
	        var str=[];
	        for(var p in obj){
	            str.push(encodeURIComponent(p)+'='+encodeURIComponent(obj[p]))
	        }
	        return str.join('&');
	    },
	    data: '',
	   	headers: { 
	   		'Content-Type': 'application/x-www-form-urlencoded'
	   	}
	});
	/**
	 * 封装angular $http方法
	 */
	services.service('ajaxService', ['$http', 'host','$rootScope', 'httpGetConfig', 'httpPostConfig', 'httpPutConfig', 'httpDelConfig',
		function($http, host, $rootScope, httpGetConfig, httpPostConfig, httpPutConfig, httpDelConfig) {
		
		host = host || {};
		var urlPrefix = '';
		var urlSuffix = '';
		if((typeof host).toLocaleLowerCase() !== 'object'){
			urlPrefix = host;
		}else {
			// 请求地址的前缀
			urlPrefix = host.prefix || '';
			// 请求地址的后缀
			urlSuffix = host.sufffix ? '.' + host.sufffix : '';
		}

		var state504 = false;
		var httpRequest = function(httpType,obj,success,error) {
			switch(httpType){
				case 'get':
					var httpConfig = httpGetConfig;
					break;
				case 'post':
					var httpConfig = httpPostConfig;
					break;
				case 'del':
					var httpConfig = httpDelConfig;
					break;
				default:
					var httpConfig = httpPutConfig;
					break;
			}
			//httpConfig.headers = ({'Authorization': 'Bearer' + token,'Content-Type': 'application/x-www-form-urlencoded'})
			if(!obj) return;
			for(var i in httpConfig) {
				obj[i] = obj[i] || httpConfig[i];
			}
			// 设置真正的请求地址
			obj.url = urlPrefix + obj.url + urlSuffix;

			$http(obj)
			.success(function(res) {
				state504 = false;
				success && success(res);
			})
			.error(function(res) {
				error(res);
			});
		}
		return {
			requset: function(obj,success,error) {
				httpRequest('request',obj, success,error);
			},
			get: function(url,success,error) {
				var obj = url;
				if((typeof url).toLocaleLowerCase() !== 'object') {
					obj = {url: url};
				}
				httpRequest('get', obj, success,error);
			},
			post: function(url, success,error) {
				var obj = url;
				if((typeof url).toLocaleLowerCase() !== 'object') {
					obj = {url: url};
				}
				httpRequest('post', obj, success,error);
			},
			put: function(url, success,error) {
				var obj = url;
				if((typeof url).toLocaleLowerCase() !== 'object') {
					obj = {url: url};
				}
				httpRequest('put', obj, success,error);
			},
			del: function(url, success,error) {
				var obj = url;
				if((typeof url).toLocaleLowerCase() !== 'object') {
					obj = {url: url};
				}
				httpRequest('del', obj, success,error);
			}

		};
	}]);
})();