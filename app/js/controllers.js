'use strict';


var controller = function($scope, $http, $filter) {
	$http.get('data/confs.json').success(function(data) {
		$scope.loadedConferences = data;
	});
	
	$scope.displayedConferences = [].concat($scope.loadedConferences);

	$scope.diversityPercentage = function (conf) {
		return (conf.numberOfWomen / conf.totalSpeakers * 100) | $filter('number')(0);
	};

	$scope.diversityScore = function (conf) {
		var percentage = this.diversityPercentage(conf);
		if (percentage < 10) {
			return "F";
		} else if (percentage < 20) {
			return "E";
		} else if (percentage < 30) {
			return "D";
		} else if (percentage < 40) {
			return "C";
		} else if (percentage < 50) {
			return "B";
		} else {
			return "A";
		}
	};
};

var directive = function() {
	return {
		scope: true,
		templateUrl: 'components/conflist/conflist.html',
		controller: controller,
		controllerAs: 'ctrl'
	};

};

angular.module('app', ['smart-table'])
	.filter('diversityPercentage', function($filter) {
		return function (conf) {
			return ((conf.numberOfWomen / conf.totalSpeakers * 100) | $filter('number')(0));
		};	
	})
	.filter('numberOfMen', function() {
		return function (conf) {
			return (conf.totalSpeakers - conf.numberOfWomen);
		};		
	})
	.filter('friendlyYear', function() {
		return function (year) {
			var thisYear = new Date().getFullYear();
			var yearDiff = thisYear - year;
			if (yearDiff == 0) {
				return "this year";
			} else if (yearDiff == 1) {
				return "last year";
			} else {
				return yearDiff + " years ago";
			}
		}		
	})
	.directive('conflist', directive);
