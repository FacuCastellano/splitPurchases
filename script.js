const inputPart =  document.getElementById('inputPart')
const btnPart =document.getElementById('btn-inputPart')
const partContainer = document.getElementById('partContainer')
const persBalanceContainer = document.getElementById('personal-balance-container')
const btnPurch = document.getElementById('btn-add-purchase')
const pAP = document.getElementById('pAP') // este es el contenedor de los nombres que salen arriba para distribuir los gastos (arriba de los cuadros de colores)
const pWPoptions = document.getElementById('pWPoptions')
const participants = {}
let p = 0 //esta constante es para poder darle valores distintos a los ID de las distitnas cosas a lso distitnso participantes.
let g = 0 // esta constante es para poder darle valores distintos a los ID de los gastos y los tick


// disparo la funcion si se toca enter y si el elemento activo es el input para agregar participante.
window.addEventListener('keydown',(e)=>{  /*este evento keydown, se dispara cuando cualquier tecla del teclado se toca, y devuelve un codigo unico segun cada tecla(no importa si es una mayuscula o una minuscula el codigo de "keydown" es unico por tecla.) */
    if ((e.code === 'Enter' || e.code === 'NumpadEnter') && document.activeElement.id === 'inputPart'  ){  //entro con el enter grande o del teclado.
        addParticipant() 
    } 
})

btnPart.addEventListener('click', addParticipant)// tmb disparo la funcion si tocan el boton para agregar

btnPurch.addEventListener('click',addPurchase)






///////////// Aca voy creando todas las funciones que necesito/////////////////

///////////Aca van las funcion es de agregar particiapantes/////////////////

// creo la funcion para agregar un nuevo participante-
function addParticipant(){
    inputPart.value = inputPart.value.trim() // le saco los espacios en blanco atras y adelante.
    
    if (inputPart.value !== ''){
        const div = document.createElement('div')
        div.id = `participant-p${p}`
        div.classList.add('participant')
        div.innerHTML = `<span>${inputPart.value}</span><i class="fas fa-times delete-icon"></i>`
        const deleteBtn = div.children['1'] //.children devuelve un objeto con los hijos de elemento al q se aplica.. las claves son numeros(segun el orden correlativo de cada hijo en el HTML) y el valor el propio hijo.
        deleteBtn.addEventListener('click',(e)=>{   //aca agrego la funcion almacenada en el btn-X de cada participante para borrarlo.
            deleteParticipant(e.target.parentElement) 
        }) 

        partContainer.appendChild(div)
    
        const div2 = document.createElement('div')  //estos nombres se creaan en el encabezado de la distribucion de gastos. 
        div2.id = `headName-p${p}`
        div2.innerText = `${inputPart.value}`
        pAP.appendChild(div2)

        const newOptionpWP = document.createElement('option') // aca creo las opciones de quien pago, cuando tenga que cargar un gasto.
        newOptionpWP.id =`option-p${p}`
        newOptionpWP.innerText = `${inputPart.value}`
        pWPoptions.appendChild(newOptionpWP)

        participants[inputPart.value] = {idNumber: p, name:inputPart.value, personalBalance:{"mustPay":0, "payedDone":0,"Balance":0}}   // agrego el particpante acual al objetro "participants"        
        crearCasilleroBlanco(Object.keys(participants).length) // Object.keys(MiObjeto), nos devuelve un array con las keys de nuestro objeto.
        p ++ //aumneto el valor de para que el prox participante tenga otro valor.
        inputPart.value = ''
    }else {
        console.log('no se puede cargar una string vacio.')
    }
}


//aca creo la funcion que me tiene q crear los casilleros en blanco en la primera linea para despues poder tickiarlos y assignar los gastos.

function crearCasilleroBlanco(n){
    const divMother = document.getElementById("purchase-afect-color-input")
    const whiteTick = document.createElement('div')
    whiteTick.id = `tick-p${p}`
    whiteTick.classList.add(`tick-p${p}`,'genericTick','square')
    whiteTick.innerHTML = `<i class="fa fa-check"></i>`
    whiteTick.addEventListener('click', () => { whiteTick.classList.toggle("activate")} )  //el que dispara el click es el 
    divMother.appendChild(whiteTick)

}

//aca creo la funcion para eliminar los particiapantes 
function deleteParticipant(part){
    const partToDelete = part
    const partIdNumber = getIdNumber(part.innerText)
    partToDelete.remove()            // esto solo lo remueve de la lista de partecitipantes principal, falta removerlo de otros lados. (Igualmente aunque lo saque de la lista lo sigo teniendo almacenado en esta variable.)
    document.getElementById(`headName-p${partIdNumber}`).remove() // borro el nombre del titulo de la lista para tickiar
    document.getElementById(`option-p${partIdNumber}`).remove() //lo borro de las opciones de quien pago.
    deleteParcipantPurchases(partIdNumber)  // borro los gastos del participante eliminado
    deleteParticipantPeopleAfectedByPurchases(partIdNumber) //borro la columna de casilleros del participante eliminado
    delete participants[part.innerText] //aca elimino el participante del objeto participants.
    GeneratePersonalBalance()
    
}

//defino la funcion que me da el IdNumber de cada participante, segun su nombre.. despues borrar todos los elementos de ese IdNumber
function getIdNumber(name){
    const idNumber = participants[name]["idNumber"]
    return idNumber

}

///////////Aca van las funcion es de agregar Gastos////////////////

function addPurchase(){
    const container = document.getElementById('purchase-container')
    const concept = document.getElementById('inpPurc-concept').value
    const amount = document.getElementById('inpPurc-amount').value
    const option = document.getElementById('pWPoptions').value
    let pwdIDNumber =  getIdNumber(option)
    console.log(pwdIDNumber)
    const ticks = createTicksCliked()
    const div = document.createElement('div')
    div.classList.add("purchase", `purchase-p${pwdIDNumber}`)
    div.innerHTML = `
        
        <div class="purchase-concept" id="pc-g${g}">${concept}</div>
        <div class="purchase-amount" id="pa-g${g}">${amount}</div>
        <div class="purchase-pWP" id="pWP-p${pwdIDNumber}-g${g}">${option}</div>
        <div class="purchase-afect-color" id="pAC-g${g}">${ticks}</div>
        
    `
    container.appendChild(div)
    agregarToggle()// le agrego el toggle("activate") a todos los nuevos clicks
    setInputsToZero()
    GeneratePersonalBalance()
    g++
}


// creo la funcion para crear los ticksnuevos a agregar.
function createTicksCliked(){
    const previousTicked = ticksClicked()
    let ownInnerHTML = ""
    for(let i = 0; i < previousTicked.length; i++)  {
        ownInnerHTML += `<div id="${previousTicked[i][0]}-g${g}" class=" ${previousTicked[i][0]} particularTick-g${g} square ${(previousTicked[i][1] ? 'activate' : '')}"><i class="fa fa-check"></i></div>`
    }
    return ownInnerHTML
}

//creo una funcion para ver que ticks se clickearon
function ticksClicked(){
    const ticksAll = Array.from(document.getElementsByClassName('genericTick')) // tengo que convertirlo en un array, para poder usar el forEach
    const result = []
    ticksAll.forEach(tick => {
        const element = [tick.id, tick.classList.contains('activate')]
        result.push(element)  //el push en js es el append de python.
    });
    return result
}

//agregar toggle para ticker/destickear las personas afectadas por los gastos
function agregarToggle(){
    const elements = Array.from(document.getElementsByClassName(`particularTick-g${g}`)) //tuve que agrupar los ticks segun el gasto, pq sino el eventlistner se ejecutaba sobre todos los elementos mas de una vez.. y cuando se "agregaba" a un tick que ya tenia el eventlistener, este se salia.. es decir funcionaba como un toggle.
    elements.forEach(element => element.addEventListener('click', () => {
        element.classList.toggle('activate')
        GeneratePersonalBalance() // lo pongo aca para que se actualice solo cuando voy tickeando/destickeando
    }))
}
function setInputsToZero(){
    document.getElementById('inpPurc-concept').value = ''
    document.getElementById('inpPurc-amount').value = ''
    document.getElementById('pWPoptions').value = ''
    const genericTicks = Array.from(document.getElementsByClassName('genericTick'))
    genericTicks.forEach(tick => {
        if(tick.classList.contains('activate')){
            tick.classList.remove('activate')
        }
    })

}
// cuando elimino un participante tengo que eliminar todos los gastos que hizo este, lo hago con esta funcion.
function deleteParcipantPurchases(partIdNumber){
    const purchases = Array.from(document.getElementsByClassName(`purchase-p${partIdNumber}`))
    purchases.forEach(purchase => purchase.remove()) 
}
// cuando elimino un participante tengo que eliminarlo de la division de todos los gastos.
function deleteParticipantPeopleAfectedByPurchases(partIdNumber){
    const columnTicks = Array.from(document.getElementsByClassName(`tick-p${partIdNumber}`))
    columnTicks.forEach(tick => { tick.remove()});
}

function upGradePersonalBalance(){
    //Falta setear a 0, todos los MustPAy y los payedDOne pq esto los cuenta a todos de 0.. y sino se van a ir sumando y sumando con cada actualizacion.
    personalBalaceToZero()
    const purchases = Array.from(document.getElementsByClassName('purchase')).filter(element=> !(element.classList.contains('purchase-main'))) //creo un array de los elementos purchase, pero saco el elemento purchase-main (q es el de los input.)
    const participantsKey = Object.keys(participants)
    
    purchases.forEach(purchase => {
        const concept = purchase.childNodes[1].innerText //esto en realidad no lo uso para nada.. pero bueno. 
        const amount = +purchase.childNodes[3].innerText //con el + trasnformo el string a numero.
        const pWP = purchase.childNodes[5].innerText //aca obtengo el nombre de quien pago.. que es la llave que uso en el objeto participants, para sumarle el gasto.
        const ticks = Array.from(purchase.childNodes[7].childNodes)
        
        participants[pWP]['personalBalance']['payedDone'] += amount //esto va sumando los gastos.. 
        
        let purchaseConsumer = 0 //estos dos for lo que hacen es calcular el valor de "mustPay" de cada participante.
        for(let i=0;i<ticks.length;i++){ 
            if(ticks[i].classList.contains('activate')){
                purchaseConsumer++               
            }
        }
        const amountEach = amount/purchaseConsumer
        for(let i=0;i<ticks.length;i++){ //no puedo unir este for con el de arriba, pq necesito el valor definitivo del purchaseConsumer.
            if(ticks[i].classList.contains('activate')){
                const partcipantIDNumber = +ticks[i].id[6] //ATENCIONN TENGO ESTO VA FUNCIONAR HASTA 9 PARTICIPANTES:.. TENGO QUE VER DE SACAR el numero si tengo mas de 9 participantes.. 
                for(let j = 0; j<participantsKey.length;j++ ){
                    if( partcipantIDNumber === participants[participantsKey[j]]['idNumber'] )
                        participants[participantsKey[j]]['personalBalance']['mustPay']+= amountEach
                }
            }
        }
        
    })
    personalBalanceBalance()  //Aca calculo el "balance" de cada uno, ya despues de solo falta presentar los resultados en pantalla.
}

// creo una funcion para setear a 0 todas las propiedades del personalBalace
function personalBalaceToZero(){
    const participantskeys = Object.keys(participants)
    for(let i = 0; i < participantskeys.length; i++){
        participants[participantskeys[i]]['personalBalance']['mustPay'] = 0
        participants[participantskeys[i]]['personalBalance']['payedDone'] = 0
    }
}
function personalBalanceBalance(){ // calculado el "payedDone" y el "MustPay", calculo el balance personal. .
    const participantskeys = Object.keys(participants)
    for(let i = 0; i < participantskeys.length; i++){
        participants[participantskeys[i]]['personalBalance']['Balance']  = participants[participantskeys[i]]['personalBalance']['payedDone'] - participants[participantskeys[i]]['personalBalance']['mustPay']
    }
}

//aca creo la funcion general del personal balances, la que va a ser llamada para actualizar todo, tanto el calculo como los casilleros. 
function GeneratePersonalBalance(){
    persBalanceContainer.innerHTML = `
        <div class="head">
            <h2> Personal Balance </h2>
        </div>
        <div class="personal-balance-title">
            <div>Participant</div>
            <div>Must Pay</div>
            <div>Payed Done</div>
            <div>Balance</div>
        </div>
    `
    upGradePersonalBalance()
    const participantskeys = Object.keys(participants)
    for(let i = 0; i < participantskeys.length; i++){
        const name= participants[participantskeys[i]]['name']  
        const mustPay = Math.round(participants[participantskeys[i]]['personalBalance']['mustPay'],2)
        const payDone = Math.round(participants[participantskeys[i]]['personalBalance']['payedDone'],2)
        const balance =  Math.round(participants[participantskeys[i]]['personalBalance']['Balance'],2)
        const div = document.createElement('div')
        div.classList.add('personal-balance-participant')
        div.innerHTML = `
            <div>${name}</div>
            <div>${mustPay}</div>
            <div>${payDone}</div>
            <div>${ balance > 0 ? `Saldo a favor $${balance}`: balance < 0 ? `Adeuda $${-balance}` : 'Saldado'  }</div>
        `
        persBalanceContainer.appendChild(div)
    }
}