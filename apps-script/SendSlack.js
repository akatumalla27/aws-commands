function sendForApproval(requestType, sheetLink) {
	var slackWebhook ="https://hooks.slack.com/services/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"
	data={
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "*Approval request* :exclamation: "+ requestType
				}
			},
			{
				"type": "actions",
				"block_id": "actionblock789",
				"elements": [
					{
						"type": "button",
						"text": {
							"type": "plain_text",
							"text": "Click to Approve/Reject"
						},
						"url": sheetLink
					}
				]
			}
		]
	}
	
	var options = {
	  'method' : 'post',
	  // Convert the JavaScript object to a JSON string.
	  'payload' : JSON.stringify(data),
	  muteHttpExceptions: true
	};
	
	
	var response = UrlFetchApp.fetch(slackWebhook, options);
	Logger.log(response.getContentText()); 
	
	
	}
	
	
	