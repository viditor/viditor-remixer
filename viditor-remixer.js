Videos = new Meteor.Collection("videos");

if(Meteor.isClient)
{
	Meteor.startup(function()
	{
		Session.set("filehandle", "01");
		
		var video_id = "01";
		
		Deps.autorun(function()
		{
			var filehandle = Session.get("filehandle");
			
			$("video").find("source#mp4").attr("src", "video." + filehandle + ".mp4");
			$("video").find("source#webm").attr("src", "video." + filehandle + ".webm");
			$("video").find("source#ogv").attr("src", "video." + filehandle + ".ogv");
			
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
			var filehandle = this.filehandle;
			Session.set("filehandle", filehandle);
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
	});
}