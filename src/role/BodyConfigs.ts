
/**
 * 身体部件枚举
 */
type BodyPart = MOVE | WORK | CARRY | ATTACK | RANGED_ATTACK | TOUGH | HEAL | CLAIM

/**
 * bodyPart的简写版本
 */
//  type BodySet = {
//     [BodyPartEnum.Move]?:number,
//     [BodyPartEnum.Work]?:number,
//     [BodyPartEnum.Carry]?:number,
//     [BodyPartEnum.Attack]?:number,
//     [BodyPartEnum.Ranged_Attact]?:number,
//     [BodyPartEnum.Tough]?:number,
//     [BodyPartEnum.Heal]?:number,
//     [BodyPartEnum.Claim]?:number,
// }

export class BodyConfig {
    // bodySet:BodySet

    // constructor(bodySet:BodySet){

    // }

    calcBodyPart(bodySet: Map<BodyPartConstant,number>): BodyPartConstant[] {
        // 把身体配置项拓展成如下形式的二维数组
        // [ [ TOUGH ], [ WORK, WORK ], [ MOVE, MOVE, MOVE ] ]
        const resultArr:string[][] = []
        bodySet.forEach((v,k)=>{
            let partArr = Array<BodyPartConstant>(v).fill(k)
            resultArr.push(partArr)
        })
        // 把二维数组展平
        return [].concat(...resultArr)
    }
}
