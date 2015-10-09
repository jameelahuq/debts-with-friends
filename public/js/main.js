/**
 * Created by HUQ on 10/8/15.
 */
var app = angular.module('friendDebt', [])
  .controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
      $scope.friends = [];
      $scope.amount = 5;

      $scope.sendTransaction = function() {
        var params = [$scope.to, $scope.from, $scope.amount];
        $http.post('transactions', {params: params}).then(
            function() {
              getData();
              $scope.to = "";
              $scope.from = "";
            }
        )
      };

      var getData = function() {
        $http.get('friends').then(
            function (response) {
              $scope.friends = response.data;
            },
            function (err) {
              console.log(err);
            }
        )
      }

      getData();
    }]);