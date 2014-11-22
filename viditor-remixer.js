if(Meteor.isClient)
{
	Meteor.startup(function()
	{
		var video_id = "01";
		$("video").find("source#mp4").attr("src", "video." + video_id + ".mp4");
		$("video").find("source#webm").attr("src", "video." + video_id + ".webm");
		$("video").find("source#ogv").attr("src", "video." + video_id + ".ogv");
		$("video").get(0).load();
	});
}

if(Meteor.isServer)
{
	Meteor.startup(function()
	{
		console.log("Hello Server!");
	});
}