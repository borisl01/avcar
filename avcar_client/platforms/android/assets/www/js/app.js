angular.module('App', ['ionic', 'pascalprecht.translate', 'ngCordova'])  //, 'ngCordova'

.config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
  $stateProvider
    .state('settings', {
      url: '/settings',
      controller: 'SettingsController',
      templateUrl: 'views/settings/settings.html'
    })
    .state('contacts', {
      url: '/contacts',
      controller: 'ContactsController',
      templateUrl: 'views/contacts/all_contacts.html'
    })
    .state('edit', {
      url: '/edit/:cid',
      controller: 'ContactsController',
      templateUrl: 'views/contacts/contact_edit.html'
    })
    .state('contact', {
      url: '/contact/:cid',
      controller: 'ContactsController',
      templateUrl: 'views/contacts/contacts.html'
    });

    $urlRouterProvider.otherwise('/contacts');
    
  $translateProvider
  	.useStaticFilesLoader({
  		prefix: 'res/lang/',
  		suffix: '.lang.json'
  	})
  	.registerAvailableLanguageKeys(['en', 'de', 'ua'], {
  		'en' : 'en', 'en_GB': 'en', 'en_US': 'en',
  		'de' : 'de', 'de_DE': 'de', 'de_CH': 'de',
  		'ua' : 'ua', 'ua_UA': 'ua'
  	})
  	.preferredLanguage('en')
  	.fallbackLanguage('en')
  	.determinePreferredLanguage()
  	.useSanitizeValueStrategy('escapeParameters');
})  

.run(function($ionicPlatform, $http, $cordovaSms) {
    $ionicPlatform.ready(function() {

    	if(window.cordova && window.cordova.plugins.Keyboard) {
         cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
       }
   
       if(window.StatusBar) {
          StatusBar.styleDefault();
       }
       
       //prepare SMS sender
       var options = {
      	 replaceLineBreaks: false, // true to replace \n by a new line, false by default
      	 android: {
      		 intent: '' // send SMS with the native android SMS messaging
      	    //intent: '' // send SMS without open any other app
      	    //intent: 'INTENT' // send SMS inside a default SMS app
      	 }
       };
      	 
       sendSMS = function($cordovaSms) {  
      	
      	 $cordovaSms
      	   .send('0959052082', 'This is some dummy text', options)
      	   .then(function() {
      	        alert('Success');
      	    }, function(error) {
      	    	  alert('Error');
      	    });
       }
       
    });
})

.controller('LeftMenuController', function ($scope, $rootScope, $state, $translate, Contacts, Settings) {
    setData = function() {	
    	$scope.contacts = Contacts.getAll();
    	$scope.favorites = Contacts.getFavorites();
    };
    
    setSelectedContact = function() {
    	$scope.selectedContact = $rootScope.selectedContact;
    };
    
    setData();
  	Settings.setLanguage('en');
  	
  	$scope.$on("contactSelect", function() { 
  		setSelectedContact();  
 	});

    $scope.$on("contacts", function() {
    	setData();
    });
  
    $scope.switchLanguage = function(key) {
 	    $translate.use(key);
	};
	
	$rootScope.state = $state;
  }
)


/* Just an example */
.filter('icons', function () {
  var map = {
    'clear-day': 'ion-ios-sunny',
    'clear-night': 'ion-ios-moon',
    rain: 'ion-ios-rainy',
    snow: 'ion-ios-snowy',
    sleet: 'ion-ios-rainy',
    wind: 'ion-ios-flag',
    fog: 'ion-ios-cloud',
    cloudy: 'ion-ios-cloudy',
    'partly-cloudy-day': 'ion-ios-partlysunny',
    'partly-cloudy-night': 'ion-ios-cloudy-night'
  };
  return function (icon) {
    return map[icon] || '';
  }
})

.factory('Settings', function ($translate, $rootScope) {
	var Settings = {
		lang : 'en',	
		units: 'us',
		days: 8,
	
	setLanguage : function(lang)  {
		console.log('Setting language to '+ lang);
		Settings.lang = lang;
	    $translate.use(lang);
	    $rootScope.loadedTranslations = [];
	    $rootScope.LoadValues = function()  {
	    $translate(['TOGGLE_FAVORITE','CONFIRM' ,'YES', 'NO', 'CANCEL'])
	    		.then(function(translations){
	    	   $rootScope.loadedTranslations = translations;
	    	})
	    };
	    $rootScope.LoadValues();
	}
  }
  return Settings;
})

/**
 * Some test data and processing rules
 */
.factory('Contacts', function ($rootScope, $ionicPopup, $state) {
	var Contacts = {
	  data:[{
		id	:	1,
		name: 'test',
		rego: 'VTM123',
		phone: '0414870434',
		notes: 'Cheeky chick',
		isFavorite : true	
	  },
	  {
		id	:	2,
		name: 'test22',
		rego: 'ABC123',
		phone: '0414870434',
		notes: 'Checky chick',
		isFavorite : true
	  }],
	  
	  toggleFavorite : function(cid) {
		 var aContact = Contacts.getContactById(cid);
		 var index = Contacts.getIndex(aContact);
		 Contacts.data[index].isFavorite = !Contacts.data[index].isFavorite
		 //console.log('value is ', Contacts.data[index].isFavorite, ' emitting...');
		 $rootScope.$broadcast("contacts", {}); 
	  },
	  remove : function(cid) {
		 var aContact = Contacts.getContactById(cid);
		 var index = Contacts.getIndex(aContact);
		 if (index >= 0) {
		    $ionicPopup.confirm({
		       title: $rootScope.loadedTranslations.CONFIRM,
		       template: 'This will remove ' + aContact.name ,
		       buttons: [
		                 { text: $rootScope.loadedTranslations.YES, onTap:function(e){return true;} },
		                 { text: $rootScope.loadedTranslations.NO,  onTap:function(e){return false;}  }
		                ] 
		     }).then(function (res) {
		        if (res) {
		            Contacts.data.splice(index, 1);
		            $rootScope.$broadcast("contacts", {}); 
		            //Contacts.list();
		            $state.go('contacts');
		        }
		     });
		 }  
	  },		 
	  getAll : function() {
		 return this.data;
	  },
	  getFavorites : function() {
		  var result = [];
	      angular.forEach(Contacts.data, function (c, i) {
	        if (c.isFavorite) {
	          result[result.length] = c;
	        }
	      });
	      //console.log('favorites.length=' + result.length);
	      return result;
	  },
	  getIndex: function (item) {
	      var index = -1;
	      angular.forEach(Contacts.data, function (c, i) {
	        if (item.name == c.name) {
	          index = i;
	        }
	      });
	      return index;
	  },
	  getContactById : function(cid) {
		  var result = null;
	      angular.forEach(Contacts.data, function (c, i) {
	        if (c.id == cid) {
	          result = c;
	        }
	      });
	      return result;
	  },
	  getContactByName : function(aname) {
		  var result = null;
	      angular.forEach(Contacts.data, function (c, i) {
	        if (c.name == aname) {
	          result = c;
	        }
	      });
	      return result;
	  },
	  edit : function(cidIn) {
		  $rootScope.$broadcast("contactSelect", {}); 
		  $state.go("edit" ,{cid: cidIn }  );
		  //this.contactPrint($rootScope.selectedContact);
	  },
	  replaceContact: function(cid,  item)  {
		  if (cid == -1) {		//This is a new contact
			  item.id = Contacts.data.length + 1;
			  Contacts.data[Contacts.data.length] = item;
		  } else {
			  var contact = Contacts.getContactById(cid);
		  	  var index = Contacts.getIndex(contact);
		  	  Contacts.data[index] = item;
	  	  }	   
		  $state.go('contacts');
	  },		  
	  list : function() {
		  for (m = 0; m < this.data.length; m++){
			  this.contactPrint(this.data[m]);
		  }
	  },
	  contactPrint: function(item) {
		//console.log("Contact assigned to scope:"); 
		 console.log(item.id + ' ' + item.name + " " + item.isFavorite + " " + item.phone); 
	  }
	}
	return Contacts;
})
;
