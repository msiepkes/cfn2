
			$(document).ready(function() {
				function dateAdd(date, interval, units) {
				  var ret = new Date(date); //don't change original date
				  switch(interval.toLowerCase()) {
					case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
					case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
					case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
					case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
					case 'day'    :  ret.setDate(ret.getDate() + units);  break;
					case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
					case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
					case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
					default       :  ret = undefined;  break;
				  }
				  return ret;
				}
				
				function dateFormat(d) {
					return d.getFullYear() + '/0' + (d.getMonth() + 1) + '/0' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
				}
				
				var height = parseInt(($('body').height() - 88) / 3);
				$('#home DIV.row').css('height', height + 'px');
				
				$('#afsluiten').click(function(e) {
					e.preventDefault();
					navigator.app.exitApp();   
				});
				
				$('#switch').change(function() {
					$('.countdown').empty();
					if($(this).is(':checked')){
						$('#aftelrow').show();
					} else {
						$('#aftelrow').hide();
					}
				});
				
				$(".schema").on("swipeleft",function(){
					var aantal = $('.schema').find('DIV.sch').length;
					var zichtbaar = $('.schema DIV.sch:visible').index();
					
					if((zichtbaar + 1) < aantal) {
						 $('.schema DIV.sch:visible').animate({"left":"-400px"}, "400").hide(function() {
						 	$('.schema DIV.sch:eq(' + (zichtbaar + 1) + ')').show().css('left', '400px').animate({"left":"0px"}, "400", function() {
								$('.dagschema SPAN').text($(this).attr('data-name'));
							});
							
						 });
					}
				
				
				});     
				$(".schema").on("swiperight",function(){
					var aantal = $('.schema').find('DIV.sch').length;
					var zichtbaar = $('.schema DIV.sch:visible').index();
					
					if(zichtbaar > 0) {
						 $('.schema DIV.sch:visible').animate({"left":"400px"}, "400").hide(function() {
						 	$('.schema DIV.sch:eq(' + (zichtbaar - 1) + ')').show().css('left', '-400px').animate({"left":"0px"}, "400", function() {
								$('.dagschema SPAN').text($(this).attr('data-name'));
							});
							
						 });
					}
				});     
				
				
				$('#stopwatchbutton1').click(function() {
					Stopwatch.start();
				});
				$('#stopwatchbutton2').click(function() {
					Stopwatch.lap();
				});
				$('#stopwatchbutton3').click(function() {
					Stopwatch.stop();
				});
				$('#stopwatchbutton4').click(function() {
					Stopwatch.restart();
				});
				
				
				
				
				var db = openDatabase("CardioFitness", "1.0", "Cardio Fitness Noord App", 200000);
				var dataset;
				var DataType;
				var email = null;
				var lidnr = null;
				var schema = null;
				var lessen = null;
				var tijden = null;
				
				
				if (!window.openDatabase) {
					alert('Databases are not supported in this browser.');
				} else {
					/*
						db.transaction(function (tx) { tx.executeSql("DROP TABLE Properties", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("DROP TABLE Tijden", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("DROP TABLE Lessen", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("DROP TABLE Gebruiker", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("DROP TABLE Schema", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("DROP TABLE UserProperties", [], null, onError); }); 
					*/
				
				//db.transaction(function (tx) { tx.executeSql("DROP TABLE Gebruiker", [], null, onError); });
					/**/
						db.transaction(function (tx) { tx.executeSql("CREATE TABLE IF NOT EXISTS Properties (id INTEGER PRIMARY KEY AUTOINCREMENT, schema NVARCHAR(20), lessen NVARCHAR(20), tijden NVARCHAR(20))", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("CREATE TABLE IF NOT EXISTS Tijden (id INTEGER PRIMARY KEY AUTOINCREMENT, maandag NVARCHAR(50), dinsdag NVARCHAR(50), woensdag NVARCHAR(50), donderdag NVARCHAR(50), vrijdag NVARCHAR(50), zaterdag NVARCHAR(50), zondag NVARCHAR(50), content NTEXT)", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("CREATE TABLE IF NOT EXISTS Lessen (id INTEGER PRIMARY KEY AUTOINCREMENT, dag INT(11), tijd NVARCHAR(20), tekst NVARCHAR(255))", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("CREATE TABLE IF NOT EXISTS Schema (id INTEGER PRIMARY KEY AUTOINCREMENT, dag INT(11), afbeelding NVARCHAR(250), naam NVARCHAR(250), snelheid NVARCHAR(10), afstand NVARCHAR(10), sets NVARCHAR(10), herhalingen NVARCHAR(10), gewicht NVARCHAR(10))", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("CREATE TABLE IF NOT EXISTS Gebruiker (id INTEGER PRIMARY KEY AUTOINCREMENT, naam NVARCHAR(250), emailadres NVARCHAR(250), lidnr INT(11))", [], haalProperties, onError); });
					
					
				}
				
				
				
				function haalProperties() {
					db.transaction(function (tx) {
						tx.executeSql("SELECT emailadres, lidnr, naam FROM Gebruiker LIMIT 0,1", [], function (tx, result) {
							dataset = result.rows;
							if(dataset.length > 0) {
								item = dataset.item(0);				
								email = item['emailadres'];
								lidnr = item['lidnr'];
								
								$('#naam').val(item['naam']);
								$('#email').val(item['emailadres']);
								
								var hours = new Date().getHours(); 
								var msg = 'Welkom';
								if(hours<12) { msg = "Goedemorgen "; }
								else if(hours<18) { msg = "Goedemiddag "; }
								else { msg = "Goedenavond "; } 
								
								$('#welkomstekst').text(msg + item['naam']);
							}
						});
					});
					
					db.transaction(function (tx) {
						tx.executeSql("SELECT schema, lessen, tijden FROM Properties LIMIT 0,1", [], function (tx, result) {
							dataset = result.rows;
							if(dataset.length > 0) {
								item = dataset.item(0);
								schema = item['schema'];
								lessen = item['lessen'];
								tijden = item['tijden'];  
							}
							
							checkProperties();
						});
					});
				}
				
				$('#btnopslaan').click(function(e){ 
					e.preventDefault(); 
					db.transaction(function (tx) { tx.executeSql("UPDATE Gebruiker SET emailadres=?, naam=?", [$('#email').val(), $('#naam').val()], function() {
						alert('De gegevens zijn opgeslagen');
					}, onError); }); 
				});
				
				function checkProperties() {					
					if(!schema) {
						db.transaction(function (tx) { tx.executeSql("INSERT INTO Properties (schema, lessen, tijden) VALUES (?, ?, ?)", ['2015-05-03 23:00:00', '2015-05-03 23:00:00', '2015-05-03 23:00:00'], null, onError); });
					}
				 
					if(lidnr) {
						$.ajax({
							type: "POST",
							crossOrigin: true,
							crossDomain : true, 
							data : { action: 'getDates', lidnr: lidnr }, //werkt
							dataType: "json",
							url: 'http://www.cardiofitness-noord.nl/test.php',
							success: function(data) {
								if(data.validuser) {
									if(data.schema != schema) { alert('bijwerken schema'); bijwerkenSchema(); } else { laadSchema(); }
									if(data.lessen != lessen) { alert('bijwerken lessen'); bijwerkenLessen(); } else { laadLessen(); }
									if(data.tijden != tijden) { alert('bijwerken tijden'); bijwerkenTijden(); } else { laadTijden(); }
								} else {
									alert('Geen geldige gebruiker!');
									return;
								}
							},
							error: function(data) {
								var t=1;
							}
						});
					} else { 
						$.mobile.changePage( "#aanmelden", { transition: "slideup", changeHash: false }); 
					}
				}
				
				$('#btnaanmelden').click(function(e) {
					e.preventDefault();
					alert('aanmelden1');
					$.ajax({
							type: "POST",
							crossOrigin: true,
							crossDomain : true, 
							data : { action: 'getUserId', emailadres: $('#amdemail').val(), password: $('#amdpassword').val() }, //werkt
							dataType: "json",
							url: 'http://www.cardiofitness-noord.nl/test.php',
							success: function(data) {
					alert('aanmelden2');
								if(data.validuser) {
									db.transaction(function (tx) { tx.executeSql("INSERT INTO Gebruiker (naam, emailadres, lidnr) VALUES (?, ?, ?)", [data.name, $('#amdemail').val(), data.lidnr], haalProperties(), onError); });
								} else {
									alert('Geen geldige gebruiker!');
									return;
								}
							}, error: function(data) { 
					alert('aanmelden3');
					alert(data);
								var t=1;
							}
						});
				});
				
				
				
				function bijwerkenSchema() {
					$.ajax({
						type: "POST",
						crossOrigin: true,
						crossDomain : true,
						data : { action: 'getSchema', lidnr: lidnr }, //werkt
               			//data: "{action: 'getSchema', lidnr: " + lidnr + "}", 
						dataType: "json",
						url: 'http://www.cardiofitness-noord.nl/test.php',
						success: function(data) {
							var tt1=1;
							//db.transaction(function (tx) { tx.executeSql("DELETE FROM Tijden", null, null, onError); });
							//db.transaction(function (tx) { tx.executeSql("INSERT INTO Tijden (maandag, dinsdag, woensdag, donderdag, vrijdag, zaterdag, zondag, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [data.maandag, data.dinsdag, data.woensdag, data.donderdag, data.vrijdag, data.zaterdag, data.zondag, data.content], laadTijden, onError); });
							
							//db.transaction(function (tx) { tx.executeSql("UPDATE Properties SET tijden = ?", ['2015-05-06 23:00:01'], null, onError); });
						},
						error: function(data){
							var tt1=1;
						}
					});
				
					laadSchema();
				}
				function laadSchema() {
					alert('laad schema');
				}
				
				function bijwerkenLessen() {
					db.transaction(function (tx) { tx.executeSql("DELETE FROM Lessen", null, null, onError); });
					
					$.ajax({
						type: "POST",
						crossOrigin: true,
						crossDomain : true,
						data : { action: 'getLessen' }, //werkt
						dataType: "json",
						url: 'http://www.cardiofitness-noord.nl/test.php',
						success: function(data) {
							$(data.tijden).each(function() {
								var dag = $(this)[0].dag;
								$($(this)[0].tijden).each(function() { 
									var tijd = $(this)[0].tijd;
									var tekst = $(this)[0].tekst;
									
									db.transaction(function (tx) { tx.executeSql("INSERT INTO Lessen (dag, tijd, tekst) VALUES (?, ?, ?)", [dag, tijd, tekst], null, onError); });							
								}); 
							});
							db.transaction(function (tx) { tx.executeSql("UPDATE Properties SET lessen = ?", ['2015-05-03 22:06:00'], null, onError); });
							laadLessen();
						}
					});
				}
				function laadLessen() {
					var ul = $('#lessen UL');
					var dagen = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
					var prevdag = -1;
					
					db.transaction(function (tx) {
						tx.executeSql("SELECT dag, tijd, tekst FROM Lessen ORDER BY dag, tijd", [], function (tx, result) {
							dataset = result.rows;
							if(dataset.length > 0) {
								for(i=0;i<dataset.length;i++) {
									item = dataset.item(i);
									
									if(parseInt(item['dag']) != prevdag) {
										$('<li />')
										.attr('data-role', 'list-divider')
										.attr('role', 'heading')
										.addClass('ui-li-divider ui-bar-inherit')
										.css('text-transform', 'uppercase')
										.html(dagen[parseInt(item['dag'])])
										.appendTo(ul);
									}
									
									$('<li />')
									.attr('data-icon', 'false')
									.attr('data-theme', 'c')
									.html('<a href="#" class="ui-btn ui-btn-c"><p>' + item['tijd'] + '</p><span style="font-weight: 100; font-size: 12px; padding-left: 2px;"> ' + item['tekst'] + '</span></a>')
									.appendTo(ul);
									
									prevdag = parseInt(item['dag']);
								}
								
								ul.find('li:first').addClass('ui-first-child');
								ul.find('li:last').addClass('ui-last-child');
							}
						});
					});
				}
				
				function bijwerkenTijden() {
					$.ajax({
						type: "POST",
						crossOrigin: true,
						crossDomain : true,
						data : { action: 'getTijden' }, //werkt
						dataType: "json",
						url: 'http://www.cardiofitness-noord.nl/test.php',
						success: function(data) {
							db.transaction(function (tx) { tx.executeSql("DELETE FROM Tijden", null, null, onError); });
							db.transaction(function (tx) { tx.executeSql("INSERT INTO Tijden (maandag, dinsdag, woensdag, donderdag, vrijdag, zaterdag, zondag, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [data.maandag, data.dinsdag, data.woensdag, data.donderdag, data.vrijdag, data.zaterdag, data.zondag, data.content], laadTijden, onError); });
							
							db.transaction(function (tx) { tx.executeSql("UPDATE Properties SET tijden = ?", ['2015-05-03 22:06:00'], null, onError); });
						}
					});
				}
				
				function laadTijden() {
					db.transaction(function (tx) {
						tx.executeSql("SELECT maandag, dinsdag, woensdag, donderdag, vrijdag, zaterdag, zondag, content FROM Tijden", [], function (tx, result) {
							dataset = result.rows;
							if(dataset.length > 0) {
								item = dataset.item(0); 
								$('#regulier').html('<div class="dag"><span>maandag:</span>' + item['maandag'] + '</div><div class="dag"><span>dinsdag:</span>' + item['dinsdag'] + '</div><div class="dag"><span>woensdag:</span>' + item['woensdag'] + '</div><div class="dag"><span>donderdag:</span>' + item['donderdag'] + '</div><div class="dag"><span>vrijdag:</span>' + item['vrijdag'] + '</div><div class="dag"><span>zaterdag:</span>' + item['zaterdag'] + '</div><div class="dag"><span>zondag:</span>' + item['zondag'] + '</div>');
								$('#feestdagen').html(item['content']);  
							}
						});
					});
				}
				
				function onError(tx, error) {
					alert(error.message);
				}
			});