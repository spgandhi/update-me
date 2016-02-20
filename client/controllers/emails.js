 var app = angular.module('update-me');

app.controller('Event-Email', ['$scope', 'url', function($scope, url){
	$scope.url = url;
	Meteor.subscribe('posts', function(){
		$scope.posts = Posts.find( { 'options.isEvent': true} ).fetch();

		$scope.deadline = Posts.find({'options.hasDeadline': true}).fetch();

		$scope.emailContent = {events : $scope.posts, deadline: $scope.deadline};
		console.log($scope.emailContent);
		// Meteor.call('sendEmail', function(err, value){
		// 	if(err)
		// 		console.log(err)
		// 	else
		// 		console.log('email sent');
		// })
	})
}])