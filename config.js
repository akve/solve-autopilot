module.exports = {
	
	initialFilterFunction : function(input) {
		var categories = input.categories;
		if (!categories) return false;
		for (var i=0;i<categories.length;i++){
			if (categories[i].name == "Status-M") return true;
		}
		return false;
	},

	fieldsMapping: [
		{solve:"firstname", autopilot:"FirstName", type:"text"},
		{solve:"lastname", autopilot:"LastName", type:"text"},
		{solve:"website", autopilot:"Website", type:"text"},
		{solve:"businessemail", autopilot:"Email", type:"text"},
		{solve:"relateditems", autopilot:"string--Relates--To", type:"relateditems", typeid:1},
		{solve:"company", autopilot:"string--Company", type:"relateditems", typeid:40},
		{solve:"custom2031487", autopilot:"string--Dl#", type:"text"},
		{solve:"homeaddress", autopilot:"string--Address--Old", type:"text"},
		{solve:"custom12431476", autopilot:"date--Assigned--To--Dojo--On", type:"date"},
		{solve:"custom12462066", autopilot:"date--New--Intro--Appointment", type:"date"},
		{solve:"custom12093118", autopilot:"date--NS--Prospect--ID--On", type:"date"},
		{solve:"custom12093119", autopilot:"date--NS--Appt--Set--For", type:"date"},
		{solve:"custom12093120", autopilot:"date--NS--No--Show--On", type:"date"},
		{solve:"custom12421824", autopilot:"date--NS--Reschedule--On", type:"date"},
		{solve:"custom12421825", autopilot:"date--NS--Repeat--No--Show", type:"date"},

		{solve:"custom11822424", autopilot:"date--Prospect--ID--On", type:"date"},
		{solve:"custom11822425", autopilot:"date--Visit--Appt--For", type:"date"},
		{solve:"custom11841240", autopilot:"date--VA--No Show--On", type:"date"},
		{solve:"custom12421826", autopilot:"date--VA--Reschedule--On", type:"date"},
		{solve:"custom12421827", autopilot:"date--VA--Repeat--No--Show", type:"date"},

		{solve:"custom11822463", autopilot:"date--Trial--Membership--On", type:"date"},
		{solve:"custom11822466", autopilot:"date--Set--Full--Join--Appt--For", type:"date"},
		{solve:"custom11841248", autopilot:"date--FJ--No--Show--On", type:"date"},
		{solve:"custom12421834", autopilot:"date--FJ--Reschedule--On", type:"date"},
		{solve:"custom12421835", autopilot:"date--FJ--Repeat--No--Show", type:"date"},

		{solve:"custom2028427", autopilot:"string--Interest--Details", type:"text"},
		{solve: "custom2027758", autopilot: "string--Referred--By", type:"text"},

      	{solve: "custom2030577",autopilot: "string--PreTraining", type:"text"},
	    {solve: "custom2028120",autopilot: "string--Emergency--Contact", type:"text"},
      	{solve: "custom2030879",autopilot: "string--Existing--Medical", type: "text"},
      	{solve: "custom2030881",autopilot: "string--Instructor", type: "text"},
      	{solve: "custom2030882",autopilot: "string--Asst--Instructor", type: "text"},

		{solve: "custom11822472",autopilot: "date--Core--Membership--On", type:"date"},
		{solve: "custom11822476",autopilot: "date--Set--Upgrade--Appt--For", type:"date"},
		{solve: "custom11842033",autopilot: "date--UA--No--Show--On", type:"date"},
		{solve: "custom18455701",autopilot: "date--UA--Reschedule--On", type:"date"},
		{solve: "custom18455702",autopilot: "date--UA--Repeat--No--Show", type:"date"},

      	{solve: "custom2169362", autopilot: "date--Last--Mail--Date", type:"date"},
      	{solve: "custom8019101", autopilot: "string--Last--Mail--Info",type: "text"},
		{solve: "custom18456526", autopilot: "date--Do--Not--Call--Text--On",type:"date"},
      	{solve: "custom18456527", autopilot: "date--Do--Not--Email--On", type: "date"},

		{solve: "custom18455695", autopilot: "date--Adv--Training--Group--On",type:"date"},
		{solve: "custom18455696", autopilot: "date--Mastery--Group--On",type:"date"},
		{solve: "custom18455697", autopilot: "date--Special--Teams--On",type:"date"},

		{solve: "custom11822457", autopilot: "date--Coach-Assist--Team--On",type:"date"},
		{solve: "custom18456114", autopilot: "date--Instructor--Team--On",type:"date"},


		{solve: "custom2173130", autopilot: "string--Cancel--Rank--Level",type:"text"}

	]

}