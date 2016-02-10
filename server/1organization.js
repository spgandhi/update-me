// Publish
Meteor.publish('organizations', function(){
	return Organizations.find({_id: {$in: Roles.getGroupsForUser( this.userId ) }});
});

// After Insert
Organizations.after.insert(function(userId, doc){
	
	for(i=0; i< doc.admins.length; i++){
    	id = Meteor.users.findOne({'emails.address':doc.admins[i]}, {'_id':1});
    	Roles.addUsersToRoles(id, ['can-manage', 'is-subscribed'], this._id)
    };
	
})

// After Remove
Organizations.after.remove(function(userId, doc){
	// Removing all user roles
	for(i=0; i<doc.roles['can-manage'].length; i++){
		user_id = Meteor.users.findOne({'_id': doc.roles['can-manage'][i]})._id;
		Roles.setUserRoles(user_id, [], doc._id); 
	}
})

Organizations.before.update(function(userId, doc, fieldNames, modifier, options){
	modifier.updatedAt = new Date();

	if(modifier.createdBy === undefined)
		modifier.createdBy = Meteor.userId();

	if(modifier.createdAt === undefined)
		modifier.createdAt = new Date();
})

Organizations.after.update(function(userId, doc, fieldNames, modifier, options){
	
	Array.prototype.diff = function(a) {
	  return this.filter(function(i) {return a.indexOf(i) < 0;});
	};

	to_add = doc.admins.diff(this.previous.admins);

	for(i=0; i<to_add.length; i++){
	  	// Updating User Roles
	  	user = Meteor.users.findOne({'emails.address': to_add[i]});
	  	Roles.addUsersToRoles(user._id, ['can-manage','is-subscribed'], doc._id)
	}

	to_remove = this.previous.admins.diff(doc.admins);

	for(i=0; i<to_remove.length; i++){

	  user_id = Meteor.users.findOne({'emails.address': to_remove[i]});
	  Roles.setUserRoles(user_id, ['is-subscribed'], doc._id);
	}

})