// factory is a type of provider in AngularJs which construct a new service using a function with one or more parameters
// which are effectively the dependencies. The return value of this function is the service instance created by this recipe. 
'use strict';
angular.module('vendingMachineApp')
// .service('$firebaseArray',['$firebase',function FirebaseArray($firebase){
// 	this.abc = function(url){
// 		return (url);
// 	}
// }])


.factory('utils',['$http','$q',function utilsFactory($http, $q){	
	var utils = {
		getApi: function(apiAddress){
			var defered = $q.defer() ;
			if (apiAddress.length<=0)
			{
				defered.reject(null) ;
			}
			try{
				$http.get(apiAddress).then(
				function(data){
					defered.resolve(data.data);
				},function(reason){
					console.log('Failure to get the data from ' + apiAddress);
					defered.reject(reason);
				});
			}
			catch(e){
				defered.reject(e);
			}
			return defered.promise;
		},
		requestApi: function(method , apiAddress,postData){
			var methods=['get','post','put','delete'];

			var defered = $q.defer() ;
			if ((apiAddress.length<=0) || (methods.indexOf(method)===-1))
			{
				defered.reject(null) ;
			}
			try{
				if(method==='get')
					$http.get(apiAddress).then(
					function(data){
						defered.resolve(data.data);
					},function(reason){
						console.log('Failure to get the data from ' + apiAddress);
						defered.reject(reason);
					});
				else if(method==='post')
					$http.post(apiAddress,postData).then(
					function(data){
						defered.resolve(data.data);
					},function(reason){
						console.log('Failure to post following data to ' + apiAddress);
						console.log(postData);
						defered.reject(reason);
					});

			}
			catch(e){
				defered.reject(e);
			}
			return defered.promise;

		}
	};
	return utils;
}]);