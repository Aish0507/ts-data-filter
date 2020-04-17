# Use case
```js
const data = [
    { name: "jakobfarzanjordan", current_address: "Paris Hill St. Wayne, NJ 07470",
    permanent_address: {
        area : "Coffee Rd.Rockford",
        pincode: "56744",
    } },
     { name: "aculeatedjakob", current_address: "Stillwater Drive Mount Airy, MD",
    permanent_address: {
        area : "Devon Lane Canonsburg, PA",
        pincode: "234006",
    } },
     { name: "batwingjakob", current_address: "Mammoth Street Toledo, OH",
    permanent_address: {
        area : "Cobblestone Street Upper Darby, PA ",
        pincode: "97535",
    } },
     { name: "carlenelouisegonzalez", current_address: "Beacon Street Covington, GA",
    permanent_address: {
        area : "Vale St. State College, PA",
        pincode: "12345",
    } }
];

const result = filterBy(data, {
    logic: 'and',
    filters: [
        { field: "name", operator: "startswith", value: "c", ignoreCase: true },
        { field: "current_address", operator: "contains", value: "Mammoth", ignoreCase: true },
        { field: "permanent_address.pincode", operator: "eq", value: "12345", ignoreCase: true }
    ]
});

console.log(JSON.stringify(result, null, 2));
```
# Out Put 
```
[
{
"name": "jakobfarzanjordan",
"current_address": "Paris Hill St. Wayne, NJ 07470",
"permanent_address": {
"area": "Coffee Rd.Rockford",
"pincode": "56744"
}
},
{
"name": "batwingjakob",
"current_address": "Mammoth Street Toledo, OH",
"permanent_address": {
"area": "Cobblestone Street Upper Darby, PA ",
"pincode": "97535"
}
},
{
"name": "carlenelouisegonzalez",
"current_address": "Beacon Street Covington, GA",
"permanent_address": {
"area": "Vale St. State College, PA",
"pincode": "12345"
}
}
]
```