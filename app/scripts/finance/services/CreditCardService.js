'use strict';

class creditcardService {
  constructor() {

    /**
     * @doc method
     * @methodOf financeModule.service:creditcardService
     * @name financeModule.service:creditcardService#isNotValidMonth
     * @description
     * Returns true if month is invalid
     */
    this.isNotValidMonth = function(expirymonth, expiryyear) {

      function toInt(numberString) {
        return parseInt(numberString, 10);
      }

      if (expirymonth && expiryyear) {
        var today = new Date(),
          expiryMonth = toInt(expirymonth);

        if (expiryMonth < 1 || expiryMonth > 12) {
          return true;
        } else {
          return today > new Date(toInt(expiryyear), expiryMonth, 0);
        }
      }
    };

    /**
     * @doc method
     * @methodOf financeModule.service:creditcardService
     * @name financeModule.service:creditcardService#isNotValidYear
     * @description
     * Returns true if year is less than current year
     */
    this.isNotValidYear = function(expiryyear) {
      if (expiryyear) {
        let today = new Date(),
          currentYear = today.getFullYear();
        return parseInt(expiryyear, 10) < currentYear;
      }
    };



  }
}

creditcardService.$inject = [];

angular.module('vendingMachineApp.financeModule')
  .service('creditcardService', creditcardService);
