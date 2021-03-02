main()

async function main(){
    //Is a token selected? if not, error
    if(canvas.tokens.controlled.length == 0 || canvas.tokens.controlled.length > 1){
        ui.notifications.error("Please select a single token");
        return;
    }
    console.log("Tokens: ", canvas.tokens.controlled)
    let actor = canvas.tokens.controlled[0].actor;
    
    //Does the token have some nanodoc? else error
    console.log("Actor: ", actor);
    let nanodoc = actor.items.find(item => item.data.name == "Nanodoc");
    console.log("Nanodoc: ", nanodoc);
    if(nanodoc == null || nanodoc == undefined){
        ui.notifications.error("No Nanodoc left!");
        return;
    }
    
    //if token is max health do nothing
    if(actor.data.data.attributes.hp.value == actor.data.data.attributes.hp.max){
        ui.notifications.error("HP already at max!");
        return;
    }
    
    //if not max health subtract 1 nonodoc from player inventory
    await nanodoc.update({"data.quantity": nanodoc.data.data.quantity - 1});
    if(nanodoc.data.data.quantity < 1){
        nanodoc.delete();
    }
    console.log("Nanodoc: ", nanodoc);
        
    //Increase token health by 2d6 hp
    //Check if new health is greater than max health -> new health to max
    let hpRoll = new Roll('2d6').roll();
    console.log(hpRoll.results[0]);
    console.log(actor.data.data.attributes.hp.value);
    let newHp = actor.data.data.attributes.hp.value + hpRoll.results[0];
    console.log(newHp);
    if(newHp > actor.data.data.attributes.hp.max){
        newHp = actor.data.data.attributes.hp.max;
    }

    //Update the actor health
    await actor.update({"data.attributes.hp.value": newHp});
    ui.notifications.info(`${actor.data.name} took 1 Nanodoc and gained ${hpRoll.results[0]} HP`);
}