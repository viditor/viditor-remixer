Videos = new Meteor.Collection("videos");
Cursors = new Meteor.Collection("cursors");

if(Meteor.isClient)
{
	Meteor.startup(function()
	{
		var cursor_id = Cursors.insert({video: "01"});
		Session.set("my cursor id", cursor_id);
		
		Deps.autorun(function()
		{
			var my_cursor_id = Session.get("my cursor id");
			var my_cursor = Cursors.findOne(my_cursor_id);
			
			console.log(my_cursor);
			
			var video = "02";
			
			$("video").find("source#mp4").attr("src", "video." + video + ".mp4");
			$("video").find("source#webm").attr("src", "video." + video + ".webm");
			$("video").find("source#ogv").attr("src", "video." + video + ".ogv");
			
			$("video").get(0).load();
		});
	});
	
	Template.assets.videos = function()
	{
		return Videos.find({});
	}
	
	Template.assets.events =
	{
		"click .video-asset": function()
		{
			var my_cursor_id = Session.get("my cursor id");
			Cursors.update(my_cursor_id, {$set: {video: this.filehandle}});
		}
	}
}

if(Meteor.isServer)
{
	Meteor.startup(function()
	{
		Videos.remove({});
		Videos.insert({filehandle: "01"});
		Videos.insert({filehandle: "02"});
		
		Cursors.remove({});
	});
}