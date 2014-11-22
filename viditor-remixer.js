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
			
			var handle = "assets/video." + "blank";
			
			if(my_cursor && my_cursor.video)
			{
				handle = "assets/video." + my_cursor.video.handle;
			}
			
			$("video").find("source#mp4").attr("src", handle + ".mp4");
			$("video").find("source#webm").attr("src", handle + ".webm");
			$("video").find("source#ogv").attr("src", handle + ".ogv");
			$("video").get(0).load();
		});
		
		$(document).ready(function()
		{
			$("video").on("ended", function(event)
			{
				var my_cursor_id = Session.get("my cursor id");
				var my_cursor = Cursors.findOne(my_cursor_id);
				
				if(my_cursor && my_cursor.video)
				{
					var video = my_cursor.video;
					var next_video = EditableVideos.findOne({index: {$gt: video.index}}, {sort: {index: 0}});
					Cursors.update(my_cursor_id, {$set: {video: next_video || null}});
				}
			});
		});
	});
	
	Template.insert.videos = function()
	{
		return InsertableVideos.find({});
	}
	
	Template.insert.thumbnail = function()
	{
		var handle = this.handle;
		return "assets/video." + handle + ".png";
	}
	
	Template.insert.events =
	{
		"dblclick .insertable-video": function(event)
		{
			var new_video = EditableVideos.insert({handle: this.handle, index: Date.now()});
			
			var my_cursor_id = Session.get("my cursor id");
			Cursors.update(my_cursor_id, {$set: {video: new_video}});
		}
	}
	
	Template.edit.videos = function()
	{
		return EditableVideos.find({}, {sort: {index: 0}});
	}
	
	Template.edit.thumbnail = function()
	{
		var handle = this.handle;
		return "background-image: url('assets/video." + handle + ".png');";
	}
	
	Template.edit.outline = function()
	{
		var my_cursor_id = Session.get("my cursor id");
		var my_cursor = Cursors.findOne(my_cursor_id);
		
		if(my_cursor && my_cursor.video)
		{
			if(my_cursor.video._id == this._id)
			{
				return "outline: 0.2rem solid #0A9BDE;";
			}
		}
		
		return "outline: none;";
	}
	
	Template.edit.events =
	{
		"click .editable-video": function(event)
		{
			event.stopPropagation();
			
			var my_cursor_id = Session.get("my cursor id");
			Cursors.update(my_cursor_id, {$set: {video: this}});
			
			console.log(this.index);
		},
		
		"dblclick .editable-video": function(event)
		{
			event.stopPropagation();
			
			var my_cursor_id = Session.get("my cursor id");
			var my_cursor = Cursors.findOne(my_cursor_id);
			
			if(my_cursor && my_cursor.video)
			{
				var null_video = my_cursor.video;
				EditableVideos.remove(null_video._id);
				Cursors.update(my_cursor_id, {$set: {video: null}});
			}
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
		InsertableVideos.insert({handle: "01"});
		InsertableVideos.insert({handle: "02"});
		InsertableVideos.insert({handle: "03"});
		InsertableVideos.insert({handle: "04"});
		InsertableVideos.insert({handle: "05"});
		InsertableVideos.insert({handle: "06"});
		
		EditableVideos.remove({});
		EditableVideos.insert({handle: "01", index: Date.now()});
		EditableVideos.insert({handle: "02", index: Date.now()+1});
		EditableVideos.insert({handle: "02", index: Date.now()+2});
		
		Cursors.remove({});
	});
}