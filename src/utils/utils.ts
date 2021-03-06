
/**
 * 在绘制控制台信息时使用的颜色
 */
 export enum ColorEnum{
    red ='#ef9a9a',
    green = '#6b9955',
    yellow = '#c5c599',
    blue = '#8dc5e3'
}

export class Utils{

    /**
     * 把 obj2 的原型合并到 obj1 的原型上
     * 如果原型的键以 Getter 结尾，则将会把其挂载为 getter 属性
     * @param obj1 要挂载到的对象
     * @param obj2 要进行挂载的对象
     */
    static assignPrototype(obj1: {[key: string]: any}, obj2: {[key: string]: any}) {
        Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
            if (key.includes('Getter')) {
                Object.defineProperty(obj1.prototype, key.split('Getter')[0], {
                    get: obj2.prototype[key],
                    enumerable: false,
                    configurable: true
                })
            }
            else obj1.prototype[key] = obj2.prototype[key]
        })
    }


    /**
     * 给指定文本添加颜色
     *
     * @param content 要添加颜色的文本
     * @param colorName 要添加的颜色常量字符串
     * @param bolder 是否加粗
     */
    static colorful(content: string, bolder: boolean = false,colorName?:ColorEnum ): string {
        const colorStyle = colorName ? `color: ${colorName};` : ''
        const bolderStyle = bolder ? 'font-weight: bolder;' : ''

        return `<text style="${[ colorStyle, bolderStyle ].join(' ')}">${content}</text>`
    }

    /**
     * 全局日志
     *
     * @param content 日志内容
     * @param prefixes 前缀中包含的内容
     * @param color 日志前缀颜色
     * @param notify 是否发送邮件
     */
    static log(content: string, prefixes: string[] = [], notify: boolean = false, color?: ColorEnum): OK {
        // 有前缀就组装在一起
        let prefix = prefixes.length > 0 ? `【${prefixes.join(' ')}】 ` : ''
        // 指定了颜色
        prefix = this.colorful(prefix, true,color)

        const logContent = `${prefix}${content}`
        console.log(logContent)
        // 转发到邮箱
        if (notify) Game.notify(logContent)

        return OK
    }

}
