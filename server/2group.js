// Publish

Meteor.publish('groups', function(orgId){
	return Groups.find({_id: {$in: Roles.getGroupsForUser( this.userId ) }});
})

Meteor.publish('user-groups', function(){
	return Groups.find({_id: {$in: Roles.getGroupsForUser( this.userId ) }});
})

Meteor.publish('all-groups', function(){
	return Groups.find({});
})

Groups.before.insert(function(userId, doc){
	// for(i=0;i<doc.roles['can-manage'].length; i++){
		// user = Meteor.users.findOne({"emails.address": doc.roles['can-manage'][i]});
		// doc.roles['can-manage'][i] = user._id;
		// doc.roles['is-subscribed'][i] = user._id;
	// }
})

// After Insert
Groups.after.insert(function(userId, doc){

    for(i=0; i< doc.roles['can-manage'].length; i++){
    	id = Meteor.users.findOne({'emails.address':doc.roles['can-manage'][i]}, {'_id':1});
    	Roles.addUsersToRoles(id, ['can-manage', 'is-subscribed'], this._id)
    };
  	
    // Organizations.update({_id: orgid}, { $push: {'groups': doc._id} });
    var org = Organizations.findOne({_id:doc.orgId});
    console.log(org);
    org.groups.push(doc._id);
    Organizations.update({_id:doc.orgId},org);
    // console.log(org);
    
  
})

// Before Update
Groups.before.update(function(userId, doc, fieldNames, modifier, options){
	modifier.updatedAt = new Date();

	if(modifier.createdAt === undefined)
		modifier.createdAt = new Date();

	if(modifier.createdBy === undefined)
		modifier.createdBy = Meteor.userId();

	// for(i=0; i<doc.roles['can-manage'].length; i++){
		
		// user = Meteor.users.findOne({"emails.address": doc.roles['can-manage'][i]});
		
		// if(user != undefined){
			// Replacing Emails with ID in the doc
			// modifier.roles['can-manage'][i] = user._id;
			// modifier.roles['is-subscribed'][i] = user._id;
		// }
		
	// }

})

// After Update
Groups.after.update(function(userId, doc, fieldNames, modifier, options){
	
	Array.prototype.diff = function(a) {
	  return this.filter(function(i) {return a.indexOf(i) < 0;});
	};

	to_add = doc.roles['can-manage'].diff(this.previous.roles['can-manage']);

	for(i=0; i<to_add.length; i++){
	  	// Updating User Roles
	  	user = Meteor.users.findOne({'emails.address': to_add[i]});
	  	Roles.addUsersToRoles(user._id, ['can-manage','is-subscribed'], doc._id)
	}

	to_remove = this.previous.roles['can-manage'].diff(doc.roles['can-manage']);

	for(i=0; i<to_remove.length; i++){

	  user_id = Meteor.users.findOne({'emails.address': to_remove[i]});
	  Roles.setUserRoles(user_id, ['is-subscribed'], doc._id);
	}

})

// After Remove
Groups.after.remove(function(userId, doc){

	for(i=0;i<doc.roles['is-subscribed'].length; i++){
	  user_id = Meteor.users.findOne({'emails.address': doc.roles['is-subscribed'][i]})._id;
	  Roles.setUserRoles(user_id, [], doc._id);
	}

	for(i=0; i<doc.roles['can-manage'].length; i++){
	  user_id = Meteor.users.findOne({'emails.address': doc.roles['can-manage'][i]})._id;
	  Roles.setUserRoles(user_id, [], doc._id); 
	}

	var org = Organizations.findOne({_id: doc.orgId});
	org.groups.splice(org.groups.indexOf(doc._id),1);
	Organizations.update({_id:doc.orgId}, org);
	// Organizations.update({_id: doc.orgId}, {$pullAll: {groups: [doc._id]}});

});