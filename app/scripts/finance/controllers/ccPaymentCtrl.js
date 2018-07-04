'use strict';

function ccPaymentCtrl($scope, $stateParams, Finance, DirectpostService, creditcardService) {


  $scope.processing = false;

  var formData = $scope.formData = {
    paymentMethod: 1
  };

  function loadPaymentMethod() {
    formData.paymentMethod = 1;
        formData.cardnumber = void(0);
        formData.expirymonth = void(0);
        formData.expiryyear = void(0);
        formData.ccv = void(0);
        formData.CardName = void(0);
        formData.BSB = void(0);
        formData.AccountNumber = void(0);
     }


  $scope.setPaymentMethod = function(value) {
    formData.paymentMethod = value;
  };

  loadPaymentMethod();
  $scope.setPaymentMethod(0);


  /**
   * @doc method
   * @methodOf financeModule.controller:PaymentChangeController
   * @name financeModule.controller:PaymentChangeController#isNotValidMonth
   * @description
   * Returns true if month is invalid
   */
  $scope.isNotValidMonth = creditcardService.isNotValidMonth;

  /**
   * @doc method
   * @methodOf financeModule.controller:PaymentChangeController
   * @name financeModule.controller:PaymentChangeController#isNotValidYear
   * @description
   * Returns true if year is less than current year
   */
  $scope.isNotValidYear = creditcardService.isNotValidYear;


  /**
   * @doc method
   * @methodOf financeModule.controller:PaymentChangeController
   * @name financeModule.controller:PaymentChangeController#submit
   * @description
   * Submit
   */
  $scope.submit = function(formController) {

    var postData, fingerprintPromise;

    $scope.processing = true;

    // if its credit card get fingerprint and submit to get token and then finally send token to API or use callbackurl
      fingerprintPromise = Finance.getSecurePayMethodFingerprint($stateParams.account);

      fingerprintPromise
        .then(function(response) {
          var sf = response.data.DataObject;
          $scope.timestamp = sf.Timestamp;
          $scope.fingerprint = sf.Fingerprint;

          // setup form post data package
          $scope.securepay = DirectpostService.buildSecurepayPostData({
            type: 1, //should be 0 for payment and 1 for token request
            account: $stateParams.account, //sf.ReferenceID,
            outstanding: '1.00',
            timestamp: sf.Timestamp,
            referenceId: sf.ReferenceID,
            fingerprint: sf.Fingerprint,
            cardnumber: formData.cardnumber,
            expMonth: formData.expirymonth,
            expYear: formData.expiryyear,
            expCCV: formData.ccv
          });

          var unregister = $scope.$watch('formData.resultUrl', function() {

            if (formData.resultUrl) {

              var response = {};

              (function parseUrl(url) {
                var queryString = url.split('?')[1];
                var paramsArray = queryString.split('&');
                paramsArray.forEach(function(arr) {
                  var keyPair = arr.split('=');
                  response[keyPair[0]] = keyPair[1];
                });
              })(formData.resultUrl);

              if (response.restext === 'Approved') {
               // this is supposed to be updating credit card's token to backend api so the transaction type will have to be 1
                response.txntype = "1" ;

                DirectpostService.postSecurePayResult(response)
                  .then(function() {
                    $scope.outstanding = void(0);
                    $scope.EPS_CARDNUMBER = void(0);
                    $scope.EPS_EXPIRYMONTH = void(0);
                    $scope.EPS_EXPIRYYEAR = void(0);
                    $scope.EPS_CCV = void(0);

                    loadPaymentMethod();
                    $scope.accepted = void(0);
                    formController.$setPristine(true);

                    console.log('Your Payment method change has been submitted.');
                    $scope.processing = false;
                  });
                

                loadPaymentMethod();
                $scope.accepted = void(0);
                formController.$setPristine(true);

                console.log('Your Payment method change has been submitted.');
                $scope.processing = false;

              } else {
                console.log('Your Payment method change has failed.');
                $scope.processing = false;
                unregister();
              }

            }
          });

          //activate autosubmit of iframe
          $scope.sendToSecurepay = true;

        })
        .catch(function() {
          messageService.setError('Your Payment method change has failed.', 'PaymentMethod');
          $scope.processing = false;
        });

  };

}

ccPaymentCtrl.$inject = ['$scope',  '$stateParams', 'Finance', 'DirectpostService', 'creditcardService'];

angular.module('vendingMachineApp.financeModule')
  .controller('ccPaymentCtrl', ccPaymentCtrl);
