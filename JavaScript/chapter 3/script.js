// let time=1;
// if(time<12)
// {
//     console.log("good morning");
// }
// else
// {
//     console.log("good afternoon");
// }


//switch


// let expr="tomato";

// switch(expr){
//     case 'cashew':
//         console.log("majja maal");
//         break;
//     case 'fruits':
//         console.log("sada maal");
//         break;
//     case 'tomato':
//         console.log("sasta maal");
//         break;
//     default:
//         console.log('we did not found:',{expr});

// }

//cheking the multiples

// let number=prompt("enter a number:");
// if(number%5===0)
// {
// console.log(number," is a multiple of 5");
// }
// else
// {
// console.log(number+" is not a multiple of 5");
// }


// let score=prompt("enter you score i will give grade:");
// if(score<50)
// {
//     console.log(score," is FAIL(F)");
// }
// else if(score>=50 && score<=60)
// {
//     console.log(score," is PASS(D)");
// }
// else if(score>60 && score<=85)
// {
//     console.loh(score," is PASS(C)");
// }
// else if(score>85 && score<95)
// {
//     console.log(score," is PASS(B)");
// }
// else
//     console.log("you are in the list of TOPPERS");


  //---------------OR-------------

// let score=prompt("enter your marks(1-100):");
// let grade;

// if(score<50)
//     grade="F";
// else if(score>=50 && score<=60)
//     grade="D";
// else if(score>60 && score<=85)
//     grade="C";
// else if(score>85 && score<95)
//     grade="B";
// else
//     grade="A";

// console.log("according to your marks, the grade is:",grade);



//------------LOOPS--------------

// for(i=0;i<=4;i++)
// {
//     console.log(i);
//     console.log("DRAGON");
// }

// let sum=0;
// for(let i=1;i<=10;i++)
// {
//     sum=sum+i;
// }
// console.log(sum);


// let i=-1;
// while(i<=10)
// {
//     console.log(i+" Dragon");
//     i++;
// }

// let num=10;
// do{
//   console.log("NTR");
// }
// while(num>29);

//SPECIAL LOOPS--
//1.for-of-loop

// let str="chintu";
// let size=0;
// for(i of str)  //returns  each character(letter) of string means it iterates through str;
// {
//   console.log("i ",i);
//   size++;
// }
// console.log("str size:"+size);

//2. for-in-loop

// const student={
//   name:"saikrishna",
//   age:22,
//   marks:76,
//   result:"pass"
// };

// for(let key in student)
// {
//   console.log("key: ",key ,", value: ",student[key],".");
// }

//printing even numbers

// for(let i=0;i<=100;i++)
// {
//   if(i%2==0)
//     console.log(i);
// }

//guess the gameNumber
// let gameNumber=77;
// let input=prompt("Guess the number between 1-100");

// while(gameNumber!=input)
// {
//   input=prompt("wrong guess! try Again!!");
// }


// alert("congrats!!, you are the winner"+"\nyour guess:"+input+"\ngame number:"+gameNumber);

// //string in js
// let str="bhanu";
// console.log(str[(str.length%2)]);

//templete literals

// let dark={
//   colour:"black",
//   time:"night"
// }

// console.log(`the ${dark.time} colour is ${dark.colour}`);

// console.log("the ",dark.time," colour is ",dark.colour);

// let tl=`the summation of 2+4+1 is: ${4+2+1}`;

// console.log(tl);

//escape characters
//--------->\n,\t

// console.log(`saikrishna badiger\nvishwakarmas@gmail.com`);

// let tr=`saikrishna badiger\tvishwakarmas@gmail.com`;
// console.log(tr);
// console.log(tr.length);
// console.log(tr.substring(0,7));
// //console.log(tr.split(tr.split,40));
// //console.log(tr.indexOf(35));



//methods of string
//1.toUpperCase()
//2.toLowerCase()
//3.trim();
//4.slice(start,end?)
//5.string1.concat(string2) or string1+string2
//6.replace(target, new string);
//7.charAt(index)

let sv=`saikrishna badiger\tvishwakarmas@gmail.com`;
// console.log(sv.toUpperCase());
// console.log(sv.toUpperCase().length);
// console.log(sv.toLowerCase());
// console.log(sv.toLowerCase().length);
// console.log(sv.trim());
// console.log(sv.trim().length);

// console.log(sv.slice(0,11));//(start,end-1)
//console.log(sv.slice(2));//prints upto end of the string
 
// let s1="Devara adiginadante";
// let s2=" seppinadani";
// let s3=", all hail the tiger";
// console.log(s1.concat(s2)+s3); 

// console.log(s1.replace("i","j"));// first (i)found will change 
// console.log(s1.replaceAll("i","j"));// we can replace all i's of the string

// console.log(s2.charAt(1)); 
// console.log(s2[0]='x');//this is not happen bcz its immutable


