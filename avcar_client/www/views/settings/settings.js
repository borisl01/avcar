angular.module('App')
.controller('SettingsController', function ($scope, Settings) {
   $scope.settings = Settings;
   console.log('Starting Settiings Controller');
	
  // $scope.canDelete = false;
  
  //BL Simply redirects to the factory 
   $scope.setLanguage = function() {
	  console.log('here');
 	 // Settings.setLanguage();
   };

   //$scope.remove = function (index) {
   // Locations.toggle(Locations.data[index]);
   //};
});
