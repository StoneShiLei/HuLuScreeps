import BaseTransporterTask from "./baseTransporterTask";


export default class FillTowerTask extends BaseTransporterTask{
    fillId:Id<StructureTower>

    constructor(fillId:Id<StructureTower>,priority?:number,staffCount?:number){
        super("fillTower",priority,staffCount)
        this.fillId = fillId
    }
}
