angular.module('App')
.controller('ContactsController', function ($scope, $rootScope, $stateParams, $ionicActionSheet, Contacts, Settings) {
  $scope.params = $stateParams;
  $scope.settings = Settings;
  $scope.contacts = Contacts.getAll();
  
  var cid = $stateParams.cid;
  console.log(cid);
 
  if (cid && cid == -1) {
	  theContact = {id : -1, name:'', rego:'', phone:'', notes:''};
	  $rootScope.selectedContact = theContact;
  } else {
	  var theContact = Contacts.getContactById(cid);
	  
	  if (theContact == null) {
		  //console.log("no cid"); 
	  } else {
		  if (cid && cid == -1) {
			  theContact = {id : -1, name:'', rego:'', phone:'', notes:''};
			  $rootScope.selectedContact = theContact;
		  } else {	  
			  $scope.selectedContact = theContact;
			  //console.log("contacts.js:");
			  //Contacts.contactPrint($scope.selectedContact);
		  }
	  }
  }
  
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
        {text: 'Modify'},
        {text: 'Remove'}
      ],
      cancelText: 'Cancel',
      buttonClicked: function (index) {
        if (index === 0) {
          Contacts.toggleFavorite($stateParams.cid);
        }
        if (index === 1) {
        	var  item = Contacts.getContactById($stateParams.cid)
        	//Contacts.contactPrint(item);
    		$rootScope.selectedContact = item;
        	Contacts.edit($stateParams.cid);
        }
        if (index === 2) {
        	Contacts.remove($stateParams.cid);
        }
        return true;
      }
    });
  };
  
  $scope.showContactListOptions = function () {	
	    var sheet = $ionicActionSheet.show({
		
	      buttons: [
	        {text : 'Add a contact'},
	        {text: 'Add from phonebook'}
	      ],
	      cancelText: 'Cancel',
	      buttonClicked: function (index) {
	        if (index === 0) {
	      	  Contacts.edit(-1);
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
		  
		 //var contact = Contacts.getContactById(cid);
		  Contacts.contactPrint($rootScope.selectedContact);
		  var cid = $rootScope.selectedContact.id;
		  Contacts.replaceContact(cid,  $rootScope.selectedContact);
	  };

});
