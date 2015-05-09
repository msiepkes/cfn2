var Stopwatch = (function() {
var s;
return {
	settings: {
		stop: 0,
		sw: document.querySelectorAll(".stopwatch")[0],
		results: document.querySelectorAll(".results")[0],
		mills: 0,
		secs: 0,
		mins: 0,
		hours: 0,
		i: 1,
		times: ["00:00:00:00"],
		//clearButton: "<a href=\"#\" class=\"button\" onClick=\"Stopwatch.clear();\">Clear</a>"
	},
	init: function() {
		s = this.settings;
		s.stop = 1;
		setInterval(this.timer, 1);
	},
	clear: function() {
		s.i = 1,
		s.times = ["00:00:00:00"]
		//s.results.innerHTML = s.clearButton;
	},
	lap: function() { 
		s.times.push(
					 			("0" + s.hours).slice(-2) + ":"
					 		 + ("0" + s.mins).slice(-2) + ":"
							 + ("0" + s.secs).slice(-2) + ":"
							 + ("0" + s.mills).slice(-2));
		var diffTime = ("0" + Math.floor(s.times[s.i].split(":")[0]
								 - s.times[s.i-1].split(":")[0])).slice(-2)
								 + ":"
								 + ("0" + Math.floor(s.times[s.i].split(":")[1]
								 - s.times[s.i-1].split(":")[1])).slice(-2)
								 + ":"
								 + ("0" + Math.floor(s.times[s.i].split(":")[2]
								 - s.times[s.i-1].split(":")[2])).slice(-2)
								 + ":"
								 + ("0" + (s.times[s.i].split(":")[3]
								 - s.times[s.i-1].split(":")[3])).slice(-2);
								 
								  
		$('#laps').html($('#laps').html() + '<i class="fa fa-clock-o" style="margin-right: 10px;"></i> <strong>' + s.times[s.i] + '</strong> - ' + diffTime + '<br />');
		
		s.i++;
	},
	restart: function() {
		s.mills = 0,
		s.secs = 0,
		s.mins = 0;
		s.hours = 0;
		s.stop = 1;
		this.reset();
	},
	reset: function() { 
		$('#laps').html('');
		$('#uur').text('00');
		$('#minuut').text('00');
		$('#seconden').text('00');
		$('#honderdste').text('00');
	},
	start: function() {
		s.stop = 0;
	},
	stop: function() {
		s.stop = 1;
	},
	timer: function() {
		if (s.stop === 0) {
			if (s.mills === 100) {
				s.secs++;
				s.mills = 0;
			}
			if (s.secs === 60) {
				s.mins++;
				s.secs = 0;
			}
			if (s.mins === 60) {
				s.hours++;
				s.mins = 0;
			}
			
			
			$('#uur').text(("0" + s.hours).slice(-2));
			$('#minuut').text(("0" + s.mins).slice(-2));
			$('#seconden').text(("0" + s.secs).slice(-2));
			$('#honderdste').text(("0" + s.mills).slice(-2));
			/*
			s.sw.innerHTML = ("0" + s.mins).slice(-2) + ":"
										 + ("0" + s.secs).slice(-2) + ":"
										 + ("0" + s.mills).slice(-2);*/
			s.mills++;
		}
	}
};
})();
Stopwatch.init();