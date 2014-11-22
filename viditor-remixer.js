if(Meteor.isClient)
{
	Meteor.startup(function()
	{
		console.log("Hello Client!");
	});
}

if(Meteor.isServer)
{
	Meteor.startup(function()
	{
		console.log("Hello Server!");
	});
}