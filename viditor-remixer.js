InsertableVideos = new Meteor.Collection("insertable-videos");
EditableVideos = new Meteor.Collection("editable-videos");
Cursors = new Meteor.Collection("cursors");	

if(Meteor.isClient)
{
	music = new Audio("assets/music.01.mp3");
	
	Meteor.startup(function()
	{
		var colors = ["#0A9BDE", "orange"];
		var cursor_id = Cursors.insert({color: colors[Math.floor(Math.random()*colors.length)]});
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
			
			$("video").on("play", function(event)
			{
				var my_cursor_id = Session.get("my cursor id");
				var my_cursor = Cursors.findOne(my_cursor_id);
				
				if(my_cursor && my_cursor.video)
				{
					music.play();
				}
				else
				{
					music.pause();
				}
			});
			
			$(window).on("beforeunload", function(event)
			{
				var my_cursor_id = Session.get("my cursor id");
				Cursors.remove(my_cursor_id);
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
		var outline = "none";
		
		Cursors.find({}).forEach(function(cursor)
		{
			if(cursor.video)
			{
				if(cursor.video._id == this._id)
				{
					outline = "0.25rem solid " + cursor.color;
				}
			}
		}
		.bind(this));
		
		return "outline: " + outline + ";";
	}
	
	Template.edit.events =
	{
		"click .editable-video": function(event)
		{
			event.stopPropagation();
			
			var my_cursor_id = Session.get("my cursor id");
			Cursors.update(my_cursor_id, {$set: {video: this}});
			
			console.log($(event.target).index() * 5);
			music.currentTime = $(event.target).index() * 5;
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
	
	Template.view.effect = function()
	{
		var my_cursor_id = Session.get("my cursor id");
		var my_cursor = Cursors.findOne(my_cursor_id);
		
		if(my_cursor && my_cursor.video)
		{
			var video = EditableVideos.findOne(my_cursor.video._id);
			
			if(video.effect)
			{
				var effect = video.effect;
				console.log(effect);
				
				if(effect == "sepia")
				{
					return "-webkit-filter: sepia(100%);";
				}
				else if(effect == "invert")
				{
					return "-webkit-filter: invert(100%);";
				}
				else if(effect == "tint")
				{
					return "-webkit-filter: hue-rotate(90deg);";
				}
				else if(effect == "grayscale")
				{
					return "-webkit-filter: grayscale(1);";
				}
				else if(effect == "blur")
				{
					return "-webkit-filter: blur(3px);";
				}
				else if(effect == "none")
				{
					return "";
				}
			}
		}
		
		return "";
	}
	
	Template.view.events = 
	{
		"click video": function(event)
		{
			var my_cursor_id = Session.get("my cursor id");
			Cursors.update(my_cursor_id, {$set: {video: null}});
		}
	}
	
	Template.tweak.events =
	{
		"click": function(event)
		{
			var new_effect = $(event.target).attr("id");
			
			var my_cursor_id = Session.get("my cursor id");
			var my_cursor = Cursors.findOne(my_cursor_id);
			
			if(my_cursor && my_cursor.video)
			{
				var video = my_cursor.video;
				EditableVideos.update(video._id, {$set: {effect: new_effect}})
			}
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
		EditableVideos.insert({handle: "03", index: Date.now()+2});
		
		Cursors.remove({});
	});
}