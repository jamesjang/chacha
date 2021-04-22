const db = require('../db.js');
const bodyParser = require('body-parser');
const assert = require('assert');
const request = require('request');
const puppeteer = require('puppeteer');
const url = 'https://place.map.kakao.com/';


const collectionName = 'filterCategory';
const shopDataCollectionName ='shopData';

exports.getAll = async(req, res) => {
    test();
    res.send('testing');

};


exports.createItem = function(req, res){
    const collection = db.getDB().collection(collectionName);
    const item = req.body;

    collection.insertOne(item, (error, result) => { // callback of insertOne
        if (error) throw error;
        // return updated list
        collection.find().toArray((_error, _result) => { // callback of find
           if (_error) throw _error;
           res.json(_result);
        });
     });
};

exports.deleteAll = function(req, res) {
   console.log('deleting all');

   const collection = db.getDB().collection(collectionName);

   collection.deleteMany({}, function (error, result) {
      if (error) throw error;

      res.json(result);
   });
};

exports.queryShop = async function(req, res) {
    const collection = db.getDB().collection(shopDataCollectionName);
    const shopID = req.params.id.toString();

    collection.findOne({shop_id: shopID }, function(err, result) {
        if (err) throw err;

        if (result) {
            console.log("has result");
            res.json(result);
        }

        else{
            scrape(shopID, res);
        }
    });
    
};


const scrape = async(id, res) => {
    const shopUrl = url + id;

   
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await
    page.goto(shopUrl, {waitUntil : 'networkidle0'});

    const shopID = id;
    const shopName = await page.evaluate(() => document.querySelector('.tit_location').textContent);
    let rat = "0";

    const rating = await page.evaluate(() => document.querySelector('.ahead_info .num_rate'));
    if (rating != null) {
        const c = await page.evaluate(() => document.querySelector('.ahead_info .num_rate').childNodes[0].textContent);   
        rat = c;
    }
    const imgAttrib = await page.evaluate(() => document.querySelector('.bg_present'));

    let imgUrl = "";
    if (imgAttrib != null) {
        const a = await page.evaluate(() => document.querySelector('.bg_present').getAttribute('style'));
        imgUrl = a.replace(/["'()]/gi, "").replace(/background-image:url/gi,"");
    }

    let foodCat = "";
    const foodCategory =  await page.evaluate(() => document.querySelector('.txt_location'));
    
    if (foodCategory != null) {
        const b = await page.evaluate(() => document.querySelector('.txt_location').childNodes[1].textContent);
        foodCat = b;
    }

    console.log(shopID + " " + shopName + " " +rating + " " + imgUrl + " " + foodCategory);

    browser.close();

    const collection = db.getDB().collection(shopDataCollectionName);

    const data = {
        shop_id: shopID,
        shop_name: shopName,
        shop_category: foodCat,
        kakao_rating: rat,
        main_img: imgUrl,
        imgs : []
    }

    collection.insertOne(data, (error, result) => { // callback of insertOne
        if (error) throw error;
        // return updated list
        collection.find().toArray((_error, _result) => { // callback of find
           if (_error) throw _error;
            res.json(data);
        });
     });

};


const scrapePictures = async(id) => {

    const shopUrl = url + id;
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await
    page.goto(shopUrl, {waitUntil : 'networkidle0'});
    const photoViewer = await page.evaluate(() => document.querySelector('.photo_area'));

    if (photoViewer) {
      //  await page.waitForSelector('#creditCardNumber');
        await page.click('.link_photo');
  
        const loaded = await page.waitForSelector('.list_phtoview');

        //this starts the list
        if (loaded) {

            const maxCount = await page.evaluate(() => document.querySelector('.num_photo .num_g').textContent);

            const picCount = maxCount > 15 ? 15 : maxCount;
            //there are thousands of pictures = await page.evaluate(() => document.querySelector('.num_photo .num_g').textContent);//num_g;
            let nextbtn = await page.evaluate(() => document.querySelector('.link_next'));
            console.log(maxCount);
            await page.waitForSelector('.link_next');

            let count = 0;
            while (count <= picCount - 1) {
                await page.waitForSelector('.link_next');

                await page.click('.link_next');
                
                await setTimeout(() => {

                }, 1500);

                count++;
            }
            let imgs = await page.$$eval('.wrap_preview img[src]', imgs => imgs.map(img => img.getAttribute('src')));
            console.log(imgs.length);

            const collection = db.getDB().collection(shopDataCollectionName);

            collection.updateOne({ shop_id: id }, { $set: {"imgs" : imgs} }, {"upsert" : true} , (error, result) => {
                if (error) throw error;

                console.log("finished updating");
             });
        }

    }
    browser.close();
};

function test(res) {
    const collection = db.getDB().collection(shopDataCollectionName);

    let counter = 0;
    collection.find().forEach(function(mydoc) {
        setTimeout(() => {
            console.log(mydoc.shop_id);
            scrapePictures(mydoc.shop_id, res);
          }, 1000*(counter+1));

        counter += 1;
    });



}

