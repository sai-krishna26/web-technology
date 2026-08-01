// fullName="Saikrishna Badiger";
// console.log(fullName);

// let pi=3.142;
// let r=4;
// let area=pi*r*r;
// console.log(area);


const student={
    name:"jonsnow",
    age:25,
    movieResult:false,
    gender:'m',
    length:null,
    salary:BigInt("1200000"),  //salary:1200000n
    groupSymbol:Symbol('$')
};

student.age=student.age+1;
console.log(student["age"]);
console.log(student.name);