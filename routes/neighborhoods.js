var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('neighborhooddb', server);

db.open(function(err, db) {
	if(!err) {
	    console.log("Connected to 'neighborhooddb' database");
	    db.collection('neighborhoods', {strict:true}, function(err, collection) {
		    if (err) {
			console.log("The 'neighborhoods' collection doesn't exist. Creating it with sample data...");
			populateDB();
		    }
		});
	}
    });

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving neighborhood: ' + id);
    db.collection('neighborhoods', function(err, collection) {
	    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
		    res.send(item);
		});
	});
};

exports.findAll = function(req, res) {
    db.collection('neighborhoods', function(err, collection) {
	    collection.find().toArray(function(err, items) {
		    res.send(items);
		});
	});
};

exports.addNeighborhood = function(req, res) {
    var neighborhood = req.body;
    console.log('Adding neighborhood: ' + JSON.stringify(neighborhood));
    db.collection('neighborhoods', function(err, collection) {
	    collection.insert(neighborhood, {safe:true}, function(err, result) {
		    if(err) {
			res.send({'error':'An error has occurred'});
		    } else {
			console.log('Success: ' + JSON.stringify(result[0]));
			res.send(result[0]);
		    }
		});
	});
};

exports.updateNeighborhood = function(req, res) {
    var id = req.params.id;
    var neighborhood = req.body;
    console.log('Updating neighborhood: ' + id);
    console.log(JSON.stringify(neighborhood));
    db.collection('neighborhoods', function(err, collection) {
	    collection.update({'_id':new BSON.ObjectID(id)}, neighborhood, {safe:true}, function(err, result) {
		    if (err) {
			console.log('Error updating neighborhood: ' + err);
			res.send({'error':'An error has occurred'});
		    } else {
			console.log('' + result + ' document(s) updated');
			res.send(neighborhood);
		    }
		});
	});
};

exports.deleteNeighborhood = function(req, res) {
    var id = req.params.id;
    console.log('Deleting neighborhood: ' + id);
    db.collection('neighborhoods', function(err, collection) {
	    collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
		    if (err) {
			res.send({'error':'An error has occurred - ' + err});
		    } else {
			console.log('' + result + ' document(s) deleted');
			res.send(req.body);
		    }
		});
	});
};


// Populate with sample data

var populateDB = function() {
    var neighborhoods = [
{
    name: "Downtown",
    metro: "Austin",
    state: "Texas",
    country: "USA",
    description: "Whether you're looking to shop, dine, dance, or jam, Downtown Austin hits all the right notes.",
    picture: "../public/pics/downtown_austin"
},
{
    name: "North Loop",
    metro: "Austin",
    state: "Texas",
    country: "USA",
    description: "Experience the hip epicenter of North Austin.",
    picture: "../public/pics/north_loop"
}];

    db.collection('neighborhoods', function(err, collection) {
	    collection.insert(neighborhoods, {safe:true}, function(err, result) {});
	});
};