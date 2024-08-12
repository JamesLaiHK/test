const fs = require('fs');

function generateRandomId(){
  return Math.floor(Math.random() * 10000);
}


function save(data){
  return new Promise((resolve, reject) => {
    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Gets all quotes
 * @param None
 */
function getItems(){
  return new Promise((resolve, reject) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const json = JSON.parse(data);
        resolve(json);
      }
    });
  });
}

/**
 * Gets a specific item by ID
 * @param {number} id - Accepts the ID of the specified item.
 */
async function getItem(id){
  const item = await getItems();
  return item.records.find(record => record.id == id);
}


/**
 * Search item by keyword
 * @param query 
 */
async function searchItem(query){
  const item = await getItems();
  item.records = item.records.filter(item =>
    item.description.toLowerCase().includes(query.toLowerCase())) 
  return item
}

/**
 * Creates a new item record 
 * @param {Object} newRecord - Object containing info for new item 
 */
async function createItem(newRecord) {
  const items = await getItems(); 
  
  newRecord.id = generateRandomId(); 
  items.records.push(newRecord);
  await save(items); 
  return newRecord; 
}

/**
 * Updates a single record 
 * @param {Object} newItem - An object containing the changes to item
 */
async function updateItem(newItem){
  const items = await getItems();
  let item = items.records.find(item => item.id == newItem.id);
  
  item.imageUrl = newItem.imageUrl
  item.description = newItem.description;
  item.minBidPrice = newItem.minBidPrice;
  item.bidList = newItem.bidList;
 
  await save(items);
}

/**
 * Deletes a single record
 * @param {Object} record - Accepts record to be deleted. 
 */
async function deleteItem(record){
  const items = await getItems();
  items.records = items.records.filter(item => item.id != record.id);
  await save(items);
}

module.exports = {
  getItems,
  getItem, 
  searchItem,
  createItem, 
  updateItem, 
  deleteItem
}
