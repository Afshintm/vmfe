'use strict';

/**
 * @ngdoc module
 * @name financeModule
 *
 * @description
 *
 * module to access finance functions
 *
 *
 */
angular.module('vendingMachineApp.financeModule', ['ngGuid','config'])
.provider('config',function(){
   this.$get = function(){
     return angular.module('config');
   };
 })
.config(['ENV','$provide', 'configProvider',
  function(ENV, $provide,  configProvider){}])
.run(['config',  function(config){
}]);
