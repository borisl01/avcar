angular.module('App', ['ionic', 'pascalprecht.translate'])

.config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
  $stateProvider
    .state('search', {
      url: '/search',
      controller: 'SearchController',
      templateUrl: 'views/search/search.html'
    })
    .state('settings', {
      url: '/settings',
      controller: 'SettingsController',
      templateUrl: 'views/settings/settings.html'
    })
    .state('weather', {
      url: '/weather/:city/:lat/:lng',
      controller: 'WeatherController',
      templateUrl: 'views/weather/weather.html'
    })
    .state('contact', {
      url: '/contact/:cid',
      controller: 'ContactsController',
      templateUrl: 'views/contacts/contacts.html'
    });

    $urlRouterProvider.otherwise('/search');
  

  $translateProvider
  	.useStaticFilesLoader({
  		prefix: '/lang/',
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



.run(function($ionicPlatform, $http) {
	//Translator.init(); 
    //Translator.setDict('en-US');

    $ionicPlatform.ready(function() {
    	navigator.splashscreen.show();
    	setTimeout(function () {
    		navigator.splashscreen.hide();
    	}, 5000);
     
       if(window.cordova && window.cordova.plugins.Keyboard) {
         cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
       }
       // console.log("globalization=" + navigator.globalization);
   
       if(window.StatusBar) {
          StatusBar.styleDefault();
       }
    });
})

.controller('LeftMenuController', function ($scope, $rootScope, $translate, Locations, Contacts, Settings) {
  //console.log('Launching controller...');
  
  // Translator.fulfil();
  
  $scope.locations = Locations.data;
  //$scope.contacts = Contacts.data;
  $scope.favorites = Contacts.getFavorites();
  
  Settings.setLanguage('en');

  $scope.$on("favorites", function() {
     console.log("CallParentMethod");	
     $scope.favorites = Contacts.getFavorites();
     //Translator.fulfil();
     Settings.setLanguage('ua');
   });
  
   $scope.switchLanguage = function(key) {
 	    $translate.use(key);
	};
  }
)

.filter('timezone', function () {
  return function (input, timezone) {
    if (input && timezone) {
      var time = moment.tz(input * 1000, timezone);
      return time.format('LT');
    }
    return '';
  };
})

.filter('chance', function () {
  return function (chance) {
    if (chance) {
      var value = Math.round(chance * 10);
      return value * 10;
    }
    return 0;
  };
})

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
		units: 'us',
		days: 8,
  
	setLanguage : function(lang)  {
		console.log('Setting langiuage to '+ lang);
	    $translate.use(lang);
	    $rootScope.loadedTranslations = [];
	    $rootScope.LoadValues = function()  {
	    $translate(['TOGGLE_FAVORITE','secound']).then(function(translations){
	    	$rootScope.loadedTranslations = translations;
	    	})
	    };
	    $rootScope.LoadValues();
	    console.log($rootScope.loadedTranslations.TOGGLE_FAVORITE);
	}
  }
  return Settings;
})

.factory('Locations', function ($ionicPopup) {
  var Locations = {
    data: [{
      city: 'Chicago, IL, USA',
      lat: 41.8781136,
      lng: -87.6297982
    }],
    getIndex: function (item) {
      var index = -1;
      angular.forEach(Locations.data, function (location, i) {
        if (item.lat == location.lat && item.lng == location.lng) {
          index = i;
        }
      });
      return index;
    },
    toggle: function (item) {
      var index = Locations.getIndex(item);
      if (index >= 0) {
        $ionicPopup.confirm({
          title: 'Are you sure?',
          template: 'This will remove ' + Locations.data[index].city
        }).then(function (res) {
          if (res) {
            Locations.data.splice(index, 1);
          }
        });
      } else {
        Locations.data.push(item);
        $ionicPopup.alert({
          title: 'Location saved'
        });
      }
    },
    primary: function (item) {
      var index = Locations.getIndex(item);
      if (index >= 0) {
        Locations.data.splice(index, 1);
        Locations.data.splice(0, 0, item);
      } else {
        Locations.data.unshift(item);
      }
    }
  };

  return Locations;
})

.factory('Contacts', function ($rootScope) {
	var Contacts = {
	  data:[{
		id	:	1,
		name: 'test',
		rego: 'VTM123',
		phone: 'Unknown',
		notes: 'Cheeky chick',
		isFavorite : true	
	  },
	  {
		id	:	2,
		name: 'test22',
		rego: 'ABC123',
		phone: 'Unknown',
		notes: 'Checky chick',
		isFavorite : true
	  }],
	  toggle : function(cid) {
		 var aContact = Contacts.getContactById(cid);
		 var index = Contacts.getIndex(aContact);
		 Contacts.data[index].isFavorite = !Contacts.data[index].isFavorite
		 //console.log('value is ', Contacts.data[index].isFavorite, ' emitting...');
		 $rootScope.$broadcast("favorites", {}); 
	  },
	  getFavorites : function() {
		  var result = [];
	      angular.forEach(Contacts.data, function (c, i) {
	        if (c.isFavorite) {
	          result[result.length] = c;
	        }
	      });
	      //console.log('favorites.length=' + result.length);
	      for (m = 0; m<result.length; m++){
	    	  item = result[m];
	    	  //console.log(item.id + ' ' + item.name + " " + item.isFavorite); 
	      }
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
	  contactPrint: function(item) {
		 console.log("Contact assigned to scope:"); 
		 console.log(item.id + ' ' + item.name + " " + item.isFavorite); 
	  }
	}
	return Contacts;
})
;
