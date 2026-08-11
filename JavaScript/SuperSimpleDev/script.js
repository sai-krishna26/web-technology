/////////////////////////////////////////NUMBERS///////////////////////////////////////////
// function reverseRound(num)
// {
//  let decimal=num%1;
//     return  decimal>=0.5 ? Math.floor(num) : Math.ceil(num);
// }

// console.log(reverseRound(8.8));


// let temp=-5;
// console.log(`the temp is ${temp} degree celcius:`,(temp*9/5)+32,'degree fahrenheit');
// console.log(`the temp is ${temp} degree Fahrenheit:`,((temp-32)*5/9).toFixed(2),'degree celcius');



//////////////////////////////////////////STRINGS////////////////////////////////////////


let asn='Items ('+(1+1)+'): $'+(2234+4434)/100;  
                                                            //observe the difference between the two methods of string concatenation                                                                         
let asn2=`Items (${1+1}): $${(2234+443)/100}`;
console.log(asn);
console.log(asn2);


let name=`sai
krishna`;

console.log(name);