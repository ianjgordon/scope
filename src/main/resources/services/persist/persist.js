// these libs should be added to build.gradle under the depencies section

//var portalLib = require('/lib/xp/portal');
var contextLib = require('/lib/xp/context');
var repoLib = require('/lib/xp/repo');
var nodeLib = require('/lib/xp/node');
var valueLib = require('/lib/xp/value');
var authLib = require('/lib/xp/auth');

exports.get = handleGet;
exports.post = handlePost;

var scopeRepository = 'scope-repo';
var repoFound = false;

function initialiseRepo() {
	var repos = repoLib.list();
	log.info(repos.length + ' repositories found');

	for (var i = 0; i < repos.length; i++) {
	    var r = repos[i];
	    log.info('Repository ' + r.id + ' found');
	    if (r.id == scopeRepository) {
	    	repoFound = true;

	    	return r.id;
	    }
	}

	if (repoFound == false) {
		// Creates a repository with specific settings
		var result = repoLib.create({
		    id: scopeRepository,
		    rootPermissions: [
		        {
		            "principal": "role:admin",
		            "allow": [
		                "READ",
		                "CREATE",
		                "MODIFY",
		                "DELETE",
		                "PUBLISH",
		                "READ_PERMISSIONS",
		                "WRITE_PERMISSIONS"
		            ],
		            "deny": []
		        }
		    ],
		    rootChildOrder: "_timestamp DESC"
		});

		log.info('Repository created with id ' + result.id);
		return result.id;
	}
};

function persistData(data) {
	var repo = nodeLib.connect({
	    repoId: scopeRepository,
	    branch: "master"
	});

	var result2 = repo.delete('b375d517-761c-4073-a602-7929b3c6ba3f');

	if (data.id !== undefined) {
		var deleted = repo.delete(data.id);		
		log.info('Deleted nodeId: ' + data.id);
	};

	log.info('Saving: ' + data);

	// Create node.
	// http://repo.enonic.com/public/com/enonic/xp/docs/6.9.1/docs-6.9.1-libdoc.zip!/module-lib_xp_node-RepoConnection.html#create
	var res = repo.create(data);

	log.info('Node created with id ' + res._id);

	return res._id;
};


function handleGet(req) {

	if (repoFound == false)
	{
		var result = contextLib.run({
		    branch: 'master',
		    user: {
		        login: 'su',
		        userStore: 'system'
		    }
		}, initialiseRepo);

		log.info('Callback says "%s"', result);
	}

	// Connect to repo
	var repo = nodeLib.connect({
	    repoId: scopeRepository,
	    branch: "master"
	});

	// http://repo.enonic.com/public/com/enonic/xp/docs/6.9.1/docs-6.9.1-libdoc.zip!/module-lib_xp_node-RepoConnection.html#query
	if (req.params.email === undefined)
		  	return {
    	body: {
      		message: 'email is required'
    	},
    	contentType: 'application/json'
  	};

	var q = "_timestamp > instant('2016-10-11T14:38:54.454Z') AND scopeUser.email = '" + req.params.email + "'";

	log.info("Using query: " + q);

	var result = repo.query({
	    start: 0,
	    count: 20,
	    query: q,
	    sort: "_score DESC"
	});

	log.info('Found ' + result.total + ' number of contents');

	var users = [];
	for (var i = 0; i < result.hits.length; i++) {
	    var node = result.hits[i];
	    var user = repo.get(node.id);

	    // limit thte data that gets returned to the bare minimum
	    var userData = {
	    	id: user._id,
	    	email: user.scopeUser.email,
	    	promoCode: user.promoCode,
	    	authCode: user.authCode,
	    	dateAdded: user.dateAdded
	    };
	    users.push(userData);
	    log.info('Node ' + node.id + ' found');
	}

  	return {
    	body: {
      		time: new Date(),
      		results: users
    	},
    	contentType: 'application/json'
  	};
};

function handlePost(req) {
	// Connect to repo
	
	if (repoFound == false)
	{
		var result = contextLib.run({
		    branch: 'master',
		    user: {
		        login: 'su',
		        userStore: 'system'
		    }
		}, initialiseRepo);

		log.info('Callback says "%s"', result);
	}

	// http://xp.readthedocs.io/en/master/developer/modules/controller/request.html
	/*
	var data = {
	    scopeUser: {
	    	email: "frank@frank.com",
	    	firstName: "Frank",
	    	lastName: "St John",
	    	address1: "1 A Hill",
	    	city: "London"
	    },
	    promoCode: "SKIP",
	    authCode: "999ZZZ",
	    dateAdded: new Date()
	};

	var authenticatedUser = authLib.login({
	    user: 'su', 
	    password: 'password',
	    userStore: 'system'
	});
	*/

	var json = JSON.parse(req.body);

  	var nodeId;
	var exeResult = contextLib.run({
	    branch: 'master',
	    user: {
	        login: 'su',
	        userStore: 'system'
	    }
	}, function(){
		nodeId = persistData(json);
	});

	return {
    	body: {
      		time: new Date(),
      		node: nodeId
    	},
    	contentType: 'application/json'
  	};
};
