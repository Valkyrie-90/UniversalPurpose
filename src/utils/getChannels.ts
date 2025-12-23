import { Message } from "discord.js";

function getReportChannel(message: Message): string | undefined {
    switch (message.guild?.id) {
        // Elle's Server
        case "1227353105960800408":
            return "1310649278871502849";
        // The Galaxy
        case "221890212106600448":
            return "1373065400593678356";
        // UP Testing Guild
        case "1137515299193761882":
            return "1409227814833492032";
        default:
            return undefined;
    }
}

function getChannelsToFilter(message: Message) : string[] | undefined {
    switch (message.guild?.id) {
        // Elle's Server
        case "1227353105960800408":
            return ["1227353105960800411", "1227512766881861675", "1227512433011064903", "1244430759985680505", "1238687411827904642", "1246656930898907176", "1247278184043380836", "1283198650515722240", "1285834659032469505", "1301404035210940467", "1335420843685183510", "1314398802832265256", "1310802450130927707", "1307719710636380173"]
        // The Galaxy
        case "221890212106600448":
            return ["1116370877148311603", "850433879566975037", "1374199229647425699", "1282182407088504853", "764371319512760320", "1302762876712521848", "1379890865983455412", "1303392961203273750", "1323716279957196901", "1330333662381871106", "1372494003664322622"];
        // UP Testing Guild
        case "1137515299193761882":
            return ["1311048769508343889"]
        default:
            return undefined;
    }
}

export { getReportChannel, getChannelsToFilter };