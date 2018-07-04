'use strict';


angular.module('vendingMachineApp')
  .controller('paymentCtrl', ['$scope','$rootScope','$cookies','config','$state','Guid',function ($scope, $rootScope, $cookies,config,$state,Guid) {

     $scope.paid = {id:1,name:'parent'};
     if(!$rootScope.transaction)
     {
     	$rootScope.transaction= {transId:Guid.newGuid(), amountPaid:0,extraPaid:0};
     }
     console.log($rootScope.transaction.transId);
    
  }]);
