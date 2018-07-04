'use strict';

/**
 * @ngdoc service
 * @name takeCommandApp.directive:tcValidateCreditcard
 *
 * @description
 * tcValidateCreditcard directive
 *
 */
function tcValidateCreditcard() {

  return {
    require: 'ngModel',
    link: function($scope, element, attrs, ngModel) {
      ngModel.$validators.creditCard = function(value) {

        value = value || '';

        if (value.length === 0) {
          return false;
        }

        // accept only digits, dashes or spaces
        if (/[^0-9-\s]+/.test(value)) {
          return false;
        }

        var nCheck = 0,
          nDigit = 0,
          bEven = false;

        for (var n = value.length - 1; n >= 0; n--) {
          var cDigit = value.charAt(n);
          nDigit = parseInt(cDigit, 10);
          if (bEven) {
            if ((nDigit *= 2) > 9) {
              nDigit -= 9;
            }
          }
          nCheck += nDigit;
          bEven = !bEven;
        }

        return (nCheck % 10) === 0;
      };
    }
  };
}

angular.module('vendingMachineApp')
  .directive('tcValidateCreditcard', tcValidateCreditcard);
