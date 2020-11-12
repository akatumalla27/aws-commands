POST metricbeat-*/_delete_by_query
{
 "query": {
   "range": {
     "@timestamp": {
       "gte": "2020-11-12T16:00",
       "lt": "2020-11-12T19:00"
      }
    }
  }
}



POST /_aliases
{
    "actions" : [
        { "add" : { "index" : "metricbeat-7.6.2", "alias" : "metricbeat-alias1" } }
    ]
}
