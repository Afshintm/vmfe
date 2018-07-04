'use strict';

function tcCardType() {
  return {
    restrict: 'EA',
    scope: true,
    templateUrl: 'views/cardType.tmpl.html',
    link: function(scope, element, attrs) {
      scope.cardType = '';
      attrs.$observe('tcCardType', function(value) {
        scope.cardType = '';
        if (value) {
          var prefix = value.substring(0, 2);
          switch (prefix) {
            case '30':
            case '36':
            case '38':
              scope.cardType = 'diners';
              break;
            case '34':
            case '37':
              scope.cardType = 'amex';
              break;
            case (prefix >= 40 && prefix < 50 ? prefix : null):
              scope.cardType = 'visa';
              break;
            case (prefix >= 22 && prefix < 28 || prefix >= 50 ? prefix : null):
              scope.cardType = 'mastercard';
              break;
            default:
              scope.cardType = '';
          }

        }
      });
    }
  };
}

angular.module('vendingMachineApp')
  .directive('tcCardType', tcCardType);
