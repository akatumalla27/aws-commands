## Data entry workflow

1. Excel sheet currently (02/01/2021) present at account:

```
emailid: egicatapult@gmail.com
password: *will be shared via lastpass as required*
```

2. Edit permissions to the sheets which are used for data entry are given only to the sheet owner - egicatapult.

BoxPower operator/ developer needs to given access to Form and Pending sheets. Pending sheets should not be directly edited, a warning is shown if someone other than the owner directly tries to edit the approval pending sheet.

Only the owner can add/update the main sheet.

3. Forms will be created in google sheet and ```Google Apps Script``` is used to add sheets into the main sheet. The ```SheetnamePending``` sheet will store modification requests that are pending sheet owner approval.

