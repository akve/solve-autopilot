var Autopilot = require('autopilot-api');
//PROD
var autopilot = new Autopilot('3ff6162e1cbf4c4da4ed27dbd2c9b9a1');
// DEV version
//var autopilot = new Autopilot('3ff6162e1cbf4c4da4ed27dbd2c9b9a1');
var http = require('http');
var sha1 = require('sha1');
var qs = require('querystring');
	var request = require('request');
var fs = require('fs');

var apiKey360 = "C0N0Lfc444GcI8Y1D0Bes663J8ufHb2f72o0Z3s6";


var username = "warriorscove@gmail.com",
    password = apiKey360,
    url = " https://secure.solve360.com/contacts",
    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

var mode = process.argv[2];

var config = require('./config.js');
var globalFields = require('./fields.json');
var globalCategories = require('./categories.json');

var lastSync = new Date() - 7*86400; // 1 week by default

try {
	lastSync = new Date(require('./last-sync.json').date);
}

var getFromSolve = function(userid, callback){
	request(
	    {
	        url : url  + userid,
	        headers : {
	            "Authorization" : auth,
	            "Accept":"application/json"
	        }
	    },
	    function (error, response, body) {
	        callback(JSON.parse(body));
	    }
	);
}

if (mode == "init") {
	getFromSolve("fields", function(fields){
		fs.writeFileSync('./fields.json', JSON.stringify(fields));
		getFromSolve("categories", function(categories){
			fs.writeFileSync('./categories.json', JSON.stringify(categories));
			console.log("OK");
		});
	});
	return;
}

if (mode == "getone") {
	getFromSolve("178272838", function(f){
		fs.writeFileSync('./out_user.json', JSON.stringify(f));
	})
	return;
}

var getNextXRecords = function(start, limit, orderByLast, callback) {
	var request = "?limit="+limit+"&layout=1&categories=1&start="+start;
	if (orderByLast) {
		request += "&sortfield=update_time&sortdir=desc"; // get last modified
	} else {
		request += "&sortfield=update_time&sortdir=desc&filtermode=category&filtervalue=4930224"; // STATUS-M users
	}
	console.log(request);
	getFromSolve(request, function(f){
		callback(start + limit, limit, orderByLast, f);
	})
}

var finishSync = function(){
	var f = {date: new Date().toString()};
	fs.writeFileSync('./last-sync.json', JSON.stringify(f));
}

var nextFunction = function(newStart, limit, orderByLast, records) {
	processRecords(records, function(){
		console.log(newStart);
		if (newStart >= records.count) {
			finishSync();
			return;
		} 
		var usersList = [];
		for (var a in records) {
			if (a != "count" && a !="status" && records[a].id) {
				usersList.push(records[a]);
			}
		}

		if (orderByLast && usersList.length >0 && new Date(usersList[usersList.length-1].updated) < lastSync) {
			finishSync();
			return;
		} 
		// UNCOMMENT FOR REAL LIFE
		getNextXRecords(newStart, limit, orderByLast, nextFunction);
	});
}

var prepareField = function(profile, field) {
	if (field.type == "relateditems") {
		var res = "";
		for (var rel in profile.relateditems) { 
			var relation = profile.relateditems[rel];
			//profile.relateditems.forEach(function(relation){
			if (relation.typeid == field.typeid) {
				if (res) res += ";\n";
				res += relation.name;
				if (relation.note) {
					res += "(";
					for (var a in JSON.parse(relation.note)){
						res += " " + JSON.parse(relation.note)[a];
					}
					res += ")";
				}
			}
		}
		return res;
	}
	return profile[field.solve];
}

var processUser = function(singleUserProfile, callback){
	
	//callback();
	//return;
	var toSendToAutopilot = {custom:{}};
	config.fieldsMapping.forEach(function(field){
		var v = prepareField(singleUserProfile, field);
		if (v) {
			if (field.solve.indexOf("custom")==0) {
				toSendToAutopilot.custom[field.autopilot] = v;
			} else {
				toSendToAutopilot[field.autopilot] = v;
			}
		}
	})

	if (singleUserProfile.categories && typeof singleUserProfile.categories == "object") {
		singleUserProfile.categories.forEach(function(category){
			toSendToAutopilot.custom["boolean--Category--" + category.name.replace(/ /g, "--")] = true;
		})
	}
	if (singleUserProfile.categories && typeof singleUserProfile.categories == "string") {
		var categoryIds = singleUserProfile.categories.split(",");

		globalCategories.categories.forEach(function(category){
			if (categoryIds.indexOf(""+category.id) >=0) {
				toSendToAutopilot.custom["boolean--Category--" + category.name.replace(/ /g, "--")] = true;
			}
		})
	}
	console.log("PROCESSING", singleUserProfile, toSendToAutopilot);
//	callback();
//	return;

	autopilot.contacts.upsert(toSendToAutopilot)
	.then(function (response) {
		//console.log(response);
		callback();
	})
}


var processRecords = function(records, callback) {
	var usersList = [];
	for (var a in records) {
		if (a != "count" && a !="status" && records[a].id) {
			usersList.push(records[a]);
		}
	}
	if (usersList.length ==0) {
		callback();
		return;
	}
	var smallCB = function(idx){
		if (idx >= usersList.length) {
			callback();
			return;
		}
		console.log("" + (idx + 1) + " out of " + usersList.length);//, usersList.users[idx]);
		processUser(usersList[idx], function(){
			smallCB(idx + 1);
		})
	}
	smallCB(0);
	//callback();
}

if (mode == "firstload") {
	getNextXRecords(0, 10, false, nextFunction);
	return;
}

if (mode == "sync") {
	getNextXRecords(0, 10, true, nextFunction);
	return;
}


var transforms;

var trasnformFields = function(title, value){
//console.log("!", transforms);	
	for (var i=0;i<transforms.length;i++) {
		var fld = transforms[i];
		if (fld.title == title) {
			for (var j=0;j<fld.ids.length;j++) {
				if (fld.ids[j].id == ""+value) {
					return fld.ids[j].val;
				}
			}
		}
	}
	return value; 
}

var putToCache = function(id, content) {
	fs.writeFileSync('cache/' + id + '.json', JSON.stringify(content));
}

var getFromCache = function(id){
	var f = 'cache/' + id + '.json';
	try {
		var s = fs.statSync(f);
		if (s && s.isFile()) {
			var content = fs.readFileSync(f, 'utf8');
			return content;
		} else {
			return 0;
		}
	} catch (e) {
		//console.log(e);
		return 0;
	}
}

var isSameAsInCache = function(id, content) {
	var cached = getFromCache(id);
	//console.log("CACHED", cached);
	//console.log("CONENT", JSON.stringify(content));
	if (getFromCache(id) == JSON.stringify(content)) return true;
	return false;
}


var getFieldTitle = function(id, name, getWhat){
	if (!getWhat) getWhat = 'label';
	for (var i=0;i<globalFields.fields.length;i++){
		if (globalFields.fields[i].id == id || globalFields.fields[i].name == name) return globalFields.fields[i][getWhat].replace(/ /g, "--");

	}
	return 'UNKNOWN__FLD__' + id;
}

//requestDocebo('user/fields', {}, function(fields){
//	globalFields = fields;

var getAllContacts = function(){

}

	getFromSolve('', function(usersHash){
		console.log(usersHash);
		var usersList = [];
		for (var a in usersHash) {
			if (a != "count" && a !="status" && usersHash[a].id) {
				usersList.push(usersHash[a]);
			}
		}
		return;

		if (usersList.users.length ==0) return;
		var smallCB = function(idx){
			if (idx >= usersList.users.length) return;
			//if (idx == 1) return;
			/*if (usersList.users[idx].userid != 'WGCarlson') {
				smallCB(idx + 1);
				return;
			}*/
			console.log("" + idx + " out of " + usersList.length);//, usersList.users[idx]);
			processUser(usersList[idx].id, function(){
				smallCB(idx + 1);
			})
		}
			smallCB(0);
	})
//})


//var contact = { FirstName: 'Bob', LastName: 'Barker', Email: 'bob@bobbarker.com' };
 
/*autopilot.contacts.upsert(contact)
	.then(function (response) {
		console.log(response);
	})
	.catch(function (response) {
		console.log('Error', response);
	});*/


