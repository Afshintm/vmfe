'use strict';

/**
 * @ngdoc overview
 * @name vendingMachineApp
 * @description
 * # vendingMachineApp
 *
 * Main module of the application.
 */ 

angular.module('vendingMachineApp', ['ui.router' ,'ngAnimate','ngCookies', 'ngGuid', 'config','vendingMachineApp.financeModule'])
.provider('config',function(){
   this.$get = function(){
     return angular.module('config');
   };
 })

// we inject the defined provider using the provider name + 'Provider' suffix to our module config phase 
.config(['ENV','$provide', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'configProvider','$qProvider',
  function(ENV, $provide, $stateProvider, $urlRouterProvider, $httpProvider, configProvider,$qProvider){
    $qProvider.errorOnUnhandledRejections(false);

  //In configuration phase we get other dependecies using their providers
  //at this stage services, factories and controllers have not been instantiated yet
  //console.log('vendingMachineApp configuration phase is happening...') ;
  
  console.log(configProvider);

  //$httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];


	
  $provide.factory('myHttpInterceptor',['$q','$window','$cookies',function myHttpInterceptor($q,$window,$cookies){
    var requestInterceptor = {
      request: function(config){

        config.headers.Authorization = 'Basic YWZzaGluOlBhc3N3b3JkIQ==';
        if ($window.sessionStorage.authenticatedUser)
        {        
          console.log('this is authenticated User from sessionStorage :');
          console.log($window.sessionStorage.authenticatedUser);
        }

        var authenticatedUser = $cookies.get('authenticatedUser') ;
        if(authenticatedUser)
        {
          //console.log('this is authenticated User from cookieStore :');
          //console.log(authenticatedUser) ;
          $cookies.remove('authenticatedUser');

        }

        return config || $q.when(config);
      }

    } ;

    return requestInterceptor ;
  }]);

  $httpProvider.interceptors.push('myHttpInterceptor');

  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/');

  // Now set up the states
  $stateProvider
    .state('vmMain',{
      url:'/vmMain',
      templateUrl:'views/vmMain.html',
      controller:'vmMainCtrl'
     });

     $stateProvider.state('payment',{
      abstract: true,
      url:'/pay',
      templateUrl:'views/tpl_payment.html',
      controller:'paymentCtrl'
     })
     .state('payment.cash',{
      url:'/cash',
      templateUrl:'views/pay_cash.html',
      controller: 'cashPaymentCtrl'
     }).state('payment.creditCard',{
      url:'/cc',
      templateUrl:'views/pay_cc.html',
      controller:'ccPaymentCtrl'
     });
   
}])
.run(['$cookies','$state','$rootScope','config',
  function($cookies,$state,$rootScope,config){
     $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      console.log('$stateChangeStart is happening') ;
      console.log(event);
      console.log(config);
        // track the state the user wants to go to; authorization service needs this
         $rootScope.toState = toState;
         $rootScope.toStateParams = toStateParams;
        // if the principal is resolved, do an authorization check immediately. otherwise,
        // it'll be done when the state it resolved.
        // if(toState.authRequired){
        //   authorization.authorize();
        // }
      });    

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      console.log('state Changed Error.');
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the login page
      console.log(error);
      // if (error === 'AUTH_REQUIRED') {
      //   console.log('Redirectibg to login');
      //   $state.go('login');
      // }
    });

		$state.go('vmMain');
	}]);

