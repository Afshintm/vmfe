'use strict';

/**
 * @ngdoc controller
 * @name controller:AcceptTokenController
 *
 * @requires ng.service:$location
 *
 * @description
 * The `AcceptTokenController` controller is used to handle behaviour for accepting token
 * from securepay and storing as cookie so main dealerPortalApp can get access.
 * All the page needs to dop is load and render so it doesn't really matter what
 * happens below
 */
class AcceptPaymentController {
	constructor($location) {

		// updates model to display message in view (only used for testing)
		this.message = ($location.search().summarycode === '1') ? 'Approved' : 'Declined';

	}
}

AcceptPaymentController.$inject = ['$location'];

angular.module('directpostApp')
	.controller('AcceptPaymentController', AcceptPaymentController);
