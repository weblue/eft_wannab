const fs = require('fs');
const hash = require('json-hash')

let item_json = {};
let id_trades = {};
let quests = {
    "prapor": {

    },
    "therapist": {

    },
    "skier": {

    },
    "peacekeeper": {

    },
    "mechanic": {

    },
    "ragman": {

    },
    "jaeger": {

    }
};
let id_quests = {};
let trader_trades = {
    prapor: {
        1: {},
        2: {},
        3: {},
        4: {}
    },
    therapist: {
        1: {},
        2: {},
        3: {},
        4: {}
    },
    mechanic: {
        1: {},
        2: {},
        3: {},
        4: {}
    },
    jaeger: {
        1: {},
        2: {},
        3: {},
        4: {}
    },
    peacekeeper: {
        1: {},
        2: {},
        3: {},
        4: {}
    },
    ragman: {
        1: {},
        2: {},
        3: {},
        4: {}
    },
    skier: {
        1: {},
        2: {},
        3: {},
        4: {}
    },
    booze_generator: {
        1: {}
    },
    intelligence_center: {
        2: {},
        3: {}
    },
    lavatory: {
        1: {},
        2: {},
        3: {}
    },
    medstation: {
        1: {},
        2: {},
        3: {}
    },
    nutrition_unit: {
        1: {},
        2: {},
        3: {}
    },
    workbench: {
        1: {},
        2: {},
        3: {}
    }
};

let barterItemsReady = false;
let lootReady = false;
let bartersReady = false;
let craftsReady = false;
let craftItemsReady = false;
let raidItemsReady = false;

function readItems() {
    //After running this, save /Barter_trades to get images and remove parens from filenames
    fs.readFile('./in/Barter_trades.xml', 'utf8', (err, data) => {
        let reg_name = /\[\[File\:(.*?)\|.*?\|link\=(.*?)]]/g;
        var result_name;

        while ((result_name = reg_name.exec(data))) {
            let key = result_name[2].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_");
            item_json[key] =
            {
                name: result_name[2],
                img: result_name[1].replace(/ /g, '_').replace(/[\(\)]/g, '')
            };
        }

        barterItemsReady = true;
        writeItems();
    });

    //After running this, save /Loot to get images and remove parens from filenames
    fs.readFile('./in/Loot.xml', 'utf8', (err, data) => {
        let reg_name = /\[\[File\:(.*?)\|.*?\|link\=(.*?)]]/g;
        var result_name;

        while ((result_name = reg_name.exec(data))) {
            let key = result_name[2].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_");
            item_json[key] =
            {
                name: result_name[2],
                img: result_name[1].replace(/ /g, '_').replace(/[\(\)]/g, '')
            };
        }

        lootReady = true;
        writeItems();
    });

    fs.readFile('./in/Crafts.xml', 'utf8', (err, data) => {
        let reg_name = /\[\[File\:(.*?)\|.*?\|link\=(.*?)]]/g;
        var result_name;

        while ((result_name = reg_name.exec(data))) {
            let key = result_name[2].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_");
            item_json[key] =
            {
                name: result_name[2],
                img: result_name[1].replace(/ /g, '_').replace(/[\(\)]/g, '')
            };
        }

        craftItemsReady = true;
        writeItems();
    });

    fs.readFile('./in/Found_in_raid.xml', 'utf8', (err, data) => {
        let reg_name = /\[\[File\:(.*?)\|frameless]]\n\|\[\[(?:[a-zA-Z (\-0-9,)]*\|)*(.*)]]/g;
        var result_name;

        while ((result_name = reg_name.exec(data))) {
            let key = result_name[2].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_");
            item_json[key] =
            {
                name: result_name[2],
                img: result_name[1].replace(/ /g, '_').replace(/[\(\)]/g, '')
            };
        }

        raidItemsReady = true;
        writeItems();
    });
}

function writeItems() {
    if (barterItemsReady && lootReady && craftItemsReady && raidItemsReady) {
        fs.writeFile('./out/items.json', JSON.stringify(item_json, null, 2), (err) => {
            console.log("Wrote to items.json");

            if (err) throw err;
        });

        readBarters();
        readQuests();
    }
}

function readBarters() {
    fs.readFile('./in/Barter_trades.xml', 'utf8', (err, data) => {
        let reg_item_cost = /\[\[File:.*?\|frameless\|link=(.*?)]] x(\d*).*/g;
        let reg_trader_info = /!\[\[File:.*?&gt; *?\[\[[A-Z].*?\|([A-Z].*?) LL(\d)]]/g;
        let reg_item_reward = /\[\[([A-Za-z0-9\- .(+)"/,]*)\|*.*]]/g;

        let line_result = [];
        //State counter: 0 = before first arrow (cost info), 1 = after first arrow (trader info), 2 = after 2nd arrow (reward info)
        let state = 0;

        let new_data = data.substring(data.indexOf("==List of Trades=="));
        new_data = new_data.substring(new_data.indexOf("![["));

        //Pop the first line
        let next_line = new_data.substring(0, new_data.indexOf("\n"));
        new_data = new_data.substring(new_data.indexOf("\n") + 1);

        //Build array of lines for one trade
        while (next_line) {
            while (!next_line.includes("|-") && !next_line.includes("[[Category:Escape from Tarkov]]")) {
                if (next_line.search(/&gt\;\+&lt/g) != -1) {
                    line_result.push(next_line.substring(0, next_line.search(/&gt\;\+&lt/g)));
                    next_line = next_line.substring(next_line.search(/&gt\;\+&lt/g) + 15);
                } else {
                    line_result.push(next_line);
                    next_line = new_data.substring(0, new_data.indexOf("\n"));
                    new_data = new_data.substring(new_data.indexOf("\n") + 1);
                }
            }

            let obj = {
                cost: [],
                reward: {}
            };

            for (const item of line_result) {
                if (item.includes("→")) {
                    state++;
                } else {
                    //Cost state
                    if (state == 0) {
                        let temp = reg_item_cost.exec(item);
                        obj.cost.push(
                            {
                                "id": temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_"),
                                "count": temp[2]
                            }
                        );

                        //Log any non-existant items
                        if (!(item_json[(temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_"))])) {
                            console.log("Missing " + (temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_")));
                        }
                    } else if (state == 1) { //Trader state
                        let temp = reg_trader_info.exec(item);
                        obj.trader = { "trader": temp[1], "level": temp[2] }
                    } else if (state == 2) { //Reward state
                        //Skip the file line
                        if (!item.includes("![[File") && !item.includes("!|[[File")) {
                            let temp = reg_item_reward.exec(item);
                            obj.reward = {
                                "id": temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_"),
                                "count": 1
                            };

                            //Log any non-existant items
                            if (!(item_json[(temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_"))])) {
                                console.log("Missing " + (temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_")));
                            }

                            state++;
                        }
                    }
                }

                reg_trader_info.lastIndex = 0;
                reg_item_cost.lastIndex = 0;
                reg_item_reward.lastIndex = 0;
                // console.log(item)
            }

            let uuid = "t-" + hash.digest(obj);
            id_trades[uuid] = obj;
            // console.log(obj)
            trader_trades[(obj.trader.trader).toLowerCase()][obj.trader.level][uuid] = { cost: obj.cost, reward: obj.reward };

            state = 0;
            line_result = [];
            if (new_data.includes("\n"))
                next_line = new_data.substring(0, new_data.indexOf("\n"));
            else
                next_line = '';

            new_data = new_data.substring(new_data.indexOf("\n") + 1);
        }
        bartersReady = true;
        writeTrades();
    });

    fs.readFile('./in/Crafts.xml', 'utf8', (err, data) => {
        let reg_item_cost = /\[\[File\:.*?\|.*?\|link\=(.*?)]] x(\d*)/g;
        let reg_trader_info = /!&lt;big&gt;\[\[Hideout#Modules\|(.*?) level (\d)]][&lt;\/big&gt;r]*(\d*[ h ]*.*\d*[ min]*)/g;
        let reg_item_reward = /!\[\[File:.*?\|link=(.*?)]] x(\d)/g;

        let line_result = [];
        let state = 0;

        let new_data = data.substring(data.indexOf("==List of Crafts=="));
        new_data = new_data.substring(new_data.indexOf("![["));

        //Pop the first line
        let next_line = new_data.substring(0, new_data.indexOf("\n"));
        new_data = new_data.substring(new_data.indexOf("\n") + 1);

        //Build array of lines for one craft
        while (next_line) {
            while (!next_line.includes("|-") && !next_line.includes("[[Category:Escape from Tarkov]]")) {
                if (next_line.search(/&gt\;\+&lt/g) != -1) {
                    line_result.push(next_line.substring(0, next_line.search(/&gt\;\+&lt/g)));
                    next_line = next_line.substring(next_line.search(/&gt\;\+&lt/g) + 15);
                } else {
                    line_result.push(next_line);
                    next_line = new_data.substring(0, new_data.indexOf("\n"));
                    new_data = new_data.substring(new_data.indexOf("\n") + 1);
                }
            }

            let obj = {
                cost: [],
                reward: {}
            };

            for (const item of line_result) {
                if (item.includes("→")) {
                    state++;
                } else {
                    //Cost state
                    if (state == 0) {
                        // console.log(item);
                        let temp = reg_item_cost.exec(item);
                        obj.cost.push(
                            {
                                "id": temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_"),
                                "count": +temp[2]
                            }
                        );

                        //Log any non-existant items
                        if (!(item_json[(temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_"))])) {
                            console.log((temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_")));
                        }
                    } else if (state == 1) { //Trader state
                        let temp = reg_trader_info.exec(item);
                        obj.trader = { "trader": temp[1], "level": +temp[2] }

                        let reg_time_to_mins = /(\d*)[ h]*[our]*(\d*)?[ min]*/g;
                        let tempTime = reg_time_to_mins.exec(temp[3]);

                        obj.time = +tempTime[1] * 60 + +tempTime[2];

                        // console.log(obj)

                    } else if (state == 2) { //Reward state
                        let temp = reg_item_reward.exec(item);
                        obj.reward = {
                            "id": temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_"),
                            "count": +temp[2]
                        };

                        //Log any non-existant items
                        if (!(item_json[(temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_"))])) {
                            console.log((temp[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_")));
                        }
                        state++;
                    }
                }
                reg_trader_info.lastIndex = 0;
                reg_item_cost.lastIndex = 0;
                reg_item_reward.lastIndex = 0;
            }

            let uuid = "t-" + hash.digest(obj);
            id_trades[uuid] = obj;
            trader_trades[(obj.trader.trader).toLowerCase().replace(/ /g, '_')][obj.trader.level][uuid] = { cost: obj.cost, reward: obj.reward, time: obj.time };

            state = 0;
            line_result = [];
            if (new_data.includes("\n"))
                next_line = new_data.substring(0, new_data.indexOf("\n"));
            else
                next_line = '';

            new_data = new_data.substring(new_data.indexOf("\n") + 1);


        }

        craftsReady = true;
        writeTrades();
    });
}

function writeTrades() {
    if (bartersReady && craftsReady) {
        fs.writeFile('./out/id_trades.json', JSON.stringify(id_trades, null, 2), (err) => {
            if (err) throw err;

            console.log("wrote id_trades.json")
        });

        fs.writeFile('./out/trades.json', JSON.stringify(trader_trades, null, 2), (err) => {
            if (err) throw err;

            console.log("wrote trades.json")
        });
    }
}

function readQuests() {
    fs.readFile('./in/Found_in_raid.xml', 'utf8', (err, data) => {
        let new_data = data.substring(data.indexOf("!Trader"));
        new_data = new_data.substring(new_data.indexOf("|-"));

        //Pop the first line
        new_data = new_data.substring(new_data.indexOf("\n") + 1);

        let next_obj = new_data.substring(0, new_data.indexOf("|-"));
        new_data = new_data.substring(new_data.indexOf("|-") + 2);

        //Build array of lines for one quest
        while (next_obj) {
            //lol
            let reg_quest_obj = /\|\[\[File:.*?\n\|\[\[.*?[\|]*([a-zA-Z0-9+ \-")(.]*)]]\n.*\n\|[\[\]A-Za-z0-9 \-()\n&;="\/]*\|.*\n\|(\d+)\n\|\[\[([a-zA-Z0-9'"\- ?]*)]]\n\|\[\[.*?\|link=([A-Z][a-z]*)]]/g
            let quest_arr = reg_quest_obj.exec(next_obj);
            // console.log(quest_arr)
            let trader = quest_arr[4].toString().toLowerCase();
            let quest_name_norm = "q-" + quest_arr[3].toString().replace(/['."?]/g, '').replace(/[ -]/g, '_').replace('___', '_').toLowerCase();

            //Ignore collector quest
            if (quest_name_norm != "q-collector") {
                if (quests[trader][quest_name_norm]) {
                    quests[trader][quest_name_norm].cost.push(
                        {
                            id: quest_arr[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_"),
                            count: quest_arr[2]
                        }
                    )
                } else {
                    quests[trader][quest_name_norm] = {
                        name: quest_arr[3],
                        cost: [
                            {
                                id: quest_arr[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_"),
                                count: quest_arr[2]
                            }
                        ]
                    }
                }

                id_quests[quest_name_norm] = {
                    "trader": trader,
                    "name": quest_arr[3],
                    "cost": quests[trader][quest_name_norm].cost
                }

                if (!(item_json[quest_arr[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_")])) {
                    console.log("Missing " + quest_arr[1].toString().toLowerCase().replace(/[- \/]/g, '_').replace(/[".\(\),]/g, '').replace("___", "_").replace("__", "_"));
                }
            }

            if (new_data.includes("|-")) {
                next_obj = new_data.substring(0, new_data.indexOf("|-"));
                new_data = new_data.substring(new_data.indexOf("|-") + 2);
            }
            else if (new_data.includes("|}")) {
                next_obj = new_data.substring(0, new_data.indexOf("|}"));
                new_data = new_data.substring(new_data.indexOf("|}") + 2);
            }
            else {
                next_obj = '';
            }
        }

        writeQuests();
    });
}

function writeQuests() {
    fs.writeFile('./out/id_quests.json', JSON.stringify(id_quests, null, 2), (err) => {
        if (err) throw err;

        console.log("wrote id_quests.json")
    });

    fs.writeFile('./out/quests.json', JSON.stringify(quests, null, 2), (err) => {
        if (err) throw err;

        console.log("wrote quests.json")
    });
}

readItems();