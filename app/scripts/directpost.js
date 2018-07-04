'use strict';

/**
 * @ngdoc module
 * @name directpostApp
 *
 * @description
 *
 * directpost application module used mainly to capture responses from securepay
 *
 *
 */
angular
  .module('directpostApp', [])
	//used to support {server}/token.html to capture securepay responses
	// enable html5Mode for pushstate ('#'-less URLs)
	.config(['$locationProvider', ($locationProvider) => {
		$locationProvider.html5Mode(true);
	}]);
