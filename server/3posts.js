// Publish
Meteor.publish('allUsers', function(){
  return Meteor.users.find({},{'emails':1});
})

Meteor.publish('posts', function(reason){
  // return Posts.find({'group._id': {$in: Roles.getGroupsForUser( this.userId) }});
  if(reason == 'frontend')
  	return Posts.find({post_status : 'publish'});

  if(reason == 'backend')
  	return Posts.find({ $or: [ {created_by: this.userId} ]})

  if(reason == 'super-admin')
  	return Posts.find({});
  
  return Posts.find({post_status : 'publish'});  
})

// After Insert
Posts.after.insert(function(userId, doc){
  Groups.update({_id: doc.group._id}, {$inc: {'options.posts': 1} });
})

// 
Posts.after.remove(function(userId, doc){
  Groups.update({_id: doc.group._id}, {$inc: {'options.posts': -1} });
})

// Before Insert
Posts.before.insert(function(userId, doc){

	var grp = Groups.findOne({_id: doc.group._id});

	if(grp.options.manager_draft){
		
		org = Organizations.findOne({_id: grp.orgId});
		
		if(org.createdBy == userId){
			doc.post_status = 'publish';
		}else{
			doc.post_status = 'draft';
		}

	}
})