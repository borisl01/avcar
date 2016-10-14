angular.module('App')
.controller('ContactsController', function ($scope, $rootScope, $stateParams, $ionicActionSheet, Contacts, Settings) {
  $scope.params = $stateParams;
  $scope.settings = Settings;
  $scope.contacts = Contacts.getAll();
  $scope.model = {name : '',
		          rego : '',
		          phone : '',
		          notes : '',
		          picture : ''};
  
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

  $scope.showContactOptions = function($state) {	
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
        	var  item = Contacts. getContactById($stateParams.cid)
        	//Contacts.contactPrint(item);
    		$rootScope.selectedContact = item
        	Contacts.edit();
        }
        if (index === 4) {
        	Contacts.remove($stateParams.cid);
        }
        return true;
      }
    });
  };
  
  $scope.showContactListOptions = function () {	
	    var sheet = $ionicActionSheet.show({
		
	      buttons: [
	        //{text: 'Toggle Favorite'},
	        {text : 'Add a contact'},
	        {text: 'Add from phonebook'}
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
	  
	  $scope.saveContact = function()  {
		  var cid = $rootScope.selectedContact.id;
		 //var contact = Contacts.getContactById(cid);
		  Contacts.replaceContact(cid,  $rootScope.selectedContact);
	  };

});
