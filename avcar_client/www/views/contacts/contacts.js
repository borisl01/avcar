angular.module('App')
.controller('ContactsController', function ($scope, $http, $stateParams, $ionicActionSheet, $ionicModal, Contacts, Settings) {
  $scope.params = $stateParams;
  $scope.settings = Settings;
  
  var theContact = Contacts.getContactById($stateParams.cid);
  //Contacts.contactPrint(theContact);
  $scope.contact = theContact;
  
 /* $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, $location) {
	 console.log("State changed: ", toState);
    // if ($location.path() == "/tab/main") {
	 	$scope.refreshItems();
	// }
  });

  
  $scope.refreshItems = function() {
	  $scope.favorites = Contacts.getFavorites();
		console.log("Refreshing items!");
  };
  */
 /*
  $http.get('/api/forecast/' + $stateParams.lat + ',' + $stateParams.lng, {params: {units: Settings.units}}).success(function (forecast) {
    $scope.forecast = forecast;
  });
*/
  var barHeight = document.getElementsByTagName('ion-header-bar')[0].clientHeight;
  $scope.getWidth = function () {
    return window.innerWidth + 'px';
  };
  $scope.getTotalHeight = function () {
    return parseInt(parseInt($scope.getHeight()) * 3) + 'px';
  };
  $scope.getHeight = function () {
    return parseInt(window.innerHeight - barHeight) + 'px';
  };

  $scope.showContactOptions = function () {	 
    var sheet = $ionicActionSheet.show({
      buttons: [
        {text: 'Toggle Favorite'},
        {text: 'Call'},
        {text: 'Send a message'},
        {text: 'Modify'},
        {text: 'Remove'}
      ],
      cancelText: 'Cancel',
      buttonClicked: function (index, $scope) {
        if (index === 0) {
          Contacts.toggle($stateParams.cid);
          //$scope.$emit("CallParentMethod", {});
         // $scope.favorites = Contacts.getFavorites();
        }
        if (index === 1) {

        }
        if (index === 2) {

        }
        if (index === 3) {

        }
        if (index === 4) {

        }
        return true;
      }
    });
  };

});
