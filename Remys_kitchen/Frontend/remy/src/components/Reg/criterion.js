export function criterionU(){
    var div=document.getElementsByClassName('criteria')[0];
    div.innerHTML=`<h3>Kritérium</h3>
                <div class='listdiv'>
                    <ul class='list'>
                    <li class='listitem'>A felhasználónévnek legalább 3 karakternek kell lennie</li>
                    </ul>
                </div>`;

}


export const criterionE=(() => {
    var div=document.getElementsByClassName('criteria')[0];
    div.innerHTML=`<h3>Kritérium</h3>
                    <div class='listdiv'>
                        <ul class='list'>
                            <li class='listitem'>Helyes E-mail cím formátum</li>
                        </ul>
                    </div>`;
})

export const criterionP=(() => {
    var div=document.getElementsByClassName('criteria')[0];
    div.innerHTML=`<h3>Kritériumok</h3>
                    <div class='listdiv'>
                        <ul class='list'>
                            <li class='listitem'>Legalább 8 karakter hosszú</li>
                            <li class='listitem'>Legalább egy kisbetűt tartalmaz</li>
                            <li class='listitem'>Legalább egy nagybetűt tartalmaz</li>
                            <li class='listitem'>Legalább egy számot tartalmaz</li>
                            <li class='listitem'>Legalább egy speciális karaktert tartalmaz</li>
                        </ul>
                    </div>`;
})

export const Delete=(() => {
    var div=document.getElementsByClassName('criteria')[0];
    div.innerHTML="";
})
 


