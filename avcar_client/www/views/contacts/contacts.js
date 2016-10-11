angular.module('App')
.controller('ContactsController', function ($scope, $rootScope, $http, $stateParams, $ionicActionSheet, $ionicModal, $translate, Contacts, Settings) {
  $scope.params = $stateParams;
  $scope.settings = Settings;
  
  var theContact = Contacts.getContactById($stateParams.cid);
  
  $scope.contact = theContact;
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
        //{text: 'Toggle Favorite'},
        {text : '<p class="actionsheet-center">'+ $rootScope.loadedTranslations.TOGGLE_FAVORITE +'</p>'},
        {text: 'Call'},
        {text: 'Send a message'},
        {text: 'Modify'},
        {text: 'Remove'}
      ],
      cancelText: 'Cancel',
      buttonClicked: function (index, $scope) {
        if (index === 0) {
          Contacts.toggle($stateParams.cid);
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
