<?php

	header('Content-type: text/plain');
	header("Cache-Control: No-cache");

	require_once "dbg.php";
	require_once "lib.php";
	require_once "db.php";

	getconfig();
	$game_weeks = $config["game_weeks"];


	$most = 0.75;
	//$most = 0;

	// fetch the list of teachers
	$sql = "select id, teacher_code, first_name, last_name, auth_count, email  from users where active=1 and user_type='t'";
	$rs = dbExec($sql);
	while($o = $rs->FetchNextObj())
	{
		$status = "No Students";	// Teacher registered but did not input students

		$id = $o->id;
		$first_name = $o->first_name;
		$last_name = $o->last_name;
		$full_name = "$last_name, $first_name";
		$ac = $o->auth_count;
		$email = $o->email;
		$tc = $o->teacher_code;

		$in_tutorial = 0;

		// count how many students this teacher has
		$sql = "select count(id) from users where active=1 and user_type='s' and teacher_code=$tc";
		$num_students = dbGetFld($sql);
		if($num_students > 0) {
			// there's at least one student
			
			$status = "With Students";

			// count how many of the students are assigned to a group (team)
			$sql = "select count(id) from users where active=1 and user_type='s' and teacher_code=$tc and group_id != 0";
			$num_in_group = dbGetFld($sql);

			if($num_in_group / $num_students > $most) {
				// most of this teacher's students are in a group
				$status = "Roles and Teams";
			}

			// count how many groups this teacher has
			$sql = "select count(id) from `groups` where teacher_code=$tc";
			$num_groups = dbGetFld($sql);

			// count how many groups are in the tutorial
			$sql = "select count(id) from `groups` where teacher_code=$tc and week=0";
			$num_groups_in_tutorial = dbGetFld($sql);
			if($num_groups_in_tutorial > 0) {
				// at least one group is still in tutorial
				$in_tutorial = 1;
			}

			if($num_groups > 0) {
				// this teacher has at least one group 

				for($w = 1; $w <= ($game_weeks + 1); $w++) {

					// count how many groups are in, or beyond, week $w
					$sql = "select count(id) from groups where teacher_code=$tc and week>=$w";
					$groups_in_week = dbGetFld($sql);;

					if(($groups_in_week / $num_groups) > $most) {
						// most of the groups are in, or beyond, week $w

						$status = "Task $w";

						if($w > $game_weeks) {
							// this week is the last one
							$status = "Finished";
						}
					}
				}
			}
		}


		// XXX task_progress was not a useful value
		$sql = "update users set status = '$status', task_progress=0, in_tutorial=$in_tutorial where id = $id limit 1";
		dbExec($sql);


		echo "$tc\t$full_name\t<$email>\t$status\t$in_tutorial\n";
		ob_flush();
		flush();
	}

?>
