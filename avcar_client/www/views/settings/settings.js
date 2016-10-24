angular.module('App')
.controller('SettingsController', function ($scope, Settings) {
   $scope.settings = Settings;
   //console.log('Starting Settiings Controller');
  
   //BL Simply redirects to the factory 
   $scope.setLanguage = function(value) {
 	  Settings.setLanguage(value);
   };

   //$scope.remove = function (index) {
   // Locations.toggle(Locations.data[index]);
   //};
});
