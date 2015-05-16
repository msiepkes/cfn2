
			$(document).ready(function() {
				$('.loaderframe').hide();
				var updates = 0;
									   
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
                	setTimeout( function() { navigator.app.exitApp(); }); 
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
					
				
				//db.transaction(function (tx) { tx.executeSql("DROP TABLE `Gebruiker`", [], null, onError); });
				//db.transaction(function (tx) { tx.executeSql("DROP TABLE `Schema`", [], null, onError); });
				
					/**/
						db.transaction(function (tx) { tx.executeSql("CREATE TABLE IF NOT EXISTS Properties (id INTEGER PRIMARY KEY AUTOINCREMENT, schema NVARCHAR(20), lessen NVARCHAR(20), tijden NVARCHAR(20))", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("CREATE TABLE IF NOT EXISTS Tijden (id INTEGER PRIMARY KEY AUTOINCREMENT, maandag NVARCHAR(50), dinsdag NVARCHAR(50), woensdag NVARCHAR(50), donderdag NVARCHAR(50), vrijdag NVARCHAR(50), zaterdag NVARCHAR(50), zondag NVARCHAR(50), content NTEXT)", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("CREATE TABLE IF NOT EXISTS Lessen (id INTEGER PRIMARY KEY AUTOINCREMENT, dag INT(11), tijd NVARCHAR(20), tekst NVARCHAR(255))", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("CREATE TABLE IF NOT EXISTS Schema (id INTEGER PRIMARY KEY AUTOINCREMENT, schemaid INT(11), dag INT(11), soort NVARCHAR(250), categorie NVARCHAR(250), afbeelding NVARCHAR(250), nummer INT(11), naam NVARCHAR(250), tijdsduur NVARCHAR(10), afstand NVARCHAR(10), sets NVARCHAR(10), herhalingen NVARCHAR(10), gewicht NVARCHAR(10), opmerking NTEXT)", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("CREATE TABLE IF NOT EXISTS Gebruiker (id INTEGER PRIMARY KEY AUTOINCREMENT, naam NVARCHAR(250), emailadres NVARCHAR(250), lidnr INT(11), lengte INT(11), gewicht INT(11))", [], null, onError); });
						db.transaction(function (tx) { tx.executeSql("CREATE TABLE IF NOT EXISTS Uitgevoerd (id INTEGER PRIMARY KEY AUTOINCREMENT, Dag INT(11), Oefening INT(11), Schemaid INT(11), Oordeel INT(11))", [], haalProperties, onError); });
					
				}
				
				
				
				function haalProperties() {
					db.transaction(function (tx) {
						tx.executeSql("SELECT emailadres, lidnr, naam, lengte, gewicht FROM Gebruiker LIMIT 0,1", [], function (tx, result) {
							dataset = result.rows;
							if(dataset.length > 0) {
								item = dataset.item(0);				
								email = item['emailadres'];
								lidnr = item['lidnr'];
								
								$('#naam').val(item['naam']);
								$('#email').val(item['emailadres']);
								$('#lengte').val(item['lengte']);
								$('#gewicht').val(item['gewicht']);
								
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
						
						//kijk of er items in Uitgevoerd staan en deze doorsturen naar cfn online
						alert('check uitgevoerd');
					});
				}
				
				$('#btnopslaan').click(function(e){ 
					e.preventDefault(); 
					db.transaction(function (tx) { tx.executeSql("UPDATE Gebruiker SET emailadres=?, naam=?, lengte=?, gewicht=?", [$('#email').val(), $('#naam').val(), $('#lengte').val(), $('#gewicht').val()], function() {
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
									if(data.schema != schema) { $('.loaderframe').show(); updates++; bijwerkenSchema(data.schema); } else { laadSchema(); }
									if(data.lessen != lessen) { $('.loaderframe').show(); updates++; bijwerkenLessen(data.lessen); } else { laadLessen(); }
									if(data.tijden != tijden) { $('.loaderframe').show(); updates++; bijwerkenTijden(data.tijden); } else { laadTijden(); }									
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
						$.mobile.changePage( "#aanmelden", { transition: "none", changeHash: false }); 
					}
				}
				
				
				
				$('#btnaanmelden').click(function(e) {
					e.preventDefault();
					$.ajax({
							type: "POST",
							crossOrigin: true,
							crossDomain : true, 
							data : { action: 'getUserId', emailadres: $('#amdemail').val(), password: $('#amdpassword').val() }, //werkt
							dataType: "json",
							url: 'http://www.cardiofitness-noord.nl/test.php',
							success: function(data) {
								if(data.validuser) {
									db.transaction(function (tx) { tx.executeSql("INSERT INTO Gebruiker (naam, emailadres, lidnr) VALUES (?, ?, ?)", [data.name, $('#amdemail').val(), data.lidnr], haalProperties(), onError); });
								} else {
									alert('Geen geldige gebruiker!');
									return;
								}
							}, error: function(data) { 
								var t=1;
							}
						});
				});
				
				
				
				
				
				function bijwerkenSchema(datumtijd) {
					$.ajax({
						type: "POST",
						crossOrigin: true,
						crossDomain : true,
						data : { action: 'getSchema', lidnr: lidnr }, //werkt
						dataType: "json",
						url: 'http://www.cardiofitness-noord.nl/test.php',
						success: function(data) {
							db.transaction(function (tx) { tx.executeSql("DELETE FROM `Schema`", null, null, onError); });
							
							if(data.schema) {
								$(data.schema).each(function(i, item) {
									var dag = item.nr;
									if(item.oefeningen.length > 0) {
										$(item.oefeningen).each(function(u, oefening) {
											 db.transaction(function (tx) { tx.executeSql("INSERT INTO `Schema` (schemaid, dag, soort, afbeelding, categorie, nummer, naam, tijdsduur, afstand, sets, herhalingen, gewicht, opmerking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [oefening.schemaid, dag, oefening.soort, oefening.afbeelding, oefening.categorie, oefening.nummer, oefening.naam, oefening.tijdsduur, oefening.afstand, oefening.sets, oefening.herhalingen, oefening.gewicht, oefening.opmerking], null, onError); });
										});
									}
								});
							} 
							
							db.transaction(function (tx) { tx.executeSql("UPDATE Properties SET `schema` = ?", [datumtijd], null, onError); });
							updates--;
							if(updates == 0){ $('.loaderframe').hide(); }
							laadSchema();
						},
						error: function(data){
							var tt1=1;
						}
					});
					laadSchema();
				}
				function laadSchema() {
					var prevdag = -1;
					
					db.transaction(function (tx) {
						tx.executeSql("SELECT Schema.id, Schema.schemaid, Schema.dag, soort, categorie, afbeelding, nummer, naam, tijdsduur, afstand, sets, herhalingen, gewicht, opmerking, IFNULL(Oordeel, -99) AS Oordeel FROM `Schema` LEFT OUTER JOIN Uitgevoerd ON Uitgevoerd.dag = Schema.dag AND Uitgevoerd.Oefening = Schema.id ORDER BY Schema.dag, Schema.id ", [], function (tx, result) {
							dataset = result.rows;
							if(dataset.length > 0) {
								for(i=0;i<dataset.length;i++) {
									item = dataset.item(i);
									
									if(parseInt(item['dag']) != prevdag) {
										var div = $('<div />').addClass('sch').css('position', 'relative').attr('data-name', 'schema ' + item['dag']);
										var ul =  $('<ul />').attr('data-role', 'listview').attr('data-inset', 'true').addClass('ui-listview ui-listview-inset ui-corner-all ui-shadow');
										ul.appendTo(div);
										
										div.appendTo($('#schemas'));
									}
									
									var ul = $('#schemas').find('div[data-name="schema ' + item['dag'] + '"]').find('UL');
									var li = $('<li />').attr('data-icon', 'check').addClass('ui-li-has-thumb');
									
									if(item['Oordeel'] == -99) {
										var a = $('<a />').attr('href', '#training').attr('nr', item['id']).addClass('ui-btn ui-btn-icon-right ui-icon-check');
									} else {
										var a = $('<a />').attr('href', '#training').attr('nr', item['id']).addClass('checked ui-btn ui-btn-icon-right ui-icon-check');
									} 
									
									$('<img />').attr('src', 'http://schema.cardiofitness-noord.nl/equipment/' + item['categorie'] + '/' + item['afbeelding']).addClass('icon').appendTo(a);
									$('<h2 />').html(item['naam']).appendTo(a);
									
									if (item['soort'] == 'gewicht') {
										$('<p />').html('<strong>Aantal sets:</strong> ' + item['sets'] + ' stuks<br /><strong>Aantal herhalingen:</strong> ' + item['herhalingen'] + ' stuks<br /><strong>Gewicht:</strong> ' + item['gewicht'] + ' kg<br />' + item['opmerking']).appendTo(a);
									} else {
										$('<p />').html('<strong>Afstand:</strong> ' + item['afstand'] + ' km<br /><strong>Tijdsduur:</strong> ' + item['tijdsduur'] + ' minuten<br />' + item['opmerking']).appendTo(a);
									}
									a.appendTo(li);
									li.appendTo(ul); 
									
									prevdag = parseInt(item['dag']); 
								}
								
								$('#schemas div[data-name]:not(:first)').hide(); 
								$('#schemas div[data-name] UL').each(function(item, i){ 
									$(item).find('li:first').addClass('ui-first-child');
									$(item).find('li:last').addClass('ui-last-child');
								});
								 
							}
						}, onError);
					});
				}
				
				
				$('body').on('click', 'A[href=#training]', function(e){ 
					e.preventDefault();
					
					var nr = $(this).attr('nr');
					db.transaction(function (tx) {
						tx.executeSql("SELECT Schema.id, Schema.dag, soort, categorie, afbeelding, naam, tijdsduur, afstand, sets, herhalingen, gewicht, opmerking, IFNULL(Oordeel, -99) AS Oordeel, Schema.schemaid FROM `Schema` LEFT OUTER JOIN Uitgevoerd ON Uitgevoerd.dag = Schema.dag AND Uitgevoerd.Oefening = Schema.id WHERE (Schema.id = ?)", [nr], function (tx, result) {
							dataset = result.rows;
							if(dataset.length > 0) {
								item = dataset.item(0);
								
								if(item['Oordeel'] == -99) {
									$('#training A.oordeel').removeClass('checked');
								} else {
									$('#training A.oordeel').addClass('checked');
								} 
								
								$('#training A.oordeel').attr('nr', item['id']).attr('dag', item['dag']).attr('schemaid', item['schemaid']);
								$('#training SPAN.naam').html(item['naam']);
								$('#training IMG.bigger').attr('src', 'http://schema.cardiofitness-noord.nl/equipment/' + item['categorie'] + '/' + item['afbeelding'] +'?x=1');
								
								if (item['soort'] == 'gewicht') {
									$('#training P.oefening').html('<strong>Aantal sets:</strong> ' + item['sets'] + ' stuks<br /><strong>Aantal herhalingen:</strong> ' + item['herhalingen'] + ' stuks<br /><strong>Gewicht:</strong> ' + item['gewicht'] + ' kg<br />' + item['opmerking']);
								} else {
									$('#training P.oefening').html('<strong>Afstand:</strong> ' + item['afstand'] + ' km<br /><strong>Tijdsduur:</strong> ' + item['tijdsduur'] + ' minuten<br />' + item['opmerking']);
								}
								$.mobile.changePage( "#training", { transition: "none", changeHash: false }); 
							} 
						});
					}, onError);
				});
				
				$('body').on('click', 'A.oordeel', function(e){ 
					var dag = parseInt($(this).attr('dag'));
					var id = parseInt($(this).attr('nr'));
					var schemaid = parseInt($(this).attr('schemaid'));
					
					if(!$(this).hasClass('checked')) {
						alert('stel oordeel vraag');
						db.transaction(function (tx) { tx.executeSql("INSERT INTO Uitgevoerd (Dag, Oefening, Schemaid, Oordeel) VALUES (?, ?, ?, ?)", [dag, id, schemaid, 1], null, onError); });
							
						$(this).addClass('checked');
						$('DIV[data-name="schema ' + dag + '"]').find('A[nr="' + id + '"]').addClass('checked');
					}
				});
				
				
				function bijwerkenLessen(datumtijd) {
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
							db.transaction(function (tx) { tx.executeSql("UPDATE Properties SET lessen = ?", [datumtijd], null, onError); });
							updates--;
							if(updates == 0){ $('.loaderframe').hide(); }
							laadLessen();
						},
						error: function(data) {
							var t=1;
						}
					});
				}
				function laadLessen() {
					var ul = $('#lessen UL');
					var dagen = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
					var prevdag = -1;
					
					db.transaction(function (tx) {
						tx.executeSql("SELECT dag, tijd, tekst FROM Lessen ", [], function (tx, result) {
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
				
				
				
				
				
				
				
				function bijwerkenTijden(datumtijd) {
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
							
							db.transaction(function (tx) { tx.executeSql("UPDATE Properties SET tijden = ?", [datumtijd], null, onError); });
							updates--;
							if(updates == 0){ $('.loaderframe').hide(); }
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