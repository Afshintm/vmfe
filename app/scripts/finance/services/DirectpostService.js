'use strict';

class DirectpostService {
  constructor($http, ENV, $window, $sce) {

    /**
     * @doc method
     * @methodOf financeModule.service:DirectpostService
     * @name financeModule.service:DirectpostService#getPaymentFingerprint
     * @description
     * get payment fingerprint from server to submit to securepay
     */
    this.getPaymentFingerprint = function(account, payment) {
      var url = ENV.apiEndpoint + '/v1/payment/fingerprint/' + account +  '/0/' + payment ;

      // get timestamp and figerprint from our server
      return $http.get(url)
        .then(function(response) {
          return response.data.DataObject;
        });
    };

    /**
     * @doc method
     * @methodOf financeModule.service:DirectpostService
     * @name financeModule.service:DirectpostService#buildSecurepayPostData
     * @description
     * build securpay postData object
     */
    this.buildSecurepayPostData = function(conf) {
      var postData = {
        data: {
          redirectUrl: 'https://api.securepay.com.au/test/directpost/authorise',
          redirectMethod: 'POST',
          redirectData: {
            'EPS_MERCHANT': 'PPT0135',
            'EPS_TXNTYPE': conf.type.toString(), //should be 0 for payment and 1 for token request
            'EPS_REFERENCEID': conf.referenceId,
            'EPS_AMOUNT': conf.outstanding,
            'EPS_TIMESTAMP': conf.timestamp,
            'EPS_FINGERPRINT': conf.fingerprint,
            'EPS_REDIRECT': 'TRUE',
            // 'EPS_CALLBACKURL': //'https://40e4cf53.ngrok.com/api/tc3webservice/v1/payment/callback/false/' + conf.type.toString() + '/',
            // 'https://takecommandtest.commander.com/api/tc3webservice/v1/payment/callback/0/' + conf.type.toString() + '/',
            'EPS_RESULTURL': $window.location.origin + '/token.html',
            'EPS_CARDNUMBER': conf.cardnumber,
            'EPS_EXPIRYMONTH': conf.expMonth,
            'EPS_EXPIRYYEAR': conf.expYear.slice(2),
            'EPS_CCV': conf.expCCV
          },
          resultUrl: void(0)
        }
      };

      var spData = postData.data;

      if (conf.type.toString() === '1') {
        spData.redirectData.EPS_STORE = 'TRUE';
        spData.redirectData.EPS_STORETYPE = 'TOKEN';
        //spData.redirectData.EPS_TXNTYPE = '0';
        // spData.redirectData.EPS_CALLBACKURL = //'https://40e4cf53.ngrok.com/api/tc3webservice/v1/payment/callback/true/1/';
        // 'https://takecommandtest.commander.com/api/tc3webservice/v1/payment/callback/1/' + conf.type.toString() + '/';
      }

      // sanitize urls
      spData.redirectUrl = $sce.trustAsResourceUrl(spData.redirectUrl);
      spData.redirectData.EPS_RESULTURL = $sce.trustAsResourceUrl(spData.redirectData.EPS_RESULTURL);

      return postData;
    };

    /**
     * @doc method
     * @methodOf financeModule.service:DirectpostService
     * @name financeModule.service:DirectpostService#postSecurePayResult
     * @description
     * post securepay success response to server
     */
    this.postSecurePayResult = function(result) {
      var url = ENV.apiEndpoint + '/v1/payment/callback' ;
      var postData = {
        brandCode: Brandcode.getBrandCode(),
        timestamp: result.timestamp,
        fingerprint: result.fingerprint,
        txnid: result.txnid,
        merchant: result.merchant,
        restext: result.restext,
        rescode: result.rescode,
        expirydate: result.expirydate,
        settdate: result.settdate,
        refid: result.refid,
        pan: result.pan,
        summarycode: result.summarycode,
        //honouring transaction type or txntype if specified
        txntype: result.txntype || 0,
        strescode: result.strescode,
        strestext: result.strestext,
        token: result.token,
        preauthid: result.preauthid
      };

      // get response from our server
      return $http.post(url, postData);
    };
  }
}

DirectpostService.$inject = ['$http', 'ENV', '$window', '$sce'];

angular.module('vendingMachineApp.financeModule')
  .service('DirectpostService', DirectpostService);
