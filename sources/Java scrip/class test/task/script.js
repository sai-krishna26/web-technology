function ValidateForm()
{
    let submitForm=true;
    let nameValue=document.RegestratiionForm.nameValue.value;
    let emailValue=document.RegestratiionForm.emailValue.value;
    let passwordValue=document.RegestratiionForm.passwordValue.value;
    let telValue=document.RegestratiionForm.telValue.value;
    let numberValue=document.RegestratiionForm.numberValue.value;

    if(nameValue.length<3)
    {
        alert('name is too short');
        submitForm=false;
    }

    if(emailValue.length<11)
    {
        alert('email is too short');
        submitForm=false;
    }

    if(passwordValue.length<6)
    {
        alert("password size is too small");
        submitForm=false;
    }
 
    if(telValue.length<10)
    {
        alert('enter a valid mobile number');
        submitForm=false;
    }

    if(numberValue<10 || numberValue>100)
    {
        alert('enter a valid age');
        submitForm=false;
    }

    if(submitForm==true)
    {
        alert('form is submitted')
    }
    return submitForm;

}