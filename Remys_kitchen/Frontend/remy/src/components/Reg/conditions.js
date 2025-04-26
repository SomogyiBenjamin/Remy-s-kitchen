export function checkRegistration(){

    var voltHiba=false;

    // Felhasználónév ellenőrzése
    const userNameReg=/^.{3,}$/ //Legalább 3 karakter
    const fnevField=document.getElementById('fname').value
    const fieldU=document.getElementById('fname');

    if (!userNameReg.test(fnevField)){
        fieldU.classList.remove('error');

        void fieldU.offsetWidth;

        fieldU.classList.add('error');
        voltHiba=true;
    }

    // E-mail ellenőrzése

    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email=document.getElementById('email').value;
    const fieldE=document.getElementById('email');
    
    if (!emailReg.test(email)) {
        fieldE.classList.remove('error');

        void fieldE.offsetWidth;

        fieldE.classList.add('error');
        voltHiba=true;
    }

    // // Jelszó ellenőrzése

    // // Legalább 8 karakter hosszú.
    // // Legalább egy kisbetűt tartalmaz.
    // // Legalább egy nagybetűt tartalmaz.
    // // Legalább egy számot tartalmaz.
    // // Legalább egy speciális karaktert tartalmaz (például: @, #, $, % stb.).


    // // ^(?=.*[a-z]) - Legalább egy kisbetűs karaktert kell tartalmaznia.
    // // (?=.*[A-Z]) - Legalább egy nagybetűs karaktert kell tartalmaznia.
    // // (?=.*\d) - Legalább egy számot kell tartalmaznia.
    // // (?=.*[@$!%*?&]) - Legalább egy speciális karaktert kell tartalmaznia a megadott karakterek közül (@$!%*?&).
    // // [A-Za-z\d@$!%*?&]{8,}$ - A jelszó hossza legalább 8 karakter, és csak az engedélyezett karaktereket tartalmazhatja.



    // // Teszt jelszó : cia1TS@2

    const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const password=document.getElementById('password').value;
    const fieldP=document.getElementById('password');

    if (!passwordReg.test(password)) {
        fieldP.classList.remove('error');

        void fieldP.offsetWidth;

        fieldP.classList.add('error');
        voltHiba=true;
    }

    // // Jelszó újboli ellenőrzése

    const rePassword=document.getElementById('rePassword').value;
    const rePasswordField=document.getElementById('rePassword');

    if (!passwordReg.test(rePassword) || rePassword!==password) {

        rePasswordField.classList.remove('error');

        void rePasswordField.offsetWidth;

        rePasswordField.classList.add('error');
        voltHiba=true;
    }

    return voltHiba;


}

export function userNameWatcher(){
    const userNameReg=/^.{3,}$/

    const userName=document.getElementById('fname').value

    const firstCondition=document.getElementsByClassName('listitem')[0];

    firstCondition.classList.remove("watchingCorrect", "watchingNeutral");


    if (userNameReg.test(userName)===true){ //Ha megfelel a kritériumnak
        firstCondition.classList.remove('watchingCorrect');

        void firstCondition.offsetWidth;

        firstCondition.classList.add('watchingCorrect');
    }
    else{
        firstCondition.classList.remove('watchingNeutral');

        void firstCondition.offsetWidth;

        firstCondition.classList.add('watchingNeutral');
    }

}



export function emailWatcher(){
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const email=document.getElementById('email').value

    const firstCondition=document.getElementsByClassName('listitem')[0];

    firstCondition.classList.remove("watchingCorrect", "watchingNeutral");


    if (emailReg.test(email)===true){ //Ha megfelel a kritériumnak
        firstCondition.classList.remove('watchingCorrect');

        void firstCondition.offsetWidth;

        firstCondition.classList.add('watchingCorrect');
    }
    else{
        firstCondition.classList.remove('watchingNeutral');

        void firstCondition.offsetWidth;

        firstCondition.classList.add('watchingNeutral');
    }

}


export function passwordWatcher(){

    const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const smallCharacterReg=/^(?=.*[a-z])/; //Kisbetű

    const uppercaseCharacterReg=/^(?=.*[A-Z])/; //Nagybetű

    const specialCharacterReg=/(?=.*[@$!%*?&])/; //Speciális karakter

    const oneNumberReg=/^(?=.*\d)/; //Egy szám


    const conditonList1 = document.getElementsByClassName('bubblelistli')[0];

    const conditonList2 = document.getElementsByClassName('bubblelistli')[1];

    const conditonList3 = document.getElementsByClassName('bubblelistli')[2];

    const conditonList4 = document.getElementsByClassName('bubblelistli')[3];


    const conditonListSmallScreen1 = document.getElementsByClassName('SmallSizeCritPlaceLi')[0];

    const conditonListSmallScreen2 = document.getElementsByClassName('SmallSizeCritPlaceLi')[1];

    const conditonListSmallScreen3 = document.getElementsByClassName('SmallSizeCritPlaceLi')[2];

    const conditonListSmallScreen4 = document.getElementsByClassName('SmallSizeCritPlaceLi')[3];



    const password=document.getElementById('password').value

    //Minimum 8 karakter
    conditonList1.classList.remove("bubblelistliCorrect", "bubblelistliIncorrect")
    
    //Kisbetű és nagybetű
    conditonList2.classList.remove("bubblelistliCorrect", "bubblelistliIncorrect")

    //Egy szám
    conditonList3.classList.remove("bubblelistliCorrect", "bubblelistliIncorrect")  

    //Speciális karakter
    conditonList4.classList.remove("bubblelistliCorrect", "bubblelistliIncorrect") 
    
    
    //Small srceen: Minimum 8 karakter
    conditonListSmallScreen1.classList.remove("bubblelistliCorrect", "bubblelistliIncorrect")

    //Small srceen: Kisbetű és nagybetű
    conditonListSmallScreen2.classList.remove("bubblelistliCorrect", "bubblelistliIncorrect")

    //Small srceen: Egy szám
    conditonListSmallScreen3.classList.remove("bubblelistliCorrect", "bubblelistliIncorrect")  

    //Small srceen: Speciális karakter
    conditonListSmallScreen4.classList.remove("bubblelistliCorrect", "bubblelistliIncorrect")  

    
    
    if(password.length<8){ //Ha nincs beírva ajelszó mezőbe semmi
        conditonList1.classList.remove('bubblelistliIncorrect');

        void conditonList1.offsetWidth;

        conditonList1.classList.add('bubblelistliIncorrect');

        //Small screen ↓

        conditonListSmallScreen1.classList.remove('bubblelistliIncorrect');

        void conditonListSmallScreen1.offsetWidth;

        conditonListSmallScreen1.classList.add('bubblelistliIncorrect');
    }

    else{
        conditonList1.classList.remove('bubblelistliIncorrect');

        void conditonList1.offsetWidth;

        conditonList1.classList.add('bubblelistliCorrect');

        //Small screen ↓

        conditonListSmallScreen1.classList.remove('bubblelistliIncorrect');

        void conditonListSmallScreen1.offsetWidth;

        conditonListSmallScreen1.classList.add('bubblelistliCorrect');
    }

    if (!smallCharacterReg.test(password) || !uppercaseCharacterReg.test(password)) { //Ha nem felel a kritériumnak

        conditonList2.classList.remove('bubblelistliIncorrect');

        void conditonList2.offsetWidth;

        conditonList2.classList.add('bubblelistliIncorrect');

        //Small screen ↓

        conditonListSmallScreen2.classList.remove('bubblelistliIncorrect');

        void conditonListSmallScreen2.offsetWidth;

        conditonListSmallScreen2.classList.add('bubblelistliIncorrect');
    }
    else{
        conditonList2.classList.remove('bubblelistliIncorrect');

        void conditonList2.offsetWidth;

        conditonList2.classList.add('bubblelistliCorrect');

        //Small screen ↓

        conditonListSmallScreen2.classList.remove('bubblelistliIncorrect');

        void conditonListSmallScreen2.offsetWidth;

        conditonListSmallScreen2.classList.add('bubblelistliCorrect');
    }



    if (!oneNumberReg.test(password)) { //Ha nem felel a kritériumnak

        conditonList3.classList.remove('bubblelistliIncorrect');

        void conditonList3.offsetWidth;

        conditonList3.classList.add('bubblelistliIncorrect');

        //Small screen ↓

        conditonListSmallScreen3.classList.remove('bubblelistliIncorrect');

        void conditonListSmallScreen3.offsetWidth;

        conditonListSmallScreen3.classList.add('bubblelistliIncorrect');
    }
    else{
        conditonList3.classList.remove('bubblelistliIncorrect');

        void conditonList3.offsetWidth;

        conditonList3.classList.add('bubblelistliCorrect');

        //Small screen ↓

        conditonListSmallScreen3.classList.remove('bubblelistliIncorrect');

        void conditonListSmallScreen3.offsetWidth;

        conditonListSmallScreen3.classList.add('bubblelistliCorrect');
    }


    if (!specialCharacterReg.test(password)) { //Ha nem felel a kritériumnak

        conditonList4.classList.remove('bubblelistliIncorrect');

        void conditonList4.offsetWidth;

        conditonList4.classList.add('bubblelistliIncorrect');

        //Small screen ↓

        conditonListSmallScreen4.classList.remove('bubblelistliIncorrect');

        void conditonListSmallScreen4.offsetWidth;

        conditonListSmallScreen4.classList.add('bubblelistliIncorrect');
    }
    else{

        conditonList4.classList.remove('bubblelistliIncorrect');

        void conditonList4.offsetWidth;

        conditonList4.classList.add('bubblelistliCorrect');


        conditonListSmallScreen4.classList.remove('bubblelistliIncorrect');

        void conditonListSmallScreen4.offsetWidth;

        conditonListSmallScreen4.classList.add('bubblelistliCorrect');
    }
}

export function passwordWatcherForProfile(){

    const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const smallCharacterReg=/^(?=.*[a-z])/; //Kisbetű

    const uppercaseCharacterReg=/^(?=.*[A-Z])/; //Nagybetű

    const specialCharacterReg=/(?=.*[@$!%*?&])/; //Speciális karakter

    const oneNumberReg=/^(?=.*\d)/; //Egy szám


    const conditonList1 = document.getElementsByClassName('PasswordModCritsLi')[0];

    const conditonList2 = document.getElementsByClassName('PasswordModCritsLi')[1];

    const conditonList3 = document.getElementsByClassName('PasswordModCritsLi')[2];

    const conditonList4 = document.getElementsByClassName('PasswordModCritsLi')[3];


    const password=document.getElementById('password').value

    //Minimum 8 karakter
    conditonList1.classList.remove("PasswordModCritsLiCorrect", "PasswordModCritsLiIncorrect")
    
    //Kisbetű és nagybetű
    conditonList2.classList.remove("PasswordModCritsLiCorrect", "PasswordModCritsLiIncorrect")

    //Egy szám
    conditonList3.classList.remove("PasswordModCritsLiCorrect", "PasswordModCritsLiIncorrect")  

    //Speciális karakter
    conditonList4.classList.remove("PasswordModCritsLiCorrect", "PasswordModCritsLiIncorrect") 
        

    if(password.length<8){ //Ha nincs beírva ajelszó mezőbe semmi
        conditonList1.classList.remove('PasswordModCritsLiIncorrect');

        void conditonList1.offsetWidth;

        conditonList1.classList.add('PasswordModCritsLiIncorrect');
    }
    else{
        conditonList1.classList.remove('PasswordModCritsLiIncorrect');

        void conditonList1.offsetWidth;

        conditonList1.classList.add('PasswordModCritsLiCorrect');
    }

    if (!smallCharacterReg.test(password) || !uppercaseCharacterReg.test(password)) { //Ha nem felel a kritériumnak

        conditonList2.classList.remove('PasswordModCritsLiIncorrect');

        void conditonList2.offsetWidth;

        conditonList2.classList.add('PasswordModCritsLiIncorrect');

    }
    else{
        conditonList2.classList.remove('PasswordModCritsLiIncorrect');

        void conditonList2.offsetWidth;

        conditonList2.classList.add('PasswordModCritsLiCorrect');

    }



    if (!oneNumberReg.test(password)) { //Ha nem felel a kritériumnak

        conditonList3.classList.remove('PasswordModCritsLiIncorrect');

        void conditonList3.offsetWidth;

        conditonList3.classList.add('PasswordModCritsLiIncorrect');
    }
    else{
        conditonList3.classList.remove('PasswordModCritsLiIncorrect');

        void conditonList3.offsetWidth;

        conditonList3.classList.add('PasswordModCritsLiCorrect');
    }


    if (!specialCharacterReg.test(password)) { //Ha nem felel a kritériumnak

        conditonList4.classList.remove('PasswordModCritsLiIncorrect');

        void conditonList4.offsetWidth;

        conditonList4.classList.add('PasswordModCritsLiIncorrect');

    }
    else{

        conditonList4.classList.remove('PasswordModCritsLiIncorrect');

        void conditonList4.offsetWidth;

        conditonList4.classList.add('PasswordModCritsLiCorrect');

    }
}
