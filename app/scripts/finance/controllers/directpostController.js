'use strict';

/**
 * @ngdoc controller
 * @name directpostApp.controller:DirectPostController
 *
 * @description
 * The `DirectPostController` controller is used to manage setup and behaviour of
 * direct post securepay form.
 *
 *
 */
function DirectPostController($scope, Finance, $stateParams, DirectpostService, creditcardService) {


  function dollarsToCents(dollars) {
    return parseFloat(dollars * 100).toFixed(0);
  }

  messageService.clear();

  $scope.processing = false;

  /**
   * get the outstanding amount for the account
   **/
  Invoice.outstanding($stateParams.account)
    .then(function(data) {

      function isPositive(amount) {
        return (amount && amount > 0);
      }

      $scope.outstanding = isPositive(data) ? dollarsToCents(data) / 100 : void(0);
    });

  /**
   * @doc method
   * @methodOf directpostApp.controller:DirectPostController
   * @name directpostApp.controller:DirectPostController#isNotValidMonth
   * @description
   * Returns true if month is invalid
   */
  $scope.isNotValidMonth = creditcardService.isNotValidMonth;

  /**
   * @doc method
   * @methodOf directpostApp.controller:DirectPostController
   * @name directpostApp.controller:DirectPostController#isNotValidYear
   * @description
   * Returns true if year is less than current year
   */
  $scope.isNotValidYear = creditcardService.isNotValidYear;

  /**
   * @doc method
   * @methodOf financeModule.controller:DirectPostController
   * @name financeModule.controller:DirectPostController#submit
   * @description
   * Used to validate credit card numbers base on luhn algorithm
   */
  $scope.submit = function(formController) {

    if (!$scope.outstanding || $scope.sendToSecurepay) {
      return false;
    }

    $scope.processing = true;
    messageService.clear();

    // get timestamp and figerprint from our server
    DirectpostService.getPaymentFingerprint($stateParams.account, dollarsToCents($scope.outstanding))
      .then(function(sf) {

        // setup form post data package
        $scope.securepay = DirectpostService.buildSecurepayPostData({
          type: 0, //should be 0 for payment and 1 for token request
          account: $stateParams.account, //sf.ReferenceID,
          outstanding: $scope.outstanding.toFixed(2),
          timestamp: sf.Timestamp,
          referenceId: sf.ReferenceID,
          fingerprint: sf.Fingerprint,
          cardnumber: $scope.EPS_CARDNUMBER,
          expMonth: $scope.EPS_EXPIRYMONTH,
          expYear: $scope.EPS_EXPIRYYEAR,
          expCCV: $scope.EPS_CCV
        });

        //activate autosubmit of iframe
        $scope.sendToSecurepay = true;

        // now watch for result from securpay
        var unregister = $scope.$watch('securepay.data.resultUrl', function() {
          var spData = $scope.securepay.data;

          if (spData.resultUrl) {
            var response = {};

            (function parseUrl(url) {
              var queryString = url.split('?')[1];
              var paramsArray = queryString.split('&');
              paramsArray.forEach(function(arr) {
                var keyPair = arr.split('=');
                response[keyPair[0]] = keyPair[1];
              });
            })(spData.resultUrl);

            if (response.restext === 'Approved') {
              $scope.messageService = messageService;

              DirectpostService.postSecurePayResult(response)
                .then(function() {
                  $scope.outstanding = void(0);
                  $scope.EPS_CARDNUMBER = void(0);
                  $scope.EPS_EXPIRYMONTH = void(0);
                  $scope.EPS_EXPIRYYEAR = void(0);
                  $scope.EPS_CCV = void(0);
                  formController.$setPristine(true);
                  // messageService.setSuccess('Your Payment has been submitted successfully. It may not be reflected in your Payment History however for another 48 hours.');
                  $scope.messageService.setSuccess('Thank you for bringing your account up to date, your services will be unbarred automatically. Please allow a minimum of 30 minutes for all services to be unbarred.');
                });
            } else {
              let errString = (response.restext !== 'null') ? `Your Payment failed (${decodeURIComponent(response.restext)}).` : 'Your Payment failed.';
              messageService.setError(errString);
            }

            $scope.processing = false;
            unregister();
          }
        });
      });
  };
}

DirectPostController.$inject = ['$scope', 'Finance', '$stateParams', 'DirectpostService', 'creditcardService'];

angular.module('vendingMachineApp.financeModule')
  .controller('DirectPostController', DirectPostController);
