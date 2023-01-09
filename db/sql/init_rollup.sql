/*
 * Functions to do the rollup of statistics, actual tables are added via init.sql
 */

 /*
 Creates an entry in the stats_rollup_lock to indicate that something is currently updating a specific rollup table

 Returns true if we acquired the lock and can proceed
 Make sure to call unlock_rollup when done or the lock never gets released
 */
CREATE OR REPLACE FUNCTION lock_rollup_if_we_can(name text) returns bool
    language plpgsql AS
$$
BEGIN
    /* Make sure there's not currently an update in progress */
    IF EXISTS(select rollup_in_progress from stats_rollup_lock where rollup_name = name)
    THEN
        IF ((select rollup_in_progress from stats_rollup_lock where rollup_name = name) = true)
        THEN
            RETURN false; /* Update is already in progress */
        END IF;
        UPDATE stats_rollup_lock
        SET rollup_in_progress = true
        WHERE rollup_name = name;
    ELSE
        INSERT INTO stats_rollup_lock VALUES (name, true, null);
    END IF;
    RETURN true; /* We either made a new entry or true'd an already existing entry */
END;
$$;

/*
 Removes the lock (if it exists) for the given name
 */
CREATE OR REPLACE FUNCTION unlock_rollup(name text) RETURNS void
    language plpgsql AS
$$
BEGIN
    IF EXISTS(select rollup_in_progress from stats_rollup_lock where rollup_name = name)
    THEN
        UPDATE stats_rollup_lock
        SET rollup_in_progress = false, last_finished = now()
        WHERE rollup_name = name;
    END IF;
END;
$$;

/*
 Creates rollup entries in stats_gods_rollup for the given date
 Fails if something is already trying to do a god rollup or if there is any entry for the provided date
 */
CREATE OR REPLACE FUNCTION rollup_gods(d date) RETURNS bool
    language plpgsql AS
$$
DECLARE
    mmr_option record;
BEGIN
    IF EXISTS(select day from stats_gods_rollup where day = d)
    THEN
        return false; /* We already have data for the requested date */
    END IF;
    IF not (lock_rollup_if_we_can('rollup_gods'))
    THEN
        return false; /* Failed to lock */
    END IF;
    for mmr_option in select * from rollup_types where category = 'mmr'
        LOOP
            insert into stats_gods_rollup (day, type_id, god_name, picks, first_place, second_place, third_place, fourth_place, fifth_place, sixth_place, seventh_place, eighth_place , place_sum)
            select d                                AS day,
                  mmr_option.type_id                AS type_id,
                  god                               AS god_name,
                  count(*)                          AS picks,
                  count(*) FILTER (WHERE place = 1) AS first_place,
                  count(*) FILTER (WHERE place = 2) AS second_place,
                  count(*) FILTER (WHERE place = 3) AS third_place,
                  count(*) FILTER (WHERE place = 4) AS fourth_place,
                  count(*) FILTER (WHERE place = 5) AS fifth_place,
                  count(*) FILTER (WHERE place = 6) AS sixth_place,
                  count(*) FILTER (WHERE place = 7) AS seventh_place,
                  count(*) FILTER (WHERE place = 8) AS eighth_place,
                  sum(place)                        AS place_sum

            from games
                     join game_players using (game_id)
            where ranked = true
              and game_players.mmr between (mmr_option.data->>'floor')::int and (mmr_option.data->>'ceiling')::int
              and created_at::date = d
            group by god, day, type_id;
        END LOOP;
    PERFORM unlock_rollup('rollup_gods');
    return true;
END;
$$;


/*
 Rolls up god stats for every day since 9/21/22 until yesterday (since there will be more games today), if there is already data for that day then it's skipped
*/
CREATE OR REPLACE FUNCTION rollup_gods_all() RETURNS TABLE (day date, rollup_succeeded bool)
    language plpgsql AS
$$
DECLARE
    rollup_day date;
BEGIN
    for rollup_day in select d::date from generate_series('2022-09-21', (now()- interval '1 day')::date, interval '1 day') as d
        LOOP
        day := rollup_day;
        rollup_succeeded := (select rollup_gods(rollup_day));
        RETURN NEXT;
        END LOOP;
END;
$$;

/*
    Aggregates game data at a per day level
*/
CREATE OR REPLACE FUNCTION rollup_games(d date) RETURNS bool
    language plpgsql AS
$$
BEGIN
    IF EXISTS(SELECT day FROM stats_games_rollup WHERE day = d)
    THEN
        RETURN false; /* We already have data for the requested date */
    END IF;
    IF NOT (lock_rollup_if_we_can('rollup_games'))
    THEN
        RETURN false; /* Failed to lock */
    END IF;

    INSERT INTO stats_games_rollup (day, type_id, games_count, rounds_sum, duration_sum)
    SELECT d                  AS day,
           'all_mmr'          AS type_id,
           count(*)           AS games_count,
           sum(rounds)        AS round_sum,
           sum(duration)      AS duration_sum
    FROM games
    WHERE ranked = true
      AND rounds notnull
      AND duration notnull
      AND created_at::date = d
    GROUP BY day;

    PERFORM unlock_rollup('rollup_games');
    RETURN true;
END;
$$;

/*
    Runs game data aggregation from 1/1/2022 to yeserday (since there are still games being played today)
    Any days that already have data will be skipped, days with no data will have no entries
*/
CREATE OR REPLACE FUNCTION rollup_games_all() RETURNS TABLE (day date, rollup_succeeded bool)
    language plpgsql AS
$$
DECLARE
    rollup_day date;
BEGIN
    for rollup_day in select d::date from generate_series('2022-01-01', (now()- interval '1 day')::date, interval '1 day') as d
        LOOP
        day := rollup_day;
        rollup_succeeded := (select rollup_games(rollup_day));
        RETURN NEXT;
        END LOOP;
END;
$$;
