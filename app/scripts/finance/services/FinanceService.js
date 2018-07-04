'use strict';

function Finance($http, $rootScope, ENV,  $q ) {
  return {
      setBankDDasPaymentMethod: function(postData) {
      return $http.post(ENV.apiEndpoint + '/v1/payment/bankdirectdebit' , postData);
    },
    getSecurePayMethodFingerprint: function(transNo) {
      return $http.get(ENV.apiEndpoint + '/v1/payment/fingerprint/' + transNo+'/1/100' );
    }

  };
}

 Finance.$inject = ['$http', '$rootScope', 'ENV', '$q'];

 angular.module('vendingMachineApp.financeModule')
   .factory('Finance', Finance);
