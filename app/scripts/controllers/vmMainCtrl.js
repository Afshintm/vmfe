'use strict';

angular.module('vendingMachineApp').controller('vmMainCtrl',['$scope','utils','ENV','$state','$rootScope','$http',function($scope, utils, ENV,$state,$rootScope,$http){

	function initializeTransactionModel(){ 
		return {
		orderId:'',
		paymentType:'',
		balancePaid: 0,
		extraPaid:0,
		};
	}

	var model = $scope.model={
		viewTitle:'Cans Vending Machine',
		productList: [],
		currentTransaction : initializeTransactionModel()
	};
	 
	function setcurrentTransactionFromRootScope(){
		if ($rootScope.transaction)
		{
			model.currentTransaction.balancePaid = $rootScope.transaction.amountPaid;
			model.currentTransaction.extraPaid = $rootScope.transaction.extraPaid;
			model.currentTransaction.paymentType = $rootScope.transaction.paymentType ? $rootScope.transaction.paymentType :  'Cash';
		}
	}
	function clearRootScopeTransaction(){
		$rootScope.transaction=null;
	}

	function getAvailableStock(){
		utils.getApi(ENV.apiEndpoint + '/v1/products').then(function(data){
		model.productList = data ;
		
		},function(reason){

			throw (reason);
		});
	}
function getProductName(id){
	for (var i = model.productList.length - 1; i >= 0; i--) {
	 	if((model.productList[i]).Id ===id)
	 		return model.productList[i].Name;
	 } 
	 return null ;
}
	setcurrentTransactionFromRootScope() ;

	$scope.selectProduct = function(id){
		console.log(id);
        var postData = {
			ProductId:id,
			PaidBalance:(model.currentTransaction.balancePaid+model.currentTransaction.extraPaid)/100,	
			PaymentType: model.currentTransaction.paymentType
		};
        $http.post(ENV.apiEndpoint + '/v1/order',postData).then(function(result){
        	model.currentTransaction = initializeTransactionModel();
        	clearRootScopeTransaction();
        	console.log(result.data);
        	console.log(getProductName(result.data.ProductId));
        	model.dispenseModel =
        	{
        		productId:result.data.ProductId,
        		changeSetup:result.data.ChangeSetup,
        		changeValue:result.data.ChangeValue,
        		productName:getProductName(result.data.ProductId)
        	};
        	getAvailableStock();
        },function(reason){
        	throw (reason);
        });
	};

	$scope.inDispenceStatus = function(){
		if (model.dispenseModel)
			if(model.dispenseModel.productId>0)
				return true;
	};
	
	$scope.getDispencedItem = function(){
		if($scope.inDispenceStatus())	return model.dispenseModel.productName;
		return null;
	};

	$scope.isAnyChangeAvailable = function(){
		if (model.dispenseModel)
			if(model.dispenseModel.changeSetup!=='' && model.dispenseModel.changeValue>0)
				return true;
	};

	getAvailableStock();
	
}]);