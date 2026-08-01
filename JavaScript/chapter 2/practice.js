//operators
let operator=
{
a:11,
b:2
}

let {a, b}=operator;
//or  console.log("a = "operator.a ,"& b = ",operator.b); 
//bianry operations
console.log("a = ",a ,"& b = ",b);
console.log("a+b = ",a+b);
console.log("a-b = ",a-b);
console.log("a*b = ",a*b);
console.log("a/b = ",a/b);
console.log("a%b = ",a%b);
console.log("a^b = ",a**b);

//unary operations
console.log("a++ = ",++a);
console.log("b-- = ",--b);


//comparison operations
let x=7;
let y="7";
console.log("7==str(7)",x==y);
//strict comparison
console.log("7===str(7)",x===y);

//conditional operators

let p=0;
let q=10;
let cond1=p<q;
let cond2=q<p;
console.log("cond1 && cond2:",cond1 && cond2);

//ternary operator
let d=20;
let result=d>18? "adult":"child";
console.log(result);