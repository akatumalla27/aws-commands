# Aggregate Database

The purpose of this document is to store some information on the analysis schema of the customer database on the Catapult AWS RDS instance. Database.Schema: `customer-db.analysis`

The purpose of the analysis database is to be the data store for the database entry point api to serve both custom widgets in Thingboard dashboards, other external applications, and to serve requests from analysts to get data from the CATAPULT systems.  Data in the analysis `device_aggregation` table is grouped to `device_id`, `site_id`, `customer_id`, `device_name`, `device_type`, `label` (aka telemetry channel, ie: "power"), `start_date` and `end_date`, where the grouped & aggregated columns are the `total` (sum), `maximum`, `minimum`, and `average` for each 15 minute interval as defined by the `start and end_date`. 

The service that manages the extraction of data from the Thingsboard database and the insertion into the device_aggregation table of the analysis schema of the customer-db can be found [here](https://github.com/BoxpowerInc/catapult-aggregation-service)

## Table of Contents 

- [Aggregate Database](#aggregate-database)
	- [Table of Contents](#table-of-contents)
	- [General Database Structure](#general-database-structure)
	- [Create tables - analysis schema](#create-tables---analysis-schema)
	- [Aggregation Queries](#aggregation-queries)
	- [TODO](#todo)
## General Database Structure 
As a starting point, the analysis schema is primarily composed of one table: `customer-db.analysis.device_aggregation`.  This table has columns allowing it to be joined to other customer-db tables (once that databse is built) for enrichment of the data returned.  

Data in the `device_aggregation` table is grouped to `device_id` (named entity_id), `site_id`, `customer_id`, `device_name`, `device_type`, `label` (aka telemetry channel, ie: "power"), `start_date` and `end_date`, where the grouped & aggregated columns are the `total` (sum), `maximum`, `minimum`, and `average` for each 15 minute interval as defined by the `start and end_date`. 


1. Tables:
    - `device_aggregation` Table - 15 minute window aggregations, set to clean windows of minute 00, 15, 30, 45.  All end_dates are non-inclusive so a start time of 00:00 with end 00:15 contains aggregated data from 00:00:00 to 00:14:59.  
    - Series tables - generated series to join to in order to make the analysis queries faster.  Daily, weekly, and monthly tables.
    - `run_log` table - simple table with the start and end for each aggregation that has been ran - it's currently used in the query that sets up the start and end for the query that aggregates data in the Thingsboard database, however this set up is planned to be changed over to all being in go rather than requiring these run log tables.
    - `run_log_check` table - generated series of all 15 minute blocks in 2021 used to generate the start and end for the queries used on the TB database to extract the aggregated data.  Plans to change this in the near future.
## Create tables - analysis schema

Following sql statements were used to create tables in analysis database.  

```sql:
CREATE TABLE analysis.device_aggregation (
	  entity_id uuid not null, 
	  site_id uuid not null,
	  customer_id uuid not null, 
	  device_name varchar not null,
	  device_type varchar not null,
	  label varchar not null,
	  start_date timestamp with time zone not null,
	  start_date timestamp with time zone not null,
	  total double precision,
	  maximum double precision,
	  average double precision,
	  minimum double precision,
	  UNIQUE(entity_id, site_id, customer_id, device_name, device_type, label, start_date)
	);


CREATE TABLE analysis.hourly_interval as
    select generate_series(
				 '2021-01-01 00:00:00-00'::timestamp with time zone,
				'2021-12-31 23:59:59-00'::timestamp with time zone,
				 '1 Hour'::interval -- interval sets the grouping interval
			 ) as hour;


CREATE TABLE analysis.daily_interval as
    select generate_series(
				 '2021-01-01 00:00:00-00'::timestamp with time zone,
				'2021-12-31 23:59:59-00'::timestamp with time zone,
				 '1 Day'::interval -- interval sets the grouping interval
			 ) as day;

CREATE TABLE analysis.weekly_interval as 
  select generate_series(
				 '2021-01-01 00:00:00-00'::timestamp with time zone,
				'2021-12-31 23:59:59-00'::timestamp with time zone,
				 '1 Week'::interval -- interval sets the grouping interval
			 ) as week;

CREATE TABLE analysis.monthly_interval as 
  select generate_series(
				 '2021-01-01 00:00:00-00'::timestamp with time zone,
				'2021-12-31 23:59:59-00'::timestamp with time zone,
				 '1 Month'::interval -- interval sets the grouping interval
			 ) as month;


-- sample query to use the intervals 
-- select SUM(......) --column names with some grouping functions on them
-- from hourly_interval h 
-- left join device_aggregation d 
-- on h.hour = date_trunc('hour', d.datetime)
-- GROUP BY h.hour, ..... -- other column names required for group


-- Run Log 
-- join to this table to ensure start and end date are clean 15 minute chunks in aggregate table
CREATE TABLE analysis.run_log_check as 
    select generate_series(
				 '2021-01-01 00:00:00-00'::timestamp with time zone,
				'2021-12-31 23:59:59-00'::timestamp with time zone,
				 '15 Minutes'::interval -- interval sets the grouping interval
			 ) as minute;

CREATE TABLE analysis.run_log (
    id serial primary key,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
);
```
## Aggregation Queries
There is currently one main query is executed on the Thingsboard Database to extract aggregated device data.  You'll note there are things like `:start_date` or `:partition_name` in the query, and these are simply parameters that are filled in from the go code that runs the aggregation service.  

```sql:
select 
	a.entity_id
	, r.from_id as site_id
	, c.customer_id
	, UPPER(c.name) as device_name
	, UPPER(c.type) as device_type
	, UPPER(b.key) as label
	, CAST(:start_date as timestamp with time zone) as start_date
	, CAST(:end_date as timestamp with time zone) as end_date
	, SUM( -- sometimes power is reported as dbl sometimes it's long - never both
		CASE
			when a.dbl_v is not null then a.dbl_v 
			when a.long_v is not null then a.long_v 
			else 0
		end 
	) as total
	, MAX( 
		CASE
			when a.dbl_v is not null then a.dbl_v
			when a.long_v is not null then a.long_v
			else 0
		end 
	) as maximum 
	, AVG( 
		CASE
			when a.dbl_v is not null then a.dbl_v
			when a.long_v is not null then a.long_v
			else 0
		end 
	) as average
	, MIN( 
		CASE
			when a.dbl_v is not null then a.dbl_v
			when a.long_v is not null then a.long_v
			else 0
		end 
	) as minimum
	from :partition_name a
	left join ts_kv_dictionary b
		on a.key = b.key_id
	left join device c 
		on a.entity_id = c.id
	left join relation r 
		on a.entity_id = r.to_id and r.from_type = 'ASSET'
	where c.name is not NULL 
	and UPPER(c.type) <> 'SYSTEM'
	and to_timestamp(a.ts / 1000) >= :start_date
	and to_timestamp(a.ts / 1000) < :end_date
	group by start_date, end_date, entity_id, site_id, customer_id, device_name, device_type, b.key	
```
Query currently used to get the starts and ends that are formatted into the above query:

```sql:
	WITH t as 
		(
			SELECT MAX(end_time) as end_time from run_log
		)
	SELECT a.* FROM run_log_check a, t
	WHERE a.minute >= t.end_time
	AND a.minute <= now()
```

Insert queries for device_aggregation table then for the run log:


```sql:
INSERT INTO device_aggregation
		(
			entity_id,
			site_id,
			customer_id,
			device_name,
			device_type,
			label,
			start_date,
			end_date,
			total,
			maximum,
			average,
			minimum
		)
	    VALUES
		(
			:entity_id,
			:site_id,
			:customer_id,
			:device_name,
			:device_type,
			:label,
			:start_date,
			:end_date,
			:total,
			:maximum,
			:average,
			:minimum
		)
		ON CONFLICT DO NOTHING
```
```sql:
INSERT into run_log
		(
			start_time, end_time
		)
		VALUES
		(:start_time, :end_time)
```

## TODO 

- Find a better solution than the interval tables - don't want to have to have something update them yearly or have to remember to update them at the start of 2022 or following years.
- Remove run_log_check and move it to being handled by go code that is in the aggregation-service
- Once the customer database is in use and up to date, potentially remove the string columns (other than label - this could be a dimension table where the aggregation table just holds id's from) and just get that info via joining where needed.
- Indexing on the device_aggregation tables once the structure is finalized