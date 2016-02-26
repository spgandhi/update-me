SyncedCron.add({
  name: 'email digest',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 08:00 am');
  },
  job: function() {
    Meteor.call('morningMail', function(){
      console.log('Emails sent by cron job');
    })
  }
});

Meteor.startup(function () {
  // code to run on server at startup

  process.env.MAIL_URL = "smtp://shreyans.p.gandhi@gmail.com:aerogandhi@95@smtp.gmail.com:465/";

SyncedCron.start();  

  Accounts.config({
    sendVerificationEmail: true
  });

  Meteor.methods({

    'morningMail': function(data){
      // Email.send({
      //   from: 'info@updateme.com',
      //   to: 'spgandhi@live.com',
      //   subject: 'Update Me Daily Digest',
      //   html: data,
      // });

      homeurl = "http://localhost:3000/#/";
      var start = new Date();
      start.setHours(0,0,0,0);

      var end = new Date();
      end.setHours(23,59,59,999);

      users = Meteor.users.find({}).fetch();

      for(i=0;i<users.length;i++){
        if('name' in users[i].profile)
          username = users[i].profile.name;
        else
          username = users[i].emails[0].address;

        // var data = '<style>html { font-family: sans-serif; font-size:14px; } body { margin: 0px; } article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary { display: block; } a { background-color: transparent; } a:active, a:hover { outline: 0px; } b, strong { font-weight: bold; } h1 { margin: 0.67em 0px; font-size: 2em; } mark { color: rgb(0, 0, 0); background: rgb(255, 255, 0); } small { font-size: 80%; } sub, sup { position: relative; font-size: 75%; line-height: 0; vertical-align: baseline; } sup { top: -0.5em; } sub { bottom: -0.25em; } img { border: 0px; } svg:not(:root) { overflow: hidden; } figure { margin: 1em 40px; } hr { height: 0px; box-sizing: content-box; } pre { overflow: auto; } code, kbd, pre, samp { font-family: monospace, monospace; font-size: 1em; } button, input, optgroup, select, textarea { margin: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; color: inherit; } button { overflow: visible; } button, select { text-transform: none; } button, html input[type="button"], input[type="reset"], input[type="submit"] { -webkit-appearance: button; cursor: pointer; } button[disabled], html input[disabled] { cursor: default; } textarea { overflow: auto; } table { border-spacing: 0px; border-collapse: collapse; } td, th { padding: 0px; } * { box-sizing: border-box; } ::before, ::after { box-sizing: border-box; } html { font-size: 10px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); } body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.42857; color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); } input, button, select, textarea { font-family: inherit; font-size: inherit; line-height: inherit; } a { color: rgb(51, 122, 183); text-decoration: none; } a:hover, a:focus { color: rgb(35, 82, 124); text-decoration: underline; } a:focus { outline: -webkit-focus-ring-color auto 5px; outline-offset: -2px; } img { vertical-align: middle; } hr { margin-top: 20px; margin-bottom: 20px; border-width: 1px 0px 0px; border-top-style: solid; border-top-color: rgb(238, 238, 238); } [role="button"] { cursor: pointer; } h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 { font-family: inherit; font-weight: 500; line-height: 1.1; color: inherit; } h1 small, h2 small, h3 small, h4 small, h5 small, h6 small, .h1 small, .h2 small, .h3 small, .h4 small, .h5 small, .h6 small, h1 .small, h2 .small, h3 .small, h4 .small, h5 .small, h6 .small, .h1 .small, .h2 .small, .h3 .small, .h4 .small, .h5 .small, .h6 .small { font-weight: normal; line-height: 1; color: rgb(119, 119, 119); } h4, .h4, h5, .h5, h6, .h6 { margin-top: 10px; margin-bottom: 10px; } h4 small, .h4 small, h5 small, .h5 small, h6 small, .h6 small, h4 .small, .h4 .small, h5 .small, .h5 .small, h6 .small, .h6 .small { font-size: 75%; } h4, .h4 { font-size: 18px; } p { margin: 0px 0px 10px; } .text-center { text-align: center; } ul, ol { margin-top: 0px; margin-bottom: 10px; } ul ul, ol ul, ul ol, ol ol { margin-bottom: 0px; } abbr[title], abbr[data-original-title] { cursor: help; border-bottom-width: 1px; border-bottom-style: dotted; border-bottom-color: rgb(119, 119, 119); } table { background-color: transparent; } table col[class*="col-"] { position: static; display: table-column; float: none; } table td[class*="col-"], table th[class*="col-"] { position: static; display: table-cell; float: none; } .table > thead > tr > td.active, .table > tbody > tr > td.active, .table > tfoot > tr > td.active, .table > thead > tr > th.active, .table > tbody > tr > th.active, .table > tfoot > tr > th.active, .table > thead > tr.active > td, .table > tbody > tr.active > td, .table > tfoot > tr.active > td, .table > thead > tr.active > th, .table > tbody > tr.active > th, .table > tfoot > tr.active > th { background-color: rgb(245, 245, 245); } .table-hover > tbody > tr > td.active:hover, .table-hover > tbody > tr > th.active:hover, .table-hover > tbody > tr.active:hover > td, .table-hover > tbody > tr:hover > .active, .table-hover > tbody > tr.active:hover > th { background-color: rgb(232, 232, 232); } .pull-right { float: right !important; } .pull-left { float: left !important; } html { font-family: sans-serif; } body { margin: 0px; } .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 { position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; } .media, .media-body { overflow: hidden; zoom: 1; } .media, .media .media { margin-top: 15px; } .media:first-child { margin-top: 0px; } .media > .pull-left { margin-right: 10px; } .media > .pull-right { margin-left: 10px; } .list-group { padding-left: 0px; margin-bottom: 20px; } .list-group-item { position: relative; display: block; padding: 10px 15px; margin-bottom: -1px; border: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255); } .list-group-item:first-child { border-top-left-radius: 4px; border-top-right-radius: 4px; } .list-group-item:last-child { margin-bottom: 0px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; } .list-group-item > .badge { float: right; } .list-group-item > .badge + .badge { margin-right: 5px; } .panel { margin-bottom: 20px; border: 1px solid transparent; border-radius: 4px; box-shadow: rgba(0, 0, 0, 0.0470588) 0px 1px 1px; background-color: rgb(255, 255, 255); } .panel-heading { padding: 10px 15px; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: transparent; border-top-left-radius: 3px; border-top-right-radius: 3px; } .panel-heading > .dropdown .dropdown-toggle { color: inherit; } .panel-title { margin-top: 0px; margin-bottom: 0px; font-size: 16px; color: inherit; } .panel-title > a { color: inherit; } .panel > .list-group { margin-bottom: 0px; } .panel > .list-group .list-group-item { border-width: 1px 0px; border-radius: 0px; } .panel > .list-group:first-child .list-group-item:first-child { border-top-width: 0px; border-top-left-radius: 3px; border-top-right-radius: 3px; } .panel > .list-group:last-child .list-group-item:last-child { border-bottom-width: 0px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px; } .panel-heading + .list-group .list-group-item:first-child { border-top-width: 0px; } .panel-group .panel + .panel { margin-top: 5px; } .panel-group .panel-heading { border-bottom-width: 0px; } .panel-group .panel-heading + .panel-collapse .panel-body { border-top-width: 1px; border-top-style: solid; border-top-color: rgb(221, 221, 221); } .panel-default { border-color: rgb(221, 221, 221); } .panel-default > .panel-heading { color: rgb(51, 51, 51); border-color: rgb(221, 221, 221); background-color: rgb(245, 245, 245); } .panel-default > .panel-heading + .panel-collapse .panel-body { border-top-color: rgb(221, 221, 221); } .panel-default > .panel-footer + .panel-collapse .panel-body { border-bottom-color: rgb(221, 221, 221); } .col-lg-4{ width: 33%; margin:auto; padding:20px; } span.group-name {border: 1px solid;padding: 2px 5px;border-radius: 5px;font-size: 12px;margin: 0 2px;} .group-name-container{ padding:5px; } @media(max-width:960px){.col-lg-4{width:100%}}</style>';
        data = '';
        data += `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Update Me</title>
<style type="text/css">
/* -------------------------------------
    GLOBAL
------------------------------------- */
* {
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  font-size: 14px;
}

img {
  max-width: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: none;
  width: 100% !important;
  height: 100%;
  line-height: 1.6;
}

/* Let's make sure all tables have defaults */
table td {
  vertical-align: top;
}

/* -------------------------------------
    BODY & CONTAINER
------------------------------------- */
body {
  background-color: #f6f6f6;
}

.body-wrap {
  background-color: #f6f6f6;
  width: 100%;
}

.container {
  display: block !important;
  max-width: 600px !important;
  margin: 0 auto !important;
  /* makes it centered */
  clear: both !important;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  display: block;
  padding: 20px;
}

/* -------------------------------------
    HEADER, FOOTER, MAIN
------------------------------------- */
.main {
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
}

.content-wrap {
  padding: 20px;
}

.content-block {
  padding: 0 0 20px;
}

.header {
  width: 100%;
  margin-bottom: 20px;
}

.footer {
  width: 100%;
  clear: both;
  color: #999;
  padding: 20px;
}
.footer a {
  color: #999;
}
.footer p, .footer a, .footer unsubscribe, .footer td {
  font-size: 12px;
}

/* -------------------------------------
    GRID AND COLUMNS
------------------------------------- */
.column-left {
  float: left;
  width: 50%;
}

.column-right {
  float: left;
  width: 50%;
}

/* -------------------------------------
    TYPOGRAPHY
------------------------------------- */
h1, h2, h3 {
  font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
  color: #000;
  margin: 40px 0 0;
  line-height: 1.2;
  font-weight: 400;
}

h1 {
  font-size: 32px;
  font-weight: 500;
}

h2 {
  font-size: 24px;
}

h3 {
  font-size: 18px;
}

h4 {
  font-size: 14px;
  font-weight: 600;
}

p, ul, ol {
  margin-bottom: 10px;
  font-weight: normal;
}
p li, ul li, ol li {
  margin-left: 5px;
  list-style-position: inside;
}

/* -------------------------------------
    LINKS & BUTTONS
------------------------------------- */
a {
  color: #348eda;
  text-decoration: underline;
}

.btn-primary {
  text-decoration: none;
  color: #FFF;
  background-color: #348eda;
  border: solid #348eda;
  border-width: 10px 20px;
  line-height: 2;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  border-radius: 5px;
  text-transform: capitalize;
}

/* -------------------------------------
    OTHER STYLES THAT MIGHT BE USEFUL
------------------------------------- */
.last {
  margin-bottom: 0;
}

.first {
  margin-top: 0;
}

.padding {
  padding: 10px 0;
}

.aligncenter {
  text-align: center;
}

.alignright {
  text-align: right;
}

.alignleft {
  text-align: left;
}

.clear {
  clear: both;
}

/* -------------------------------------
    Alerts
------------------------------------- */
.alert {
  font-size: 16px;
  color: #fff;
  font-weight: 500;
  padding: 20px;
  text-align: center;
  border-radius: 3px 3px 0 0;
}
.alert a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
}
.alert.alert-warning {
  background: #ff9f00;
}
.alert.alert-bad {
  background: #d0021b;
}
.alert.alert-good {
  background: #68b90f;
}

/* -------------------------------------
    INVOICE
------------------------------------- */
.invoice {
  margin: 40px auto;
  text-align: left;
  width: 80%;
}
.invoice td {
  padding: 5px 0;
}
.invoice .invoice-items {
  width: 100%;
}
.invoice .invoice-items td {
  border-top: #eee 1px solid;
}
.invoice .invoice-items .total td {
  border-top: 2px solid #333;
  border-bottom: 2px solid #333;
  font-weight: 700;
}

td.alignright {
    min-width: 100px;
}

tr{
  white-space: nowrap;
}

/* -------------------------------------
    RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
@media only screen and (max-width: 640px) {
  h1, h2, h3, h4 {
    font-weight: 600 !important;
    margin: 20px 0 5px !important;
  }

  h1 {
    font-size: 22px !important;
  }

  h2 {
    font-size: 18px !important;
  }

  h3 {
    font-size: 16px !important;
  }

  .container {
    width: 100% !important;
  }

  .content, .content-wrapper {
    padding: 10px !important;
  }

  .invoice {
    width: 100% !important;
  }
}
</style>
</head>

<body style="background:#f6f6f6">
<center>
<table class="body-wrap">
  <tr>
    <td></td>
    <td class="container" width="600">
      <div class="content">
        <table class="main" width="100%" cellpadding="10" cellspacing="10"  style="background:white; border: 1px solid #e9e9e9; border-radius:3px; padding:20px;">
          <tr>
            <td class="content-wrap aligncenter">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-block">
                    <center><h1>Update Me Daily Digest<br></h1></center>
                  </td>
                </tr>
                <tr>
                  <td class="content-block">
                    <table width="100%">
                      <tr>
                        <td style="text-align:left" align="left">Dear Shreyans</td>
                        <td class="alignright" align="right">` + moment().format('dddd, DD/MM/YYYY') + `</td>
                      </tr>
                    </table>
                  </td>

                </tr>
                                <tr>
                                  <td style="text-align:left"><br>We thought you might be interested in having a look at the events up for you today.<br><br></td>
                                </tr>
                <tr>
                  <td class="content-block">
                    <table class="invoice">
                      <tr>
                        <td>
                          <table class="invoice-items" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-bottom:1px solid #f0f0f0">
                            

                            
                         `;
        
        posts = {};
        console.log(users[i].emails[0].address);
        posts = Posts.find({post_status: 'publish', 'options.isEvent': true, start_time: {$gte: start, $lt:end}, 'group._id': {$in: Roles.getGroupsForUser(users[i]._id, 'is-subscribed')} }).fetch();
        // posts = Posts.find({}).fetch();
        console.log(posts);
        for(j=0; j<posts.length; j++){
            value = posts[j];
            data += '<tr style="white-space:nowrap; border-top:1px solid #f0f0f0" >';
            data += '<td style="padding:10px">'+ value.title;
            if(value.venue)
              data += ' @ ' + value.venue;
             data += ' <span style="border:1px solid; border-radius: 5px; padding: 2px 5px; margin-left: 5px">'+ value.group.name+'</span></td>';
            data += '<td class="alignright" align="right" style="min-width:70px; padding:10px">'+ moment(value.start_time).format('h:mm a')+'</td></tr>';
        };

        data+=` </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td class="content-block" style="text-align:left">
                    <br><br>Team,<br> Update Me                 </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div class="footer">
          
            <table width="100%">
              <tr>
                <td class="aligncenter content-block" align="center"> <a href="http://localhost:3000/#/profile">Unsubscribe?</a></td>
              </tr>
            </table>
          
        </div></div>
    </td>
    <td></td>
  </tr>
</table>
</center>
</body>
</html>`;

        // console.log(users[i].emails[0].address);

        if(posts.length>0){
          Email.send({
            from: 'info@updateme.com',
            to: users[i].emails[0].address,
            subject: 'Update Me Daily Digest',
            html: data,
          });  

          console.log('Email sent to ' + users[i].emails[0].address);
        }
        

      }

      return data;
    },

    'groupSubscribe' : function(group_id){
      
      if(!Roles.userIsInRole(Meteor.userId, 'is-subscribed', group_id))
        return Roles.addUsersToRoles(Meteor.userId(), 'is-subscribed', group_id);

      return false
    },

    'groupUnsubscribe' : function(group_id){
      query = {};
      query['roles.'+group_id] = 'is-subscribed';
      Meteor.users.update({_id: Meteor.userId()}, {$pull: query }, function(err){
        if(!err)
          return true;
        else
          return false;
      });
    },

    'logoutServer': function(){
      Meteor.users.update( {_id: Meteor.userId()}, {$set: {'services.resume.loginTokens': []}} );
      console.log('user logged out');
      return true;
    },

    'userCheckRolesOnRegister': function(email, newUserId){
      orgs = Organizations.find({}).fetch();

      for(i=0; i<orgs.length; i++){
        if( orgs[i].admins.indexOf(email) != -1)
          Roles.addUsersToRoles(newUserId, 'can-manage', orgs[i]._id);
      }

      groups = Groups.find({}).fetch();

      for(i=0; i<groups.length; i++){
        if(groups[i].roles['can-manage'].indexOf(email) != -1)
          Roles.addUsersToRoles(newUserId, 'can-manage', groups[i]._id);
      }

      console.log('roles assigned to new user');
    },

    'getUser': function(){
      return Meteor.user();
    },

    'getUsersOrg': function(){
      return Roles.getGroupsForUser( Meteor.userId() )
    },

  	'checkEmail' : function(email){
  		

  		if( Meteor.users.findOne({'emails.address': email}).emails[0].verified )
  			return true;
  		else
  			return false;
  	},

  	'resendVerificationEmail' : function(email){
  		if( Meteor.users.findOne({'emails.address': email}).emails[0].verified )
  			return false;
  		else
  			return true;
  	},

  	'passwordRecovery' : function(email){
  		if( Meteor.users.findOne({'emails.address': email}) )
  			return true;
  		else
  			return false;	
  	},

    'delayfn' : function(val){
      
        Meteor._sleepForMs(val);

      return true;
    }

  })

});

