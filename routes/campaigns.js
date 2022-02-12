var express = require('express');
var apiRequest = require('request-promise')
var router = express.Router();

/* Endpoint to fetch the campaigns and sort them by Total Amount in descending order and return the
  campaigns. The result returned should contain the fields Title, Total Amount, Backers
  Count and End Date.
*/
router.get('/sortedCampaigns', function (req, res, next) {
  apiRequest('https://testapi.donatekart.com/api/campaign').then(body => {
    let campaignsList = [];
    const response = JSON.parse(body);
    response.map(item => {
      let itemData = {
        "title": item.title,
        "endDate": item.endDate,
        "totalAmount": item.totalAmount,
        "backersCount": item.backersCount,
      };
      campaignsList.push(itemData);
    })

    campaignsList = campaignsList.slice().sort((a, b) => b.totalAmount - a.totalAmount);
    res.send(campaignsList);
  }).catch(err => {
    console.log(err);
    res.send(err);
  });
});


/*
  Endpoint to fetch active campaigns that are created within the last 1 month.
  filter active campaigns. A campaign is active if the end date is greater
  than or equal to today. Filter the list further to get the campaigns that are created within
  the last 30 days.
*/
router.get('/getActiveCampaigns', function (req, res, next) {
  apiRequest('https://testapi.donatekart.com/api/campaign').then(body => {
    const response = JSON.parse(body);
    const today = new Date()
    const priorDate = new Date().setDate(today.getDate() - 30)
    const result = response.filter(item => {
      var created = new Date(item.created).getTime();
      var endDate = new Date(item.endDate).getTime();

      return created >= priorDate && endDate >= today;
    });
    res.send(result);
  }).catch(err => {
    console.log(err);
    res.send(err);
  });
});

/*
  Endpoint to fetch closed campaigns.
  Make a call to external API https://testapi.donatekart.com/api/campaign to fetch
  campaigns and filter closed campaigns. A campaign is closed if the end date is less than
  today, or Procured Amount is greater than or equal to Total Amount.
*/
router.get('/getClosedCampaigns', function (req, res, next) {
  apiRequest('https://testapi.donatekart.com/api/campaign').then(body => {
    const response = JSON.parse(body);
    const today = new Date().getTime()
    const result = response.filter(item => {
      var endDate = new Date(item.endDate).getTime();
      return endDate < today || item.procuredAmount >= item.totalAmount;
    });
    res.send(result);
  }).catch(err => {
    console.log(err);
    res.send(err);
  });
});
module.exports = router;
