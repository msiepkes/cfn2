<?php
	header('Content-type: text/html');
	header('Access-Control-Allow-Origin: *');
 
	require_once('includes/functions.php');
	
  switch ($_POST['action']) {
    case 'getDates':
		$con = $SQL->Connect();
		$con2 = $TrainingSQL->Connect();
		$foo = new StdClass();
		$foo->validuser = true;
		
		$sql = "SELECT `lessen`, `tijden` FROM datas";
		$result = $con->query($sql); 
		if ($result->num_rows > 0) { 
			while($row = $result->fetch_assoc()) {
				$foo->lessen = $row["lessen"];
				$foo->tijden = $row["tijden"];
			}
		} 
		
		$sql = "SELECT `changed` FROM leden WHERE (nummer = '".$Main->EscapeString($_POST['lidnr'])."')";
		$result = $con2->query($sql); 
		if ($result->num_rows > 0) { 
			while($row = $result->fetch_assoc()) {
				$foo->schema = $row["changed"];
			}
		} 
		
		$SQL->Disconnect($con);
		$TrainingSQL->Disconnect($con2);
		$json = json_encode($foo);
		echo $json;
        break;
    case 'getUserId':
		$foo = new StdClass();
		$foo->validuser = true;
		$foo->lidnr = '1029';
		$foo->name = 'Martin Siepkes';
		
		$json = json_encode($foo);
		echo $json;
        break;
    case 'getSchema':
		$con2 = $TrainingSQL->Connect();
		$schemas = new StdClass();
		
		for ($x = 0; $x <= 6; $x++) {
			$oefening = array();
						
			$sql = "SELECT `schema`.dagnr, benaming, image, afstand, tijdsduur, sets, herhalingen, `schema`.gewicht, opmerking, soorten.naam, categorieen.naam AS categorie FROM `leden` INNER JOIN `schema` ON `schema`.lidnr = leden.id INNER JOIN toestellen ON toestellen.id = `schema`.toestel INNER JOIN soorten ON soorten.id = toestellen.soort INNER JOIN categorieen ON categorieen.id = toestellen.categorie WHERE (leden.nummer='".stripslashes($_POST['lidnr'])."') AND (`schema`.dagnr='".$x."')";
			$result = $con2->query($sql); 
			if ($result->num_rows > 0) { 
				while($row = $result->fetch_assoc()) {			
					$foo = new StdClass();
					$foo->soort = $row['naam'];
					$foo->categorie = $row['categorie'];
					$foo->afbeelding = $row['image'];
					$foo->naam = $row['benaming']; 
					$foo->tijdsduur = $row['tijdsduur'];
					$foo->afstand = $row['afstand'];
					$foo->sets = $row['sets'];
					$foo->herhalingen = $row['herhalingen'];
					$foo->gewicht = $row['gewicht'];
					$foo->opmerking = $row['opmerking'];
					array_push($oefening, $foo);
				}
			}
			$schema = new StdClass();
			$schema->nr = $x;
			$schema->oefeningen = $oefening;
			
			$schemas->schema[$x] = $schema;
		}
		
		$TrainingSQL->Disconnect($con2);
		$json = json_encode($schemas);
		echo $json;
        break;
    case 'getLessen':
		$con = $SQL->Connect();
		$dagen = new StdClass();

		for($i = 0; $i < 7; $i++) {
			$dag = new StdClass();
			$tijden = array();
			
			$sql = "SELECT `name`, `start`, eind FROM programma WHERE (`day` = ".$i.") ORDER BY sortorder";
			$result = $con->query($sql); 
			if ($result->num_rows > 0) { 
				while($row = $result->fetch_assoc()) {	 
					$foo = new StdClass();
					$foo->tijd = $row["start"].' - '.$row["eind"];
					$foo->tekst = $row["name"];
					array_push($tijden, $foo);
				}
			}
			
			$dag->dag = $i;
			$dag->tijden = $tijden;
			
			$dagen->tijden[$i] = $dag;
		}
		
		/*
		for ($x = 0; $x <= 6; $x++) {
			$dag = new StdClass();
			$tijden = array();
			for ($y = 0; $y <= 10; $y++) {
				$foo = new StdClass();
				$foo->tijd = '09:00 - 09:55';
				$foo->tekst = 'Virtueel spinning';
				array_push($tijden, $foo);
			}
			$dag->dag = $x;
			$dag->tijden = $tijden;
			
			$dagen->tijden[$x] = $dag;
		}*/
		
		$SQL->Disconnect($con);
		$json = json_encode($dagen);
		echo $json;
        break;
    case 'getTijden':
		$i = 0;
		$con = $SQL->Connect();
		$foo = new StdClass();
		
		$sql = "SELECT id, dag, begintijd, eindtijd FROM tijden ORDER BY id";
		$result = $con->query($sql); 
		if ($result->num_rows > 0) { 
			while($row = $result->fetch_assoc()) {							
				if($i == 0) { $foo->maandag = $row["begintijd"].'&nbsp;&nbsp;-&nbsp;&nbsp;'.$row["eindtijd"]; }
				if($i == 1) { $foo->dinsdag = $row["begintijd"].'&nbsp;&nbsp;-&nbsp;&nbsp;'.$row["eindtijd"]; }
				if($i == 2) { $foo->woensdag = $row["begintijd"].'&nbsp;&nbsp;-&nbsp;&nbsp;'.$row["eindtijd"]; }
				if($i == 3) { $foo->donderdag = $row["begintijd"].'&nbsp;&nbsp;-&nbsp;&nbsp;'.$row["eindtijd"]; }
				if($i == 4) { $foo->vrijdag = $row["begintijd"].'&nbsp;&nbsp;-&nbsp;&nbsp;'.$row["eindtijd"]; }
				if($i == 5) { $foo->zaterdag = $row["begintijd"].'&nbsp;&nbsp;-&nbsp;&nbsp;'.$row["eindtijd"]; }
				if($i == 6) { $foo->zondag = $row["begintijd"].'&nbsp;&nbsp;-&nbsp;&nbsp;'.$row["eindtijd"]; }
				$i++;
			}
		}
		
		if ($stmt = $con->prepare("SELECT content FROM pages WHERE (id=4)")) {
			$stmt->execute();
			$stmt->bind_result($content);
			while ($stmt->fetch()) {
				$foo->content = base64_decode($content); 
			}
			$stmt->close();
		}
		
		$SQL->Disconnect($con);

		$json = json_encode($foo);
		echo $json;
        break;
  }
?>