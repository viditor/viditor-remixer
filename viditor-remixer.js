InsertableVideos = new Meteor.Collection("insertable-videos");
EditableVideos = new Meteor.Collection("editable-videos");
Cursors = new Meteor.Collection("cursors");

if(Meteor.isClient)
{
	Meteor.startup(function()
	{
		var cursor_id = Cursors.insert({});
		Session.set("my cursor id", cursor_id);
		
		Deps.autorun(function()
		{
			var my_cursor_id = Session.get("my cursor id");
			var my_cursor = Cursors.findOne(my_cursor_id);
			
			var video = "assets/video.blank";
			
			if(my_cursor.video)
			{
				video = "assets/video." + my_cursor.video;
			}
			
			$("video").find("source#mp4").attr("src", video + ".mp4");
			$("video").find("source#webm").attr("src", video + ".webm");
			$("video").find("source#ogv").attr("src", video + ".ogv");
			
			$("video").get(0).load();
		});
	});
	
	Template.insert.videos = function()
	{
		return InsertableVideos.find({});
	}
	
	Template.insert.events =
	{
		"click .insertable-video": function(event)
		{
			var my_cursor_id = Session.get("my cursor id");
			Cursors.update(my_cursor_id, {$set: {video: this.filehandle}});
		}
	}
	
	Template.edit.videos = function()
	{
		return EditableVideos.find({});
	}
	
	Template.edit.thumbnail = function()
	{
		var filehandle = this.filehandle;
		return "background-image: url(video." + filehandle + ".png);"
	}
	
	Template.edit.events =
	{
		"click .editable-video": function(event)
		{
			event.stopPropagation();
			
			var my_cursor_id = Session.get("my cursor id");
			Cursors.update(my_cursor_id, {$set: {video: this.filehandle}});
		},
		
		"click .track": function(event)
		{
			var my_cursor_id = Session.get("my cursor id");
			Cursors.update(my_cursor_id, {$set: {video: null}});
		}
	}
}

if(Meteor.isServer)
{
	Meteor.startup(function()
	{
		InsertableVideos.remove({});
		InsertableVideos.insert({filehandle: "01"});
		InsertableVideos.insert({filehandle: "02"});
		
		EditableVideos.remove({});
		EditableVideos.insert({filehandle: "01"});
		EditableVideos.insert({filehandle: "02"});
		
		Cursors.remove({});
	});
}