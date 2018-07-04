'use strict';

/**
 * @ngdoc function
 * @name vendingMachineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the vendingMachineApp
 */
angular.module('vendingMachineApp')
  .controller('cashPaymentCtrl', ['$scope','$cookies','config','$state','$rootScope',function ($scope,$cookies,config,$state,$rootScope) {
    
    var model = $scope.model= {
        balancePaid:0,
        extra10Paid:0
    };
    
    function initialize(){
        if ($rootScope.transaction)
        {
            //console.log($rootScope.transaction) ;
            model.balancePaid = $rootScope.transaction.amountPaid;
            model.extra10Paid = $rootScope.transaction.extraPaid;
        }

    }
    
    initialize();

    $scope.addBalance= function(value){
        var diff =0;
        if (model.balancePaid+value>=1000){
            console.log(model.balancePaid+value);
            diff = (model.balancePaid+value) - 1000;
            model.balancePaid = (model.balancePaid+value)-diff;
            model.extra10Paid += diff;

        }else
        model.balancePaid += value;
        if ($rootScope.transaction){
            $rootScope.transaction.amountPaid = model.balancePaid ;
            $rootScope.transaction.extraPaid = model.extra10Paid;
            $rootScope.transaction.ccToken="";
        }
    };
    $scope.isCoinDisabled = function(coinValue){
        return ((model.balancePaid+coinValue)>1000);
    }
    $scope.disableCoins = () => {
        return (model.balancePaid>=1000 || model.extra10Paid>0);
    };

    $scope.notEnoughMoney = () => {
        return (model.balancePaid<150);
    };
    $scope.moveToNextStagec= () => {
        console.log('here');
       $state.go('vmMain');
       //,{"balancePaid":model.balancePaid,"extraPaid":model.extra10Paid}
    };

  }]);
