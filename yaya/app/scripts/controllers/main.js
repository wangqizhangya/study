'use strict';
angular.module('xydzpApp').run(function() {
    FastClick.attach(document.body);
});
angular.module('xydzpApp').controller('AppCtrl', ['$scope','$timeout','$http','addressService','$modal','host', function($scope,$timeout,$http,addressService,$modal,host) {
    $scope.app = {
        prizeOpen: false,
        thanksOpen: false,
        ruleOpen: false,
        shareOpen: false,
        noChanceOpen: false,
        prizeSize:''
    };
    $scope.toast = {
        show: false,
        msg: ''
    };
    $scope.roulette = '';
    $scope.prices = [
        {
          name: '10M流量'
        },
        {
            name: '1G流量'
        },
        {
            name: '谢谢参与'
        },
        {
            name: '500M流量'
        },
        {
            name: '谢谢参与'
        },
        {
            name: '30M流量'
        },
        {
            name: '谢谢参与'
        },
        {
            name: '100M流量'
        },
    ];

    var options = {
        prices: $scope.prices,
        duration: 5000, // The amount of milliseconds the roulette to spin
        separation: 2, // The separation between each roulette price
        min_spins: 5, // The minimum number of spins
        max_spins: 10, // The maximum number of spins
        //clockWise: true, // The direction the wheel will spin
    };

    $scope.init = function(){
        $scope.app.user_name = $scope.getUrlParam('name');
        $scope.app.phone = $scope.getUrlParam('phone');
        //$scope.app.user_name = '吴奔江';
        //$scope.app.phone = '18867102781';
        //
        $scope.roulette = $('.roulette').fortune(options);
    };

    $scope.clickHandler = function() {

        if(!$scope.app.phone||!$scope.app.user_name){
            $scope.openModal('','下载安装和办公参加幸运大转盘抽奖活动');
            return;
        }
        $('.spinner').off('click');
        var json = {
            'phone': $scope.app.phone,
            'userName': $scope.app.user_name,
            'rollType': '4'
        }
        //发送抽奖请求
        //调用获取积分接口
        addressService.luckyRoll(json,function(res){

            if(res.status == 1){
                //中奖
                if( res.data.reward ) {
                    $scope.app.prizeSize = res.data.reward.key
                    var index = 0;
                    switch  ($scope.app.prizeSize){
                        case '10M':
                            index = 0;
                            break;
                        case '100M':
                            index = 1;
                            break;
                        case '30M':
                            index = 3;
                            break;
                        case '500M':
                            index = 5;
                            break;
                        case '1G':
                            index = 7;
                            break;
                    }
                    $scope.roulette.spin(index).done(function(price) {
                        $timeout(function(){
                            $scope.open('prize');
                            $('.spinner').on('click',  $scope.clickHandler)
                        },500);
                    });

                }else{
                    //未中奖
                    var index = Math.floor(Math.random()*3+1)*2;
                    $scope.roulette.spin(index).done(function(price) {
                        $timeout(function(){
                            $scope.open('thanks');
                            $('.spinner').on('click',  $scope.clickHandler)
                        },500);
                    });
                }
            } else{
                $('.spinner').on('click',  $scope.clickHandler);
                //未分享
                if(res.data.state == 2){
                    $scope.open('share');
                }else if(res.data.state == 1){
                    //每日次数用完
                    $scope.open('noChance');
                }else{
                     $scope.toast('请稍候重试');
                }
            }
       },function(res){
            $('.spinner').on('click',  $scope.clickHandler);
            $scope.toast('网络异常，请检查网络连接');
       });
    };
    // 获取url中的参数
    $scope.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
        var url = decodeURI(window.location.search);
        var r = url.substr(1).match(reg); // 匹配目标参数
        if (r != null){
            return unescape(r[2]);
        }
        return null; // 返回参数值
    };
    $scope.toast = function(msg){
        $scope.toast.show = true;
        $scope.toast.msg = msg;
        $timeout(function(){
            $scope.toast.show = false;
            $scope.toast.msg = '';
            //$scope.$apply();
        },1000);
    }


  	$scope.open = function(type){
        switch (type) {
            case 'prize' :
                $scope.app.prizeOpen = true;
                $scope.$apply();
                break;
            case 'thanks' :
                $scope.app.thanksOpen = true;
                $scope.$apply();
                break;
            case 'rule' :
                $scope.app.ruleOpen = true;
                break;
            case 'share' :
                $scope.app.shareOpen = true;
                break;
            case 'noChance' :
                $scope.app.noChanceOpen = true;
                break;
        }
    };
    $scope.close = function(type){
        switch (type) {
            case 'prize' :
                $scope.app.prizeOpen = false;
                break;
            case 'thanks' :
                $scope.app.thanksOpen = false;
                break;
            case 'rule' :
                $scope.app.ruleOpen = false;
                break;
            case 'share' :
                $scope.app.shareOpen = false;
                break;
            case 'noChance' :
                $scope.app.noChanceOpen = false;
                break;
        }
    };

    var infoInstanceCtrl = ['$scope', '$modalInstance', 'message', 'title',function($scope, $modalInstance, message,title) {
        $scope.message = message;
        $scope.title = title;
        $scope.ok = function () {
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }];
    $scope.openModal = function(title,message){
        $scope.message = message;
        $scope.title = title;
        var modal = $modal.open({
            templateUrl: 'modal.html',
            controller: infoInstanceCtrl,
            backdrop:'static',
            resolve: {
                'message': function() {
                    return $scope.message
                },
                'title': function() {
                    return $scope.title
                }
            }
        });

        modal.result.then(function (){
            $timeout(function(){
                window.location.href = 'http://223.99.141.135:81/';
            },150);
        });
    };


}]);

